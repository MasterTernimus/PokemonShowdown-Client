'use strict';
const assert=require('assert').strict,loadDex=require('./helpers/isolated-dex.cjs');
describe('November 16 local roster and ability parity',()=>{
 const {Dex}=loadDex();
 it('exports the approved species slots and passives',()=>{
  for(const [id,slot,name] of [['meganium','0','Hospitality'],['meganium','1','Verdant Awakening'],['beedrill','0','Swarm'],['clefable','0','Void Promise'],['clefable','H','Unaware'],['gengar','H','Bad Dreams'],['hydreigon','H','Mold Breaker'],['venomoth','1','Psychic Surge']])assert.equal(Dex.species.get(id).abilities[slot],name,id);
  for(const id of ['tauros','taurospaldeacombat','taurospaldeablaze','taurospaldeaaqua'])assert.equal(Dex.species.get(id).abilities[0],'Intimidate');
  assert.deepEqual([...Dex.species.get('garchomp').passives],['roughskin']);
  assert.deepEqual([...Dex.species.get('garchompbattlebond').passives],['serratedscales']);
  assert.deepEqual([...Dex.species.get('arbokmegay').types],['Poison']);
 });
 it('shows exact components and preserves old-name lookup',()=>{
  assert.equal(Dex.abilities.get('Moon Veil').id,'voidpromise');
  assert.equal(Dex.abilities.get('Bloom Shelter').id,'verdanthospitality');
  const expected={primalego:['ultraego','hospitality'],verdanthospitality:['friendguard','naturalcure'],waterbarrage:['dualwield','shellarmor'],siegelauncher:['megalauncher','dualwield','stalwart'],fortressshell:['stalwart','guardianpresence'],prismscale:['friendguard','swiftswim'],pyrousdominion:['eartheater','limber']};
  for(const [id,parts] of Object.entries(expected))assert.deepEqual([...Dex.getAbilityDisplayComponents(id)],parts,id);
  assert(!Dex.getAbilityEffects('primalego').has('unaware'));
  assert(!Dex.getAbilityEffects('infernaldominion').has('fireward'));
  assert(!Dex.getAbilityEffects('hellfireeclipse').has('intimidate'));
 });
 it('describes the approved damage and Aura rules',()=>{
  for(const id of ['filter','solidrock']){assert.match(Dex.abilities.get(id).desc,/10% less/);assert.match(Dex.abilities.get(id).desc,/32.5%/);}
  assert.match(Dex.abilities.get('shadowshield').desc,/half attack damage at full HP/);
  for(const id of ['ashenseeds','badseeds'])assert.match(Dex.abilities.get(id).desc,/Two successful/);
  assert.match(Dex.abilities.get('verdanthospitality').desc,/1\/8/);
 });
});
