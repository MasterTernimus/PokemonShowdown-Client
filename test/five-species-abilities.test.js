'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Approved five species ability metadata',()=>{
 for(const [species,slot,id,parts] of [['noctowl','1','nightwatch',['keeneye','insomnia']],['tropius','0','fruitfulbough',['harvest']],['dhelmise','1','soulanchor',['steelworker']],['lanturn','H','guidinglight',['dazzling','illuminate']],['vespiquen','0','royalescort',['pressure','sweetveil']]])it(species+' exposes its approved ability and components',()=>{
  const a=Dex.abilities.get(id);assert(a.exists);assert.equal(Dex.species.get(species).abilities[slot],a.name);for(const part of parts)assert(Dex.getAbilityEffects(id).has(part));assert(a.desc.length>30);assert(a.shortDesc.length<150);
 });
});
