'use strict';
const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();

describe('Alolan Golem passive display', () => {
	it('shows Galvanize in place of Soundproof with Rock Head replacing its selectable Galvanize slot', () => {
		const species = Dex.species.get('Golem-Alola');
		assert.deepEqual(Array.from(species.passives), ['galvanize']);
		assert.deepEqual({...species.abilities}, {0: 'Siege Magnet', 1: 'Sturdy', H: 'Rock Head'});
	});
	it('leaves ordinary Golem and the Alolan pre-evolutions unchanged', () => {
		assert.deepEqual(Array.from(Dex.species.get('Golem').passives), ['solidrock']);
		for (const name of ['Geodude-Alola', 'Graveler-Alola']) assert.deepEqual(Array.from(Dex.species.get(name).passives), []);
	});
});
