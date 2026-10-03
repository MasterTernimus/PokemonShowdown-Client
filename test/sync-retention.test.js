const assert = require('assert').strict;
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
describe('Incremental server snapshot retention', () => {
 const run = process.env.PS_SERVER_SOURCE ? it : it.skip;
 run('refreshes prior overrides when the comparison base advances to HEAD', function () {
  this.timeout(15000);
  const root = path.resolve(__dirname, '..');
  const writes = new Map();
  const current = require('../server-data-sync-manifest.json');
  const source = fs.readFileSync(path.join(root, 'build-tools/sync-working-server-data'), 'utf8');
  const context = {
   __dirname: path.join(root, 'build-tools'),
   process: {env: {...process.env, PS_SERVER_BASE: 'HEAD'}}, console: {log() {}},
   require(name) {
    if (name === 'fs') return {...fs, writeFileSync(file, data) {writes.set(file, data);}};
    if (name === 'child_process') return {...cp, execFileSync(command, args, options) {
     return cp.execFileSync(command, args, {...options, stdio: ['ignore', 'pipe', 'pipe']});
    }};
    return require(name);
   },
  };
  vm.runInNewContext(source, context);
  const result = JSON.parse(writes.get(path.join(root, 'server-data-sync-manifest.json')));
  for (const group of ['species', 'abilities', 'moves', 'items']) {
   for (const id of Object.keys(current.snapshot[group])) assert(result.snapshot[group][id], group + '.' + id);
  }
  assert.equal(result.snapshot.species.poliwrath.abilities[0], 'Reservoir');
  assert.equal(result.snapshot.abilities.nightmarepulse.num, 11257);
  assert.equal(result.snapshot.abilities.solartrap.num, 11258);
  assert(result.snapshot.abilities.venomignition);
 });
});
