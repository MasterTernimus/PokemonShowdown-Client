'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
const PokemonSprite = new Function('$', 'window',
	fs.readFileSync('play.pokemonshowdown.com/js/battle-animations.js', 'utf8') + '\nreturn PokemonSprite;')({easing: {}}, {});
describe('Quarter protection descriptions and Relic Armor badge', () => {
	for (const id of ['unseenfist', 'piercingdrill']) it(id + ' describes protected quarter damage only', () => {
		const a = Dex.abilities.get(id);
		assert.match(a.desc, /1\/4 damage/);
		assert.match(a.desc, /Max Guard/);
		assert.match(a.desc, /Unprotected damage is unchanged/);
	});
	it('only renders a keyboard/tap badge for active Rock-weakness protection', () => {
		assert.equal(PokemonSprite.getEffectTag('relicarmoractive'), '');
		const badge = PokemonSprite.getEffectTag('relicarmorfield');
		assert(badge.includes('data-tooltip="relicarmor|field"'));
		assert(badge.includes('aria-label="Relic Armor: field protection active; tap for details"'));
		assert(!badge.includes('>Relic Armor: Field<'));
		const css = fs.readFileSync('play.pokemonshowdown.com/style/battle.css', 'utf8');
		assert(css.includes('.relic-armor-badge::before { content:none; }'));
		assert(css.includes('.relic-armor-field { color:#185236'));
	});
	it('hides the condition again when a replay returns to its inactive state', () => {
		const b = new Battle({debug: true, log: ['|gen|9', '|switch|p1a: Fossil|Omastar, L100|100/100']});
		try {
			const p = b.p1.active[0];
			const rendered = () => Object.keys(p.volatiles).map(id => PokemonSprite.getEffectTag(id)).join('');
			b.runMinor(['-start', 'p1a: Fossil', 'relicarmoractive'], {silent: '.'});
			assert.equal(rendered(), '');
			b.runMinor(['-end', 'p1a: Fossil', 'relicarmoractive'], {silent: '.'});
			b.runMinor(['-start', 'p1a: Fossil', 'relicarmorfield'], {silent: '.'});
			assert(rendered().includes('Relic Armor'));
			b.runMinor(['-end', 'p1a: Fossil', 'relicarmorfield'], {silent: '.'});
			b.runMinor(['-start', 'p1a: Fossil', 'relicarmoractive'], {silent: '.'});
			assert.equal(rendered(), '');
		} finally { b.destroy(); }
	});
});
