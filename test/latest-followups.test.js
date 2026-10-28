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
   require('./helpers/assert-logical-sprite.cjs')(staticSpriteData('Lucario-Mega-Z',false,{gen:9,shiny}),'Lucario-Mega-Z',false);
   require('./helpers/assert-logical-sprite.cjs')(staticSpriteData('Lopunny-Mega',false,{gen:9,shiny}),'Lopunny-Mega',false);
   require('./helpers/assert-logical-sprite.cjs')(staticSpriteData('Lopunny',true,{gen:9,shiny}),'Lopunny',true);
  }
  require('./helpers/assert-logical-sprite.cjs')(staticSpriteData('Lucario-Mega-Z',true,{gen:9}),'Lucario-Mega-Z',true);
 });
});


// Verify approved static artwork independently of the normal BW animation route.
function staticSpriteData(...args) {
 const prefs = Dex.prefs;
 Dex.prefs = key => key === 'nogif' ? true : prefs.call(Dex, key);
 try { return Dex.getSpriteData(...args); } finally { Dex.prefs = prefs; }
}
