const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
describe('Team Builder continuous search results', () => {
 function render(renderAll, count) {
  const window = {};
  const context = {window, jQuery: () => ({height: () => 600})};
  vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js', 'utf8'), context);
  const search = Object.create(window.BattleSearch.prototype);
  Object.assign(search, {renderAll, renderingDone: false, renderedIndex: 0, cur: {},
   $viewport: {scrollTop: () => 0, height: () => 1000}, el: {},
   resultSet: Array.from({length: count}, (_, i) => ['pokemon', 'entry' + i]),
   engine: {filterLabel: () => '', illegalLabel: () => ''},
   renderRow: id => '<li>' + id + '</li>',
  });
  search.updateScroll(); return search;
 }
 it('renders the last result without More or an artificial fixed height', () => {
  const search = render(true, 1500);
  assert.equal(search.renderedIndex, 1500); assert(search.renderingDone);
  assert(search.el.innerHTML.includes('entry1499'));
  assert(!search.el.innerHTML.includes('More')); assert(!search.el.innerHTML.includes('height:'));
 });
 it('keeps incremental rendering for other search consumers', () => {
  const search = render(false, 1500);
  assert.equal(search.renderedIndex, 20); assert(!search.renderingDone);
  assert(search.el.innerHTML.includes('More'));
 });
 it('renders an empty filtered list without More', () => {
  const search = render(true, 0); assert(search.renderingDone);
  assert.equal(search.el.innerHTML, '<ul class="utilichart"></ul>');
 });
});
