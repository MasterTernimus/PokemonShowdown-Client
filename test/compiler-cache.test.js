'use strict';
const assert = require('assert').strict;
const fs = require('fs'), os = require('os'), path = require('path'), vm = require('vm');
const compiler = require('../build-tools/compiler');
const root = path.resolve(__dirname, '..');
const standard = {...eval('(' + fs.readFileSync(path.join(root, '.babelrc'), 'utf8') + ')'), babelrc: false, incremental: true};
describe('Compiler input validation and cache invalidation', () => {
 let dir, input, output;
 beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ps-compiler-cache-'));
  input = path.join(dir, 'input.ts'); output = path.join(dir, 'bundle.js');
  fs.writeFileSync(input, '// Keep this comment\nconst value: number = 3;\nglobalThis.result = value;');
 });
 afterEach(() => fs.rmSync(dir, {recursive: true, force: true}));
 it('skips an unchanged build without mutating caller options', async () => {
  const opts = {...standard};
  assert.equal(await compiler.compileToFile(input, output, opts), 1);
  assert.equal(await compiler.compileToFile(input, output, opts), 0);
  assert.deepEqual(opts, standard);
 });
 it('rebuilds changed settings and emits the requested result', async () => {
  await compiler.compileToFile(input, output, {...standard, comments: true});
  assert(fs.readFileSync(output, 'utf8').includes('Keep this comment'));
  assert.equal(await compiler.compileToFile(input, output, {...standard, comments: false}), 1);
  assert(!fs.readFileSync(output, 'utf8').includes('Keep this comment'));
 });
 for (const file of ['.babelrc', 'package-lock.json', 'node_modules/.package-lock.json']) {
  it('invalidates when ' + file + ' changes', async () => {
   await compiler.compileToFile(input, output, standard);
   const read = fs.readFileSync, exists = fs.existsSync, target = path.join(root, file);
   fs.existsSync = filename => path.resolve(String(filename)) === target || exists(filename);
   // Simulate a changed dependency/config file without editing the checkout.
   fs.readFileSync = function(filename, ...args) {
    const result = path.resolve(String(filename)) === target && !exists(filename) ? Buffer.from('{}') : read.call(this, filename, ...args);
    if (path.resolve(String(filename)) !== target) return result;
    return Buffer.isBuffer(result) ? Buffer.concat([result, Buffer.from('\n')]) : result + '\n';
   };
   try { assert.equal(await compiler.compileToFile(input, output, standard), 1); }
   finally { fs.readFileSync = read; fs.existsSync = exists; }
  });
 }
 it('detects source changes, reordered inputs and damaged output', async () => {
  const second = path.join(dir, 'second.ts'); fs.writeFileSync(second, 'globalThis.result = 9;');
  await compiler.compileToFile([input, second], output, standard);
  assert.equal(await compiler.compileToFile([second, input], output, standard), 2);
  let scope = {}; vm.runInNewContext(fs.readFileSync(output, 'utf8'), scope); assert.equal(scope.result, 3);
  fs.writeFileSync(input, 'globalThis.result = 7;');
  assert.equal(await compiler.compileToFile([second, input], output, standard), 2);
  fs.writeFileSync(output, 'broken');
  assert.equal(await compiler.compileToFile([second, input], output, standard), 2);
  scope = {}; vm.runInNewContext(fs.readFileSync(output, 'utf8'), scope); assert.equal(scope.result, 7);
 });
 it('rejects missing inputs before overwriting a working bundle or map', async () => {
  const opts = {...standard, sourceMaps: true};
  await compiler.compileToFile(input, output, opts);
  const code = fs.readFileSync(output), map = fs.readFileSync(output + '.map');
  const missing = path.join(dir, 'missing.ts');
  await assert.rejects(compiler.compileToFile([input, missing], output, opts), /Missing required compiler input:.*missing.ts/);
  assert.deepEqual(fs.readFileSync(output), code); assert.deepEqual(fs.readFileSync(output + '.map'), map);
  assert.equal(opts.incremental, true);
  fs.unlinkSync(input);
  await assert.rejects(compiler.compileToFile(input, output, opts), /Missing required compiler input/);
  assert.deepEqual(fs.readFileSync(output), code);
 });
 it('validates all requested directory roots before writing outputs', () => {
  const dest = path.join(dir, 'output');
  assert.throws(() => compiler.compileToDir([input, path.join(dir, 'missing')], dest, standard), /Missing required compiler input/);
  assert(!fs.existsSync(dest));
 });
 it('directory builds reuse unchanged outputs and rebuild changed options', () => {
  const dest = path.join(dir, 'output');
  const opts = {...standard, comments: true};
  assert.equal(compiler.compileToDir(input, dest, opts), 1);
  assert.equal(compiler.compileToDir(input, dest, opts), 0);
  assert.equal(compiler.compileToDir(input, dest, {...opts, comments: false}), 1);
  assert.equal(opts.incremental, true);
 });
});
