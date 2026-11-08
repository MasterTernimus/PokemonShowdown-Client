'use strict';
const assert=require('assert').strict;
const {Dex}=require('./helpers/isolated-dex.cjs')();
describe('Echo Fiend and faint curse descriptions',()=>{
 it('shows the ordinary 1.2x sound boost and field exceptions',()=>{const a=Dex.abilities.get('echofiend');assert.match(a.desc,/1\.2x/);assert.match(a.desc,/1\.5x/);assert(!/(^|[^.\d])2x/.test(a.desc));assert.match(a.shortDesc,/1\.2x/);});
 for(const id of ['cursedbody','mourningsnow'])it(id+' explains the two weaker curse ticks',()=>{assert.match(Dex.abilities.get(id).desc,/two end-of-turn ticks of 1\/8 max HP each/);});
});
