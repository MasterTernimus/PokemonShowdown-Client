'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Lycanroc and Qwilfish client parity',()=>{
 for(const id of ['keenhunt','bloodchallenge','spinyhide'])it(id+' shows the current effects',()=>{
  const expected=require('../server-data-sync-manifest.json').snapshot.abilities[id];
  const actual=Dex.abilities.get(id),raw=require('../play.pokemonshowdown.com/data/abilities').BattleAbilities[id];
  assert(actual.exists);for(const key of ['desc','shortDesc']){assert.equal(actual[key],expected[key]);assert.equal(raw[key],expected[key]);}
 });
 it('Qwilfish has Spiny Hide, without Toxic Debris or changes to the Hisui line',()=>{
  assert.deepEqual(Dex.species.get('qwilfish').passives,['spinyhide']);
  assert.deepEqual(require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex.qwilfish.passives,['spinyhide']);
  const effects=Dex.getAbilityEffects('spinyhide');assert(effects.has('roughskin'));assert(effects.has('poisonpoint'));assert(!effects.has('toxicdebris'));
  assert.deepEqual(Dex.species.get('qwilfishhisui').passives,[]);assert.deepEqual(Dex.species.get('overqwil').passives,['aftermath']);
 });
});
