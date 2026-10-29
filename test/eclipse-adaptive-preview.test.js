'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();

describe('Sheer Cold adaptive client previews', () => {
 let battle, pokemon, own, tooltips;
 beforeEach(() => {
  battle = new Battle({debug:true, log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  pokemon = battle.p1.active[0];
  own = {speciesForme:'Mew', ability:'No Ability', baseAbility:'No Ability', item:'', hp:100, maxhp:100, level:100, status:'', stats:{atk:100, def:100, spa:100, spd:100, spe:100}};
  tooltips = new BattleTooltips(battle);
 });
 afterEach(() => battle.destroy());
 function category() {return tooltips.getMoveType(Dex.moves.get('sheercold'), new ModifiableValue(battle, pokemon, own))[1];}
 for (const [species, expected] of [['Weavile','Physical'], ['Arboliva-Aevian','Special']]) it('uses the higher attacking stat for ' + species, () => {
  const data = Dex.species.get(species);
  assert(data.exists);
  pokemon.speciesForme = own.speciesForme = species;
  own.stats = {...own.stats, atk:data.baseStats.atk, spa:data.baseStats.spa};
  assert.equal(category(), expected);
 });
 it('uses stages with Special ties and ignores ordinary Attack modifiers', () => {
  own.item = 'Choice Band'; pokemon.ability = own.ability = own.baseAbility = 'Huge Power'; pokemon.status = 'brn';
  assert.equal(category(), 'Special');
  pokemon.boosts.atk = 1; assert.equal(category(), 'Physical');
  pokemon.boosts.spa = 1; assert.equal(category(), 'Special');
  assert.deepEqual(own.stats, {atk:100, def:100, spa:100, spd:100, spe:100});
  assert.equal(Dex.moves.get('sheercold').category, 'Special');
 });
 it('passes the adaptive category to field power previews', () => {
  const previous = window.BattleFieldTooltips, seen = [];
  window.BattleFieldTooltips = {preview(b, move) {seen.push(move.category); return null;}};
  try {
   for (const [atk, spa, expected] of [[200,100,'Physical'],[100,200,'Special'],[100,100,'Special']]) {
    own.stats.atk = atk; own.stats.spa = spa; seen.length = 0;
    tooltips.getMoveBasePower(Dex.moves.get('sheercold'), 'Ice', new ModifiableValue(battle, pokemon, own), battle.p2.active[0]);
    assert(seen.length); assert(seen.every(category => category === expected));
   }
  } finally {window.BattleFieldTooltips = previous;}
 });
 it('preserves the local damaging-move metadata', () => {
  const move = Dex.moves.get('sheercold');
  assert.equal(move.basePower, 130); assert.equal(move.accuracy, 90); assert.equal(move.pp, 5); assert(!move.ohko);
  assert.match(move.desc, /higher staged Attack or Sp\. Atk \(Special on ties\)/);
 });
});
