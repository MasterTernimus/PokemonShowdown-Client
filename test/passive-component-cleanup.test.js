'use strict';
const assert = require('assert').strict;
require('./battle.test');
const before = require('./fixtures/passive-overlap-before.json');
describe('Passive component separation client parity', () => {
 for (const row of before) for (const slot of row.slots.filter(s => s.overlap.length)) {
  it(row.id + ' slot ' + slot.slot + ' separates selected and passive identities', () => {
   const species = Dex.species.get(row.id);
   for (const component of slot.overlap) {
    assert(species.passives.includes(component));
    const activeId = Dex.abilities.get(species.abilities[slot.slot]).id;
    const excluded = Dex.getAbilityComponentExclusions(activeId, species.passives);
    const selectedHas = Dex.getAbilityEffects(activeId).has(component) && !excluded.includes(component);
    assert.equal(selectedHas, false);
    assert(Dex.hasAbilityEffect(species, component), 'passive remains searchable');
    assert(!Dex.getAbilityDisplayComponents(activeId, Dex, species.passives).includes(component));
   }
  });
 }
 for (const [id, passive, phrase] of [['venomheal','hypercutter','lower its Attack'],['venomveil','liquidooze','drain'],['elevate','levitate','Ground']]) {
  it(id + ' preserves the generic component and scopes the holder description', () => {
   const a = Dex.abilities.get(id);
   assert(Dex.getAbilityEffects(id).has(passive));
   assert(!Dex.getAbilityComponentExclusions(id, []).includes(passive));
   assert(Dex.getAbilityComponentExclusions(id, [passive]).includes(passive));
   assert.equal(Dex.getAbilityDisplayDetails(a, []).desc, a.desc);
   assert(!Dex.getAbilityDisplayDetails(a, [passive]).desc.includes(phrase));
   assert.notEqual(Dex.getAbilityDisplayDetails(a, [passive]).desc, a.desc);
  });
 }
 it('keeps base/shared Proficient and pruned Includes while Scale Shelter describes Overcoat', () => {
  for (const id of ['pollenbloom','unboundblaze','proficient']) assert.equal(Dex.getAbilityEffects(id).has('proficient'),id==='proficient');
  for (const id of ['toxicbloom','atrocity','tidaljaw']) assert(!Dex.getAbilityEffects(id).has('proficient'));
  assert.deepEqual(Dex.getAbilityDisplayComponents('scaleshelter'), ['overcoat']);
  assert.equal(Dex.abilities.get('scaleshelter').shortDesc, 'Blocks powder moves and sandstorm/hail damage.');
 });
 it('uses actual passive Levitate after suppression but removed borrowed immunity stays gone', () => {
  const battle = new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try {
   const p = battle.p1.active[0];
   for (const ability of ['Solar Idol','Lunar Idol','Temple Chime','Void Drift']) {
    const own = {speciesForme:'Mew',ability,baseAbility:ability,passives:[],item:''};
    assert.equal(p.isGrounded(own), true, ability);
    own.passives=['levitate']; p.volatiles.gastroacid=['gastroacid'];
    assert.equal(p.isGrounded(own), false, ability + ' passive');
    p.volatiles.smackdown=['smackdown']; assert.equal(p.isGrounded(own), true);
    delete p.volatiles.smackdown; delete p.volatiles.gastroacid;
   }
  } finally {battle.destroy();}
 });
});
