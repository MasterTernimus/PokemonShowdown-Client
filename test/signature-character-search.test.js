'use strict';
const assert=require('assert').strict,fs=require('fs');global.window=global;
for(const [file,key]of [['pokedex','BattlePokedex'],['abilities','BattleAbilities'],['typechart','BattleTypeChart'],['teambuilder-tables','BattleTeambuilderTable'],['aliases','BattleAliases']])global[key]=require('../play.pokemonshowdown.com/data/'+file+'.js')[key];
require('../play.pokemonshowdown.com/js/battle-dex-data.js');require('../play.pokemonshowdown.com/js/battle-dex.js');
Object.assign(global,require('../play.pokemonshowdown.com/data/search-index.js'));
global.BattleMovedex=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
global.BattleLearnsets=require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;
const {DexSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {DexSearch};')();
const search=(query,species='primarina')=>{const s=new DexSearch('move','gen9nationaldex',species);s.find(query);return s;};
const ids=s=>s.results.filter(r=>r[0]==='move').map(r=>r[1]);
describe('Credited signature character move search',()=>{
 const cases={Allen:['vorpalblade'],Melia:['gildedarrow','gildedhelix'],Damien:['beasthunter'],Amaria:['sirensveil','sirenswrath'],Julia:['kaboom'],Anna:['nostraswish'],Bennett:['swarmsnare'],Venam:['venamskiss'],Flora:['uproot'],Florin:['uproot'],Keta:['galestrike'],Aelita:['galestrike'],Texen:['galestrike'],Narcissa:['spectralscream'],Spector:['spectralscream'],'Puppet Master':['bunrakubeatdown'],Magenta:['bunrakubeatdown'],Neon:['bunrakubeatdown']};
 for(const[name,expected]of Object.entries(cases))for(const query of [name,name.toUpperCase(),name.toLowerCase().split('').join(' . ')])it(query+' finds only credited moves',()=>assert.deepEqual(ids(search(query)).sort(),expected.slice().sort()));
 it('exports searchable credit metadata for all52 signature moves',()=>{
  const data=require('../server-data-sync-manifest.json').snapshot.moves;const entries=Object.entries(data).filter(([,m])=>m.signatureCharacters);
  assert.equal(entries.length,52);for(const[id,m]of entries)for(const name of m.signatureCharacters)assert(ids(search(name)).includes(id),id+'/'+name);
 });
 it('keeps species legality labels and legal-first ordering',()=>{
  const s=search('Amaria','blastoise');assert.deepEqual(ids(s),['sirenswrath','sirensveil']);assert(!s.illegalLabel('sirenswrath'));assert(s.illegalLabel('sirensveil'));
  const pikachu=search('Amaria','pikachu');assert(pikachu.illegalLabel('sirenswrath'));assert(pikachu.illegalLabel('sirensveil'));
 });
 it('retains active category filters for character searches',()=>{const s=search('Amaria');s.addFilter(['category','Status']);s.find('Amaria');assert.deepEqual(ids(s),['sirensveil']);});
 it('does not widen short substrings into character matches',()=>{assert(!ids(search('aria')).includes('sirensveil'));assert(!ids(search('ann')).includes('nostraswish'));});
 it('preserves normal move name search',()=>{assert(ids(search("Siren's Wrath")).includes('sirenswrath'));assert(ids(search('Surf')).includes('surf'));});
});

describe('Signature learner removals',()=>{
 for(const[species,credit,move]of [['noctowl','Ciel','winddance']])it(species+' is illegal for '+move,()=>{const s=search(credit,species);assert(ids(s).includes(move));assert(s.illegalLabel(move));assert(!BattleLearnsets[species].learnset[move]);});
 for(const[species,credit,move]of [['goodrahisui','Saphira','dragonrend'],['altaria','Ciel','winddance'],['dragonite','Saphira','dragonrend'],['goodrahisui','Elias','deiludicium']])it(species+' retains '+move,()=>{assert(!search(credit,species).illegalLabel(move));});
});

describe('Release move search coverage',()=>{
 it('finds Aquabatics from Aqua for Primarina as a legal move',()=>{const s=search('Aqua','primarina');assert(ids(s).includes('aquabatics'));assert(!s.illegalLabel('aquabatics'));});
 it('indexes every released move, including all signature moves',()=>{require('child_process').execFileSync(process.execPath,['build-tools/verify-move-assets'],{cwd:require('path').resolve(__dirname,'..')});});
 it('finds every signature by its complete move name',()=>{const moves=require('../server-data-sync-manifest.json').snapshot.moves;for(const[id,m]of Object.entries(moves))if(m.signatureCharacters)assert(ids(search(m.name)).includes(id),id);});
});

describe('Compact signature move rows and default ordering',()=>{
 it('keeps all signature descriptions short and synced to plain credits',()=>{
  const moves=require('../server-data-sync-manifest.json').snapshot.moves;
  for(const[id,raw]of Object.entries(moves))if(raw.signatureCharacters){
   const move=Dex.moves.get(id);assert(move.shortDesc.length<=90,id);
   assert.equal(move.shortDesc,raw.shortDesc);assert.equal(move.desc,raw.desc);
   assert(!/inspired by|custom implementation/i.test(move.desc));
  }
 });
 for(const species of ['crobat','primarina','dusknoir','chandelure','metagross'])it(species+' lists learned signatures first without duplicates',()=>{
  const s=search('',species),rows=ids(s);assert(rows.length>0);
  const signatures=rows.filter(id=>BattleMovedex[id].signatureCharacters?.length && !s.illegalLabel(id));
  assert(signatures.length>0);assert.deepEqual(rows.slice(0,signatures.length),signatures);
  assert.equal(new Set(rows).size,rows.length);
  assert(s.results.some(row=>row[0]==='header'&&row[1]==='Signature moves'));
 });
 it('does not promote an unlearned signature',()=>{
  const s=search('','pikachu');assert(!ids(s).slice(0,3).includes('airstreamassault'));
 });
 it('preserves explicit power sorting',()=>{
  const s=search('','chandelure');s.toggleSort('power');s.find('');
  assert(!s.results.some(row=>row[0]==='header'&&row[1]==='Signature moves'));
 });
});
