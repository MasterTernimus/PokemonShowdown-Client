'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const {BattlePokemonSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {BattlePokemonSearch};')();
describe('Additional passive groups UI and search', () => {
 const groups = {liquidooze: ['grimer','muk'], stickyhold: ['grimeralola','mukalola','trubbish','garbodor'], soundproof: ['whismur','loudred','exploud'], suctioncups: ['octillery','inkay','malamar','grapploct']};
 for (const [passive, ids] of Object.entries(groups)) for (const id of ids) it(id + ' exposes and finds passive ' + passive, () => {
  const s = Dex.species.get(id); assert.deepEqual(s.passives, [passive]);
  assert(BattlePokemonSearch.prototype.filter.call({dex: Dex}, ['pokemon',id], [['ability',passive]]));
 });
 it('publishes exactly the four ordinary replacements', () => {
  for (const [id,slot,name] of [['grimer','1','Poison Point'],['trubbish','1','Pickup'],['whismur','0','Scrappy'],['loudred','0','Rattled']]) assert.equal(Dex.species.get(id).abilities[slot], name);
 });
 it('keeps exclusive components separate and retains Mega Launcher and Conductivity effects', () => {
  assert.deepEqual(Dex.getAbilityDisplayComponents('anchoredbattery', Dex, ['suctioncups']), ['megalauncher']);
  assert(!Dex.getAbilityEffects('anchoredbattery').has('suctioncups')); assert(!Dex.getAbilityEffects('conductivity').has('soundproof'));
  assert.match(Dex.abilities.get('anchoredbattery').desc, /1.5x power/); assert.match(Dex.abilities.get('conductivity').desc, /Steel-type/);
 });
});
