'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-mainmenu.js', 'utf8');
const tree = ts.createSourceFile('client.js', source, ts.ScriptTarget.Latest, true);
function method(name, marker = '') {
 const found = [];
 function visit(node) {
  if (ts.isPropertyAssignment(node) && node.name.getText() === name && ts.isFunctionExpression(node.initializer) && node.initializer.getText().includes(marker)) found.push(node.initializer.getText());
  if (ts.isBinaryExpression(node) && node.left.getText() === 'p.' + name && ts.isFunctionExpression(node.right) && node.right.getText().includes(marker)) found.push(node.right.getText());
  ts.forEachChild(node, visit);
 }
 visit(tree); assert(found.length, name); return found[found.length - 1];
}
function comparison() {
 let serial = 0; const timers = new Map(), writes = {}, sent = [];
 const chain = selector => ({text(v) {writes[selector] = v; return this;}, attr() {return this;}, removeAttr() {return this;}, addClass() {return this;}, removeClass() {return this;}});
 const base = {actors:[{species:'Mew',moves:['Tackle','Thunderbolt']},{species:'Pikachu',moves:['Thunder']},{species:'Mew'},{species:'Mew'}],sideConditions:[[],[]]};
 const room = {scenario:() => base, $:chain, $el:chain('root'), scenarioRevision:0, refreshActors() {},refreshCalcMoves() {},refreshFieldState() {},scenarioEdited() {this.cancelComparison();}, requestCalculator(json) {this.requestId='request-'+ ++serial;this.calculatorLastSentAt=Date.now();sent.push({id:this.requestId,json});}};
 const set = fn => {const id=++serial;timers.set(id,fn);return id;}; const clear = id => timers.delete(id);
 for (const name of ['cancelComparison','compareMoves','nextComparison','receiveCalculator']) room[name] = new Function('receive','setTimeout','clearTimeout','return '+method(name,name==='receiveCalculator'?'comparisonRequest':''))(() => {},set,clear);
 return {room,base,writes,sent,flush() {const entry=timers.entries().next().value;assert(entry,'timer expected');timers.delete(entry[0]);entry[1]();},reply(id,percent=10) {room.receiveCalculator({requestId:id,results:[{}, {minPercent:percent,maxPercent:percent,kos:0}],samples:32});}};
}
describe('Calculator comparison request ownership', () => {
 it('ignores a superseded reply before the replacement request is sent', () => {
  const h=comparison();h.room.compareMoves('0:0');h.flush();const old=h.sent[0].id;
  h.room.compareMoves('0:1');h.reply(old);assert.equal(h.writes['.calc-actor[data-slot=0] [data-result=1]'],undefined);
  h.flush();assert.equal(JSON.parse(h.sent[1].json).move,'Thunderbolt');h.reply(h.sent[1].id,25);assert.match(h.writes['.calc-actor[data-slot=0] [data-result=1]'],/^25/);
 });
 it('rejects old or untagged replies after a replacement send', () => {
  const h=comparison();h.room.compareMoves('0:0');h.flush();const old=h.sent[0].id;h.room.compareMoves('0:1');h.flush();h.reply(old);h.reply(undefined);assert.equal(h.writes['.calc-actor[data-slot=0] [data-result=1]'],undefined);
 });
 it('does not reuse a completed reply for the next comparison task', () => {
  const h=comparison();h.room.compareMoves();h.flush();const first=h.sent[0].id;h.reply(first);h.reply(first);assert.equal(h.writes['.calc-actor[data-slot=0] [data-result=1]'],undefined);h.flush();h.reply(h.sent[1].id,22);assert.match(h.writes['.calc-actor[data-slot=0] [data-result=1]'],/^22/);
 });
 it('serializes each queued action before later mutable inputs can change it', () => {
  const h=comparison();h.room.compareMoves('0:0');h.base.actors[0].species='Pikachu';h.flush();assert.equal(JSON.parse(h.sent[0].json).actors[0].species,'Mew');h.reply(h.sent[0].id);assert.equal(h.room.comparisonQueue,null);
 });
 it('cancels pending timer and request ownership on an interrupted flow', () => {
  const h=comparison();h.room.compareMoves('0:0');h.room.cancelComparison();assert.equal(h.room.requestId,null);assert.equal(h.room.comparisonRequest,null);assert.equal(h.room.comparisonQueue,null);assert.throws(h.flush,/timer expected/);
 });
 it('invalidates an in-flight comparison when scenarioEdited runs', () => {
  const h=comparison();h.room.compareMoves('0:0');h.flush();const old=h.sent[0].id;
  h.room.scenarioEdited=new Function('edited','return '+method('scenarioEdited','comparisonResults'))(() => {});
  h.room.scenarioEdited();h.reply(old);assert.equal(h.room.comparisonQueue,null);assert.equal(h.room.requestId,null);assert.equal(h.writes['.calc-move-result'],'Not calculated');
 });
 it('cancels comparisons before ordinary calculate, retry and removal', () => {
  const start=source.indexOf("['calculate', 'retryCalculator', 'remove'].forEach");const end=source.indexOf('\n\t\tvar edited',start);const p={};let called=[];for(const name of ['calculate','retryCalculator','remove'])p[name]=()=>called.push(name);p.cancelComparison=()=>called.push('cancel');new Function('p',source.slice(start,end))(p);for(const name of ['calculate','retryCalculator','remove'])p[name]();assert.deepEqual(called,['cancel','calculate','cancel','retryCalculator','cancel','remove']);
 });
});
function clinic() {
 const inputs={'clinic-team':'Team A','clinic-format':'formatA','clinic-field':'forestterrain','clinic-aura':''},sent=[],writes={};
 const app={send:request=>sent.push(JSON.parse(request.slice(request.indexOf(' ')+1))),rooms:{'':{customCalculator() {}},calculator:{}}};
 const room={$:selector=>({val:() => inputs[selector.match(/name=([^\]]+)/)?.[1]],text(value) {writes[selector]=value;return this;},html(value) {writes[selector]=value;return this;},empty() {writes[selector]='';return this;}})};
 for(const name of ['readClinicContext','clinicEdited','checkClinic','receiveRules','renderClinic','clinicCalculator']) room[name]=new Function('app','esc','return '+method(name))(app,String);
 const result={checked:true,errors:[],format:'formatA',proposals:[],sets:[{name:'Mew',calculatorSet:{species:'Mew'},interactions:[]}],checks:[]};
 return {room,inputs,sent,writes,app,reply(index=0,data=result) {room.receiveRules({action:'clinic',requestId:sent[index].requestId,data});}};
}
describe('Team clinic request snapshots', () => {
 for(const field of ['team','format','field','aura'])it('rejects a reply after changing '+field+' before receipt',()=>{const h=clinic();h.room.checkClinic();h.inputs['clinic-'+field]='changed';h.reply();assert.equal(h.room.clinicResult,null);h.room.clinicCalculator('0');assert.equal(h.app.pendingCalculatorSet,undefined);});
 it('rejects out-of-order repeated checks and only accepts the newest request',()=>{const h=clinic();h.room.checkClinic();h.room.checkClinic();h.reply(0);assert.equal(h.room.clinicResult,null);h.reply(1);h.room.clinicCalculator('0');assert.equal(h.app.pendingCalculatorSet.set.species,'Mew');assert.equal(h.room.clinicContext.format,'formatA');});
 it('invalidates accepted output immediately on an input event',()=>{const h=clinic();h.room.checkClinic();h.reply();h.room.clinicEdited();assert.equal(h.room.clinicContext,null);assert.equal(h.room.clinicResult,null);assert.equal(h.writes['.clinic-results'],'');});
 it('rejects a format-only edit after the reply even without an input event',()=>{const h=clinic();h.room.checkClinic();h.reply();h.inputs['clinic-format']='formatB';h.room.clinicCalculator('0');assert.equal(h.app.pendingCalculatorSet,undefined);});
 it('discards superseded errors while showing correlated current errors',()=>{const h=clinic();h.room.checkClinic();h.room.checkClinic();const message='current validation failed';h.room.receiveRules({action:'clinic',requestId:h.sent[0].requestId,error:'old error'});assert.notEqual(h.writes['.rules-status'],'old error');h.room.receiveRules({action:'clinic',requestId:h.sent[1].requestId,error:message});assert.equal(h.writes['.rules-status'],message);});
});
describe('Calculator swap screens and fixed side conditions',()=>{
 it('clears actual screens on both sides while preserving other conditions through repeated swaps',()=>{
  const sides=[['reflect','tailwind','safeguard'],['lightscreen','auroraveil','mist']],actors=[{species:'Mew',moves:['Psychic']},{species:'Pikachu',moves:['Thunderbolt']}];let status='';
  const room={readActor:i=>actors[i],validateActorImport() {},writeActor(i,a) {actors[i]=a;},scenarioEdited() {},$:selector=>({length:selector==='.calc-side-controls'?1:0,val() {return this;},prop(key,value) {if(selector.includes('.calc-side-controls')&&key==='checked'&&!value)for(const side of sides)for(let i=side.length-1;i>=0;i--)if(['reflect','lightscreen','auroraveil'].includes(side[i]))side.splice(i,1);return this;},text(v) {status=v;return this;},map(fn) {const i=Number(selector.match(/data-side=(\d)/)?.[1]);return {get:()=>Number.isInteger(i)?sides[i].slice():[]};},each() {}})};
  room.swapCalcActors=new Function('return '+method('swapCalcActors'))();room.scenario=new Function('scenario','return '+method('scenario','sideConditions'))(()=>({actors}));
  for(let i=0;i<2;i++){room.swapCalcActors();assert.deepEqual(room.scenario().sideConditions,[['tailwind','safeguard'],['mist']]);assert.match(status,/Screens cleared on both sides; other side conditions stay on their field sides/);}
  assert.equal(actors[0].species,'Mew');
 });
});
