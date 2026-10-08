const assert=require('assert').strict,fs=require('fs'),path=require('path');
require('./battle.test');
global.BattleSearchIndex=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchIndexCount=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexCount;
global.BattleTeambuilderTable=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const {DexSearch}=new Function(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js/battle-dex-search.js'),'utf8')+'\nreturn {DexSearch};')();
function search(options={},query='',filters=null,sort=null){const s=new DexSearch();s.setType('pokemon','gen9nofieldsinglesgame');s.pickerOptions=options;s.filters=filters;s.sortCol=sort;s.find(query);return s;}
function ids(s){return s.results.filter(r=>r[0]==='pokemon').map(r=>r[1]);}
describe('Pokemon picker view filters',()=>{
 let aliases;before(()=>{aliases=global.BattleAliases;global.BattleAliases={};});after(()=>{if(aliases===undefined)delete global.BattleAliases;else global.BattleAliases=aliases;});
 it('distinguishes true Megas, Core forms, temporary forms, and regional/cosmetic forms',()=>{
  const traits=id=>DexSearch.pokemonPickerTraits(Dex.species.get(id));
  assert(traits('charizardmegax').mega);assert(traits('cameruptpulse').pulse);assert(!traits('cameruptpulse').mega);assert(traits('cameruptpulse').gimmick);
  assert(traits('groudonprimal').gimmick);assert(traits('charizardgmax').gimmick);assert(traits('aegislashblade').gimmick);
  assert(traits('raichualola').regional);assert(!traits('raichualola').gimmick);assert(!traits('deerlingsummer').gimmick);
 });
 it('hides Mega and gimmick forms independently without mutating data',()=>{
  const records=Object.keys(BattlePokedex).filter(id => BattlePokedex[id].num);
  const snapshot=()=>JSON.stringify(records.map(id=>{const s=Dex.species.get(id);return [id,s.name,s.forme,s.baseStats,s.abilities,s.types];}));
  const before=snapshot();const megas=search({hideMegas:true},'-custom'),gimmicks=search({hideGimmicks:true},'-custom');
  assert(ids(megas).includes('cameruptpulse'));assert(!ids(gimmicks).includes('cameruptpulse'));assert(!ids(megas).some(id=>DexSearch.pokemonPickerTraits(Dex.species.get(id)).mega));
  assert.equal(snapshot(),before);
 });
 it('combines custom catalog, name, type, ability and stat sorting',()=>{
  const s=search({customOnly:true,hideMegas:true},'',[['type','Ghost']], 'bst');const found=ids(s);assert(found.length);
  assert.equal(new Set(found).size,found.length);for(const id of found)assert(Dex.species.get(id).types.includes('Ghost'));
  const pulse=ids(search({group:'pulse'},'mime'));assert.deepEqual(pulse,['mrmimepulse']);
  const ability=ids(search({group:'pulse'},'',[['ability','Pulse Filtration']]));assert.deepEqual(ability,['swalotpulse']);
 });
 for(const group of ['pulse','rift','regional'])it('browses '+group+' from current species metadata',()=>{
  const found=ids(search({group}));assert(found.length);assert(found.every(id=>DexSearch.pokemonPickerTraits(Dex.species.get(id))[group]));
 });
 it('supports an empty intersection and resetting without losing type filters',()=>{
  const s=search({group:'pulse',hideGimmicks:true},'',[['type','Water']]);assert.equal(ids(s).length,0);s.pickerOptions={group:'pulse'};s.results=null;s.find('');assert(ids(s).includes('swalotpulse'));assert.deepEqual(s.filters,[['type','Water']]);
 });
 it('does not apply Pokemon filters to moves',()=>{const s=new DexSearch();s.setType('move','gen9nofieldsinglesgame', 'mew');s.pickerOptions={group:'pulse',hideGimmicks:true};s.find('tackle');assert(s.results.some(r=>r[0]==='move'&&r[1]==='tackle'));});
});
describe('Approved ability client metadata',()=>{
 let aliases;before(()=>{aliases=global.BattleAliases;global.BattleAliases={shadowguard:'Voidcraft'};});after(()=>{if(aliases===undefined)delete global.BattleAliases;else global.BattleAliases=aliases;});
 it('uses new names, components and descriptions',()=>{
  assert.equal(Dex.abilities.get('Shadow Guard').id,'voidcraft');assert.equal(Dex.species.get('mismagiusmega').abilities[0],'Voidcraft');
  assert.match(Dex.abilities.get('shadowshield').desc,/0.8x.*0.75x/);assert.match(Dex.abilities.get('spentforce').desc,/next two complete turns/);
  assert(Dex.getAbilityEffects('exalt').has('sharpness'));assert(!Dex.getAbilityEffects('exalt').has('innerfocus'));
  assert.match(Dex.abilities.get('pulsewaste').desc,/Swamp Field for 3 turns/);
  assert.match(Dex.abilities.get('pulsefiltration').desc,/3-turn Murkwater Surface/);
  assert.equal(Dex.items.get('anomalycore').megaStone['Mr. Mime-Galar'],'Mr. Mime-Pulse');
 });
});

describe('Totem selection visibility', () => {
 let aliases; before(() => { aliases = global.BattleAliases; global.BattleAliases = {}; });
 after(() => { if (aliases === undefined) delete global.BattleAliases; else global.BattleAliases = aliases; });
 it('hides metadata Totem forms from every search view while retaining species data', () => {
  const totems = Object.keys(BattlePokedex).filter(id => DexSearch.pokemonPickerTraits(Dex.species.get(id)).totem);
  const before = JSON.stringify(totems.map(id => Dex.species.get(id)));
  assert(totems.length >= 10);
  for (const options of [{}, {customOnly: true}, {group: 'regional'}, {hideMegas: true}]) {
   for (const query of ['', '-custom', 'totem', ...totems]) {
    assert(!ids(search(options, query)).some(id => totems.includes(id)), query);
   }
  }
  assert(!ids(search({}, '', [['type', 'Electric']])).some(id => totems.includes(id)));
  assert(ids(search({group: 'regional'}, 'raticate')).includes('raticatealola'));
  assert.equal(JSON.stringify(totems.map(id => Dex.species.get(id))), before);
  for (const id of totems) assert(Dex.species.get(id).exists);
 });
 it('uses form metadata rather than an incidental name substring', () => {
  assert(!DexSearch.pokemonPickerTraits({id: 'totemtest', name: 'Totem Test', forme: ''}).totem);
  assert(DexSearch.pokemonPickerTraits({id: 'test', forme: 'Alola-Totem'}).totem);
  assert(DexSearch.pokemonPickerTraits({id: 'test', forme: 'Busted-Totem'}).totem);
 });
});
