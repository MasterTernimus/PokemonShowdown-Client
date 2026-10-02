const assert = require('assert').strict;
require('./battle.test');
const BattleTooltips = new Function(require('fs').readFileSync(require('path').join(__dirname, '../play.pokemonshowdown.com/js/battle-tooltips.js'), 'utf8') + '\nreturn BattleTooltips;')();
global.BattleText = require('../play.pokemonshowdown.com/data/text').BattleText;
describe('Swift Swim battle hover Speed', () => {
 function setup() {
  const battle = new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mantine|Mantine, L100|100/100','|switch|p2a: Mantine|Mantine, L100|100/100']});
  const mon=battle.p1.active[0], tools=new BattleTooltips(battle);
  const own={speciesForme:'Mantine',ability:'Island Current',baseAbility:'Island Current',item:'',hp:100,maxhp:100,stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
  return {battle,mon,tools,own};
 }
 it('doubles known own Speed for original and verified composites, never stacks rain with fields',()=>{
  const {battle,mon,tools,own}=setup();
  for(const field of ['Water Surface Terrain','Underwater Terrain','Midnight Zone Terrain','Murkwater Surface Terrain']) {
   battle.pseudoWeather=[[field,0,0]];
   for(const ability of ['Island Current','Swift Swim','Warship','Noble Rider','Royal Scales']) {
    own.ability=ability;
    for(const weather of ['','raindance','primordialsea']) {battle.weather=weather;assert.equal(tools.calculateModifiedStats(mon,own).spe,200,ability+' '+field+' '+weather);}
   }
  }
  own.ability='Island Current';battle.pseudoWeather=[];battle.weather='';assert.equal(tools.calculateModifiedStats(mon,own).spe,100);
  battle.weather='raindance';assert.equal(tools.calculateModifiedStats(mon,own).spe,200);
  own.item='Utility Umbrella';assert.equal(tools.calculateModifiedStats(mon,own).spe,100);
  battle.pseudoWeather=[['Water Surface Terrain',0,0]];assert.equal(tools.calculateModifiedStats(mon,own).spe,200);
  for(const ability of ['Regenerator','Oceanic Wings','Riptide Claws']) {own.ability=ability;battle.weather='';assert.equal(tools.calculateModifiedStats(mon,own).spe,100);}
  battle.destroy();
 });
 it('respects Gastro Acid, Neutralizing Gas, revealed enemy information, and switch-out',()=>{
  const {battle,mon,tools,own}=setup();battle.pseudoWeather=[['Water Surface Terrain',0,0]];
  mon.volatiles.gastroacid=['gastroacid'];assert.equal(tools.calculateModifiedStats(mon,own).spe,100);delete mon.volatiles.gastroacid;
  const foe=battle.p2.active[0];foe.ability='Neutralizing Gas';assert.equal(tools.calculateModifiedStats(mon,own).spe,100);foe.ability='';
  const unknown=tools.renderStats(foe);assert(!unknown.includes('×2'));assert(unknown.includes('before items/abilities/modifiers'));
  foe.ability='Island Current';assert(tools.renderStats(foe).includes('doubles Speed (×2)'));assert(tools.renderStats(foe).startsWith(unknown));
  foe.volatiles.gastroacid=['gastroacid'];assert(!tools.renderStats(foe).includes('×2'));delete foe.volatiles.gastroacid;
  battle.p2.active[0]=null;assert(!tools.renderStats(foe).includes('×2'));battle.p2.active[0]=foe;
  battle.pseudoWeather=[];assert(!tools.renderStats(foe).includes('×2'));battle.weather='raindance';assert(tools.renderStats(foe).includes('unknown item effects'));
  battle.destroy();
 });
});
