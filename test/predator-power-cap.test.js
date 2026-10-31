'use strict';
const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();

describe('Predator power cap presentation', () => {
 it('explains reduced field and matchup bonuses without advertising doubled power', () => {
  const ability = Dex.abilities.get('predator');
  assert(ability.desc.includes('1.5x'));
  assert(ability.desc.includes('1.3x'));
  for (const name of ['Ultra Ego', 'Ultra Instinct', 'Neutralization', 'Royal Decree', 'Mountain', 'Rocky', 'Fairy Tale', "Dragon's Den", 'Big Top']) {
   assert(ability.desc.includes(name), name);
  }
  assert(!/\b2x\b|\bdoubles\b/i.test(ability.desc + ' ' + ability.shortDesc));
  assert(/positive Defense/.test(ability.desc), 'targeted defense bypass remains described');
 });
 it('uses the same cap in Mega Staraptor’s displayed ability alongside its Contrary passive', () => {
  const species = Dex.species.get('Staraptor-Mega');
  assert.deepEqual(Array.from(species.passives), ['contrary']);
  const display = Dex.getAbilityDisplayDetails(Dex.abilities.get('predator'), species.passives, species.id);
  assert(display.desc.includes('1.5x'));
  assert(!/\b2x\b|\bdoubles\b/i.test(display.desc + ' ' + display.shortDesc));
  for (const phrase of ['Ultra Ego', 'Ultra Instinct', 'positive Defense', 'Protect', 'Substitute', 'immunities']) {
   assert(display.desc.includes(phrase), phrase);
  }
 });
});
