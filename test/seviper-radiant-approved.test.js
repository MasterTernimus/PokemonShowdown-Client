'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
global.BattleMovedex=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
describe('Approved Seviper fang-tail client parity',()=>{
 it('Venams Kiss belongs to both flag classifications and displays both boosts once',()=>{const m=Dex.moves.get('venamskiss');assert(m.flags.bite&&m.flags.tail);assert(/Bite\/tail/i.test(m.shortDesc));const b=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});try{const p=b.p1.active[0],own={speciesForme:'Mew',ability:'Sirius',baseAbility:'Sirius',passives:[],item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100}};assert.equal(new BattleTooltips(b).getMoveBasePower(m,m.type,new ModifiableValue(b,p,own),b.p2.active[0]).value,135);}finally{b.destroy();}});
 it('exports the new slot, Shed Skin component and healing limit',()=>{assert.equal(Dex.species.get('seviper').abilities.H,"Venam's Kiss");assert(Dex.getAbilityEffects('blackviper').has('shedskin'));assert(Dex.abilities.get('venamskiss').desc.includes('1/8 base max HP'));assert(!Dex.moves.get('poisontail').drain);assert(Dex.moves.get('radiantassault').desc.includes('1.2x'));});
});
