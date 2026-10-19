'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const {BattlePokemonSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {BattlePokemonSearch};')();
describe('Approved dancer Own Tempo UI metadata', () => {
 for (const id of ['ludicolo','oricorio','oricoriopompom','oricoriopau','oricoriosensu','quaquaval','lilligant','lilliganthisui','bellossom','meloetta','meloettapirouette']) it(id + ' exposes only its exact form passives', () => {
  const s = Dex.species.get(id); assert.deepEqual(s.passives, id.startsWith('meloetta') ? ['serenegrace'] : id === 'quaquaval' ? ['torrent'] : ['owntempo']);
  assert.equal(!!BattlePokemonSearch.prototype.filter.call({dex: Dex}, ['pokemon',id], [['ability','owntempo']]), id !== 'quaquaval' && !id.startsWith('meloetta'));
 });
 it('publishes Rain Dish and retained Dancer/Hospitality without a ward', () => {
  assert.equal(Dex.species.get('ludicolo').abilities.H, 'Rain Dish');
  const a = Dex.abilities.get('nobledance'); assert.match(a.desc, /Dancer and Hospitality/); assert.match(a.desc, /Does not grant a defensive ward/);
 });
 it('Noble Dance retains Dancer and Hospitality without selected Own Tempo', () => {
  assert.deepEqual(Dex.getAbilityDisplayComponents('nobledance', Dex, ['owntempo']), ['dancer','hospitality']);
  assert(!Dex.getAbilityEffects('nobledance').has('owntempo'));
  assert(!Dex.abilities.get('nobledance').desc.includes('confusion'));
 });
 it('describes the approved repeatable Anchored Battery reward without a suction component', () => {
  const a = Dex.abilities.get('anchoredbattery'); assert.match(a.desc, /After each such attack/); assert.match(a.desc, /foe whose HP it damaged/); assert.match(a.desc, /Substitute-only/);
  assert.deepEqual(Dex.getAbilityDisplayComponents('anchoredbattery', Dex, ['suctioncups']), ['megalauncher']);
 });
});
