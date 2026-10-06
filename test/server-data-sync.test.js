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
		const dataContext = {exports: {}};
		vm.runInNewContext(fs.readFileSync(path.join(client, 'data', file + '.js'), 'utf8'), dataContext, {filename: file + '.js'});
		context[name] = JSON.parse(JSON.stringify(dataContext.exports[name]));
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
				for (const kind of ['species', 'abilities', 'moves', 'items']) {
					for (const [id, expected] of Object.entries(snapshot[kind] || {})) {
						const actual = dex[kind].get(id);
						for (const [key, value] of Object.entries(expected)) {
							if (key === 'replaceAbilities') continue;
							const normalize = data => key === 'isNonstandard' ? (kind === 'abilities' ? !!data : data || false) : JSON.parse(JSON.stringify(data));
							assert.deepEqual(normalize(actual[key]), normalize(value), `${kind}.${id}.${key}`);
						}
					}
				}
				assert.equal(dex.species.get('Sylveon').abilities[1], 'Soothing Presence');
			});

			it('keeps Skeledirge-Aevian and Glimmora-Aevian selectable with current ability slots', () => {
				for (const name of ['Skeledirge-Aevian', 'Glimmora-Aevian']) {
					assert.equal(dex.species.get(name).tier, 'OU', name);
				}
				assert.equal(dex.species.get('Skeledirge-Aevian').abilities.H, 'Venom Canticle');
				assert.equal(dex.species.get('Glimmora-Aevian').abilities[0], 'Memory Leak');
			});

			it('publishes Soul Siphon with its unique custom number and generation', () => {
				assert.equal(dex.abilities.get('Soul Siphon').num, 11232);
				assert.equal(dex.abilities.get('Soul Siphon').gen, 9);
			});
			it('adds Mold Breaker to Execution and Argent Devotion without losing their components', () => {
				for (const [id, components] of [
					['execution', ['duskilate', 'moldbreaker']],
					['argentdevotion', ['armorize', 'swornduty', 'serenegrace', 'moldbreaker']],
				]) {
					assert.match(dex.abilities.get(id).desc, /ignore(?:s)? bypassable.*abilities/);
					assert(dex.getAbilityDisplayComponents(id).includes('moldbreaker'));
					const effects = dex.getAbilityEffects(id);
					for (const component of components) assert(effects.has(component), `${id}: ${component}`);
				}
			});

			it('syncs mixed Poliwrath, Reservoir and Royal Scales components', () => {
				const p = dex.species.get('Poliwrath');
				assert.deepEqual(JSON.parse(JSON.stringify(p.abilities)), {0: 'Reservoir', 1: 'Knuckle Tide', H: 'Crosscurrent'});
				assert.equal(p.baseStats.atk, 100);
				assert.equal(p.baseStats.spa, 95);
				assert.equal(p.bst, 560);
				assert(dex.abilities.get('Reservoir').exists);
				for (const id of ['waterabsorb', 'gluttony', 'damp']) assert(dex.getAbilityEffects('reservoir').has(id), id);
				assert(dex.getAbilityEffects('royalscales').has('selfsufficient'));
				assert(dex.abilities.get('Royal Scales').desc.includes('1/16'));
			});

			it('keeps signature selector previews compact without replacing full mechanics', () => {
				for (const id of ['searescuer', 'dreepyvanguard', 'groundingtail', 'updraft', 'currentcoil', 'stillwater']) {
					const ability = dex.abilities.get(id);
					assert(ability.shortDesc.length < 100, id);
					assert.notEqual(ability.shortDesc, ability.desc, id);
				}
				const ability = dex.abilities.get('dreepyvanguard');
				assert.equal(ability.shortDesc, 'Once per entry, Dragon Darts damage breaks the matching screen.');
				assert(ability.desc.includes('after both darts finish'));
				assert(ability.desc.includes('Ability changes do not refresh'));
			});

			it('explains Soul Cremation while preserving its component identities', () => {
				const soul = dex.abilities.get('soulcremation');
				assert.equal(soul.shortDesc, 'Combines the listed abilities.'); assert(dex.getAbilityDisplayComponents('soulcremation').includes('soulsiphon'));
				for (const component of ['soulsiphon', 'soulpyre', 'malicewell', 'flamebody']) {
					assert(dex.getAbilityEffects('soulcremation').has(component), component);
				}
				assert(dex.getAbilityEffects('malicewell').has('flamebody'));
				assert.match(dex.abilities.get('malicewell').shortDesc, /first opposing damaging move each entry/);
				assert.match(dex.abilities.get('malicewell').desc, /after the entire move finishes.*Protect, misses and immunity/);
				assert.match(soul.desc, /30%.*burn|burn.*30%/);
				assert(dex.abilities.get('soulpyre').exists);
				assert.match(dex.abilities.get('soulpyre').shortDesc, /1\/8.*Ghost hits/);
			});

			if (process.env.PS_SERVER_SOURCE) it('matches every effective server display summary and full description', () => {
				const server = process.env.PS_SERVER_SOURCE;
				const authoritative = require(path.join(server, 'dist/sim/dex')).Dex;
				const display = require(path.join(server, 'dist/data/ability-display')).getAbilityDisplayComponents;
				let checked = 0;
				for (const ability of authoritative.abilities.all()) {
					if (!display(ability.id).length) continue;
					assert.equal(dex.abilities.get(ability.id).shortDesc, ability.shortDesc, ability.id + ' preview');
					assert.equal(dex.abilities.get(ability.id).desc, ability.desc, ability.id + ' full details');
					checked++;
				}
				assert(checked >= 375, 'includes all composite display entries');
			});

			it('preserves approved Wigglytuff and base Kingler updates without changing Gmax', () => {
				const plain = value => JSON.parse(JSON.stringify(value));
				const wigglytuff = dex.species.get('wigglytuff');
				assert.deepEqual(plain(wigglytuff.types), ['Normal', 'Fairy']);
				assert.deepEqual(plain(wigglytuff.baseStats), {hp: 150, atk: 50, def: 70, spa: 110, spd: 80, spe: 45});
				assert.deepEqual(plain(wigglytuff.abilities), {0: 'Fluffy', 1: 'Reinflate', H: 'Punk Rock'});
				const learns = require(path.join(client, 'data/learnsets')).BattleLearnsets;
				assert(learns.wigglytuff.learnset.roar.includes('9M'));
				assert.deepEqual(plain(dex.species.get('kingler').types), ['Water', 'Steel']);
				assert.deepEqual(plain(dex.species.get('kingler').abilities), {0: 'Shell Armor', 1: 'Titan Pincer', H: 'Shellcracker'});
				assert.deepEqual(plain(dex.species.get('kinglergmax').types), ['Water', 'Bug']);
				assert.deepEqual(plain(dex.species.get('kinglergmax').abilities), {0: 'Tidal Dominion'});
				assert.match(dex.abilities.get('reinflate').desc, /Once per turn.*finishes.*actual HP damage.*remains active and survives/);
				assert.match(dex.abilities.get('reinflate').shortDesc, /1\/8/);
				assert.match(dex.abilities.get('titanpincer').desc, /Crabhammer and physical Steel-type moves.*Defense.*higher/);
				assert(dex.getAbilityEffects('titanpincer').has('hypercutter'));
			});

			it('loads real Swalot-Pulse data and Anomaly Core routing', () => {
				const swalot = dex.species.get('swalotpulse');
				assert(swalot.exists);
				assert.deepEqual(JSON.parse(JSON.stringify(swalot.types)), ['Water', 'Poison']);
				assert.equal(swalot.bst, 630);
				assert.equal(swalot.abilities[0], 'Pulse Filtration');
				assert.equal(swalot.changesFrom, 'Swalot');
				assert.equal(dex.items.get('anomalycore').megaStone.Swalot, 'Swalot-Pulse');
				assert(dex.abilities.get('pulsefiltration').exists);
			});

			if (process.env.PS_SERVER_SOURCE) it('matches current batch species without applying blocked proposals', () => {
				const authoritative = require(path.join(process.env.PS_SERVER_SOURCE, 'dist/sim/dex')).Dex;
				for (const id of ['persian', 'kingdra', 'ampharos', 'ampharosmega', 'bellossom', 'corsola', 'octillery', 'slaking', 'swalotpulse', 'cameruptpulse', 'houndoom', 'houndoommega', 'victreebelmega', 'masquerain', 'miltank']) {
					for (const key of ['types', 'baseStats', 'abilities']) {
						assert.deepEqual(JSON.parse(JSON.stringify(dex.species.get(id)[key])), JSON.parse(JSON.stringify(authoritative.species.get(id)[key])), id + '.' + key);
					}
				}
				const learns = require(path.join(client, 'data/learnsets')).BattleLearnsets;
				assert(learns.octillery.learnset.trickroom);
			});

			it('loads actual Camerupt-Pulse stats, item routing, and preserves absent blocked forms', () => {
				const form = dex.species.get('cameruptpulse');
				assert(form.exists);
				assert.deepEqual(JSON.parse(JSON.stringify(form.types)), ['Fire', 'Ghost']);
				assert.deepEqual(JSON.parse(JSON.stringify(form.baseStats)), {hp: 1, atk: 10, def: 10, spa: 170, spd: 10, spe: 10});
				assert.equal(form.abilities[0], 'Pulse Eruption');
				assert.equal(dex.items.get('anomalycore').megaStone.Camerupt, 'Camerupt-Pulse');
				assert(dex.items.get('anomalycore').itemUser.includes('Camerupt'));
				for (const [id, types, stats, ability, bst] of [
					['avaluggpulse', ['Ice'], [105, 145, 210, 44, 140, 10], 'Pulse Blockade', 654],
					['magnezonepulse', ['Electric', 'Steel'], [100, 70, 145, 175, 120, 60], 'Pulse Triad', 670],
					['mrmimepulse', ['Ghost', 'Dark'], [85, 45, 110, 100, 140, 90], 'Pulse Bulwark', 570],
				]) {
					const species = dex.species.get(id);
					assert(species.exists, id);
					assert.deepEqual(JSON.parse(JSON.stringify(species.types)), types, id);
					assert.deepEqual(Object.values(JSON.parse(JSON.stringify(species.baseStats))), stats, id);
					assert.equal(species.abilities[0], ability, id);
					assert.equal(species.bst, bst, id);
				}
				const core = dex.items.get('anomalycore');
				for (const [base, form] of [['Avalugg', 'Avalugg-Pulse'], ['Avalugg-Hisui', 'Avalugg-Pulse'], ['Magnezone', 'Magnezone-Pulse'], ['Mr. Mime', 'Mr. Mime-Pulse']]) {
					assert.equal(core.megaStone[base], form);
					assert(core.itemUser.includes(base));
				}
				assert.equal(dex.abilities.get('holycow').num, 11226);
				assert.notEqual(dex.abilities.get('holycow').num, dex.abilities.get('agonyflame').num);
				assert(!dex.getAbilityEffects('nightmarepulse').has('infiltrator'));
				for (const component of ['hydrabond', 'levitate', 'clearbody']) assert(dex.getAbilityEffects('pulsetriad').has(component));
				const learns = require(path.join(client, 'data/learnsets')).BattleLearnsets;
				assert(learns.mrmime.learnset.darkpulse);
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
				assert.match(dex.abilities.get('venombastion').desc, /raises Defense by 1.*poisoned foe.*higher offensive stat/);
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
