'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Three approved nerf metadata',()=>{
 for(const id of ['supremeoverlord','royalsun','apexbond','ragingoverlord','tyrantdomain'])it(id+' advertises the shared cap',()=>{assert.match(Dex.abilities.get(id).desc,/capped at 5 after Free-for-All/);assert.match(Dex.abilities.get(id).desc,/1\.5x/);});
 it('Kingambit receives the capped primitive as a passive, separate from Conquerors Will',()=>{assert.deepEqual(Dex.species.get('kingambit').passives,['supremeoverlord']);assert.match(Dex.abilities.get('supremeoverlord').desc,/capped at 5 after Free-for-All/);assert(!Dex.getAbilityEffects('conquerorswill').has('supremeoverlord'));});
 it('distinguishes Twin Blades from unchanged Twin Cannons',()=>{assert.match(Dex.abilities.get('twinblades').desc,/60% power per hit in FFA/);assert.match(Dex.abilities.get('twincannons').desc,/full power in FFA/);});
 for(const id of ['shedskin','streettyrant'])it(id+' describes shared quarter recovery without a Scrafty penalty',()=>{const d=Dex.abilities.get('shedskin').desc;assert.match(d,/1\/4 max HP/);assert(!/1\/8/.test(d));assert.match(d,/50% chance/);if(id==='streettyrant'){assert.deepEqual(Dex.species.get('scraftymega').passives,['shedskin']);assert(!Dex.getAbilityEffects(id).has('shedskin'));}});
});
