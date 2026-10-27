'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();

describe('Nature Power live client display', () => {
	let battle;
	beforeEach(() => { battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Mew|Mew, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']}); });
	afterEach(() => battle.destroy());
	for (const field of BattleFieldRules) it('resolves exported field ' + field.name, () => {
		battle.pseudoWeather = [[field.name, 0, 0]];
		assert.equal(BattleTooltips.getNaturePowerMove(battle).id, BattleNaturePowerMoves[field.id]);
	});
	it('uses Frozen Aura before the field and ignores other aura conversions', () => {
		battle.pseudoWeather = [['Burning Terrain', 0, 0], ['Frozen Aura', 3, 0]];
		assert.equal(BattleTooltips.getNaturePowerMove(battle).id, 'icebeam');
		battle.pseudoWeather[1] = ['Electric Aura', 3, 0];
		assert.equal(BattleTooltips.getNaturePowerMove(battle).id, 'flamethrower');
	});
	it('updates after public field transitions and removal without cached results', () => {
		for (const [field, expected] of [['Misty Terrain', 'mistball'], ['Flower Garden 1', 'growth'], ['Flower Garden 3', 'triattack'], ['Flower Garden 5', 'petalblizzard'], ['Midnight Zone Terrain', 'anchorshot']]) {
			battle.pseudoWeather = [[field, 0, 0]]; assert.equal(BattleTooltips.getNaturePowerMove(battle).id, expected);
		}
		battle.pseudoWeather = []; assert.equal(BattleTooltips.getNaturePowerMove(battle).id, 'triattack');
	});
	it('shows the called move details from the actual move tooltip route', () => {
		battle.pseudoWeather = [['Misty Terrain', 0, 0]];
		const own = {speciesForme: 'Mew', ability: 'No Ability', baseAbility: 'No Ability', item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
		const html = new BattleTooltips(battle).showMoveTooltip(Dex.moves.get('naturepower'), 'move', battle.p1.active[0], own);
		assert(html.includes('Nature Power &rarr; Mist Ball')); assert(html.includes('Base power:')); assert(html.includes('Accuracy:'));
		assert(html.includes("Nature Power's PP")); assert(!html.includes('Calls Tri Attack'));
		battle.pseudoWeather = [['Flower Garden 1', 0, 0]];
		const growth = new BattleTooltips(battle).showMoveTooltip(Dex.moves.get('naturepower'), 'move', battle.p1.active[0], own);
		assert(growth.includes('Nature Power &rarr; Growth')); assert(!growth.includes('Base power:'));
		assert.equal(Dex.moves.get('naturepower').category, 'Status');
	});
	it('keeps Max Guard and Z-Nature Power separate from the ordinary called-move preview', () => {
		const own = {speciesForme: 'Mew', ability: 'No Ability', item: 'Normalium Z', hp: 100, maxhp: 100, level: 100, stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}};
		const tips = new BattleTooltips(battle), p = battle.p1.active[0];
		assert(tips.showMoveTooltip(Dex.moves.get('naturepower'), 'maxmove', p, own).includes('Max Guard'));
		const z = tips.showMoveTooltip(Dex.moves.get('naturepower'), 'zmove', p, own);
		assert(z.includes('Z-Nature Power')); assert(!z.includes('Nature Power &rarr;'));
	});
	it('keeps move buttons tied to Nature Power and its own PP', () => {
		const source = fs.readFileSync('play.pokemonshowdown.com/js/client-battle.js', 'utf8');
		const start = source.indexOf('var moveData = curActive.moves[i];');
		const end = source.indexOf('\n\t\t\t\t}', start);
		const render = new Function('BattleTooltips', 'ModifiableValue', 'Dex', 'BattleLog', 'curActive', 'typeValueTracker', 'i', 'pos', 'drakeFangPreview', 'var movebuttons="",hasMoves=false;'+source.slice(start,end)+';return movebuttons;');
		battle.pseudoWeather = [['Misty Terrain', 0, 0]];
		const html = render.call({battle, tooltips: new BattleTooltips(battle)}, BattleTooltips, ModifiableValue, Dex, {escapeHTML: s => s}, {moves: [{move:'Nature Power',pp:12,maxpp:32,target:'normal'}]}, new ModifiableValue(battle,battle.p1.active[0],{ability:'No Ability',item:'',speciesForme:'Mew'}),0,0,false);
		assert(html.includes('Nature Power &rarr; Mist Ball')); assert(html.includes('data-move="Nature Power"')); assert(html.includes('12/32')); assert(html.includes('value="1"')); assert(html.includes('type-Psychic'));
	});
});
