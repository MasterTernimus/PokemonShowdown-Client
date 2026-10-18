// Isolated visual regression: PLAYWRIGHT_MODULE, BROWSER_CHANNEL (optional), SPRITE_PHASE (before/after).
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert').strict;
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output=process.env.UI_ARTIFACT_DIR || require('os').tmpdir();
const root=path.resolve(__dirname,'../play.pokemonshowdown.com');
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!fs.existsSync(file)&&req.url.startsWith('/config/'))file=path.join(root,'..',req.url.split('?')[0]);try{let body=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');if(file.endsWith('testclient.html'))body=body.toString().replace('<script src="js/client-battle.js">','<script src="js/battle-animations.js"></script><script src="js/client-battle.js">');res.end(body);}catch{res.statusCode=404;res.end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});try{
const page=await browser.newPage({viewport:{width:1280,height:960}});const errors=[];page.on('pageerror',e=>{if(e.message!=='Failed to load because no supported source was found.')errors.push(e.message);});
await page.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();const file=path.resolve(root,'.'+new URL(r.request().url()).pathname);if(file.startsWith(path.resolve(root)+path.sep)&&/\.(png|gif|svg|webp|jpg)$/.test(file)&&fs.existsSync(file))return r.fulfill({path:file});return r.abort();});
await page.goto(base+'/testclient.html');await page.waitForFunction(()=>window.app&&window.Storage&&window.Dex);
await page.evaluate(()=>{document.documentElement.classList.add('dark');Dex.resourcePrefix='/';app.send=()=>{};const add=app.addPopup;app.addPopup=function(t,d){if(d?.cantconnect)return;return add.apply(this,arguments);};while(app.popups.length)app.closePopup();Storage.whenTeamsLoaded.load();BattleSound.setMute(true);app.playNotificationSound=()=>{};});

const phase=process.env.SPRITE_PHASE || 'after';
const ids=[...new Set(require('../play.pokemonshowdown.com/sprites/za-bw-credits.json').assets.map(a=>a.id))];
const roomid='battle-gen9doublescustomgame-2040';
const log=['|gen|9','|gametype|doubles','|player|p1|Preview','|player|p2|Opponent','|teamsize|p1|2','|teamsize|p2|2','|start','|switch|p1a: Chesnaught|Chesnaught-Mega, M|100/100','|switch|p1b: Swampert|Swampert-Mega, M|100/100','|switch|p2a: Chesnaught|Chesnaught-Mega, M|100/100','|switch|p2b: Abomasnow|Abomasnow-Mega, M|100/100','|turn|1'].join('\n');
await page.evaluate(({roomid,log})=>{app.receive('>'+roomid+'\n|init|battle\n'+log);app.focusRoom(roomid);app.rooms[roomid].battle.seekTurn(Infinity);},{roomid,log});
for(const width of [1280,390]){
 await page.setViewportSize({width,height:900});await page.evaluate(id=>app.rooms[id].updateLayout(),roomid);
 await page.locator('#room-'+roomid+' .battle img[src*="za-chesnaughtmega.gif"]').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
 assert.equal(await page.locator('#room-'+roomid+' .battle img[src*="za-chesnaughtmega.gif"]').count(),2);
 await page.locator('#room-'+roomid+' .battle').screenshot({path:output+'/mega-chesnaught-'+phase+'-'+width+'.png'});
}
for(const scale of [1,1.25,1.5,2]){
 const gallery=await browser.newPage({viewport:{width:1000,height:1000},deviceScaleFactor:scale});
 await gallery.route('https://sprite.test/**',r=>r.fulfill({path:path.join(root,'sprites',new URL(r.request().url()).pathname)}));
 const data=await page.evaluate(ids=>ids.map(id=>({id,front:Dex.getSpriteData(id,true,{gen:9}),back:Dex.getSpriteData(id,false,{gen:9})})),ids);
 const css=fs.readFileSync(path.join(root,'style/battle.css'),'utf8');
 for(let part=0;part<2;part++){
  const rows=data.slice(part*19,(part+1)*19);let html='<style>'+css+'</style><style>body{margin:0;background:#344454;color:white;font:14px sans-serif}.grid{display:grid;grid-template-columns:repeat(4,250px)}.card{height:180px;border:1px solid #76808b;padding:8px;box-sizing:border-box}.pair{display:flex;align-items:flex-end;gap:5px;height:140px}.battle{position:static;width:auto;height:auto;background:none;border:0;overflow:visible}.pair img{position:static}</style><div class="grid">';
  for(const row of rows)html+='<div class="card">'+row.id+'<div class="pair battle">'+[row.front,row.back].map(d=>'<img class="pixelated" width="'+d.w+'" height="'+d.h+'" src="https://sprite.test/'+d.url.split('/sprites/')[1]+'">').join('')+'</div></div>';
  await gallery.setContent(html+'</div>');await gallery.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  if(phase==='after')assert(await gallery.locator('img').evaluateAll(imgs=>imgs.every(i=>getComputedStyle(i).imageRendering==='pixelated')),'Keep ZA pixels crisp at '+scale);
  if(scale===1)await gallery.locator('.grid').screenshot({path:output+'/za-megas-'+phase+'-'+part+'.png'});
 }
 await gallery.close();
}
assert.deepEqual(errors,[]);console.log('PASS animated Mega fronts/backs, desktop/mobile battles, and display scaling: '+phase);
}finally{await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
