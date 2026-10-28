'use strict';
const assert = require('assert').strict;
const {Dex} = require('./helpers/isolated-dex.cjs')();

describe('Grace support descriptions', () => {
	it('shows plain Serene Grace without charging or the old cap', () => {
		const ability = Dex.abilities.get('serenegrace');
		assert.equal(ability.shortDesc, 'Doubles secondary-effect chances.');
		assert(ability.desc.includes('100%'));
		assert(!/charge|charging|60%/i.test(ability.desc));
	});
	it('shows Fortunate Wing ally support and its retained critical-hit reward', () => {
		const ability = Dex.abilities.get('fortunatewing');
		assert(ability.desc.includes('Active allies gain Serene Grace'));
		assert(ability.desc.includes('5 turns of Safeguard'));
		assert(ability.shortDesc.includes('allies gain Serene Grace'));
	});
	it('shows Void Omen confusion immunity and its separate charge allowance', () => {
		const ability = Dex.abilities.get('voidomen');
		assert(ability.desc.includes('cannot become confused'));
		assert(ability.desc.includes('The user has Serene Grace.'));
		assert(!ability.desc.includes('allies gain Serene Grace'));
		assert(!ability.shortDesc.includes('shares Serene Grace'));
		assert(ability.desc.includes('one charge turn per switch-in'));
		assert(!ability.desc.includes('60%'));
	});
	it('removes inherited charging claims from composite descriptions', () => {
		for (const id of ['falsedevotion', 'truedevotion', 'encorearia']) {
			assert(!/removes charge|Skips move charge|up to 60%/i.test(Dex.abilities.get(id).desc), id);
		}
	});
});
