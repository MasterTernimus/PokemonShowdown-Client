const assert = require('assert').strict;
require('./battle.test');
describe('Latest appearance and ability metadata', () => {
 for (const shiny of [false, true]) it('uses the base Primarina back only for player team preview ' + shiny, () => {
  const preview = Dex.getSpriteData('Primarina-Alt', false, {gen: 9, shiny, teamPreview: true});
  assert(preview.url.includes('/primarina.')); assert(preview.url.includes('-back'));
  assert.equal(preview.url.includes('-shiny/'), shiny);
  for (const front of [false, true]) {
   const ordinary = Dex.getSpriteData('Primarina-Alt', front, {gen: 9, shiny});
   assert(ordinary.url.includes(front ? '/primarina-alt.' : '/primarina.'));
  }
  const opponent = Dex.getSpriteData('Primarina-Alt', true, {gen: 9, shiny, teamPreview: true});
  assert(opponent.url.includes('/primarina-alt.'));
 });
 it('keeps exact form-specific sprite size and other Lucario forms unchanged', () => {
  for (const shiny of [false, true]) {
   assert.equal(Dex.getSpriteData('Lucario-Mega-Z', false, {gen: 9, shiny}).h, 68);
   assert.equal(Dex.getSpriteData('Lopunny-Mega', false, {gen: 9, shiny}).h, 68);
   assert.equal(Dex.getSpriteData('Lopunny', true, {gen: 9, shiny}).h, 64);
  }
  assert.equal(Dex.getSpriteData('Lucario-Mega-Z', true, {gen: 9}).h, 82);
 });
});
