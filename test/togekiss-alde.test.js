'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
global.window = global;
global.Config = {whitelist: [], routes: {root: 'pokemonshowdown.com'}};
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
for (const name of ['battle-dex-data', 'battle-dex']) require('../play.pokemonshowdown.com/js/' + name);
for (const name of ['battle-scene-stub', 'battle-text-parser', 'battle']) require('../play.pokemonshowdown.com/js/' + name);
const local = url => path.join(__dirname, '../play.pokemonshowdown.com', url.slice(url.indexOf('sprites/')).split('?')[0]);
describe('Togekiss-Alde supplied skin', () => {
 it('inherits the current Togekiss profile', () => {
  const base = Dex.species.get('Togekiss'), skin = Dex.species.get('Togekiss-Alde');
  assert(skin.exists); assert.equal(skin.baseSpecies, 'Togekiss');
  for (const key of ['baseStats', 'types', 'abilities']) assert.deepEqual(skin[key], base[key], key);
  assert(base.cosmeticFormes.includes('Togekiss-Alde'));
 });
 for (const shiny of [false,true]) for (const gender of ['M','F']) {
  it('routes every view for shiny=' + shiny + ' gender=' + gender, () => {
   for (const gen of [5,9]) for (const front of [true,false]) for (const teamPreview of [false,true]) {
    const sprite = Dex.getSpriteData('Togekiss-Alde', front, {gen, gender, shiny, teamPreview, noScale:true});
    const expected = '/sprites/gen5' + (front ? '' : '-back') + (shiny ? '-shiny' : '') + '/togekiss-alde.png';
    assert(sprite.url.includes(expected), sprite.url);
    const size = imageSize(local(sprite.url)); assert.equal(size.width,300); assert.equal(size.height,300);
   }
   for (const gen of [0,5,9]) {
    const data = Dex.getTeambuilderSpriteData({species:'Togekiss-Alde',gender,shiny},gen);
    assert.equal(data.spriteid,'togekiss-alde'); assert.equal(data.spriteDir,'sprites/gen5'); assert.equal(!!data.shiny,shiny);
   }
   const icon = Dex.getPokemonIcon({species:'Togekiss-Alde',gender,shiny});
   assert(icon.includes('/pokemonicons/togekiss-alde' + (shiny ? '-shiny' : '') + '.png'),icon);
   const iconPath = local(icon.match(/url\(([^)]+)\)/)[1]);
   const frontPath = local('sprites/gen5' + (shiny ? '-shiny' : '') + '/togekiss-alde.png');
   assert(fs.readFileSync(iconPath).equals(fs.readFileSync(frontPath)));
  });
 }
});
