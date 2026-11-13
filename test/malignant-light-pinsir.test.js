'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Malignant Light and Pinsir client data', () => {
	it('shows approved slots and passives without changing Mega Pinsir', () => {
		assert.deepEqual(Dex.species.get('pinsir').abilities, {0: 'Siege Grip', 1: 'Iron Maiden', H: 'Violent Rush'});
		assert.deepEqual(Dex.species.get('pinsir').passives, ['hypercutter']);
		assert.deepEqual(Dex.species.get('starmie').passives, ['malignantlight']);
		assert.deepEqual(Dex.species.get('necrozma').abilities, {0: 'Prism Armor', 1: 'Malignant Light'});
		assert.equal(Dex.species.get('ampharos').abilities[0], 'Malignant Light');
		assert.deepEqual(Dex.species.get('pinsirmega').abilities, {0: 'Unbridled Flight'});
		assert.deepEqual(Dex.species.get('pinsirmega').passives, ['aerilate']);
	});
	it('publishes current descriptions and nested components', () => {
		for (const id of ['malignantlight', 'astralcore']) {
			const components = [...Dex.getAbilityEffects(id)];
			assert(components.includes('illuminate')); assert(components.includes('relicbeam'));
			assert(Dex.abilities.get(id).desc.includes('/relicbeam'));
		}
		assert([...Dex.getAbilityEffects('ironmaiden')].includes('moxie'));
		assert([...Dex.getAbilityEffects('siegegrip')].includes('moldbreaker'));
		assert.match(Dex.abilities.get('ironmaiden').desc, /once per attacking move/);
		assert.match(Dex.abilities.get('siegegrip').desc, /before damage/);
	});
});
