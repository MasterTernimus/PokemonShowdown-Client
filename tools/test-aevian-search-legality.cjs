'use strict';
require('./test-aevian-legality.cjs');
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const searchPath = path.resolve(__dirname, '../play.pokemonshowdown.com/js/battle-dex-search.js');
vm.runInThisContext(fs.readFileSync(searchPath, 'utf8') + '\nglobal.AevianAuditSearch = BattlePokemonSearch; global.AevianTextSearch = DexSearch;');
const names = ['Arcanine-Aevian', 'Glalie-Aevian', 'Roserade-Aevian', 'Froslass-Aevian',
  'Kommo-o-Aevian', 'Froslass-Aevian-Mega', 'Chandelure-Aevian', 'Gyarados-Aevian', 'Musharna'];
let checks = 0;
for (const format of ['', 'gen9', 'gen9customgame', 'gen9nofieldsinglesgame', 'gen9watersurface', 'gen9doubleswatersurface', 'gen9nationaldex']) {
  const search = new AevianAuditSearch('pokemon', format);
  search.getResults();
  for (const name of names) {
    const id = Dex.species.get(name).id;
    assert(!search.illegalReasons[id], `${format || 'unrestricted'}: ${name} has a red Illegal badge`);
    assert.equal(search.baseResults.filter(row => row[0] === 'pokemon' && row[1] === id).length, 1, `${name} missing or duplicated`);
    checks++;
  }
}
console.log(`PASS: ${checks} actual search legality and duplicate-row checks.`);

Object.assign(global, require('../play.pokemonshowdown.com/data/search-index.js'));
global.BattleAliases = require('../play.pokemonshowdown.com/data/aliases.js').BattleAliases;
const expected = Object.keys(BattlePokedex).filter(id => {
  const species = Dex.species.get(id);
  return /-(Aevian|Rejuv)(-|$)/i.test(species.name) || species.name === 'Milotic-Terajuma';
});
assert(expected.length > 20, 'The regional roster must be loaded');
for (const format of ['', 'gen9nofieldsinglesgame', 'gen9nationaldex']) {
  const search = new AevianTextSearch();
  search.setType('pokemon', format);
  search.find('Aevian');
  const ids = search.results.filter(row => row[0] === 'pokemon').map(row => row[1]);
  assert.equal(ids.length, new Set(ids).size, 'Aevian search must not duplicate species');
  for (const id of expected) assert(ids.includes(id), `${format}: Aevian search omitted ${id}`);
}
console.log(`PASS: Aevian text search includes all ${expected.length} Aevian/Rejuv/Terajuma profiles without duplicates in three formats.`);
assert.deepEqual(Dex.species.get('Arcanine-Aevian').abilities,
  {0: 'Intimidate', 1: 'Storm Power', H: 'Lightning Rod'});
assert.deepEqual(Dex.species.get('Flygon').otherFormes, ['Flygon-Mega', 'Flygon-Mega-Z']);
const moveSearch = new AevianAuditSearch('pokemon', 'gen9nofieldsinglesgame');
for (const [species, move] of [['blastoise', 'electroshot'], ['clawitzer', 'electroshot'], ['appletun', 'ragepowder']]) {
  assert(!moveSearch.canLearn(species, move), `${species} must not regain removed move ${move} in search`);
}
console.log('PASS: Aevian Arcanine ability slots, Flygon Mega branches, and removed move search restrictions.');
