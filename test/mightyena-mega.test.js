const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const {Dex} = require('./helpers/isolated-dex.cjs')();

describe('Mega Mightyena client data and supplied art', () => {
 it('has the approved stats, ability, passive and stone', () => {
  const mon = Dex.species.get('Mightyena-Mega');
  assert(mon.exists && mon.isMega);
  assert.equal(JSON.stringify(mon.baseStats),JSON.stringify({hp:90,atk:150,def:115,spa:85,spd:100,spe:130}));
  assert.equal(Object.values(mon.baseStats).reduce((a,b)=>a+b,0),670);
  assert.equal(JSON.stringify(mon.types),JSON.stringify(['Dark','Ghost']));
  assert.equal(JSON.stringify(mon.abilities),JSON.stringify({0:'Dread Dominion'}));
  assert.equal(JSON.stringify(mon.passives),JSON.stringify(['darkaura']));
  assert(mon.requiredItems.includes('Grimyinite'));
  const stone = Dex.items.get('Grimyinite');
  assert(stone.exists);
  assert.equal(stone.megaStone.Mightyena,'Mightyena-Mega');
  for(const name of ['Mightyena','Mightyena-Deso','Mightyena-Grim']) {
   assert(stone.itemUser.includes(name));
   assert(Dex.species.get(name).otherFormes.includes('Mightyena-Mega'));
  }
  assert(Dex.getItemIcon('Grimyinite').includes('sprites/itemicons/grimyinite.png'));
 });
 it('exposes both components to ability search and display', () => {
  const ability = Dex.abilities.get('Dread Dominion');
  assert(ability.exists);
  const effects = Dex.getAbilityEffects('dreaddominion');
  assert(effects.has('hydrabond') && effects.has('moxie'));
  assert.equal(JSON.stringify(Dex.getAbilityDisplayComponents('dreaddominion')),JSON.stringify(['hydrabond','moxie']));
  assert(ability.desc.includes('Fairy') && ability.desc.includes('suppressed'));
 });
 it('resolves normal and shiny front/back sprites and teambuilder art', () => {
  for(const gen of [5,9]) for(const shiny of [false,true]) for(const front of [false,true]) {
   const sprite = Dex.getSpriteData('Mightyena-Mega',front,{gen,shiny});
   const dir='gen5'+(front?'':'-back')+(shiny?'-shiny':'');
   assert(sprite.url.includes('/'+dir+'/mightyena-mega.png'),sprite.url);
   assert(sprite.pixelated);
   assert(sprite.w>0 && sprite.w<=98 && sprite.h>0 && sprite.h<=98);
   const bytes=fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/sprites',dir,'mightyena-mega.png'));
   assert.equal(bytes.readUInt32BE(16),192);
   assert.equal(bytes.readUInt32BE(20),192);
   const preview=Dex.getTeambuilderSpriteData({species:'Mightyena-Mega',shiny},gen);
   assert.equal(preview.spriteid,'mightyena-mega');
   assert.equal(preview.spriteDir,'sprites/gen5');
   assert.equal(!!preview.shiny,shiny);
   assert(Dex.getPokemonIcon({species:'Mightyena-Mega',shiny}).includes((shiny?'gen5-shiny':'gen5')+'/mightyena-mega.png'));
  }
 });
});
