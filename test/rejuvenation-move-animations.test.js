'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ids = ['multipulse','aquabatics','feverpitch','thunderraid','desertsmark','superumdmove','galestrike','spectralscream','barbedweb','coldtruth','bunrakubeatdown','matrixshot','pyrokinesis','venamskiss','heavenlywing','uproot',"vorpalblade","gildedarrow","gildedhelix","beasthunter","poisonsweep","stackingshot","irritation","slashandburn","magmadrift","unownbuster"];
function harness() {
 const calls = [];
 const other = new Proxy({}, {get: (_, id) => ({anim: () => calls.push(['other', id])})});
 const animations = new Function('BattleOtherAnims', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations-moves.js', 'utf8') + '\nreturn BattleMoveAnims;')(other);
 const sprite = (x, z) => new Proxy({x, y: 0, z, w: 96, h: 96, isBackSprite: z === 0, statbar: null}, {
  get: (obj, key) => key in obj ? obj[key] : (...args) => {
   calls.push(['sprite', key, ...args]);
   if (key === 'leftof') return x + args[0];
   if (key === 'behind') return z + args[0];
   return obj;
  },
 });
 const jquery = new Proxy({}, {get: (_, key) => (...args) => {calls.push(['jquery', key, ...args]); return jquery;}});
 const scene = new Proxy({timeOffset: 0, acceleration: 1, animating: true, $bg: jquery}, {get: (obj, key) => key in obj ? obj[key] : (...args) => {calls.push(['scene', key, ...args]);}});
 return {animations, calls, scene, sprites: [sprite(80, 0), sprite(240, 200)]};
}
describe('Rejuvenation move animation registration and playback', () => {
 for (const id of ids) it(id + ' executes its registered animation', () => {
  const {animations, calls, scene, sprites} = harness();
  assert.equal(typeof animations[id]?.anim, 'function', 'requires explicit registration');
  animations[id].anim(scene, id === 'aquabatics' ? [sprites[0]] : sprites);
  assert(calls.length > 0, 'playback must produce visible effects or sprite movement');
 });
 it('Thunder Raid is one impact invocation, not a preplayed three-hit sequence', () => {
  const {animations, calls, scene, sprites} = harness();
  animations.thunderraid.anim(scene, sprites);
  const once = calls.length;
  calls.length = 0;
  animations.thunderpunch.anim(scene, sprites);
  assert.equal(calls.length, once);
  assert.equal(animations.thunderraid.anim, animations.thunderpunch.anim);
 });
 it('only Spectral Scream delegates to a drain animation', () => {
  const {animations, scene, sprites} = harness();
  let drains = 0;
  const original = animations.leechlife.anim;
  animations.leechlife.anim = () => {drains++;};
  for (const id of ids) {
   drains = 0;
   animations[id].anim(scene, id === 'aquabatics' ? [sprites[0]] : sprites);
   assert.equal(drains, id === 'spectralscream' ? 1 : 0, id);
  }
  animations.leechlife.anim = original;
 });
});
