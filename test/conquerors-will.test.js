'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe("Conqueror's Will client parity", () => {
 it('has exact Kingambit slots and components without rejected extras', () => {
  assert.deepEqual(Dex.species.get('kingambit').abilities, {0:'Defiant',1:"Conqueror's Will",H:'Royal Decree'});
  // Inner Focus is Supreme Overlord's existing search identity for its four-fallen flinch protection.
  assert.deepEqual([...Dex.getAbilityEffects('conquerorswill')].sort(), ['conquerorswill','innerfocus','supremeoverlord','unnerve']);
  assert.equal(Dex.abilities.get('conquerorswill').shortDesc, 'Grows stronger as allies fall. Opponents cannot eat Berries. Kowtow Cleave breaks their screens. Supreme Overlord caps at 5 effective faints (1.5x power).');
 });
});
