'use strict';
const assert=require('assert').strict;const {Dex}=require('./helpers/isolated-dex.cjs')();
describe('Galar Rising client data',()=>{
 it('shows the new base and Gmax slots with unchanged passives',()=>{for(const[id,slot,ability,passive]of [['cinderace',1,'Rising Striker','blaze'],['rillaboom',1,'Rising Rhythm','overgrow'],['inteleon',1,'Rising Marksman','torrent'],['cinderacegmax',0,'Grand Striker','blaze'],['rillaboomgmax',0,'Grand Rhythm','overgrow'],['inteleongmax',0,'Grand Marksman','torrent']]){assert.equal(Dex.species.get(id).abilities[slot],ability);assert.deepEqual(Array.from(Dex.species.get(id).passives),[passive]);assert(Dex.abilities.get(ability).desc);}
 assert.equal(Dex.species.get('inteleon').abilities[0],'Infiltrator');});
 it('shows Calculated Shot without Sniper and the correct Grand components',()=>{for(const[id,parts]of [['calculatedshot',['frisk']],['grandstriker',['striker','defiant','risingstriker']],['grandrhythm',['forestsurge','risingrhythm']],['grandmarksman',['megalauncher','dualwield','risingmarksman']]]){const effects=Dex.getAbilityEffects(id);for(const part of parts)assert(effects.has(part),id+':'+part);assert(!effects.has('proficient'));}assert(!Dex.getAbilityEffects('grandstriker').has('libero'));assert(!Dex.getAbilityEffects('calculatedshot').has('sniper'));assert(!/Sniper/.test(Dex.abilities.get('calculatedshot').desc));});
});
