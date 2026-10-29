'use strict';
// Extract the supplied sheet cells exactly; halve the source's 2x pixel grid for BW rendering.
const fs = require('fs');
const path = require('path');
const {PNG} = require('pngjs');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com/sprites');
const sheets = process.argv.slice(2).map(file => PNG.sync.read(fs.readFileSync(file)));
if (sheets[0]?.width !== 384 || sheets[0]?.height !== 1152 || sheets[1]?.width !== 256 || sheets[1]?.height !== 192) throw new Error('Unexpected source sheet dimensions');
function extract(sheet, left, top, size) {
	const out = new PNG({width: size / 2, height: size / 2});
	for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
		sheet.data.copy(out.data, (y * out.width + x) * 4, ((top + y * 2) * sheet.width + left + x * 2) * 4, ((top + y * 2) * sheet.width + left + x * 2) * 4 + 4);
	}
	return out;
}
const cells = [];
for (const [dir, x, y] of [['gen5', 0, 384], ['gen5-shiny', 192, 384], ['gen5-back', 0, 576], ['gen5-back-shiny', 192, 576]]) {
	const png = extract(sheets[0], x, y, 192);
	fs.mkdirSync(path.join(root, dir), {recursive: true});
	fs.writeFileSync(path.join(root, dir, 'alakazam-rejuv.png'), PNG.sync.write(png));
	cells.push(png);
	if (!dir.includes('back')) {
		const artDir = dir.includes('shiny') ? 'dex-shiny' : 'dex';
		fs.writeFileSync(path.join(root, artDir, 'alakazam-rejuv.png'), PNG.sync.write(png));
	}
}
for (const [suffix, x] of [['', 0], ['-shiny', 128]]) {
	const png = extract(sheets[1], x, 64, 64);
	fs.writeFileSync(path.join(root, 'pokemonicons', 'alakazam-rejuv' + suffix + '.png'), PNG.sync.write(png));
}
const preview = new PNG({width: 384, height: 384});
for (let i = 0; i < cells.length; i++) for (let y = 0; y < 192; y++) for (let x = 0; x < 192; x++) {
	const src = (Math.floor(y / 2) * 96 + Math.floor(x / 2)) * 4;
	const dst = ((Math.floor(i / 2) * 192 + y) * 384 + (i % 2) * 192 + x) * 4;
	cells[i].data.copy(preview.data, dst, src, src + 4);
}
fs.writeFileSync(path.resolve(__dirname, '../caches/alakazam-rejuv-preview.png'), PNG.sync.write(preview));
const sourcePath = path.resolve(__dirname, '../play.pokemonshowdown.com/src/battle-dex.ts');
let source = fs.readFileSync(sourcePath, 'utf8');
const {measureImage} = require('./sprite-image-metrics.cjs');
for (const variable of ['SPRITE_ASSET_DIMENSIONS', 'SPRITE_IMAGE_METRICS']) {
	const expression = new RegExp('^(const ' + variable + ': [^=]+ = )(.*);$', 'm');
	const match = source.match(expression);
	if (!match) throw new Error('Missing sprite metrics table: ' + variable);
	const table = JSON.parse(match[2]);
	for (const dir of ['gen5', 'gen5-back', 'gen5-shiny', 'gen5-back-shiny', 'dex', 'dex-shiny']) {
		const file = dir + '/alakazam-rejuv.png';
		const metrics = measureImage(fs.readFileSync(path.join(root, file)));
		table[file] = variable === 'SPRITE_ASSET_DIMENSIONS' ? metrics.slice(0, 2) : metrics;
	}
	source = source.replace(expression, () => match[1] + JSON.stringify(table) + ';');
}
fs.writeFileSync(sourcePath, source);
console.log('Extracted normal/shiny fronts, backs, icons, and teambuilder images.');
