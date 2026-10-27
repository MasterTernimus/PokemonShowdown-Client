'use strict';
const assert=require('assert').strict,fs=require('fs'),os=require('os'),path=require('path');
const load=require('../build-tools/production-news');
describe('Production news preservation',()=>{
 let root;
 beforeEach(()=>{root=fs.mkdtempSync(path.join(os.tmpdir(),'ps-news-'));fs.mkdirSync(path.join(root,'config'));});
 afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
 it('fails closed when the news source or PHP is missing',()=>{
  assert.throws(()=>load(root),/requires config/);
  fs.writeFileSync(path.join(root,'config/news.inc.php'),'fixture');
  assert.throws(()=>load(root,()=>{throw Error('PHP missing');}),/PHP missing/);
 });
 it('retains real content and rejects empty or malformed news',()=>{
  fs.writeFileSync(path.join(root,'config/news.inc.php'),'fixture');
  assert.deepEqual(load(root,()=>JSON.stringify([5,'<p>Actual production news</p>'])),[5,'<p>Actual production news</p>']);
  for(const value of ['bad JSON','[]','[0,""]'])assert.throws(()=>load(root,()=>value));
 });
});
