'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const createCachebuster = require('../build-tools/cachebuster');
const vm = require('vm');

describe('Asset cache URLs', function () {
	it('keeps the preferences gate and installs the test-client transport before connecting', function () {
		const storageSource = fs.readFileSync('play.pokemonshowdown.com/js/storage.js', 'utf8');
		const clientSource = fs.readFileSync('play.pokemonshowdown.com/js/client.js', 'utf8');
		const trackers = storageSource.slice(storageSource.indexOf('Storage.makeLoadTracker ='), storageSource.indexOf('var updatePrefs ='));
		const initStart = storageSource.indexOf('Storage.initTestClient =');
		const initEnd = storageSource.indexOf('\n};', initStart) + 3;
		const connectionStart = clientSource.indexOf('initializeConnection: function ()');
		const connectionEnd = clientSource.indexOf('\n\t\t},', connectionStart) + 4;
		const originalGet = function () {};
		const originalPost = function () {};
		let connections = 0;
		const context = vm.createContext({Storage: {}, Config: {defaultserver: {}}, $: {get: originalGet, post: originalPost}});
		vm.runInContext(trackers + '\n' + storageSource.slice(initStart, initEnd), context);
		const initialize = vm.runInContext('({' + clientSource.slice(connectionStart, connectionEnd) + '}).initializeConnection', context);
		context.app = {connect: function () {
			assert.notStrictEqual(context.$.get, originalGet);
			assert.notStrictEqual(context.$.post, originalPost);
			connections++;
		}};
		context.Storage.initTestClient();
		initialize.call(context.app);
		assert.strictEqual(connections, 0);
		context.Storage.whenAppLoaded.load(context.app);
		assert.strictEqual(connections, 1);
	});
	it('starts the test client without waiting for the window load event', function () {
		const html = fs.readFileSync('play.pokemonshowdown.com/testclient.template.html', 'utf8');
		const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
		const bootstrap = scripts.find(script => script[1].includes('new App()'))[1];
		let started = 0;
		const window = {};
		vm.runInNewContext(bootstrap, {window, App: function () {started++;}});
		assert.strictEqual(started, 1);
		assert.strictEqual(window.onload, undefined);
	});
	it('retains hashes across builds, invalidates changed bytes, and resolves custom routes', function () {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ps-cachebuster-'));
		try {
			for (const file of ['play.pokemonshowdown.com/js/test.js', 'config/config.js', 'replay.pokemonshowdown.com/js/test.js']) {
				fs.mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
				fs.writeFileSync(path.join(root, file), 'first');
			}
			const routes = {client: 'custom.example', replays: 'replays.example', dex: 'dex.example', root: 'root.example'};
			const render = createCachebuster(routes, root);
			const hash = crypto.createHash('md5').update('first').digest('hex').slice(0, 8);
			for (const url of ['//play.pokemonshowdown.com/js/test.js', '/js/test.js', '//play.pokemonshowdown.com/config/config.js', 'js/test.js']) {
				const first = render('', 'src', url, '?');
				assert(first.endsWith('?' + hash + '"'));
				assert.strictEqual(first, createCachebuster(routes, root)('', 'src', url, '?'));
			}
			assert(render('', 'src', '//play.pokemonshowdown.com/js/test.js', '?').includes('//custom.example/'));
			const local = createCachebuster(routes, root, 'play.pokemonshowdown.com');
			assert(local('', 'src', 'js/test.js', '?').endsWith('?' + hash + '"'));
			assert(local('', 'src', 'config/config.js', '?').endsWith('?' + hash + '"'));
			const before = render('', 'src', '/js/test.js', '?');
			fs.writeFileSync(path.join(root, 'play.pokemonshowdown.com/js/test.js'), 'second');
			assert.notStrictEqual(render('', 'src', '/js/test.js', '?'), before);
			assert.throws(() => render('', 'src', '/missing.js', '?'), /ENOENT/);
			assert.strictEqual(render('', 'src', 'https://external.example/x?id=1', undefined), 'src="https://external.example/x?id=1"');
		} finally {
			fs.rmSync(root, {recursive: true, force: true});
		}
	});
});
