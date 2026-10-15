'use strict';
const assert=require('assert').strict;
require('./battle.test');
describe('Approved eight-species client parity',()=>{
 for(const [id,passive]of [['wigglytuff','fluffy'],['lurantis','solarmimicry'],['spiritomb','mourningvessel'],['dewgong','polarrest'],['walrein','glacierbreaker'],['roserade','beguilingbouquet'],['roserademega','beguilingbouquet'],['scolipede','merciless'],['scolipedeazzy','merciless']])it(id+' shows the approved passive',()=>assert.deepEqual(Dex.species.get(id).passives,[passive]));
 it('separates Mourning Vessel from Bound Spirits',()=>{assert.deepEqual(Dex.getAbilityDisplayComponents('mourningvessel'),[]);assert(Dex.getAbilityEffects('boundspirits').has('magicguard'));assert(Dex.getAbilityEffects('boundspirits').has('prankster'));});
 it('preserves selected kit components',()=>{for(const [ability,parts]of Object.entries({reinflate:['punkrock'],perfectapple:['purepower','selfsufficient','angershell'],polarrest:['earlybird','icebody'],glacierbreaker:['moldbreaker'],deepchill:['oblivious','intimidate'],venomspurs:['corrosion'],lastbrood:['swarm']}))for(const part of parts)assert(Dex.getAbilityEffects(ability).has(part),ability+':'+part);});
 it('limits Canopy Archer and the new passives to approved forms',()=>{assert.equal(Dex.species.get('decidueye').abilities.H,'Canopy Archer');for(const id of ['decidueyehisui','decidueyealt'])assert(!Object.values(Dex.species.get(id).abilities).includes('Canopy Archer'));assert.deepEqual(Dex.species.get('scolipedemega').passives,['poisonpoint']);assert(!Dex.species.get('roseradeaevian').passives.includes('beguilingbouquet'));});
});
