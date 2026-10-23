'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const {assignment} = require('./helpers/source-functions');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
function harness() {
 const set = {species:'Charizard',item:'Leftovers',moves:['Flamethrower'],ivs:{spe:0}}, other = {species:'Mew',moves:['Psychic']};
 const summary={tag:'summary',focused:0,focus(options) {this.focused++;this.options=options;}};
 const panel={open:false,index:0,summary,removed:0};summary.panel=panel;
 const button={panel}; const saved={builds:[{id:'one',set:JSON.parse(JSON.stringify(set))}]};
 function $(node) {
  const list = Array.isArray(node) ? node : node ? [node] : [];
  return {0:list[0],length:list.length,closest(selector) {
   if(selector==='.set-tools-panel')return $(node.panel || (node===panel?panel:null));
   if(selector==='li[value]')return $({value:node.index || node.panel && node.panel.index || 0});
   if(selector==='details')return $(node.nested || node.panel || (node===panel?panel:null));
   return $(node.nestedControl?node:null);
  },attr(name) {return node[name];},parent() {return $(node.panel);},find() {return {remove() {panel.removed++;}};},children() {return $(node.summary);}};
 }
 const room={curSet:set,curSetLoc:0,curSetList:[set,other],curTeam:{format:'gen9ou'},openSetTools:new WeakMap(),profileAddition:null,el:{contains:n=>n===panel},$:()=>$(panel),updates:0,update() {this.updates++;},saved};
 for(const name of ['toggleSetTools','setToolsKeydown','closeSetTools','toolsSetIndex'])room[name]=new Function('$','return '+assignment(source,'proto.'+name))($);
 const event=(target=button,extra={})=>Object.assign({key:'Escape',target,currentTarget:panel,prevented:0,stopped:0,preventDefault() {this.prevented++;},stopPropagation() {this.stopped++;}},extra);
 return {room,set,other,panel,summary,button,saved,$,event,open() {room.toggleSetTools(event(summary,{currentTarget:summary}));}};
}
describe('Saved set and form panel dismissal',()=>{
 it('renders a visible named close button alongside the screenshot controls',()=>{
  const render=assignment(source,'proto.renderSet','set-tools-content');
  const room={toolsData:()=>({builds:[]}),curTeam:{format:'gen9ou',dex:{}},openSetTools:new WeakMap()};
  const fn=new Function('renderSet','T','escape','button','return '+render)(()=>'<li></li>',{id:s=>s},s=>s,()=> '');
  const html=fn.call(room,{species:'Charizard'},0);
  assert.match(html,/<button type="button"[^>]+name="closeSetTools" value="0" aria-label="Close saved set and form tools">Close <span aria-hidden="true">&times;<\/span><\/button>/);
  assert(html.indexOf('close-set-tools') < html.indexOf('Saved set</span>'));
 });
 it('repeatedly opens and closes only this panel, preserving Pokemon and saved builds',()=>{
  const h=harness(),before=JSON.stringify([h.room.curSetList,h.saved]);h.room.openSetTools.set(h.other,true);
  for(let i=0;i<3;i++){h.open();assert(h.panel.open);assert(h.room.openSetTools.has(h.set));h.room.closeSetTools(0,h.button);assert(!h.panel.open);assert(!h.room.openSetTools.has(h.set));assert(h.room.openSetTools.has(h.other));}
  assert.equal(JSON.stringify([h.room.curSetList,h.saved]),before);assert.equal(h.summary.focused,3);assert.deepEqual(h.summary.options,{preventScroll:true});assert.equal(h.room.updates,0);
 });
 it('lets the summary close the panel and restores its focus',()=>{const h=harness();h.open();h.open();assert(!h.panel.open);assert.equal(h.summary.focused,1);});
 it('Escape from panel buttons closes the panel and consumes only that event',()=>{const h=harness();h.open();const e=h.event();h.room.setToolsKeydown(e);assert(!h.panel.open);assert.equal(e.prevented,1);assert.equal(e.stopped,1);assert.equal(h.summary.focused,1);});
 for(const reason of ['native control','nested details','already handled','composing','other key','other panel','closed panel'])it('leaves Escape alone for '+reason,()=>{
  const h=harness();h.open();const target={panel:h.panel},e=h.event(target);
  if(reason==='native control')target.nestedControl=true;
  if(reason==='nested details')target.nested={};
  if(reason==='already handled')e.isDefaultPrevented=()=>true;
  if(reason==='composing')e.isComposing=true;
  if(reason==='other key')e.key='Enter';
  if(reason==='other panel')e.currentTarget={open:true};
  if(reason==='closed panel')h.panel.open=false;
  h.room.setToolsKeydown(e);assert.equal(e.prevented,0);assert.equal(e.stopped,0);assert.equal(h.summary.focused,0);assert.equal(h.panel.open,reason!=='closed panel');
 });
 it('discards this set pending preview response without reopening or repainting after close',()=>{
  const h=harness();let reply;
  h.room.requestTeamTools=(request,callback)=>{reply=callback;};
  h.room.loadFormPreviews=new Function('T','Storage','return '+assignment(source,'proto.loadFormPreviews'))({previewKey:()=> 'same',clone:v=>JSON.parse(JSON.stringify(v))},{packTeam:JSON.stringify});
  h.open();h.room.loadFormPreviews(0);assert.equal(h.room.updates,1);assert(h.room.formPreview);
  h.room.closeSetTools(0,h.button);assert.equal(h.room.formPreview,null);
  reply({options:[{id:'charizardmegax'}],note:'late'});assert.equal(h.room.updates,1);assert(!h.panel.open);assert(!h.room.openSetTools.has(h.set));
 });
 it('preserves completed previews and another Pokemon pending state',()=>{
  const h=harness();h.open();const preview={set:h.set,options:[{id:'mega'}],local:true};h.room.formPreview=preview;h.room.profileAddition={set:h.other};h.room.closeSetTools(0,h.button);assert.equal(h.room.formPreview,preview);assert.equal(h.room.profileAddition.set,h.other);
 });
 it('keeps the close control in normal flow with a touch target at small widths',()=>{
  const css=fs.readFileSync('play.pokemonshowdown.com/style/client.css','utf8');assert.match(css,/\.set-tools-panel \.set-tools-header\s*\{[^}]*display:flex;[^}]*justify-content:flex-end/);assert.match(css,/@media \(max-width:639px\) \{ \.set-tools-panel \.close-set-tools \{ min-height:44px; min-width:44px;/);
 });
});
