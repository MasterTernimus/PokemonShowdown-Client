'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
const fixture=require('./rejuv-moves-approved.json');
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
const rawMoves=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
global.BattleMovedex=rawMoves;
const learnsets=require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;
function setup(ability='No Ability',item=''){
 const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
 const p=battle.p1.active[0];p.ability=ability;
 const own={speciesForme:'Mew',ability,baseAbility:ability,passives:[],item,hp:100,maxhp:100,level:100,status:'',moves:[],stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
 const tips=new BattleTooltips(battle);return{battle,p,own,tips,value:()=>new ModifiableValue(battle,p,own)};
}
describe('Rejuvenation signature generated data and move previews',()=>{
 for(const[id,users]of Object.entries(fixture.learnsets))it(id+' has exact metadata and learned distribution',()=>{
  const move=Dex.moves.get(id);assert(move.exists);assert.equal(move.priority,0);assert.equal(move.target,id==='aquabatics'?'self':'adjacentFoe');assert.equal(!!rawMoves[id].drain,id==='spectralscream');assert(move.desc);
  const actual=Object.keys(learnsets).filter(s=>learnsets[s].learnset?.[id]).sort();assert.deepEqual(actual,[...users,...(id==='spectralscream'?['spiritomb','banette','cursola']:[])].sort());
 });
 it('preserves static selected slots for all recipients',()=>{for(const[id,slots]of Object.entries(fixture.slots))assert.deepEqual(Dex.species.get(id).abilities,require('./fixtures/mega-approval-overlays').abilities(id,slots),id);});
 it('removed signatures are absent from all selected ability slots; Mega Seviper retains its passive',()=>{
  const ids=Object.keys(fixture.learnsets);for(const[id,s]of Object.entries(BattlePokedex))for(const ability of Object.values(s.abilities||{}))assert(!ids.includes(toID(ability)) || (id==='seviper' && toID(ability)==='venamskiss'),id+'/'+ability);
  for(const id of ids.filter(x=>x!=='venamskiss'))assert(!Dex.abilities.get(id).exists,id);
  assert(Dex.abilities.get('venamskiss').exists);assert(Dex.getAbilityEffects('sirius').has('venamskiss'));assert(Dex.species.get('sevipermega').passives.includes('rivalmalice'));
 });
 for(const [ability,item,type]of [['No Ability','Flame Plate','Fire'],['No Ability','Charcoal','Normal'],['Aerilate','','Flying'],['Aerilate','Flame Plate','Fire'],['Klutz','Flame Plate','Normal']])it('Multipulse '+ability+'/'+item,()=>{const h=setup(ability,item);try{assert.equal(h.tips.getMoveType(Dex.moves.get('multipulse'),h.value())[0],type);}finally{h.battle.destroy();}});
 for(const id of ['spectralscream','barbedweb','bunrakubeatdown','lastrespects'])it(id+' uses staged stats with Special ties, ignoring ability stat multipliers',()=>{const h=setup('Huge Power');try{const m=Dex.moves.get(id);assert.equal(h.tips.getMoveType(m,h.value())[1],'Special');h.p.boosts.atk=1;assert.equal(h.tips.getMoveType(m,h.value())[1],'Physical');h.p.boosts.spa=1;assert.equal(h.tips.getMoveType(m,h.value())[1],'Special');}finally{h.battle.destroy();}});
 it('Spectral Scream becomes Physical with much higher staged Attack',()=>{const h=setup();try{h.own.stats.atk=500;h.own.stats.spa=50;h.p.boosts.atk=6;assert.equal(h.tips.getMoveType(Dex.moves.get('spectralscream'),h.value())[1],'Physical');}finally{h.battle.destroy();}});
 it('Bunraku counts currently fainted team members rather than historical faint count',()=>{const h=setup();try{h.p.side.faintCounter=20;const m=Dex.moves.get('bunrakubeatdown');const bp=()=>h.tips.getMoveBasePower(m,m.type,h.value(),h.battle.p2.active[0]).value;assert.equal(bp(),80);const original=h.p.side.pokemon;h.p.side.pokemon=[h.p,...Array.from({length:5},()=>({fainted:true}))];assert.equal(bp(),140);h.p.side.pokemon[1].fainted=false;assert.equal(bp(),140);h.p.side.pokemon=original;}finally{h.battle.destroy();}});
 for(const id of ['bunrakubeatdown','lastrespects'])it(id+' caps preview at140 and loses power after revival',()=>{const h=setup();try{const m=Dex.moves.get(id),original=h.p.side.pokemon;h.p.side.pokemon=[h.p,...Array.from({length:5},()=>({fainted:true}))];const bp=()=>h.tips.getMoveBasePower(m,m.type,h.value(),h.battle.p2.active[0]).value;assert.equal(bp(),140);for(const p of h.p.side.pokemon)p.fainted=false;assert.equal(bp(),id==='lastrespects'?50:80);h.p.side.pokemon=original;}finally{h.battle.destroy();}});
 it('Fever Pitch presents its full random power range and Thunder Raid its first hit',()=>{const h=setup();try{const m=Dex.moves.get('feverpitch'),v=h.tips.getMoveBasePower(m,m.type,h.value());assert.match(String(v),/60.*100/);const raid=Dex.moves.get('thunderraid');assert.equal(h.tips.getMoveBasePower(raid,raid.type,h.value()).value,20);assert.match(raid.desc,/20\/40\/60/);}finally{h.battle.destroy();}});
});

describe('Spectral Scream adaptive power preview category',()=>{
 for(const[atk,spa,expected]of [[200,100,'Physical'],[100,200,'Special'],[100,100,'Special']])it(expected+' with '+atk+'/'+spa,()=>{const h=setup();const previous=window.BattleFieldTooltips;let observed;try{h.own.stats.atk=atk;h.own.stats.spa=spa;window.BattleFieldTooltips={preview(b,m){observed=m.category;return undefined;}};h.tips.getMoveBasePower(Dex.moves.get('spectralscream'),'Ghost',h.value(),h.battle.p2.active[0]);assert.equal(observed,expected);assert.equal(h.tips.getMoveType(Dex.moves.get('spectralscream'),h.value())[1],expected);}finally{window.BattleFieldTooltips=previous;h.battle.destroy();}});
});
