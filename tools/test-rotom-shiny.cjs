const fs=require('fs'),assert=require('assert').strict;
const root=require('path').resolve(__dirname, '../play.pokemonshowdown.com') + '/';
global.window=global;global.Pokemon=class {};global.Config={};global.BattlePokedex=require(root+'data/pokedex.js').BattlePokedex;global.BattlePokemonSprites={};global.BattlePokemonSpritesBW={};require(root+'js/battle-dex-data.js');require(root+'js/battle-dex.js');
for(const form of ['','heat','wash','frost','fan','mow']) {
 const id='rotom'+form,name='rotom'+(form?'-'+form:'');
 BattlePokemonSpritesBW[id]={front:{w:96,h:96},back:{w:96,h:96}};
 for(const side of [0,1]) {
  const shiny=Dex.getSpriteData(name,side,{gen:5,shiny:true});
  const normal=Dex.getSpriteData(name,side,{gen:5,shiny:false});
  assert(shiny.url.includes('-shiny/'+name+'.png'),shiny.url);
  assert(normal.url.includes('gen5ani')&&normal.url.includes(name+'.gif'),normal.url);
  const path=root+shiny.url.slice(shiny.url.indexOf('sprites/')).split('?')[0];assert(fs.existsSync(path));
 }
 assert(Dex.getPokemonIcon({species:name,shiny:true}).includes(name+'-shiny.png'));
 assert(!Dex.getPokemonIcon({species:name,shiny:false}).includes(name+'-shiny.png'));
}
console.log('PASS: all six forms, shiny front/back PNGs, normal BW animations, and shiny-only icons.');

