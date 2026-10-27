const assert = require('assert').strict;
describe('Readable exclusive move groups', () => {
	const context = require('./helpers/exclusive-move-picker.cjs')();
	const {Dex, MoveSearch} = context;
	for (const [species, ability, move, label] of [
		['Politoed', 'Aevian King', 'dragoncheer', 'Evolution'],
		['Poliwrath', 'Aevian Ascendance', 'healbell', 'Lv. 18'],
		['Galvantula', 'Aevian Web', 'rockslide', 'TM / tutor'],
	]) it(`${ability}: short headings, per-move sources, unchanged selection`, () => {
		const typedSearch = new MoveSearch('move', 'gen9nofieldsinglesgame', {species, ability, moves: []});
		const rows = typedSearch.getBaseResults();
		assert(!rows.some(row => row[0] === 'html' && row[1].includes('aevian-king-sources')));
		assert(rows.some(row => row[0] === 'header' && row[1] === 'Level-up & evolution'));
		assert.equal(typedSearch.getExclusiveMoveSource(move), label);
		const rendered = Object.create(context.BattleSearch.prototype);
		rendered.engine = {typedSearch, dex: Dex};
		const html = rendered.renderMoveRow(Dex.moves.get(move), 0, 0);
		assert(html.includes(`data-entry="move|${Dex.moves.get(move).name}"`));
		assert(html.includes(`<small class="move-source">${label}</small>`));
		assert(html.includes(Dex.moves.get(move).shortDesc));
		assert.equal(rows.filter(row => row[0] === 'move' && row[1] === move).length, 1);
	});
	it('clears exclusive labels for another ability, ordinary moves, other species and older generations', () => {
		for (const [species, ability, format, move] of [
			['Politoed', 'Drizzle', 'gen9nofieldsinglesgame', 'dragoncheer'],
			['Politoed', 'Aevian King', 'gen9nofieldsinglesgame', 'round'],
			['Mew', 'Aevian King', 'gen9nofieldsinglesgame', 'dragoncheer'],
			['Politoed', 'Aevian King', 'gen8ou', 'dragoncheer'],
		]) assert.equal(new MoveSearch('move', format, {species, ability, moves: []}).getExclusiveMoveSource(move), '');
	});
});
