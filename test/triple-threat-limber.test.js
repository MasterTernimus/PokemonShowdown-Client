'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Triple Threat Limber metadata',()=>{
 it('has final components and no Sniper remnants',()=>{
  assert.deepEqual([...Dex.getAbilityEffects('triplethreat')].sort(),['triplethreat','hydrabond','tangledfeet','keeneye','bigpecks','limber'].sort());
  const a=Dex.abilities.get('triplethreat');assert(!/Sniper|2\.25x|Accuracy on entry/.test(a.desc));assert(/Limber/.test(a.desc));
 });
 it('keeps the Triple Arrows boost out of player-facing move help',()=>{
  const m=Dex.moves.get('triplearrows');assert(!/Chi Strike|ally crit|raises the critical|user.s side/i.test(m.desc+' '+m.shortDesc));
 });
});
