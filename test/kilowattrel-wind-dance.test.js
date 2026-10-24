'use strict';
const assert = require('assert').strict;
const raw = require('../play.pokemonshowdown.com/data/learnsets').BattleLearnsets;
const encoded = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable.learnsets;
describe('Kilowattrel Wind Dance selection data', () => {
 it('removes direct and inherited selection sources', () => {
  for (const id of ['kilowattrel', 'wattrel']) {
   assert(!raw[id].learnset.winddance, id);
   assert(!encoded[id].winddance, id);
  }
 });
 it('keeps Wind Dance for Noivern and Hisuian Braviary', () => {
  for (const id of ['noivern', 'braviaryhisui']) {
   assert(raw[id].learnset.winddance, id);
   assert(encoded[id].winddance, id);
  }
 });
});
