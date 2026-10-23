'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
const additions=['encore','disable','willowisp','partingshot','astonish'];
const learnsets=require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;
const code=fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8');
const MoveSearch=new Function(code+'\nreturn BattleMoveSearch;')();
describe('Explicit Delcatty redesign data and selection',()=>{
 it('shows approved typing, stats, selected abilities and one passive',()=>{
  const s=Dex.species.get('delcatty');assert.deepEqual(s.types,['Normal','Ghost']);assert.deepEqual(s.baseStats,{hp:90,atk:70,def:75,spa:100,spd:100,spe:115});assert.equal(s.bst,550);
  assert.deepEqual(s.abilities,{0:'Moonlit Prowl',1:'Natural Cure',H:'Wonder Skin'});assert.deepEqual(s.passives,['rivalry']);assert(Dex.hasAbilityEffect(s,'rivalry'));
 });
 for(const move of additions)it(move+' appears once and is selectable',()=>{
  assert.deepEqual(learnsets.delcatty.learnset[move],[move==='astonish'?'9L1':'9M']);
  const search=new MoveSearch('move','gen9nofieldsinglesgame',{species:'Delcatty',ability:'Moonlit Prowl'});
  assert.equal(search.canLearn('delcatty',move),true);
 });
 it('preserves Skitty and Mightyena variant metadata',()=>{
  assert.deepEqual(Dex.species.get('skitty').types,['Normal']);assert.deepEqual(Dex.species.get('skitty').abilities,{0:'Cute Charm',1:'Normalize',H:'Wonder Skin'});
  for(const id of ['mightyena','mightyenagrim','mightyenadeso'])assert.deepEqual(Dex.species.get(id).passives,['rivalry']);
  for(const id of ['mightyenamega','mightyenamegagrim'])assert.deepEqual(Dex.species.get(id).passives,['darkaura']);
 });
});
