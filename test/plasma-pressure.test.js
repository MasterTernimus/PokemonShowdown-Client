'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path'), vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
context.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;
for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle', 'battle-log', 'battle-tooltips']) {
	vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js', file + '.js'), 'utf8'), context);
}
const {Battle, BattleTextParser, BattleTooltips, ModifiableValue} = vm.runInContext('({Battle,BattleTextParser,BattleTooltips,ModifiableValue})', context);
const {Dex} = context;
describe('Plasma Eruption client parity', () => {
	let battle, p, q, own, tips;
	beforeEach(() => {
		battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Mew|Mew, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
		battle.seekTurn(Infinity); p = battle.p1.active[0]; q = battle.p2.active[0];
		own = {speciesForme: 'Mew', ability: 'Plasma Eruption', baseAbility: 'Plasma Eruption', item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, passives: []};
		p.ability = p.baseAbility = 'Plasma Eruption'; tips = new BattleTooltips(battle);
	});
	afterEach(() => battle.destroy());
	const power = id => tips.getMoveBasePower(Dex.moves.get(id), Dex.moves.get(id).type, new ModifiableValue(battle, p, own), q).value;
	const start = name => battle.runMinor(['-start', 'p1a: Mew', name], {});
	const end = name => battle.runMinor(['-end', 'p1a: Mew', name], {});
	it('exports Fire/Electric Mega Typhlosion with Proficient and the restored ability', () => {
		const s = Dex.species.get('typhlosionmega');
		assert.deepEqual(Array.from(s.types), ['Fire', 'Electric']);
		assert.equal(s.abilities[0], 'Plasma Eruption'); assert.deepEqual(Array.from(s.passives), ['proficient']);
		assert.equal(s.baseStats.atk, 138); assert.equal(s.baseStats.spa, 139);
		assert(Dex.abilities.get('plasmaeruption').desc.includes('core discharge: +60% power'));
		assert(Dex.abilities.get('plasmaeruption').desc.includes('first +1 Sp. Atk, second +1 Speed'));
		assert(Dex.abilities.get('plasmaeruption').desc.includes('75% of the damage actually dealt'));
	});
	it('shows no baseline bonus and displays the ready-core 60% bonus', () => {
		assert.equal(power('flamethrower'), 90); assert.equal(power('firepunch'), 85);
		start('Plasma Pressure 1'); assert.equal(power('flamethrower'), 90); end('Plasma Pressure 1');
		start('Plasma Pressure 3'); assert.equal(power('flamethrower'), 144); end('Plasma Pressure 3');
		assert.equal(power('flamethrower'), 90);
	});
	it('shows airborne immunity and the Electric bonus, then the landing Fire bonus', () => {
		start('Plasma Airborne'); assert.equal(p.isGrounded(own), false);
		assert.equal(power('thunderbolt'), 108); assert.equal(power('flamethrower'), 90);
		own.item = 'Iron Ball'; assert.equal(p.isGrounded(own), true); own.item = '';
		battle.addPseudoWeather('Gravity', 5, 5); assert.equal(p.isGrounded(own), true); battle.removePseudoWeather('Gravity');
		end('Plasma Airborne'); start('Plasma Landing'); assert.equal(p.isGrounded(own), true);
		assert.equal(power('flamethrower'), 117); assert.equal(power('thunderbolt'), 90);
		end('Plasma Landing'); assert.equal(power('flamethrower'), 90);
	});
	it('explains that conversion changes the type used by the displayed power', () => {
		const text = tips.showMoveTooltip(Dex.moves.get('flamethrower'), '', p, own);
		assert(text.includes('may switch Fire/Electric')); assert(text.includes('displayed type'));
		assert(text.includes('Pressure rises once'));
	});
	it('renders pressure, flight and landing messages without placeholders', () => {
		const parser = new BattleTextParser('p1');
		for (const name of ['Plasma Pressure 1', 'Plasma Pressure 2', 'Plasma Pressure 3', 'Plasma Airborne', 'Plasma Landing']) {
			const message = parser.extractMessage('|-start|p1a: Mew|' + name);
			assert(message.trim().length > 10, name); assert(!message.includes('[POKEMON]'));
		}
		assert(parser.extractMessage('|-activate|p1a: Mew|ability: Plasma Eruption').includes('unleashed'));
	});
});
