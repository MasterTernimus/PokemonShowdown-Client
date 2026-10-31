const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

global.window = global;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
for (const name of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle', 'battle-field-rules']) {
	require('../play.pokemonshowdown.com/js/' + name);
}
const Scene = new Function('$', fs.readFileSync(
	path.join(__dirname, '../play.pokemonshowdown.com/js/battle-animations.js'), 'utf8'
) + '\nreturn BattleScene;')({easing: {}, fx: {}});

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
		scene.$aura = {attr() { return this; }, toggle() { return this; }};
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
	it('renders Rift Aura over the current field and removes its glow without replacing the background', () => {
		start('Factory Terrain', 4);
		const scene = Object.create(Scene.prototype);
		Object.assign(scene, {battle, animating: true});
		let background, auraVisible, html;
		scene.$weather = {html(value) {html = value; return this;}, attr() {return this;}, css() {return this;}};
		scene.$terrain = {stop() {return this;}, attr(key, value) {background = value; return this;}};
		scene.$aura = {attr() {return this;}, toggle(value) {auraVisible = value; return this;}};
		battle.runMinor(['-fieldstart', 'Rift Aura'], {aura: '3'});
		scene.updateWeather(true);
		assert.equal(background, 'weather factoryterrainweather');
		assert.equal(auraVisible, true);
		assert.match(html, /Rift Aura/);
		assert.match(html, /\(3 turns\)/);
		battle.runMinor(['-fieldend', 'Rift Aura'], {aura: '.'});
		scene.updateWeather(true);
		assert.equal(background, 'weather factoryterrainweather');
		assert.equal(auraVisible, false);
		assert.doesNotMatch(html, /Rift Aura/);
	});
	it('keeps the Room background when Rift Aura survives without a full field', () => {
		start('Trick Room', 4);
		battle.runMinor(['-fieldstart', 'Rift Aura'], {aura: '3'});
		const scene = Object.create(Scene.prototype);
		Object.assign(scene, {battle, animating: true});
		let background;
		scene.$weather = {html() {return this;}, attr() {return this;}, css() {return this;}};
		scene.$terrain = {stop() {return this;}, attr(key, value) {background = value; return this;}};
		scene.$aura = {attr() {return this;}, toggle() {return this;}};
		scene.updateWeather(true);
		assert.equal(background, 'weather trickroomweather');
	});
});

describe('Aura overlay rendering', () => {
	let battle;
	beforeEach(() => { battle = new Battle({debug: true, log: ['|gen|9']}); });
	afterEach(() => battle.destroy());
	function element() {
		return {
			attributes: {}, visible: false, text: '',
			attr(key, value) {this.attributes[key] = value; return this;},
			toggle(value) {this.visible = value; return this;},
			html(value) {this.text = value; return this;},
			stop() {return this;}, css() {return this;},
			animate(styles, duration, done) {if (done) done(); return this;},
		};
	}
	function renderer() {
		const scene = Object.create(Scene.prototype);
		Object.assign(scene, {battle, animating: true, acceleration: 1, curWeather: '', curTerrain: '', terrainAnimationToken: 0,
			$terrain: element(), $aura: element(), $weather: element()});
		return scene;
	}
	for (const aura of Object.values(BattleAuraRules)) {
		for (const mode of ['normal', 'instant', 'fast']) {
			it(`renders ${aura.name}, replacement, and removal during ${mode} playback`, () => {
				battle.runMinor(['-fieldstart', 'Factory Terrain'], {turns: '4'});
				battle.weather = 'raindance';
				battle.runMinor(['-fieldstart', aura.name], {aura: '3'});
				const scene = renderer();
				if (mode === 'fast') scene.acceleration = 3;
				const update = () => scene.updateWeather(mode === 'instant');
				update();
				assert.equal(scene.$aura.attributes.class, 'battle-aura ' + toID(aura.name));
				assert.equal(scene.$aura.visible, true);
				assert.equal(scene.$terrain.attributes.class, 'weather factoryterrainweather');
				assert.equal(scene.$weather.attributes.class, 'weather raindanceweather');
				assert(scene.$weather.text.includes(aura.name));
				assert(scene.$weather.text.includes('(3 turns)'));
				const replacement = aura.name === 'Rift Aura' ? 'Frozen Aura' : 'Rift Aura';
				battle.runMinor(['-fieldstart', replacement], {aura: '2'});
				// A late end message for the old Aura must not remove its replacement.
				battle.runMinor(['-fieldend', aura.name], {aura: '.'});
				update();
				assert.equal(scene.$aura.attributes.class, 'battle-aura ' + toID(replacement));
				assert.equal(scene.$aura.visible, true);
				assert(!scene.$weather.text.includes(aura.name));
				battle.runMinor(['-fieldend', replacement], {aura: '.'});
				update();
				assert.equal(scene.$aura.attributes.class, 'battle-aura');
				assert.equal(scene.$aura.visible, false);
				assert.equal(scene.$terrain.attributes.class, 'weather factoryterrainweather');
				assert.equal(scene.$weather.attributes.class, 'weather raindanceweather');
			});
		}
	}
	it('restores only the current Aura when replay seeking resumes', () => {
		battle.runMinor(['-fieldstart', 'Factory Terrain'], {turns: '4'});
		battle.runMinor(['-fieldstart', 'Ashen Aura'], {aura: '3'});
		const scene = renderer();
		scene.updateWeather(true);
		scene.animating = false;
		battle.runMinor(['-fieldstart', 'Frozen Aura'], {aura: '2'});
		scene.updateWeather(true);
		assert.equal(scene.$aura.attributes.class, 'battle-aura ashenaura');
		scene.$battle = {find() {return {remove() {}};}};
		scene.updateSidebars = scene.resetTurn = scene.resetSideConditions = () => {};
		scene.animationOn();
		assert.equal(scene.$aura.attributes.class, 'battle-aura frozenaura');
		assert.equal(scene.$terrain.attributes.class, 'weather factoryterrainweather');
		scene.animating = false;
		battle.runMinor(['-fieldend', 'Frozen Aura'], {aura: '.'});
		scene.animationOn();
		assert.equal(scene.$aura.attributes.class, 'battle-aura');
		assert.equal(scene.$aura.visible, false);
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
