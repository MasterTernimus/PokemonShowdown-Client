'use strict';
require('./test-lapras-aevian-gmax.cjs');
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
for (const name of ['Arcanine-Aevian','Roserade-Aevian','Froslass-Aevian']) assert.equal(Dex.species.get(name).baseSpecies,name);
for (const [name, ability] of [['Lapras-Aevian-Gmax','Crystal Resonance'],['Toxtricity-Aevian-Gmax','Riot Amp'],['Donphan-Rejuv','Aevian Frost'],['Druddigon-Rejuv','Aevian Bolt'],['Turtonator-Rejuv','Aevian Glacier']]) assert.deepEqual(Dex.species.get(name).abilities,{0:ability});
assert(BattleTeambuilderTable.learnsets.glalieaevian.woodhammer);
const names=['Arcanine-Aevian','Roserade-Aevian','Glalie-Aevian','Glalie-Aevian-Mega','Froslass-Aevian','Froslass-Aevian-Mega','Donphan-Rejuv','Druddigon-Rejuv','Turtonator-Rejuv','Milotic-Terajuma','Lapras-Aevian-Gmax','Toxtricity-Aevian-Gmax','Raichu-Alola','Persian-Alola'];
let checked=0;
for(const name of names) for(const gen of [5,9]) for(const gender of ['M','F']) for(const shiny of [false,true]) {
 for(const facing of [0,1]) {
  const data=Dex.getSpriteData(name,facing,{gen,gender,shiny});
  const relative=data.url.slice(data.url.indexOf('sprites/')).split('?')[0];
  assert(fs.existsSync(path.join(root,relative)),name+': '+relative); checked++;
 }
 const art=Dex.getTeambuilderSpriteData({species:name,gender,shiny},gen);
 assert(fs.existsSync(path.join(root,`${art.spriteDir}${art.shiny?'-shiny':''}/${art.spriteid}.png`)),name+' team builder'); checked++;
}
console.log(`PASS: new profile identity, exclusive abilities, Glalie learnset, and ${checked} sprite selections.`);
