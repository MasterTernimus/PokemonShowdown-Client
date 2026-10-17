const assert = require('assert').strict, fs = require('fs'), vm = require('vm');
require('./battle.test');
const context = {window: {}, jQuery() {}, Dex, toID, BattleLog: {escapeHTML: v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}};
vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js', 'utf8'), context);
const render = name => context.window.BattleSearch.prototype.renderPokemonRow.call({}, Dex.species.get(name), 0, 0, '', '');
describe('Lightweight species search rows', () => {
 it('keeps ability names and a compact passive button without the full ability panel', () => {
  const html = render('Rhydon');
  for (const text of ['Grand Strategy', 'Lightning Rod', 'Brute Force', 'Power Drill', 'pokemon-passive-badge', 'aria-expanded="false"']) assert(html.includes(text), text);
  assert(!html.includes('species-info-button')); assert(!html.includes('Possible abilities'));
 });
 it('does not add a placeholder button for species without passives', () => {
  const html = render('Arcanine-Aevian');
  assert(!html.includes('species-info-button')); assert(!html.includes('pokemon-passive-badge'));
 });
 it('does not calculate descriptions or component lists while rendering results', () => {
  const details = Dex.getPassiveAbilityDetails, components = Dex.getAbilityDisplayComponents;
  Dex.getPassiveAbilityDetails = Dex.getAbilityDisplayComponents = () => { throw Error('Eager details generation'); };
  try { assert(render('Garganacl').includes('Passive &middot; Salt Bastion')); }
  finally { Dex.getPassiveAbilityDetails = details; Dex.getAbilityDisplayComponents = components; }
 });
 it('uses exact form passives and keeps the Pokemon selection target', () => {
  const html = render('Butterfree-Gmax');
  assert(html.includes('data-entry="pokemon|Butterfree-Gmax"'));
  assert(html.includes('Passive &middot; Levitate')); assert(!html.includes('Passive &middot; Shield Dust'));
 });
});
