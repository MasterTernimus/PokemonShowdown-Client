'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const picker = require('./helpers/exclusive-move-picker.cjs')();
const DexSearch = vm.runInContext('DexSearch', picker);
const set = {species: 'Meganium', item: 'Meganiumite', moves: ['Solar Beam']};
const move = picker.Dex.moves.get('solarbeam');
picker.preact = require('preact');
const resultsScript = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-searchresults.js'), 'utf8');
const Results = vm.runInContext(resultsScript + '\nPSSearchResults', picker);

describe('Mega signature move picker layout', () => {
	it('keeps a selected signature once and retains its keyboard slot', () => {
		const search = new DexSearch('move', 'gen9nofieldsinglesgame', set);
		const legacy = Object.create(picker.BattleSearch.prototype);
		legacy.engine = search;
		legacy.cancelRendering = legacy.updateScroll = () => {};
		search.query = null;
		legacy.find('', 'solarbeam');
		const checkRows = (rows, pinnedID) => {
			const selected = rows.filter(([kind, id]) => kind === 'move' && id.replace(/^_\d+_/, '') === 'solarbeam');
			assert.equal(selected.length, 1);
			assert.equal(selected[0][1], pinnedID);
			assert(!rows.some(([kind, id]) => kind === 'header' && id === 'Mega signature moves'));
			assert(rows.some(([kind, id]) => kind === 'move' && id === 'protect'));
		};
		checkRows(legacy.resultSet, 'solarbeam');
		search.prependResults = [['move', '_1_solarbeam'], ['move', '_2_']];
		checkRows(search.getDisplayResults(), '_1_solarbeam');
		const modern = Object.create(Results.prototype);
		modern.props = {search};
		assert.equal(modern.renderMoveRow('_1_solarbeam', 0, 0).children[0].attributes['data-entry'], 'move|Solar Beam|1');
		assert.equal(modern.renderMoveRow('_2_', 0, 0).children[0].attributes['data-entry'], 'move||2');
	});
	it('shows one short hint in both editors and keeps both effects available for the Mega Stone', () => {
		const search = new DexSearch('move', 'gen9nofieldsinglesgame', set);
		const modern = Object.create(Results.prototype);
		modern.props = {search};
		const legacy = Object.create(picker.BattleSearch.prototype);
		legacy.engine = search;
		legacy.moveDisplaySet = set;
		for (const row of [JSON.stringify(modern.renderMoveRow('solarbeam', 0, 0)), legacy.renderMoveRow(move, 0, 0)]) {
			assert(row.includes('2 Mega options'));
			assert(row.includes(move.shortDesc));
			assert(!row.includes('Mega Sol Cannon') && !row.includes('Flare Cannon'));
		}
		const options = picker.Dex.getStoneMoveOptions(set);
		assert.deepEqual(Array.from(options, option => option.move.name).sort(), ['Flare Cannon', 'Mega Sol Cannon']);
		const groups = picker.Dex.getMegaMoveDetailGroups(options);
		assert.equal(groups.length, 1);
		assert.equal(groups[0].effect, 'Fires immediately in sunlight; otherwise charges like Solar Beam.');
		assert.deepEqual(Array.from(groups[0].routes, route => route.stats).sort(), [
			'Fire · 130 BP · 100% accuracy', 'Grass · 140 BP · 100% accuracy',
		]);
		assert(groups[0].routes.every(route => route.adaptive.includes("user's Attack and Sp. Atk")));
		const bell = picker.Dex.moves.get('Passing Bell');
		const [conditional] = picker.Dex.getMegaMoveDetailGroups([{base: 'Ominous Wind', move: bell, label: bell.name}]);
		assert(conditional.effect.includes('105 power against a foe with a disabled move'));
	});
});
