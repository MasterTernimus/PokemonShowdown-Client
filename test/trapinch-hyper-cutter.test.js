'use strict';
const assert=require('assert').strict;const context=require('./helpers/isolated-dex.cjs')();
describe('Trapinch approved normal ability replacement',()=>{
 it('exports Hyper Cutter while preserving other slots and Arena Trap',()=>{const p=context.Dex.species.get('Trapinch');assert.deepEqual(JSON.parse(JSON.stringify(p.abilities)),{0:'Burrow Ambush',1:'Hyper Cutter',H:'Antlion Instinct'});assert.deepEqual(Array.from(p.passives),['arenatrap']);assert(!Object.values(p.abilities).includes('Huge Power'));});
});
