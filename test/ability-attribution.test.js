const assert = require('assert').strict;
require('./battle.test');
describe('External ability protocol attribution', () => {
 function parse(lines, known = true) {
  const log = ['|init|battle', '|gen|9', '|gametype|doubles', '|player|p1|Alice|1', '|player|p2|Bob|1',
   '|start', '|switch|p1a: Source|Beheeyem, L100|100/100', '|switch|p1b: Target|Toxicroak, L100|100/100'];
  if (known) log.push('|-ability|p1b: Target|Dry Skin');
  const battle = new Battle({debug: true, log: [...log, ...lines]}); battle.seekTurn(Infinity); return battle;
 }
 for (const known of [true, false]) it('keeps recipient ability on boost/status/damage/heal and replay ' + known, () => {
  for (const line of [
   '|-boost|p1b: Target|spa|2|[from] ability: Memory Leak|[of] p1a: Source',
   '|-status|p1b: Target|psn|[from] ability: Poison Touch|[of] p1a: Source',
   '|-damage|p1b: Target|90/100|[from] ability: Bad Dreams|[of] p1a: Source',
   '|-heal|p1b: Target|100/100|[from] ability: Healer|[of] p1a: Source',
  ]) {
   const battle = parse([line], known), target = battle.p1.active[1];
   assert.equal(target.ability, known ? 'Dry Skin' : '');
   const expected = target.ability; battle.seekTurn(0); battle.seekTurn(Infinity);
   assert.equal(battle.p1.active[1].ability, expected); battle.destroy();
  }
 });
 for (const name of ['Cursed Keepsake', 'Cursed Doll', 'Cursed Marionette', 'Cursed Armament']) it(name + ' stays known after a Frisk item reveal', () => {
  const battle = parse(['|-ability|p1a: Source|' + name, '|-item|p1b: Target|Leftovers|[from] ability: Frisk|[of] p1a: Source']);
  assert.equal(battle.p1.active[0].ability, name);
  assert.equal(battle.p1.active[1].ability, 'Dry Skin');
  battle.destroy();
 });
 for (const [name, component] of [['Astral Ward','Anticipation'],['Doom Warning','Anticipation'],['Calculated Shot','Frisk'],['Night Hunt','Frisk'],['Night Hunt','Illuminate'],['Silk Sights','Keen Eye'],['Long Reach','Keen Eye'],['Slipstream','Keen Eye']]) it(name + ' retains its identity after ' + component, () => {
  const battle = parse(['|-ability|p1a: Source|' + name, '|-ability|p1a: Source|' + component]);
  assert.equal(battle.p1.active[0].ability, name);
  battle.destroy();
 });
 it('keeps known composites when a nested component activates', () => {
  const battle = parse(['|-ability|p1a: Source|Lunar Dread', '|-ability|p1a: Source|Pressure']);
  assert.equal(battle.p1.active[0].ability, 'Lunar Dread'); battle.destroy();
 });
 for (const effect of ['Skill Swap', 'Role Play', 'Entrainment', 'Trace', 'Mummy', 'Lingering Aroma', 'Wandering Spirit']) {
  it('retains real replacement from ' + effect, () => {
   const battle = parse(['|-ability|p1b: Target|Pressure|[from] '+(effect === 'Skill Swap' || effect === 'Role Play' || effect === 'Entrainment' ? 'move: ' : 'ability: ')+effect+'|[of] p1a: Source']);
   assert.equal(battle.p1.active[1].ability, 'Pressure'); battle.destroy();
  });
 }
});
