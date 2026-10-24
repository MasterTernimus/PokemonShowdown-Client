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

describe('Unified local Profiles preservation',()=>{
 it('links by stable ID without merging same-named groups or names',()=>{const groups=[{id:'a',name:'Val',species:['mew']},{id:'b',name:'Val',species:['sylveon']}],profile={id:'n',name:'Val',entries:{mew:'Sage'},rosterProfile:'b'};assert.equal(T.profileGroup(profile,groups),groups[1]);assert.equal(T.profileGroup({...profile,rosterProfile:'missing'},groups),null);groups[1].name='Renamed';assert.equal(T.profileGroup(profile,groups).name,'Renamed');});
 it('offers each linked group once while retaining independent same-named profiles',()=>{const names=[{id:'names',name:'Val',rosterProfile:'a'},{id:'other',name:'Val'}],groups=[{id:'a',name:'Val'},{id:'b',name:'Val'}];const html=T.unifiedProfileOptions(names,groups,'names');assert(html.includes('value="names" selected'));assert(html.includes('value="other"'));assert(html.includes('value="group:b"'));assert(!html.includes('value="group:a"'));assert(html.includes('names only'));});
 it('escapes profile and group labels and IDs',()=>{const html=T.unifiedProfileOptions([{id:'n"',name:'<img src=x>'}],[{id:'g"',name:'<script>'}],'');assert(!html.includes('<img'));assert(!html.includes('<script>'));assert(html.includes('&quot;'));});
 it('backs up names, gender rules, exact membership and links without duplicating live data',()=>{const data=T.empty();data.nicknames=[{id:'name',name:'Val',entries:{mew:'Sage',sylveon:'Moon'},genderEntries:{haxorus:{F:'Aymr'}},gendered:true,rosterProfile:'group'}];const groups={profiles:[{id:'group',name:'Val',species:['haxorus','haxorusmega']}]};const before=JSON.stringify([data,groups]);const backup=T.unifiedBackup(data,groups);const restored=T.parse(JSON.stringify(backup));assert.equal(JSON.stringify([data,groups]),before);assert.deepEqual(restored.nicknames[0].entries,data.nicknames[0].entries);assert.deepEqual(restored.nicknames[0].genderEntries,data.nicknames[0].genderEntries);assert.deepEqual(restored.profileGroups[0].species,groups.profiles[0].species);assert.equal(restored.nicknames[0].rosterProfile,restored.profileGroups[0].id);assert.notEqual(restored.profileGroups[0].id,'group');assert.notEqual(restored.nicknames[0].id,'name');});
 it('imports old backups as independent names without attaching to coincidental local IDs',()=>{const data=T.empty();data.nicknames=[{id:'n',name:'Val',entries:{mew:'Sage'},rosterProfile:'existing-local-id'}];const restored=T.parse(JSON.stringify(data));assert.deepEqual(restored.profileGroups,[]);assert.equal(restored.nicknames[0].rosterProfile,undefined);assert.deepEqual(restored.nicknames[0].entries,{mew:'Sage'});});
 it('rejects malformed backup groups before importing anything',()=>{const data=T.empty();for(const groups of [{},[{id:'x',name:'Bad',species:['notapokemon']}],[{id:'x',name:'One',species:[]},{id:'x',name:'Two',species:[]}]])assert.throws(()=>T.parse(JSON.stringify({...data,profileGroups:groups})),/Invalid profile group|Unknown group/);});
});
