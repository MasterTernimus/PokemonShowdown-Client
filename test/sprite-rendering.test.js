const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const {GifReader} = require('omggif');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const assertLogicalSize = require('./helpers/assert-logical-sprite.cjs');
const {Dex, BattlePokedex} = require('./helpers/isolated-dex.cjs')();

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
	it('sizes Lopunny from its artwork without a leftover baseline adjustment', () => {
		for (const shiny of [false, true]) for (const front of [false, true]) {
			const normal = Dex.getSpriteData('Lopunny', front, {gen: 9, shiny});
			assertLogicalSize(normal, 'Lopunny', front);
			assert.equal(normal.y, 0);
			const preview = Dex.getSpriteData('Lopunny', front, {gen: 9, shiny, teamPreview: true});
			assertLogicalSize(preview, 'Lopunny', front, true);
			const dynamax = Dex.getSpriteData('Lopunny', front, {gen: 9, shiny, dynamax: true});
			assert(Math.abs(dynamax.w - normal.w * 2) <= 1);
			assert(Math.abs(dynamax.h - normal.h * 2) <= 1);
			assert.equal(normal.url, dynamax.url);
		}
		const raw = Dex.getSpriteData('Lopunny', false, {gen: 9, shiny: true, noScale: true});
		assert.deepEqual([raw.w, raw.h, raw.y], [106, 122, 0]);
	});

	it('keeps base Ninetales normal and shiny compact in animated and static battle modes', () => {
		const {Dex: dex} = require('./helpers/isolated-dex.cjs')();
		for (const mode of ['default', 'bwgfx', 'noanim', 'nogif']) {
			dex.prefs = key => key === mode;
			for (const gen of [5, 9]) for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = dex.getSpriteData('Ninetales', front, {gen, shiny});
				const raw = dex.getSpriteData('Ninetales', front, {gen, shiny, noScale: true});
				assertLogicalSize(data, 'Ninetales', front);
				assert.equal(data.url, raw.url);
				assert(data.pixelated);
				assert(fs.existsSync(localFile(data.url)));
				if (!shiny && mode !== 'noanim' && mode !== 'nogif') {
					assert(new GifReader(fs.readFileSync(localFile(data.url))).numFrames() > 1);
				}
			}
		}
	});

	it('uses integer BW projection only for normal Chimecho animated backs', () => {
		const back = Dex.getSpriteData('Chimecho', false, {gen: 9});
		assert.equal(back.gen, 5);
		assert(back.url.includes('/gen5ani-back/chimecho.gif'));
		assertLogicalSize(back, 'Chimecho', false);
		assert.equal(new GifReader(fs.readFileSync(localFile(back.url))).numFrames(), 83);
		assert.equal(Dex.getSpriteData('Chimecho', true, {gen: 9}).gen, 9);
		for (const option of ['shiny', 'noScale', 'teamPreview', 'dynamax']) {
			assert.equal(Dex.getSpriteData('Chimecho', false, {gen: 9, [option]: true}).gen, 9, option);
		}
		for (const form of ['Chimecho-Mega', 'Chimecho-Mega-Y']) {
			assert.equal(Dex.getSpriteData(form, false, {gen: 9}).gen, 9);
		}
	});

	it('keeps Indeedee-F, Slowking forms, and Sinistcha forms compact without changing artwork', () => {
		for (const name of ['Indeedee-F', 'Slowking', 'Slowking-Galar', 'Sinistcha', 'Sinistcha-Masterpiece']) {
			for (const gen of [5, 9]) for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = Dex.getSpriteData(name, front, {gen, shiny});
				const raw = Dex.getSpriteData(name, front, {gen, shiny, noScale: true});
				assertLogicalSize(data, name, front);
				assert.equal(data.url, raw.url, name);
				assert.equal(data.pixelated, raw.pixelated, name);
				assert(fs.existsSync(localFile(data.url)), name);
			}
		}
		assert(Dex.getSpriteData('Indeedee', false, {gen: 9}).h > 52);
		const chimecho = Dex.getSpriteData('Chimecho', false, {gen: 9});
		assert(chimecho.pixelated);
		assert(new GifReader(fs.readFileSync(localFile(chimecho.url))).numFrames() > 1);
	});

	it('uses the renamed Parasect profile and a compact shiny Jolteon', () => {
		assert.equal(Dex.species.get('Parasect-Aevian').id, 'parasectrejuv');
		assert.deepEqual(Array.from(Dex.species.get('Parasect-Parasite').types), ['Ghost', 'Grass']);
		for (const name of ['Parasect', 'Parasect-Rejuv', 'Parasect-Mega']) {
			assert.deepEqual(Array.from(Dex.species.get(name).types), ['Ghost', 'Bug']);
		}
		for (const front of [false, true]) {
			const shiny = Dex.getSpriteData('Jolteon', front, {gen: 5, shiny: true});
			assert(shiny.w <= 50 && shiny.h <= 50);
			const host = Dex.getSpriteData('Parasect-Rejuv', front, {gen: 5});
			assert(host.w <= 68 && host.h <= 68);
		}
	});
	it('prioritizes supplied custom shinies in battles, previews, and Team Builder', () => {
		for (const species of ['Basculegion', 'Basculegion-F', 'Lilligant', 'Aurorus', 'Tyrantrum']) {
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
	it('keeps normal Basculegion animated without using those animations for its shiny', () => {
		for (const species of ['Basculegion', 'Basculegion-F']) for (const front of [true, false]) {
			const normal = Dex.getSpriteData(species, front, {gen: 9, shiny: false});
			const shiny = Dex.getSpriteData(species, front, {gen: 9, shiny: true});
			assert(normal.url.includes('.gif'), normal.url);
			assert(shiny.url.includes('-shiny/'), shiny.url);
			assert(shiny.url.includes('.png'), shiny.url);
		}
	});

	it('keeps normal roster sprites inside the projected battle size budget', function () {
		this.timeout(60000); // Decode actual artwork across the full catalog, including GIF frames.
		for (const id of Object.keys(BattlePokedex)) {
			const species = Dex.species.get(id);
			if (!species.exists || species.isTotem || id.includes('gmax') || id.includes('mega') || id === 'hydreigon' || id === 'feraligatr') continue;
			for (const gen of [5, 9]) for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = Dex.getSpriteData(species.name, front, {gen, shiny});
				assertLogicalSize(data, species.name, front);
			}
		}
	});
	it('keeps Jolteon, Rotom, and every Oricorio compact after battle projection', () => {
		for (const species of ['Rotom', 'Rotom-Wash', 'Rotom-Heat', 'Rotom-Frost', 'Rotom-Fan', 'Rotom-Mow', 'Jolteon', 'Oricorio', 'Oricorio-Pom-Pom', 'Oricorio-Pau', 'Oricorio-Sensu']) {
			for (const shiny of [false, true]) for (const front of [false, true]) {
				const data = Dex.getSpriteData(species, front, {gen: 5, shiny});
				assertLogicalSize(data, species, front);
				const dimensions = sizeOf(localFile(data.url));
				assert(Math.abs(data.w / data.h - dimensions.width / dimensions.height) < 0.03, species);
			}
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
			if (shiny) {
				assert(data.url.includes('.png'), data.url);
				assert.equal(sizeOf(localFile(data.url)).width, 192);
			} else {
				assert(data.url.includes('/za-golisopodmega.gif'), data.url);
				assert(new GifReader(fs.readFileSync(localFile(data.url))).numFrames() > 1);
			}
		}
	});
	it('uses distinct front and back assets for base Nidoking and its shiny', () => {
		for (const shiny of [false, true]) {
			const front = Dex.getSpriteData('Nidoking', true, {gen: 9, shiny});
			const back = Dex.getSpriteData('Nidoking', false, {gen: 9, shiny});
			assert(back.url.includes('nidoking') && back.url.includes('-back'), back.url);
			assert(sizeOf(localFile(back.url)).width > 1);
			assert(!fs.readFileSync(localFile(front.url)).equals(fs.readFileSync(localFile(back.url))));
		}
	});
	it('keeps Clefable and Gengar compact and Hydreigon full-sized', () => {
		assertLogicalSize(staticSpriteData('Clefable', true, {gen: 9}), 'Clefable', true);
		assertLogicalSize(staticSpriteData('Gengar', true, {gen: 9}), 'Gengar', true);
		const hydreigon = staticSpriteData('Hydreigon', true, {gen: 9});
		assertLogicalSize(hydreigon, 'Hydreigon', true);
		assert(hydreigon.w > staticSpriteData('Clefable', true, {gen: 9}).w);
		for (const species of ['Clefable', 'Gengar', 'Hydreigon']) {
			assert.equal(Dex.getTeambuilderSpriteData({species}, 9).spriteDir, 'sprites/gen5');
		}
	});
	it('caps Cacturne battle sprites without changing the artwork aspect ratio', () => {
		for (const gen of [5, 9]) for (const shiny of [false, true]) for (const front of [false, true]) {
			const data = Dex.getSpriteData('Cacturne', front, {gen, shiny});
			assertLogicalSize(data, 'Cacturne', front);
			const dimensions = sizeOf(localFile(data.url));
			assert(Math.abs(data.w / data.h - dimensions.width / dimensions.height) < 0.03);
		}
	});
	it('preserves file aspect ratios in named normal and shiny battle sprites', () => {
		for (const species of ['Clefable', 'Gengar', 'Hydreigon', 'Golisopod-Mega', 'Nidoking']) {
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
					assertLogicalSize(sprite, species, front, teamPreview);
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


// Verify approved static artwork independently of the normal BW animation route.
function staticSpriteData(...args) {
 const prefs = Dex.prefs;
 Dex.prefs = key => key === 'nogif' ? true : prefs.call(Dex, key);
 try { return Dex.getSpriteData(...args); } finally { Dex.prefs = prefs; }
}
