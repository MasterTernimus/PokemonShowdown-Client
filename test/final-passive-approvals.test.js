'use strict';
const assert=require('assert').strict;require('./battle.test');
const latest=require('./fixtures/latest-passives-approved.json'),settled=require('./fixtures/settled-passives-approved.json'),revision=require('./fixtures/passive-revision-approved.json');
describe('Final approved passive revisions in client data',()=>{
 for(const[passive,ids]of Object.entries({...latest.groups,...settled.groups}))for(const id of ids)it(id+' has '+passive,()=>{assert.deepEqual(Dex.species.get(id).passives,[passive]);assert(Dex.hasAbilityEffect(Dex.species.get(id),passive));});
 for(const[id,p]of Object.entries(revision.overrides))it(id+' has the final revised passive split',()=>assert.deepEqual(Dex.species.get(id).passives,p));
 for(const[id,slot,,name]of latest.slots)it(id+' slot '+slot+' is '+name,()=>assert.equal(Dex.species.get(id).abilities[slot],name));
 it('has final component identities and event text',()=>{
  const spiral=Dex.getAbilityEffects('spiralevolution');assert(spiral.has('shielddust'));assert(!spiral.has('infiltrator'));assert(!spiral.has('powerdrill'));assert(!spiral.has('levitate'));assert(!Dex.moves.get('lunge').flags.drill);
  assert(!Dex.getAbilityEffects('voidomen').has('moldbreaker'));assert(Dex.getAbilityEffects('voidomen').has('friendguard'));assert.equal(Dex.species.get('venusaur').abilities.S,'Uproot');assert(!Object.values(Dex.species.get('venusaurmega').abilities).includes('Uproot'));
  for(const id of ['uproot','steadyaim','entrenched','freeflight'])assert(Dex.abilities.get(id).desc.length>30,id);
 });
});
