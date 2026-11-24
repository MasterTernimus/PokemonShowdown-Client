'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Dodrio approved stat transfer',()=>{
 it('keeps the final approved 110 Attack and 110 Speed spread',()=>{
  const p=Dex.species.get('dodrio');
  assert.deepEqual(p.baseStats,{hp:90,atk:110,def:85,spa:50,spd:75,spe:110});assert.equal(p.bst,520);
  assert.deepEqual(p.types,['Ground','Flying']);
  assert.deepEqual(p.abilities,{0:'Tripwire Kick',1:'Speed Boost',H:'Guts'});
 });
});
