'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
require('../play.pokemonshowdown.com/js/battle-field-tooltips.js');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();
const ids = ['blacktestament', 'unboundrefrain', 'vanishingact', 'nullpulse', 'logicpulse', 'solacepulse', 'shockdoctrine', 'coldshoulder', 'solarpledge', 'lunarpledge', 'ancestralwrath', 'steadfaststrike', 'rebelanthem', 'laurellash', 'heavenfall'];

describe('Reborn character move presentation', () => {
	let battle;
	function setup(species = 'Mew') {
		battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
			`|switch|p1a: User|${species}, L100|100/100`, '|switch|p2a: Foe|Mew, L100|100/100']});
		const p = battle.p1.active[0];
		const own = {speciesForme: species, ability: 'No Ability', baseAbility: 'No Ability', item: '', level: 100, hp: 100, maxhp: 100, status: '', moves: [], stats: {atk: 100, spa: 100, def: 100, spd: 100, spe: 100}};
		return {p, own, tips: new BattleTooltips(battle), value: () => new ModifiableValue(battle, p, own)};
	}
	afterEach(() => { battle?.destroy(); battle = null; });
	for (const id of ids) it(id + ' has concise text, search credit, and an animation', () => {
		const move = Dex.moves.get(id); assert(move.exists); assert(move.shortDesc.length <= 90);
		assert(require('../server-data-sync-manifest.json').snapshot.moves[id].signatureCharacters.length);
		const other = new Proxy({}, {get: () => ({anim() {}})});
		const animations = new Function('BattleOtherAnims', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations-moves.js', 'utf8') + '\nreturn BattleMoveAnims;')(other);
		assert.equal(typeof animations[id]?.anim, 'function');
	});
	it('Black Testament shows current user typing and the stronger staged category', () => {
		const {p, tips, value} = setup('Seviper'); p.boosts.atk = 2;
		const [type, category] = tips.getMoveType(Dex.moves.get('blacktestament'), value());
		assert.equal(type, 'Poison'); assert.equal(category, 'Physical');
	});
	it('Heavenfall shows the combined New World power, accuracy and reduced drop', () => {
		const {p, own, tips, value} = setup(); battle.pseudoWeather = [['New World Terrain', 0, 0]];
		const move = Dex.moves.get('heavenfall');
		const preview = BattleFieldTooltips.preview(battle, move, p, own, battle.p2.active[0]);
		assert.equal(preview.result.factor, 3); assert.equal(preview.result.move.accuracy, true);
		assert.deepEqual(preview.result.move.self.boosts, {spa: -1});
		assert.equal(tips.getMoveBasePower(move, 'Dark', value(), battle.p2.active[0]).value, 390);
	});
	for (const id of ['coldshoulder', 'steadfaststrike', 'ancestralwrath']) it(id + ' honestly displays conditional power as a range', () => {
		const {tips, value} = setup(), move = Dex.moves.get(id);
		const result = tips.getMoveBasePower(move, move.type, value(), battle.p2.active[0]);
		assert.equal(result.value, move.basePower); assert.equal(result.maxValue, 120);
	});
	it('pledges have compact readable condition labels', () => {
		const Sprite = new Function('$', 'window', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations.js', 'utf8') + '\nreturn PokemonSprite;')({easing: {}}, {});
		assert.deepEqual(Sprite.statusTable.solarpledge, ['Solar ready', 'good']);
		assert.deepEqual(Sprite.statusTable.lunarpledge, ['Lunar shield', 'good']);
	});
});
