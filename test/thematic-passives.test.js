'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Thematic passive UI and protocol',()=>{
 it('publishes exactly the 14 approved slot replacements with no stat or extra-slot changes',()=>{
  for(const[id,before]of Object.entries(require('./fixtures/thematic-selected-slots.json'))){const species=Dex.species.get(id);assert.deepEqual(species.abilities,{...before.abilities,[before.slot]:before.replacement});assert.deepEqual(species.baseStats,before.baseStats);assert.deepEqual(species.passives,['levitate']);}
 });
 it('uses innate Levitate in groundedness previews through suppression while honoring grounding',()=>{
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Baltoy|Baltoy, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{const p=battle.p1.active[0],own={speciesForme:'Baltoy',ability:'Own Tempo',baseAbility:'Own Tempo',passives:['levitate'],item:''};p.volatiles.gastroacid=['gastroacid'];assert.equal(p.isGrounded(own),false);p.volatiles.smackdown=['smackdown'];assert.equal(p.isGrounded(own),true);delete p.volatiles.smackdown;own.item='Iron Ball';assert.equal(p.isGrounded(own),true);own.item='';assert.equal(p.isGrounded(own),false);}finally{battle.destroy();}
 });
 it('keeps species passives distinct from chosen abilities and excludes unapproved forms',()=>{
  const expected={kingler:'hypercutter',butterfree:'shielddust',cacturne:'overcoat',muk:'liquidooze',fearow:'keeneye',alcremie:'sweetveil',eevee:'runaway',rotomfan:'levitate',weezinggalar:'levitate',alcremiesaltedcream:'sweetveil',vivillonfancy:'shielddust'};
  const snapshot=require('../server-data-sync-manifest.json').snapshot.species;
  for(const[id,passive]of Object.entries(expected)){assert.deepEqual(Dex.species.get(id).passives,id === 'butterfree' ? ['shielddust'] : id === 'muk' ? ['liquidooze'] : [passive]);assert.deepEqual(Dex.species.get(id).abilities,snapshot[id].abilities);}
  for(const id of ['eeveestarter','alcremiegmax','pinsirmega','chingling','dusclops','vibrava'])assert.deepEqual(Dex.species.get(id).passives,[],id);
 });
 it('separates removed passive components from selected mechanical and display identities',()=>{
  assert.deepEqual(Dex.getAbilityDisplayComponents('scaleshelter',Dex,['shielddust']),['overcoat']);
  assert.deepEqual(Dex.getAbilityDisplayComponents('scaleshelter'),['overcoat']);
  assert(!Dex.getAbilityEffects('scaleshelter').has('shielddust'));assert(Dex.getAbilityEffects('scaleshelter').has('overcoat'));
 });
 it('recognizes passive protocol effects without treating them as selected abilities',()=>{
  for(const name of ['Sweet Veil','Keen Eye','Liquid Ooze','Levitate']){const effect=Dex.getEffect('passive: '+name);assert.notEqual(effect.effectType,'Ability');assert.equal(effect.id,toID(name));assert(effect.name.includes('(passive)'));}
 });
 for(const fixture of require('./fixtures/thematic-passive-protocol.json'))it('replays real '+fixture.name+' passive events without assigning an ability to the wrong Pokemon',()=>{
  const battle=new Battle({debug:true,log:['|init|battle',...fixture.log]});
  try{
   const selected={};
   // All ability changes in these engine fixtures are explicit active-ability protocol.
   for(const line of fixture.log){const a=line.split('|');if(a[1]==='-ability')selected[a[2]]=a[3];}
   if(fixture.name==='sweet-veil-ally'){assert.equal(battle.p1.active[0].baseAbility,'Pressure');assert.equal(battle.p1.active[1].ability,'Pressure');}
   if(fixture.name==='levitate-selected-ability')assert.equal(battle.p1.active[0].ability,'Pressure');
   for(const side of [battle.p1,battle.p2])for(const p of side.pokemon){
    if(fixture.name.startsWith('ooze-'))assert.notEqual(p.ability,'Liquid Ooze');
    if(fixture.name.startsWith('sweet-veil'))assert.notEqual(p.ability,'Sweet Veil');
    if(fixture.name==='keen-eye-illusion')assert.notEqual(p.ability,'Keen Eye');
   }
  }finally{battle.destroy();}
 });
});
