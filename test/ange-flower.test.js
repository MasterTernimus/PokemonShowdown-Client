'use strict';
const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();

describe('Eternal Floette ability displays', () => {
	it('offers Natural Cure instead of Magic Guard on the base form', () => {
		const abilities = Object.values(Dex.species.get('floetteeternal').abilities);
		assert(abilities.includes('Natural Cure'));
		assert(!abilities.includes('Magic Guard'));
	});
	it('shows Ange with Fairy Aura and its limited flower strike', () => {
		const ability = Dex.abilities.get('ange');
		assert.match(ability.shortDesc, /Fairy Aura/);
		assert.match(ability.shortDesc, /Once per turn/);
		assert.match(ability.shortDesc, /25%/);
		assert(Dex.getAbilityEffects('ange').has('fairyaura'));
		assert(!Dex.getAbilityEffects('ange').has('magicguard'));
		for (const species of ['floetteeternal', 'floettemega']) {
			assert.deepEqual(Array.from(Dex.species.get(species).passives), ['eternalflower']);
		}
	});
});
