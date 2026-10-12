'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Approved Ultra Instinct and Burning Spirit presentation',()=>{
 for(const id of ['hitmonlee','infernape','sawk','lycanroc'])it(id+' retains selected Ultra Instinct and its existing species passive',()=>{
  const s=Dex.species.get(id);assert(Object.values(s.abilities).includes('Ultra Instinct'));assert(s.passives.length);
  const text=Dex.getAbilityDisplayDetails(Dex.abilities.get('ultrainstinct'),s.passives,id).desc;
  for(const phrase of ['25%','35%','1/16','1/8','queued to move','Screens give no extra power'])assert(text.includes(phrase),phrase);
 });
 it('Mega Infernape displays three selected components with Proficient only as its passive',()=>{
  const s=Dex.species.get('infernapemega');assert.deepEqual(s.passives,['proficient']);assert.deepEqual(s.abilities,{0:'Burning Spirit'});
  const parts=Dex.getAbilityDisplayComponents('burningspirit',Dex,s.passives,s.id);
  assert.deepEqual(parts,['ultrainstinct','opportunist','magmaarmor']);
  const effects=Dex.getAbilityEffects('burningspirit');for(const id of ['ultrainstinct','opportunist','magmaarmor','moldbreaker','innerfocus'])assert(effects.has(id),id);
  for(const id of ['selfsufficient','proficient','flamebody','ironfist','battlefervor'])assert(!effects.has(id),id);
  const text=Dex.getAbilityDisplayDetails(Dex.abilities.get('burningspirit'),s.passives,s.id).desc;assert(text.includes('does not copy accuracy or evasion'));assert(text.includes('separate species passive'));
 });
 it('Relentless Hunt explains the single Cold Eclipse bonus and raised priority threshold',()=>{
  const text=Dex.abilities.get('relentlesshunt').desc;assert(text.includes('threshold to 80'));assert(text.includes('applied once'));
 });
});
