'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Passive component reveals', () => {
	function parse(known, replacement) {
		const log = ['|init|battle', '|gen|9', '|gametype|singles', '|start',
			'|switch|p1a: Reporter|Gardevoir, F|291/291', '|switch|p2a: Foe|Lycanroc|100/100'];
		if (known) log.push('|-ability|p1a: Reporter|Void Veil');
		log.push('|-activate|p1a: Reporter|ability: Forewarn|Mega Kick|[of] p2a: Foe');
		if (replacement) log.push('|-ability|p1a: Reporter|Forewarn|[from] move: Skill Swap|[of] p2a: Foe');
		return new Battle({debug: true, log});
	}
	for (const known of [false, true]) it(`keeps selected ability ${known ? 'known' : 'unknown'} after passive Forewarn and replay`, () => {
		const battle = parse(known, false);
		try {
			for (let i = 0; i < 2; i++) {
				battle.seekTurn(Infinity);
				assert.equal(battle.p1.active[0].ability, known ? 'Void Veil' : '');
				assert.equal(battle.p1.active[0].baseAbility, known ? 'Void Veil' : '');
				battle.seekTurn(0);
			}
		} finally { battle.destroy(); }
	});
	it('still accepts an explicit change into a passive component ability', () => {
		const battle = parse(true, true);
		try { battle.seekTurn(Infinity); assert.equal(battle.p1.active[0].ability, 'Forewarn'); }
		finally { battle.destroy(); }
	});
});
