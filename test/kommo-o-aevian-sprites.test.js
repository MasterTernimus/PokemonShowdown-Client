'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {PNG} = require('pngjs');
const loadDex = require('./helpers/isolated-dex.cjs');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com/sprites');

describe('Aevian Kommo-o back artwork', () => {
	// Original Rejuvenation LAWDS 784.png: bottom row, normal left and shiny right.
	const approved = [
		'475259da2b9ed29a71ba10844af65873934b4cd28c91ddb04b4648ba5bcec9c9',
		'c3888d9e6c2f6ecbfe1f574d376a2198867d8f02073a624ef1ed113c350835cc',
	];
	for (const shiny of [false, true]) {
		it(`uses the original ${shiny ? 'shiny' : 'normal'} back in battles and team preview`, () => {
			const {Dex} = loadDex();
			const suffix = shiny ? '-shiny' : '';
			const back = PNG.sync.read(fs.readFileSync(path.join(root, `gen5-back${suffix}/kommo-o-aevian.png`)));
			const front = PNG.sync.read(fs.readFileSync(path.join(root, `gen5${suffix}/kommo-o-aevian.png`)));
			assert.equal(crypto.createHash('sha256').update(back.data).digest('hex'), approved[Number(shiny)]);
			assert(!back.data.equals(front.data), 'The back must not duplicate the front-facing pose');
			for (const gen of [5, 9]) for (const teamPreview of [false, true]) {
				const sprite = Dex.getSpriteData('Kommo-o-Aevian', false, {gen, shiny, teamPreview, noScale: teamPreview});
				assert(sprite.url.includes(`/gen5-back${suffix}/kommo-o-aevian.png?v=kommo-o-aevian-back-20261112`));
				assert.deepEqual([sprite.w, sprite.h], teamPreview ? [84, 84] : [96, 96]);
				assert.equal(sprite.pixelated, true);
				assert(Dex.getSpriteData('Kommo-o-Aevian', true, {gen, shiny, teamPreview}).url.includes(`/gen5${suffix}/`));
			}
		});
	}
});
