'use strict';
const assert = require('assert').strict, fs = require('fs');
const {Dex} = require('./helpers/isolated-dex.cjs')();
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
function Room() {}
Room.prototype.events = {};
for (const key of ['initialize', 'renderSet', 'renderRosterProfiles', 'update', 'back', 'setPokemon', 'chartSet', 'updateChart', 'getStat']) Room.prototype[key] = function () {};
const prefs = {}, host = {TeambuilderRoom: Room};
new Function('window', 'jQuery', 'Storage', 'BattleLog', 'Dex', 'app', 'toID', source.slice(source.indexOf('// BEGIN LOCAL TEAMBUILDER TOOLS')))(host, () => {}, {prefs(key, value) {if (value !== undefined) prefs[key] = value; return prefs[key];}}, {escapeHTML: String}, Dex, {addPopupMessage() {}}, s => String(s).toLowerCase().replace(/[^a-z0-9]/g, ''));
const T = host.TeambuilderTools;

describe('Nickname saving and profile membership', () => {
	it('accepts repeated identical rows without merging separate forms', () => {
		const rows = [['Sceptile', 'Slasher'], ['Typhlosion-Alt', 'Krakatoa'], ['Typhlosion', 'Heatshock'], ['Mr. Mime-Galar', 'Sigmund C#ñ41']];
		const once = T.nicknameMappings(rows), twice = T.nicknameMappings(rows.concat(rows));
		assert.deepEqual(twice, once); assert.equal(Object.keys(twice.entries).length, 4);
		assert.equal(twice.entries.typhlosionalt, 'Krakatoa'); assert.equal(twice.entries.typhlosion, 'Heatshock');
	});
	it('rejects conflicting names with actionable row numbers and preserves gender-specific names', () => {
		assert.throws(() => T.nicknameMappings([['Sceptile', 'Slasher'], ['Sceptile', 'Other']]), /rows 1 and 2/);
		assert.deepEqual(T.nicknameMappings([['Sceptile', 'Slasher'], ['Sceptile', 'Other', 'F'], ['Sceptile', 'Other', 'F']]), {entries: {sceptile: 'Slasher'}, genderEntries: {sceptile: {F: 'Other'}}});
	});
	it('fills an empty group from saved names, and otherwise adds only new or edited names', () => {
		const profile = {entries: {sceptile: 'Old', mew: 'Retired'}, genderEntries: {flygon: {F: 'Old'}}};
		const mapped = T.nicknameMappings([['Sceptile', 'Slasher'], ['Mew', 'Retired'], ['Flygon', 'Mira', 'F'], ['Typhlosion-Alt', 'Krakatoa']]);
		assert.deepEqual(T.namedMemberAdditions(profile, mapped, {species: ['sceptile']}).sort(), ['flygon', 'sceptile', 'typhlosionalt']);
		assert.deepEqual(T.namedMemberAdditions(profile, mapped, {species: []}).sort(), ['flygon', 'mew', 'sceptile', 'typhlosionalt']);
	});
	it('preserves group IDs, unrelated groups, filter settings, and existing members when saving names', () => {
		const groups = {selected: 'g', enabled: false, profiles: [{id: 'g', name: 'Locks', species: ['flygon']}, {id: 'other', name: 'Other', species: ['mew']}]};
		const before = JSON.stringify(groups), profile = {id: 'n', name: 'Names', rosterProfile: 'g', entries: {}, genderEntries: {}};
		const room = {rosterData: () => groups, rosterExpandedSpecies: id => id === 'sceptile' ? ['sceptile', 'sceptilemega'] : [id]};
		Room.prototype.addNamedProfileMembers.call(room, profile, T.nicknameMappings([['Sceptile', 'Slasher']]));
		assert.equal(JSON.stringify(groups), before); assert.equal(profile.rosterProfile, 'g');
		assert.deepEqual(prefs.rosterprofiles.profiles[0].species, ['flygon', 'sceptile', 'sceptilemega']);
		assert.deepEqual(prefs.rosterprofiles.profiles[1], groups.profiles[1]); assert.equal(prefs.rosterprofiles.enabled, false);
	});
	it('creates a linked local group for a names-only profile', () => {
		const profile = {name: 'Names', entries: {}, genderEntries: {}};
		Room.prototype.addNamedProfileMembers.call({rosterData: () => ({profiles: [], selected: '', enabled: false}), rosterExpandedSpecies: id => [id]}, profile, T.nicknameMappings([['Sceptile', 'Slasher']]));
		assert.equal(prefs.rosterprofiles.profiles[0].id, profile.rosterProfile);
		assert.deepEqual(prefs.rosterprofiles.profiles[0].species, ['sceptile']);
	});
});
