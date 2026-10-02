const assert = require('assert').strict;
const crypto = require('crypto');
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
		if (['clefable', 'gengar', 'hydreigon', 'rillaboom', 'rillaboom-gmax', 'banette', 'banette-mega'].includes(row.spriteid)) continue;
		it(`uses verified dedicated art for ${row.name}, normal and shiny`, () => {
			for (const shiny of [false, true]) {
				if ((row.spriteid === 'archeops' && shiny) || (row.spriteid.startsWith('furfrou') || row.spriteid.startsWith('silvally')) || ['dusknoir', 'reuniclus', 'scizor-mega', 'raichu-alola'].includes(row.spriteid)) continue;
				if (shiny && ['lilligant', 'aurorus', 'tyrantrum'].includes(row.spriteid)) continue;
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
					if (row.spriteid === 'pinsir') {
						assert.equal(width, 120);
						assert.equal(data.x, -12);
						assert.equal(data.y, -12);
						assert.equal(data.nativeSizeOnly, true);
					} else {
						assert(width <= 96 && width * size.h / size.w <= 97);
					}
				}
			}
		});
	}
	it('uses pixel sprites for shiny Archeops', () => {
		assert.equal(Dex.getTeambuilderSpriteData({species: 'Archeops', shiny: true}, 9).spriteDir, 'sprites/gen5');
		for (const side of [true, false]) {
			const sprite = Dex.getSpriteData('Archeops', side, {gen: 9, shiny: true});
			assert(sprite.url.includes('gen5') && sprite.url.includes('-shiny') && sprite.url.includes('.png'), sprite.url);
		}
	});
	it('preserves the Gardevoir-Void sprite only on the regular Mega branch', () => {
		for (const shiny of [false, true]) {
			for (const side of [true, false]) {
				const original = Dex.getSpriteData('Gardevoir-Void', side, {gen: 9, shiny});
				const mega = Dex.getSpriteData('Gardevoir-Mega-Alt', side, {gen: 9, shiny});
				assert.equal(mega.url, original.url);
				for (const species of ['Gardevoir-Mega-Z', 'Gardevoir-Void-Mega']) assert.notEqual(Dex.getSpriteData(species, side, {gen: 9, shiny}).url, original.url);
			}
			assert.equal(Dex.getTeambuilderSpriteData({species: 'Gardevoir-Mega-Alt', shiny}, 9).spriteid, 'gardevoir-void');
		}
		assert.deepEqual(Dex.species.get('Gardevoir-Mega-Alt').baseStats, Dex.species.get('Gardevoir-Mega').baseStats);
	});
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

describe('Supplied Silvally artwork', () => { for (const row of rows.filter(row => row.spriteid.startsWith('silvally'))) { it(row.name + ' uses the supplied shiny variant', () => { const data = Dex.getTeambuilderSpriteData({species: row.name, shiny: false}, 9); assert.equal(data.spriteDir, 'sprites/gen5'); assert.equal(data.spriteid, row.spriteid); assert.equal(data.shiny, true); }); } });

const sprites = path.resolve(__dirname, '../play.pokemonshowdown.com/sprites');
const approved = {
 'gen5/mrmime-pulse.png': '4e2e7b8b5e6cd6249e62a3e7978bc519e0202452bdf25665134163118bca596c',
 'gen5-back/mrmime-pulse.png': '52776ee03c66fd50c634954156db5dc35a5c2c68b117004d9931b74dc286b08c',
 'gen5-shiny/gardevoir-void.png': '09493aa59f37f817e45575579b25d8779d09a04c2f212d8b9a29581b8aff0fdf',
 'gen5-back/gardevoir-void.png': 'c4b572fb245d497b182ce0c3163406a68308bed7e4cc1416ccc62761feb42f43',
 'gen5-back-shiny/gardevoir-void.png': '3f0716e51e760c492c1b09e2db2277084b3f432283423b1fdff4222a22bd8526',
 'gen5-back/arcanine-alt.png': '397965ca2d6eb89b52d4ca24489559dffaf8180685804407c64fc676b56ec89d',
 'gen5-back-shiny/arcanine-alt.png': 'f0cd112ddddd67c15abbe94788bae1aa7cbdb507d50f67d1f11f6607c0b02745',
 'gen5-back/torterra-rift.png': '1d2970a170a2d5227d99cbbc0163b4963d3edf7e20daa24401cfaaa7e1f61a63',
 'gen5-back-shiny/torterra-rift.png': '1d2970a170a2d5227d99cbbc0163b4963d3edf7e20daa24401cfaaa7e1f61a63',
 'gen5-back/torterra-rift-shatter.png': '4adc9db8af1b07f64677a1748c92cd91c0199330b3cec39a532d018e6423ccc9',
 'gen5-back-shiny/torterra-rift-shatter.png': '4adc9db8af1b07f64677a1748c92cd91c0199330b3cec39a532d018e6423ccc9',
};

function selected(species, front, shiny) {
 const sprite = Dex.getSpriteData(species, front, {gen: 9, shiny, noScale: true});
 const filename = sprite.url.split('/sprites/')[1].split('?')[0];
 const bytes = fs.readFileSync(path.join(sprites, filename));
 const png = filename.endsWith('.png');
 if (png) assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', filename);
 else assert(/^GIF8[79]a$/.test(bytes.subarray(0, 6).toString()), filename);
 const dimensions = require('image-size')(bytes);
 assert.equal(sprite.w, dimensions.width, filename + ' width');
 assert.equal(sprite.h, dimensions.height, filename + ' height');
 return filename;
}

describe('Approved October sprite installation', () => {
 it('keeps all installed files byte-identical to approved production assets', () => {
  for (const [filename, expected] of Object.entries(approved)) {
   const bytes = fs.readFileSync(path.join(sprites, filename));
   assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), expected, filename);
  }
 });
 it('selects the distinct normal and shiny Gardevoir, Torterra and Arcanine artwork', () => {
  for (const [species, spriteid] of [
   ['Gardevoir-Void', 'gardevoir-void'], ['Torterra-Rift', 'torterra-rift'],
   ['Torterra-Rift-Shatter', 'torterra-rift-shatter'], ['Arcanine-Alt', 'arcanine-alt'],
  ]) {
   for (const shiny of [false, true]) {
    const suffix = shiny ? '-shiny' : '';
    assert.equal(selected(species, true, shiny), `gen5${suffix}/${spriteid}.png`);
    assert.equal(selected(species, false, shiny), `gen5-back${suffix}/${spriteid}.png`);
   }
  }
  for (const shiny of [false, true]) for (const front of [false, true]) {
   assert.equal(Dex.getSpriteData('Gardevoir-Mega-Alt', front, {gen: 9, shiny}).url,
    Dex.getSpriteData('Gardevoir-Void', front, {gen: 9, shiny}).url);
  }
 });
 it('uses approved Pulse artwork and only the supplied shiny variants', () => {
  for (const shiny of [false, true]) {
   assert.equal(selected('Magnezone-Pulse', true, shiny), 'gen5/magnezone-pulse.png');
   assert.equal(selected('Magnezone-Pulse', false, shiny), 'gen5-back/magnezone-pulse.png');
   assert.equal(selected('Mr. Mime-Pulse', true, shiny), 'gen5/mrmime-pulse.png');
   assert.equal(selected('Mr. Mime-Pulse', false, shiny),
    'gen5-back/mrmime-pulse.png');
  }
  const builder = Dex.getTeambuilderSpriteData({species: 'Mr. Mime-Pulse', shiny: true}, 9);
  assert.equal(builder.spriteid, 'mrmime-pulse');
  assert(!builder.shiny);
  assert(Dex.getTeambuilderSprite({species: 'Mr. Mime-Pulse', shiny: true}, 9).includes('/sprites/gen5/mrmime-pulse.png'));
  assert(Dex.getPokemonIcon({species: 'Mr. Mime-Pulse'}).includes('/sprites/gen5/mrmime-pulse.png'));
 });
});

describe('Supplied Glaceon shiny artwork', () => {
 it('uses the supplied shiny art while preserving the normal assets', () => {
  const expected = {
  'gen5-shiny/glaceon.png': '7e86585824f41d69983e58b0cde768568929adbe2afb7cd995d7d587c3a5e630',
  'gen5-back-shiny/glaceon.png': '6537e7c17927bfe3f010641c9aefc65ece87594b3416d17172451df63c6c64ba',
  'pokemonicons/glaceon-shiny.png': 'ff1eaa1164e91e9102281ab2002d6c1dffe525427e857088feb3bd280d39d204',
  'dex-shiny/glaceon.png': '76fce62985957f86aec5a9d358743f614425f9e8300904fed39f2ca44fd40abd',
  'gen5/glaceon.png': 'a63b37c412e19fd10ae9771d535de40e8eb4f1ad190d4940b0db5c04fbdd82d7',
  'gen5-back/glaceon.png': '980946e2343b1adf2fe2a1e0bc6440efb09964a2c43d1d291bf9f963e0bde8e8',
  'dex/glaceon.png': '8caa5dbaeb971a251f3be0327aad0195ff95f774b108c8a515661e8dc8a4e9d8',
  'pokemonicons-official-sheet.png': 'b1a02d8ecbeb6564a25b931e2b6a15d8cd55fb129f396c9bf2c9e8dc1332593b',
  };
  for (const [filename, hash] of Object.entries(expected)) {
   assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(sprites, filename))).digest('hex'), hash, filename);
  }
  for (const shiny of [false, true]) {
   for (const front of [false, true]) {
    const animated = !shiny && !!global.BattlePokemonSprites.glaceon;
    const expected = animated ? `ani${front ? '' : '-back'}/glaceon.gif` : `gen5${front ? '' : '-back'}${shiny ? '-shiny' : ''}/glaceon.png`;
    assert.equal(selected('Glaceon', front, shiny), expected);
   }
   const builder = Dex.getTeambuilderSpriteData({species: 'Glaceon', shiny}, 9);
   assert.equal(builder.spriteDir, 'sprites/dex');
   assert.equal(builder.shiny, shiny);
   assert(Dex.getTeambuilderSprite({species: 'Glaceon', shiny}, 9).includes(`/sprites/dex${shiny ? '-shiny' : ''}/glaceon.png`));
   for (const gender of ['M', 'F']) for (const facingLeft of [false, true]) {
    const css = Dex.getPokemonIcon({species: 'Glaceon', shiny, gender}, facingLeft);
    assert(css.includes(shiny ? '/sprites/pokemonicons/glaceon-shiny.png' : 'pokemonicons-official-sheet.png'));
   }
  }
  const fainted = Dex.getPokemonIcon({species: 'Glaceon', shiny: true, fainted: true});
  assert(fainted.includes('glaceon-shiny.png') && fainted.includes('opacity:.3'));
  assert(Dex.getSpriteData('Glaceon', true, {gen: 9, shiny: true}).url.includes('?v=glaceon-shiny-20261002'));
 });
});
