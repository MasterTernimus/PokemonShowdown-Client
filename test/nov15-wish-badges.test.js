'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const PokemonSprite = new Function('$', 'window', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations.js', 'utf8') + '\nreturn PokemonSprite;')({easing: {}}, {});

describe('Delayed Wish slot indicators', () => {
	function setup() {
		const b = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|doubles',
			'|switch|p1a: Anna|Gardevoir|100/100', '|switch|p1b: Ally|Mew|100/100',
			'|switch|p2a: Foe|Mew|100/100', '|turn|1']});
		return b;
	}
	function render(p) {
		let html = '';
		PokemonSprite.prototype.updateStatbar.call({scene: {animating: true}, $statbar: {find: () => ({html: value => { html = value; }})}}, p);
		return html;
	}
	it('shows readable separate attack and healing counters, scoped to the correct slots', () => {
		const b = setup(), p = b.p1.active[0], q = b.p2.active[0];
		b.runMinor(['-start', 'p1a: Anna', 'move: Nostras Wish'], {of: 'p2a: Foe', slot: 'attack', turns: '2'});
		b.runMinor(['-start', 'p1a: Anna', 'move: Wish'], {slot: 'heal', turns: '2', silent: '.'});
		assert(!p.volatiles.nostraswish);
		assert(render(p).includes('Wish&nbsp;2'));
		assert(render(q).includes('Nostra&nbsp;2'));
		assert(render(q).includes('at the end of the next turn.'));
		assert(!render(b.p1.active[1]).includes('Wish'));
		b.updateTurnCounters();
		assert(render(p).includes('Wish&nbsp;1'));
		assert(render(q).includes('at the end of this turn.'));
		b.runMinor(['-end', 'p2a: Foe', 'move: Nostras Wish'], {});
		b.runMinor(['-end', 'p1a: Anna', 'move: Wish'], {silent: '.'});
		assert(!render(p).includes('Wish')); assert(!render(q).includes('Nostra'));
	});
	it('survives switching and expires even when the delayed attack has no target', () => {
		const b = setup(), q = b.p2.active[0];
		b.runMinor(['-start', 'p1a: Anna', 'move: Nostras Wish'], {of: 'p2a: Foe', slot: 'attack', turns: '2'});
		b.add('|switch|p2a: Replacement|Chansey|100/100');
		assert(render(b.p2.active[0]).includes('Nostra&nbsp;2'));
		b.updateTurnCounters(); b.updateTurnCounters();
		assert(!render(b.p2.active[0]).includes('Nostra'));
	});
	it('does not show a stale caster badge for old replay messages', () => {
		const b = setup(), p = b.p1.active[0];
		b.runMinor(['-start', 'p1a: Anna', 'move: Nostras Wish'], {});
		assert(!render(p).includes('Nostras')); assert(!render(p).includes('[['));
	});
});
