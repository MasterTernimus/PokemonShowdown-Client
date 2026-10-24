'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
function setup() {
 const handlers = {}, panel = {textContent:'Existing public passive help',hidden:true,style:{},getBoundingClientRect:()=>({width:100,height:40})};
 const button = {attributes:{'aria-expanded':'false'},nextElementSibling:panel,setAttribute(k,v){this.attributes[k]=v;},getBoundingClientRect:()=>({left:10,bottom:30})};
 const row = {clicks:0,click(){this.clicks++;}};
 const name = {}, outside = {}, root = {addEventListener(){},removeEventListener(){}};
 let hit = name;
 function $(node) {
  if(node===root)return {0:root,length:1,on(type,selector,fn){if(fn)handlers[type+' '+selector]=fn;return this;},off(){return this;}};
  return {closest(selector){if(selector==='.pokemon-passive-badge')return node===button?{0:button,length:1}:{length:0};if(selector==='a.pokemon-picker-row')return node===name?{0:row,length:1}:{length:0};return {length:0};}};
 }
 const host = {innerWidth:390,innerHeight:900};
 vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js','utf8'),{window:host,jQuery:$,DexSearch:class {},Dex:{},document:{elementFromPoint:()=>hit}});
 new host.BattleSearch(root,root);
 function event(originalEvent={}) {return {originalEvent,clientX:20,clientY:20,preventDefault(){this.prevented=true;},stopPropagation(){},stopImmediatePropagation(){this.stopped=true;}};}
 function pointer(type,target) {hit=target;const e=event({pointerType:type});handlers['pointerdown .pokemon-passive-badge'].call(button,e);return e;}
 function click(detail=1) {const e=event({detail});handlers['click .pokemon-passive-badge'].call(button,e);return e;}
 function escape() {const e=event();e.key='Escape';handlers['keydown .pokemon-passive-badge'].call(button,e);}
 return {row,name,button,panel,outside,pointer,click,escape};
}
describe('Native picker touch-target regression',()=>{
 it('uses the physical name row when Chromium retargets its touch click to passive help',()=>{const t=setup();t.pointer('touch',t.name);assert.equal(t.row.clicks,0,'pointerdown must not select');t.click();assert.equal(t.row.clicks,1);assert(t.panel.hidden);assert.equal(t.button.attributes['aria-expanded'],'false');});
 it('keeps repeated genuine passive-button taps independent of selection',()=>{const t=setup();for(let i=0;i<3;i++){t.pointer('touch',t.button);t.click();assert(!t.panel.hidden);t.pointer('touch',t.button);t.click();assert(t.panel.hidden);}assert.equal(t.row.clicks,0);});
 it('selects once after help is opened and closed with Escape',()=>{const t=setup();t.pointer('touch',t.button);t.click();t.escape();assert(t.panel.hidden);t.pointer('touch',t.name);t.click();assert.equal(t.row.clicks,1);assert(t.panel.hidden);});
 it('does not select on a drag start or forward stale touch state on keyboard activation',()=>{const t=setup();t.pointer('touch',t.name);assert.equal(t.row.clicks,0);t.click(0);assert.equal(t.row.clicks,0);assert(!t.panel.hidden);t.click(0);assert(t.panel.hidden);assert.equal(t.row.clicks,0);});
 it('clears a previous touch candidate before a later genuine button touch',()=>{const t=setup();t.pointer('touch',t.name);t.pointer('touch',t.button);t.click();assert.equal(t.row.clicks,0);assert(!t.panel.hidden);});
 it('does not forward mouse or out-of-row pointer targets',()=>{for(const type of ['mouse','touch']){const t=setup();t.pointer(type,type==='mouse'?t.name:t.outside);t.click();assert.equal(t.row.clicks,0);assert(!t.panel.hidden);}});
});
