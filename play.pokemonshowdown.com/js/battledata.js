/**
 * Pokemon Showdown Dex
 *
 * Roughly equivalent to sim/dex.js in a Pokemon Showdown server, but
 * designed for use in browsers rather than in Node.
 *
 * This is a generic utility library for Pokemon Showdown code: any
 * code shared between the replay viewer and the client usually ends up
 * here.
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * Compiled into battledata.js which includes all dependencies
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */




if(typeof window==='undefined'){

global.window=global;
}else{

window.exports=window;
}


window.nodewebkit=!!(typeof process!=='undefined'&&process.versions&&process.versions['node-webkit']);

function toID(text){var _text,_text2;
if((_text=text)!=null&&_text.id){
text=text.id;
}else if((_text2=text)!=null&&_text2.userid){
text=text.userid;
}
if(typeof text!=='string'&&typeof text!=='number')return'';
return(''+text).toLowerCase().replace(/[^a-z0-9]+/g,'');
}

function toUserid(text){
return toID(text);
}

var CUSTOM_SPECIES={
hypno:{
base:'hypno',
data:{
name:'Hypno',
types:['Psychic','Dark'],
abilities:{0:'No Guard',1:'Neutralizing Gas',H:'Neutralization'},
baseStats:{hp:90,atk:70,def:105,spa:80,spd:110,spe:45},
bst:500,
isNonstandard:'Custom'
}
},
flygonmegaz:{
base:'flygon',
data:{
name:'Flygon-Mega-Z',
baseSpecies:'Flygon',
forme:'Mega-Z',
requiredItem:'Leaf Stone',
battleOnly:'Flygon',
changesFrom:'Flygon',
isNonstandard:'Custom'
}
},
garchompbattlebond:{
base:'garchomp',
data:{
name:'Garchomp-Battle-Bond',
baseSpecies:'Garchomp',
forme:'Battle-Bond',
isNonstandard:'Custom'
}
},
butterfreemega:{
base:'butterfree',
data:{
name:'Butterfree-Mega',
baseSpecies:'Butterfree',
forme:'Mega',
battleOnly:'Butterfree',
changesFrom:'Butterfree',
isNonstandard:'Custom'
}
},
serperiormega:{
base:'serperior',
data:{
name:'Serperior-Mega',
baseSpecies:'Serperior',
forme:'Mega',
battleOnly:'Serperior',
changesFrom:'Serperior',
isNonstandard:'Custom'
}
},
mismagiusmega:{
base:'mismagius',
data:{
name:'Mismagius-Mega',
baseSpecies:'Mismagius',
forme:'Mega',
battleOnly:'Mismagius',
changesFrom:'Mismagius',
isNonstandard:'Custom'
}
},
alcremiegmax:{
base:'alcremie',
data:{
name:'Alcremie-Gmax',
baseSpecies:'Alcremie',
forme:'Gmax',
isGigantamax:true,
isNonstandard:'Gigantamax'
}
},
gardevoirvoid:{
base:'gardevoir',
data:{
name:'Gardevoir-Void',
baseSpecies:'Gardevoir',
forme:'Void',
otherFormes:['Gardevoir-Void-Mega','Gardevoir-Mega-Z'],
cosmeticFormes:null,
isNonstandard:'Custom'
}
},
gardevoirvoidmega:{
base:'gardevoirmega',
data:{
name:'Gardevoir-Void-Mega',
baseSpecies:'Gardevoir',
forme:'Mega',
requiredItem:'Gardevoirite',
battleOnly:'Gardevoir-Void',
changesFrom:'Gardevoir-Void',
isNonstandard:'Custom'
}
},
gardevoirmegaz:{
base:'gardevoirmega',
data:{
name:'Gardevoir-Mega-Z',
baseSpecies:'Gardevoir',
forme:'Mega-Z',
requiredItem:'Gardevoirite',
battleOnly:'Gardevoir-Void',
changesFrom:'Gardevoir-Void',
isNonstandard:'Custom'
}
},
lucariomegaz:{
base:'lucariomega',
data:{
name:'Lucario-Mega-Z',
baseSpecies:'Lucario',
forme:'Mega-Z',
requiredItem:'Lucarionite',
battleOnly:'Lucario',
changesFrom:'Lucario',
isNonstandard:'Custom'
}
},
raichumegax:{
base:'raichu',
data:{
name:'Raichu-Mega-X',
baseSpecies:'Raichu',
forme:'Mega-X',
battleOnly:'Raichu',
changesFrom:'Raichu',
isNonstandard:'Custom'
}
},
raichumegay:{
base:'raichu',
data:{
name:'Raichu-Mega-Y',
baseSpecies:'Raichu',
forme:'Mega-Y',
battleOnly:'Raichu',
changesFrom:'Raichu',
isNonstandard:'Custom'
}
},
scolipedemega:{
base:'scolipede',
data:{
name:'Scolipede-Mega',
baseSpecies:'Scolipede',
forme:'Mega',
battleOnly:'Scolipede',
changesFrom:'Scolipede',
isNonstandard:'Custom'
}
},
golisopodmega:{
base:'golisopod',
data:{
name:'Golisopod-Mega',
baseSpecies:'Golisopod',
forme:'Mega',
battleOnly:'Golisopod',
changesFrom:'Golisopod',
isNonstandard:'Custom'
}
},
golurkmega:{
base:'golurk',
data:{
name:'Golurk-Mega',
baseSpecies:'Golurk',
forme:'Mega',
battleOnly:'Golurk',
changesFrom:'Golurk',
isNonstandard:'Custom'
}
},
glimmoramega:{
base:'glimmora',
data:{
name:'Glimmora-Mega',
baseSpecies:'Glimmora',
forme:'Mega',
battleOnly:'Glimmora',
changesFrom:'Glimmora',
isNonstandard:'Custom'
}
},
greninjamega:{
base:'greninja',
data:{
name:'Greninja-Mega',
baseSpecies:'Greninja',
forme:'Mega',
battleOnly:'Greninja',
changesFrom:'Greninja',
isNonstandard:'Custom'
}
},
chesnaughtmega:{
base:'chesnaught',
data:{
name:'Chesnaught-Mega',
baseSpecies:'Chesnaught',
forme:'Mega',
battleOnly:'Chesnaught',
changesFrom:'Chesnaught',
isNonstandard:'Custom'
}
},
delphoxmega:{
base:'delphox',
data:{
name:'Delphox-Mega',
baseSpecies:'Delphox',
forme:'Mega',
battleOnly:'Delphox',
changesFrom:'Delphox',
isNonstandard:'Custom'
}
},
dragalgemega:{
base:'dragalge',
data:{
name:'Dragalge-Mega',
baseSpecies:'Dragalge',
forme:'Mega',
battleOnly:'Dragalge',
changesFrom:'Dragalge',
isNonstandard:'Custom'
}
},
dragonitemega:{
base:'dragonite',
data:{
name:'Dragonite-Mega',
baseSpecies:'Dragonite',
forme:'Mega',
battleOnly:'Dragonite',
changesFrom:'Dragonite',
isNonstandard:'Custom'
}
},
baxcaliburmega:{
base:'baxcalibur',
data:{
name:'Baxcalibur-Mega',
baseSpecies:'Baxcalibur',
forme:'Mega',
battleOnly:'Baxcalibur',
changesFrom:'Baxcalibur',
isNonstandard:'Custom'
}
},
emboarmega:{
base:'emboar',
data:{
name:'Emboar-Mega',
baseSpecies:'Emboar',
forme:'Mega',
battleOnly:'Emboar',
changesFrom:'Emboar',
isNonstandard:'Custom'
}
},
chandeluremega:{
base:'chandelure',
data:{
name:'Chandelure-Mega',
baseSpecies:'Chandelure',
forme:'Mega',
battleOnly:'Chandelure',
changesFrom:'Chandelure',
isNonstandard:'Custom'
}
},
crabominablemega:{
base:'crabominable',
data:{
name:'Crabominable-Mega',
baseSpecies:'Crabominable',
forme:'Mega',
battleOnly:'Crabominable',
changesFrom:'Crabominable',
isNonstandard:'Custom'
}
},
floetteeternalmega:{
base:'floetteeternal',
data:{
name:'Floette-Eternal-Mega',
baseSpecies:'Floette',
forme:'Eternal-Mega',
battleOnly:'Floette-Eternal',
changesFrom:'Floette-Eternal',
isNonstandard:'Custom'
}
},
chimechomega:{
base:'chimecho',
data:{
name:'Chimecho-Mega',
baseSpecies:'Chimecho',
forme:'Mega',
battleOnly:'Chimecho',
changesFrom:'Chimecho',
isNonstandard:'Custom'
}
},
froslassmega:{
base:'froslass',
data:{
name:'Froslass-Mega',
baseSpecies:'Froslass',
forme:'Mega',
battleOnly:'Froslass',
changesFrom:'Froslass',
isNonstandard:'Custom'
}
},
feraligatrmega:{
base:'feraligatr',
data:{
name:'Feraligatr-Mega',
baseSpecies:'Feraligatr',
forme:'Mega',
battleOnly:'Feraligatr',
changesFrom:'Feraligatr',
isNonstandard:'Custom'
}
},
eelektrossmega:{
base:'eelektross',
data:{
name:'Eelektross-Mega',
baseSpecies:'Eelektross',
forme:'Mega',
battleOnly:'Eelektross',
changesFrom:'Eelektross',
isNonstandard:'Custom'
}
},
excadrillmega:{
base:'excadrill',
data:{
name:'Excadrill-Mega',
baseSpecies:'Excadrill',
forme:'Mega',
battleOnly:'Excadrill',
changesFrom:'Excadrill',
isNonstandard:'Custom'
}
},
meowsticmmega:{
base:'meowstic',
data:{
name:'Meowstic-M-Mega',
baseSpecies:'Meowstic',
forme:'M-Mega',
battleOnly:'Meowstic',
changesFrom:'Meowstic',
isNonstandard:'Custom'
}
},
meowsticfmega:{
base:'meowsticf',
data:{
name:'Meowstic-F-Mega',
baseSpecies:'Meowstic',
forme:'F-Mega',
battleOnly:'Meowstic-F',
changesFrom:'Meowstic-F',
isNonstandard:'Custom'
}
},
scovillainmega:{
base:'scovillain',
data:{
name:'Scovillain-Mega',
baseSpecies:'Scovillain',
forme:'Mega',
battleOnly:'Scovillain',
changesFrom:'Scovillain',
isNonstandard:'Custom'
}
},
malamarmega:{
base:'malamar',
data:{
name:'Malamar-Mega',
baseSpecies:'Malamar',
forme:'Mega',
battleOnly:'Malamar',
changesFrom:'Malamar',
isNonstandard:'Custom'
}
},
clefablemega:{
base:'clefable',
data:{
name:'Clefable-Mega',
baseSpecies:'Clefable',
forme:'Mega',
battleOnly:'Clefable',
changesFrom:'Clefable',
isNonstandard:'Custom'
}
},
absolmegaz:{
base:'absolmega',
data:{
name:'Absol-Mega-Z',
baseSpecies:'Absol',
forme:'Mega-Z',
battleOnly:'Absol',
changesFrom:'Absol',
isNonstandard:'Custom'
}
}
};

var CUSTOM_ICON_SPRITES={
garchomp:'garchomp',
garchompmega:'garchomp-mega',
flygonmegaz:'flygon-megaz',
garchompmegaz:'garchomp-megaz',
garchompbattlebond:'garchomp-battlebond',
gardevoirvoidmega:'gardevoirvoid-mega',
gardevoirmegaz:'gardevoir-megaz',
scraftymega:'scrafty-mega',
skarmorymega:'skarmory-mega',
staraptormega:'staraptor-mega',
lucariomegaz:'lucario-megaz',
meganiummega:'meganium-mega',
raichumegax:'raichu-megax',
raichumegay:'raichu-megay',
scolipedemega:'scolipede-mega',
golisopodmega:'golisopod-mega',
golurkmega:'golurk-mega',
glimmoramega:'glimmora-mega',
greninjamega:'greninja-mega',
greninjaash:'greninja-ash',
greninjabond:'greninja',
alakazammega:'alakazam-mega',
gengarmega:'gengar-mega',
gengargmax:'gengar-gmax',
houndoommega:'houndoom-mega',
salamencemega:'salamence-mega',
hatterenegmax:'hatterene-gmax',
palafinhero:'palafin-hero',
mausholdfour:'maushold-four',
sinistchamasterpiece:'sinistcha-masterpiece',
venusaurmega:'venusaur-mega',
venusaurgmax:'venusaur-gmax',
centiskorchgmax:'centiskorch-gmax',
basculegionf:'basculegion-f',
ninetalesalola:'ninetales-alola',
lucariomega:'lucario-mega',
slowkinggalar:'slowking-galar',
weavilef:'weavile-f',
rotomwash:'rotom-wash',
rotomheat:'rotom-heat',
rotomfrost:'rotom-frost',
rotomfan:'rotom-fan',
rotommow:'rotom-mow',
weezinggalar:'weezing-galar',
luxrayf:'luxray-f',
alcremiegmax:'alcremie-gmax',
metagrossmega:'metagross-mega',
banettemega:'banette-mega',
starmiemega:'starmie-mega',
heracrossmega:'heracross-mega',
chesnaughtmega:'chesnaught-mega',
delphoxmega:'delphox-mega',
dragalgemega:'dragalge-mega',
dragonitemega:'dragonite-mega',
drampamega:'drampa-mega',
baxcaliburmega:'baxcalibur-mega',
emboarmega:'emboar-mega',
chandeluremega:'chandelure-mega',
crabominablemega:'crabominable-mega',
floettemega:'floette-mega',
floetteeternalmega:'floette-eternal-mega',
chimechomega:'chimecho-mega',
froslassmega:'froslass-mega',
feraligatrmega:'feraligatr-mega',
eelektrossmega:'eelektross-mega',
excadrillmega:'excadrill-mega',
meowsticmmega:'meowstic-mmega',
meowsticfmega:'meowstic-fmega',
scovillainmega:'scovillain-mega',
malamarmega:'malamar-mega',
clefablemega:'clefable-mega',
pyroarmega:'pyroar-mega',
blastoisegmax:'blastoise-gmax',
butterfreegmax:'butterfree-gmax',
corviknightgmax:'corviknight-gmax',
grimmsnarlgmax:'grimmsnarl-gmax',
inteleongmax:'inteleon-gmax',
cinderacegmax:'cinderace-gmax',
duraludongmax:'duraludon-gmax',
toxtricitygmax:'toxtricity-gmax',
toxtricitylowkeygmax:'toxtricity-lowkeygmax',
butterfreemega:'butterfree-mega',
serperiormega:'serperior-mega',
mismagiusmega:'mismagius-mega',
absolmegaz:'absol-megaz',
ursalunabloodmoon:'ursaluna-bloodmoon',
lilliganthisui:'lilligant-hisui',
decidueyehisui:'decidueye-hisui',
silvallyfighting:'silvally-fighting',
silvallyflying:'silvally-flying',
silvallypoison:'silvally-poison',
silvallyground:'silvally-ground',
silvallyrock:'silvally-rock',
silvallybug:'silvally-bug',
silvallyghost:'silvally-ghost',
silvallysteel:'silvally-steel',
silvallyunknown:'silvally-unknown',
silvallyfire:'silvally-fire',
silvallywater:'silvally-water',
silvallygrass:'silvally-grass',
silvallyelectric:'silvally-electric',
silvallypsychic:'silvally-psychic',
silvallyice:'silvally-ice',
silvallydragon:'silvally-dragon',
silvallydark:'silvally-dark',
silvallyfairy:'silvally-fairy'
};

var CUSTOM_TEAMBUILDER_SPRITES={
flygonmegaz:{x:9,y:3,backgroundSize:'78px auto'},
gardevoirvoidmega:{x:9,y:3,backgroundSize:'78px auto'},
gardevoirmegaz:{x:9,y:3,backgroundSize:'78px auto'},
scraftymega:{x:9,y:3,backgroundSize:'78px auto'},
skarmorymega:{x:9,y:3,backgroundSize:'78px auto'},
staraptormega:{x:9,y:3,backgroundSize:'78px auto'},
lucariomegaz:{x:9,y:3,backgroundSize:'78px auto'},
meganiummega:{x:9,y:3,backgroundSize:'78px auto'},
raichumegax:{x:9,y:3,backgroundSize:'78px auto'},
raichumegay:{x:5,y:0,backgroundSize:'86px auto'},
scolipedemega:{x:9,y:3,backgroundSize:'78px auto'},
golisopodmega:{x:9,y:3,backgroundSize:'78px auto'},
golurkmega:{x:9,y:3,backgroundSize:'78px auto'},
glimmoramega:{x:9,y:3,backgroundSize:'78px auto'},
greninjamega:{x:13,y:4,backgroundSize:'70px auto'},
greninjaash:{x:9,y:3,backgroundSize:'78px auto'},
greninjabond:{x:9,y:3,backgroundSize:'78px auto'},
metagrossmega:{x:9,y:3,backgroundSize:'78px auto'},
banettemega:{x:9,y:5,backgroundSize:'78px auto'},
starmiemega:{x:16,y:3,backgroundSize:'64px auto'},
heracrossmega:{x:9,y:5,backgroundSize:'78px auto'},
chesnaughtmega:{x:9,y:3,backgroundSize:'78px auto'},
delphoxmega:{x:9,y:3,backgroundSize:'78px auto'},
dragalgemega:{x:9,y:3,backgroundSize:'78px auto'},
dragonitemega:{x:7,y:7,backgroundSize:'82px auto'},
drampamega:{x:9,y:3,backgroundSize:'78px auto'},
baxcaliburmega:{x:9,y:3,backgroundSize:'78px auto'},
emboarmega:{x:9,y:3,backgroundSize:'78px auto'},
chandeluremega:{x:9,y:3,backgroundSize:'78px auto'},
crabominablemega:{x:9,y:3,backgroundSize:'78px auto'},
floettemega:{x:9,y:3,backgroundSize:'78px auto'},
floetteeternalmega:{x:9,y:3,backgroundSize:'78px auto'},
chimechomega:{x:9,y:3,backgroundSize:'78px auto'},
froslassmega:{x:9,y:3,backgroundSize:'78px auto'},
feraligatrmega:{x:9,y:3,backgroundSize:'78px auto'},
eelektrossmega:{x:9,y:3,backgroundSize:'78px auto'},
excadrillmega:{x:9,y:3,backgroundSize:'78px auto'},
meowsticmmega:{x:9,y:3,backgroundSize:'78px auto'},
meowsticfmega:{x:9,y:3,backgroundSize:'78px auto'},
scovillainmega:{x:9,y:3,backgroundSize:'78px auto'},
malamarmega:{x:9,y:3,backgroundSize:'78px auto'},
clefablemega:{x:9,y:3,backgroundSize:'78px auto'},
pyroarmega:{x:9,y:3,backgroundSize:'78px auto'},
blastoisegmax:{x:9,y:3,backgroundSize:'78px auto'},
toxtricitygmax:{x:9,y:3,backgroundSize:'78px auto'},
toxtricitylowkeygmax:{x:9,y:3,backgroundSize:'78px auto'},
butterfreemega:{x:9,y:3,backgroundSize:'78px auto'},
serperiormega:{x:9,y:3,backgroundSize:'78px auto'},
mismagiusmega:{x:9,y:3,backgroundSize:'78px auto'},
absolmegaz:{x:9,y:3,backgroundSize:'78px auto'},
ursalunabloodmoon:{x:9,y:3,backgroundSize:'78px auto'},
garchomp:{x:9,y:7,backgroundSize:'78px auto'},
garchompmega:{x:5,y:13,backgroundSize:'86px auto'},
garchompmegaz:{x:7,y:8,backgroundSize:'82px auto'},
garchompbattlebond:{x:7,y:13,backgroundSize:'82px auto'}
};

var CUSTOM_STATIC_BATTLE_SPRITES=




{
flygonmegaz:{
front:{w:96,h:96},
back:{w:96,h:96}
},
gardevoirvoidmega:{
front:{w:96,h:96},
back:{w:96,h:96}
},
gardevoirmegaz:{
front:{w:96,h:96},
back:{w:96,h:96}
},
greninjaash:{
front:{w:192,h:192},
back:{w:192,h:192}
},
metagrossmega:{
front:{w:192,h:192},
back:{w:192,h:192}
},
banettemega:{
front:{w:162,h:154},
back:{w:170,h:168}
},
starmiemega:{
front:{w:112,h:136},
back:{w:118,h:138}
},
heracrossmega:{
front:{w:174,h:166},
back:{w:164,h:172},
shinyBack:{w:168,h:176}
},
blastoisegmax:{
front:{w:182,h:180},
back:{w:190,h:186}
},
toxtricitygmax:{
front:{w:96,h:96},
back:{w:96,h:96}
},
toxtricitylowkeygmax:{
front:{w:96,h:96},
back:{w:96,h:96}
},
butterfreemega:{
front:{w:192,h:192},
back:{w:192,h:192}
},
serperiormega:{
front:{w:132,h:132},
back:{w:136,h:136}
},
mismagiusmega:{
front:{w:186,h:186},
back:{w:184,h:186}
},
garchomp:{
front:{w:146,h:152},
back:{w:152,h:146}
},
garchompmega:{
front:{w:186,h:150},
back:{w:146,h:146}
},
garchompmegaz:{
front:{w:192,h:186},
back:{w:192,h:184}
},
garchompbattlebond:{
front:{w:192,h:174},
back:{w:188,h:152}
},
greninjamega:{
front:{w:140,h:180},
back:{w:172,h:168}
},
dragonitemega:{
front:{w:178,h:174},
back:{w:174,h:184}
},
raichumegay:{
front:{w:186,h:165},
back:{w:192,h:147}
},
staraptormega:{
front:{w:173,h:161},
back:{w:157,h:171}
},
toedscruel:{
front:{w:104,h:142},
back:{w:128,h:144}
},
archaludon:{
front:{w:156,h:180},
back:{w:158,h:190}
},
hydrapple:{
front:{w:118,h:168},
back:{w:140,h:178}
},
centiskorch:{
front:{w:180,h:150},
back:{w:186,h:150}
},
centiskorchgmax:{
front:{w:188,h:188},
back:{w:186,h:188}
},
basculegion:{
front:{w:170,h:112},
back:{w:190,h:106},
shinyFront:{w:184,h:132},
shinyBack:{w:192,h:116}
},
basculegionf:{
front:{w:170,h:106},
back:{w:190,h:106},
shinyFront:{w:182,h:128},
shinyBack:{w:192,h:118}
},
kingambit:{
front:{w:134,h:192},
back:{w:120,h:190}
},
electivire:{
front:{w:146,h:140},
back:{w:150,h:136}
},
farigiraf:{
front:{w:132,h:170},
back:{w:126,h:172}
},
ninetales:{
front:{w:130,h:130},
back:{w:150,h:128}
},
ninetalesalola:{
front:{w:146,h:142},
back:{w:138,h:142}
},
meowscarada:{
front:{w:130,h:158},
back:{w:112,h:156}
},
magmortar:{
front:{w:154,h:144},
back:{w:136,h:140}
},
magneton:{
front:{w:126,h:110},
back:{w:114,h:104}
},
magnezone:{
front:{w:148,h:118},
back:{w:150,h:100}
},
gliscor:{
front:{w:146,h:114},
back:{w:140,h:124}
},
metagross:{
front:{w:156,h:100},
back:{w:152,h:104}
},
primarina:{
front:{w:140,h:160},
back:{w:138,h:156}
},
talonflame:{
front:{w:192,h:156},
back:{w:170,h:190}
},
salamence:{
front:{w:156,h:142},
back:{w:166,h:152}
},
salamencemega:{
front:{w:192,h:146},
back:{w:192,h:164}
},
rotom:{
front:{w:122,h:100},
back:{w:122,h:98}
},
rotomwash:{
front:{w:120,h:106},
back:{w:120,h:106}
},
rotomheat:{
front:{w:152,h:122},
back:{w:136,h:120}
},
rotomfrost:{
front:{w:158,h:136},
back:{w:158,h:136}
},
rotomfan:{
front:{w:148,h:118},
back:{w:144,h:116}
},
rotommow:{
front:{w:102,h:130},
back:{w:104,h:104}
},
weezinggalar:{
front:{w:178,h:186},
back:{w:178,h:186},
shinyBack:{w:178,h:185}
},
empoleon:{
front:{w:156,h:150},
back:{w:134,h:148}
},
hatterene:{
front:{w:110,h:188},
back:{w:110,h:188}
},
hatterenegmax:{
front:{w:130,h:192},
back:{w:158,h:192}
},
annihilape:{
front:{w:130,h:136},
back:{w:156,h:158},
shinyFront:{w:132,h:136}
},
arboliva:{
front:{w:170,h:144},
back:{w:162,h:136}
},
armarouge:{
front:{w:94,h:156},
back:{w:82,h:160}
},
charizard:{
front:{w:158,h:174},
back:{w:168,h:166}
},
gholdengo:{
front:{w:98,h:150},
back:{w:116,h:146}
},
overqwil:{
front:{w:172,h:166},
back:{w:164,h:186}
},
palafin:{
front:{w:120,h:76},
back:{w:116,h:76}
},
palafinhero:{
front:{w:92,h:148},
back:{w:90,h:176}
},
cyclizar:{
front:{w:138,h:136},
back:{w:142,h:124}
},
tyrantrum:{
front:{w:192,h:172},
back:{w:158,h:152}
},
venusaur:{
front:{w:152,h:136},
back:{w:162,h:126}
},
venusaurmega:{
front:{w:188,h:148},
back:{w:186,h:144}
},
venusaurgmax:{
front:{w:192,h:178},
back:{w:188,h:170}
},
sinistcha:{
front:{w:76,h:124},
back:{w:82,h:122}
},
sinistchamasterpiece:{
front:{w:76,h:124},
back:{w:82,h:122}
},
lucariomega:{
front:{w:114,h:128},
back:{w:86,h:130}
},
lucariomegaz:{
front:{w:138,h:144},
back:{w:118,h:142}
},
tinkaton:{
front:{w:148,h:140},
back:{w:118,h:110}
},
sneasler:{
front:{w:100,h:152},
back:{w:120,h:142}
},
slowking:{
front:{w:100,h:136},
back:{w:92,h:136}
},
slowkinggalar:{
front:{w:90,h:136},
back:{w:90,h:136}
},
skeledirge:{
front:{w:160,h:112},
back:{w:184,h:130}
},
weavile:{
front:{w:112,h:120},
back:{w:88,h:122}
},
weavilef:{
front:{w:112,h:120},
back:{w:88,h:122}
},
espeon:{
front:{w:100,h:106},
back:{w:80,h:100}
},
gengar:{
front:{w:112,h:104},
back:{w:110,h:108},
shinyFront:{w:112,h:108},
shinyBack:{w:110,h:110}
},
gengarmega:{
front:{w:152,h:132},
back:{w:172,h:132},
shinyFront:{w:152,h:132},
shinyBack:{w:172,h:134}
},
gengargmax:{
front:{w:188,h:180},
back:{w:192,h:174},
shinyFront:{w:192,h:184},
shinyBack:{w:192,h:178}
},
lilligant:{
front:{w:104,h:134},
back:{w:108,h:134}
},
lilliganthisui:{
front:{w:106,h:154},
back:{w:106,h:144}
},
butterfree:{
front:{w:118,h:104},
back:{w:116,h:102}
},
butterfreegmax:{
front:{w:190,h:186},
back:{w:190,h:186}
},
corviknight:{
front:{w:102,h:144},
back:{w:120,h:130}
},
corviknightgmax:{
front:{w:192,h:190},
back:{w:188,h:190},
shinyFront:{w:192,h:190},
shinyBack:{w:188,h:191}
},
ironvaliant:{
front:{w:120,h:162},
back:{w:120,h:162}
},
grimmsnarl:{
front:{w:192,h:152},
back:{w:192,h:152}
},
grimmsnarlgmax:{
front:{w:128,h:192},
back:{w:114,h:192}
},
hydreigon:{
front:{w:160,h:156},
back:{w:150,h:160},
shinyFront:{w:172,h:166},
shinyBack:{w:162,h:172}
},
infernape:{
front:{w:148,h:110},
back:{w:144,h:136}
},
inteleon:{
front:{w:114,h:192},
back:{w:114,h:192}
},
inteleongmax:{
front:{w:126,h:192},
back:{w:124,h:180}
},
torterra:{
front:{w:144,h:154},
back:{w:156,h:156}
},
tsareena:{
front:{w:132,h:160},
back:{w:108,h:160}
},
ursaluna:{
front:{w:152,h:130},
back:{w:162,h:134}
},
ursalunabloodmoon:{
front:{w:172,h:160},
back:{w:156,h:156}
},
cinderace:{
front:{w:90,h:192},
back:{w:80,h:160}
},
cinderacegmax:{
front:{w:162,h:190},
back:{w:162,h:190}
},
crobat:{
front:{w:158,h:130},
back:{w:170,h:98}
},
decidueye:{
front:{w:118,h:158},
back:{w:76,h:152}
},
decidueyehisui:{
front:{w:98,h:164},
back:{w:98,h:156}
},
dragapult:{
front:{w:142,h:156},
back:{w:142,h:156}
},
duraludon:{
front:{w:122,h:150},
back:{w:134,h:148}
},
duraludongmax:{
front:{w:152,h:192},
back:{w:150,h:192}
},
luxray:{
front:{w:126,h:132},
back:{w:134,h:128}
},
luxrayf:{
front:{w:126,h:132},
back:{w:134,h:128}
},
silvally:{
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyfighting:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:188},
shinyBack:{w:118,h:186}
},
silvallyflying:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:164,h:184},
shinyBack:{w:136,h:180}
},
silvallypoison:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:156,h:182},
shinyBack:{w:128,h:180}
},
silvallyground:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:188},
shinyBack:{w:118,h:186}
},
silvallyrock:{
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallybug:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:182},
shinyBack:{w:118,h:182}
},
silvallyghost:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:148,h:184},
shinyBack:{w:138,h:182}
},
silvallysteel:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:188},
shinyBack:{w:118,h:182}
},
silvallyunknown:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:146,h:184},
shinyBack:{w:140,h:180}
},
silvallyfire:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:140,h:176},
shinyBack:{w:118,h:174}
},
silvallywater:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:142,h:186},
shinyBack:{w:126,h:184}
},
silvallygrass:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:188},
shinyBack:{w:118,h:186}
},
silvallyelectric:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:188},
shinyBack:{w:118,h:186}
},
silvallypsychic:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:188},
shinyBack:{w:122,h:184}
},
silvallyice:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:186},
shinyBack:{w:124,h:184}
},
silvallydragon:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:176},
shinyBack:{w:118,h:174}
},
silvallydark:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:138,h:186}
},
silvallyfairy:{
front:{w:138,h:184},
back:{w:118,h:180},
shinyFront:{w:156,h:186},
shinyBack:{w:136,h:182}
},
alcremie:{
front:{w:98,h:126},
back:{w:76,h:114}
},
alcremiegmax:{
front:{w:170,h:192},
back:{w:170,h:192}
}
};

var CUSTOM_BW_SPRITES={
alakazammega:{
num:65,
front:{w:178,h:172},
back:{w:152,h:178}
},
toedscruel:{
num:949,
front:{w:104,h:142},
back:{w:128,h:144}
},
archaludon:{
num:1018,
front:{w:156,h:180},
back:{w:158,h:190}
},
hydrapple:{
num:1019,
front:{w:118,h:168},
back:{w:140,h:178}
},
centiskorch:{
num:851,
front:{w:180,h:150},
back:{w:186,h:150}
},
centiskorchgmax:{
num:851,
front:{w:188,h:188},
back:{w:186,h:188}
},
basculegion:{
num:902,
front:{w:170,h:112},
back:{w:190,h:106}
},
basculegionf:{
num:902,
front:{w:170,h:106},
back:{w:190,h:106}
},
kingambit:{
num:983,
front:{w:134,h:192},
back:{w:120,h:190}
},
electivire:{
num:466,
front:{w:146,h:140},
back:{w:150,h:136}
},
farigiraf:{
num:981,
front:{w:132,h:170},
back:{w:126,h:172}
},
ninetales:{
num:38,
front:{w:130,h:130},
back:{w:150,h:128}
},
ninetalesalola:{
num:38,
front:{w:146,h:142},
back:{w:138,h:142}
},
meowscarada:{
num:908,
front:{w:130,h:158},
back:{w:112,h:156}
},
magmortar:{
num:467,
front:{w:154,h:144},
back:{w:136,h:140}
},
magneton:{
num:82,
front:{w:126,h:110},
back:{w:114,h:104}
},
magnezone:{
num:462,
front:{w:148,h:118},
back:{w:150,h:100}
},
gliscor:{
num:472,
front:{w:146,h:114},
back:{w:140,h:124}
},
metagross:{
num:376,
front:{w:156,h:100},
back:{w:152,h:104}
},
primarina:{
num:730,
front:{w:140,h:160},
back:{w:138,h:156}
},
talonflame:{
num:663,
front:{w:192,h:156},
back:{w:170,h:190}
},
salamence:{
num:373,
front:{w:156,h:142},
back:{w:166,h:152}
},
salamencemega:{
num:373,
front:{w:192,h:146},
back:{w:192,h:164}
},
rotom:{
num:479,
front:{w:122,h:100},
back:{w:122,h:98}
},
rotomwash:{
num:479,
front:{w:120,h:106},
back:{w:120,h:106}
},
rotomheat:{
num:479,
front:{w:152,h:122},
back:{w:136,h:120}
},
rotomfrost:{
num:479,
front:{w:158,h:136},
back:{w:158,h:136}
},
rotomfan:{
num:479,
front:{w:148,h:118},
back:{w:144,h:116}
},
rotommow:{
num:479,
front:{w:102,h:130},
back:{w:104,h:104}
},
weezinggalar:{
num:110,
front:{w:178,h:186},
back:{w:178,h:186},
shinyBack:{w:178,h:185}
},
empoleon:{
num:395,
front:{w:156,h:150},
back:{w:134,h:148}
},
hatterene:{
num:858,
front:{w:110,h:188},
back:{w:110,h:188}
},
hatterenegmax:{
num:858,
front:{w:130,h:192},
back:{w:158,h:192}
},
annihilape:{
num:979,
front:{w:130,h:136},
back:{w:156,h:158},
shinyFront:{w:132,h:136}
},
arboliva:{
num:930,
front:{w:170,h:144},
back:{w:162,h:136}
},
armarouge:{
num:936,
front:{w:94,h:156},
back:{w:82,h:160}
},
charizard:{
num:6,
front:{w:158,h:174},
back:{w:168,h:166}
},
gholdengo:{
num:1000,
front:{w:98,h:150},
back:{w:116,h:146}
},
overqwil:{
num:904,
front:{w:172,h:166},
back:{w:164,h:186}
},
garganacl:{
num:934,
front:{w:148,h:134},
back:{w:146,h:140}
},
maushold:{
num:925,
front:{w:128,h:84},
back:{w:134,h:88}
},
mausholdfour:{
num:925,
front:{w:138,h:84},
back:{w:142,h:88}
},
lokix:{
num:920,
front:{w:92,h:126},
back:{w:104,h:132}
},
bellibolt:{
num:939,
front:{w:96,h:106},
back:{w:92,h:104}
},
kilowattrel:{
num:941,
front:{w:100,h:106},
back:{w:114,h:150}
},
grafaiai:{
num:945,
front:{w:130,h:108},
back:{w:140,h:90}
},
rabsca:{
num:954,
front:{w:82,h:134},
back:{w:78,h:132}
},
espathra:{
num:956,
front:{w:116,h:144},
back:{w:116,h:140}
},
revavroom:{
num:966,
front:{w:164,h:114},
back:{w:168,h:112}
},
houndstone:{
num:972,
front:{w:120,h:124},
back:{w:122,h:140}
},
houndoom:{
num:229,
front:{w:100,h:132},
back:{w:102,h:130},
shinyBack:{w:104,h:130}
},
houndoommega:{
num:229,
front:{w:124,h:168},
back:{w:116,h:164},
shinyBack:{w:114,h:164}
},
cetitan:{
num:975,
front:{w:154,h:110},
back:{w:188,h:132}
},
clodsire:{
num:980,
front:{w:122,h:72},
back:{w:182,h:134}
},
palafin:{
num:964,
front:{w:120,h:76},
back:{w:116,h:76}
},
palafinhero:{
num:964,
front:{w:92,h:148},
back:{w:90,h:176}
},
cyclizar:{
num:967,
front:{w:138,h:136},
back:{w:142,h:124}
},
tyrantrum:{
num:697,
front:{w:192,h:172},
back:{w:158,h:152}
},
venusaur:{
num:3,
front:{w:152,h:136},
back:{w:162,h:126}
},
venusaurmega:{
num:3,
front:{w:188,h:148},
back:{w:186,h:144}
},
venusaurgmax:{
num:3,
front:{w:192,h:178},
back:{w:188,h:170}
},
sinistcha:{
num:1013,
front:{w:76,h:124},
back:{w:82,h:122}
},
sinistchamasterpiece:{
num:1013,
front:{w:76,h:124},
back:{w:82,h:122}
},
alcremie:{
num:869,
front:{w:98,h:126},
back:{w:76,h:114}
},
alcremiegmax:{
num:869,
front:{w:170,h:192},
back:{w:170,h:192}
},
ursalunabloodmoon:{
num:901,
front:{w:172,h:160},
back:{w:156,h:156}
},
flygonmegaz:{
num:330,
front:{w:54,h:54},
back:{w:72,h:72}
},
garchomp:{
num:445,
front:{w:146,h:152},
back:{w:152,h:146}
},
garchompmega:{
num:445,
front:{w:186,h:150},
back:{w:146,h:146}
},
garchompmegaz:{
num:445,
front:{w:192,h:186},
back:{w:192,h:184}
},
garchompbattlebond:{
num:445,
front:{w:192,h:174},
back:{w:188,h:152}
},
gardevoirmegaz:{
num:282,
front:{w:48,h:48},
back:{w:72,h:72}
},
scraftymega:{
num:560,
front:{w:96,h:96},
back:{w:96,h:96}
},
skarmorymega:{
num:227,
front:{w:96,h:96},
back:{w:96,h:96}
},
staraptormega:{
num:398,
front:{w:173,h:161},
back:{w:157,h:171}
},
lucariomega:{
num:448,
front:{w:114,h:128},
back:{w:86,h:130}
},
lucariomegaz:{
num:448,
front:{w:138,h:144},
back:{w:118,h:142}
},
tinkaton:{
num:959,
front:{w:148,h:140},
back:{w:118,h:110}
},
sneasler:{
num:903,
front:{w:100,h:152},
back:{w:120,h:142}
},
slowking:{
num:199,
front:{w:100,h:136},
back:{w:92,h:136}
},
slowkinggalar:{
num:199,
front:{w:90,h:136},
back:{w:90,h:136}
},
skeledirge:{
num:911,
front:{w:160,h:112},
back:{w:184,h:130}
},
weavile:{
num:461,
front:{w:112,h:120},
back:{w:88,h:122},
frontf:{w:112,h:120},
backf:{w:88,h:122}
},
weavilef:{
num:461,
front:{w:112,h:120},
back:{w:88,h:122}
},
espeon:{
num:196,
front:{w:100,h:106},
back:{w:80,h:100}
},
gengar:{
num:94,
front:{w:112,h:104},
back:{w:110,h:108}
},
gengarmega:{
num:94,
front:{w:152,h:132},
back:{w:172,h:132}
},
gengargmax:{
num:94,
front:{w:188,h:180},
back:{w:192,h:174}
},
lilligant:{
num:549,
front:{w:104,h:134},
back:{w:108,h:134}
},
lilliganthisui:{
num:549,
front:{w:106,h:154},
back:{w:106,h:144}
},
butterfree:{
num:12,
front:{w:118,h:104},
back:{w:116,h:102}
},
butterfreegmax:{
num:12,
front:{w:190,h:186},
back:{w:190,h:186}
},
corviknight:{
num:823,
front:{w:102,h:144},
back:{w:120,h:130}
},
corviknightgmax:{
num:823,
front:{w:192,h:190},
back:{w:188,h:190}
},
ironvaliant:{
num:1006,
front:{w:120,h:162},
back:{w:120,h:162}
},
grimmsnarl:{
num:861,
front:{w:192,h:152},
back:{w:192,h:152}
},
grimmsnarlgmax:{
num:861,
front:{w:128,h:192},
back:{w:114,h:192}
},
hydreigon:{
num:635,
front:{w:160,h:156},
back:{w:150,h:160}
},
infernape:{
num:392,
front:{w:148,h:110},
back:{w:144,h:136}
},
inteleon:{
num:818,
front:{w:114,h:192},
back:{w:114,h:192}
},
inteleongmax:{
num:818,
front:{w:126,h:192},
back:{w:124,h:180}
},
torterra:{
num:389,
front:{w:144,h:154},
back:{w:156,h:156}
},
tsareena:{
num:763,
front:{w:132,h:160},
back:{w:108,h:160}
},
ursaluna:{
num:901,
front:{w:152,h:130},
back:{w:162,h:134}
},
cinderace:{
num:815,
front:{w:90,h:192},
back:{w:80,h:160}
},
cinderacegmax:{
num:815,
front:{w:162,h:190},
back:{w:162,h:190}
},
crobat:{
num:169,
front:{w:158,h:130},
back:{w:170,h:98}
},
decidueye:{
num:724,
front:{w:118,h:158},
back:{w:76,h:152}
},
decidueyehisui:{
num:724,
front:{w:98,h:164},
back:{w:98,h:156}
},
dragapult:{
num:887,
front:{w:142,h:156},
back:{w:142,h:156}
},
duraludon:{
num:884,
front:{w:122,h:150},
back:{w:134,h:148}
},
duraludongmax:{
num:884,
front:{w:152,h:192},
back:{w:150,h:192}
},
luxray:{
num:405,
front:{w:126,h:132},
back:{w:134,h:128},
frontf:{w:126,h:132},
backf:{w:134,h:128}
},
luxrayf:{
num:405,
front:{w:126,h:132},
back:{w:134,h:128}
},
silvally:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyfighting:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyflying:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallypoison:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyground:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyrock:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallybug:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyghost:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallysteel:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyunknown:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyfire:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallywater:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallygrass:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyelectric:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallypsychic:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyice:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallydragon:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallydark:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
silvallyfairy:{
num:773,
front:{w:138,h:184},
back:{w:118,h:180}
},
meganiummega:{
num:154,
front:{w:96,h:96},
back:{w:96,h:96}
},
raichumegax:{
num:26,
front:{w:96,h:96},
back:{w:96,h:96}
},
raichumegay:{
num:26,
front:{w:186,h:165},
back:{w:192,h:147}
},
scolipedemega:{
num:545,
front:{w:96,h:96},
back:{w:96,h:96}
},
golisopodmega:{
num:768,
front:{w:96,h:96},
back:{w:96,h:96}
},
golurkmega:{
num:623,
front:{w:96,h:96},
back:{w:96,h:96}
},
glimmoramega:{
num:970,
front:{w:96,h:96},
back:{w:96,h:96}
},
greninjamega:{
num:658,
front:{w:140,h:180},
back:{w:172,h:168}
},
pyroarmega:{
num:668,
front:{w:96,h:96},
back:{w:96,h:96}
},
chesnaughtmega:{
num:652,
front:{w:96,h:96},
back:{w:96,h:96}
},
delphoxmega:{
num:655,
front:{w:96,h:96},
back:{w:96,h:96}
},
dragalgemega:{
num:691,
front:{w:96,h:96},
back:{w:96,h:96}
},
dragonitemega:{
num:149,
front:{w:178,h:174},
back:{w:174,h:184}
},
drampa:{
num:780,
front:{w:180,h:122},
back:{w:170,h:124}
},
drampamega:{
num:780,
front:{w:152,h:178},
back:{w:132,h:178}
},
baxcaliburmega:{
num:998,
front:{w:96,h:96},
back:{w:96,h:96}
},
emboarmega:{
num:500,
front:{w:96,h:96},
back:{w:96,h:96}
},
chandeluremega:{
num:609,
front:{w:96,h:96},
back:{w:96,h:96}
},
crabominablemega:{
num:740,
front:{w:96,h:96},
back:{w:96,h:96}
},
floettemega:{
num:670,
front:{w:96,h:96},
back:{w:96,h:96}
},
floetteeternalmega:{
num:670,
front:{w:96,h:96},
back:{w:96,h:96}
},
chimechomega:{
num:358,
front:{w:96,h:96},
back:{w:96,h:96}
},
froslassmega:{
num:478,
front:{w:96,h:96},
back:{w:96,h:96}
},
feraligatrmega:{
num:160,
front:{w:96,h:96},
back:{w:96,h:96}
},
eelektrossmega:{
num:604,
front:{w:96,h:96},
back:{w:96,h:96}
},
excadrillmega:{
num:530,
front:{w:96,h:96},
back:{w:96,h:96}
},
meowsticmmega:{
num:678,
front:{w:66,h:140},
back:{w:82,h:140}
},
meowsticfmega:{
num:678,
front:{w:96,h:96},
back:{w:96,h:96}
},
scovillainmega:{
num:952,
front:{w:96,h:96},
back:{w:96,h:96}
},
malamarmega:{
num:687,
front:{w:96,h:96},
back:{w:96,h:96}
},
clefablemega:{
num:36,
front:{w:96,h:96},
back:{w:96,h:96}
},
absolmegaz:{
num:359,
front:{w:96,h:96},
back:{w:96,h:96}
}
};

var CUSTOM_SPECIES_UPDATES={
charizard:{
baseStats:{hp:78,atk:109,def:75,spa:114,spd:78,spe:100},
abilities:{0:'Wildfire Core',1:'Flame Body',H:'Solar Power'}
},
charizardgmax:{
baseStats:{hp:133,atk:109,def:75,spa:114,spd:78,spe:100},
abilities:{0:'Burning Crown'}
},
hypno:{
name:'Hypno',
types:['Psychic','Dark'],
baseStats:{hp:90,atk:70,def:105,spa:80,spd:110,spe:45},
abilities:{0:'No Guard',1:'Neutralizing Gas',H:'Neutralization'}
},
kangaskhan:{
baseStats:{hp:105,atk:105,def:80,spa:40,spd:80,spe:90}
},
kangaskhanmega:{
baseStats:{hp:105,atk:135,def:110,spa:40,spd:110,spe:100},
abilities:{0:'Parental Bond'}
},
lapras:{
abilities:{0:'Safe Harbor',1:'Shell Armor',H:'Ice Scales'}
},
jolteon:{
abilities:{0:'Lightning Rod',1:'Battery',H:'Voltage Volley'}
},
archeops:{
abilities:{0:'Defeatist',1:'Relic Instinct',H:'Fossil Frenzy'}
},
dratini:{
abilities:{0:'Shed Skin',1:'Dragonize',H:'Marvel Scale'}
},
dragonair:{
abilities:{0:'Shed Skin',1:'Dragonize',H:'Marvel Scale'}
},
feraligatr:{
abilities:{0:'Sheer Force',1:'Intimidate',H:'Water Veil'}
},
feraligatrmega:{
abilities:{0:'Draconic Force'}
},
banette:{
abilities:{0:'Cursed Keepsake',1:'Cursed Armament',H:'Shadow Shield'},
otherFormes:['Banette-Mega'],
formeOrder:['Banette','Banette-Mega']
},
lopunny:{
abilities:{0:'Fur Coat',1:'Friend Guard',H:'Striker'}
},
lopunnymega:{
abilities:{0:'Unchecked Assault'}
},
blazikenmega:{
abilities:{0:'Blazing Tempo'}
},
aggronmega:{
abilities:{0:'Iron Mountain'}
},
ampharosmega:{
abilities:{0:'Wooly Conductor'}
},
gallademega:{
abilities:{0:'Sacred Edge'}
},
gardevoirmega:{
abilities:{0:'Royal Voice'}
},
vibrava:{
abilities:{0:'Levitate',1:'Dragonize',H:'Sand Stream'}
},
flygon:{
abilities:{0:'Levitate',1:'Dragonize',H:'Sand Stream'}
},
skrelp:{
abilities:{0:'Dragonize',1:'Poison Touch',H:'Adaptability'}
},
dragalge:{
abilities:{0:'Dragonize',1:'Poison Touch',H:'Adaptability'}
},
clauncher:{
abilities:{0:'Mega Launcher',1:'Swift Swim',H:'Quick Draw'}
},
clawitzer:{
abilities:{0:'Mega Launcher',1:'Swift Swim',H:'Quick Draw'}
}
};

var CUSTOM_ABILITY_UPDATES={
battery:{
name:'Battery',
shortDesc:'This Pokemon and its allies have their special attacks boosted by 1.3x.'
},
battlebond:{
name:'Battle Bond',
desc:"When this Pokemon knocks out another Pokemon, it transforms into its Bond form. While transformed, moves that match this Pokemon's type have 1.3x power, and knocking out a target restores 1/8 of this Pokemon's maximum HP.",
shortDesc:'After a KO: transforms. Bond form: matching-type moves 1.3x, KO heals 1/8 max HP.'
},
relicinstinct:{
name:'Relic Instinct',
desc:'If this Pokemon has more than 50% HP, its Rock- and Flying-type moves have 1.3x power and its moves ignore opposing Abilities. If this Pokemon has 50% or less HP, its Rock- and Flying-type moves have 1.1x power, it takes 0.75x damage from attacks, cannot be critically hit, restores 1/16 max HP each turn, and its Attack and Special Attack are halved. Once, when it reaches 25% HP or less, it heals 25% max HP, clears its negative stat stages, and lowers its Defense and Special Defense by 2 stages.',
shortDesc:'>50%: Rock/Flying 1.3x + Mold Breaker. <=50%: defensive mode; <=25% pinch heal.'
},
fossilfrenzy:{
name:'Fossil Frenzy',
desc:'When this Pokemon is hit by a damaging move, its Attack and Speed rise by 1 stage and it becomes confused. While confused, it takes 1.25x damage from attacks. This Pokemon has Klutz\'s effect. If it hits itself in confusion, it also loses 1/8 of its maximum HP.',
shortDesc:'Hit by attacks: +1 Atk/Spe and confusion; confused takes 1.25x; Klutz; self-hit costs 1/8.'
},
relicarmor:{
name:'Relic Armor',
desc:'This Pokemon cannot be critically hit. If an opposing Pokemon lowers its stats, its Defense and Special Defense rise by 1 stage. It takes 0.8x damage from attacks, does not take recoil damage except Struggle, and its moves ignore Abilities.',
shortDesc:'No crits; stat drops +1 Def/SpD; takes 0.8x; Rock Head + Mold Breaker.'
},
draconicforce:{
name:'Draconic Force',
desc:"This Pokemon has Dragonize, Sheer Force, and Guts's effects.",
shortDesc:'Dragonize + Sheer Force + Guts.'
},
ironmountain:{
name:'Iron Mountain',
desc:'This Pokemon has Filter, Stamina, and Heavy Metal\'s effects. Super-effective attacks deal 0.75x damage to it. Once per turn when hit by an opposing damaging move, its Defense rises by 1 stage and it restores 1/16 max HP. Its weight is doubled.',
shortDesc:'Filter + Stamina + Heavy Metal.'
},
woolyconductor:{
name:'Wooly Conductor',
desc:'This Pokemon has Fur Coat, Mold Breaker, and Static\'s effects. Its Defense is doubled, its moves ignore opposing Abilities, and contact moves used against it may paralyze the attacker.',
shortDesc:'Fur Coat + Mold Breaker + Static.'
},
sacrededge:{
name:'Sacred Edge',
desc:'This Pokemon has Sharpness and Sworn Duty\'s effects. Its slicing moves ignore Substitute, Reflect, Light Screen, and Aurora Veil. On switch-in or Mega Evolution, it heals its ally by 1/4 max HP, or 1/3 on Fairy Tale Field.',
shortDesc:'Sharpness + Sworn Duty; slicing moves ignore screens/Substitute.'
},
royalvoice:{
name:'Royal Voice',
desc:'This Pokemon has Pixilate, Queenly Majesty, and Sworn Duty\'s effects. Its Normal-type moves become Fairy type and have 1.2x power. Its Psychic- and Fairy-type moves have 1.2x power. On switch-in or Mega Evolution, it heals its ally by 1/4 max HP, or 1/3 on Fairy Tale Field.',
shortDesc:'Pixilate + Queenly Majesty + Sworn Duty; Psychic/Fairy moves 1.2x.'
},
fallenstar:{
name:'Fallen Star',
desc:"This Pokemon's arrow moves ignore the target's Ability and have 1.2x power. If this Pokemon has 1/3 or less of its maximum HP, its arrow moves gain +1 priority. If an arrow move targets a Pokemon that cannot switch out, it has 1.5x power instead. This Pokemon is immune to hail damage. Arrow moves are Spirit Shackle, Thousand Arrows, Triple Arrows, Snipe Shot, Razor Leaf, and Magical Leaf.",
shortDesc:'Arrow moves ignore Abilities and are 1.2x; at <=1/3 HP +1 priority; hail immune.'
},
ragingstorm:{
name:'Raging Storm',
desc:"This Pokemon's attacks have Mold Breaker, remove the target's positive stat changes before damage, and ignore Reflect, Light Screen, Aurora Veil, and defensive stat boosts. If this Pokemon gets a KO, it damages remaining foes for 60% of the last damage in multi battles, or raises Attack by 1 if there is no valid target or no damage is dealt. Magic Guard users do not take this damage. This Pokemon is immune to hail damage.",
shortDesc:'Mold Breaker; attacks clear target boosts and ignore screens/boosts; KO bonus; hail immune.'
},
safeharbor:{
name:'Safe Harbor',
desc:'This Pokemon absorbs Water- and Ice-type attacks to restore 1/4 of its maximum HP. It also has Ice Body and Hydration\'s effects.',
shortDesc:'Absorbs Water/Ice moves; Ice Body + Hydration.'
},
voltagevolley:{
name:'Voltage Volley',
desc:"This Pokemon's multi-hit moves become special attacks and use its Special Attack.",
shortDesc:'Multi-hit moves become special and use Sp. Atk.'
},
waterveil:{
name:'Water Veil',
desc:'This Pokemon cannot be burned and is immune to Hail and Sandstorm damage. Gaining this Ability while burned cures it. On switch-in, it gains Aqua Ring.',
shortDesc:'Cannot be burned; immune to Hail/Sandstorm; gains Aqua Ring.'
},
atrocity:{
name:'Atrocity',
desc:"This Pokemon's damaging moves have 1.3x power, +1 critical hit ratio, ignore Abilities, ignore defensive stat boosts, and bypass Substitute, Reflect, Light Screen, and Aurora Veil. Its Defense and Special Defense are 1.3x. It heals 30% of the damage it deals with attacks, doubled against G-Max Pokemon, up to 33% of its max HP per hit, and restores 1/16 max HP at the end of each turn. This Pokemon is immune to hail damage.",
shortDesc:'Moves 1.3x and bypass defenses/screens; drains up to 33%; heals 1/16; hail immune.'
},
ultraego:{
name:'Ultra Ego',
desc:'This Pokemon\'s moves ignore abilities. Once per turn, its damaging attacks heal 1/16 max HP, and if one of its moves knocks out a Pokemon it heals 1/10 max HP. After this Pokemon uses a damaging move, the next opposing damaging hit raises its Attack and Special Attack by 1 and heals 1/16 max HP, or once per switch-in heals 1/4 max HP instead at 50% HP or less on boosted fields. Additional hits before it attacks again heal 1/20 max HP. Ally hits never trigger the boost or healing.',
shortDesc:'Mold Breaker; attacks heal; move KOs heal 1/10; next enemy hit boosts Atk/SpA.'
}
};

var CUSTOM_MOVE_UPDATES={
bonemerang:{
name:'Bonemerang',
critRatio:2,
secondary:{
chance:30,
volatileStatus:'flinch'
},
desc:'Hits twice. Has an increased critical hit ratio. Each hit has a 30% chance to make the target flinch.',
shortDesc:'Hits 2 times. High crit ratio. 30% flinch each hit.'
},
bonerush:{
name:'Bone Rush',
accuracy:95,
basePower:30,
multihit:[2,6],
secondary:{
chance:10,
boosts:{def:-1}
},
desc:'Hits 2 to 6 times. If the user holds Thick Club, hits 4 or 6 times. Each hit has a 10% chance to lower Defense by 1 stage.',
shortDesc:'Hits 2-6 times; Thick Club: 4/6 hits. 10% Def drop each hit.'
},
cometpunch:{
name:'Comet Punch',
accuracy:100,
basePower:20,
flags:{contact:1,protect:1,mirror:1,punch:1,metronome:1},
multihit:[3,5],
desc:'Hits 3 to 5 times. The final hit has double power and always results in a critical hit.',
shortDesc:'Hits 3-5 times. Final hit: 2x power and always crits.'
},
doubleslap:{
name:'Double Slap',
accuracy:100,
basePower:20,
type:'Fairy',
multihit:[2,5],
secondary:{
chance:10,
boosts:{atk:-1}
},
desc:'Hits 2 to 5 times. Each hit has a 10% chance to lower Attack by 1 stage.',
shortDesc:'Fairy; hits 2-5 times. 10% Atk drop each hit.'
},
furyattack:{
name:'Fury Attack',
accuracy:100,
basePower:20,
type:'Ground',
flags:{contact:1,protect:1,mirror:1,drill:1,metronome:1,bone:1},
multihit:[3,5],
desc:'Hits 3 to 5 times. This drill move hits Flying-type Pokemon neutrally. The final hit heals the user based on damage dealt.',
shortDesc:'Ground; hits 3-5. Hits Flying neutrally. Final hit drains.'
},
hornattack:{
name:'Horn Attack',
type:'Rock',
secondary:{
chance:50,
boosts:{def:-1}
},
desc:'Has a 50% chance to lower the target\'s Defense by 1 stage.',
shortDesc:'Rock type. 50% chance to lower Defense by 1.'
},
spikecannon:{
name:'Spike Cannon',
accuracy:100,
basePower:20,
type:'Steel',
multihit:[3,5],
critRatio:2,
desc:'Hits 3 to 5 times. Has an increased critical hit ratio.',
shortDesc:'Steel; hits 3-5 times. High crit ratio.'
},
supercellslam:{
name:'Supercell Slam',
basePower:120
},
volttackle:{
name:'Volt Tackle',
basePower:140
},
wildcharge:{
name:'Wild Charge',
basePower:120
},
zippyzap:{
num:729,
accuracy:100,
basePower:60,
category:'Physical',
isNonstandard:'LGPE',
name:'Zippy Zap',
pp:10,
priority:2,
flags:{contact:1,protect:1,mirror:1},
willCrit:true,
target:'normal',
type:'Electric',
contestType:'Cool',
desc:'Usually moves before other attacks. This move will always result in a critical hit.',
shortDesc:'Usually moves first. Always crits.'
}
};

var CUSTOM_LEARNSET_REPLACEMENTS={
hypno:{
afteryou:['9M'],
allyswitch:['9M'],
aurasphere:['9M'],
batonpass:['9M'],
blizzard:['9M'],
confuseray:['9M'],
darkpulse:['9M'],
dazzlinggleam:['9M'],
disable:['9M'],
drainpunch:['9M'],
dreameater:['9M'],
dynamicpunch:['9M'],
embargo:['9M'],
encore:['9M'],
energyball:['9M'],
expandingforce:['9M'],
firepunch:['9M'],
focusblast:['9M'],
foresight:['9M'],
foulplay:['9M'],
futuresight:['9M'],
gravity:['9M'],
healblock:['9M'],
helpinghand:['9M'],
hex:['9M'],
hypnosis:['9M'],
icebeam:['9M'],
icepunch:['9M'],
imprison:['9M'],
inferno:['9M'],
kinesis:['9M'],
knockoff:['9M'],
lashout:['9M'],
lightscreen:['9M'],
luckychant:['9M'],
magicroom:['9M'],
meditate:['9M'],
memento:['9M'],
miracleeye:['9M'],
mistyterrain:['9M'],
nightdaze:['9M'],
nightmare:['9M'],
partingshot:['9M'],
psybeam:['9M'],
psychic:['9M'],
psychicterrain:['9M'],
psyshock:['9M'],
psystrike:['9M'],
quash:['9M'],
reflect:['9M'],
safeguard:['9M'],
shadowball:['9M'],
signalbeam:['9M'],
snarl:['9M'],
storedpower:['9M'],
suckerpunch:['9M'],
taunt:['9M'],
telekinesis:['9M'],
throatchop:['9M'],
thunder:['9M'],
thunderbolt:['9M'],
thunderpunch:['9M'],
thunderwave:['9M'],
torment:['9M'],
toxic:['9M'],
trickroom:['9M'],
willowisp:['9M'],
wonderroom:['9M'],
zapcannon:['9M']
}
};

var CUSTOM_LEARNSET_ADDITIONS={
pikachustarter:{
drainingkiss:['9M'],
eeriespell:['9M'],
flashcannon:['9M'],
flyingpress:['9M'],
freezedry:['9M'],
heartstamp:['9M'],
iciclecrash:['9M'],
meteormash:['9M'],
playrough:['9M'],
vacuumwave:['9M']
},
raichu:{
drainingkiss:['9L1','8M'],
eeriespell:['9M'],
flashcannon:['9M'],
flyingpress:['9L1'],
freezedry:['9M'],
heartstamp:['9L1'],
iciclecrash:['9L1'],
meteormash:['9L1'],
playrough:['9M','8M'],
vacuumwave:['9M']
},
raichualola:{
drainingkiss:['9L1','8M'],
eeriespell:['9M'],
flashcannon:['9M'],
flyingpress:['9L1'],
freezedry:['9M'],
heartstamp:['9L1'],
iciclecrash:['9L1'],
meteormash:['9L1'],
playrough:['8M'],
vacuumwave:['9M']
},
overqwil:{
flipturn:['9M'],
spikecannon:['9M']
},
blastoise:{
electroshot:['9M']
},
sandslash:{
spikecannon:['9M']
},
sandslashalola:{
spikecannon:['9M']
},
nidoqueen:{
spikecannon:['9M']
},
nidoking:{
spikecannon:['9M']
},
shellder:{
spikecannon:['9M']
},
rhyhorn:{
spikecannon:['9M']
},
rhydon:{
spikecannon:['9M']
},
rhyperior:{
spikecannon:['9M']
},
jolteon:{
spikecannon:['9M']
},
feraligatr:{
cometpunch:['9M']
},
clodsire:{
spikecannon:['9M']
},
qwilfish:{
spikecannon:['9M']
},
qwilfishhisui:{
spikecannon:['9M']
},
sneasler:{
spikecannon:['9M']
},
cursola:{
spikecannon:['9M']
},
aron:{
spikecannon:['9M']
},
lairon:{
spikecannon:['9M']
},
aggron:{
spikecannon:['9M']
},
roserade:{
spikecannon:['9M']
},
maractus:{
spikecannon:['9M']
},
ferroseed:{
spikecannon:['9M']
},
ferrothorn:{
spikecannon:['9M']
},
chesnaught:{
spikecannon:['9M']
},
clawitzer:{
electroshot:['9M']
},
goodra:{
hypervoice:['9M']
},
goodrahisui:{
hypervoice:['9M']
},
turtonator:{
spikecannon:['9M']
},
togedemaru:{
spikecannon:['9M']
},
dhelmise:{
spikecannon:['9M']
},
coalossal:{
spikecannon:['9M']
},
pincurchin:{
spikecannon:['9M']
},
glimmora:{
spikecannon:['9M']
},
brambleghast:{
spikecannon:['9M']
},
ironthorns:{
spikecannon:['9M']
},
ogerpon:{
spikecannon:['9M']
},
archaludon:{
spikecannon:['9M']
}
};

var CUSTOM_BW_SPRITE_IDS=Object.keys(CUSTOM_BW_SPRITES);
var CUSTOM_SPECIES_IDS=Object.keys(CUSTOM_SPECIES);
var CUSTOM_SPECIES_UPDATE_IDS=Object.keys(CUSTOM_SPECIES_UPDATES);
var CUSTOM_ABILITY_UPDATE_IDS=Object.keys(CUSTOM_ABILITY_UPDATES);
var CUSTOM_MOVE_UPDATE_IDS=Object.keys(CUSTOM_MOVE_UPDATES);
var CUSTOM_LEARNSET_REPLACEMENT_IDS=Object.keys(CUSTOM_LEARNSET_REPLACEMENTS);
var CUSTOM_LEARNSET_ADDITION_IDS=Object.keys(CUSTOM_LEARNSET_ADDITIONS);

var customBWSpriteDataTable=null;
var customPokedexDataTable=null;
var customPokedexAltFormsTable=null;
var customAbilityDataTable=null;
var customMoveDataTable=null;
var customTeambuilderDataTable=null;
var customSpeciesDataTable=null;

function ensureCustomBWSpriteData(){
if(!window.BattlePokemonSpritesBW)return;
if(customBWSpriteDataTable===window.BattlePokemonSpritesBW)return;for(var _i2=0;_i2<
CUSTOM_BW_SPRITE_IDS.length;_i2++){var id=CUSTOM_BW_SPRITE_IDS[_i2];
if(!window.BattlePokemonSpritesBW[id]){
window.BattlePokemonSpritesBW[id]=CUSTOM_BW_SPRITES[id];
}else{
Object.assign(window.BattlePokemonSpritesBW[id],CUSTOM_BW_SPRITES[id]);
}
}
customBWSpriteDataTable=window.BattlePokemonSpritesBW;
}

function ensureCustomDataPatches(){
if(
(customPokedexDataTable||undefined)===window.BattlePokedex&&
(customPokedexAltFormsTable||undefined)===window.BattlePokedexAltForms&&
(customAbilityDataTable||undefined)===window.BattleAbilities&&
(customMoveDataTable||undefined)===window.BattleMovedex&&
(customTeambuilderDataTable||undefined)===window.BattleTeambuilderTable)
return;
if(window.BattlePokedex&&customPokedexDataTable!==window.BattlePokedex){
delete window.BattlePokedex.banettemegaz;for(var _i4=0;_i4<
CUSTOM_SPECIES_UPDATE_IDS.length;_i4++){var id=CUSTOM_SPECIES_UPDATE_IDS[_i4];
if(!window.BattlePokedex[id])window.BattlePokedex[id]={};
Object.assign(window.BattlePokedex[id],CUSTOM_SPECIES_UPDATES[id]);
}
customPokedexDataTable=window.BattlePokedex;
}
if(window.BattlePokedexAltForms&&customPokedexAltFormsTable!==window.BattlePokedexAltForms){
delete window.BattlePokedexAltForms.banettemegaz;
customPokedexAltFormsTable=window.BattlePokedexAltForms;
}
if(window.BattleAbilities&&customAbilityDataTable!==window.BattleAbilities){for(var _i6=0;_i6<
CUSTOM_ABILITY_UPDATE_IDS.length;_i6++){var _id=CUSTOM_ABILITY_UPDATE_IDS[_i6];
if(!window.BattleAbilities[_id])window.BattleAbilities[_id]={};
Object.assign(window.BattleAbilities[_id],CUSTOM_ABILITY_UPDATES[_id]);
}
customAbilityDataTable=window.BattleAbilities;
}
if(window.BattleMovedex&&customMoveDataTable!==window.BattleMovedex){for(var _i8=0;_i8<
CUSTOM_MOVE_UPDATE_IDS.length;_i8++){var _id2=CUSTOM_MOVE_UPDATE_IDS[_i8];
if(!window.BattleMovedex[_id2])window.BattleMovedex[_id2]={};
Object.assign(window.BattleMovedex[_id2],CUSTOM_MOVE_UPDATES[_id2]);
}
customMoveDataTable=window.BattleMovedex;
}
if(window.BattleTeambuilderTable&&customTeambuilderDataTable!==window.BattleTeambuilderTable){
var table=window.BattleTeambuilderTable;
if(!table.overrideSpeciesData)table.overrideSpeciesData={};for(var _i0=0;_i0<
CUSTOM_SPECIES_UPDATE_IDS.length;_i0++){var _id3=CUSTOM_SPECIES_UPDATE_IDS[_i0];
table.overrideSpeciesData[_id3]=Object.assign({},
table.overrideSpeciesData[_id3]||{},
CUSTOM_SPECIES_UPDATES[_id3]);

}
if(!table.overrideAbilityData)table.overrideAbilityData={};for(var _i10=0;_i10<
CUSTOM_ABILITY_UPDATE_IDS.length;_i10++){var _id4=CUSTOM_ABILITY_UPDATE_IDS[_i10];
table.overrideAbilityData[_id4]=Object.assign({},
table.overrideAbilityData[_id4]||{},
CUSTOM_ABILITY_UPDATES[_id4]);

}
if(!table.learnsets)table.learnsets={};for(var _i12=0;_i12<
CUSTOM_LEARNSET_REPLACEMENT_IDS.length;_i12++){var _id5=CUSTOM_LEARNSET_REPLACEMENT_IDS[_i12];
table.learnsets[_id5]=Object.assign({},CUSTOM_LEARNSET_REPLACEMENTS[_id5]);
}for(var _i14=0;_i14<
CUSTOM_LEARNSET_ADDITION_IDS.length;_i14++){var _id6=CUSTOM_LEARNSET_ADDITION_IDS[_i14];
table.learnsets[_id6]=Object.assign({},
table.learnsets[_id6]||{},
CUSTOM_LEARNSET_ADDITIONS[_id6]);

}
customTeambuilderDataTable=window.BattleTeambuilderTable;
}
}

function ensureCustomSpecies(id){
if(!window.BattlePokedex)return;
ensureCustomDataPatches();
if(customSpeciesDataTable!==window.BattlePokedex){for(var _i16=0;_i16<
CUSTOM_SPECIES_IDS.length;_i16++){var customId=CUSTOM_SPECIES_IDS[_i16];
var customSpecies=CUSTOM_SPECIES[customId];
var baseData=window.BattlePokedex[customSpecies.base];
if(!baseData)continue;
var existingData=window.BattlePokedex[customId];
window.BattlePokedex[customId]=Object.assign({},
existingData||baseData,
customSpecies.data);

}
customSpeciesDataTable=window.BattlePokedex;
}else if(id&&CUSTOM_SPECIES[id]&&!window.BattlePokedex[id]){
var _customSpecies=CUSTOM_SPECIES[id];
var _baseData=window.BattlePokedex[_customSpecies.base];
if(_baseData){
window.BattlePokedex[id]=Object.assign({},
_baseData,
_customSpecies.data);

}
}
ensureCustomBWSpriteData();
var garchomp=window.BattlePokedex.garchomp;
if(garchomp){
var otherFormes=garchomp.otherFormes||[];for(var _i18=0,_ref2=
['Garchomp-Mega-Z','Garchomp-Battle-Bond'];_i18<_ref2.length;_i18++){var forme=_ref2[_i18];
if(!otherFormes.includes(forme))otherFormes.push(forme);
}
garchomp.otherFormes=otherFormes;
}
var flygon=window.BattlePokedex.flygon;
if(flygon){
var _otherFormes=flygon.otherFormes||[];
if(!_otherFormes.includes('Flygon-Mega-Z')){
flygon.otherFormes=[].concat(_otherFormes,['Flygon-Mega-Z']);
}
}
var banette=window.BattlePokedex.banette;
if(banette){
banette.otherFormes=(banette.otherFormes||[]).filter(function(forme){return forme!=='Banette-Mega-Z';});
banette.formeOrder=(banette.formeOrder||[]).filter(function(forme){return forme!=='Banette-Mega-Z';});
}
}
window.ensureCustomDataPatches=ensureCustomDataPatches;
window.ensureCustomSpecies=ensureCustomSpecies;


var PSUtils=new(function(){function _class(){}var _proto=_class.prototype;_proto.










splitFirst=function splitFirst(str,delimiter){var limit=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1;
var splitStr=[];
while(splitStr.length<limit){
var delimiterIndex=str.indexOf(delimiter);
if(delimiterIndex>=0){
splitStr.push(str.slice(0,delimiterIndex));
str=str.slice(delimiterIndex+delimiter.length);
}else{
splitStr.push(str);
str='';
}
}
splitStr.push(str);
return splitStr;
};_proto.












compare=function compare(a,b){
if(typeof a==='number'){
return a-b;
}
if(typeof a==='string'){
return a.localeCompare(b);
}
if(typeof a==='boolean'){
return(a?1:2)-(b?1:2);
}
if(Array.isArray(a)){
for(var i=0;i<a.length;i++){
var comparison=PSUtils.compare(a[i],b[i]);
if(comparison)return comparison;
}
return 0;
}
if(a.reverse){
return PSUtils.compare(b.reverse,a.reverse);
}
throw new Error("Passed value "+a+" is not comparable");
};_proto.












sortBy=function sortBy(array,callback){
if(!callback)return array.sort(PSUtils.compare);
return array.sort(function(a,b){return PSUtils.compare(callback(a),callback(b));});
};return _class;}())(
);





function toRoomid(roomid){
return roomid.replace(/[^a-zA-Z0-9-]+/g,'').toLowerCase();
}

function toName(name){
if(typeof name!=='string'&&typeof name!=='number')return'';
name=(''+name).replace(/[\|\s\[\]\,\u202e]+/g,' ').trim();
if(name.length>18)name=name.substr(0,18).trim();


name=name.replace(
/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
''
);
name=name.replace(/[\u239b-\u23b9]/g,'');

return name;
}























var Dex=new(function(){function _class2(){var _this=this;this.
gen=9;this.
modid='gen9';this.
cache=null;this.

statNames=['hp','atk','def','spa','spd','spe'];this.
statNamesExceptHP=['atk','def','spa','spd','spe'];this.

pokeballs=null;this.

resourcePrefix=function(_window$document){
var prefix='';
if(((_window$document=window.document)==null||(_window$document=_window$document.location)==null?void 0:_window$document.protocol)!=='http:')prefix='https:';
return prefix+"//play.pokemonreborn-showdown.xyz/";
}();this.

fxPrefix=function(_window$document2){
var protocol=((_window$document2=window.document)==null||(_window$document2=_window$document2.location)==null?void 0:_window$document2.protocol)!=='http:'?'https:':'';
return protocol+"//"+'play.pokemonreborn-showdown.xyz'+"/fx/";
}();this.

loadedSpriteData={xy:1,bw:0};this.
moddedDexes={};this.











































































moves={
get:function(nameOrMove){
ensureCustomDataPatches();
if(nameOrMove&&typeof nameOrMove!=='string'){

return nameOrMove;
}
var name=nameOrMove||'';
var id=toID(nameOrMove);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleMovedex)window.BattleMovedex={};
var data=window.BattleMovedex[id];
if(data&&typeof data.exists==='boolean')return data;

if(!data&&id.substr(0,11)==='hiddenpower'&&id.length>11){
var _ref3=/([a-z]*)([0-9]*)/.exec(id),hpWithType=_ref3[1],hpPower=_ref3[2];
data=Object.assign({},
window.BattleMovedex[hpWithType]||{},{
basePower:Number(hpPower)||60});

}
if(!data&&id.substr(0,6)==='return'&&id.length>6){
data=Object.assign({},
window.BattleMovedex['return']||{},{
basePower:Number(id.slice(6))});

}
if(!data&&id.substr(0,11)==='frustration'&&id.length>11){
data=Object.assign({},
window.BattleMovedex['frustration']||{},{
basePower:Number(id.slice(11))});

}

if(!data)data={exists:false};
var move=new Move(id,name,data);
window.BattleMovedex[id]=move;
return move;
}
};this.







items={
get:function(nameOrItem){
if(nameOrItem&&typeof nameOrItem!=='string'){

return nameOrItem;
}
var name=nameOrItem||'';
var id=toID(nameOrItem);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleItems)window.BattleItems={};
var data=window.BattleItems[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var item=new Item(id,name,data);
window.BattleItems[id]=item;
return item;
}
};this.

abilities={
get:function(nameOrAbility){
ensureCustomDataPatches();
if(nameOrAbility&&typeof nameOrAbility!=='string'){

return nameOrAbility;
}
var name=nameOrAbility||'';
var id=toID(nameOrAbility);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleAbilities)window.BattleAbilities={};
var data=window.BattleAbilities[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var ability=new Ability(id,name,data);
window.BattleAbilities[id]=ability;
return ability;
}
};this.

species={
get:function(nameOrSpecies){
if(nameOrSpecies&&typeof nameOrSpecies!=='string'){

return nameOrSpecies;
}
var name=nameOrSpecies||'';
var id=toID(nameOrSpecies);
var formid=id;
if(!window.BattlePokedexAltForms)window.BattlePokedexAltForms={};
if(formid in window.BattlePokedexAltForms&&!(formid in CUSTOM_SPECIES))return window.BattlePokedexAltForms[formid];
if(window.BattleAliases&&id in BattleAliases&&!(id in CUSTOM_SPECIES)){
name=BattleAliases[id];
id=toID(name);
}else if(window.BattlePokedex&&!(id in BattlePokedex)&&!(id in CUSTOM_SPECIES)&&window.BattleBaseSpeciesChart){for(var _i20=0,_BattleBaseSpeciesCha2=
BattleBaseSpeciesChart;_i20<_BattleBaseSpeciesCha2.length;_i20++){var baseSpeciesId=_BattleBaseSpeciesCha2[_i20];
if(formid.startsWith(baseSpeciesId)){
id=baseSpeciesId;
break;
}
}
}
if(!window.BattlePokedex)window.BattlePokedex={};
ensureCustomSpecies(id);
var data=window.BattlePokedex[id];

var species;
if(data&&typeof data.exists==='boolean'){
species=data;
}else{
if(!data)data={exists:false};
if(!data.tier&&id.slice(-5)==='totem'){
data.tier=_this.species.get(id.slice(0,-5)).tier;
}
if(!data.tier&&data.baseSpecies&&toID(data.baseSpecies)!==id){
data.tier=_this.species.get(data.baseSpecies).tier;
}
species=new Species(id,name,data);
window.BattlePokedex[id]=species;
}

if(species.cosmeticFormes&&!(formid in CUSTOM_SPECIES)){for(var _i22=0,_species$cosmeticForm2=
species.cosmeticFormes;_i22<_species$cosmeticForm2.length;_i22++){var forme=_species$cosmeticForm2[_i22];
if(toID(forme)===formid){
species=new Species(formid,name,Object.assign({},
species,{
name:forme,
forme:forme.slice(species.name.length+1),
baseForme:"",
baseSpecies:species.name,
otherFormes:null})
);
window.BattlePokedexAltForms[formid]=species;
break;
}
}
}

return species;
}
};this.

types={
allCache:null,
get:function(type){
if(!type||typeof type==='string'){
var id=toID(type);
var name=id.substr(0,1).toUpperCase()+id.substr(1);
type=window.BattleTypeChart&&window.BattleTypeChart[id]||{};
if(type.damageTaken)type.exists=true;
if(!type.id)type.id=id;
if(!type.name)type.name=name;
if(!type.effectType){
type.effectType='Type';
}
}
return type;
},
all:function(){
if(_this.types.allCache)return _this.types.allCache;
var types=[];
for(var id in window.BattleTypeChart||{}){
types.push(Dex.types.get(id));
}
if(types.length)_this.types.allCache=types;
return types;
},
isName:function(name){
var id=toID(name);
if(name!==id.substr(0,1).toUpperCase()+id.substr(1))return false;
return(window.BattleTypeChart||{}).hasOwnProperty(id);
}
};}var _proto2=_class2.prototype;_proto2.mod=function mod(modid){if(modid==='gen9')return this;if(!window.BattleTeambuilderTable)return this;if(modid in this.moddedDexes){return this.moddedDexes[modid];}this.moddedDexes[modid]=new ModdedDex(modid);return this.moddedDexes[modid];};_proto2.forGen=function forGen(gen){if(!gen)return this;return this.mod("gen"+gen);};_proto2.resolveAvatar=function resolveAvatar(avatar){var _window$Config;if(window.BattleAvatarNumbers&&avatar in BattleAvatarNumbers){avatar=BattleAvatarNumbers[avatar];}if(avatar.charAt(0)==='#'){return Dex.resourcePrefix+'sprites/trainers-custom/'+toID(avatar.substr(1))+'.png';}if(avatar.includes('.')&&(_window$Config=window.Config)!=null&&(_window$Config=_window$Config.server)!=null&&_window$Config.registered){var protocol=Config.server.port===443?'https':'http';return protocol+'://'+Config.server.host+':'+Config.server.port+'/avatars/'+encodeURIComponent(avatar).replace(/\%3F/g,'?');}return Dex.resourcePrefix+'sprites/trainers/'+Dex.sanitizeName(avatar||'unknown')+'.png';};_proto2.sanitizeName=function sanitizeName(name){if(!name)return'';return(''+name).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').slice(0,50);};_proto2.prefs=function prefs(prop){var _window$Storage;return(_window$Storage=window.Storage)==null||_window$Storage.prefs==null?void 0:_window$Storage.prefs(prop);};_proto2.getShortName=function getShortName(name){var shortName=name.replace(/[^A-Za-z0-9]+$/,'');if(shortName.indexOf('(')>=0){shortName+=name.slice(shortName.length).replace(/[^\(\)]+/g,'').replace(/\(\)/g,'');}return shortName;};_proto2.getEffect=function getEffect(name){name=(name||'').trim();if(name.substr(0,5)==='item:'){return Dex.items.get(name.substr(5).trim());}else if(name.substr(0,8)==='ability:'){return Dex.abilities.get(name.substr(8).trim());}else if(name.substr(0,5)==='move:'){return Dex.moves.get(name.substr(5).trim());}var id=toID(name);return new PureEffect(id,name);};_proto2.getGen3Category=function getGen3Category(type){return['Fire','Water','Grass','Electric','Ice','Psychic','Dark','Dragon'].includes(type)?'Special':'Physical';};_proto2.

hasAbility=function hasAbility(species,ability){
for(var i in species.abilities){

if(ability===species.abilities[i])return true;
}
return false;
};_proto2.

loadSpriteData=function loadSpriteData(gen){
if(this.loadedSpriteData[gen])return;
this.loadedSpriteData[gen]=1;

var path=$('script[src*="pokedex-mini.js"]').attr('src')||'';
var qs='?'+(path.split('?')[1]||'');
path=(path.match(/.+?(?=data\/pokedex-mini\.js)/)||[])[0]||'';

var el=document.createElement('script');
el.src=path+'data/pokedex-mini-bw.js'+qs;
document.getElementsByTagName('body')[0].appendChild(el);
};_proto2.
getSpriteData=function getSpriteData(pokemon,isFront)







{var _window$Config2;var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{gen:6};
var mechanicsGen=options.gen||6;
var isDynamax=!!options.dynamax;
if(pokemon instanceof Pokemon){
if(pokemon.volatiles.transform){
options.shiny=pokemon.volatiles.transform[2];
options.gender=pokemon.volatiles.transform[3];
}else{
options.shiny=pokemon.shiny;
options.gender=pokemon.gender;
}
var isGigantamax=false;
if(pokemon.volatiles.dynamax){
if(pokemon.volatiles.dynamax[1]){
isGigantamax=true;
}else if(options.dynamax!==false){
isDynamax=true;
}
}
pokemon=pokemon.getSpeciesForme()+(isGigantamax?'-Gmax':'');
}
var requestedSpriteid=typeof pokemon==='string'?toID(pokemon):'';
var species=Dex.species.get(pokemon);
ensureCustomBWSpriteData();

if(species.name.endsWith('-Gmax'))isDynamax=false;
var spriteData={
gen:mechanicsGen,
w:96,
h:96,
y:0,
url:Dex.resourcePrefix+'sprites/',
pixelated:true,
isFrontSprite:false,
cryurl:'',
shiny:options.shiny
};
var name=species.spriteid;
if(requestedSpriteid&&CUSTOM_STATIC_BATTLE_SPRITES[requestedSpriteid])name=requestedSpriteid;
if(CUSTOM_ICON_SPRITES[species.id])name=CUSTOM_ICON_SPRITES[species.id];
var dir;
var facing;
if(isFront){
spriteData.isFrontSprite=true;
dir='';
facing='front';
}else{
dir='-back';
facing='back';
}












var graphicsGen=mechanicsGen;
if(Dex.prefs('nopastgens'))graphicsGen=6;
if(Dex.prefs('bwgfx')&&graphicsGen>=6)graphicsGen=5;
spriteData.gen=Math.max(graphicsGen,Math.min(species.gen,5));
var baseDir=['','gen1','gen2','gen3','gen4','gen5','','','',''][spriteData.gen];

var animationData=null;
var miscData=null;
var speciesid=species.id;
if(requestedSpriteid&&CUSTOM_STATIC_BATTLE_SPRITES[requestedSpriteid])speciesid=requestedSpriteid;
if(species.isTotem)speciesid=toID(name);
if(baseDir===''&&window.BattlePokemonSprites){
animationData=BattlePokemonSprites[speciesid];
}
if(baseDir==='gen5'&&window.BattlePokemonSpritesBW){
animationData=BattlePokemonSpritesBW[speciesid];
}
if(window.BattlePokemonSprites)miscData=BattlePokemonSprites[speciesid];
if(!miscData&&window.BattlePokemonSpritesBW)miscData=BattlePokemonSpritesBW[speciesid];
if(!animationData)animationData={};
if(!miscData)miscData={};

if(miscData.num!==0&&miscData.num>-5000){
var baseSpeciesid=toID(species.baseSpecies);
spriteData.cryurl='audio/cries/'+baseSpeciesid;
var formeid=species.formeid;
if(species.isMega||formeid&&(
formeid==='-crowned'||
formeid==='-eternal'||
formeid==='-eternamax'||
formeid==='-four'||
formeid==='-hangry'||
formeid==='-hero'||
formeid==='-lowkey'||
formeid==='-noice'||
formeid==='-primal'||
formeid==='-rapidstrike'||
formeid==='-roaming'||
formeid==='-school'||
formeid==='-sky'||
formeid==='-starter'||
formeid==='-super'||
formeid==='-therian'||
formeid==='-unbound'||
baseSpeciesid==='calyrex'||
baseSpeciesid==='kyurem'||
baseSpeciesid==='cramorant'||
baseSpeciesid==='indeedee'||
baseSpeciesid==='lycanroc'||
baseSpeciesid==='necrozma'||
baseSpeciesid==='oinkologne'||
baseSpeciesid==='oricorio'||
baseSpeciesid==='slowpoke'||
baseSpeciesid==='tatsugiri'||
baseSpeciesid==='zygarde'))
{
spriteData.cryurl+=formeid;
}
spriteData.cryurl+='.mp3';
}

if(options.shiny&&mechanicsGen>1)dir+='-shiny';


if((_window$Config2=window.Config)!=null&&(_window$Config2=_window$Config2.server)!=null&&_window$Config2.afd||Dex.prefs('afd')||options.afd){
dir='afd'+dir;
spriteData.url+=dir+'/'+name+'.png';


if(isDynamax&&!options.noScale){
spriteData.w*=0.25;
spriteData.h*=0.25;
spriteData.y+=-22;
}else if(species.isTotem&&!options.noScale){
spriteData.w*=0.5;
spriteData.h*=0.5;
spriteData.y+=-11;
}
return spriteData;
}


if(options.mod){
spriteData.cryurl="sprites/"+options.mod+"/audio/"+toID(species.baseSpecies);
spriteData.cryurl+='.mp3';
}

if(animationData[facing+'f']&&options.gender==='F')facing+='f';
var allowAnim=!Dex.prefs('noanim')&&!Dex.prefs('nogif');
if(CUSTOM_ICON_SPRITES[speciesid])allowAnim=false;
var customStaticBattleSpriteid=speciesid;
if(options.gender==='F'&&CUSTOM_STATIC_BATTLE_SPRITES[speciesid+"f"]){
customStaticBattleSpriteid=speciesid+"f";
}
var customStaticBattleSprite=CUSTOM_STATIC_BATTLE_SPRITES[customStaticBattleSpriteid];
if(customStaticBattleSprite)allowAnim=false;
var customBWSprite=CUSTOM_BW_SPRITES[speciesid];
if(allowAnim&&spriteData.gen>=6)spriteData.pixelated=false;
if(allowAnim&&animationData[facing]&&spriteData.gen>=5){
if(facing.slice(-1)==='f')name+='-f';
dir=baseDir+'ani'+dir;

spriteData.w=animationData[facing].w;
spriteData.h=animationData[facing].h;
spriteData.url+=dir+'/'+name+'.gif';
}else{


dir=(baseDir||'gen5')+dir;



if(spriteData.gen>=4&&(miscData['frontf']||customStaticBattleSpriteid!==speciesid)&&options.gender==='F'){
name+='-f';
}

spriteData.url+=dir+'/'+name+'.png';
}
if(customStaticBattleSprite){
var customSpriteSize=options.shiny?
customStaticBattleSprite[isFront?'shinyFront':'shinyBack']||customStaticBattleSprite[isFront?'front':'back']:
customStaticBattleSprite[isFront?'front':'back'];
spriteData.w=customSpriteSize.w;
spriteData.h=customSpriteSize.h;
}else if(customBWSprite&&spriteData.gen===5){
var _customSpriteSize=options.shiny?
customBWSprite[isFront?'shinyFront':'shinyBack']||customBWSprite[isFront?'front':'back']:
customBWSprite[isFront?'front':'back'];
spriteData.w=_customSpriteSize.w;
spriteData.h=_customSpriteSize.h;
}

if(!options.noScale){
if(graphicsGen>4){

}else if(spriteData.isFrontSprite){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-16;
}else{

spriteData.w*=2/1.5;
spriteData.h*=2/1.5;
spriteData.y+=-11;
}
if(spriteData.gen<=2)spriteData.y+=2;
}
if(!options.noScale&&(customStaticBattleSprite||customBWSprite)&&!isDynamax){
var scale=Math.min(96/spriteData.w,96/spriteData.h,1);
if(scale<1){
spriteData.w=Math.round(spriteData.w*scale);
spriteData.h=Math.round(spriteData.h*scale);
}
}
if(isDynamax&&!options.noScale){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-22;
}else if(species.isTotem&&!options.noScale){
spriteData.w*=1.5;
spriteData.h*=1.5;
spriteData.y+=-11;
}

return spriteData;
};_proto2.

getPokemonIconNum=function getPokemonIconNum(id,isFemale,facingLeft){var _window$BattlePokemon,_window$BattlePokedex,_window$BattlePokemon2;
var num=0;
if((_window$BattlePokemon=window.BattlePokemonSprites)!=null&&(_window$BattlePokemon=_window$BattlePokemon[id])!=null&&_window$BattlePokemon.num){
num=BattlePokemonSprites[id].num;
}else if((_window$BattlePokedex=window.BattlePokedex)!=null&&(_window$BattlePokedex=_window$BattlePokedex[id])!=null&&_window$BattlePokedex.num){
num=BattlePokedex[id].num;
}
if(num<0)num=0;
if(num>1025)num=0;

if((_window$BattlePokemon2=window.BattlePokemonIconIndexes)!=null&&_window$BattlePokemon2[id]){
num=BattlePokemonIconIndexes[id];
}

if(isFemale){
if(['unfezant','frillish','jellicent','meowstic','pyroar'].includes(id)){
num=BattlePokemonIconIndexes[id+'f'];
}
}
if(facingLeft){
if(BattlePokemonIconIndexesLeft[id]){
num=BattlePokemonIconIndexesLeft[id];
}
}
return num;
};_proto2.

getPokemonIcon=function getPokemonIcon(pokemon,facingLeft){var _pokemon,_pokemon2,_pokemon3,_pokemon5,_pokemon6;
if(pokemon==='pokeball'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -0px 4px";
}else if(pokemon==='pokeball-statused'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -40px 4px";
}else if(pokemon==='pokeball-fainted'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)";
}else if(pokemon==='pokeball-none'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px";
}

var id=toID(pokemon);
if(!pokemon||typeof pokemon==='string')pokemon=null;

if((_pokemon=pokemon)!=null&&_pokemon.speciesForme)id=toID(pokemon.speciesForme);

if((_pokemon2=pokemon)!=null&&_pokemon2.species)id=toID(pokemon.species);

if((_pokemon3=pokemon)!=null&&(_pokemon3=_pokemon3.volatiles)!=null&&_pokemon3.formechange&&!pokemon.volatiles.transform){

id=toID(pokemon.volatiles.formechange[1]);
}
var customIcon=CUSTOM_ICON_SPRITES[id];
if(customIcon){var _pokemon4;
var _fainted=(_pokemon4=pokemon)!=null&&_pokemon4.fainted?";opacity:.3;filter:grayscale(100%) brightness(.5)":"";
return"background:transparent url("+Dex.resourcePrefix+"sprites/gen5/"+customIcon+".png) no-repeat center / contain"+_fainted;
}
var num=this.getPokemonIconNum(id,((_pokemon5=pokemon)==null?void 0:_pokemon5.gender)==='F',facingLeft);

var top=Math.floor(num/12)*30;
var left=num%12*40;
var fainted=(_pokemon6=pokemon)!=null&&_pokemon6.fainted?";opacity:.3;filter:grayscale(100%) brightness(.5)":"";
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-sheet.png?v16) no-repeat scroll -"+left+"px -"+top+"px"+fainted;
};_proto2.

getTeambuilderSpriteData=function getTeambuilderSpriteData(pokemon){var _window$Config3;var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;
var id=toID(pokemon.species);
var spriteid=pokemon.spriteid;
var species=Dex.species.get(pokemon.species);
if(pokemon.species&&!spriteid){
spriteid=species.spriteid||toID(pokemon.species);
}
if(CUSTOM_ICON_SPRITES[id])spriteid=CUSTOM_ICON_SPRITES[id];
if(species.exists===false)return{spriteDir:'sprites/gen5',spriteid:'0',x:10,y:5};
if((_window$Config3=window.Config)!=null&&(_window$Config3=_window$Config3.server)!=null&&_window$Config3.afd||Dex.prefs('afd')){
return{
spriteid:spriteid,
spriteDir:'sprites/afd',
shiny:!!pokemon.shiny,
x:10,
y:5
};
}
var spriteData={
spriteid:spriteid,
spriteDir:'sprites/dex',
x:-2,
y:-3
};
if(pokemon.shiny)spriteData.shiny=true;
if(id==='greninjabond'){
spriteData.spriteid='greninja';
spriteData.x=-6;
spriteData.y=-7;
return spriteData;
}
if(CUSTOM_ICON_SPRITES[id]){
spriteData.spriteDir='sprites/gen5';
var customStaticData=CUSTOM_STATIC_BATTLE_SPRITES[id];
var customBWData=CUSTOM_BW_SPRITES[id];
var spriteDimensions=pokemon.shiny?
(customStaticData==null?void 0:customStaticData.shinyFront)||(customBWData==null?void 0:customBWData.shinyFront)||(customStaticData==null?void 0:customStaticData.front)||(customBWData==null?void 0:customBWData.front):
(customStaticData==null?void 0:customStaticData.front)||(customBWData==null?void 0:customBWData.front);
if(spriteDimensions){
var scale=Math.min(78/spriteDimensions.w,66/spriteDimensions.h,1);
var width=Math.max(1,Math.round(spriteDimensions.w*scale));
var height=Math.max(1,Math.round(spriteDimensions.h*scale));
spriteData.x=Math.round((96-width)/2);
spriteData.y=Math.round((78-height)/2)+8;
spriteData.backgroundSize=width+"px auto";
}else{
var customSpriteData=CUSTOM_TEAMBUILDER_SPRITES[id]||{x:12,y:10,backgroundSize:'72px auto'};
spriteData.x=customSpriteData.x;
spriteData.y=customSpriteData.y;
spriteData.backgroundSize=customSpriteData.backgroundSize;
}
return spriteData;
}
if(Dex.prefs('nopastgens'))gen=6;
if(Dex.prefs('bwgfx')&&gen>5)gen=5;
var xydexExists=!species.isNonstandard||species.isNonstandard==='Past'||species.isNonstandard==='CAP'||[
"pikachustarter","eeveestarter","meltan","melmetal","pokestarufo","pokestarufo2","pokestarbrycenman","pokestarmt","pokestarmt2","pokestargiant","pokestarhumanoid","pokestarmonster","pokestarf00","pokestarf002","pokestarspirit"].
includes(species.id);
if(species.gen===8&&species.isNonstandard!=='CAP')xydexExists=false;
if((!gen||gen>=6)&&xydexExists){
if(species.gen>=7){
spriteData.x=-6;
spriteData.y=-7;
}else if(id.substr(0,6)==='arceus'){
spriteData.x=-2;
spriteData.y=7;
}else if(id==='garchomp'){
spriteData.x=-2;
spriteData.y=2;
}else if(id==='garchompmega'){
spriteData.x=-2;
spriteData.y=0;
}
return spriteData;
}
spriteData.spriteDir='sprites/gen5';
if(gen<=1&&species.gen<=1)spriteData.spriteDir='sprites/gen1';else
if(gen<=2&&species.gen<=2)spriteData.spriteDir='sprites/gen2';else
if(gen<=3&&species.gen<=3)spriteData.spriteDir='sprites/gen3';else
if(gen<=4&&species.gen<=4)spriteData.spriteDir='sprites/gen4';
spriteData.x=10;
spriteData.y=5;
if(spriteData.spriteDir==='sprites/gen5'){
var _customStaticData=CUSTOM_STATIC_BATTLE_SPRITES[id];
var _customBWData=CUSTOM_BW_SPRITES[id];
var _spriteDimensions=pokemon.shiny?
(_customStaticData==null?void 0:_customStaticData.shinyFront)||(_customBWData==null?void 0:_customBWData.shinyFront)||(_customStaticData==null?void 0:_customStaticData.front)||(_customBWData==null?void 0:_customBWData.front):
(_customStaticData==null?void 0:_customStaticData.front)||(_customBWData==null?void 0:_customBWData.front);
if(_spriteDimensions){
var _scale=Math.min(78/_spriteDimensions.w,66/_spriteDimensions.h,1);
var _width=Math.max(1,Math.round(_spriteDimensions.w*_scale));
var _height=Math.max(1,Math.round(_spriteDimensions.h*_scale));
spriteData.x=Math.round((96-_width)/2);
spriteData.y=Math.round((78-_height)/2)+8;
spriteData.backgroundSize=_width+"px auto";
}
}
return spriteData;
};_proto2.

getTeambuilderSprite=function getTeambuilderSprite(pokemon){var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;
if(!pokemon)return'';
var data=this.getTeambuilderSpriteData(pokemon,gen);
var shiny=data.shiny?'-shiny':'';
return'background-image:url('+Dex.resourcePrefix+data.spriteDir+shiny+'/'+data.spriteid+'.png);background-position:'+data.x+'px '+data.y+'px;background-repeat:no-repeat'+(data.backgroundSize?';background-size:'+data.backgroundSize:'');
};_proto2.

getItemIcon=function getItemIcon(item){var _item;
var num=0;
if(typeof item==='string'&&exports.BattleItems)item=exports.BattleItems[toID(item)];
if((_item=item)!=null&&_item.spritenum)num=item.spritenum;

var top=Math.floor(num/16)*24;
var left=num%16*24;
return'background:transparent url('+Dex.resourcePrefix+'sprites/itemicons-sheet.png?v1) no-repeat scroll -'+left+'px -'+top+'px';
};_proto2.

getTypeIcon=function getTypeIcon(type,b){
type=this.types.get(type).name;
if(!type)type='???';
var sanitizedType=type.replace(/\?/g,'%3f');
return"<img src=\""+Dex.resourcePrefix+"sprites/types/"+sanitizedType+".png\" alt=\""+type+"\" height=\"14\" width=\"32\" class=\"pixelated"+(b?' b':'')+"\" />";
};_proto2.

getCategoryIcon=function getCategoryIcon(category){
var categoryID=toID(category);
var sanitizedCategory='';
switch(categoryID){
case'physical':
case'special':
case'status':
sanitizedCategory=categoryID.charAt(0).toUpperCase()+categoryID.slice(1);
break;
default:
sanitizedCategory='undefined';
break;
}
return"<img src=\""+Dex.resourcePrefix+"sprites/categories/"+sanitizedCategory+".png\" alt=\""+sanitizedCategory+"\" height=\"14\" width=\"32\" class=\"pixelated\" />";
};_proto2.

getPokeballs=function getPokeballs(){
if(this.pokeballs)return this.pokeballs;
this.pokeballs=[];
if(!window.BattleItems)window.BattleItems={};for(var _i24=0,_Object$values2=
Object.values(window.BattleItems);_i24<_Object$values2.length;_i24++){var data=_Object$values2[_i24];
if(!data.isPokeball)continue;
this.pokeballs.push(data.name);
}
return this.pokeballs;
};return _class2;}())(
);var

ModdedDex=function(){










function ModdedDex(modid){var _this2=this;this.gen=void 0;this.modid=void 0;this.cache={Moves:{},Items:{},Abilities:{},Species:{},Types:{}};this.pokeballs=null;this.





moves={
get:function(name){
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Moves.hasOwnProperty(id))return _this2.cache.Moves[id];

var data=Object.assign({},Dex.moves.get(name));

for(var i=Dex.gen-1;i>=_this2.gen;i--){
var table=window.BattleTeambuilderTable["gen"+i];
if(id in table.overrideMoveData){
Object.assign(data,table.overrideMoveData[id]);
}
}
if(_this2.modid!=="gen"+_this2.gen){
var _table=window.BattleTeambuilderTable[_this2.modid];
if(id in _table.overrideMoveData){
Object.assign(data,_table.overrideMoveData[id]);
}
}
if(_this2.gen<=3&&data.category!=='Status'){
data.category=Dex.getGen3Category(data.type);
}

var move=new Move(id,name,data);
_this2.cache.Moves[id]=move;
return move;
}
};this.

items={
get:function(name){
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Items.hasOwnProperty(id))return _this2.cache.Items[id];

var data=Object.assign({},Dex.items.get(name));

for(var i=_this2.gen;i<9;i++){
var table=window.BattleTeambuilderTable['gen'+i];
if(id in table.overrideItemDesc){
data.shortDesc=table.overrideItemDesc[id];
break;
}
}

var item=new Item(id,name,data);
_this2.cache.Items[id]=item;
return item;
}
};this.

abilities={
get:function(name){
ensureCustomDataPatches();
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Abilities.hasOwnProperty(id))return _this2.cache.Abilities[id];

var data=Object.assign({},Dex.abilities.get(name));

for(var i=Dex.gen-1;i>=_this2.gen;i--){
var table=window.BattleTeambuilderTable["gen"+i];
if(id in table.overrideAbilityData){
Object.assign(data,table.overrideAbilityData[id]);
}
}
if(_this2.modid!=="gen"+_this2.gen){
var _table2=window.BattleTeambuilderTable[_this2.modid];
if(id in _table2.overrideAbilityData){
Object.assign(data,_table2.overrideAbilityData[id]);
}
}

var ability=new Ability(id,name,data);
_this2.cache.Abilities[id]=ability;
return ability;
}
};this.

species={
get:function(name){
ensureCustomDataPatches();
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(_this2.cache.Species.hasOwnProperty(id))return _this2.cache.Species[id];

var data=Object.assign({},Dex.species.get(name));

for(var i=Dex.gen-1;i>=_this2.gen;i--){
var _table3=window.BattleTeambuilderTable["gen"+i];
if(id in _table3.overrideSpeciesData){
Object.assign(data,_table3.overrideSpeciesData[id]);
}
}
if(_this2.modid!=="gen"+_this2.gen){
var _table4=window.BattleTeambuilderTable[_this2.modid];
if(id in _table4.overrideSpeciesData){
Object.assign(data,_table4.overrideSpeciesData[id]);
}
}
if(_this2.gen<3||_this2.modid==='gen7letsgo'){
data.abilities={0:"No Ability"};
}

var table=window.BattleTeambuilderTable[_this2.modid];
if(id in table.overrideTier)data.tier=table.overrideTier[id];
if(!data.tier&&id.slice(-5)==='totem'){
data.tier=_this2.species.get(id.slice(0,-5)).tier;
}
if(!data.tier&&data.baseSpecies&&toID(data.baseSpecies)!==id){
data.tier=_this2.species.get(data.baseSpecies).tier;
}
if(data.gen>_this2.gen)data.tier='Illegal';

var species=new Species(id,name,data);
_this2.cache.Species[id]=species;
return species;
}
};this.

types={
get:function(name){
var id=toID(name);
name=id.substr(0,1).toUpperCase()+id.substr(1);

if(_this2.cache.Types.hasOwnProperty(id))return _this2.cache.Types[id];

var data=Object.assign({},Dex.types.get(name));

for(var i=7;i>=_this2.gen;i--){
var table=window.BattleTeambuilderTable['gen'+i];
if(id in table.removeType){
data.exists=false;

break;
}
if(id in table.overrideTypeChart){
data=Object.assign({},data,table.overrideTypeChart[id]);
}
}

_this2.cache.Types[id]=data;
return data;
}
};this.modid=modid;var gen=parseInt(modid.substr(3,1),10);if(!modid.startsWith('gen')||!gen)throw new Error("Unsupported modid");this.gen=gen;}var _proto3=ModdedDex.prototype;_proto3.

getPokeballs=function getPokeballs(){
if(this.pokeballs)return this.pokeballs;
this.pokeballs=[];
if(!window.BattleItems)window.BattleItems={};for(var _i26=0,_Object$values4=
Object.values(window.BattleItems);_i26<_Object$values4.length;_i26++){var data=_Object$values4[_i26];
if(data.gen&&data.gen>this.gen)continue;
if(!data.isPokeball)continue;
this.pokeballs.push(data.name);
}
return this.pokeballs;
};return ModdedDex;}();


var Teams=new(function(){function _class3(){}var _proto4=_class3.prototype;_proto4.
unpack=function unpack(buf){
if(!buf)return[];

var team=[];
var i=0;
var j=0;

while(true){
var set={};
team.push(set);


j=buf.indexOf('|',i);
set.name=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
set.species=Dex.species.get(buf.substring(i,j)).name||set.name;
i=j+1;


j=buf.indexOf('|',i);
set.item=Dex.items.get(buf.substring(i,j)).name;
i=j+1;


j=buf.indexOf('|',i);
var ability=Dex.abilities.get(buf.substring(i,j)).name;
var species=Dex.species.get(set.species);
set.ability=species.abilities&&
['','0','1','H','S'].includes(ability)?species.abilities[ability||'0']:ability;
i=j+1;


j=buf.indexOf('|',i);
set.moves=buf.substring(i,j).split(',').map(function(moveid){
return Dex.moves.get(moveid).name;
});
i=j+1;


j=buf.indexOf('|',i);
set.nature=buf.substring(i,j);
if(set.nature==='undefined')delete set.nature;
i=j+1;


j=buf.indexOf('|',i);
if(j!==i){
var evstring=buf.substring(i,j);
if(evstring.length>5){
var evs=evstring.split(',');
set.evs={
hp:Number(evs[0])||0,
atk:Number(evs[1])||0,
def:Number(evs[2])||0,
spa:Number(evs[3])||0,
spd:Number(evs[4])||0,
spe:Number(evs[5])||0
};
}else if(evstring==='0'){
set.evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
}
}
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.gender=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
if(j!==i){
var ivs=buf.substring(i,j).split(',');
set.ivs={
hp:ivs[0]===''?31:Number(ivs[0]),
atk:ivs[1]===''?31:Number(ivs[1]),
def:ivs[2]===''?31:Number(ivs[2]),
spa:ivs[3]===''?31:Number(ivs[3]),
spd:ivs[4]===''?31:Number(ivs[4]),
spe:ivs[5]===''?31:Number(ivs[5])
};
}
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.shiny=true;
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.level=parseInt(buf.substring(i,j),10);
i=j+1;


j=buf.indexOf(']',i);
var misc=void 0;
if(j<0){
if(i<buf.length)misc=buf.substring(i).split(',',6);
}else{
if(i!==j)misc=buf.substring(i,j).split(',',6);
}
if(misc){
set.happiness=misc[0]?Number(misc[0]):255;
set.hpType=misc[1];
set.pokeball=misc[2];
set.gigantamax=!!misc[3];
set.dynamaxLevel=misc[4]?Number(misc[4]):10;
set.teraType=misc[5];
}
if(j<0)break;
i=j+1;
}

return team;
};_proto4["export"]=
function _export(team,gen){var hidestats=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
if(!team)return'';
if(typeof team==='string'){
if(team.indexOf('\n')>=0)return team;
team=this.unpack(team);
}
var text='';for(var _i28=0,_team2=
team;_i28<_team2.length;_i28++){var curSet=_team2[_i28];
if(curSet.name&&curSet.name!==curSet.species){
text+=''+curSet.name+' ('+curSet.species+')';
}else{
text+=''+curSet.species;
}
if(curSet.gender==='M')text+=' (M)';
if(curSet.gender==='F')text+=' (F)';
if(curSet.item){
text+=' @ '+curSet.item;
}
text+="  \n";
if(curSet.ability){
text+='Ability: '+curSet.ability+"  \n";
}
if(curSet.level&&curSet.level!==100){
text+='Level: '+curSet.level+"  \n";
}
if(curSet.shiny){
text+='Shiny: Yes  \n';
}
if(typeof curSet.happiness==='number'&&curSet.happiness!==255&&!isNaN(curSet.happiness)){
text+='Happiness: '+curSet.happiness+"  \n";
}
if(curSet.pokeball){
text+='Pokeball: '+curSet.pokeball+"  \n";
}
if(curSet.hpType){
text+='Hidden Power: '+curSet.hpType+"  \n";
}
if(typeof curSet.dynamaxLevel==='number'&&curSet.dynamaxLevel!==10&&!isNaN(curSet.dynamaxLevel)){
text+='Dynamax Level: '+curSet.dynamaxLevel+"  \n";
}
if(curSet.gigantamax){
text+='Gigantamax: Yes  \n';
}
if(gen===9){
var species=Dex.species.get(curSet.species);
text+='Tera Type: '+(species.forceTeraType||curSet.teraType||species.types[0])+"  \n";
}
if(!hidestats){
var first=true;
if(curSet.evs){
var j=void 0;
for(j in BattleStatNames){
if(!curSet.evs[j])continue;
if(first){
text+='EVs: ';
first=false;
}else{
text+=' / ';
}
text+=''+curSet.evs[j]+' '+BattleStatNames[j];
}
}
if(!first){
text+="  \n";
}
if(curSet.nature){
text+=''+curSet.nature+' Nature'+"  \n";
}
first=true;
if(curSet.ivs){
var defaultIvs=true;
var hpType='';for(var _i30=0,_curSet$moves2=
curSet.moves;_i30<_curSet$moves2.length;_i30++){var move=_curSet$moves2[_i30];
if(move.substr(0,13)==='Hidden Power '&&move.substr(0,14)!=='Hidden Power ['){
hpType=move.substr(13);
if(!Dex.types.isName(hpType)){
alert(move+" is not a valid Hidden Power type.");
continue;
}
var stat=void 0;
for(stat in BattleStatNames){var _Dex$types$get$HPivs;
if((curSet.ivs[stat]===undefined?31:curSet.ivs[stat])!==(((_Dex$types$get$HPivs=Dex.types.get(hpType).HPivs)==null?void 0:_Dex$types$get$HPivs[stat])||31)){
defaultIvs=false;
break;
}
}
}
}
if(defaultIvs&&!hpType){
var _stat=void 0;
for(_stat in BattleStatNames){
if(curSet.ivs[_stat]!==31&&curSet.ivs[_stat]!==undefined){
defaultIvs=false;
break;
}
}
}
if(!defaultIvs){
var _stat2=void 0;
for(_stat2 in BattleStatNames){
if(typeof curSet.ivs[_stat2]==='undefined'||isNaN(curSet.ivs[_stat2])||curSet.ivs[_stat2]===31)continue;
if(first){
text+='IVs: ';
first=false;
}else{
text+=' / ';
}
text+=''+curSet.ivs[_stat2]+' '+BattleStatNames[_stat2];
}
}
}
if(!first){
text+="  \n";
}
}
if(curSet.moves){for(var _i32=0,_curSet$moves4=
curSet.moves;_i32<_curSet$moves4.length;_i32++){var _move=_curSet$moves4[_i32];
if(_move.substr(0,13)==='Hidden Power '){
_move=_move.substr(0,13)+'['+_move.substr(13)+']';
}
if(_move){
text+='- '+_move+"  \n";
}
}
}
text+="\n";
}
return text;
};return _class3;}())(
);

if(typeof require==='function'){

global.Dex=Dex;
global.toID=toID;
}
/**
 * Pokemon Showdown Dex Data
 *
 * A collection of data and definitions for src/battle-dex.ts.
 *
 * Larger data has their own files in data/, so this is just for small
 * miscellaneous data that doesn't need its own file.
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */






var BattleNatures={
Adamant:{
plus:'atk',
minus:'spa'
},
Bashful:{},
Bold:{
plus:'def',
minus:'atk'
},
Brave:{
plus:'atk',
minus:'spe'
},
Calm:{
plus:'spd',
minus:'atk'
},
Careful:{
plus:'spd',
minus:'spa'
},
Docile:{},
Gentle:{
plus:'spd',
minus:'def'
},
Hardy:{},
Hasty:{
plus:'spe',
minus:'def'
},
Impish:{
plus:'def',
minus:'spa'
},
Jolly:{
plus:'spe',
minus:'spa'
},
Lax:{
plus:'def',
minus:'spd'
},
Lonely:{
plus:'atk',
minus:'def'
},
Mild:{
plus:'spa',
minus:'def'
},
Modest:{
plus:'spa',
minus:'atk'
},
Naive:{
plus:'spe',
minus:'spd'
},
Naughty:{
plus:'atk',
minus:'spd'
},
Quiet:{
plus:'spa',
minus:'spe'
},
Quirky:{},
Rash:{
plus:'spa',
minus:'spd'
},
Relaxed:{
plus:'def',
minus:'spe'
},
Sassy:{
plus:'spd',
minus:'spe'
},
Serious:{},
Timid:{
plus:'spe',
minus:'atk'
}
};
var BattleStatIDs={
HP:'hp',
hp:'hp',
Atk:'atk',
atk:'atk',
Def:'def',
def:'def',
SpA:'spa',
SAtk:'spa',
SpAtk:'spa',
spa:'spa',
spc:'spa',
Spc:'spa',
SpD:'spd',
SDef:'spd',
SpDef:'spd',
spd:'spd',
Spe:'spe',
Spd:'spe',
spe:'spe'
};

var BattleStatNames={
hp:'HP',
atk:'Atk',
def:'Def',
spa:'SpA',
spd:'SpD',
spe:'Spe'
};

var BattleBaseSpeciesChart=[
"unown","burmy","shellos","gastrodon","deerling","sawsbuck","vivillon","flabebe","floette","florges","minior","alcremie","tatsugiri","pokestarufo","pokestarbrycenman","pokestarmt","pokestarmt2","pokestartransport","pokestargiant","pokestarhumanoid","pokestarmonster","pokestarf00","pokestarf002","pokestarspirit","pokestarblackdoor","pokestarwhitedoor","pokestarblackbelt"];


var BattlePokemonIconIndexes={

egg:1032+1,
pikachubelle:1032+2,
pikachulibre:1032+3,
pikachuphd:1032+4,
pikachupopstar:1032+5,
pikachurockstar:1032+6,
pikachucosplay:1032+7,
unownexclamation:1032+8,
unownquestion:1032+9,
unownb:1032+10,
unownc:1032+11,
unownd:1032+12,
unowne:1032+13,
unownf:1032+14,
unowng:1032+15,
unownh:1032+16,
unowni:1032+17,
unownj:1032+18,
unownk:1032+19,
unownl:1032+20,
unownm:1032+21,
unownn:1032+22,
unowno:1032+23,
unownp:1032+24,
unownq:1032+25,
unownr:1032+26,
unowns:1032+27,
unownt:1032+28,
unownu:1032+29,
unownv:1032+30,
unownw:1032+31,
unownx:1032+32,
unowny:1032+33,
unownz:1032+34,
castformrainy:1032+35,
castformsnowy:1032+36,
castformsunny:1032+37,
deoxysattack:1032+38,
deoxysdefense:1032+39,
deoxysspeed:1032+40,
burmysandy:1032+41,
burmytrash:1032+42,
wormadamsandy:1032+43,
wormadamtrash:1032+44,
cherrimsunshine:1032+45,
shelloseast:1032+46,
gastrodoneast:1032+47,
rotomfan:1032+48,
rotomfrost:1032+49,
rotomheat:1032+50,
rotommow:1032+51,
rotomwash:1032+52,
giratinaorigin:1032+53,
shayminsky:1032+54,
unfezantf:1032+55,
basculinbluestriped:1032+56,
darmanitanzen:1032+57,
deerlingautumn:1032+58,
deerlingsummer:1032+59,
deerlingwinter:1032+60,
sawsbuckautumn:1032+61,
sawsbucksummer:1032+62,
sawsbuckwinter:1032+63,
frillishf:1032+64,
jellicentf:1032+65,
tornadustherian:1032+66,
thundurustherian:1032+67,
landorustherian:1032+68,
kyuremblack:1032+69,
kyuremwhite:1032+70,
keldeoresolute:1032+71,
meloettapirouette:1032+72,
vivillonarchipelago:1032+73,
vivilloncontinental:1032+74,
vivillonelegant:1032+75,
vivillonfancy:1032+76,
vivillongarden:1032+77,
vivillonhighplains:1032+78,
vivillonicysnow:1032+79,
vivillonjungle:1032+80,
vivillonmarine:1032+81,
vivillonmodern:1032+82,
vivillonmonsoon:1032+83,
vivillonocean:1032+84,
vivillonpokeball:1032+85,
vivillonpolar:1032+86,
vivillonriver:1032+87,
vivillonsandstorm:1032+88,
vivillonsavanna:1032+89,
vivillonsun:1032+90,
vivillontundra:1032+91,
pyroarf:1032+92,
flabebeblue:1032+93,
flabebeorange:1032+94,
flabebewhite:1032+95,
flabebeyellow:1032+96,
floetteblue:1032+97,
floetteeternal:1032+98,
floetteorange:1032+99,
floettewhite:1032+100,
floetteyellow:1032+101,
florgesblue:1032+102,
florgesorange:1032+103,
florgeswhite:1032+104,
florgesyellow:1032+105,
furfroudandy:1032+106,
furfroudebutante:1032+107,
furfroudiamond:1032+108,
furfrouheart:1032+109,
furfroukabuki:1032+110,
furfroulareine:1032+111,
furfroumatron:1032+112,
furfroupharaoh:1032+113,
furfroustar:1032+114,
meowsticf:1032+115,
aegislashblade:1032+116,
xerneasneutral:1032+117,
hoopaunbound:1032+118,
rattataalola:1032+119,
raticatealola:1032+120,
raichualola:1032+121,
sandshrewalola:1032+122,
sandslashalola:1032+123,
vulpixalola:1032+124,
ninetalesalola:1032+125,
diglettalola:1032+126,
dugtrioalola:1032+127,
meowthalola:1032+128,
persianalola:1032+129,
geodudealola:1032+130,
graveleralola:1032+131,
golemalola:1032+132,
grimeralola:1032+133,
mukalola:1032+134,
exeggutoralola:1032+135,
marowakalola:1032+136,
greninjaash:1032+137,
zygarde10:1032+138,
zygardecomplete:1032+139,
oricoriopompom:1032+140,
oricoriopau:1032+141,
oricoriosensu:1032+142,
lycanrocmidnight:1032+143,
wishiwashischool:1032+144,
miniormeteor:1032+145,
miniororange:1032+146,
minioryellow:1032+147,
miniorgreen:1032+148,
miniorblue:1032+149,
miniorindigo:1032+150,
miniorviolet:1032+151,
magearnaoriginal:1032+152,
pikachuoriginal:1032+153,
pikachuhoenn:1032+154,
pikachusinnoh:1032+155,
pikachuunova:1032+156,
pikachukalos:1032+157,
pikachualola:1032+158,
pikachupartner:1032+159,
lycanrocdusk:1032+160,
necrozmaduskmane:1032+161,
necrozmadawnwings:1032+162,
necrozmaultra:1032+163,
pikachustarter:1032+164,
eeveestarter:1032+165,
meowthgalar:1032+166,
ponytagalar:1032+167,
rapidashgalar:1032+168,
farfetchdgalar:1032+169,
weezinggalar:1032+170,
mrmimegalar:1032+171,
corsolagalar:1032+172,
zigzagoongalar:1032+173,
linoonegalar:1032+174,
darumakagalar:1032+175,
darmanitangalar:1032+176,
darmanitangalarzen:1032+177,
yamaskgalar:1032+178,
stunfiskgalar:1032+179,
cramorantgulping:1032+180,
cramorantgorging:1032+181,
toxtricitylowkey:1032+182,
alcremierubycream:1032+183,
alcremiematchacream:1032+184,
alcremiemintcream:1032+185,
alcremielemoncream:1032+186,
alcremiesaltedcream:1032+187,
alcremierubyswirl:1032+188,
alcremiecaramelswirl:1032+189,
alcremierainbowswirl:1032+190,
eiscuenoice:1032+191,
indeedeef:1032+192,
morpekohangry:1032+193,
zaciancrowned:1032+194,
zamazentacrowned:1032+195,
slowpokegalar:1032+196,
slowbrogalar:1032+197,
zarudedada:1032+198,
pikachuworld:1032+199,
articunogalar:1032+200,
zapdosgalar:1032+201,
moltresgalar:1032+202,
slowkinggalar:1032+203,
calyrexice:1032+204,
calyrexshadow:1032+205,
growlithehisui:1032+206,
arcaninehisui:1032+207,
voltorbhisui:1032+208,
electrodehisui:1032+209,
typhlosionhisui:1032+210,
qwilfishhisui:1032+211,
sneaselhisui:1032+212,
samurotthisui:1032+213,
lilliganthisui:1032+214,
zoruahisui:1032+215,
zoroarkhisui:1032+216,
braviaryhisui:1032+217,
sliggoohisui:1032+218,
goodrahisui:1032+219,
avalugghisui:1032+220,
decidueyehisui:1032+221,
basculegionf:1032+222,
enamorustherian:1032+223,
taurospaldeacombat:1032+224,
taurospaldeablaze:1032+225,
taurospaldeaaqua:1032+226,
wooperpaldea:1032+227,
oinkolognef:1032+228,
palafinhero:1032+229,
mausholdfour:1032+230,
tatsugiridroopy:1032+231,
tatsugiristretchy:1032+232,
squawkabillyblue:1032+233,
squawkabillyyellow:1032+234,
squawkabillywhite:1032+235,
gimmighoulroaming:1032+236,
dialgaorigin:1032+237,
palkiaorigin:1032+238,
basculinwhitestriped:1032+239,
ursalunabloodmoon:1032+240,
ogerponwellspring:1032+241,
ogerponhearthflame:1032+242,
ogerponcornerstone:1032+243,
terapagosterastal:1032+244,
terapagosstellar:1032+245,

arceusbug:1032+246,
arceusdark:1032+247,
arceusdragon:1032+248,
arceuselectric:1032+249,
arceusfairy:1032+250,
arceusfighting:1032+251,
arceusfire:1032+252,
arceusflying:1032+253,
arceusghost:1032+254,
arceusgrass:1032+255,
arceusground:1032+256,
arceusice:1032+257,
arceuspoison:1032+258,
arceuspsychic:1032+259,
arceusrock:1032+260,
arceussteel:1032+261,
arceuswater:1032+262,

genesectdouse:1032+263,
genesectshock:1032+264,
genesectburn:1032+265,
genesectchill:1032+266,

silvallybug:1032+267,
silvallydark:1032+268,
silvallydragon:1032+269,
silvallyelectric:1032+270,
silvallyfairy:1032+271,
silvallyfighting:1032+272,
silvallyfire:1032+273,
silvallyflying:1032+274,
silvallyghost:1032+275,
silvallygrass:1032+276,
silvallyground:1032+277,
silvallyice:1032+278,
silvallypoison:1032+279,
silvallypsychic:1032+280,
silvallyrock:1032+281,
silvallysteel:1032+282,
silvallywater:1032+283,


greninjabond:658,
gumshoostotem:735,
raticatealolatotem:1032+120,
marowakalolatotem:1032+136,
araquanidtotem:752,
lurantistotem:754,
salazzletotem:758,
vikavolttotem:738,
togedemarutotem:777,
mimikyutotem:778,
mimikyubustedtotem:778,
ribombeetotem:743,
kommoototem:784,
sinisteaantique:854,
polteageistantique:855,
poltchageistartisan:1012,
sinistchamasterpiece:1013,
ogerpontealtera:1017,
ogerponwellspringtera:1032+241,
ogerponhearthflametera:1032+242,
ogerponcornerstonetera:1032+243,
toxtricitylowkeygmax:1320+69,


venusaurmega:1320+0,
charizardmegax:1320+1,
charizardmegay:1320+2,
blastoisemega:1320+3,
beedrillmega:1320+4,
pidgeotmega:1320+5,
alakazammega:1320+6,
slowbromega:1320+7,
gengarmega:1320+8,
kangaskhanmega:1320+9,
pinsirmega:1320+10,
gyaradosmega:1320+11,
aerodactylmega:1320+12,
mewtwomegax:1320+13,
mewtwomegay:1320+14,
ampharosmega:1320+15,
steelixmega:1320+16,
scizormega:1320+17,
heracrossmega:1320+18,
houndoommega:1320+19,
tyranitarmega:1320+20,
sceptilemega:1320+21,
blazikenmega:1320+22,
swampertmega:1320+23,
gardevoirmega:1320+24,
sableyemega:1320+25,
mawilemega:1320+26,
aggronmega:1320+27,
medichammega:1320+28,
manectricmega:1320+29,
sharpedomega:1320+30,
cameruptmega:1320+31,
altariamega:1320+32,
banettemega:1320+33,
absolmega:1320+34,
glaliemega:1320+35,
salamencemega:1320+36,
metagrossmega:1320+37,
latiasmega:1320+38,
latiosmega:1320+39,
kyogreprimal:1320+40,
groudonprimal:1320+41,
rayquazamega:1320+42,
lopunnymega:1320+43,
garchompmega:1320+44,
lucariomega:1320+45,
abomasnowmega:1320+46,
gallademega:1320+47,
audinomega:1320+48,
dianciemega:1320+49,
charizardgmax:1320+50,
butterfreegmax:1320+51,
pikachugmax:1320+52,
meowthgmax:1320+53,
machampgmax:1320+54,
gengargmax:1320+55,
kinglergmax:1320+56,
laprasgmax:1320+57,
eeveegmax:1320+58,
snorlaxgmax:1320+59,
garbodorgmax:1320+60,
melmetalgmax:1320+61,
corviknightgmax:1320+62,
orbeetlegmax:1320+63,
drednawgmax:1320+64,
coalossalgmax:1320+65,
flapplegmax:1320+66,
appletungmax:1320+67,
sandacondagmax:1320+68,
toxtricitygmax:1320+69,
centiskorchgmax:1320+70,
hatterenegmax:1320+71,
grimmsnarlgmax:1320+72,
alcremiegmax:1320+73,
copperajahgmax:1320+74,
duraludongmax:1320+75,
eternatuseternamax:1320+76,
venusaurgmax:1320+77,
blastoisegmax:1320+78,
rillaboomgmax:1320+79,
cinderacegmax:1320+80,
inteleongmax:1320+81,
urshifugmax:1320+82,
urshifurapidstrikegmax:1320+83,


syclant:1512+0,
revenankh:1512+1,
pyroak:1512+2,
fidgit:1512+3,
stratagem:1512+4,
arghonaut:1512+5,
kitsunoh:1512+6,
cyclohm:1512+7,
colossoil:1512+8,
krilowatt:1512+9,
voodoom:1512+10,
tomohawk:1512+11,
necturna:1512+12,
mollux:1512+13,
aurumoth:1512+14,
malaconda:1512+15,
cawmodore:1512+16,
volkraken:1512+17,
plasmanta:1512+18,
naviathan:1512+19,
crucibelle:1512+20,
crucibellemega:1512+21,
kerfluffle:1512+22,
pajantom:1512+23,
jumbao:1512+24,
caribolt:1512+25,
smokomodo:1512+26,
snaelstrom:1512+27,
equilibra:1512+28,
astrolotl:1512+29,
miasmaw:1512+30,
chromera:1512+31,
venomicon:1512+32,
venomiconepilogue:1512+33,
saharaja:1512+34,
hemogoblin:1512+35,
syclar:1512+36,
embirch:1512+37,
flarelm:1512+38,
breezi:1512+39,
scratchet:1512+40,
necturine:1512+41,
cupra:1512+42,
argalis:1512+43,
brattler:1512+44,
cawdet:1512+45,
volkritter:1512+46,
snugglow:1512+47,
floatoy:1512+48,
caimanoe:1512+49,
pluffle:1512+50,
rebble:1512+51,
tactite:1512+52,
privatyke:1512+53,
nohface:1512+54,
monohm:1512+55,
duohm:1512+56,
protowatt:1512+57,
voodoll:1512+58,
mumbao:1512+59,
fawnifer:1512+60,
electrelk:1512+61,
smogecko:1512+62,
smoguana:1512+63,
swirlpool:1512+64,
coribalis:1512+65,
justyke:1512+66,
solotl:1512+67,
miasmite:1512+68,
dorsoil:1512+69,
saharascal:1512+70,
ababo:1512+71,
scattervein:1512+72,
cresceidon:1512+73
};

var BattlePokemonIconIndexesLeft={
pikachubelle:1404+0,
pikachupopstar:1404+1,
clefairy:1404+2,
clefable:1404+3,
jigglypuff:1404+4,
wigglytuff:1404+5,
dugtrioalola:1404+6,
poliwhirl:1404+7,
poliwrath:1404+8,
mukalola:1404+9,
kingler:1404+10,
croconaw:1404+11,
cleffa:1404+12,
igglybuff:1404+13,
politoed:1404+14,
unownb:1404+15,
unownc:1404+16,
unownd:1404+17,
unowne:1404+18,
unownf:1404+19,
unowng:1404+20,
unownh:1404+21,
unownj:1404+22,
unownk:1404+23,
unownl:1404+24,
unownm:1404+25,
unownn:1404+26,
unownp:1404+27,
unownq:1404+28,
unownquestion:1404+29,
unownr:1404+30,
unowns:1404+31,
unownt:1404+32,
unownv:1404+33,
unownz:1404+34,
sneasel:1404+35,
teddiursa:1404+36,
roselia:1404+37,
zangoose:1404+38,
seviper:1404+39,
castformsnowy:1404+40,
absolmega:1404+41,
absol:1404+42,
regirock:1404+43,
torterra:1404+44,
budew:1404+45,
roserade:1404+46,
magmortar:1404+47,
togekiss:1404+48,
rotomwash:1404+49,
shayminsky:1404+50,
emboar:1404+51,
pansear:1404+52,
simisear:1404+53,
drilbur:1404+54,
excadrill:1404+55,
sawk:1404+56,
lilligant:1404+57,
garbodor:1404+58,
solosis:1404+59,
vanilluxe:1404+60,
amoonguss:1404+61,
klink:1404+62,
klang:1404+63,
klinklang:1404+64,
litwick:1404+65,
golett:1404+66,
golurk:1404+67,
kyuremblack:1404+68,
kyuremwhite:1404+69,
kyurem:1404+70,
keldeoresolute:1404+71,
meloetta:1404+72,
greninja:1404+73,
greninjabond:1404+73,
greninjaash:1404+74,
furfroudebutante:1404+75,
barbaracle:1404+76,
clauncher:1404+77,
clawitzer:1404+78,
sylveon:1404+79,
klefki:1404+80,
zygarde:1404+81,
zygarde10:1404+82,
zygardecomplete:1404+83,
dartrix:1404+84,
steenee:1404+85,
tsareena:1404+86,
comfey:1404+87,
miniormeteor:1404+88,
minior:1404+89,
miniororange:1404+90,
minioryellow:1404+91,
miniorgreen:1404+92,
miniorblue:1404+93,
miniorviolet:1404+94,
miniorindigo:1404+95,
dhelmise:1404+96,
necrozma:1404+97,
marshadow:1404+98,
pikachuoriginal:1404+99,
pikachupartner:1404+100,
necrozmaduskmane:1404+101,
necrozmadawnwings:1404+102,
necrozmaultra:1404+103,
stakataka:1404+104,
blacephalon:1404+105
};

var BattleAvatarNumbers={
1:'lucas',
2:'dawn',
3:'youngster-gen4dp',
4:'lass-gen4dp',
5:'camper',
6:'picnicker',
7:'bugcatcher-gen4dp',
8:'aromalady',
9:'twins-gen4dp',
10:'hiker-gen4',
11:'battlegirl-gen4',
12:'fisherman-gen4',
13:'cyclist-gen4',
14:'cyclistf-gen4',
15:'blackbelt-gen4dp',
16:'artist-gen4',
17:'pokemonbreeder-gen4',
18:'pokemonbreederf-gen4',
19:'cowgirl',
20:'jogger',
21:'pokefan-gen4',
22:'pokefanf-gen4',
23:'pokekid',
24:'youngcouple-gen4dp',
25:'acetrainer-gen4dp',
26:'acetrainerf-gen4dp',
27:'waitress-gen4',
28:'veteran-gen4',
29:'ninjaboy',
30:'dragontamer',
31:'birdkeeper-gen4dp',
32:'doubleteam',
33:'richboy-gen4',
34:'lady-gen4',
35:'gentleman-gen4dp',
36:'madame-gen4dp',
37:'beauty-gen4dp',
38:'collector',
39:'policeman-gen4',
40:'pokemonranger-gen4',
41:'pokemonrangerf-gen4',
42:'scientist-gen4dp',
43:'swimmer-gen4dp',
44:'swimmerf-gen4dp',
45:'tuber',
46:'tuberf',
47:'sailor',
48:'sisandbro',
49:'ruinmaniac',
50:'psychic-gen4',
51:'psychicf-gen4',
52:'gambler',
53:'guitarist-gen4',
54:'acetrainersnow',
55:'acetrainersnowf',
56:'skier',
57:'skierf-gen4dp',
58:'roughneck-gen4',
59:'clown',
60:'worker-gen4',
61:'schoolkid-gen4dp',
62:'schoolkidf-gen4',
63:'roark',
64:'barry',
65:'byron',
66:'aaron',
67:'bertha',
68:'flint',
69:'lucian',
70:'cynthia-gen4',
71:'bellepa',
72:'rancher',
73:'mars',
74:'galacticgrunt',
75:'gardenia',
76:'crasherwake',
77:'maylene',
78:'fantina',
79:'candice',
80:'volkner',
81:'parasollady-gen4',
82:'waiter-gen4dp',
83:'interviewers',
84:'cameraman',
85:'reporter',
86:'idol',
87:'cyrus',
88:'jupiter',
89:'saturn',
90:'galacticgruntf',
91:'argenta',
92:'palmer',
93:'thorton',
94:'buck',
95:'darach-caitlin',
96:'marley',
97:'mira',
98:'cheryl',
99:'riley',
100:'dahlia',
101:'ethan',
102:'lyra',
103:'twins-gen4',
104:'lass-gen4',
105:'acetrainer-gen4',
106:'acetrainerf-gen4',
107:'juggler',
108:'sage',
109:'li',
110:'gentleman-gen4',
111:'teacher',
112:'beauty',
113:'birdkeeper',
114:'swimmer-gen4',
115:'swimmerf-gen4',
116:'kimonogirl',
117:'scientist-gen4',
118:'acetrainercouple',
119:'youngcouple',
120:'supernerd',
121:'medium',
122:'schoolkid-gen4',
123:'blackbelt-gen4',
124:'pokemaniac',
125:'firebreather',
126:'burglar',
127:'biker-gen4',
128:'skierf',
129:'boarder',
130:'rocketgrunt',
131:'rocketgruntf',
132:'archer',
133:'ariana',
134:'proton',
135:'petrel',
136:'eusine',
137:'lucas-gen4pt',
138:'dawn-gen4pt',
139:'madame-gen4',
140:'waiter-gen4',
141:'falkner',
142:'bugsy',
143:'whitney',
144:'morty',
145:'chuck',
146:'jasmine',
147:'pryce',
148:'clair',
149:'will',
150:'koga',
151:'bruno',
152:'karen',
153:'lance',
154:'brock',
155:'misty',
156:'ltsurge',
157:'erika',
158:'janine',
159:'sabrina',
160:'blaine',
161:'blue',
162:'red',
163:'red',
164:'silver',
165:'giovanni',
166:'unknownf',
167:'unknown',
168:'unknown',
169:'hilbert',
170:'hilda',
171:'youngster',
172:'lass',
173:'schoolkid',
174:'schoolkidf',
175:'smasher',
176:'linebacker',
177:'waiter',
178:'waitress',
179:'chili',
180:'cilan',
181:'cress',
182:'nurseryaide',
183:'preschoolerf',
184:'preschooler',
185:'twins',
186:'pokemonbreeder',
187:'pokemonbreederf',
188:'lenora',
189:'burgh',
190:'elesa',
191:'clay',
192:'skyla',
193:'pokemonranger',
194:'pokemonrangerf',
195:'worker',
196:'backpacker',
197:'backpackerf',
198:'fisherman',
199:'musician',
200:'dancer',
201:'harlequin',
202:'artist',
203:'baker',
204:'psychic',
205:'psychicf',
206:'cheren',
207:'bianca',
208:'plasmagrunt-gen5bw',
209:'n',
210:'richboy',
211:'lady',
212:'pilot',
213:'workerice',
214:'hoopster',
215:'scientistf',
216:'clerkf',
217:'acetrainerf',
218:'acetrainer',
219:'blackbelt',
220:'scientist',
221:'striker',
222:'brycen',
223:'iris',
224:'drayden',
225:'roughneck',
226:'janitor',
227:'pokefan',
228:'pokefanf',
229:'doctor',
230:'nurse',
231:'hooligans',
232:'battlegirl',
233:'parasollady',
234:'clerk',
235:'clerk-boss',
236:'backers',
237:'backersf',
238:'veteran',
239:'veteranf',
240:'biker',
241:'infielder',
242:'hiker',
243:'madame',
244:'gentleman',
245:'plasmagruntf-gen5bw',
246:'shauntal',
247:'marshal',
248:'grimsley',
249:'caitlin',
250:'ghetsis-gen5bw',
251:'depotagent',
252:'swimmer',
253:'swimmerf',
254:'policeman',
255:'maid',
256:'ingo',
257:'alder',
258:'cyclist',
259:'cyclistf',
260:'cynthia',
261:'emmet',
262:'hilbert-wonderlauncher',
263:'hilda-wonderlauncher',
264:'hugh',
265:'rosa',
266:'nate',
267:'colress',
268:'beauty-gen5bw2',
269:'ghetsis',
270:'plasmagrunt',
271:'plasmagruntf',
272:'iris-gen5bw2',
273:'brycenman',
274:'shadowtriad',
275:'rood',
276:'zinzolin',
277:'cheren-gen5bw2',
278:'marlon',
279:'roxie',
280:'roxanne',
281:'brawly',
282:'wattson',
283:'flannery',
284:'norman',
285:'winona',
286:'tate',
287:'liza',
288:'juan',
289:'guitarist',
290:'steven',
291:'wallace',
292:'bellelba',
293:'benga',
294:'ash',
'#bw2elesa':'elesa-gen5bw2',
'#teamrocket':'teamrocket',
'#yellow':'yellow',
'#zinnia':'zinnia',
'#clemont':'clemont',
'#wally':'wally',
breeder:'pokemonbreeder',
breederf:'pokemonbreederf',
'hilbert-dueldisk':'hilbert-wonderlauncher',
'hilda-dueldisk':'hilda-wonderlauncher',
'nate-dueldisk':'nate-wonderlauncher',
'rosa-dueldisk':'rosa-wonderlauncher',

1001:'#1001',
1002:'#1002',
1003:'#1003',
1005:'#1005',
1010:'#1010'
};var
























PureEffect=





function PureEffect(id,name){this.effectType='PureEffect';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;
this.id=id;
this.name=name;
this.gen=0;
this.exists=false;
};var


Item=


























function Item(id,name,data){this.effectType='Item';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.num=void 0;this.spritenum=void 0;this.desc=void 0;this.shortDesc=void 0;this.megaStone=void 0;this.megaEvolves=void 0;this.zMove=void 0;this.zMoveType=void 0;this.zMoveFrom=void 0;this.zMoveUser=void 0;this.onPlate=void 0;this.onMemory=void 0;this.onDrive=void 0;this.fling=void 0;this.naturalGift=void 0;this.isPokeball=void 0;this.itemUser=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;

this.num=data.num||0;
this.spritenum=data.spritenum||0;
this.desc=data.desc||data.shortDesc||'';
this.shortDesc=data.shortDesc||this.desc;

this.megaStone=data.megaStone||'';
this.megaEvolves=data.megaEvolves||'';
this.zMove=data.zMove||null;
this.zMoveType=data.zMoveType||'';
this.zMoveFrom=data.zMoveFrom||'';
this.zMoveUser=data.zMoveUser||null;
this.onPlate=data.onPlate||'';
this.onMemory=data.onMemory||'';
this.onDrive=data.onDrive||'';
this.fling=data.fling||null;
this.naturalGift=data.naturalGift||null;
this.isPokeball=!!data.isPokeball;
this.itemUser=data.itemUser;

if(!this.gen){
if(this.num>=577){
this.gen=6;
}else if(this.num>=537){
this.gen=5;
}else if(this.num>=377){
this.gen=4;
}else{
this.gen=3;
}
}
};var


























































Move=









































function Move(id,name,data){var _this$maxMove;this.effectType='Move';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.basePower=void 0;this.accuracy=void 0;this.pp=void 0;this.type=void 0;this.category=void 0;this.priority=void 0;this.target=void 0;this.pressureTarget=void 0;this.flags=void 0;this.critRatio=void 0;this.desc=void 0;this.shortDesc=void 0;this.isNonstandard=void 0;this.isZ=void 0;this.zMove=void 0;this.isMax=void 0;this.maxMove=void 0;this.ohko=void 0;this.recoil=void 0;this.heal=void 0;this.multihit=void 0;this.hasCrashDamage=void 0;this.basePowerCallback=void 0;this.noPPBoosts=void 0;this.status=void 0;this.secondaries=void 0;this.noSketch=void 0;this.num=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;

this.basePower=data.basePower||0;
this.accuracy=data.accuracy||0;
this.pp=data.pp||1;
this.type=data.type||'???';
this.category=data.category||'Physical';
this.priority=data.priority||0;
this.target=data.target||'normal';
this.pressureTarget=data.pressureTarget||this.target;
this.flags=data.flags||{};
this.critRatio=data.critRatio===0?0:data.critRatio||1;


this.desc=data.desc;
this.shortDesc=data.shortDesc;
this.isNonstandard=data.isNonstandard||null;
this.isZ=data.isZ||'';
this.zMove=data.zMove||{};
this.ohko=data.ohko||null;
this.recoil=data.recoil||null;
this.heal=data.heal||null;
this.multihit=data.multihit||null;
this.hasCrashDamage=data.hasCrashDamage||false;
this.basePowerCallback=!!data.basePowerCallback;
this.noPPBoosts=data.noPPBoosts||false;
this.status=data.status||'';
this.secondaries=data.secondaries||(data.secondary?[data.secondary]:null);
this.noSketch=!!data.noSketch;

this.isMax=data.isMax||false;
this.maxMove=data.maxMove||{basePower:0};
if(this.category!=='Status'&&!((_this$maxMove=this.maxMove)!=null&&_this$maxMove.basePower)){
if(this.isZ||this.isMax){
this.maxMove={basePower:1};
}else if(!this.basePower){
this.maxMove={basePower:100};
}else if(['Fighting','Poison'].includes(this.type)){
if(this.basePower>=150){
this.maxMove={basePower:100};
}else if(this.basePower>=110){
this.maxMove={basePower:95};
}else if(this.basePower>=75){
this.maxMove={basePower:90};
}else if(this.basePower>=65){
this.maxMove={basePower:85};
}else if(this.basePower>=55){
this.maxMove={basePower:80};
}else if(this.basePower>=45){
this.maxMove={basePower:75};
}else{
this.maxMove={basePower:70};
}
}else{
if(this.basePower>=150){
this.maxMove={basePower:150};
}else if(this.basePower>=110){
this.maxMove={basePower:140};
}else if(this.basePower>=75){
this.maxMove={basePower:130};
}else if(this.basePower>=65){
this.maxMove={basePower:120};
}else if(this.basePower>=55){
this.maxMove={basePower:110};
}else if(this.basePower>=45){
this.maxMove={basePower:100};
}else{
this.maxMove={basePower:90};
}
}
}

if(this.category!=='Status'&&!this.isZ&&!this.isMax){
var basePower=this.basePower;
this.zMove={};
if(Array.isArray(this.multihit))basePower*=3;
if(!basePower){
this.zMove.basePower=100;
}else if(basePower>=140){
this.zMove.basePower=200;
}else if(basePower>=130){
this.zMove.basePower=195;
}else if(basePower>=120){
this.zMove.basePower=190;
}else if(basePower>=110){
this.zMove.basePower=185;
}else if(basePower>=100){
this.zMove.basePower=180;
}else if(basePower>=90){
this.zMove.basePower=175;
}else if(basePower>=80){
this.zMove.basePower=160;
}else if(basePower>=70){
this.zMove.basePower=140;
}else if(basePower>=60){
this.zMove.basePower=120;
}else{
this.zMove.basePower=100;
}
if(data.zMove)this.zMove.basePower=data.zMove.basePower;
}

this.num=data.num||0;
if(!this.gen){
if(this.num>=743){
this.gen=8;
}else if(this.num>=622){
this.gen=7;
}else if(this.num>=560){
this.gen=6;
}else if(this.num>=468){
this.gen=5;
}else if(this.num>=355){
this.gen=4;
}else if(this.num>=252){
this.gen=3;
}else if(this.num>=166){
this.gen=2;
}else if(this.num>=1){
this.gen=1;
}
}
};var





















Ability=















function Ability(id,name,data){this.effectType='Ability';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.num=void 0;this.shortDesc=void 0;this.desc=void 0;this.rating=void 0;this.flags=void 0;this.isNonstandard=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.num=data.num||0;
this.shortDesc=data.shortDesc||data.desc||'';
this.desc=data.desc||data.shortDesc||'';
this.rating=data.rating||1;
this.flags=data.flags||{};
this.isNonstandard=!!data.isNonstandard;
if(!this.gen){
if(this.num>=234){
this.gen=8;
}else if(this.num>=192){
this.gen=7;
}else if(this.num>=165){
this.gen=6;
}else if(this.num>=124){
this.gen=5;
}else if(this.num>=77){
this.gen=4;
}else if(this.num>=1){
this.gen=3;
}
}
};var


Species=

























































function Species(id,name,data){this.effectType='Species';this.id=void 0;this.name=void 0;this.gen=void 0;this.exists=void 0;this.baseSpecies=void 0;this.forme=void 0;this.formeid=void 0;this.spriteid=void 0;this.baseForme=void 0;this.num=void 0;this.types=void 0;this.abilities=void 0;this.baseStats=void 0;this.bst=void 0;this.weightkg=void 0;this.heightm=void 0;this.gender=void 0;this.color=void 0;this.genderRatio=void 0;this.eggGroups=void 0;this.tags=void 0;this.otherFormes=void 0;this.cosmeticFormes=void 0;this.evos=void 0;this.prevo=void 0;this.evoType=void 0;this.evoLevel=void 0;this.evoMove=void 0;this.evoItem=void 0;this.evoCondition=void 0;this.requiredItems=void 0;this.tier=void 0;this.isTotem=void 0;this.isMega=void 0;this.isPrimal=void 0;this.canGigantamax=void 0;this.cannotDynamax=void 0;this.forceTeraType=void 0;this.battleOnly=void 0;this.isNonstandard=void 0;this.unreleasedHidden=void 0;this.changesFrom=void 0;
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.baseSpecies=data.baseSpecies||name;
this.forme=data.forme||'';
var baseId=toID(this.baseSpecies);
this.formeid=baseId===this.id?'':'-'+toID(this.forme);
this.spriteid=baseId+this.formeid;
if(this.name==='Gardevoir-Void')this.spriteid='gardevoir';else
if(this.name==='Gardevoir-Void-Mega')this.spriteid='gardevoirvoid-mega';else
if(this.name==='Garchomp-Battle-Bond')this.spriteid='garchomp-battlebond';else
if(this.name==='Garchomp-Mega-Z')this.spriteid='garchomp-megaz';else
if(this.name==='Gardevoir-Mega-Z')this.spriteid='gardevoir-megaz';else
if(this.name==='Flygon-Mega-Z')this.spriteid='flygon-megaz';else
if(this.name.includes('Void'))this.spriteid=baseId+'void'+this.formeid;
if(this.spriteid.slice(-5)==='totem')this.spriteid=this.spriteid.slice(0,-5);
if(this.spriteid==='greninja-bond')this.spriteid='greninja';
if(this.spriteid.slice(-1)==='-')this.spriteid=this.spriteid.slice(0,-1);
this.baseForme=data.baseForme||'';

this.num=data.num||0;
this.types=data.types||['???'];
this.abilities=data.abilities||{0:"No Ability"};
this.baseStats=data.baseStats||{hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
this.bst=this.baseStats.hp+this.baseStats.atk+this.baseStats.def+
this.baseStats.spa+this.baseStats.spd+this.baseStats.spe;
this.weightkg=data.weightkg||0;

this.heightm=data.heightm||0;
this.gender=data.gender||'';
this.color=data.color||'';
this.genderRatio=data.genderRatio||null;
this.eggGroups=data.eggGroups||[];
this.tags=data.tags||[];

this.otherFormes=data.otherFormes||null;
this.cosmeticFormes=data.cosmeticFormes||null;
this.evos=data.evos||null;
this.prevo=data.prevo||'';
this.evoType=data.evoType||'';
this.evoLevel=data.evoLevel||0;
this.evoMove=data.evoMove||'';
this.evoItem=data.evoItem||'';
this.evoCondition=data.evoCondition||'';
this.requiredItems=data.requiredItems||(data.requiredItem?[data.requiredItem]:[]);
this.tier=data.tier||'';

this.isTotem=false;
this.isMega=!!(this.forme&&['-mega','-megax','-megay','-megaz'].includes(this.formeid));
this.isPrimal=!!(this.forme&&this.formeid==='-primal');
this.canGigantamax=!!data.canGigantamax;
this.cannotDynamax=!!data.cannotDynamax;
this.forceTeraType=data.forceTeraType||'';
this.battleOnly=data.battleOnly||undefined;
this.isNonstandard=data.isNonstandard||null;
this.unreleasedHidden=data.unreleasedHidden||false;
this.changesFrom=data.changesFrom||undefined;
if(!this.gen){
if(this.num>=906||this.formeid.startsWith('-paldea')){
this.gen=9;
}else if(this.num>=810||this.formeid.startsWith('-galar')||this.formeid.startsWith('-hisui')){
this.gen=8;
}else if(this.num>=722||this.formeid==='-alola'||this.formeid==='-starter'){
this.gen=7;
}else if(this.isMega||this.isPrimal){
this.gen=6;
this.battleOnly=this.baseSpecies;
}else if(this.formeid==='-totem'||this.formeid==='-alolatotem'){
this.gen=7;
this.isTotem=true;
}else if(this.num>=650){
this.gen=6;
}else if(this.num>=494){
this.gen=5;
}else if(this.num>=387){
this.gen=4;
}else if(this.num>=252){
this.gen=3;
}else if(this.num>=152){
this.gen=2;
}else if(this.num>=1){
this.gen=1;
}
}
};








if(typeof require==='function'){

global.BattleBaseSpeciesChart=BattleBaseSpeciesChart;
global.BattleNatures=BattleNatures;
global.PureEffect=PureEffect;
global.Species=Species;
global.Ability=Ability;
global.Item=Item;
global.Move=Move;
}
/**
 * Battle log
 *
 * An exercise in minimalism! This is a dependency of the client, which
 * requires IE9+ and uses Preact, and the replay player, which requires
 * IE7+ and uses jQuery. Therefore, this has to be compatible with IE7+
 * and use the DOM directly!
 *
 * Special thanks to PPK for QuirksMode.org, one of the few resources
 * available for how to do web development in these conditions.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var











BattleLog=function(){
























function BattleLog(elem,scene,innerElem){var _this=this;this.elem=void 0;this.innerElem=void 0;this.scene=null;this.preemptElem=null;this.atBottom=true;this.skippedLines=false;this.className=void 0;this.battleParser=null;this.joinLeave=null;this.lastRename=null;this.perspective=-1;this.























onScroll=function(){
var distanceFromBottom=_this.elem.scrollHeight-_this.elem.scrollTop-_this.elem.clientHeight;
_this.atBottom=distanceFromBottom<30;
};this.elem=elem;if(!innerElem){elem.setAttribute('role','log');elem.innerHTML='';innerElem=document.createElement('div');innerElem.className='inner message-log';elem.appendChild(innerElem);}this.innerElem=innerElem;if(scene){this.scene=scene;var preemptElem=document.createElement('div');preemptElem.className='inner-preempt message-log';elem.appendChild(preemptElem);this.preemptElem=preemptElem;this.battleParser=new BattleTextParser();}this.className=elem.className;elem.onscroll=this.onScroll;}var _proto=BattleLog.prototype;_proto.
reset=function reset(){
this.innerElem.innerHTML='';
this.atBottom=true;
this.skippedLines=false;
};_proto.
destroy=function destroy(){
this.elem.onscroll=null;
this.elem.innerHTML='';
};_proto.
addSeekEarlierButton=function addSeekEarlierButton(){var _this2=this;
if(this.skippedLines)return;
this.skippedLines=true;
var el=document.createElement('div');
el.className='chat';
el.innerHTML='<button class="button earlier-button"><i class="fa fa-caret-up"></i><br />Earlier messages</button>';
var button=el.getElementsByTagName('button')[0];
button==null||button.addEventListener==null||button.addEventListener('click',function(e){var _this2$scene;
e.preventDefault();
(_this2$scene=_this2.scene)==null||_this2$scene.battle.seekTurn(_this2.scene.battle.turn-100);
});
this.addNode(el);
};_proto.
add=function add(args,kwArgs,preempt){var _this$scene,_window$app,_window$app2,_this$scene2;
if(kwArgs!=null&&kwArgs.silent)return;
var battle=(_this$scene=this.scene)==null?void 0:_this$scene.battle;
if(battle!=null&&battle.seeking){
if(battle.stepQueue.length>2000){



if(
battle.seeking===Infinity?
battle.currentStep<battle.stepQueue.length-2000:
battle.turn<battle.seeking-100)
{
this.addSeekEarlierButton();
return;
}
}
}
var divClass='chat';
var divHTML='';
var noNotify;
if(!['join','j','leave','l'].includes(args[0]))this.joinLeave=null;
if(!['name','n'].includes(args[0]))this.lastRename=null;
switch(args[0]){
case'chat':case'c':case'c:':
var name;
var message;
if(args[0]==='c:'){
name=args[2];
message=args[3];
}else{
name=args[1];
message=args[2];
}
var rank=name.charAt(0);
if(battle!=null&&battle.ignoreSpects&&' +'.includes(rank))return;
if(battle!=null&&battle.ignoreOpponent){
if("\u2605\u2606".includes(rank)&&toUserid(name)!==app.user.get('userid'))return;
}
if((_window$app=window.app)!=null&&(_window$app=_window$app.ignore)!=null&&_window$app[toUserid(name)]&&" +\u2605\u2606".includes(rank))return;
var isHighlighted=(_window$app2=window.app)==null||(_window$app2=_window$app2.rooms)==null?void 0:_window$app2[battle.roomid].getHighlight(message);var _this$parseChatMessag=
this.parseChatMessage(message,name,'',isHighlighted);divClass=_this$parseChatMessag[0];divHTML=_this$parseChatMessag[1];noNotify=_this$parseChatMessag[2];
if(!noNotify&&isHighlighted){
var notifyTitle="Mentioned by "+name+" in "+battle.roomid;
app.rooms[battle.roomid].notifyOnce(notifyTitle,"\""+message+"\"",'highlight');
}
break;

case'join':case'j':case'leave':case'l':{
var user=BattleTextParser.parseNameParts(args[1]);
if(battle!=null&&battle.ignoreSpects&&' +'.includes(user.group))return;
var formattedUser=user.group+user.name;
var isJoin=args[0].charAt(0)==='j';
if(!this.joinLeave){
this.joinLeave={
joins:[],
leaves:[],
element:document.createElement('div')
};
this.joinLeave.element.className='chat';
}

if(isJoin&&this.joinLeave.leaves.includes(formattedUser)){
this.joinLeave.leaves.splice(this.joinLeave.leaves.indexOf(formattedUser),1);
}else{
this.joinLeave[isJoin?"joins":"leaves"].push(formattedUser);
}

var buf='';
if(this.joinLeave.joins.length){
buf+=this.textList(this.joinLeave.joins)+" joined";
}
if(this.joinLeave.leaves.length){
if(this.joinLeave.joins.length)buf+="; ";
buf+=this.textList(this.joinLeave.leaves)+" left";
}
this.joinLeave.element.innerHTML="<small>"+BattleLog.escapeHTML(buf)+"</small>";
(preempt?this.preemptElem:this.innerElem).appendChild(this.joinLeave.element);
return;
}

case'name':case'n':{
var _user=BattleTextParser.parseNameParts(args[1]);
if(toID(args[2])===toID(_user.name))return;
if(!this.lastRename||toID(this.lastRename.to)!==toID(_user.name)){
this.lastRename={
from:args[2],
to:'',
element:document.createElement('div')
};
this.lastRename.element.className='chat';
}
this.lastRename.to=_user.group+_user.name;
this.lastRename.element.innerHTML="<small>"+BattleLog.escapeHTML(this.lastRename.to)+" renamed from "+BattleLog.escapeHTML(this.lastRename.from)+".</small>";
(preempt?this.preemptElem:this.innerElem).appendChild(this.lastRename.element);
return;
}

case'chatmsg':case'':
divHTML=BattleLog.escapeHTML(args[1]);
break;

case'chatmsg-raw':case'raw':case'html':
divHTML=BattleLog.sanitizeHTML(args[1]);
break;

case'uhtml':case'uhtmlchange':
this.changeUhtml(args[1],args[2],args[0]==='uhtml');
return['',''];

case'error':case'inactive':case'inactiveoff':
divClass='chat message-error';
divHTML=BattleLog.escapeHTML(args[1]);
break;

case'bigerror':
this.message('<div class="broadcast-red">'+BattleLog.escapeHTML(args[1]).replace(/\|/g,'<br />')+'</div>');
return;

case'pm':
divHTML='<strong>'+BattleLog.escapeHTML(args[1])+':</strong> <span class="message-pm"><i style="cursor:pointer" onclick="selectTab(\'lobby\');rooms.lobby.popupOpen(\''+BattleLog.escapeHTML(args[2],true)+'\')">(Private to '+BattleLog.escapeHTML(args[3])+')</i> '+BattleLog.parseMessage(args[4])+'</span>';
break;

case'askreg':
this.addDiv('chat','<div class="broadcast-blue"><b>Register an account to protect your ladder rating!</b><br /><button name="register" value="'+BattleLog.escapeHTML(args[1])+'"><b>Register</b></button></div>');
return;

case'unlink':{

var _user2=toID(args[2])||toID(args[1]);
this.unlinkChatFrom(_user2);
if(args[2]){
var lineCount=parseInt(args[3],10);
this.hideChatFrom(_user2,true,lineCount);
}
return;
}

case'hidelines':{
var _user3=toID(args[2]);
this.unlinkChatFrom(_user3);
if(args[1]!=='unlink'){
var _lineCount=parseInt(args[3],10);
this.hideChatFrom(_user3,args[1]==='hide',_lineCount);
}
return;
}

case'debug':
divClass='debug';
divHTML='<div class="chat"><small style="color:#999">[DEBUG] '+BattleLog.escapeHTML(args[1])+'.</small></div>';
break;

case'notify':
var title=args[1];
var body=args[2];
var roomid=(_this$scene2=this.scene)==null?void 0:_this$scene2.battle.roomid;
if(!roomid)break;
app.rooms[roomid].notifyOnce(title,body,'highlight');
break;

case'showteam':{
if(!battle)return;
var team=Teams.unpack(args[2]);
if(!team.length)return;
var side=battle.getSide(args[1]);
var exportedTeam=team.map(function(set){
var buf=Teams["export"]([set],battle.gen).replace(/\n/g,'<br />');
if(set.name&&set.name!==set.species){
buf=buf.replace(set.name,BattleLog.sanitizeHTML("<span class=\"picon\" style=\""+Dex.getPokemonIcon(set.species)+"\"></span><br />"+set.name));
}else{
buf=buf.replace(set.species,"<span class=\"picon\" style=\""+Dex.getPokemonIcon(set.species)+"\"></span><br />"+set.species);
}
if(set.item){
buf=buf.replace(set.item,set.item+" <span class=\"itemicon\" style=\""+Dex.getItemIcon(set.item)+"\"></span>");
}
return buf;
}).join('');
divHTML="<div class=\"infobox\"><details><summary>Open Team Sheet for "+side.name+"</summary>"+exportedTeam+"</details></div>";
break;
}

case'seed':case'choice':case':':case'timer':case't:':
case'J':case'L':case'N':case'spectator':case'spectatorleave':
case'initdone':
return;

default:
this.addBattleMessage(args,kwArgs);
return;
}
if(divHTML)this.addDiv(divClass,divHTML,preempt);
};_proto.
addBattleMessage=function addBattleMessage(args,kwArgs){
switch(args[0]){
case'warning':
this.message('<strong>Warning:</strong> '+BattleLog.escapeHTML(args[1]));
this.message("Bug? Report it to <a href=\"http://www.smogon.com/forums/showthread.php?t=3453192\">the replay viewer's Smogon thread</a>");
if(this.scene)this.scene.wait(1000);
return;

case'variation':
this.addDiv('','<small>Variation: <em>'+BattleLog.escapeHTML(args[1])+'</em></small>');
break;

case'rule':
var ruleArgs=args[1].split(': ');
this.addDiv('','<small><em>'+BattleLog.escapeHTML(ruleArgs[0])+(ruleArgs[1]?':':'')+'</em> '+BattleLog.escapeHTML(ruleArgs[1]||'')+'</small>');
break;

case'rated':
this.addDiv('rated','<strong>'+(BattleLog.escapeHTML(args[1])||'Rated battle')+'</strong>');
break;

case'tier':
this.addDiv('','<small>Format:</small> <br /><strong>'+BattleLog.escapeHTML(args[1])+'</strong>');
break;

case'turn':
var h2elem=document.createElement('h2');
h2elem.className='battle-history';
var turnMessage;
if(this.battleParser){
turnMessage=this.battleParser.parseArgs(args,{}).trim();
if(!turnMessage.startsWith('==')||!turnMessage.endsWith('==')){
throw new Error("Turn message must be a heading.");
}
turnMessage=turnMessage.slice(2,-2).trim();
this.battleParser.curLineSection='break';
}else{
turnMessage="Turn "+args[1];
}
h2elem.innerHTML=BattleLog.escapeHTML(turnMessage);
this.addSpacer();
this.addNode(h2elem);
break;

default:
var line=null;
if(this.battleParser){
line=this.battleParser.parseArgs(args,kwArgs||{},true);
}
if(line===null){
this.addDiv('chat message-error','Unrecognized: |'+BattleLog.escapeHTML(args.join('|')));
return;
}
if(!line)return;
this.message.apply(this,this.parseLogMessage(line));
break;
}
};_proto.
textList=function textList(list){
var message='';
var listNoDuplicates=[];for(var _i2=0,_list2=
list;_i2<_list2.length;_i2++){var user=_list2[_i2];
if(!listNoDuplicates.includes(user))listNoDuplicates.push(user);
}
list=listNoDuplicates;

if(list.length===1)return list[0];
if(list.length===2)return list[0]+" and "+list[1];
for(var i=0;i<list.length-1;i++){
if(i>=5){
return message+"and "+(list.length-5)+" others";
}
message+=list[i]+", ";
}
return message+"and "+list[list.length-1];
return message;
};_proto.




parseLogMessage=function parseLogMessage(message){
var messages=message.split('\n').map(function(line){
line=BattleLog.escapeHTML(line);
line=line.replace(/\*\*(.*)\*\*/,'<strong>$1</strong>');
line=line.replace(/\|\|([^\|]*)\|\|([^\|]*)\|\|/,'<abbr title="$1">$2</abbr>');
if(line.startsWith('  '))line='<small>'+line.trim()+'</small>';
return line;
});
return[
messages.join('<br />'),
messages.filter(function(line){return!line.startsWith('<small>[');}).join('<br />')];

};_proto.
message=function message(_message){var sceneMessage=arguments.length>1&&arguments[1]!==undefined?arguments[1]:_message;
if(this.scene)this.scene.message(sceneMessage);
this.addDiv('battle-history',_message);
};_proto.
addNode=function addNode(node,preempt){
(preempt?this.preemptElem:this.innerElem).appendChild(node);
if(this.atBottom){
this.elem.scrollTop=this.elem.scrollHeight;
}
};_proto.
updateScroll=function updateScroll(){
if(this.atBottom){
this.elem.scrollTop=this.elem.scrollHeight;
}
};_proto.
addDiv=function addDiv(className,innerHTML,preempt){
var el=document.createElement('div');
el.className=className;
el.innerHTML=innerHTML;
this.addNode(el,preempt);
};_proto.
prependDiv=function prependDiv(className,innerHTML,preempt){
var el=document.createElement('div');
el.className=className;
el.innerHTML=innerHTML;
if(this.innerElem.childNodes.length){
this.innerElem.insertBefore(el,this.innerElem.childNodes[0]);
}else{
this.innerElem.appendChild(el);
}
this.updateScroll();
};_proto.
addSpacer=function addSpacer(){
this.addDiv('spacer battle-history','<br />');
};_proto.
changeUhtml=function changeUhtml(id,htmlSrc,forceAdd){
id=toID(id);
var classContains=' uhtml-'+id+' ';
var elements=[];for(var _i4=0,_this$innerElem$child2=
this.innerElem.childNodes;_i4<_this$innerElem$child2.length;_i4++){var node=_this$innerElem$child2[_i4];
if(node.className&&(' '+node.className+' ').includes(classContains)){
elements.push(node);
}
}
if(this.preemptElem){for(var _i6=0,_this$preemptElem$chi2=
this.preemptElem.childNodes;_i6<_this$preemptElem$chi2.length;_i6++){var _node=_this$preemptElem$chi2[_i6];
if(_node.className&&(' '+_node.className+' ').includes(classContains)){
elements.push(_node);
}
}
}
if(htmlSrc&&elements.length&&!forceAdd){for(var _i8=0;_i8<
elements.length;_i8++){var element=elements[_i8];
element.innerHTML=BattleLog.sanitizeHTML(htmlSrc);
}
this.updateScroll();
return;
}for(var _i0=0;_i0<
elements.length;_i0++){var _element=elements[_i0];
_element.parentElement.removeChild(_element);
}
if(!htmlSrc)return;
if(forceAdd){
this.addDiv('notice uhtml-'+id,BattleLog.sanitizeHTML(htmlSrc));
}else{
this.prependDiv('notice uhtml-'+id,BattleLog.sanitizeHTML(htmlSrc));
}
};_proto.
hideChatFrom=function hideChatFrom(userid){var showRevealButton=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var lineCount=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;
var classStart='chat chatmessage-'+userid+' ';
var nodes=[];for(var _i10=0,_this$innerElem$child4=
this.innerElem.childNodes;_i10<_this$innerElem$child4.length;_i10++){var node=_this$innerElem$child4[_i10];
if(node.className&&(node.className+' ').startsWith(classStart)){
nodes.push(node);
}
}
if(this.preemptElem){for(var _i12=0,_this$preemptElem$chi4=
this.preemptElem.childNodes;_i12<_this$preemptElem$chi4.length;_i12++){var _node2=_this$preemptElem$chi4[_i12];
if(_node2.className&&(_node2.className+' ').startsWith(classStart)){
nodes.push(_node2);
}
}
}
if(lineCount)nodes=nodes.slice(-lineCount);for(var _i14=0,_nodes2=

nodes;_i14<_nodes2.length;_i14++){var _node3=_nodes2[_i14];
_node3.style.display='none';
_node3.className='revealed '+_node3.className;
}
if(!nodes.length||!showRevealButton)return;
var button=document.createElement('button');
button.name='toggleMessages';
button.value=userid;
button.className='subtle';
button.innerHTML="<small>("+nodes.length+" line"+(nodes.length>1?'s':'')+" from "+userid+" hidden)</small>";
var lastNode=nodes[nodes.length-1];
lastNode.appendChild(document.createTextNode(' '));
lastNode.appendChild(button);
};BattleLog.

unlinkNodeList=function unlinkNodeList(nodeList,classStart){for(var _i16=0;_i16<
nodeList.length;_i16++){var node=nodeList[_i16];
if(node.className&&(node.className+' ').startsWith(classStart)){
var linkList=node.getElementsByTagName('a');

for(var i=linkList.length-1;i>=0;i--){
var linkNode=linkList[i];
var parent=linkNode.parentElement;
if(!parent)continue;for(var _i18=0,_linkNode$childNodes2=
linkNode.childNodes;_i18<_linkNode$childNodes2.length;_i18++){var childNode=_linkNode$childNodes2[_i18];
parent.insertBefore(childNode,linkNode);
}
parent.removeChild(linkNode);
}
}
}
};_proto.

unlinkChatFrom=function unlinkChatFrom(userid){
var classStart='chat chatmessage-'+userid+' ';
var innerNodeList=this.innerElem.childNodes;
BattleLog.unlinkNodeList(innerNodeList,classStart);

if(this.preemptElem){
var preemptNodeList=this.preemptElem.childNodes;
BattleLog.unlinkNodeList(preemptNodeList,classStart);
}
};_proto.

preemptCatchup=function preemptCatchup(){
if(!this.preemptElem.firstChild)return;
this.innerElem.appendChild(this.preemptElem.firstChild);
};BattleLog.

escapeFormat=function escapeFormat(formatid){
var atIndex=formatid.indexOf('@@@');
if(atIndex>=0){
return this.escapeFormat(formatid.slice(0,atIndex))+
'<br />Custom rules: '+this.escapeHTML(formatid.slice(atIndex+3));
}
if(window.BattleFormats&&BattleFormats[formatid]){
return this.escapeHTML(BattleFormats[formatid].name);
}
if(window.NonBattleGames&&NonBattleGames[formatid]){
return this.escapeHTML(NonBattleGames[formatid]);
}
return this.escapeHTML(formatid);
};BattleLog.

escapeHTML=function escapeHTML(str,jsEscapeToo){
if(typeof str!=='string')return'';
str=str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
if(jsEscapeToo)str=str.replace(/\\/g,'\\\\').replace(/'/g,'\\\'');
return str;
};BattleLog.

unescapeHTML=function unescapeHTML(str){
str=str?''+str:'';
return str.replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
};BattleLog.



hashColor=function hashColor(name){
return"color:"+this.usernameColor(name)+";";
};BattleLog.

generateRandomString=function generateRandomString(length){
var result='';
var characters=
'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var charactersLength=characters.length;
for(var i=0;i<length;i++){
result+=characters.charAt(Math.floor(Math.random()*charactersLength));
}
return result;
};BattleLog.

usernameColor=function usernameColor(name){
if(this.colorCache[name])return this.colorCache[name];
var saltedName=name+this.generateRandomString(5);
var hash;
if(Config.customcolors[name]){
hash=MD5(Config.customcolors[name]);
}else{
hash=MD5(saltedName);
}
var H=parseInt(hash.substr(4,4),16)%360;
var S=parseInt(hash.substr(0,4),16)%101;
var L=Math.min(Math.floor(parseInt(hash.substr(8,4),16)%101),70);
var _this$HSLToRGB=this.HSLToRGB(H,S,L),r=_this$HSLToRGB.R,g=_this$HSLToRGB.G,b=_this$HSLToRGB.B;
var toHex=function(x){
var hex=Math.round(x*255).toString(16);
return hex.length===1?'0'+hex:hex;
};
this.colorCache[name]="#"+toHex(r)+toHex(g)+toHex(b);
return this.colorCache[name];
};BattleLog.

HSLToRGB=function HSLToRGB(H,S,L){
var C=(100-Math.abs(2*L-100))*S/100/100;
var X=C*(1-Math.abs(H/60%2-1));
var m=L/100-C/2;

var R1;
var G1;
var B1;
switch(Math.floor(H/60)){
case 1:R1=X;G1=C;B1=0;break;
case 2:R1=0;G1=C;B1=X;break;
case 3:R1=0;G1=X;B1=C;break;
case 4:R1=X;G1=0;B1=C;break;
case 5:R1=C;G1=0;B1=X;break;
case 0:default:R1=C;G1=X;B1=0;break;
}
var R=R1+m;
var G=G1+m;
var B=B1+m;
return{R:R,G:G,B:B};
};BattleLog.

prefs=function prefs(name){var _window$Storage;

if((_window$Storage=window.Storage)!=null&&_window$Storage.prefs)return Storage.prefs(name);

if(window.PS)return PS.prefs[name];
return undefined;
};_proto.

parseChatMessage=function parseChatMessage(
message,name,timestamp,isHighlighted)
{var _BattleLog$prefs,_window$app3,_window$PS;
var showMe=!((_BattleLog$prefs=BattleLog.prefs('chatformatting'))!=null&&_BattleLog$prefs.hideme);
var group=' ';
if(!/[A-Za-z0-9]/.test(name.charAt(0))){

group=name.charAt(0);
name=name.substr(1);
}
var colorStyle=" style=\"color:"+BattleLog.usernameColor(toID(name))+"\"";
var clickableName="<small>"+BattleLog.escapeHTML(group)+"</small><span class=\"username\" data-name=\""+BattleLog.escapeHTML(name)+"\">"+BattleLog.escapeHTML(name)+"</span>";
var hlClass=isHighlighted?' highlighted':'';
var isMine=((_window$app3=window.app)==null||(_window$app3=_window$app3.user)==null?void 0:_window$app3.get('name'))===name||((_window$PS=window.PS)==null?void 0:_window$PS.user.name)===name;
var mineClass=isMine?' mine':'';

var cmd='';
var target='';
if(message.charAt(0)==='/'){
if(message.charAt(1)==='/'){
message=message.slice(1);
}else{
var spaceIndex=message.indexOf(' ');
cmd=spaceIndex>=0?message.slice(1,spaceIndex):message.slice(1);
if(spaceIndex>=0)target=message.slice(spaceIndex+1);
}
}

switch(cmd){
case'me':
case'mee':
var parsedMessage=BattleLog.parseMessage(' '+target);
if(cmd==='mee')parsedMessage=parsedMessage.slice(1);
if(!showMe){
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <em>/me"+parsedMessage+"</em>"];

}
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<em><i><strong"+colorStyle+">&bull; "+clickableName+"</strong>"+parsedMessage+"</i></em>"];

case'invite':
var roomid=toRoomid(target);
return[
'chat',
timestamp+"<em>"+clickableName+" invited you to join the room \""+roomid+"\"</em>' +\n\t\t\t\t'<div class=\"notice\"><button name=\"joinRoom\" value=\""+
roomid+"\">Join "+roomid+"</button></div>"];

case'announce':
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <span class=\"message-announce\">"+BattleLog.parseMessage(target)+"</span>"];

case'log':
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<span class=\"message-log\">"+BattleLog.parseMessage(target)+"</span>"];

case'data-pokemon':
case'data-item':
case'data-ability':
case'data-move':
return['chat message-error','[outdated code no longer supported]'];
case'text':
return['chat',BattleLog.parseMessage(target)];
case'error':
return['chat message-error',formatText(target,true)];
case'html':
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <em>"+BattleLog.sanitizeHTML(target)+"</em>"];

case'uhtml':
case'uhtmlchange':
var parts=target.split(',');
var htmlSrc=parts.slice(1).join(',').trim();
this.changeUhtml(parts[0],htmlSrc,cmd==='uhtml');
return['',''];
case'raw':
return['chat',BattleLog.sanitizeHTML(target)];
case'nonotify':
return['chat',BattleLog.sanitizeHTML(target),true];
default:

if(!name){
return[
'chat'+hlClass,
timestamp+"<em>"+BattleLog.parseMessage(message)+"</em>"];

}
return[
'chat chatmessage-'+toID(name)+hlClass+mineClass,
timestamp+"<strong"+colorStyle+">"+clickableName+":</strong> <em>"+BattleLog.parseMessage(message)+"</em>"];

}
};BattleLog.

parseMessage=function parseMessage(str){var isTrusted=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;

if(str.substr(0,3)==='>> '||str.substr(0,4)==='>>> ')return this.escapeHTML(str);

if(str.substr(0,3)==='<< ')return this.escapeHTML(str);
str=formatText(str,isTrusted);

var options=BattleLog.prefs('chatformatting')||{};

if(options.hidelinks){
str=str.replace(/<a[^>]*>/g,'<u>').replace(/<\/a>/g,'</u>');
}
if(options.hidespoiler){
str=str.replace(/<span class="spoiler">/g,'<span class="spoiler spoiler-shown">');
}
if(options.hidegreentext){
str=str.replace(/<span class="greentext">/g,'<span>');
}

return str;
};BattleLog.


























initSanitizeHTML=function initSanitizeHTML(){var _this3=this;
if(this.tagPolicy)return;
if(!('html4'in window)){
throw new Error('sanitizeHTML requires caja');
}



Object.assign(html4.ELEMENTS,{
marquee:0,
blink:0,
psicon:html4.eflags['OPTIONAL_ENDTAG']|html4.eflags['EMPTY'],
username:0,
spotify:0,
youtube:0,
formatselect:0,
copytext:0,
twitch:0
});



Object.assign(html4.ATTRIBS,{

'marquee::behavior':0,
'marquee::bgcolor':0,
'marquee::direction':0,
'marquee::height':0,
'marquee::hspace':0,
'marquee::loop':0,
'marquee::scrollamount':0,
'marquee::scrolldelay':0,
'marquee::truespeed':0,
'marquee::vspace':0,
'marquee::width':0,
'psicon::pokemon':0,
'psicon::item':0,
'psicon::type':0,
'selectformat::type':0,
'psicon::category':0,
'username::name':0,
'form::data-submitsend':0,
'formatselect::format':0,
'div::data-server':0,
'button::data-send':0,
'form::data-delimiter':0,
'button::data-delimiter':0,
'*::aria-label':0,
'*::aria-hidden':0
});



















this.tagPolicy=function(tagName,attribs){
if(html4.ELEMENTS[tagName]&html4.eflags['UNSAFE']){
return;
}

function getAttrib(key){
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]===key){
return attribs[i+1];
}
}
return undefined;
}
function setAttrib(key,value){
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]===key){
attribs[i+1]=value;
return;
}
}
attribs.push(key,value);
}
function deleteAttrib(key){
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]===key){
attribs.splice(i,2);
return;
}
}
}

var dataUri='';
var targetReplace=false;

if(tagName==='a'){
if(getAttrib('target')==='replace'){
targetReplace=true;
}
}else if(tagName==='img'){
var src=getAttrib('src')||'';
if(src.startsWith('data:image/')){
dataUri=src;
}
if(src.startsWith('//')){
if(location.protocol!=='http:'&&location.protocol!=='https:'){

setAttrib('src','https:'+src);
}
}
}else if(tagName==='twitch'){var _exec;

var _src=getAttrib('src')||"";
var channelId=(_exec=/(https?:\/\/)?twitch.tv\/([A-Za-z0-9]+)/i.exec(_src))==null?void 0:_exec[2];
var height=parseInt(getAttrib('height')||"",10)||400;
var width=parseInt(getAttrib('width')||"",10)||340;
return{
tagName:'iframe',
attribs:[
'src',"https://player.twitch.tv/?channel="+channelId+"&parent="+location.hostname+"&autoplay=false",
'allowfullscreen','true','height',""+height,'width',""+width]

};
}else if(tagName==='username'){

tagName='strong';
var color=_this3.usernameColor(toID(getAttrib('name')));
var style=getAttrib('style');
setAttrib('style',style+";color:"+color);
}else if(tagName==='spotify'){var _exec2;

var _src2=getAttrib('src')||'';
var songId=(_exec2=/(?:\?v=|\/track\/)([A-Za-z0-9]+)/.exec(_src2))==null?void 0:_exec2[1];

return{
tagName:'iframe',
attribs:['src',"https://open.spotify.com/embed/track/"+songId,'width','300','height','380','frameborder','0','allowtransparency','true','allow','encrypted-media']
};
}else if(tagName==='youtube'){var _exec3,_exec4;


var _src3=getAttrib('src')||'';

var _width=getAttrib('width')||'0';
var _height=getAttrib('height')||'0';
if(Number(_width)<200){
_width=window.innerWidth>=400?'400':'320';
}
if(Number(_height)<200){
_height=window.innerWidth>=400?'225':'200';
}
var videoId=(_exec3=/(?:\?v=|\/embed\/)([A-Za-z0-9_\-]+)/.exec(_src3))==null?void 0:_exec3[1];
if(!videoId)return{tagName:'img',attribs:['alt',"invalid src for <youtube>"]};

var time=(_exec4=/(?:\?|&)(?:t|start)=([0-9]+)/.exec(_src3))==null?void 0:_exec4[1];
_this3.players.push(null);
var idx=_this3.players.length;
_this3.initYoutubePlayer(idx);
return{
tagName:'iframe',
attribs:[
'id',"youtube-iframe-"+idx,
'width',_width,'height',_height,
'src',"https://www.youtube.com/embed/"+videoId+"?enablejsapi=1&playsinline=1"+(time?"&start="+time:''),
'frameborder','0','allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture','allowfullscreen','allowfullscreen',
'time',(time||0)+""]

};
}else if(tagName==='formatselect'){
return{
tagName:'button',
attribs:[
'type','selectformat',
'class',"select formatselect",
'value',getAttrib('format')||getAttrib('value')||'',
'name',getAttrib('name')||'']

};
}else if(tagName==='copytext'){
return{
tagName:'button',
attribs:[
'type',getAttrib('type'),
'class',getAttrib('class')||'button',
'value',getAttrib('value'),
'name','copyText']

};
}else if(tagName==='psicon'){


var iconType=null;
var iconValue=null;
for(var i=0;i<attribs.length-1;i+=2){
if(attribs[i]==='pokemon'||attribs[i]==='item'||attribs[i]==='type'||attribs[i]==='category'){var _attribs$slice=
attribs.slice(i,i+2);iconType=_attribs$slice[0];iconValue=_attribs$slice[1];
break;
}
}
tagName='span';

if(iconType){
var className=getAttrib('class');
var _style=getAttrib('style');

if(iconType==='pokemon'){
setAttrib('class','picon'+(className?' '+className:''));
setAttrib('style',Dex.getPokemonIcon(iconValue)+(_style?'; '+_style:''));
}else if(iconType==='item'){
setAttrib('class','itemicon'+(className?' '+className:''));
setAttrib('style',Dex.getItemIcon(iconValue)+(_style?'; '+_style:''));
}else if(iconType==='type'){
tagName=Dex.getTypeIcon(iconValue).slice(1,-3);
}else if(iconType==='category'){
tagName=Dex.getCategoryIcon(iconValue).slice(1,-3);
}
}
}

attribs=html.sanitizeAttribs(tagName,attribs,function(urlData){
if(urlData.scheme_==='geo'||urlData.scheme_==='sms'||urlData.scheme_==='tel')return null;
return urlData;
});

if(dataUri&&tagName==='img'){
setAttrib('src',dataUri);
}
if(tagName==='a'||tagName==='form'&&!getAttrib('data-submitsend')){
if(targetReplace){
setAttrib('data-target','replace');
deleteAttrib('target');
}else{
setAttrib('target','_blank');
}
if(tagName==='a'){
setAttrib('rel','noopener');
}
}
return{tagName:tagName,attribs:attribs};
};
};BattleLog.
localizeTime=function localizeTime(full,date,time,timezone){var _Intl;
var parsedTime=new Date(date+'T'+time+(timezone||'Z').toUpperCase());



if(!parsedTime.getTime())return full;

var formattedTime;

if((_Intl=window.Intl)!=null&&_Intl.DateTimeFormat){
formattedTime=new Intl.DateTimeFormat(undefined,{
month:'long',day:'numeric',hour:'numeric',minute:'numeric'
}).format(parsedTime);
}else{


formattedTime=parsedTime.toLocaleString();
}
return'<time>'+BattleLog.escapeHTML(formattedTime)+'</time>';
};BattleLog.
sanitizeHTML=function sanitizeHTML(input){
if(typeof input!=='string')return'';

this.initSanitizeHTML();

input=input.replace(/<username([^>]*)>([^<]*)<\/username>/gi,function(match,attrs,username){
if(/\bname\s*=\s*"/.test(attrs))return match;
var escapedUsername=username.replace(/"/g,'&quot;').replace(/>/g,'&gt;');
return"<username"+attrs+" name=\""+escapedUsername+"\">"+username+"</username>";
});



var sanitized=html.sanitizeWithPolicy(input,this.tagPolicy);
















return sanitized.replace(
/<time>\s*([+-]?\d{4,}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?)(Z|[+-]\d{2}:\d{2})?\s*<\/time>/ig,
this.localizeTime);
};BattleLog.

initYoutubePlayer=function initYoutubePlayer(idx){var _this4=this;
var id="youtube-iframe-"+idx;
var loadPlayer=function(){
var el=$("#"+id);
if(!el.length)return;
var player=new window.YT.Player(id,{
events:{
onStateChange:function(event){
if(event.data===window.YT.PlayerState.PLAYING){for(var _i20=0,_BattleLog$players2=
BattleLog.players;_i20<_BattleLog$players2.length;_i20++){var curPlayer=_BattleLog$players2[_i20];
if(player===curPlayer)continue;
curPlayer==null||curPlayer.pauseVideo==null||curPlayer.pauseVideo();
}
}
}
}
});
var time=Number(el.attr('time'));
if(time){
player.seekTo(time);
}
_this4.players[idx-1]=player;

};

this.ensureYoutube().then(function(){
setTimeout(function(){return loadPlayer();},300);
});
};BattleLog.

ensureYoutube=function ensureYoutube(){
if(this.ytLoading)return this.ytLoading;

this.ytLoading=new Promise(function(resolve){
var el=document.createElement('script');
el.type='text/javascript';
el.async=true;
el.src='https://youtube.com/iframe_api';
el.onload=function(){


var loopCheck=function(){var _window$YT;
if(!((_window$YT=window.YT)!=null&&_window$YT.Player)){
setTimeout(function(){return loopCheck();},300);
}else{
resolve();
}
};
loopCheck();
};
document.body.appendChild(el);
});
return this.ytLoading;
};BattleLog.


























createReplayFile=function createReplayFile(room){
var battle=room.battle;
var replayid=room.id;
if(replayid){var _window$Config;

replayid=replayid.slice(7);
if(((_window$Config=window.Config)==null?void 0:_window$Config.server.id)!=='showdown'){var _window$Config2;
if(!((_window$Config2=window.Config)!=null&&_window$Config2.server.registered)){
replayid='unregisteredserver-'+replayid;
}else{
replayid=Config.server.id+'-'+replayid;
}
}
}else if(room.fragment){

replayid=room.fragment;
}else{
replayid=battle.id;
}

battle.seekTurn(Infinity);
if(!battle.atQueueEnd)return null;
var buf='<!DOCTYPE html>\n';
buf+='<meta charset="utf-8" />\n';
buf+='<!-- version 1 -->\n';
buf+="<title>"+BattleLog.escapeHTML(battle.tier)+" replay: "+BattleLog.escapeHTML(battle.p1.name)+" vs. "+BattleLog.escapeHTML(battle.p2.name)+"</title>\n";

buf+='<style>\n';
buf+='html,body {font-family:Verdana, sans-serif;font-size:10pt;margin:0;padding:0;}body{padding:12px 0;} .battle-log {font-family:Verdana, sans-serif;font-size:10pt;} .battle-log-inline {border:1px solid #AAAAAA;background:#EEF2F5;color:black;max-width:640px;margin:0 auto 80px;padding-bottom:5px;} .battle-log .inner {padding:4px 8px 0px 8px;} .battle-log .inner-preempt {padding:0 8px 4px 8px;} .battle-log .inner-after {margin-top:0.5em;} .battle-log h2 {margin:0.5em -8px;padding:4px 8px;border:1px solid #AAAAAA;background:#E0E7EA;border-left:0;border-right:0;font-family:Verdana, sans-serif;font-size:13pt;} .battle-log .chat {vertical-align:middle;padding:3px 0 3px 0;font-size:8pt;} .battle-log .chat strong {color:#40576A;} .battle-log .chat em {padding:1px 4px 1px 3px;color:#000000;font-style:normal;} .chat.mine {background:rgba(0,0,0,0.05);margin-left:-8px;margin-right:-8px;padding-left:8px;padding-right:8px;} .spoiler {color:#BBBBBB;background:#BBBBBB;padding:0px 3px;} .spoiler:hover, .spoiler:active, .spoiler-shown {color:#000000;background:#E2E2E2;padding:0px 3px;} .spoiler a {color:#BBBBBB;} .spoiler:hover a, .spoiler:active a, .spoiler-shown a {color:#2288CC;} .chat code, .chat .spoiler:hover code, .chat .spoiler:active code, .chat .spoiler-shown code {border:1px solid #C0C0C0;background:#EEEEEE;color:black;padding:0 2px;} .chat .spoiler code {border:1px solid #CCCCCC;background:#CCCCCC;color:#CCCCCC;} .battle-log .rated {padding:3px 4px;} .battle-log .rated strong {color:white;background:#89A;padding:1px 4px;border-radius:4px;} .spacer {margin-top:0.5em;} .message-announce {background:#6688AA;color:white;padding:1px 4px 2px;} .message-announce a, .broadcast-green a, .broadcast-blue a, .broadcast-red a {color:#DDEEFF;} .broadcast-green {background-color:#559955;color:white;padding:2px 4px;} .broadcast-blue {background-color:#6688AA;color:white;padding:2px 4px;} .infobox {border:1px solid #6688AA;padding:2px 4px;} .infobox-limited {max-height:200px;overflow:auto;overflow-x:hidden;} .broadcast-red {background-color:#AA5544;color:white;padding:2px 4px;} .message-learn-canlearn {font-weight:bold;color:#228822;text-decoration:underline;} .message-learn-cannotlearn {font-weight:bold;color:#CC2222;text-decoration:underline;} .message-effect-weak {font-weight:bold;color:#CC2222;} .message-effect-resist {font-weight:bold;color:#6688AA;} .message-effect-immune {font-weight:bold;color:#666666;} .message-learn-list {margin-top:0;margin-bottom:0;} .message-throttle-notice, .message-error {color:#992222;} .message-overflow, .chat small.message-overflow {font-size:0pt;} .message-overflow::before {font-size:9pt;content:\'...\';} .subtle {color:#3A4A66;}\n';
buf+='</style>\n';
buf+='<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">\n';
buf+='<input type="hidden" name="replayid" value="'+replayid+'" />\n';
buf+='<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>\n';
buf+="<h1 style=\"font-weight:normal;text-align:center\"><strong>"+BattleLog.escapeHTML(battle.tier)+"</strong><br /><a href=\"http://"+Config.routes.users+"/"+toID(battle.p1.name)+"\" class=\"subtle\" target=\"_blank\">"+BattleLog.escapeHTML(battle.p1.name)+"</a> vs. <a href=\"http://"+Config.routes.users+"/"+toID(battle.p2.name)+"\" class=\"subtle\" target=\"_blank\">"+BattleLog.escapeHTML(battle.p2.name)+"</a></h1>\n";
buf+='<script type="text/plain" class="battle-log-data">'+battle.stepQueue.join('\n').replace(/\//g,'\\/')+'</script>\n';
buf+='</div>\n';
buf+='<div class="battle-log battle-log-inline"><div class="inner">'+battle.scene.log.elem.innerHTML+'</div></div>\n';
buf+='</div>\n';
buf+='<script>\n';
buf+="let daily = Math.floor(Date.now()/1000/60/60/24);document.write('<script src=\"https://play.pokemonreborn-showdown.xyz/js/replay-embed.js?version'+daily+'\"></'+'script>');\n";
buf+='</script>\n';
return buf;
};BattleLog.

createReplayFileHref=function createReplayFileHref(room){

var replayFile=BattleLog.createReplayFile(room);
if(!replayFile)return'javascript:alert("You will need to click Download again once the replay file is at the end.");void 0';
return'data:text/plain;base64,'+encodeURIComponent(btoa(unescape(encodeURIComponent(replayFile))));
};return BattleLog;}();BattleLog.colorCache={};BattleLog.interstice=function(){var whitelist=Config.whitelist;var patterns=whitelist.map(function(entry){return new RegExp("^(https?:)?//([A-Za-z0-9-]*\\.)?"+entry.replace(/\./g,'\\.')+"(/.*)?",'i');});return{isWhitelisted:function(uri){if(uri[0]==='/'&&uri[1]!=='/'){return true;}for(var _i22=0;_i22<patterns.length;_i22++){var pattern=patterns[_i22];if(pattern.test(uri))return true;}return false;},getURI:function(uri){return"http://"+Config.routes.root+"/interstice?uri="+encodeURIComponent(uri);}};}();BattleLog.players=[];BattleLog.ytLoading=null;BattleLog.tagPolicy=null;
/**
 * Pokemon Showdown Log Misc
 *
 * Some miscellaneous helper functions for battle-log.ts, namely:
 *
 * - an MD5 hasher
 *
 * - a parseText function (for converting chat text to HTML),
 *   cross-compiled from the server
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */




function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g;}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c);}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c);}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c);}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c);}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c;}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128));}return c;}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f;}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase();};
/**
 * Text parser
 *
 * No dependencies
 * Optional dependency: BattleText
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var







BattleTextParser=function(){










function BattleTextParser(){var perspective=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'p1';this.p1="Player 1";this.p2="Player 2";this.p3="Player 3";this.p4="Player 4";this.perspective=void 0;this.gen=9;this.turn=0;this.curLineSection='break';this.lowercaseRegExp=undefined;this.


























































































































































































































pokemonName=function(pokemon){
if(!pokemon)return'';
if(!pokemon.startsWith('p'))return"???pokemon:"+pokemon+"???";
if(pokemon.charAt(3)===':')return pokemon.slice(4).trim();else
if(pokemon.charAt(2)===':')return pokemon.slice(3).trim();
return"???pokemon:"+pokemon+"???";
};this.perspective=perspective;}BattleTextParser.parseLine=function parseLine(line,noDefault){if(!line.startsWith('|')){return['',line];}if(line==='|'){return['done'];}var index=line.indexOf('|',1);var cmd=line.slice(1,index);switch(cmd){case'chatmsg':case'chatmsg-raw':case'raw':case'error':case'html':case'inactive':case'inactiveoff':case'warning':case'fieldhtml':case'controlshtml':case'bigerror':case'debug':case'tier':case'challstr':case'popup':case'':return[cmd,line.slice(index+1)];case'c':case'chat':case'uhtml':case'uhtmlchange':case'queryresponse':case'showteam':var index2a=line.indexOf('|',index+1);return[cmd,line.slice(index+1,index2a),line.slice(index2a+1)];case'c:':case'pm':var index2b=line.indexOf('|',index+1);var index3b=line.indexOf('|',index2b+1);return[cmd,line.slice(index+1,index2b),line.slice(index2b+1,index3b),line.slice(index3b+1)];}if(noDefault)return null;return line.slice(1).split('|');};BattleTextParser.parseBattleLine=function parseBattleLine(line){var args=this.parseLine(line,true);if(args)return{args:args,kwArgs:{}};args=line.slice(1).split('|');var kwArgs={};while(args.length>1){var lastArg=args[args.length-1];if(lastArg.charAt(0)!=='[')break;var bracketPos=lastArg.indexOf(']');if(bracketPos<=0)break;kwArgs[lastArg.slice(1,bracketPos)]=lastArg.slice(bracketPos+1).trim()||'.';args.pop();}return BattleTextParser.upgradeArgs({args:args,kwArgs:kwArgs});};BattleTextParser.parseNameParts=function parseNameParts(text){var group='';if(!/[A-Za-z0-9]/.test(text.charAt(0))){group=text.charAt(0);text=text.slice(1);}var name=text;var atIndex=text.indexOf('@');var status='';var away=false;if(atIndex>0){name=text.slice(0,atIndex);status=text.slice(atIndex+1);if(status.startsWith('!')){away=true;status=status.slice(1);}}return{group:group,name:name,away:away,status:status};};BattleTextParser.upgradeArgs=function upgradeArgs(_ref){var args=_ref.args,kwArgs=_ref.kwArgs;switch(args[0]){case'-activate':{if(kwArgs.item||kwArgs.move||kwArgs.number||kwArgs.ability)return{args:args,kwArgs:kwArgs};var _args=args,pokemon=_args[1],effect=_args[2],arg3=_args[3],arg4=_args[4];var target=kwArgs.of;var id=BattleTextParser.effectId(effect);if(kwArgs.block)return{args:['-fail',pokemon],kwArgs:kwArgs};if(id==='wonderguard')return{args:['-immune',pokemon],kwArgs:{from:'ability:Wonder Guard'}};if(id==='beatup'&&kwArgs.of)return{args:args,kwArgs:{name:kwArgs.of}};if(['ingrain','quickguard','wideguard','craftyshield','matblock','protect','mist','safeguard','electricterrain','mistyterrain','psychicterrain','telepathy','stickyhold','suctioncups','aromaveil','flowerveil','sweetveil','disguise','safetygoggles','protectivepads'].includes(id)){if(target){kwArgs.of=pokemon;return{args:['-block',target,effect,arg3],kwArgs:kwArgs};}return{args:['-block',pokemon,effect,arg3],kwArgs:kwArgs};}if(id==='charge'){return{args:['-singlemove',pokemon,effect],kwArgs:{of:target}};}if(['bind','wrap','clamp','whirlpool','firespin','magmastorm','sandtomb','infestation','snaptrap','thundercage','trapped'].includes(id)){return{args:['-start',pokemon,effect],kwArgs:{of:target}};}if(id==='fairylock'){return{args:['-fieldactivate',effect],kwArgs:{}};}if(id==='symbiosis'||id==='poltergeist'){kwArgs.item=arg3;}else if(id==='magnitude'){kwArgs.number=arg3;}else if(id==='skillswap'||id==='mummy'||id==='lingeringaroma'||id==='wanderingspirit'){kwArgs.ability=arg3;kwArgs.ability2=arg4;}else if(['eeriespell','gmaxdepletion','spite','grudge','forewarn','sketch','leppaberry','mysteryberry'].includes(id)){kwArgs.move=arg3;kwArgs.number=arg4;}args=['-activate',pokemon,effect,target||''];break;}case'-fail':{if(kwArgs.from==='ability: Flower Veil'){return{args:['-block',kwArgs.of,'ability: Flower Veil'],kwArgs:{of:args[1]}};}break;}case'-start':{if(kwArgs.from==='Protean'||kwArgs.from==='Color Change')kwArgs.from='ability:'+kwArgs.from;break;}case'move':{if(kwArgs.from==='Magic Bounce')kwArgs.from='ability:Magic Bounce';break;}case'cant':{var _args2=args,_pokemon2=_args2[1],_effect2=_args2[2],move=_args2[3];if(['ability: Damp','ability: Dazzling','ability: Queenly Majesty','ability: Armor Tail'].includes(_effect2)){args[0]='-block';return{args:['-block',_pokemon2,_effect2,move,kwArgs.of],kwArgs:{}};}break;}case'-heal':{var _id=BattleTextParser.effectId(kwArgs.from);if(['dryskin','eartheater','voltabsorb','waterabsorb'].includes(_id))kwArgs.of='';break;}case'-restoreboost':{args[0]='-clearnegativeboost';break;}case'-nothing':return{args:['-activate','','move:Splash'],kwArgs:kwArgs};}return{args:args,kwArgs:kwArgs};};var _proto=BattleTextParser.prototype;_proto.extractMessage=function extractMessage(buf){var out='';for(var _i2=0,_buf$split2=buf.split('\n');_i2<_buf$split2.length;_i2++){var _line=_buf$split2[_i2];var _BattleTextParser$par=BattleTextParser.parseBattleLine(_line),args=_BattleTextParser$par.args,kwArgs=_BattleTextParser$par.kwArgs;out+=this.parseArgs(args,kwArgs)||'';}return out;};_proto.fixLowercase=function fixLowercase(input){if(this.lowercaseRegExp===undefined){var prefixes=['pokemon','opposingPokemon','team','opposingTeam','party','opposingParty'].map(function(templateId){var template=BattleText["default"][templateId];if(template.charAt(0)===template.charAt(0).toUpperCase())return'';var bracketIndex=template.indexOf('[');if(bracketIndex>=0)return template.slice(0,bracketIndex);return template;}).filter(function(prefix){return prefix;});if(prefixes.length){var buf="((?:^|\n)(?:  |  \\(|\\[)?)("+prefixes.map(BattleTextParser.escapeRegExp).join('|')+")";this.lowercaseRegExp=new RegExp(buf,'g');}else{this.lowercaseRegExp=null;}}if(!this.lowercaseRegExp)return input;return input.replace(this.lowercaseRegExp,function(match,p1,p2){return p1+p2.charAt(0).toUpperCase()+p2.slice(1);});};BattleTextParser.escapeRegExp=function escapeRegExp(input){return input.replace(/[\\^$.*+?()[\]{}|]/g,'\\$&');};_proto.

pokemon=function pokemon(_pokemon){
if(!_pokemon)return'';
var side=_pokemon.slice(0,2);
if(!['p1','p2','p3','p4'].includes(side))return"???pokemon:"+_pokemon+"???";
var name=this.pokemonName(_pokemon);
var isNear=side===this.perspective||side===BattleTextParser.allyID(side);
var template=BattleText["default"][isNear?'pokemon':'opposingPokemon'];
return template.replace('[NICKNAME]',name);
};_proto.

pokemonFull=function pokemonFull(pokemon,details){
var nickname=this.pokemonName(pokemon);

var species=details.split(',')[0];
if(nickname===species)return[pokemon.slice(0,2),"**"+species+"**"];
return[pokemon.slice(0,2),nickname+" (**"+species+"**)"];
};_proto.

trainer=function trainer(side){
side=side.slice(0,2);
if(side==='p1')return this.p1;
if(side==='p2')return this.p2;
if(side==='p3')return this.p3;
if(side==='p4')return this.p4;
return"???side:"+side+"???";
};BattleTextParser.

allyID=function allyID(sideid){
if(sideid==='p1')return'p3';
if(sideid==='p2')return'p4';
if(sideid==='p3')return'p1';
if(sideid==='p4')return'p2';
return'';
};_proto.

team=function team(side){var isFar=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;
side=side.slice(0,2);
if(side===this.perspective||side===BattleTextParser.allyID(side)){
return!isFar?BattleText["default"].team:BattleText["default"].opposingTeam;
}
return isFar?BattleText["default"].team:BattleText["default"].opposingTeam;
};_proto.

own=function own(side){
side=side.slice(0,2);
if(side===this.perspective){
return'OWN';
}
return'';
};_proto.

party=function party(side){
side=side.slice(0,2);
if(side===this.perspective||side===BattleTextParser.allyID(side)){
return BattleText["default"].party;
}
return BattleText["default"].opposingParty;
};BattleTextParser.

effectId=function effectId(effect){
if(!effect)return'';
if(effect.startsWith('item:')||effect.startsWith('move:')){
effect=effect.slice(5);
}else if(effect.startsWith('ability:')){
effect=effect.slice(8);
}
return toID(effect);
};_proto.

effect=function effect(_effect){
if(!_effect)return'';
if(_effect.startsWith('item:')||_effect.startsWith('move:')){
_effect=_effect.slice(5);
}else if(_effect.startsWith('ability:')){
_effect=_effect.slice(8);
}
return _effect.trim();
};_proto.

template=function template(type){for(var _len=arguments.length,namespaces=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){namespaces[_key-1]=arguments[_key];}for(var _i4=0;_i4<
namespaces.length;_i4++){var namespace=namespaces[_i4];
if(!namespace)continue;
if(namespace==='OWN'){
return BattleText["default"][type+'Own']+'\n';
}
if(namespace==='NODEFAULT'){
return'';
}
var id=BattleTextParser.effectId(namespace);
if(BattleText[id]&&type in BattleText[id]){
if(BattleText[id][type].charAt(1)==='.')type=BattleText[id][type].slice(2);
if(BattleText[id][type].charAt(0)==='#')id=BattleText[id][type].slice(1);
if(!BattleText[id][type])return'';
return BattleText[id][type]+'\n';
}
}
if(!BattleText["default"][type])return'';
return BattleText["default"][type]+'\n';
};_proto.

maybeAbility=function maybeAbility(effect,holder){
if(!effect)return'';
if(!effect.startsWith('ability:'))return'';
return this.ability(effect.slice(8).trim(),holder);
};_proto.

ability=function ability(name,holder){
if(!name)return'';
return BattleText["default"].abilityActivation.replace('[POKEMON]',this.pokemon(holder)).replace('[ABILITY]',this.effect(name))+'\n';
};BattleTextParser.

stat=function stat(_stat){
var entry=BattleText[_stat||"stats"];
if(!entry||!entry.statName)return"???stat:"+_stat+"???";
return entry.statName;
};_proto.

lineSection=function lineSection(args,kwArgs){
var cmd=args[0];
switch(cmd){
case'done':case'turn':
return'break';
case'move':case'cant':case'switch':case'drag':case'upkeep':case'start':
case'-mega':case'-candynamax':case'-terastallize':
return'major';
case'switchout':case'faint':
return'preMajor';
case'-zpower':
return'postMajor';
case'-damage':{
var id=BattleTextParser.effectId(kwArgs.from);
if(id==='confusion')return'major';
return'postMajor';
}
case'-curestatus':{
var _id2=BattleTextParser.effectId(kwArgs.from);
if(_id2==='naturalcure')return'preMajor';
return'postMajor';
}
case'-start':{
var _id3=BattleTextParser.effectId(kwArgs.from);
if(_id3==='protean')return'preMajor';
return'postMajor';
}
case'-activate':{
var _id4=BattleTextParser.effectId(args[2]);
if(_id4==='confusion'||_id4==='attract')return'preMajor';
return'postMajor';
}
}
return cmd.charAt(0)==='-'?'postMajor':'';
};_proto.

sectionBreak=function sectionBreak(args,kwArgs){
var prevSection=this.curLineSection;
var curSection=this.lineSection(args,kwArgs);
if(!curSection)return false;
this.curLineSection=curSection;
switch(curSection){
case'break':
if(prevSection!=='break')return true;
return false;
case'preMajor':
case'major':
if(prevSection==='postMajor'||prevSection==='major')return true;
return false;
case'postMajor':
return false;
}
};_proto.

parseArgs=function parseArgs(args,kwArgs,noSectionBreak){
var buf=!noSectionBreak&&this.sectionBreak(args,kwArgs)?'\n':'';
return buf+this.fixLowercase(this.parseArgsInner(args,kwArgs)||'');
};_proto.

parseArgsInner=function parseArgsInner(args,kwArgs){
var cmd=args[0];
switch(cmd){
case'player':{
var side=args[1],name=args[2];
if(side==='p1'&&name){
this.p1=name;
}else if(side==='p2'&&name){
this.p2=name;
}else if(side==='p3'&&name){
this.p3=name;
}else if(side==='p4'&&name){
this.p4=name;
}
return'';
}

case'gen':{
var num=args[1];
this.gen=parseInt(num,10);
return'';
}

case'turn':{
var _num=args[1];
this.turn=Number.parseInt(_num,10);
return this.template('turn').replace('[NUMBER]',_num)+'\n';
}

case'start':{
return this.template('startBattle').replace('[TRAINER]',this.p1).replace('[TRAINER]',this.p2);
}

case'win':case'tie':{
var _name=args[1];
if(cmd==='tie'||!_name){
return this.template('tieBattle').replace('[TRAINER]',this.p1).replace('[TRAINER]',this.p2);
}
return this.template('winBattle').replace('[TRAINER]',_name);
}

case'switch':{
var pokemon=args[1],details=args[2];
var _this$pokemonFull=this.pokemonFull(pokemon,details),_side=_this$pokemonFull[0],fullname=_this$pokemonFull[1];
var template=this.template('switchIn',this.own(_side));
return template.replace('[TRAINER]',this.trainer(_side)).replace('[FULLNAME]',fullname);
}

case'drag':{
var _pokemon3=args[1],_details=args[2];
var _this$pokemonFull2=this.pokemonFull(_pokemon3,_details),_side2=_this$pokemonFull2[0],_fullname=_this$pokemonFull2[1];
var _template=this.template('drag');
return _template.replace('[TRAINER]',this.trainer(_side2)).replace('[FULLNAME]',_fullname);
}

case'detailschange':case'-transform':case'-formechange':{
var _pokemon4=args[1],arg2=args[2],arg3=args[3];
var newSpecies='';
switch(cmd){
case'detailschange':newSpecies=arg2.split(',')[0].trim();break;
case'-transform':newSpecies=arg3;break;
case'-formechange':newSpecies=arg2;break;
}
var newSpeciesId=toID(newSpecies);
var id='';
var templateName='transform';
if(cmd!=='-transform'){
switch(newSpeciesId){
case'greninjaash':id='battlebond';break;
case'mimikyubusted':id='disguise';break;
case'zygardecomplete':id='powerconstruct';break;
case'necrozmaultra':id='ultranecroziumz';break;
case'darmanitanzen':id='zenmode';break;
case'darmanitan':id='zenmode';templateName='transformEnd';break;
case'darmanitangalarzen':id='zenmode';break;
case'darmanitangalar':id='zenmode';templateName='transformEnd';break;
case'aegislashblade':id='stancechange';break;
case'aegislash':id='stancechange';templateName='transformEnd';break;
case'wishiwashischool':id='schooling';break;
case'wishiwashi':id='schooling';templateName='transformEnd';break;
case'miniormeteor':id='shieldsdown';break;
case'minior':id='shieldsdown';templateName='transformEnd';break;
case'eiscuenoice':id='iceface';break;
case'eiscue':id='iceface';templateName='transformEnd';break;
case'terapagosterastal':id='terashift';break;
}
}else if(newSpecies){
id='transform';
}
var _template2=this.template(templateName,id,kwArgs.msg?'':'NODEFAULT');
var line1=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon4);
return line1+_template2.replace('[POKEMON]',this.pokemon(_pokemon4)).replace('[SPECIES]',newSpecies);
}

case'switchout':{
var _pokemon5=args[1];
var _side3=_pokemon5.slice(0,2);
var _template3=this.template('switchOut',kwArgs.from,this.own(_side3));
return _template3.replace('[TRAINER]',this.trainer(_side3)).replace('[NICKNAME]',this.pokemonName(_pokemon5)).replace('[POKEMON]',this.pokemon(_pokemon5));
}

case'faint':{
var _pokemon6=args[1];
var _template4=this.template('faint');
return _template4.replace('[POKEMON]',this.pokemon(_pokemon6));
}

case'swap':{
var _pokemon7=args[1],target=args[2];
if(!target||!isNaN(Number(target))){
var _template5=this.template('swapCenter');
return _template5.replace('[POKEMON]',this.pokemon(_pokemon7));
}
var _template6=this.template('swap');
return _template6.replace('[POKEMON]',this.pokemon(_pokemon7)).replace('[TARGET]',this.pokemon(target));
}

case'move':{
var _pokemon8=args[1],move=args[2];
var _line2=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon8);
if(kwArgs.zeffect){
_line2=this.template('zEffect').replace('[POKEMON]',this.pokemon(_pokemon8));
}
var _template7=this.template('move',kwArgs.from);
return _line2+_template7.replace('[POKEMON]',this.pokemon(_pokemon8)).replace('[MOVE]',move);
}

case'cant':{
var _pokemon9=args[1],effect=args[2],_move=args[3];
var _template8=this.template('cant',effect,'NODEFAULT')||
this.template(_move?'cant':'cantNoMove');
var _line3=this.maybeAbility(effect,kwArgs.of||_pokemon9);
return _line3+_template8.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[MOVE]',_move);
}

case'-candynamax':{
var _side4=args[1];
var own=this.own(_side4);
var _template9='';
if(this.turn===1){
if(own)_template9=this.template('canDynamax',own);
}else{
_template9=this.template('canDynamax',own);
}
return _template9.replace('[TRAINER]',this.trainer(_side4));
}

case'message':{
var message=args[1];
return''+message+'\n';
}

case'-start':{var _kwArgs$from;
var _pokemon0=args[1],_effect3=args[2],_arg=args[3];
var _line4=this.maybeAbility(_effect3,_pokemon0)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon0);
var _id5=BattleTextParser.effectId(_effect3);
if(_id5==='typechange'){
var _template0=this.template('typeChange',kwArgs.from);
return _line4+_template0.replace('[POKEMON]',this.pokemon(_pokemon0)).replace('[TYPE]',_arg).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(_id5==='typeadd'){
var _template1=this.template('typeAdd',kwArgs.from);
return _line4+_template1.replace('[POKEMON]',this.pokemon(_pokemon0)).replace('[TYPE]',_arg);
}
if(_id5.startsWith('stockpile')){
var _num2=_id5.slice(9);
var _template10=this.template('start','stockpile');
return _line4+_template10.replace('[POKEMON]',this.pokemon(_pokemon0)).replace('[NUMBER]',_num2);
}
if(_id5.startsWith('perish')){
var _num3=_id5.slice(6);
var _template11=this.template('activate','perishsong');
return _line4+_template11.replace('[POKEMON]',this.pokemon(_pokemon0)).replace('[NUMBER]',_num3);
}
if(_id5.startsWith('protosynthesis')||_id5.startsWith('quarkdrive')){
var stat=_id5.slice(-3);
var _template12=this.template('start',_id5.slice(0,_id5.length-3));
return _line4+_template12.replace('[POKEMON]',this.pokemon(_pokemon0)).replace('[STAT]',BattleTextParser.stat(stat));
}
var templateId='start';
if(kwArgs.already)templateId='alreadyStarted';
if(kwArgs.fatigue)templateId='startFromFatigue';
if(kwArgs.zeffect)templateId='startFromZEffect';
if(kwArgs.damage)templateId='activate';
if(kwArgs.block)templateId='block';
if(kwArgs.upkeep)templateId='upkeep';
if(_id5==='mist'&&this.gen<=2)templateId='startGen'+this.gen;
if(_id5==='reflect'||_id5==='lightscreen')templateId='startGen1';
if(templateId==='start'&&(_kwArgs$from=kwArgs.from)!=null&&_kwArgs$from.startsWith('item:')){
templateId+='FromItem';
}
var _template13=this.template(templateId,kwArgs.from,_effect3);
return _line4+_template13.replace('[POKEMON]',this.pokemon(_pokemon0)).replace('[EFFECT]',this.effect(_effect3)).replace('[MOVE]',_arg).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(kwArgs.from));
}

case'-end':{var _kwArgs$from2;
var _pokemon1=args[1],_effect4=args[2];
var _line5=this.maybeAbility(_effect4,_pokemon1)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon1);
var _id6=BattleTextParser.effectId(_effect4);
if(_id6==='doomdesire'||_id6==='futuresight'){
var _template14=this.template('activate',_effect4);
return _line5+_template14.replace('[TARGET]',this.pokemon(_pokemon1));
}
var _templateId='end';
var _template15='';
if((_kwArgs$from2=kwArgs.from)!=null&&_kwArgs$from2.startsWith('item:')){
_template15=this.template('endFromItem',_effect4);
}
if(!_template15)_template15=this.template(_templateId,_effect4);
return _line5+_template15.replace('[POKEMON]',this.pokemon(_pokemon1)).replace('[EFFECT]',this.effect(_effect4)).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(kwArgs.from));
}

case'-ability':{
var _pokemon10=args[1],ability=args[2],oldAbility=args[3],arg4=args[4];
var _line6='';
if(oldAbility&&(oldAbility.startsWith('p1')||oldAbility.startsWith('p2')||oldAbility==='boost')){
arg4=oldAbility;
oldAbility='';
}
if(oldAbility)_line6+=this.ability(oldAbility,_pokemon10);
_line6+=this.ability(ability,_pokemon10);
if(kwArgs.fail){
var _template16=this.template('block',kwArgs.from);
return _line6+_template16;
}
if(kwArgs.from){
_line6=this.maybeAbility(kwArgs.from,_pokemon10)+_line6;
var _template17=this.template('changeAbility',kwArgs.from);
return _line6+_template17.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[ABILITY]',this.effect(ability)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
var _id7=BattleTextParser.effectId(ability);
if(_id7==='unnerve'){
var _template18=this.template('start',ability);
return _line6+_template18.replace('[TEAM]',this.team(_pokemon10.slice(0,2),true));
}
var _templateId2='start';
if(_id7==='anticipation'||_id7==='sturdy')_templateId2='activate';
var _template19=this.template(_templateId2,ability,'NODEFAULT');
return _line6+_template19.replace('[POKEMON]',this.pokemon(_pokemon10));
}

case'-endability':{
var _pokemon11=args[1],_ability=args[2];
if(_ability)return this.ability(_ability,_pokemon11);
var _line7=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon11);
var _template20=this.template('start','Gastro Acid');
return _line7+_template20.replace('[POKEMON]',this.pokemon(_pokemon11));
}

case'-item':{
var _pokemon12=args[1],item=args[2];
var _id8=BattleTextParser.effectId(kwArgs.from);
var _target='';
if(['magician','pickpocket'].includes(_id8)){var _ref2=
[kwArgs.of,''];_target=_ref2[0];kwArgs.of=_ref2[1];
}
var _line8=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon12);
if(['thief','covet','bestow','magician','pickpocket'].includes(_id8)){
var _template21=this.template('takeItem',kwArgs.from);
return _line8+_template21.replace('[POKEMON]',this.pokemon(_pokemon12)).replace('[ITEM]',this.effect(item)).replace('[SOURCE]',this.pokemon(_target||kwArgs.of));
}
if(_id8==='frisk'){
var hasTarget=kwArgs.of&&_pokemon12&&kwArgs.of!==_pokemon12;
var _template22=this.template(hasTarget?'activate':'activateNoTarget',"Frisk");
return _line8+_template22.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(item)).replace('[TARGET]',this.pokemon(_pokemon12));
}
if(kwArgs.from){
var _template23=this.template('addItem',kwArgs.from);
return _line8+_template23.replace('[POKEMON]',this.pokemon(_pokemon12)).replace('[ITEM]',this.effect(item));
}
var _template24=this.template('start',item,'NODEFAULT');
return _line8+_template24.replace('[POKEMON]',this.pokemon(_pokemon12));
}

case'-enditem':{
var _pokemon13=args[1],_item=args[2];
var _line9=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon13);
if(kwArgs.eat){
var _template25=this.template('eatItem',kwArgs.from);
return _line9+_template25.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[ITEM]',this.effect(_item));
}
var _id9=BattleTextParser.effectId(kwArgs.from);
if(_id9==='gem'){
var _template26=this.template('useGem',_item);
return _line9+_template26.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[ITEM]',this.effect(_item)).replace('[MOVE]',kwArgs.move);
}
if(_id9==='stealeat'){
var _template27=this.template('removeItem',"Bug Bite");
return _line9+_template27.replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(_item));
}
if(kwArgs.from){
var _template28=this.template('removeItem',kwArgs.from);
return _line9+_template28.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[ITEM]',this.effect(_item)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(kwArgs.weaken){
var _template29=this.template('activateWeaken');
return _line9+_template29.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[ITEM]',this.effect(_item));
}
var _template30=this.template('end',_item,'NODEFAULT');
if(!_template30)_template30=this.template('activateItem').replace('[ITEM]',this.effect(_item));
return _line9+_template30.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[TARGET]',this.pokemon(kwArgs.of));
}

case'-status':{
var _pokemon14=args[1],status=args[2];
var _line0=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon14);
if(BattleTextParser.effectId(kwArgs.from)==='rest'){
var _template31=this.template('startFromRest',status);
return _line0+_template31.replace('[POKEMON]',this.pokemon(_pokemon14));
}
var _template32=this.template('start',status);
return _line0+_template32.replace('[POKEMON]',this.pokemon(_pokemon14));
}

case'-curestatus':{var _kwArgs$from3;
var _pokemon15=args[1],_status=args[2];
if(BattleTextParser.effectId(kwArgs.from)==='naturalcure'){
var _template33=this.template('activate',kwArgs.from);
return _template33.replace('[POKEMON]',this.pokemon(_pokemon15));
}
var _line1=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon15);
if((_kwArgs$from3=kwArgs.from)!=null&&_kwArgs$from3.startsWith('item:')){
var _template34=this.template('endFromItem',_status);
return _line1+_template34.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[ITEM]',this.effect(kwArgs.from));
}
if(kwArgs.thaw){
var _template35=this.template('endFromMove',_status);
return _line1+_template35.replace('[POKEMON]',this.pokemon(_pokemon15)).replace('[MOVE]',this.effect(kwArgs.from));
}
var _template36=this.template('end',_status,'NODEFAULT');
if(!_template36)_template36=this.template('end').replace('[EFFECT]',_status);
return _line1+_template36.replace('[POKEMON]',this.pokemon(_pokemon15));
}

case'-cureteam':{
return this.template('activate',kwArgs.from);
}

case'-singleturn':case'-singlemove':{
var _pokemon16=args[1],_effect5=args[2];
var _line10=this.maybeAbility(_effect5,kwArgs.of||_pokemon16)||
this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon16);
var _id0=BattleTextParser.effectId(_effect5);
if(_id0==='instruct'){
var _template37=this.template('activate',_effect5);
return _line10+_template37.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[TARGET]',this.pokemon(_pokemon16));
}
var _template38=this.template('start',_effect5,'NODEFAULT');
if(!_template38)_template38=this.template('start').replace('[EFFECT]',this.effect(_effect5));
return _line10+_template38.replace('[POKEMON]',this.pokemon(_pokemon16)).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[TEAM]',this.team(_pokemon16.slice(0,2)));
}

case'-sidestart':{
var _side5=args[1],_effect6=args[2];
var _template39=this.template('start',_effect6,'NODEFAULT');
if(!_template39)_template39=this.template('startTeamEffect').replace('[EFFECT]',this.effect(_effect6));
return _template39.replace('[TEAM]',this.team(_side5)).replace('[PARTY]',this.party(_side5));
}

case'-sideend':{
var _side6=args[1],_effect7=args[2];
var _template40=this.template('end',_effect7,'NODEFAULT');
if(!_template40)_template40=this.template('endTeamEffect').replace('[EFFECT]',this.effect(_effect7));
return _template40.replace('[TEAM]',this.team(_side6)).replace('[PARTY]',this.party(_side6));
}

case'-weather':{
var weather=args[1];
if(!weather||weather==='none'){
var _template41=this.template('end',kwArgs.from,'NODEFAULT');
if(!_template41)return this.template('endFieldEffect').replace('[EFFECT]',this.effect(weather));
return _template41;
}
if(kwArgs.upkeep){
return this.template('upkeep',weather,'NODEFAULT');
}
var _line11=this.maybeAbility(kwArgs.from,kwArgs.of);
var _template42=this.template('start',weather,'NODEFAULT');
if(!_template42)_template42=this.template('startFieldEffect').replace('[EFFECT]',this.effect(weather));
return _line11+_template42;
}

case'-fieldstart':case'-fieldactivate':{
var _effect8=args[1];
var _line12=this.maybeAbility(kwArgs.from,kwArgs.of);
if(BattleTextParser.effectId(kwArgs.from)==='hadronengine'){
return _line12+this.template('start','hadronengine').replace('[POKEMON]',this.pokemon(kwArgs.of));
}
var _templateId3=cmd.slice(6);
if(BattleTextParser.effectId(_effect8)==='perishsong')_templateId3='start';
var _template43=this.template(_templateId3,_effect8,'NODEFAULT');
if(!_template43)_template43=this.template('startFieldEffect').replace('[EFFECT]',this.effect(_effect8));
return _line12+_template43.replace('[POKEMON]',this.pokemon(kwArgs.of));
}

case'-fieldend':{
var _effect9=args[1];
var _template44=this.template('end',_effect9,'NODEFAULT');
if(!_template44)_template44=this.template('endFieldEffect').replace('[EFFECT]',this.effect(_effect9));
return _template44;
}

case'-sethp':{
var _effect0=kwArgs.from;
return this.template('activate',_effect0);
}

case'-message':{
var _message=args[1];
return'  '+_message+'\n';
}

case'-hint':{
var _message2=args[1];
return'  ('+_message2+')\n';
}

case'-activate':{
var _pokemon17=args[1],_effect1=args[2],_target2=args[3];
var _id1=BattleTextParser.effectId(_effect1);
if(_id1==='celebrate'){
return this.template('activate','celebrate').replace('[TRAINER]',this.trainer(_pokemon17.slice(0,2)));
}
if(!_target2&&
['hyperdrill','hyperspacefury','hyperspacehole','phantomforce','shadowforce','feint'].includes(_id1)){var _ref3=
[kwArgs.of,_pokemon17];_pokemon17=_ref3[0];_target2=_ref3[1];
if(!_pokemon17)_pokemon17=_target2;
}
if(!_target2)_target2=kwArgs.of||_pokemon17;

var _line13=this.maybeAbility(_effect1,_pokemon17);

if(_id1==='lockon'||_id1==='mindreader'){
var _template45=this.template('start',_effect1);
return _line13+_template45.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[SOURCE]',this.pokemon(_pokemon17));
}

if((_id1==='mummy'||_id1==='lingeringaroma')&&kwArgs.ability){
_line13+=this.ability(kwArgs.ability,_target2);
_line13+=this.ability(_id1==='mummy'?'Mummy':'Lingering Aroma',_target2);
var _template46=this.template('changeAbility',_id1);
return _line13+_template46.replace('[TARGET]',this.pokemon(_target2));
}

if(_id1==='commander'){


if(_target2===_pokemon17)return _line13;
var _template47=this.template('activate',_id1);
return _line13+_template47.replace('[POKEMON]',this.pokemon(_pokemon17)).replace(/\[TARGET\]/g,this.pokemon(_target2));
}

var _templateId4='activate';
if(_id1==='forewarn'&&_pokemon17===_target2){
_templateId4='activateNoTarget';
}
if((_id1==='protosynthesis'||_id1==='quarkdrive')&&kwArgs.fromitem){
_templateId4='activateFromItem';
}
if(_id1==='orichalcumpulse'&&kwArgs.source){
_templateId4='start';
}
var _template48=this.template(_templateId4,_effect1,'NODEFAULT');
if(!_template48){
if(_line13)return _line13;
_template48=this.template('activate');
return _line13+_template48.replace('[EFFECT]',this.effect(_effect1));
}

if(_id1==='brickbreak'){
_template48=_template48.replace('[TEAM]',this.team(_target2.slice(0,2)));
}
if(kwArgs.ability){
_line13+=this.ability(kwArgs.ability,_pokemon17);
}
if(kwArgs.ability2){
_line13+=this.ability(kwArgs.ability2,_target2);
}
if(kwArgs.move||kwArgs.number||kwArgs.item||kwArgs.name){
_template48=_template48.replace('[MOVE]',kwArgs.move).replace('[NUMBER]',kwArgs.number).replace('[ITEM]',kwArgs.item).replace('[NAME]',kwArgs.name);
}
return _line13+_template48.replace('[POKEMON]',this.pokemon(_pokemon17)).replace('[TARGET]',this.pokemon(_target2)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}

case'-prepare':{
var _pokemon18=args[1],_effect10=args[2],_target3=args[3];
var _template49=this.template('prepare',_effect10);
return _template49.replace('[POKEMON]',this.pokemon(_pokemon18)).replace('[TARGET]',this.pokemon(_target3));
}

case'-damage':{
var _pokemon19=args[1],percentage=args[3];
var _template50=this.template('damage',kwArgs.from,'NODEFAULT');
var _line14=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon19);
var _id10=BattleTextParser.effectId(kwArgs.from);
if(_template50){
return _line14+_template50.replace('[POKEMON]',this.pokemon(_pokemon19));
}

if(!kwArgs.from){
_template50=this.template(percentage?'damagePercentage':'damage');
return _line14+_template50.replace('[POKEMON]',this.pokemon(_pokemon19)).replace('[PERCENTAGE]',percentage);
}
if(kwArgs.from.startsWith('item:')){
_template50=this.template(kwArgs.of?'damageFromPokemon':'damageFromItem');
return _line14+_template50.replace('[POKEMON]',this.pokemon(_pokemon19)).replace('[ITEM]',this.effect(kwArgs.from)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(kwArgs.partiallytrapped||_id10==='bind'||_id10==='wrap'){
_template50=this.template('damageFromPartialTrapping');
return _line14+_template50.replace('[POKEMON]',this.pokemon(_pokemon19)).replace('[MOVE]',this.effect(kwArgs.from));
}

_template50=this.template('damage');
return _line14+_template50.replace('[POKEMON]',this.pokemon(_pokemon19));
}

case'-heal':{
var _pokemon20=args[1];
var _template51=this.template('heal',kwArgs.from,'NODEFAULT');
var _line15=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon20);
if(_template51){
return _line15+_template51.replace('[POKEMON]',this.pokemon(_pokemon20)).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[NICKNAME]',kwArgs.wisher);
}

if(kwArgs.from&&!kwArgs.from.startsWith('ability:')){
_template51=this.template('healFromEffect');
return _line15+_template51.replace('[POKEMON]',this.pokemon(_pokemon20)).replace('[EFFECT]',this.effect(kwArgs.from));
}

_template51=this.template('heal');
return _line15+_template51.replace('[POKEMON]',this.pokemon(_pokemon20));
}

case'-boost':case'-unboost':{var _kwArgs$from4;
var _pokemon21=args[1],_stat2=args[2],_num4=args[3];
if(_stat2==='spa'&&this.gen===1)_stat2='spc';
var amount=parseInt(_num4,10);
var _line16=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon21);
var _templateId5=cmd.slice(1);
if(amount>=3)_templateId5+='3';else
if(amount>=2)_templateId5+='2';else
if(amount===0)_templateId5+='0';
if(amount&&kwArgs.zeffect){
_templateId5+=kwArgs.multiple?'MultipleFromZEffect':'FromZEffect';
}else if(amount&&(_kwArgs$from4=kwArgs.from)!=null&&_kwArgs$from4.startsWith('item:')){
var _template52=this.template(_templateId5+'FromItem',kwArgs.from);
return _line16+_template52.replace('[POKEMON]',this.pokemon(_pokemon21)).replace('[STAT]',BattleTextParser.stat(_stat2)).replace('[ITEM]',this.effect(kwArgs.from));
}
var _template53=this.template(_templateId5,kwArgs.from);
return _line16+_template53.replace(/\[POKEMON\]/g,this.pokemon(_pokemon21)).replace('[STAT]',BattleTextParser.stat(_stat2));
}

case'-setboost':{
var _pokemon22=args[1];
var _effect11=kwArgs.from;
var _line17=this.maybeAbility(_effect11,kwArgs.of||_pokemon22);
var _template54=this.template('boost',_effect11);
return _line17+_template54.replace('[POKEMON]',this.pokemon(_pokemon22));
}

case'-swapboost':{
var _pokemon23=args[1],_target4=args[2];
var _line18=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon23);
var _id11=BattleTextParser.effectId(kwArgs.from);
var _templateId6='swapBoost';
if(_id11==='guardswap')_templateId6='swapDefensiveBoost';
if(_id11==='powerswap')_templateId6='swapOffensiveBoost';
var _template55=this.template(_templateId6,kwArgs.from);
return _line18+_template55.replace('[POKEMON]',this.pokemon(_pokemon23)).replace('[TARGET]',this.pokemon(_target4));
}

case'-copyboost':{
var _pokemon24=args[1],_target5=args[2];
var _line19=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon24);
var _template56=this.template('copyBoost',kwArgs.from);
return _line19+_template56.replace('[POKEMON]',this.pokemon(_pokemon24)).replace('[TARGET]',this.pokemon(_target5));
}

case'-clearboost':case'-clearpositiveboost':case'-clearnegativeboost':{
var _pokemon25=args[1],source=args[2];
var _line20=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon25);
var _templateId7='clearBoost';
if(kwArgs.zeffect)_templateId7='clearBoostFromZEffect';
var _template57=this.template(_templateId7,kwArgs.from);
return _line20+_template57.replace('[POKEMON]',this.pokemon(_pokemon25)).replace('[SOURCE]',this.pokemon(source));
}

case'-invertboost':{
var _pokemon26=args[1];
var _line21=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon26);
var _template58=this.template('invertBoost',kwArgs.from);
return _line21+_template58.replace('[POKEMON]',this.pokemon(_pokemon26));
}

case'-clearallboost':{
return this.template('clearAllBoost',kwArgs.from);
}

case'-crit':case'-supereffective':case'-resisted':{
var _pokemon27=args[1];
var _templateId8=cmd.slice(1);
if(_templateId8==='supereffective')_templateId8='superEffective';
if(kwArgs.spread)_templateId8+='Spread';
var _template59=this.template(_templateId8);
return _template59.replace('[POKEMON]',this.pokemon(_pokemon27));
}

case'-block':{
var _pokemon28=args[1],_effect12=args[2],_move2=args[3],attacker=args[4];
var _line22=this.maybeAbility(_effect12,kwArgs.of||_pokemon28);
var _id12=BattleTextParser.effectId(_effect12);
var _templateId9='block';
if(_id12==='mist'&&this.gen<=2)_templateId9='blockGen'+this.gen;
var _template60=this.template(_templateId9,_effect12);
return _line22+_template60.replace('[POKEMON]',this.pokemon(_pokemon28)).replace('[SOURCE]',this.pokemon(attacker||kwArgs.of)).replace('[MOVE]',_move2);
}

case'-fail':{
var _pokemon29=args[1],_effect13=args[2],_stat3=args[3];
var _id13=BattleTextParser.effectId(_effect13);
var blocker=BattleTextParser.effectId(kwArgs.from);
var _line23=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon29);
var _templateId0='block';
if(['desolateland','primordialsea'].includes(blocker)&&
!['sunnyday','raindance','sandstorm','hail','snowscape','chillyreception'].includes(_id13)){
_templateId0='blockMove';
}else if(blocker==='uproar'&&kwArgs.msg){
_templateId0='blockSelf';
}
var _template61=this.template(_templateId0,kwArgs.from);
if(_template61){
return _line23+_template61.replace('[POKEMON]',this.pokemon(_pokemon29));
}

if(_id13==='unboost'){
_template61=this.template(_stat3?'failSingular':'fail','unboost');
return _line23+_template61.replace('[POKEMON]',this.pokemon(_pokemon29)).replace('[STAT]',_stat3);
}

_templateId0='fail';
if(['brn','frz','par','psn','slp','substitute','shedtail'].includes(_id13)){
_templateId0='alreadyStarted';
}
if(kwArgs.heavy)_templateId0='failTooHeavy';
if(kwArgs.weak)_templateId0='fail';
if(kwArgs.forme)_templateId0='failWrongForme';
_template61=this.template(_templateId0,_id13);
return _line23+_template61.replace('[POKEMON]',this.pokemon(_pokemon29));
}

case'-immune':{
var _pokemon30=args[1];
var _line24=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon30);
var _template62=this.template('block',kwArgs.from);
if(!_template62){
var _templateId1=kwArgs.ohko?'immuneOHKO':'immune';
_template62=this.template(_pokemon30?_templateId1:'immuneNoPokemon',kwArgs.from);
}
return _line24+_template62.replace('[POKEMON]',this.pokemon(_pokemon30));
}

case'-miss':{
var _source=args[1],_pokemon31=args[2];
var _line25=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon31);
if(!_pokemon31){
var _template63=this.template('missNoPokemon');
return _line25+_template63.replace('[SOURCE]',this.pokemon(_source));
}
var _template64=this.template('miss');
return _line25+_template64.replace('[POKEMON]',this.pokemon(_pokemon31));
}

case'-center':case'-ohko':case'-combine':{
return this.template(cmd.slice(1));
}

case'-notarget':{
return this.template('noTarget');
}

case'-mega':case'-primal':{
var _pokemon32=args[1],species=args[2],_item2=args[3];
var _id14='';
var _templateId10=cmd.slice(1);
if(species==='Rayquaza'){
_id14='dragonascent';
_templateId10='megaNoItem';
}
if(!_id14&&cmd==='-mega'&&this.gen<7)_templateId10='megaGen6';
if(!_item2&&cmd==='-mega')_templateId10='megaNoItem';
var _template65=this.template(_templateId10,_id14);
var _side7=_pokemon32.slice(0,2);
var pokemonName=this.pokemon(_pokemon32);
if(cmd==='-mega'){
var template2=this.template('transformMega');
_template65+=template2.replace('[POKEMON]',pokemonName).replace('[SPECIES]',species);
}
return _template65.replace('[POKEMON]',pokemonName).replace('[ITEM]',_item2).replace('[TRAINER]',this.trainer(_side7));
}

case'-terastallize':{
var _pokemon33=args[1],type=args[2];
var _id15='';
var _templateId11=cmd.slice(1);
var _template66=this.template(_templateId11,_id15);
var _pokemonName=this.pokemon(_pokemon33);
return _template66.replace('[POKEMON]',_pokemonName).replace('[TYPE]',type);
}

case'-zpower':{
var _pokemon34=args[1];
var _template67=this.template('zPower');
return _template67.replace('[POKEMON]',this.pokemon(_pokemon34));
}

case'-burst':{
var _pokemon35=args[1];
var _template68=this.template('activate',"Ultranecrozium Z");
return _template68.replace('[POKEMON]',this.pokemon(_pokemon35));
}

case'-zbroken':{
var _pokemon36=args[1];
var _template69=this.template('zBroken');
return _template69.replace('[POKEMON]',this.pokemon(_pokemon36));
}

case'-hitcount':{
var _num5=args[2];
if(_num5==='1'){
return this.template('hitCountSingular');
}
return this.template('hitCount').replace('[NUMBER]',_num5);
}

case'-waiting':{
var _pokemon37=args[1],_target6=args[2];
var _template70=this.template('activate',"Water Pledge");
return _template70.replace('[POKEMON]',this.pokemon(_pokemon37)).replace('[TARGET]',this.pokemon(_target6));
}

case'-anim':{
return'';
}

default:{
return null;
}
}
};return BattleTextParser;}();


if(typeof require==='function'){

global.BattleTextParser=BattleTextParser;
}

//# sourceMappingURL=battledata.js.map