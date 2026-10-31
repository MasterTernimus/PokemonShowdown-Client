'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Mega Garchomp rework client data', () => {
 it('uses the approved spread, Dune Carver and Sharpness in every data layer', () => {
  const snapshot = require('../server-data-sync-manifest.json').snapshot;
  const raw = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
  for (const species of [Dex.species.get('garchompmega'), snapshot.species.garchompmega, raw.garchompmega]) {
   assert.deepEqual(species.baseStats, {hp:108, atk:145, def:120, spa:115, spd:115, spe:97});
   assert.deepEqual(species.abilities, {0:'Dune Carver'});
   assert.deepEqual(species.passives, ['sharpness']);
  }
  const a = Dex.abilities.get('dunecarver'); assert(a.exists);
  assert.equal(a.desc, snapshot.abilities.dunecarver.desc);
  assert.equal(a.shortDesc, snapshot.abilities.dunecarver.shortDesc);
  assert.equal(require('../play.pokemonshowdown.com/data/abilities').BattleAbilities.dunecarver.desc, a.desc);
  assert(!Dex.getAbilityEffects('dunecarver').has('dualwield'));
  assert(!Dex.getAbilityEffects('dunecarver').has('moxie'));
 });
 it('indexes Dune Carver and preserves valid search alias links', () => {
  const {BattleSearchIndex: index, BattleSearchIndexOffset: offsets} = require('../play.pokemonshowdown.com/data/search-index');
  assert(index.some(row => row[0] === 'dunecarver' && row[1] === 'ability'));
  assert.equal(index.length, offsets.length);
  for (const entry of index) if (typeof entry[2] === 'number') {
   assert(index[entry[2]], 'missing alias target: ' + entry[0]);
   assert.equal(index[entry[2]][1], entry[1], 'alias category: ' + entry[0]);
  }
 });
 it('keeps the other Garchomp forms separate', () => {
  assert.equal(Dex.species.get('garchomp').baseStats.spe, 102);
  assert.equal(Dex.species.get('garchompbattlebond').baseStats.spe, 112);
  const z = Dex.species.get('garchompmegaz');
  assert.deepEqual(z.abilities, {0:'Relentless Hunt'});
  assert.deepEqual(z.passives, ['levitate']); assert.equal(z.baseStats.spe, 151);
 });
});
