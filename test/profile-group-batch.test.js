/* global describe, it */
'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
function Room() {}
Room.prototype.events = {};
for (const key of ['initialize', 'renderSet', 'renderRosterProfiles', 'update', 'back', 'setPokemon', 'chartSet', 'updateChart', 'getStat']) Room.prototype[key] = function () {};
const host = {TeambuilderRoom:Room};
const jq = node => ({find:selector => ({val:() => node[selector]})});
require('vm').compileFunction(source.slice(source.indexOf('// BEGIN LOCAL TEAMBUILDER TOOLS')), ['window', 'jQuery', 'Storage', 'BattleLog', 'Dex', 'app', 'toID'])(host, jq, {prefs() {}}, {escapeHTML:String}, Dex, {addPopupMessage() {}}, toID);
const T = host.TeambuilderTools;
const prefs = () => ({theme:'dark', rosterprofiles:{enabled:false, selected:'g', profiles:[{id:'g', name:'Coral', species:['corsola', 'armaldo']}, {id:'other', name:'Other', species:['mew']}]}, pokemontools:{nicknames:[{id:'n', rosterProfile:'g', entries:{corsola:'Pearl', armaldo:'Shell', mew:'Sage'}, genderEntries:{corsola:{F:'Rose'}}}], builds:[{id:'b', set:{species:'Mew'}}]}, nicknamedrafts:{n:{rows:[{species:'Corsola', name:'Draft'}]}}});
const pending = data => ({profileId:'n', groupId:'g', before:JSON.stringify(data.rosterprofiles.profiles[0].species), plan:T.planGroupBatch(data.rosterprofiles.profiles[0], 'selected', ['slowbro'], ['corsola'])});

describe('Local group batch previews and preservation', () => {
	it('preserves hidden legacy members during visible whole-group replacement', () => {
		const group = {species:['hydreigon', 'hydreigonmega', 'empoleonmegax', 'mew']};
		const before = JSON.stringify(group), plan = T.planGroupBatch(group, 'all', ['hydreigon', 'pikachu'], []);
		assert.deepEqual(plan.species, ['hydreigonmega', 'empoleonmegax', 'hydreigon', 'pikachu']);
		assert.deepEqual(plan.removed, ['mew']); assert.deepEqual(plan.added, ['pikachu']);
		assert.equal(JSON.stringify(group), before);
	});
	it('partially replaces selected members, preserving others and deduplicating', () => {
		assert.deepEqual(T.planGroupBatch({species:['corsola', 'armaldo']}, 'selected', ['slowbro', 'slowbro', 'armaldo'], ['corsola']), {species:['armaldo', 'slowbro'], added:['slowbro'], removed:['corsola']});
	});
	it('supports full replacement, additions and intentional empty replacement', () => {
		const g = {species:['corsola', 'armaldo']};
		assert.deepEqual(T.planGroupBatch(g, 'all', [], []).species, []);
		assert.deepEqual(T.planGroupBatch(g, 'all', ['slowbro'], []).removed, g.species);
		assert.deepEqual(T.planGroupBatch(g, 'add', ['armaldo', 'mew'], []).species, ['corsola', 'armaldo', 'mew']);
	});
	it('rejects missing or stale selection and invalid modes', () => {
		for (const ids of [[], ['mew']]) assert.throws(() => T.planGroupBatch({species:['corsola']}, 'selected', [], ids), /Select/);
		assert.throws(() => T.planGroupBatch({species:[]}, 'bad', [], []), /Choose/);
	});
	it('previewing and applying do not mutate inputs or rename species identities', () => {
		const data = prefs(), before = JSON.stringify(data), plan = pending(data), next = T.applyGroupBatch(plan, data, 'n');
		assert.equal(JSON.stringify(data), before); assert.deepEqual(next.rosterprofiles.profiles[0].species, ['armaldo', 'slowbro']);
		assert.deepEqual(next.rosterprofiles.profiles[1], data.rosterprofiles.profiles[1]);
		assert.deepEqual(next.pokemontools, data.pokemontools); assert.deepEqual(next.nicknamedrafts, data.nicknamedrafts);
		assert.equal(next.theme, 'dark'); assert.equal(next.rosterprofiles.enabled, false);
	});
	it('accepts harmless self writes and unrelated newer edits while keeping them', () => {
		const data = prefs(), plan = pending(data); data.rosterprofiles.selected = 'other'; data.theme = 'light';
		data.rosterprofiles.profiles[1].species.push('sylveon'); data.pokemontools.nicknames[0].entries.corsola = 'New name';
		const next = T.applyGroupBatch(plan, data, 'n'); assert.equal(next.theme, 'light');
		assert.equal(next.pokemontools.nicknames[0].entries.corsola, 'New name'); assert(next.rosterprofiles.profiles[1].species.includes('sylveon'));
	});
	it('rejects changed/deleted target, changed profile link and profile switch', () => {
		for (const change of [d => d.rosterprofiles.profiles[0].species.push('mew'), d => d.rosterprofiles.profiles.shift(), d => {d.pokemontools.nicknames[0].rosterProfile = 'other';}]) {
			const data = prefs(), plan = pending(data); change(data); assert.throws(() => T.applyGroupBatch(plan, data, 'n'), /changed/);
		}
		const data = prefs(); assert.throws(() => T.applyGroupBatch(pending(data), data, 'other'), /changed/);
	});
	it('dismisses Undo without changing any saved data or reopening the notice', () => {
		const room = new Room(); let removed = 0; room.libraryUndo = {entry:{id:'old'}}; room.$ = () => ({remove() {removed++;}});
		room.dismissLibraryUndo(); assert.equal(room.libraryUndo, null); assert.equal(removed, 1);
		assert(!source.includes('Saved library changed.'));
	});
	it('retains the existing conflict check for Undo', () => {
		const undo = {entry:{id:'b', name:'Old'}, overwrite:true, after:{id:'b', name:'Updated'}};
		assert(T.canUndoLibrary(undo, {id:'b', name:'Updated'})); assert(!T.canUndoLibrary(undo, {id:'b', name:'Edited elsewhere'}));
	});
});
