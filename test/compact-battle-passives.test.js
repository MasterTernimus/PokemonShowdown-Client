'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
const {BattleTooltips}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips};')();
describe('Compact battle passive descriptions',()=>{
 for(const [species,passive]of [['Nidoqueen','rivalry'],['Dragonite','championscommand'],['Carbink','crystalward']])it(species+' uses the short passive text and preserves full details',()=>{
  const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Test|'+species+', L100|100/100']});
  try{
   const p=battle.p1.active[0],details=Dex.getPassiveAbilityDetails(passive),full=details.desc;
   const own={speciesForme:species,ability:'No Ability',baseAbility:'No Ability',passives:[passive],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100},moves:[]};
   const html=new BattleTooltips(battle).showPokemonTooltip(p,own,true);
   const section=html.match(/<p class="pokemon-passives">([\s\S]*?)<\/p>/)[1];
   assert(section.includes('Passive:</small>'));assert(section.includes(BattleLog.escapeHTML(details.shortDesc)));
   if(full!==details.shortDesc)assert(!section.includes(BattleLog.escapeHTML(full)));
   assert(section.includes(passive==='crystalward'?'Disabled by Ability suppression.':'Stays active if Ability is suppressed.'));
   assert.equal(Dex.getPassiveAbilityDetails(passive).desc,full);
  }finally{battle.destroy();}
 });
 it('every current species passive has a readable compact summary',()=>{
  const ids=new Set(Object.keys(BattlePokedex).flatMap(id=>Dex.species.get(id).passives));
  for(const id of ids){const text=Dex.getPassiveAbilityDetails(id).shortDesc;assert(text.length>0&&text.length<=145,id+': '+text);}
 });
});
