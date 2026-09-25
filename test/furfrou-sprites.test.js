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
 it('uses BW G-Max Cinderace animations and supplied static shinies', () => {
  for(const shiny of [false,true])for(const front of [false,true]) {
   const data=Dex.getSpriteData('Cinderace-Gmax',front,{gen:9,shiny});
   assert(data.url.includes(shiny ? '/gen5' + (front ? '' : '-back') + '-shiny/' : '/gen5ani'),data.url);
   if(shiny) assert(data.url.split('?')[0].endsWith('.png'),data.url);
   assert(fs.statSync(local(data.url)).size>0);
  }
 });
});
describe('Available BW animations', () => {
 it('uses sharp animated BW sprites for normal Aggron', () => {
  for (const front of [true, false]) {
   const data = Dex.getSpriteData('Aggron', front, {gen: 9});
   assert(data.url.includes('/sprites/gen5ani' + (front ? '' : '-back') + '/aggron.gif'), data.url);
   assert.equal(data.pixelated, true);
   assert(fs.statSync(local(data.url)).size > 0);
  }
 });
 it('animates both normal and shiny Gardevoir in battle and preview', () => {
  for (const species of ['Gardevoir', 'Gardevoir-Mega']) {
   for (const shiny of [false, true]) for (const front of [true, false]) for (const teamPreview of [false, true]) {
    const data = Dex.getSpriteData(species, front, {gen: 9, shiny, teamPreview});
    const file = species === 'Gardevoir' ? 'gardevoir' : 'gardevoir-mega';
    assert(data.url.includes('/sprites/gen5ani' + (front ? '' : '-back') + (shiny ? '-shiny' : '') + '/' + file + '.gif'), data.url);
    assert(fs.statSync(local(data.url)).size > 0);
   }
  }
 });
});
describe('Custom preview sprites and battle sizes', () => {
 it('keeps form artwork in preview, including Deso Toxicroak back', () => {
  for (const [species, file] of [
   ['Toxicroak-Deso', 'toxicroak-deso.png'],
   ['Wishiwashi-Sevii', 'wishiwashi-sevii.png'],
   ['Wishiwashi-Sevii-Schooling', 'wishiwashi-sevii-schooling.png'],
   ['Gyarados-Aevian', 'gyarados-aevian.png'],
   ['Tatsugiri-Droopy-Mega', 'tatsugiri-mega.png'],
  ]) for (const front of [true, false]) {
   const data = Dex.getSpriteData(species, front, {gen: 9, teamPreview: true});
   assert.equal(data.url.split('?')[0].split('/').pop(), file, data.url);
   assert(fs.statSync(local(data.url)).size > 0);
  }
 });
 it('renders Mega Beedrill, Kilowattrel, and Hawlucha at compact battle sizes', () => {
  for (const [species, frontLimit, backLimit] of [
   ['Beedrill-Mega', 68, 59], ['Kilowattrel', 58, 56], ['Hawlucha', 62, 58],
  ]) for (const front of [true, false]) {
   const data = Dex.getSpriteData(species, front, {gen: 9});
   assert(Math.max(data.w, data.h) <= (front ? frontLimit : backLimit), species);
  }
 });
});

describe('Magneton BW shiny battle size', () => {
 it('keeps the shiny sprite smaller than normal without changing the animation route', () => {
  for (const front of [true, false]) {
   const normal = Dex.getSpriteData('Magneton', front, {gen: 9});
   const shiny = Dex.getSpriteData('Magneton', front, {gen: 9, shiny: true});
   assert(normal.url.includes('/gen5ani'), normal.url);
   assert(shiny.url.includes(front ? '/gen5-shiny/' : '/gen5-back-shiny/'), shiny.url);
   assert(Math.max(shiny.w, shiny.h) <= (front ? 68 : 60), JSON.stringify(shiny));
  }
 });
});

describe('Beedrill BW animation', () => {
 it('animates normal Beedrill from both sides in both palettes', () => {
  for (const shiny of [false, true]) for (const front of [true, false]) {
   const data = Dex.getSpriteData('Beedrill', front, {gen: 9, shiny});
   assert(data.url.includes(`/sprites/gen5ani${front ? '' : '-back'}${shiny ? '-shiny' : ''}/beedrill.gif`), data.url);
   assert(fs.statSync(local(data.url)).size > 0);
  }
 });
});
