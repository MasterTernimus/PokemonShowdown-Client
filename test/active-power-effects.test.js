'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const {BattleTooltips, ModifiableValue} = new Function(
	fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') +
	'\nreturn {BattleTooltips, ModifiableValue};'
)();

describe('Active aura and team power displays', () => {
	let battle, p, q, own, tips;
	beforeEach(() => {
		battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|doubles',
			'|switch|p1a: Mew|Mew, L100|100/100', '|switch|p1b: Ditto|Ditto, L100|100/100',
			'|switch|p2a: Mew|Mew, L100|100/100']});
		p = battle.p1.active[0]; q = battle.p2.active[0];
		own = {speciesForme: 'Mew', ability: 'No Ability', baseAbility: 'No Ability', passives: [],
			item: '', hp: 100, maxhp: 100, level: 100, status: '',
			stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
		tips = new BattleTooltips(battle);
	});
	afterEach(() => battle.destroy());
	it('shows Seasonal Stride at 1.5x without restoring the removed kick bonus', () => {
		own.passives = ['seasonalstride'];
		p.volatiles.gastroacid = ['gastroacid'];
		const kick = {...Dex.moves.get('megakick'), basePower: 100, flags: {kick: 1}};
		assert.equal(tips.getMoveBasePower(kick, 'Grass', new ModifiableValue(battle, p, own), q).value, 150);
		const fightingKick = {...kick, type: 'Fighting'};
		assert.equal(tips.getMoveBasePower(fightingKick, 'Fighting', new ModifiableValue(battle, p, own), q).value, 100);
	});
	function power(type = 'Dark', flags = {}) {
		const move = {...Dex.moves.get('darkpulse'), basePower: 80, category: 'Special', type, flags};
		return tips.getMoveBasePower(move, type, new ModifiableValue(battle, p, own), q);
	}
	for (const [field, factor] of [['Dragon\'s Den Terrain', 2], ['Fairy Tale Terrain', 2],
		['Rocky Terrain', 1.5], ['Cold Eclipse Terrain', 1.5], ['Forest Terrain', 1.3], ['', 1]]) {
		it(`shows Relentless Hunt's single ${factor}x bonus on ${field || 'no field'}`, () => {
			battle.pseudoWeather = field ? [[field, 5, 5]] : [];
			const baseline = power().value;
			own.ability = 'Relentless Hunt';
			assert.equal(power().value, baseline * factor);
			p.volatiles.gastroacid = ['gastroacid'];
			assert.equal(power().value, baseline);
		});
	}
	for (const ability of ['Dark Aura', 'Dread Presence']) {
		it(`includes the user's ${ability} from the request before a public reveal`, () => {
			own.ability = own.baseAbility = ability;
			assert.equal(power().value, 80 * 5448 / 4096);
		});
		it(`includes an opponent's ${ability}, but not a suppressed or fainted holder`, () => {
			q.ability = ability;
			assert.equal(power().value, 80 * 5448 / 4096);
			q.volatiles.gastroacid = ['gastroacid']; assert.equal(power().value, 80);
			delete q.volatiles.gastroacid; q.fainted = true; assert.equal(power().value, 80);
		});
	}
	it('deduplicates multiple Dark Aura holders and reverses the boost with Aura Break', () => {
		own.ability = 'Dread Presence'; q.ability = 'Dark Aura';
		assert.equal(power().value, 80 * 5448 / 4096);
		battle.p1.active[1].ability = 'Aura Break'; assert.equal(power().value, 60);
	});
	it('keeps passive Aura when the selected ability is suppressed', () => {
		own.passives = ['darkaura']; p.volatiles.gastroacid = ['gastroacid'];
		assert.equal(power().value, 80 * 5448 / 4096);
	});
	it('includes Ange Fairy Aura without boosting unrelated types', () => {
		q.ability = 'Ange';
		assert.equal(power('Fairy').value, 80 * 5448 / 4096);
		assert.equal(power('Dark').value, 80);
	});
	it('does not infer an unrevealed opponent ability from its possible slots', () => {
		assert.equal(power().value, 80);
	});
	it('Battery boosts the holder and allies; suppression removes the selected boost', () => {
		own.ability = 'Battery'; assert.equal(power().value, 104);
		own.ability = 'No Ability'; battle.p1.active[1].ability = 'Battery';
		assert.equal(power().value, 104);
		battle.p1.active[1].volatiles.gastroacid = ['gastroacid']; assert.equal(power().value, 80);
	});
	it('Power Spot affects allies, not its own moves or opponents', () => {
		own.ability = 'Power Spot'; assert.equal(power().value, 80);
		q.ability = 'Power Spot'; assert.equal(power().value, 80);
		battle.p1.active[1].ability = 'Power Spot'; assert.equal(power().value, 104);
	});
	it('Steely Spirit boosts Steel moves only and respects suppression', () => {
		own.ability = 'Steely Spirit'; assert.equal(power('Steel').value, 120);
		assert.equal(power().value, 80);
		p.volatiles.gastroacid = ['gastroacid']; assert.equal(power('Steel').value, 80);
	});
	it('uses the stronger field versions of Battery, Power Spot and Steely Spirit', () => {
		own.ability = 'Battery'; battle.pseudoWeather = [['Electric Terrain', 5, 5]];
		assert.equal(power().value, 156);
		own.ability = 'No Ability'; battle.p1.active[1].ability = 'Battery';
		assert.equal(power().value, 104, 'Electric Terrain enhances Battery only for its holder');
		battle.p1.active[1].ability = 'No Ability'; battle.pseudoWeather = [['Holy Terrain', 5, 5]];
		// Compare on the same field: Holy Terrain separately halves Dark move power.
		const holyBaseline = power().value;
		battle.p1.active[1].ability = 'Power Spot';
		assert.equal(power().value, holyBaseline * 1.5);
		battle.p1.active[1].ability = 'No Ability'; own.ability = 'No Ability';
		battle.pseudoWeather = [['Fairy Tale Terrain', 5, 5]];
		const fairyTaleBaseline = power('Steel').value;
		own.ability = 'Steely Spirit';
		assert.equal(power('Steel').value, fairyTaleBaseline * 2);
	});
	it('Resonance Force boosts sound moves only, once per holder', () => {
		own.ability = 'Resonance Force'; own.passives = ['resonanceforce'];
		assert.equal(power('Dark', {sound: 1}).value, 120);
		assert.equal(power().value, 80);
	});
	it('distinguishes the holder\'s Dual Wield boost from an allied boost', () => {
		own.passives = ['dualwield']; own.ability = 'Battery';
		let result = power('Dark', {pulse: 1});
		assert.equal(result.value, 104); assert.equal(result.secondHitPower, 12);
		own.ability = 'No Ability'; battle.p1.active[1].ability = 'Battery';
		result = power('Dark', {pulse: 1});
		assert(Math.abs(result.value - 62.4) < 1e-8); assert.equal(result.secondHitPower, result.value);
	});
	for (const gameType of ['multi', 'freeforall']) {
		it(`sees all aura holders and the correct allies in ${gameType}`, () => {
			battle.destroy();
			const log = ['|init|battle', '|gen|9', `|gametype|${gameType}`];
			for (let i = 1; i <= 4; i++) log.push(`|player|p${i}|Player ${i}|1`, `|teamsize|p${i}|1`);
			log.push('|start');
			for (let i = 1; i <= 4; i++) log.push(`|switch|p${i}${i > 2 ? 'b' : 'a'}: Mew ${i}|Mew|100/100`);
			battle = new Battle({debug: true, log});
			p = battle.p1.active[0]; q = battle.p2.active[0]; tips = new BattleTooltips(battle);
			battle.sides[3].active[1].ability = 'Dark Aura';
			assert.equal(power().value, 80 * 5448 / 4096);
			battle.sides[3].active[1].ability = 'No Ability';
			battle.sides[2].active[1].ability = 'Power Spot';
			assert.equal(power().value, gameType === 'multi' ? 104 : 80);
		});
	}
});
