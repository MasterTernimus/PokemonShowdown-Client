'use strict';
const {PNG} = require('pngjs');
const {GifReader} = require('omggif');

// Logical pixels, not file dimensions: imported art often contains exact 2x/3x copies.
// Ignore RGB in transparent pixels and measure the full visible silhouette.
function measureRGBA(width, height, rgba) {
	let left = width, top = height, right = -1, bottom = -1;
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		if (!rgba[(y * width + x) * 4 + 3]) continue;
		left = Math.min(left, x); top = Math.min(top, y);
		right = Math.max(right, x); bottom = Math.max(bottom, y);
	}
	if (right < 0) return null;
	const w = right - left + 1, h = bottom - top + 1;
	let pixelScale = 1;
	for (const n of [4, 3, 2]) {
		if (w % n || h % n || w / n < 8 || h / n < 8) continue;
		let matches = true;
		for (let y = top; y <= bottom && matches; y++) for (let x = left; x <= right; x++) {
			const a = (y * width + x) * 4;
			const b = ((top + Math.floor((y - top) / n) * n) * width + left + Math.floor((x - left) / n) * n) * 4;
			if (rgba[a + 3] !== rgba[b + 3] || (rgba[a + 3] &&
				(rgba[a] !== rgba[b] || rgba[a + 1] !== rgba[b + 1] || rgba[a + 2] !== rgba[b + 2]))) {
				matches = false; break;
			}
		}
		if (matches) { pixelScale = n; break; }
	}
	return [width, height, left, top, w, h, pixelScale];
}

function measureImage(bytes) {
	if (bytes.subarray(1, 4).toString() === 'PNG') {
		const png = PNG.sync.read(bytes);
		return measureRGBA(png.width, png.height, png.data);
	}
	if (bytes.subarray(0, 3).toString() !== 'GIF') return null;
	const gif = new GifReader(bytes);
	// Keep the animation's full canvas so moving limbs never change size between frames.
	// Validate pixel density on several poses; never infer a different size per frame.
	let pixelScale = 4;
	for (const index of new Set([0, Math.floor(gif.numFrames() / 2), gif.numFrames() - 1])) {
		const rgba = Buffer.alloc(gif.width * gif.height * 4);
		gif.decodeAndBlitFrameRGBA(index, rgba);
		const metrics = measureRGBA(gif.width, gif.height, rgba);
		pixelScale = Math.min(pixelScale, metrics?.[6] || 1);
	}
	return [gif.width, gif.height, 0, 0, gif.width, gif.height, pixelScale];
}
module.exports = {measureRGBA, measureImage};
