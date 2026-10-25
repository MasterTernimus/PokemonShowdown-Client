'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
const {BattleMoveSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {BattleMoveSearch};')();
const raw=require('../play.pokemonshowdown.com/data/learnsets').BattleLearnsets;
const pairs=[['feraligatr','aquastep'],['gardevoirmega','darkvoid'],['froslassmega','bleakwindstorm'],['florgeswhite','magicpowder'],['typhlosionhisui','bitterblade'],['aegislashblade','tachyoncutter'],['gengargmax','spectralthief']];
describe('Scoped Gen9 movepool removal export and ancestor search',()=>{
 for(const [id,move]of pairs)it(id+' excludes '+move+' through picker ancestry',()=>{
  assert(!raw[id]?.learnset[move]);
  const search=new BattleMoveSearch('move','gen9doublesrockyfield',{species:id,ability:Object.values(Dex.species.get(id).abilities)[0],moves:[]});
  assert.equal(search.canLearn(id,move),false);
  assert(!search.getBaseResults().some(row=>row[0]==='move'&&row[1]===move));
 });
 it('keeps the unlisted regional branch and legitimate new cleric access',()=>{
  assert(!Dex.getGen9MoveRemovals('breloomrejuv').includes('barbbarrage'));
  assert(raw.roserade.learnset.revivalblessing);
  assert(raw.meowstic.learnset.revivalblessing);
  assert(raw.meowsticf.learnset.revivalblessing);
 });
});
