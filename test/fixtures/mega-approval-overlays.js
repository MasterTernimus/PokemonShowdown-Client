const before=Object.fromEntries(require('./mega-approved-before.json').map(s=>[s.id,s.passives]));
Object.assign(before,require('./mega-paused-explicit.json'));
for(const[id,p]of Object.entries(require('./mega-approved-choices.json')))before[id]=[p];
for(const[id,normal]of Object.entries(require('./mega-approved-variants.json')))if(before[normal]?.length)before[id]=before[normal];
exports.passives=(id,fallback)=>before[id]||fallback;
before.lapras=['liquidvoice'];
before.yanmega=['levitate'];
for(const[id,p]of Object.entries(require('./gmax-approved.json').passives))before[id]=[p];
exports.effects=(id,original)=>{const removed={moonveil:['friendguard'],parentalbond:['friendguard'],ironwill:['secondwind'],calderacore:['sheerforce'],razorcurrent:['strongjaw']};const added={gemeye:['magicguard'],mirrorgreed:['opportunist'],cursedmarionette:['frisk'],uncheckedassault:['limber']};return [...new Set([...original.filter(p=>!removed[id]?.includes(p)),...(added[id]||[])])].sort();};

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
exports.effects=(id,original)=>({blademastery:['blademastery','sharpness'],imperialprincess:['imperialprincess','striker','vitalspirit'],ange:['ange','fairyaura'],lastingpromise:['lastingpromise','friendguard'],desertvigil:['desertvigil','overcoat'],ragingcurrent:['dryskin','ragingcurrent','stamina','swiftswim']})[id] || priorLoreEffects(id,original);
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

// 2026-10-18 approved removal: Toxic Armor no longer inherits Venom Armor/Battle Armor.
const beforeToxicArmorNerfEffects=exports.effects;exports.effects=(id,expected)=>id==='toxicarmor'?['dualwield','toxicarmor','violentrush']:beforeToxicArmorNerfEffects(id,expected);

// Approved Fang/Metal Claw signature removal and inherited Battle Bond Filter removal.
const beforeRivalNerfEffects=exports.effects;
exports.effects=(id,original)=>beforeRivalNerfEffects(id,original).filter(p=>!(['battlebond','shadowbond','apexbond','sacredbond'].includes(id)&&p==='filter'));
const beforeRivalNerfDescription=exports.description;
const rivalNerfDescriptions=require('./rival-signature-nerf-descriptions.json');
exports.description=(id,key,fallback)=>rivalNerfDescriptions[id]?.[key]??beforeRivalNerfDescription(id,key,fallback);

const beforeDualSixtyDescription=exports.description;
const dualSixtyDescriptions=require('./dual-wield-sixty-descriptions.json');
exports.description=(id,key,fallback)=>dualSixtyDescriptions[id]?.[key]??beforeDualSixtyDescription(id,key,fallback);

before.gyaradosmega=['tempestfury']; // Approved once-per-battle Mega passive; base active version unchanged.

before.dudunsparce=['powerdrill'];before.dudunsparcethreesegment=['powerdrill'];
const beforeDrillBatchAbilities=exports.abilities;exports.abilities=(id,original)=>{const slots=beforeDrillBatchAbilities(id,original);return id==='fearow'?{...slots,0:'Power Drill'}:id==='beedrill'?{...slots,1:'Twin Drills'}:id==='rapidash'?{...slots,H:'Power Drill'}:slots;};

// Approved protection damage wording; no component identities change.
{const prior=exports.description;exports.description=function(id,key,value){const text=prior(id,key,value);return text.replaceAll('Contact moves bypass protection except Max Guard.','Contact moves pierce protection at 1/4 damage (75% less); Max Guard blocks them. Unprotected damage is unchanged.').replaceAll('Contact bypasses protection;','Contact pierces protection at 1/4 damage;').replaceAll('Unseen Fist lets contact moves bypass protection except Max Guard.','Unseen Fist lets contact moves pierce protection at 1/4 damage; Max Guard blocks them.').replaceAll('contact moves bypass Protect,','contact moves pierce Protect at 1/4 damage,').replaceAll('Contact moves pierce protection at 1/4 damage. Unprotected targets take normal damage.','Contact moves pierce protection at 1/4 damage (75% less). Max Guard blocks them. Unprotected damage is unchanged.');};}

// Approved audit reductions supersede older component snapshots.
const cleanup = require('./audit-cleanup-approved.json');
const beforeCleanupDescription=exports.description, beforeCleanupEffects=exports.effects;
exports.description=(id,key,text)=>cleanup.descriptions[id]?.[key]??beforeCleanupDescription(id,key,text);
function cleanupEffects(id, seen=new Set()) {if(seen.has(id))return seen;seen.add(id);if(id==='ancientbloom')cleanupEffects('pollenbloom',seen);if(id==='witheringshell'){seen.add('naturalrecovery');seen.add('naturalcure');} // Generic non-native cure callbacks are preserved; native Natural Cure remains passive.
for(const part of cleanup.components[id]||({unboundblaze:['dragonize','magmaarmor'],pollenbloom:['thickfat','unaware'],selfrepair:['naturalcure','selfsufficient']}[id])||[])cleanupEffects(part,seen);return seen;}
exports.effects=(id,original)=>cleanup.components[id]?[...cleanupEffects(id)].sort():beforeCleanupEffects(id,original);
const beforeFilterAbilities=exports.abilities;exports.abilities=(id,original)=>id==='probopass'?{...beforeFilterAbilities(id,original),H:'Filter'}:beforeFilterAbilities(id,original);

const beforeOrdinarySlots=exports.abilities;exports.abilities=(id,original)=>({...beforeOrdinarySlots(id,original),...{ferrothorn:{H:'Stamina'},seismitoad:{H:'Water Absorb'},klefki:{0:'Prankster'}}[id]});

// October 19 review: current slots, separate passives and retained effects.
const oct19=require('./oct19-reviewed-contracts.json');
const beforeOct19={passives:exports.passives,abilities:exports.abilities,effects:exports.effects,description:exports.description};
exports.passives=(id,fallback)=>oct19.passives[id]||beforeOct19.passives(id,fallback);
exports.abilities=(id,fallback)=>({...beforeOct19.abilities(id,fallback),...oct19.abilities[id]});
exports.effects=(id,fallback)=>oct19.effects[id]||beforeOct19.effects(id,fallback);
exports.description=(id,key,fallback)=>oct19.descriptions[id]?.[key]??beforeOct19.description(id,key,fallback);

// Latest explicitly approved delegated kits supersede the earlier snapshots.
{const prior={abilities:exports.abilities,passives:exports.passives,effects:exports.effects,description:exports.description};
exports.abilities=(id,fallback)=>id.startsWith('alcremie')&&!id.includes('gmax')?{0:'Soothing Cream',1:'Sticky Hold',H:'Master Pâtissier'}:id.startsWith('minior')?{0:'Light Metal',1:'Self Repair',H:'Brute Force'}:id==='hariyama'?{0:'Grit Grappler',1:'Sheer Force',H:'Stamina'}:prior.abilities(id,fallback);
exports.passives=(id,fallback)=>id.startsWith('minior')?['shieldsdown']:id==='hariyama'?['thickfat']:prior.passives(id,fallback);
exports.effects=(id,fallback)=>id==='ironvise'?['decoypincers','ironvise','toughclaws']:prior.effects(id,fallback);
exports.description=(id,key,fallback)=>id==='ironvise'?({shortDesc:'Tough Claws + Decoy Pincers.',desc:"Contact moves have 1.3x power. Once per switch-in, the first opposing direct hit deals 25% less damage and lowers the attacker's Attack by 1 stage. Multi-hit moves spend this protection on the first hit. Intimidate is supplied separately by Mega Scizor's passive."})[key]:prior.description(id,key,fallback);
}

{const prior={passives:exports.passives,effects:exports.effects,description:exports.description};exports.passives=(id,f)=>id==='golisopodmega'?['toughclaws']:prior.passives(id,f);exports.effects=(id,f)=>id==='aquashell'?['aquashell','heatproof','steadfast']:prior.effects(id,f);exports.description=(id,key,f)=>id==='aquashell'?({shortDesc:'Heatproof + Steadfast.',desc:'Full local Heatproof and Steadfast. Incoming Fire attacks use half the attacker’s Attack or Special Attack; burn damage is halved. Flinching raises Speed by one stage but still prevents acting. Electric Terrain entry raises Speed by one stage. Ashen Beach accuracy checks succeed unless the target has Unnerve; Rocky Terrain adds no flinch damage. Tough Claws is a separate species passive. No Water Veil, Inner Focus or Attack-drop protection.'})[key]:prior.description(id,key,f);}

{const prior={effects:exports.effects,description:exports.description};exports.effects=(id,f)=>id==='shieldsdown'?['crumblingshell','shieldsdown']:prior.effects(id,f);exports.description=(id,key,f)=>id==='shieldsdown'?({shortDesc:'HP-based form change; Meteor blocks status. Crumbling Shell.',desc:'Minior changes to Meteor above half HP and its original core at half HP or below, on entry and at turn end. Meteor form blocks major status and Yawn. Retains Crumbling Shell: physical hits place Stealth Rock on the attacker’s side (opposing side for allied hits), except on Water Surface, Underwater, Murkwater Surface or Swamp. No Shell Armor or Self Repair effects.'})[key]:prior.description(id,key,f);}

{const prior=exports.description;exports.description=(id,key,f)=>{const text=prior(id,key,f);if(id!=='stormsovereign')return text;if(key==='shortDesc')return 'Updraft (Competitive), eight-turn Strong Winds and opposing Flying chip.';return text.replace('Summons replaceable Strong Winds for 8 turns on entry. ', 'Summons replaceable Strong Winds for 8 turns on entry. Each turn, non-immune foes take Flying damage equal to 1/16 base maximum HP; type effectiveness scales this chip only in Free-for-All. Flying-type foes are immune. ');};}

// Approved Primeval Hunt replacement: full Skill Link and Steadfast.
{const prior={effects:exports.effects,description:exports.description};const d={"shortDesc":"Skill Link + Steadfast.","desc":"Multi-hit moves use their maximum hit count, gain 1.5x power and check accuracy once. Flinching raises Speed by one stage but still prevents acting. Electric Terrain entry raises Speed by one stage. Ashen Beach accuracy checks succeed unless the target has Unnerve; Rocky Terrain adds no flinch damage. No confusion immunity, Intimidate protection or guaranteed final-hit critical hit."};exports.effects=(id,f)=>id==='primevalhunt'?['primevalhunt','skilllink','steadfast']:prior.effects(id,f);exports.description=(id,k,f)=>id==='primevalhunt'?d[k]:prior.description(id,k,f);}

// Approved current-effects prose cleanup, independently snapshotted for parity.
{const prior=exports.description;const cleaned=require('./current-ability-description-cleanup.json');exports.description=(id,key,f)=>cleaned[id]?.[key] ?? prior(id,key,f);}

{const prior=exports.passives;exports.passives=(id,f)=>id==='garchomp'?['serratedscales']:prior(id,f);}

// Approved Ribombee selectable/passive veil swap.
before.ribombee=['sweetveil'];

// Explicit Toxic Sink simplification and Bombardment Overcoat addition.
const beforeToxicSinkEffects=exports.effects;exports.effects=(id,original)=>{let values=beforeToxicSinkEffects(id,original);if(id==='toxicsink')values=values.filter(x=>!['effectspore','invigorate','stormdrain'].includes(x));if(id==='toxicbloom')values=[...values.filter(x=>x!=='effectspore'),'toxicsink'];if(id==='siegelauncher')values=[...values,'overcoat'];return [...new Set(values)].sort();};

const beforeVileplumePassive=exports.passives;exports.passives=(id,original)=>id==='vileplume'?['effectspore']:beforeVileplumePassive(id,original);

// Approved per-opponent and repeat-entry sensing descriptions.
{const prior=exports.description;const warnings=require('./warning-entry-descriptions');exports.description=(id,key,fallback)=>warnings[id]?.[key] ?? prior(id,key,fallback);}

// Klefki's approved Prankster passive and replacement selectable ability.
{const prior={passives:exports.passives,description:exports.description};
exports.passives=(id,fallback)=>id==='klefki'?['prankster']:prior.passives(id,fallback);
exports.description=(id,key,fallback)=>id==='vaultkeeper'&&key==='desc'?'Compatibility name for local Prankster: status moves gain +1 priority; opposing Dark types block them except on Bewitched Woods. Does not prevent screen removal. Klefki receives Prankster as its species passive; this compatibility name has the same priority effect.':prior.description(id,key,fallback);
}

// Approved Living Legend reduction and Vanguard display wording.
{const prior=exports.description;const text={"livinglegend":{"shortDesc":"Flash Fire + Download; stronger Extreme Speed.","desc":"Flash Fire + Download. Extreme Speed has 1.5x power and +2 critical-hit stages."},"vanguard":{"shortDesc":"Enhanced Extreme Speed; single-foe protection.","desc":"On entry, lowers adjacent foes' Attack by 1. Substitute and Intimidate protections still apply. Extreme Speed has 1.5x power and becomes Fire when its matchup is better, including against Normal immunity. Direct single-target opposing HP damage grants one 50% guard against the next damaging hit from that opponent that turn."}};exports.description=(id,key,fallback)=>text[id]?.[key]??prior(id,key,fallback);}

// Approved Living Legend removal supersedes pre-display search snapshots.
{const prior=exports.effects;exports.effects=(id,fallback)=>id==='livinglegend'?['download','flashfire','livinglegend']:prior(id,fallback);}

{const prior={abilities:exports.abilities,passives:exports.passives};
exports.abilities=(id,f)=>({...prior.abilities(id,f),...({crabominable:{H:'Controlled Fury'},primeape:{1:'Controlled Fury'}}[id]||{})});
exports.passives=(id,f)=>['krookodile','annihilape'].includes(id)?['controlledfury']:prior.passives(id,f);}

{const prior={effects:exports.effects,description:exports.description};const d={"controlledfury":{"shortDesc":"Anger Point; no rampage lock or ending confusion.","desc":"Full local Anger Point: the first damaging hit after entry raises Attack by 1 stage; surviving a critical hit raises Attack to maximum. Outrage, Thrash, Petal Dance and Raging Fury do not lock the user in or cause ending confusion, including repeated manual uses. Acquiring this effect during a rampage clears only that rampage lock without confusion. Existing confusion, Choice locks, Encore and move field effects remain unchanged."},"ragingheart":{"shortDesc":"Inner Focus; selected Thrash becomes Ghost with no ending confusion.","desc":"Full local Inner Focus prevents flinching and Intimidate Attack drops, subject to normal suppression and ability bypass. Directly selected Thrash becomes Ghost type, retaining its physical category, 140 power, chosen adjacent opposing target and 30% Defense-drop chance, with no extra power multiplier. Without separate Controlled Fury it retains its 2-3-turn rampage lock but does not cause its own ending confusion while Raging Heart is active. External confusion remains. Annihilape supplies Controlled Fury separately as its species passive."}};exports.effects=(id,f)=>id==='controlledfury'?['angerpoint','controlledfury']:id==='ragingheart'?['innerfocus','ragingheart']:prior.effects(id,f);exports.description=(id,key,f)=>d[id]?.[key]??prior.description(id,key,f);}

{const prior=exports.description;exports.description=(id,key,f)=>id==='beyondfear'&&key==='desc'?'Immune to flinching and opposing Taunt. Does not prevent Intimidate or other stat drops and does not raise defenses in response. When supplied as a species passive, remains active through selected-ability suppression.':prior(id,key,f);}

// Approved Slow Clamp component replacement: full Own Tempo replaces Sweet Veil.
{const prior={effects:exports.effects,description:exports.description};const approved=require('./slow-clamp-approved.json');exports.effects=(id,f)=>id==='slowclamp'?approved.effects:prior.effects(id,f);exports.description=(id,key,f)=>id==='slowclamp'?approved[key]:prior.description(id,key,f);}

// Explicit user-approved follow-up. Static intent expectations, independent of generated outputs.
{const prior={effects:exports.effects,description:exports.description,passives:exports.passives,abilities:exports.abilities};
const followup=require('./audit-followup-approved-metadata.json');
exports.effects=(id,fallback)=>followup.effects[id]??prior.effects(id,fallback);
exports.description=(id,key,fallback)=>followup.descriptions[id]?.[key]??prior.description(id,key,fallback);
exports.passives=(id,fallback)=>followup.passives[id]??prior.passives(id,fallback);
exports.abilities=(id,fallback)=>followup.abilities[id]??prior.abilities(id,fallback);
}

// Approved Fire-only Mane and Heatproof/Frisk replacement: explicit static intent.
{const prior={effects:exports.effects,description:exports.description};
const effects={blazingmane:['blazingmane','firemane'],aquashell:['aquashell','frisk','heatproof']};
const descriptions={
firemane:{desc:'Damaging moves with effective Fire typing have 1.5x power, whether or not they receive STAB. Non-Fire STAB moves and status moves are not boosted.',shortDesc:'Damaging Fire moves have 1.5x power.'},
blazingmane:{desc:'Full local Fire Mane: damaging moves with effective Fire typing have 1.5x power, whether or not they receive STAB. At 1/4 max HP or less, damaging Fire moves gain +1 priority. No Proficient, extra hits or field-triggered Speed boosts.',shortDesc:'Fire Mane; damaging Fire moves gain +1 priority at 1/4 HP or less.'},
aquashell:{desc:'Full local Heatproof and Frisk. Incoming Fire attacks use half the attacker’s Attack or Special Attack; burn damage is halved. On activation, reveals opposing active Illusions and held items; each opposing item holder independently has a 30% chance of five-turn Embargo. Tough Claws is supplied separately by the species passive.',shortDesc:'Heatproof + Frisk.'}};
exports.effects=(id,f)=>effects[id]??prior.effects(id,f);exports.description=(id,key,f)=>descriptions[id]?.[key]??prior.description(id,key,f);}

// Approved owner-selectable first disguise and opposing Mind’s Eye revelation.
{const prior=exports.description;const text={"illusion":{"desc":"Disguises itself as a teammate without copying mechanical traits. The optional Initial Disguise teammate is used on the holder’s first entry only; if unavailable, normal automatic selection applies. Auto and later entries use the last eligible healthy teammate in battle order. Direct damaging hits and normal reveal effects, including opposing Mind’s Eye, break the disguise. Types, STAB, abilities and passives are not copied.","shortDesc":"Teammate disguise only; optional initial teammate, then Auto."},"perfectillusion":{"desc":"Advanced disguise copies its teammate’s STAB types, eligible selected ability and species passives until revealed. The optional Initial Disguise teammate is used on the holder’s first entry only; if unavailable, normal automatic selection applies. Auto uses the last healthy teammate on first entry, then the best threat-scored healthy teammate when possible. Blacklisted form and copying abilities are not copied. Mirror Arena entry grants +1 evasion; Chessboard grants 1.2x move power while disguised; Cold Eclipse prevents hail damage. Direct damage and reveal effects, including opposing Mind’s Eye, remove the disguise and copied traits. This is distinct from the ordinary Illusion species passive.","shortDesc":"Advanced teammate disguise copies STAB, eligible ability and passives until revealed."},"mindseye":{"desc":"Has Self Sufficient. Normal and Fighting moves can hit Ghost types; gains Fairy and Dark STAB, ignores target evasion boosts, and prevents external accuracy drops. Heals 1/16 maximum HP after its damaging moves hit. No ordinary damage reduction. On Cold Eclipse, retains 30% damage reduction, 1/8 hit healing and 1.3x damaging move power. Reveals opposing Illusion and Perfect Illusion on activation and after each opposing entry; does not reveal allies. Suppression disables the selected ability’s reveal effects.","shortDesc":"Self Sufficient; Normal/Fighting hit Ghost; Fairy/Dark STAB; accuracy protection; hit healing. Reveals opposing disguises."}};exports.description=(id,key,f)=>text[id]?.[key]??prior(id,key,f);}

// Approved removal of Scrafty's Shed Skin recovery penalty, with all other effects retained.
{const prior=exports.description;exports.description=(id,key,f)=>{const value=prior(id,key,f);return ['shedskin','streettyrant'].includes(id)?value.replace(" On Scrafty with Shed Skin or Street Tyrant, recovery is 1/8 max HP in both ordinary conditions and Dragon's Den; other users and composites retain 1/4.",'').replace(' Scrafty heals 1/8.','').replace(' Mega Scrafty heals 1/8.',''):value;};}

{const prior=exports.description;exports.description=(id,key,f)=>id==='streettyrant'&&key==='desc'?"On entry, lowers adjacent foes' Attack by 1 with normal Substitute and Intimidate protections. Moves ignore bypassable opposing abilities. Shed Skin is supplied separately by the species passive, including its shared 1/4 max HP recovery.":prior(id,key,f);}

// Latest approved packages: explicit expected metadata, independent of generated client assets.
{const latest=require('./latest-local-approved.json'),prior={description:exports.description,effects:exports.effects,passives:exports.passives};exports.description=(id,key,f)=>latest.descriptions[id]?.[key]??prior.description(id,key,f);exports.effects=(id,f)=>latest.effects[id]??prior.effects(id,f);exports.passives=(id,f)=>latest.passives[id]??prior.passives(id,f);}

{const prior=exports.abilities;exports.abilities=(id,f)=>id==='lucario'?{0:'Carry On',1:'Sworn Duty',H:'Armorize'}:id==='mamoswine'?{0:'Forsaken Sleeper',1:'Old North',H:'Glacial Prime'}:prior(id,f);}

// Retired IDs remain inert lookup placeholders, never composite search matches.
{const prior=exports.effects;const retired=new Set(['voltagevolley','soaringspirit','backwash','plasmaeruption','soultag']);exports.effects=(id,f)=>retired.has(id)?[id]:prior(id,f);}

// Shellcracker retains the explicitly added Mold Breaker component.
{const prior=exports.effects;exports.effects=(id,f)=>id==='shellcracker'?['moldbreaker','shellcracker']:prior(id,f);}
