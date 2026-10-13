const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
describe('Team Builder continuous search results', () => {
 function render(renderAll, count) {
  const frames = [], window = {innerHeight: 600, requestAnimationFrame: fn => frames.push(fn)};
  const el = {innerHTML: '', firstChild: {}, getBoundingClientRect: () => ({bottom: 1500})};
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
 it('keeps off-screen rows unrendered and continues when scrolled near the end', () => {
  const search = render(true, 1500);
  assert.equal(search.renderedIndex, 30); assert(!search.renderingDone);
  while (search.frames.length) search.frames.shift()();
  assert.equal(search.renderedIndex, 30);
  search.el.getBoundingClientRect = () => ({bottom: 500});
  search.updateScroll();
  while (search.frames.length) search.frames.shift()();
  assert.equal(search.renderedIndex, 1500); assert(search.renderingDone);
  assert(search.el.innerHTML.includes('entry1499'));
  assert(!search.el.innerHTML.includes('More')); assert(!search.el.innerHTML.includes('height:'));
 });
 it('pauses hidden rooms without losing results and resumes when visible', () => {
  const search = render(true, 1500);
  search.el.getClientRects = () => [];
  search.el.getBoundingClientRect = () => ({bottom: 0});
  search.pauseRendering();
  while (search.frames.length) search.frames.shift()();
  search.updateScroll(true);
  assert.equal(search.renderedIndex, 30);
  assert.equal(search.renderingDone, false);
  search.el.getClientRects = () => [{}];
  search.el.getBoundingClientRect = () => ({bottom: 500});
  search.updateScroll();
  assert.equal(search.renderedIndex, 60);
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
 for (const panel of ['stats', 'details']) {
  it('cancels queued results when switching to ' + panel, () => {
   const search = render(true, 1500);
   search.cancelRendering();
   search.el.innerHTML = '<div>' + panel + '</div>';
   search.el.firstChild = {};
   search.el.getBoundingClientRect = () => ({bottom: 500});
   while (search.frames.length) search.frames.shift()();
   search.updateScroll(true);
   assert.equal(search.el.innerHTML, '<div>' + panel + '</div>');
   assert.equal(search.renderedIndex, 30);
  });
 }
 it('refuses to append when another panel replaces the search list without cancellation', () => {
  const search = render(true, 1500);
  search.el.innerHTML = '<div>EVs</div>'; search.el.firstChild = {};
  search.el.getBoundingClientRect = () => ({bottom: 500});
  while (search.frames.length) search.frames.shift()();
  assert.equal(search.el.innerHTML, '<div>EVs</div>');
  assert(search.renderingDone);
 });
 it('does not let an old frame consume a restarted search using the same results', () => {
  const search = render(true, 1500), obsolete = search.frames.shift();
  search.cancelRendering();
  search.renderedIndex = 0; search.renderingDone = false;
  search.el.getBoundingClientRect = () => ({bottom: 500});
  search.updateScroll();
  obsolete();
  assert.equal(search.renderedIndex, 30);
  while (search.frames.length) search.frames.shift()();
  assert.equal(search.renderedIndex, 1500);
 });
});

describe('Team Builder form rendering cancels search batches', () => {
 const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
 for (const method of ['updateStatForm', 'updateDetailsForm']) {
  it(method + ' cancels before replacing the panel', () => {
   const start = source.indexOf(method + ': function');
   const body = source.slice(source.indexOf('{', start) + 1, source.indexOf('\n\t\t},', start));
   const stopped = new Error('cancelled');
   assert.throws(() => new Function('setGuessed', body).call({search: {cancelRendering() {throw stopped;}}}), error => error === stopped);
  });
 }
});

describe('Detached teambuilder search cleanup', () => {
 it('stops rendering after switching away from its editor', () => {
  const frames=[], el={innerHTML:'',firstChild:{},isConnected:true};
  const window={requestAnimationFrame:fn=>frames.push(fn)};
  const context={window,jQuery:()=>({height:()=>600,append:()=>{}})};
  vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js','utf8'),context);
  const search=Object.create(window.BattleSearch.prototype);
  Object.assign(search,{renderAll:true,renderingDone:false,renderedIndex:0,cur:{},el,
   $viewport:{scrollTop:()=>0,height:()=>1000},resultSet:Array.from({length:1500},(_,i)=>['pokemon','entry'+i]),
   engine:{filterLabel:()=>'',illegalLabel:()=>''},renderRow:id=>'<li>'+id+'</li>'});
  search.updateScroll();assert.equal(search.renderedIndex,30);el.isConnected=false;
  while(frames.length)frames.shift()();assert.equal(search.renderedIndex,30);
 });
});
