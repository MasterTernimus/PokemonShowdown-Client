const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const {GifReader} = require('omggif');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
for (const file of ['pokedex-mini', 'pokedex-mini-bw']) {
	Object.assign(global, require(path.join(root, 'data', file + '.js')));
}
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');
require('../play.pokemonshowdown.com/js/battle-scene-stub');
require('../play.pokemonshowdown.com/js/battle-text-parser');
require('../play.pokemonshowdown.com/js/battle');

function localFile(url) {
	return path.join(root, 'sprites', url.split('sprites/')[1].split('?')[0]);
}

describe('Sprite rendering regressions', () => {
	before(() => {
		for (const file of ['pokedex-mini', 'pokedex-mini-bw']) {
			Object.assign(global, JSON.parse(JSON.stringify(require(path.join(root, 'data', file + '.js')))));
		}
	});
	it('uses genuine animations in preview without changing custom battle artwork', () => {
		for (const species of ['Clefable', 'Gengar', 'Hydreigon', 'Banette', 'Scizor', 'Rillaboom', 'Corviknight']) {
			for (const shiny of [false, true]) for (const front of [false, true]) {
				const before = Dex.getSpriteData(species, front, {gen: 9, shiny});
				const preview = Dex.getSpriteData(species, front, {gen: 9, shiny, teamPreview: true, noScale: true});
				const bytes = fs.readFileSync(localFile(preview.url));
				assert(new GifReader(bytes).numFrames() > 1, preview.url);
				assert.deepEqual(Dex.getSpriteData(species, front, {gen: 9, shiny}), before);
			}
		}
	});
	it('keeps supplied Rillaboom artwork consistent in builder and battles', () => {
		for (const species of ['Rillaboom', 'Rillaboom-Gmax']) {
			for (const shiny of [false, true]) for (const gender of ['M', 'F']) {
				const builder = Dex.getTeambuilderSpriteData({species, shiny, gender}, 9);
				assert.equal(builder.spriteDir, 'sprites/gen5');
				assert.equal(!!builder.shiny, shiny);
				const builderFile = path.join(root, builder.spriteDir + (shiny ? '-shiny' : ''), builder.spriteid + '.png');
				const front = Dex.getSpriteData(species, true, {gen: 9, shiny, gender});
				const back = Dex.getSpriteData(species, false, {gen: 9, shiny, gender});
				assert.equal(localFile(front.url), builderFile);
				assert(!fs.readFileSync(builderFile).equals(fs.readFileSync(localFile(back.url))));
				for (const facing of [true, false]) {
					const preview = Dex.getSpriteData(species, facing, {gen: 9, shiny, gender, teamPreview: true, noScale: true});
					if (species === 'Rillaboom') {
						assert(new GifReader(fs.readFileSync(localFile(preview.url))).numFrames() > 1);
					} else {
						assert(preview.url.includes('rillaboom-gmax.png'), preview.url);
					}
				}
				assert.deepEqual(Dex.getSpriteData(species, true, {gen: 9, shiny, gender}), front);
			}
		}
	});
	it('does not select the old static Mega Golisopod GIF during preview', () => {
		for (const shiny of [false, true]) for (const front of [false, true]) {
			const data = Dex.getSpriteData('Golisopod-Mega', front, {gen: 9, shiny, teamPreview: true});
			assert(data.url.includes('.png'), data.url);
			assert.equal(sizeOf(localFile(data.url)).width, 192);
		}
	});
	it('uses distinct front and back assets for Nidoking-Reborn and its shiny', () => {
		for (const shiny of [false, true]) {
			const front = Dex.getSpriteData('Nidoking-Reborn', true, {gen: 9, shiny});
			const back = Dex.getSpriteData('Nidoking-Reborn', false, {gen: 9, shiny});
			assert(back.url.includes('nidoking-alt') && back.url.includes('-back'), back.url);
			assert.equal(sizeOf(localFile(back.url)).width, 192);
			assert(!fs.readFileSync(localFile(front.url)).equals(fs.readFileSync(localFile(back.url))));
		}
	});
	it('keeps Clefable and Gengar compact and Hydreigon full-sized', () => {
		assert(Dex.getSpriteData('Clefable', true, {gen: 9}).w <= 54);
		assert(Dex.getSpriteData('Gengar', true, {gen: 9}).w <= 56);
		const hydreigon = Dex.getSpriteData('Hydreigon', true, {gen: 9});
		assert(hydreigon.w >= 90 && hydreigon.h >= 108, JSON.stringify(hydreigon));
		for (const species of ['Clefable', 'Gengar', 'Hydreigon']) {
			assert.equal(Dex.getTeambuilderSpriteData({species}, 9).spriteDir, 'sprites/gen5');
		}
	});
	it('preserves file aspect ratios in named normal and shiny battle sprites', () => {
		for (const species of ['Clefable', 'Gengar', 'Hydreigon', 'Golisopod-Mega', 'Nidoking-Alt']) {
			for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = Dex.getSpriteData(species, front, {gen: 9, shiny});
				const size = sizeOf(localFile(data.url));
				assert(Math.abs(data.w / data.h - size.width / size.height) < 0.03, JSON.stringify(data));
			}
		}
	});
	it('resolves the repaired sheets and exact artwork aliases in every view', () => {
		for (const species of ['Heatran-Mega', 'Barbaracle-Mega', 'Zeraora-Mega', 'Sawsbuck-Winter', 'Rockruff-Dusk', 'Tatsugiri-Curly-Mega']) {
			for (const shiny of [false, true]) {
				const builder = Dex.getTeambuilderSpriteData({species, shiny}, 9);
				const file = path.join(root, builder.spriteDir + (builder.shiny ? '-shiny' : ''), builder.spriteid + '.png');
				assert(fs.statSync(file).size > 0, file);
				for (const front of [false, true]) for (const teamPreview of [false, true]) {
					const sprite = Dex.getSpriteData(species, front, {gen: 9, shiny, teamPreview});
					assert(fs.statSync(localFile(sprite.url)).size > 0, sprite.url);
					assert(sprite.w <= 108 && sprite.h <= 112, JSON.stringify(sprite));
				}
			}
		}
	});
	it('uses existing shiny animations for legacy filename variants', () => {
		for (const species of ['Pikachu-Hoenn', 'Pokestar UFO-2']) {
			for (const front of [false, true]) for (const teamPreview of [false, true]) {
				const data = Dex.getSpriteData(species, front, {gen: 9, shiny: true, teamPreview});
				assert(fs.statSync(localFile(data.url)).size > 0, data.url);
			}
		}
	});
});
