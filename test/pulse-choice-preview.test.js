'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-choices.js'), 'utf8'), context);
const ChoiceBuilder = vm.runInContext('BattleChoiceBuilder', context);

describe('Pulse choices in the modern battle client', () => {
	it('toggles the displayed moves without changing the request and resolves the selected Pulse target', () => {
		const moves = [{name: 'Poison Jab', id: 'poisonjab', target: 'normal', pp: 20, maxpp: 20}];
		const pulseMoves = [{name: 'Sludge Wave', id: 'sludgewave', target: 'allAdjacent', pp: 16, maxpp: 16}];
		const request = {requestType: 'move', rqid: 1, active: [{moves, pulseMoves, canMegaEvo: true}], side: {pokemon: []}};
		const choices = new ChoiceBuilder(request);
		assert.equal(choices.currentMoveRequest().moves, moves);
		choices.current.mega = true;
		assert.equal(choices.currentMoveRequest().moves, pulseMoves);
		assert.equal(request.active[0].moves, moves);
		const choice = choices.parseChoice('move sludgewave mega');
		assert.equal(choice.move, 1);
		assert.equal(choices.getChosenMove(choice, 0).target, 'allAdjacent');
		choices.current.mega = false;
		assert.equal(choices.currentMoveRequest().moves, moves);
	});
});
