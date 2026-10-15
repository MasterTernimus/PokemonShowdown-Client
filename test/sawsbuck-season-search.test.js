const assert=require('assert').strict,fs=require('fs');require('./battle.test');
global.BattleSearchIndex=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchCountIndex=require('../play.pokemonshowdown.com/data/search-index').BattleSearchCountIndex;
const {DexSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {DexSearch};')();
describe('Sawsbuck seasonal search',()=>{
 it('shows exactly four seasons for Sawsbuck',()=>{const s=new DexSearch();s.setType('pokemon','gen9nofieldsinglesgame');s.find('sawsbuck');const ids=s.results.filter(r=>r[0]==='pokemon'&&r[1].startsWith('sawsbuck')).map(r=>r[1]);assert.deepEqual([...new Set(ids)].sort(),['sawsbuck','sawsbuckautumn','sawsbucksummer','sawsbuckwinter']);});
 it('preserves each seasonal identity and sprite',()=>{for(const id of ['sawsbuck','sawsbucksummer','sawsbuckautumn','sawsbuckwinter']){const p=Dex.species.get(id);assert(p.exists);assert.equal(p.id,id);assert(p.abilities);const sprite=Dex.getTeambuilderSprite({species:p.name},9);assert(sprite.includes(id==='sawsbuck'?'sawsbuck':id.replace('sawsbuck','sawsbuck-')),sprite);}});
 it('keeps Vivillon pattern skins hidden',()=>{const s=new DexSearch();s.setType('pokemon','gen9nofieldsinglesgame');s.find('vivillon');assert(!s.results.some(r=>r[0]==='pokemon'&&r[1]==='vivillonmarine'));});
});
