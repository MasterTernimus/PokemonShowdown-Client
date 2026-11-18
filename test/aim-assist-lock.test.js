'use strict';
const assert = require('node:assert/strict');
require('./battle.test');

describe('Aim Assist Lock-On display', () => {
	it('adds and removes the holder badge from battle and replay messages', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9',
			'|switch|p1a: Gear|Klinklang, L100|100/100', '|switch|p2a: Target|Mew, L100|100/100',
			'|-activate|p1a: Gear|move: Lock-On|[of] p2a: Target',
			'|-start|p1a: Gear|Aim Assist Lock|[silent]']});
		try {
			const holder = battle.p1.active[0];
			assert(holder.volatiles.aimassistlock);
			assert(!battle.p2.active[0].volatiles.aimassistlock);
			battle.add('|-end|p1a: Gear|Aim Assist Lock|[silent]');
			assert(!holder.volatiles.aimassistlock);
		} finally {
			battle.destroy();
		}
	});
});
