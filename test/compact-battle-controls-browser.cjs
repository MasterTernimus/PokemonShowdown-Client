// Isolated browser regression: PS_SERVER_SOURCE, PLAYWRIGHT_MODULE, BROWSER_CHANNEL (optional).
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert').strict;
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
if (!process.env.PS_SERVER_SOURCE) throw Error('PS_SERVER_SOURCE is required');
const {Battle}=require(path.join(process.env.PS_SERVER_SOURCE,'dist/sim'));
const output=process.env.UI_ARTIFACT_DIR || require('os').tmpdir();
const root=path.resolve(__dirname,'../play.pokemonshowdown.com');
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!fs.existsSync(file)&&req.url.startsWith('/config/'))file=path.join(root,'..',req.url.split('?')[0]);try{let body=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');if(file.endsWith('testclient.html'))body=body.toString().replace('<script src="js/client-battle.js">','<script src="js/battle-animations.js"></script><script src="js/client-battle.js">');res.end(body);}catch{res.statusCode=404;res.end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});try{
const page=await browser.newPage({viewport:{width:1280,height:960}});const errors=[];page.on('pageerror',e=>{if(e.message!=='Failed to load because no supported source was found.')errors.push(e.message);});
await page.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();const file=path.resolve(root,'.'+new URL(r.request().url()).pathname);if(file.startsWith(path.resolve(root)+path.sep)&&/\.(png|gif|svg|webp|jpg)$/.test(file)&&fs.existsSync(file))return r.fulfill({path:file});return r.abort();});
await page.goto(base+'/testclient.html');await page.waitForFunction(()=>window.app&&window.Storage&&window.Dex);
await page.evaluate(()=>{document.documentElement.classList.add('dark');Dex.resourcePrefix='/';app.send=()=>{};const add=app.addPopup;app.addPopup=function(t,d){if(d?.cantconnect)return;return add.apply(this,arguments);};while(app.popups.length)app.closePopup();Storage.whenTeamsLoaded.load();BattleSound.setMute(true);app.playNotificationSound=()=>{};});
const team=['Togekiss','Scolipede','Lucario','Banette','Typhlosion','Kangaskhan'].map(species=>({species,ability:species==='Togekiss'?'Serene Grace':'No Ability',teraType:'Stellar',moves:species==='Togekiss'?['gildedarrow','timeblade','protect','ancientpower']:['splash']}));
const b=new Battle({formatid:'gen9nofieldsinglesgame',challengeOptions:{gimmicks:2},p1:{name:'Preview',team},p2:{name:'Opponent',team:[{species:'Mew',ability:'No Ability',moves:['splash']}]}});b.makeChoices('team','team');
const roomid='battle-gen9nofieldsinglesgame-1002',request=b.getRequests('move')[0];
await page.evaluate(({roomid,log,request})=>{app.receive('>'+roomid+'\n|init|battle\n'+log);app.focusRoom(roomid);const r=app.rooms[roomid];r.battle.seekTurn(Infinity);r.receiveRequest(request);r.updateControls();},{roomid,log:b.log.join('\n'),request});
for(const width of [1280,390]){
await page.setViewportSize({width,height:960});await page.evaluate(id=>app.rooms[id].updateLayout(),roomid);
await page.locator('[name=terastallize]').check();assert(await page.locator('[name=terastallize]').isChecked());await page.locator('[name=terastallize]').uncheck();
assert.equal(await page.locator('.battle-move-grid [name=chooseMove]:visible').count(),4);assert.equal(await page.locator('.battle-move-grid .gilded-battle-profile:visible').count(),0);
const boxes=await page.locator('.battle-move-grid [name=chooseMove]:visible').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,w:e.clientWidth,sw:e.scrollWidth})));
assert(boxes.every(b=>b.sw<=b.w+1),'move overflow '+width);assert.equal(new Set(boxes.map(b=>b.y)).size,width===390?2:1);
const switches=await page.locator('.switchcontrols [name=chooseSwitch]').evaluateAll(es=>es.map(e=>({w:e.clientWidth,sw:e.scrollWidth})));assert(switches.every(b=>b.sw<=b.w+1),'switch overflow');
await page.locator('.battle-controls').screenshot({path:output+'/compact-battle-controls-'+width+'.png'});
console.log('PASS battle controls',width);
}
await page.setViewportSize({width:1280,height:960});
// Exercise optional move menus with the real client request renderer.
for(const kind of ['z','max']){
const variant=JSON.parse(JSON.stringify(request));if(kind==='z'){variant.active[0].canZMove=variant.active[0].moves.map(m=>({move:m.move,target:m.target}));delete variant.active[0].canDynamax;}else{delete variant.active[0].canZMove;variant.active[0].canDynamax=true;variant.active[0].maxMoves={maxMoves:variant.active[0].moves.map(m=>({move:'Max Strike',target:'normal'}))};}
await page.evaluate(({roomid,variant})=>app.rooms[roomid].receiveRequest(variant),{roomid,variant});const toggle=page.locator('[name='+ (kind==='z'?'zmove':'dynamax')+']');await toggle.check();assert.equal(await page.locator('.movebuttons-'+kind+' [name=chooseMove]:visible').count(),4);assert.equal(await page.locator('.movebuttons-no'+kind+' [name=chooseMove]:visible').count(),0);await toggle.uncheck();assert.equal(await page.locator('.movebuttons-no'+kind+' [name=chooseMove]:visible').count(),4);
}
await page.evaluate(({roomid,request})=>app.rooms[roomid].receiveRequest(request),{roomid,request});
await page.setViewportSize({width:1280,height:540});await page.evaluate(id=>app.rooms[id].updateLayout(),roomid);await page.locator('[name=selectSwitch]').click();assert.equal(await page.locator('.switchcontrols [name=chooseSwitch]:visible').count(),5);await page.locator('[name=selectMove]').click();assert.equal(await page.locator('.battle-move-grid [name=chooseMove]:visible').count(),4);console.log('PASS Z/Max toggles and short-window Attack/Switch controls');
await page.setViewportSize({width:1280,height:960});
const d=new Battle({formatid:'gen9nofielddoublesbattle',p1:{name:'Preview',team:[{species:'Glimmora',ability:'No Ability',moves:['mortalspin']},{species:'Chansey',ability:'No Ability',moves:['splash']}]},p2:{name:'Opponent',team:[{species:'Chansey',ability:'No Ability',moves:['splash']},{species:'Blissey',ability:'No Ability',moves:['splash']}]}});d.makeChoices('team 12','team 12');
const dr='battle-gen9doublescustomgame-1003';await page.evaluate(({id,log,req})=>{app.receive('>'+id+'\n|init|battle\n'+log);app.focusRoom(id);const r=app.rooms[id];r.battle.seekTurn(Infinity);r.receiveRequest(req);},{id:dr,log:d.log.join('\n'),req:d.getRequests('move')[0]});await page.locator('#room-'+dr+' [name=chooseMove]').first().click();assert.equal(await page.locator('#room-'+dr+' [name=chooseMoveTarget][value="1"]').count(),1);assert.equal(await page.locator('#room-'+dr+' [name=chooseMoveTarget][value="2"]').count(),1);await page.locator('#room-'+dr+' [name=chooseMoveTarget][value="2"]').click();assert.equal(await page.evaluate(id=>app.rooms[id].choice.choices[0],dr),'move 1 2');d.destroy();console.log('PASS Mortal Spin selects one opponent in doubles');
const cocoonBattle=new Battle({formatid:'gen9nofieldsinglesgame',p1:{name:'Preview',team:[{species:'Ariados',ability:'Insomnia',item:'Aridiate',moves:['splash']}]},p2:{name:'Opponent',team:[{species:'Mew',ability:'No Ability',moves:['splash','tackle']}]}});
cocoonBattle.makeChoices('team 1','team 1');cocoonBattle.makeChoices('move splash mega','move splash');
const cocoonRoom='battle-gen9nofieldsinglesgame-1004';
await page.evaluate(({id,log})=>{app.receive('>'+id+'\n|init|battle\n'+log);app.focusRoom(id);app.rooms[id].battle.seekTurn(Infinity);},{id:cocoonRoom,log:cocoonBattle.log.join('\n')});
const cocoonBadge=page.locator('#room-'+cocoonRoom+' .ability-active-cocoon');
assert.equal(await cocoonBadge.count(),1);assert.equal(await cocoonBadge.textContent(),'Cocoon');
for(const width of [1280,390]){await page.setViewportSize({width,height:960});await page.evaluate(id=>app.rooms[id].updateLayout(),cocoonRoom);const fits=await cocoonBadge.evaluate(el=>{const box=el.getBoundingClientRect(),bar=el.closest('.statbar').getBoundingClientRect();return box.width<=bar.width&&box.height<24;});assert(fits);await page.locator('#room-'+cocoonRoom+' .battle').screenshot({path:output+'/cocoon-indicator-'+width+'.png'});}
const consumedAt=cocoonBattle.log.length;cocoonBattle.makeChoices('move splash','move tackle');
await page.evaluate(({id,log})=>{app.receive('>'+id+'\n'+log);app.rooms[id].battle.seekTurn(Infinity);},{id:cocoonRoom,log:cocoonBattle.log.slice(consumedAt).join('\n')});
assert.equal(await cocoonBadge.count(),0);cocoonBattle.destroy();console.log('PASS Cocoon badge: desktop/mobile layout and removal after absorbed hit');
await page.setViewportSize({width:1280,height:960});
await page.evaluate(()=>{app.joinRoom('teambuilder');app.focusRoom('teambuilder');const r=app.rooms.teambuilder;const team={name:'UI preview',format:'gen9nofieldsinglesgame',gen:9,dex:Dex,capacity:6,team:''};Storage.teams=[team];r.curTeam=team;r.curTeamLoc=0;r.curSetList=[{species:'',ability:'',moves:[],item:'',evs:{},nature:'Serious'}];Storage.activeSetList=r.curSetList;r.curSet=r.curSetList[0];r.curSetLoc=0;r.curChartName='pokemon';r.curChartType='pokemon';r.updateSetView();r.updateChart();window.passiveLookups=0;const get=Dex.getPassiveAbilityDetails;Dex.getPassiveAbilityDetails=function(){window.passiveLookups++;return get.apply(this,arguments);};const ids=['alomomola','ampharosavevian','archaludon','banettemega','butterfree','charizardmegay','kingambit'];r.search.$el.html('<ul class="utilichart">'+ids.filter(id=>Dex.species.get(id).exists).map(id=>r.search.renderPokemonRow(Dex.species.get(id),'',0,0)).join('')+'</ul>');});
assert.equal(await page.locator('.species-info-button').count(),0);
assert.equal(await page.evaluate(()=>window.passiveLookups),0);
const badge=page.locator('.pokemon-passive-badge').first();await badge.hover();assert.equal(await page.locator('.pokemon-passive-tooltip:visible').count(),0);await badge.click();assert.equal(await page.locator('.pokemon-passive-tooltip:visible').count(),1);assert.equal(await page.evaluate(()=>app.rooms.teambuilder.curSet.species),'');
await page.mouse.wheel(0,100);await page.waitForFunction(()=>!document.querySelector('.pokemon-passive-badge[aria-expanded="true"]'));
await badge.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.pokemon-passive-tooltip:visible').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('.pokemon-passive-tooltip:visible').count(),0);
for(const width of [1280,390]){await page.setViewportSize({width,height:960});await page.locator('.utilichart').last().screenshot({path:output+'/compact-pokemon-list-'+width+'.png'});}
const lifecycle = await page.evaluate(() => {
 const r=app.rooms.teambuilder, el=r.el;
 const count=()=>($._data(el,'events').pointerdown||[]).filter(h=>h.namespace==='passivehelp').length;
 const before=count(), listeners=new Set(), add=el.addEventListener, remove=el.removeEventListener;
 el.addEventListener=function(type,callback,...args){if(type==='scroll')listeners.add(callback);return add.call(this,type,callback,...args);};
 el.removeEventListener=function(type,callback,...args){if(type==='scroll')listeners.delete(callback);return remove.call(this,type,callback,...args);};
 try {
  for(let i=0;i<30;i++)r.updateSetView();
  const after=count(), active=listeners.size;
  r.updateTeamView();
  const left=count(), remaining=listeners.size;
  r.updateSetView();
  const reopened=count(), exits=[];
  for(const method of ['showRosterProfiles','showToolsManager','showTeamValidation']) {
   r[method]();r.updateChart();exits.push([count(),listeners.size]);
   r.profilesView=false;r.toolsView=false;r.validationView=false;r.updateSetView();
  }
  return {before,after,active,left,remaining,reopened,exits};
 } finally {el.addEventListener=add;el.removeEventListener=remove;}
});
assert.deepEqual(lifecycle,{before:1,after:1,active:2,left:0,remaining:0,reopened:1,exits:[[0,0],[0,0],[0,0]]});
console.log('PASS 30 editor rebuilds and team navigation: search handlers stay bounded and are removed on exit');
assert.deepEqual(errors,[]);console.log('PASS teambuilder: no eager descriptions, no hover panels, click/keyboard details, scroll closes, no accidental selection');b.destroy();
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
