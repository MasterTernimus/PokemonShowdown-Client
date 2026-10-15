'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();
describe('Personal sun tooltip parity', () => {
 let battle, p, own, tips;
 beforeEach(() => {
  battle = new Battle({debug:true, log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Lurantis|Lurantis, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  p=battle.p1.active[0]; p.ability='Chlorophyll';
  own={speciesForme:'Lurantis',ability:'Chlorophyll',baseAbility:'Chlorophyll',item:'',hp:100,maxhp:100,level:100,status:'',passives:['solarmimicry'],stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
  tips=new BattleTooltips(battle);
 });
 afterEach(() => battle.destroy());
 function check(speed,type,power) {
  assert.equal(tips.calculateModifiedStats(p,own).spe,speed);
  const move=Dex.moves.get('weatherball');
  assert.equal(tips.getMoveType(move,new ModifiableValue(battle,p,own))[0],type);
  const html=tips.showMoveTooltip(move,'',p,own);
  assert(html.includes('Base power: '+power),html);
 }
 for(const weather of ['', 'raindance', 'hail', 'deltastream']) it('personal sun overrides '+(weather||'clear weather')+' without changing the field',()=>{
  battle.weather=weather;check(200,'Fire',100);assert.equal(battle.weather,weather);
 });
 it('an active Utility Umbrella blocks personal sun, but Magic Room restores it',()=>{
  battle.weather='raindance';own.item='Utility Umbrella';check(100,'Normal',50);
  battle.pseudoWeather=[['Magic Room',0,0]];check(200,'Fire',100);
 });
 for(const ability of ['Cloud Nine','Air Lock','Gentle Giant']) it(ability+' suppresses personal sun; Gastro Acid restores it',()=>{
  const foe=battle.p2.active[0];foe.ability=ability;check(100,'Normal',50);
  foe.volatiles.gastroacid=['gastroacid'];check(200,'Fire',100);
 });
 it('selected ability suppression disables Chlorophyll but preserves the species passive',()=>{
  p.volatiles.gastroacid=['gastroacid'];check(100,'Fire',100);
 });
 it('selected Solar Mimicry is disabled by Gastro Acid',()=>{
  own.passives=[];p.ability=own.ability=own.baseAbility='Solar Mimicry';check(100,'Fire',100);
  p.volatiles.gastroacid=['gastroacid'];check(100,'Normal',50);
 });
 for(const [weather,type,power]of [['','Normal',50],['raindance','Water',100],['hail','Ice',100],['deltastream','Flying',100]]) it('ordinary holders retain '+(weather||'clear weather')+' behavior',()=>{
  own.passives=[];p.ability=own.ability=own.baseAbility='No Ability';battle.weather=weather;check(100,type,power);
 });
 it('Weather Ball explains the custom Hail and Delta Stream behavior',()=>{
  const desc=Dex.moves.get('weatherball').desc;
  assert(desc.includes('Ice in Hail'));assert(desc.includes('Flying in Delta Stream'));
  assert(!desc.includes('other than Delta Stream'));assert(desc.includes('Solar Mimicry'));
 });
});
