const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattleAbilities = require('../play.pokemonshowdown.com/data/abilities').BattleAbilities;
require('../play.pokemonshowdown.com/js/battle-dex-data');
require('../play.pokemonshowdown.com/js/battle-dex');
const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-dex-search.js'), 'utf8');
const {BattlePokemonSearch, DexSearch} = new Function(source + '\nreturn {BattlePokemonSearch, DexSearch};')();

describe('Listed ability search', () => {
	for (const [name, expected] of [['Charizard', true], ['Ekans', true], ['Arcanine-Hisui', true], ['Charizard-Gmax', true], ['Arcanine', true], ['Zubat', false], ['Abra', false], ['Raichu-Alola', false]]) {
		it(`Intimidate ${expected ? 'includes' : 'excludes'} ${name}`, () => {
			const species = Dex.species.get(name);
			for (const query of ['Intimidate', 'intimidate']) {
				assert.equal(BattlePokemonSearch.prototype.filter.call({dex: Dex}, ['pokemon', species.id], [['ability', query]]), expected);
			}
		});
	}
	it('matches a composite by its own name, not its hidden components', () => {
		const species = Dex.species.get('Charizard-Gmax');
		assert(Dex.hasAbility(species, 'Burning Crown'));
		assert(!Dex.hasAbility(species, 'Proficient'));
		assert(Dex.getAbilityEffects('burningcrown').has('proficient'));
	});
	it('uses direct abilities for instant Pokemon results too', () => {
		const rows = DexSearch.prototype.instafilter.call({dex: Dex}, 'pokemon', 'ability', 'intimidate');
		assert(rows.some(row => row[0] === 'pokemon' && row[1] === 'charizard'));
		assert(rows.some(row => row[0] === 'pokemon' && row[1] === 'charizardgmax'));
		assert(!rows.some(row => row[0] === 'pokemon' && ['zubat', 'abra'].includes(row[1])));
	});
});
