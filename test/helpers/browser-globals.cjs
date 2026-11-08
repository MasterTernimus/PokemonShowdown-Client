'use strict';
// These scripts are always present in the browser; isolated test batches need them too.
const fs=require('fs'),path=require('path');
global.BattleText=require('../../play.pokemonshowdown.com/data/text.js').BattleText;
global.BattleLog=new Function(fs.readFileSync(path.join(__dirname,'../../play.pokemonshowdown.com/js/battle-log.js'),'utf8')+'\nreturn BattleLog;')();
