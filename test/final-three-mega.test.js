'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path');
require('./battle.test');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-tooltips.js'), 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();
describe('Final three Mega designs UI', () => {
 it('publishes only the approved Aura Precision components and Entrenched passive', () => {
  const s = Dex.species.get('Lucario-Mega-Z');
  assert.equal(s.abilities[0], 'Aura Precision');
  assert.deepEqual(s.passives, ['auraguard']);
  const effects = Dex.getAbilityEffects('auraprecision');
  assert(effects.has('shielddust') && effects.has('technician'));
  assert(!effects.has('dualwield') && !effects.has('innerfocus'));
  assert.deepEqual(Dex.species.get('Haxorus-Mega').passives, ['entrenched']);
 });
 it('previews Aura Precision Technician once with the Factory threshold and honors suppression', () => {
  const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Lucario|Lucario-Mega-Z, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
  try {
   const p = battle.p1.active[0], q = battle.p2.active[0];
   const own = {speciesForme: 'Lucario-Mega-Z', ability: 'Aura Precision', baseAbility: 'Aura Precision', passives: ['auraguard'], item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
   p.ability = 'Aura Precision';
   const tips = new BattleTooltips(battle);
   const power = bp => { const v = new ModifiableValue(battle, p, own); tips.getMoveBasePower({...Dex.moves.get('tackle'), basePower: bp}, 'Normal', v, q); return v.value; };
   assert.equal(power(40), 60);
   assert.equal(power(70), 70);
   battle.addPseudoWeather('Factory Terrain', 5, 5);
   assert.equal(power(70), 105);
   p.volatiles.gastroacid = ['gastroacid'];
   assert.equal(power(70), 70);
   assert.equal(tips.calculateModifiedStats(p, own).atk, 100);
  } finally { battle.destroy(); }
 });
});
