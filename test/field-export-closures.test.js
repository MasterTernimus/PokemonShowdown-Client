'use strict';
const assert = require('assert').strict;
require('./auras.test');

describe('Exported field preview dependencies', () => {
 for (const move of ['surf', 'muddywater', 'glaciate', 'hydrovortex', 'sparklingaria', 'thunderbolt', 'tackle']) {
  it(`evaluates all field notes for ${move} without server globals`, () => {
   assert.doesNotThrow(() => BattleFieldTooltips.allNotes(Dex.moves.get(move)));
  });
 }
 it('retains the Dragon Den cooling transition power bonus', () => {
  const source = BattleFieldTooltips.pokemon();
  const field = BattleFieldRules.find(f => f.id === 'dragonsdenterrain');
  const result = BattleFieldTooltips.evaluate(field, Dex.moves.get('glaciate'), source, source, '', 0);
  assert.equal(result.factor, 0.65);
 });
 it('previews Midnight Zone accuracy for Illuminate without a live battle target', () => {
  const field = BattleFieldRules.find(f => f.id === 'midnightzoneterrain');
  const source = BattleFieldTooltips.pokemon(null, {speciesForme: 'Mew', ability: 'Illuminate', passives: []});
  const target = BattleFieldTooltips.pokemon();
  for (const move of ['zapcannon', 'dynamicpunch']) {
   const result = BattleFieldTooltips.evaluate(field, Dex.moves.get(move), source, target, '', 0);
   assert.equal(result.accuracy, true);
  }
 });
});
