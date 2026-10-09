'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const http = require('http');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {Battle} = require(path.join(process.env.PS_SERVER_SOURCE, 'dist/sim'));
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const server = http.createServer((req, res) => {
	let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
	if (!fs.existsSync(file) && req.url.startsWith('/config/')) file = path.join(root, '..', req.url.split('?')[0]);
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
	const browser = await chromium.launch({headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome'});
	try {
		const page = await browser.newPage();
		await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
		await page.goto(base + '/testclient.html?~~127.0.0.1:18081');
		await page.waitForFunction(() => window.app && app.rooms['']);
		await page.evaluate(() => {
			while (app.popups.length) app.closePopup();
			window.sentChoices = [];
			app.send = message => window.sentChoices.push(message);
			BattleSound.setMute(true);
			app.playNotificationSound = () => {};
		});
		for (const width of [1280, 390]) {
			await page.setViewportSize({width, height: 900});
			const battle = new Battle({formatid: 'gen9nofieldsinglesgame',
				p1: {name: 'Alice', team: [{species: 'Muk', ability: 'No Ability', item: 'Anomaly Core', moves: ['poisonjab', 'toxic', 'protect', 'sludge']}]},
				p2: {name: 'Bob', team: [{species: 'Blissey', ability: 'No Ability', moves: ['splash']}]},
			});
			battle.makeChoices('team', 'team');
			const id = 'battle-gen9nofieldsinglesgame-' + width;
			await page.evaluate(({id, log, request}) => {
				app.receive('>' + id + '\n|init|battle\n' + log);
				app.focusRoom(id);
				const room = app.rooms[id];
				room.battle.seekTurn(Infinity);
				room.receiveRequest(request);
				room.updateControls();
			}, {id, log: battle.log.join('\n'), request: battle.p1.activeRequest});
			const roomElementId = await page.evaluate(id => app.rooms[id].el.id, id);
			const scope = page.locator('#' + roomElementId);
			const moves = scope.locator('button[name=chooseMove]');
			assert((await moves.first().innerText()).includes('Poison Jab'));
			await scope.locator('input[name=megaevo]').check();
			assert.deepEqual(await moves.evaluateAll(buttons => buttons.map(b => b.dataset.move)), ['Sludge Wave', 'Earth Power', 'Muddy Water', 'Discharge']);
			await scope.locator('input[name=megaevo]').uncheck();
			assert((await moves.first().innerText()).includes('Poison Jab'));
			await scope.locator('input[name=megaevo]').check();
			await moves.nth(1).click();
			assert((await page.evaluate(() => window.sentChoices)).some(message => message.includes('move 2 mega')));
			battle.makeChoices('move 2 mega', 'move splash');
			assert.equal(battle.p1.active[0].lastMove.id, 'earthpower');
			battle.destroy();
			console.log('PASS Pulse checkbox, restoration, selection and same-turn attack at width', width);
		}
	} finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
