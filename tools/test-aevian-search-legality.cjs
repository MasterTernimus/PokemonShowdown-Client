'use strict';
require('./test-aevian-legality.cjs');
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const searchPath = path.resolve(__dirname, '../play.pokemonshowdown.com/js/battle-dex-search.js');
vm.runInThisContext(fs.readFileSync(searchPath, 'utf8') + '\nglobal.AevianAuditSearch = BattlePokemonSearch;');
const names = ['Arcanine-Aevian', 'Glalie-Aevian', 'Roserade-Aevian', 'Froslass-Aevian',
  'Kommo-o-Aevian', 'Froslass-Aevian-Mega', 'Musharna'];
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
