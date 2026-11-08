'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
Object.assign(global,require('../play.pokemonshowdown.com/data/search-index.js'));
const {BattleMoveSearch, DexSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {BattleMoveSearch, DexSearch};')();
function set(species, level) { return {species, level, ability: Object.values(Dex.species.get(species).abilities)[0], moves: []}; }
function search(species, level) { return new BattleMoveSearch('move', 'gen9doublesrockyfield', set(species, level)); }
describe('Level-100 reward move suggestions', () => {
 for (const [species, move] of [['charizard','sacredfire'],['banette','shadowforce'],['raichualola','floatyfall'],['lanturnalt','boltstrike']]) {
  for (const level of [65,99,100]) it(`${species} ${move} at level ${level}`, () => {
   const s = search(species, level);
   assert.equal(s.isLevel100RewardHidden(move), level < 100);
   assert.equal(s.getBaseResults().some(r => r[0] === 'move' && r[1] === move), level === 100);
  });
 }
 it('retains earlier sources and default level 100', () => {
  for (const [species, move] of [['clefable','lunarblessing'],['smeargle','sketch'],['screamtail','hypervoice']]) assert.equal(search(species,65).isLevel100RewardHidden(move),false);
  assert.equal(search('charizard',undefined).isLevel100RewardHidden('sacredfire'),false);
 });
 it('hides exact searches and refreshes after changing level', () => {
  const s=new DexSearch();
  for(const level of [65,100,65]) {
   s.setType('move','gen9doublesrockyfield',set('charizard',level)); s.find('Sacred Fire');
   assert.equal(s.results.some(r=>r[0]==='move'&&r[1]==='sacredfire'),level===100);
  }
 });
});
