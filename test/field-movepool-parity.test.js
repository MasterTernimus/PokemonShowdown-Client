'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
Object.assign(global, require('../play.pokemonshowdown.com/data/search-index.js'));
const {BattleMoveSearch, DexSearch} = new Function(
	fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') +
	'\nreturn {BattleMoveSearch, DexSearch};'
)();
const formats = BattleTeambuilderTable.rebornFormats;
const set = {species: 'Charizard', ability: 'Blaze', level: 100, moves: []};
const moves = search => search.getBaseResults().filter(row => row[0] === 'move').map(row => row[1]).sort();

describe('Reborn field movepool parity', () => {
	it('exports named fields and their multiplayer variants', () => {
		for (const id of ['gen9dragonsden', 'gen9doublesrockyfield', 'gen9doublesmountain',
			'gen9freeforall4pdragonsden', 'gen9multidragonsden']) assert(formats.includes(id), id);
	});
	it('offers identical species movepools across every registered All Gen ruleset', () => {
		for (const species of ['Charizard', 'Obstagoon', 'Pidgeot', 'Raichu', 'Gardevoir', 'Banette']) {
			const pokemon = {...set, species};
			const expected = moves(new BattleMoveSearch('move', 'gen9doublesrockyfield', pokemon));
			assert(expected.length, species);
			for (const format of formats) {
				assert.deepEqual(moves(new BattleMoveSearch('move', format, pokemon)), expected, `${species}: ${format}`);
			}
		}
	});
	it('refreshes exact searches when moving between Rocky doubles and Dragon\'s Den singles', () => {
		const search = new DexSearch();
		for (const format of ['gen9doublesrockyfield', 'gen9dragonsden', 'gen9doublesrockyfield']) {
			search.setType('move', format, {...set, species: 'Obstagoon', ability: 'Guts'});
			search.find('Obstruct');
			assert(search.results.some(row => row[0] === 'move' && row[1] === 'obstruct'), format);
			assert(!search.illegalReasons?.obstruct, format);
		}
	});
	it('preserves species restrictions and level-100 reward filtering', () => {
		const search = new BattleMoveSearch('move', 'gen9dragonsden', {...set, level: 65});
		assert(!search.canLearn('bulbasaur', 'obstruct'));
		assert(!moves(search).includes('sacredfire'));
		assert(moves(new BattleMoveSearch('move', 'gen9dragonsden', set)).includes('sacredfire'));
	});
	it('does not grant the Reborn rules to an unrelated standard format', () => {
		assert(!formats.includes('gen9ou'));
		assert(!new BattleMoveSearch('move', 'gen9ou', set).isFieldFormat);
	});
});
