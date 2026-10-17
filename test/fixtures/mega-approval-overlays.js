const before=Object.fromEntries(require('./mega-approved-before.json').map(s=>[s.id,s.passives]));
Object.assign(before,require('./mega-paused-explicit.json'));
for(const[id,p]of Object.entries(require('./mega-approved-choices.json')))before[id]=[p];
for(const[id,normal]of Object.entries(require('./mega-approved-variants.json')))if(before[normal]?.length)before[id]=before[normal];
exports.passives=(id,fallback)=>before[id]||fallback;
before.lapras=['liquidvoice'];
before.yanmega=['levitate'];
for(const[id,p]of Object.entries(require('./gmax-approved.json').passives))before[id]=[p];
exports.effects=(id,original)=>{const removed={parentalbond:['friendguard'],ironwill:['secondwind'],calderacore:['sheerforce'],razorcurrent:['strongjaw']};const added={moonveil:['friendguard'],gemeye:['magicguard'],mirrorgreed:['opportunist'],cursedmarionette:['frisk'],uncheckedassault:['limber']};return [...new Set([...original.filter(p=>!removed[id]?.includes(p)),...(added[id]||[])])].sort();};

const previousEffects=exports.effects;
const approved=require('./selected-simplifications-approved.json');
const baseEffects=require('./ability-search-identities.json');
function selected(id,original,seen=new Set()) {
 if(seen.has(id))return [];seen.add(id);
 const exact=approved.exact[id];
 let effects=exact ? [id,...exact.flatMap(p=>selected(p,baseEffects[p]||[p],new Set(seen)))] : previousEffects(id,original);
 effects=effects.filter(p=>!(approved.removed[id]||[]).includes(p));
 if(id==='uncheckedassault')effects.push('vitalspirit');
 return [...new Set(effects)].sort();
}
exports.effects=(id,original)=>selected(id,id==='grapplingclaws'?[...original,'toughclaws']:original);

const priorAuditEffects=exports.effects;
exports.effects=(id,original)=>priorAuditEffects(id,original).filter(p=>id!=='astralwatcher'||p!=='defragment');

const priorBaitedEffects=exports.effects;
exports.effects=(id,original)=>id==='baitedbloom'?[...new Set([...priorBaitedEffects(id,original),'regenerator'])].sort():priorBaitedEffects(id,original);

Object.assign(before,require('./shortlist-approved.json').passives);
const priorSignatureEffects=exports.effects;
exports.effects=(id,original)=>id==='burningrage'?[...new Set([...priorSignatureEffects(id,original),'moldbreaker'])].sort():priorSignatureEffects(id,original);
const priorWaterBarrageEffects=exports.effects;
exports.effects=(id,original)=>id==='waterbarrage'?[...new Set([...priorWaterBarrageEffects(id,original),'stalwart'])].sort():priorWaterBarrageEffects(id,original);

const priorSovereignEffects=exports.effects;
exports.effects=(id,original)=>{const added={sunsovereign:['intimidate'],stormsovereign:['updraft'],sandsovereign:['mountainbreaker'],frostsovereign:['soundproof']};return [...new Set([...priorSovereignEffects(id,original).filter(p=>id!=='stormsovereign'||p!=='keeneye'),...(added[id]||[])])].sort();};

const priorUltraInstinctEffects=exports.effects;
exports.effects=(id,original)=>id==='burningspirit'?[...new Set([...priorUltraInstinctEffects(id,original).filter(p=>p!=='selfsufficient'),'ultrainstinct','moldbreaker','innerfocus'])].sort():priorUltraInstinctEffects(id,original);

const priorSpinesEffects=exports.effects;
exports.effects=(id,original)=>id==='toxicspines'?[...new Set([...priorSpinesEffects(id,original),'ironbarbs'])].sort():priorSpinesEffects(id,original);

const beforeFinalApprovedEffects=exports.effects;
exports.effects=(id,original)=>{const added={heatcoil:['longreach','keeneye','superluck'],empress:['longreach','keeneye','superluck'],inversion:['infiltrator'],ironmountain:['hypercutter']};return [...new Set([...beforeFinalApprovedEffects(id,original),...(added[id]||[])])].sort();};

// Latest approved Kingambit passive split, Knight entry healing and 30% timing power.
before.kingambit=['supremeoverlord'];
const priorKingKnightEffects=exports.effects;
exports.effects=(id,original)=>id==='conquerorswill'?['conquerorswill','unnerve']:id==='knightsguard'?[...new Set([...priorKingKnightEffects(id,original),'swornduty'])].sort():priorKingKnightEffects(id,original);
exports.description=(id,key,text)=>{
 if((id==='ultrainstinct'||id==='burningspirit')&&key==='desc')return text.replace('Attacks have 1.5x power against an opposing target','Attacks have 1.3x power against an opposing target');
 if(id==='ultrainstinct'&&key==='shortDesc')return text.replace('; timing power,','; 30% timing power,');
 if(id==='knightsguard')return key==='shortDesc'?'Entry heals adjacent allies 1/4 HP (1/3 Fairy Tale); once per entry intercepts an ally attack, takes 25% less and gains +1 Atk if hit.':'On entry, heals each adjacent ally by 1/4 max HP, or 1/3 on Fairy Tale. '+text;
 if(id==='conquerorswill'&&key==='desc')return "Full local Unnerve prevents opposing Pokemon from eating Berries or using field Seeds. On Cold Eclipse entry, lowers each foe's Speed one stage unless behind Substitute. Kowtow Cleave removes opposing Reflect, Light Screen and Aurora Veil before damage, even through Substitute; protection, a miss or immunity prevents removal. Suppression disables these active effects. Supreme Overlord is Kingambit's separate species passive.";
 return text;
};

// Approved Desert Spirit replacement: Overcoat replaces Tinted Lens.
const priorDesertEffects=exports.effects;
exports.effects=(id,original)=>id==='desertspirit'?['desertspirit','levitate','overcoat','sandstream']:priorDesertEffects(id,original);
const priorDesertDescription=exports.description;
exports.description=(id,key,text)=>id==='desertspirit'&&key==='desc'?'On entry, summons sandstorm for 5 turns, or 8 with Smooth Rock. Immune to powder effects and sandstorm/hail damage. Ground-type attacks receive STAB. Levitate provides normal airborne protection unless supplied separately by the species passive.':priorDesertDescription(id,key,text);

const beforeGreninjaCounterplay = exports.effects;
exports.effects = (id, original) => beforeGreninjaCounterplay(id, original).filter(part => !(['shadowbond', 'shadowcurrent'].includes(id) && part === 'moldbreaker'));

// Starter G-Max forms retain their normal family passive.
Object.assign(before, {"charizardgmax":["blaze"],"cinderacegmax":["blaze"],"venusaurgmax":["overgrow"],"rillaboomgmax":["overgrow"],"blastoisegmax":["torrent"],"feraligatrgmax":["torrent"],"inteleongmax":["torrent"]});

// Approved Mudsdale rework and Rhydon passive swap.
Object.assign(before, {mudsdale:['stamina'],rhydon:['powerdrill']});
const beforeMudsdaleEffects=exports.effects;
exports.effects=(id,original)=>id==='unyielding'?['innerfocus','unyielding']:id==='surefoot'?['surefoot']:beforeMudsdaleEffects(id,original);

// Reconcile the already-approved Archaludon/Rail Sight swap.
before.archaludon=['stalwart'];
const beforeRailSightEffects=exports.effects;
exports.effects=(id,original)=>id==='railsight'?['innerfocus','railsight']:beforeRailSightEffects(id,original);

// Reviewed October support reworks and passive swaps; static expectations.
const october = require('./october-support-approved.json');
Object.assign(before, {gyarados:['unbridledwrath'],golisopod:['toughclaws'],corviknight:['mirrorarmor'],dragonitemega:['multiscale'],honchkrow:['stakeout'],beartic:['thickfat'],overqwil:['aftermath']});
const beforeOctoberEffects=exports.effects, beforeOctoberDescription=exports.description;
exports.effects=(id,original)=>october.effects[id] || beforeOctoberEffects(id,original);
exports.description=(id,key,text)=>october.descriptions[id]?.[key] ?? beforeOctoberDescription(id,key,text);

// Explicit reviewed migrations; evidence is recorded with each static fixture group.
const finish=require('./starter-finish-reviewed.json');
Object.assign(before,finish.passives);
const priorFinishEffects=exports.effects,priorFinishDescription=exports.description;
exports.effects=(id,original)=>finish.effects[id]||priorFinishEffects(id,original);
exports.description=(id,key,text)=>finish.descriptions[id]?.[key]??priorFinishDescription(id,key,text);
exports.abilities=(id,fallback)=>({...fallback,...finish.slots[id]});

const beforeConciseDescription=exports.description;exports.description=(id,key,fallback)=>require('./concise-approved-descriptions.json')[global.Dex?.abilities.get(id).id || id]?.[key]??beforeConciseDescription(id,key,fallback);
const beforeNewCorrosion=exports.effects;exports.effects=(id,fallback)=>({venomspurs:['corrosion','venomspurs'],reinflate:['punkrock','reinflate'],deepchill:['deepchill','intimidate','oblivious'],accumulation:['accumulation','thickfat']})[id]||beforeNewCorrosion(id,fallback);

const beforeBulwarkEffects=exports.effects,beforeBulwarkDescription=exports.description;
exports.effects=(id,original)=>id==='noseformation'?['elevate','levitate','noseformation']:beforeBulwarkEffects(id,original);
exports.description=(id,key,text)=>require('./probopass-bulwark-descriptions.json')[id]?.[key] ?? beforeBulwarkDescription(id,key,text);

const beforeQuarterHPDescription=exports.description;
exports.description=(id,key,text)=>require('./quarter-hp-priority-descriptions.json')[id]?.[key] ?? beforeQuarterHPDescription(id,key,text);

const priorLoreDescription=exports.description,priorLoreEffects=exports.effects,priorLoreAbilities=exports.abilities;
exports.description=(id,key,text)=>require('./lore-entry-descriptions.json')[id]?.[key] ?? priorLoreDescription(id,key,text);
exports.effects=(id,original)=>({blademastery:['blademastery','sharpness'],imperialprincess:['imperialprincess','striker','vitalspirit'],ange:['ange','fairyaura'],lastingpromise:['lastingpromise','friendguard'],desertvigil:['desertvigil','overcoat'],ragingcurrent:['damp','dryskin','ragingcurrent','stamina','swiftswim']})[id] || priorLoreEffects(id,original);
Object.assign(before,{floetteeternal:['eternalflower'],floettemega:['eternalflower'],cacturne:['scarecrow']});
exports.abilities=(id,fallback)=>id==='floetteeternal'?{...priorLoreAbilities(id,fallback),H:'Lasting Promise'}:id==='cacturne'?{...priorLoreAbilities(id,fallback),0:'Desert Vigil'}:priorLoreAbilities(id,fallback);

const beforeAnnihilapeEffects=exports.effects,beforeAnnihilapeAbilities=exports.abilities;
exports.effects=(id,original)=>id==='beyondfear'?['beyondfear']:id==='unboundspirit'?['unboundspirit','vitalspirit']:id==='ragingheart'?['ragingheart']:beforeAnnihilapeEffects(id,original);
before.annihilape=['beyondfear'];
exports.abilities=(id,fallback)=>id==='annihilape'?{0:'Unbound Spirit',1:'Raging Heart',H:'Defiant'}:beforeAnnihilapeAbilities(id,fallback);

// Approved Talonflame selected ability/passive swap.
before.talonflame=['galewings'];
const beforeTalonflameAbilities=exports.abilities;
exports.abilities=(id,fallback)=>id==='talonflame'?{...beforeTalonflameAbilities(id,fallback),H:'Flame Body'}:beforeTalonflameAbilities(id,fallback);

Object.assign(before, require('./guard-passives-approved.json'));
const beforeGuardDescription=exports.description;
exports.description=(id,key,text)=>require('./guard-passive-descriptions.json')[id]?.[key] ?? beforeGuardDescription(id,key,text);

before.excadrillmega=['piercingdrill'];

// Explicitly approved ability and passive replacements.
Object.assign(before,{donphan:['battlearmor'],scolipedemega:['merciless'],scolipedemegaazzy:['merciless']});
const beforeReworkDescription=exports.description;
exports.description=(id,key,text)=>require('./approved-ability-reworks-descriptions.json')[id]?.[key] ?? beforeReworkDescription(id,key,text);
const beforeReworkEffects=exports.effects;
const reworkEffects={trailbreaker:['moldbreaker','siegetusks'],armoredadvance:['rockhead','rollingfortress'],hyperdrill:['hyperdrill','powerdrill'],headlongresolve:['headlongresolve','reckless'],scorchsweep:['rockhead','scorchsweep'],keenhunt:['keeneye','keenhunt'],venombastion:['stamina','venombastion']};
exports.effects=(id,original)=>reworkEffects[id] || beforeReworkEffects(id,original);

Object.assign(before,{sandslash:['ironbarbs'],sandslashreborn:['ironbarbs'],sandslashalola:['ironbarbs']});
const beforeClawDesc=exports.description;
exports.description=(id,key,text)=>require('./sandslash-rework-descriptions.json')[id]?.[key] ?? beforeClawDesc(id,key,text);
const beforeClawEffects=exports.effects;
exports.effects=(id,original)=>({bedrockclaw:['duneclaws','toughclaws'],rimeclaw:['glacierclaws','toughclaws'],dunerunner:['sandrush'],frostrunner:['slushrush']})[id]||beforeClawEffects(id,original);

const ec=require('./eeveelution-cloyster.json'),beforeECDesc=exports.description,beforeECEffects=exports.effects;
Object.assign(before,Object.fromEntries(Object.entries(ec.EeveeCloysterPassives).map(([id,p])=>[id,[p]])));
exports.description=(id,key,text)=>ec.EeveeCloysterDescriptions[id]?.[key]??beforeECDesc(id,key,text);
exports.effects=(id,original)=>ec.EeveeCloysterComponents[id]?[id,...ec.EeveeCloysterComponents[id]].sort():beforeECEffects(id,original);

const sda=require('./stance-disguise-aggron.json'),beforeSDADesc=exports.description,beforeSDAEffects=exports.effects;Object.assign(before,Object.fromEntries(Object.entries(sda.StanceDisguisePassives).map(([id,p])=>[id,[p]])));exports.description=(id,key,text)=>sda.StanceDisguiseDescriptions[id]?.[key]??beforeSDADesc(id,key,text);exports.effects=(id,original)=>({ironmountain:['hypercutter','ironmountain','suctioncups'],disguise:['disguise'],stancechange:['stancechange']})[id]||beforeSDAEffects(id,original);

before.hydreigon=['hydraflight'];

const beforeSolarCompact=exports.description;exports.description=(id,key,text)=>id==='solarmimicry'?'Bug STAB and resistances. Always treated as sunny. Solar Blade lowers Speed by 1.':beforeSolarCompact(id,key,text);

for(const id of ['meloetta','meloettapirouette','meloettaencore'])before[id]=['serenegrace'];

const beforeProseAuditDescription=exports.description;
const proseAudit=require('./ability-prose-audit.json');
exports.description=(id,key,original)=>proseAudit[id]?.[key]??beforeProseAuditDescription(id,key,original);

for(const id of ['mewtwo','mewtwomegax','mewtwomegay'])before[id]=['absolutepressure'];

Object.assign(before,{zapdos:['springpressure'],moltres:['summerpressure'],articuno:['winterpressure'],jirachi:['serenegrace'],jirachimega:['serenegrace']});

for(const id of ['regirock','regice','registeel','regieleki','regidrago'])before[id]=['selfrepair'];before.regigigas=['slowstart','ancientassembly'];

const beforeReviewedTranche=exports.description;const reviewedTranche=require('./reviewed-description-tranche.json');exports.description=(id,key,text)=>reviewedTranche[id]?.[key]??(id==='dreamsickness'?require('./legendary-approved.json').JirachiDescriptions.dreamsickness[key]:undefined)??beforeReviewedTranche(id,key,text);

const beforeShortAudit=exports.description;const shortAudit=require('./short-description-audit.json');exports.description=(id,key,text)=>key==='shortDesc'&&shortAudit.ShortDescriptionAudit[id]?shortAudit.ShortDescriptionAudit[id]:(['asoneglastrier','asonespectrier'].includes(id)&&key==='desc'?shortAudit.ShortDescriptionAudit[id]:beforeShortAudit(id,key,text));

// Renamed aliases use the reviewed canonical description.
const beforeReviewedAliasDescription=exports.description;
exports.description=(id,key,text)=>beforeReviewedAliasDescription(({bedrockclaw:"duneclaws",rimeclaw:"glacierclaws"})[id]||id,key,text);

const beforeRipenSeedsDescription=exports.description;exports.description=(id,key,text)=>require('./ripen-seeds.json')[id]?.[key]??beforeRipenSeedsDescription(id,key,text);

before.regigigasprimordial=['primordialconstruct','ancientassembly'];
