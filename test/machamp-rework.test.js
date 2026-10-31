'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path'),vm=require('vm');
const context=require('./helpers/isolated-dex.cjs')();context.BattleText=require('../play.pokemonshowdown.com/data/text').BattleText;
for(const file of ['battle-scene-stub','battle-text-parser','battle','battle-log','battle-tooltips'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js',file+'.js'),'utf8'),context);
const {Battle,BattleTooltips,ModifiableValue}=vm.runInContext('({Battle,BattleTooltips,ModifiableValue})',context),{Dex}=context;
describe('Machamp client parity',()=>{
 it('syncs four forms, passives, components and descriptions',()=>{
  const snapshot=require('../server-data-sync-manifest.json').snapshot;
  for(const id of ['machamp','machampalt','machampgmax','machampgmaxalt']){const s=Dex.species.get(id);assert.deepEqual(Array.from(s.passives),['innerfocus']);assert.equal(s.abilities[0],id.includes('gmax')?"Titan's Knuckles":'Grit and Glory');assert.equal(s.baseStats.atk,130);}
  for(const[id,component]of [['gritandglory','guts'],['perfectform','ironfist'],['titansknuckles','ironfist']]){assert(Dex.getAbilityEffects(id).has(component));assert.equal(Dex.abilities.get(id).desc,snapshot.abilities[id].desc);}
  assert(!Dex.getAbilityEffects('fourthholdguard').has('battlearmor'));
 });
 it('previews Iron Fist once on Perfect Form and Titan, but not on Guard or Guts',()=>{
  const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Machamp|Machamp, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});b.seekTurn(Infinity);
  try{const p=b.p1.active[0],t=b.p2.active[0],tips=new BattleTooltips(b),own={speciesForme:'Machamp',ability:'Perfect Form',baseAbility:'Perfect Form',passives:['innerfocus'],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}};const m=Dex.moves.get('machpunch');
   for(const name of ['Perfect Form',"Titan's Knuckles",'Fourthhold Guard','Grit and Glory']){own.ability=own.baseAbility=name;const multiplier=['Perfect Form',"Titan's Knuckles"].includes(name)?1.4:1;assert(Math.abs(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),t).value-m.basePower*multiplier)<0.001,name);}
   own.ability=own.baseAbility='Perfect Form';p.volatiles.gastroacid=['gastroacid'];assert.equal(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),t).value,m.basePower);
  }finally{b.destroy();}
 });
});
