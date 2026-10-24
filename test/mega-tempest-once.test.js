'use strict';const assert=require('assert').strict;require('./battle.test');
describe('Shared Gyarados Tempest Fury passive wording',()=>{
 it('retains repeatable selected-ability compatibility separately from the shared passive',()=>{const a=Dex.abilities.get('tempestfury');assert(!/once per battle/i.test(a.desc));assert.match(a.desc,/Surviving an opposing direct attack/);assert.equal(Dex.species.get('gyarados').abilities[1],'Intimidate');});
 it('uses limited contextual passive details with persistent acquisition and separate base charge',()=>{const a=Dex.getPassiveAbilityDetails('tempestfury');assert.match(a.shortDesc,/Once per battle/);assert.match(a.desc,/switching and form changes/);assert.match(a.desc,/does not transfer/);assert.deepEqual(Dex.species.get('gyaradosmega').passives,['tempestfury']);});
 it('keeps selected Unleashed Ego components separate from Tempest Fury',()=>{assert(!Dex.getAbilityEffects('unleashedego').has('tempestfury'));for(const id of ['ultraego','levitate','ragingstorm'])assert(Dex.getAbilityEffects('unleashedego').has(id));});
});
