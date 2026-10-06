'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Audino support metadata', () => {
 it('preserves species stats and publishes the approved abilities', () => {
  assert.deepEqual(Dex.species.get('audino').baseStats, {hp:103,atk:60,def:96,spa:80,spd:96,spe:50});
  assert.deepEqual(Dex.species.get('audinomega').baseStats, {hp:103,atk:60,def:136,spa:100,spd:136,spe:50});
  assert.deepEqual(Dex.species.get('audinomega').types, ['Normal','Fairy']);
  assert.equal(Dex.species.get('audino').abilities[0], 'Vital Signs');
  assert.equal(Dex.species.get('audinomega').abilities[0], 'Divine Intervention');
 });
 it('prunes nested Invigorate from Divine Includes and describes the emergency', () => {
  assert.deepEqual(Dex.getAbilityDisplayComponents('divineintervention'), ['vitalsigns','triage','regenerator','friendguard']);
  assert.deepEqual(Dex.getAbilityDisplayComponents('vitalsigns'), ['invigorate']);
  assert.deepEqual([...Dex.getAbilityEffects('divineintervention')].sort(), ['divineintervention','friendguard','invigorate','regenerator','triage','vitalsigns']);
  assert.equal(Dex.abilities.get('vitalsigns').shortDesc, 'Heals and cures each teammate once when an attack leaves it at half HP or less.');
  assert(!/Fluffy|Sworn Duty/.test(Dex.abilities.get('divineintervention').desc));
 });
 it('generates both approved learnset additions without Recover', () => {
  const moves = require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets.audino.learnset;
  assert(moves.healbell); assert(moves.followme); assert(!moves.recover);
 });
 it('uses the same source fingerprint for synced and generated metadata', () => {
  assert.equal(require('../server-data-sync-manifest.json').sourceDataSHA256, require('../client-data-provenance.json').sourceDataSHA256);
 });
});
