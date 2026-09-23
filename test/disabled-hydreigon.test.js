const assert = require('assert').strict;
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattleItems = require('../play.pokemonshowdown.com/data/items').BattleItems;
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');

describe('Disabled Mega Hydreigon X', () => {
	it('hides the form and its stone without removing normal Hydreigon', () => {
		assert.equal(Dex.species.get('Hydreigon').exists, true);
		assert.equal(Dex.species.get('Hydreigon-Mega-X').exists, false);
		assert.equal(Dex.items.get('Hydreigonite').exists, false);
		assert.deepEqual(Dex.species.get('Hydreigon').otherFormes, []);
	});
});
