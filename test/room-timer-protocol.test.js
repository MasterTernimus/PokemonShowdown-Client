'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Authoritative Room and Gravity timers', () => {
	let battle;
	beforeEach(() => { battle = new Battle({debug: true}); });
	afterEach(() => { battle.destroy(); });
	for (const [id, name] of [['trickroom', 'Trick Room'], ['magicroom', 'Magic Room'], ['wonderroom', 'Wonder Room'], ['gravity', 'Gravity']]) {
		it(`keeps ${name} paused on the Cold Eclipse expiry turn, then resumes`, () => {
			battle.run(`|-fieldstart|move: ${name}|[turns] 5`);
			battle.run('|-fieldstart|Cold Eclipse Terrain|[turns] 1');
			battle.run('|-fieldend|Cold Eclipse Terrain');
			battle.run(`|upkeep|[roomturns] ${JSON.stringify({[id]: 5})}`);
			assert.deepEqual(battle.pseudoWeather.find(state => state[0] === name), [name, 5, 5]);
			battle.run('|turn|2');
			assert.equal(battle.pseudoWeather.find(state => state[0] === name)[1], 5);
			battle.run(`|upkeep|[roomturns] ${JSON.stringify({[id]: 4})}`);
			assert.equal(battle.pseudoWeather.find(state => state[0] === name)[1], 4);
			battle.run(`|-fieldend|move: ${name}`);
			battle.run('|upkeep');
			assert(!battle.pseudoWeather.some(state => state[0] === name));
		});
	}
	it('updates independent timers without pausing Aura countdowns', () => {
		battle.run('|-fieldstart|move: Trick Room|[turns] 8');
		battle.run('|-fieldstart|move: Gravity|[turns] 3');
		battle.run('|-fieldstart|Frozen Aura|[aura] 4');
		battle.run('|upkeep|[roomturns] {"trickroom":8,"gravity":3}');
		assert.equal(battle.pseudoWeather.find(state => state[0] === 'Trick Room')[1], 8);
		assert.equal(battle.pseudoWeather.find(state => state[0] === 'Gravity')[1], 3);
		assert.equal(battle.pseudoWeather.find(state => state[0] === 'Frozen Aura')[1], 3);
	});
	for (const metadata of ['', 'not-json', 'null', '[]', '{"trickroom":-1}', '{"trickroom":"5"}', '{"trickroom":1.5}']) {
		it(`handles old or malformed timer metadata: ${metadata || 'absent'}`, () => {
			battle.run('|-fieldstart|move: Trick Room|[turns] 5');
			battle.run('|upkeep' + (metadata ? '|[roomturns] ' + metadata : ''));
			assert.equal(battle.pseudoWeather.find(state => state[0] === 'Trick Room')[1], 4);
		});
	}
	if (process.env.PS_SERVER_SOURCE) {
		it('replays actual server expiry/upkeep messages with matching room durations', () => {
			const path = require('path');
			// Use the engine directly: the server test helper patches Node's shared assert object.
			const {Battle: ServerBattle} = require(path.join(process.env.PS_SERVER_SOURCE, 'dist/sim'));
			for (const id of ['trickroom', 'magicroom', 'wonderroom', 'gravity']) {
				const server = new ServerBattle({
					formatid: 'gen9nofieldsinglesgame', debug: true, strictChoices: true,
					seed: [0x09917, 0x06924, 0x0e1c8, 0x06af0],
					p1: {team: [{species: 'Mew', ability: 'No Ability', moves: ['celebrate']}]},
					p2: {team: [{species: 'Mew', ability: 'No Ability', moves: ['celebrate']}]},
				});
				let cursor = 0;
				const replay = () => {
					for (const line of server.log.slice(cursor)) {
						if (/^\|(?:-fieldstart|-fieldend|upkeep|turn)(?:\||$)/.test(line)) battle.run(line);
					}
					cursor = server.log.length;
					const displayed = battle.pseudoWeather.find(state => toID(state[0]) === id);
					assert.equal(displayed?.[1], server.field.pseudoWeather[id]?.duration, id);
				};
				try {
					server.makeChoices('team 1', 'team 1');
					const pokemon = server.p1.active[0];
					server.field.addPseudoWeather(id, pokemon);
					server.field.setFieldOrAura('coldeclipseterrain', 1, pokemon, server.dex.moves.get('celebrate'), true);
					replay();
					for (let turn = 0; turn < 6; turn++) { server.makeChoices(); replay(); }
				} finally { server.destroy(); }
			}
		});
	}
});
