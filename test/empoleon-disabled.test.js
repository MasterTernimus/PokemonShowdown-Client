'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path'), vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
for (const file of ['search-index', 'teambuilder-tables', 'aliases', 'typechart']) {
	const data = {exports: {}};
	vm.runInNewContext(fs.readFileSync(path.join(root, 'data', file + '.js'), 'utf8'), data);
	Object.assign(context, data.exports);
}
vm.runInContext(fs.readFileSync(path.join(root, 'js/battle-dex-search.js'), 'utf8') + '\nwindow.TestSearch = DexSearch;', context);
const {Dex, TestSearch: Search} = context;
describe('Disabled Mega Empoleon X', function () {
	this.timeout(15000);
	it('hides X in searches and form menus while retaining normal Empoleon and Y', () => {
		for (const query of ['', 'empoleon', 'Empoleon-Mega-X', 'empoleonmegax', '-custom']) {
			const search = new Search('pokemon', 'gen9nationaldex', '');
			search.pickerOptions = {hideMegas: false, hideGimmicks: false};
			search.find(query);
			assert(!search.results.some(row => row[0] === 'pokemon' && row[1] === 'empoleonmegax'));
			search.toggleSort('spe'); search.find(query);
			assert(!search.results.some(row => row[0] === 'pokemon' && row[1] === 'empoleonmegax'));
		}
		assert(Dex.species.get('Empoleon-Mega-X').exists);
		assert(Dex.isSpeciesHidden('Empoleon-Mega-X'));
		assert(!Dex.isSpeciesHidden('Empoleon'));
		assert(!Dex.isSpeciesHidden('Empoleon-Mega-Y'));
		assert(!context.getCustomCosmeticFormes(Dex.species.get('Empoleon')).includes('Empoleon-Mega-X'));
	});
	it('hides Empoleonite X while keeping Empoleonite Y selectable', () => {
		for (const query of ['', 'empoleonite', 'Empoleonite X']) {
			const search = new Search('item', 'gen9nationaldex', '');
			search.find(query);
			assert(!search.results.some(row => row[0] === 'item' && row[1] === 'empoleonitex'));
		}
		const search = new Search('item', 'gen9nationaldex', '');
		search.find('Empoleonite Y');
		assert(search.results.some(row => row[0] === 'item' && row[1] === 'empoleonitey'));
	});
});
