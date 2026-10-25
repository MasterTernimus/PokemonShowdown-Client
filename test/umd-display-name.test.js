'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
describe('Super U.M.D display name compatibility', () => {
 it('resolves both names to the same existing move ID and mechanics', () => {
  const {Dex: dex} = require('./helpers/isolated-dex.cjs')();
  const legacy = dex.moves.get('Super U.M.D. Move');
  for (const name of ['Super U.M.D', 'Super U.M.D. Move', 'superumdmove']) {
   const move = dex.moves.get(name);
   assert.equal(move.id, 'superumdmove');
   assert.equal(move.name, 'Super U.M.D');
   assert.strictEqual(move, legacy);
   assert.deepEqual([move.type, move.category, move.basePower, move.accuracy, move.pp], ['Steel', 'Special', 80, 100, 10]);
  }
 });
 it('packs both display names to the server-compatible original ID', () => {
  const source = fs.readFileSync('play.pokemonshowdown.com/js/storage.js', 'utf8');
  const start = source.indexOf('Storage.setInitialDisguise = function');
  const end = source.indexOf('Storage.fastUnpackTeam', start);
  const storage = {};
  new Function('Storage', 'Dex', 'toID', source.slice(start, end))(storage, Dex, toID);
  const packed = name => storage.packTeam([{species: 'Metagross', ability: 'Clear Body', moves: [name]}]);
  assert.equal(packed('Super U.M.D'), packed('Super U.M.D. Move'));
  assert.equal(packed('Super U.M.D').split('|')[4], 'superumdmove');
 });
 it('abbreviates legacy protocol messages without changing their move ID', () => {
  const previous = global.BattleText;
  global.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;
  try {
   const parser = new BattleTextParser();
   const output = parser.parseArgsInner(['move', 'p1a: Metagross', 'Super U.M.D. Move', 'p2a: Mew'], {});
   assert(output.includes('Super U.M.D'));
   assert(!output.includes('Super U.M.D. Move'));
   assert.equal(BattleTextParser.effectId('move: Super U.M.D. Move'), 'superumdmove');
  } finally {global.BattleText = previous;}
 });
});
