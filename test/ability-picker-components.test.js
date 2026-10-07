const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
require('./battle.test');
const BattleLog = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-log.js', 'utf8') + '\nreturn BattleLog;')();
describe('Component-first Team Builder ability rows', () => {
 let search;
 before(() => {
  const window = {};
  vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js', 'utf8'), {
   window, jQuery() {}, Dex, toID, BattleLog,
  });
  search = Object.create(window.BattleSearch.prototype); search.renderAll = true;
 });
 function visible(ability) {
  const html = search.renderAbilityRow(ability, 0, 0);
  return html.replace(/ title="[^"]*"/g, '').replace(/<button[\s\S]*?<\/button>/g, '');
 }
 it('shows named components before the extra effect for Void Crossing', () => {
  const html=visible(Dex.abilities.get('voidcrossing'));
  assert(html.includes('Magic Guard + Infiltrator'));
  assert(html.indexOf('Magic Guard + Infiltrator') < html.indexOf('Ghost hits or Power Gem'));
 });
 it('shows Atrocity as two packages without a redundant Self Sufficient label', () => {
  const html=visible(Dex.abilities.get('atrocity'));
  assert(html.includes('Unbound Blaze + Tough Claws'));
  assert(!html.includes('Self Sufficient'));
 });
 it('renders canonical components for every composite and removes filler', () => {
  const snapshot=require('../server-data-sync-manifest.json').snapshot;
  for (const [id,parts] of Object.entries(snapshot.displayComponents)) {
   const ability=Dex.abilities.get(id),html=visible(ability);
   for(const part of parts) assert(html.includes(BattleLog.escapeHTML(Dex.abilities.get(part).name)),id+': '+part);
   if(parts.length) assert(!html.includes('Combines the listed abilities.'),id);
  }
 });
 it('keeps standalone summaries and non-Team Builder rendering intact', () => {
  const a=Dex.abilities.get('levitate');assert(visible(a).includes(BattleLog.escapeHTML(a.shortDesc)));
  search.renderAll=false;
  assert(!visible(Dex.abilities.get('voidcrossing')).includes('ability-components'));
  search.renderAll=true;
 });
});


describe('Readable full ability descriptions', () => {
 it('preserves stat names, decimal multipliers and exception sentences', () => {
  assert.deepEqual(Dex.getAbilityDescriptionLines('Raises Sp. Atk by 1. Moves gain 1.3x power; misses do not spend the use. Switching resets it.'), [
   'Raises Sp. Atk by 1', 'Moves gain 1.3x power', 'misses do not spend the use', 'Switching resets it.',
  ]);
 });
 it('shows both real Pollen Bloom components and retains its drain details', () => {
  assert.deepEqual(Dex.getAbilityDisplayComponents('pollenbloom'), ['thickfat', 'unaware']);
  const text = Dex.abilities.get('pollenbloom').desc;
  assert(text.includes('1/16')); assert(text.includes('HP actually drained')); assert(text.includes('Free-for-All'));
 });
});
