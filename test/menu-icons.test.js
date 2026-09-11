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
				if (!row.id.startsWith('furfrou') && row.officialAvailable && row.kind !== 'dedicated custom icon' && !css.includes('/sprites/pokemonicons/')) {
					assert(css.includes('pokemonicons-official-sheet.png'), `${row.name}: official icon displaced`);
				}
			}
		});
	}
	it('uses the expected native Mega cells for the screenshot examples', () => {
		for (const [species, index] of [['Dragonite-Mega', 1407], ['Annihilape', 979]]) {
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
	it('keeps Reuniclus battle artwork separate from its party icon', () => {
		const partyIcon = Dex.getPokemonIcon({species: 'Reuniclus'});
		assert(partyIcon.includes('/sprites/pokemonicons/reuniclus.png'));
		for (const shiny of [false, true]) {
			const teamBuilderSprite = Dex.getTeambuilderSpriteData({species: 'Reuniclus', shiny});
			assert.equal(teamBuilderSprite.spriteDir, 'sprites/gen5');
			assert.equal(teamBuilderSprite.spriteid, 'reuniclus');
			assert.equal(!!teamBuilderSprite.shiny, shiny);
			assert(!JSON.stringify(teamBuilderSprite).includes('pokemonicons'));
		}
	});
	it('uses exact custom-form artwork when no native icon exists', () => {
		for (const [species, sprite] of [['Ledian-Mega', 'ledian-mega'], ['Clawitzer-Mega', 'clawitzer-mega']]) {
			assert(Dex.getPokemonIcon({species}).includes(`/gen5/${sprite}.png`));
		}
		assert(Dex.getPokemonIcon('Banette-Mega-Z').includes('/sprites/pokemonicons/banette-megaz.png'));
		const banetteMegaZSprite = Dex.getTeambuilderSpriteData({species: 'Banette-Mega-Z'});
		assert.equal(banetteMegaZSprite.spriteDir, 'sprites/gen5');
		assert.equal(banetteMegaZSprite.spriteid, 'banette-megaz');
		assert.equal(Dex.getPokemonIcon('Granbull-Reborn'), Dex.getPokemonIcon('Granbull-Alt'));
	});
	it('uses supplied party icons for Ariados-Mega and Banette forms', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Ariados-Mega', 'ariados-mega', 'ariados-mega-shiny'],
			['Banette', 'banette', 'banette-shiny'],
			['Banette-Mega', 'banette-mega', 'banette-mega-shiny'],
			['Banette-Mega-Z', 'banette-megaz', 'banette-mega-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses supplied party icons for both Basculegion forms', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Basculegion', 'basculegion', 'basculegion-shiny'],
			['Basculegion-F', 'basculegion-f', 'basculegion-f-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses supplied party icons for Cinccino, Luxray, Toxicroak, and Mightyena forms', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Cinccino', 'cinccino', 'cinccino-shiny'],
			['Cinccino-Deso', 'cinccino-deso', 'cinccino-deso-shiny'],
			['Luxray', 'luxray', 'luxray-shiny'],
			['Luxray-Mega', 'luxray-mega', 'luxray-mega-shiny'],
			['Toxicroak', 'toxicroak', 'toxicroak-shiny'],
			['Toxicroak-Deso', 'toxicroak-deso', 'toxicroak-deso-shiny'],
			['Mightyena', 'mightyena', 'mightyena-shiny'],
			['Mightyena-Deso', 'mightyena-deso', 'mightyena-deso-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses supplied party icons for Florges, Aerodactyl, Greninja, Blastoise, Lapras, Absol, Darkrai, Chesnaught, and Venusaur forms', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Florges-Reborn', 'florges-reborn', 'florges-reborn-shiny'],
			['Aerodactyl', 'aerodactyl', 'aerodactyl-shiny'],
			['Aerodactyl-Mega', 'aerodactyl-mega', 'aerodactyl-mega-shiny'],
			['Greninja', 'greninja', 'greninja-shiny'],
			['Greninja-Mega', 'greninja-mega', 'greninja-mega-shiny'],
			['Blastoise', 'blastoise', 'blastoise-shiny'],
			['Blastoise-Mega', 'blastoise-mega', 'blastoise-mega-shiny'],
			['Lapras', 'lapras', 'lapras-shiny'],
			['Lapras-Aevian', 'lapras-aevian', 'lapras-aevian-shiny'],
			['Lapras-Gmax', 'lapras-gmax', 'lapras-gmax-shiny'],
			['Absol', 'absol', 'absol-shiny'],
			['Absol-Mega', 'absol-mega', 'absol-mega-shiny'],
			['Darkrai', 'darkrai', 'darkrai-shiny'],
			['Chesnaught', 'chesnaught', 'chesnaught-shiny'],
			['Chesnaught-Mega', 'chesnaught-mega', 'chesnaught-mega-shiny'],
			['Venusaur', 'venusaur', 'venusaur-shiny'],
			['Venusaur-Mega', 'venusaur-mega', 'venusaur-mega-shiny'],
			['Venusaur-Gmax', 'venusaur-gmax', 'venusaur-gmax-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses supplied party icons for Rillaboom, Corviknight, Milotic-Aevian, Tinkaton, Cradily, Froslass, and Hawlucha forms', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Rillaboom', 'rillaboom', 'rillaboom-shiny'],
			['Rillaboom-Gmax', 'rillaboom-gmax', 'rillaboom-gmax-shiny'],
			['Corviknight', 'corviknight', 'corviknight-shiny'],
			['Corviknight-Gmax', 'corviknight-gmax', 'corviknight-gmax-shiny'],
			['Milotic-Aevian', 'milotic-aevian', 'milotic-aevian-shiny'],
			['Tinkaton', 'tinkaton', 'tinkaton-shiny'],
			['Cradily', 'cradily', 'cradily-shiny'],
			['Froslass', 'froslass', 'froslass-shiny'],
			['Froslass-Mega', 'froslass-mega', 'froslass-mega-shiny'],
			['Hawlucha', 'hawlucha', 'hawlucha-shiny'],
			['Hawlucha-Mega', 'hawlucha-mega', 'hawlucha-mega-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses matching male and female party icons for Scolipede and Scolipede-Mega', () => {
		for (const [species, gender, normalSprite, shinySprite] of [
			['Scolipede', 'M', 'scolipede', 'scolipede-shiny'],
			['Scolipede', 'F', 'scolipede-f', 'scolipede-f-shiny'],
			['Scolipede-Mega', 'M', 'scolipede-mega', 'scolipede-mega-shiny'],
			['Scolipede-Mega', 'F', 'scolipede-mega-f', 'scolipede-mega-f-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species, gender}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, gender, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses supplied party icons for Bronzong-Rejuv, Charizard forms, Gengar forms, and Unfezant-Rejuv', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Bronzong-Rejuv', 'bronzong-rejuv', 'bronzong-rejuv-shiny'],
			['Charizard', 'charizard', 'charizard-shiny'],
			['Charizard-Mega-X', 'charizard-megax', 'charizard-megax-shiny'],
			['Charizard-Mega-Y', 'charizard-megay', 'charizard-megay-shiny'],
			['Charizard-Gmax', 'charizard-gmax', 'charizard-gmax-shiny'],
			['Gengar', 'gengar', 'gengar-shiny'],
			['Gengar-Mega', 'gengar-mega', 'gengar-mega-shiny'],
			['Gengar-Gmax', 'gengar-gmax', 'gengar-gmax-shiny'],
			['Unfezant-Rejuv', 'unfezant-rejuv', 'unfezant-rejuv-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses matching male and female party icons for Scizor and Mega Scizor', () => {
		for (const [species, gender, normalSprite, shinySprite] of [
			['Scizor', 'M', 'scizor', 'scizor-shiny'],
			['Scizor', 'F', 'scizor-f', 'scizor-f-shiny'],
			['Scizor-Mega', 'M', 'scizor-mega', 'scizor-mega-shiny'],
			['Scizor-Mega', 'F', 'scizor-mega-f', 'scizor-mega-f-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species, gender}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, gender, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('uses supplied party icons for Abysseon and Divineon', () => {
		for (const [species, normalSprite, shinySprite] of [
			['Abysseon', 'abysseon', 'abysseon-shiny'],
			['Divineon', 'divineon', 'divineon-shiny'],
		]) {
			assert(Dex.getPokemonIcon({species}).includes(`/sprites/pokemonicons/${normalSprite}.png`));
			assert(Dex.getPokemonIcon({species, shiny: true}).includes(`/sprites/pokemonicons/${shinySprite}.png`));
		}
	});
	it('preserves fainted styling, temporary form changes, and Parasitism', () => {
		assert(Dex.getPokemonIcon({species: 'Dragonite-Mega', fainted: true}).includes('opacity:.3'));
		assert.equal(Dex.getPokemonIcon({species: 'Charizard', volatiles: {formechange: ['formechange', 'Charizard-Mega-Y']}}), Dex.getPokemonIcon('Charizard-Mega-Y'));
		assert(Dex.getPokemonIcon({species: 'Parasect', ability: 'Parasitism'}).includes('/gen5/parasect-parasitism.png'));
		assert(Dex.getPokemonIcon('pokeball-fainted').includes('pokemonicons-pokeball-sheet.png'));
	});
});
