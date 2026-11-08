'use strict';
// Isolate large browser fixtures so a full run does not retain every VM and sprite table.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..'),output=path.join(root,'caches/test-shards');
fs.mkdirSync(output,{recursive:true});
const files=fs.readdirSync(path.join(root,'test')).filter(f=>f.endsWith('.js')).sort();
const results=[];
for(let i=0;i<files.length;i+=10){
 const batch=files.slice(i,i+10),name=String(i/10).padStart(3,'0');
 const child=cp.spawnSync(process.execPath,[require.resolve('mocha/bin/mocha'), '--no-config',
  '--require','./test/helpers/browser-globals.cjs','--reporter','json','--timeout','15000','--forbid-only','--exit',
  ...batch.map(f=>'test/'+f)],{cwd:root,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:64*1024*1024});
 const log=(child.stdout||'')+'\n'+(child.stderr||'');
 fs.writeFileSync(path.join(output,name+'.log'),log);
 let report;const start=log.search(/\{\s*"stats"\s*:/);
 if(start>=0)try{report=JSON.parse(log.slice(start,log.lastIndexOf('}')+1));}catch{}
 results.push({files:batch,exit:child.status,error:child.error?.message,stats:report?.stats,failures:report?.failures,log:name+'.log'});
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
 console.log(name+': '+(report?`${report.stats.passes} passed, ${report.stats.failures} failed, ${report.stats.pending} pending`:'FAILED: no complete report'));
}
const summary={files:files.length,passes:0,failures:0,pending:0,incomplete:0};
for(const r of results){for(const key of ['passes','failures','pending'])summary[key]+=r.stats?.[key]||0;if(!r.stats)summary.incomplete++;}
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary));
process.exitCode=results.some(r=>r.exit!==0||!r.stats||r.stats.failures)?1:0;
