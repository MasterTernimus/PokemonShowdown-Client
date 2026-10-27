'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Ability component search after unknown lookups', () => {
 it('ignores cached prose placeholders without losing real components', () => {
  const {Dex} = loadDex();
  assert.equal(Dex.abilities.get('Weakens foes on entry').exists, false);
  assert.deepEqual([...Dex.getAbilityEffects('dreadwings')].sort(), ['dreadwings', 'intimidate', 'unnerve']);
  assert(!Dex.getAbilityEffects('dreadwings').has('weakensfoesonentry'));
 });
 it('keeps genuine components regardless of whether they were looked up first', () => {
  const {Dex} = loadDex();
  assert(Dex.abilities.get('Intimidate').exists);
  assert(Dex.abilities.get('Unnerve').exists);
  assert.deepEqual([...Dex.getAbilityEffects('dreadwings')].sort(), ['dreadwings', 'intimidate', 'unnerve']);
 });
});
