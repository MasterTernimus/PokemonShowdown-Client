'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const hidden = ['mightyenamega', 'mightyenagrim', 'mightyenamegagrim'];

describe('Hidden Mightyena picker entries', () => {
 const context = require('./helpers/isolated-dex.cjs')();
 const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
 for (const file of ['search-index', 'teambuilder-tables', 'aliases', 'typechart']) {
  const data = {exports: {}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'data', file + '.js'), 'utf8'), data);
  Object.assign(context, data.exports);
 }
 vm.runInContext(fs.readFileSync(path.join(root, 'js/battle-dex-search.js'), 'utf8') + '\nwindow.TestSearch = DexSearch;', context);
 const {Dex, TestSearch: Search} = context;

 for (const options of [{}, {customOnly: true}, {hideMegas: false, hideGimmicks: false}]) {
  for (const query of ['', 'mightyena', 'Mightyena-Mega', 'Mightyena-Grim', 'Mightyena-Mega-Grim', '-custom']) {
   it('removes rows rather than showing disabled options: ' + JSON.stringify({options, query}), () => {
    const search = new Search('pokemon', 'gen9nationaldex', '');
    search.pickerOptions = options;
    search.find(query);
    const check = () => assert(!search.results.some(row => row[0] === 'pokemon' && hidden.includes(row[1])));
    check();
    search.toggleSort('spe');
    search.find(query);
    check();
   });
  }
 }
 it('preserves regular and Deso choices while keeping replay records', () => {
  const search = new Search('pokemon', 'gen9nationaldex', '');
  const rows = search.filterPokemonPicker(['mightyena', 'mightyenadeso', ...hidden].map(id => ['pokemon', id]));
  assert.deepEqual(Array.from(rows, row => row[1]), ['mightyena', 'mightyenadeso']);
  const variants = context.getCustomCosmeticFormes(Dex.species.get('Mightyena'));
  assert(variants.includes('Mightyena-Deso'));
  for (const id of hidden) {
   assert(Dex.species.get(id).exists);
   assert(Search.isHiddenCosmeticPattern(id));
   assert(!variants.some(name => context.toID(name) === id));
  }
 });
});
