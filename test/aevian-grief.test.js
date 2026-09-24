'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');

global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex.js').BattlePokedex;
global.BattleAbilities = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
global.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables.js').BattleTeambuilderTable;
for (let gen = 1; gen <= 9; gen++) {
	const table = BattleTeambuilderTable['gen' + gen] = BattleTeambuilderTable.gen9natdex;
	for (const key of ['overrideAbilityData', 'overrideItemDesc', 'overrideMoveData', 'overrideSpeciesData', 'overrideTypeChart', 'removeType']) {
		table[key] ||= {};
	}
}
require('../play.pokemonshowdown.com/js/battle-dex-data.js');
require('../play.pokemonshowdown.com/js/battle-dex.js');
vm.runInThisContext(fs.readFileSync(require.resolve('../play.pokemonshowdown.com/js/battle-dex-search.js'), 'utf8'));

describe('Aevian Grief move picker', () => {
	const movesFor = (species, ability) => {
		const search = new BattleMoveSearch('move', 'gen9nofieldsinglesgame', {species, ability, moves: []});
		return search.getBaseResults().filter(row => row[0] === 'move').map(row => row[1]);
	};

	it('shows only the 72 allowed moves for Aevian Grief', () => {
		const moves = movesFor('Sigilyph', 'Aevian Grief');
		assert.equal(moves.length, 72);
		for (const id of ['frustration', 'moonblast', 'shadowball']) assert(moves.includes(id));
		for (const id of ['protect', 'quiverdance', 'uturn']) assert(!moves.includes(id));
		assert.deepEqual(movesFor('Sigilyph-Rejuv', 'Aevian Grief'), moves);
		const search = new BattleMoveSearch('move', 'gen9nofieldsinglesgame', {
			species: 'Sigilyph', ability: 'Aevian Grief', moves: [],
		});
		assert.equal(search.canLearn('sigilyph', 'frustration'), true);
		assert.equal(search.canLearn('sigilyph', 'protect'), false);
	});

	it('keeps the normal Sigilyph pool under other abilities', () => {
		const moves = movesFor('Sigilyph', 'Magic Guard');
		assert(moves.includes('protect'));
		assert(moves.includes('aircutter'));
	});
});
