const assert=require('assert').strict,fs=require('fs'),path=require('path');require('./battle.test');
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js/battle-tooltips.js'),'utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
describe('Exalt battle power preview',()=>{
 it('boosts slicing and Steel Wing once, with suppression and the Cold Eclipse exception',()=>{
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Empoleon|Empoleon, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  const p=battle.p1.active[0],own={speciesForme:'Empoleon',ability:'Exalt',baseAbility:'Exalt',item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}},tips=new BattleTooltips(battle);
  try{for(const id of ['steelwing','slash']){const m=Dex.moves.get(id),value=()=>tips.getMoveBasePower(m,m.type,new ModifiableValue(battle,p,own),battle.p2.active[0]).value;assert.equal(value(),m.basePower*1.5);p.volatiles.gastroacid=['gastroacid'];assert.equal(value(),m.basePower);delete p.volatiles.gastroacid;battle.pseudoWeather=[['Cold Eclipse Terrain',0,0]];const cold=value();own.ability='No Ability';assert.equal(cold,value());own.ability='Exalt';battle.pseudoWeather=[];}
  }finally{battle.destroy();}
 });
});
describe('Dive Team Builder data',()=>{
 it('offers current-format Dive to Dragonair and Dragonite',()=>{
  const table=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
  for(const id of ['dragonair','dragonite'])assert(table.learnsets[id].dive.includes('9'),id);
 });
});
