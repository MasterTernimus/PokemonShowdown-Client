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
	it('asks for one target on the Fault Cleave Mega turn and preserves spread Earthquake on alternate routes', () => {
		const moves = [{name: 'Earthquake', id: 'earthquake', target: 'allAdjacent', megaTarget: 'normal', pp: 10, maxpp: 10}];
		const active = {moves, canMegaEvo: true, canMegaEvoX: true};
		const request = {requestType: 'move', active: [active, active], side: {pokemon: []}};
		for (const command of ['move 1', 'move 1 megax', 'move 1 mega']) {
			const choices = new ChoiceBuilder(request);
			assert.equal(choices.addChoice(command), null);
			if (command === 'move 1 mega') {
				assert.equal(choices.current.move, 1);
				assert.equal(choices.addChoice('move 1 mega +2'), null);
				assert.equal(choices.choices[0], 'move 1 mega +2');
			} else {
				assert.equal(choices.current.move, 0);
				assert.equal(choices.choices[0], command);
			}
		}
		assert.equal(moves[0].target, 'allAdjacent');
	});
	it('uses a chosen Mega route’s target in the classic battle controls', () => {
		context.ConsoleRoom = context.Popup = {extend: proto => {function Room() {} Room.prototype = proto; return Room;}};
		context.jQuery = () => {};
		vm.runInContext(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/client-battle.js'), 'utf8'), context);
		for (const checkbox of ['megaevo', 'megaevox', '']) {
			const room = Object.create(context.BattleRoom.prototype);
			room.choice = {choices: []};
			room.tooltips = {hideTooltip() {}};
			room.battle = {nearSide: {active: [{}, {}]}};
			room.$ = selector => [{checked: selector === 'input[name=' + checkbox + ']'}];
			room.request = {active: [{moves: [{target: 'allAdjacent', megaTarget: 'normal'}]}]};
			room.updateControlsForPlayer = () => {};
			room.endChoice = () => {};
			room.chooseMove(1, {getAttribute: () => 'allAdjacent'});
			if (checkbox === 'megaevo') {
				assert.equal(room.choice.moveTarget, 'normal');
				room.chooseMoveTarget('2');
				assert.equal(room.choice.choices[0], 'move 1 mega 2');
			} else {
				assert.equal(room.choice.type, undefined);
			}
		}
	});
});
