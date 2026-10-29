'use strict';
const assert=require('assert'),cp=require('child_process'),http=require('http'),path=require('path');
const php=process.env.PHP_BIN||'php';
const phpArgs=process.env.PHP_EXTENSION_DIR?['-d','extension_dir='+process.env.PHP_EXTENSION_DIR,'-d','extension=curl']:[];
const probe=cp.spawnSync(php,[...phpArgs,'-r','exit(function_exists("curl_init") ? 0 : 1);']);
(probe.status===0?describe:describe.skip)('bounded custom CSS upstream fetching',function(){
 this.timeout(16000);
 let server,url;
 before(done=>{server=http.createServer((req,res)=>{
  if(req.url==='/stall')return;
  if(req.url==='/large'){res.writeHead(200);return res.end('x'.repeat(2000));}
  if(req.url==='/unchanged'){res.writeHead(304);return res.end();}
  res.end('body { color: red; }');
 }).listen(0,'127.0.0.1',()=>{url='http://127.0.0.1:'+server.address().port;done();});});
 after(done=>{server.closeAllConnections();server.close(done);});
 function fetch(route){return new Promise((resolve,reject)=>{
  const code='require $argv[1]; echo json_encode(fetchCustomCSS($argv[2], [], 1024));';
  cp.execFile(php,[...phpArgs,'-d','error_reporting=22527','-r',code,path.resolve(__dirname,'../lib/customcss-fetch.lib.php'),url+route],{timeout:13000},(e,out)=>{if(e)return reject(e);try{resolve(JSON.parse(out));}catch(err){reject(err);}});
 });}
 it('accepts an ordinary stylesheet',async()=>{const r=await fetch('/ok');assert.equal(r.ok,true);assert.equal(r.status,200);});
 it('rejects an oversized body without buffering it fully',async()=>{const r=await fetch('/large');assert.equal(r.ok,false);assert(r.body.length<=1024);});
 it('recognizes a bodyless 304',async()=>{const r=await fetch('/unchanged');assert.equal(r.ok,true);assert.equal(r.status,304);});
 it('bounds a stalled response',async()=>{const r=await fetch('/stall');assert.equal(r.ok,false);});
});
