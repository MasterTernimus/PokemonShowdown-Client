'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-mainmenu.js', 'utf8');
const start = source.indexOf('var CustomCalculatorPopup =');
const end = source.indexOf('var CustomCalculatorRoom =', start);
const storage = {teams: [], prefs() {return {};}};
const calc = new Function('Popup','Dex','Storage','BattleLog','app',source.slice(start,end)+'; return CustomCalculatorPopup;').call({}, {extend:x=>x}, Dex, storage, {escapeHTML:x=>String(x)}, {});
describe('Calculator usability controls', () => {
 it('rejects an unknown attacker before issuing a calculation', () => {
  const room = Object.assign({},calc, {readActor:()=>({species:'not-a-pokemon'}),validateActorImport(){},$(){return {val:()=> 'singles'};}});
  assert.throws(()=>room.validateCalcInputs(), /Attacker: choose a valid Pokémon/);
 });
 it('rejects an unknown move with valid Pokémon', () => {
  const room=Object.assign({},calc,{readActor:()=>({species:'Mew'}),validateActorImport(){},$(selector){return {val:()=>selector.includes('calc-mode')?'singles':'not-a-move'};}});
  assert.throws(()=>room.validateCalcInputs(),/valid attack/);
 });
 it('swaps copies of both sides, uses the new attacker move and clears defender screens', () => {
  const actors=[{species:'Pikachu',moves:['Thunderbolt']},{species:'Mew',moves:['Psychic']}]; const values={};
  const room=Object.assign({},calc,{readActor:i=>actors[i],validateActorImport(){},writeActor(i,a){actors[i]=a;},scenarioEdited(){},$(key){return {val:v=>{values[key]=v;},prop:(k,v)=>{values[key]=v;},text(){}};}});
  room.swapCalcActors(); assert.equal(actors[0].species,'Mew'); assert.equal(actors[1].species,'Pikachu');
  assert.equal(values['[name=calc-move]'],'Psychic'); assert.equal(values['[name=reflect], [name=lightscreen], [name=auroraveil]'],false);
 });
});
