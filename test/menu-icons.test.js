const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
global.window = global;
global.Config = {whitelist: [], routes: {root: 'pokemonshowdown.com'}};
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
if (process.env.MENU_ICON_BUNDLE) {
	require('../play.pokemonshowdown.com/js/battledata');
} else {
	require('../play.pokemonshowdown.com/js/battle-dex-data');
	require('../play.pokemonshowdown.com/js/battle-dex');
}
const before = require('../menu-icons-before.json');
const sizes = new Map();

describe('Team strip menu icons', () => {
	for (const row of before) {
		it(`resolves visible local assets for ${row.name} across gender, shiny, and facing variants`, () => {
			for (const gender of ['M', 'F']) for (const shiny of [false, true]) for (const left of [false, true]) {
				const css = Dex.getPokemonIcon({species: row.name, gender, shiny}, left);
				const url = css.match(/url\(([^)]+)\)/)[1];
				const file = path.join(__dirname, '../play.pokemonshowdown.com', url.slice(url.indexOf('sprites/')).split('?')[0]);
				assert(fs.existsSync(file), `${row.name}: missing ${file}`);
				if (!sizes.has(file)) sizes.set(file, imageSize(file));
				const size = sizes.get(file);
				assert(size.width > 1 && size.height > 1, `${row.name}: placeholder image`);
				const position = css.match(/scroll -(\d+)px -(\d+)px/);
				if (position) {
					assert(+position[1] + 40 <= size.width && +position[2] + 30 <= size.height, `${row.name}: cell outside sheet`);
					if (row.id !== 'raidboss') assert(+position[1] || +position[2], `${row.name}: unknown icon`);
				}
				if (row.officialAvailable && row.kind !== 'dedicated custom icon' && !css.includes('/sprites/pokemonicons/')) {
					assert(css.includes('pokemonicons-official-sheet.png'), `${row.name}: official icon displaced`);
				}
			}
		});
	}
	it('uses the expected native Mega cells for the screenshot examples', () => {
		for (const [species, index] of [['Dragonite-Mega', 1407], ['Annihilape', 979], ['Charizard-Mega-Y', 1322]]) {
			const css = Dex.getPokemonIcon({species});
			assert(css.includes('pokemonicons-official-sheet.png'));
			assert(css.includes(`scroll -${index % 12 * 40}px -${Math.floor(index / 12) * 30}px`));
		}
	});
	it('preserves supplied Raichu and gender-specific Breloom menu icons', () => {
		assert(Dex.getPokemonIcon('Raichu-Mega-X').includes('/pokemonicons/raichu-megax.png'));
		assert(Dex.getPokemonIcon('Raichu-Mega-Y').includes('/pokemonicons/raichu-megay.png'));
		assert(Dex.getPokemonIcon({species: 'Breloom-Mega', gender: 'F'}).includes('/pokemonicons/breloom-mega-f.png'));
	});
	it('uses exact custom-form artwork when no native icon exists', () => {
		for (const [species, sprite] of [['Divineon', 'divineon'], ['Ledian-Mega', 'ledian-mega'], ['Clawitzer-Mega', 'clawitzer-mega'], ['Banette-Mega-Z', 'banette-megaz']]) {
			assert(Dex.getPokemonIcon({species}).includes(`/gen5/${sprite}.png`));
		}
		assert.equal(Dex.getPokemonIcon('Granbull-Reborn'), Dex.getPokemonIcon('Granbull-Alt'));
	});
	it('preserves fainted styling, temporary form changes, and Parasitism', () => {
		assert(Dex.getPokemonIcon({species: 'Dragonite-Mega', fainted: true}).includes('opacity:.3'));
		assert.equal(Dex.getPokemonIcon({species: 'Charizard', volatiles: {formechange: ['formechange', 'Charizard-Mega-Y']}}), Dex.getPokemonIcon('Charizard-Mega-Y'));
		assert(Dex.getPokemonIcon({species: 'Parasect', ability: 'Parasitism'}).includes('/gen5/parasect-parasitism.png'));
		assert(Dex.getPokemonIcon('pokeball-fainted').includes('pokemonicons-pokeball-sheet.png'));
	});
});
