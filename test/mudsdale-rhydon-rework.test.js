'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Mudsdale and Rhydon current setup',()=>{
 it('shows exact passive and selected slots',()=>{
  assert.deepEqual(Dex.species.get('mudsdale').abilities,{0:'Unyielding',1:'Battle Armor',H:'Surefoot'});
  assert.deepEqual(Dex.species.get('mudsdale').passives,['stamina']);
  assert.deepEqual(Dex.species.get('rhydon').abilities,{0:'Grand Strategy',1:'Lightning Rod',H:'Brute Force'});
  assert.deepEqual(Dex.species.get('rhydon').passives,['powerdrill']);
 });
 it('removes Mud Temper and displays the new effects',()=>{
  assert(!Dex.abilities.get('mudtemper').exists);
  assert(Dex.getAbilityEffects('unyielding').has('innerfocus'));
  assert(!Dex.getAbilityEffects('unyielding').has('stamina'));
  assert(!Dex.getAbilityEffects('surefoot').has('innerfocus'));
  assert(Dex.abilities.get('surefoot').desc.includes('1.3x'));
  assert(Dex.moves.get('rockwrecker').desc.includes('successful hit'));
 });
});
