const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
global.BattleSearchIndex = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchIndexCount = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexCount;
global.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const {DexSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {DexSearch};')();
describe('Eevee removed move batch', () => {
 for (const species of ['Eevee-Starter', 'Eevee-Starter-Alt', 'Divineon']) {
  for (const ability of ['Z Protean', 'Sinister Blaze', 'Ascendance']) {
   it(species + ' / ' + ability + ' excludes all 57 removed moves', () => {
    const search = new DexSearch();
    search.setType('move', 'gen9nofieldsinglesgame', {species, ability, moves: []});
    search.find('');
    const moves = search.results.filter(row => row[0] === 'move').map(row => row[1]);
    assert(moves.length > 0);
    const removed = Dex.getCustomMoveRemovals(toID(species)); assert.equal(removed.length, 57);
    for (const id of removed) assert(!moves.includes(id), id);
    assert(moves.includes('lastresort'));
   });
  }
 }
});
