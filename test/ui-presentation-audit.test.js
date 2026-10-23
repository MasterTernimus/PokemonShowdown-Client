'use strict';
const fs=require('fs'),assert=require('assert').strict,ts=require('typescript');
require('./battle.test');
const code=fs.readFileSync('play.pokemonshowdown.com/js/client-battle.js','utf8');
function method(name){let found;const walk=n=>{if(ts.isPropertyAssignment(n)&&n.name.getText()===name)found=n.initializer.getText();ts.forEachChild(n,walk);};walk(ts.createSourceFile('client.js',code,ts.ScriptTarget.Latest,true));assert(found);return new Function('Dex','BattleLog','return '+found)(Dex,BattleLog);}
describe('Bounded presentation audit regressions',()=>{
 it('Living Legend no longer searches or previews as Sheer Force',()=>{
  assert.deepEqual([...Dex.getAbilityEffects('livinglegend')].sort(),['download','flashfire','livinglegend']);
  assert.deepEqual(Dex.getAbilityDisplayComponents('livinglegend').sort(),['download','flashfire']);
 });
 for(const [species,ability,form]of [['Politoed','Aevian King','politoedrejuv'],['Poliwrath','Aevian Ascendance','poliwrathrejuv'],['Galvantula','Aevian Web','galvantularejuv']])it(species+' imported event set previews the authoritative form without mutation',()=>{
  const set={species,ability,item:'Leftovers',moves:['Protect']},before=JSON.stringify(set);
  assert.equal(Dex.getAbilityFormPreview(set).species.id,form);
  assert.equal(JSON.stringify(set),before);
  const other=Object.values(Dex.species.get(species).abilities).find(a=>a!==ability);
  assert.equal(Dex.getAbilityFormPreview({...set,ability:other}).species.id,toID(species));
 });
 it('switch-position HP fills are proportional and expose exact health',()=>{
  const mons=[100,50,1,0].map((hp,i)=>({name:'Slot '+i,hp,maxhp:100,fainted:hp===0,getHPColorClass:()=> 'hpbar'}));
  let html='';
  method('updateSwitchControls').call({choice:{choices:[],switchOutFlags:[]},request:{side:{}},battle:{pokemonControlled:4,myPokemon:mons,nearSide:{active:[]}},getTimerHTML:()=>'',setControlsHTML:s=>{html=s;}},'switchposition');
  for(const hp of [100,50,1,0]){assert(html.includes('aria-label="HP '+hp+' of 100"'));assert(html.includes('width:'+hp+'%'));}
  assert(!html.includes('width:92px'));
 });
 it('ordinary switch buttons expose health without relying on color',()=>{
  const pokemon={ident:'p1: Example',hp:50,maxhp:100,getHPColorClass:()=> 'hpbar-yellow'};
  const html=method('displayParty').call({battle:{pokemonControlled:0,nearSide:{active:[]},mySide:{}},choice:{switchFlags:[]}},[pokemon],false);
  assert(html.includes('role="img" aria-label="HP 50 of 100"'));
  assert(html.includes('width:50%'));
 });
});
