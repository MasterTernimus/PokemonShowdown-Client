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
	it('shows Black Testament in the correct type group without changing the shared move or its effect text', () => {
		const picker = require('./helpers/exclusive-move-picker.cjs')();
		const move = picker.Dex.moves.get('blacktestament');
		const row = Object.create(picker.BattleSearch.prototype);
		for (const [species, type] of [['Seviper', 'Poison'], ['Chandelure', 'Fire'], ['Honchkrow', 'Flying']]) {
			row.moveDisplaySet = {species, moves: [move.name], teraType: 'Steel'};
			const search = new picker.MoveSearch('move', 'gen9nofieldsinglesgame', row.moveDisplaySet);
			row.engine = {dex: picker.Dex, typedSearch: search};
			assert(search.filter(['move', move.id], [['type', type]]));
			assert(!search.filter(['move', move.id], [['type', 'Normal']]));
			for (const html of [row.renderMoveRow(move, 0, 0), row.renderMoveRowInner(move), row.renderTaggedMoveRow(move, 'Signature')]) {
				assert(html.includes('alt="' + type + '"'), species);
				assert(html.includes(move.shortDesc));
			}
		}
		for (const set of [null, {species: 'Unknown Pokémon', moves: []}]) {
			assert.equal(picker.Dex.getTeambuilderMoveDisplay(move, set), move);
		}
		assert.equal(move.type, 'Normal');
	});
	it('uses a type added to a single current type, and only active non-Stellar Tera overrides it', () => {
		const {p, tips, value} = setup('Chandelure');
		const move = Dex.moves.get('blacktestament');
		const shown = () => tips.getMoveType(move, value())[0];
		assert.equal(shown(), 'Fire');
		p.volatiles.typechange = ['typechange', 'Water'];
		p.volatiles.typeadd = ['typeadd', 'Grass'];
		assert.equal(shown(), 'Grass');
		p.terastallized = 'Steel';
		assert.equal(shown(), 'Steel');
		p.terastallized = 'Stellar';
		assert.equal(shown(), 'Grass');
	});
	it('colors the modern battle move button using the active user’s type', () => {
		const {p, own} = setup('Honchkrow');
		const script = fs.readFileSync('play.pokemonshowdown.com/js/panel-battle.js', 'utf8');
		const Panel = new Function('PSRoom', 'PSRoomPanel', 'ChatRoom', 'PS', 'preact', 'BattleTooltips', 'ModifiableValue',
			script + '\nreturn BattlePanel;')(class {}, class {}, class {}, {roomTypes: {}, updateRoomTypes() {}},
			require('preact'), BattleTooltips, ModifiableValue);
		const choices = {index: () => 0, current: {}, currentMoveRequest: () => ({moves: [{name: 'Black Testament'}]})};
		const button = () => Panel.prototype.renderMoveControls.call(
			{props: {room: {battle}}}, {side: {pokemon: [own]}}, choices
		)[0];
		assert.equal(button().attributes.type, 'Flying');
		p.terastallized = 'Steel';
		assert.equal(button().attributes.type, 'Steel');
	});
	it('previews Black Testament’s 1.2x power only on its four power fields', () => {
		const {p, own} = setup('Seviper');
		const move = {...Dex.moves.get('blacktestament'), type: 'Poison'};
		const control = {...move, id: 'control', name: 'Control'};
		for (const [field, factor] of [
			["Dragon's Den Terrain", 1.2], ['Short-Circuit Terrain', 1.2], ['New World Terrain', 1.2],
			['Starlight Arena Terrain', 1.2], ['Wasteland Terrain', 1], ['Corrosive Terrain', 1],
		]) {
			battle.pseudoWeather = [[field, 0, 0]];
			const base = BattleFieldTooltips.preview(battle, control, p, own, battle.p2.active[0]);
			const shown = BattleFieldTooltips.preview(battle, move, p, own, battle.p2.active[0]);
			assert.equal(shown.result.factor, base.result.factor * factor, field);
		}
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
