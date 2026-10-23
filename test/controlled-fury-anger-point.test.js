'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Controlled Fury Anger Point client contract',()=>{
 it('publishes distinct selected and passive component packages',()=>{
  assert.deepEqual([...Dex.getAbilityEffects('controlledfury')].sort(),['angerpoint','controlledfury']);
  assert.deepEqual([...Dex.getPassiveAbilityEffects('controlledfury')].sort(),['angerpoint','controlledfury']);
  assert.deepEqual([...Dex.getAbilityEffects('ragingheart')].sort(),['innerfocus','ragingheart']);
  assert(Dex.abilities.get('controlledfury').desc.includes('first damaging hit'));
  assert(Dex.abilities.get('controlledfury').desc.includes('maximum'));
  assert(Dex.abilities.get('ragingheart').desc.includes('separately'));
 });
 it('retains exact requested slots and avoids distribution to related species',()=>{
  assert.deepEqual(Dex.species.get('crabominable').abilities,{0:'Icebreaker',1:'Iron Fist',H:'Controlled Fury'});
  assert.deepEqual(Dex.species.get('primeape').abilities,{0:'Vital Spirit',1:'Controlled Fury',H:'Defiant'});
  assert.deepEqual(Dex.species.get('krookodile').abilities,{0:'Intimidate',1:'Dread Jaw',H:'Vendetta'});
  for(const id of ['krookodile','annihilape'])assert.deepEqual(Dex.species.get(id).passives,['controlledfury']);
  assert.equal(Dex.species.get('mankey').abilities[1],'Anger Point');
  assert.deepEqual(Dex.species.get('annihilape').abilities,{0:'Unbound Spirit',1:'Raging Heart',H:'Defiant'});
 });
 it('uses accurate chosen-target wording without removing the real secondary',()=>{
  const desc=Dex.abilities.get('ragingheart').desc;
  assert(desc.includes('chosen adjacent opposing target'));
  assert(desc.includes('30% Defense-drop chance'));
  assert(!desc.includes('random opposing target'));
 });

});
