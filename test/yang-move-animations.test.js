'use strict';
const assert=require('assert').strict,fs=require('fs');
const ids=["kaboom","cactibash","corrosivestrike","toxicvial","flutterscales","spiritmend","chistrike","gunkrock","frozenrefractals","nomoswish","queensgambit","darkclasp","beatdown","infernalrage","m3g4qu4k3","winddance","timeblade","crestcleave","sirensveil","sirenswrath","rocknroll","dragonrend","airstreamassault","wisteriamaelstrom","deiludicium","nostraswish","swarmsnare"];
const selfIds=['spiritmend','nomoswish','sirensveil','rocknroll'];
function harness() {
 const calls = [];
 const other = new Proxy({}, {get: (_, id) => ({anim: () => calls.push(['other', id])})});
 const animations = new Function('BattleOtherAnims', 'Config', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations-moves.js', 'utf8') + '\nreturn BattleMoveAnims;')(other, {routes: {client: 'localhost'}});
 const sprite = (x, z) => { let proxy; return proxy = new Proxy({x, y: 0, z, w: 96, h: 96, isBackSprite: z === 0, statbar: null}, {
  get: (obj, key) => key in obj ? obj[key] : (...args) => {
   calls.push(['sprite', key, ...args]);
   if (key === 'leftof') return x + args[0];
   if (key === 'behind') return z + args[0];
   return proxy;
  },
 }); };
 const jquery = new Proxy({}, {get: (_, key) => (...args) => {calls.push(['jquery', key, ...args]); return jquery;}});
 const scene = new Proxy({timeOffset: 0, acceleration: 1, animating: true, $bg: jquery}, {get: (obj, key) => key in obj ? obj[key] : (...args) => {calls.push(['scene', key, ...args]);}});
 return {animations, calls, scene, sprites: [sprite(80, 0), sprite(240, 200)]};
}
describe('Yang signature explicit animation playback',()=>{
 for(const id of ids)it(id+' has explicit visible playback',()=>{const{animations,calls,scene,sprites}=harness();assert.equal(typeof animations[id]?.anim,'function');assert.notEqual(animations[id].anim,animations.tackle.anim);animations[id].anim(scene,selfIds.includes(id)?[sprites[0]]:sprites);assert(calls.length>0);});
 it('only Crest Cleave invokes drain playback',()=>{const{animations,scene,sprites}=harness();let drains=0;animations.leechlife.anim=()=>{drains++;};for(const id of ids){drains=0;animations[id].anim(scene,selfIds.includes(id)?[sprites[0]]:sprites);assert.equal(drains,id==='crestcleave'?1:0,id);}});
});

require('./battle.test');
const {BattleTooltips,ModifiableValue}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js','utf8')+'\nreturn {BattleTooltips,ModifiableValue};')();
function setup(ability='No Ability',item=''){
 const battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
 const p=battle.p1.active[0];p.ability=ability;
 const own={speciesForme:'Mew',ability,baseAbility:ability,passives:[],item,hp:100,maxhp:100,level:100,status:'',moves:[],stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
 const tips=new BattleTooltips(battle);return{battle,p,own,tips,value:()=>new ModifiableValue(battle,p,own)};
}
describe('Yang adaptive category preview',()=>{for(const id of ['queensgambit','timeblade','swarmsnare', 'wisteriamaelstrom', 'airstreamassault', 'dragonrend', 'sirenswrath'])it(id+' uses stages with Special ties and leaves raw stats intact',()=>{const h=setup('Huge Power','Choice Band');try{const m=Dex.moves.get(id);h.p.status='brn';assert.equal(h.tips.getMoveType(m,h.value())[1],'Special');h.p.boosts.atk=1;assert.equal(h.tips.getMoveType(m,h.value())[1],'Physical');h.p.boosts.spa=1;assert.equal(h.tips.getMoveType(m,h.value())[1],'Special');assert.deepEqual(h.own.stats,{atk:100,def:100,spa:100,spd:100,spe:100});}finally{h.battle.destroy();}});});
