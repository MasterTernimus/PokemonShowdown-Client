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
