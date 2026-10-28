const assert=require('assert').strict;require('./battle.test');
describe('Requested Alolan Ninetales, Bloodmoon Ursaluna and Mega Infernape proportions',()=>{
 for(const c of require('./sprite-sizing-oct17.json'))it([c.species,c.shiny?'shiny':'normal',c.front?'front':'back',JSON.stringify(c.options)].join(' '),()=>{
  const d=Dex.getSpriteData(c.species,c.front,{...c.options,shiny:c.shiny});
  if(c.options.noScale&&!c.options.teamPreview){assert.equal(d.w,c.w);assert.equal(d.h,c.h);}else{const scale=c.options.dynamax?2:1;require('./helpers/assert-logical-sprite.cjs')({...d,w:d.w/scale,h:d.h/scale},c.species,c.front,!!c.options.teamPreview);}
  assert.equal(d.url.replace(/^.*\/sprites\//,'sprites/'),c.url.replace(/^.*\/sprites\//,'sprites/'));
 });
});
