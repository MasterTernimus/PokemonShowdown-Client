'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
describe('Void Crossing curse client visibility',()=>{
 it('separates passive Levitate from Magic Guard/Infiltrator and shows only the curse as extra text',()=>{
  const s=Dex.species.get('mismagius'),a=Dex.abilities.get('voidcrossing');
  assert.deepEqual(s.passives,['levitate']);assert.deepEqual(Dex.getAbilityDisplayComponents(a.id,Dex,s.passives),['magicguard','infiltrator']);
  assert(!Dex.getAbilityEffects(a.id).has('levitate'));assert(Dex.hasAbilityEffect(s,'Levitate'));assert(Dex.hasAbilityEffect(s,'Infiltrator'));
  assert(a.shortDesc.includes('20%'));assert(!/first|New World|accuracy|Sp. Atk/.test(a.desc));
  assert(fs.readFileSync('play.pokemonshowdown.com/src/battle-animations.ts','utf8').includes("voidcrossingcurse: ['Cursed: next attack &times;0.8', 'bad']"));
 });
 for(const fixture of require('./fixtures/void-crossing-protocol.json'))it('replays '+fixture.name+' without replacing the affected target ability',()=>{
  const b=new Battle({debug:true,log:['|init|battle',...fixture.log]});
  try{const t=b.p2.active[0];assert.notEqual(t.ability,'Void Crossing');assert.notEqual(t.baseAbility,'Void Crossing');
   assert.equal(!!t.volatiles.voidcrossingcurse,fixture.name==='applied');
  }finally{b.destroy();}
 });
});
