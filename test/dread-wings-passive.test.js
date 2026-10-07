'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Hydreigon passive and Dread Wings client parity',()=>{
 it('separates the species Levitate passive from the selected Intimidate/Unnerve package',()=>{
  assert.deepEqual(Dex.species.get('hydreigon').passives,['levitate']);
  assert.deepEqual(Object.values(Dex.species.get('hydreigon').abilities),['Dread Wings','Dark Dominion','Void Tyrant']);
  assert.deepEqual(Dex.getAbilityDisplayComponents('dreadwings',Dex,['levitate']),['intimidate','unnerve']);
  assert(Dex.getAbilityEffects('dreadwings').has('intimidate'));assert(Dex.getAbilityEffects('dreadwings').has('unnerve'));assert(!Dex.getAbilityEffects('dreadwings').has('levitate'));
 });
 for(const fixture of require('./fixtures/dread-wings-passive-protocol.json'))it('replays '+fixture.name+' without assigning component names to chosen abilities',()=>{
  const battle=new Battle({debug:true,log:['|init|battle',...fixture.log]});
  try{for(const side of [battle.p1,battle.p2])for(const p of side.pokemon){assert.notEqual(p.ability,'Intimidate');assert.notEqual(p.ability,'Unnerve');assert.notEqual(p.ability,'Levitate');}if(fixture.name==='dread-wings-components')assert.equal(battle.p1.active[0].ability,'Dread Wings');}finally{battle.destroy();}
 });
});
