'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const {sourceFingerprint} = require('../build-tools/fresh-server-build');
const code = fs.readFileSync(path.join(__dirname, '../build-tools/prepare-approved-client-data'), 'utf8');

describe('Approved client preparation source boundary', () => {
 let root, source, client, manifest;
 beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'approved-client-'));
  source = path.join(root, 'server'); client = path.join(root, 'client');
  for (const directory of ['data', 'sim', 'server']) fs.mkdirSync(path.join(source, directory), {recursive:true});
  fs.mkdirSync(path.join(client, 'play.pokemonshowdown.com/data'), {recursive:true});
  fs.writeFileSync(path.join(source, 'data/pokedex.ts'), 'approved data');
  fs.writeFileSync(path.join(source, 'sim/pokemon.ts'), 'approved engine');
  fs.writeFileSync(path.join(source, 'server/chat-formatter.ts'), 'approved formatter');
  for (const name of ['pokedex-mini.js', 'pokedex-mini-bw.js']) fs.writeFileSync(path.join(client, 'play.pokemonshowdown.com/data', name), 'sprite fixture');
  manifest = {sourceHead:'approved-commit', files:['data/pokedex.ts'], sourceDataSHA256:crypto.createHash('sha256').update('data/pokedex.ts').update('approved data').digest('hex'), builtSourceFingerprint:sourceFingerprint(source)};
 });
 afterEach(() => {
  assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
  assert(path.basename(root).startsWith('approved-client-'));
  fs.rmSync(root, {recursive:true,force:true});
 });
 function prepare(onSync, onFieldExport) {
  const writes = new Map(), stages = [], invocations = [];
  const mockFs = {...fs,
   readFileSync(file, ...args) {return writes.has(file) ? writes.get(file) : fs.readFileSync(file,...args);},
   writeFileSync(file, data) {writes.set(file,data);},
  };
  const cp = {execFileSync(command,args,options) {
   if(command === 'git')return manifest.sourceHead;
   stages.push(args[0]);
   invocations.push({args:Array.from(args),cwd:options.cwd});
   if(args[0] === 'build-tools/sync-working-server-data') {
    if(onSync)onSync();
    writes.set(path.join(client,'server-data-sync-manifest.json'),JSON.stringify({...manifest,builtSourceFingerprint:sourceFingerprint(source)}));
   }
   if(args[0] === 'tools/export-client-field-rules.cjs' && onFieldExport)onFieldExport();
  }};
  let error;
  try {vm.runInNewContext(code,{__dirname:path.join(client,'build-tools'),process:{execPath:process.execPath,env:{PS_SERVER_SOURCE:source}},console:{log(){}},require(id) {
   if(id === 'fs')return mockFs;
   if(id === 'child_process')return cp;
   if(id === '../server-data-sync-manifest.json')return manifest;
   if(id === './fresh-server-build')return {sourceFingerprint};
   return require(id);
  }});} catch (err) {error=err;}
  return {error,stages,invocations,provenance:writes.get(path.join(client,'client-data-provenance.json'))};
 }
 it('allows stable approved inputs and records their original fingerprint', () => {
  const result=prepare();assert.ifError(result.error);
  assert.equal(JSON.parse(result.provenance).builtSourceFingerprint,manifest.builtSourceFingerprint);
  assert.equal(result.stages[0],'build-tools/sync-working-server-data');
  assert.deepEqual(result.invocations[1],{args:['tools/export-client-field-rules.cjs',client],cwd:source});
  assert(result.stages.indexOf('tools/export-client-field-rules.cjs') < result.stages.indexOf('build'));
 });
 it('stops before compilation and provenance when field-rule export fails', () => {
  const result=prepare(undefined,()=>{throw Error('field export failed');});
  assert.match(result.error.message,/field export failed/); assert.equal(result.provenance,undefined);
  assert(!result.stages.includes('build'));
 });
 for(const file of ['sim/pokemon.ts','server/chat-formatter.ts']) {
  it('rejects unapproved '+file+' before any build/export stage', () => {
   fs.appendFileSync(path.join(source,file),'\nunreviewed overlay');
   const result=prepare();assert.match(result.error.message,/build inputs differ/);
   assert.equal(result.stages.length,0);assert.equal(result.provenance,undefined);
  });
  it('rejects '+file+' changes during export even when the exporter replaces the manifest fingerprint', () => {
   const result=prepare(()=>fs.appendFileSync(path.join(source,file),'\nchanged during export'));
   assert.match(result.error.message,/Server changed during client preparation/);assert.equal(result.provenance,undefined);
  });
 }
});
