'use strict';
const assert=require('assert').strict,fs=require('fs');
global.window=global;
for(const[file,key]of [['pokedex','BattlePokedex'],['abilities','BattleAbilities'],['moves','BattleMovedex'],['typechart','BattleTypeChart']])global[key]=require('../play.pokemonshowdown.com/data/'+file+'.js')[key];
require('../play.pokemonshowdown.com/js/battle-dex-data.js');require('../play.pokemonshowdown.com/js/battle-dex.js');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
const tips=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-field-tooltips.js','utf8')+'\nreturn BattleFieldTooltips;')();
const actor=()=>tips.pokemon(null,{speciesForme:'Mew',ability:'No Ability',item:'',status:'',hp:100,maxhp:100});
function evaluate(field,id,weather='',variant=0){const rule=BattleFieldRules.find(f=>f.id===field);assert(rule,field);return tips.evaluate(rule,Dex.moves.get(id),actor(),actor(),weather,variant);}
describe('Signature move field previews',()=>{
 for(const[field,weather,factor]of [['holyterrain','',1.5],['starlightarenaterrain','',2],['starlightarenaterrain','raindance',1],['newworldterrain','',4]])it('Nostras '+field+'/'+weather+' shows exact field factor',()=>{const r=evaluate(field,'nostraswish',weather);assert.equal(r.factor,factor);assert.equal(r.move.basePower,140);});
 for(const field of ['factoryterrain','shortcircuitterrain'])it('UMD '+field+' previews both computed-category branches without exporting engine closures',()=>{
  const rule=BattleFieldRules.find(f=>f.id===field),move=Dex.moves.get('superumdmove');
  const results=tips.variantValues(rule,move).map(v=>evaluate(field,'superumdmove','',v));
  assert.deepEqual([...new Set(results.map(r=>r.move.category))].sort(),['Physical','Special']);
  assert.deepEqual([...new Set(results.map(r=>r.factor))].sort(),[1.5,1.95]);
  for(const r of results)assert.equal(r.factor,(field==='factoryterrain'?r.move.category==='Physical':r.move.category==='Special')?1.95:1.5);
 });
 it('Aquabatics shows +2 SpA/Speed on Big Top with +1/+1 baseline',()=>{const r=evaluate('bigtopterrain','aquabatics');assert.deepEqual(r.move.boosts,{spa:2,spe:2});assert.deepEqual(r.baseline.boosts,{spa:1,spe:1});});
 it('UMD generated preview contains no expectedCategory engine closure',()=>{assert(!BattleFieldMoveRules.superumdmove.onModifyMove.toString().includes('expectedCategory'));});


 for(const category of ['Physical','Special'])it('Queen Gambit preserves incoming '+category+' and Chessboard Queen critical hit',()=>{
  const field=BattleFieldRules.find(f=>f.id==='chessboardterrain'),move={...Dex.moves.get('queensgambit'),category};
  const r=tips.evaluate(field,move,{...actor(),Role:'Queen'},actor());assert.equal(r.move.category,category);assert.equal(r.move.willCrit,true);
  const ordinary=tips.evaluate(field,move,{...actor(),Role:''},actor());assert(!ordinary.move.willCrit);
 });
 for(const category of ['Physical','Special','tie'])it('Time Blade Holy preview follows actual staged '+category+' category',()=>{
  for(const name of ['battle-scene-stub','battle-text-parser','battle'])require('../play.pokemonshowdown.com/js/'+name+'.js');
  const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
  global.BattleFieldTooltips=tips;
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{battle.pseudoWeather=[['Holy Terrain',0,0]];const p=battle.p1.active[0];if(category!=='tie')p.boosts[category==='Physical'?'atk':'spa']=1;
   const own={speciesForme:'Mew',ability:'No Ability',baseAbility:'No Ability',item:'',level:100,hp:100,maxhp:100,status:'',moves:[],stats:{atk:100,spa:100,def:100,spd:100,spe:100}};
   const tool=new BattleTooltips(battle);const result=tool.getMoveBasePower(Dex.moves.get('timeblade'),'Fairy',new ModifiableValue(battle,p,own),battle.p2.active[0]);assert.equal(result.value,category==='Physical'?70:105);
  }finally{battle.destroy();}
 });

 it('Wisteria field preview preserves Physical category for burn while Special ties avoid burn penalty',()=>{
  for(const name of ['battle-scene-stub','battle-text-parser','battle'])require('../play.pokemonshowdown.com/js/'+name+'.js');
  const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();global.BattleFieldTooltips=tips;
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{battle.pseudoWeather=[['Holy Terrain',0,0]];const p=battle.p1.active[0];p.status='brn';
   const own={speciesForme:'Mew',ability:'No Ability',baseAbility:'No Ability',item:'',level:100,hp:100,maxhp:100,status:'brn',moves:[],stats:{atk:100,spa:100,def:100,spd:100,spe:100}};
   const tool=new BattleTooltips(battle);p.boosts.atk=1;assert.equal(tool.getMoveBasePower(Dex.moves.get('wisteriamaelstrom'),'Grass',new ModifiableValue(battle,p,own),battle.p2.active[0]).value,35);
   p.boosts.atk=0;assert.equal(tool.getMoveBasePower(Dex.moves.get('wisteriamaelstrom'),'Grass',new ModifiableValue(battle,p,own),battle.p2.active[0]).value,70);
  }finally{battle.destroy();}
 });
 const ids=Object.keys(require('../server-data-sync-manifest.json').snapshot.moves).filter(id=>require('../server-data-sync-manifest.json').snapshot.moves[id].signatureCharacters);
 for(const id of ids)it(id+' evaluates on the six signature preview fields without missing callback dependencies',()=>{
  for(const field of ['holyterrain','starlightarenaterrain','newworldterrain','factoryterrain','shortcircuitterrain','bigtopterrain']){
   const r=evaluate(field,id);assert(Number.isFinite(r.factor),field);assert(r.move.category,field);
  }
 });
});

describe('Signature aura preview parity',()=>{
 for(const category of ['Physical','Special'])for(const electric of [false,true])it('KABOOM previews its matching '+category+' boost; electric='+electric,()=>{
  const field=electric?BattleFieldRules.find(f=>f.id==='electricterrain'):{id:''};
  const r=tips.evaluate(field,{...Dex.moves.get('kaboom'),category},actor(),actor());
  assert.equal(r.move.category,category);
  assert.deepEqual(r.move.secondaries[0].self.boosts,{[category==='Physical'?'atk':'spa']:1});
  assert.equal(!!r.move.recoil,!electric);
  assert(/matching Atk\/SpA/.test(Dex.moves.get('kaboom').shortDesc));
  assert(/Attack when Physical, Sp. Atk when Special/.test(Dex.moves.get('kaboom').desc));
 });
 for(const mode of ['neither','terrain','aura','both'])for(const id of ['kaboom','flutterscales','deiludicium'])it(id+' '+mode,()=>{
  const onField=mode==='terrain'||mode==='both',onAura=mode==='aura'||mode==='both',match=id==='kaboom'?'electricterrain':'rainbowterrain';
  const field=onField?BattleFieldRules.find(f=>f.id===match):{id:''};
  const r=tips.evaluate(field,Dex.moves.get(id),actor(),actor(),'',0,onAura?BattleAuraRules[match]:undefined);
  if(id==='kaboom')assert.equal(!!r.move.recoil,mode==='neither');
  else assert(Math.abs(r.factor-(mode==='neither'?1:id==='flutterscales'?1.5:onField?2.25:1.95))<0.001,r.factor);
 });
});
