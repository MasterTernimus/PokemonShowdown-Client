'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('./battle.test');
const {PokemonSprite} = new Function('$', 'window', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations.js', 'utf8') +
	'\nreturn {PokemonSprite};')({easing: {}}, {});
const {DexSearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') +
	'\nreturn {DexSearch};')();

describe('Fire Boost and move updates', () => {
	it('shows a single Fire Boost through Mega Evolution and clears it when the holder switches out', () => {
		const b = new Battle({debug: true, log: ['|gen|9', '|switch|p1a: Houndoom|Houndoom|100/100']});
		try {
			const p = b.p1.active[0];
			const badge = () => Object.keys(p.volatiles).map(id => PokemonSprite.getEffectTag(id)).join('');
			assert(!badge().includes('Fire&nbsp;Boost'));
			b.runMinor(['-start', 'p1a: Houndoom', 'ability: Flash Fire'], {});
			assert(badge().includes('Fire&nbsp;Boost'));
			b.runMinor(['detailschange', 'p1a: Houndoom', 'Houndoom-Mega'], {});
			b.runMinor(['-mega', 'p1a: Houndoom', 'Houndoom', 'Houndoominite'], {});
			assert.equal(badge().split('Fire&nbsp;Boost').length - 1, 1);
			b.runMajor(['switch', 'p1a: Mew', 'Mew', '100/100'], {});
			assert(!badge().includes('Fire&nbsp;Boost'));
		} finally { b.destroy(); }
	});

	const grants = {
		psychup: 'alakazam starmie mrmime mawile altaria castform absol roserade weavile rotom rotomheat rotomwash rotomfrost rotomfan rotommow liepard musharna audino cofagrigus slurpuff drampa annihilape',
		slackoff: 'emboar', roost: 'beedrill hydreigon', tailwind: 'emolga', wonderroom: 'umbreon',
		playrough: 'vaporeon jolteon flareon espeon umbreon leafeon glaceon',
	};
	for (const [move, users] of Object.entries(grants)) {
		it('lists ' + move + ' as legal for its requested users', () => {
			for (const id of users.split(' ')) {
				const search = new DexSearch('move', 'gen9nofieldsinglesgame', id);
				search.find('');
				assert(search.results.some(row => row[0] === 'move' && row[1] === move), id);
				assert(!search.illegalLabel(move), id);
			}
		});
	}
	it('shows the updated move accuracy and flinch chance', () => {
		for (const id of ['screech', 'metalsound', 'steelwing', 'frostbreath']) assert.equal(Dex.moves.get(id).accuracy, 100);
		assert.equal(Dex.moves.get('rockslide').accuracy, 95);
		assert.deepEqual(Dex.moves.get('rockslide').secondaries, [{chance: 20, volatileStatus: 'flinch'}]);
	});
});
