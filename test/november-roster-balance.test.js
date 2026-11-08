'use strict';
const assert=require('assert').strict;
const {Dex}=require('./helpers/isolated-dex.cjs')();
describe('November roster client data',()=>{
 it('shows the approved passive swaps',()=>{
  const passives={magneton:'hydrabond',kingdra:'swiftswim',honchkrow:'moxie',drapion:'poisontouch',toxicroak:'anticipation',conkeldurr:'rockypayload',maushold:'friendguard',mausholdfour:'friendguard',dachsbun:'wellbakedbody',starmie:'illuminate',revavroom:'overcoat',farigiraf:'armortail',greattusk:'protosynthesis',ironbundle:'quarkdrive'};
  for(const[id,passive]of Object.entries(passives))assert.deepEqual(Array.from(Dex.species.get(id).passives),[passive],id);
 });
 it('shows the grouped Eeveelution choices and Flame Body',()=>{
  for(const id of ['vaporeon','jolteon','flareon'])assert.equal(Dex.species.get(id).abilities.H,'Adaptability');
  for(const id of ['leafeon','glaceon'])assert.equal(Dex.species.get(id).abilities.H,'Technician');
  assert.equal(Dex.species.get('flareon').abilities[1],'Flame Body');
 });
 it('does not advertise removed components',()=>{
  for(const id of ['ancientbloom','fortressshell','burningcrown','royalscales','fallenstar','atrocity','ragingstorm'])assert(!Dex.getAbilityEffects(id).has('selfsufficient'),id);
  assert(!Dex.getAbilityEffects('greatmarsh').has('anticipation'));
  assert.match(Dex.abilities.get('freshplumage').shortDesc,/accuracy/);
  assert.match(Dex.abilities.get('burningquake').shortDesc,/Dragons/);
  assert(!/20%|KOs boost/.test(Dex.abilities.get('voidcommand').shortDesc));
 });
 it('shows the latest selectable abilities and composite components',()=>{
  assert.equal(Dex.species.get('farigiraf').abilities[1],'Twin Focus');
  assert.equal(Dex.species.get('starmie').abilities[0],'Cosmic Analysis');
  assert.equal(Dex.species.get('sylveon').abilities.H,'Aroma Veil');
  assert.deepEqual(Object.values(Dex.species.get('tyranitar').abilities),['Earth Eater','Battle Armor','Dread Presence']);
  for(const id of ['punchfiend','kickfiend'])assert(!Dex.getAbilityEffects(id).has('serenegrace'));
  assert(!Dex.getAbilityEffects('spinfiend').has('vitalspirit'));
  assert(Dex.getAbilityEffects('dreadpresence').has('darkaura'));
  assert(!/Psychic\/Fairy|attacks also gain 25%/.test(Dex.abilities.get('breakingnews').desc));
  for(const id of ['analytic','download'])assert(Dex.getAbilityEffects('cosmicanalysis').has(id));
  assert.equal(Dex.abilities.get('worldbreaker').id,'stringsofruin');
  assert.equal(Dex.abilities.get('worldbreaker').name,'Strings of Ruin');
  assert.equal(Dex.species.get('hydreigon').abilities[1],'Strings of Ruin');
  assert(Object.values(Dex.species.get('slowkinggalar').abilities).includes('Own Tempo'));
  assert(!Object.values(Dex.species.get('slowkinggalar').abilities).includes('Telepathy'));
  const effects=Dex.getAbilityEffects('astralwitchcraft');
  for(const id of ['levitate','magicguard','serenegrace'])assert(effects.has(id),id);
  for(const id of ['voidguile','magician','infiltrator','magicbounce'])assert(!effects.has(id),id);
  assert(Dex.getAbilityEffects('lunarorbit').has('serenegrace'));
 });
 it('shows the revised counterpart signatures on Paradox species',()=>{
  const expected={ironthorns:['Sand Stream','Mountain Hide','Analytic'],sandyshocks:['Magnet Pull','Hydra Bond','Sand Force'],ironbundle:['Prankster','Evil Santa','Slush Rush'],ironmoth:['Cinder Scales','Dawn Herald','Levitate'],ironvaliant:['Void Veil','Ruptured Heaven','Download']};
  for(const[id,abilities]of Object.entries(expected))assert.deepEqual(Object.values(Dex.species.get(id).abilities),abilities,id);
 });
 it('shows Evergreen and Scavenger without their removed components',()=>{
  assert.match(Dex.abilities.get('evergreen').shortDesc,/hail\/snow/);
  assert.match(Dex.abilities.get('scavenger').shortDesc,/faints/);
  for(const id of ['overcoat','ripen'])assert(!Dex.getAbilityEffects('evergreen').has(id));
  for(const id of ['overcoat','bigpecks','regenerator'])assert(!Dex.getAbilityEffects('scavenger').has(id));
 });
 it('shows the approved Aevian stats and Self Repair migration',()=>{
  for(const[id,stats]of Object.entries({glalieaevian:[110,110,105,50,85,40],glalieaevianmega:[110,135,105,90,85,80],froslassaevianmega:[70,80,80,140,100,130]}))assert.deepEqual(Object.values(Dex.species.get(id).baseStats),stats,id);
  for(const id of ['glimmoraaevian','glimmoraaevianmega'])assert.deepEqual(Array.from(Dex.species.get(id).passives),['selfrepair']);
  assert(!Dex.getAbilityEffects('adaptivecore').has('selfrepair'));
  for(const id of ['glalieaevian','glalieaevianmega'])assert.deepEqual(Array.from(Dex.species.get(id).passives),['levitate']);
  for(const id of ['golisopodaevian','golisopodaevianmega'])assert.deepEqual(Array.from(Dex.species.get(id).passives),['heatproof']);
  assert(!Dex.getAbilityEffects('mossarmor').has('levitate'));
  assert(!Dex.getAbilityEffects('desertshell').has('heatproof'));
 });
 it('shows the exact reduced stat totals',()=>{
  for(const[id,total]of [['rhydon',520],['lanturn',540]])assert.equal(Object.values(Dex.species.get(id).baseStats).reduce((a,b)=>a+b),total,id);
 });
});
