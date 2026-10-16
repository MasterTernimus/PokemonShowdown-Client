'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Probopass Bulwark client metadata',()=>{
 it('separates Filter from Nose Formation and exports the selectable Bulwark',()=>{const p=Dex.species.get('probopass');assert.deepEqual(p.abilities,{0:'Magnet Pull',1:'Magnetic Command',H:'Magnetic Bulwark'});assert.deepEqual(p.passives,['noseformation']);assert.deepEqual(p.baseStats,{hp:75,atk:35,def:150,spa:110,spd:155,spe:25});assert(!Dex.getAbilityEffects('noseformation').has('filter'));assert(Dex.getAbilityEffects('noseformation').has('elevate'));assert(Dex.getAbilityEffects('magneticbulwark').has('filter'));assert(Dex.abilities.get('noseformation').desc.includes('30 BP'));assert(Dex.abilities.get('magneticbulwark').desc.includes('once')||Dex.abilities.get('magneticbulwark').desc.includes('Once'));});
});
