'use strict';
const assert = require('assert').strict;
require('./battle.test');
const approved = {
 galebloom: {
  "effects": [
    "galebloom",
    "shielddust"
  ],
  "shortDesc": "Shield Dust; first Flying foe HP hit each entry gives +1 Speed and boosts an ally's Sp. Atk.",
  "desc": "Full local Shield Dust blocks incoming move secondary effects on this Pokemon, while retaining effects on the attacker and primary move effects. Shield Dust follows normal ability bypass rules. Once per actual entry, its first Flying attack hit to damage a foe's HP raises its own Speed by 1 stage, even without an ally. Separately, its first such hit with a living adjacent ally raises the lowest HP-percentage adjacent ally's Sp. Atk by 1 stage. Multi-hit and spread moves do not multiply either boost. Misses, immunity, protection, Substitute-only damage, allied hits, status moves and residual damage do not trigger either boost. Suppression disables these effects without renewing spent boosts; ability restarts or reacquisition do not reset them. Actual reentry resets both boosts."
},
 twinfang: {
  effects: ['rivalry', 'twinfang'],
  shortDesc: 'Rivalry; Sp. Atk copies unboosted Attack; eligible contact attacks gain a 30% second hit.',
  desc: 'Special Attack uses calculated unboosted Attack, including Attack EVs, IVs and nature, then applies its own Special Attack stages and modifiers. Attack stages and Attack-only multipliers are not copied; species base stats remain unchanged. Normally single-hit contact attacks gain a second hit at 30% calculated damage. No stacking with other extra-hit effects, retargeting after KO, recursive hits, extra secondaries or self-stat rolls. Excludes native multihit, spread, fixed/OHKO, Z/Max, delayed, charge/recharge, self-KO and item-consuming/repeating exceptions. Full local Rivalry gives damaging moves 1.3x power against a same-gender or genderless target, with no opposite-gender penalty. Other active allies take 25% less calculated attack damage, including friendly fire; the holder is not protected by its own Rivalry. Separate holders retain normal stacking. Selected-ability suppression disables these added effects.',
 },
};
describe('Approved Gale Bloom and Twin Fang component metadata', () => {
 it('regular Haxorus displays Rivalry while Mega retains Twin Fang with one Rivalry identity', () => {
  const regular=Dex.species.get('haxorus'), mega=Dex.species.get('haxorusmega');
  assert.deepEqual(regular.passives,['rivalry']);assert.deepEqual(mega.passives,['twinfang']);
  assert.deepEqual(regular.abilities,{0:'Sharpness',1:'Raging Storm',H:'Supreme Overlord'});assert.deepEqual(mega.abilities,{0:'Raging Overlord'});
  assert.deepEqual([...Dex.getAbilityEffects(regular.passives[0])].sort(),['rivalry']);
  assert.deepEqual([...Dex.getAbilityEffects(mega.passives[0])].sort(),['rivalry','twinfang']);
  assert(Dex.getAbilityDisplayDetails(Dex.abilities.get(mega.passives[0]),[],mega.id).desc.includes('Full local Rivalry'));
 });
 for (const [id, expected] of Object.entries(approved)) {
  it(id + ' exposes its approved effect identity for teambuilder search', () => {
   assert.deepEqual([...Dex.getAbilityEffects(id)].sort(), expected.effects);
  });
  it(id + ' keeps exact full local prose across installed data, Dex and sync manifest', () => {
   const raw = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
   const snapshot = require('../server-data-sync-manifest.json').snapshot.abilities;
   for (const key of ['shortDesc', 'desc']) {
    assert.equal(Dex.abilities.get(id)[key], expected[key], id + ' Dex ' + key);
    assert.equal(raw[id][key], expected[key], id + ' installed ' + key);
    assert.equal(snapshot[id][key], expected[key], id + ' manifest ' + key);
   }
  });
 }
});
