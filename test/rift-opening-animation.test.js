'use strict';
const assert = require('assert').strict;
const fs = require('fs');

function harness() {
 const calls = {effects: [], backgrounds: [], waits: [], poses: []};
 const others = new Proxy({}, {get: () => ({anim() {throw new Error('Rift Opening must have its own playback');}})});
 const animations = new Function('BattleOtherAnims', fs.readFileSync('play.pokemonshowdown.com/js/battle-animations-moves.js', 'utf8') + '\nreturn BattleMoveAnims;')(others);
 const scene = {
  showEffect(effect, start, end, transition, after, css) {calls.effects.push({effect, start, end, transition, after, css});},
  backgroundEffect(background, duration, opacity, delay = 0) {calls.backgrounds.push({background, duration, opacity, delay});},
  wait(duration) {calls.waits.push(duration);},
 };
 const user = {x: -80, y: 0, z: 0, anim(pose, transition) {calls.poses.push({pose, transition});return this;}};
 return {calls, scene, user, animations};
}

describe('Rift Opening native portal animation', () => {
 for (const roster of ['user only', 'user and target', 'no sprite']) it('plays a complete finite field animation with ' + roster, () => {
  const {calls, scene, user, animations} = harness();
  const target = {x: 80, y: 0, z: 200, anim() {throw new Error('A field move must not hit the target');}};
  const sprites = roster === 'no sprite' ? [] : roster === 'user only' ? [user] : [user, target];
  assert.notEqual(animations.riftopening.anim, animations.trickroom.anim);
  animations.riftopening.anim(scene, sprites);
  assert(calls.effects.length >= 8, 'portal and fragments should be visible');
  assert(calls.effects.some(effect => effect.effect === 'shadowball' && effect.css?.filter === 'brightness(0)'), 'the portal needs a dark core');
  assert(calls.effects.some(effect => effect.effect === 'poisonwisp'), 'the portal needs visible fragments');
  assert.equal(calls.backgrounds.length, 1);
  assert(calls.waits.length && calls.waits[0] >= 1000 && calls.waits[0] <= 1600, 'the animation must finish promptly');
  const finish = calls.waits[0];
  for (const effect of calls.effects) {
   assert(['shadowball', 'poisonwisp'].includes(effect.effect), 'use existing native effect assets');
   assert(effect.end.time > (effect.start.time || 0));
   assert(effect.end.time <= finish);
   for (const value of Object.values(effect.start).concat(Object.values(effect.end))) assert.equal(Number.isFinite(value), true);
  }
  const {duration, delay} = calls.backgrounds[0];
  assert(duration + delay + 250 <= finish, 'wait must include the background fade');
  assert(calls.effects.filter(effect => effect.effect === 'shadowball' && effect.end.opacity === 0).length >= 2, 'both core and edge must close');
  assert(calls.effects.filter(effect => effect.effect === 'shadowball').every(effect => effect.end.opacity === 0 || effect.after === 'fade'), 'earlier portal phases must fade instead of leaving an open portal behind');
  assert.equal(calls.poses.length, roster === 'no sprite' ? 0 : 2);
 });
});
