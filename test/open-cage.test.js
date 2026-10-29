'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const client = path.resolve(__dirname, '../play.pokemonshowdown.com');

describe('Open Cage client metadata', () => {
	for (const bundled of [false, true]) {
		it(`shows Chatot's passive and preserves its options in ${bundled ? 'bundle' : 'individual scripts'}`, () => {
			const context = vm.createContext({Config: {}, Pokemon: class {}, BattlePokemonSprites: {}, BattlePokemonSpritesBW: {}});
			context.window = context;
			for (const [file, name] of [['pokedex', 'BattlePokedex'], ['abilities', 'BattleAbilities'], ['moves', 'BattleMovedex'], ['items', 'BattleItems']]) {
				const data = {exports: {}};
				vm.runInNewContext(fs.readFileSync(path.join(client, 'data', file + '.js'), 'utf8'), data);
				context[name] = JSON.parse(JSON.stringify(data.exports[name]));
			}
			for (const script of bundled ? ['battledata'] : ['battle-dex-data', 'battle-dex']) {
				vm.runInContext(fs.readFileSync(path.join(client, 'js', script + '.js'), 'utf8'), context);
			}
			const dex = context.Dex, species = dex.species.get('chatot');
			assert.deepEqual(Array.from(species.passives), ['opencage']);
			assert.deepEqual(JSON.parse(JSON.stringify(species.abilities)), {0: 'Echo Fiend', 1: 'Cloud Nine', H: 'Opportunist'});
			assert(dex.hasAbilityEffect(species, 'opencage'));
			assert(!dex.hasAbilityEffect(species, 'earlybird'));
			assert(!dex.hasAbility(species, 'opencage'));
			assert(dex.abilities.get('opencage').desc.includes('end of the following turn'));
			assert(dex.abilities.get('opencage').shortDesc.length <= 100);
		});
	}
	it('provides a readable escape status in battles', () => {
		const source = fs.readFileSync(path.join(client, 'src/battle-animations.ts'), 'utf8');
		assert.match(source, /opencage:.*Free to switch/);
	});
});
