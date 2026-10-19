'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Probopass Bulwark client metadata',()=>{
 it('separates Filter from Nose Formation and exports plain selectable Filter',()=>{const p=Dex.species.get('probopass');assert.deepEqual(p.abilities,{0:'Magnet Pull',1:'Magnetic Command',H:'Filter'});assert.deepEqual(p.passives,['noseformation']);assert.deepEqual(p.baseStats,{hp:75,atk:35,def:150,spa:110,spd:155,spe:25});assert(!Dex.getAbilityEffects('noseformation').has('filter'));assert(Dex.getAbilityEffects('noseformation').has('elevate'));assert(Dex.getAbilityEffects('magneticbulwark').has('filter'));assert(Dex.abilities.get('noseformation').desc.includes('30 BP'));assert(!/once per entry/i.test(Dex.abilities.get('magneticbulwark').desc));});
});
