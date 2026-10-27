'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Mega Pidgeot No Guard presentation', () => {
 it('shows No Guard as the passive and preserves selected Storm Sovereign', () => {
  const s = Dex.species.get('pidgeotmega');
  assert.deepEqual(s.passives, ['noguard']);
  assert.deepEqual(s.abilities, {0: 'Storm Sovereign'});
  assert(Dex.hasAbilityEffect(s, 'No Guard'));
  assert(!Dex.hasAbilityEffect(s, 'Gale Wings'));
  assert(!Dex.hasAbility(s, 'No Guard'));
 });
 it('removes obsolete priority from native Includes and contextual text, preserving copied packages', () => {
  const a = Dex.abilities.get('stormsovereign');
  assert(Dex.getAbilityComponentExclusions(a.id, ['noguard'], 'pidgeotmega').includes('galewings'));
  assert(!Dex.getAbilityComponentExclusions(a.id, ['noguard'], 'raichumegay').includes('galewings'));
  assert(!Dex.getAbilityComponentExclusions(a.id, []).includes('galewings'));
  assert(Dex.getAbilityEffects(a.id).has('galewings'));
  const native = Dex.getAbilityDisplayDetails(a, ['noguard'], 'pidgeotmega');
  assert.deepEqual(Dex.getAbilityDisplayComponents(a.id, Dex, ['noguard'], 'pidgeotmega'), ['updraft']);
  assert(Dex.getAbilityDisplayComponents(a.id, Dex, ['noguard'], 'raichumegay').includes('galewings'));
  assert.equal(native.shortDesc, 'Updraft (Competitive), eight-turn Strong Winds and opposing Flying chip.');
  assert.deepEqual(Dex.species.get('pidgeotmega').passives,['noguard']);
  assert(!/priority|Keen Eye|Gale Wings/.test(native.desc));
  assert(Dex.getAbilityDisplayDetails(a, []).desc.includes('priority'));
 });
});
