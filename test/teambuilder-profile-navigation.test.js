'use strict';
const assert=require('assert').strict,fs=require('fs');
const source=fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js','utf8');
describe('Profile-aware Pokemon selection',()=>{
 it('applies profile appearance before repainting and focusing the next field',()=>{
  const calls=[],set={species:'',name:''};
  const room={curSet:set,curTeam:{dex:{}},setPokemon(value,next){calls.push(['base',next]);set.species=value;set.item='';},
   toolsData:()=>({autoNickname:true,selectedNickname:'x',nicknames:[{id:'x'}]}),
   updateSetTop(){calls.push(['render',set.shiny,set.gender]);},focusChartInput(name){calls.push(['focus',name]);}};
  const start=source.indexOf('var setPokemon = proto.setPokemon;'),end=source.indexOf('var profiles = proto.renderRosterProfiles;',start);
  new Function('proto','T',source.slice(start,end))(room,{id:s=>s.toLowerCase(),applyNickname(s){s.shiny=true;s.gender='F';}});
  room.setPokemon('Primarina',true);
  assert.deepEqual(calls,[['base',false],['render',true,'F'],['focus','item']]);
 });
 it('does not repaint or reapply a profile when an unchanged species loses focus',()=>{
  const room={curSet:{species:'Primarina'},setPokemon(){},toolsData(){throw Error('Unchanged species must not reload profiles');},updateSetTop(){throw Error('Must preserve focused input');}};
  const start=source.indexOf('var setPokemon = proto.setPokemon;'),end=source.indexOf('var profiles = proto.renderRosterProfiles;',start);
  new Function('proto','T',source.slice(start,end))(room,{id:s=>s.toLowerCase()});
  room.setPokemon('Primarina',false);
 });
 it('returns to the editor after committing Pokemon and move selections',()=>{
  const calls=[],room={curTeam:{},curSetLoc:0,curChartName:'pokemon',curSet:{species:''},curSetList:[{species:''}],
   chartSet(value){this.curSet={species:value};this.curSetList[0]=this.curSet;calls.push('set');},showSelectionUndo(){calls.push('undo');},returnToPokemonEditor(){calls.push('return');}};
  const start=source.indexOf('var selectWithUndo = proto.chartSet;'),end=source.indexOf('proto.showSelectionUndo =',start);
  new Function('proto','T',source.slice(start,end))(room,{clone:s=>JSON.parse(JSON.stringify(s))});
  room.chartSet('Primarina',true);assert.deepEqual(calls,['set','undo','return']);
  calls.length=0;room.curChartName='move1';room.chartSet('Surf',true);assert(calls.includes('return'));
  for(const field of ['move2','move3']){calls.length=0;room.curChartName=field;room.chartSet('Protect',true);assert(calls.includes('return'),field);}
  calls.length=0;room.curChartName='move1';room.chartSet('Surf',false);assert(!calls.includes('return'),'blur must not jump');
 });
 for (const pointer of [true, false]) it('opens and reveals EVs after fourth move selection via ' + (pointer ? 'pointer' : 'keyboard'), () => {
  const calls=[], form={focus(options){assert(options.preventScroll);calls.push('focus');},scrollIntoView(){calls.push('scroll');}};
  const room={curTeam:{},curSetLoc:0,curChartName:'move4',pointerMoveSelection:pointer,
   curSet:{species:'Primarina',moves:['Surf','Protect','Sing']},
   chartSet(value){this.curSet.moves[3]=value;},showSelectionUndo(){calls.push('undo');},
   stats(){this.curChartName='stats';calls.push('stats');},
   $(selector){assert.equal(selector,'.statform');return [form];},
   returnToPokemonEditor(){throw Error('Fourth move must stay in EVs');}};
  room.curSetList=[room.curSet];
  const start=source.indexOf('var selectWithUndo = proto.chartSet;'),end=source.indexOf('proto.showSelectionUndo =',start);
  new Function('proto','T',source.slice(start,end))(room,{clone:s=>JSON.parse(JSON.stringify(s))});
  room.chartSet('Moonblast',true);
  assert.equal(room.curSet.moves[3],'Moonblast');
  assert.equal(room.curChartName,'stats');assert.equal(form.tabIndex,-1);
  assert.deepEqual(calls,['undo','stats','focus','scroll']);
  calls.length=0;room.curChartName='move4';room.chartSet('Moonblast',false);
  assert.deepEqual(calls,[], 'blur must not open or scroll EVs');
 });
});
