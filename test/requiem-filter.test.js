'use strict';const assert=require('assert').strict;require('./battle.test');
describe('Requiem Filter client metadata',()=>{
 it('describes local Filter and retains unsuppressibility',()=>{const a=Dex.abilities.get('requiem');assert(a.desc.includes('20% less'));assert(a.desc.includes('40% less'));assert(a.flags.cantsuppress);assert(!a.flags.breakable);assert(Dex.getAbilityEffects('requiem').has('filter'));});
 it('keeps regular Dusknoir slots, Levitate and Mega Reaper grip unchanged',()=>{assert.deepEqual(Dex.species.get('dusknoir').abilities,{0:'Requiem',1:'Pressure',H:'Soul Reaver'});assert.deepEqual(Dex.species.get('dusknoir').passives,['levitate']);assert.deepEqual(Dex.species.get('dusknoirmega').abilities,{0:"Reaper's Grip"});});
});
