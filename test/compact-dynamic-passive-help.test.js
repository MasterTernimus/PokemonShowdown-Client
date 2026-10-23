'use strict';
const fs = require('fs'), assert = require('assert').strict;
require('./battle.test');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js', 'utf8');
const assignment = require('./helpers/source-functions').assignment;
const passiveStart = source.indexOf('function renderStarterPassives(');
const passiveEnd = source.indexOf('// Keep a searchable picker', passiveStart);
const log = {escapeHTML: value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')};
const passives = new Function('Dex', 'BattleLog', source.slice(passiveStart, passiveEnd) + ';return renderStarterPassives;')(Dex, log);
const render = new Function('render', 'Dex', 'BattleLog', 'return ' + assignment(source, 'p.renderSet', 'data-opening-type-profile'))(
 set => '<li><div class="setcol setcol-icon"></div><div class="setcell-ability"><input name="ability">' + passives(Dex.species.get(set.species)) + '</div><div class="setcell-move">Moves<input name="move1"><input name="move2"></div></li>', Dex, log);
describe('Dynamic passive help stays outside compact Moves', () => {
 for (const [species, ability, move, passive, type] of [
  ['Reuniclus', 'Cellular Concord', 'Drain Punch', 'adaptivecell', 'Fighting'],
  ['Reuniclus', 'Cellular Concord', 'Psychic', 'adaptivecell', 'Psychic'],
  ['Gothitelle', 'Frisk', 'Dark Pulse', 'eclipsevision', 'Dark'],
 ]) it(species + '/' + move + ' keeps one contextual note in passive help', () => {
  const html = render.call({curTeam: {dex: Dex, gen: 9}, currentFormPreview: () => null}, {species, ability, moves: [move]}, 0);
  assert(html.includes('data-passive-id="' + passive + '"'));
  assert(html.includes('data-opening-type-profile="Opening type: ' + type));
  assert(!html.includes('class="opening-type-profile"'));
  assert(!html.replace(/<[^>]*>/g, '').includes('Opening type:'));
  assert.equal((html.match(/data-opening-type-profile=/g) || []).length, 1);
  assert(!html.slice(html.indexOf('setcell-move')).includes('Opening type:'));
 });
 it('Klefki exposes the new active/passive split exactly', () => {
  const s = Dex.species.get('Klefki');
  assert.deepEqual(s.passives, ['prankster']);
  assert.deepEqual(s.abilities, {0: 'Adhesive Armor', 1: 'Master Key', H: 'Magician'});
 });
});
