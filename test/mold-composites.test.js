'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Approved Mold Breaker composite metadata',()=>{
 for(const id of ['fallenstar','atrocity','sunsovereign','parentalbond','spiralevolution','toxicevolution'])it(id+' exposes Mold Breaker without stale contrary wording',()=>{
  if (['atrocity','sunsovereign','parentalbond','toxicevolution'].includes(id)) { assert(!Dex.getAbilityEffects(id).has('moldbreaker')); return; }
  assert(Dex.getAbilityEffects(id).has('moldbreaker'));const a=Dex.abilities.get(id);
  assert(/Mold Breaker/.test(a.desc));if(id !== 'atrocity') assert(Dex.getAbilityDisplayComponents(id).includes('moldbreaker')); else assert.deepEqual(Dex.getAbilityDisplayComponents(id), ['unboundblaze', 'toughclaws']);assert(!/does not.*bypass abilities|No Skill Link/.test(a.desc));
 });
});
