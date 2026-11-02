'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const {BattleMoveSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {BattleMoveSearch};')();
describe('Restored Obstruct picker legality', () => {
 for (const format of ['gen9nofieldsinglesgame', 'gen9doublesrockyfield']) {
  it('offers Obstruct to Obstagoon in ' + format, () => {
   const search = new BattleMoveSearch('move', format, {species: 'Obstagoon', ability: 'Guts', moves: []});
   assert(search.canLearn('obstagoon', 'obstruct'));
   assert(search.getBaseResults().some(row => row[0] === 'move' && row[1] === 'obstruct'));
   assert(!search.canLearn('bulbasaur', 'obstruct'));
  });
 }
});
