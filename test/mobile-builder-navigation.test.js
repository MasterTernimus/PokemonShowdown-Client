'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
const tree = ts.createSourceFile('builder.js', fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8'), ts.ScriptTarget.Latest, true);
function method(name) {
 let found;
 function visit(node) {
  if (ts.isBinaryExpression(node) && node.left.getText() === 'p.' + name && ts.isFunctionExpression(node.right)) found = node.right.getText();
  ts.forEachChild(node, visit);
 }
 visit(tree); assert(found, name); return found;
}
function escapeHandler(app, phone = true) {
 return new Function('app', 'window', 'return ' + method('mobileBuilderEscape'))(app, {matchMedia:() => ({matches:phone})});
}
describe('Phone teambuilder navigation', () => {
 it('leaves desktop view and selection behavior unchanged', () => {
  const desktop = {matchMedia:() => ({matches:false})};
  const open = new Function('window', 'return ' + method('mobileBuilderView'))(desktop);
  open.call({$() {throw Error('Desktop DOM must not change');}}, true);
  let selected;
  const select = new Function('window', 'selectPokemon', 'document', 'return ' + method('selectPokemon'))(desktop, value => {selected=value;return 7;}, {});
  assert.equal(select.call({}, 3), 7); assert.equal(selected, 3);
 });
 for (const [field, set, expected] of [['pokemon',{species:'Garchomp'},'Garchomp'], ['item',{item:'Leftovers'},'Leftovers'], ['ability',{ability:'Grounded Instinct'},'Grounded Instinct'], ['move2',{moves:['Protect','Rock Slide']},'Rock Slide'], ['item',{},''], ['ability',{},''], ['move4',{moves:['Protect']},'']]) {
  it('cancels an unselected ' + field + ' query and restores the authoritative value', () => {
   let value = 'Different valid query', focused = false;
   const input = {focus() {focused=true;}};
   const room = {curChartName:field,curSet:set,$(selector) {if (selector === '.mobile-picker-open') return {length:1};return {0:input,val(v) {value=v;}};},mobileBuilderView(open) {assert.equal(open,false);}};
   const close = new Function('back', 'return ' + method('returnToPokemonEditor'))(function () {assert.equal(this.mobileReturning,true);return 4;});
   assert.equal(close.call(room),4); assert.equal(value,expected); assert(focused); assert.equal(room.mobileReturning,false);
  });
 }
 it('releases the return guard if the existing return action throws', () => {
  const close = new Function('back', 'return ' + method('returnToPokemonEditor'))(() => {throw Error('original');});
  const room = {$:() => ({length:0}),mobileBuilderView() {}};
  assert.throws(() => close.call(room),/original/);assert.equal(room.mobileReturning,false);
 });
 it('does not consume Escape from a nested popup, native select or composition', () => {
  const app = {popups:[]}, escape = escapeHandler(app);
  const room = {$:() => ({length:1}),returnToPokemonEditor() {throw Error('Must not close');}};
  for (const event of [{key:'Escape',target:{tagName:'SELECT'}},{key:'Escape',isComposing:true},{key:'Escape',defaultPrevented:true},{key:'Enter'}]) escape.call(room,event);
  app.popups=[{}];escape.call(room,{key:'Escape',target:{tagName:'INPUT'}});
 });
 it('returns to the editor for an unhandled Escape in an open view', () => {
  let closed = false, prevented = false;
  const escape = escapeHandler({popups:[]});
  escape.call({$:() => ({length:1}),returnToPokemonEditor() {closed=true;}},{key:'Escape',target:{tagName:'INPUT'},preventDefault() {prevented=true;}});
  assert(closed && prevented);
 });
 it('does not consume desktop Escape after widening a phone view', () => {
  const escape = escapeHandler({popups:[]}, false);
  escape.call({$:() => ({length:1}),returnToPokemonEditor() {throw Error('Desktop Escape must remain unchanged');}},{key:'Escape',target:{tagName:'INPUT'},preventDefault() {throw Error('Must not consume');}});
 });
});
