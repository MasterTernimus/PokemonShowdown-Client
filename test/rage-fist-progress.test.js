'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Authoritative Rage Fist replay progress', () => {
 let battle;
 afterEach(() => battle?.destroy());
 it('matches server progress after Substitute, preserves fractional switching, and copies Transform', () => {
  battle = new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles',
   '|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Annihilape|Annihilape, L100|100/100',
   '|-start|p2a: Annihilape|Substitute','|move|p1a: Mew|Water Gun|p2a: Annihilape',
   '|-activate|p2a: Annihilape|move: Substitute|[damage]','|-end|p2a: Annihilape|Substitute',
   '|-damage|p2a: Annihilape|90/100','|-hitcount|p2a: Annihilape|3','|-ragefist|p2a: Annihilape|60']});
  const p=battle.p2.active[0];assert.equal(p.rageFistBonus,60);
  battle.p2.switchOut(p,{});assert.equal(p.rageFistBonus,30);battle.p2.switchIn(p,{});
  battle.runMinor(['-ragefist','p2a: Annihilape','12.5'],{});
  battle.runMinor(['-transform','p1a: Mew','p2a: Annihilape'],{});
  assert.equal(battle.p1.active[0].rageFistBonus,12.5);
  battle.runMinor(['-ragefist','p2a: Annihilape','0'],{});assert.equal(p.rageFistBonus,0);
  assert.equal(battle.p1.active[0].rageFistBonus,12.5);
 });
 it('ignores malformed progress and emits no narration', () => {
  battle=new Battle({debug:true,log:['|init|battle','|gen|9','|switch|p1a: Mew|Mew, L100|100/100']});
  const p=battle.p1.active[0];p.rageFistBonus=40;
  for(const value of ['', 'NaN','Infinity','-1','101'])battle.runMinor(['-ragefist','p1a: Mew',value],{});
  assert.equal(p.rageFistBonus,40);
  assert.equal(new BattleTextParser().parseArgs(['-ragefist','p1a: Mew','40'],{}),'');
 });
});
