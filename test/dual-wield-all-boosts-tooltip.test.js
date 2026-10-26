'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path');require('./battle.test');
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js/battle-tooltips.js'),'utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
describe('All boosted Dual Wield actual tooltip powers',()=>{
 let b,p,q,own,tips;
 beforeEach(()=>{b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});p=b.p1.active[0];q=b.p2.active[0];own={speciesForme:'Mew',ability:'Dual Wield',baseAbility:'Dual Wield',passives:[],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}};tips=new BattleTooltips(b);});
 afterEach(()=>b.destroy());
 function power(ability,id,passives=['dualwield'],patch={}){own.ability=own.baseAbility=ability;own.passives=passives;p.ability=ability;const m={...Dex.moves.get(id),...patch},v=new ModifiableValue(b,p,own);tips.getMoveBasePower(m,m.type,v,q);return v;}
 for(const[ability,id,first,second]of [['Sharpness','sacredsword',135,13.5],['Power Drill','hornattack',135,13.5],['Mega Launcher','aurasphere',120,12],['Technician','metalclaw',48,48],['Tough Claws','sacredsword',117,13.5],['Iron Fist','stackingshot',56,6],['Sheer Force','airslash',97.5,11.25]])it(ability+' displays full first and15% original second',()=>{const v=power(ability,id);assert(Math.abs(v.value-first)<1e-8,v.toString());assert(Math.abs(v.secondHitPower-second)<1e-8,v.toString());});
 it('Technician activates for a qualifying low-power slicing move',()=>{const v=power('Technician','metalclaw',['dualwield'],{basePower:40});assert.equal(v.value,60);assert.equal(v.secondHitPower,6);});
 it('Sheer Force does not qualify a move without removable secondaries',()=>{const v=power('Sheer Force','sacredsword');assert.equal(v.value,54);assert.equal(v.secondHitPower,54);});
 it('nonqualifying boosters leave ordinary60% pairs',()=>{const v=power('Mega Launcher','sacredsword');assert.equal(v.value,54);assert.equal(v.secondHitPower,54);});
 it('a suppressed selected booster does not suppress an independent Dual Wield passive',()=>{p.volatiles.gastroacid=['gastroacid'];const v=power('Tough Claws','sacredsword');assert.equal(v.value,54);assert.equal(v.secondHitPower,54);});
 it('keeps an item multiplier on both asymmetric hits',()=>{own.item='Muscle Band';const v=power('Tough Claws','sacredsword');assert(Math.abs(v.value-128.7)<1e-8);assert(Math.abs(v.secondHitPower-14.85)<1e-8);});
 it('does not make an item trigger the asymmetric rule',()=>{own.item='Muscle Band';const v=power('Dual Wield','sacredsword',[]);assert(Math.abs(v.value-59.4)<1e-8);assert(Math.abs(v.secondHitPower-59.4)<1e-8);});
 it('shows uncertainty for Analytic action order instead of assuming the target already acted',()=>{const v=power('Analytic','sacredsword');assert.equal(v.value,54);assert.equal(v.maxValue,117);assert.equal(v.secondHitPower,13.5);assert(v.toString().includes('conditional'));});
 it('does not assume a Sniper critical hit',()=>{const v=power('Sniper','sacredsword');assert.equal(v.value,54);assert.equal(v.maxValue,90);assert.equal(v.secondHitPower,13.5);assert(v.toString().includes('otherwise60%')||v.toString().includes('otherwise 60%'));});
 it('a guaranteed critical move uses the known Sniper trigger without folding critical damage into BP',()=>{const v=power('Sniper','sacredsword',['dualwield'],{willCrit:true});assert.equal(v.value,90);assert.equal(v.secondHitPower,13.5);});
});
