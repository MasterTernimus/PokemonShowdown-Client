'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Combat sequence ability data', () => {
	it('shows the approved ability slots and passives', () => {
		for (const [id, slot, name] of [['lucario', 1, 'Convergence'], ['metagross', 0, 'Convergence'],
			['bronzong', 'H', 'Misaligned Stars'], ['bronzong', 'S', 'Reflector'], ['claydol', 0, 'Misaligned Stars'],
			['dusknoir', 1, 'Misaligned Stars'], ['mienshao', 0, 'Frame Perfect'], ['ninjask', 1, 'Frame Perfect']]) {
			assert.equal(Dex.species.get(id).abilities[slot], name, id);
		}
		assert.deepEqual(Dex.species.get('accelgor').passives, ['frameperfect']);
		assert.deepEqual(Dex.species.get('metagross').passives, ['clearbody']);
	});
	it('keeps nested components correct and publishes concise current descriptions', () => {
		const insight = [...Dex.getAbilityEffects('insight')];
		assert(insight.includes('convergence')); assert(insight.includes('keeneye')); assert(insight.includes('innerfocus'));
		assert(!insight.includes('telepathy'));
		assert([...Dex.getAbilityEffects('coldlogic')].includes('convergence'));
		assert([...Dex.getAbilityEffects('misalignedstars')].includes('anticipation'));
		assert([...Dex.getAbilityEffects('frameperfect')].includes('innerfocus'));
		for (const id of ['convergence', 'misalignedstars', 'frameperfect']) {
			assert(Dex.abilities.get(id).exists); assert(Dex.abilities.get(id).shortDesc.length < 150);
		}
		assert.match(Dex.abilities.get('coldlogic').desc, /physical and a special/);
	});
});
