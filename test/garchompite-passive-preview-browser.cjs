// Isolated browser regression: PS_SERVER_SOURCE, PLAYWRIGHT_MODULE, BROWSER_CHANNEL (optional).
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert').strict;
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
if (!process.env.PS_SERVER_SOURCE) throw Error('PS_SERVER_SOURCE is required');
const {Battle}=require(path.join(process.env.PS_SERVER_SOURCE,'dist/sim'));
const output=process.env.UI_ARTIFACT_DIR || require('os').tmpdir();
const root=path.resolve(__dirname,'../play.pokemonshowdown.com');
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!fs.existsSync(file)&&req.url.startsWith('/config/'))file=path.join(root,'..',req.url.split('?')[0]);try{let body=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(body);}catch{res.statusCode=404;res.end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});try{
const page=await browser.newPage({viewport:{width:1280,height:960},hasTouch:true});const errors=[];page.on('pageerror',e=>{if(!['Failed to load because no supported source was found.','The element has no supported sources.'].includes(e.message))errors.push(e.message);});
await page.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();const file=path.resolve(root,'.'+new URL(r.request().url()).pathname);if(file.startsWith(path.resolve(root)+path.sep)&&/\.(png|gif|svg|webp|jpg)$/.test(file)&&fs.existsSync(file))return r.fulfill({path:file});return r.abort();});
await page.goto(base+'/testclient.html');await page.waitForFunction(()=>window.app&&window.Storage&&window.Dex);
await page.evaluate(()=>{document.documentElement.classList.add('dark');Dex.resourcePrefix='/';app.send=()=>{};const add=app.addPopup;app.addPopup=function(t,d){if(d?.cantconnect)return;return add.apply(this,arguments);};while(app.popups.length)app.closePopup();Storage.whenTeamsLoaded.load();BattleSound.setMute(true);app.playNotificationSound=()=>{};});
if (!await page.evaluate(() => typeof BattleScene === 'function')) await page.addScriptTag({url:base+'/js/battle-animations.js'});

for (const width of [1280, 390]) {
 await page.setViewportSize({width,height:960});
 const team=['Garchomp','Hydreigon','Charizard','Gardevoir','Salamence','Espeon'].map(species=>({species,ability:species==='Gardevoir'?'Void Veil':'No Ability',item:species==='Garchomp'?'Garchompite':'',moves:['dragonpulse','protect','earthquake','tackle']}));
 const battle=new Battle({formatid:'gen9nofieldsinglesgame',p1:{name:'Preview',team},p2:{name:'Opponent',team:[{species:'Mew',ability:'No Ability',moves:['splash']}]}});
 const id='battle-gen9nofieldsinglesgame-'+width;
 await page.evaluate(({id,log,request})=>{app.receive('>'+id+'\n|init|battle\n'+log);app.focusRoom(id);const r=app.rooms[id];r.battle.seekTurn(Infinity);r.receiveRequest(request);r.updateControls();r.updateLayout();},{id,log:battle.log.join('\n'),request:battle.getRequests('teampreview')[0]});
 const scope=page.locator('#room-'+id);
 const hydreigon=scope.locator('.battle .team-preview-sprite[src*="gen5ani-back/hydreigon.gif"]');
 await hydreigon.evaluate(img=>img.decode());assert.equal(await hydreigon.getAttribute('width'),'82');assert.equal(await hydreigon.getAttribute('height'),'112');
 await scope.locator('.battle').screenshot({path:output+'/hydreigon-preview-after-'+width+'.png'});
 battle.makeChoices('team','team');
 await page.evaluate(({id,log,request})=>{const r=app.rooms[id];r.battle.reset();r.battle.setQueue(log.split('\n'));r.battle.seekTurn(Infinity);r.receiveRequest(request);r.updateControls();window.sentChoices=[];r.sendDecision=choice=>window.sentChoices.push(choice);},{id,log:battle.log.join('\n'),request:battle.getRequests('move')[0]});
 assert((await scope.locator('label.megaevo').allTextContents()).some(t=>t.includes('Garchomp-Mega-Z')));
 await scope.locator('input[name=megaevox]').check();
 await scope.locator('.battle-controls').screenshot({path:output+'/garchompite-choice-after-'+width+'.png'});
 await scope.locator('button[name=chooseMove]').first().click();
 assert(JSON.stringify(await page.evaluate(()=>window.sentChoices)).includes('megax'));
 battle.makeChoices('move 1 megax','move splash');assert.equal(battle.p1.active[0].species.name,'Garchomp-Mega-Z');battle.destroy();
 console.log('PASS Hydreigon preview and Garchompite Z choice at '+width);
}
const b=new Battle({formatid:'gen9nofieldsinglesgame',p1:{name:'Preview',team:[{species:'Gardevoir',ability:'Void Veil',item:'Focus Sash',moves:['mistball','drainingkiss','protect','psychic']}]},p2:{name:'Opponent',team:[{species:'Lycanroc',ability:'No Ability',moves:['megakick']}]}});b.makeChoices('team','team');
const id='battle-gen9nofieldsinglesgame-9001';
const display=await page.evaluate(({id,log,request})=>{app.receive('>'+id+'\n|init|battle\n'+log);app.focusRoom(id);const r=app.rooms[id];r.battle.seekTurn(Infinity);r.receiveRequest(request);r.updateControls();const p=r.battle.p1.active[0];return {ability:p.ability,html:r.tooltips.showPokemonTooltip(p,r.battle.myPokemon[0],true)};},{id,log:b.log.join('\n'),request:b.getRequests('move')[0]});
assert.notEqual(display.ability,'Forewarn');assert(display.html.includes('Void Veil'));assert(display.html.includes('Breaking News'));assert(!/Ability:\s*Forewarn/.test(display.html));b.destroy();
assert.deepEqual(errors,[]);console.log('PASS real Breaking News reveal retains the correct active tooltip');
}finally{await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
