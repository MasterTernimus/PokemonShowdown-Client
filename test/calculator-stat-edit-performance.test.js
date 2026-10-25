'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
const tree = ts.createSourceFile('client.js', fs.readFileSync('play.pokemonshowdown.com/js/client-mainmenu.js', 'utf8'), ts.ScriptTarget.Latest, true);
function method(name, marker) {
 let found;
 function visit(node) {
  if (ts.isPropertyAssignment(node) && node.name.getText() === name && ts.isFunctionExpression(node.initializer) && (!marker || node.initializer.getText().includes(marker))) found = node.initializer.getText();
  ts.forEachChild(node, visit);
 }
 visit(tree); assert(found, name); return found;
}
function harness() {
 const calls = [], actor = {}, chain = {hasClass() {return false;}, attr() {return this;}, prop() {return this;}, empty() {return this;}, removeClass() {return this;}, text() {return this;}, closest() {return actor;}};
 const room = {scenarioRevision:5, pendingScenario:{}, requestId:'old', $el:chain, $() {return chain;}, updateCalcStatSummary(a) {assert.equal(a, actor); calls.push('summary');}, refreshActors() {calls.push('identity');}, refreshCalcMoves() {calls.push('moves');}};
 room.scenarioEdited = new Function('$', 'clearTimeout', 'return ' + method('scenarioEdited', 'Stat edits do not'))(() => chain, () => {});
 return {room, calls};
}
describe('Calculator stat edit refresh', () => {
 for (const name of ['evs-atk', 'ivs-hp', 'boosts-def']) it('invalidates an outstanding result immediately without rebuilding identity for ' + name, () => {
  const {room, calls} = harness(); room.scenarioEdited({target:{name}});
  assert.equal(room.requestId, null); assert.equal(room.pendingScenario, null); assert.equal(room.scenarioRevision, 6); assert.deepEqual(calls, ['summary']);
 });
 for (const name of ['species', 'ability', 'item', 'moves', 'gimmick']) it('refreshes dependent identity and move controls for ' + name, () => {
  const {room, calls} = harness(); room.scenarioEdited({target:{name}}); assert.deepEqual(calls, ['identity', 'moves']);
 });
 it('fully refreshes programmatic imports and restores without an input event', () => {
  const {room, calls} = harness(); room.scenarioEdited(); assert.deepEqual(calls, ['identity', 'moves']);
 });
 it('keeps the visible EV and stage summary current', () => {
  let summary;
  const actor = {attr:() => '1', find:() => ({text(value) {summary=value;}})};
  const room = {readActor(index) {assert.equal(index, 1); return {evs:{hp:252,def:252,spd:4},boosts:{atk:0,def:2}};}};
  const update = new Function('return ' + method('updateCalcStatSummary'))(); update.call(room, actor);
  assert.match(summary, /508 EVs/); assert.match(summary, /1 changed stages/);
 });
});
