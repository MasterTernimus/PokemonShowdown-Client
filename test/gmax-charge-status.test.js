'use strict';const assert=require('assert').strict;require('./battle.test');
describe('Approved Gmax and charge/status metadata',()=>{
 for(const[id,component,removed]of [['wickedsnare','intimidate',['stakeout','tanglinghair']],['sweetsanctuary','stamina',['ripen','sweetveil','aromaveil','pastelveil']]])it(id+' exposes its new full component',()=>{const effects=Dex.getAbilityEffects(id);assert(effects.has(component));for(const old of removed)assert(!effects.has(old));});
 it('preserves Gmax species passives',()=>{for(const id of ['grimmsnarlgmax','grimmsnarlgmaxazzy'])assert.deepEqual(Dex.species.get(id).passives,['prankster']);assert.deepEqual(Dex.species.get('alcremiegmax').passives,['friendguard']);});
 it('describes Omen per-recipient switch reset and independent skips',()=>{const desc=Dex.abilities.get('voidomen').desc;assert(desc.includes('Each Pokemon skips one charge turn per switch-in'));assert(desc.includes('shared with Lunar Orbit'));});
 it('describes Requiem without automatic Perish or faint healing',()=>{const desc=Dex.abilities.get('requiem').desc;assert(!/automatically.*Perish Song|heals?.*foes faint/.test(desc));assert(desc.includes('40% less'));});
});
