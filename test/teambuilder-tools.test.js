'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');
const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/client-teambuilder.js'), 'utf8');
const code = source.slice(source.indexOf('// BEGIN LOCAL TEAMBUILDER TOOLS'));
const prefs = {};
function Room() {}
Room.prototype.events = {};
for (const id of ['initialize', 'renderSet', 'renderRosterProfiles', 'update', 'back', 'setPokemon', 'chartSet', 'updateChart', 'getStat']) Room.prototype[id] = function () {};
const host = {TeambuilderRoom: Room};
new Function('window', 'jQuery', 'Storage', 'BattleLog', 'Dex', 'app', code)(host, {}, {prefs(key, value) {if (value !== undefined) prefs[key] = value; return prefs[key];}}, {escapeHTML: x => x}, Dex, {});
const T = host.TeambuilderTools;
describe('Local teambuilder tools', () => {
 const build = {id: 'original', name: 'TR', format: 'gen9nofieldsinglesgame', set: {species: 'Armarouge', item: 'Weakness Policy', ability: 'Flash Fire', moves: ['Trick Room'], nature: 'Quiet', ivs: {spe: 0}, evs: {spa: 252}, level: 50, teraType: 'Grass'}};
 it('round-trips multiple self-authored builds, preserving zero IVs and gimmicks', () => {
  const data = T.empty();
  data.builds = [build, {...build, id: 'other', name: 'Second'}];
  const restored = T.parse(JSON.stringify(data));
  assert.equal(restored.builds.length, 2);
  assert.deepEqual(restored.builds[0].set, build.set);
  assert.notEqual(restored.builds[0].id, restored.builds[1].id);
  const firstTeam = T.cleanSet(restored.builds[0].set), secondTeam = T.cleanSet(restored.builds[0].set);
  firstTeam.evs.spa = 4;
  firstTeam.moves[0] = 'Flamethrower';
  assert.equal(secondTeam.evs.spa, 252);
  assert.equal(restored.builds[0].set.moves[0], 'Trick Room');
 });
 it('does not merge forms or imply legality for a different format', () => {
  assert.equal(T.compatibility(build, {species: 'Armarouge'}, 'gen9ou', Dex), 'Different format: validate after applying');
  assert.equal(T.compatibility(build, {species: 'Charizard-Mega-X'}, build.format, Dex), 'Different species/form');
  assert.throws(() => T.parse('{"version":9}'));
  assert.throws(() => T.cleanSet({}));
 });
 it('supports explicit form fallback and protects manual nicknames', () => {
  const p = {entries: {charizard: 'Ember', charizardmegax: 'Onyx'}, fallback: false};
  const set = {species: 'Charizard-Mega-Y', name: 'Manual'};
  assert.equal(T.nickname(set, p, Dex), '');
  p.fallback = true;
  assert.equal(T.nickname(set, p, Dex), 'Ember');
  assert.equal(T.nickname({species: 'Charizard-Mega-X'}, p, Dex), 'Onyx');
  T.applyNickname(set, p, Dex, false);
  assert.equal(set.name, 'Manual');
  T.applyNickname(set, p, Dex, true);
  assert.equal(set.name, 'Ember');
 });
 it('preserves custom forms and rejects duplicate nickname mappings on import', () => {
  const data = T.empty();
  data.nicknames = [{name: 'Forms', entries: {'Gardevoir-Void': 'Crimson'}, fallback: false}];
  const restored = T.parse(JSON.stringify(data));
  assert.equal(restored.nicknames[0].entries.gardevoirvoid, 'Crimson');
  data.nicknames[0].entries.gardevoirvoid = 'Duplicate';
  assert.throws(() => T.parse(JSON.stringify(data)), /Duplicate/);
 });
 it('keeps favorites manual and deduplicates recent selections', () => {
  let data = {favorites: [], recent: []};
  data = T.selectItem(data, 'Wacan Berry');
  assert.deepEqual(data.favorites, []);
  data = T.starItem(data, 'Wacan Berry');
  data = T.selectItem(data, 'Kebia Berry');
  data = T.selectItem(data, 'Wacan Berry');
  assert.deepEqual(data, {favorites: ['wacanberry'], recent: ['wacanberry', 'kebiaberry']});
  prefs.itempickertools = data;
  assert.deepEqual(T.itemData(), data);
  T.itemData().favorites.length = 0;
  assert.equal(prefs.itempickertools.favorites.length, 1);
 });
 it('searches local resistance types, healing thresholds and custom items', () => {
  assert(T.itemMatches('wacanberry', 'Electric', Dex));
  assert(T.itemMatches('kebiaberry', 'Poison', Dex));
  assert(T.itemMatches('figyberry', 'pinch healing', Dex));
  assert(!T.itemMatches('liechiberry', 'pinch healing', Dex));
  assert(T.itemMatches('liechiberry', 'pinch stat boost', Dex));
  assert.equal(T.itemMetadata.figyberry.threshold, 0.25);
  assert.equal(T.itemMetadata.sitrusberry.threshold, 0.5);
  assert(T.itemMetadata.figyberry.text.includes('1/2 max HP'));
  assert(T.itemMatches('amplifieldrock', 'terrain', Dex));
  assert(T.itemMatches('anomalycore', 'mega', Dex));
 });
 it('preview signatures ignore EV edits but invalidate item/species/format changes', () => {
  const a = T.clone(build.set), key = T.previewKey(a, build.format);
  a.evs.spa = 4;
  assert.equal(T.previewKey(a, build.format), key);
  a.item = 'Leftovers';
  assert.notEqual(T.previewKey(a, build.format), key);
 });
 it('never overwrites the next Pokemon when the applied set was deleted', () => {
  const room=new Room(), applied={species:'Kecleon',item:'Leftovers'}, next={species:'Poliwrath',item:'Life Orb'};
  room.curTeam={}; room.curSetList=[applied,next];
  room.buildUndo={team:room.curTeam,index:0,applied,set:{species:'Kecleon',item:'Focus Sash'}};
  let saved=false; room.toolsCommit=()=>{saved=true;}; room.curSetList.splice(0,1);
  room.undoSavedBuild(); assert.deepEqual(room.curSetList,[next]); assert(!saved); assert.equal(room.buildUndo,null);
 });
 it('follows the applied set when reordered without touching the other set', () => {
  const room=new Room(), applied={species:'Kecleon',item:'Leftovers'}, next={species:'Poliwrath',item:'Life Orb'};
  room.curTeam={}; room.curSetList=[next,applied]; room.curSetLoc=1; room.curSet=applied;
  room.buildUndo={team:room.curTeam,index:0,applied,set:{species:'Kecleon',item:'Focus Sash'}};
  room.toolsCommit=()=>{};room.undoSavedBuild();
  assert.equal(room.curSetList[0],next);assert.equal(room.curSetList[1].item,'Focus Sash');assert.equal(room.curSet,room.curSetList[1]);
 });
 it('does not restore an undo over an imported replacement set of the same species', () => {
  const room=new Room(), applied={species:'Kecleon',item:'Leftovers'}, imported={species:'Kecleon',item:'Life Orb'};
  room.curTeam={};room.curSetList=[imported];room.buildUndo={team:room.curTeam,index:0,applied,set:{species:'Kecleon',item:'Focus Sash'}};
  room.toolsCommit=()=>{throw Error('Must not save');};room.undoSavedBuild();assert.equal(room.curSetList[0],imported);
 });

});
