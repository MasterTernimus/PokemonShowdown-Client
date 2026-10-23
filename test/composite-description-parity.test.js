const assert = require('assert').strict;
require('./battle.test');
const expected = require('./fixtures/ability-description-audit.json');
const followup = require('./fixtures/audit-followup-approved-metadata.json');

describe('Composite description client parity', () => {
 it('preserves effect-search identities independently of description wording', () => {
  const expectedEffects = require('./fixtures/ability-search-identities.json');
  for (const [id, effects] of Object.entries({...expectedEffects, ...followup.effects})) {
   assert.deepEqual([...Dex.getAbilityEffects(id)].sort(), require('./fixtures/mega-approval-overlays').effects(id,effects), id);
  }
 });
 let savedAliases;
 beforeEach(() => {savedAliases = global.BattleAliases; global.BattleAliases = {...savedAliases, shadowguard: 'Void Craft'};});
 afterEach(() => {global.BattleAliases = savedAliases;});
 it('matches all simulator summaries, installed data and manifest', () => {
  const raw = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
  const snapshot = require('../server-data-sync-manifest.json').snapshot.abilities;
  for (const [id, text] of Object.entries({...expected,...require('./fixtures/mega-approved-descriptions.json'),...require('./fixtures/selected-simplifications-descriptions.json'),...require('./fixtures/grip-pressure-descriptions.json'),...require('./fixtures/shelter-audit-descriptions.json'),...require('./fixtures/shortlist-descriptions.json'),...followup.descriptions})) for (const key of ['shortDesc', 'desc']) {
   assert.equal(Dex.abilities.get(id)[key], require('./fixtures/mega-approval-overlays').description(id,key,text[key]), id + ' hover/selector');
   assert.equal(raw[Dex.abilities.get(id).id][key], require('./fixtures/mega-approval-overlays').description(id,key,text[key]), id + ' installed');
   assert.equal(snapshot[Dex.abilities.get(id).id][key], require('./fixtures/mega-approval-overlays').description(id,key,text[key]), id + ' snapshot');
  }
 });
 it('shows approved direct passives, slots and base stats independently of generated metadata', () => {
  const raw = require('../play.pokemonshowdown.com/data/pokedex.js').BattlePokedex;
  const snapshot = require('../server-data-sync-manifest.json').snapshot.species;
  for (const [table, property] of [['passives', 'passives'], ['abilities', 'abilities'], ['stats', 'baseStats'], ['types', 'types']]) {
   for (const [id, value] of Object.entries(followup[table])) {
    assert.deepEqual(Dex.species.get(id)[property], value, id + ' Dex ' + property);
    if (property !== 'passives') assert.deepEqual(raw[id][property], value, id + ' installed ' + property);
    assert.deepEqual(snapshot[id][property], value, id + ' manifest ' + property);
   }
  }
  assert.equal(Dex.species.get('beautifly').bst, 530);
  assert(!Dex.getAbilityEffects('carrionwatch').has('unnerve'));
  assert.equal(Dex.species.get('delcatty').bst, 550);
 });
 it('resolves renamed aliases and nested identities without repeated effects', () => {
  assert.deepEqual([...Dex.getAbilityEffects('shadowguard')].sort(), [...Dex.getAbilityEffects('voidcraft')].sort());
  const effects = [...Dex.getAbilityEffects('toxicbloom')];
  for (const id of ['pollenbloom', 'thickfat']) assert.equal(effects.filter(x => x === id).length, 1);
  assert(!Dex.getAbilityEffects('verdantdrake').has('limber'));
  assert(Dex.getAbilityEffects('verdantdrake').has('infiltrator'));
  assert.deepEqual(Dex.species.get('skarmory').abilities, {"0":"Fresh Plumage","1":"Sturdy","H":"Burning Quake"});
  assert.deepEqual(Dex.species.get('espathra').abilities, {"0":"Opportunist","1":"Transfixing Gaze","H":"Speed Boost"});
  assert.deepEqual(Dex.species.get('ursaluna').abilities, {"0":"Raging Beast","1":"Bulletproof","H":"Territorial"});
  assert.deepEqual(Dex.species.get('emboar').abilities, {"0":"Controlled Fury","1":"Thick Fat","H":"Brute Force"});
  assert.deepEqual(Dex.species.get('emboaralt').abilities, {"0":"Controlled Fury","1":"Thick Fat","H":"Brute Force"});
  assert.deepEqual(Dex.species.get('salazzle').abilities, {"0":"Corrosion","1":"Venom Ignition","H":"Aroma Veil"});
  assert.deepEqual(Dex.species.get('volcarona').abilities, {"0":"Cinder Scales","1":"Overcoat","H":"Dawn Herald"});
  assert.equal(Dex.species.get('araquanid').bst, 500);
  assert.deepEqual([...Dex.getAbilityEffects('corrosiveburn')].sort(), ['corrosion', 'corrosiveburn', 'oblivious', 'venomignition']);
  assert(Dex.getAbilityEffects('aeviantoxin').has('merciless'));
  assert(Dex.getAbilityEffects('verdantdrake').has('regenerator'));
  assert(Dex.getAbilityEffects('greatmarsh').has('toxicchain'));
  assert.equal(Dex.abilities.get('fluffycraft').id,'silkensalvo');assert(!Dex.getAbilityEffects('fluffycraft').has('naturalcure'));
  assert.deepEqual([...Dex.getAbilityEffects('dawnherald')].sort(), ['dawnherald', 'drought', 'friendguard']);
 });
});
