const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
for (const name of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle']) {
	require('../play.pokemonshowdown.com/js/' + name);
}
const Scene = new Function('$', fs.readFileSync(
	path.join(__dirname, '../play.pokemonshowdown.com/js/battle-animations.js'), 'utf8'
) + '\nreturn BattleScene;')({easing: {}});

describe('Field display transitions', () => {
	let battle;
	beforeEach(() => { battle = new Battle({debug: true, log: ['|gen|9']}); });
	afterEach(() => battle.destroy());
	function start(name, turns) {
		battle.runMinor(['-fieldstart', name], turns === undefined ? {} : {turns: String(turns)});
	}

	it('keeps only the active field through repeated ice/water swaps', () => {
		for (let i = 0; i < 5; i++) {
			start('Icy Field', 0);
			start('Water Surface Terrain', 4);
			assert.deepEqual(battle.pseudoWeather, [['Water Surface Terrain', 4, 4]]);
			start('Icy Field', 5);
			assert.deepEqual(battle.pseudoWeather, [['Icy Field', 5, 5]]);
		}
	});
	it('refreshes a restored field without accumulating labels or stale timers', () => {
		start('Icy Field', 5);
		start('Icy Field', 2);
		start('Icy Field', 0);
		assert.deepEqual(battle.pseudoWeather, [['Icy Field', 0, 0]]);
	});
	it('accepts either ice name when ending a field and removes old duplicate entries', () => {
		battle.pseudoWeather = [['Icy Field', 0, 0], ['Icy Terrain', 2, 2], ['Icy Field', 5, 5]];
		battle.runMinor(['-fieldend', 'Icy Terrain'], {});
		assert.deepEqual(battle.pseudoWeather, []);
	});
	it('preserves auras and rooms while replacing fields', () => {
		start('Trick Room', 3);
		battle.runMinor(['-fieldstart', 'Grassy Aura'], {aura: '4'});
		start('Icy Field', 2);
		start('Water Surface Terrain', 1);
		assert.deepEqual(battle.pseudoWeather.map(state => state[0]), ['Trick Room', 'Grassy Aura', 'Water Surface Terrain']);
	});
	it('replaces Flower Garden stages and ice in either direction', () => {
		start('Flower Garden 1');
		start('Flower Garden 3');
		start('Icy Field', 0);
		assert.deepEqual(battle.pseudoWeather, [['Icy Field', 0, 0]]);
		start('Flower Garden 2');
		assert.equal(battle.pseudoWeather.length, 1);
		assert.equal(battle.getTerrainId(battle.pseudoWeather[0][0]), 'flowergarden2');
	});
	it('ignores an old field end after a replacement has arrived', () => {
		start('Icy Field', 0);
		start('Water Surface Terrain', 4);
		battle.runMinor(['-fieldend', 'Icy Field'], {});
		assert.deepEqual(battle.pseudoWeather, [['Water Surface Terrain', 4, 4]]);
	});
	it('classifies backgrounds without treating auras or rooms as terrain', () => {
		assert.equal(battle.getTerrainId('Icy Field'), 'icyterrain');
		assert.equal(battle.getTerrainId('Icy Terrain'), 'icyterrain');
		assert.equal(battle.getTerrainId('Water Surface Terrain'), 'watersurfaceterrain');
		assert.equal(battle.getTerrainId('Trick Room'), '');
		assert.equal(battle.getTerrainId('Grassy Aura'), '');
	});
	it('renders one current field and keeps its background when a room starts', () => {
		start('Icy Field', 0);
		start('Water Surface Terrain', 4);
		start('Icy Field', 2);
		start('Trick Room', 3);
		const scene = Object.create(Scene.prototype);
		Object.assign(scene, {battle, animating: true});
		let html;
		let background;
		scene.$weather = {
			html(value) { html = value; return this; },
			attr() { return this; }, css() { return this; },
		};
		scene.$terrain = {
			stop() { return this; },
			attr(key, value) { background = value; return this; },
		};
		scene.updateWeather(true);
		assert.equal((html.match(/Icy Field/g) || []).length, 1);
		assert(!html.includes('Water Surface'));
		assert(html.includes('(2 turns)'));
		assert(html.includes('Trick Room'));
		assert.equal(background, 'weather icyterrainweather');
		battle.runMinor(['-fieldend', 'Icy Field'], {});
		scene.updateWeather(true);
		assert.equal(background, 'weather trickroomweather');
	});
});


describe('Explicit side-condition durations', () => {
	let battle;
	beforeEach(() => { battle = new Battle({debug: true, log: ['|gen|9']}); });
	afterEach(() => battle.destroy());
	for (const name of ['Tailwind', 'Light Screen', 'Safeguard']) {
		it('uses and refreshes the server duration for ' + name, () => {
			const id = toID(name);
			battle.runMinor(['-sidestart', 'p1: Player 1', 'move: ' + name], {});
			battle.runMinor(['-sidestart', 'p1: Player 1', 'move: ' + name], {turns: '3', silent: '.'});
			assert.deepEqual(battle.p1.sideConditions[id].slice(2), [3, 3]);
			battle.runMinor(['-sidestart', 'p1: Player 1', 'move: ' + name], {turns: '5', silent: '.'});
			assert.deepEqual(battle.p1.sideConditions[id].slice(2), [5, 5]);
			battle.runMinor(['-sideend', 'p1: Player 1', 'move: ' + name], {});
			assert(!battle.p1.sideConditions[id]);
		});
	}
	it('preserves ordinary screen uncertainty and rejects malformed durations', () => {
		battle.runMinor(['-sidestart', 'p1: Player 1', 'move: Light Screen'], {});
		assert.deepEqual(battle.p1.sideConditions.lightscreen.slice(2), [5, 8]);
		for (const turns of ['invalid', '-1', '1.5']) {
			battle.runMinor(['-sidestart', 'p1: Player 1', 'move: Light Screen'], {turns});
			assert.deepEqual(battle.p1.sideConditions.lightscreen.slice(2), [5, 8]);
		}
	});
});
