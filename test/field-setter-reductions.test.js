'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Approved field setter descriptions and Banette passive', () => {
 const ids = ['tatteredmemory','curseddoll','requiem','eternalflower','auroradomain','duneterror','tyrantdomain','inversion'];
 for (const id of ids) it(id + ' matches the server snapshot and installed data', () => {
  const expected = require('../server-data-sync-manifest.json').snapshot.abilities[id];
  const actual = Dex.abilities.get(id), installed = require('../play.pokemonshowdown.com/data/abilities').BattleAbilities[id];
  assert(actual.exists);
  for (const key of ['desc','shortDesc']) { assert.equal(actual[key],expected[key]); assert.equal(installed[key],expected[key]); }
 });
 it('shows Tattered Memory with both components and preserves the Mega passives', () => {
  assert.deepEqual(Dex.species.get('banette').passives,['tatteredmemory']);
  assert(Dex.getAbilityEffects('tatteredmemory').has('cursedbody'));
  assert(Dex.getAbilityEffects('tatteredmemory').has('frisk'));
  assert.deepEqual(Dex.species.get('banettemega').passives,['prankster']);
  assert.deepEqual(Dex.species.get('banettemegaz').passives,['frisk']);
 });
 it('does not advertise removed field creation', () => {
  for (const id of ['curseddoll','requiem','eternalflower','auroradomain','duneterror','tyrantdomain']) {
   assert(!/creates? (Haunted|Bewitched|Desert|Fairy Tale|Dragon.s Den)/i.test(Dex.abilities.get(id).desc),id);
  }
 });
});
