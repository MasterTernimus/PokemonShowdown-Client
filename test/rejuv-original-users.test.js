'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
Object.assign(global, require('../play.pokemonshowdown.com/data/search-index'));
global.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const {DexSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {DexSearch};')();
const additions = {...require('./fixtures/rejuv-original-users.json'), ...require('./fixtures/rejuv-advanced-users.json')};
describe('Original Rejuvenation users in the client move picker', () => {
 for (const [move, users] of Object.entries(additions)) for (const species of users) {
  it(species + ' can select ' + move, () => {
   const search = new DexSearch();
   search.setType('move', 'gen9nofieldsinglesgame', {species, moves: []});
   search.find(move);
   assert(search.results.some(row => row[0] === 'move' && row[1] === move), species + '/' + move);
   assert(!search.illegalLabel(move), species + '/' + move + ': ' + search.illegalLabel(move));
   assert(BattleTeambuilderTable.learnsets[species][move].includes('9'));
  });
 }
 it('keeps regional, appliance, and unevolved exclusions out of explicit learnsets', () => {
  for (const [species, move] of [['gyarados','feverpitch'],['volcarona','heavenlywing'],['indeedee','multipulse'],['stantler','multipulse'],['pignite','galestrike'],['combusken','galestrike'],['rotomwash','coldtruth'],['rotomfrost','uproot'],['regice','coldtruth'],['darkrai','bunrakubeatdown']]) {
   const search = new DexSearch();
   search.setType('move', 'gen9nofieldsinglesgame', {species, moves: []});
   search.find(move);
   assert(!BattleTeambuilderTable.learnsets[species]?.[move]?.includes('9'), species + '/' + move);
  }
 });
});
