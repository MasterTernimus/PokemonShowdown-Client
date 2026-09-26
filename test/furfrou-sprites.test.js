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
    const preview = Dex.getSpriteData(species, front, {gen: 9, gender, shiny, noScale: true, teamPreview: true});
    assert(preview.url.includes(`/sprites/gen5${front ? '' : '-back'}${suffix}/${file}.png`), preview.url);
    assert(fs.statSync(local(preview.url)).size > 0);
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

// User reference: Diamond orange, Debutante yellow hat, Matron purple, La Reine blue.
// Pin reviewed artwork, not just filenames: six trims previously had valid but wrong files.
describe('Reviewed Furfrou artwork identity and fit', () => {
 it('keeps every corrected front/back, gender, and palette assigned to its reviewed trim', () => {
  const crypto=require('crypto');
  const hashes={
  "gen5/furfrou-diamond.png": "e0b8a7b56ed6d70aa646f4732e4e3f904ac27cefe5559ee3a318b06dfc1ceb3e",
  "gen5/furfrou-debutante.png": "b8167904d04e728088b69c53b8dc42d065b11f209433bec8533df6853c1a6faa",
  "gen5/furfrou-matron.png": "ed29481b2747ee2401259c1967002c0730efad3be190031da861d0338e62eed2",
  "gen5/furfrou-lareine.png": "1b04da148d3338164308183ba09b7477b612721a5f06ec69ec96b723371bc478",
  "gen5/furfrou-kabuki.png": "a08bdf2b51798a4053d92c444f6bf36604aec922a6ac7c087a2f546bacbfcc6d",
  "gen5/furfrou-pharaoh.png": "b19ddce253ac44d992b79ce837a8d3a75740bfb83f740fa07d506c3d011e0b02",
  "gen5/furfrou-diamond-f.png": "e0b8a7b56ed6d70aa646f4732e4e3f904ac27cefe5559ee3a318b06dfc1ceb3e",
  "gen5/furfrou-debutante-f.png": "b8167904d04e728088b69c53b8dc42d065b11f209433bec8533df6853c1a6faa",
  "gen5/furfrou-matron-f.png": "ed29481b2747ee2401259c1967002c0730efad3be190031da861d0338e62eed2",
  "gen5/furfrou-lareine-f.png": "1b04da148d3338164308183ba09b7477b612721a5f06ec69ec96b723371bc478",
  "gen5/furfrou-kabuki-f.png": "a08bdf2b51798a4053d92c444f6bf36604aec922a6ac7c087a2f546bacbfcc6d",
  "gen5/furfrou-pharaoh-f.png": "b19ddce253ac44d992b79ce837a8d3a75740bfb83f740fa07d506c3d011e0b02",
  "gen5-back/furfrou-diamond.png": "88c333ac7b893d50ee83554ed71ee849caec5643dfceb278ca1ca4757856297a",
  "gen5-back/furfrou-debutante.png": "cf94583087464c4da47c027a35046226f7d21e9a4456e135b82d9256246dd4a1",
  "gen5-back/furfrou-matron.png": "15ba33fa79ceaa24a6d277c790fc20fb4daadc207b93b0e75e22d26a8c9e70c3",
  "gen5-back/furfrou-lareine.png": "81aa3e86dc9d25020e066e9fe75ee6d0f66d3ab173ce762fd99ce89dcdc75ffe",
  "gen5-back/furfrou-kabuki.png": "6a2781b31e705c99a70c1c31a126772a50720ff3f99b0bf402629f40fd34e952",
  "gen5-back/furfrou-pharaoh.png": "133580a87d47b6b7db3e5c5aa5a8ab6528b633a7bf9c4b9a76d694a072263f92",
  "gen5-back/furfrou-diamond-f.png": "88c333ac7b893d50ee83554ed71ee849caec5643dfceb278ca1ca4757856297a",
  "gen5-back/furfrou-debutante-f.png": "cf94583087464c4da47c027a35046226f7d21e9a4456e135b82d9256246dd4a1",
  "gen5-back/furfrou-matron-f.png": "15ba33fa79ceaa24a6d277c790fc20fb4daadc207b93b0e75e22d26a8c9e70c3",
  "gen5-back/furfrou-lareine-f.png": "81aa3e86dc9d25020e066e9fe75ee6d0f66d3ab173ce762fd99ce89dcdc75ffe",
  "gen5-back/furfrou-kabuki-f.png": "6a2781b31e705c99a70c1c31a126772a50720ff3f99b0bf402629f40fd34e952",
  "gen5-back/furfrou-pharaoh-f.png": "133580a87d47b6b7db3e5c5aa5a8ab6528b633a7bf9c4b9a76d694a072263f92",
  "gen5-shiny/furfrou-diamond.png": "e24741805300546fe281ce32bad4809ae0d47058ec5646c50a54365f81955dfe",
  "gen5-shiny/furfrou-debutante.png": "111b8cba364eb25dd12611c92ad063e103457720b607139dd2979920a4714220",
  "gen5-shiny/furfrou-matron.png": "33911ece29f126520ddc6529890f8fe336dd930f94267b9d32c077611229a47a",
  "gen5-shiny/furfrou-lareine.png": "998ed3b9e7b643b469b914dbf5a9388398097ecc18481e0663a945feefd7a3ee",
  "gen5-shiny/furfrou-kabuki.png": "01705e0c3c12afa9b980f0d6a6a94de1c90921dcfa598d41995febd95e05f181",
  "gen5-shiny/furfrou-pharaoh.png": "fe53f57288c2b81b2f7192f252f648380f2ea334ecbf5fa3f93f89759ad8267d",
  "gen5-shiny/furfrou-diamond-f.png": "7d9613616db155e6169f506f297a9ab2af32b40e415173bd5d3887133aeb41d6",
  "gen5-shiny/furfrou-debutante-f.png": "8dcd7aa46342ea842873578afd6134dce98a4637b06f6094c412b70b46b3f685",
  "gen5-shiny/furfrou-matron-f.png": "4dbc44f41dbe3d31f66821a888b2f8d659083971a3b29ab9344ce957ee2e1e02",
  "gen5-shiny/furfrou-lareine-f.png": "589da1784654998c161dd8a54138d447bb61bce2ca260e4df5804ea17b9da381",
  "gen5-shiny/furfrou-kabuki-f.png": "929f349aeedc269d5f120275fd3d96437f7305827348eeeda61840b5dd6894d6",
  "gen5-shiny/furfrou-pharaoh-f.png": "bea663b1747e37f7bcd5f39cc424694ab7109b1b0a94ec3ef43ecf09ac5d521c",
  "gen5-back-shiny/furfrou-diamond.png": "0229b00f07506bf2ffb3374e0628693da0ad2846b051516b01943a73b93deefd",
  "gen5-back-shiny/furfrou-debutante.png": "b66ca333c614f116c8de981febef530313f73ea202d73acbb78245a0071c07d4",
  "gen5-back-shiny/furfrou-matron.png": "a1894fa9b03f7ffb05d1cd83ff29af40e19d9ba169fd0f60311737fb7e3f1f63",
  "gen5-back-shiny/furfrou-lareine.png": "72d7198baa2a42805d7944d04917e22ad0a6e0524c4af7aeebcff09864d82ffe",
  "gen5-back-shiny/furfrou-kabuki.png": "950b4f5da74b6e718011a82840cc3874f37400125add656bcfd67c5cf9b4a8fb",
  "gen5-back-shiny/furfrou-pharaoh.png": "cc784ba76e6a736a536c0d914e52c7aa1e3d86d70c7acb54d78a705e63339647",
  "gen5-back-shiny/furfrou-diamond-f.png": "2e0e10a33609d4b82f159b702e15d76e0f010ad1c2bff5252342440892550333",
  "gen5-back-shiny/furfrou-debutante-f.png": "7e724b69ca1031e6a2e4b07803b24dea10dbfa7ac7d4b92a6c2f9158d7a01236",
  "gen5-back-shiny/furfrou-matron-f.png": "43feaa72a0ba21aba81c83d4ec3fbc18e56525a5203a4c3070e7253a9cff6543",
  "gen5-back-shiny/furfrou-lareine-f.png": "17369c6011f2d033c5fd59abab20681ae10abb6fe873d0fe9104cfc9856a8a77",
  "gen5-back-shiny/furfrou-kabuki-f.png": "853701f6fbea656342bf6db508f13f27c174a60b82f8d515901de0202da2fa76",
  "gen5-back-shiny/furfrou-pharaoh-f.png": "40751ff02cfeee15d830be1ce5feb79546671ee28945d7790f2445f5f8a4889b"
};
  for(const [file,hash] of Object.entries(hashes)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/sprites',file))).digest('hex'),hash,file);
 });
 it('fits all trims in the Team Builder without cropping or stretching', () => {
  for(const trim of trims)for(const gender of ['M','F'])for(const shiny of [false,true]) {
   const set={species:'Furfrou'+(trim?'-'+trim:''),gender,shiny};
   const d=Dex.getTeambuilderSpriteData(set,9);
   const actual=imageSize(local(d.spriteDir+(d.shiny?'-shiny':'')+'/'+d.spriteid+'.png'));
   const width=parseFloat(d.backgroundSize),height=width*actual.height/actual.width;
   assert(d.x>=0 && d.y>=0 && d.x+width<=96 && d.y+height<=96,JSON.stringify(d));
   assert(Dex.getTeambuilderSprite(set,9).includes('furfrou-trim-reference-v2'));
   assert(Dex.getPokemonIcon(set).includes('furfrou-trim-reference-v2'));
   for(const front of [false,true])for(const teamPreview of [false,true]) {
    const battle=Dex.getSpriteData(set.species,front,{gen:9,gender,shiny,teamPreview});
    const source=imageSize(local(battle.url));
    assert(Math.abs(battle.w-source.width*battle.h/source.height)<=1.5,JSON.stringify(battle));
    assert(battle.url.includes('furfrou-trim-reference-v2'));
   }
  }
 });
});
