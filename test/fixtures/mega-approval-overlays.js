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
