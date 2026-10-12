const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
global.BattleAliases = require('../play.pokemonshowdown.com/data/aliases').BattleAliases;
global.BattleSearchIndex = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const source = fs.readFileSync(require.resolve('../play.pokemonshowdown.com/js/battle-dex-search.js'), 'utf8');
const {DexSearch} = new Function(source + '\nreturn {DexSearch};')();
const patterns = Object.keys(BattlePokedex).filter(id => id.startsWith('vivillon') && id !== 'vivillon');
describe('Vivillon cosmetic picker visibility', () => {
 it('hides exactly the official patterns without removing their data', () => {
  assert.equal(patterns.length, 19);
  for (const id of patterns) {
   assert(DexSearch.isHiddenCosmeticPattern(id), id);
   assert(Dex.species.get(id).exists, id);
  }
  for (const id of ['vivillon', 'vivillonmega', 'vivillonaevian', 'vivillonalt']) assert(!DexSearch.isHiddenCosmeticPattern(id), id);
 });
 for (const query of ['vivillon', 'Vivillon-Icy Snow', 'Vivillon-Fancy', 'Vivillon-Pokeball']) {
  it('excludes patterns from search: ' + query, () => {
   const search = new DexSearch(); search.setType('pokemon', 'gen9nofieldsinglesgame'); search.find(query);
   const ids = (search.results || []).filter(row => row[0] === 'pokemon').map(row => row[1]);
   assert(!ids.some(id => DexSearch.isHiddenCosmeticPattern(id)));
   if (query === 'vivillon') assert(ids.includes('vivillon'));
  });
 }
 it('filters actual profile picker matches while retaining the main species', () => {
  const text = fs.readFileSync(require.resolve('../play.pokemonshowdown.com/js/client-teambuilder.js'), 'utf8');
  const method = text.slice(text.indexOf('searchRosterSpecies: function'), text.indexOf('\n\t\taddRosterSpecies:'));
  const window = {BattlePokedex}; let html = '';
  const room = new Function('DexSearch', 'Dex', 'window', 'toID', 'BattleLog', 'return ({' + method + '});')(DexSearch, Dex, window, toID, {escapeHTML: x => x});
  room.$ = selector => ({val: () => 'vivillon', html: value => {html = value;}});
  room.rosterData = () => ({selected: 'test', profiles: [{id: 'test', species: []}]});
  room.rosterSpeciesID = toID;
  room.searchRosterSpecies();
  assert(html.includes('value="vivillon"'));
  for (const id of patterns) assert(!html.includes('value="' + id + '"'), id);
 });
});
