'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const ts = require('typescript');
const dexContext = require('./helpers/isolated-dex.cjs')();
const {Dex} = dexContext;
const toID = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const files = new Map();
function loadFunction(file, name, scope) {
 if (!files.has(file)) files.set(file, ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true));
 const ast = files.get(file);
 let code;
 function visit(node) {
  if (ts.isPropertyAssignment(node) && node.name.getText(ast) === name && ts.isFunctionExpression(node.initializer)) code = node.initializer.getText(ast);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && node.left.getText(ast) === name) code = node.right.getText(ast);
  ts.forEachChild(node, visit);
 }
 visit(ast);
 assert(code, name);
 return new Function(...Object.keys(scope), 'return (' + code + ');')(...Object.values(scope));
}
const tools = 'play.pokemonshowdown.com/js/client-teambuilder.js';
const calculator = 'play.pokemonshowdown.com/js/client-mainmenu.js';

describe('Hidden species at secondary selection boundaries', () => {
 it('expands a base profile member into supported forms only', () => {
  const expand = loadFunction(tools, 'rosterExpandedSpecies', {Dex, toID, window:dexContext});
  assert.deepEqual(expand('hydreigon'), ['hydreigon']);
  assert.deepEqual(expand('empoleon'), ['empoleon', 'empoleonmegay']);
  assert.deepEqual(expand('hydreigonmega'), []);
  assert(Dex.species.get('Hydreigon-Mega').exists);
 });
 it('hides stored legacy forms from the roster list without changing stored membership', () => {
  const profile={id:'legacy',name:'Saved list',species:['hydreigon','hydreigonmega','empoleonmegax','empoleonmegay']};
  const render=loadFunction(tools,'renderRosterProfiles',{Dex,BattleLog:{escapeHTML:String}});
  const html=render.call({profilesView:true,rosterData:()=>({profiles:[profile],selected:'legacy'})});
  assert(!html.includes('Hydreigon-Mega'));assert(!html.includes('Empoleon-Mega-X'));
  assert(html.includes('Empoleon-Mega-Y'));assert(html.includes('2 Pokémon / forms'));
  assert.equal(profile.species.length,4);
 });
 it('omits hidden forms from local form previews while keeping supported forms', () => {
  const preview=loadFunction(tools,'proto.toggleFormPreview',{Dex,toID,T:{previewKey:()=>''}});
  const room={curTeam:{dex:Dex},curSetList:[{species:'Empoleon'}],rosterBranchSpecies:()=>['empoleon','empoleonmegax','empoleonmegay'],update(){}};
  preview.call(room,0);
  assert.deepEqual(room.formPreview.options.map(option=>option.id),['empoleonmegay']);
 });
 it('blocks old saved builds at both add and replacement application without deleting them', () => {
  for (const name of ['proto.addLibraryBuild', 'proto.loadSavedBuildNow', 'proto.openBuildComparison']) {
   for (const species of ['Hydreigon-Mega', 'Empoleon-Mega-X']) {
    const build = {id:'legacy', set:{species}}, data = {builds:[build]}, messages = [];
    const room = {curTeam:{dex:Dex}, curSetList:[{species:'Mew'}], saveNicknameDraft(){}, toolsData:()=>data};
    const fn = loadFunction(tools, name, {Dex, T:{}, app:{addPopupMessage:message=>messages.push(message)}});
    if (name === 'proto.addLibraryBuild') fn.call(room, build.id); else fn.call(room, 0, build);
    assert.equal(room.curSetList[0].species, 'Mew');
    assert.equal(data.builds[0], build);
    assert.equal(messages.length, 1);
   }
  }
 });
 it('omits hidden Pokémon from saved-team and saved-build calculator choices', () => {
  const sets = [{species:'Hydreigon-Mega'}, {species:'Hydreigon'}, {species:'Empoleon-Mega-X'}, {species:'Empoleon-Mega-Y'}];
  const Storage = {teams:[{name:'Old team', team:sets}], unpackTeam:team=>team, prefs:()=>({builds:sets.map((set, i)=>({name:'Set '+i,set}))})};
  let html;
  const room = {escape:String, $:()=>({html(value){html=value;return this;}, prop(){return this;}})};
  loadFunction(calculator, 'populateCalcSets', {Dex, Storage}).call(room);
  assert.deepEqual(room.savedCalcSets.map(entry=>entry.set.species), ['Hydreigon','Empoleon-Mega-Y','Hydreigon','Empoleon-Mega-Y']);
  assert(!html.includes('Hydreigon-Mega'));
  assert(!html.includes('Empoleon-Mega-X'));
  assert.equal(sets.length, 4);
 });
 it('rejects a stale or imported hidden calculator actor before writing controls', () => {
  const validate = loadFunction(calculator, 'validateActorImport', {Dex});
  for (const species of ['Hydreigon-Mega', 'Empoleon-Mega-X']) {
   assert.throws(()=>validate.call({$(){throw Error('should not touch controls');}},0,{species}),/unavailable in the calculator/);
  }
 });
});
