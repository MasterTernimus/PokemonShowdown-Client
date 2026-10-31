'use strict';
const assert=require('assert').strict,fs=require('fs');
global.window=global;
for(const[file,key]of [['pokedex','BattlePokedex'],['abilities','BattleAbilities'],['moves','BattleMovedex'],['typechart','BattleTypeChart'],['aliases','BattleAliases']])global[key]=require('../play.pokemonshowdown.com/data/'+file+'.js')[key];
require('../play.pokemonshowdown.com/js/battle-dex-data.js');require('../play.pokemonshowdown.com/js/battle-dex.js');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
const tips=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-field-tooltips.js','utf8')+'\nreturn BattleFieldTooltips;')();
const actor=()=>tips.pokemon(null,{speciesForme:'Mew',ability:'No Ability',item:'',status:'',hp:100,maxhp:100});
function evaluate(field,id,weather='',variant=0){const rule=BattleFieldRules.find(f=>f.id===field);assert(rule,field);return tips.evaluate(rule,Dex.moves.get(id),actor(),actor(),weather,variant);}

describe('Field audit preview regressions',()=>{
 it('previews Oceanic Operetta with the Burning Field extinguishing-move bonus',()=>{
  assert.equal(evaluate('burningterrain','oceanicoperetta').factor,1.3);
  assert.equal(evaluate('burningterrain','hydrovortex').factor,1.3);
 });
 it('shows current Magma Armor Eclipse effects in base and composite descriptions',()=>{
  for(const id of ['magmaarmor','unboundblaze','burningspirit','blazingtempo','hisuianresolve','sunsovereign','burningcrown','calderacore','burningego']){
   const desc=Dex.abilities.get(id).desc;
   assert.match(desc,/Dragon(?:'s)? Den and Infernal Eclipse block Fire moves/,id);
   assert.match(desc,/Volcanic (?:or|and) Infernal Eclipse entry/,id);
   assert.doesNotMatch(desc,/Volcanic (?:or|and) Cold Eclipse entry/,id);
  }
 });
});

describe('Eclipse field client integration',()=>{
 for(const field of ['coldeclipseterrain','infernaleclipseterrain'])it(field+' shows the Dragon bonus',()=>{assert.equal(evaluate(field,'dragonpulse').factor,2);});
 it('Cold Eclipse preserves Ice subtyping without the wind bonus',()=>{assert.deepEqual(evaluate('coldeclipseterrain','surf').move.types,['Water','Ice']);assert.equal(evaluate('coldeclipseterrain','gust').factor,1);});
 it('Snowy Field converts the listed attacks to pure Ice',()=>{const r=evaluate('snowyterrain','ironhead');assert.equal(r.move.type,'Ice');assert.deepEqual(r.move.types,['Ice']);assert.equal(r.factor,1.5);});
 for(const name of ['Mud Barrage','Mud-Slap'])it('Snowy Field previews '+name+' as the canonical Ice attack with its field boost',()=>{
  const move=Dex.moves.get(name);assert.equal(move.id,'mudbarrage');assert.equal(move.type,'Ground');
  const result=evaluate('snowyterrain',name);
  assert.equal(result.move.id,'mudbarrage');assert.equal(result.move.type,'Ice');assert.deepEqual(result.move.types,['Ice']);assert.equal(result.factor,1.5);
  assert.equal(Dex.moves.get(name).type,'Ground');
 });
 it('Cold Eclipse blocks new Rooms in move previews',()=>{assert(evaluate('coldeclipseterrain','trickroom').failed);});
 it('Rift Opening and Rift Herald are visible with current descriptions',()=>{assert(Dex.moves.get('riftopening').exists);assert.match(Dex.abilities.get('riftherald').desc,/Rift Eclipse/);assert.match(Dex.moves.get('snowscape').desc,/Snowy Field/);});
 it('selected abilities describe both Eclipse fields',()=>{for(const id of ['icescales','prismarmor'])assert.match(Dex.abilities.get(id).desc,/Infernal Eclipse/);});
 it('changing fields preserves Rooms, pauses only their clocks in Cold, and resumes in Rift',()=>{
  for(const name of ['battle-scene-stub','battle-text-parser','battle'])require('../play.pokemonshowdown.com/js/'+name+'.js');
  const b=new Battle({debug:true});try {
   b.runMinor(['-fieldstart','move: Trick Room'],{turns:'8'});
   b.runMinor(['-fieldstart','Cold Eclipse Terrain'],{turns:'5'});
   b.runMinor(['-fieldstart','Frozen Aura'],{aura:'3'});b.updateTurnCounters();
   assert.equal(b.pseudoWeather.find(x=>x[0]==='Trick Room')[1],8);assert.equal(b.pseudoWeather.find(x=>x[0]==='Frozen Aura')[1],2);
   b.runMinor(['-fieldstart','Rift Eclipse Terrain'],{turns:'4'});b.updateTurnCounters();
   assert.equal(b.pseudoWeather.find(x=>x[0]==='Trick Room')[1],7);assert(!b.hasPseudoWeather('Cold Eclipse Terrain'));
   b.runMinor(['-fieldstart','Infernal Eclipse Terrain'],{turns:'3'});assert.equal(b.getTerrainId('Infernal Eclipse Terrain'),'infernaleclipseterrain');
  }finally{b.destroy();}
 });
});

describe('Seed Aura client integration',()=>{
 it('Ashen Aura replaces Frozen Aura and can be replaced without stale labels',()=>{
  for(const name of ['battle-scene-stub','battle-text-parser','battle'])require('../play.pokemonshowdown.com/js/'+name+'.js');
  const b=new Battle({debug:true});try {
   b.runMinor(['-fieldstart','Rift Eclipse Terrain'],{turns:'4'});
   b.runMinor(['-fieldstart','Frozen Aura'],{aura:'5'});
   b.runMinor(['-fieldstart','Ashen Aura'],{aura:'3'});
   assert(!b.hasPseudoWeather('Frozen Aura'));assert(b.hasPseudoWeather('Rift Eclipse Terrain'));
   assert.deepEqual(b.pseudoWeather.find(x=>x[0]==='Ashen Aura'),['Ashen Aura',3,0]);
   b.runMinor(['-fieldstart','Electric Aura'],{aura:'5'});assert(!b.hasPseudoWeather('Ashen Aura'));
  }finally{b.destroy();}
 });
 it('Ashen Aura previews independent Fire and named move power',()=>{
  const aura=BattleAuraRules.ashenaura;assert(aura);
  const p=actor();p.isGrounded=()=>false;
  assert.equal(tips.evaluate({id:''},Dex.moves.get('flamethrower'),p,p,'',0,aura).factor,1.3);
  assert.equal(tips.evaluate({id:''},Dex.moves.get('darkpulse'),p,p,'',0,aura).factor,1.5);
  assert(Math.abs(tips.evaluate({id:''},Dex.moves.get('bitterblade'),p,p,'',0,aura).factor-1.95)<1e-8);
  const field=BattleFieldRules.find(f=>f.id==='infernaleclipseterrain');
  for(const id of ['flamethrower','scorchingsands','rockslide'])assert.equal(tips.evaluate(field,Dex.moves.get(id),p,p,'',0,aura).factor,1.5);
 });
 it('shows matching Aura Nature Power calls and the updated seed descriptions',()=>{
  const {BattleTooltips}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips};')();
  const b=new Battle({debug:true});try {
   b.gen=9;b.runMinor(['-fieldstart','Ashen Aura'],{aura:'5'});
   assert.equal(BattleTooltips.getNaturePowerMove(b).id,'infernalparade');
   b.runMinor(['-fieldstart','Frozen Aura'],{aura:'5'});assert.equal(BattleTooltips.getNaturePowerMove(b).id,'icebeam');
   assert.match(Dex.abilities.get('ashenseeds').desc,/Eruption/);
   assert.match(Dex.abilities.get('badseeds').desc,/Glaciate/);
  }finally{b.destroy();}
 });
});

describe('Infernal Eclipse expanded move previews',()=>{
 for(const [id,types,factor] of [
  ['ironhead',['Steel','Fire'],1.5],['earthquake',['Ground','Fire'],1.5],['rockslide',['Rock','Fire'],1.5],
  ['icebeam',['Ice','Fire'],0.75],['surf',['Water'],0.5],['moonblast',['Fairy'],0.5],
  ['aurasphere',['Fighting','Dark'],1.5],['frustration',['Normal','Dark'],1.5],['spiritbreak',['Fairy','Dark'],1.5],
 ])it(id+' preserves its complete typing and stacked factor',()=>{
  const r=evaluate('infernaleclipseterrain',id);assert.deepEqual(r.move.types||[r.move.type],types);assert.equal(r.factor,factor);
 });
 for(const[id,factor]of [['blastburn',2.25],['infernalparade',1.5],['inferno',2.25],['infernooverdrive',2.25],['earthpower',2.25],['precipiceblades',2.25],['ragingfury',2.25],['punishment',3],['smog',2],['dreameater',2]])it(id+' shows named and type power without double-applying either',()=>{assert.equal(evaluate('infernaleclipseterrain',id).factor,factor);});
 for(const id of ['inferno','willowisp','darkvoid'])it(id+' shows no accuracy check',()=>{assert.equal(evaluate('infernaleclipseterrain',id).accuracy,true);});
 it('previews Nasty Plot at three Special Attack stages',()=>{assert.deepEqual(evaluate('infernaleclipseterrain','nastyplot').move.boosts,{spa:3});});
 it('preserves Ground bone and Armorize Steel subtyping exceptions',()=>{
  const field=BattleFieldRules.find(f=>f.id==='infernaleclipseterrain'),target=actor();
  const bone=tips.evaluate(field,Dex.moves.get('bonemerang'),actor(),target);assert.deepEqual(bone.move.types||[bone.move.type],['Ground']);assert.equal(bone.factor,1);
  const armor=tips.pokemon(null,{speciesForme:'Mew',ability:'Armorize',item:'',status:'',hp:100,maxhp:100});
  const steel=tips.evaluate(field,Dex.moves.get('ironhead'),armor,target);assert.deepEqual(steel.move.types||[steel.move.type],['Steel']);assert.equal(steel.factor,1);
 });
 it('reconciles Ashen Aura Fire with new broad subtyping without losing the Ice penalty',()=>{
  const field=BattleFieldRules.find(f=>f.id==='infernaleclipseterrain'),p=actor();
  assert.equal(tips.evaluate(field,Dex.moves.get('icebeam'),p,p,'',0,BattleAuraRules.ashenaura).factor,0.75);
  assert.equal(tips.evaluate(field,Dex.moves.get('earthpower'),p,p,'',0,BattleAuraRules.ashenaura).factor,2.25);
 });
});
