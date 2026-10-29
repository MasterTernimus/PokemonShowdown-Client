'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const loadDex = require('./helpers/isolated-dex.cjs');
const context = loadDex();
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
context.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables.js').BattleTeambuilderTable;
for (let gen = 1; gen <= 9; gen++) {
	const table = context.BattleTeambuilderTable['gen' + gen] = context.BattleTeambuilderTable.gen9natdex;
	for (const key of ['overrideAbilityData', 'overrideItemDesc', 'overrideMoveData', 'overrideSpeciesData', 'overrideTypeChart', 'removeType']) table[key] ||= {};
}
vm.runInContext(fs.readFileSync(path.join(root, 'js/battle-dex-search.js'), 'utf8'), context);
describe('Alakazam-Rejuv client', () => {
	it('selecting Aevian Discipline previews Rejuv with its stats and passive', () => {
		const {Dex} = context;
		assert.equal(Dex.getRegionalAbilityForm({species:'Alakazam', ability:'Aevian Discipline'}), 'Alakazam-Rejuv');
		assert.equal(Dex.getRegionalAbilityForm({species:'Alakazam-Rejuv', ability:'Magic Guard'}), 'Alakazam');
		const p = Dex.species.get('alakazamrejuv');
		assert.equal(p.bst, 558); assert.deepEqual([...p.types], ['Fighting']);
		assert.deepEqual([...p.passives], ['composed']);
		assert.deepEqual(Object.values(p.abilities), ['Aevian Discipline']);
	});
	it('describes defensive Composed and recognizes its Inner Focus and Magic Guard components', () => {
		const {Dex} = context, p = Dex.species.get('alakazamrejuv');
		const composed = Dex.getPassiveAbilityDetails('composed');
		assert.match(composed.shortDesc, /Physical damage taken: 0\.8x/);
		assert.match(composed.shortDesc, /Inner Focus \+ Magic Guard/);
		assert(!/1\.25x|25% more/.test(composed.desc + composed.shortDesc));
		for (const component of ['innerfocus', 'magicguard']) {
			assert(Dex.getPassiveAbilityEffects('composed').has(component));
			assert(Dex.hasAbilityEffect(p, component));
		}
		assert.deepEqual([...Dex.getAbilityDisplayComponents('aeviandiscipline')], ['ironfist', 'owntempo']);
	});
	it('shows exactly 132 allowed moves and marks Protect illegal', () => {
		const result = vm.runInContext(`(() => {
			const s = new BattleMoveSearch('move', 'gen9nofieldsinglesgame', {species:'Alakazam', ability:'Aevian Discipline', moves:[]});
			return {moves:s.getBaseResults().filter(r => r[0] === 'move').map(r => r[1]), protect:s.canLearn('alakazam','protect'), punch:s.canLearn('alakazam','drainpunch')};
		})()`, context);
		assert.equal(result.moves.length, 132);
		assert(result.moves.includes('hiddenpower')); assert(result.moves.includes('stackingshot'));
		assert.equal(result.protect, false); assert.equal(result.punch, true);
	});
	for (const shiny of [false, true]) for (const front of [false, true]) it(`uses supplied ${shiny ? 'shiny' : 'normal'} ${front ? 'front' : 'back'}`, () => {
		const data = context.Dex.getSpriteData('Alakazam-Rejuv', front, {gen:5, shiny});
		assert(data.url.includes('alakazam-rejuv.png'), data.url);
		const file = path.join(root, data.url.slice(data.url.indexOf('sprites/')).split('?')[0]);
		assert(fs.existsSync(file), file);
		assert(data.w <= 192 && data.h <= 192, JSON.stringify(data));
		assert(context.Dex.getPokemonIcon({species:'Alakazam-Rejuv', shiny}).includes('pokemonicons/alakazam-rejuv' + (shiny ? '-shiny' : '') + '.png'));
	});
});
