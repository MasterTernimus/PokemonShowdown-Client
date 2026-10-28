'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path'), vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
context.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;
for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle', 'battle-log', 'battle-tooltips']) {
 vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js', file + '.js'), 'utf8'), context);
}
const {Battle, BattleTextParser, BattleTooltips, ModifiableValue} = vm.runInContext('({Battle,BattleTextParser,BattleTooltips,ModifiableValue})', context);
const {Dex} = context;
describe('Hitmon client parity', () => {
 let battle, p, q, own, tips;
 function setup(species, ability, passive, gameType='singles') {
  battle = new Battle({debug:true, log:['|init|battle','|gen|9','|gametype|'+gameType,`|switch|p1a: Fighter|${species}, L100|100/100`,'|switch|p2a: Mew|Mew, L100|100/100',...(gameType==='doubles'?['|switch|p1b: Ally|Mew, L100|100/100']:[])]});
  battle.seekTurn(Infinity); p=battle.p1.active[0]; q=battle.p2.active[0];
  own={speciesForme:species,ability,baseAbility:ability,item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100},passives:[passive]};
  p.ability=p.baseAbility=ability; tips=new BattleTooltips(battle);
 }
 afterEach(()=>battle?.destroy());
 const power=id=>tips.getMoveBasePower(Dex.moves.get(id),Dex.moves.get(id).type,new ModifiableValue(battle,p,own),q).value;
 it('exports the approved abilities, passives and concise descriptions',()=>{
  for(const [id,ability,passive] of [['hitmonchan','Check Hook','punchfiend'],['hitmonlee','Springheel','kickfiend'],['hitmontop','Cyclone Rhythm','spinfiend']]) {
   const species=Dex.species.get(id);assert.equal(species.abilities.H,ability);assert.deepEqual(Array.from(species.passives),[passive]);
   assert(Dex.abilities.get(ability).desc.includes('1/4 damage'));
  }
  assert.equal(Dex.abilities.get('punchfiend').shortDesc,'Iron Fist + Serene Grace + Keen Eye.');
  assert.equal(Dex.abilities.get('kickfiend').shortDesc,'Striker + Limber + Serene Grace.');
  assert.equal(Dex.abilities.get('spinfiend').shortDesc,'Technician + Vital Spirit + Steadfast.');
 });
 it('applies Iron Fist once with Check Hook and Punch Fiend',()=>{
  setup('Hitmonchan','Check Hook','punchfiend'); assert(Math.abs(power('firepunch')-119)<1e-9);
  p.addVolatile('gastroacid');assert(Math.abs(power('firepunch')-119)<1e-9);
 });
 it('shows Striker and the Springheel kick rules',()=>{
  setup('Hitmonlee','Springheel','kickfiend');assert.equal(power('axekick'),168);assert(Dex.moves.get('jumpkick').flags.kick);
  assert(tips.showMoveTooltip(Dex.moves.get('highjumpkick'),'',p,own).includes('no crash damage'));
  p.addVolatile('gastroacid');assert.equal(power('axekick'),168);
  assert(!tips.showMoveTooltip(Dex.moves.get('highjumpkick'),'',p,own).includes('Springheel:'));
 });
 it('combines Technician and Cyclone Rhythm once and honors suppression',()=>{
  setup('Hitmontop','Cyclone Rhythm','spinfiend');assert.equal(power('rapidspin'),90);assert.equal(power('icespinner'),96);
  p.addVolatile('gastroacid');assert.equal(power('rapidspin'),75);assert.equal(power('icespinner'),80);
 });
 it('exports Oracle’s Refrain and previews Psychic STAB and sound power',()=>{
  setup('Politoed','Drizzle','oraclesrefrain');
  assert.deepEqual(Array.from(Dex.species.get('politoed').passives),['oraclesrefrain']);
  const ability=Dex.abilities.get('oraclesrefrain');
  assert.equal(ability.name,"Oracle's Refrain");
  assert.equal(ability.shortDesc,'Psychic STAB + Soundproof + Resonance Force.');
  assert(!ability.desc.includes('Resists'));
  assert.equal(Dex.abilities.get('Oracular Chorus').id,'oraclesrefrain');
  assert.deepEqual(Array.from(Dex.species.get('politoedrejuv').passives),['royalremedy']);
  assert.equal(power('boomburst'),210);assert.equal(power('sparklingaria'),135);assert.equal(power('alluringvoice'),120);
  assert(tips.showMoveTooltip(Dex.moves.get('psychic'),'',p,own).includes('receives Psychic STAB'));
  p.addVolatile('gastroacid');assert.equal(power('boomburst'),210);
 });
 it('exports the revised PP requirement',()=>{
  const ability=Dex.abilities.get('checkhook');assert(ability.desc.includes('double its usual PP'));assert(ability.desc.includes('in the moveset'));
  assert(!ability.desc.includes('costs no PP'));
 });
 it('tracks exact counter PP without charging old free-counter replays',()=>{
  setup('Hitmonchan','Check Hook','punchfiend');
  battle.useMove(p,Dex.moves.get('suckerpunch'),q,{from:'ability: Check Hook'});
  battle.runMinor(['-activate','p1a: Fighter','ability: Check Hook'],{move:'Sucker Punch',number:'4'});
  assert.equal(p.moveTrack.find(m=>m[0]==='Sucker Punch')[1],4);
  battle.runMinor(['-activate','p1a: Fighter','ability: Check Hook'],{});
  assert.equal(p.moveTrack.find(m=>m[0]==='Sucker Punch')[1],4);
 });
 it('previews allied sound support but excludes FFA opponents',()=>{
  setup('Politoed','Drizzle','oraclesrefrain','doubles');const ally=battle.p1.active[1];
  const allyOwn={...own,speciesForme:'Mew',ability:'No Ability',baseAbility:'No Ability',passives:[]};
  ally.ability=ally.baseAbility='No Ability';
  assert.equal(tips.getMoveBasePower(Dex.moves.get('boomburst'),'Normal',new ModifiableValue(battle,ally,allyOwn),q).value,210);
  battle.gameType='freeforall';q.ability=q.baseAbility='No Ability';
  assert.equal(tips.getMoveBasePower(Dex.moves.get('boomburst'),'Normal',new ModifiableValue(battle,q,allyOwn),p).value,140);
 });
 it('renders the counter announcement',()=>{
  const parser=new BattleTextParser('p1');const text=parser.extractMessage('|-activate|p1a: Fighter|ability: Check Hook');
  assert(text.includes('answered with Sucker Punch at double PP'));assert(!text.includes('[POKEMON]'));
 });
});
