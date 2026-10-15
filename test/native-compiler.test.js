'use strict';
const assert = require('assert').strict;
const fs = require('fs'), os = require('os'), path = require('path'), vm = require('vm');
const compiler = require('../build-tools/compiler');
const standard = {...eval('(' + fs.readFileSync('.babelrc', 'utf8') + ')'), babelrc: false};

describe('Native catalog compiler', () => {
 it('matches Babel globals, closures, class fields, inheritance and module stripping', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'native-catalog-'));
  try {
   const input = path.join(dir, 'catalog.ts');
   fs.writeFileSync(input, `// Unicode before a module: ♀\nimport {unused} from 'not-loaded';
export const phrase: string = 'import and export stay in strings';
class Base { value = 3; read() {return this.value;} }
export class Child extends Base { read() {return super.read() + 2;} }
const callbacks: (() => number)[] = [0, 1, 2].map(index => () => index);

const values = [1, 2]; const object = {old: true, ...{value: 7}};
const maybe: {value?: number} = {};
globalThis.result = {phrase, child: new Child().read(), callbacks: callbacks.map(f => f()), values: [...values, 3], object, fallback: maybe?.value ?? 4};
export default globalThis.shouldNotRun = true;
export {phrase};`);
   const results = [];
   for (const fast of [false, true]) {
    const output = path.join(dir, fast ? 'native.js' : 'babel.js');
    await compiler.compileToFile(input, output, {...standard, fastFiles: fast ? ['catalog.ts'] : []});
    const code = fs.readFileSync(output, 'utf8');
    require('acorn').parse(code, {ecmaVersion: 3});
    assert(!/\b(?:import|export)\s*[{]/.test(code));
    const scope = {}; vm.runInNewContext(code, scope);
    assert.equal(scope.shouldNotRun, undefined);
    assert.equal(typeof scope.Child, 'function');
    results.push(JSON.parse(JSON.stringify(scope.result)));
   }
   assert.deepEqual(results[1], results[0]);
  } finally {fs.rmSync(dir, {recursive: true, force: true});}
 });
 it('preserves map positions and source text after Unicode and stripped imports', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'native-maps-'));
  try {
   const input = path.join(dir, 'mapped.ts');
   const source = `/* ♀ */ import {unused} from 'x'; export const number: number = 4;\nconst text = 'export stays here';\nglobalThis.result = number;`;
   fs.writeFileSync(input, source);
   for (const sourceMaps of [true, 'inline']) {
    const output = path.join(dir, 'mapped.js');
    await compiler.compileToFile(input, output, {...standard, sourceMaps, fastFiles: ['mapped.ts']});
    const code = fs.readFileSync(output, 'utf8');
    require('acorn').parse(code, {ecmaVersion: 3});
    const map = JSON.parse(sourceMaps === 'inline' ? Buffer.from(code.match(/base64,([^\s]+)/)[1], 'base64').toString() : fs.readFileSync(output + '.map', 'utf8'));
    assert.equal(map.sourcesContent[0], source);
    const consumer = await new (require('source-map').SourceMapConsumer)(map);
    try {
     const lines = code.split('\n'), line = lines.findIndex(value => value.includes('globalThis.result'));
     const original = consumer.originalPositionFor({line: line + 1, column: lines[line].indexOf('globalThis.result')});
     assert.equal(original.line, 3);
    } finally {consumer.destroy();}
    const scope = {};vm.runInNewContext(code, scope);assert.equal(scope.result, 4);
   }
  } finally {fs.rmSync(dir, {recursive: true, force: true});}
 });
 it('rejects invalid TypeScript instead of emitting a partial build', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'native-error-'));
  try {
   const input = path.join(dir, 'bad.ts');fs.writeFileSync(input, 'const value: = ;');
   await assert.rejects(compiler.compileToFile(input, path.join(dir, 'bad.js'), {...standard, fastFiles: ['bad.ts']}));
   assert(!fs.existsSync(path.join(dir, 'bad.js')));
  } finally {fs.rmSync(dir, {recursive: true, force: true});}
 });
});
