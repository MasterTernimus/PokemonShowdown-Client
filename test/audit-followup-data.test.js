'use strict';
const assert = require('assert').strict;
require('./battle.test');
const learnsets = require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;
describe('Requested audit follow-up client data', () => {
 for (const species of ['tauros', 'taurospaldeacombat', 'taurospaldeablaze', 'taurospaldeaaqua']) {
  for (const move of ['rockclimb', 'horndrill', 'fissure']) it(species + ' has current custom ' + move, () => {
   assert(learnsets[species].learnset[move].includes('9M'));
  });
 }
 for (const species of ['ursaring', 'ursaluna', 'ursalunabloodmoon']) it(species + ' has current custom Fissure', () => {
  assert(learnsets[species].learnset.fissure.includes('9M'));
 });
 for (const [id, power, type] of [['guillotine',120,'Steel'],['horndrill',130,'Rock'],['fissure',110,'Ground'],['sheercold',130,'Ice']]) {
  it(id + ' presents its approved power, type and quarter-HP cost', () => {
   const move = Dex.moves.get(id);
   assert.equal(move.basePower, power); assert.equal(move.type, type); assert(!move.ohko);
   assert(move.desc.includes('1/4')); assert(!move.desc.includes('1/8'));
  });
 }
 it('Venam ability exposes Shed Skin in effective component and prose metadata', () => {
  assert(Dex.getAbilityEffects('venamskiss').has('shedskin'));
  assert(Dex.getAbilityDisplayComponents('venamskiss').includes('shedskin'));
  assert(Dex.abilities.get('venamskiss').desc.includes('Shed Skin'));
 });
 it('Rousing Feast keeps Gluttony and exposes Cud Chew', () => {
  const effects = Dex.getAbilityEffects('rousingfeast');
  assert(effects.has('gluttony')); assert(effects.has('cudchew'));
  assert(Dex.getAbilityDisplayComponents('rousingfeast').includes('cudchew'));
 });
 it('Cud Chew and Rousing Feast describe the approved defensive second-bite effect', () => {
  for (const id of ['cudchew','rousingfeast']) {
   const description = Dex.abilities.get(id).desc;
   assert(/25%|0\.75/.test(description), id);
   assert(/switch/i.test(description), id);
   assert(/move/i.test(description), id);
  }
 });
});
