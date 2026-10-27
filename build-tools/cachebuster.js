'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Resolve against the source tree before rewriting hosts for deployment.
// config/ is shared by the web roots rather than nested inside them.
module.exports = function createCachebuster(routes, root = path.resolve(__dirname, '..'), relativeRoot = 'replay.pokemonshowdown.com') {
	const hosts = {
		'play.pokemonshowdown.com': routes.client,
		'replay.pokemonshowdown.com': routes.replays,
		'dex.pokemonshowdown.com': routes.dex,
		'pokemonshowdown.com': routes.root,
	};
	return function addCachebuster(_, attr, url, query) {
		const original = url;
		url = url.replace(/^\/\/([^/]+)\//, (match, host) => hosts[host] ? '//' + hosts[host] + '/' : match);
		if (query === undefined) return attr + '="' + url + '"';
		let filename;
		if (original.startsWith('//')) {
			const match = /^\/\/([^/]+)\/(.*)$/.exec(original);
			if (!match || !hosts[match[1]]) return attr + '="' + url + query + '"';
			filename = match[1] + '/' + match[2];
		} else if (original.startsWith('/')) {
			filename = 'play.pokemonshowdown.com' + original;
		} else {
			filename = relativeRoot + '/' + original;
		}
		if (filename === 'play.pokemonshowdown.com/config/config.js') filename = 'config/config.js';
		// Missing resources must be fixed at build time, not hidden by random URLs.
		const contents = fs.readFileSync(path.join(root, filename));
		const hash = crypto.createHash('md5').update(contents).digest('hex').slice(0, 8);
		return attr + '="' + url + '?' + hash + '"';
	};
};
