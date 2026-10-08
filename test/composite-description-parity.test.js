const assert = require('assert').strict;
require('./battle.test');
const expected = require('./fixtures/ability-description-audit.json');

describe('Composite description client parity', () => {
 it('preserves effect-search identities independently of description wording', () => {
  const expectedEffects = require('./fixtures/ability-search-identities.json');
  for (const [id, effects] of Object.entries(expectedEffects)) {
   assert.deepEqual([...Dex.getAbilityEffects(id)].sort(), effects, id);
  }
 });
 let savedAliases;
 beforeEach(() => {savedAliases = global.BattleAliases; global.BattleAliases = {...savedAliases, shadowguard: 'Voidcraft'};});
 afterEach(() => {global.BattleAliases = savedAliases;});
 it('matches all simulator summaries, installed data and manifest', () => {
  const raw = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
  const snapshot = require('../server-data-sync-manifest.json').snapshot.abilities;
  for (const [id, text] of Object.entries(expected)) for (const key of ['shortDesc', 'desc']) {
   assert.equal(Dex.abilities.get(id)[key], text[key], id + ' hover/selector');
   assert.equal(raw[id][key], text[key], id + ' installed');
   assert.equal(snapshot[id][key], text[key], id + ' snapshot');
  }
 });
 it('resolves renamed aliases and nested identities without repeated effects', () => {
  assert.deepEqual([...Dex.getAbilityEffects('shadowguard')].sort(), [...Dex.getAbilityEffects('voidcraft')].sort());
  const effects = [...Dex.getAbilityEffects('toxicbloom')];
  for (const id of ['pollenbloom', 'thickfat', 'selfsufficient']) assert.equal(effects.filter(x => x === id).length, 1);
  assert(Dex.getAbilityEffects('verdantdrake').has('limber'));
  assert.deepEqual(Dex.species.get('skarmory').abilities, {"0":"Fresh Plumage","1":"Sturdy","H":"Weak Armor"});
  assert.deepEqual(Dex.species.get('espathra').abilities, {"0":"Opportunist","1":"Transfixing Gaze","H":"Speed Boost"});
  assert.deepEqual(Dex.species.get('ursaluna').abilities, {"0":"Raging Beast","1":"Bulletproof","H":"Territorial"});
  assert.deepEqual(Dex.species.get('emboar').abilities, {"0":"Stoke Belly","1":"Thick Fat","H":"Brute Force"});
  assert.deepEqual(Dex.species.get('emboaralt').abilities, {"0":"Gluttony","1":"Thick Fat","H":"Brute Force"});
  assert.deepEqual(Dex.species.get('salazzle').abilities, {"0":"Corrosion","1":"Venom Ignition","H":"Aroma Veil"});
  assert.deepEqual(Dex.species.get('volcarona').abilities, {"0":"Cinder Scales","1":"Overcoat","H":"Dawn Herald"});
  assert.equal(Dex.species.get('araquanid').bst, 500);
  assert.deepEqual([...Dex.getAbilityEffects('corrosiveburn')].sort(), ['corrosion', 'corrosiveburn', 'oblivious', 'venomignition']);
  assert(Dex.getAbilityEffects('aeviantoxin').has('merciless'));
  assert(Dex.getAbilityEffects('verdantdrake').has('regenerator'));
  assert(Dex.getAbilityEffects('greatmarsh').has('toxicchain'));
  assert(Dex.getAbilityEffects('fluffycraft').has('naturalcure'));
  assert.deepEqual([...Dex.getAbilityEffects('dawnherald')].sort(), ['dawnherald', 'drought', 'friendguard']);
 });
});
