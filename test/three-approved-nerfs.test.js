'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Three approved nerf metadata',()=>{
 for(const id of ['supremeoverlord','royalsun','conquerorswill','apexbond','ragingoverlord','tyrantdomain'])it(id+' advertises the shared cap',()=>{assert.match(Dex.abilities.get(id).desc,/capped at 5 after Free-for-All/);assert.match(Dex.abilities.get(id).desc,/1\.5x/);});
 it('distinguishes Twin Blades from unchanged Twin Cannons',()=>{assert.match(Dex.abilities.get('twinblades').desc,/60% power per hit in FFA/);assert.match(Dex.abilities.get('twincannons').desc,/full power in FFA/);});
 for(const id of ['shedskin','streettyrant'])it(id+' describes species-scoped recovery',()=>{const d=Dex.abilities.get(id).desc;assert.match(d,/Scrafty/);assert.match(d,/1\/8/);assert.match(d,/other users and composites retain 1\/4/);});
});
