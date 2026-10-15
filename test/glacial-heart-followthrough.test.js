'use strict';const assert=require('assert').strict;require('./battle.test');let battle;
describe('Glacial Heart preparation display',()=>{
 afterEach(()=>battle?.destroy());
 function setup(){battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Bax|Baxcalibur-Mega, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});return battle.p1.active[0];}
 for(const id of ['glacialheartice','glacialheartdragon'])it(id+' tracks start/end and does not pass to another Pokemon',()=>{const p=setup();battle.runMinor(['-start','p1a: Bax',id],{silent:true});assert(p.volatiles[id]);battle.p2.active[0].copyVolatileFrom(p);assert(!battle.p2.active[0].volatiles[id]);battle.runMinor(['-end','p1a: Bax',id],{silent:true});assert(!p.volatiles[id]);});
 it('shows approved components and no new selectable ability',()=>{const a=Dex.abilities.get('glacialheart');assert(a.desc.includes('Ice Body'));assert(a.desc.includes('positive opposing HP damage'));assert(!a.desc.includes('Stalwart'));assert(!Dex.abilities.get('frozenfollowthrough').exists);assert.deepEqual(Dex.species.get('baxcaliburmega').passives,['thermalexchange']);});
});
