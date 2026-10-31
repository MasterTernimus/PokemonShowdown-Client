'use strict';
const assert = require('assert').strict, fs = require('fs');
const assignment = require('./helpers/source-functions').assignment;
const storageSource = fs.readFileSync('play.pokemonshowdown.com/js/storage.js', 'utf8');
const builderSource = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
function load(source, name, scope) {
 return new Function(...Object.keys(scope), 'return (' + assignment(source, name) + ');')(...Object.values(scope));
}
function setup() {
 const before = [{species:'Mew'}], proposed = [{species:'Pikachu'}], team = {name:'Example',team:JSON.stringify(before)};
 const other = {name:'Other',team:'[]'}, messages = [], values = {}, controls = {disabled:false,filter(){return this;},prop(key,value){this[key]=value;return this;}};
 const Storage = {teams:[team,other],prefs:{queue:[],data:{}},packTeam:JSON.stringify,unpackTeam:JSON.parse,cloneTeam:sets=>JSON.parse(JSON.stringify(sets)),packAllTeams:teams=>JSON.stringify(teams.map(t=>({name:t.name,team:t.team})))};
 let fail = false;
 const localStorage = {getItem:key=>values[key] === undefined ? null : values[key],setItem(key,value){if(fail)throw Error('quota');values[key]=value;}};
 values.showdown_teams = Storage.packAllTeams(Storage.teams);
 Storage.saveTeamSnapshot = load(storageSource,'Storage.saveTeamSnapshot',{Storage,window:{},localStorage});
 const profile = {id:'p'}, group = {id:'g'}, T = {profileTeamRevision:()=> 'unchanged'};
 const app = {addPopupMessage:message=>messages.push(message)};
 const room = {curTeam:team,curSetList:before,curSet:before[0],curSetLoc:0,toolsView:true,profilesView:false,$:()=>controls,saveTeamToolBindings(){},update(){this.updates=(this.updates||0)+1;},toolsData:()=>({selectedNickname:'p',nicknames:[profile]}),nicknameGroupProfile:()=>group};
 const scope = {Storage,T,window:{localStorage},app};
 for (const name of ['saveProfileTeamSnapshot','applySelectedProfileTeam','undoSelectedProfileTeam']) room[name] = load(builderSource,'p.'+name,scope);
 const pending = room.pendingSelectedProfileTeam = {team,savedTeam:team.team,before:team.team,profileId:'p',revision:'unchanged',sets:proposed};
 return {Storage,room,team,other,before,proposed,pending,values,messages,controls,localStorage,fail:value=>{fail=value;}};
}
function setupRealPacking() {
 const h=setup(), Storage=h.Storage, Dex=require('./helpers/isolated-dex.cjs')().Dex;
 const scope={Storage,Dex,toID:value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,''),app:{rooms:{teambuilder:h.room}}};
 for(const name of ['setInitialDisguise','getInitialDisguiseSlot','bindInitialDisguises','cloneTeam','packTeam','unpackTeam','getPackedTeam','packAllTeams']) Storage[name]=load(storageSource,'Storage.'+name,scope);
 h.before[0].ability='Synchronize'; h.before[0].moves=['Psychic'];
 h.proposed[0].ability='Static'; h.proposed[0].moves=['Thunderbolt'];
 h.team.team=Storage.packTeam(h.before); h.other.team=Storage.packTeam([{species:'Ditto',ability:'Limber',moves:['Transform']}]);
 h.team.format=h.other.format='gen9';
 h.team.iconCache='!'; Storage.activeSetList=h.before;
 h.pending.before=h.pending.savedTeam=h.team.team;
 h.values.showdown_teams=Storage.packAllTeams(Storage.teams);
 return h;
}
describe('Acknowledged profile team replacement', () => {
 it('saves the proposed team through the real dirty-editor packing path and keeps subsequent saves and Undo consistent', () => {
  const h=setupRealPacking(), Storage=h.Storage, original=h.team.team, proposed=Storage.packTeam(h.proposed);
  h.room.applySelectedProfileTeam();
  assert.equal(h.team.team,proposed);
  assert(h.values.showdown_teams.includes('Example|'+proposed));
  assert.equal(Storage.activeSetList,h.room.curSetList);
  // Refocusing the builder marks the team dirty again before ordinary packing/saving.
  h.team.iconCache='!';
  assert.equal(Storage.getPackedTeam(h.team),proposed);
  h.room.undoSelectedProfileTeam();
  assert.equal(h.team.team,original); assert.equal(Storage.activeSetList,h.room.curSetList);
  h.team.iconCache='!'; assert.equal(Storage.getPackedTeam(h.team),original);
  assert.equal(h.values.showdown_teams,Storage.packAllTeams(Storage.teams));
 });
 it('does not let dirty-editor packing mutate the original team when a snapshot save fails', () => {
  const h=setupRealPacking(), Storage=h.Storage, original=h.team.team, persisted=h.values.showdown_teams;
  h.before[0].name='Unsaved edit'; h.pending.before=Storage.packTeam(h.before);
  h.fail(true); h.room.applySelectedProfileTeam();
  assert.equal(h.team.team,original); assert.equal(h.team.iconCache,'!'); assert.equal(Storage.activeSetList,h.before);
  assert.equal(h.values.showdown_teams,persisted); assert.equal(h.room.pendingSelectedProfileTeam,h.pending);
 });
 it('retains the original team and retryable preview on quota failure, then applies after recovery', () => {
  const h=setup(), persisted=h.values.showdown_teams;
  h.fail(true); h.room.applySelectedProfileTeam();
  assert.equal(h.values.showdown_teams,persisted); assert.equal(h.room.curSetList,h.before);
  assert.equal(h.team.team,JSON.stringify(h.before)); assert.equal(h.room.pendingSelectedProfileTeam,h.pending);
  assert.equal(h.room.toolsView,true); assert.equal(h.room.profileTeamUndo,undefined); assert.equal(h.controls.disabled,false); assert.equal(h.messages.length,1);
  h.fail(false); h.room.applySelectedProfileTeam();
  assert.deepEqual(h.room.curSetList,h.proposed); assert.equal(h.room.pendingSelectedProfileTeam,null); assert.equal(h.room.toolsView,false);
  assert.equal(h.values.showdown_teams,h.Storage.packAllTeams(h.Storage.teams)); assert.equal(h.room.profileTeamUndo.before,JSON.stringify(h.before));
 });
 it('retains Undo after a failed write and restores the original team on retry', () => {
  const h=setup(); h.room.applySelectedProfileTeam(); const undo=h.room.profileTeamUndo, applied=h.room.curSetList, persisted=h.values.showdown_teams;
  h.fail(true); h.room.undoSelectedProfileTeam();
  assert.equal(h.room.curSetList,applied); assert.equal(h.room.profileTeamUndo,undo); assert.equal(h.values.showdown_teams,persisted);
  h.fail(false); h.room.undoSelectedProfileTeam();
  assert.deepEqual(h.room.curSetList,h.before); assert.equal(h.room.profileTeamUndo,null); assert.equal(h.values.showdown_teams,h.Storage.packAllTeams(h.Storage.teams));
 });
 it('refuses to overwrite teams changed in another tab', () => {
  const h=setup(); const newer=JSON.stringify([{name:'Example',team:JSON.stringify(h.before)},{name:'Other',team:'newer'}]);
  h.values.showdown_teams=newer; h.room.applySelectedProfileTeam();
  assert.equal(h.values.showdown_teams,newer); assert.equal(h.room.curSetList,h.before); assert.equal(h.room.pendingSelectedProfileTeam,h.pending);
 });
 it('waits for asynchronous acknowledgement and prevents duplicate Apply or Undo', () => {
  const h=setup(); let finish, calls=0;
  h.Storage.saveTeamSnapshot=(team,packed,callback)=>{finish=callback;calls++;};
  h.room.applySelectedProfileTeam(); h.room.applySelectedProfileTeam(); h.room.undoSelectedProfileTeam();
  assert.equal(calls,1); assert.equal(h.controls.disabled,true); assert.equal(h.room.curSetList,h.before); assert.equal(h.room.pendingSelectedProfileTeam,h.pending);
  finish(false); assert.equal(h.controls.disabled,false); assert.equal(h.room.pendingSelectedProfileTeam,h.pending);
  h.room.applySelectedProfileTeam(); finish(true);
  assert.deepEqual(h.room.curSetList,h.proposed); assert.equal(h.room.pendingSelectedProfileTeam,null); assert.equal(h.controls.disabled,false);
 });
 it('does not replace another team view or a newer edit when a delayed acknowledgement arrives', () => {
  for (const changed of [false,true]) {
   const h=setup(); let finish;
   h.Storage.saveTeamSnapshot=(team,packed,callback)=>{finish=callback;}; h.room.applySelectedProfileTeam();
   if(changed)h.team.team='newer edit'; else {h.room.curTeam=h.other;h.room.curSetList=[];}
   finish(true);
   if(changed)assert.equal(h.team.team,'newer edit'); else {assert.equal(h.room.curTeam,h.other);assert.deepEqual(h.room.curSetList,[]);assert.equal(h.team.team,JSON.stringify(h.proposed));}
  }
 });
});

describe('Profile team storage acknowledgements', () => {
 it('saves restored Safari mirror teams through the actual tnull and iframe boundaries without overwriting newer data', () => {
  const bridgeSource=fs.readFileSync('play.pokemonshowdown.com/crossdomain.php','utf8');
  const bridgeCode=bridgeSource.slice(bridgeSource.indexOf('function messageHandler(e)'),bridgeSource.indexOf("window.addEventListener('message'"));
  for(const conflict of [false,true]) {
   const h=setupRealPacking(), Storage=h.Storage, mirror=h.values.showdown_teams;
   h.values.showdown_teams_local=mirror; delete h.values.showdown_teams;
   Storage.teams=[]; Storage.origin='https://storage.test'; Storage.crossOriginRequestCount=0; Storage.crossOriginRequests={}; Storage.whenTeamsLoaded={load(){}};
   for(const name of ['unpackLine','unpackAllTeams','loadPackedTeams']) Storage[name]=load(storageSource,'Storage.'+name,{Storage});
   const onMessage=load(storageSource,'Storage.onMessage',{Storage,Config:{routes:{client:'storage.test'}},window:{},localStorage:h.localStorage,document:{location:{hostname:'client.test'}}});
   let canonical=null, request;
   const frame={postMessage(data,origin){assert.equal(origin,Storage.origin);request=JSON.parse(data.slice(1));bridge({origin:'https://client.test',data});}};
   const bridge=new Function('yourOrigin','postReply','localStorage',bridgeCode+';return messageHandler;')('https://client.test',data=>onMessage({originalEvent:{origin:Storage.origin,source:frame,data}}),{getItem:()=>canonical,setItem(key,value){canonical=value;}});
   onMessage({originalEvent:{origin:Storage.origin,source:frame,data:'tnull'}});
   assert.equal(Storage.packAllTeams(Storage.teams),mirror); assert.equal(Storage.teamStorageRestoredFromEmpty,true);
   if(conflict)canonical='newer canonical teams';
   const team=Storage.teams[0], current=Storage.unpackTeam(team.team), proposed=Storage.packTeam(h.proposed); team.iconCache='!'; Storage.activeSetList=current;
   let result;
   Storage.saveTeamSnapshot(team,proposed,ok=>{result=ok;});
   assert.equal(request[1],mirror); assert.equal(request[3],true); assert(request[2].includes('Example|'+proposed));
   assert.equal(result,!conflict); assert.equal(canonical,conflict?'newer canonical teams':request[2]);
   assert.equal(Storage.activeSetList,current); assert.equal(team.team,Storage.packTeam(current));
   assert.equal(Storage.teamStorageRestoredFromEmpty,conflict); assert.equal(Object.keys(Storage.crossOriginRequests).length,0);
  }
 });
 it('requires the iframe acknowledgement and handles rejection, timeout and late replies once', () => {
  for (const mode of ['success','rejected','timeout']) {
   const h=setup(), timers=new Map(), sent=[]; let sequence=0, result=[];
   const Storage=h.Storage;
   Object.assign(Storage,{teamStorageCrossOrigin:true,crossOriginRequestCount:0,crossOriginRequests:{},origin:'https://storage.test',crossOriginFrame:{postMessage(data,origin){sent.push({data,origin});}}});
   const save=load(storageSource,'Storage.saveTeamSnapshot',{Storage,window:{},localStorage:h.localStorage,setTimeout:callback=>{timers.set(++sequence,callback);return sequence;},clearTimeout:id=>timers.delete(id)});
   save.call(Storage,h.team,JSON.stringify(h.proposed),ok=>result.push(ok)); assert.deepEqual(result,[]);
   const request=JSON.parse(sent[0].data.slice(1)); assert.equal(sent[0].data[0],'U'); assert.equal(sent[0].origin,Storage.origin);
   assert.equal(request[1],h.values.showdown_teams); assert.equal(h.team.team,JSON.stringify(h.before));
   const reply=Storage.crossOriginRequests[request[0]];
   if(mode==='timeout')[...timers.values()][0]();else reply(mode==='success');
   reply(true); assert.deepEqual(result,[mode==='success']); assert.equal(Object.keys(Storage.crossOriginRequests).length,0); assert.equal(timers.size,0);
  }
 });
 it('the iframe accepts only the parent origin and an unchanged saved snapshot', () => {
  const source=fs.readFileSync('play.pokemonshowdown.com/crossdomain.php','utf8'), code=source.slice(source.indexOf('function messageHandler(e)'),source.indexOf("window.addEventListener('message'"));
  for(const mode of ['success','quota','conflict']) {
   let saved=mode==='conflict'?'newer':'old'; const replies=[];
   const handler=new Function('yourOrigin','postReply','localStorage',code+';return messageHandler;')('https://client.test',reply=>replies.push(JSON.parse(reply.slice(1))),{getItem:()=>saved,setItem(key,value){if(mode==='quota')throw Error('quota');saved=value;}});
   const data='U'+JSON.stringify([7,'old','replacement']);
   handler({origin:'https://evil.test',data}); assert.equal(replies.length,0);
   handler({origin:'https://client.test',data}); assert.deepEqual(replies,[[7,mode==='success']]);
   assert.equal(saved,mode==='success'?'replacement':mode==='conflict'?'newer':'old');
  }
 });
 it('checks the desktop file before replacing it and retains the original memory snapshot', () => {
  for(const newer of [false,true]) {
   const h=setup(), Storage=h.Storage; let writes=0, result;
   Storage.nwSaveTeam=Storage.saveTeam=(copy,callback)=>{writes++;assert.equal(copy.team,JSON.stringify(h.proposed));callback(true);};
   Storage.dir='/'; Storage.exportTeam=packed=>packed+'\n'; h.team.filename='Example.txt';
   const save=load(storageSource,'Storage.saveTeamSnapshot',{Storage,window:{nodewebkit:true},fs:{readFile(file,encoding,callback){callback(null,newer?'newer file\n':h.team.team+'\r\n');}}});
   save.call(Storage,h.team,JSON.stringify(h.proposed),ok=>{result=ok;});
   assert.equal(result,!newer); assert.equal(writes,newer?0:1); assert.equal(h.team.team,JSON.stringify(h.before));
  }
 });
 it('desktop replacement retains the old file on write/rename errors and acknowledges only after rename', () => {
  for(const failure of ['write','rename','none']) {
   const files={'/Teams//Example.txt':'old'}, results=[]; let write,rename;
   const filesystem={mkdirSync(){},writeFile(file,data,callback){write=()=>{if(failure!=='write')files[file]=data;callback(failure==='write'?Error('full'):null);};},rename(from,to,callback){rename=()=>{if(failure!=='rename'){files[to]=files[from];delete files[from];}callback(failure==='rename'?Error('locked'):null);};},unlink(file,callback){delete files[file];callback();}};
   const Storage={exportTeam:()=> 'new\n'}, team={name:'Example',team:'packed',filename:'Example.txt'};
   const save=load(storageSource,'Storage.nwSaveTeam',{Storage,fs:filesystem});
   save.call({dir:'/',nwDeleteTeam(){throw Error('Existing path must not be deleted');}},team,ok=>results.push(ok));
   assert.deepEqual(results,[]); assert.equal(files['/Teams//Example.txt'],'old'); write();
   if(failure!=='write'){assert.deepEqual(results,[]);assert.equal(files['/Teams//Example.txt'],'old');rename();}
   assert.deepEqual(results,[failure==='none']); assert.equal(files['/Teams//Example.txt'],failure==='none'?'new\r\n':'old');
   assert.equal(Object.keys(files).length,1);
  }
 });
});
