'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Approved bug support ability metadata', () => {
 it('preserves Magic Guard and Tinted Lens while presenting Gentle Scales with Compound Eyes', () => {
  const s = Dex.species.get('butterfree'); assert.deepEqual(s.abilities, {'0': 'Gentle Scales', '1': 'Tinted Lens', H: 'Magic Guard'});
  assert.deepEqual(Dex.getAbilityDisplayComponents('gentlescales', Dex, s.passives), ['compoundeyes']);
  assert(Dex.getAbilityEffects('gentlescales').has('compoundeyes'));
  const a = Dex.abilities.get('gentlescales'); assert.match(a.desc, /1.3x accuracy/); assert.match(a.desc, /Mirror Arena/); assert.match(a.desc, /Pollen Puff/); assert.match(a.shortDesc, /once per turn/);
 });
 it('publishes Hive Courier and the two approved evolution enhancements accurately', () => {
  assert.deepEqual(Dex.species.get('beedrill').abilities, {'0': 'Hive Courier', '1': 'Dual Wield', H: 'Sniper'});
  const hive = Dex.abilities.get('hivecourier'); assert.match(hive.desc, /whole damaging move by 25%/); assert.match(hive.desc, /Failed and forced/); assert.match(hive.desc, /following turn/);
  assert.match(Dex.abilities.get('toxicevolution').desc, /sharing the existing once-per-turn cap/);
  assert.match(Dex.abilities.get('mythicscale').desc, /first clears negative Defense and Sp. Def/);
 });
});
