'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Shed Skin visual cleanup',()=>{
 for(const count of [0,1,2,3])for(const silent of [false,true])it('clears perish '+count+' and other condition indicators; silent='+silent,()=>{
  const log=['|init|battle','|gen|9','|gametype|singles','|start','|switch|p1a: Mew|Mew|100/100',
   '|-start|p1a: Mew|Curse','|-start|p1a: Mew|move: Leech Seed','|-start|p1a: Mew|Nightmare','|-start|p1a: Mew|move: Yawn','|-start|p1a: Mew|perish'+count,'|turn|1',
   '|-activate|p1a: Mew|ability: Shed Skin',...['Curse','Leech Seed','Nightmare','Yawn','Perish Song'].map(n=>'|-end|p1a: Mew|move: '+n+(silent?'|[silent]':''))];
  const battle=new Battle({debug:true,log});try{for(let i=0;i<2;i++){battle.seekTurn(Infinity);const p=battle.p1.active[0];for(const id of ['curse','leechseed','nightmare','yawn','perishsong','perish0','perish1','perish2','perish3'])assert(!p.volatiles[id],id);battle.seekTurn(0);}}finally{battle.destroy();}
 });
});
