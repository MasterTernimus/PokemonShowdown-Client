'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Illusion health and ability display', () => {
	for (const ability of ['', 'Opportunist', 'Perfect Illusion', 'Illusion']) {
		it(`reveals without changing ${ability || 'unknown'} selected ability, including replay seeks`, () => {
			const log = ['|init|battle', '|gen|9', '|gametype|singles', '|start',
				'|switch|p1a: Zoroark|Zoroark, M|125/251 tox'];
			if (ability) log.push('|-ability|p1a: Zoroark|' + ability);
			log.push('|switch|p1a: Mew|Mew|50/100 tox',
				'|-damage|p1a: Mew|42/100 tox|[from] psn',
				'|replace|p1a: Zoroark|Zoroark, M', '|-end|p1a: Zoroark|Illusion',
				'|-damage|p1a: Zoroark|42/100 tox|[silent]');
			const battle = new Battle({debug: true, log});
			try {
				for (let i = 0; i < 2; i++) {
					battle.seekTurn(Infinity);
					const holder = battle.p1.active[0];
					assert.equal(holder.ability, ability);
					assert.equal(holder.hp, 42);
					assert.equal(holder.status, 'tox');
					battle.seekTurn(0);
				}
			} finally { battle.destroy(); }
		});
	}
});
