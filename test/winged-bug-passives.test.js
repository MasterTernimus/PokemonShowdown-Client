'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Five winged bug passive UI records', () => {
 for (const id of ['beedrill', 'beedrillmega', 'butterfree', 'butterfreemega', 'butterfreegmax']) it(id + ' separates displayed passives and selected components', () => {
  const s = Dex.species.get(id); assert.deepEqual(s.passives, id === 'butterfree' ? ['shielddust'] : ['levitate']);
  const a = Dex.abilities.get(s.abilities[0]);
  if (['spiralevolution', 'toxicevolution', 'mythicscale'].includes(a.id)) {
   const effects = Dex.getAbilityEffects(a.id); assert(effects.has('shielddust')); assert(!effects.has('levitate'));
   const components = Dex.getAbilityDisplayComponents(a.id, Dex, s.passives);
   assert(components.includes('shielddust')); assert(!components.includes('levitate'));
   assert(!a.desc.includes('Airborne:')); assert(!a.desc.includes('Blocks secondary effects'));
  }
 });
 it('retains the approved base Butterfree choices and excludes pre-evolutions', () => {
  assert.deepEqual(Dex.species.get('butterfree').abilities, {'0': 'Gentle Scales', '1': 'Tinted Lens', H: 'Magic Guard'});
  for (const id of ['weedle', 'kakuna', 'caterpie', 'metapod']) assert.deepEqual(Dex.species.get(id).passives, []);
 });
});
