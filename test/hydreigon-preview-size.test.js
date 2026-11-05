'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Hydreigon preview proportions', () => {
	const {Dex} = loadDex();
	for (const front of [false, true]) it(`keeps the ${front ? 'front' : 'back'} BW animation at native size`, () => {
		Dex.prefs = () => false;
		const sprite = Dex.getSpriteData('Hydreigon', front, {gen: 9, noScale: true, teamPreview: true});
		assert(sprite.url.includes(`/gen5ani${front ? '' : '-back'}/hydreigon.gif`));
		assert.deepEqual([sprite.w, sprite.h], front ? [90, 108] : [82, 112]);
		assert(sprite.pixelated);
	});
	it('preserves custom shiny and no-animation preview sizing', () => {
		for (const noanim of [false, true]) for (const front of [false, true]) {
			Dex.prefs = key => noanim && key === 'noanim';
			const sprite = Dex.getSpriteData('Hydreigon', front, {gen: 9, shiny: true, noScale: true, teamPreview: true});
			assert(sprite.url.includes(`/gen5${front ? '' : '-back'}-shiny/hydreigon.png`));
			assert.deepEqual([sprite.w, sprite.h], [96, 96]);
		}
	});
});
