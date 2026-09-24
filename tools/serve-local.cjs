'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..', 'play.pokemonshowdown.com');
const port = Number(process.env.PORT || 8088);
const types = {
	'.css': 'text/css', '.gif': 'image/gif', '.html': 'text/html', '.js': 'text/javascript',
	'.json': 'application/json', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
	'.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
};

http.createServer((request, response) => {
	let pathname;
	try {
		pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
	} catch {
		response.writeHead(400).end();
		return;
	}
	const file = path.resolve(root, `.${pathname === '/' ? '/testclient-beta.html' : pathname}`);
	if (file !== root && !file.startsWith(root + path.sep)) {
		response.writeHead(403).end();
		return;
	}
	fs.stat(file, (error, stat) => {
		if (error || !stat.isFile()) {
			response.writeHead(404).end();
			return;
		}
		response.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
		fs.createReadStream(file).pipe(response);
	});
}).listen(port, '127.0.0.1', () => console.log(`Client preview: http://127.0.0.1:${port}/`));
