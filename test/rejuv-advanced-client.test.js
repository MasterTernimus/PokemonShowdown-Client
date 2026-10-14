'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
const fixture=require('./rejuv-moves-approved.json');
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
const rawMoves=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const learnsets=require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;
function setup(ability='No Ability',item=''){
 const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
 const p=battle.p1.active[0];p.ability=ability;
 const own={speciesForme:'Mew',ability,baseAbility:ability,passives:[],item,hp:100,maxhp:100,level:100,status:'',moves:[],stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
 const tips=new BattleTooltips(battle);return{battle,p,own,tips,value:()=>new ModifiableValue(battle,p,own)};
}

require('../play.pokemonshowdown.com/js/battle-field-rules.js');
new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-field-tooltips.js','utf8'))();
describe('Advanced Rejuvenation client previews',()=>{
 for(const [types,want] of [[['Water','Dragon'],'Dragon'],[['Dragon','Dark'],'Dragon'],[['Normal','Fairy'],'Normal']]) for(const id of ['gildedarrow','gildedhelix'])it(id+' '+types,()=>{const h=setup();try{h.p.getTypes=()=>[types,[]];assert.equal(h.tips.getMoveType(Dex.moves.get(id),h.value())[0],want);}finally{h.battle.destroy();}});
 for(const [types,want] of [[['Normal'],96],[['Water','Dragon'],80]])it('Gilded Aerilate multiplier '+types,()=>{const h=setup('Aerilate');try{h.p.getTypes=()=>[types,[]];const m=Dex.moves.get('gildedarrow');assert.equal(h.tips.getMoveBasePower(m,h.tips.getMoveType(m,h.value())[0],h.value()).value,want);}finally{h.battle.destroy();}});
 it('Irritation shows status power',()=>{const h=setup();try{const q=h.battle.p2.active[0];q.status='par';assert.equal(h.tips.getMoveBasePower(Dex.moves.get('irritation'),'Bug',h.value(),q).value,120);}finally{h.battle.destroy();}});
 for(const [field,power,type]of [['Glitch Terrain',175,'???'],['Bewitched Woods Terrain',135,'Fairy']])it('Vorpal '+field,()=>{const h=setup();try{h.battle.addPseudoWeather(field);const m=Dex.moves.get('vorpalblade');assert.equal(h.tips.getMoveType(m,h.value())[0],type);assert.equal(h.tips.getMoveBasePower(m,type,h.value(),h.battle.p2.active[0]).value,power);}finally{h.battle.destroy();}});
 it('Gilded Helix retains two hits and high crit metadata',()=>{assert.equal(Dex.moves.get('gildedhelix').multihit,2);assert.equal(Dex.moves.get('gildedhelix').critRatio,2);});
});
