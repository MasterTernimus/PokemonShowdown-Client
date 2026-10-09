const before=Object.fromEntries(require('./mega-approved-before.json').map(s=>[s.id,s.passives]));
Object.assign(before,require('./mega-paused-explicit.json'));
for(const[id,p]of Object.entries(require('./mega-approved-choices.json')))before[id]=[p];
for(const[id,normal]of Object.entries(require('./mega-approved-variants.json')))if(before[normal]?.length)before[id]=before[normal];
exports.passives=(id,fallback)=>before[id]||fallback;
for(const[id,p]of Object.entries(require('./gmax-approved.json').passives))before[id]=[p];
exports.effects=(id,original)=>{const removed={parentalbond:['friendguard'],ironwill:['secondwind'],calderacore:['sheerforce'],razorcurrent:['strongjaw']};const added={cursedmarionette:['frisk'],uncheckedassault:['limber']};return [...new Set([...original.filter(p=>!removed[id]?.includes(p)),...(added[id]||[])])].sort();};

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
exports.effects=(id,original)=>selected(id,original);
