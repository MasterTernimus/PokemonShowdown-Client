const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const {measureImage} = require('../build-tools/sprite-image-metrics.cjs');
const {Dex} = require('./helpers/exclusive-move-picker.cjs')();

describe('Void Mega Gardevoir visible height', () => {
	it('uses the Mega size class for Void Gardevoir in preview', () => {
		assert.equal(Dex.species.get('Gardevoir-Void-Mega').isMega, true);
		assert.equal(Dex.species.get('Gardevoir-Void').isMega, false);
	});
	function paintedHeight(species, front, options) {
		const sprite = Dex.getSpriteData(species, front, options);
		const asset = sprite.url.split('/sprites/')[1].split('?')[0];
		const size = measureImage(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', asset)));
		return sprite.h * size[5] / size[1];
	}
	for (const front of [true, false]) for (const shiny of [true, false]) for (const teamPreview of [true, false]) {
		it(`matches the regular form for front=${front}, shiny=${shiny}, preview=${teamPreview}`, () => {
			const options = {gen: 9, shiny, teamPreview, noScale: teamPreview};
			const regular = paintedHeight('Gardevoir-Mega', front, options);
			const other = paintedHeight('Gardevoir-Void-Mega', front, options);
			assert(Math.abs(regular - other) <= 1, `${regular} versus ${other}`);
		});
	}
});
