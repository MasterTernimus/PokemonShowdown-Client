const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
global.BattleLog = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-log.js', 'utf8') + '\nreturn BattleLog;')();
const {BattleTooltips} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips};')();
describe('Adaptive Cycle client', () => {
 const memory = {active: true, activeTypes: ['Fire'], types: {Fire: {stage: 2}, Water: {stage: 3}},
  opponents: {1: {label: 'p2a: <script>hidden</script>', points: 4, complete: true, moves: ['tackle'], setup: {stage: 2}, bypass: ['Ability bypass'], defenses: ['ModifyDamage']}},
  statuses: {psn: {stage: 1}}, chip: {stealthrock: {stage: 2}}, fields: {factoryterrain: {stage: 2}}, weather: {}, field: 'factoryterrain', currentWeather: ''};
 let battle;
 afterEach(() => battle?.destroy());
 it('reconstructs observations without overwriting either ability and escapes opponent labels', () => {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
   '|switch|p1a: Kecleon|Kecleon, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100',
   '|-ability|p1a: Kecleon|Adaptive Cycle', '|-ability|p2a: Mew|Ultra Ego',
   '|-adaptation|p1a: Kecleon|' + JSON.stringify(memory)]});
  battle.seekTurn(Infinity);
  const p = battle.p1.active[0];
  assert.deepEqual(p.adaptation, memory); assert.equal(p.ability, 'Adaptive Cycle');
  assert.equal(battle.p2.active[0].ability, 'Ultra Ego');
  const text = new BattleTooltips(battle).renderAdaptation(p.adaptation);
  assert(text.includes('Fire 35%')); assert(text.includes('Water 50%')); assert(text.includes('Adapted'));
  assert(text.includes('Factory (active)')); assert(!text.includes('factoryterrain')); assert(!text.includes('not yet encountered')); assert(!text.includes('bypass counters')); assert(!text.includes('p2a:'));
  assert(text.includes('Tackle')); assert(text.includes('1/2')); assert(text.includes('2/3'));
  assert(!text.includes('<script>')); assert(text.includes('&lt;script&gt;'));
 });
 it('offers Adaptive Cycle as an event ability and Recover for both Stunfisks', () => {
  for (const id of ['silvally', 'kecleon', 'stunfisk', 'stunfiskgalar']) {
   assert.equal(Dex.species.get(id).abilities.S, 'Adaptive Cycle');
   assert(Dex.abilities.get('adaptivecycle').desc.includes('Cannot be suppressed'));
  }
  for (const id of ['stunfisk', 'stunfiskgalar']) assert(require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable.learnsets[id].recover);
 });
 it('keeps Adaptive Cycle effective under Gas and removes only learned field Speed penalties', () => {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
   '|switch|p1a: Kecleon|Kecleon, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100',
   '|-ability|p1a: Kecleon|Adaptive Cycle', '|-ability|p2a: Mew|Neutralizing Gas']});
  battle.seekTurn(Infinity); const p = battle.p1.active[0];
  assert.equal(p.effectiveAbility(), 'Adaptive Cycle');
  const own = {speciesForme: 'Kecleon', ability: 'Adaptive Cycle', item: '', level: 100, hp: 100, maxhp: 100,
   stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
  battle.pseudoWeather = [['Underwater Terrain', 0, 0]];
  const tips = new BattleTooltips(battle);
  assert.equal(tips.calculateModifiedStats(p, own).spe, 50);
  p.adaptation = {...memory, fields: {underwaterterrain: {stage: 3}}};
  assert.equal(tips.calculateModifiedStats(p, own).spe, 100);
  p.adaptation.active = false; assert.equal(tips.calculateModifiedStats(p, own).spe, 50);
 });

 it('shows Cold Eclipse Rage at 40 BP against field adaptation while retaining Dark typing', () => {
  require('../play.pokemonshowdown.com/js/battle-field-rules');require('../play.pokemonshowdown.com/js/battle-field-tooltips');
  battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Kecleon|Kecleon, L100|100/100']});battle.seekTurn(Infinity);
  battle.pseudoWeather=[['Cold Eclipse Terrain',0,0]];const p=battle.p1.active[0],target=battle.p2.active[0];
  const own={speciesForme:'Mew',ability:'No Ability',item:''};
  let result=BattleFieldTooltips.preview(battle,Dex.moves.get('rage'),p,own,target).result;
  assert.equal(result.move.basePower,60);
  target.adaptation={...memory,fields:{coldeclipseterrain:{stage:3}}};
  result=BattleFieldTooltips.preview(battle,Dex.moves.get('rage'),p,own,target).result;
  assert.equal(result.move.basePower,40);assert.equal(result.move.type,'Dark');assert.equal(result.move.category,'Physical');
 });

});
