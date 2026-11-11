'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const assert = require('assert').strict;
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const output = path.resolve(__dirname, '../caches/profile-editor');
const server = http.createServer((req, res) => {
	const pathname = decodeURIComponent(req.url.split('?')[0]);
	let file = path.resolve(root, '.' + pathname);
	if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
	if (!fs.existsSync(file) && pathname.startsWith('/config/')) file = path.join(root, '..', pathname);
	try {
		let content = fs.readFileSync(file);
		res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
		if (file.endsWith('testclient.html')) content = content.toString().replace('<script src="js/client-battle.js">', '<script src="js/battle-animations.js"></script><script src="js/client-battle.js">');
		res.end(content);
	} catch {res.writeHead(404).end();}
});
(async () => {
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	const base = 'http://127.0.0.1:' + server.address().port;
	const browser = await chromium.launch({channel:'msedge', headless:true});
	fs.mkdirSync(output, {recursive:true});
	try {
		for (const width of [1100, 390]) {
			const page = await browser.newPage({viewport:{width, height:950}}), errors = [];
			page.on('pageerror', error => errors.push(error.message));
			await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
			await page.goto(base + '/testclient.html');
			await page.waitForFunction(() => window.app && window.TeambuilderRoom && window.Storage && Storage.whenTeamsLoaded);
			await page.evaluate(() => {
				app.send = () => {}; while (app.popups.length) app.closePopup();
				// This offline UI test does not exercise external account verification.
				const popup = app.addPopup;
				app.addPopup = function (type, ...args) {if (type !== window.ProxyPopup) return popup.call(this, type, ...args);};
				Storage.whenTeamsLoaded.load();
				Storage.prefs('rosterprofiles', {version:1, selected:'g', enabled:false, profiles:[{id:'g',name:'Stars',species:['mew','charizard']}]});
				Storage.prefs('pokemontools', {version:1,builds:[],selectedNickname:'p',autoNickname:false,teamProfiles:{example:{id:'p',auto:false}},nicknames:[{id:'p',name:'Stars',rosterProfile:'g',entries:{mew:'Sage',charizard:'Ember'},genderEntries:{charizard:{F:'Nova'}}},{id:'q',name:'Other',entries:{mew:'Other Sage'},genderEntries:{}}]});
				Storage.teams.push({name:'Example team',format:'gen9doublesrockyfield',folder:'',toolsKey:'example',team:Storage.packTeam([{species:'Mew',name:'My name',ability:'Synchronize',moves:['Psychic']},{species:'Charizard',gender:'F',name:'',ability:'Blaze',moves:['Flamethrower']}])});
				app.joinRoom('teambuilder'); app.focusRoom('teambuilder');
				const room = app.rooms.teambuilder; room.edit(Storage.teams.length - 1); room.showToolsManager();
				document.documentElement.classList.add('dark');
			});
			const ui = page.locator('.simple-profiles');
			assert(await ui.locator('.nickname-shiny').isVisible());
			assert(await ui.locator('.nickname-gendered').isVisible());
			assert(await ui.locator('[name=renameToolEntry][value="nickname:p"]').isVisible());
			assert.equal(await ui.locator('.library-save-actions button').count(), 2, 'Only saving and applying in the action bar');
			const row = ui.locator('.nickname-row').filter({has:page.locator('input.nickname-species[value="Mew"]')});
			await row.locator('.nickname-value').fill('Starlight');
			await ui.locator('.nickname-profile-choice').selectOption('q');
			await ui.locator('.nickname-profile-choice').selectOption('p');
			assert.equal(await row.locator('.nickname-value').inputValue(), 'Starlight', 'Switching profiles keeps drafts');
			await ui.locator('.nickname-shiny').selectOption('yes');
			if (await page.locator('.ps-overlay').count()) throw new Error(await page.locator('.ps-overlay').innerText());
			await ui.locator('.nickname-gendered').check();
			await ui.locator('[name=applyNicknameToTeam]').click();
			const preview = page.locator('.profile-apply-preview[role=dialog]');
			await preview.waitFor();
			assert.deepEqual(await page.evaluate(() => app.rooms.teambuilder.pendingProfileApply.after.map(s => [s.name, !!s.shiny])), [['My name',true],['Nova',true]], 'Manual names kept; gender and shiny rules applied');
			await preview.locator('[name=cancelProfileApply]').click();
			assert.equal(await page.evaluate(() => app.rooms.teambuilder.curSetList[1].name), 'Charizard', 'Cancel does not change team');
			await ui.locator('.nickname-replace').check();
			await ui.locator('[name=applyNicknameToTeam]').click();
			await preview.waitFor();
			assert.equal(await page.evaluate(() => app.rooms.teambuilder.pendingProfileApply.after[0].name), 'Starlight');
			await preview.locator('[name=confirmProfileApply]').click();
			assert.equal(await page.evaluate(() => app.rooms.teambuilder.curSetList[0].name), 'Starlight');
			await page.locator('[name=undoProfileApply]').click();
			assert.equal(await page.evaluate(() => app.rooms.teambuilder.curSetList[0].name), 'My name');
			await page.evaluate(() => app.rooms.teambuilder.showToolsManager());
			assert.equal(await ui.locator('.library-save-actions button').count(), 2, 'Refresh does not duplicate controls');
			await page.evaluate(() => app.rooms.teambuilder.$el.scrollTop(0));
			assert(await ui.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'No horizontal overflow');
			await page.screenshot({path:path.join(output, 'profiles-' + width + '.png')});
			assert.deepEqual(errors, [], 'No browser errors');
			console.log('PASS profile edit, draft switching, save, shiny/gender rules, preview, cancel, whole-team apply, undo and layout at ' + width);
			await page.close();
		}
	} finally {await browser.close(); server.close();}
})().catch(error => {console.error(error); server.close(); process.exitCode = 1;});
