'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync(
	path.join(__dirname, '../play.pokemonshowdown.com/js/battle-tooltips.js'), 'utf8') +
	'\nreturn {BattleTooltips, ModifiableValue};')();
describe('Approved signature client parity', () => {
	it('exposes approved base slots, stats, components and the punch flag', () => {
		assert.deepEqual(Dex.species.get('grafaiai').abilities, {0: 'Unburden', 1: 'Toxic Signature', H: 'Prankster'});
		assert.deepEqual(Dex.species.get('klefki').abilities, {0: 'Vault Keeper', 1: 'Master Key', H: 'Magician'});
		assert.equal(Dex.species.get('magcargo').bst, 540);
		for (const id of ['charizardmegax', 'charizardmegaxalt']) {
			assert.equal(Dex.species.get(id).baseStats.atk, 130);
			assert.equal(Dex.species.get(id).baseStats.spa, 125);
		}
		assert(Dex.getAbilityEffects('atrocity').has('toughclaws'));
		assert(!Dex.getAbilityEffects('atrocity').has('levitate'));
		for (const id of ['battlefervor', 'precision', 'opportunist']) assert(Dex.getAbilityEffects('duskdrive').has(id));
		assert.equal(Dex.moves.get('doubleshock').flags.punch, 1);
		assert.match(Dex.abilities.get('gravehunger').desc, /1\/8 maximum HP per turn/);
	});
	it('previews Frozen Feast, Atrocity contact power and Rimebreaker conversion without double counting', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
			'|switch|p1a: Mew|Mew, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
		const pokemon = battle.p1.active[0];
		const own = {speciesForme: 'Mew', ability: 'Frozen Feast', baseAbility: 'Frozen Feast', item: '', hp: 100,
			maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
		const tips = new BattleTooltips(battle);
		try {
			for (const [ability, id, multiplier] of [['Frozen Feast', 'bite', 1.5], ['Atrocity', 'tackle', 1.3]]) {
				own.ability = ability; own.baseAbility = ability;
				const move = Dex.moves.get(id);
				const value = () => tips.getMoveBasePower(move, move.type,
					new ModifiableValue(battle, pokemon, own), battle.p2.active[0]).value;
				assert.equal(value(), move.basePower * multiplier);
				pokemon.volatiles.gastroacid = ['gastroacid']; assert.equal(value(), move.basePower);
				delete pokemon.volatiles.gastroacid;
			}
			own.ability = 'Rimebreaker'; own.baseAbility = 'Rimebreaker';
			assert.equal(tips.getMoveType(Dex.moves.get('tackle'), new ModifiableValue(battle, pokemon, own))[0], 'Ice');
			assert.equal(tips.getMoveBasePower(Dex.moves.get('icebeam'), 'Ice',
				new ModifiableValue(battle, pokemon, own), battle.p2.active[0]).value, Dex.moves.get('icebeam').basePower);
		} finally {
			battle.destroy();
		}
	});
});
