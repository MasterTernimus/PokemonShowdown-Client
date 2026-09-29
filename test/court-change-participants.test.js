const assert = require('assert').strict;

global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
for (const name of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle']) {
	require('../play.pokemonshowdown.com/js/' + name);
}

function createBattle(playerCount, eliminated) {
	const log = ['|init|battle', '|gen|9', '|gametype|freeforall'];
	for (let i = 1; i <= playerCount; i++) {
		log.push(`|player|p${i}|Player ${i}|1`, `|teamsize|p${i}|1`);
	}
	log.push('|start');
	for (let i = 1; i <= playerCount; i++) {
		log.push(`|switch|p${i}a: Mew ${i}|Mew|100/100`);
	}
	log.push('|turn|1');
	if (eliminated) {
		log.push(`|faint|p${eliminated}a: Mew ${eliminated}`, `|player|p${eliminated}|`);
	}
	const conditions = ['Reflect', 'Spikes', 'Atlantis Wall', 'Light Screen'];
	for (let i = 1; i <= playerCount; i++) {
		log.push(`|-sidestart|p${i}: Player ${i}|${conditions[i - 1]}`);
	}
	log.push('|-sidestart|p2: Player 2|Spikes');
	return new Battle({debug: true, log});
}

function assertRotation(battle, order) {
	const original = battle.sides.map(side => JSON.parse(JSON.stringify(side.sideConditions)));
	battle.runMinor(['-swapsideconditions'], {});
	for (let i = 0; i < order.length; i++) {
		const target = order[(i + 1) % order.length];
		assert.deepEqual(battle.sides[target].sideConditions, original[order[i]], `conditions on p${target + 1}`);
	}
	if (order.length === 3) assert.deepEqual(battle.p4.sideConditions, {});
}

describe('Court Change free-for-all participants', () => {
	for (const playerCount of [3, 4]) {
		for (let viewpoint = 1; viewpoint <= playerCount; viewpoint++) {
			it(`rotates ${playerCount} announced players from the p${viewpoint} viewpoint`, () => {
				const battle = createBattle(playerCount);
				try {
					battle.setViewpoint(`p${viewpoint}`);
					assert.equal(battle.mySide.sideid, `p${viewpoint}`);
					assert.equal(battle.p4.name, playerCount === 4 ? 'Player 4' : '');
					assert.equal(battle.p2.sideConditions.spikes[1], 2);
					assertRotation(battle, playerCount === 3 ? [0, 1, 2] : [0, 3, 1, 2]);
				} finally {
					battle.destroy();
				}
			});
		}
		it(`keeps an eliminated and disconnected participant in a ${playerCount}-player rotation`, () => {
			const battle = createBattle(playerCount, playerCount);
			try {
				const eliminated = battle.sides[playerCount - 1];
				assert.equal(eliminated.faintCounter, eliminated.totalPokemon);
				assert.equal(eliminated.name, `Player ${playerCount}`);
				assertRotation(battle, playerCount === 3 ? [0, 1, 2] : [0, 3, 1, 2]);
			} finally {
				battle.destroy();
			}
		});
	}

	it('supports legacy four-side logs without player announcements', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gametype|freeforall']});
		try {
			battle.runMinor(['-swapsideconditions'], {});
			assert(battle.sides.every(side => !Object.keys(side.sideConditions).length));
			battle.p1.sideConditions.reflect = ['Reflect', 1, 3, 6];
			assertRotation(battle, [0, 3, 1, 2]);
		} finally {
			battle.destroy();
		}
	});
});
