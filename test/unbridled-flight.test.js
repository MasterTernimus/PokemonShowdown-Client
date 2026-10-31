'use strict';
const assert=require('assert').strict,{Dex}=require('./helpers/isolated-dex.cjs')();
describe('Mega Pinsir client parity',()=>{
 it('shows Unbridled Flight with Aerilate and no obsolete components',()=>{const s=Dex.species.get('pinsirmega'),a=Dex.abilities.get('unbridledflight');assert.equal(s.abilities[0],'Unbridled Flight');assert.deepEqual(Array.from(s.passives),['aerilate']);assert.equal(a.desc,require('../server-data-sync-manifest.json').snapshot.abilities.unbridledflight.desc);for(const id of ['violentrush','aerilate','vitalspirit'])assert(!Dex.getAbilityEffects('unbridledflight').has(id));});
 it('removes Extreme Speed from move data and teambuilder while retaining Quick Attack',()=>{const l=require('../play.pokemonshowdown.com/data/learnsets').BattleLearnsets.pinsir.learnset,t=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable.learnsets.pinsir;assert(!l.extremespeed);assert(!t.extremespeed);assert(l.quickattack);assert(t.quickattack);});
 it('indexes the new ability',()=>{assert(require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex.some(row=>row[0]==='unbridledflight'&&row[1]==='ability'));});
});
