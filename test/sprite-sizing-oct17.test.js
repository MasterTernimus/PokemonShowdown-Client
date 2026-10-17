const assert=require('assert').strict;require('./battle.test');
describe('Requested Alolan Ninetales, Bloodmoon Ursaluna and Mega Infernape proportions',()=>{
 for(const c of require('./sprite-sizing-oct17.json'))it([c.species,c.shiny?'shiny':'normal',c.front?'front':'back',JSON.stringify(c.options)].join(' '),()=>{
  const factor=c.options.dynamax||(c.options.noScale&&!c.options.teamPreview)?1:({'Ninetales-Alola':0.8,'Ursaluna-Bloodmoon':0.9,'Infernape-Mega':0.95}[c.species]||1);
  const d=Dex.getSpriteData(c.species,c.front,{...c.options,shiny:c.shiny});
  assert.equal(d.w,Math.round(c.w*factor));assert.equal(d.h,Math.round(c.h*factor));
  assert.equal(d.url.replace(/^.*\/sprites\//,'sprites/'),c.url.replace(/^.*\/sprites\//,'sprites/'));
 });
});
