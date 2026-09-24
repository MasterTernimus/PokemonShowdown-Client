
'use strict';
const assert = require('assert').strict;
global.window = global;
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex.js').BattlePokedex;
global.BattleAbilities = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
require('../play.pokemonshowdown.com/js/battle-dex-data.js');
require('../play.pokemonshowdown.com/js/battle-dex.js');
require('../play.pokemonshowdown.com/js/battle-scene-stub.js');
require('../play.pokemonshowdown.com/js/battle-text-parser.js');
require('../play.pokemonshowdown.com/js/battle.js');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
require('../play.pokemonshowdown.com/js/battle-field-tooltips.js');
describe('Aura client support', () => {
 it('keeps the base field and exact Aura timer together, replaces only the Aura, and removes it', () => {
  const battle = new Battle({debug: true});
  battle.gen = 9;
  battle.runMinor(['-fieldstart', 'Factory Terrain'], {});
  battle.runMinor(['-fieldstart', 'Electric Aura'], {aura: '5'});
  assert(battle.hasPseudoWeather('Factory Terrain'));
  assert.deepEqual(battle.pseudoWeather.find(p => p[0] === 'Electric Aura'), ['Electric Aura', 5, 0]);
  battle.runMinor(['-fieldstart', 'Grassy Aura'], {aura: '3'});
  assert(!battle.hasPseudoWeather('Electric Aura'));
  assert(battle.hasPseudoWeather('Factory Terrain'));
  battle.runMinor(['-fieldend', 'Grassy Aura'], {aura: '.'});
  assert(!battle.hasPseudoWeather('Grassy Aura'));
  assert(battle.hasPseudoWeather('Factory Terrain'));
  battle.destroy();
 });
 it('shows the merged Factory and Electric Aura type boost', () => {
  const source = BattleFieldTooltips.pokemon();
  const field = BattleFieldRules.find(f => f.id === 'factoryterrain');
  const result = BattleFieldTooltips.evaluate(field, Dex.moves.get('thunderbolt'), source, source, '', 0, BattleAuraRules.electricterrain);
  assert.equal(result.factor, 1.5);
 });
 it('shows all three types for Cold Eclipse plus Electric Aura Surf', () => {
  const source = BattleFieldTooltips.pokemon();
  const field = BattleFieldRules.find(f => f.id === 'coldeclipseterrain');
  const result = BattleFieldTooltips.evaluate(field, Dex.moves.get('surf'), source, source, '', 0, BattleAuraRules.electricterrain);
  assert.deepEqual(result.move.types, ['Water', 'Ice', 'Electric']);
  assert.equal(result.factor, 2.925);
 });
 it('shows Rainbow Aura Terrain Pulse and retains the base field Dragon boost', () => {
  const source = BattleFieldTooltips.pokemon();
  const field = BattleFieldRules.find(f => f.id === 'coldeclipseterrain');
  const result = BattleFieldTooltips.evaluate(field, Dex.moves.get('terrainpulse'), source, source, '', 0, BattleAuraRules.rainbowterrain);
  assert.equal(result.move.type, 'Dragon');
  assert.equal(result.factor, 4);
 });
 it('includes Aura effects in the Team Builder reference', () => {
  assert(BattleFieldTooltips.allNotes(Dex.moves.get('thunderbolt')).some(row => row.startsWith('Electric Aura:')));
 });
});

require('vm').runInThisContext(require('fs').readFileSync(require('path').join(__dirname, '../play.pokemonshowdown.com/js/battle-tooltips.js'), 'utf8') + '\nglobal.AuraAuditTooltips = BattleTooltips;');
global.BattleItems = require('../play.pokemonshowdown.com/data/items.js').BattleItems;
describe('Aura displayed stats', () => {
 it('updates Telepathy Speed and Fairy Special Defense only while their Aura applies', () => {
  const battle = new Battle({debug: true}); battle.gen = 9;
  const tips = new AuraAuditTooltips(battle);
  const p = {speciesForme: 'Gardevoir', ability: 'Telepathy', baseAbility: 'Telepathy', item: '', hp: 300, maxhp: 300, status: '', level: 100, stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
  try {
   assert.equal(tips.calculateModifiedStats(null, p).spe, 100);
   battle.runMinor(['-fieldstart', 'Psychic Aura'], {aura: '5'});
   assert.equal(tips.calculateModifiedStats(null, p).spe, 200);
   assert.equal(tips.calculateModifiedStats(null, {...p, ability: 'Synchronize'}).spe, 100);
   battle.runMinor(['-fieldstart', 'Misty Aura'], {aura: '5'});
   assert.equal(tips.calculateModifiedStats(null, p).spe, 100);
   assert.equal(tips.calculateModifiedStats(null, p).spd, 150);
   assert.equal(tips.calculateModifiedStats(null, {...p, speciesForme: 'Mew'}).spd, 100);
   battle.runMinor(['-fieldend', 'Misty Aura'], {aura: '.'});
   assert.equal(tips.calculateModifiedStats(null, p).spd, 100);
  } finally { battle.destroy(); }
 });
});
