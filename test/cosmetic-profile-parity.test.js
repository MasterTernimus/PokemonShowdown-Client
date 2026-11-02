'use strict';
const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();
const serverPath = require('path').join(process.env.PS_SERVER_SOURCE || require('path').resolve(__dirname, '../caches/PokemonShowdown-Reborn'), 'dist');
const server = require(serverPath + '/sim').Dex;
const {CosmeticBattleCounterparts} = require(serverPath + '/data/cosmetic-counterparts');
describe('Cosmetic profile parity', () => {
 for (const [skin, base] of Object.entries(CosmeticBattleCounterparts)) {
  it(skin + ' displays the current ' + base + ' battle profile', () => {
   for (const key of ['abilities', 'passives', 'baseStats', 'types']) {
    const value = JSON.parse(JSON.stringify(Dex.species.get(skin)[key]));
    assert.deepEqual(value, JSON.parse(JSON.stringify(Dex.species.get(base)[key])), key);
    assert.deepEqual(value, JSON.parse(JSON.stringify(server.species.get(skin)[key])), key + ' server');
   }
   assert.equal(Dex.species.get(skin).name, server.species.get(skin).name);
  });
 }
});
