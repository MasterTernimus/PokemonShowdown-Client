'use strict';const assert=require('assert').strict;require('./battle.test');
describe('Dual Wield and initial rampage client metadata',()=>{
for(const mode of ['singles','doubles','freeforall'])for(const sharp of [false,true])it(mode+' Dual Wield with Sharpness='+sharp,()=>{const m=Dex.moves.get('metalclaw'),profile=Dex.getDrillPowerProfile(m,n=>n==='Dual Wield'||sharp&&n==='Sharpness','',mode);assert.deepEqual(profile.hits,sharp?[1.5,0.15]:[0.6,0.6]);});
for(const mode of ['singles','doubles','freeforall'])for(const move of ['metalclaw','aurasphere','psychocut'])for(const sharp of [false,true])it(mode+' Siege Launcher '+move+' Sharpness='+sharp,()=>{
 const m=Dex.moves.get(move),effects=Dex.getAbilityEffects('siegelauncher');
 const has=n=>n==='Siege Launcher'||effects.has(toID(n))||sharp&&n==='Sharpness';
 const profile=Dex.getDrillPowerProfile(m,has,'',mode);
 const boost=(m.flags.pulse||m.flags.bullet?1.5:1)*(sharp&&m.flags.slicing?1.5:1),scale=mode==='freeforall'?1:0.6;
 assert.deepEqual(profile.hits,mode!=='freeforall'&&sharp&&m.flags.slicing?[boost,0.15]:[boost*scale,boost*scale]);
});
for(const id of ['outrage','thrash','petaldance','ragingfury'])it(id+' initial target is opposing selectable',()=>{assert.equal(Dex.moves.get(id).target,'adjacentFoe');assert.match(Dex.moves.get(id).desc,/initial turn/);});
it('Mega Gyarados has limited Tempest Fury and keeps Unleashed Ego',()=>{assert.deepEqual(Dex.species.get('gyaradosmega').passives,['tempestfury']);assert.equal(Dex.species.get('gyaradosmega').abilities[0],'Unleashed Ego');});
});
