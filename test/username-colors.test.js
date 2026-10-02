const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-log.js'), 'utf8');
function load(window = {}) {
 return new Function('window', 'Config', 'MD5', source + '\nreturn BattleLog;')(window, {customcolors: {}, routes: {}}, () => '0123456789abcdef0123456789abcdef');
}
function luminance(hex) {
 return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[0.2126,0.7152,0.0722][i],0);
}
describe('Shared username color rendering',()=>{
 it('keeps extreme and saturated selections readable on both supported theme surfaces',()=>{
  const log=load();
  for(const color of ['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#148a99','#888888'])for(const dark of [false,true]){
   const output=log.readableUsernameColor(color,dark),a=luminance(output),b=luminance(dark?'#303e40':'#eef2ef');
   assert((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)>=4.5,color+' '+dark+' '+output);
  }
 });
 it('uses live CSS variables without changing standalone replay defaults or unsafe identifiers',()=>{
  const watched=[];const live=load({app:{watchUsernameColor:id=>watched.push(id)}});const historical=load();
  assert(live.usernameColor('alice').startsWith('var(--username-alice,'));assert.deepEqual(watched,['alice']);
  assert(/^#[0-9a-f]{6}$/.test(historical.usernameColor('alice')));
  assert(!live.usernameColor('bad;name').startsWith('var('));
 });
});
