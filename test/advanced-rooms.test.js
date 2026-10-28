'use strict';
const assert=require('assert').strict,fs=require('fs'),path=require('path'),vm=require('vm');
const context=require('./helpers/isolated-dex.cjs')();context.BattleText=require('../play.pokemonshowdown.com/data/text.js').BattleText;
for(const file of ['battle-scene-stub','battle-text-parser','battle','battle-log','battle-tooltips'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../play.pokemonshowdown.com/js',file+'.js'),'utf8'),context);
const {Battle,BattleTextParser,BattleTooltips,ModifiableValue}=vm.runInContext('({Battle,BattleTextParser,BattleTooltips,ModifiableValue})',context),{Dex}=context;
describe('Advanced rooms client parity',()=>{
 let battle,p,q,own,tips;
 beforeEach(()=>{battle=new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles','|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});battle.seekTurn(Infinity);p=battle.p1.active[0];q=battle.p2.active[0];own={speciesForme:'Mew',ability:'No Ability',baseAbility:'No Ability',item:'',hp:100,maxhp:100,level:100,status:'',stats:{atk:100,def:100,spa:100,spd:100,spe:100},passives:[]};tips=new BattleTooltips(battle);});afterEach(()=>battle.destroy());
 const power=id=>tips.getMoveBasePower(Dex.moves.get(id),Dex.moves.get(id).type,new ModifiableValue(battle,p,own),q).value;
 it('shows each power change only while its room is active',()=>{for(const[id,room,factor]of [['hurricane','Gravity',.75],['rockslide','Gravity',5325/4096],['psychic','Magic Room',4915/4096],['shadowball','Magic Room',4915/4096],['moonblast','Magic Room',4915/4096],['bodypress','Wonder Room',4915/4096],['behemothbash','Wonder Room',4915/4096],['swift','Magic Room',1]]){const before=power(id);battle.addPseudoWeather(room,5);assert(Math.abs(power(id)-before*factor)<.01,id);battle.removePseudoWeather(room);assert.equal(power(id),before);}});
 it('shows exact eight-turn timers for every Magic Room barrier and retains them after the room ends',()=>{battle.addPseudoWeather('Magic Room',5);for(const id of ['reflect','lightscreen','auroraveil','arenitewall','atlantiswall','safeguard','mist']){battle.runMinor(['-sidestart','p1',Dex.moves.get(id).name],{turns:'8'});assert.deepEqual(Array.from(battle.p1.sideConditions[id].slice(2)),[8,8]);}battle.removePseudoWeather('Magic Room');assert.equal(battle.p1.sideConditions.arenitewall[2],8);});
 it('renders distinct room starts, ends and Gravity grounding messages without unresolved placeholders',()=>{const parser=new BattleTextParser('p1');for(const[name,phrase]of [['Gravity','winds weaken'],['Magic Room','new barriers last longer'],['Wonder Room','Critical hits are sealed'],['Trick Room','reversed the Speed order']]){const start=parser.extractMessage('|-fieldstart|move: '+name+'|[of] p1a: Mew');assert(start.includes(phrase),start);assert(!start.includes('[POKEMON]'));const end=parser.extractMessage('|-fieldend|move: '+name);assert(end.trim().length>10);}assert(parser.extractMessage('|-activate|p1a: Mew|move: Gravity').includes('back to the ground'));});
 it('shows live room guidance and the walls in Magic Room descriptions',()=>{battle.addPseudoWeather('Wonder Room',5);assert(tips.showMoveTooltip(Dex.moves.get('swift'),'',p,own).includes('Wonder Room prevents critical hits'));battle.addPseudoWeather('Magic Room',5);for(const id of ['arenitewall','atlantiswall','safeguard','mist']){assert(Dex.moves.get('magicroom').desc.includes(Dex.moves.get(id).name));assert(tips.showMoveTooltip(Dex.moves.get(id),'',p,own).includes('Magic Room: lasts 8 turns'));}});
 it('shows instant Dig/Dive and Guard Swap guidance only while the relevant room is active',()=>{
  for(const id of ['dig','dive']) {
   const note='Gravity: attacks immediately';
   assert(!tips.showMoveTooltip(Dex.moves.get(id),'',p,own).includes(note));
   battle.addPseudoWeather('Gravity',5);
   assert(tips.showMoveTooltip(Dex.moves.get(id),'',p,own).includes(note));
   battle.removePseudoWeather('Gravity');
  }
  const note='Wonder Room: after a successful swap';
  assert(!tips.showMoveTooltip(Dex.moves.get('guardswap'),'',p,own).includes(note));
  battle.addPseudoWeather('Wonder Room',5);
  assert(tips.showMoveTooltip(Dex.moves.get('guardswap'),'',p,own).includes(note));
  battle.removePseudoWeather('Wonder Room');
  assert(!tips.showMoveTooltip(Dex.moves.get('guardswap'),'',p,own).includes(note));
 });
 it('applies defensive stage reset messages without clearing other negative stages',()=>{
  p.boosts={def:3,spd:-2,atk:-2};
  battle.runMinor(['-setboost','p1a: Mew','spd','0'],{from:'move: Wonder Room'});
  assert.equal(p.boosts.def,3);
  assert.equal(p.boosts.spd||0,0);
  assert.equal(p.boosts.atk,-2);
 });
 it('shows the expanded room interactions only while their rooms are active',()=>{
  for(const [room,ids] of [['Magic Room',['magiccoat','healpulse']],['Wonder Room',['guardsplit','powersplit','powerswap','heartswap','speedswap','painsplit','powertrick','powershift']]]) {
   for(const id of ids) assert(!tips.showMoveTooltip(Dex.moves.get(id),'',p,own).includes('<p>'+room+':'));
   battle.addPseudoWeather(room,5);
   for(const id of ids) {
    assert(tips.showMoveTooltip(Dex.moves.get(id),'',p,own).includes('<p>'+room+':'),id);
    assert(Dex.moves.get(id).desc.includes(room),id+' description');
   }
   battle.removePseudoWeather(room);
  }
 });
 it('tracks full Power Shift after room expiry, combines it with Power Trick, and restores stats on toggle',()=>{
  own.stats={atk:100,def:200,spa:300,spd:400,spe:150};
  battle.addPseudoWeather('Wonder Room',5);
  battle.runMinor(['-start','p1a: Mew','Power Shift'],{fullshift:'.'});
  let stats=tips.calculateModifiedStats(p,own,true);
  assert.deepEqual([stats.atk,stats.def,stats.spa,stats.spd],[200,100,400,300]);
  battle.removePseudoWeather('Wonder Room');
  assert.equal(tips.calculateModifiedStats(p,own,true).spa,400);
  battle.runMinor(['-start','p1a: Mew','Power Trick'],{});
  stats=tips.calculateModifiedStats(p,own,true);
  assert.deepEqual([stats.atk,stats.def,stats.spa,stats.spd],[100,200,400,300]);
  battle.runMinor(['-end','p1a: Mew','Power Shift'],{});
  stats=tips.calculateModifiedStats(p,own,true);
  assert.deepEqual([stats.atk,stats.def,stats.spa,stats.spd],[200,100,300,400]);
  battle.runMinor(['-end','p1a: Mew','Power Trick'],{});
  assert.deepEqual(Object.values(tips.calculateModifiedStats(p,own,true)),Object.values(own.stats));
 });
 it('does not retroactively give ordinary Power Shift the special pair when Wonder Room begins',()=>{
  own.stats={atk:100,def:200,spa:300,spd:400,spe:150};
  battle.runMinor(['-start','p1a: Mew','Power Shift'],{});
  battle.addPseudoWeather('Wonder Room',5);
  const stats=tips.calculateModifiedStats(p,own,true);
  assert.deepEqual([stats.atk,stats.def,stats.spa,stats.spd],[200,100,300,400]);
 });
 it('retains the full Power Shift flag through Baton Pass and clears it on an ordinary switch',()=>{
  battle.runMinor(['-start','p1a: Mew','Power Shift'],{fullshift:'.'});
  q.copyVolatileFrom(p);
  assert(q.volatiles.powershift[1]);
  assert(!p.volatiles.powershift);
  q.clearVolatile();
  assert(!q.volatiles.powershift);
 });
 it('shows Power Trick exchanged stages and Speed Swap cleanup using normal protocol messages',()=>{
  own.stats={atk:100,def:200,spa:300,spd:400,spe:150};
  battle.runMinor(['-start','p1a: Mew','Power Trick'],{});
  battle.runMinor(['-setboost','p1a: Mew','atk','3'],{from:'move: Power Trick'});
  battle.runMinor(['-setboost','p1a: Mew','def','-2'],{from:'move: Power Trick'});
  const stats=tips.calculateModifiedStats(p,own,true);
  assert.equal(stats.atk,500); assert.equal(stats.def,50);
  p.boosts.spe=-3;q.boosts.spe=-2;
  battle.runMinor(['-swapboost','p1a: Mew','p2a: Mew','spe'],{from:'move: Speed Swap'});
  battle.runMinor(['-setboost','p1a: Mew','spe','0'],{from:'move: Wonder Room'});
  assert.equal(p.boosts.spe||0,0);assert.equal(q.boosts.spe,-3);assert.equal(p.boosts.def,-2);
 });
 it('shows World Axis data, its charge messages, and the next-attack power bonus',()=>{
  const mega=Dex.species.get('claydolmega');
  assert.equal(mega.abilities['0'],'World Axis');assert.equal(mega.baseStats.atk,100);assert.equal(mega.baseStats.spa,100);
  assert(Dex.abilities.get('worldaxis').desc.includes('Guard Split'));
  own.ability=own.baseAbility='World Axis';p.ability=p.baseAbility='World Axis';
  const before=power('psychic');
  battle.runMinor(['-start','p1a: Mew','ability: World Axis'],{});
  assert.equal(power('psychic'),before*1.5);
  battle.runMinor(['-end','p1a: Mew','ability: World Axis'],{});
  assert.equal(power('psychic'),before);
  const parser=new BattleTextParser('p1');
  assert(parser.extractMessage('|-start|p1a: Mew|ability: World Axis').includes('stored energy'));
  assert(parser.extractMessage('|-end|p1a: Mew|ability: World Axis').includes('charge ended'));
 });
 it('exports the dedicated setters and shows the exact Lost Epoch timer',()=>{
  for(const[id,slot,name]of [['lunatone','1','Gravity Well'],['solrock','1','Gravity Well'],['carbink','0','Arcane Chamber'],['beheeyem','0','Mirror Chamber'],['unown','0','Lost Epoch']]) {
   assert.equal(Dex.species.get(id).abilities[slot],name);
   assert(Dex.abilities.get(name).desc.length>30);
  }
  battle.runMinor(['-fieldstart','move: Trick Room'],{of:'p1a: Mew',from:'ability: Lost Epoch',turns:'5'});
  assert.deepEqual(Array.from(battle.pseudoWeather.find(x=>x[0]==='Trick Room').slice(1)),[5,5]);
 });
});
