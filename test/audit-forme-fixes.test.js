'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {}; global.BattlePokemonSpritesBW = {};
for (const f of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle']) require('../play.pokemonshowdown.com/js/' + f);
function exists(url) { const suffix = url.split('/sprites/')[1].split('?')[0]; assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', suffix)), suffix); }
describe('Audited form corrections', () => {
 it('replaces Pikachu Gmax abilities without retaining its old hidden slot', () => {
  assert.deepEqual(Dex.species.get('Pikachu-Gmax').abilities, {0: 'Gigavolt'});
 });
 for (const [species, fallback] of [['Zygarde-Mega', 'Zygarde-Complete'], ['Magearna-Original-Mega', 'Magearna-Mega']]) {
  it(species + ' uses an existing temporary fallback in modern and BW modes', () => {
   const original = Dex.prefs;
   const set = {species, shiny: false};
   try {
    for (const bw of [false, true]) {
     Dex.prefs = key => key === 'bwgfx' ? bw : original.call(Dex, key);
     for (const shiny of [false, true]) for (const gen of [5, 9]) {
      for (const front of [false, true]) {
       const actual = Dex.getSpriteData(species, front, {shiny, gen});
       assert.equal(actual.url, Dex.getSpriteData(fallback, front, {shiny, gen}).url);
       exists(actual.url);
      }
      const art = Dex.getTeambuilderSpriteData({...set, shiny}, gen);
      assert.deepEqual(art, Dex.getTeambuilderSpriteData({species: fallback, shiny}, gen));
      exists('/sprites/' + art.spriteDir.slice(8) + (art.shiny ? '-shiny' : '') + '/' + art.spriteid + '.png');
     }
    }
    assert.equal(set.species, species);
    assert.equal(Dex.species.get(species).name, species);
   } finally { Dex.prefs = original; }
  });
 }
});
