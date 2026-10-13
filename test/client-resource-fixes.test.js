'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm');
describe('Connection construction failures',()=>{
 const source=fs.readFileSync('play.pokemonshowdown.com/js/client.js','utf8');
 const body=source.slice(source.indexOf('connect: function () {')+'connect: function () {'.length,source.indexOf('\n\t\tdispatchFragment:')).replace(/},\s*$/, '');
 for(const failFirst of [true,false]) it('shows a connection failure without a null socket crash: initial='+failFirst,()=>{
  let count=0;const events=[];
  const ctx={location:{host:'example.org'},Config:{server:{host:'example.org',port:443,altport:8000},sockjsprefix:'/showdown'},$: {trim:s=>s.trim()},SockJS:function(){if(failFirst||count++)throw Error('blocked transport');return {};}};
  const connect=vm.runInNewContext('(function(){'+body+'})',ctx);
  const app={trigger:e=>events.push(e)};assert.doesNotThrow(()=>connect.call(app));
  if(!failFirst)assert.doesNotThrow(()=>app.socket.onclose());
  assert.deepEqual(events,['init:connectionerror']);assert.equal(app.socket,null);
 });
});
describe('Awaited catalog compilation',()=>{
 it('finishes writing bundles and preserves large JSON values',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ps-compiler-test-'));
  try {const input=path.join(dir,'input.ts'),output=path.join(dir,'output.js');
   const data={text:'literal __not_a_token__',values:Array.from({length:6000},(_,i)=>i)};
   fs.writeFileSync(input,'const CATALOG: any = '+JSON.stringify(data)+';globalThis.result = CATALOG;');
   fs.writeFileSync(output,'OLD');
   await require('../build-tools/compiler').compileToFile(input,output,{babelrc:false,plugins:['@babel/plugin-transform-typescript'],sourceMaps:true});
   const context={};vm.runInNewContext(fs.readFileSync(output,'utf8'),context);
   assert.deepEqual(JSON.parse(JSON.stringify(context.result)),data);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
 });
});
