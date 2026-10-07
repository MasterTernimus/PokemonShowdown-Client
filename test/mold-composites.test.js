'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Approved Mold Breaker composite metadata',()=>{
 for(const id of ['fallenstar','atrocity','sunsovereign','voidomen','parentalbond','spiralevolution','toxicevolution'])it(id+' exposes Mold Breaker without stale contrary wording',()=>{
  assert(Dex.getAbilityEffects(id).has('moldbreaker'));const a=Dex.abilities.get(id);
  assert(/Mold Breaker/.test(a.desc));if(id !== 'atrocity') assert(Dex.getAbilityDisplayComponents(id).includes('moldbreaker')); else assert.deepEqual(Dex.getAbilityDisplayComponents(id), ['unboundblaze', 'toughclaws']);assert(!/does not.*bypass abilities|No Skill Link/.test(a.desc));
 });
});
