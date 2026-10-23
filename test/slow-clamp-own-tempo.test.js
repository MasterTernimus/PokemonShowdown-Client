'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Slow Clamp Own Tempo client contract', () => {
 it('shows Own Tempo and Analytic without Sweet Veil search effects', () => {
  const effects = [...Dex.getAbilityEffects('slowclamp')];
  assert(effects.includes('owntempo'));
  assert(effects.includes('analytic'));
  assert(!effects.includes('sweetveil'));
  assert(Dex.abilities.get('slowclamp').shortDesc.includes('Own Tempo'));
  assert(!Dex.abilities.get('slowclamp').shortDesc.includes('Sweet Veil'));
 });
 it('keeps Mega Slowbro Shell Armor separate from its selected package', () => {
  assert.equal(Dex.species.get('slowbromega').abilities[0], 'Slow Clamp');
  assert.deepEqual(Dex.species.get('slowbromega').passives, ['shellarmor']);
 });
});
