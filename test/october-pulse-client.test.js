'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
global.BattleSearchIndex = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchIndexCount = require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexCount;
const {DexSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {DexSearch};')();
describe('October Pulse/Chandelure/bone client parity', () => {
 const sets = {
  mukpulse: ['sludgewave', 'earthpower', 'muddywater', 'discharge'],
  swalotpulse: ['sludgewave', 'recover', 'infestation', 'discharge'],
  avaluggpulse: ['avalanche', 'earthquake', 'hammerarm', 'heavyslam'],
 };
 for (const [species, expected] of Object.entries(sets)) {
  it(species + ' picker offers exactly its four fixed moves', () => {
   const search = new DexSearch(); search.setType('move', 'gen9nofieldsinglesgame', {species, moves: []}); search.find('');
   const moves = [...new Set(search.results.filter(row => row[0] === 'move').map(row => row[1]))];
   assert.deepEqual(moves.sort(), expected.slice().sort());
   const table = BattleTeambuilderTable.learnsets[species];
   assert.deepEqual(Object.keys(table).sort(), expected.slice().sort());
  });
 }
 it('ordinary Avalugg keeps Recover', () => {
  const search = new DexSearch(); search.setType('move', 'gen9nofieldsinglesgame', {species: 'Avalugg', moves: []}); search.find('');
  assert(search.results.some(row => row[0] === 'move' && row[1] === 'recover'));
 });
 it('shows the new Chandelure slots and nested Flash Fire exactly once', () => {
  assert.deepEqual(Dex.species.get('chandelure').abilities, {0: 'Soul Siphon', 1: 'Soul Pyre', H: 'Malice Well', S: 'Soul Fire'});
  assert(Dex.getAbilityEffects('soulsiphon').has('flashfire'));
  const components = Dex.getAbilityEffects('soulcremation');
  for (const id of ['flashfire', 'soulsiphon', 'soulpyre', 'malicewell', 'flamebody']) assert(components.has(id));
 });
 it('documents latest Swalot, Camerupt, Substitute and bone mechanics without stale Poison Heal', () => {
  const swalot = Dex.abilities.get('pulsefiltration');
  assert(swalot.desc.includes('Underwater')); assert(swalot.desc.includes('Liquid Ooze')); assert(!swalot.desc.includes('Poison Heal'));
  assert(Dex.abilities.get('pulsewaste').desc.includes('Swamp'));
  assert(Dex.abilities.get('pulseeruption').desc.includes('full HP'));
  assert(Dex.moves.get('substitute').desc.includes('Pulse and Rift'));
  for (const id of ['boneclub', 'bonerush', 'bonemerang']) assert(Dex.moves.get(id).desc.includes('While Ground-type'));
 });
});
