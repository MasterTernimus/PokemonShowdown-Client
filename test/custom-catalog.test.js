const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattleAbilities = require('../play.pokemonshowdown.com/data/abilities').BattleAbilities;
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');
const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-dex-search.js'), 'utf8');
const {BattlePokemonSearch, DexSearch} = new Function(source + '\nreturn {BattlePokemonSearch, DexSearch};')();

global.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
describe('Custom catalog token', () => {
 function search(filters) { const s=new DexSearch(); s.setType('pokemon','gen9nofieldsinglesgame'); s.filters=filters || null; s.find(' -CUSTOM '); return s; }
 function ids(s) { return s.results.filter(r=>r[0]==='pokemon').map(r=>r[1]); }
 it('reveals selector variants and battle forms without ordinary official species', () => {
  const found=ids(search());
  for(const id of ['gardevoirvoid','arcaninealt','torterrarift','torterrariftshatter','cameruptpulse','auroreon','braveon']) assert(found.includes(id),id);
  for(const id of ['charizard','raichualola','arcaninehisui','sawsbuck','deerlingsummer','victreebelmega']) assert(!found.includes(id),id);
  assert.equal(found.length,new Set(found).size);
 });
 it('applies existing type filters and explains no matches', () => {
  const s=search([['type','Ghost']]); assert(ids(s).length); for(const id of ids(s)) assert(Dex.species.get(id).types.includes('Ghost'),id);
  const empty=search([['type','NoSuchType']]);assert.equal(ids(empty).length,0);assert(empty.results.some(r=>r[0]==='html'&&r[1].includes('No custom species')));
 });
});
