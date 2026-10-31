'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Three approved nerf metadata',()=>{
 for(const id of ['supremeoverlord','royalsun','apexbond','ragingoverlord'])it(id+' advertises the shared cap',()=>{assert.match(Dex.abilities.get(id).desc,/capped at 5 after Free-for-All/);assert.match(Dex.abilities.get(id).desc,/1\.5x/);});
 it('Kingambit receives the capped primitive as a passive, separate from Conquerors Will',()=>{assert.deepEqual(Dex.species.get('kingambit').passives,['supremeoverlord']);assert.match(Dex.abilities.get('supremeoverlord').desc,/capped at 5 after Free-for-All/);assert(!Dex.getAbilityEffects('conquerorswill').has('supremeoverlord'));});
 it('Tyrant Domain retains the capped Supreme Overlord component and its replacement gift',()=>{assert(Dex.getAbilityEffects('tyrantdomain').has('supremeoverlord'));assert.match(Dex.abilities.get('tyrantdomain').desc,/replacement \+1 Attack/);});
 it('both twin attacks use 60% then 40% power in every format',()=>{for(const id of ['twinblades','twincannons']){assert.match(Dex.abilities.get(id).desc,/60% then 40%/);assert.match(Dex.abilities.get(id).desc,/same power applies in every format/);}});
 for(const id of ['shedskin','streettyrant'])it(id+' describes shared quarter recovery without a Scrafty penalty',()=>{const d=Dex.abilities.get('shedskin').desc;assert.match(d,/1\/4 max HP/);assert(!/1\/8/.test(d));assert.match(d,/50% chance/);if(id==='streettyrant'){assert.deepEqual(Dex.species.get('scraftymega').passives,['shedskin']);assert(!Dex.getAbilityEffects(id).has('shedskin'));}});
});
