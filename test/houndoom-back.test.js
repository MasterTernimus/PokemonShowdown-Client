'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
require('./battle.test');
const source = fs.readFileSync('play.pokemonshowdown.com/src/battle-animations.ts', 'utf8');
const helper = source.slice(source.indexOf('function isBottomAlignedBackSprite'), source.indexOf('export class BattleScene'));
const start = source.indexOf('\tpos(loc: ScenePos');
const end = source.indexOf('\n\t/**', start);
const compiled = ts.transpile(helper + '\nclass PositionTest {\n' + source.slice(start, end) + '\n}');
const PositionTest = new Function(compiled + '\nreturn PositionTest;')();
describe('Mega Houndoom cropped back positioning', () => {
 for (const shiny of [false, true]) {
  it('uses the complete ' + (shiny ? 'shiny' : 'normal') + ' BW back', () => {
   const sprite = Dex.getSpriteData('Houndoom-Mega', 0, {gen: 5, shiny});
   assert(sprite.url.includes((shiny ? 'gen5-back-shiny/houndoom-mega.png' : 'ani-back/houndoom-mega.gif')));
   const pos = new PositionTest().pos({x: 0, y: 0, z: 0}, sprite);
   assert.notEqual(pos.top + pos.height, 360);
   assert(pos.height <= 164);
   assert.equal(new PositionTest().pos({y: 10}, sprite).top, pos.top - 20);
  });
 }
 it('leaves the front sprite on its normal battle baseline', () => {
  const sprite = Dex.getSpriteData('Houndoom-Mega', 1, {gen: 5});
  const pos = new PositionTest().pos({x: 0, y: 0, z: 200}, sprite);
  assert.notEqual(pos.top + pos.height, 360);
 });
});
