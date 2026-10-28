'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');
const retired = ['voltagevolley', 'soaringspirit', 'backwash', 'soultag'];
describe('Retired unused abilities in the client', () => {
	const {Dex, BattleAbilities} = loadDex();
	it('removes the retired IDs from data, lookup and search', () => {
		const snapshot = require('../server-data-sync-manifest.json').snapshot;
		const search = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
		for (const id of retired) {
			assert(!Dex.abilities.get(id).exists, id);
			assert(!BattleAbilities[id] || BattleAbilities[id].exists === false, id);
			assert(!Object.hasOwn(snapshot.abilities, id), id);
			assert(!search.some(row => row[0] === id && row[1] === 'ability'), id);
		}
	});
	it('preserves the current Salamence and Hydreigon kits', () => {
		assert.equal(Dex.species.get('Salamence').abilities.H, 'Rightful Exalt');
		assert.equal(Dex.species.get('Salamence-Mega').abilities[0], 'Exalted Aether');
		assert.deepEqual([...Dex.species.get('Salamence-Mega').passives], ['aerilate']);
		assert.deepEqual([...Dex.species.get('Hydreigon').passives], ['hydraflight']);
		assert.deepEqual([...Dex.species.get('Hydreigon-Mega').passives], ['abyssalrebirth']);
		assert.equal(Dex.species.get('Hydreigon-Mega').abilities[0], 'Expiration');
		assert(!Dex.species.get('Hydreigon-Mega-X').exists);
	});
});
