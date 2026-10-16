'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Authoritative recharge display', () => {
 let battle, oldStatusAnims;
 beforeEach(() => { oldStatusAnims = global.BattleStatusAnims; global.BattleStatusAnims ||= {}; });
 afterEach(() => {
  battle?.destroy();
  if (oldStatusAnims === undefined) delete global.BattleStatusAnims;
  else global.BattleStatusAnims = oldStatusAnims;
 });
 function setup() {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
   '|switch|p1a: Mew|Mew, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
  return battle.p1.active[0];
 }
 it('clears canceled recharge without clearing unrelated move statuses', () => {
  const p = setup();
  battle.runMinor(['-mustrecharge', 'p1a: Mew'], {});
  p.addMovestatus('grudge');
  assert(p.movestatuses.mustrecharge);
  battle.runMinor(['-end', 'p1a: Mew', 'mustrecharge'], {silent: '.'});
  assert(!p.movestatuses.mustrecharge);
  assert(p.movestatuses.grudge);
  battle.runMinor(['-end', 'p1a: Mew', 'mustrecharge'], {silent: '.'});
  assert(!p.movestatuses.mustrecharge);
 });
 it('does not infer cancellation from an unrelated KO', () => {
  const p = setup();
  battle.runMinor(['-mustrecharge', 'p1a: Mew'], {});
  battle.runMajor(['faint', 'p2a: Mew'], {});
  assert(p.movestatuses.mustrecharge);
 });
 it('clears real recharge after its cant event and accepts the server end event', () => {
  const p = setup();
  battle.runMinor(['-mustrecharge', 'p1a: Mew'], {});
  battle.runMajor(['cant', 'p1a: Mew', 'recharge'], {});
  assert(!p.movestatuses.mustrecharge);
  battle.runMinor(['-end', 'p1a: Mew', 'mustrecharge'], {silent: '.'});
  assert(!p.movestatuses.mustrecharge);
 });
});
