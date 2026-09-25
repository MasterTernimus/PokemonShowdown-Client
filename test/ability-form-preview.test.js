'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');
const context = {window:{Room:{extend: x => x}},Popup:{extend:x=>x},jQuery:{},Dex,toID,PSModel:function(){},preact:require('preact')};
vm.runInNewContext(fs.readFileSync(require.resolve('../play.pokemonshowdown.com/js/battle-dex-data.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(require.resolve('../play.pokemonshowdown.com/js/client-teambuilder.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(require.resolve('../play.pokemonshowdown.com/js/battle-team-editor.js'),'utf8'),context);
const roomMethods=context.window.TeambuilderRoom;
const rows = [
 ['Eevee-Starter','Mind Freeze','Auroreon'], ['Eevee-Starter','Eclipse','Soluneon'],
 ['Eevee-Starter','Ascendance','Divineon'], ['Eevee-Starter','Sinister Blaze','Abysseon'],
 ['Eevee-Starter-Alt','Mind Freeze','Auroreon'], ['Eevee-Starter-Alt','Eclipse','Soluneon'],
 ['Espeon','Mind Freeze','Auroreon'], ['Espeon','Eclipse','Soluneon'],
 ['Umbreon','Eclipse','Soluneon'], ['Umbreon','Ascendance','Divineon'],
 ['Glaceon','Mind Freeze','Auroreon'],
];
describe('Ability-based Team Builder stat and sprite refresh', () => {
 for (const [species,ability,form] of rows) it(species+' / '+ability+' updates and reverts immediately', () => {
  const dom = {};
  const room=Object.create(roomMethods);
  room.curSet={species,ability:'No Ability',moves:['splash'],item:'',nature:'Serious'};
  room.curSetLoc=0; room.curTeam={dex:Dex,gen:9,format:'gen9customgame'};
  room.curChartName='ability'; room.curChartType='ability';
  room.chartSetCustom=()=>false; room.save=()=>{};
  room.$=selector=>{
   const element=dom[selector] ||= {value:'',attributes:{},styles:{},markup:''};
   const chain={val(v){if(v===undefined)return element.value;element.value=v;return chain;},removeClass(){return chain;},
    attr(k,v){element.attributes[k]=v;return chain;},css(k,v){element.styles[k]=v;return chain;},html(v){element.markup=v;return chain;}};
   return chain;
  };
  const stats=()=>['hp','atk','def','spa','spd','spe'].map(stat=>room.getStat(stat,room.curSet));
  const original=stats();
  room.chartSet(ability,false);
  assert.equal(room.curSet.species,species);
  assert.equal(Dex.getAbilityFormPreview(room.curSet).species.name,form);
  assert.equal(room.getStat('hp',room.curSet),original[0]);
  assert.deepEqual(stats().slice(1),['atk','def','spa','spd','spe'].map(stat=>room.getStat(stat,{...room.curSet,species:form,ability:''})));
  assert.equal(Dex.getAbilityFormPreview(room.curSet).baseStats.hp,Dex.species.get(species).baseStats.hp);
  if(species==='Eevee-Starter'&&ability==='Mind Freeze')assert.equal(room.getStat('hp',room.curSet),401);
  assert.notDeepEqual(stats(),original);
  const modern=Object.create(context.TeamEditorState.prototype);
  Object.assign(modern,{dex:Dex,gen:9,isLetsGo:false,defaultLevel:100});
  for(const stat of ['hp','atk','def','spa','spd','spe'])assert.equal(modern.getStat(stat,room.curSet,31),room.getStat(stat,room.curSet), 'modern '+stat);
  const previewSet=Dex.getAbilityFormPreviewSet(room.curSet);
  assert.equal(dom['.setchart'].attributes.style,Dex.getTeambuilderSprite(previewSet,9));
  assert.equal(dom['.setcell-typeicons'].markup,Dex.species.get(form).types.map(t=>Dex.getTypeIcon(t)).join(''));
  assert(dom['button[name=stats]'].markup.includes('statgraph'));
  room.chartSet('No Ability',false);
  assert.deepEqual(stats(),original);
  assert.equal(dom['.setchart'].attributes.style,Dex.getTeambuilderSprite(room.curSet,9));
 });
});

describe('Decorate availability', () => {
 it('removes stale Decorate entries after custom merges while preserving Alcremie', () => {
  const previous=global.BattleTeambuilderTable;
  try {
   global.BattleTeambuilderTable={learnsets:{espeon:{decorate:'9'},chromera:{decorate:'9'},alcremie:{decorate:'9'}},gen8:{learnsets:{delibird:{decorate:'8'},alcremie:{decorate:'8'}}}};
   Dex.species.get('alcremie');
   const table=global.BattleTeambuilderTable;
   assert.equal(table.learnsets.espeon.decorate,undefined);
   assert.equal(table.learnsets.chromera.decorate,undefined);
   assert.equal(table.learnsets.alcremie.decorate,'9');
   assert.equal(table.gen8.learnsets.delibird.decorate,undefined);
   assert.equal(table.gen8.learnsets.alcremie.decorate,'8');
  } finally {global.BattleTeambuilderTable=previous;}
 });
});
