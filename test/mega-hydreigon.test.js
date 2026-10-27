const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Mega Hydreigon client integration', () => {
	const context = loadDex();
	const {Dex} = context;
	it('exposes the approved form, stone, stats and passive together', () => {
		const species = Dex.species.get('Hydreigon-Mega');
		assert(species.exists && species.isMega);
		assert.deepEqual({...species.baseStats}, {hp: 92, atk: 110, def: 125, spa: 130, spd: 125, spe: 118});
		assert.equal(species.bst, 700);
		assert.equal(species.abilities[0], 'Expiration');
		assert.deepEqual([...species.passives], ['abyssalrebirth']);
		assert(Dex.species.get('Hydreigon').otherFormes.includes(species.name));
		assert.equal(Dex.items.get('Hydreigonite').megaStone.Hydreigon, species.name);
		assert(!Dex.items.get('Hydreigonite').shortDesc.includes('Mega-X'));
		assert(!Dex.species.get('Hydreigon-Mega-X').exists);
	});
	it('shows the complete component identities and accurate recovery description', () => {
		for (const id of ['worldbreaker', 'controlledfury', 'berserk', 'duskilate', 'angerpoint']) {
			assert(Dex.getAbilityEffects('expiration').has(id), id);
		}
		assert.deepEqual([...Dex.getAbilityEffects('abyssalrebirth')].sort(), ['abyssalrebirth', 'hydrabond', 'levitate']);
		const ability = Dex.abilities.get('Abyssal Rebirth');
		assert.equal(ability.name, 'Abyssal Rebirth');
		assert(/once per battle/.test(ability.desc));
		assert(/after the entire move finishes/.test(ability.desc));
		assert(/suppression prevents Reawakening/.test(ability.desc));
		assert(!/Fell|Serene Grace/.test(ability.name + ability.desc));
	});
	for (const shiny of [false, true]) for (const front of [false, true]) {
		it(`resolves the supplied ${shiny ? 'shiny' : 'normal'} ${front ? 'front' : 'back'} sprite`, () => {
			const dir = 'gen5' + (front ? '' : '-back') + (shiny ? '-shiny' : '');
			const sprite = Dex.getSpriteData('Hydreigon-Mega', front ? 1 : 0, {gen: 9, shiny});
			assert(sprite.url.includes(`/${dir}/hydreigon-mega.png`), sprite.url);
			const file = path.join(__dirname, '../play.pokemonshowdown.com/sprites', dir, 'hydreigon-mega.png');
			const png = fs.readFileSync(file);
			assert.equal(png.readUInt32BE(16), 192);
			assert.equal(png.readUInt32BE(20), 192);
		});
	}
	it('hides the Mega from default, custom and direct picker results', () => {
		const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-dex-search.js'), 'utf8');
		const Search = require('vm').runInContext(source + '\nDexSearch;', context);
		const rows = Search.prototype.filterPokemonPicker.call({dex: Dex, pickerOptions: {}, typedSearch: {searchType: 'pokemon'}}, [['pokemon', 'hydreigonmega']]);
		assert.equal(rows.length, 0);
		for (const pickerOptions of [{}, {customOnly:true}, {group:'mega'}]) {
			assert.equal(Search.prototype.pickerMatches.call({dex:Dex,pickerOptions}, 'hydreigonmega'), false);
		}
		assert.equal(Search.prototype.pickerMatches.call({dex:Dex,pickerOptions:{}}, 'hydreigon'), true);
		const items=Search.prototype.filterPokemonPicker.call({dex:Dex,pickerOptions:{},typedSearch:{searchType:'item'}}, [['item','hydreigonite'],['item','leftovers']]);
		assert.deepEqual(items,[['item','leftovers']]);
	});
	for (const shiny of [false, true]) it(`uses the new artwork in the builder and party icon (shiny=${shiny})`, () => {
		const pokemon = {species: 'Hydreigon-Mega', shiny};
		assert(Dex.getTeambuilderSprite(pokemon).includes(`/gen5${shiny ? '-shiny' : ''}/hydreigon-mega.png`));
		assert(Dex.getPokemonIcon(pokemon).includes(`hydreigon-mega${shiny ? '-shiny' : ''}.png`));
	});
});
