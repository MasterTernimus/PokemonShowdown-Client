'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
function Room() {}
Room.prototype.updateControls = function () {};
Room.prototype.setControlsHTML = function () {};
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-battle.js', 'utf8');
const start = source.indexOf('// The status rail only reads public protocol state');
assert(start >= 0);
const escapeHTML = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
new Function('BattleRoom', 'BattleLog', 'Dex', 'toID', source.slice(start))(Room, {escapeHTML}, Dex, toID);
describe('Public battle effects rail', () => {
 let battle;
 afterEach(() => battle?.destroy());
 function room(lines) {
  battle = new Battle({debug: true, log: ['|gen|9', '|gametype|doubles', '|player|p1|One', '|player|p2|Two', ...lines]});
  const r = new Room(); r.battle = battle; r.side = 'p1'; return r;
 }
 it('shows fields, all supported room effects and both sides without a collapsed menu', () => {
  const r = room(['|-fieldstart|Rocky Terrain|[turns] 0', '|-fieldstart|Trick Room|[turns] 4', '|-fieldstart|Wonder Room|[turns] 3', '|-fieldstart|Magic Room|[turns] 2', '|-fieldstart|Gravity|[turns] 5', '|-sidestart|p1: One|move: Reflect', '|-sidestart|p1: One|move: Tailwind|[turns] 2', '|-sidestart|p2: Two|move: Light Screen|[turns] 3', '|-sidestart|p2: Two|move: Aurora Veil']);
  const before = JSON.stringify([battle.pseudoWeather, battle.p1.sideConditions, battle.p2.sideConditions]);
  const html = r.publicBattleEffectsHTML();
  for (const name of ['Rocky Terrain', 'Persistent', 'Trick Room', 'Wonder Room', 'Magic Room', 'Gravity', 'Reflect', 'Light Screen', 'Aurora Veil', 'Tailwind', 'Your side', 'Opponent']) assert(html.includes(name), name);
  assert(html.includes('5 or 8 turns'));
  assert(html.includes('>2 turns<'));
  assert(!html.includes('2 or 2'));
  assert(!html.includes('<details'));
  assert.equal(JSON.stringify([battle.pseudoWeather, battle.p1.sideConditions, battle.p2.sideConditions]), before);
 });
 it('keeps normal Tailwind at four, follows turn counters and removes ended effects', () => {
  const r = room(['|-sidestart|p1: One|move: Tailwind']);
  assert(r.publicBattleEffectsHTML().includes('>4 turns<'));
  battle.runMinor(['-sidestart', 'p1: One', 'move: Tailwind'], {turns: '2'});
  assert(r.publicBattleEffectsHTML().includes('>2 turns<'));
  battle.updateTurnCounters();
  assert(r.publicBattleEffectsHTML().includes('>1 turn<'));
  battle.runMinor(['-sideend', 'p1: One', 'move: Tailwind'], {});
  assert.equal(r.publicBattleEffectsHTML(), '');
 });
 it('preserves genuine uncertainty and formats equal weather bounds once', () => {
  const r = room([]); battle.weather = 'raindance'; battle.weatherMinTimeLeft = 5; battle.weatherTimeLeft = 8;
  assert(r.publicBattleEffectsHTML().includes('5 or 8 turns'));
  battle.weatherMinTimeLeft = battle.weatherTimeLeft = 2;
  const html = r.publicBattleEffectsHTML();
  assert(html.includes('>2 turns<')); assert(!html.includes('2 or 2'));
 });
 it('labels the real player side correctly after perspective reversal', () => {
  const r = room(['|-sidestart|p1: One|move: Reflect', '|-sidestart|p2: Two|move: Tailwind']);
  battle.setViewpoint('p2');
  const html = r.publicBattleEffectsHTML();
  assert(html.indexOf('data-side="p2"') < html.indexOf('data-side="p1"'));
  assert(/data-side="p1"><strong>Your side/.test(html));
  assert(/data-side="p2"><strong>Opponent/.test(html));
 });
 it('escapes public trainer names and supports untimed hazard layers', () => {
  const r = room(['|-sidestart|p1: One|move: Spikes', '|-sidestart|p1: One|move: Spikes']);
  r.side = ''; battle.p1.name = '<unsafe>';
  const html = r.publicBattleEffectsHTML();
  assert(html.includes('&lt;unsafe&gt;')); assert(!html.includes('<unsafe>'));
  assert(html.includes('Spikes ×2'));
 });
});
