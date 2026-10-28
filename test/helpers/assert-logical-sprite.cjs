const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const {measureImage} = require('../../build-tools/sprite-image-metrics.cjs');
const reference = require('../../build-tools/data/showdown-sprite-reference.json');
const cache = new Map();
// Check actual visible pixels against upstream references, independently of renderer metadata.
module.exports = function assertLogicalSize(data, species, front, preview = false) {
	const asset = data.url.split('/sprites/')[1].split('?')[0];
	if (!cache.has(asset)) cache.set(asset, measureImage(fs.readFileSync(path.join(__dirname, '../../play.pokemonshowdown.com/sprites', asset))));
	const m = cache.get(asset);
	assert(m, asset);
	const id = species.toLowerCase().replace(/[^a-z0-9]/g, '');
	const table = reference[/^(?:ani|dex)/.test(asset) ? 'xy' : 'bw'];
	const ref = table[id]?.[front ? 'front' : 'back'];
	const max = preview ? (id.includes('gmax') ? 96 : id.includes('mega') || id.includes('battlebond') ? 88 : 80) :
		id.includes('gmax') ? 160 : id.includes('mega') || id.includes('battlebond') ? 128 : 120;
	const bound = Math.min(max, ref ? Math.max(...ref) : max);
	assert(data.w > 0 && data.h > 0);
	assert(data.w * m[4] / m[0] <= bound + 1 && data.h * m[5] / m[1] <= bound + 1, species + ': exceeds logical bounds');
	assert(data.w <= m[0] / m[6] + 1 && data.h <= m[1] / m[6] + 1, species + ': enlarges native pixels');
	assert(Math.abs(data.w / m[0] - data.h / m[1]) <= 1 / Math.min(m[0], m[1]), species + ': distorted');
};

module.exports.tile = function assertTile(data) {
 const file=path.join(__dirname,'../../play.pokemonshowdown.com',data.spriteDir+(data.shiny?'-shiny':'')+'/'+data.spriteid+'.png');
 const m=measureImage(fs.readFileSync(file));assert(m,file);const scale=parseFloat(data.backgroundSize)/m[0];assert(scale>0 && Number.isFinite(scale));
 assert(data.x+m[2]*scale>=-1 && data.y+m[3]*scale>=-1,'clipped top/left: '+file);
 assert(data.x+(m[2]+m[4])*scale<=97 && data.y+(m[3]+m[5])*scale<=97,'clipped bottom/right: '+file);
};
