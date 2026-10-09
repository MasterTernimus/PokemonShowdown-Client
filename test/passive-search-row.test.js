const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
require('./battle.test');
const context = {window: {}, jQuery() {}, Dex, toID, BattleLog: {escapeHTML: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}};
vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js', 'utf8'), context);
const renderer = context.window.BattleSearch.prototype.renderPokemonRow;
const render = name => renderer.call({}, Dex.species.get(name), 0, 0, '', '');
describe('Pokemon result passive badges', () => {
 it('shows Butterfree passive separately from its selectable abilities and retains stats', () => {
  const html = render('Butterfree');
  assert(html.includes('Passive &middot; Shield Dust'));
  for (const name of ['Gentle Scales', 'Tinted Lens', 'Magic Guard']) assert(html.includes(name));
  assert.equal((html.match(/class="col statcol"/g) || []).length, 6);
  assert(html.includes('Blocks incoming attack secondary effects.'));
 });
 it('uses the actual form passive instead of inheriting its base form badge', () => {
  assert(render('Butterfree-Gmax').includes('Passive &middot; Levitate'));
  assert(!render('Butterfree-Gmax').includes('Passive &middot; Shield Dust'));
  assert(!render('Arcanine-Aevian').includes('pokemon-passive-badge'));
 });
 it('keeps long passive names intact for CSS wrapping and supplies accessible help', () => {
  const html = render('Conkeldurr');
  assert(html.includes('Passive &middot; Rocky Payload'));
  assert(html.includes('aria-expanded="false"'));
  assert(html.includes('role="tooltip"'));
 });
});
