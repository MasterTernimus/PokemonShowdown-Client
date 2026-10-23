'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Approved Dustox ability metadata', () => {
 it('replaces only the selected Compound Eyes slot and retains Unaware, Toxic Cocoon and Rivalry', () => {
  const species = Dex.species.get('dustox');
  assert.deepEqual(species.abilities, {0:'Night Forager',1:'Unaware',H:'Toxic Cocoon'});
  assert.deepEqual(species.passives, ['rivalry']);
 });
 it('describes Night Forager current-max-HP healing and one activation per turn', () => {
  const ability = Dex.abilities.get('nightforager');
  assert.equal(ability.name, 'Night Forager');
  assert.match(ability.desc, /Once per turn/);
  assert.match(ability.desc, /actual opposing HP damage/);
  assert.match(ability.desc, /1\/8 of its current maximum HP/);
  assert.match(ability.desc, /blocked heal or being at full HP still spends that activation/);
  assert.match(ability.shortDesc, /Bug\/Poison/);
 });
 it('exposes full Shield Dust and whole-move, actual-entry Toxic Cocoon protection', () => {
  assert(Dex.getAbilityEffects('toxiccocoon').has('shielddust'));
  assert(Dex.getAbilityDisplayComponents('toxiccocoon').includes('shielddust'));
  const ability = Dex.abilities.get('toxiccocoon');
  assert.match(ability.desc, /Full local Shield Dust/);
  assert.match(ability.desc, /Once per actual entry/);
  assert.match(ability.desc, /halved for the whole triggering move, including all hits/);
  assert.match(ability.desc, /Suppression, ability restarts and reacquisition do not refresh either charge/);
  assert.match(ability.shortDesc, /Shield Dust/);
 });
 it('preserves the existing global Compound Eyes identity and published effects', () => {
  const ability = Dex.abilities.get('compoundeyes');
  assert.equal(ability.name, 'Compound Eyes');
  assert.equal(ability.num, 14);
  assert.equal(ability.desc, 'Moves have 1.3x accuracy. Mirror Arena entry gives +1 accuracy and Laser Focus.');
  assert.equal(ability.shortDesc, '1.3x accuracy; Mirror Arena entry grants accuracy/Laser Focus.');
 });
});
