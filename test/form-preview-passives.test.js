'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
const helper = source.slice(source.indexOf('function renderStarterPassives('), source.indexOf('// Keep a searchable picker beside'));
const wrapper = source.slice(source.indexOf('var renderBuildSet = proto.renderSet;'), source.indexOf('proto.renderFormStatComparison ='));

describe('Form preview passive replacement', () => {
 it('adds a Mega-only passive, restores an empty base and never changes the saved set', () => {
  assert(source.includes("'<!-- SET PASSIVES -->' + renderStarterPassives(this.curTeam.dex.species.get(set.species))"));
  const proto = {};
  new Function('proto', 'Dex', 'BattleLog', 'T', 'escape', helper + '\n' +
   'proto.renderSet = function(set) { return \'<li><div class="setcell setcell-ability"><!-- SET PASSIVES -->\' + renderStarterPassives(Dex.species.get(set.species)) + \'<!-- END SET PASSIVES --></div></li>\'; };\n' + wrapper
  )(proto, Dex, {escapeHTML: x => x}, {clone: x => JSON.parse(JSON.stringify(x))}, x => x);
  const set = {species: 'Floette-Eternal', ability: 'Flower Veil', moves: ['Protect']};
  const original = JSON.stringify(set);
  const species = Dex.species.get('Floette-Mega');
  let selected = null;
  const room = Object.assign(Object.create(proto), {curTeam: {dex: Dex, gen: 9}, currentFormPreview: () => selected});
  assert(!room.renderSet(set, 0).includes('passive-chip'));
  selected = {name: species.name, ability: species.abilities[0], types: species.types};
  let html = room.renderSet(set, 0);
  assert(html.includes('Fairy Aura'));
  assert.equal((html.match(/class="passive-chip"/g) || []).length, 1);
  selected = null;
  assert(!room.renderSet(set, 0).includes('passive-chip'));
  assert.equal(JSON.stringify(set), original);
 });
});
