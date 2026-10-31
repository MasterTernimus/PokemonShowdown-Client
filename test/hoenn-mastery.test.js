'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path'),vm=require('vm');
const context=require('./helpers/isolated-dex.cjs')();context.BattleText=require('../play.pokemonshowdown.com/data/text').BattleText;
for(const file of ['battle-scene-stub','battle-text-parser','battle','battle-log','battle-tooltips'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js',file+'.js'),'utf8'),context);
const {Battle,BattleTooltips,ModifiableValue}=vm.runInContext('({Battle,BattleTooltips,ModifiableValue})',context),{Dex}=context;
describe('Hoenn Mastery client parity',()=>{
 it('retains each original component, syncs the slots, and leaves Megas unchanged',()=>{
  const snapshot=require('../server-data-sync-manifest.json').snapshot;
  for(const[id,component,species,slot,mega]of [['canopymastery','dualwield','sceptile','1','Raging Thicket'],['blazemastery','striker','blaziken','1','Raging Flame'],['tidalmastery','damp','swampert','H','Raging Current']]){
   assert(Dex.getAbilityEffects(id).has(component));assert.equal(Dex.abilities.get(id).desc,snapshot.abilities[id].desc);
   assert.equal(Dex.species.get(species).abilities[slot],Dex.abilities.get(id).name);assert.equal(Dex.species.get(species+'mega').abilities[0],mega);
  }
 });
 it('previews adaptive Grass and the combined kick multiplier, respecting suppression',()=>{
  const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});b.seekTurn(Infinity);
  try{const p=b.p1.active[0],t=b.p2.active[0],tips=new BattleTooltips(b),own={speciesForme:'Mew',ability:'Canopy Mastery',baseAbility:'Canopy Mastery',passives:[],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:80,def:100,spa:120,spd:100,spe:100}};
   assert.equal(tips.getMoveType(Dex.moves.get('leafblade'),new ModifiableValue(b,p,own))[1],'Special');
   own.ability=own.baseAbility='Blaze Mastery';const m=Dex.moves.get('blazekick');
   assert(Math.abs(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),t).value-m.basePower*1.82)<0.001);
   p.volatiles.gastroacid=['gastroacid'];assert.equal(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),t).value,m.basePower);
  }finally{b.destroy();}
 });
});
