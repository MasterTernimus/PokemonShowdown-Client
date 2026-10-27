'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client.js', 'utf8');
const userStart = source.indexOf('var User = this.User = Backbone.Model.extend(');
const userCode = source.slice(userStart, source.indexOf('\n\tthis.App =', userStart));
const topbarSource = fs.readFileSync('play.pokemonshowdown.com/js/client-topbar.js', 'utf8');
const topbarStart = topbarSource.indexOf('updateUserbar: function');
const topbarCode = '({' + topbarSource.slice(topbarStart, topbarSource.indexOf('\n\t\tlogin: function', topbarStart)) + '}).updateUserbar';
const storageSource = fs.readFileSync('play.pokemonshowdown.com/js/storage.js', 'utf8');

function installTestClient(h, key) {
	h.context.Storage = {};
	h.context.Config.testclient = true;
	h.context.Config.routes = {client: 'play.pokemonshowdown.com'};
	h.context.$.get = function () {};
	h.context.POKEMON_SHOWDOWN_TESTCLIENT_KEY = key;
	const trackers = storageSource.slice(storageSource.indexOf('Storage.makeLoadTracker ='), storageSource.indexOf('var updatePrefs ='));
	const start = storageSource.indexOf('Storage.initTestClient =');
	const end = storageSource.indexOf('\n};', start) + 3;
	vm.runInContext(trackers + '\n' + storageSource.slice(start, end), h.context);
	h.context.Storage.initTestClient();
	h.context.Storage.whenAppLoaded.load(h.app);
}

function setup(options = {}) {
	let now = 0, sequence = 0;
	const timers = new Map(), requests = [], sent = [], events = [], sockets = [];
	const setTimer = (callback, delay) => { const id = ++sequence; timers.set(id, {callback, due: now + delay}); return id; };
	const tick = ms => {
		now += ms;
		for (const [id, timer] of [...timers]) {
			if (timer.due <= now) { timers.delete(id); timer.callback(); }
		}
	};
	const post = (url, data, callback, type) => {
		if (options.throwPost) throw new Error('transport failed');
		const request = {url, data, callback, type, aborted: false};
		requests.push(request);
		if (options.noHandle) return;
		request.fail = handler => {request.error = handler; return request;};
		request.abort = () => {request.aborted = true; if (request.error) request.error();};
		return request;
	};
	const app = {
		send: command => sent.push(command), trigger: event => events.push(event),
		addPopupMessage: () => {throw new Error('Unexpected popup');}, popups: []
	};
	const context = vm.createContext({
		app, $: {post, trim: text => text.trim()}, Backbone: {Model: {extend: definition => definition}},
		Config: {server: {id: 'test', host: 'test.invalid', port: 443}},
		location: {host: 'test.invalid'}, document: {location: 'https://test.invalid/'},
		window: {}, Dex: {prefs: () => false},
		toUserid: name => name.toLowerCase().replace(/[^a-z0-9]/g, ''),
		setTimeout: setTimer, clearTimeout: id => timers.delete(id),
		SockJS: function () { const socket = {}; sockets.push(socket); return socket; },
		BattleLog: {hashColor: () => '#000', escapeHTML: value => value, accountName: value => value}
	});
	vm.runInContext(userCode, context);
	const user = Object.create(context.User);
	user.attributes = {name: '', userid: '', registered: false, named: false};
	user.get = name => user.attributes[name];
	user.set = (name, value) => {user.attributes[name] = value;};
	user.trigger = (event, name) => events.push(event + ':' + name);
	app.user = user;
	let html = '';
	const updateUserbar = vm.runInContext(topbarCode, context);
	app.topbar = {$userbar: {html: value => {html = value;}}, updateUserbar: function () {updateUserbar.call(this);}};
	return {user, app, context, requests, sent, events, sockets, timers, tick, html: () => html};
}

describe('Recoverable session upkeep', function () {
	it('bounds a pending request, keeps authentication incomplete and permits one explicit retry', function () {
		const h = setup();
		h.user.receiveChallstr('challenge-A');
		assert(h.html().includes('Loading...'));
		h.user.retryUpkeep();
		assert.strictEqual(h.requests.length, 1);
		h.tick(29999);
		assert.strictEqual(h.user.upkeepError, '');
		h.tick(1);
		assert.strictEqual(h.user.loaded, false);
		assert.strictEqual(h.user.get('registered'), false);
		assert(h.requests[0].aborted);
		assert(h.html().includes('Sign-in check timed out.'));
		assert(h.html().includes('name="retryUpkeep"'));
		h.user.retryUpkeep();
		h.user.retryUpkeep();
		assert.strictEqual(h.requests.length, 2);
		assert(h.html().includes('Loading...'));
		assert.strictEqual(h.sent.length, 0);
	});
	it('reports transport failure immediately and handles synchronous transport errors', function () {
		const h = setup();
		h.user.receiveChallstr('A');
		h.requests[0].error();
		assert.strictEqual(h.user.upkeepError, 'network');
		assert(h.html().includes('Sign-in check failed.'));
		assert.strictEqual(h.timers.size, 0);
		const thrown = setup({throwPost: true});
		thrown.user.receiveChallstr('A');
		assert.strictEqual(thrown.user.upkeepError, 'network');
		assert.strictEqual(thrown.timers.size, 0);
	});
	it('rejects empty, malformed, wrongly typed and inconsistent responses safely', function () {
		for (const response of [undefined, {}, '', '  ', '<html>', 'not JSON', '[]', '{}',
			'{"username":4}', '{"username":"","loggedin":true}', '{"username":"Alice","loggedin":true}',
			'{"username":"Alice","assertion":"<html>"}', '{"username":"Alice","assertion":"x\\ny"}',
			'{"username":"Alice","loggedin":true,"assertion":";"}',
			'{"username":"Alice","loggedin":"yes","assertion":"token"}']) {
			const h = setup();
			h.user.receiveChallstr('A');
			assert.doesNotThrow(() => h.requests[0].callback(response));
			assert.strictEqual(h.user.loaded, false);
			assert.strictEqual(h.user.upkeepError, 'invalidresponse');
			assert(h.html().includes('Invalid sign-in response.'));
			assert.strictEqual(h.sent.length, 0);
			assert.strictEqual(h.timers.size, 0);
		}
	});
	it('accepts guest responses and the existing JSON prefix without claiming authentication', function () {
		for (const response of ['{"username":""}', '{"loggedin":false}', ']{"username":"","loggedin":false}']) {
			const h = setup();
			h.user.receiveChallstr('A');
			h.requests[0].callback(response);
			assert.strictEqual(h.user.loaded, true);
			assert.strictEqual(h.user.get('registered'), false);
			assert(h.html().includes('Choose name'));
			assert.strictEqual(h.sent.length, 0);
			assert.strictEqual(h.timers.size, 0);
		}
	});
	it('preserves signed-assertion submission and auth-required handling', function () {
		const h = setup();
		h.user.receiveChallstr('A');
		h.requests[0].callback(']{"username":"Alice","loggedin":true,"assertion":"signed-token"}');
		assert.strictEqual(h.user.loaded, true);
		assert.strictEqual(h.user.get('registered').userid, 'alice');
		assert.strictEqual(h.sent[0], '/trn Alice,0,signed-token');
		h.tick(60000);
		assert.strictEqual(h.user.upkeepError, '');
		const password = setup();
		password.user.receiveChallstr('A');
		password.requests[0].callback('{"username":"Alice","loggedin":false,"assertion":";"}');
		assert(password.events.includes('login:authrequired:Alice'));
		assert.strictEqual(password.user.get('registered'), false);
	});
	it('ignores late callbacks after timeout, failure, retry and a reused challenge', function () {
		const h = setup({noHandle: true}); // iframe/manual bridges need no jqXHR.
		h.user.receiveChallstr('A');
		h.tick(30000);
		h.user.retryUpkeep();
		h.requests[0].callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		assert.strictEqual(h.sent.length, 0);
		assert.strictEqual(h.user.loaded, false);
		h.requests[1].callback('{"loggedin":false}');
		h.requests[0].callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		assert.strictEqual(h.user.get('registered'), false);
		assert.strictEqual(h.sent.length, 0);
	});
	it('invalidates earlier challenges and clears pending state on disconnect', function () {
		const h = setup();
		h.user.receiveChallstr('A');
		h.user.receiveChallstr('B');
		assert(h.requests[0].aborted);
		h.requests[0].callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		assert.strictEqual(h.sent.length, 0);
		h.user.resetUpkeep(true);
		h.requests[1].callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		assert.strictEqual(h.user.loaded, false);
		assert.strictEqual(h.user.challstr, '');
		assert(h.html().includes('Reconnect to check sign-in.'));
		assert(!h.html().includes('name="retryUpkeep"'));
		h.user.retryUpkeep();
		assert.strictEqual(h.requests.length, 2);
		h.user.receiveChallstr('B');
		h.requests[2].callback('{"loggedin":false}');
		assert.strictEqual(h.user.loaded, true);
	});
	it('ignores obsolete socket messages, open and close events after reconnect', function () {
		const h = setup();
		const start = source.indexOf('connect: function ()');
		const connect = vm.runInContext('({' + source.slice(start, source.indexOf('\n\t\tdispatchFragment:', start)) + '}).connect', h.context);
		h.app.receive = challenge => h.user.receiveChallstr(challenge);
		connect.call(h.app);
		const old = h.app.socket;
		old.onmessage({data: 'A'});
		connect.call(h.app);
		assert(h.requests[0].aborted);
		const current = h.app.socket;
		current.onmessage({data: 'B'});
		old.onopen();
		old.onmessage({data: 'C'});
		old.onclose();
		assert.strictEqual(h.user.challstr, 'B');
		assert.strictEqual(h.requests.length, 2);
		h.requests[0].callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		h.requests[1].callback('{"loggedin":false}');
		assert.strictEqual(h.user.loaded, true);
		assert.strictEqual(h.sent.length, 0);
	});
	it('retains abort and failure handling through the actual test-client session transport', function () {
		const h = setup();
		installTestClient(h, 'dummy-test-session');
		h.user.receiveChallstr('A');
		assert.strictEqual(h.requests[0].data.sid, 'dummy-test-session');
		assert.strictEqual(h.requests[0].url, 'https://play.pokemonshowdown.com/~~test/action.php');
		assert.strictEqual(h.requests[0].type, 'text');
		h.requests[0].error();
		assert(h.requests[0].aborted);
		assert.strictEqual(h.user.upkeepError, 'network');
	});
	it('bounds the manual development bridge, closes only its own popup and rejects its late response', function () {
		const h = setup();
		let callback, closed = 0;
		h.app.addPopup = (type, data) => {
			callback = data.callback;
			const popup = {close: () => {closed++; h.app.popups.pop();}};
			h.app.popups.push(popup);
			return popup;
		};
		h.context.ProxyPopup = function () {};
		h.context.BattleLog.escapeHTML = value => value;
		installTestClient(h, undefined);
		h.user.receiveChallstr('A');
		h.tick(30000);
		assert.strictEqual(h.user.upkeepError, '');
		h.tick(90000);
		assert.strictEqual(closed, 1);
		assert.strictEqual(h.user.upkeepError, 'timeout');
		callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		assert.strictEqual(h.sent.length, 0);
		h.user.retryUpkeep();
		h.app.popups.push({close: () => {throw new Error('Unrelated popup closed');}});
		h.user.resetUpkeep(true);
		assert.strictEqual(closed, 1);
	});
	it('removes only the cancelled cross-origin callback from the iframe request registry', function () {
		const h = setup();
		h.context.Storage = {
			crossOriginRequestCount: 1, crossOriginRequests: {0: function () {}},
			postCrossOriginMessage: function () {}
		};
		const start = storageSource.indexOf('$.post = function');
		const end = storageSource.indexOf('\n\t\t\t};', start) + 6;
		vm.runInContext(storageSource.slice(start, end), h.context);
		h.user.receiveChallstr('A');
		assert.strictEqual(typeof h.context.Storage.crossOriginRequests[1], 'function');
		h.tick(30000);
		assert.strictEqual(h.context.Storage.crossOriginRequests[1], undefined);
		assert.strictEqual(typeof h.context.Storage.crossOriginRequests[0], 'function');
		assert.strictEqual(h.user.upkeepError, 'timeout');
	});
	it('invalidates a pending upkeep response immediately on logout, before socket close completes', function () {
		const h = setup();
		h.app.socket = {close: function () {}};
		h.user.receiveChallstr('A');
		h.user.logout();
		h.requests[0].callback('{"username":"Old","loggedin":true,"assertion":"old-token"}');
		assert.strictEqual(h.sent.length, 1);
		assert.strictEqual(h.sent[0], '/logout');
		assert.strictEqual(h.user.loaded, false);
	});
});
