'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path'), vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
context.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;
for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle', 'battle-log', 'battle-tooltips']) {
 vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js', file + '.js'), 'utf8'), context);
}
const {Battle, BattleTextParser, BattleTooltips, ModifiableValue} = vm.runInContext('({Battle,BattleTextParser,BattleTooltips,ModifiableValue})', context);
const {Dex} = context;

describe('Empoleon X/Y client parity',()=>{
 let battle,p,q,own,tips;afterEach(()=>{battle?.destroy();battle=null;});
 function setup(form='Empoleon-Mega-X',ability='Monarch of Ice'){
  battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Emperor|'+form+', L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});battle.seekTurn(Infinity);p=battle.p1.active[0];q=battle.p2.active[0];p.ability=p.baseAbility=ability;
  own={speciesForme:form,ability,baseAbility:ability,item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100},passives:['proficient']};tips=new BattleTooltips(battle);
 }
 it('exports two Megas, their stones, legacy aliases and renamed ability',()=>{
  assert.equal(Dex.species.get('empoleonmegax').baseStats.atk,126);assert.equal(Dex.species.get('empoleonmegay').baseStats.spa,156);
  assert.deepEqual(Array.from(Dex.species.get('empoleon').otherFormes),['Empoleon-Mega-X','Empoleon-Mega-Y']);
  assert.equal(Dex.species.get('Empoleon-Mega').id,'empoleonmegay');assert.equal(Dex.items.get('Empoleonite').megaStone.Empoleon,'Empoleon-Mega-Y');
  assert.equal(Dex.items.get('Empoleonite X').megaStone.Empoleon,'Empoleon-Mega-X');assert.equal(Dex.items.get('Empoleonite Y').megaStone.Empoleon,'Empoleon-Mega-Y');
  assert.equal(Dex.abilities.get('Exalt').name,'Imperial Edge');assert.equal(Dex.abilities.get('Imperial Edge').exists,true);
  for(const id of ['empoleonmegax','empoleonmegay'])assert.deepEqual(Array.from(Dex.species.get(id).passives),['proficient']);
 });
 it('uses X artwork in all four views and preserves Y artwork',()=>{
  for(const isFront of [true,false])for(const shiny of [true,false]){
   const x=Dex.getSpriteData('empoleonmegax',isFront,{gen:9,shiny});const y=Dex.getSpriteData('empoleonmegay',isFront,{gen:9,shiny});
   assert(x.url.includes('empoleon-mega-x.png'),x.url);assert(y.url.includes('empoleon-alt.png'),y.url);
   assert(fs.existsSync(path.resolve('play.pokemonshowdown.com',x.url.slice(x.url.indexOf('sprites/')).split('?')[0])));
  }
 });
 it('displays Royal Collision and its recoil without changing the PP tracker',()=>{
  setup();const text=tips.showMoveTooltip(Dex.moves.get('wavecrash'),'',p,own);assert(text.includes('Royal Collision'));assert(text.includes('10%'));assert(text.includes('Water and Ice'));
  assert.equal(Dex.moves.get('royalcollision').recoil[1],10);p.rememberMove('Royal Collision',1);assert.equal(p.moveTrack.find(m=>m[0]==='Wave Crash')[1],1);
  p.addVolatile('gastroacid');assert(!tips.showMoveTooltip(Dex.moves.get('wavecrash'),'',p,own).includes('Royal Collision'));
 });
 it('previews Ice-field Speed and Defense once',()=>{
  setup();battle.weather='hail';battle.addPseudoWeather('Icy Terrain',5,5);const stats=tips.calculateModifiedStats(p,own);assert.equal(stats.spe,200);assert.equal(stats.def,225);
 });
 it('shows Y Flying STAB and no Slush Rush component',()=>{
  setup('Empoleon-Mega-Y',"Emperor's Resolve");assert(tips.showMoveTooltip(Dex.moves.get('airslash'),'',p,own).includes('receives Flying STAB'));
  assert(!Dex.getAbilityEffects('emperorsresolve').has('slushrush'));assert(Dex.getAbilityEffects('emperorsresolve').has('competitive'));
 });
});
