'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Gyarados Honchkrow and Kingdra local approved changes',()=>{
 it('Gyarados selectable slots and passive are exact',()=>{const s=Dex.species.get('gyarados');assert.deepEqual(s.abilities,{0:'Unbridled Wrath',1:'Tempest Fury',H:'Moxie'});assert.deepEqual(s.passives,['intimidate']);});
 it('Wrath exposes both primitive passive components and deduplicates selected Includes',()=>{for(const id of ['sheerforce','innerfocus']){assert(Dex.getPassiveAbilityEffects('unbridledwrath').has(id));assert(Dex.getAbilityComponentExclusions('unbridledwrath',['unbridledwrath']).includes(id));}assert.doesNotMatch(Dex.abilities.get('unbridledwrath').desc,/Intimidate is supplied separately/);});
 it('Honchkrow has Stakeout with original selected slots',()=>{const s=Dex.species.get('honchkrow');assert.deepEqual(s.passives,['stakeout']);assert.deepEqual(s.abilities,{0:'Pressure',1:'Void Command',H:'Supreme Overlord'});});
 for(const[id,passives]of [['gyaradosmega',['defiant']],['gyaradosaevian',[]],['gyaradosaevianmega',[]],['murkrow',['infiltrator']]])it(id+' remains unchanged',()=>assert.deepEqual(Dex.species.get(id).passives,passives));
 it('Kingdra displays 570 BST with unchanged kit',()=>{const s=Dex.species.get('kingdra');assert.deepEqual(s.baseStats,{hp:85,atk:105,def:90,spa:105,spd:90,spe:95});assert.equal(s.bst,570);assert.deepEqual(s.abilities,{0:'Swift Swim',1:'Abyss Sniper',H:'Storm Drain'});assert.deepEqual(s.passives,['waterveil']);});
});
const fs=require('fs');
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
describe('Unbridled Wrath passive move preview parity',()=>{
 for(const ability of ['Moxie','Intimidate','Unbridled Wrath'])for(const suppressed of [false,true])it(ability+' suppressed='+suppressed,()=>{
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Gyarados|Gyarados, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
  try{const p=battle.p1.active[0];p.ability=ability;if(suppressed)p.volatiles.gastroacid=['gastroacid'];const own={speciesForme:'Gyarados',ability,baseAbility:ability,passives:['unbridledwrath'],item:'',hp:100,maxhp:100,level:100,status:'',moves:[],stats:{atk:100,def:100,spa:100,spd:100,spe:100}};const tips=new BattleTooltips(battle);for(const[id,bp]of [['waterfall',104],['tackle',40]]){const m=Dex.moves.get(id);assert.equal(tips.getMoveBasePower(m,m.type,new ModifiableValue(battle,p,own),battle.p2.active[0]).value,bp);}}finally{battle.destroy();}
 });
});
