'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
global.BattleSearchIndex=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchIndexCount=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexCount;
global.BattleTeambuilderTable=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const {DexSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {DexSearch};')();
describe('Approved three Lycanroc passives',()=>{
 for(const [id,passive]of [['lycanroc','infiltrator'],['lycanrocmidnight','defiant'],['lycanrocdusk','toughclaws']])it(id+' displays its exact passive',()=>{assert.deepEqual(Dex.species.get(id).passives,[passive]);assert(Dex.hasAbilityEffect(Dex.species.get(id),passive));});
 it('replaces only Dusk Tough Claws with Scrappy and preserves all other slots',()=>{
  assert.deepEqual(Dex.species.get('lycanroc').abilities,{0:'Keen Hunt',1:'Sand Rush',H:'Ultra Instinct'});
  assert.deepEqual(Dex.species.get('lycanrocmidnight').abilities,{0:'Ultra Ego',1:'Blood Challenge',H:'No Guard'});
  assert.deepEqual(Dex.species.get('lycanrocdusk').abilities,{0:'Scrappy',1:'Twilight Instinct',H:'Dusk Drive'});
 });
 it('records actual local Dusk move-picker availability without granting any move',()=>{
  const rows=[];for(const format of ['gen9nofieldsinglesgame','gen9nofielddoublesbattle']){
   const search=new DexSearch();search.setType('move',format,{species:'Lycanroc-Dusk',ability:'Scrappy',moves:[]});search.find('');
   const moves=search.results.filter(row=>row[0]==='move').map(row=>row[1]);assert(moves.length>0);
   rows.push({format,moves,headSmashShown:moves.includes('headsmash'),headSmashIllegalReason:search.illegalLabel('headsmash'),candidateMoves:Object.fromEntries(['accelerock','crunch','psychicfangs','firefang','thunderfang','bite','rocktomb','rockslide','stoneedge'].map(id=>[id,moves.includes(id)]))});
  }
  assert.equal(rows.length,2);
  if(process.env.LYCANROC_MOVE_AUDIT_OUTPUT)fs.writeFileSync(process.env.LYCANROC_MOVE_AUDIT_OUTPUT,JSON.stringify(rows,null,2)+'\n');
 });
});
