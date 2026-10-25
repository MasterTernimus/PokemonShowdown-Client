'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-mainmenu.js', 'utf8');
const tree = ts.createSourceFile('client.js', source, ts.ScriptTarget.Latest, true);
let implementation;
function visit(node) {
 if (ts.isPropertyAssignment(node) && node.name.getText() === 'koVerdict') implementation = node.initializer.getText();
 ts.forEachChild(node, visit);
}
visit(tree); assert(implementation); const verdict = new Function('return ' + implementation)();
function data(kos, samples = 32, extra = {}) {return Object.assign({kind:'sampled',samples,results:[{}, {kos,minPercent:10,maxPercent:90}]}, extra);}
describe('Calculator sampled KO verdicts', () => {
 it('shows all sampled KOs without claiming a guarantee', () => {
  assert.equal(verdict(data(32), 1), 'KO in all 32 samples (not guaranteed)');
 });
 it('labels a partial observed frequency rather than exact probability', () => {
  assert.equal(verdict(data(5), 1), 'KO in 5/32 samples (15.6% observed)');
 });
 it('does not call zero sampled KOs impossible', () => {
  assert.equal(verdict(data(0), 1), 'No KO observed (0/32 samples)');
 });
 it('uses actual KO outcomes, not maximum-HP damage thresholds', () => {
  const lowHP = data(32); lowHP.results[1].maxPercent = 20;
  assert.match(verdict(lowHP, 1), /^KO in all/);
  const survives = data(0); survives.results[1].minPercent = survives.results[1].maxPercent = 100;
  assert.match(verdict(survives, 1), /^No KO observed/);
 });
 it('does not treat an unrecognized exhaustive-result schema as supported proof', () => {
  assert.equal(verdict(data(32, 32, {kind:'exact'}), 1), 'KO verdict unavailable');
 });
 it('rejects malformed counts and missing target results', () => {
  for (const value of [data(-1), data(33), data(1, 0), data(0.5), {}, null]) assert.equal(verdict(value, 1), 'KO verdict unavailable');
 });
 it('retains explicitly sampled semantics for legacy responses without kind', () => {
  assert.match(verdict(data(8, 32, {kind:undefined}), 1), /samples.*observed/);
 });
 it('never infers a second-turn guarantee from one-action samples', () => {
  const result = verdict(data(0, 32, {results:[{}, {kos:0,minPercent:60,maxPercent:80}]}), 1);
  assert(!/2HKO|guaranteed 2/.test(result));
 });
});
