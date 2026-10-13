'use strict';
const assert=require('assert').strict,fs=require('fs');
const PokemonSprite=new Function('$','window',fs.readFileSync('play.pokemonshowdown.com/js/battle-animations.js','utf8')+'\nreturn PokemonSprite;')({easing:{}},{});
describe('Active starter ability badges',()=>{
 for(const[id,label]of [['torrent','Torrent'],['blaze','Blaze'],['overgrow','Overgrow']])it(label+' has a readable label and explicit active-state accessibility text',()=>{
  const tag=PokemonSprite.getEffectTag(id+'active');assert(tag.includes('ability-active-'+id));assert(tag.includes('title="'+label+' active"'));assert(tag.includes('aria-label="'+label+' active"'));assert(tag.includes('>'+label+'</span>'));assert.equal(PokemonSprite.getEffectTag(id+'active'),tag);
 });
 it('keeps unrelated effects in their original styles',()=>{assert.equal(PokemonSprite.getEffectTag('confusion'),'<span class="bad">Confused</span> ');assert.equal(PokemonSprite.getEffectTag('flashfire'),'<span class="good">Flash&nbsp;Fire</span> ');assert.equal(PokemonSprite.getEffectTag('typechange'),'');});
});


describe('Named temporary effect badges',()=>{
 for(const[id,label,hint]of [['shadowforceguard','Shadow Guard','25% less damage'],['skycharged','Sky-Charged','prevents Speed drops']])it(id+' has a readable label and mechanical tooltip',()=>{const tag=PokemonSprite.getEffectTag(id);assert(!tag.includes('[['));assert(tag.includes('effect-guard'));assert(tag.includes('>'+label+'</span>'));assert(tag.includes(hint));assert(tag.includes('aria-label='));});
});
