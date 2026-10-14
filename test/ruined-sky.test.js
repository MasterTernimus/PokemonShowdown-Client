'use strict';const assert=require('assert').strict;require('./battle.test');
describe('Ruined Sky generated client data',()=>{
 for(const[id,passives]of [['escavalier',['overcoat']],['sirfetchd',['stickyhold']]])it(id+' has the optional signature and original passive',()=>{assert.equal(Dex.species.get(id).abilities.S,'Ruined Sky');assert.deepEqual(Dex.species.get(id).passives,passives);});
 it('lists exactly the two approved holders',()=>{assert.deepEqual(Object.keys(BattlePokedex).filter(id=>Object.values(Dex.species.get(id).abilities).includes('Ruined Sky')).sort(),['escavalier','sirfetchd']);});
 it('exposes Mold Breaker and explains the once-only target bonus and retained type immunity',()=>{assert(Dex.getAbilityEffects('ruinedsky').has('moldbreaker'));assert.deepEqual(Dex.getAbilityDisplayComponents('ruinedsky'),['moldbreaker']);const a=Dex.abilities.get('ruinedsky');assert.match(a.desc,/1\.3/);assert.match(a.desc,/only once/);assert.match(a.desc,/does not bypass type immunities/);});
});
