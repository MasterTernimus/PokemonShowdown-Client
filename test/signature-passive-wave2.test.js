'use strict';
const assert=require('assert').strict,fs=require('fs');require('./battle.test');
describe('Custom-only passive presentation and Water Barrage',()=>{
 const grants={vikavolt:'rechargerelay',jellicent:'undertow',jellicentazzy:'undertow',pinsir:'lockinggrip',drednaw:'lockjaw',seismitoad:'mirechorus'};
 it('Hariyama now uses full Thick Fat independently of its selected ability',()=>{assert.deepEqual(Dex.species.get('hariyama').passives,['thickfat']);assert.deepEqual(Dex.species.get('hariyama').abilities,{0:'Grit Grappler',1:'Sheer Force',H:'Stamina'});assert(!Dex.species.get('hariyama').passives.includes('palmmastery'));});
 const removed={rechargerelay:'battery',undertow:'waterabsorb',lockinggrip:'hypercutter',palmmastery:'thickfat',lockjaw:'strongjaw',mirechorus:'poisontouch'};
 for(const[species,passive]of Object.entries(grants))it(species+' publishes its custom passive independently of its selectable primitive',()=>{
  assert.deepEqual(Dex.species.get(species).passives,[passive]);
  assert(!Dex.getPassiveAbilityEffects(passive).has(removed[passive]));
  assert(Dex.getPassiveAbilityEffects(passive).has(passive));
  assert(Dex.getAbilityComponentExclusions(passive,[passive],species).includes(removed[passive]));
  assert(Dex.getPassiveAbilityDetails(passive).desc.trim());assert.notEqual(Dex.getPassiveAbilityDetails(passive).desc,Dex.abilities.get(passive).desc);
 });
 it('shows the passive-specific wording in the real teambuilder passive row',()=>{
  const source=fs.readFileSync('play.pokemonshowdown.com/js/client-teambuilder.js','utf8');
  const fn=source.match(/function renderStarterPassives\(species\) \{[\s\S]*?\n\}/)[0];
  const render=new Function('Dex','BattleLog',fn+'\nreturn renderStarterPassives;')(Dex,{escapeHTML:s=>String(s)});
  for(const[species,passive]of Object.entries(grants))assert(render(Dex.species.get(species)).includes(Dex.getPassiveAbilityDetails(passive).desc));
  assert(Dex.getPassiveAbilityDetails('lockinggrip').desc.includes('Substitute damage spends the use'));
  assert(Dex.getPassiveAbilityEffects('mirechorus').has('liquidvoice'));
 });
 it('preserves generic shared signature descriptions and effects',()=>{
  assert(Dex.abilities.get('rechargerelay').desc.includes('Battery'));
  assert(Dex.getAbilityEffects('rechargerelay').has('battery'));
  assert(Dex.getAbilityEffects('mirechorus').has('poisontouch'));
 });
 it('lists Water Barrage as Dual Wield plus Stalwart and prunes duplicate Siege Launcher Includes',()=>{
  assert.deepEqual(Dex.getAbilityDisplayComponents('waterbarrage'),['dualwield','stalwart']);
  assert(Dex.getAbilityEffects('waterbarrage').has('stalwart'));
  const siege=Dex.getAbilityDisplayComponents('siegelauncher');assert(siege.includes('waterbarrage'));assert(siege.includes('megalauncher'));assert(!siege.includes('stalwart'));
  assert(Dex.abilities.get('waterbarrage').desc.includes('Stalwart'));
  assert(Dex.abilities.get('siegelauncher').desc.includes('Stalwart exactly once'));
 });
});
