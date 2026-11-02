'use strict';
const assert = require('assert').strict;
const {MoveSearch} = require('./helpers/exclusive-move-picker.cjs')();
describe('Server-exported Gen 9 move picker', () => {
 for (const [species, ability, move, legal] of [
  ['slowking','Regenerator','teleport',true], ['slowkinggalar','Regenerator','teleport',false],
  ['bronzong','Levitate','bodypress',true], ['bronzong','Levitate','recover',false],
  ['hypno','Insomnia','hex',true], ['phione','Hydration','takeheart',true],
  ['toxtricityaevian','Punk Rock','feverpitch',true], ['glalieaevian','No Ability','mudbarrage',true],
  ['umbreon','Ascendance','radiantassault',true], ['umbreon','Poison Heal','radiantassault',false],
 ]) it(species + ' / ' + ability + ' / ' + move, () => {
  const search = new MoveSearch('move','gen9nofieldsinglesgame',{species,ability,moves:[]});
  assert.equal(search.canLearn(species,move),legal);
  assert.equal(search.getBaseResults().some(([type,id])=>type==='move' && id===move),legal);
 });
});
