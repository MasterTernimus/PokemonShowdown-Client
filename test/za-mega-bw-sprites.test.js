const assertLogicalSize = require('./helpers/assert-logical-sprite.cjs');
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {GifReader} = require('omggif');
const {Dex} = require('./helpers/isolated-dex.cjs')();
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const credits = require('../play.pokemonshowdown.com/sprites/za-bw-credits.json');
const baseline = require('./fixtures/za-mega-bw-preservation.json');
const ids = [...new Set(credits.assets.map(a => a.id))];
describe('Approved non-shiny Z-A Mega BW animations', () => {
 it('sizes the full Mega artwork independently of the base form', () => {
  for (const [id, front, expected] of [
   ['staraptormega', true, [128, 125]], ['staraptormega', false, [128, 124]],
   ['tatsugiricurlymega', true, [128, 107]], ['tatsugiricurlymega', false, [119, 77]],
   ['chesnaughtmega', true, [128, 111]], ['chesnaughtmega', false, [101, 128]],
  ]) {
   const data = Dex.getSpriteData(id, front, {gen: 9});
   assert.deepEqual([data.w, data.h], expected, id + (front ? ' front' : ' back'));
  }
 });
 it('keeps native pixels, compact previews, raw dimensions and Dynamax scaling distinct', () => {
  for (const a of credits.assets) {
   const front = a.side === 'front';
   const scale = Math.min(1, 128 / a.width, 128 / a.height);
   for (const gen of [5, 9]) {
    const data = Dex.getSpriteData(a.id, front, {gen});
    assert.deepEqual([data.w, data.h], [Math.round(a.width * scale), Math.round(a.height * scale)], a.id);
    const dynamax = Dex.getSpriteData(a.id, front, {gen, dynamax: true});
    assert.deepEqual([dynamax.w, dynamax.h], [Math.round(a.width * scale * 2), Math.round(a.height * scale * 2)], a.id);
    const raw = Dex.getSpriteData(a.id, front, {gen, noScale: true, dynamax: true});
    assert.deepEqual([raw.w, raw.h], [a.width, a.height], a.id);
   }
  }
  for (const [id, front, expected] of [
   ['staraptormega', true, [79, 78]], ['staraptormega', false, [85, 83]],
   ['chesnaughtmega', true, [88, 76]], ['chesnaughtmega', false, [69, 88]],
  ]) for (const noScale of [false, true]) {
   const data = Dex.getSpriteData(id, front, {gen: 9, teamPreview: true, noScale});
   assert.deepEqual([data.w, data.h], expected, id + ' preview');
  }
 });
 it('leaves custom shiny Mega battle sizing unchanged', () => {
  for (const [id, front, expected] of [
   ['staraptormega', true, [87, 81]], ['staraptormega', false, [79, 86]],
   ['chesnaughtmega', true, [96, 96]], ['chesnaughtmega', false, [96, 96]],
   ['tatsugiricurlymega', true, [35, 23]], ['tatsugiricurlymega', false, [69, 43]],
  ]) {
   const data = Dex.getSpriteData(id, front, {gen: 9, shiny: true});
   assert.deepEqual([data.w, data.h], expected, id + ' shiny');
   assert(!data.url.includes('/za-'), data.url);
  }
 });
 it('contains exactly the approved 37 front/back pairs', () => {
  assert.equal(ids.length, 37);
  assert.equal(credits.assets.length, 74);
 });
 for (const id of ids) it(id + ' uses original animated front/back bytes with exact routing', () => {
  for (const a of credits.assets.filter(a => a.id === id)) {
   const bytes = fs.readFileSync(path.join(root, 'sprites', a.installedPath));
   const gif = new GifReader(bytes);
   assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), a.sha256);
   assert.equal(gif.numFrames(), a.frames);
   assert(gif.numFrames() > 1);
   assert.equal(gif.width, a.width);
   assert.equal(gif.height, a.height);
   assert.equal(Array.from({length: gif.numFrames()}, (_, i) => gif.frameInfo(i).delay).reduce((n, d) => n + d, 0), a.durationCs);
   for (const gen of [5, 9]) for (const teamPreview of [false, true]) for (const gender of ['M', 'F']) {
    const data = Dex.getSpriteData(id, a.side === 'front', {gen, teamPreview, gender});
    assert(data.url.includes('/sprites/' + a.installedPath), data.url);
    assert(data.pixelated);
    assertLogicalSize(data, id, a.side === 'front', teamPreview);
   }
   const raw = Dex.getSpriteData(id, a.side === 'front', {gen: 9, noScale: true});
   assert.equal(raw.w, a.width);
   assert.equal(raw.h, a.height);
  }
 });
 it('preserves shiny artwork and unmatched family variants while normalizing size', () => {
  for (const r of baseline) {
   if (r.shiny && ['delphox','delphoxmega','gyarados','gyaradosmega'].includes(r.id)) { const d = Dex.getSpriteData(r.id,r.front,{gen:9,shiny:true}); assert(d.url.includes('shiny-sheets-20261015')); assertLogicalSize(d,r.id,r.front); continue; }
   const actual = Dex.getSpriteData(r.id, r.front, {gen: 9, shiny: r.shiny, teamPreview: r.teamPreview});
   const {w, h, ...appearance} = JSON.parse(JSON.stringify(actual));
   const {w: oldW, h: oldH, ...expectedAppearance} = r.data;
   assert.deepEqual(appearance, expectedAppearance, r.id + ' shiny=' + r.shiny);
   assertLogicalSize(actual, r.id, r.front, r.teamPreview);
  }
 });
 for (const preference of ['noanim', 'nogif']) it('honors ' + preference + ' with existing fallback sprites', () => {
  const {Dex: dex} = require('./helpers/isolated-dex.cjs')();
  dex.prefs = key => key === preference;
  for (const id of ids) for (const front of [false, true]) for (const teamPreview of [false, true]) {
   const data = dex.getSpriteData(id, front, {gen: 9, teamPreview});
   assert(!data.url.includes('/za-'));
   assert(fs.existsSync(path.join(root, 'sprites', data.url.split('/sprites/')[1].split('?')[0])), data.url);
  }
 });
});
