'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
function harness() {
 const values = {}, messages = {}, host = {localStorage: {setItem() {}}};
 const storage = {teams: [], packTeam: sets => JSON.stringify(sets)};
 storage.prefs = () => {}; storage.prefs.data = {unrelated: true};
 const app = {addPopupMessage(message) { messages.popup = message; }};
 const room = {events: {}, curTeam: {name: 'Team', format: 'gen9ou'}, curSetList: [{species: 'Charizard', moves: ['Flamethrower'], ivs: {spe: 0}}]};
 const chain = selector => ({
  val() { return values[selector] || ''; }, text(value) { messages[selector] = value; return this; },
  focus() { return this; }, prop() { return this; }, remove() { return this; },
  append() { return this; }, each() { return this; },
 });
 room.$ = chain; room.$el = {html(value) { messages.html = value; }};
 let data = {profiles: [{id: 'one', name: 'Roster', species: ['venusaur']}], selected: 'one', enabled: false};
 room.rosterData = () => data;
 room.saveRosterProfiles = next => { data = next; };
 room.rosterSpeciesID = name => Dex.species.get(name).id;
 room.rosterExpandedSpecies = () => ['charizard', 'charizardmegax', 'charizardmegay'];
 const T = {clone: value => JSON.parse(JSON.stringify(value)), uid: (() => {let n = 0; return () => String(++n);})()};
 const validation = source.slice(source.indexOf('proto.validate ='), source.indexOf('\tT.problemLocation ='));
 const runner = source.slice(source.indexOf('\tproto.runSavedTeamValidation ='), source.indexOf('\tvar toolsUpdate ='));
 const profile = source.slice(source.indexOf('// Direct additions use'), source.indexOf('\tvar profileRenderSet ='));
 new Function('proto', 'T', 'app', 'Storage', 'window', 'Dex', 'escape', 'button', validation + runner + profile)(
  room, T, app, storage, host, Dex, s => String(s), () => ''
 );
 const requests = [];
 room.requestTeamTools = (payload, callback) => requests.push({payload, callback});
 room.showTeamValidation = () => {};
 return {room, values, messages, host, storage, requests, data: () => data};
}
describe('Direct team validation and profile additions', () => {
 it('validates the current unsaved build once without modifying it', () => {
  const {room, requests} = harness(), before = JSON.stringify(room.curSetList);
  room.validate(); room.validate();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].payload.teams[0].team, before);
  requests[0].callback({results: [{status: 'valid'}]});
  assert.equal(room.validationPending, false);
  assert.equal(room.validationMode, 'single');
  assert.equal(JSON.stringify(room.curSetList), before);
 });
 it('ignores a response invalidated by cancellation or a newer check', () => {
  const {room, requests} = harness();
  room.validate(); room.validationToken = null; room.validationPending = false;
  requests[0].callback({results: [{status: 'valid'}]});
  assert.equal(room.validationResults, null);
  room.validate();
  requests[0].callback({error: 'old failure'});
  assert.equal(room.validationPending, true);
  requests[1].callback({error: 'Not checked: disconnected'});
  assert.equal(room.validationPending, false);
  assert.match(room.validationError, /disconnected/);
  assert(!room.validationError.includes('Not checked:'));
 });
 it('does not queue an unsafe delayed validation behind login/download', () => {
  const {room, requests, messages} = harness();
  room.curTeam.teamid = 123; room.curTeam.loaded = false;
  room.validate();
  assert.equal(requests.length, 0);
  assert.match(messages.popup, /finish downloading/);
 });
 function draft(h) {
  h.room.profileAddition = {team: h.room.curTeam, set: h.room.curSetList[0], species: 'Charizard', index: 0};
  h.values['.profile-add-target'] = 'one';
 }
 it('adds species and matching Megas without replacing existing entries or builds', () => {
  const h = harness(); draft(h); const before = JSON.stringify(h.room.curSetList);
  h.room.confirmSetProfile();
  assert.deepEqual(h.data().profiles[0].species, ['venusaur', 'charizard', 'charizardmegax', 'charizardmegay']);
  assert.equal(JSON.stringify(h.room.curSetList), before);
  assert.equal(h.data().enabled, false);
 });
 it('deduplicates repeat additions and ignores a second confirmation', () => {
  const h = harness(); draft(h); h.room.confirmSetProfile(); h.room.confirmSetProfile();
  draft(h); h.room.confirmSetProfile();
  assert.equal(h.data().profiles[0].species.length, 4);
  assert.match(h.messages['.set-profile-status[data-index="0"]'], /Already in/);
 });
 it('does not persist a cancelled draft', () => {
  const h = harness(); draft(h); h.room.cancelSetProfile(); h.room.confirmSetProfile();
  assert.deepEqual(h.data().profiles[0].species, ['venusaur']);
 });
 for (const changed of ['team', 'set', 'species']) it('rejects a draft after changing ' + changed, () => {
  const h = harness(); draft(h);
  if (changed === 'team') h.room.curTeam = {};
  if (changed === 'set') h.room.curSetList[0] = {species: 'Charizard'};
  if (changed === 'species') h.room.curSetList[0].species = 'Venusaur';
  h.room.confirmSetProfile();
  assert.deepEqual(h.data().profiles[0].species, ['venusaur']);
 });
 it('rejects duplicate profile names without silently merging or overwriting', () => {
  const h = harness(); draft(h); h.values['.profile-add-target'] = ''; h.values['.profile-add-name'] = 'roster';
  h.room.confirmSetProfile();
  assert.equal(h.data().profiles.length, 1);
  assert.match(h.messages['.profile-add-status'], /already exists/);
 });
 it('retains the draft after a failed write and commits once on retry', () => {
  const h = harness(); draft(h); h.values['.profile-add-target'] = ''; h.values['.profile-add-name'] = 'New';
  h.host.localStorage.setItem = () => { throw Error('quota'); };
  h.room.confirmSetProfile();
  assert.equal(h.data().profiles.length, 1); assert(h.room.profileAddition);
  assert.match(h.messages['.profile-add-status'], /Could not save/);
  h.host.localStorage.setItem = (key, json) => { assert.equal(JSON.parse(json).unrelated, true); };
  h.room.confirmSetProfile(); h.room.confirmSetProfile();
  assert.equal(h.data().profiles.length, 2);
 });
 it('does not recreate a deleted destination', () => {
  const h = harness(); draft(h); h.data().profiles = [];
  h.room.confirmSetProfile();
  assert.match(h.messages['.profile-add-status'], /removed/);
  assert.equal(h.data().profiles.length, 0);
 });
});

