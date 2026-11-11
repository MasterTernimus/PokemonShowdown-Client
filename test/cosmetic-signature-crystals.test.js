'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const {BattleItemSearch} = new Function(
	fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {BattleItemSearch};'
)();
describe('Signature Z-Crystals for cosmetic forms', () => {
	for (const [species, item] of [
		['Primarina-Alt', 'primariumz'], ['Decidueye-Alt', 'decidiumz'],
		['Incineroar-Alt', 'inciniumz'], ['Primarina', 'primariumz'],
	]) it(`suggests ${item} specifically for ${species}`, () => {
		const rows = BattleItemSearch.prototype.getBaseResults.call({dex: Dex, species,
			getDefaultResults: () => [['item', item]]});
		assert.deepEqual(rows.slice(0, 2), [['header', 'Specific to ' + species], ['item', item]]);
	});
	it('does not extend signature eligibility to unrelated species', () => {
		const rows = BattleItemSearch.prototype.getBaseResults.call({dex: Dex, species: 'Mew',
			getDefaultResults: () => [['item', 'aloraichiumz']]});
		assert.deepEqual(rows, [['item', 'aloraichiumz']]);
	});
});
