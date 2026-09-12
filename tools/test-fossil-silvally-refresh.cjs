require('./test-rotom-shiny.cjs');
const assert=require('assert').strict;
for(const name of ['aurorus','tyrantrum'])for(const shiny of [false,true]){
 for(const facing of [0,1]){const sprite=Dex.getSpriteData(name,facing,{gen:9,shiny});assert(sprite.url.includes('/'+name+'.png?v=fossils-20260912'),sprite.url);assert.equal(sprite.url.includes('-shiny/'),shiny);assert(sprite.w>0&&sprite.h>0);}
 assert(Dex.getTeambuilderSprite({species:name,shiny}).includes(name+'.png?v=fossils-20260912'));
 assert(Dex.getPokemonIcon({species:name,shiny}).includes(name+(shiny?'-shiny':'')+'.png?v=fossils-20260912'));
}
for(const type of ['','fighting','flying','poison','ground','rock','bug','ghost','steel','fire','water','grass','electric','psychic','ice','dragon','dark','fairy']){
 const name='silvally'+(type?'-'+type:'');
 for(const side of [0,1])assert(Dex.getSpriteData(name,side,{gen:9,shiny:true}).url.includes(name+'.png?v=silvally-forms-20260912'));
 assert(Dex.getTeambuilderSprite({species:name,shiny:true}).includes(name+'.png?v=silvally-forms-20260912'),name+': '+Dex.getTeambuilderSprite({species:name,shiny:true}));
 assert(Dex.getPokemonIcon({species:name,shiny:true}).includes(name+'-shiny.png?v=silvally-forms-20260912'));
}
console.log('PASS: fossil normal/shiny assets and all 18 playable Silvally forms use matching versioned front/back, builder and icon paths.');


