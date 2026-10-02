const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');
describe('Pending PULSE sprite assets', () => {
 for (const [base, frontHeight, frontWidth] of [['avalugg', 256, 192], ['camerupt', 192, 192], ['magnezone', 186, 170]]) {
  it(base + ' uses its complete front and approved back, with normal art for shiny', () => {
   const id = base + 'pulse';
   assert(BattlePokedex[id], id + ' is present in actual client data');
   {
    for (const gen of [5, 9]) for (const shiny of [false, true]) for (const side of [0, 1]) {
     const sprite = Dex.getSpriteData(id, side, {gen, shiny});
     const expected = 'gen5' + (side ? '' : '-back') + '/' + base + '-pulse.png';
     assert(sprite.url.includes(expected), sprite.url);
     const image = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', expected));
     assert.equal(image.readUInt32BE(16), side ? frontWidth : 192);
     assert.equal(image.readUInt32BE(20), side ? frontHeight : 192);
     assert(sprite.w > 0 && sprite.h > 0);
    }
   }
  });
 }
});
