'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path');
require('./battle.test');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
const {BattleTooltips} = new Function(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-tooltips.js'), 'utf8') + '\nreturn {BattleTooltips};')();
describe('Exalted Aether move preview', () => {
	it('explains converted and Dragon strikes, preserves contact, and excludes special/charging moves and suppression', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Salamence|Salamence-Mega, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
		try {
			const p = battle.p1.active[0], own = {speciesForme: 'Salamence-Mega', ability: 'Exalted Aether', baseAbility: 'Exalted Aether', passives: ['aerilate'], item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
			p.ability = 'Exalted Aether'; const tips = new BattleTooltips(battle);
			const preview = id => tips.showMoveTooltip(Dex.moves.get(id), 'move', p, own);
			for (const id of ['doubleedge', 'dragonclaw']) {
				const text = preview(id); assert(text.includes('Exalted Aether: two strikes')); assert(text.includes('25% damage')); assert(text.includes('12.5%')); assert(text.includes('Contact <small>')); assert(text.includes('Defensive screens apply normally to both strikes'));
			}
			for (const id of ['dragonpulse', 'fly', 'scaleshot']) assert(!preview(id).includes('Exalted Aether: two strikes'));
			p.volatiles.gastroacid = ['gastroacid']; assert(!preview('doubleedge').includes('Exalted Aether: two strikes'));
		} finally { battle.destroy(); }
	});
});
