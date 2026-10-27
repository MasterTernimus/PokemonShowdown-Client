const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const {Dex, getCustomCosmeticFormes} = require('./helpers/isolated-dex.cjs')();

describe('Mightyena Grim supplied artwork', () => {
 it('retains historical stats and artwork but is absent from selectable variants', () => {
  const base = Dex.species.get('Mightyena'), grim = Dex.species.get('Mightyena-Grim');
  assert(grim.exists && grim.forme === 'Grim');
  for(const key of ['baseStats','types','abilities','passives']) assert.equal(JSON.stringify(grim[key]),JSON.stringify(base[key]),key);
  const choices = getCustomCosmeticFormes(base);
  assert(!choices.includes('Mightyena-Grim'));
  assert(choices.includes('Mightyena-Deso'));
 });
 it('resolves each supplied facing and shiny in battles menus and the teambuilder', () => {
  for(const gen of [5,9]) for(const shiny of [false,true]) for(const front of [false,true]) {
   const sprite = Dex.getSpriteData('Mightyena-Grim',front,{gen,shiny});
   const dir='gen5'+(front?'':'-back')+(shiny?'-shiny':'');
   assert(sprite.url.includes('/'+dir+'/mightyena-grim.png'),sprite.url);
   assert(sprite.pixelated);
   assert(sprite.w>0 && sprite.w<=86 && sprite.h>0 && sprite.h<=86);
   const bytes=fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/sprites',dir,'mightyena-grim.png'));
   assert.equal(bytes.readUInt32BE(16),192);
   assert.equal(bytes.readUInt32BE(20),192);
   const preview=Dex.getTeambuilderSpriteData({species:'Mightyena-Grim',shiny},gen);
   assert.equal(preview.spriteid,'mightyena-grim');
   assert.equal(preview.spriteDir,'sprites/gen5');
   assert.equal(!!preview.shiny,shiny);
   assert(Dex.getPokemonIcon({species:'Mightyena-Grim',shiny}).includes('pokemonicons/mightyena-grim'+(shiny?'-shiny':'')+'.png'));
  }
 });
});
