'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Tailwind explicit remaining-turn protocol', () => {
 function battleWith(message) {
  return new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|player|p1|A', '|player|p2|B', message]});
 }
 for (const turns of [2, 4, 6]) it('uses the server duration of ' + turns + ' turns', () => {
  const battle = battleWith('|-sidestart|p1: A|move: Tailwind|[turns] ' + turns);
  try { assert.equal(battle.p1.sideConditions.tailwind[2], turns); assert.equal(battle.p1.sideConditions.tailwind[3], turns); }
  finally { battle.destroy(); }
 });
 it('updates an existing four-turn display when Windy Surge resets it to two', () => {
  const battle = battleWith('|-sidestart|p1: A|move: Tailwind|[turns] 4');
  try {
   battle.add('|-sidestart|p1: A|move: Tailwind|[turns] 2');
   assert.equal(battle.p1.sideConditions.tailwind[2], 2);
   assert.equal(battle.p1.sideConditions.tailwind[3], 2);
  } finally { battle.destroy(); }
 });
 it('retains ordinary four-turn fallback for older logs', () => {
  const battle = battleWith('|-sidestart|p1: A|move: Tailwind');
  try { assert.equal(battle.p1.sideConditions.tailwind[2], 4); }
  finally { battle.destroy(); }
 });
});
