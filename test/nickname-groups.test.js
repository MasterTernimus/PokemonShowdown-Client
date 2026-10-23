'use strict';
const assert = require('assert').strict, fs = require('fs'), vm = require('vm');
require('./battle.test');
const file = 'play.pokemonshowdown.com/js/client-teambuilder.js';
const source = fs.readFileSync(file, 'utf8');
function Room() {}
Room.prototype.events = {};
for (const key of ['initialize', 'renderSet', 'renderRosterProfiles', 'update', 'back', 'setPokemon', 'chartSet', 'updateChart', 'getStat']) Room.prototype[key] = function () {};
const escapeHTML = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jq = node => ({find: selector => ({val: () => node[selector]})});
const host = {TeambuilderRoom: Room};
new Function('window', 'jQuery', 'Storage', 'BattleLog', 'Dex', 'app', 'toID', source.slice(source.indexOf('// BEGIN LOCAL TEAMBUILDER TOOLS')))(host, jq, {prefs() {}}, {escapeHTML}, Dex, {addPopupMessage() {}}, toID);
const T = host.TeambuilderTools;
function row(species, name, gender = '', group = false) {
 return {'.nickname-species': species, '.nickname-value': name, '.nickname-gender': gender, getAttribute: key => key === 'data-group-entry' && group};
}
function readRows(rows) {
 return T.nicknameEditorRows({$() {return {not() {return this;}, each(fn) {rows.forEach(node => fn.call(node));}};}});
}
describe('Live groups in the name editor', () => {
 it('offers existing lists safely and omits an empty group control', () => {
  assert.equal(T.nicknameGroupOptions([]), '');
  const html = T.nicknameGroupOptions([{id: 'one', name: 'Val'}, {id: 'x"', name: '<img src=x>'}]);
  assert(html.includes('value="one">Val</option>'));
  assert(html.includes('value="x&quot;"'));
  assert(html.includes('&lt;img src=x&gt;'));
  assert(!html.includes('<img'));
 });
 it('does not store blank group suggestions or relax validation for manual incomplete rows', () => {
  const rows = readRows([row('Nidoqueen', '  ', '', true), row('Mew', 'Sage'), row('', '')]);
  assert.deepEqual(T.nicknameMappings(rows), {entries: {mew: 'Sage'}, genderEntries: {}});
  assert.throws(() => T.nicknameMappings(readRows([row('Nidoqueen', '')])), /enter a nickname/);
 });
 it('retains names outside the chosen group and all explicit gender mappings', () => {
  const rows = readRows([row('Mew', 'Sage'), row('Nidoqueen', 'Queen', '', true), row('Nidoqueen', 'Matriarch', 'F', true)]);
  assert.deepEqual(T.nicknameMappings(rows), {entries: {mew: 'Sage', nidoqueen: 'Queen'}, genderEntries: {nidoqueen: {F: 'Matriarch'}}});
 });
 it('uses live membership and stable IDs, including renamed or removed groups', () => {
  const data = {profiles: [{id: 'one', name: 'First', species: ['nidoqueen']}]};
  const room = {rosterData: () => data, $: () => ({val: () => 'one'})};
  const get = () => Room.prototype.nicknameGroupProfile.call(room);
  assert.equal(get(), data.profiles[0]);
  data.profiles[0].name = 'Renamed'; data.profiles[0].species.push('alomomola');
  assert.equal(get().name, 'Renamed'); assert.deepEqual(get().species, ['nidoqueen', 'alomomola']);
  data.profiles.length = 0; assert.equal(get(), null);
 });
 it('keeps the existing backup format and nickname import behavior', () => {
  const data = T.empty();
  data.nicknames = [{id: 'old', name: 'Saved names', entries: {mew: 'Sage', alomomola: 'Harbor'}, fallback: false}];
  const restored = T.parse(JSON.stringify(data));
  assert.equal(restored.version, 1);
  assert.deepEqual(restored.nicknames[0].entries, data.nicknames[0].entries);
  assert.equal(restored.nicknames[0].species, undefined);
 });
});
const context = {window: {}, jQuery() {}, Dex, toID, BattleLog: {escapeHTML}};
vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js', 'utf8'), context);
const search = context.window.BattleSearch.prototype;
describe('Compact picker information parity', () => {
 for (const [name, bst] of [['Nidoqueen', 570], ['Alomomola', 470], ['Ampharos-Aevian', 530]]) {
  it('retains all stats, abilities, passive help and selection for ' + name, () => {
   const species = Dex.species.get(name), html = search.renderPokemonRow.call({}, species, 0, 0, '', '');
   assert(html.includes('data-entry="pokemon|' + name + '"'));
   for (const ability of Object.values(species.abilities)) assert(html.includes(escapeHTML(ability)));
   assert.equal((html.match(/class="col statcol"/g) || []).length, 6);
   assert(html.includes('<span class="col bstcol"><em>BST</em><br />' + bst + '</span>'));
   for (const label of ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']) assert(html.includes('<em>' + label + '</em>'));
   if (species.passives.length) assert(html.includes('pokemon-passive-badge'));
  });
 }
 it('retains native sorting buttons for every statistic', () => {
  const html = search.renderPokemonSortRow.call({sortCol: null, engine: {firstPokemonColumn: 'Tier', dex: {gen: 9}}});
  for (const stat of ['name', 'type', 'ability', 'hp', 'atk', 'def', 'spa', 'spd', 'spe', 'bst']) assert(html.includes('data-sort="' + stat + '"'));
 });
});
