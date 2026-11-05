'use strict';
const assert = require('assert').strict;
const path = require('path');
const {Dex} = require('./helpers/isolated-dex.cjs')();

describe('Cosmetic profile parity', () => {
 if (!process.env.PS_SERVER_SOURCE) {
  it.skip('requires PS_SERVER_SOURCE for server-backed cosmetic comparisons', () => {});
  return;
 }
 const serverPath = path.resolve(process.env.PS_SERVER_SOURCE, 'dist');
 const server = require(path.join(serverPath, 'sim')).Dex;
 const {CosmeticBattleCounterparts} = require(path.join(serverPath, 'data/cosmetic-counterparts'));
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
