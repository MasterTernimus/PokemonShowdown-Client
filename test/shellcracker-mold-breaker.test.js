const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Shellcracker Mold Breaker client data', () => {
	const {Dex} = loadDex();
	it('shows Mold Breaker in search components and descriptions', () => {
		const ability = Dex.abilities.get('Shellcracker');
		assert(Dex.getAbilityEffects('shellcracker').has('moldbreaker'));
		assert(Dex.getAbilityDisplayComponents('shellcracker').includes('moldbreaker'));
		// Selector rows show named components separately from the unique-effect summary.
		assert(/Mold Breaker/.test(ability.desc));
		assert(/Crabhammer/.test(ability.shortDesc));
		assert(/100% base accuracy/.test(ability.desc));
		assert(/Ability Shield/.test(ability.desc));
	});
	it('keeps Shellcracker on Kingler without changing its other slots or passive', () => {
		const species = Dex.species.get('Kingler');
		assert.deepEqual({...species.abilities}, {0: 'Shell Armor', 1: 'Hyper Cutter', H: 'Shellcracker'});
		assert.deepEqual([...species.passives], ['titanpincer']);
	});
});
