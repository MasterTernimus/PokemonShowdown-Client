'use strict';
const assert=require('assert').strict,fs=require('fs'),vm=require('vm');
const context=require('./helpers/isolated-dex.cjs')();
context.BattleText=require('../play.pokemonshowdown.com/data/text.js').BattleText;
for(const file of ['battle-scene-stub','battle-text-parser','battle','battle-log','battle-tooltips'])vm.runInContext(fs.readFileSync('play.pokemonshowdown.com/js/'+file+'.js','utf8'),context);
const {Battle,BattleTooltips,ModifiableValue}=vm.runInContext('({Battle,BattleTooltips,ModifiableValue})',context),Dex=context.Dex;
describe('October audit runtime parity',()=>{
 let battle;afterEach(()=>battle?.destroy());
 function setup(ability,item=''){
  battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Emperor|Empoleon, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});battle.seekTurn(Infinity);
  const p=battle.p1.active[0],q=battle.p2.active[0];p.ability=p.baseAbility=ability;
  const own={speciesForme:'Empoleon',ability,baseAbility:ability,item,hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100},passives:[]},tips=new BattleTooltips(battle);
  return {p,own,power(id){const m=Dex.moves.get(id);return tips.getMoveBasePower(m,m.type,new ModifiableValue(battle,p,own),q).value;}};
 }
 for(const ability of ['Imperial Edge','Exalt'])it('previews Steel Wing and slicing once for '+ability,()=>{
  const h=setup(ability);for(const id of ['steelwing','slash']){
   assert.equal(h.power(id),Dex.moves.get(id).basePower*1.5);
   h.p.addVolatile('gastroacid');assert.equal(h.power(id),Dex.moves.get(id).basePower);h.p.removeVolatile('gastroacid');
  }
 });
 for(const item of ['Amulet Coin','Star Sweet'])it('uses canonical item mechanics for '+item,()=>{
  const data=Dex.items.get(item);assert.equal(data.id,'amuletcoin');assert.equal(data.fling.basePower,10);
  const h=setup('No Ability',item);assert.equal(h.power('fling'),10);battle.addPseudoWeather('Magic Room',5,5);assert.equal(h.power('fling'),0);
 });
 it('previews Natural Gift from its berry and handles non-berries safely',()=>{
  const h=setup('No Ability','Cheri Berry');assert.equal(h.power('naturalgift'),Dex.items.get('Cheri Berry').naturalGift.basePower);
  h.own.item='Amulet Coin';assert.equal(h.power('naturalgift'),0);
 });
 it('keeps hidden forms internal but excludes them from nickname suggestions',()=>{
  const source=fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js','utf8');
  const a=source.indexOf('Object.keys(window.BattlePokedex || {}).forEach'),z=source.indexOf('\n\t\t\thtml +=',a);
  const html=new Function('window','Dex','escape','let html="";'+source.slice(a,z)+';return html;')(context,Dex,String);
  assert(Dex.species.get('Hydreigon-Mega').exists);assert(html.includes('value="Hydreigon"'));assert(!html.includes('value="Hydreigon-Mega"'));
 });
});
