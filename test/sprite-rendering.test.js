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

function assertBWPreview(data, species, front, shiny) {
	const filename = Dex.species.get(species).spriteid;
	const directory = 'gen5ani' + (front ? '' : '-back') + (shiny ? '-shiny' : '');
	const animation = path.join(root, 'sprites', directory, filename + '.gif');
	let animated = false;
	if (fs.existsSync(animation)) {
		const bytes = fs.readFileSync(animation);
		animated = bytes.subarray(0, 3).toString() === 'GIF' && new GifReader(bytes).numFrames() > 1;
	}
	if (animated) {
		assert.equal(localFile(data.url), animation);
	} else {
		const staticDirectory = 'gen5' + (front ? '' : '-back') + (shiny ? '-shiny' : '');
		assert.equal(localFile(data.url), path.join(root, 'sprites', staticDirectory, filename + '.png'));
	}
	assert(fs.existsSync(localFile(data.url)));
	assert(data.pixelated);
}

describe('Sprite rendering regressions', () => {
	it('uses the renamed Parasect profile and a compact shiny Jolteon', () => {
		assert.equal(Dex.species.get('Parasect-Aevian').id, 'parasectrejuv');
		assert.deepEqual(Dex.species.get('Parasect-Parasite').types, ['Ghost', 'Grass']);
		for (const name of ['Parasect', 'Parasect-Rejuv', 'Parasect-Mega']) {
			assert.deepEqual(Dex.species.get(name).types, ['Ghost', 'Bug']);
		}
		for (const front of [false, true]) {
			const shiny = Dex.getSpriteData('Jolteon', front, {gen: 5, shiny: true});
			assert(shiny.w <= 50 && shiny.h <= 50);
			const host = Dex.getSpriteData('Parasect-Rejuv', front, {gen: 5});
			assert(host.w <= 68 && host.h <= 68);
		}
	});
	it('prioritizes supplied custom shinies in battles, previews, and Team Builder', () => {
		for (const species of ['Lilligant', 'Aurorus', 'Tyrantrum']) {
			const spriteid = Dex.species.get(species).spriteid;
			for (const front of [false, true]) for (const gen of [5, 9]) for (const teamPreview of [false, true]) {
				const data = Dex.getSpriteData(species, front, {gen, shiny: true, teamPreview});
				assert(data.url.includes(`/sprites/gen5${front ? '' : '-back'}-shiny/${spriteid}.png`), data.url);
				assert(fs.existsSync(localFile(data.url)));
			}
			const builder = Dex.getTeambuilderSpriteData({species, shiny: true}, 9);
			assert.equal(builder.spriteDir, 'sprites/gen5');
			assert.equal(builder.spriteid, spriteid);
			assert.equal(builder.shiny, true);
		}
	});

	it('keeps normal roster sprites inside the projected battle size budget', () => {
		for (const id of Object.keys(BattlePokedex)) {
			const species = Dex.species.get(id);
			if (!species.exists || species.isTotem || id.includes('gmax') || id.includes('mega') || id === 'hydreigon' || id === 'feraligatr') continue;
			for (const gen of [5, 9]) for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = Dex.getSpriteData(species.name, front, {gen, shiny});
				const max = id === 'cofagrigus' ? (front ? 96 : 84) : front ? 80 : 72;
				assert(data.w <= max && data.h <= max, `${id}: ${data.w}x${data.h}`);
			}
		}
	});
	it('keeps Jolteon, Rotom, and every Oricorio compact after battle projection', () => {
		for (const species of ['Rotom', 'Rotom-Wash', 'Rotom-Heat', 'Rotom-Frost', 'Rotom-Fan', 'Rotom-Mow', 'Jolteon', 'Oricorio', 'Oricorio-Pom-Pom', 'Oricorio-Pau', 'Oricorio-Sensu']) {
			for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = Dex.getSpriteData(species, front, {gen: 5, shiny});
				const limit = front ? (species.startsWith('Rotom') ? 80 : species.startsWith('Jolteon') ? (shiny ? 50 : 64) : 60) :
					(species.startsWith('Jolteon') && shiny ? 40 : 44);
				assert(data.w <= limit && data.h <= limit, species + ': ' + data.w + 'x' + data.h);
				if (species.startsWith('Rotom') && front) assert.equal(Math.max(data.w, data.h), 80);
				if (!front) assert(Math.max(data.w, data.h) * 2 <= 88, species + ' projected too large');
				const dimensions = sizeOf(localFile(data.url));
				assert(Math.abs(data.w / data.h - dimensions.width / dimensions.height) < 0.03, species);
			}
		}
	});
	before(() => {
		for (const file of ['pokedex-mini', 'pokedex-mini-bw']) {
			Object.assign(global, JSON.parse(JSON.stringify(require(path.join(root, 'data', file + '.js')))));
		}
	});
	it('uses animations for normal previews and supplied static shiny artwork', () => {
		for (const species of ['Clefable', 'Gengar', 'Hydreigon', 'Banette', 'Scizor', 'Rillaboom', 'Corviknight']) {
			for (const shiny of [false, true]) for (const front of [false, true]) {
				const before = Dex.getSpriteData(species, front, {gen: 9, shiny});
				const preview = Dex.getSpriteData(species, front, {gen: 9, shiny, teamPreview: true, noScale: true});
				if (shiny) {
					const spriteid = Dex.species.get(species).spriteid;
					assert(preview.url.includes(`/sprites/gen5${front ? '' : '-back'}-shiny/${spriteid}.png`), preview.url);
				} else {
					assertBWPreview(preview, species, front, shiny);
				}
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
					assertBWPreview(preview, species, facing, shiny);
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
	it('caps Cacturne battle sprites without changing the artwork aspect ratio', () => {
		for (const gen of [5, 9]) for (const shiny of [false, true]) for (const front of [false, true]) {
			const data = Dex.getSpriteData('Cacturne', front, {gen, shiny});
			const max = front ? 64 : 52;
			assert(data.w <= max && data.h <= max, JSON.stringify(data));
			const dimensions = sizeOf(localFile(data.url));
			assert(Math.abs(data.w / data.h - dimensions.width / dimensions.height) < 0.03);
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
