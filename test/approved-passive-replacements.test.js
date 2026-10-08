'use strict';
const assert=require('assert').strict;
require('./battle.test');
const replacements=require('./fixtures/approved-passive-replacements.json');
const before=require('./fixtures/passive-overlap-before.json');
describe('Approved passive slots and field move UI',()=>{
 for(const r of replacements)it(r.id+' preserves passive and other slots after '+r.after,()=>{
  const old=before.find(s=>s.id===r.id),species=Dex.species.get(r.id),expected=Object.fromEntries(old.slots.map(s=>[s.slot,s.name]));
  expected[r.slot]=r.after;if(r.id==='butterfree')expected[0]='Gentle Scales';assert.deepEqual(species.abilities,expected);assert.deepEqual(species.passives,r.id === 'butterfree' ? ['shielddust'] : old.passives);
 });
 it('describes only Aura creation and the updated Neutralization counterplay',()=>{
  const moves=require('../server-data-sync-manifest.json').snapshot.moves;
  for(const id of ['iondeluge','plasmafists']){assert.match(moves[id].desc,/Electric Aura for 3 turns, or 5 with Amplifield Rock/);assert.match(moves[id].desc,/cannot promote/);assert(!/sets Electric Terrain/.test(moves[id].desc));}
  const a=Dex.abilities.get('neutralization');assert.match(a.desc,/single-target damaging move/);assert.match(a.desc,/can be established afterward/);assert(!a.desc.includes('cannot start'));
 });
 it('keeps all 76 family rows and exactly 34 Proficient records',()=>{
  const snapshot=require('../server-data-sync-manifest.json').snapshot.species;
  const canonical=id=>({emboaralt:'emboarreborn',emboarmegaalt:'emboarmegareborn'}[id]||id);
  const rows=Object.entries(snapshot).filter(([,s])=>s.passives.some(p=>['overgrow','blaze','torrent','proficient'].includes(p)));
  assert.equal(new Set(rows.map(([id])=>canonical(id))).size,76);
  assert.equal(new Set(rows.filter(([,s])=>s.passives.includes('proficient')).map(([id])=>canonical(id))).size,34);
 });
});
