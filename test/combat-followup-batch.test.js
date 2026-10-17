const assert=require('assert').strict;
require('./battle.test');
describe('Approved stored attacks and seed descriptions',()=>{
 for(const id of ['grandmaster','perfectforesight'])it(id+' describes separate queues and explicit serial postponement',()=>{
  const a=Dex.abilities.get(id);assert(a.desc.includes('including against the same opponent'));
  assert(a.desc.includes('additional due attacks postpone to the next turn'));
  assert(!a.desc.includes('one pending'));
 });
 it('Primeval Hunger describes newly applied seeds without residual rewards',()=>{
  const a=Dex.abilities.get('primevalhunger');assert(a.desc.includes('successful new Leech Seed applications'));
  assert(a.desc.includes('residual seed ticks do not trigger'));assert(a.shortDesc.includes('new seeds'));
 });
});
