'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Mountain Rift revival display', () => {
 let battle;
 afterEach(() => { battle?.destroy(); });
 function start(side, before, after) {
  const ident = side + 'a: Torterra';
  battle = new Battle({debug: true, log: [
   '|init|battle', '|gen|9', '|gametype|singles',
   '|switch|' + ident + '|Torterra-Rift, M|' + before,
   '|-damage|' + ident + '|0 fnt',
   '|-activate|' + ident + '|ability: Mountain Rift',
   '|detailschange|' + ident + '|Torterra-Rift-Shatter, M',
   '|-heal|' + ident + '|' + after + '|[silent]',
   '|-heal|' + ident + '|' + after + '|[from] ability: Mountain Rift',
  ]});
  battle.seekTurn(Infinity);
  return battle[side].active[0];
 }
 for (const [before, after] of [[225, 255], [257, 287], [441, 501], [504, 564]]) {
  it('shows full restored HP when the maximum changes from ' + before + ' to ' + after, () => {
   const p = start('p1', before + '/' + before, after + '/' + after);
   assert.equal(p.speciesForme, 'Torterra-Rift-Shatter');
   assert.equal(p.hp, after);
   assert.equal(p.maxhp, after);
   assert.equal(p.fainted, false);
   assert.equal(p.hpWidth(100), 100);
   battle.runMinor(['-damage', 'p1a: Torterra', (after - 100) + '/' + after], {});
   assert.equal(p.hp, after - 100);
   assert(p.hpWidth(100) > 0 && p.hpWidth(100) < 100);
  });
 }
 it('also restores the opponent percentage bar without revealing exact HP', () => {
  const p = start('p2', '100/100', '100/100');
  assert.equal(p.fainted, false);
  assert.equal(p.maxhp, 100);
  assert.equal(p.hpWidth(100), 100);
 });
 it('keeps Shatter alive across a switch and still displays a later genuine faint', () => {
  const p = start('p1', '504/504', '564/564');
  for (const line of ['|switch|p1a: Mew|Mew|341/341',
   '|switch|p1a: Torterra|Torterra-Rift-Shatter, M|564/564']) battle.add(line);
  battle.seekTurn(Infinity);
  assert.equal(battle.p1.active[0], p);
  assert.equal(p.fainted, false);
  assert.equal(p.hpWidth(100), 100);
  battle.add('|-damage|p1a: Torterra|0 fnt');
  battle.add('|faint|p1a: Torterra');
  battle.seekTurn(Infinity);
  assert.equal(p.fainted, true);
  assert.equal(p.hpWidth(100), 0);
 });
 it('does not treat ordinary healing or an unrelated form as a Mountain Rift revival', () => {
  const p = start('p1', '504/504', '564/564');
  battle.runMinor(['-damage', 'p1a: Torterra', '0 fnt'], {});
  battle.runMinor(['-heal', 'p1a: Torterra', '100/564'], {from: 'move: Recover'});
  assert.equal(p.fainted, true);
  p.speciesForme = 'Torterra';
  battle.runMinor(['-heal', 'p1a: Torterra', '100/564'], {from: 'ability: Mountain Rift'});
  assert.equal(p.fainted, true);
 });
});
