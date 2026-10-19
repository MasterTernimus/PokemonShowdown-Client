'use strict';
const assert=require('assert').strict;require('./battle.test');
describe('Soul Reaver client metadata',()=>{
 it('shows its component, drain and ordinary suppression',()=>{const a=Dex.abilities.get('soulreaver');assert(a.exists);assert(Dex.getAbilityEffects('soulreaver').has('infiltrator'));assert(a.desc.includes('25%'));assert(!a.flags.cantsuppress);assert(!a.flags.breakable);});
 it('preserves Dusknoir slots/passives and Mega',()=>{assert.deepEqual(Dex.species.get('dusknoir').abilities,{0:'Requiem',1:'Pressure',H:'Soul Reaver'});assert.deepEqual(Dex.species.get('dusknoir').passives,['soulescort']);assert.equal(Dex.species.get('dusknoiralt').abilities.H,'Soul Reaver');assert.deepEqual(Dex.species.get('dusknoirmega').abilities,{0:"Reaper\'s Grip"});});
 it('exports Alolan Muk Corrosive Strike for the builder',()=>{const l=require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;assert(l.mukalola.learnset.corrosivestrike);});
});
