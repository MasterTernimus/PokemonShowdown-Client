'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const client = path.resolve(__dirname, '../play.pokemonshowdown.com');

describe('Lore partnership client metadata', () => {
	for (const bundled of [false, true]) {
		it(`publishes the approved abilities, passive and components in ${bundled ? 'bundle' : 'individual scripts'}`, () => {
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
			const dex = context.Dex;
			for (const [id, slot, ability, component] of [
				['flygon', '0', 'Mirage Drift', 'overcoat'], ['flygon', 'H', 'Dune Caller', 'sandstream'],
				['krookodile', 'H', 'Dune Hunter', 'innerfocus'], ['dhelmise', '1', 'Blackwater Anchor', 'steelworker'],
				['dragalge', '1', 'Blackwater Venom', 'blackwatervenom'], ['espeon', '1', 'Remembered Step', 'rememberedstep'],
				['arcanine', '0', 'Remembered Flame', 'flashfire'], ['lapras', 'H', 'Storm Memory', 'stormmemory'],
				['swanna', '0', 'Jetstream Ballet', 'windrider'],
			]) {
				const species = dex.species.get(id);
				assert.equal(species.abilities[slot], ability);
				assert(dex.hasAbilityEffect(species, component), id + ': ' + component);
				assert(dex.abilities.get(ability).shortDesc.length <= 100);
			}
			const gardevoir = dex.species.get('gardevoir');
			assert.deepEqual(Array.from(gardevoir.passives), ['breakingnews']);
			assert.deepEqual(JSON.parse(JSON.stringify(gardevoir.abilities)), {0: 'Trace', 1: 'Dream Sickness', H: 'Void Veil'});
			assert(dex.hasAbilityEffect(gardevoir, 'forewarn'));
			assert(!dex.hasAbility(gardevoir, 'breakingnews'));
			assert(dex.abilities.get('breakingnews').desc.includes('opposing switch-in'));
		});
	}
	it('labels each visible battle state clearly', () => {
		const source = fs.readFileSync(path.join(client, 'src/battle-animations.ts'), 'utf8');
		for (const [id, label] of [['exposed', 'Exposed'], ['rememberedflame', 'Fire ready'], ['stormcharge', 'Electric ready']]) {
			assert(new RegExp(id + ':.*>' + label + '<').test(source));
		}
	});
});
