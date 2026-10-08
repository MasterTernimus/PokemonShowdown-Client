'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const {BattlePokemonSearch, BattleAbilitySearch, BattleItemSearch, DexSearch} = new Function(
 fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') +
 '\nreturn {BattlePokemonSearch, BattleAbilitySearch, BattleItemSearch, DexSearch};'
)();
const filter = (id, ability, extra = []) => BattlePokemonSearch.prototype.filter.call(
 {dex: Dex}, ['pokemon', id], [['ability', ability], ...extra]
);
const instant = ability => DexSearch.prototype.instafilter.call({dex: Dex}, 'pokemon', 'ability', ability);
describe('Species passive ability search', () => {
 it('finds Seaking by its confusion-only passive without changing selected abilities', () => {
  const s = Dex.species.get('seaking');
  assert.deepEqual(s.passives, ['steadyswimmer']);
  assert.deepEqual(s.abilities, {0: 'Lightning Rod', 1: 'Swift Drill', H: 'Drizzle'});
  assert(filter('seaking', 'Steady Swimmer'));
  assert(!filter('goldeen', 'Steady Swimmer'));
  assert.equal(instant('steadyswimmer').filter(r => r[0] === 'pokemon' && r[1] === 'seaking').length, 1);
  assert(!Dex.hasAbility(s, 'Steady Swimmer'));
  assert(Dex.abilities.get('steadyswimmer').desc.includes('Prevents and cures confusion'));
 });
 it('finds every explicitly assigned Levitate holder through filtering and instant search', () => {
  const rows = instant('levitate');
  const ids = Object.entries(require('../server-data-sync-manifest.json').snapshot.species)
   .filter(([, s]) => s.passives.includes('levitate')).map(([id]) => id);
  const approved = require('./fixtures/regional-passives-approved.json');
  const expected = [...Object.entries(approved.previousPassives).filter(([, p]) => p.includes('levitate')).map(([id]) => id), ...approved.groups.levitate, 'probopass'].filter(id => id !== 'butterfree');
  assert.deepEqual(ids.sort(), expected.sort());
  for (const id of ids) {
   assert(filter(id, 'Levitate'), id);
   assert.equal(rows.filter(r => r[0] === 'pokemon' && r[1] === id).length, 1, id);
  }
  assert(!Dex.hasAbility(Dex.species.get('hydreigon'), 'Levitate'));
 });
 it('finds another passive without requiring a selectable ability slot', () => {
  assert(filter('eevee', 'runaway'));
  assert(filter('charizardmegax', 'proficient'));
  assert(instant('proficient').some(r => r[0] === 'pokemon' && r[1] === 'charizardmegax'));
  assert(!Dex.hasAbility(Dex.species.get('charizardmegax'), 'Proficient'));
 });
 it('retains active and composite matches and never duplicates overlapping sources', () => {
  assert(filter('baltoy', 'Own Tempo'));
  assert(filter('butterfreemega', 'Shield Dust'));
  assert(filter('butterfreegmax', 'Levitate'));
  const rows = instant('shielddust').filter(r => r[0] === 'pokemon');
  assert.equal(rows.filter(r => r[1] === 'butterfree').length, 1);
  assert.equal(new Set(rows.map(r => r[1])).size, rows.length);
 });
 it('uses the actual form without inheriting ordinary-species passives', () => {
  for (const id of ['tentacruelalt', 'tentacruelreborn']) {
   assert.deepEqual(Dex.species.get(id).passives, [], id);
   const s = Dex.species.get(id);
   const active = Object.values(s.abilities).some(a => Dex.getAbilityEffects(a).has('liquidooze'));
   assert.equal(filter(id, 'Liquid Ooze'), active, id);
  }
  for (const id of ['butterfreemega', 'butterfreegmax']) assert.deepEqual(Dex.species.get(id).passives, ['levitate']);
  assert(!filter('pikachu', 'Levitate'));
 });
 it('uses the same passive-aware matching in reverse Pokemon filters', () => {
  for (const Search of [BattleAbilitySearch, BattleItemSearch]) {
   assert(Search.prototype.filter.call({dex: Dex}, ['ability', 'levitate'], [['pokemon', 'hydreigon']]));
   assert(!Search.prototype.filter.call({dex: Dex}, ['ability', 'levitate'], [['pokemon', 'pikachu']]));
  }
 });
 it('preserves combined type filters and the existing illegal-result partition', () => {
  assert(filter('baltoy', 'Levitate', [['type', 'Ground']]));
  assert(!filter('baltoy', 'Levitate', [['type', 'Water']]));
  const rows = DexSearch.prototype.instafilter.call({dex: Dex, typedSearch: {illegalReasons: {baltoy: 'Banned'}}}, 'pokemon', 'ability', 'levitate');
  assert.equal(rows.filter(r => r[0] === 'pokemon' && r[1] === 'baltoy').length, 1);
  assert(rows.findIndex(r => r[1] === 'baltoy') > rows.findIndex(r => r[1] === 'hydreigon'));
 });
});
