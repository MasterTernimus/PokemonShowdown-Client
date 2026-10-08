'use strict';
const assert=require('assert').strict;require('./battle.test');
const groups=require('./fixtures/regional-passives-approved.json').groups;
describe('Approved regional passive client metadata',()=>{
 for(const[p,ids]of Object.entries(groups))for(const id of ids)it(id+' displays and searches '+p,()=>{
  const s=Dex.species.get(id);assert.deepEqual(s.passives,[p]);assert(Dex.hasAbilityEffect(s,p));
 });
 it('shows contextual replacement Includes and search without changing shared users',()=>{
  for(const[id,passive,addition]of [['orchardbond','harvest','stickyhold'],['abysslure','illuminate','suctioncups']]){
   assert(Dex.getAbilityDisplayComponents(id,Dex,[passive]).includes(addition));
   assert(!Dex.getAbilityDisplayComponents(id,Dex,[passive]).includes(passive));
   assert(!Dex.getAbilityDisplayComponents(id,Dex,[]).includes(addition));
  }
  assert(Dex.hasAbilityEffect(Dex.species.get('exeggutor'),'stickyhold'));
  assert(!Dex.hasAbilityEffect(Dex.species.get('exeggutoralola'),'stickyhold'));
 });
 it('preserves the approved Froslass slot and selected component replacements',()=>{
  assert.equal(Dex.species.get('froslass').abilities[0],'Infiltrator');
  assert(!Dex.getAbilityEffects('uncheckedassault').has('limber'));
  assert(!Dex.getAbilityEffects('cinderscales').has('shielddust'));
 });
});
