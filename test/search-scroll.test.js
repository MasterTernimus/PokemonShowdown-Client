const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
describe('Team Builder continuous search results', () => {
 function render(renderAll, count) {
  const frames = [], window = {requestAnimationFrame: fn => frames.push(fn)};
  const el = {innerHTML: '', firstChild: {}};
  const context = {window, jQuery: () => ({height: () => 600, append: html => {el.innerHTML += html;}})};
  vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js', 'utf8'), context);
  const search = Object.create(window.BattleSearch.prototype);
  Object.assign(search, {renderAll, renderingDone: false, renderedIndex: 0, cur: {},
   $viewport: {scrollTop: () => 0, height: () => 1000}, el,
   resultSet: Array.from({length: count}, (_, i) => ['pokemon', 'entry' + i]),
   engine: {filterLabel: () => '', illegalLabel: () => ''},
   renderRow: id => '<li>' + id + '</li>', frames,
  });
  search.updateScroll(); return search;
 }
 it('yields after 60 rows and eventually renders every result without More', () => {
  const search = render(true, 1500);
  assert.equal(search.renderedIndex, 60); assert(!search.renderingDone);
  while (search.frames.length) search.frames.shift()();
  assert.equal(search.renderedIndex, 1500); assert(search.renderingDone);
  assert(search.el.innerHTML.includes('entry1499'));
  assert(!search.el.innerHTML.includes('More')); assert(!search.el.innerHTML.includes('height:'));
 });
 it('does not append obsolete rows after changing profiles or queries', () => {
  const search = render(true, 1500);
  search.resultSet = [['pokemon','replacement']]; search.renderedIndex = 0; search.renderingDone = false;
  search.updateScroll();
  while(search.frames.length) search.frames.shift()();
  assert(search.el.innerHTML.includes('replacement')); assert(!search.el.innerHTML.includes('entry'));
 });
 it('keeps incremental rendering for other search consumers', () => {
  const search = render(false, 1500);
  assert.equal(search.renderedIndex, 20); assert(!search.renderingDone);
  assert(search.el.innerHTML.includes('More')); assert.equal(search.frames.length,0);
 });
 it('renders an empty filtered list without More', () => {
  const search = render(true, 0); assert(search.renderingDone);
  assert.equal(search.el.innerHTML, '<ul class="utilichart"></ul>');
 });
});
