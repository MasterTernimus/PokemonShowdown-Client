'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Six approved ability revision metadata',()=>{
 for(const [species,slot,id,component] of [['greninja','0','liquidarsenal','technician'],['chesnaught','H','knightsreprisal','bulletproof'],['ninetalesalola','H','voidsanctum','snowwarning'],['raichu','0','chargedtail','static'],['meowscarada','0','falsebouquet','magician']])it(species+' has approved distribution and component identity',()=>{const a=Dex.abilities.get(id);assert.equal(Dex.species.get(species).abilities[slot],a.name);assert(Dex.getAbilityEffects(id).has(component));assert(a.desc.length>50);assert(a.shortDesc.length<150);});
 it('preserves confirmed Battle Bond event slots',()=>{for(const id of ['greninja','garchomp']){assert.equal(Dex.species.get(id).abilities.S,'Battle Bond');assert.notEqual(Dex.species.get(id).abilities.H,'Battle Bond');}assert.equal(Dex.species.get('garchomp').abilities[1],'Supreme Overlord');assert.equal(Dex.species.get('greninja').abilities[1],'Protean');});
});
