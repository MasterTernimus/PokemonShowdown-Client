'use strict';
const assert = require('node:assert/strict');
require('./battle.test');

describe('Legendary roster and Deoxys transformations', () => {
	it('shows Alien Genome forms and selects their front and back sprites', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9',
			'|switch|p1a: DNA|Deoxys|100/100', '|switch|p2a: Mew|Mew|100/100']});
		try {
			const holder = battle.p1.active[0];
			for (const name of ['Deoxys-Speed', 'Deoxys-Defense', 'Deoxys-Attack', 'Deoxys']) {
				battle.add('|-formechange|p1a: DNA|' + name + '|[from] ability: Alien Genome');
				assert.equal(holder.getSpeciesForme(), name);
				for (const front of [true, false]) {
					const sprite = Dex.getSpriteData(holder, front, {gen: 9});
					assert(sprite.url.includes('/' + name.toLowerCase() + '.'), sprite.url);
				}
			}
		} finally {
			battle.destroy();
		}
	});
	it('shows Levitate as a component of all three passive Gifts', () => {
		for (const name of ['giftofknowledge', 'giftofemotion', 'giftofwill']) {
			assert(Dex.getPassiveAbilityEffects(name).has('levitate'), name);
		}
	});
});
