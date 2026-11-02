const assert = require('assert').strict;
describe('Readable exclusive move groups', () => {
	const context = require('./helpers/exclusive-move-picker.cjs')();
	const {Dex, MoveSearch} = context;
	for (const [species, ability, move] of [
		['Politoed-Rejuv', 'Aevian King', 'dragoncheer', 'Evolution'],
		['Poliwrath-Rejuv', 'Aevian Ascendance', 'healbell', 'Lv. 18'],
		['Galvantula-Rejuv', 'Aevian Web', 'rockslide', 'TM / tutor'],
	]) it(`${ability}: shows selectable moves without source labels`, () => {
		const typedSearch = new MoveSearch('move', 'gen9nofieldsinglesgame', {species, ability, moves: []});
		const rows = typedSearch.getBaseResults();
		assert(!rows.some(row => row[0] === 'html' && row[1].includes('aevian-king-sources')));
		assert(!rows.some(row => row[0] === 'header' && ['Level-up & evolution', 'TM & tutor'].includes(row[1])));
		const rendered = Object.create(context.BattleSearch.prototype);
		rendered.engine = {typedSearch, dex: Dex};
		const html = rendered.renderMoveRow(Dex.moves.get(move), 0, 0);
		assert(html.includes(`data-entry="move|${Dex.moves.get(move).name}"`));
		assert(!html.includes('move-source'));
		assert(html.includes(Dex.moves.get(move).shortDesc));
		assert.equal(rows.filter(row => row[0] === 'move' && row[1] === move).length, 1);
	});
});
