const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Primeval fossil pair and Payback client data', () => {
	const {Dex} = loadDex();
	it('shows Rock/Steel Rampardos with Primeval Skull instead of Steelworker', () => {
		const species = Dex.species.get('Rampardos');
		assert.deepEqual([...species.types], ['Rock', 'Steel']);
		assert.deepEqual({...species.abilities}, {0: 'Intrepid Sword', 1: 'Mold Breaker', H: 'Primeval Skull'});
		assert.deepEqual([...species.passives], ['relicarmor']);
		assert.equal(Dex.abilities.get('Primeval Skull').name, 'Primeval Skull');
		assert(Dex.getAbilityEffects('primevalskull').has('rockhead'));
		assert(!Dex.getAbilityEffects('primevalskull').has('secondwind'));
		assert(/even if it already has only 1 HP/.test(Dex.abilities.get('primevalskull').desc));
	});
	it('shows the exact 530-BST Bastiodon spread and matching Shield ability', () => {
		const species = Dex.species.get('Bastiodon');
		assert.deepEqual({...species.baseStats}, {hp: 80, atk: 65, def: 168, spa: 49, spd: 138, spe: 30});
		assert.equal(species.bst, 530);
		assert.deepEqual({...species.abilities}, {0: 'Dauntless Shield', 1: 'Stalwart', H: 'Primeval Shield'});
		assert.deepEqual([...species.passives], ['relicarmor']);
		assert(/half the actual HP damage/.test(Dex.abilities.get('primevalshield').desc));
		assert(!Dex.getAbilityEffects('primevalshield').has('rockhead'));
		assert(!Dex.getAbilityEffects('primevalshield').has('magicguard'));
	});
	it('matches Deluge stats and descriptions while preserving Payback as Dark', () => {
		const move = Dex.moves.get('Payback'), deluge = Dex.moves.get('Deluge');
		for (const key of ['basePower', 'accuracy', 'priority', 'pp', 'category', 'critRatio']) assert.equal(move[key], deluge[key], key);
		assert.equal(move.type, 'Dark'); assert.equal(move.basePower, 80); assert.equal(move.priority, -4);
		assert.equal(move.desc, deluge.desc); assert.equal(move.shortDesc, deluge.shortDesc);
	});
	it('does not publish the discarded Adamant names or change the original Second Wind', () => {
		assert(!Dex.abilities.get('Adamant Skull').exists);
		assert(!Dex.abilities.get('Adamant Shield').exists);
		assert(/50%/.test(Dex.abilities.get('Second Wind').shortDesc));
	});
});
