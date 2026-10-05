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
const statStart = source.indexOf('getStat: function (');
const statEnd = source.indexOf('\n\t\t},', statStart);
Room.prototype.getStat = new Function('Dex', 'BattleNatures', 'return (' + source.slice(statStart + 'getStat: '.length, statEnd) + '\n});')(Dex, {Adamant: {plus: 'atk', minus: 'spa'}});
const host = {TeambuilderRoom: Room};
new Function('window', 'jQuery', 'Storage', 'BattleLog', 'Dex', 'app', code)(host, {}, {prefs(key, value) {if (value !== undefined) prefs[key] = value; return prefs[key];}}, {escapeHTML: x => x}, Dex, {addPopupMessage() {}});
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
  room.buildUndo={team:room.curTeam,index:0,applied,snapshot:T.clone(applied),set:{species:'Kecleon',item:'Focus Sash'}};
  let saved=false; room.toolsCommit=()=>{saved=true;}; room.curSetList.splice(0,1);
  room.undoSavedBuild(); assert.deepEqual(room.curSetList,[next]); assert(!saved); assert.equal(room.buildUndo,null);
 });
 it('follows the applied set when reordered without touching the other set', () => {
  const room=new Room(), applied={species:'Kecleon',item:'Leftovers'}, next={species:'Poliwrath',item:'Life Orb'};
  room.curTeam={}; room.curSetList=[next,applied]; room.curSetLoc=1; room.curSet=applied;
  room.buildUndo={team:room.curTeam,index:0,applied,snapshot:T.clone(applied),set:{species:'Kecleon',item:'Focus Sash'}};
  room.toolsCommit=()=>{};room.undoSavedBuild();
  assert.equal(room.curSetList[0],next);assert.equal(room.curSetList[1].item,'Focus Sash');assert.equal(room.curSet,room.curSetList[1]);
 });
 it('does not restore an undo over an imported replacement set of the same species', () => {
  const room=new Room(), applied={species:'Kecleon',item:'Leftovers'}, imported={species:'Kecleon',item:'Life Orb'};
  room.curTeam={};room.curSetList=[imported];room.buildUndo={team:room.curTeam,index:0,applied,snapshot:T.clone(applied),set:{species:'Kecleon',item:'Focus Sash'}};
  room.toolsCommit=()=>{throw Error('Must not save');};room.undoSavedBuild();assert.equal(room.curSetList[0],imported);
 });

});


describe('Nickname row editor', () => {
 it('accepts pasted equals and dashes without breaking hyphenated forms', () => {
  const rows = T.nicknameList('Typhlosion-Hisui — Rigel\nTogekiss = Deneb\nAmpharos – Electra');
  assert.deepEqual(T.nicknameEntries(rows), {typhlosionhisui: 'Rigel', togekiss: 'Deneb', ampharos: 'Electra'});
 });
 it('ignores blank add rows but rejects incomplete, duplicate and unsafe entries', () => {
  assert.deepEqual(T.nicknameEntries([['', ''], ['Togekiss', 'Deneb']]), {togekiss: 'Deneb'});
  assert.throws(() => T.nicknameEntries([['Togekiss', '']]));
  assert.throws(() => T.nicknameEntries([['missingpokemon', 'Name']]));
  assert.throws(() => T.nicknameEntries([['Togekiss', 'A'], ['togekiss', 'B']]), /Duplicate/);
  assert.throws(() => T.nicknameEntries([['Togekiss', 'a|b']]));
 });
 it('persists edited entries through export/import and applies them to team sets', () => {
  const data = T.empty();
  data.nicknames = [{name: 'Stars', entries: T.nicknameEntries([['Togekiss', 'Deneb']]), fallback: false}];
  const profile = T.parse(JSON.stringify(data)).nicknames[0];
  const set = {species: 'Togekiss', name: ''};
  T.applyNickname(set, profile, Dex, false);
  assert.equal(set.name, 'Deneb');
 });
});


describe('Profile appearance and reusable builds', () => {
 it('uses optional gender names with a default for unspecified genders', () => {
  const mapped = T.nicknameMappings([['Togekiss', 'Star', ''], ['Togekiss', 'Rigel', 'M'], ['Togekiss', 'Vega', 'F']]);
  const profile = {...mapped, gendered: true};
  assert.equal(T.nickname({species: 'Togekiss', gender: 'F'}, profile, Dex), 'Vega');
  assert.equal(T.nickname({species: 'Togekiss', gender: 'M'}, profile, Dex), 'Rigel');
  assert.equal(T.nickname({species: 'Togekiss'}, profile, Dex), 'Star');
  profile.gendered = false;
  assert.equal(T.nickname({species: 'Togekiss', gender: 'F'}, profile, Dex), 'Star');
  assert.throws(() => T.nicknameMappings([['Togekiss', 'A', 'F'], ['Togekiss', 'B', 'F']]), /Duplicate/);
 });
 it('applies shiny choices even without a nickname and round-trips options', () => {
  const data = T.empty();
  data.nicknames = [{name: 'Stars', entries: {}, shiny: 'yes', gendered: true, genderEntries: {togekiss: {F: 'Vega'}}}];
  const profile = T.parse(JSON.stringify(data)).nicknames[0];
  assert.equal(profile.genderEntries.togekiss.F, 'Vega');
  const set = {species: 'Mew', name: 'Manual'};
  T.applyNickname(set, profile, Dex, false); assert.equal(set.shiny, true); assert.equal(set.name, 'Manual');
  profile.shiny = 'no'; T.applyNickname(set, profile, Dex, false); assert.equal(set.shiny, false);
  profile.shiny = ''; set.shiny = true; T.applyNickname(set, profile, Dex, false); assert.equal(set.shiny, true);
 });
 it('stores independent named builds and rejects empty or unknown imports', () => {
  const set = {species: 'Togekiss', moves: ['Air Slash'], evs: {spa: 252}};
  const builds = T.namedBuilds([set], 'Air support', 'gen9ou');
  assert.equal(builds[0].name, 'Air support');
  set.evs.spa = 0; assert.equal(builds[0].set.evs.spa, 252);
  assert.throws(() => T.namedBuilds([], '', ''));
  assert.throws(() => T.namedBuilds([{species: 'notapokemon'}], '', ''));
 });
});


describe('Form stat comparison and item icons', () => {
 it('compares actual Mega stats with the base set without selecting a different saved species', () => {
  const room = new Room(); room.curTeam = {dex: Dex, gen: 9, format: 'gen9ou'};
  const set = {species: 'Banette', ability: 'Cursed Keepsake', nature: 'Adamant', level: 100, evs: {atk:252}, ivs: {atk:31}};
  const form = {name: 'Banette-Mega-Z', ability: Dex.species.get('Banette-Mega-Z').abilities['0']};
  const html = room.renderFormStatComparison(set, form);
  assert(html.includes('Form base')); assert(html.includes('Change'));
  assert(!html.includes('NaN')); assert(!html.includes('undefined'));
  assert.equal(set.species, 'Banette');
 });
 it('routes Amulet Coin and its legacy item ID to a real PNG', () => {
  assert(Dex.getItemIcon('amuletcoin').includes('amulet-coin.png'));
  assert(Dex.getItemIcon('starsweet').includes('amulet-coin.png'));
  const png = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites/itemicons/amulet-coin.png'));
  assert.equal(png.subarray(1,4).toString(), 'PNG'); assert(png.length > 100);
 });
});


describe('Quality of life navigation', () => {
 it('locates a validation error at the named move and does not guess ambiguous slots', () => {
  const sets = [{species:'Pikachu', ability:'Static', item:'Light Ball', moves:['Surf']}];
  assert.deepEqual(T.problemLocation('Pikachu cannot learn Surf.', sets), {index:0, field:'move1'});
  assert.equal(T.problemLocation('The team exceeds the budget.', sets), null);
  assert.equal(T.problemLocation('Pikachu cannot learn Surf.', sets.concat(sets)), null);
 });
 it('maintains a stable team key through edits within the session', () => {
  const team = {name:'Stars', format:'gen9ou', team:'packed'};
  const key = T.teamKey(team); team.name = 'Renamed'; team.team = 'changed';
  assert.equal(T.teamKey(team), key);
 });
});

 describe('Audited team tools boundaries', () => {
 it('does not inherit another team profile or auto-apply preference', () => {
  const room = new Room(); room.curTeam = {name:'A',team:'a'};
  const data=T.empty(); data.selectedNickname='stars'; data.autoNickname=true;
  room.saveToolsData(data); room.curTeam={name:'B',team:'b'};
  assert.equal(room.toolsData().selectedNickname,''); assert.equal(room.toolsData().autoNickname,false);
 });
 it('refuses saved builds beyond capacity but fills an empty slot', () => {
  const room=new Room();room.curTeam={dex:Dex,capacity:6};room.curSetList=Array.from({length:6},()=>({species:'Mew'}));
  room.saveNicknameMappings=()=>true;room.toolsData=()=>({builds:[{id:'b',set:{species:'Mew',moves:['Surf']}}]});
  let commits=0;room.toolsCommit=()=>commits++;
  room.addLibraryBuild('b');assert.equal(room.curSetList.length,6);assert.equal(commits,0);
  room.curSetList[2]={species:''};room.addLibraryBuild('b');assert.equal(commits,1);assert.equal(room.curSetList[2].species,'Mew');
 });
 it('does not undo over later move edits', () => {
  const room=new Room(),applied={species:'Mew',moves:['Surf']};room.curTeam={};room.curSetList=[applied];
  room.buildUndo={team:room.curTeam,applied,snapshot:T.clone(applied),set:{species:'Mew',moves:['Psychic']}};
  applied.moves[0]='Thunderbolt';room.toolsCommit=()=>{throw Error('Must not overwrite');};room.undoSavedBuild();
  assert.equal(room.curSetList[0].moves[0],'Thunderbolt');
 });
 });

describe('Team Builder profile performance', () => {
 it('reads library data without copying all builds, while editable reads remain isolated', () => {
  const room=new Room();room.curTeam={toolsKey:'perf'};
  prefs.pokemontools={version:1,builds:[{id:'b',set:{species:'Mew'}}],nicknames:[],teamProfiles:{perf:{id:'p',auto:true}}};
  const view=room.toolsData(true);assert.equal(view.builds,prefs.pokemontools.builds);
  assert.equal(view.selectedNickname,'p');assert.equal(prefs.pokemontools.selectedNickname,undefined);
  const editable=room.toolsData();editable.builds[0].set.species='Pikachu';assert.equal(prefs.pokemontools.builds[0].set.species,'Mew');
 });
 it('switches a team nickname profile without rebuilding the editor or search', () => {
  const room=new Room();let saves=0,label='';
  room.toolsData=()=>({selectedNickname:'old',nicknames:[{id:'new',name:'Stars'}]});
  room.saveToolsData=data=>{saves++;assert.equal(data.selectedNickname,'new');};
  room.$=()=>({text:value=>{label=value;}});room.update=()=>{throw Error('Unnecessary editor rebuild');};
  room.changeTeamNicknameProfile({currentTarget:{value:'new'}});
  assert.equal(saves,1);assert.equal(label,'Names: Stars');
 });
});

describe('Team Builder navigation placement', () => {
 it('mounts profile controls in the content rather than above the List/Team navigation', () => {
  assert(source.includes("this.$('.teamchartbox').first().prepend(html)"));
  assert(!source.includes("this.$('.team-profile-toolbar').remove(); this.$el.prepend(html)"));
 });
 it('returns to the editor without rebuilding results or changing the set', () => {
  const room=new Room();let scrolled=false;room.curSet={species:'Mew'};
  room.$=()=>[{scrollIntoView:options=>{scrolled=true;assert.equal(options.block,'start');}}];
  room.update=()=>{throw Error('Must preserve current search');};room.returnToPokemonEditor();
  assert(scrolled);assert.equal(room.curSet.species,'Mew');
 });
});
