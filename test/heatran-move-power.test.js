'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
require('./battle.test');
const {BattleTooltips, ModifiableValue} = new Function(
	fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') +
	'\nreturn {BattleTooltips, ModifiableValue};'
)();

describe('Heatran move power previews', () => {
	let battle;
	let holder;
	let foe;

	beforeEach(() => {
		battle = new Battle({debug: true, log: [
			'|init|battle', '|gen|9', '|gametype|singles',
			'|switch|p1a: Heatran|Heatran, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100',
		]});
		holder = battle.p1.active[0];
		foe = battle.p2.active[0];
	});
	afterEach(() => battle.destroy());

	it('keeps earlier Heatran slots in Gen 7 and Gen 8 replays', () => {
		for (const mod of ['gen7', 'gen8', 'gen8bdsp']) {
			assert.deepEqual(Dex.mod(mod).species.get('heatran').abilities, {0: 'Flash Fire', H: 'Flame Body'});
		}
		assert.equal(Dex.forGen(9).species.get('heatran').abilities.H, 'Furnace Hide');
	});

	function power(ability, moveName, target = foe) {
		holder.ability = ability;
		const move = Dex.moves.get(moveName);
		const own = {
			speciesForme: holder.getSpeciesForme(), ability, passives: [], item: '',
			hp: 100, maxhp: 100, level: 100, status: holder.status,
			stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
		};
		const value = new ModifiableValue(battle, holder, own);
		new BattleTooltips(battle).getMoveBasePower(move, move.type, value, target);
		return value.value;
	}

	it('shows Furnace Hide only on Fire attacks aimed at a burned foe', () => {
		const bp = Dex.moves.get('Flamethrower').basePower;
		assert.equal(power('Furnace Hide', 'Flamethrower'), bp);
		foe.status = holder.status = 'brn';
		assert.equal(power('Furnace Hide', 'Flamethrower'), bp * 1.2);
		assert.equal(power('Furnace Hide', 'Flamethrower', holder), bp);
		assert.equal(power('Furnace Hide', 'Flash Cannon'), Dex.moves.get('Flash Cannon').basePower);
		holder.volatiles.gastroacid = ['gastroacid'];
		assert.equal(power('Furnace Hide', 'Flamethrower'), bp);
	});

	it('shows Steam Forge while Mega Heatran has a positive Defense stage', () => {
		battle.runMinor(['-formechange', 'p1a: Heatran', 'Heatran-Mega'], {});
		const bp = Dex.moves.get('Flash Cannon').basePower;
		assert.equal(power('Steam Forge', 'Flash Cannon'), bp);
		holder.boosts.def = 2;
		assert.equal(power('Steam Forge', 'Flash Cannon'), bp * 1.2);
		assert.equal(power('Steam Forge', 'Flamethrower'), Dex.moves.get('Flamethrower').basePower);
		holder.boosts.def = -1;
		assert.equal(power('Steam Forge', 'Flash Cannon'), bp);
	});

	it('lists Magma Armor under Steam Forge and Water Compaction as the Mega passive', () => {
		const mega = Dex.species.get('heatranmega');
		assert.deepEqual(mega.passives, ['watercompaction']);
		assert.deepEqual(Dex.getAbilityDisplayComponents('steamforge', Dex, mega.passives, mega.id), ['magmaarmor']);
		assert(Dex.getAbilityEffects('steamforge').has('magmaarmor'));
	});
});
