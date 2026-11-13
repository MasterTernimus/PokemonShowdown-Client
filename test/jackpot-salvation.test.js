'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');

describe('Jackpot and Salvation metadata', () => {
	it('publishes the approved slots and preserves ordinary Audino', () => {
		assert.equal(Dex.species.get('pangoro').abilities[0], 'Hot Streak');
		assert.equal(Dex.species.get('musharna').abilities.H, 'False Salvation');
		assert.equal(Dex.species.get('musharna').abilities.S, 'Aevian Dream');
		assert.deepEqual(Dex.species.get('audinomega').passives, ['friendguard']);
		assert.deepEqual(Dex.species.get('audino').passives, ['sweetveil']);
	});
	it('exposes the nested components without the old Divine Intervention package', () => {
		assert.deepEqual(Dex.getAbilityDisplayComponents('hotstreak'), ['superluck']);
		assert.deepEqual(Dex.getAbilityDisplayComponents('falsesalvation'), ['telepathy']);
		const effects = [...Dex.getAbilityEffects('divineintervention')];
		for (const id of ['vitalsigns', 'invigorate', 'falsesalvation', 'telepathy', 'regenerator']) assert(effects.includes(id), id);
		for (const id of ['triage', 'friendguard']) assert(!effects.includes(id), id);
		assert.match(Dex.abilities.get('hotstreak').desc, /20%/);
		assert.match(Dex.abilities.get('hotstreak').desc, /four turns/);
		assert.match(Dex.abilities.get('falsesalvation').desc, /At full HP/);
	});
	it('provides a compact active Jackpot label', () => {
		const source = fs.readFileSync(path.resolve(__dirname, '../play.pokemonshowdown.com/src/battle-animations.ts'), 'utf8');
		assert.match(source, /jackpot: '<span[^\n]+>Jackpot<\/span>/);
	});
	it('tracks Jackpot and cleansed conditions without changing Hot Streak', () => {
		const battle = new Battle({debug: true, log: [
			'|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Pangoro|Pangoro, L100|100/100',
		]});
		try {
			const pokemon = battle.p1.active[0]; pokemon.ability = 'Hot Streak';
			for (const condition of ['Leech Seed', 'Curse', 'Jackpot']) battle.runMinor(['-start', 'p1a: Pangoro', condition], {});
			assert(pokemon.volatiles.jackpot);
			for (const condition of ['Leech Seed', 'Curse']) battle.runMinor(['-end', 'p1a: Pangoro', 'move: ' + condition], {silent: '.'});
			assert(!pokemon.volatiles.leechseed); assert(!pokemon.volatiles.curse);
			battle.runMinor(['-end', 'p1a: Pangoro', 'Jackpot'], {});
			assert(!pokemon.volatiles.jackpot); assert.equal(pokemon.ability, 'Hot Streak');
		} finally { battle.destroy(); }
	});
});
