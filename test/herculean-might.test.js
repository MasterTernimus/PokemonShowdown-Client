'use strict';
const assert=require('assert').strict;
const {Dex}=require('./helpers/isolated-dex.cjs')();
describe('Mega Heracross client parity',()=>{
 it('shows the new ability and unchanged passive without old components',()=>{
  const s=Dex.species.get('heracrossmega'),a=Dex.abilities.get('herculeanmight');
  assert.equal(s.abilities[0],'Herculean Might');assert.deepEqual(Array.from(s.passives),['skilllink']);
  const expected=require('../server-data-sync-manifest.json').snapshot.abilities.herculeanmight;
  assert.equal(a.desc,expected.desc);assert.equal(a.shortDesc,expected.shortDesc);
  for(const id of ['moldbreaker','powerdrill','skilllink'])assert(!Dex.getAbilityEffects('herculeanmight').has(id));
  assert(a.desc.includes('20%'));assert(a.desc.includes('positive Defense'));assert(!a.desc.includes('field'));
 });
 it('makes the new ability searchable',()=>{const {BattleSearchIndex}=require('../play.pokemonshowdown.com/data/search-index');assert(BattleSearchIndex.some(row=>row[0]==='herculeanmight'&&row[1]==='ability'));});
});
