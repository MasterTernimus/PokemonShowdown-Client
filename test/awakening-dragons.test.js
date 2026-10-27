'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');
describe('Approved Awakening dragon client data', () => {
	const {Dex} = loadDex();
	it('shows Rightful Exalt and both components on regular Salamence', () => {
		assert.equal(Dex.species.get('Salamence').abilities.H, 'Rightful Exalt');
		const effects = Dex.getAbilityEffects('rightfulexalt');
		assert(effects.has('serenegrace')); assert(effects.has('innerfocus'));
		assert(/critical-hit/.test(Dex.abilities.get('rightfulexalt').desc));
	});
	it('shows Free Flight as Wind Power and Moxie, including passive component lookup', () => {
		const effects = Dex.getPassiveAbilityEffects('freeflight');
		assert(effects.has('windpower')); assert(effects.has('moxie'));
		assert(/Wind Power/.test(Dex.abilities.get('freeflight').desc));
		assert(!/can switch despite/.test(Dex.abilities.get('freeflight').desc));
	});
	it('shows Exalted Aether and preserves Hydreigon’s existing ability', () => {
		assert.equal(Dex.species.get('Salamence-Mega').abilities[0], 'Exalted Aether');
		assert(/12\.5%/.test(Dex.abilities.get('exaltedaether').desc));
		assert(/25%/.test(Dex.abilities.get('exaltedaether').desc));
		assert(/Defensive screens apply normally/.test(Dex.abilities.get('exaltedaether').desc));
		assert.equal(Dex.species.get('Hydreigon').abilities.H, 'False Liberation');
		assert.equal(Dex.species.get('Hydreigon-Mega').abilities[0], 'Expiration');
	});
	it('removes Salamence lunar moves from the teambuilder without removing them globally', () => {
		const table = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
		for (const id of ['salamence', 'salamencemega']) {
			assert(!table.learnsets[id]?.bloodmoon); assert(!table.learnsets[id]?.moongeistbeam);
		}
		assert(table.learnsets.lunala.moongeistbeam); assert(table.learnsets.ursalunabloodmoon.bloodmoon);
	});
});
