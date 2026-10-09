'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path');
require('./battle.test');
global.BattleMovedex=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips}=new Function(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js/battle-tooltips.js'),'utf8')+'\nreturn {BattleTooltips};')();
describe('Approved Mega and Eevee client integration',()=>{
 for(const[id,passive]of Object.entries(require('./fixtures/mega-approved-choices.json')))it(id+' publishes its exact passive separately from Includes',()=>{
  const s=Dex.species.get(id);assert.deepEqual(s.passives,[passive]);
  assert(Dex.hasAbilityEffect(s,passive));
  assert(!Dex.getAbilityDisplayComponents(s.abilities[0],Dex,s.passives).includes(passive));
 });
 for(const[id,ability]of [['gengarmega','Shadow Double'],['scovillainmega','Crossfire'],['lucariomega','Aura Convergence'],['salamencemega','Crescent Rend']])it(id+' has its approved selected replacement and complete text',()=>{
  assert.equal(Dex.species.get(id).abilities[0],ability);assert(Dex.abilities.get(ability).desc.length>100);
 });
 it('mirrors Eevee Starter Alt without granting Adaptability to evolved forms',()=>{
  assert.deepEqual(Dex.species.get('eeveestarteralt').passives,['adaptability']);
  assert(!Dex.species.get('vaporeon').passives.includes('adaptability'));
 });
 it('explains target-dependent Aura Convergence instead of inventing hidden opponent stats',()=>{
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Lucario|Lucario-Mega, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{
   const p=battle.p1.active[0],own={speciesForme:'Lucario-Mega',ability:'Aura Convergence',baseAbility:'Aura Convergence',passives:['adaptability'],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
   p.ability='Aura Convergence';const tips=new BattleTooltips(battle);
   assert.match(tips.showMoveTooltip(Dex.moves.get('aurasphere'),'',p,own),/chosen separately for each target/);
   p.volatiles.gastroacid=['gastroacid'];
   assert(!tips.showMoveTooltip(Dex.moves.get('aurasphere'),'',p,own).includes('chosen separately for each target'));
  }finally{battle.destroy();}
 });
 it('shows Crescent Rend for converted Flying attacks and removes the contact tag only while active',()=>{
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Salamence|Salamence-Mega, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{
   const p=battle.p1.active[0],own={speciesForme:'Salamence-Mega',ability:'Crescent Rend',baseAbility:'Crescent Rend',passives:['aerilate'],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
   p.ability='Crescent Rend';const tips=new BattleTooltips(battle);
   const text=tips.showMoveTooltip(Dex.moves.get('doubleedge'),'',p,own);
   assert(text.includes('Crescent Rend: non-contact'));assert(!text.includes('Contact <small>'));
   p.volatiles.gastroacid=['gastroacid'];const suppressed=tips.showMoveTooltip(Dex.moves.get('doubleedge'),'',p,own);
   assert(!suppressed.includes('Crescent Rend: non-contact'));assert(suppressed.includes('Contact <small>'));
  }finally{battle.destroy();}
 });
});
