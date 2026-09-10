// Import only exact sprite-name matches from Pokemon Showdown's dedicated artwork.
// Run from the client root after generating teambuilder-audit-before.json.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const rows = require('../teambuilder-audit-before.json').filter(row => row.available);
const manifestPath = path.join(root, 'teambuilder-art-manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
async function main() {
	for (let start = 0; start < rows.length; start += 8) {
		await Promise.all(rows.slice(start, start + 8).map(async row => {
			if (manifest[row.spriteid] && ['dex', ...(row.shiny ? ['dex-shiny'] : [])].every(dir =>
				fs.existsSync(path.join(root, 'play.pokemonshowdown.com/sprites', dir, row.spriteid + '.png'))
			)) return;
			const entry = {};
			for (const variant of ['normal', 'shiny']) {
				if (variant === 'shiny' && !row.shiny) continue;
				const dir = variant === 'shiny' ? 'dex-shiny' : 'dex';
				const url = `https://play.pokemonshowdown.com/sprites/${dir}/${row.spriteid}.png`;
				const response = await fetch(url);
				if (!response.ok) throw new Error(`${url}: ${response.status}`);
				const data = Buffer.from(await response.arrayBuffer());
				if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`Not a PNG: ${url}`);
				const w = data.readUInt32BE(16), h = data.readUInt32BE(20);
				if (w < 16 || h < 16) throw new Error(`Placeholder: ${url}`);
				fs.writeFileSync(path.join(root, 'play.pokemonshowdown.com/sprites', dir, row.spriteid + '.png'), data);
				entry[variant] = {w, h};
			}
			manifest[row.spriteid] = entry;
		}));
		console.log(`Imported ${Math.min(start + 8, rows.length)}/${rows.length}`);
	}
	const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
	fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + '\n');
	const sourcePath = path.join(root, 'play.pokemonshowdown.com/src/battle-dex.ts');
	const source = fs.readFileSync(sourcePath, 'utf8');
	const declaration = 'const NATIVE_TEAMBUILDER_ART: {[spriteid: string]: {normal: {w: number, h: number}, shiny?: {w: number, h: number}}} = {\n' +
		Object.entries(sorted).map(([key, value]) => '\t' + JSON.stringify(key) + ': ' + JSON.stringify(value) + ',').join('\n') + '\n};';
	if (!source.includes('const NATIVE_TEAMBUILDER_ART:')) throw new Error('Missing native artwork declaration');
	fs.writeFileSync(sourcePath, source.replace(/const NATIVE_TEAMBUILDER_ART:[\s\S]*?\n};/, declaration));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
