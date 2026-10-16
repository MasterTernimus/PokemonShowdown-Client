'use strict';
const assert=require('assert').strict;
const loadDex=require('./helpers/isolated-dex.cjs');
const {Dex}=loadDex();
const table=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
describe('Talonflame and Safeguard synchronized client data',()=>{
 it('shows Gale Wings as the sole passive and Flame Body in its selected slot',()=>{
  const s=Dex.species.get('talonflame');
  assert.deepEqual(Array.from(s.passives),['galewings']);
  assert.equal(s.abilities.H,'Flame Body');
  assert(!Object.values(s.abilities).includes('Gale Wings'));
  assert(Dex.hasAbilityEffect(s,'galewings'));
 });
 it('includes current-generation Safeguard for the requested support roster',()=>{
  for(const id of ['mawile','floetteeternal','florges','florgesreborn','vileplume','exeggutor','exeggutoralola','chansey','tangela','chikorita','bayleef','meganium','hoppip','skiploom','blissey','roselia','budew','roserade','audino','swadloon','petilil','lilliganthisui','alomomola','spritzee','aromatisse','fomantis','lurantistotem','bounsweet','steenee','hatenna','hattrem','hatterene','zarude','zarudedada','embirch']) {
   assert(table.learnsets[id]?.safeguard?.includes('9'),id);
  }
 });
});
