'use strict';
const assert=require('assert').strict,fs=require('fs');
const PokemonSprite=new Function('$','window',fs.readFileSync('play.pokemonshowdown.com/js/battle-animations.js','utf8')+'\nreturn PokemonSprite;')({easing:{}},{});
describe('Active starter ability badges',()=>{
 for(const[id,label]of [['torrent','Torrent'],['blaze','Blaze'],['overgrow','Overgrow']])it(label+' has a readable label and explicit active-state accessibility text',()=>{
  const tag=PokemonSprite.getEffectTag(id+'active');assert(tag.includes('ability-active-'+id));assert(tag.includes('title="'+label+' active"'));assert(tag.includes('aria-label="'+label+' active"'));assert(tag.includes('>'+label+'</span>'));assert.equal(PokemonSprite.getEffectTag(id+'active'),tag);
 });
 it('keeps unrelated effects in their original styles',()=>{assert.equal(PokemonSprite.getEffectTag('confusion'),'<span class="bad">Confused</span> ');assert.equal(PokemonSprite.getEffectTag('flashfire'),'<span class="good">Flash&nbsp;Fire</span> ');assert.equal(PokemonSprite.getEffectTag('typechange'),'');});
});

