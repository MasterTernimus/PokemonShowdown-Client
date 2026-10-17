const assert=require('assert').strict;require('./battle.test');const fixture=require('./fixtures/primordial-approved.json');
describe('Primordial and final Fan client metadata',()=>{
it('has exact Normal form and passive/selected separation',()=>{const s=Dex.species.get('regigigasprimordial');assert(s.isPrimal);assert.equal(s.bst,770);assert.deepEqual(s.types,['Normal']);assert.deepEqual(s.abilities,{0:'Worldbinder'});assert.deepEqual(s.passives,['primordialconstruct','ancientassembly']);assert.deepEqual(Dex.species.get('rotomfan').abilities,{0:'Eject',1:'Windy Surge',H:'Air Lock'});});
for(const[id,text]of Object.entries(fixture.PrimordialDescriptions))it(id+' text and components',()=>{assert.equal(Dex.abilities.get(id).shortDesc,text.shortDesc);assert.equal(Dex.abilities.get(id).desc,text.desc);assert.deepEqual(Dex.getAbilityDisplayComponents(id),fixture.PrimordialComponents[id]);});
for(const shiny of [false,true])for(const front of [false,true])it('Primordial sprite '+shiny+'/'+front,()=>{const s=Dex.getSpriteData('Regigigas-Primordial',front?1:0,{gen:9,shiny});assert(s.url.includes('regigigas-primordial.png'),s.url);});
it('uses the supplied Orb icon',()=>assert(Dex.getItemIcon('primordialorb').includes('primordialorb.png')));
});
