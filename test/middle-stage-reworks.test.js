'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Dodrio and middle-stage client data',()=>{
 const snapshot=require('../server-data-sync-manifest.json').snapshot;
 const raw=require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
 const abilities=['triplethreat','longstride','dreamingshell','linkedminds','weatherweave','pressurejet','rivalappetites','causticmucus','ironsolute','medicinalscales','castoffscales'];
 it('keeps species stats and ability choices in sync across data layers',()=>{
  for(const id of ['dodrio','shelgon','metang','dragonair','pupitar','zweilous','sliggoo','sliggoohisui','gabite','hakamoo']) {
   for(const s of [Dex.species.get(id),raw[id]]) {
    assert.deepEqual(s.baseStats,snapshot.species[id].baseStats,id);
    assert.deepEqual(s.abilities,snapshot.species[id].abilities,id);
    assert.deepEqual(s.passives,snapshot.species[id].passives,id);
   }
   if(id!=='dodrio') {const bst=Object.values(Dex.species.get(id).baseStats).reduce((a,b)=>a+b,0);assert(bst>=480&&bst<=500);}
  }
  assert.deepEqual(Dex.species.get('dodrio').passives,['hydrabond']);
  assert.deepEqual(Dex.species.get('shelgon').passives,['shellarmor']);
  assert.deepEqual(Dex.species.get('pupitar').passives,['eartheater']);
  assert.deepEqual(Dex.species.get('zweilous').passives,['hydrabond']);
 });
 it('shows only the new Triple Threat components and keeps Long Stride searchable',()=>{
  const parts=Dex.getAbilityEffects('triplethreat');
  for(const id of ['innerfocus','keeneye','earlybird'])assert(parts.has(id));
  for(const id of ['hydrabond','tangledfeet','limber','bigpecks'])assert(!parts.has(id),id);
  assert(Dex.getAbilityEffects('longstride').has('striker'));
 });
 it('publishes matching concise descriptions and searchable abilities',()=>{
  const index=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
  for(const id of abilities){
   const a=Dex.abilities.get(id);assert(a.exists,id);
   assert.equal(a.desc,snapshot.abilities[id].desc,id);assert.equal(a.shortDesc,snapshot.abilities[id].shortDesc,id);
   assert(index.some(row=>row[0]===id&&row[1]==='ability'),id);
  }
 });
 it('previews the new power bonuses and suppresses selected bonuses correctly',()=>{
  const fs=require('fs'),path=require('path'),vm=require('vm');
  const context=require('./helpers/isolated-dex.cjs')();
  context.BattleText=require('../play.pokemonshowdown.com/data/text').BattleText;
  for(const file of ['battle-scene-stub','battle-text-parser','battle','battle-log','battle-tooltips'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js',file+'.js'),'utf8'),context);
  const {Battle,BattleTooltips,ModifiableValue}=vm.runInContext('({Battle,BattleTooltips,ModifiableValue})',context),{Dex}=context;
  const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try {
   const p=b.p1.active[0],q=b.p2.active[0],tips=new BattleTooltips(b);
   for(const [ability,id,factor]of [['Long Stride','megakick',1.4],['Linked Minds','psychic',1.2],['Weather Weave','weatherball',1.3]]) {
    const own={speciesForme:'Mew',ability,baseAbility:ability,passives:[],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
    const m=Dex.moves.get(id);delete p.volatiles.gastroacid;
    assert.equal(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),q).value,m.basePower*factor,ability);
    p.volatiles.gastroacid=['gastroacid'];
    assert.equal(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),q).value,m.basePower,ability);
   }
  }finally{b.destroy();}
 });
});
