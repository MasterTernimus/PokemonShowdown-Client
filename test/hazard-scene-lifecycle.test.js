'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
const source = fs.readFileSync('play.pokemonshowdown.com/src/battle-animations.ts', 'utf8');
const tree = ts.createSourceFile('scene.ts', source, ts.ScriptTarget.Latest, true);
const sceneClass = tree.statements.find(n => ts.isClassDeclaration(n) && n.name.text === 'BattleScene');
const methods = ['addSideCondition', 'removeSideCondition', 'resetSideConditions'].map(name => sceneClass.members.find(n => n.name && n.name.getText() === name).getText());
const compiled = ts.transpileModule('class HazardScene {' + methods.join('\n') + '}', {compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText;
const hazards = {spikes:3,toxicspikes:2,stealthrock:4,stickyweb:1,gmaxsteelsurge:3};
function setup() {
 const alive = new Set();
 class Sprite {constructor() {this.$el={};alive.add(this);} anim() {return this;} destroy() {alive.delete(this);}}
 const Scene = new Function('Sprite','BattleEffects',compiled + ';return HazardScene;')(Sprite, {});
 const scene = new Scene(); scene.animating=true;scene.sideConditions=[{},{}];scene.$spritesFront=[{append() {}},{append() {}}];
 scene.battle={gameType:'doubles',sides:[0,1].map(n=>({n,isFar:!!n,x:0,y:0,z:0,leftof:x=>x,behind:x=>x,sideConditions:{}}))};
 function set(side,id,layers=1) {scene.battle.sides[side].sideConditions[id]=[id,layers,0,0];scene.addSideCondition(side,id,true);}
 return {scene,alive,set};
}
describe('Physical entry hazard sprite lifecycle', () => {
 for (const [id,count] of Object.entries(hazards)) it('renders and removes ' + id + ' on either side without duplicate sprites', () => {
  const {scene,alive,set}=setup();
  for (const side of [0,1]) {set(side,id,id==='spikes'?3:id==='toxicspikes'?2:1);assert.equal(scene.sideConditions[side][id].length,count);}
  assert.equal(alive.size,count*2);
  for(let i=0;i<3;i++)for(const side of[0,1])scene.addSideCondition(side,id,true);
  assert.equal(alive.size,count*2);
  scene.removeSideCondition(0,id);scene.removeSideCondition(1,id);assert.equal(alive.size,0);
 });
 for (const [id,max] of [['spikes',3],['toxicspikes',2]]) it('tracks increases and decreases in '+id+' layers', () => {
  const {scene,alive,set}=setup();set(0,id,1);assert.equal(alive.size,1);set(0,id,max);assert.equal(alive.size,max);set(0,id,1);assert.equal(alive.size,1);assert.equal(scene.sideConditions[0][id].length,1);
 });
 it('reconstructs all hazards repeatedly without orphaning sprites', () => {
  const {scene,alive,set}=setup();for(const side of[0,1])for(const id of Object.keys(hazards))set(side,id,id==='spikes'?3:id==='toxicspikes'?2:1);
  for(let i=0;i<4;i++){scene.resetSideConditions();assert.equal(alive.size,26);}
  for(const side of[0,1])scene.battle.sides[side].sideConditions={};scene.resetSideConditions();assert.equal(alive.size,0);
 });
 it('refreshes unequal layers when both sides exchange existing hazards', () => {
  const {scene,alive,set}=setup();set(0,'spikes',3);set(1,'spikes',1);set(0,'stickyweb');set(1,'stickyweb');
  const sides=scene.battle.sides;[sides[0].sideConditions,sides[1].sideConditions]=[sides[1].sideConditions,sides[0].sideConditions];
  for(const side of[0,1])for(const id of['spikes','stickyweb'])scene.addSideCondition(side,id,true);
  assert.equal(scene.sideConditions[0].spikes.length,1);assert.equal(scene.sideConditions[1].spikes.length,3);assert.equal(alive.size,6);
 });
 it('restores current hazards after animation suppression ends', () => {
  const {scene,alive,set}=setup();scene.animating=false;set(0,'spikes',2);assert.equal(alive.size,0);scene.animating=true;scene.resetSideConditions();assert.equal(alive.size,2);
 });
});
