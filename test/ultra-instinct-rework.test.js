'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Approved Ultra Instinct and Inferno Ascendant presentation',()=>{
 for(const id of ['hitmonlee','infernape','sawk','lycanroc'])it(id+' retains selected Ultra Instinct and its existing species passive',()=>{
  const s=Dex.species.get(id);assert(Object.values(s.abilities).includes('Ultra Instinct'));assert(s.passives.length);
  const text=Dex.getAbilityDisplayDetails(Dex.abilities.get('ultrainstinct'),s.passives,id).desc;
  for(const phrase of ['30%','35%','40%','1/16','1/8','queued to move'])assert(text.includes(phrase),phrase);
 });
 it('Mega Infernape displays two selected components with Proficient only as its passive',()=>{
  const s=Dex.species.get('infernapemega');assert.deepEqual(s.passives,['proficient']);assert.deepEqual(s.abilities,{0:'Inferno Ascendant'});
  const parts=Dex.getAbilityDisplayComponents('burningspirit',Dex,s.passives,s.id);
  assert.deepEqual(parts,['ultrainstinct','magmaarmor']);
  const effects=Dex.getAbilityEffects('burningspirit');for(const id of ['ultrainstinct','magmaarmor','moldbreaker','innerfocus'])assert(effects.has(id),id);
  for(const id of ['opportunist','selfsufficient','proficient','flamebody','ironfist','battlefervor'])assert(!effects.has(id),id);
  const text=Dex.getAbilityDisplayDetails(Dex.abilities.get('burningspirit'),s.passives,s.id).desc;assert(!text.includes('Opportunist'));assert(!parts.includes('proficient'));
 });
 it('Relentless Hunt explains the single Cold Eclipse bonus and raised priority threshold',()=>{
  const text=Dex.abilities.get('relentlesshunt').desc;assert(/up to 80 on Cold Eclipse/.test(text));assert(text.includes('applies once'));
 });
});

describe('Ultra rivalry descriptions',()=>{
 for(const id of ["ultrainstinct","burningspirit","ultraego","burningego","perfectego","unleashedego","primalego"])it(id+' describes the approved rivalry',()=>{
 const a=Dex.abilities.get(id);assert(a.desc.includes('40%'),id);assert(a.desc.includes('negative Attack'),id);
 });
});

describe('Ultra Ego combat-turn descriptions', () => {
 for (const id of ['ultraego', 'burningego', 'perfectego', 'unleashedego', 'primalego']) {
  it(id + ' describes alternating qualifying turns for damage dealt or taken', () => {
   const ability = Dex.abilities.get(id);
   const texts = [ability.desc];
   if (id === 'perfectego') texts.push(Dex.getAbilityDisplayDetails(ability, ['noguard']).desc);
   for (const text of texts) {
    assert.match(text, /end of the first such turn and every other one afterward/i);
    assert.match(text, /deals or takes direct attack damage to or from a foe/i);
    assert.match(text, /gains \+1 Attack and Sp\. Atk/i);
    assert.doesNotMatch(text, /first and every other opposing attack/i);
   }
  });
 }
});
