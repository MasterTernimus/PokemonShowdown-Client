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
    assert(data.w > 0 && data.h > 0 && data.w <= 96 && data.h <= 96);
   }
   const raw = Dex.getSpriteData(id, a.side === 'front', {gen: 9, noScale: true});
   assert.equal(raw.w, a.width);
   assert.equal(raw.h, a.height);
  }
 });
 it('preserves shiny rendering and unmatched family variants exactly', () => {
  for (const r of baseline) {
   const actual = Dex.getSpriteData(r.id, r.front, {gen: 9, shiny: r.shiny, teamPreview: r.teamPreview});
   assert.deepEqual(JSON.parse(JSON.stringify(actual)), r.data, r.id + ' shiny=' + r.shiny);
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
