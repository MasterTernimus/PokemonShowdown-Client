'use strict';
const assert=require('assert').strict,fs=require('fs'),vm=require('vm');require('./battle.test');
function Room() {} Room.prototype.events={};
for(const key of ['initialize','renderSet','renderRosterProfiles','update','back','setPokemon','chartSet','updateChart','getStat'])Room.prototype[key]=function(){};
const host={TeambuilderRoom:Room};const source=fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js','utf8');
const Storage={prefs(){}},storageSource=fs.readFileSync('play.pokemonshowdown.com/js/storage.js','utf8');
new Function('Storage',storageSource.slice(storageSource.indexOf('Storage.setInitialDisguise ='),storageSource.indexOf('Storage.packTeam =')))(Storage);
vm.compileFunction(source.slice(source.indexOf('// BEGIN LOCAL TEAMBUILDER TOOLS')),['window','jQuery','Storage','BattleLog','Dex','app','toID'])(host,()=>({}),Storage,{escapeHTML:String},Dex,{addPopupMessage(){}},toID);
const T=host.TeambuilderTools;
const profile=()=>({id:'n',name:'Coral',rosterProfile:'g',entries:{corsola:'Pearl',armaldo:'Shell'},genderEntries:{}});
const group=()=>({id:'g',species:['corsola','armaldo','garchomp','garchompmega']});
describe('Standalone unified profile selection',()=>{
 it('rejects hidden legacy profile members while retaining base species and supported Megas',()=>{
  const g={id:'g',species:['hydreigon','hydreigonmega','empoleon','empoleonmegax','empoleonmegay']};
  for(const id of ['hydreigonmega','empoleonmegax'])assert.throws(()=>T.planProfileTeam(g,profile(),[id],[],6),/changed/);
  assert.deepEqual(T.planProfileTeam(g,profile(),['hydreigon','empoleon','empoleonmegay'],[],6).map(s=>s.species),['Hydreigon','Empoleon','Empoleon-Mega-Y']);
  assert.equal(g.species.length,5); // Legacy records remain intact.
 });
 it('resets a removed disguise teammate to Auto instead of choosing its old numeric slot',()=>{
  const team=[{species:'Zorua',initialDisguise:2},{species:'Pikachu',name:'Chosen'},{species:'Mew'}];
  Storage.bindInitialDisguises(team);
  const result=T.planProfileTeam({id:'g',species:['zorua','mew']},profile(),['zorua','mew'],team,6);
  const applied=Storage.cloneTeam(result);
  assert.equal(Storage.getInitialDisguiseSlot(applied[0],applied),undefined);
  assert.equal(applied[0].initialDisguise,undefined);
  assert.equal(team[0]._initialDisguiseTarget,team[1]);
 });
 it('retains a selected disguise teammate through profile reordering and the final apply clone',()=>{
  const team=[{species:'Zorua',initialDisguise:2},{species:'Pikachu',name:'Chosen'},{species:'Mew'}];
  const result=T.planProfileTeam({id:'g',species:['zorua','pikachu','mew']},profile(),['mew','pikachu','zorua'],team,6);
  const applied=Storage.cloneTeam(result);
  assert.equal(Storage.getInitialDisguiseSlot(applied[2],applied),2);
  assert.equal(applied[2]._initialDisguiseTarget,applied[1]);
  assert.notEqual(applied[1],team[1]);
 });
 it('does not replace a removed duplicate-species disguise target with the retained individual',()=>{
  const team=[{species:'Zorua',initialDisguise:3},{species:'Pikachu',name:'First'},{species:'Pikachu',name:'Chosen'}];
  const result=T.planProfileTeam({id:'g',species:['zorua','pikachu']},profile(),['zorua','pikachu'],team,6);
  assert.equal(Storage.getInitialDisguiseSlot(result[0],result),undefined);
  assert.equal(result[1].name,'First');
 });
 it('applies inline names while preserving existing moves, items and EVs',()=>{
  const current=[{species:'Corsola',name:'Old',moves:['surf'],item:'Leftovers',evs:{hp:252}}],before=JSON.stringify(current);
  const sets=T.planProfileTeam(group(),profile(),['corsola','armaldo'],current,6);
  assert.equal(sets[0].name,'Pearl');assert.deepEqual(sets[0].moves,['surf']);assert.equal(sets[0].item,'Leftovers');assert.deepEqual(sets[0].evs,{hp:252});
  assert.equal(sets[1].name,'Shell');assert.deepEqual(sets[1].moves,[]);assert.equal(JSON.stringify(current),before);
 });
 it('deduplicates a repeated selection but preserves distinct forms',()=>{
  assert.equal(T.planProfileTeam(group(),profile(),['corsola','corsola'],[],6).length,1);
  assert.deepEqual(T.planProfileTeam(group(),profile(),['garchomp','garchompmega'],[],6).map(s=>s.species),['Garchomp','Garchomp-Mega']);
 });
 it('requires current group membership, linked local profile and team capacity',()=>{
  assert.throws(()=>T.planProfileTeam(group(),profile(),['mew'],[],6),/changed/);
  assert.throws(()=>T.planProfileTeam(group(),profile(),['corsola','armaldo'],[],1),/between/);
  assert.throws(()=>T.planProfileTeam(group(),{...profile(),rosterProfile:'other'},['corsola'],[],6),/profile/);
 });
 it('invalidates previews after local membership, names or team changes',()=>{
  const revision=T.profileTeamRevision(group(),profile(),'packed');
  assert.notEqual(T.profileTeamRevision({...group(),species:['corsola']},profile(),'packed'),revision);
  assert.notEqual(T.profileTeamRevision(group(),{...profile(),entries:{corsola:'New'}},'packed'),revision);
  assert.notEqual(T.profileTeamRevision(group(),profile(),'changed'),revision);
 });
 it('does not let dormant experimental metadata gate standalone local selection',()=>{
  const g={...group(),publicRosterPlayerId:'unused'};
  assert.equal(T.planProfileTeam(g,profile(),['corsola'],[],6).length,1);
  assert.equal(T.profileTeamRevision(g,profile(),'packed'),T.profileTeamRevision(group(),profile(),'packed'));
 });
 it('keeps nickname/profile data unchanged while preparing independent set copies',()=>{
  const g=group(),p=profile(),before=JSON.stringify([g,p]),first=T.planProfileTeam(g,p,['corsola'],[],6);
  first[0].moves.push('surf');const second=T.planProfileTeam(g,p,['corsola'],[],6);
  assert.deepEqual(second[0].moves,[]);assert.equal(JSON.stringify([g,p]),before);
 });
 it('has no live receiving or reconciliation boundary in the standalone workflow',()=>{
  for(const name of ['reconcilePublicRoster','applyPublicRosterToPrefs','applyScopedPublicRosterPrefs'])assert.equal(typeof T[name],'undefined');
  assert.equal(typeof Room.prototype.receivePublicRoster,'undefined');assert.equal(typeof T.liveRosterEnabled,'undefined');assert.equal(typeof T.publicLockMembers,'undefined');
 });
});
