'use strict';
const assert = require('assert').strict, fs = require('fs'), vm = require('vm');
require('./battle.test');
const BattleAbilitySearch = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn BattleAbilitySearch;')();
describe('Approved shortlist and Burning Rage presentation', () => {
 it('shows Unburden as an additional Veluza option without moving Swift Swim or event Aevian Rocket', () => {
  const rows = BattleAbilitySearch.prototype.getBaseResults.call({dex: Dex, species: 'veluza', format: 'gen9nofieldsinglesgame'});
  const options = rows.filter(row=>row[0]==='ability').map(row=>row[1]);
  assert.deepEqual(options,['moldbreaker','swiftswim','sharpness','unburden','aevianrocket']);
  assert(rows.some(row=>row[0]==='header'&&row[1]==='Additional Ability'));
  const special=rows.findIndex(row=>row[0]==='header'&&row[1]==='Special Event Abilities');
  assert(rows.findIndex(row=>row[1]==='unburden')<special);
  assert(rows.findIndex(row=>row[1]==='aevianrocket')>special);
 });
 it('renders Burning Rage named components in the real ability row and separates Proficient passive context', () => {
  const BattleLog=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-log.js','utf8')+'\nreturn BattleLog;')();
  const window={};vm.runInNewContext(fs.readFileSync('play.pokemonshowdown.com/js/search.js','utf8'),{window,jQuery(){},Dex,toID,BattleLog});
  const search=Object.create(window.BattleSearch.prototype);search.renderAll=true;
  const ability=Dex.abilities.get('burningrage'),html=search.renderAbilityRow(ability,0,0);
  assert(html.includes('Brute Force + Iron Fist + Mold Breaker'));
  for(const name of ['Reckless','Rock Head','Proficient'])assert(ability.desc.includes(name));
  assert.deepEqual(Dex.getAbilityDisplayComponents('burningrage',Dex,['blaze'],'infernape'),['bruteforce','ironfist','moldbreaker']);
  assert.deepEqual(Dex.getAbilityDisplayComponents('burningrage',Dex,['ironfist']),['bruteforce','moldbreaker']);
  const context=Dex.getAbilityDisplayDetails(ability,['proficient'],'infernapemega');
  assert(!context.shortDesc.includes('Proficient'));assert.deepEqual(Dex.species.get('infernapemega').passives,['proficient']);assert(!Dex.getAbilityDisplayComponents(ability.id,Dex,['proficient'],'infernapemega').includes('proficient'));
  assert.deepEqual(Dex.species.get('infernape').passives,['blaze']);
  for(const id of ['proficient','bruteforce','ironfist','moldbreaker'])assert(Dex.getAbilityEffects('burningrage').has(id));
  // Existing client search includes delegated effects; runtime field identity is tested on the server.
  for(const id of ['reckless','rockhead'])assert(Dex.getAbilityEffects('burningrage').has(id));
 });
 it('exposes all approved passive swaps and exact selected replacements', () => {
  const approved=require('./fixtures/shortlist-approved.json');
  const current=require('./fixtures/mega-approval-overlays');
  for(const[id,p]of Object.entries(approved.passives))assert.deepEqual(Dex.species.get(id).passives,current.passives(id,p),id);
  for(const[id,slots]of Object.entries(approved.slots))for(const[slot,value]of Object.entries(slots))assert.equal(Dex.species.get(id).abilities[slot],current.abilities(id,{[slot]:value})[slot],id);
  assert.deepEqual(Dex.species.get('veluzarejuv').abilities,{0:'Aevian Rocket'});
  assert.equal(Dex.species.get('avalugghisui').abilities[0],'Strong Jaw');
 });
 it('attributes full signature components to their passives and preserves removed component exclusions', () => {
  for(const [species, passive, components] of [['slowkinggalar','eldritchremedy',['owntempo','curiousmedicine']],['garganacl','saltbastion',['sturdy']]]) {
   const row=Dex.species.get(species);
   for(const component of components) {
    assert(Dex.getAbilityEffects(passive).has(component), passive+' '+component);
    assert(Dex.getAbilityComponentExclusions(passive,row.passives,species).includes(component));
   }
  }
  for(const [id, removed] of [['chargedtail','static'],['lancepoint','keeneye'],['titanpincer','hypercutter']]) {
   assert(!Dex.getAbilityEffects(id).has(removed),id);
  }
 });
});
