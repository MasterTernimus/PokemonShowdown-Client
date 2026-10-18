const assert=require('assert').strict,fs=require('fs');require('./battle.test');
global.BattleMovedex=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
describe('Sirens Veil ready display',()=>{
 it('parses ready state, previews power once, and clears the state',()=>{
  const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{const p=b.p1.active[0],own={speciesForme:'Mew',ability:'No Ability',baseAbility:'No Ability',passives:[],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}},tips=new BattleTooltips(b),m=Dex.moves.get('tackle');const power=()=>tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),b.p2.active[0]).value;const base=power();b.add("|-start|p1a: Mew|Siren's Veil");b.seekTurn(Infinity);assert(p.volatiles.sirensveil);assert.equal(power(),base*1.3);b.add("|-end|p1a: Mew|Siren's Veil");b.seekTurn(Infinity);assert(!p.volatiles.sirensveil);assert.equal(power(),base);}finally{b.destroy();}
 });
 it('explains charge lifecycle without offensive stat boosts',()=>{const m=Dex.moves.get('sirensveil');assert(m.desc.includes('1.3x'));assert(m.desc.includes('does not stack'));assert(m.desc.includes('Raises Defense and Sp. Def by 1'));const src=fs.readFileSync('play.pokemonshowdown.com/src/battle-animations.ts','utf8');assert(src.includes('Veil ready: 1.3x'));assert(src.includes('Spent even on miss or protection'));});
});
