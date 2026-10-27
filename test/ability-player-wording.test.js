'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Current-effect ability wording in the client', () => {
	const {Dex, BattlePokedex} = loadDex();
	const snapshot = require('../server-data-sync-manifest.json').snapshot;
	const obsolete = /no longer (?:includes|cures|blocked)|Mind's Eye gives no healing|This passive does not include|Replaces Shield Dust|No (?:Merciless critical-hit bonus|Berserk boosts|Wind Rider boosts)|(?:is supplied (?:separately )?by|is a separate species passive)/i;
	function check(text, label) {
		assert(text.desc?.trim(), label + ' full description');
		assert(text.shortDesc?.trim(), label + ' summary');
		assert.doesNotMatch(text.desc + ' ' + text.shortDesc, obsolete, label);
	}
	it('shows current effects for every synced ability and passive variant', () => {
		for (const id of Object.keys(snapshot.abilities)) {
			check(Dex.abilities.get(id), id);
			check(Dex.getPassiveAbilityDetails(id), id + ' passive');
		}
	});
	it('keeps species-specific tooltip overrides free of removed-effect notes', () => {
		for (const id of Object.keys(BattlePokedex)) {
			const species = Dex.species.get(id);
			if (!species.exists) continue;
			for (const ability of Object.values(species.abilities)) {
				const selected = Dex.abilities.get(ability);
				if (!selected.exists) continue;
				const details = Dex.getAbilityDisplayDetails(selected, species.passives, id);
				check(details, `${id}: ${ability}`);
			}
		}
	});
	it('retains current healing and target restrictions while removing Mind’s Eye change commentary', () => {
		assert.doesNotMatch(Dex.abilities.get('aevianascendance').desc, /gives no healing|slots are unchanged/);
		assert.match(Dex.abilities.get('aevianascendance').desc, /1\/4.*1\/16/);
		assert.match(Dex.abilities.get('exaltedaether').desc, /Substitute damage and allied damage do not heal/);
		assert.match(Dex.abilities.get('deltastream').desc, /no longer active/);
	});
});
