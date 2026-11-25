'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const BattleTooltips = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn BattleTooltips;')();

describe('Mega Greninja battle tooltip and Aegis charge', () => {
	it('shows the adaptive first hit and the stored bonus only while charged', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
			'|switch|p1a: Greninja|Greninja-Mega, L100|100/100', '|switch|p2a: Target|Mew, L100|100/100',
			'|-start|p1a: Greninja|Aegis Charge|[silent]']});
		try {
			const user = battle.p1.active[0];
			const own = {speciesForme: 'Greninja-Mega', ability: 'Aegis Tide', baseAbility: 'Aegis Tide',
				passives: [], item: '', hp: 100, maxhp: 100, level: 100,
				stats: {atk: 200, spa: 100, spe: 100, spd: 100, def: 100}};
			user.ability = own.ability;
			const tooltip = name => new BattleTooltips(battle).showMoveTooltip(Dex.moves.get(name), 'move', user, own);
			assert(user.volatiles.aegischarge);
			assert.match(require('./helpers/status-table.cjs').aegischarge, /20% power/);
			const charged = tooltip('Water Shuriken');
			assert.match(charged, /Mist Shuriken/);
			assert.match(charged, /categories\/Physical\.png/);
			assert.match(charged, /Base power: 108\b/);
			assert.match(charged, /Aegis Charge/);
			assert.match(charged, /following hit starts at 20/);
			assert.doesNotMatch(tooltip('Dark Pulse'), /Aegis Charge/);
			battle.add('|-end|p1a: Greninja|Aegis Charge|[silent]');
			battle.seekTurn(Infinity);
			assert(!user.volatiles.aegischarge);
			assert.match(tooltip('Water Shuriken'), /Base power: 90\b/);
		} finally {
			battle.destroy();
		}
	});
});
