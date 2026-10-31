'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path'),vm=require('vm');
const context=require('./helpers/isolated-dex.cjs')();
context.BattleText=require('../play.pokemonshowdown.com/data/text').BattleText;
for(const file of ['battle-scene-stub','battle-text-parser','battle','battle-log','battle-tooltips'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js',file+'.js'),'utf8'),context);
const {Battle,BattleTooltips,ModifiableValue}=vm.runInContext('({Battle,BattleTooltips,ModifiableValue})',context),{Dex}=context;
describe('Lapras client rework',()=>{
 let b,p,t,own,tips;
 beforeEach(()=>{
  b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Lapras|Lapras, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});b.seekTurn(Infinity);
  p=b.p1.active[0];t=b.p2.active[0];tips=new BattleTooltips(b);
  own={speciesForme:'Lapras',ability:'Storm Memory',baseAbility:'Storm Memory',passives:['liquidvoice'],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:85,def:90,spa:95,spd:105,spe:65}};
 });
 afterEach(()=>b.destroy());
 const power=id=>{const m=Dex.moves.get(id);return tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),t).value;};
 it('matches the server snapshot and removes retired Gmax components',()=>{
  const s=require('../server-data-sync-manifest.json').snapshot;
  for(const id of ['lapras','laprasgmax','laprasazzy'])assert.equal(JSON.stringify(Dex.species.get(id).passives),JSON.stringify(s.species[id].passives));
  assert.equal(JSON.stringify(Dex.species.get('laprasgmax').passives),'["liquidvoice"]');
  for(const id of ['safeharbor','oceanlullaby','stormmemory','auroraresonance']){
   assert.equal(Dex.abilities.get(id).desc,s.abilities[id].desc,id);assert.equal(Dex.abilities.get(id).shortDesc,s.abilities[id].shortDesc,id);
  }
  const harbor=Dex.getAbilityEffects('safeharbor');assert(harbor.has('hydration'));assert(harbor.has('waterabsorb'));assert(!harbor.has('icebody'));
  const lullaby=Dex.getAbilityEffects('oceanlullaby');assert(lullaby.has('icebody'));assert(lullaby.has('shellarmor'));
  const gmax=Dex.getAbilityEffects('auroraresonance');for(const id of ['liquidvoice','waterabsorb','icebody','raindish','hydration'])assert(!gmax.has(id),id);
 });
 it('makes Wild Charge available without changing its global recoil or adding Volt Tackle',()=>{
  const raw=require('../play.pokemonshowdown.com/data/learnsets').BattleLearnsets;
  assert.deepEqual(raw.lapras.learnset.wildcharge,['9M']);assert(!raw.lapras.learnset.volttackle);
  const table=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
  assert(table.learnsets.lapras.wildcharge.includes('9'));
  assert.equal(JSON.stringify(Dex.moves.get('wildcharge').recoil),'[1,4]');
 });
 it('previews charged Wild Charge as adaptive and gives Electric moves 50% power only while charged',()=>{
  const m=Dex.moves.get('wildcharge');assert.equal(power('wildcharge'),120);
  p.volatiles.stormcharge=['stormcharge'];assert.equal(power('wildcharge'),180);
  assert.equal(tips.getMoveType(m,new ModifiableValue(b,p,own))[1],'Special');
  own.stats.atk=150;assert.equal(tips.getMoveType(m,new ModifiableValue(b,p,own))[1],'Physical');
  own.stats.atk=85;p.volatiles.gastroacid=['gastroacid'];assert.equal(power('wildcharge'),120);
  assert.equal(tips.getMoveType(m,new ModifiableValue(b,p,own))[1],'Physical');
 });
 it('Aurora Resonance boosts Water/Ice during Veil and combines once with passive Liquid Voice',()=>{
  own.ability=own.baseAbility='Aurora Resonance';own.speciesForme='Lapras-Gmax';
  const water=Dex.moves.get('watergun').basePower;assert.equal(power('watergun'),water);
  p.side.sideConditions.auroraveil=['Aurora Veil',1,5,5];assert.equal(power('watergun'),water*1.3);
  const sound=Dex.moves.get('hypervoice'),value=new ModifiableValue(b,p,own),type=tips.getMoveType(sound,value)[0];assert.equal(type,'Water');
  assert.equal(tips.getMoveBasePower(sound,type,new ModifiableValue(b,p,own),t).value,sound.basePower*1.2*1.3);
  p.volatiles.gastroacid=['gastroacid'];assert.equal(power('watergun'),water);
 });
 it('Storm Charge badge no longer promises draining or expenditure on a miss',()=>{
  const src=fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/src/battle-animations.ts'),'utf8');
  const line=src.split('\n').find(x=>x.includes('stormcharge:'));assert(line.includes('recoil-free'));assert(!line.includes('heals'));assert(!line.includes('miss or block'));
 });
});
