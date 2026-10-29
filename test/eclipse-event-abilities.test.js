'use strict';
const assert = require('assert').strict, fs = require('fs');
require('./battle.test');
const {BattleAbilitySearch} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js', 'utf8') + '\nreturn {BattleAbilitySearch};')();
const events = [
 ['froslass','badseeds'], ['glalie','badseeds'], ['weavile','badseeds'], ['arbolivaaevian','badseeds'],
 ['typhlosionhisui','ashenseeds'], ['ninetales','ashenseeds'], ['camerupt','ashenseeds'], ['torkoal','ashenseeds'],
 ['hoopa','riftherald'], ['bronzong','riftherald'], ['mismagius','riftherald'],
];
function rows(species) {return BattleAbilitySearch.prototype.getBaseResults.call({dex:Dex, species, format:'gen9nofieldsinglesgame'});}
function checkEvent(species, ability) {
 const list = rows(species), heading = list.findIndex(row => row[1] === 'Special Event Abilities');
 const selected = list.map((row, index) => ({row,index})).filter(({row}) => row[0] === 'ability' && row[1] === ability);
 assert(heading >= 0, species + ' event heading');
 assert.equal(selected.length, 1, species + ' must list the event ability exactly once');
 assert(selected[0].index > heading, species + ' event placement');
}
describe('Eclipse Special Event ability presentation', () => {
 for (const [species, ability] of events) it('lists ' + ability + ' in the event slot for ' + species, () => {
  assert.equal(toID(Dex.species.get(species).abilities.S), ability);
  checkEvent(species, ability);
 });
 for (const [species, ability] of [['froslassmega','badseeds'],['glaliemega','badseeds'],['cameruptmega','ashenseeds']]) it('preserves inherited event selection for ' + species, () => checkEvent(species, ability));
 it('keeps explicitly separate Hoopa-Unbound on its own ability record', () => {
  assert.equal(Dex.species.get('hoopaunbound').abilities.S, undefined);
  assert(!rows('hoopaunbound').some(row => row[0] === 'ability' && row[1] === 'riftherald'));
 });
 it('keeps Arena Trap as Arboliva-Aevian ordinary second ability', () => {
  const species = Dex.species.get('arbolivaaevian');
  assert.equal(species.abilities[1], 'Arena Trap');
  const list = rows(species.id);
  assert(list.findIndex(row => row[1] === 'arenatrap') < list.findIndex(row => row[1] === 'Special Event Abilities'));
  assert.equal(Object.values(species.abilities).filter(ability => ability === 'Bad Seeds').length, 1);
 });
});
