const assert = require('assert').strict;
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattleItems = require('../play.pokemonshowdown.com/data/items').BattleItems;
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');

describe('Hidden Mega Hydreigon with preserved replay data', () => {
	it('retains internal form and stone data while excluding the Mega from selection', () => {
		assert.equal(Dex.species.get('Hydreigon').exists, true);
		assert.equal(Dex.isSpeciesHidden('Hydreigon'), false);
		assert.equal(Dex.species.get('Hydreigon-Mega').exists, true);
		assert.equal(Dex.isSpeciesHidden('Hydreigon-Mega'), true);
		assert(!getCustomCosmeticFormes(Dex.species.get('Hydreigon')).includes('Hydreigon-Mega'));
		assert.equal(Dex.species.get('Hydreigon-Mega-X').exists, false);
		assert.deepEqual(Dex.items.get('Hydreigonite').megaStone, {Hydreigon: 'Hydreigon-Mega'});
		assert.deepEqual(Dex.species.get('Hydreigon').otherFormes, ['Hydreigon-Mega']);
	});
});
