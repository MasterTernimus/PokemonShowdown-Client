'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
global.BattleMovedex=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
describe('Rival/support approved client',()=>{
 for(const [ability,id]of [['Apex Venom','poisonfang'],['Sirius','drakefang']])it(ability+' shows Strong Jaw without the removed Fang signature multiplier',()=>{
  const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{const p=b.p1.active[0],own={speciesForme:'Mew',ability,baseAbility:ability,passives:[],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}},tips=new BattleTooltips(b),m=Dex.moves.get(id);
   assert.equal(tips.getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),b.p2.active[0]).value,127.5);
  }finally{b.destroy();}
 });
 it('exports exact passives and updated Mega stats',()=>{
  for(const [id,passive]of [['zangoose','rivalresolve'],['sevipermega','rivalmalice'],['parasectparasite','mycelialbond'],['klinklang','aimassist'],['tinkaton','moldbreaker']])assert.deepEqual(Dex.species.get(id).passives,[passive]);
  assert.equal(Dex.species.get('sevipermega').baseStats.spe,65);assert.deepEqual(Dex.species.get('parasectmega').passives,['mycelialbond']);
 });
 it('keeps separate selected components and passive mechanics',()=>{
  assert(Dex.getAbilityEffects('sirius').has('venamskiss'));assert(!Dex.getAbilityEffects('toxicarmor').has('battlearmor'));assert(!Dex.getAbilityEffects('toxicarmor').has('venomarmor'));assert(Dex.getAbilityEffects('venomarmor').has('battlearmor'));assert(!Dex.getAbilityEffects('venomarmor').has('poisonheal'));assert(!Dex.getAbilityEffects('scrapbreaker').has('moldbreaker'));
 });
 it('keeps conditional effects out of species base stats',()=>{assert.equal(Dex.species.get('seviper').baseStats.spe,95);assert.equal(Dex.species.get('gothitelle').baseStats.spa,95);});
 it('opening type follows passive and first move',()=>{assert(Dex.getOpeningTypeProfile({species:'Reuniclus',ability:'Cellular Concord',moves:['drainpunch']}).includes('Fighting'));});
});

describe('Twin Fang battle stats',()=>{
 it('copies raw Attack before independent Special Attack stages under suppression',()=>{
  const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Haxorus|Haxorus, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{const p=b.p1.active[0],own={speciesForme:'Haxorus',ability:'No Ability',baseAbility:'No Ability',passives:['twinfang'],item:'',hp:331,maxhp:331,level:100,status:'',stats:{atk:330,def:216,spa:136,spd:218,spe:230}};p.boosts.atk=2;p.boosts.spa=-1;p.volatiles.gastroacid=['gastroacid'];const stats=new BattleTooltips(b).calculateModifiedStats(p,own);assert.equal(stats.spa,220);assert.equal(own.stats.spa,136);}finally{b.destroy();}
 });
});
