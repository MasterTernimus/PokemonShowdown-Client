'use strict';
// PS_SERVER_SOURCE=/approved/server PLAYWRIGHT_MODULE=playwright node test/battle-tools-browser.cjs
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const http = require('http');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const client = path.resolve(__dirname, '../play.pokemonshowdown.com');
const source = process.env.PS_SERVER_SOURCE;
if (!source) throw new Error('PS_SERVER_SOURCE is required to verify actual runtime parity.');
const {Dex, Battle} = require(path.join(source, 'dist/sim'));
const manifest = require('../server-data-sync-manifest.json');
const server = http.createServer((req, res) => {
	let file = path.join(client, decodeURIComponent(req.url.split('?')[0]));
	if (!fs.existsSync(file) && req.url.startsWith('/config/')) file = path.join(client, '..', req.url.split('?')[0]);
	try {
		let body = fs.readFileSync(file);
		res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
		if (file.endsWith('testclient.html')) body = body.toString().replace('<script src="js/client-battle.js">', '<script src="js/battle-animations.js"></script><script src="js/client-battle.js">');
		res.end(body);
	} catch { res.statusCode = 404; res.end(); }
});
(async () => {
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	const base = 'http://127.0.0.1:' + server.address().port;
	const browser = await chromium.launch({headless: true, ...(process.env.BROWSER_CHANNEL ? {channel: process.env.BROWSER_CHANNEL} : {})});
	try {
		const page = await browser.newPage({viewport: {width: 1280, height: 950}});
		const errors = [];
		page.on('pageerror', error => errors.push(error.message));
		await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
		await page.goto(base + '/testclient.html?~~127.0.0.1:18081');
		await page.waitForFunction(() => window.app && app.rooms[''] && window.CustomCalculatorPopup);
		await page.evaluate(() => { while (app.popups.length) app.closePopup(); app.send = () => {}; BattleSound.setMute(true); app.playNotificationSound = () => {}; Storage.prefs('mute', true); });
		const expected = {species: {}, abilities: {}, moves: {}};
		for (const kind of Object.keys(expected)) for (const id of Object.keys(manifest.snapshot[kind])) {
			const data = Dex[kind].get(id);
			expected[kind][id] = Object.fromEntries(Object.keys(manifest.snapshot[kind][id]).filter(key => key !== 'replaceAbilities').map(key => [key, key === 'isNonstandard' ? data[key] || false : data[key]]));
		}
		const actual = await page.evaluate(expected => {
			const result = {species: {}, abilities: {}, moves: {}};
			for (const kind of Object.keys(expected)) for (const id of Object.keys(expected[kind])) {
				const data = Dex[kind].get(id);
				result[kind][id] = Object.fromEntries(Object.keys(expected[kind][id]).map(key => [key, key === 'isNonstandard' ? data[key] || false : data[key]]));
			}
			return result;
		}, expected);
		assert.deepEqual(actual, JSON.parse(JSON.stringify(expected)));
		assert.equal(actual.species.sylveon.abilities[1], 'Soothing Presence');
		console.log('PASS runtime parity:', Object.keys(actual.species).length, 'species,', Object.keys(actual.abilities).length, 'abilities,', Object.keys(actual.moves).length, 'moves.');
		await page.evaluate(() => { const r = app.rooms[''], n = r.$('.news-embed'); if (!n.data('minimized')) r.minimizePM(n); n.find('.pm-log').append('<a id="audit-news-link" href="#article">Article</a>'); });
		await page.setViewportSize({width: 390, height: 844});
		await page.locator('.news-embed h3').click();
		assert(await page.locator('#audit-news-link').isVisible());
		assert(await page.locator('#audit-news-link').evaluate(el => el.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}))));
		await page.waitForFunction(() => location.hash === '#article');
		await page.evaluate(() => app.focusRoom(''));
		assert(await page.locator('#audit-news-link').isVisible());
		await page.setViewportSize({width: 1280, height: 950});
		assert(await page.locator('#audit-news-link').isVisible());
		await page.locator('.news-embed h3').click();
		assert.equal(await page.locator('#audit-news-link').isVisible(), false);
		await page.setViewportSize({width: 390, height: 844});
		assert.equal(await page.locator('#audit-news-link').isVisible(), false);
		await page.locator('.news-embed h3').click();
		assert(await page.locator('#audit-news-link').isVisible());
		console.log('PASS desktop/mobile news transitions preserve article navigation.');
		const b = new Battle({formatid: 'gen9nofieldsinglesgame', challengeOptions: {gimmicks: 1}, p1: {name: 'Alice', team: [{species: 'Mew', ability: 'No Ability', moves: ['splash']}]}, p2: {name: 'Bob', team: [{species: 'Mew', ability: 'No Ability', moves: ['splash']}]}});
		b.makeChoices('team', 'team');
		await page.evaluate(log => { app.receive('>battle-gen9nofieldsinglesgame-1001\n|init|battle\n' + log); app.focusRoom('battle-gen9nofieldsinglesgame-1001'); const r = app.rooms['battle-gen9nofieldsinglesgame-1001']; r.battle.seekTurn(Infinity); r.updateControls(); }, b.log.join('\n'));
		b.destroy();
		for (const width of [390, 627, 628, 700, 820, 840]) {
			await page.setViewportSize({width, height: 950});
			await page.evaluate(() => app.rooms['battle-gen9nofieldsinglesgame-1001'].updateLayout());
			assert(await page.locator('.mobile-gimmick-counters').isVisible() || await page.locator('.battle-log > .gimmick-counters').isVisible(), 'counter missing at ' + width);
		}
		console.log('PASS counters visible at every tested phone, landscape, and desktop breakpoint.');
		const metadata = require(path.join(source, 'dist/sim/custom-calculator')).calculatorMetadata();
		metadata.version = {engine: 'browser-regression', builtAt: ''};
		await page.evaluate(data => { app.focusRoom(''); app.addPopup(CustomCalculatorPopup); const p = app.popups[app.popups.length - 1]; clearTimeout(p.calcTimer); p.metadata = data; p.renderCalculator(); }, metadata);
		const result = await page.evaluate(() => {
			const p = app.popups[app.popups.length - 1];
			const original = JSON.stringify(p.scenario());
			const outcomes = [];
			for (const change of [s => s.actors[1].gender = 'typo', s => s.actors[2].gimmick = 'teraa', s => s.weather = 'rain', s => s.attackMode = 'bogus', s => s.actors[3].moves = 'Splash', s => s.actors[2].boosts = null]) {
				const s = JSON.parse(original); s.actors[0].species = 'Pikachu'; change(s); p.$('[name=calc-json]').val(JSON.stringify(s)); p.importScenario();
				outcomes.push({unchanged: JSON.stringify(p.scenario()) === original, rejected: p.$('.calc-status').text().startsWith('Invalid scenario:')});
			}
			const valid = JSON.parse(original); valid.actors[0].species = 'Pikachu'; valid.actors[0].gender = 'F'; valid.weather = 'raindance'; p.$('[name=calc-json]').val(JSON.stringify(valid)); p.importScenario();
			return {outcomes, current: p.scenario(), valid};
		});
		assert(result.outcomes.every(x => x.unchanged && x.rejected));
		assert.deepEqual(result.current, result.valid);
		assert.deepEqual(errors, []);
		console.log('PASS invalid imports are atomic; supported scenario round-trip remains intact.');
	} finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
