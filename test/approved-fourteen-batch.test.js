'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Approved October batch metadata',()=>{
 for(const [species,slot,id,components] of [
 ['hydreigon','0','dreadwings',['intimidate','unnerve']],
 ['slowkinggalar','1','eldritchremedy',['owntempo','curiousmedicine']],
 ['charizard','1','infernaldominion',['intimidate']],
 ['blastoise','H','hydraulicarmor',['stamina']],
 ['gengar','1','hauntingpresence',['levitate']],
 ['snorlax','1','slumberinggiant',['thickfat','comatose']],
 ['lapras','1','oceanlullaby',['shellarmor']],
 ['greninja','H','shadowscreen',['infiltrator']],
 ['clefable','H','voidpromise',['unaware']],
 ['flygon','0','voiddrift',['overcoat']],
 ['delphox','H','voidguile',['magician']],
 ['garchomp','H','voidwrath',['moldbreaker']],
 ['venusaur','1','creepingbloom',['infiltrator']],
 ])it(species+' distribution, components and descriptions',()=>{
 const a=Dex.abilities.get(id);assert.equal(Dex.species.get(species).abilities[slot],a.name);
 for(const c of components)assert(Dex.getAbilityEffects(id).has(c));
 assert(a.desc.length>40);assert(a.shortDesc.length>10);assert(a.shortDesc.length<200);
 });
 it('retains Battle Bond in approved event slots',()=>{for(const id of ['greninja','garchomp'])assert.equal(Dex.species.get(id).abilities.S,'Battle Bond');});
 it('retains ordinary Gardevoir abilities',()=>assert.deepEqual(Dex.species.get('gardevoir').abilities,{0:'Trace',1:'Dream Sickness',H:'Void Veil'}));
});
