const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const sizeOf = require('image-size');
const root = path.resolve(__dirname, '..');
const client = path.join(root, 'play.pokemonshowdown.com');
global.window = global;
global.Config = {whitelist: [], routes: {root: 'pokemonshowdown.com'}};
global.BattlePokedex = require(path.join(client, 'data/pokedex')).BattlePokedex;
global.BattlePokemonSprites = {}; global.BattlePokemonSpritesBW = {};
for (const name of ['battle-dex-data','battle-dex','battle-scene-stub','battle-text-parser','battle']) require(path.join(client, 'js', name));
const diff = execFileSync('git', ['diff','--no-ext-diff','--unified=0','HEAD','--','play.pokemonshowdown.com/src/battle-dex.ts'], {cwd:root,encoding:'utf8'});
const ids = new Set();
for (const line of diff.split('\n').filter(line=>line.startsWith('+') && !line.startsWith('+++'))) {
 for (const m of line.matchAll(/(?:^\+\s*|[{,]\s*)["']?([a-z0-9]+)["']?\s*:/g)) if (Dex.species.get(m[1]).exists) ids.add(m[1]);
}
const errors = [], files = new Set(); let selections = 0;
function check(url, context) {
 const start = url.indexOf('sprites/'); if(start < 0) return;
 const relative = url.slice(start).split('?')[0]; const file = path.join(client, relative);
 selections++;
 try {const size = sizeOf(file);if(size.width<=1||size.height<=1)throw Error('placeholder');files.add(relative);}
 catch(e){errors.push({context,file:relative,error:e.message});}
}
for(const id of ids)for(const gender of ['M','F'])for(const shiny of [false,true]){
 const context = `${id}/${gender}/${shiny ? 'shiny':'normal'}`;
 for(const front of [true,false])check(Dex.getSpriteData(id,front,{gen:9,gender,shiny}).url,context+(front?'/front':'/back'));
 for(const gen of [5,9]){
  const data=Dex.getTeambuilderSpriteData({species:id,gender,shiny},gen);
  check(`${data.spriteDir}${data.shiny?'-shiny':''}/${data.spriteid}.png`,context+'/builder'+gen);
 }
 check(Dex.getPokemonIcon({species:id,gender,shiny}).match(/url\(([^)]+)\)/)[1],context+'/icon');
}
const result={species:ids.size,ids:[...ids].sort(),selections,uniqueFiles:files.size,errors};
console.log(JSON.stringify(result,null,2));
process.exitCode=errors.length?1:0;