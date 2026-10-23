'use strict';
const assert=require('assert').strict,fs=require('fs'),vm=require('vm');global.window=global;
for(const [file,key]of [['pokedex','BattlePokedex'],['abilities','BattleAbilities'],['moves','BattleMovedex'],['items','BattleItems'],['typechart','BattleTypeChart'],['teambuilder-tables','BattleTeambuilderTable'],['aliases','BattleAliases']])global[key]=require('../play.pokemonshowdown.com/data/'+file+'.js')[key];
require('../play.pokemonshowdown.com/js/battle-dex-data');require('../play.pokemonshowdown.com/js/battle-dex');Object.assign(global,require('../play.pokemonshowdown.com/data/search-index'));
const {DexSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {DexSearch};')();
const make=(type,q)=>{const s=new DexSearch(type,'gen9nationaldex',type==='move'?'mew':'');s.find(q);return s};
const ids=s=>s.results.filter(r=>r[0]===s.typedSearch.searchType).map(r=>r[1]).sort();
describe('Sorting during typed picker searches',()=>{
 for(const [type,queries,cols]of [['move',['','psychic','punch'],['name','type','category','power','accuracy','pp']],['pokemon',['','Ground','char'],['name','type','ability','hp','atk','def','spa','spd','spe','bst']]]){
  for(const q of queries)it(type+' query '+JSON.stringify(q)+' retains header and matching rows for every sort',()=>{const s=make(type,q),expected=ids(s),suggestions=s.results.filter(r=>r[0]!==type&&!r[0].startsWith('sort'));
   assert.equal(s.results[0][0],type==='move'?'sortmove':'sortpokemon');
   if(!q)return;
   for(const col of cols){s.toggleSort(col);s.find(q);assert.equal(s.query,q.toLowerCase());assert.deepEqual(ids(s),expected);assert.deepEqual(s.results.filter(r=>r[0]!==type&&!r[0].startsWith('sort')),suggestions);s.toggleSort(col);s.find(q);assert.deepEqual(ids(s),expected);}
   s.find('');assert.equal(s.results[0][0],type==='move'?'sortmove':'sortpokemon');
  });
 }
 it('actually orders matches in each section, with reverse and reset',()=>{const s=make('move','psychic');const initial=JSON.stringify(s.results);for(const reverse of [false,true]){s.toggleSort('pp');s.find('psychic');let prev=null;for(const row of s.results){if(row[0]!=='move'){prev=null;continue;}const current={pp:Dex.moves.get(row[1]).pp,illegal:s.illegalLabel(row[1])};if(prev&&prev.illegal===current.illegal)assert(reverse?prev.pp<=current.pp:prev.pp>=current.pp);prev=current;}}s.toggleSort('pp');s.find('psychic');assert.equal(JSON.stringify(s.results),initial);});
 it('retains active filters and legal/illegal labels',()=>{const s=make('move','punch');s.addFilter(['category','Physical']);s.find('punch');const labels=ids(s).map(id=>[id,s.illegalLabel(id)]);s.toggleSort('power');s.find('punch');assert.deepEqual(ids(s).map(id=>[id,s.illegalLabel(id)]),labels);assert(s.results.filter(r=>r[0]==='move').every(r=>Dex.moves.get(r[1]).category==='Physical'));});
 it('preserves roster filtering after sorting and the selected list',()=>{const context={window:{},jQuery(){},Dex,toID,BattleLog:{}};vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js','utf8'),context);const proto=context.window.BattleSearch.prototype,s=make('pokemon','ground');const allowed=new Set(ids(s).slice(0,4));const ui={engine:s,cancelRendering(){},updateScroll(){},rosterFilter:rows=>rows.filter(r=>r[0]!=='pokemon'||allowed.has(r[1]))};s.toggleSort('atk');proto.find.call(ui,'ground');assert.equal(ui.resultSet[0][0],'sortpokemon');assert(ui.resultSet.filter(r=>r[0]==='pokemon').every(r=>allowed.has(r[1])));assert.equal(ui.engine.query,'ground');});
});
