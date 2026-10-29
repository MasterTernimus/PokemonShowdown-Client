'use strict';
const assert=require('assert').strict,fs=require('fs'),vm=require('vm'),ts=require('typescript');
const storageFile='play.pokemonshowdown.com/js/storage.js',toolsFile='play.pokemonshowdown.com/js/client-teambuilder.js';
const read=file=>fs.readFileSync(file,'utf8');
function assignment(file,lhs,scope={}) {
 const source=read(file),ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true),matches=[];
 function visit(n){if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.EqualsToken&&n.left.getText(ast)===lhs)matches.push(n.right.getText(ast));ts.forEachChild(n,visit);}visit(ast);
 assert(matches.length,lhs);return new Function(...Object.keys(scope),'return ('+matches[0]+');')(...Object.values(scope));
}
function prefs(fail=false){const source=read(storageFile),Storage={},values={};const context={Storage,localStorage:{getItem(){return null;},setItem(k,v){if(fail)throw Error('quota');values[k]=v;}}};vm.runInNewContext(source.slice(source.indexOf('Storage.prefs ='),source.indexOf('\n/**',source.indexOf('Storage.prefs ='))),context);return {Storage,values};}
describe('Client review state boundaries',function(){
 it('does not commit a rejected browser write or delete saved drafts',function(){
  const {Storage}=prefs(true);Storage.prefs.data={nicknamedrafts:{p:{rows:['edited']}}};let ok;
  assert.equal(Storage.prefs.commit({pokemontools:{builds:[1]},nicknamedrafts:{}},value=>ok=value),false);
  assert.equal(ok,false);assert.equal(Storage.prefs.data.nicknamedrafts.p.rows[0],'edited');assert.equal(Storage.prefs.data.pokemontools,undefined);
 });
 it('waits for acknowledgement, serializes writes and ignores no changes only after save',function(){
  const {Storage}=prefs(),pending=[];Storage.prefs.write=(text,done)=>pending.push({text,done});
  let first;assert.equal(Storage.prefs('alpha',1,true,ok=>first=ok),null);assert.equal(Storage.prefs.data.alpha,undefined);assert.equal(Storage.prefs('alpha'),1);
  Storage.prefs('beta',2);assert.equal(pending.length,1);pending[0].done(true);assert.equal(first,true);assert.equal(pending.length,2);
  assert.equal(Storage.prefs('alpha'),1);pending[1].done(true);assert.equal(Storage.prefs('beta'),2);
  assert.equal(Storage.prefs('alpha',1),true);assert.equal(pending.length,2);
 });
 it('does not dispatch a reentrant callback save twice',function(){
  const {Storage}=prefs(),pending=[];Storage.prefs.write=(text,done)=>pending.push(done);
  Storage.prefs('a',1,true,()=>Storage.prefs('b',2));pending[0](true);assert.equal(pending.length,2);pending[1](true);assert.equal(Storage.prefs('b'),2);
 });
 it('persists legacy in-place preference edits and direct save calls',function(){
  const {Storage,values}=prefs();Storage.prefs('list',{entries:[]});const entries=Storage.prefs('list');entries.entries.push('new');Storage.prefs('list',entries);
  assert.equal(JSON.parse(values.showdown_prefs).list.entries[0],'new');Storage.prefs.data.flag=true;Storage.prefs.save();assert.equal(JSON.parse(values.showdown_prefs).flag,true);
 });
 it('requires a genuine iframe acknowledgement and reports timeout or write failure',function(){
  for(const mode of ['success','rejected','timeout']) {
   const {Storage}=prefs(),timers=new Map(),sent=[];Storage.origin='https://storage.test';Storage.crossOriginRequestCount=0;Storage.crossOriginRequests={};Storage.whenPrefsLoaded={load(){}};
   let sequence=0;const frame={postMessage(data,origin){sent.push({data,origin});}};
   const onMessage=assignment(storageFile,'Storage.onMessage',{Storage,Config:{server:{}},localStorage:{setItem(){}},setTimeout:fn=>{timers.set(++sequence,fn);return sequence;},clearTimeout:id=>timers.delete(id)});
   onMessage({originalEvent:{origin:Storage.origin,source:frame,data:'p{}'}});
   let saved;Storage.prefs('build',{name:'Keep'},true,ok=>saved=ok);assert.equal(Storage.prefs.data.build,undefined);assert.equal(saved,undefined);
   const request=JSON.parse(sent[0].data.slice(1));assert.equal(sent[0].data.charAt(0),'Q');assert.equal(sent[0].origin,Storage.origin);
   onMessage({originalEvent:{origin:'https://evil.test',source:frame,data:'r'+JSON.stringify([request[0],true])}});assert.equal(saved,undefined);
   if(mode==='timeout') [...timers.values()][0]();else onMessage({originalEvent:{origin:Storage.origin,source:frame,data:'r'+JSON.stringify([request[0],mode==='success'])}});
   assert.equal(saved,mode==='success');assert.equal(!!Storage.prefs('build'),mode==='success');assert.equal(Object.keys(Storage.crossOriginRequests).length,0);
  }
 });
 it('storage iframe acknowledges only successful durable writes from its parent origin',function(){
  const source=read('play.pokemonshowdown.com/crossdomain.php'),code=source.slice(source.indexOf('function messageHandler(e)'),source.indexOf("window.addEventListener('message'"));
  for(const fail of [false,true]) {
   const replies=[],writes=[];const handler=new Function('yourOrigin','postReply','localStorage',code+';return messageHandler;')('https://client.test',reply=>replies.push(reply),{setItem(k,v){if(fail)throw Error('quota');writes.push([k,v]);}});
   handler({origin:'https://evil.test',data:'Q[1,"{}"]'});assert.equal(replies.length,0);
   handler({origin:'https://client.test',data:'Q[2,"{}"]'});assert.deepEqual(JSON.parse(replies[0].slice(1)),[2,!fail]);assert.equal(writes.length,fail?0:1);
  }
 });
 it('clones disguise identity through reordering, duplicate species, deleted targets and undo copies',function(){
  const Storage={};for(const name of ['setInitialDisguise','getInitialDisguiseSlot','bindInitialDisguises','cloneTeam'])Storage[name]=assignment(storageFile,'Storage.'+name,{Storage});
  const team=[{species:'Zorua',initialDisguise:2},{species:'Pikachu',name:'First'},{species:'Pikachu',name:'Second'}];
  Storage.bindInitialDisguises(team);team.push(team.splice(1,1)[0]);const before=Storage.cloneTeam(team),after=Storage.cloneTeam(before);after[2].name='Changed';
  assert.equal(Storage.getInitialDisguiseSlot(after[0],after),3);assert.equal(after[0]._initialDisguiseTarget.name,'Changed');assert.notEqual(after[0]._initialDisguiseTarget,team[2]);
  const undo=Storage.cloneTeam(before);assert.equal(undo[0]._initialDisguiseTarget.name,'First');
  team.pop();team.push({species:'Pikachu',name:'Replacement'});const removed=Storage.cloneTeam(team);assert.equal(Storage.getInitialDisguiseSlot(removed[0],removed),undefined);
 });
 it('prunes orphan bindings while retaining one undo and distinct duplicate teams',function(){
  const {Storage}=prefs();let id=0;const T={uid:()=>''+(++id)};
  T.teamSignature=assignment(toolsFile,'T.teamSignature');T.teamKey=assignment(toolsFile,'T.teamKey',{Storage,T});
  const state=assignment(toolsFile,'proto.teamToolState',{Storage,T});
  Storage.teams=[{name:'Same',team:'packed'},{name:'Same',team:'packed'}];const room={deletedTeam:{toolsKey:'undo',name:'Old',team:'old'},deletedTeamLoc:0};
  const data={teamProfiles:{orphan:{id:'x'},undo:{id:'u'}}};let records=state.call(room,data);assert.equal(records.length,3);assert.equal(new Set(records.map(x=>x.id)).size,3);assert(!data.teamProfiles.orphan);assert(data.teamProfiles.undo);
  room.deletedTeam=null;records=state.call(room,data);assert.equal(records.length,2);assert(!data.teamProfiles.undo);
  for(let i=0;i<100;i++){Storage.teams.push({name:'Temporary',team:'t'});state.call(room,data);Storage.teams.pop();}assert.equal(state.call(room,data).length,2);
 });
 it('keeps the library edit recoverable when saving fails',function(){
  const {Storage}=prefs(true),T={clone:x=>JSON.parse(JSON.stringify(x)),teamKey:()=>''};const messages=[];
  const room={teamToolState:()=>[],nicknameEditRevision:1,$(){return {text(){}};}};
  const save=assignment(toolsFile,'proto.saveToolsData',{Storage,T,app:{addPopupMessage:m=>messages.push(m)}});
  const data={version:1,builds:[{name:'Keep me'}],nicknames:[]};assert.equal(save.call(room,data),false);
  assert.equal(room.toolsPendingData.builds[0].name,'Keep me');assert.equal(Storage.prefs('pokemontools'),undefined);assert.equal(messages.length,1);
 });
 it('prevents synchronous bulk edits and undo from overwriting an in-flight save',function(){
  const Storage={prefs:{queue:[{}]}},messages=[],app={addPopupMessage:m=>messages.push(m)};
  const room={$(){return {text(m){messages.push(m);}};}};
  for(const lhs of ['proto.confirmSetProfile','p.undoLibraryChange','p.applyGroupBatch','p.applySelectedProfileTeam']) {
   // Each guard returns before accessing a snapshot, mutating teams or persisting stale preferences.
   assignment(toolsFile,lhs,{Storage,app}).call(room);
  }
  assert.equal(messages.length,4);assert(messages.every(m=>m.includes('current save')));
 });
});
describe('Client review small runtime fixes',function(){
 it('removes global room listeners and refresh timers through the view lifecycle',function(){
  const context={_:require('lodash')};context.self=context;vm.runInNewContext(read('play.pokemonshowdown.com/js/lib/backbone.js'),context);
  const Backbone=context.Backbone,app=Object.assign({user:Object.assign({},Backbone.Events),send(){},roomsData:{}},Backbone.Events);
  const active=new Set();let ticks=0;const dom={addClass(){return this;},html(){return this;}};
  const Room=Backbone.View.extend({remove(){this.stopListening();return this;}});
  const host={Room,app,Dex:{prefs(){}},jQuery:{},setInterval(){active.add(++ticks);return ticks;},clearInterval:id=>active.delete(id)};
  vm.runInNewContext(read('play.pokemonshowdown.com/js/client-rooms.js'),host);
  const proto=host.RoomsRoom.prototype;
  for(let i=0;i<10;i++){const room=Object.create(proto);room.$el=dom;room.update=()=>{};room.initialize();assert.equal(active.size,1);room.remove();assert.equal(active.size,0);}
  assert(!app._events || !app._events['response:rooms']);assert(!app.user._events || !app.user._events['change:named']);
 });
 it('applies BGM volume during playback without restarting and retains mute/pause behavior',function(){
  const output=ts.transpileModule(read('play.pokemonshowdown.com/src/battle-sound.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  let plays=0;const audio={currentTime:3,play(){plays++;},pause(){}};const context={exports:{},window:{HTMLAudioElement:true},document:{createElement(){return audio;}},Config:{routes:{client:'example.test'}},setTimeout(){},clearTimeout(){}};
  vm.runInNewContext(output,context);const sound=context.exports.BattleSound,bgm=sound.loadBgm('song.mp3',1000,10000);bgm.play();audio.currentTime=3;const count=plays;sound.setBgmVolume(20);assert.equal(audio.volume,sound.bgmVolume/100);assert.equal(plays,count);assert.equal(audio.currentTime,3);
  bgm.pause();sound.setBgmVolume(60);assert.equal(plays,count);bgm.play();assert.equal(audio.volume,sound.bgmVolume/100);sound.setMute(true);assert.equal(bgm.isActuallyPlaying,false);sound.setMute(false);assert.equal(bgm.isActuallyPlaying,true);
 });
 it('selects a framework directory rather than the preceding regular file',function(){
  const source=read('desktop/sign-mac-app'),start=source.indexOf('let currentVersionDir;'),end=source.indexOf('\nif (!currentVersionDir)',start);
  const selected=new Function('fs','frameworksDir',source.slice(start,end)+';return currentVersionDir;')({readdirSync:()=>['.DS_Store','123'],statSync:p=>({isDirectory:()=>!p.endsWith('.DS_Store')})},'/Framework');assert.equal(selected,'/Framework/Versions/123');
 });
 it('retains one calculator input route and only final navigation/backup implementations',function(){
  const main=read('play.pokemonshowdown.com/js/client-mainmenu.js');assert(main.includes("'input input': 'scenarioEdited'"));assert(!main.includes("'input .calc-move-entry'"));assert(!main.includes('p.editComparisonMove ='));
  const tools=read(toolsFile);assert.equal((tools.match(/proto.returnToPokemonEditor =/g)||[]).length,1);assert.equal((tools.match(/proto.downloadToolsBackup =/g)||[]).length,0);assert(tools.includes('var back = p.returnToPokemonEditor;'));
 });
});
