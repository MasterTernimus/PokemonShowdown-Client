'use strict';
const assert = require('assert').strict;
require('./battle.test');
global.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;

describe('Grassy Aura healing message',()=>{
 it('renders the server Grassy Aura healing attribution literally',()=>{
  const parser=new BattleTextParser();
  const message=parser.extractMessage('|-heal|p1a: Bloom|144/256|[from] Grassy Aura');
  assert(message.includes('Grassy Aura'),message);
  assert(!message.includes('Terrain Aura'),message);
 });
 for(const [source,expected] of [['Terrain Aura','Terrain Aura'],['Grassy Terrain','HP was restored.'],['item: Leftovers','Leftovers']])it('keeps unrelated healing attribution: '+source,()=>{
  const parser=new BattleTextParser();
  const message=parser.extractMessage('|-heal|p1a: Bloom|144/256|[from] '+source);
  assert(!message.includes('Grassy Aura'),message);
  assert(message.includes(expected),message);
 });
});
