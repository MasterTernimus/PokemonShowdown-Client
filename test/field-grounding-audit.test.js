const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
const {BattleTooltips} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips};')();
describe('Field Speed grounding audit', () => {
 let battle, tips, own;
 beforeEach(() => {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Bronzong|Bronzong, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
  tips = new BattleTooltips(battle);
  own = {speciesForme: 'Bronzong', ability: 'Levitate', baseAbility: 'Levitate', item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
  battle.pseudoWeather = [['Icy Terrain', 0, 0]];
 });
 afterEach(() => battle.destroy());
 it('does not slow unrevealed Levitate or Air Balloon switch-ins', () => {
  assert.equal(tips.calculateModifiedStats(null, own).spe, 100);
  own.ability = own.baseAbility = 'No Ability'; own.item = 'Air Balloon';
  assert.equal(tips.calculateModifiedStats(null, own).spe, 100);
 });
 it('grounds under Gravity, Iron Ball and suppressed items', () => {
  own.item = 'Iron Ball'; assert.equal(tips.calculateModifiedStats(null, own).spe, 37);
  own.item = ''; battle.pseudoWeather.push(['Gravity', 0, 0]);
  assert.equal(tips.calculateModifiedStats(null, own).spe, 75);
  battle.pseudoWeather.pop(); own.ability = own.baseAbility = 'No Ability'; own.item = 'Air Balloon';
  battle.pseudoWeather.push(['Magic Room', 0, 0]);
  assert.equal(tips.calculateModifiedStats(null, own).spe, 75);
 });
 it('recognizes airborne composites consistently for active and unrevealed Pokemon', () => {
  own.ability = own.baseAbility = 'Pulse Triad';
  battle.p1.active[0].ability = 'Pulse Triad';
  assert.equal(tips.calculateModifiedStats(null, own).spe, 100);
  assert.equal(tips.calculateModifiedStats(battle.p1.active[0], own).spe, 100);
  battle.p1.active[0].volatiles.gastroacid = ['gastroacid'];
  assert.equal(tips.calculateModifiedStats(battle.p1.active[0], own).spe, 75);
 });
 it('does not exempt airborne Pokemon from the unconditional Underwater non-Water slowdown', () => {
  battle.pseudoWeather = [['Underwater Terrain', 0, 0]];
  assert.equal(tips.calculateModifiedStats(null, own).spe, 50);
 });
});
