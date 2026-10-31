'use strict';
const assert = require('assert').strict;
require('./battle.test');
const snapshot = require('../server-data-sync-manifest.json').snapshot;
const speciesIds = ['chandeluremega', 'venusaurmega', 'dusknoirmega', 'ariadosmega', 'breloommega', 'sharpedomegay', 'rampardos', 'arcaninehisui', 'delibird', 'trevenant', 'mudsdale', 'alakazamrejuv', 'poliwrathrejuv', 'goodra', 'goodrahisui', 'goodrahisuialt', 'armarouge', 'ceruledge'];
describe('Approved stats, Goodras and armor twins client metadata', () => {
 for (const id of speciesIds) it(id + ' matches the scoped server snapshot', () => {
  const species = Dex.species.get(id);
  for (const key of ['baseStats', 'abilities', 'passives']) assert.deepEqual(species[key], snapshot.species[id][key], key);
  const installed = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex[id];
  for (const key of ['baseStats', 'abilities', 'passives']) assert.deepEqual(installed[key], snapshot.species[id][key], 'installed ' + key);
 });
 for (const id of ['gooey', 'gentleembrace', 'shellboundfury', 'soulforgedarmor', 'twincannons', 'twinblades']) {
  it(id + ' has the current descriptions and searchable effects', () => {
   const ability = Dex.abilities.get(id);
   assert(ability.exists);
   assert.equal(ability.desc, snapshot.abilities[id].desc);
   assert.equal(ability.shortDesc, snapshot.abilities[id].shortDesc);
   const installed = require('../play.pokemonshowdown.com/data/abilities').BattleAbilities[id];
   assert.equal(installed.desc, ability.desc);
   assert(require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex.some(row => row[0] === id && row[1] === 'ability'));
  });
 }
 it('removes retired Gooey components and exposes Hydration through Gentle Embrace', () => {
  assert(!Dex.getAbilityEffects('gooey').has('hydration'));
  assert(!Dex.getAbilityEffects('gooey').has('sapsipper'));
  assert(Dex.getAbilityEffects('gentleembrace').has('hydration'));
 });
});
