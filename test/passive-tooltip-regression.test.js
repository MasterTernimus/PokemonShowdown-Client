const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();
describe('Passive tooltip calculations', () => {
 it('does not inherit passives into Aevian forms without one on the server', () => {
  for (const id of ['arcanineaevian','gyaradosaevian','gyaradosaevianmega','ampharosaevian','ampharosaevianmega','glalieaevian','glalieaevianmega','roseradeaevian','froslassaevian','froslassaevianmega','chandelureaevian','kommooaevian','toxtricityaeviangmax']) assert.deepEqual(Dex.species.get(id).passives, [], id);
 });
 let battle, p, own, tips;
 beforeEach(() => {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Galvantula|Galvantula, L100|100/100', '|switch|p2a: Chansey|Chansey, L100|100/100']});
  p = battle.p1.active[0]; p.ability = 'Neutralization';
  own = {speciesForme: 'Galvantula', ability: 'Neutralization', baseAbility: 'Neutralization', item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
  tips = new BattleTooltips(battle);
 });
 afterEach(() => battle.destroy());
 it('applies innate Compound Eyes once, including under suppression', () => {
  const accuracy = () => tips.getMoveAccuracy(Dex.moves.get('thunder'), new ModifiableValue(battle, p, own), battle.p2.active[0]).value;
  assert.equal(accuracy(), 91);
  p.volatiles.gastroacid = ['gastroacid']; assert.equal(accuracy(), 91);
  delete p.volatiles.gastroacid; p.ability = own.ability = own.baseAbility = 'Compound Eyes'; assert.equal(accuracy(), 91);
  own.passives = []; p.volatiles.gastroacid = ['gastroacid']; assert.equal(accuracy(), 70);
 });
 for (const ability of ['Sand Rush', 'Cactus Chorus']) it(ability + ' doubles Speed only once and respects suppression', () => {
  p.ability = own.ability = own.baseAbility = ability; own.passives = [];
  assert.equal(tips.calculateModifiedStats(p, own).spe, 100);
  battle.weather = 'sandstorm'; assert.equal(tips.calculateModifiedStats(p, own).spe, 200);
  battle.pseudoWeather = [['Desert Terrain', 0, 0]]; assert.equal(tips.calculateModifiedStats(p, own).spe, 200);
  battle.weather = ''; assert.equal(tips.calculateModifiedStats(p, own).spe, 200);
  battle.pseudoWeather = [['Ashen Beach Terrain', 0, 0]]; assert.equal(tips.calculateModifiedStats(p, own).spe, 200);
  p.volatiles.gastroacid = ['gastroacid']; assert.equal(tips.calculateModifiedStats(p, own).spe, 100);
 });
});
