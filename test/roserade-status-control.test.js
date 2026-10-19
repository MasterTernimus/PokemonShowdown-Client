'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Roserade status-control metadata',()=>{
 for(const[id,parts]of [['falsedevotion',['prankster','serenegrace']],['truedevotion',['prankster','serenegrace','technician']]])it(id+' shows only approved components and full charge-skipping help',()=>{
  assert.deepEqual([...Dex.getAbilityEffects(id)].sort(),[id,...parts].sort());
  assert.deepEqual([...Dex.getAbilityDisplayComponents(id)].sort(),parts.sort());
  const a=Dex.abilities.get(id);assert(a.desc.includes('60%'));assert(a.desc.includes('Skips move charge turns'));assert(a.desc.includes('guaranteed'));assert(!/Natural Recovery|Regenerator|switching.*heal/i.test(a.desc));
 });
 it('retains base, Mega and Aevian slots and passives',()=>{
  assert.equal(Dex.species.get('roserade').abilities[0],'False Devotion');assert.equal(Dex.species.get('roseradeaevian').abilities.H,'False Devotion');assert.equal(Dex.species.get('roserademega').abilities[0],'True Devotion');
  assert.deepEqual(Dex.species.get('roserade').passives,['beguilingbouquet']);assert.deepEqual(Dex.species.get('roserademega').passives,['beguilingbouquet']);assert.deepEqual(Dex.species.get('roseradeaevian').passives,[]);
 });
});
