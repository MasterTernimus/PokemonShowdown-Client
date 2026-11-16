'use strict';

const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();
const approved = require('./fixtures/current-roster-approved.json');
const expected = require('./fixtures/mega-approval-overlays');
const plain = value => JSON.parse(JSON.stringify(value));

describe('Current reviewed client roster fixture', () => {
	for (const [id, slots] of Object.entries(approved.slots)) {
		it(id + ' has its reviewed ability slots', () => {
			for (const [slot, name] of Object.entries(slots)) assert.equal(Dex.species.get(id).abilities[slot], name);
		});
	}
	for (const [id, slots] of Object.entries(approved.exactSlots)) {
		it(id + ' has exactly the reviewed choices', () => assert.deepEqual(plain(Dex.species.get(id).abilities), slots));
	}
	for (const [id, passives] of Object.entries(approved.passives)) {
		it(id + ' has its reviewed passive', () => assert.deepEqual(plain(Dex.species.get(id).passives), passives));
	}
	it('keeps the reviewed stat adjustment', () => {
		for (const [id, stats] of Object.entries(approved.stats)) assert.deepEqual(plain(Dex.species.get(id).baseStats), stats);
	});
	it('does not let one assertion mutate the shared reviewed fixture', () => {
		const before = structuredClone(approved);
		expected.passives('garchomp', []).push('invalid');
		expected.abilities('cherrim', {}).H = 'Invalid';
		assert.deepEqual(approved, before);
	});
});
