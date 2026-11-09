'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Monarch and Sovereign presentation', () => {
	for (const [old, name, id] of [
		['Pollen Bloom', 'Verdant Monarch', 'pollenbloom'],
		['Water Barrage', 'Tidal Monarch', 'waterbarrage'],
		['Unbound Blaze', 'Blazing Monarch', 'unboundblaze'],
	]) it(name + ' works alongside old saved-team names', () => {
		assert.equal(Dex.abilities.get(name).id, id);
		assert.equal(Dex.abilities.get(old).name, name);
		assert.equal(Dex.abilities.get(name).name, name);
		assert.match(Dex.abilities.get(name).desc, /All moves have 1.1x accuracy/);
	});
	it('shows the added components and replacement effects', () => {
		assert(Dex.getAbilityDisplayComponents('atrocity').includes('toughclaws'));
		assert(Dex.getAbilityDisplayComponents('infernaldominion').includes('fireward'));
		for (const id of ['sunsovereign', 'sandsovereign', 'rainsovereign', 'frostsovereign', 'stormsovereign']) {
			assert(!/chip/i.test(Dex.abilities.get(id).desc), id);
		}
		assert.match(Dex.abilities.get('sandsovereign').desc, /Rock or Dark/);
		assert.match(Dex.abilities.get('rainsovereign').desc, /lowest HP percentage/);
		assert.match(Dex.abilities.get('frostsovereign').desc, /Speed by 1 stage/);
	});
});
