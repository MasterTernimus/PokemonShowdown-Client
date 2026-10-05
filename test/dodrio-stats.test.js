'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Dodrio approved stat transfer',()=>{
 it('keeps the final approved 106 Attack and 119 Speed spread',()=>{
  const p=Dex.species.get('dodrio');
  assert.deepEqual(p.baseStats,{hp:90,atk:106,def:85,spa:50,spd:75,spe:119});assert.equal(p.bst,525);
  assert.deepEqual(p.types,['Ground','Flying']);
  assert.deepEqual(p.abilities,{0:'Triple Threat',1:'Speed Boost',H:'Striker Frenzy'});
 });
});
