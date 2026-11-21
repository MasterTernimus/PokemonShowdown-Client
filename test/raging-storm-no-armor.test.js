const assert=require('assert').strict;require('./battle.test');
describe('Raging Storm without armor metadata',()=>{for(const id of ['ragingstorm','ragingoverlord','unleashedego'])it(id+' removes inherited Battle Armor descriptions',()=>{const a=Dex.abilities.get(id);assert(!/Battle Armor|armor protection|20% less attack damage/.test(a.desc));assert(!/armor/i.test(a.shortDesc));assert(/priority.*halved|half damage from priority/i.test(a.desc));assert(/60%/.test(a.desc));});});

describe('Raging Storm under Neutralizing Gas', () => {
 it('shows suppression with Chople Berry and restores the ability when Gas leaves', () => {
  const battle = new Battle({debug:true, log:['|init|battle','|gen|9','|gametype|singles',
   '|switch|p1a: Haxorus|Haxorus, L100|100/100','|switch|p2a: Weezing|Weezing, L100|100/100',
   '|-ability|p2a: Weezing|Neutralizing Gas']});
  try {
   const user = battle.p1.active[0], set = {ability:'Raging Storm', item:'Chople Berry'};
   assert.equal(user.effectiveAbility(set), '');
   assert.equal(user.effectiveAbility({...set, item:'Ability Shield'}), 'Raging Storm');
   battle.p2.active[0].ability = '';
   assert.equal(user.effectiveAbility(set), 'Raging Storm');
  } finally { battle.destroy(); }
 });
});
