'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Yang actual battle protocol UI',()=>{
function setup(extra){return new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100',...extra]});}
it('shows Wind Dance four-turn weather without replacing selected ability',()=>{const b=setup(['|-ability|p1a: Mew|Pressure','|-weather|DeltaStream|[from] move: Wind Dance|[of] p1a: Mew']);try{b.seekTurn(Infinity);assert.equal(b.weather,'deltastream');assert.equal(b.weatherTimeLeft,4);assert.equal(b.weatherMinTimeLeft,4);assert.equal(b.p1.active[0].ability,'Pressure');}finally{b.destroy();}});
it('uses explicit three-turn Frozen Refractals Veil protocol',()=>{const b=setup(['|-sidestart|p1: Local|move: Aurora Veil','|-sidestart|p1: Local|move: Aurora Veil|[turns] 3|[silent]']);try{b.seekTurn(Infinity);assert.deepEqual(b.p1.sideConditions.auroraveil.slice(2),[3,3]);}finally{b.destroy();}});
it('tracks and exchanges Dragon Rend hazard with Court Change',()=>{const b=setup(['|-sidestart|p1: Local|move: Dragon Rend']);try{b.seekTurn(Infinity);assert(b.p1.sideConditions.dragonrend);b.swapSideConditions();assert(!b.p1.sideConditions.dragonrend);assert(b.p2.sideConditions.dragonrend);}finally{b.destroy();}});
});

it('describes Nostras Wish delayed impact as an attack',()=>{const old=global.BattleText;global.BattleText=require('../play.pokemonshowdown.com/data/text.js').BattleText;try{const parser=new BattleTextParser();const text=parser.parseArgsInner(['-end','p2a: Mew','move: Nostras Wish'],{});assert.match(text,/Nostras Wish attack/);assert(!text.includes('freed'));}finally{global.BattleText=old;}});
