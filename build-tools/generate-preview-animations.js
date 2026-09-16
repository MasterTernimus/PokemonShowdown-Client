const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const {GifReader} = require('omggif');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const entries = {};
const assets = {};
for (const style of ['gen5ani', 'ani']) {
	for (const variant of ['', '-shiny', '-back', '-back-shiny']) {
		const dir = style + variant;
		for (const file of fs.readdirSync(path.join(root, 'sprites', dir)).sort()) {
			if (!file.endsWith('.gif')) continue;
			const filePath = path.join(root, 'sprites', dir, file);
			if (!fs.statSync(filePath).size) continue;
			const {width, height} = sizeOf(filePath);
			const bytes = fs.readFileSync(filePath);
			// Some legacy .gif paths contain PNGs or single-frame placeholders.
			const frames = bytes.subarray(0, 3).toString() === 'GIF' ? new GifReader(bytes).numFrames() : 1;
			assets[dir + '/' + file] = [width, height];
			if (frames > 1) entries[dir + '/' + file] = [width, height];
		}
	}
}
for (const dir of ['gen5', 'gen5-shiny', 'gen5-back', 'gen5-back-shiny', 'dex', 'dex-shiny']) {
	for (const file of fs.readdirSync(path.join(root, 'sprites', dir)).sort()) {
		if (!file.endsWith('.png')) continue;
		const filePath = path.join(root, 'sprites', dir, file);
		if (!fs.statSync(filePath).size) continue;
		const {width, height} = sizeOf(filePath);
		assets[dir + '/' + file] = [width, height];
	}
}
const sourcePath = path.join(root, 'src/battle-dex.ts');
let source = fs.readFileSync(sourcePath, 'utf8');
const start = '// BEGIN GENERATED PREVIEW ANIMATIONS';
const end = '// END GENERATED PREVIEW ANIMATIONS';
const block = start + '\nconst TEAM_PREVIEW_ANIMATIONS: {[path: string]: number[]} = ' + JSON.stringify(entries) +
	';\nconst SPRITE_ASSET_DIMENSIONS: {[path: string]: number[]} = ' + JSON.stringify(assets) + ';\n' + end;
if (source.includes(start)) {
	source = source.slice(0, source.indexOf(start)) + block + source.slice(source.indexOf(end) + end.length);
} else {
	source = block + '\n' + source;
}
fs.writeFileSync(sourcePath, source);
console.log('Indexed ' + Object.keys(entries).length + ' preview animations');
