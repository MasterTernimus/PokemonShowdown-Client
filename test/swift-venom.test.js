'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
const {BattleTooltips}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips};')();
describe('Swift Venom client metadata and speed',()=>{
 it('shows exact selected abilities and Aftermath passive',()=>{assert.deepEqual(Dex.species.get('overqwil').abilities,{0:'Sea Fiend',1:'Swift Venom',H:'Intimidate'});assert.deepEqual(Dex.species.get('overqwil').passives,['aftermath']);assert(Dex.abilities.get('swiftvenom').desc.includes('Chessboard'));});
 for(const field of ['', 'Water Surface Terrain','Underwater Terrain','Murkwater Surface Terrain','Midnight Zone Terrain'])it('matches Swift Swim preview on '+(field||'no field'),()=>{const b=new Battle({debug:true,log:['|init|battle','|gen|9']});try{if(field)b.pseudoWeather=[[field,0,0]];const t=new BattleTooltips(b);for(const weather of ['', 'raindance','primordialsea'])for(const item of ['', 'utilityumbrella'])assert.equal(t.swiftSwimSpeedBoost('swiftvenom',weather,item),t.swiftSwimSpeedBoost('swiftswim',weather,item));}finally{b.destroy();}});
});
