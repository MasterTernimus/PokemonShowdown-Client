'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const assert = require('assert').strict;
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const serverRoot = path.resolve(process.env.FIELD_GUIDE_SERVER_ROOT || process.env.PS_SERVER_SOURCE || path.join(__dirname, '../caches/PokemonShowdown-Reborn'));
const {publicFieldGuide} = require(path.join(serverRoot, 'dist/server/field-guide'));
const guide = publicFieldGuide(), root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const output = path.resolve(__dirname, '../caches/field-guide/aura-ui');
const auraKeys = guide.entries.filter(entry => entry.kind === 'aura').map(entry => 'aura/' + entry.id).sort();
assert.equal(auraKeys.length, 10, 'The connected guide should expose all ten Auras');
fs.mkdirSync(output, {recursive:true});
const server = http.createServer((req, res) => {
	const pathname = decodeURIComponent(req.url.split('?')[0]);
	let file = path.resolve(root, '.' + pathname);
	if (!file.startsWith(root + path.sep)) {res.writeHead(403).end(); return;}
	if (!fs.existsSync(file) && pathname.startsWith('/config/')) file = path.join(root, '..', pathname);
	try {
		res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream');
		let content = fs.readFileSync(file);
		if (file.endsWith('testclient.html')) {
			content = content.toString().replace('<script src="js/client-battle.js">', '<script src="js/battle-animations.js"></script><script src="js/client-battle.js">');
		}
		res.end(content);
	} catch {res.writeHead(404).end('Not found');}
});
async function visibleKeys(page) {
	return page.locator('.field-guide-room .guide-list [name=chooseGuide]').evaluateAll(els => els.map(el => el.value).sort());
}
async function painted(page) {
	await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function noOverflow(page, label) {
	const result = await page.evaluate(() => {
		const room = app.rooms.fieldguide, article = room.$('.guide-page')[0];
		return {
			room: room.el.scrollWidth > room.el.clientWidth + 1,
			article: article.scrollWidth > article.clientWidth + 1,
		};
	});
	assert.deepEqual(result, {room:false, article:false}, 'Horizontal overflow: ' + label);
}
(async () => {
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	const base = 'http://127.0.0.1:' + server.address().port;
	let browser;
	try {
		browser = await chromium.launch({channel:'msedge', headless:true});
		const page = await browser.newPage({viewport:{width:1100, height:850}});
		const errors = [];
		page.on('pageerror', error => errors.push(error.message));
		await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
		await page.goto(base + '/testclient.html');
		await page.waitForFunction(() => window.app && window.FieldGuideRoom && window.Storage && Storage.whenTeamsLoaded);
		await page.evaluate(data => {
			app.send = () => {};
			while (app.popups.length) app.closePopup();
			Storage.whenTeamsLoaded.load();
			openPublicFieldGuide('rifteclipseterrain');
			app.rooms.fieldguide.receiveGuide(data);
		}, guide);
		let checked = 0;
		for (const dark of [false, true]) for (const width of [1100, 390]) {
			const label = width + '-' + (dark ? 'dark' : 'light');
			await page.setViewportSize({width, height:850});
			await page.evaluate(dark => document.documentElement.classList.toggle('dark', dark), dark);
			await page.evaluate(() => openPublicFieldGuide('rifteclipseterrain'));
			const auraTab = page.locator('.field-guide-room [name=guideLayer][value="aura"]');
			assert(await auraTab.isVisible(), 'Auras navigation is visible: ' + label);
			await auraTab.click();
			assert.equal(await auraTab.getAttribute('aria-pressed'), 'true');
			assert.equal(await page.locator('.field-guide-room [name=guide-kind]').inputValue(), 'aura');
			assert.deepEqual(await visibleKeys(page), auraKeys, 'All ten Auras are discoverable: ' + label);
			assert.equal(await page.locator('.guide-group[data-group="Auras"] [name=chooseGuide]').count(), 10);
			assert.match(await page.locator('.guide-layer-note').innerText(), /aura/i);
			await noOverflow(page, 'overview/' + label);
			await painted(page);
			await page.screenshot({path:path.join(output, 'auras-overview-' + label + '.png')});
			for (const [search, expected] of [
				['Rift Aura', ['aura/riftaura']],
				['Sheer Cold', ['aura/frozenaura']],
				['Rift Opening', ['aura/riftaura']],
			]) {
				await page.locator('.field-guide-room [name=guide-search]').fill(search);
				assert.deepEqual(await visibleKeys(page), expected, search + '/' + label);
				await noOverflow(page, 'search-' + search + '/' + label);
			}
			await page.locator('.field-guide-room [name=guide-search]').fill('NoSuchAuraMove123');
			assert.deepEqual(await visibleKeys(page), []);
			assert.match(await page.locator('.guide-page').innerText(), /no.*match/i, 'Empty search must not leave stale detail');
			await page.evaluate(() => openPublicFieldGuide('aura/riftaura'));
			assert.equal(await page.locator('.field-guide-room [name=guide-search]').inputValue(), '');
			assert.equal(await auraTab.getAttribute('aria-pressed'), 'true');
			assert.equal(await page.locator('.guide-page h2').innerText(), 'Rift Aura');
			assert.match(await page.locator('.guide-page').innerText(), /Fairy[^\n.]*0\.75|0\.75[^\n]*Fairy/);
			assert.deepEqual(await visibleKeys(page), auraKeys);
			await noOverflow(page, 'rift-detail/' + label);
			await page.locator('.guide-page').scrollIntoViewIfNeeded();
			await painted(page);
			await page.screenshot({path:path.join(output, 'rift-aura-detail-' + label + '.png')});
			await page.evaluate(() => openPublicFieldGuide('rifteclipseterrain'));
			assert.equal(await page.locator('.field-guide-room [name=guideLayer][value="field"]').getAttribute('aria-pressed'), 'true');
			assert.match(await page.locator('.guide-page').innerText(), /Fairy[^\n.]*0\.5|0\.5[^\n]*Fairy/);
			await noOverflow(page, 'full-rift-detail/' + label);
			checked++;
		}
		assert.deepEqual(errors, [], 'Browser JavaScript errors');
		console.log('PASS: ' + checked + ' viewport/theme combinations; visible Auras navigation, all ten entries, name/move search, empty results, deep links, correct Rift multipliers, and no horizontal overflow.');
		console.log('Screenshots: ' + output);
	} finally {if (browser) await browser.close(); server.close();}
})().catch(error => {console.error(error); server.close(); process.exitCode = 1;});
