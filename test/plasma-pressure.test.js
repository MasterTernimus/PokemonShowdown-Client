'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path'), vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
context.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;
for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle', 'battle-log', 'battle-tooltips']) {
	vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js', file + '.js'), 'utf8'), context);
}
const {Battle, BattleTextParser, BattleTooltips, ModifiableValue} = vm.runInContext('({Battle,BattleTextParser,BattleTooltips,ModifiableValue})', context);
const {Dex} = context;
describe('Public Pressure PP counts', () => {
	let battle;
	function start(mode, entries) {
		battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|' + mode, ...entries]});
		battle.seekTurn(Infinity);
	}
	function spent(user, name, target) {
		const before = user.moveTrack.find(entry => entry[0] === name)?.[1] || 0;
		battle.useMove(user, Dex.moves.get(name), target, {});
		return user.moveTrack.find(entry => entry[0] === name)[1] - before;
	}
	afterEach(() => battle.destroy());
	it('follows public field transitions and charges the native passive once even alongside selected Pressure', () => {
		start('singles', ['|switch|p1a: Mew|Mew|100/100', '|switch|p2a: Dusclops|Dusclops|100/100']);
		const user = battle.p1.active[0], foe = battle.p2.active[0];
		assert.equal(spent(user, 'Tackle', foe), 2);
		battle.addPseudoWeather('Underwater Terrain', 0, 0);
		battle.addPseudoWeather('Midnight Zone Terrain', 0, 0);
		foe.ability = 'Pressure';
		foe.addVolatile('gastroacid');
		assert.equal(spent(user, 'Tackle', foe), 3);
		battle.addPseudoWeather('Underwater Terrain', 0, 0);
		assert.equal(spent(user, 'Tackle', foe), 2);
		assert.equal(spent(user, 'Sticky Web', foe), 1);
		assert.equal(spent(user, 'Imprison', user), 2);
	});
	it('only counts revealed selectable abilities and counts each targeted opposing holder once', () => {
		start('doubles', ['|switch|p1a: Mew|Mew|100/100', '|switch|p1b: Pal|Dusclops|100/100',
			'|switch|p2a: Foe|Corviknight|100/100', '|switch|p2b: Foe2|Dusclops|100/100']);
		const user = battle.p1.active[0], [foe] = battle.p2.active;
		assert.equal(spent(user, 'Tackle', foe), 1);
		foe.ability = 'Moonlight Vigil';
		assert.equal(spent(user, 'Tackle', foe), 2);
		assert.equal(spent(user, 'Rock Slide', foe), 3);
		assert.equal(spent(user, 'Tackle', battle.p1.active[1]), 1);
		foe.addVolatile('gastroacid');
		assert.equal(spent(user, 'Tackle', foe), 1);
	});
	it('charges only the chosen Pressure holder for Fallen Star arrows in an FFA', () => {
		start('freeforall', ['|switch|p1a: Owl|Decidueye|100/100', '|switch|p2a: First|Dusclops|100/100',
			'|switch|p3b: Next|Mew|100/100', '|switch|p4b: Last|Dusclops|100/100']);
		const user = battle.p1.active[0], [foe, secondFoe] = battle.p2.active;
		assert(foe && secondFoe);
		user.ability = 'Fallen Star';
		assert.equal(spent(user, 'Thousand Arrows', foe), 2);
		assert.equal(spent(user, 'Razor Leaf', battle.p3.active[1]), 1);
		const own = {speciesForme: 'Decidueye', ability: 'Fallen Star', passives: user.getSpecies().passives,
			hp: 100, maxhp: 100, level: 100, item: '', status: '', moves: ['razorleaf'],
			stats: {atk: 150, def: 100, spa: 100, spd: 100, spe: 100}};
		const tips = new BattleTooltips(battle);
		const html = tips.showMoveTooltip(Dex.moves.get('razorleaf'), '', user, own);
		assert(html.includes('Hits one chosen foe twice.'));
		assert(!html.includes('Hits all foes.'));
		for (const name of ['Razor Leaf', 'Thousand Arrows', 'Bullet Seed']) {
			const move = Dex.moves.get(name);
			const value = tips.getMoveBasePower(move, move.type, new ModifiableValue(battle, user, own), foe);
			const boosted = move.type === 'Grass';
			assert.equal(value.value, move.basePower * (boosted ? 1.3 : 0.6), name);
			assert.equal(value.secondHitPower, move.basePower * (boosted ? 0.15 : 0.6), name);
		}
	});
	it('distinguishes the attacker’s own accuracy guarantee from a defender or Lock-On', () => {
		start('singles', ['|switch|p1a: User|Mew|100/100', '|switch|p2a: Foe|Mew|100/100']);
		const user = battle.p1.active[0], foe = battle.p2.active[0], tips = new BattleTooltips(battle);
		const own = {speciesForme: 'Mew', ability: 'Synchronize', passives: [], hp: 100, maxhp: 100, level: 100,
			item: '', status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
		const tooltip = id => tips.showMoveTooltip(Dex.moves.get(id), '', user, own);
		foe.ability = 'No Guard';
		foe.addVolatile('lockon');
		assert(!tooltip('zapcannon').includes('50% paralysis chance on hit.'));
		own.passives = ['noguard'];
		assert(tooltip('zapcannon').includes('No Guard: 50% paralysis chance on hit.'));
		own.passives = [];
		own.ability = 'Perfect Ego';
		assert(tooltip('dynamicpunch').includes('Perfect Ego: 50% confusion chance on hit.'));
		own.ability = 'High Noon';
		assert(tooltip('dynamicpunch').includes('High Noon: 50% confusion chance on hit.'));
		assert(!tooltip('zapcannon').includes('50% paralysis chance on hit.'));
		own.ability = 'Railgun Circuit';
		assert(!tooltip('zapcannon').includes('50% paralysis chance on hit.'));
		own.ability = 'Illuminate';
		assert(!tooltip('dynamicpunch').includes('50% confusion chance on hit.'));
		battle.addPseudoWeather('Midnight Zone Terrain', 0, 0);
		assert(tooltip('dynamicpunch').includes('Illuminate: 50% confusion chance on hit.'));
		user.addVolatile('gastroacid');
		assert(!tooltip('dynamicpunch').includes('50% confusion chance on hit.'));
	});
});
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
		assert.equal(s.baseStats.atk, 127); assert.equal(s.baseStats.spa, 137);
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
