'use strict';
const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();
const snapshot = require('../server-data-sync-manifest.json').snapshot.species;
describe('Approved final stats and Gyarados distribution', () => {
 it('keeps independently requested Ursaluna spreads at 600 BST', () => {
  for (const [id, stats] of Object.entries({ursaluna:{hp:140,atk:150,def:115,spa:45,spd:100,spe:50},ursalunabloodmoon:{hp:123,atk:65,def:130,spa:135,spd:95,spe:52}})) {
   assert.deepEqual({...Dex.species.get(id).baseStats},stats,id);
   assert.deepEqual(snapshot[id].baseStats,stats,id+' manifest');
   assert.equal(Dex.species.get(id).bst,600,id);
  }
 });
 it('offers Intimidate and shares Tempest Fury passive without changing Mega selection', () => {
  assert.deepEqual({...Dex.species.get('gyarados').abilities},{0:'Unbridled Wrath',1:'Intimidate',H:'Moxie'});
  assert.deepEqual([...Dex.species.get('gyarados').passives],['tempestfury']);
  assert.deepEqual({...Dex.species.get('gyaradosmega').abilities},{0:'Unleashed Ego'});
  assert.deepEqual([...Dex.species.get('gyaradosmega').passives],['tempestfury']);
  for(const id of ['gyarados','gyaradosmega'])assert.deepEqual(snapshot[id].passives,['tempestfury']);
  assert.equal([...Dex.getAbilityEffects('tempestfury')].filter(x=>x==='angerpoint').length,1);
 });
 it('documents Skull Bash cooldown after completing the move', () => {
  assert.match(Dex.moves.get('skullbash').desc,/consecutive|next turn|another move/i);
 });
});
