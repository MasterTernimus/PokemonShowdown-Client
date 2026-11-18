'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
context.preact = require('preact');
context.PSRoom = function () {};
context.PSRoomPanel = function () {};
context.ChatRoom = function () {};
context.PS = {roomTypes: {}, updateRoomTypes() {}};
for (const file of ['battle-choices', 'panel-battle']) {
 vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js', file + '.js'), 'utf8'), context);
}
const ChoiceBuilder = vm.runInContext('BattleChoiceBuilder', context);
const BattlePanel = vm.runInContext('BattlePanel', context);
function request(count, target = 'normalOrSelf') {
 return {requestType: 'move', rqid: 1, active: Array.from({length: count}, () => ({moves: [
  {name: 'Decorate', id: 'decorate', target, pp: 15, maxpp: 15},
  {name: 'Splash', id: 'splash', target: 'self', pp: 40, maxpp: 40},
 ]})), side: {pokemon: []}};
}
function buttons(req, choices) {
 const slots = Array.from({length: req.active.length}, () => ({fainted: false}));
 const panel = {props: {room: {battle: {nearSide: {active: slots}, farSide: {active: slots}}}}};
 const nodes = BattlePanel.prototype.renderMoveTargetControls.call(panel, req, choices);
 return nodes.flat().map(node => node?.attributes).filter(props => props?.tooltip?.startsWith('activepokemon'));
}
describe('Modern client Decorate targeting', () => {
 for (const count of [1, 2]) {
  for (const target of count === 1 ? [-1, 1] : [-1, -2, 1, 2]) {
   it(`offers and submits target ${target} with ${count} active Pokemon`, () => {
    const req = request(count), choices = new ChoiceBuilder(req);
    assert.equal(choices.addChoice('move 1'), null);
    assert.equal(choices.current.move, 1);
    assert.equal(choices.choices.length, 0, 'must wait for a target before completing the move');
    const button = buttons(req, choices).find(b => b.cmd === `/move 1 ${target > 0 ? '+' : ''}${target}`);
    assert(button, 'target button is available');
    assert(!button.disabled);
    assert.equal(choices.addChoice(button.cmd.slice(1)), null);
    assert.equal(choices.current.move, 0);
    assert.equal(choices.toString(), `move 1 ${target > 0 ? '+' : ''}${target}`);
   });
  }
 }
 it('preserves singles automatic targeting for ordinary Decorate after suppression', () => {
  const choices = new ChoiceBuilder(request(1, 'normal'));
  assert.equal(choices.addChoice('move 1'), null);
  assert.equal(choices.current.move, 0);
  assert.equal(choices.toString(), 'move 1');
 });
 it('keeps self disabled for ordinary Decorate in doubles', () => {
  const req = request(2, 'normal'), choices = new ChoiceBuilder(req);
  choices.addChoice('move 1');
  assert(buttons(req, choices).find(b => b.tooltip === 'activepokemon|0|0').disabled);
 });
 it('retains adjacency restrictions when self-targeting is allowed in triples', () => {
  const req = request(3), choices = new ChoiceBuilder(req);
  choices.addChoice('move 1');
  const targets = buttons(req, choices);
  assert(targets.find(b => b.tooltip === 'activepokemon|0|2').disabled);
  assert(targets.find(b => b.tooltip === 'activepokemon|1|0').disabled);
  assert(!targets.find(b => b.tooltip === 'activepokemon|0|0').disabled);
 });
});

describe('Clangorous Soulblaze targeting and move secondary effects', () => {
 const legacy = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/client-battle.js'), 'utf8');
 const begin = legacy.indexOf('var activePos =', legacy.indexOf("requestTitle += 'Choose a target for"));
 const end = legacy.indexOf('this.setControlsHTML(', begin);
 assert(begin >= 0 && end > begin, 'legacy target grid must exist');
 const legacyTargets = new Function('pos', 'moveTarget', 'Dex', 'BattleLog', legacy.slice(begin, end) + '\nreturn targetMenus.join("");');
 function layout(gameType, id) {
  const count = gameType === 'doubles' ? 2 : 1;
  const slots = Array.from({length: gameType === 'singles' ? 1 : 2}, () => null);
  const battle = {gameType, nearSide: {active: slots}, farSide: {active: slots}, mySide: {n: +id[1] - 1},
   pokemonControlled: count, parseDetails() {}, parseHealth() {}};
  const req = {side: {id, pokemon: Array.from({length: count}, () => ({ident: id + ': Kommo-o'}))},
   active: Array.from({length: count}, () => ({moves: [{move: 'Clanging Scales', target: 'allAdjacentFoes'}],
    canZMove: [{move: 'Clangorous Soulblaze', target: context.Dex.moves.get('clangoroussoulblaze').target}]}))};
  ChoiceBuilder.fixRequest(req, battle);
  return {battle, req};
 }
 it('displays the base 50% accuracy and an on-hit status with the attacker-only exception', () => {
  for (const [id, flag, status] of [['zapcannon', 'status', 'par'], ['dynamicpunch', 'volatileStatus', 'confusion']]) {
   const move = context.Dex.moves.get(id);
   assert.equal(move.accuracy, 50);
   assert.equal(move.secondaries.length, 1);
   assert.equal(move.secondaries[0].chance, 100);
   assert.equal(move.secondaries[0][flag], status);
   assert.match(move.shortDesc, /50% if the user's ability guarantees the hit/i);
   assert.match(move.desc, /50% if the user's ability or passive guarantees the hit/i);
  }
 });
 it('uses one adjacent foe and keeps automatic singles targeting', () => {
  const move = context.Dex.moves.get('clangoroussoulblaze');
  assert.equal(move.target, 'adjacentFoe');
  assert.match(move.desc, /one adjacent foe/i);
  const {req} = layout('singles', 'p1');
  const choices = new ChoiceBuilder(req);
  assert.equal(choices.addChoice('move 1 zmove'), null);
  assert(choices.isDone());
 });
 it('uses the server-provided single target for a Fallen Star arrow that normally hits every foe', () => {
  const {battle, req} = layout('freeforall', 'p3');
  req.active[0].moves[0] = {id: 'razorleaf', name: 'Razor Leaf', target: 'adjacentFoe', pp: 25, maxpp: 25};
  assert.equal(context.Dex.moves.get('razorleaf').target, 'allAdjacentFoes');
  const choices = new ChoiceBuilder(req);
  assert.equal(choices.addChoice('move 1'), null);
  assert.equal(choices.current.move, 1);
  const nodes = BattlePanel.prototype.renderMoveTargetControls.call({props: {room: {battle}}}, req, choices);
  const commands = Array.from(nodes.flat(), n => n?.attributes?.cmd).filter(Boolean);
  const expected = [-1, 1, 2];
  assert.deepEqual(commands.map(cmd => Number(cmd.split(' ').pop())).sort((a, b) => a - b), expected);
  const html = legacyTargets.call({battle}, 0, req.active[0].moves[0].target, context.Dex, context.BattleLog);
  assert.deepEqual(Array.from(html.matchAll(/name="chooseMoveTarget" value="(-?\d+)"/g), m => +m[1]).sort((a, b) => a - b), expected);
 });
 for (const [mode, id, expected] of [
  ['doubles', 'p1', [1, 2]], ['freeforall', 'p1', [-2, 1, 2]], ['freeforall', 'p2', [-2, 1, 2]],
  ['freeforall', 'p3', [-1, 1, 2]], ['freeforall', 'p4', [-1, 1, 2]],
 ]) it(`both clients offer the legal opponents to ${id} in ${mode}`, () => {
  const {battle, req} = layout(mode, id);
  const target = req.active[0].zMoves[0].target;
  const legacyHTML = legacyTargets.call({battle}, 0, target, context.Dex, context.BattleLog);
  const offered = Array.from(legacyHTML.matchAll(/name="chooseMoveTarget" value="(-?\d+)"/g), m => +m[1]);
  assert.deepEqual(offered.sort((a, b) => a - b), expected);
  for (const loc of expected) {
   const choices = new ChoiceBuilder(req);
   assert.equal(choices.addChoice('move 1 zmove'), null);
   assert.equal(choices.current.move, 1);
   const nodes = BattlePanel.prototype.renderMoveTargetControls.call({props: {room: {battle}}}, req, choices);
   const commands = Array.from(nodes.flat(), n => n?.attributes?.cmd).filter(Boolean);
   const locations = commands.map(cmd => Number(cmd.split(' ').pop())).sort((a, b) => a - b);
   assert.deepEqual(locations, expected);
   const selected = commands.find(cmd => Number(cmd.split(' ').pop()) === loc);
   assert.equal(choices.addChoice(selected.slice(1)), null);
   assert.equal(choices.choices[0], selected.slice(1));
  }
 });
});
