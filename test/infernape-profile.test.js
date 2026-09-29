const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const client = path.resolve(__dirname, '../play.pokemonshowdown.com');

describe('Infernape client profile isolation', () => {
	for (const bundled of [false, true]) {
		it(`keeps White Smoke on the base and Burning Spirit on the Mega (${bundled ? 'bundle' : 'individual scripts'})`, () => {
			const context = vm.createContext({
				Config: {},
				Pokemon: class {},
				BattlePokedex: JSON.parse(JSON.stringify(require(path.join(client, 'data/pokedex')).BattlePokedex)),
				BattlePokemonSprites: {},
				BattlePokemonSpritesBW: {},
			});
			context.window = context;
			for (const script of bundled ? ['battledata'] : ['battle-dex-data', 'battle-dex']) {
				vm.runInContext(fs.readFileSync(path.join(client, 'js', `${script}.js`), 'utf8'), context);
			}
			const dex = context.Dex;
			const base = dex.species.get('Infernape');
			assert.equal(base.abilities[0], 'White Smoke');
			assert.equal(base.abilities[1], 'Ultra Instinct');
			assert.equal(base.abilities.H, 'Burning Rage');
			assert(base.otherFormes.includes('Infernape-Mega'));
			assert.equal(dex.species.get('Infernape-Mega').abilities[0], 'Burning Spirit');
			assert.equal(dex.species.get('Infernape').abilities[0], 'White Smoke');
		});
	}
});
