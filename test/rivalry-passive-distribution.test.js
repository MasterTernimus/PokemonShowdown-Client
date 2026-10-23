'use strict';
const assert = require('assert').strict;
require('./battle.test');

// Static expectations for the newly approved distributions, independent of older approval fixtures.
const selected = {
 luxray: {0: 'Strong Jaw', 1: 'Galvanize', H: 'Intimidate'},
 beautifly: {0: 'Windy Surge', 1: 'Pastel Sanctuary', H: 'Gale Bloom'},
 dustox: {0: 'Night Forager', 1: 'Unaware', H: 'Toxic Cocoon'},
 pyroar: {0: 'Fire Mane', 1: 'Royal Decree', H: 'Pridecall'},
 unfezant: {0: 'Unova Wing', 1: 'Aevian Wing'},
 unfezantrejuv: {0: 'Unova Wing', 1: 'Aevian Wing'},
 haxorus: {0: 'Sharpness', 1: 'Raging Storm', H: 'Supreme Overlord'},
};

describe('Newly approved Rivalry passive distributions', () => {
 it('Beautifly redistributes 25 Special Attack into 10 Attack and 15 Defense, preserving BST', () => {
  const species = Dex.species.get('beautifly');
  assert.deepEqual(species.baseStats, {hp:80, atk:50, def:85, spa:125, spd:75, spe:115});
  assert.equal(species.bst, 530);
 });
 for (const [id, abilities] of Object.entries(selected)) it(id + ' shows Rivalry with unchanged selected abilities', () => {
  const species = Dex.species.get(id);
  assert.deepEqual(species.passives, ['rivalry']);
  assert.deepEqual(species.abilities, abilities);
  assert(Dex.hasAbilityEffect(species, 'rivalry'));
 });
 for (const species of ['Pyroar', 'Unfezant', 'Unfezant-Rejuv']) for (const gender of ['M', 'F']) {
  it(species + ' ' + gender + ' artwork keeps its ordinary Rivalry passive', () => {
   const preview = Dex.getAbilityFormPreview({species, gender, ability: species === 'Unfezant-Rejuv' ? 'Aevian Wing' : selected[toID(species)][0]});
   assert.equal(preview.species.id, toID(species));
   assert.deepEqual(preview.species.passives, ['rivalry']);
  });
 }
 it('Mega Haxorus retains Twin Fang and its selected ability', () => {
  const mega = Dex.species.get('haxorusmega');
  assert.deepEqual(mega.passives, ['twinfang']);
  assert.deepEqual(mega.abilities, {0: 'Raging Overlord'});
  assert(!mega.passives.includes('rivalry'));
  assert(Dex.hasAbilityEffect(mega, 'rivalry'));
 });
 it('keeps separate battle forms and pre-evolutions outside the new distribution', () => {
  for (const id of ['shinx', 'luxio', 'wurmple', 'silcoon', 'litleo', 'pidove', 'tranquill', 'luxraymega', 'pyroarmega']) assert(!Dex.species.get(id).passives.includes('rivalry'), id);
 });
});
