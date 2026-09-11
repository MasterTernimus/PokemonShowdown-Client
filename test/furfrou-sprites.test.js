const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
global.window = global;
global.Config = {whitelist: [], routes: {root: 'pokemonshowdown.com'}};
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
if (process.env.MENU_ICON_BUNDLE) require('../play.pokemonshowdown.com/js/battledata');
else for (const name of ['battle-dex-data', 'battle-dex']) require('../play.pokemonshowdown.com/js/' + name);
for (const name of ['battle-scene-stub', 'battle-text-parser', 'battle']) require('../play.pokemonshowdown.com/js/' + name);
const trims = ['', 'Heart', 'Star', 'Diamond', 'Debutante', 'Matron', 'Dandy', 'La Reine', 'Kabuki', 'Pharaoh'];
const local = url => path.join(__dirname, '../play.pokemonshowdown.com', url.slice(url.indexOf('sprites/')).split('?')[0]);
describe('Furfrou sprite and icon agreement', () => {
 for (const trim of trims) for (const gender of ['M', 'F']) for (const shiny of [false, true]) {
  it(`${trim || 'Natural'} ${gender} ${shiny ? 'shiny' : 'normal'} keeps its form and palette everywhere`, () => {
   const species = 'Furfrou' + (trim ? '-' + trim : '');
   const file = 'furfrou' + (trim ? '-' + trim.toLowerCase().replace(/ /g, '') : '') + (gender === 'F' ? '-f' : '');
   const suffix = shiny ? '-shiny' : '';
   for (const front of [true, false]) {
    const sprite = Dex.getSpriteData(species, front, {gen: 9, gender, shiny, noScale: true});
    assert(sprite.url.includes(`/sprites/gen5${front ? '' : '-back'}${suffix}/${file}.png`), sprite.url);
    const size = imageSize(local(sprite.url));
    assert.equal(sprite.w, size.width); assert.equal(sprite.h, size.height);
   }
   for (const left of [true, false]) {
    const css = Dex.getPokemonIcon({species, gender, shiny}, left);
    assert(css.includes(`/sprites/gen5${suffix}/${file}.png`), css);
    assert(fs.statSync(local(css.match(/url\(([^)]+)\)/)[1])).size > 0);
   }
   const prefs = Dex.prefs;
   try {
    for (const bw of [false, true]) for (const gen of [0, 5, 9]) {
     Dex.prefs = key => key === 'bwgfx' ? bw : prefs.call(Dex, key);
     const data = Dex.getTeambuilderSpriteData({species, gender, shiny}, gen);
     assert.equal(data.spriteDir, 'sprites/gen5'); assert.equal(data.spriteid, file); assert.equal(!!data.shiny, shiny);
    }
   } finally { Dex.prefs = prefs; }
  });
 }
 it('retains fainted styling and follows temporary form changes', () => {
  const css = Dex.getPokemonIcon({species: 'Furfrou', gender: 'F', shiny: true, fainted: true, volatiles: {formechange: ['formechange', 'Furfrou-Heart']}});
  assert(css.includes('/gen5-shiny/furfrou-heart-f.png')); assert(css.includes('opacity:.3'));
 });
});
describe('Reviewed sprite asset routes', () => {
 it('uses the supplied female Mega Scizor BW sprite', () => {
  for(const shiny of [false,true]) {
   const data = Dex.getTeambuilderSpriteData({species:'Scizor-Mega',gender:'F',shiny},5);
   assert.equal(data.spriteid,'scizormega-f');
   assert(fs.statSync(local(`${data.spriteDir}${data.shiny?'-shiny':''}/${data.spriteid}.png`)).size>0);
  }
 });
 it('uses existing BW G-Max Cinderace animations', () => {
  for(const shiny of [false,true])for(const front of [false,true]) {
   const data=Dex.getSpriteData('Cinderace-Gmax',front,{gen:9,shiny});
   assert(data.url.includes('/gen5ani'),data.url);
   assert(fs.statSync(local(data.url)).size>0);
  }
 });
});