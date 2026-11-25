'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
global.BattleSearchIndex=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchIndexCount=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexCount;
global.BattleTeambuilderTable=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const {DexSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {DexSearch};')();
const {BattleTooltips, ModifiableValue} = new Function(
 fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};'
)();
describe('Approved three Lycanroc passives',()=>{
 for(const [id,passive]of [['lycanroc','infiltrator'],['lycanrocmidnight','defiant'],['lycanrocdusk','toughclaws']])it(id+' displays its exact passive',()=>{assert.deepEqual(Dex.species.get(id).passives,[passive]);assert(Dex.hasAbilityEffect(Dex.species.get(id),passive));});
 it('replaces only Dusk Tough Claws with Scrappy and preserves all other slots',()=>{
  assert.deepEqual(Dex.species.get('lycanroc').abilities,{0:'Keen Hunt',1:'Sand Rush',H:'Ultra Instinct'});
  assert.deepEqual(Dex.species.get('lycanrocmidnight').abilities,{0:'Ultra Ego',1:'Blood Challenge',H:'No Guard'});
  assert.deepEqual(Dex.species.get('lycanrocdusk').abilities,{0:'Scrappy',1:'Twilight Instinct',H:'Dusk Ego'});
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

describe('Dusk Lycanroc move power previews', () => {
 let battle, user, foe, set, tooltips;
 beforeEach(() => {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
   '|switch|p1a: Lycanroc|Lycanroc-Dusk, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
  user = battle.p1.active[0];
  foe = battle.p2.active[0];
  set = {speciesForme: 'Lycanroc-Dusk', ability: 'Twilight Instinct', item: '', level: 100, hp: 100, maxhp: 100,
   stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
  tooltips = new BattleTooltips(battle);
 });
 afterEach(() => battle.destroy());
 function power(id) {
  const move = Dex.moves.get(id);
  return tooltips.getMoveBasePower(move, move.type, new ModifiableValue(battle, user, set), foe);
 }
 it('shows one contact multiplier and a conditional non-contact bonus', () => {
  const contact = power('accelerock');
  assert.equal(contact.value, 52);
  assert.equal(contact.maxValue, 0);
  assert.match(contact.toString(), /Ultra Instinct or Tough Claws/);
  const ranged = power('stoneedge');
  assert.deepEqual([ranged.value, ranged.maxValue], [100, 130]);
 });
 for (const blocked of ['Gastro Acid', 'Battle Bond', 'Holy Terrain']) {
  it('shows only the contact bonus with ' + blocked, () => {
   if (blocked === 'Gastro Acid') user.volatiles.gastroacid = ['gastroacid'];
   if (blocked === 'Battle Bond') foe.ability = 'Battle Bond';
   if (blocked === 'Holy Terrain') battle.addPseudoWeather(blocked, 0, 0);
   assert(!power('accelerock').toString().includes('Ultra Instinct'));
   assert.equal(power('accelerock').value, 52);
   assert.equal(power('stoneedge').maxValue, 0);
  });
 }
});
