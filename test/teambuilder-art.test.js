const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');
require('../play.pokemonshowdown.com/js/battle-scene-stub');
require('../play.pokemonshowdown.com/js/battle-text-parser');
require('../play.pokemonshowdown.com/js/battle');
const rows = require('../teambuilder-audit-before.json');
const manifest = require('../teambuilder-art-manifest.json');

describe('Native Team Builder artwork coverage', () => {
	for (const row of rows.filter(row => row.available)) {
		it(`uses verified dedicated art for ${row.name}, normal and shiny`, () => {
			for (const shiny of [false, true]) {
				for (const gen of [0, 9]) {
					const data = Dex.getTeambuilderSpriteData({species: row.name, shiny}, gen);
					assert.equal(data.spriteDir, 'sprites/dex');
					assert.equal(data.spriteid, row.spriteid);
					assert.equal(data.shiny, shiny && row.shiny);
					const size = manifest[data.spriteid][data.shiny ? 'shiny' : 'normal'];
					const png = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com',
						data.spriteDir + (data.shiny ? '-shiny' : ''), data.spriteid + '.png'));
					assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
					assert.equal(png.readUInt32BE(16), size.w);
					assert.equal(png.readUInt32BE(20), size.h);
					const width = parseInt(data.backgroundSize);
					assert(width <= 96 && width * size.h / size.w <= 97);
				}
			}
		});
	}
	it('preserves exact custom forms and upstream gaps instead of using base-species art', () => {
		for (const species of ['Raichu-Mega-X', 'Raichu-Mega-Y', 'Baxcalibur-Mega', 'Charizard-Mega-X-Alt']) {
			const data = Dex.getTeambuilderSpriteData({species}, 9);
			assert.equal(data.spriteDir, 'sprites/gen5');
			assert(data.spriteid.includes('mega'));
		}
	});
	it('keeps explicit Gen 5 artwork and battle rendering separate', () => {
		for (const species of ['Dragonite-Mega', 'Clefable-Mega', 'Greninja-Mega']) {
			assert.equal(Dex.getTeambuilderSpriteData({species}, 5).spriteDir, 'sprites/gen5');
			assert(Dex.getSpriteData(species, true, {gen: 9}).url.includes('/sprites/gen5/'));
		}
	});
	it('restores original normal and shiny sprites when BW graphics is toggled on', () => {
		const originalPrefs = Dex.prefs;
		let bw = false;
		Dex.prefs = prop => prop === 'bwgfx' ? bw : originalPrefs.call(Dex, prop);
		try {
			for (const species of ['Dragonite-Mega', 'Clefable-Mega', 'Greninja-Mega']) {
				for (const shiny of [false, true]) {
					for (const gen of [0, 9]) {
						const pokemon = {species, shiny};
						bw = false;
						assert.equal(Dex.getTeambuilderSpriteData(pokemon, gen).spriteDir, 'sprites/dex');
						bw = true;
						const legacy = Dex.getTeambuilderSpriteData(pokemon, 5);
						assert.deepEqual(Dex.getTeambuilderSpriteData(pokemon, gen), legacy);
						assert.equal(legacy.spriteDir, 'sprites/gen5');
						assert.equal(!!legacy.shiny, shiny);
						bw = false;
						assert.equal(Dex.getTeambuilderSpriteData(pokemon, gen).spriteDir, 'sprites/dex');
					}
				}
			}
		} finally {
			Dex.prefs = originalPrefs;
		}
	});
});
