'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const ts = require('typescript');
const context = require('./helpers/isolated-dex.cjs')();
context.BattleAliases = JSON.parse(JSON.stringify(require('../play.pokemonshowdown.com/data/aliases').BattleAliases));
context.BattleTeambuilderTable = JSON.parse(JSON.stringify(require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable));
const {Dex} = context;

function loadBattle() {
	if (context.Battle) return;
	for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle', 'battle-tooltips']) {
		vm.runInContext(fs.readFileSync('play.pokemonshowdown.com/js/' + file + '.js', 'utf8'), context);
	}
}

function battle() {
	loadBattle();
	return new context.Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
		'|switch|p1a: Milotic|Milotic-Terajuma, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
}

function storage() {
	const source = fs.readFileSync('play.pokemonshowdown.com/js/storage.js', 'utf8');
	const tree = ts.createSourceFile('storage.js', source, ts.ScriptTarget.Latest, true);
	const names = ['setInitialDisguise', 'getInitialDisguiseSlot', 'bindInitialDisguises', 'packTeam', 'unpackTeam'];
	const sandbox = vm.createContext({Storage: {}, Dex, toID: value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')});
	for (const statement of tree.statements) {
		if (ts.isExpressionStatement(statement) && ts.isBinaryExpression(statement.expression) &&
			names.includes(statement.expression.left.getText().replace('Storage.', ''))) {
			vm.runInContext(statement.getText(), sandbox);
		}
	}
	return sandbox.Storage;
}

describe('Twilight Instinct and Dusk Ego client compatibility', () => {
	it('resolves old and new ability names to one stable identity and current display name', () => {
		const legacy = Dex.abilities.get('Dusk Drive');
		const current = Dex.abilities.get('Dusk Ego');
		assert.equal(current, legacy);
		assert.equal(current.id, 'duskdrive');
		assert.equal(current.name, 'Dusk Ego');
		assert(current.exists);
		assert.equal(Dex.mod('gen8').abilities.get('Dusk Ego').id, 'duskdrive');
		assert.equal(Dex.mod('gen8').abilities.get('Dusk Drive').name, 'Dusk Ego');
		assert.equal(Dex.species.get('Lycanroc-Dusk').abilities.H, 'Dusk Ego');
	});
	it('round trips legacy and current packed sets without losing the ability', () => {
		const S = storage();
		for (const ability of ['Dusk Drive', 'Dusk Ego']) {
			const packed = S.packTeam([{species: 'Lycanroc-Dusk', ability, moves: ['Rock Slide']}]);
			const restored = S.unpackTeam(packed)[0];
			assert.equal(restored.ability, 'Dusk Ego');
			assert.equal(Dex.abilities.get(restored.ability).id, 'duskdrive');
		}
	});
	it('shows the revised components without retaining Battle Fervor on Twilight Instinct', () => {
		const twilight = Dex.getAbilityEffects('twilightinstinct');
		assert(twilight.has('ultrainstinct'));
		assert(twilight.has('keeneye'));
		assert(!twilight.has('battlefervor'));
		assert(!Dex.abilities.get('twilightinstinct').desc.includes('Battle Fervor'));
		assert.deepEqual(Array.from(Dex.getAbilityDisplayComponents('twilightinstinct')), ['ultrainstinct', 'keeneye']);
		for (const name of ['Dusk Drive', 'Dusk Ego']) {
			assert(Dex.getAbilityEffects(name).has('opportunist'));
			assert(Dex.getAbilityEffects(name).has('ultraego'));
		}
	});
	it('finds the current ability by partial display name and the legacy exact name', () => {
		Object.assign(context, require('../play.pokemonshowdown.com/data/search-index'));
		vm.runInContext(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') +
			'\nthis.TestDexSearch = DexSearch;', context);
		const aliases = context.BattleSearchIndex.filter(row => row[0] === 'duskego' && row[1] === 'ability');
		assert.equal(aliases.length, 1);
		assert.equal(context.BattleSearchIndex[aliases[0][2]][0], 'duskdrive');
		for (const query of ['dusk e', 'Dusk Ego', 'Dusk Drive']) {
			const search = new context.TestDexSearch();
			search.find(query);
			assert(search.results.some(row => row[0] === 'ability' && row[1] === 'duskdrive'), query);
		}
		const picker = new context.TestDexSearch('ability', 'gen9ou', 'lycanrocdusk');
		const rows = picker.typedSearch.getBaseResults();
		assert(rows.some(row => row[0] === 'ability' && row[1] === 'duskdrive'));
		assert(!rows.some(row => row[0] === 'ability' && row[1] === 'duskego'));
	});
	it('keeps the composite identity when its component activates in battle', () => {
		const b = battle();
		try {
			const pokemon = b.p1.active[0];
			for (const [name, components] of [
				['Dusk Drive', ['Opportunist', 'Ultra Ego']],
				['Dusk Ego', ['Opportunist', 'Ultra Ego']],
				['Tidal Poise', ['Whiplash', 'Own Tempo']],
			]) {
				pokemon.ability = ''; pokemon.baseAbility = '';
				pokemon.rememberAbility(name);
				for (const component of components) pokemon.rememberAbility(component);
				assert.equal(pokemon.ability, Dex.abilities.get(name).name);
				assert.equal(pokemon.effectiveAbility(), Dex.abilities.get(name).name);
			}
		} finally { b.destroy(); }
	});
	it('retains calculator component descriptions for renamed abilities', () => {
		const source = fs.readFileSync('play.pokemonshowdown.com/js/client-mainmenu.js', 'utf8');
		const tree = ts.createSourceFile('client-mainmenu.js', source, ts.ScriptTarget.Latest, true);
		let refresh;
		function visit(node) {
			if (!refresh && ts.isPropertyAssignment(node) && node.name.getText() === 'refreshActors') {
				refresh = node.initializer.getText();
			}
			ts.forEachChild(node, visit);
		}
		visit(tree);
		assert(refresh);
		for (const ability of ['Dusk Drive', 'Dusk Ego']) {
			const outputs = {};
			const values = {'[name=species]': 'Lycanroc-Dusk', '[name=ability]': ability};
			const actor = {attr: () => '0', find(selector) {
				return {val: () => values[selector] || '', html() {}, remove() {}, append() {}, toggle() {},
					text(value) { outputs[selector] = value; }};
			}};
			const sandbox = vm.createContext({Dex, $: value => value, toID: context.toID});
			const run = vm.runInContext('(' + refresh + ')', sandbox);
			run.call({metadata: {abilityComponents: {duskdrive: ['Opportunist', 'Ultra Ego']}},
				$: () => ({each(callback) { callback.call(actor); }}), escape: String, updateCalcStatSummary() {}});
			assert.equal(outputs['.calc-components'], 'Components: Opportunist · Ultra Ego. Each effect has its own conditions.');
		}
	});
});

describe('Tidal Poise client parity', () => {
	it('gives only Milotic-Terajuma its new Whiplash and Own Tempo ability', () => {
		const species = Dex.species.get('Milotic-Terajuma');
		assert.deepEqual(JSON.parse(JSON.stringify(species.abilities)), {0: 'Prism Scale', 1: 'Tidal Poise', H: 'Queenly Majesty'});
		assert.deepEqual(Array.from(species.passives), ['marvelscale']);
		assert(!Object.values(Dex.species.get('Milotic').abilities).includes('Tidal Poise'));
		const ability = Dex.abilities.get('Tidal Poise');
		assert.equal(ability.num, 12062);
		assert(ability.exists);
		assert.deepEqual(Array.from(Dex.getAbilityDisplayComponents('tidalpoise')), ['whiplash', 'owntempo']);
		assert(Dex.getAbilityEffects('tidalpoise').has('whiplash'));
		assert(Dex.getAbilityEffects('tidalpoise').has('owntempo'));
		assert.match(ability.shortDesc, /Whiplash \+ Own Tempo/);
		assert.match(ability.desc, /\+1 accuracy on entry/);
		assert.match(ability.desc, /confusion/);
	});
	it('previews Whiplash tail power and respects ability suppression', () => {
		const b = battle();
		try {
			const pokemon = b.p1.active[0];
			const own = {speciesForme: 'Milotic-Terajuma', ability: 'Tidal Poise', baseAbility: 'Tidal Poise',
				item: '', hp: 100, maxhp: 100, level: 100, status: '',
				stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
			const tips = new context.BattleTooltips(b);
			const move = Dex.moves.get('Aqua Tail');
			assert(move.flags.tail || move.flags.tailmove);
			const power = () => tips.getMoveBasePower(move, move.type,
				new context.ModifiableValue(b, pokemon, own), b.p2.active[0]).value;
			assert.equal(power(), move.basePower * 1.5);
			pokemon.volatiles.gastroacid = ['gastroacid'];
			assert.equal(power(), move.basePower);
		} finally { b.destroy(); }
	});
});
