'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Sinnoh Unova Mega passive UI', () => {
 for (const species of ['Mismagius-Mega', 'Eelektross-Mega']) it(species + ' retains passive Elevate grounding through selected suppression', () => {
  const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Test|' + species + ', L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
  try {
   const p = battle.p1.active[0];
   const own = {speciesForme: species, ability: 'No Ability', baseAbility: 'No Ability', passives: ['elevate'], item: ''};
   p.volatiles.gastroacid = ['gastroacid'];
   assert.equal(p.isGrounded(own), false);
   p.volatiles.smackdown = ['smackdown'];
   assert.equal(p.isGrounded(own), true);
   delete p.volatiles.smackdown;
   own.item = 'Iron Ball';
   assert.equal(p.isGrounded(own), true);
  } finally { battle.destroy(); }
 });
 it('Aura Guard has the approved contact-only description and remains separate from Aura Precision', () => {
  const s = Dex.species.get('Lucario-Mega-Z');
  assert.deepEqual(s.passives, ['auraguard']);
  assert.equal(s.abilities[0], 'Aura Precision');
  assert.match(Dex.abilities.get('auraguard').desc, /contact/);
  assert(!Dex.getAbilityDisplayComponents('Aura Precision', Dex, s.passives).includes('auraguard'));
 });
});
