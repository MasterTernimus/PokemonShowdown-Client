const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const client = path.resolve(__dirname, '../play.pokemonshowdown.com');

function loadDex(bundled) {
	const context = vm.createContext({Config: {}, Pokemon: class {}, BattlePokemonSprites: {}, BattlePokemonSpritesBW: {}});
	context.window = context;
	for (const [file, name] of [
		['pokedex', 'BattlePokedex'], ['abilities', 'BattleAbilities'], ['moves', 'BattleMovedex'], ['items', 'BattleItems'],
	]) {
		context[name] = JSON.parse(JSON.stringify(require(path.join(client, 'data', file))[name]));
	}
	for (const script of bundled ? ['battledata'] : ['battle-dex-data', 'battle-dex']) {
		vm.runInContext(fs.readFileSync(path.join(client, 'js', `${script}.js`), 'utf8'), context);
	}
	return context.Dex;
}

describe('Server data synchronization', () => {
	for (const bundled of [false, true]) {
		describe(bundled ? 'browser bundle' : 'individual scripts', () => {
			let dex;
			before(() => { dex = loadDex(bundled); });

			it('matches the reviewed server snapshot, including newly added abilities', () => {
				const snapshot = require('../server-data-sync-manifest.json').snapshot;
				for (const kind of ['species', 'abilities', 'moves']) {
					for (const [id, expected] of Object.entries(snapshot[kind])) {
						const actual = dex[kind].get(id);
						for (const [key, value] of Object.entries(expected)) {
							if (key === 'replaceAbilities') continue;
							const normalize = data => key === 'isNonstandard' ? data || false : JSON.parse(JSON.stringify(data));
							assert.deepEqual(normalize(actual[key]), normalize(value), `${kind}.${id}.${key}`);
						}
					}
				}
				assert.equal(dex.species.get('Sylveon').abilities[1], 'Soothing Presence');
			});

			it('resolves assigned composite abilities and their component effects', () => {
				for (const [species, ability, components] of [
					['Reuniclus-Mega', 'Adaptive Power', ['hugepower', 'magicguard', 'regenerator']],
					['Slowbro-Mega', 'Slow Clamp', ['shellarmor', 'owntempo', 'analytic', 'sweetveil']],
					['Muk-Pulse', 'Pulse Waste', ['protean', 'poisontouch', 'regenerator']],
				]) {
					assert.equal(dex.species.get(species).abilities[0], ability);
					const data = dex.abilities.get(ability);
					assert(data.exists, ability);
					assert(data.desc.length > 20, ability);
					for (const component of components) assert(dex.getAbilityEffects(data.id).has(component), `${ability}: ${component}`);
				}
			});

			it('offers the shared Mega Stones to their alternate-form users', () => {
				for (const [item, user, mega] of [
					['ampharosite', 'Ampharos-Aevian', 'Ampharos-Aevian-Mega'],
					['emboarite', 'Emboar-Reborn', 'Emboar-Mega-Reborn'],
					['froslassite', 'Froslass-Aevian', 'Froslass-Aevian-Mega'],
					['glalitite', 'Glalie-Aevian', 'Glalie-Aevian-Mega'],
					['reuniclusite', 'Reuniclus', 'Reuniclus-Mega'],
				]) {
					const data = dex.items.get(item);
					assert.equal(data.megaStone[user], mega, item);
					assert(data.itemUser.includes(user), item);
					assert(dex.species.get(mega).exists, mega);
				}
			});

			it('describes current ability triggers and charged-move effects', () => {
				assert.match(dex.abilities.get('temporalshift').desc, /turn after it uses a damaging move.*100 BP/);
				assert.match(dex.abilities.get('adaptivecell').desc, /first move slot/);
				assert.match(dex.abilities.get('eclipsevision').desc, /first move slot/);
				assert.match(dex.abilities.get('schooling').desc, /Mold Breaker/);
				assert.doesNotMatch(dex.abilities.get('schooling').desc, /Filter/);
				assert.match(dex.abilities.get('venombastion').desc, /Stamina.*poisoned foe.*higher offensive stat/);
				assert.match(dex.moves.get('skullbash').desc, /0\.7x damage/);
				assert.match(dex.moves.get('skullbash').desc, /1\/8/);
				assert.match(dex.moves.get('cut').desc, /Steel-type.*Defense boosts/);
				assert.match(dex.moves.get('lifedew').desc, /Aqua Ring.*full HP/);
			});

			it('preserves ordinary move flags when adding tail classifications', () => {
				for (const id of ['aquatail', 'bodyslam', 'breakingswipe', 'brutalswing', 'doublehit', 'dragontail',
					'flipturn', 'heavyslam', 'irontail', 'poisontail', 'slam', 'tailslap']) {
					const move = dex.moves.get(id);
					assert.equal(move.flags.tail, 1, id);
					assert.equal(move.flags.contact, 1, id);
					assert.equal(move.flags.protect, 1, id);
				}
				assert.equal(dex.moves.get('poisontail').flags.slicing, 1);
				assert.equal(dex.moves.get('tailsmash').flags.tail, 1);
			});
		});
	}
});
