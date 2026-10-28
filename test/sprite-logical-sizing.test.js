'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {measureRGBA, measureImage} = require('../build-tools/sprite-image-metrics.cjs');
const loadDex = require('./helpers/isolated-dex.cjs');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');

describe('Logical sprite sizing across the roster', function () {
	this.timeout(60000);
	it('recognizes exact enlarged pixels despite uneven transparent margins', () => {
		for (const factor of [1, 2, 3, 4]) {
			const width = 16 * factor + 7, height = 17 * factor + 5, bytes = Buffer.alloc(width * height * 4);
			for (let y = 0; y < 17 * factor; y++) for (let x = 0; x < 16 * factor; x++) {
				const offset = ((y + 3) * width + x + 2) * 4;
				bytes[offset] = (Math.floor(x / factor) * 19 + Math.floor(y / factor) * 13) % 255;
				bytes[offset + 3] = 255;
			}
			assert.deepEqual(measureRGBA(width, height, bytes), [width, height, 2, 3, 16 * factor, 17 * factor, factor]);
		}
	});
	it('ignores invisible RGB noise, but does not downsample detailed or empty artwork', () => {
		const rgba = Buffer.alloc(32 * 32 * 4, 0);
		assert.equal(measureRGBA(32, 32, rgba), null);
		for (let y = 1; y < 31; y++) for (let x = 1; x < 31; x++) {
			const p = (y * 32 + x) * 4; rgba[p] = (x + y) % 256; rgba[p + 3] = 255;
		}
		assert.equal(measureRGBA(32, 32, rgba)[6], 1);
	});
	it('matches the original BW Indeedee-F silhouette in every preview path', () => {
		const {Dex} = loadDex();
		for (const mode of ['default', 'noanim', 'nogif', 'bwgfx']) {
			Dex.prefs = key => key === mode;
			for (const shiny of [false, true]) for (const front of [false, true]) for (const noScale of [false, true]) {
				const sprite = Dex.getSpriteData('Indeedee-F', front, {gen: 9, shiny, gender: 'F', noScale, teamPreview: true});
				const metrics = measureImage(fs.readFileSync(path.join(root, 'sprites', sprite.url.split('/sprites/')[1].split('?')[0])));
				assert(Math.abs(sprite.w / metrics[0] - sprite.h / metrics[1]) < 0.02);
				assert(sprite.w * metrics[4] / metrics[0] <= 44.5);
				assert(sprite.h * metrics[5] / metrics[1] <= 52.5);
				if (!shiny) assert.deepEqual([sprite.w, sprite.h], front ? [38, 52] : [36, 51]);
			}
		}
	});
	it('keeps the custom school larger than the solitary Wishiwashi', () => {
		const {Dex} = loadDex();
		const small = Dex.getSpriteData('Wishiwashi-Sevii', true, {gen: 9, teamPreview: true});
		const school = Dex.getSpriteData('Wishiwashi-Sevii-Schooling', true, {gen: 9, teamPreview: true});
		const visibleWidth = d => {
			const m = measureImage(fs.readFileSync(path.join(root, 'sprites', d.url.split('/sprites/')[1].split('?')[0])));
			return d.w * m[4] / m[0];
		};
		assert(visibleWidth(school) > visibleWidth(small) * 1.4);
	});
	it('retains raw sizing and scales Dynamax from the corrected ordinary size', () => {
		const {Dex} = loadDex();
		for (const species of ['Indeedee-F', 'Charizard', 'Hydreigon-Mega', 'Politoed-Rejuv']) for (const front of [false, true]) {
			const ordinary = Dex.getSpriteData(species, front, {gen: 9});
			const dynamax = Dex.getSpriteData(species, front, {gen: 9, dynamax: true});
			assert(Math.abs(dynamax.w - ordinary.w * 2) <= 1);
			assert(Math.abs(dynamax.h - ordinary.h * 2) <= 1);
			assert.equal(dynamax.url, ordinary.url);
			const raw = Dex.getSpriteData(species, front, {gen: 9, noScale: true});
			const again = Dex.getSpriteData(species, front, {gen: 9});
			assert.deepEqual(again, ordinary, 'raw lookup must not corrupt cached display sizing');
			assert(raw.w >= ordinary.w && raw.h >= ordinary.h);
		}
	});
	it('contains every current form, shiny and gender variant without stretching or preview bypasses', () => {
		const context = loadDex(), {Dex, BattlePokedex} = context;
		const metricsTable = vm.runInContext('SPRITE_IMAGE_METRICS', context);
		let checks = 0;
		for (const mode of ['default', 'noanim', 'bwgfx']) {
			Dex.prefs = key => key === mode;
			for (const id of Object.keys(BattlePokedex)) {
				const species = Dex.species.get(id);
				if (!species.exists) continue;
				for (const shiny of [false, true]) for (const gender of ['M', 'F']) for (const front of [false, true]) {
					for (const preview of [false, true]) {
						const data = Dex.getSpriteData(id, front, {gen: 9, shiny, gender, teamPreview: preview, noScale: preview});
						const asset = data.url.split('/sprites/')[1].split('?')[0];
						const m = metricsTable[asset];
						assert(m, id + ': missing nonempty asset metrics ' + asset);
						assert(data.w > 0 && data.h > 0, id);
						assert(Math.abs(data.w / m[0] - data.h / m[1]) <= 1 / Math.min(m[0], m[1]), id + ': distorted aspect ratio');
						const gmax = species.name.endsWith('-Gmax'), large = species.isMega || id.includes('battlebond');
						const limit = preview ? (gmax ? 96 : large ? 88 : 80) : (gmax ? 160 : large ? 128 : 120) * (species.isTotem ? 1.5 : 1);
						assert(data.w * m[4] / m[0] <= limit + 1 && data.h * m[5] / m[1] <= limit + 1, id + ': oversized visible art');
						if (preview) {
							const normalRequest = Dex.getSpriteData(id, front, {gen: 9, shiny, gender, teamPreview: true});
							assert.deepEqual([normalRequest.w, normalRequest.h], [data.w, data.h], id + ': noScale bypass');
						}
						checks++;
					}
				}
			}
		}
		assert(checks > 80000, 'audit must include the full current roster');
	});
	it('keeps teambuilder silhouettes inside their 96-pixel tiles', () => {
		const context = loadDex(), {Dex, BattlePokedex} = context;
		const metricsTable = vm.runInContext('SPRITE_IMAGE_METRICS', context);
		for (const mode of ['default', 'bwgfx']) {
			Dex.prefs = key => key === mode;
			for (const id of Object.keys(BattlePokedex)) {
				if (!Dex.species.get(id).exists) continue;
				for (const shiny of [false, true]) for (const gender of ['M', 'F']) {
					const d = Dex.getTeambuilderSpriteData({species: id, shiny, gender}, 9);
					const asset = d.spriteDir.slice(8) + (d.shiny ? '-shiny' : '') + '/' + d.spriteid + '.png';
					const m = metricsTable[asset]; assert(m, id + ': ' + asset);
					const scale = parseFloat(d.backgroundSize) / m[0];
					assert(Number.isFinite(scale) && scale > 0, id);
					assert(d.x + m[2] * scale >= -1 && d.y + m[3] * scale >= -1, id + ': clipped top/left');
					assert(d.x + (m[2] + m[4]) * scale <= 97 && d.y + (m[3] + m[5]) * scale <= 97, id + ': clipped bottom/right');
				}
			}
		}
	});
});
