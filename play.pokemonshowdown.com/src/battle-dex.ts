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

declare var require: any;
declare var global: any;

if (typeof window === 'undefined') {
	// Node
	(global as any).window = global;
} else {
	// browser (possibly NW.js!)
	window.exports = window;
}

// @ts-ignore
window.nodewebkit = !!(typeof process !== 'undefined' && process.versions && process.versions['node-webkit']);

function toID(text: any) {
	if (text?.id) {
		text = text.id;
	} else if (text?.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '' as ID;
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}

function toUserid(text: any) {
	return toID(text);
}

const CUSTOM_SPECIES: {[id: string]: {base: string, data: AnyObject}} = {
	hypno: {
		base: 'hypno',
		data: {
			name: 'Hypno',
			types: ['Psychic', 'Dark'],
			abilities: {0: 'No Guard', 1: 'Neutralizing Gas', H: 'Neutralization'},
			baseStats: {hp: 90, atk: 70, def: 105, spa: 80, spd: 110, spe: 45},
			bst: 500,
			isNonstandard: 'Custom',
		},
	},
	victreebelmega: {
		base: 'victreebel',
		data: {
			name: 'Victreebel-Mega',
			baseSpecies: 'Victreebel',
			forme: 'Mega',
			battleOnly: 'Victreebel',
			changesFrom: 'Victreebel',
			isNonstandard: 'Custom',
		},
	},
	falinksmega: {
		base: 'falinks',
		data: {
			name: 'Falinks-Mega',
			baseSpecies: 'Falinks',
			forme: 'Mega',
			battleOnly: 'Falinks',
			changesFrom: 'Falinks',
			isNonstandard: 'Custom',
		},
	},
	flygonmegaz: {
		base: 'flygon',
		data: {
			name: 'Flygon-Mega-Z',
			baseSpecies: 'Flygon',
			forme: 'Mega-Z',
			requiredItem: 'Leaf Stone',
			battleOnly: 'Flygon',
			changesFrom: 'Flygon',
			isNonstandard: 'Custom',
		},
	},
	garchompbattlebond: {
		base: 'garchomp',
		data: {
			name: 'Garchomp-Battle-Bond',
			baseSpecies: 'Garchomp',
			forme: 'Battle-Bond',
			isNonstandard: 'Custom',
		},
	},
	butterfreemega: {
		base: 'butterfree',
		data: {
			name: 'Butterfree-Mega',
			baseSpecies: 'Butterfree',
			forme: 'Mega',
			battleOnly: 'Butterfree',
			changesFrom: 'Butterfree',
			isNonstandard: 'Custom',
		},
	},
	serperiormega: {
		base: 'serperior',
		data: {
			name: 'Serperior-Mega',
			baseSpecies: 'Serperior',
			forme: 'Mega',
			battleOnly: 'Serperior',
			changesFrom: 'Serperior',
			isNonstandard: 'Custom',
		},
	},
	mismagiusmega: {
		base: 'mismagius',
		data: {
			name: 'Mismagius-Mega',
			baseSpecies: 'Mismagius',
			forme: 'Mega',
			battleOnly: 'Mismagius',
			changesFrom: 'Mismagius',
			isNonstandard: 'Custom',
		},
	},
	alcremiegmax: {
		base: 'alcremie',
		data: {
			name: 'Alcremie-Gmax',
			baseSpecies: 'Alcremie',
			forme: 'Gmax',
			isGigantamax: true,
			isNonstandard: 'Gigantamax',
		},
	},
	gardevoirvoid: {
		base: 'gardevoir',
		data: {
			name: 'Gardevoir-Void',
			baseSpecies: 'Gardevoir',
			forme: 'Void',
			otherFormes: ['Gardevoir-Void-Mega', 'Gardevoir-Mega-Z'],
			cosmeticFormes: null,
			isNonstandard: 'Custom',
		},
	},
	gardevoirvoidmega: {
		base: 'gardevoirmega',
		data: {
			name: 'Gardevoir-Void-Mega',
			baseSpecies: 'Gardevoir',
			forme: 'Mega',
			requiredItem: 'Gardevoirite',
			battleOnly: 'Gardevoir-Void',
			changesFrom: 'Gardevoir-Void',
			isNonstandard: 'Custom',
		},
	},
	gardevoirmegaz: {
		base: 'gardevoirmega',
		data: {
			name: 'Gardevoir-Mega-Z',
			baseSpecies: 'Gardevoir',
			forme: 'Mega-Z',
			requiredItem: 'Gardevoirite',
			battleOnly: 'Gardevoir-Void',
			changesFrom: 'Gardevoir-Void',
			isNonstandard: 'Custom',
		},
	},
	lucariomegaz: {
		base: 'lucariomega',
		data: {
			name: 'Lucario-Mega-Z',
			baseSpecies: 'Lucario',
			forme: 'Mega-Z',
			requiredItem: 'Lucarionite',
			battleOnly: 'Lucario',
			changesFrom: 'Lucario',
			isNonstandard: 'Custom',
		},
	},
	raichumegax: {
		base: 'raichu',
		data: {
			name: 'Raichu-Mega-X',
			baseSpecies: 'Raichu',
			forme: 'Mega-X',
			battleOnly: 'Raichu',
			changesFrom: 'Raichu',
			isNonstandard: 'Custom',
		},
	},
	raichumegay: {
		base: 'raichu',
		data: {
			name: 'Raichu-Mega-Y',
			baseSpecies: 'Raichu',
			forme: 'Mega-Y',
			battleOnly: 'Raichu',
			changesFrom: 'Raichu',
			isNonstandard: 'Custom',
		},
	},
	scolipedemega: {
		base: 'scolipede',
		data: {
			name: 'Scolipede-Mega',
			baseSpecies: 'Scolipede',
			forme: 'Mega',
			battleOnly: 'Scolipede',
			changesFrom: 'Scolipede',
			isNonstandard: 'Custom',
		},
	},
	golisopodmega: {
		base: 'golisopod',
		data: {
			name: 'Golisopod-Mega',
			baseSpecies: 'Golisopod',
			forme: 'Mega',
			battleOnly: 'Golisopod',
			changesFrom: 'Golisopod',
			isNonstandard: 'Custom',
		},
	},
	golurkmega: {
		base: 'golurk',
		data: {
			name: 'Golurk-Mega',
			baseSpecies: 'Golurk',
			forme: 'Mega',
			battleOnly: 'Golurk',
			changesFrom: 'Golurk',
			isNonstandard: 'Custom',
		},
	},
	glimmoramega: {
		base: 'glimmora',
		data: {
			name: 'Glimmora-Mega',
			baseSpecies: 'Glimmora',
			forme: 'Mega',
			battleOnly: 'Glimmora',
			changesFrom: 'Glimmora',
			isNonstandard: 'Custom',
		},
	},
	greninjamega: {
		base: 'greninja',
		data: {
			name: 'Greninja-Mega',
			baseSpecies: 'Greninja',
			forme: 'Mega',
			battleOnly: 'Greninja',
			changesFrom: 'Greninja',
			isNonstandard: 'Custom',
		},
	},
	chesnaughtmega: {
		base: 'chesnaught',
		data: {
			name: 'Chesnaught-Mega',
			baseSpecies: 'Chesnaught',
			forme: 'Mega',
			battleOnly: 'Chesnaught',
			changesFrom: 'Chesnaught',
			isNonstandard: 'Custom',
		},
	},
	delphoxmega: {
		base: 'delphox',
		data: {
			name: 'Delphox-Mega',
			baseSpecies: 'Delphox',
			forme: 'Mega',
			battleOnly: 'Delphox',
			changesFrom: 'Delphox',
			isNonstandard: 'Custom',
		},
	},
	dragalgemega: {
		base: 'dragalge',
		data: {
			name: 'Dragalge-Mega',
			baseSpecies: 'Dragalge',
			forme: 'Mega',
			battleOnly: 'Dragalge',
			changesFrom: 'Dragalge',
			isNonstandard: 'Custom',
		},
	},
	dragonitemega: {
		base: 'dragonite',
		data: {
			name: 'Dragonite-Mega',
			baseSpecies: 'Dragonite',
			forme: 'Mega',
			battleOnly: 'Dragonite',
			changesFrom: 'Dragonite',
			isNonstandard: 'Custom',
		},
	},
	baxcaliburmega: {
		base: 'baxcalibur',
		data: {
			name: 'Baxcalibur-Mega',
			baseSpecies: 'Baxcalibur',
			forme: 'Mega',
			battleOnly: 'Baxcalibur',
			changesFrom: 'Baxcalibur',
			isNonstandard: 'Custom',
		},
	},
	emboarmega: {
		base: 'emboar',
		data: {
			name: 'Emboar-Mega',
			baseSpecies: 'Emboar',
			forme: 'Mega',
			battleOnly: 'Emboar',
			changesFrom: 'Emboar',
			isNonstandard: 'Custom',
		},
	},
	chandeluremega: {
		base: 'chandelure',
		data: {
			name: 'Chandelure-Mega',
			baseSpecies: 'Chandelure',
			forme: 'Mega',
			battleOnly: 'Chandelure',
			changesFrom: 'Chandelure',
			isNonstandard: 'Custom',
		},
	},
	crabominablemega: {
		base: 'crabominable',
		data: {
			name: 'Crabominable-Mega',
			baseSpecies: 'Crabominable',
			forme: 'Mega',
			battleOnly: 'Crabominable',
			changesFrom: 'Crabominable',
			isNonstandard: 'Custom',
		},
	},
	floetteeternalmega: {
		base: 'floetteeternal',
		data: {
			name: 'Floette-Eternal-Mega',
			baseSpecies: 'Floette',
			forme: 'Eternal-Mega',
			battleOnly: 'Floette-Eternal',
			changesFrom: 'Floette-Eternal',
			isNonstandard: 'Custom',
		},
	},
	chimechomega: {
		base: 'chimecho',
		data: {
			name: 'Chimecho-Mega',
			baseSpecies: 'Chimecho',
			forme: 'Mega',
			battleOnly: 'Chimecho',
			changesFrom: 'Chimecho',
			isNonstandard: 'Custom',
		},
	},
	froslassmega: {
		base: 'froslass',
		data: {
			name: 'Froslass-Mega',
			baseSpecies: 'Froslass',
			forme: 'Mega',
			battleOnly: 'Froslass',
			changesFrom: 'Froslass',
			isNonstandard: 'Custom',
		},
	},
	feraligatrmega: {
		base: 'feraligatr',
		data: {
			name: 'Feraligatr-Mega',
			baseSpecies: 'Feraligatr',
			forme: 'Mega',
			battleOnly: 'Feraligatr',
			changesFrom: 'Feraligatr',
			isNonstandard: 'Custom',
		},
	},
	eelektrossmega: {
		base: 'eelektross',
		data: {
			name: 'Eelektross-Mega',
			baseSpecies: 'Eelektross',
			forme: 'Mega',
			battleOnly: 'Eelektross',
			changesFrom: 'Eelektross',
			isNonstandard: 'Custom',
		},
	},
	excadrillmega: {
		base: 'excadrill',
		data: {
			name: 'Excadrill-Mega',
			baseSpecies: 'Excadrill',
			forme: 'Mega',
			battleOnly: 'Excadrill',
			changesFrom: 'Excadrill',
			isNonstandard: 'Custom',
		},
	},
	meowsticmmega: {
		base: 'meowstic',
		data: {
			name: 'Meowstic-M-Mega',
			baseSpecies: 'Meowstic',
			forme: 'M-Mega',
			battleOnly: 'Meowstic',
			changesFrom: 'Meowstic',
			isNonstandard: 'Custom',
		},
	},
	meowsticfmega: {
		base: 'meowsticf',
		data: {
			name: 'Meowstic-F-Mega',
			baseSpecies: 'Meowstic',
			forme: 'F-Mega',
			battleOnly: 'Meowstic-F',
			changesFrom: 'Meowstic-F',
			isNonstandard: 'Custom',
		},
	},
	scovillainmega: {
		base: 'scovillain',
		data: {
			name: 'Scovillain-Mega',
			baseSpecies: 'Scovillain',
			forme: 'Mega',
			battleOnly: 'Scovillain',
			changesFrom: 'Scovillain',
			isNonstandard: 'Custom',
		},
	},
	malamarmega: {
		base: 'malamar',
		data: {
			name: 'Malamar-Mega',
			baseSpecies: 'Malamar',
			forme: 'Mega',
			battleOnly: 'Malamar',
			changesFrom: 'Malamar',
			isNonstandard: 'Custom',
		},
	},
	clefablemega: {
		base: 'clefable',
		data: {
			name: 'Clefable-Mega',
			baseSpecies: 'Clefable',
			forme: 'Mega',
			battleOnly: 'Clefable',
			changesFrom: 'Clefable',
			isNonstandard: 'Custom',
		},
	},
	absolmegaz: {
		base: 'absolmega',
		data: {
			name: 'Absol-Mega-Z',
			baseSpecies: 'Absol',
			forme: 'Mega-Z',
			battleOnly: 'Absol',
			changesFrom: 'Absol',
			isNonstandard: 'Custom',
		},
	},
};

const CUSTOM_ICON_SPRITES: {[id: string]: string} = {
	garchomp: 'garchomp',
	garchompmega: 'garchomp-mega',
	flygonmegaz: 'flygon-megaz',
	garchompmegaz: 'garchomp-megaz',
	garchompbattlebond: 'garchomp-battlebond',
	gardevoirvoidmega: 'gardevoirvoid-mega',
	gardevoirmegaz: 'gardevoir-megaz',
	victreebelmega: 'victreebel-mega',
	falinksmega: 'falinks-mega',
	scraftymega: 'scrafty-mega',
	skarmorymega: 'skarmory-mega',
	staraptormega: 'staraptor-mega',
	lucariomegaz: 'lucario-megaz',
	meganiummega: 'meganium-mega',
	raichumegax: 'raichu-megax',
	raichumegay: 'raichu-megay',
	scolipedemega: 'scolipede-mega',
	golisopodmega: 'golisopod-mega',
	golurkmega: 'golurk-mega',
	glimmoramega: 'glimmora-mega',
	greninjamega: 'greninja-mega',
	greninjaash: 'greninja-ash',
	greninjabond: 'greninja',
	alakazammega: 'alakazam-mega',
	gengarmega: 'gengar-mega',
	gengargmax: 'gengar-gmax',
	houndoommega: 'houndoom-mega',
	hawluchamega: 'hawlucha-mega',
	salamencemega: 'salamence-mega',
	hatterenegmax: 'hatterene-gmax',
	palafinhero: 'palafin-hero',
	mausholdfour: 'maushold-four',
	sinistchamasterpiece: 'sinistcha-masterpiece',
	venusaurmega: 'venusaur-mega',
	venusaurgmax: 'venusaur-gmax',
	centiskorchgmax: 'centiskorch-gmax',
	basculegionf: 'basculegion-f',
	ninetalesalola: 'ninetales-alola',
	lucariomega: 'lucario-mega',
	slowbrogalar: 'slowbro-galar',
	slowbromega: 'slowbro-mega',
	slowkinggalar: 'slowking-galar',
	weavilef: 'weavile-f',
	taurospaldeacombat: 'tauros-paldeacombat',
	taurospaldeablaze: 'tauros-paldeablaze',
	taurospaldeaaqua: 'tauros-paldeaaqua',
	tatsugirimega: 'tatsugiri-mega',
	tatsugiridroopymega: 'tatsugiri-mega',
	tatsugiristretchymega: 'tatsugiri-mega',
	zoroarkhisui: 'zoroark-hisui',
	typhlosionhisui: 'typhlosion-hisui',
	indeedeef: 'indeedee-f',
	rotomwash: 'rotom-wash',
	rotomheat: 'rotom-heat',
	rotomfrost: 'rotom-frost',
	rotomfan: 'rotom-fan',
	rotommow: 'rotom-mow',
	weezinggalar: 'weezing-galar',
	luxrayf: 'luxray-f',
	sneaselhisui: 'sneasel-hisui',
	sneaself: 'sneasel-f',
	sneaselhisuif: 'sneasel-hisui-f',
	alcremiegmax: 'alcremie-gmax',
	metagrossmega: 'metagross-mega',
	banettemega: 'banette-mega',
	starmiemega: 'starmie-mega',
	heracrossmega: 'heracross-mega',
	chesnaughtmega: 'chesnaught-mega',
	delphoxmega: 'delphox-mega',
	dragalgemega: 'dragalge-mega',
	dragonitemega: 'dragonite-mega',
	steelixmega: 'steelix-mega',
	drampamega: 'drampa-mega',
	baxcaliburmega: 'baxcalibur-mega',
	emboarmega: 'emboar-mega',
	chandeluremega: 'chandelure-mega',
	crabominablemega: 'crabominable-mega',
	floettemega: 'floette-mega',
	floetteeternalmega: 'floette-eternal-mega',
	chimechomega: 'chimecho-mega',
	froslassmega: 'froslass-mega',
	feraligatrmega: 'feraligatr-mega',
	eelektrossmega: 'eelektross-mega',
	excadrillmega: 'excadrill-mega',
	meowsticmmega: 'meowstic-mmega',
	meowsticfmega: 'meowstic-fmega',
	scovillainmega: 'scovillain-mega',
	malamarmega: 'malamar-mega',
	clefablemega: 'clefable-mega',
	pyroarmega: 'pyroar-mega',
	appletungmax: 'appletun-gmax',
	charizardgmax: 'charizard-gmax',
	blastoisegmax: 'blastoise-gmax',
	butterfreegmax: 'butterfree-gmax',
	coalossalgmax: 'coalossal-gmax',
	copperajahgmax: 'copperajah-gmax',
	corviknightgmax: 'corviknight-gmax',
	drednawgmax: 'drednaw-gmax',
	eeveegmax: 'eevee-gmax',
	flapplegmax: 'flapple-gmax',
	garbodorgmax: 'garbodor-gmax',
	grimmsnarlgmax: 'grimmsnarl-gmax',
	inteleongmax: 'inteleon-gmax',
	kinglergmax: 'kingler-gmax',
	laprasgmax: 'lapras-gmax',
	machampgmax: 'machamp-gmax',
	melmetalgmax: 'melmetal-gmax',
	meowthgmax: 'meowth-gmax',
	orbeetlegmax: 'orbeetle-gmax',
	pikachugmax: 'pikachu-gmax',
	rillaboomgmax: 'rillaboom-gmax',
	sandacondagmax: 'sandaconda-gmax',
	snorlaxgmax: 'snorlax-gmax',
	cinderacegmax: 'cinderace-gmax',
	duraludongmax: 'duraludon-gmax',
	toxtricitygmax: 'toxtricity-gmax',
	toxtricitylowkeygmax: 'toxtricity-lowkeygmax',
	urshifugmax: 'urshifu-gmax',
	urshifurapidstrikegmax: 'urshifu-rapidstrikegmax',
	butterfreemega: 'butterfree-mega',
	serperiormega: 'serperior-mega',
	mismagiusmega: 'mismagius-mega',
	absolmegaz: 'absol-megaz',
	ursalunabloodmoon: 'ursaluna-bloodmoon',
	lilliganthisui: 'lilligant-hisui',
	decidueyehisui: 'decidueye-hisui',
	silvallyfighting: 'silvally-fighting',
	silvallyflying: 'silvally-flying',
	silvallypoison: 'silvally-poison',
	silvallyground: 'silvally-ground',
	silvallyrock: 'silvally-rock',
	silvallybug: 'silvally-bug',
	silvallyghost: 'silvally-ghost',
	silvallysteel: 'silvally-steel',
	silvallyunknown: 'silvally-unknown',
	silvallyfire: 'silvally-fire',
	silvallywater: 'silvally-water',
	silvallygrass: 'silvally-grass',
	silvallyelectric: 'silvally-electric',
	silvallypsychic: 'silvally-psychic',
	silvallyice: 'silvally-ice',
	silvallydragon: 'silvally-dragon',
	silvallydark: 'silvally-dark',
	silvallyfairy: 'silvally-fairy',
};

const CUSTOM_TEAMBUILDER_SPRITES: {[id: string]: {x: number, y: number, backgroundSize: string}} = {
	flygonmegaz: {x: 9, y: 3, backgroundSize: '78px auto'},
	gardevoirvoidmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	gardevoirmegaz: {x: 9, y: 3, backgroundSize: '78px auto'},
	scraftymega: {x: 9, y: 3, backgroundSize: '78px auto'},
	skarmorymega: {x: 9, y: 3, backgroundSize: '78px auto'},
	staraptormega: {x: 9, y: 3, backgroundSize: '78px auto'},
	lucariomegaz: {x: 9, y: 3, backgroundSize: '78px auto'},
	meganiummega: {x: 9, y: 3, backgroundSize: '78px auto'},
	raichumegax: {x: 9, y: 3, backgroundSize: '78px auto'},
	raichumegay: {x: 5, y: 0, backgroundSize: '86px auto'},
	golisopodmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	golurkmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	glimmoramega: {x: 9, y: 3, backgroundSize: '78px auto'},
	greninjamega: {x: 13, y: 4, backgroundSize: '70px auto'},
	greninjaash: {x: 9, y: 3, backgroundSize: '78px auto'},
	greninjabond: {x: 9, y: 3, backgroundSize: '78px auto'},
	metagrossmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	banettemega: {x: 9, y: 5, backgroundSize: '78px auto'},
	starmiemega: {x: 16, y: 3, backgroundSize: '64px auto'},
	heracrossmega: {x: 9, y: 5, backgroundSize: '78px auto'},
	chesnaughtmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	delphoxmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	dragalgemega: {x: 9, y: 3, backgroundSize: '78px auto'},
	dragonitemega: {x: 7, y: 7, backgroundSize: '82px auto'},
	drampamega: {x: 9, y: 3, backgroundSize: '78px auto'},
	baxcaliburmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	emboarmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	chandeluremega: {x: 9, y: 3, backgroundSize: '78px auto'},
	crabominablemega: {x: 9, y: 3, backgroundSize: '78px auto'},
	floettemega: {x: 9, y: 3, backgroundSize: '78px auto'},
	floetteeternalmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	chimechomega: {x: 9, y: 3, backgroundSize: '78px auto'},
	froslassmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	feraligatrmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	eelektrossmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	excadrillmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	meowsticmmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	meowsticfmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	scovillainmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	malamarmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	clefablemega: {x: 9, y: 3, backgroundSize: '78px auto'},
	pyroarmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	blastoisegmax: {x: 9, y: 3, backgroundSize: '78px auto'},
	toxtricitygmax: {x: 9, y: 3, backgroundSize: '78px auto'},
	toxtricitylowkeygmax: {x: 9, y: 3, backgroundSize: '78px auto'},
	butterfreemega: {x: 9, y: 3, backgroundSize: '78px auto'},
	serperiormega: {x: 9, y: 3, backgroundSize: '78px auto'},
	mismagiusmega: {x: 9, y: 3, backgroundSize: '78px auto'},
	absolmegaz: {x: 9, y: 3, backgroundSize: '78px auto'},
	ursalunabloodmoon: {x: 9, y: 3, backgroundSize: '78px auto'},
	garchomp: {x: 9, y: 7, backgroundSize: '78px auto'},
	garchompmega: {x: 5, y: 13, backgroundSize: '86px auto'},
	garchompmegaz: {x: 7, y: 8, backgroundSize: '82px auto'},
	garchompbattlebond: {x: 7, y: 13, backgroundSize: '82px auto'},
};

const CUSTOM_STATIC_BATTLE_SPRITES: {[id: string]: {
	front: {w: number, h: number},
	back: {w: number, h: number},
	shinyFront?: {w: number, h: number},
	shinyBack?: {w: number, h: number},
}} = {
	vikavolt: {
		front: {w: 180, h: 142},
		back: {w: 180, h: 154},
	},
	sableyemega: {
		front: {w: 112, h: 120},
		back: {w: 74, h: 128},
	},
	pinsir: {
		front: {w: 142, h: 124},
		back: {w: 136, h: 120},
	},
	pinsirmega: {
		front: {w: 184, h: 140},
		back: {w: 176, h: 150},
	},
	ribombee: {
		front: {w: 98, h: 108},
		back: {w: 100, h: 94},
	},
	pidgeot: {
		front: {w: 152, h: 144},
		back: {w: 126, h: 132},
	},
	pidgeotmega: {
		front: {w: 184, h: 170},
		back: {w: 182, h: 176},
	},
	aggron: {
		front: {w: 142, h: 136},
		back: {w: 124, h: 142},
		shinyBack: {w: 124, h: 140},
	},
	aggronmega: {
		front: {w: 190, h: 148},
		back: {w: 182, h: 140},
		shinyFront: {w: 186, h: 146},
		shinyBack: {w: 182, h: 138},
	},
	flygonmegaz: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	gardevoirvoidmega: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	gardevoirmegaz: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	greninjaash: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	metagrossmega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	banettemega: {
		front: {w: 162, h: 154},
		back: {w: 170, h: 168},
	},
	starmiemega: {
		front: {w: 112, h: 136},
		back: {w: 118, h: 138},
	},
	heracrossmega: {
		front: {w: 174, h: 166},
		back: {w: 164, h: 172},
		shinyBack: {w: 168, h: 176},
	},
	blastoisegmax: {
		front: {w: 182, h: 180},
		back: {w: 190, h: 186},
	},
	charizardgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	appletungmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	coalossal: {
		front: {w: 136, h: 164},
		back: {w: 136, h: 158},
	},
	coalossalgmax: {
		front: {w: 150, h: 188},
		back: {w: 168, h: 190},
		shinyBack: {w: 172, h: 190},
	},
	copperajah: {
		front: {w: 154, h: 140},
		back: {w: 144, h: 140},
	},
	copperajahgmax: {
		front: {w: 186, h: 188},
		back: {w: 156, h: 188},
	},
	drednawgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	eeveegmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	flapplegmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	garbodorgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	kinglergmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	laprasgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	machampgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	melmetalgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	meowthgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	orbeetlegmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	pikachugmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	rillaboomgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	sandacondagmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	snorlaxgmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	toxtricitygmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	toxtricitylowkeygmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	urshifugmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	urshifurapidstrikegmax: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	butterfreemega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	serperiormega: {
		front: {w: 132, h: 132},
		back: {w: 136, h: 136},
	},
	mismagiusmega: {
		front: {w: 186, h: 186},
		back: {w: 184, h: 186},
	},
	garchomp: {
		front: {w: 146, h: 152},
		back: {w: 152, h: 146},
	},
	garchompmega: {
		front: {w: 186, h: 150},
		back: {w: 146, h: 146},
	},
	garchompmegaz: {
		front: {w: 192, h: 186},
		back: {w: 192, h: 184},
	},
	garchompbattlebond: {
		front: {w: 192, h: 174},
		back: {w: 188, h: 152},
	},
	greninjamega: {
		front: {w: 140, h: 180},
		back: {w: 172, h: 168},
	},
	dragonitemega: {
		front: {w: 178, h: 174},
		back: {w: 174, h: 184},
	},
	raichumegay: {
		front: {w: 186, h: 165},
		back: {w: 192, h: 147},
	},
	scolipede: {
		front: {w: 183, h: 169},
		back: {w: 185, h: 163},
		shinyFront: {w: 183, h: 167},
		shinyBack: {w: 183, h: 161},
	},
	scolipedemega: {
		front: {w: 182, h: 192},
		back: {w: 189, h: 175},
	},
	staraptormega: {
		front: {w: 173, h: 161},
		back: {w: 157, h: 171},
	},
	toedscruel: {
		front: {w: 104, h: 142},
		back: {w: 128, h: 144},
	},
	archaludon: {
		front: {w: 156, h: 180},
		back: {w: 158, h: 190},
	},
	hydrapple: {
		front: {w: 118, h: 168},
		back: {w: 140, h: 178},
	},
	centiskorch: {
		front: {w: 180, h: 150},
		back: {w: 186, h: 150},
	},
	centiskorchgmax: {
		front: {w: 188, h: 188},
		back: {w: 186, h: 188},
	},
	basculegion: {
		front: {w: 170, h: 112},
		back: {w: 190, h: 106},
		shinyFront: {w: 184, h: 132},
		shinyBack: {w: 192, h: 116},
	},
	basculegionf: {
		front: {w: 170, h: 106},
		back: {w: 190, h: 106},
		shinyFront: {w: 182, h: 128},
		shinyBack: {w: 192, h: 118},
	},
	kingambit: {
		front: {w: 134, h: 192},
		back: {w: 120, h: 190},
	},
	electivire: {
		front: {w: 146, h: 140},
		back: {w: 150, h: 136},
	},
	farigiraf: {
		front: {w: 132, h: 170},
		back: {w: 126, h: 172},
	},
	ninetales: {
		front: {w: 130, h: 130},
		back: {w: 150, h: 128},
	},
	ninetalesalola: {
		front: {w: 146, h: 142},
		back: {w: 138, h: 142},
	},
	meowscarada: {
		front: {w: 130, h: 158},
		back: {w: 112, h: 156},
	},
	magmortar: {
		front: {w: 154, h: 144},
		back: {w: 136, h: 140},
	},
	magneton: {
		front: {w: 126, h: 110},
		back: {w: 114, h: 104},
	},
	magnezone: {
		front: {w: 148, h: 118},
		back: {w: 150, h: 100},
	},
	gliscor: {
		front: {w: 146, h: 114},
		back: {w: 140, h: 124},
	},
	metagross: {
		front: {w: 156, h: 100},
		back: {w: 152, h: 104},
	},
	primarina: {
		front: {w: 140, h: 160},
		back: {w: 138, h: 156},
	},
	talonflame: {
		front: {w: 192, h: 156},
		back: {w: 170, h: 190},
	},
	salamence: {
		front: {w: 156, h: 142},
		back: {w: 166, h: 152},
	},
	salamencemega: {
		front: {w: 192, h: 146},
		back: {w: 192, h: 164},
	},
	rotom: {
		front: {w: 122, h: 100},
		back: {w: 122, h: 98},
	},
	rotomwash: {
		front: {w: 120, h: 106},
		back: {w: 120, h: 106},
	},
	rotomheat: {
		front: {w: 152, h: 122},
		back: {w: 136, h: 120},
	},
	rotomfrost: {
		front: {w: 158, h: 136},
		back: {w: 158, h: 136},
	},
	rotomfan: {
		front: {w: 148, h: 118},
		back: {w: 144, h: 116},
	},
	rotommow: {
		front: {w: 102, h: 130},
		back: {w: 104, h: 104},
	},
	weezinggalar: {
		front: {w: 178, h: 186},
		back: {w: 178, h: 186},
		shinyBack: {w: 178, h: 185},
	},
	empoleon: {
		front: {w: 156, h: 150},
		back: {w: 134, h: 148},
	},
	hatterene: {
		front: {w: 110, h: 188},
		back: {w: 110, h: 188},
	},
	hatterenegmax: {
		front: {w: 130, h: 192},
		back: {w: 158, h: 192},
	},
	annihilape: {
		front: {w: 130, h: 136},
		back: {w: 156, h: 158},
		shinyFront: {w: 132, h: 136},
	},
	arboliva: {
		front: {w: 170, h: 144},
		back: {w: 162, h: 136},
	},
	armarouge: {
		front: {w: 94, h: 156},
		back: {w: 82, h: 160},
	},
	ceruledge: {
		front: {w: 149, h: 169},
		back: {w: 99, h: 175},
	},
	charizard: {
		front: {w: 158, h: 174},
		back: {w: 168, h: 166},
	},
	gholdengo: {
		front: {w: 98, h: 150},
		back: {w: 116, h: 146},
	},
	overqwil: {
		front: {w: 172, h: 166},
		back: {w: 164, h: 186},
	},
	palafin: {
		front: {w: 120, h: 76},
		back: {w: 116, h: 76},
	},
	palafinhero: {
		front: {w: 92, h: 148},
		back: {w: 90, h: 176},
	},
	cyclizar: {
		front: {w: 138, h: 136},
		back: {w: 142, h: 124},
	},
	tyrantrum: {
		front: {w: 192, h: 172},
		back: {w: 158, h: 152},
	},
	venusaur: {
		front: {w: 152, h: 136},
		back: {w: 162, h: 126},
	},
	venusaurmega: {
		front: {w: 188, h: 148},
		back: {w: 186, h: 144},
	},
	venusaurgmax: {
		front: {w: 192, h: 178},
		back: {w: 188, h: 170},
	},
	victreebel: {
		front: {w: 149, h: 121},
		back: {w: 135, h: 139},
	},
	victreebelmega: {
		front: {w: 147, h: 171},
		back: {w: 157, h: 177},
	},
	sinistcha: {
		front: {w: 76, h: 124},
		back: {w: 82, h: 122},
	},
	sinistchamasterpiece: {
		front: {w: 76, h: 124},
		back: {w: 82, h: 122},
	},
	lucariomega: {
		front: {w: 114, h: 128},
		back: {w: 86, h: 130},
	},
	lucariomegaz: {
		front: {w: 138, h: 144},
		back: {w: 118, h: 142},
	},
	tinkaton: {
		front: {w: 148, h: 140},
		back: {w: 118, h: 110},
	},
	sneasel: {
		front: {w: 107, h: 97},
		back: {w: 103, h: 97},
		shinyBack: {w: 105, h: 99},
	},
	sneaself: {
		front: {w: 107, h: 97},
		back: {w: 103, h: 97},
		shinyBack: {w: 105, h: 99},
	},
	sneaselhisui: {
		front: {w: 101, h: 93},
		back: {w: 105, h: 97},
	},
	sneaselhisuif: {
		front: {w: 101, h: 93},
		back: {w: 105, h: 97},
	},
	sneasler: {
		front: {w: 100, h: 152},
		back: {w: 120, h: 142},
	},
	slowbro: {
		front: {w: 119, h: 123},
		back: {w: 143, h: 119},
	},
	slowbrogalar: {
		front: {w: 147, h: 125},
		back: {w: 135, h: 117},
	},
	slowbromega: {
		front: {w: 111, h: 159},
		back: {w: 103, h: 159},
	},
	slowking: {
		front: {w: 100, h: 136},
		back: {w: 92, h: 136},
	},
	slowkinggalar: {
		front: {w: 90, h: 136},
		back: {w: 90, h: 136},
	},
	skeledirge: {
		front: {w: 160, h: 112},
		back: {w: 184, h: 130},
	},
	weavile: {
		front: {w: 112, h: 120},
		back: {w: 88, h: 122},
	},
	weavilef: {
		front: {w: 112, h: 120},
		back: {w: 88, h: 122},
	},
	espeon: {
		front: {w: 100, h: 106},
		back: {w: 80, h: 100},
	},
	gengar: {
		front: {w: 112, h: 104},
		back: {w: 110, h: 108},
		shinyFront: {w: 112, h: 108},
		shinyBack: {w: 110, h: 110},
	},
	gengarmega: {
		front: {w: 152, h: 132},
		back: {w: 172, h: 132},
		shinyFront: {w: 152, h: 132},
		shinyBack: {w: 172, h: 134},
	},
	gengargmax: {
		front: {w: 188, h: 180},
		back: {w: 192, h: 174},
		shinyFront: {w: 192, h: 184},
		shinyBack: {w: 192, h: 178},
	},
	lilligant: {
		front: {w: 104, h: 134},
		back: {w: 108, h: 134},
	},
	lilliganthisui: {
		front: {w: 106, h: 154},
		back: {w: 106, h: 144},
	},
	butterfree: {
		front: {w: 118, h: 104},
		back: {w: 116, h: 102},
	},
	butterfreegmax: {
		front: {w: 190, h: 186},
		back: {w: 190, h: 186},
	},
	corviknight: {
		front: {w: 102, h: 144},
		back: {w: 120, h: 130},
	},
	corviknightgmax: {
		front: {w: 192, h: 190},
		back: {w: 188, h: 190},
		shinyFront: {w: 192, h: 190},
		shinyBack: {w: 188, h: 191},
	},
	ironvaliant: {
		front: {w: 120, h: 162},
		back: {w: 120, h: 162},
	},
	grimmsnarl: {
		front: {w: 192, h: 152},
		back: {w: 192, h: 152},
	},
	grimmsnarlgmax: {
		front: {w: 128, h: 192},
		back: {w: 114, h: 192},
	},
	hydreigon: {
		front: {w: 160, h: 156},
		back: {w: 150, h: 160},
		shinyFront: {w: 172, h: 166},
		shinyBack: {w: 162, h: 172},
	},
	infernape: {
		front: {w: 148, h: 110},
		back: {w: 144, h: 136},
	},
	inteleon: {
		front: {w: 114, h: 192},
		back: {w: 114, h: 192},
	},
	inteleongmax: {
		front: {w: 126, h: 192},
		back: {w: 124, h: 180},
	},
	torterra: {
		front: {w: 144, h: 154},
		back: {w: 156, h: 156},
	},
	typhlosion: {
		front: {w: 123, h: 157},
		back: {w: 115, h: 145},
	},
	typhlosionhisui: {
		front: {w: 115, h: 165},
		back: {w: 137, h: 172},
	},
	tsareena: {
		front: {w: 136, h: 164},
		back: {w: 112, h: 165},
		shinyFront: {w: 137, h: 164},
		shinyBack: {w: 113, h: 165},
	},
	ursaluna: {
		front: {w: 152, h: 130},
		back: {w: 162, h: 134},
	},
	ursalunabloodmoon: {
		front: {w: 172, h: 160},
		back: {w: 156, h: 156},
	},
	cinderace: {
		front: {w: 90, h: 192},
		back: {w: 80, h: 160},
	},
	cinderacegmax: {
		front: {w: 162, h: 190},
		back: {w: 162, h: 190},
	},
	crobat: {
		front: {w: 158, h: 130},
		back: {w: 170, h: 98},
	},
	decidueye: {
		front: {w: 118, h: 158},
		back: {w: 76, h: 152},
	},
	decidueyehisui: {
		front: {w: 98, h: 164},
		back: {w: 98, h: 156},
	},
	dragapult: {
		front: {w: 142, h: 156},
		back: {w: 142, h: 156},
	},
	duraludon: {
		front: {w: 122, h: 150},
		back: {w: 134, h: 148},
	},
	duraludongmax: {
		front: {w: 152, h: 192},
		back: {w: 150, h: 192},
	},
	luxray: {
		front: {w: 126, h: 132},
		back: {w: 134, h: 128},
	},
	luxrayf: {
		front: {w: 126, h: 132},
		back: {w: 134, h: 128},
	},
	silvally: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyfighting: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 188},
		shinyBack: {w: 118, h: 186},
	},
	silvallyflying: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 164, h: 184},
		shinyBack: {w: 136, h: 180},
	},
	silvallypoison: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 156, h: 182},
		shinyBack: {w: 128, h: 180},
	},
	silvallyground: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 188},
		shinyBack: {w: 118, h: 186},
	},
	silvallyrock: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallybug: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 182},
		shinyBack: {w: 118, h: 182},
	},
	silvallyghost: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 148, h: 184},
		shinyBack: {w: 138, h: 182},
	},
	silvallysteel: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 188},
		shinyBack: {w: 118, h: 182},
	},
	silvallyunknown: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 146, h: 184},
		shinyBack: {w: 140, h: 180},
	},
	silvallyfire: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 140, h: 176},
		shinyBack: {w: 118, h: 174},
	},
	silvallywater: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 142, h: 186},
		shinyBack: {w: 126, h: 184},
	},
	silvallygrass: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 188},
		shinyBack: {w: 118, h: 186},
	},
	silvallyelectric: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 188},
		shinyBack: {w: 118, h: 186},
	},
	silvallypsychic: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 188},
		shinyBack: {w: 122, h: 184},
	},
	silvallyice: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 186},
		shinyBack: {w: 124, h: 184},
	},
	silvallydragon: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 176},
		shinyBack: {w: 118, h: 174},
	},
	silvallydark: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 138, h: 186},
	},
	silvallyfairy: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 156, h: 186},
		shinyBack: {w: 136, h: 182},
	},
	alcremie: {
		front: {w: 98, h: 126},
		back: {w: 76, h: 114},
	},
	alcremiegmax: {
		front: {w: 170, h: 192},
		back: {w: 170, h: 192},
	},
	incineroar: {
		front: {w: 192, h: 156},
		back: {w: 168, h: 144},
	},
	indeedee: {
		front: {w: 68, h: 110},
		back: {w: 64, h: 110},
	},
	indeedeef: {
		front: {w: 76, h: 104},
		back: {w: 72, h: 102},
	},
	frosmoth: {
		front: {w: 158, h: 132},
		back: {w: 150, h: 132},
	},
	falinks: {
		front: {w: 162, h: 104},
		back: {w: 162, h: 86},
	},
	falinksmega: {
		front: {w: 192, h: 154},
		back: {w: 188, h: 150},
	},
	perrserker: {
		front: {w: 96, h: 118},
		back: {w: 96, h: 112},
	},
	obstagoon: {
		front: {w: 120, h: 158},
		back: {w: 108, h: 146},
	},
	mrrime: {
		front: {w: 138, h: 152},
		back: {w: 138, h: 156},
	},
	milotic: {
		front: {w: 158, h: 146},
		back: {w: 162, h: 152},
	},
	ariados: {
		front: {w: 122, h: 102},
		back: {w: 116, h: 90},
	},
};

const CUSTOM_BW_SPRITES: {[id: string]: AnyObject} = {
	vikavolt: {
		num: 738,
		front: {w: 180, h: 142},
		back: {w: 180, h: 154},
	},
	sableyemega: {
		num: 302,
		front: {w: 112, h: 120},
		back: {w: 74, h: 128},
	},
	pinsir: {
		num: 127,
		front: {w: 142, h: 124},
		back: {w: 136, h: 120},
	},
	pinsirmega: {
		num: 127,
		front: {w: 184, h: 140},
		back: {w: 176, h: 150},
	},
	ribombee: {
		num: 743,
		front: {w: 98, h: 108},
		back: {w: 100, h: 94},
	},
	pidgeot: {
		num: 18,
		front: {w: 152, h: 144},
		back: {w: 126, h: 132},
	},
	pidgeotmega: {
		num: 18,
		front: {w: 184, h: 170},
		back: {w: 182, h: 176},
	},
	aggron: {
		num: 306,
		front: {w: 142, h: 136},
		back: {w: 124, h: 142},
		shinyBack: {w: 124, h: 140},
	},
	aggronmega: {
		num: 306,
		front: {w: 190, h: 148},
		back: {w: 182, h: 140},
		shinyFront: {w: 186, h: 146},
		shinyBack: {w: 182, h: 138},
	},
	incineroar: {
		num: 727,
		front: {w: 192, h: 156},
		back: {w: 168, h: 144},
	},
	indeedee: {
		num: 876,
		front: {w: 68, h: 110},
		back: {w: 64, h: 110},
	},
	indeedeef: {
		num: 876,
		front: {w: 76, h: 104},
		back: {w: 72, h: 102},
	},
	frosmoth: {
		num: 873,
		front: {w: 158, h: 132},
		back: {w: 150, h: 132},
	},
	falinks: {
		num: 870,
		front: {w: 162, h: 104},
		back: {w: 162, h: 86},
	},
	falinksmega: {
		num: 870,
		front: {w: 192, h: 154},
		back: {w: 188, h: 150},
	},
	perrserker: {
		num: 863,
		front: {w: 96, h: 118},
		back: {w: 96, h: 112},
	},
	obstagoon: {
		num: 862,
		front: {w: 120, h: 158},
		back: {w: 108, h: 146},
	},
	mrrime: {
		num: 866,
		front: {w: 138, h: 152},
		back: {w: 138, h: 156},
	},
	milotic: {
		num: 350,
		front: {w: 158, h: 146},
		back: {w: 162, h: 152},
	},
	ariados: {
		num: 168,
		front: {w: 122, h: 102},
		back: {w: 116, h: 90},
	},
	charizardgmax: {
		num: 6,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	appletungmax: {
		num: 842,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	blastoisegmax: {
		num: 9,
		front: {w: 182, h: 180},
		back: {w: 190, h: 186},
	},
	coalossal: {
		num: 839,
		front: {w: 136, h: 164},
		back: {w: 136, h: 158},
	},
	coalossalgmax: {
		num: 839,
		front: {w: 150, h: 188},
		back: {w: 168, h: 190},
		shinyBack: {w: 172, h: 190},
	},
	copperajah: {
		num: 879,
		front: {w: 154, h: 140},
		back: {w: 144, h: 140},
	},
	copperajahgmax: {
		num: 879,
		front: {w: 186, h: 188},
		back: {w: 156, h: 188},
	},
	drednawgmax: {
		num: 834,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	eeveegmax: {
		num: 133,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	flapplegmax: {
		num: 841,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	garbodorgmax: {
		num: 569,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	kinglergmax: {
		num: 99,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	laprasgmax: {
		num: 131,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	machampgmax: {
		num: 68,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	melmetalgmax: {
		num: 809,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	meowthgmax: {
		num: 52,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	orbeetlegmax: {
		num: 826,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	pikachugmax: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	rillaboomgmax: {
		num: 812,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	sandacondagmax: {
		num: 844,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	snorlaxgmax: {
		num: 143,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	toxtricitygmax: {
		num: 849,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	toxtricitylowkeygmax: {
		num: 849,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	urshifugmax: {
		num: 892,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	urshifurapidstrikegmax: {
		num: 892,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	alakazammega: {
		num: 65,
		front: {w: 178, h: 172},
		back: {w: 152, h: 178},
	},
	toedscruel: {
		num: 949,
		front: {w: 104, h: 142},
		back: {w: 128, h: 144},
	},
	archaludon: {
		num: 1018,
		front: {w: 156, h: 180},
		back: {w: 158, h: 190},
	},
	hydrapple: {
		num: 1019,
		front: {w: 118, h: 168},
		back: {w: 140, h: 178},
	},
	centiskorch: {
		num: 851,
		front: {w: 180, h: 150},
		back: {w: 186, h: 150},
	},
	centiskorchgmax: {
		num: 851,
		front: {w: 188, h: 188},
		back: {w: 186, h: 188},
	},
	basculegion: {
		num: 902,
		front: {w: 170, h: 112},
		back: {w: 190, h: 106},
	},
	basculegionf: {
		num: 902,
		front: {w: 170, h: 106},
		back: {w: 190, h: 106},
	},
	kingambit: {
		num: 983,
		front: {w: 134, h: 192},
		back: {w: 120, h: 190},
	},
	electivire: {
		num: 466,
		front: {w: 146, h: 140},
		back: {w: 150, h: 136},
	},
	farigiraf: {
		num: 981,
		front: {w: 132, h: 170},
		back: {w: 126, h: 172},
	},
	ninetales: {
		num: 38,
		front: {w: 130, h: 130},
		back: {w: 150, h: 128},
	},
	ninetalesalola: {
		num: 38,
		front: {w: 146, h: 142},
		back: {w: 138, h: 142},
	},
	meowscarada: {
		num: 908,
		front: {w: 130, h: 158},
		back: {w: 112, h: 156},
	},
	magmortar: {
		num: 467,
		front: {w: 154, h: 144},
		back: {w: 136, h: 140},
	},
	magneton: {
		num: 82,
		front: {w: 126, h: 110},
		back: {w: 114, h: 104},
	},
	magnezone: {
		num: 462,
		front: {w: 148, h: 118},
		back: {w: 150, h: 100},
	},
	gliscor: {
		num: 472,
		front: {w: 146, h: 114},
		back: {w: 140, h: 124},
	},
	metagross: {
		num: 376,
		front: {w: 156, h: 100},
		back: {w: 152, h: 104},
	},
	primarina: {
		num: 730,
		front: {w: 140, h: 160},
		back: {w: 138, h: 156},
	},
	talonflame: {
		num: 663,
		front: {w: 192, h: 156},
		back: {w: 170, h: 190},
	},
	salamence: {
		num: 373,
		front: {w: 156, h: 142},
		back: {w: 166, h: 152},
	},
	salamencemega: {
		num: 373,
		front: {w: 192, h: 146},
		back: {w: 192, h: 164},
	},
	rotom: {
		num: 479,
		front: {w: 122, h: 100},
		back: {w: 122, h: 98},
	},
	rotomwash: {
		num: 479,
		front: {w: 120, h: 106},
		back: {w: 120, h: 106},
	},
	rotomheat: {
		num: 479,
		front: {w: 152, h: 122},
		back: {w: 136, h: 120},
	},
	rotomfrost: {
		num: 479,
		front: {w: 158, h: 136},
		back: {w: 158, h: 136},
	},
	rotomfan: {
		num: 479,
		front: {w: 148, h: 118},
		back: {w: 144, h: 116},
	},
	rotommow: {
		num: 479,
		front: {w: 102, h: 130},
		back: {w: 104, h: 104},
	},
	weezinggalar: {
		num: 110,
		front: {w: 178, h: 186},
		back: {w: 178, h: 186},
		shinyBack: {w: 178, h: 185},
	},
	empoleon: {
		num: 395,
		front: {w: 156, h: 150},
		back: {w: 134, h: 148},
	},
	hatterene: {
		num: 858,
		front: {w: 110, h: 188},
		back: {w: 110, h: 188},
	},
	hatterenegmax: {
		num: 858,
		front: {w: 130, h: 192},
		back: {w: 158, h: 192},
	},
	annihilape: {
		num: 979,
		front: {w: 130, h: 136},
		back: {w: 156, h: 158},
		shinyFront: {w: 132, h: 136},
	},
	arboliva: {
		num: 930,
		front: {w: 170, h: 144},
		back: {w: 162, h: 136},
	},
	armarouge: {
		num: 936,
		front: {w: 94, h: 156},
		back: {w: 82, h: 160},
	},
	ceruledge: {
		num: 937,
		front: {w: 149, h: 169},
		back: {w: 99, h: 175},
	},
	charizard: {
		num: 6,
		front: {w: 158, h: 174},
		back: {w: 168, h: 166},
	},
	gholdengo: {
		num: 1000,
		front: {w: 98, h: 150},
		back: {w: 116, h: 146},
	},
	overqwil: {
		num: 904,
		front: {w: 172, h: 166},
		back: {w: 164, h: 186},
	},
	garganacl: {
		num: 934,
		front: {w: 148, h: 134},
		back: {w: 146, h: 140},
	},
	maushold: {
		num: 925,
		front: {w: 128, h: 84},
		back: {w: 134, h: 88},
	},
	mausholdfour: {
		num: 925,
		front: {w: 138, h: 84},
		back: {w: 142, h: 88},
	},
	lokix: {
		num: 920,
		front: {w: 92, h: 126},
		back: {w: 104, h: 132},
	},
	bellibolt: {
		num: 939,
		front: {w: 96, h: 106},
		back: {w: 92, h: 104},
	},
	kilowattrel: {
		num: 941,
		front: {w: 100, h: 106},
		back: {w: 114, h: 150},
	},
	grafaiai: {
		num: 945,
		front: {w: 130, h: 108},
		back: {w: 140, h: 90},
	},
	rabsca: {
		num: 954,
		front: {w: 82, h: 134},
		back: {w: 78, h: 132},
	},
	espathra: {
		num: 956,
		front: {w: 116, h: 144},
		back: {w: 116, h: 140},
	},
	revavroom: {
		num: 966,
		front: {w: 164, h: 114},
		back: {w: 168, h: 112},
	},
	houndstone: {
		num: 972,
		front: {w: 120, h: 124},
		back: {w: 122, h: 140},
	},
	houndoom: {
		num: 229,
		front: {w: 100, h: 132},
		back: {w: 102, h: 130},
		shinyBack: {w: 104, h: 130},
	},
	houndoommega: {
		num: 229,
		front: {w: 124, h: 168},
		back: {w: 116, h: 164},
		shinyBack: {w: 114, h: 164},
	},
	cetitan: {
		num: 975,
		front: {w: 154, h: 110},
		back: {w: 188, h: 132},
	},
	clodsire: {
		num: 980,
		front: {w: 122, h: 72},
		back: {w: 182, h: 134},
	},
	palafin: {
		num: 964,
		front: {w: 120, h: 76},
		back: {w: 116, h: 76},
	},
	palafinhero: {
		num: 964,
		front: {w: 92, h: 148},
		back: {w: 90, h: 176},
	},
	cyclizar: {
		num: 967,
		front: {w: 138, h: 136},
		back: {w: 142, h: 124},
	},
	tyrantrum: {
		num: 697,
		front: {w: 192, h: 172},
		back: {w: 158, h: 152},
	},
	venusaur: {
		num: 3,
		front: {w: 152, h: 136},
		back: {w: 162, h: 126},
	},
	venusaurmega: {
		num: 3,
		front: {w: 188, h: 148},
		back: {w: 186, h: 144},
	},
	venusaurgmax: {
		num: 3,
		front: {w: 192, h: 178},
		back: {w: 188, h: 170},
	},
	victreebel: {
		num: 71,
		front: {w: 149, h: 121},
		back: {w: 135, h: 139},
	},
	victreebelmega: {
		num: 71,
		front: {w: 147, h: 171},
		back: {w: 157, h: 177},
	},
	sinistcha: {
		num: 1013,
		front: {w: 76, h: 124},
		back: {w: 82, h: 122},
	},
	sinistchamasterpiece: {
		num: 1013,
		front: {w: 76, h: 124},
		back: {w: 82, h: 122},
	},
	alcremie: {
		num: 869,
		front: {w: 98, h: 126},
		back: {w: 76, h: 114},
	},
	alcremiegmax: {
		num: 869,
		front: {w: 170, h: 192},
		back: {w: 170, h: 192},
	},
	ursalunabloodmoon: {
		num: 901,
		front: {w: 172, h: 160},
		back: {w: 156, h: 156},
	},
	flygonmegaz: {
		num: 330,
		front: {w: 54, h: 54},
		back: {w: 72, h: 72},
	},
	garchomp: {
		num: 445,
		front: {w: 146, h: 152},
		back: {w: 152, h: 146},
	},
	garchompmega: {
		num: 445,
		front: {w: 186, h: 150},
		back: {w: 146, h: 146},
	},
	garchompmegaz: {
		num: 445,
		front: {w: 192, h: 186},
		back: {w: 192, h: 184},
	},
	garchompbattlebond: {
		num: 445,
		front: {w: 192, h: 174},
		back: {w: 188, h: 152},
	},
	gardevoirmegaz: {
		num: 282,
		front: {w: 48, h: 48},
		back: {w: 72, h: 72},
	},
	scraftymega: {
		num: 560,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	skarmorymega: {
		num: 227,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	staraptormega: {
		num: 398,
		front: {w: 173, h: 161},
		back: {w: 157, h: 171},
	},
	lucariomega: {
		num: 448,
		front: {w: 114, h: 128},
		back: {w: 86, h: 130},
	},
	lucariomegaz: {
		num: 448,
		front: {w: 138, h: 144},
		back: {w: 118, h: 142},
	},
	tinkaton: {
		num: 959,
		front: {w: 148, h: 140},
		back: {w: 118, h: 110},
	},
	sneasel: {
		num: 215,
		front: {w: 107, h: 97},
		back: {w: 103, h: 97},
		shinyBack: {w: 105, h: 99},
	},
	sneaself: {
		num: 215,
		front: {w: 107, h: 97},
		back: {w: 103, h: 97},
		shinyBack: {w: 105, h: 99},
	},
	sneaselhisui: {
		num: 215,
		front: {w: 101, h: 93},
		back: {w: 105, h: 97},
	},
	sneaselhisuif: {
		num: 215,
		front: {w: 101, h: 93},
		back: {w: 105, h: 97},
	},
	sneasler: {
		num: 903,
		front: {w: 100, h: 152},
		back: {w: 120, h: 142},
	},
	slowbro: {
		num: 80,
		front: {w: 119, h: 123},
		back: {w: 143, h: 119},
	},
	slowbrogalar: {
		num: 80,
		front: {w: 147, h: 125},
		back: {w: 135, h: 117},
	},
	slowbromega: {
		num: 80,
		front: {w: 111, h: 159},
		back: {w: 103, h: 159},
	},
	slowking: {
		num: 199,
		front: {w: 100, h: 136},
		back: {w: 92, h: 136},
	},
	slowkinggalar: {
		num: 199,
		front: {w: 90, h: 136},
		back: {w: 90, h: 136},
	},
	skeledirge: {
		num: 911,
		front: {w: 160, h: 112},
		back: {w: 184, h: 130},
	},
	weavile: {
		num: 461,
		front: {w: 112, h: 120},
		back: {w: 88, h: 122},
		frontf: {w: 112, h: 120},
		backf: {w: 88, h: 122},
	},
	weavilef: {
		num: 461,
		front: {w: 112, h: 120},
		back: {w: 88, h: 122},
	},
	espeon: {
		num: 196,
		front: {w: 100, h: 106},
		back: {w: 80, h: 100},
	},
	gengar: {
		num: 94,
		front: {w: 112, h: 104},
		back: {w: 110, h: 108},
	},
	gengarmega: {
		num: 94,
		front: {w: 152, h: 132},
		back: {w: 172, h: 132},
	},
	gengargmax: {
		num: 94,
		front: {w: 188, h: 180},
		back: {w: 192, h: 174},
	},
	lilligant: {
		num: 549,
		front: {w: 104, h: 134},
		back: {w: 108, h: 134},
	},
	lilliganthisui: {
		num: 549,
		front: {w: 106, h: 154},
		back: {w: 106, h: 144},
	},
	butterfree: {
		num: 12,
		front: {w: 118, h: 104},
		back: {w: 116, h: 102},
	},
	butterfreegmax: {
		num: 12,
		front: {w: 190, h: 186},
		back: {w: 190, h: 186},
	},
	corviknight: {
		num: 823,
		front: {w: 102, h: 144},
		back: {w: 120, h: 130},
	},
	corviknightgmax: {
		num: 823,
		front: {w: 192, h: 190},
		back: {w: 188, h: 190},
	},
	ironvaliant: {
		num: 1006,
		front: {w: 120, h: 162},
		back: {w: 120, h: 162},
	},
	grimmsnarl: {
		num: 861,
		front: {w: 192, h: 152},
		back: {w: 192, h: 152},
	},
	grimmsnarlgmax: {
		num: 861,
		front: {w: 128, h: 192},
		back: {w: 114, h: 192},
	},
	hydreigon: {
		num: 635,
		front: {w: 160, h: 156},
		back: {w: 150, h: 160},
	},
	infernape: {
		num: 392,
		front: {w: 148, h: 110},
		back: {w: 144, h: 136},
	},
	inteleon: {
		num: 818,
		front: {w: 114, h: 192},
		back: {w: 114, h: 192},
	},
	inteleongmax: {
		num: 818,
		front: {w: 126, h: 192},
		back: {w: 124, h: 180},
	},
	torterra: {
		num: 389,
		front: {w: 144, h: 154},
		back: {w: 156, h: 156},
	},
	typhlosion: {
		num: 157,
		front: {w: 123, h: 157},
		back: {w: 115, h: 145},
	},
	typhlosionhisui: {
		num: 157,
		front: {w: 115, h: 165},
		back: {w: 137, h: 172},
	},
	tsareena: {
		num: 763,
		front: {w: 136, h: 164},
		back: {w: 112, h: 165},
		shinyFront: {w: 137, h: 164},
		shinyBack: {w: 113, h: 165},
	},
	ursaluna: {
		num: 901,
		front: {w: 152, h: 130},
		back: {w: 162, h: 134},
	},
	cinderace: {
		num: 815,
		front: {w: 90, h: 192},
		back: {w: 80, h: 160},
	},
	cinderacegmax: {
		num: 815,
		front: {w: 162, h: 190},
		back: {w: 162, h: 190},
	},
	crobat: {
		num: 169,
		front: {w: 158, h: 130},
		back: {w: 170, h: 98},
	},
	decidueye: {
		num: 724,
		front: {w: 118, h: 158},
		back: {w: 76, h: 152},
	},
	decidueyehisui: {
		num: 724,
		front: {w: 98, h: 164},
		back: {w: 98, h: 156},
	},
	dragapult: {
		num: 887,
		front: {w: 142, h: 156},
		back: {w: 142, h: 156},
	},
	duraludon: {
		num: 884,
		front: {w: 122, h: 150},
		back: {w: 134, h: 148},
	},
	duraludongmax: {
		num: 884,
		front: {w: 152, h: 192},
		back: {w: 150, h: 192},
	},
	luxray: {
		num: 405,
		front: {w: 126, h: 132},
		back: {w: 134, h: 128},
		frontf: {w: 126, h: 132},
		backf: {w: 134, h: 128},
	},
	luxrayf: {
		num: 405,
		front: {w: 126, h: 132},
		back: {w: 134, h: 128},
	},
	silvally: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyfighting: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyflying: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallypoison: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyground: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyrock: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallybug: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyghost: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallysteel: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyunknown: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyfire: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallywater: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallygrass: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyelectric: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallypsychic: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyice: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallydragon: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallydark: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallyfairy: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	meganiummega: {
		num: 154,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	raichumegax: {
		num: 26,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	raichumegay: {
		num: 26,
		front: {w: 186, h: 165},
		back: {w: 192, h: 147},
	},
	scolipede: {
		num: 545,
		front: {w: 183, h: 169},
		back: {w: 185, h: 163},
		shinyFront: {w: 183, h: 167},
		shinyBack: {w: 183, h: 161},
	},
	scolipedemega: {
		num: 545,
		front: {w: 182, h: 192},
		back: {w: 189, h: 175},
	},
	golisopodmega: {
		num: 768,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	golurkmega: {
		num: 623,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	glimmoramega: {
		num: 970,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	greninjamega: {
		num: 658,
		front: {w: 140, h: 180},
		back: {w: 172, h: 168},
	},
	pyroarmega: {
		num: 668,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	chesnaughtmega: {
		num: 652,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	delphoxmega: {
		num: 655,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	dragalgemega: {
		num: 691,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	dragonitemega: {
		num: 149,
		front: {w: 178, h: 174},
		back: {w: 174, h: 184},
	},
	steelix: {
		num: 208,
		front: {w: 148, h: 148},
		back: {w: 160, h: 158},
	},
	steelixmega: {
		num: 208,
		front: {w: 174, h: 184},
		back: {w: 182, h: 186},
	},
	taurospaldeacombat: {
		num: 128,
		front: {w: 138, h: 112},
		back: {w: 140, h: 98},
	},
	taurospaldeablaze: {
		num: 128,
		front: {w: 150, h: 122},
		back: {w: 160, h: 108},
	},
	taurospaldeaaqua: {
		num: 128,
		front: {w: 136, h: 108},
		back: {w: 142, h: 112},
	},
	tatsugiri: {
		num: 978,
		front: {w: 70, h: 80},
		back: {w: 80, h: 80},
	},
	tatsugiridroopy: {
		num: 978,
		front: {w: 84, h: 52},
		back: {w: 78, h: 64},
	},
	tatsugiristretchy: {
		num: 978,
		front: {w: 86, h: 52},
		back: {w: 88, h: 56},
	},
	tatsugirimega: {
		num: 978,
		front: {w: 144, h: 94},
		back: {w: 138, h: 86},
	},
	tatsugiridroopymega: {
		num: 978,
		front: {w: 144, h: 94},
		back: {w: 138, h: 86},
	},
	tatsugiristretchymega: {
		num: 978,
		front: {w: 144, h: 94},
		back: {w: 138, h: 86},
	},
	barraskewda: {
		num: 847,
		front: {w: 168, h: 74},
		back: {w: 140, h: 82},
	},
	gardevoirmega: {
		num: 282,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 150, h: 162},
		shinyBack: {w: 148, h: 162},
	},
	glalie: {
		num: 362,
		front: {w: 106, h: 100},
		back: {w: 114, h: 108},
		shinyBack: {w: 116, h: 108},
	},
	glaliemega: {
		num: 362,
		front: {w: 120, h: 142},
		back: {w: 120, h: 142},
	},
	hawlucha: {
		num: 701,
		front: {w: 100, h: 120},
		back: {w: 158, h: 114},
	},
	hawluchamega: {
		num: 701,
		front: {w: 184, h: 140},
		back: {w: 170, h: 138},
	},
	zoroark: {
		num: 571,
		front: {w: 136, h: 128},
		back: {w: 148, h: 130},
		shinyBack: {w: 148, h: 164},
	},
	zoroarkhisui: {
		num: 571,
		front: {w: 140, h: 182},
		back: {w: 140, h: 156},
		shinyFront: {w: 156, h: 188},
		shinyBack: {w: 170, h: 170},
	},
	drampa: {
		num: 780,
		front: {w: 180, h: 122},
		back: {w: 170, h: 124},
	},
	whimsicott: {
		num: 547,
		front: {w: 110, h: 104},
		back: {w: 112, h: 100},
	},
	runerigus: {
		num: 867,
		front: {w: 190, h: 152},
		back: {w: 190, h: 146},
	},
	drampamega: {
		num: 780,
		front: {w: 152, h: 178},
		back: {w: 132, h: 178},
	},
	baxcaliburmega: {
		num: 998,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	emboarmega: {
		num: 500,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	chandeluremega: {
		num: 609,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	crabominablemega: {
		num: 740,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	floettemega: {
		num: 670,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	floetteeternalmega: {
		num: 670,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	chimechomega: {
		num: 358,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	froslassmega: {
		num: 478,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	feraligatrmega: {
		num: 160,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	eelektrossmega: {
		num: 604,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	excadrillmega: {
		num: 530,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	meowsticmmega: {
		num: 678,
		front: {w: 66, h: 140},
		back: {w: 82, h: 140},
	},
	meowsticfmega: {
		num: 678,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	scovillainmega: {
		num: 952,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	malamarmega: {
		num: 687,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	clefablemega: {
		num: 36,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	absolmegaz: {
		num: 359,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
};

const CUSTOM_SPECIES_UPDATES: {[id: string]: AnyObject} = {
	charizard: {
		baseStats: {hp: 78, atk: 109, def: 75, spa: 114, spd: 78, spe: 100},
		abilities: {0: 'Wildfire Core', 1: 'Flame Body', H: 'Solar Power'},
	},
	charizardgmax: {
		baseStats: {hp: 133, atk: 109, def: 75, spa: 114, spd: 78, spe: 100},
		abilities: {0: 'Burning Crown'},
	},
	hypno: {
		name: 'Hypno',
		types: ['Psychic', 'Dark'],
		baseStats: {hp: 90, atk: 70, def: 105, spa: 80, spd: 110, spe: 45},
		abilities: {0: 'No Guard', 1: 'Neutralizing Gas', H: 'Neutralization'},
	},
	kangaskhan: {
		baseStats: {hp: 105, atk: 105, def: 80, spa: 40, spd: 80, spe: 90},
	},
	kangaskhanmega: {
		baseStats: {hp: 105, atk: 135, def: 110, spa: 40, spd: 110, spe: 100},
		abilities: {0: 'Parental Bond'},
	},
	lapras: {
		abilities: {0: 'Safe Harbor', 1: 'Shell Armor', H: 'Ice Scales'},
	},
	jolteon: {
		abilities: {0: 'Lightning Rod', 1: 'Battery', H: 'Voltage Volley'},
	},
	archeops: {
		abilities: {0: 'Defeatist', 1: 'Relic Instinct', H: 'Fossil Frenzy'},
	},
	dratini: {
		abilities: {0: 'Shed Skin', 1: 'Dragonize', H: 'Marvel Scale'},
	},
	dragonair: {
		abilities: {0: 'Shed Skin', 1: 'Dragonize', H: 'Marvel Scale'},
	},
	feraligatr: {
		abilities: {0: 'Sheer Force', 1: 'Intimidate', H: 'Water Veil'},
	},
	feraligatrmega: {
		abilities: {0: 'Draconic Force'},
	},
	banette: {
		abilities: {0: 'Cursed Keepsake', 1: 'Cursed Armament', H: 'Shadow Shield'},
		otherFormes: ['Banette-Mega'],
		formeOrder: ['Banette', 'Banette-Mega'],
	},
	lopunny: {
		abilities: {0: 'Fur Coat', 1: 'Friend Guard', H: 'Striker'},
	},
	lopunnymega: {
		abilities: {0: 'Unchecked Assault'},
	},
	blazikenmega: {
		abilities: {0: 'Blazing Tempo'},
	},
	aggronmega: {
		abilities: {0: 'Iron Mountain'},
	},
	ampharosmega: {
		abilities: {0: 'Wooly Conductor'},
	},
	gallademega: {
		abilities: {0: 'Sacred Edge'},
	},
	gardevoirmega: {
		abilities: {0: 'Royal Voice'},
	},
	vibrava: {
		abilities: {0: 'Levitate', 1: 'Dragonize', H: 'Sand Stream'},
	},
	flygon: {
		abilities: {0: 'Levitate', 1: 'Dragonize', H: 'Sand Stream'},
	},
	skrelp: {
		abilities: {0: 'Dragonize', 1: 'Poison Touch', H: 'Adaptability'},
	},
	dragalge: {
		abilities: {0: 'Dragonize', 1: 'Poison Touch', H: 'Adaptability'},
	},
	clauncher: {
		abilities: {0: 'Mega Launcher', 1: 'Swift Swim', H: 'Quick Draw'},
	},
	clawitzer: {
		abilities: {0: 'Mega Launcher', 1: 'Swift Swim', H: 'Quick Draw'},
	},
};

const CUSTOM_ABILITY_UPDATES: {[id: string]: AnyObject} = {
	battery: {
		name: 'Battery',
		shortDesc: 'This Pokemon and its allies have their special attacks boosted by 1.3x.',
	},
	battlebond: {
		name: 'Battle Bond',
		desc: "When this Pokemon knocks out another Pokemon, it transforms into its Bond form. While transformed, moves that match this Pokemon's type have 1.3x power, and knocking out a target restores 1/8 of this Pokemon's maximum HP.",
		shortDesc: 'After a KO: transforms. Bond form: matching-type moves 1.3x, KO heals 1/8 max HP.',
	},
	relicinstinct: {
		name: 'Relic Instinct',
		desc: 'If this Pokemon has more than 50% HP, its Rock- and Flying-type moves have 1.3x power and its moves ignore opposing Abilities. If this Pokemon has 50% or less HP, its Rock- and Flying-type moves have 1.1x power, it takes 0.75x damage from attacks, cannot be critically hit, restores 1/16 max HP each turn, and its Attack and Special Attack are halved. Once, when it reaches 25% HP or less, it heals 25% max HP, clears its negative stat stages, and lowers its Defense and Special Defense by 2 stages.',
		shortDesc: '>50%: Rock/Flying 1.3x + Mold Breaker. <=50%: defensive mode; <=25% pinch heal.',
	},
	fossilfrenzy: {
		name: 'Fossil Frenzy',
		desc: 'When this Pokemon is hit by a damaging move, its Attack and Speed rise by 1 stage and it becomes confused. While confused, it takes 1.25x damage from attacks. This Pokemon has Klutz\'s effect. If it hits itself in confusion, it also loses 1/8 of its maximum HP.',
		shortDesc: 'Hit by attacks: +1 Atk/Spe and confusion; confused takes 1.25x; Klutz; self-hit costs 1/8.',
	},
	relicarmor: {
		name: 'Relic Armor',
		desc: 'This Pokemon cannot be critically hit. If an opposing Pokemon lowers its stats, its Defense and Special Defense rise by 1 stage. It takes 0.8x damage from attacks, does not take recoil damage except Struggle, and its moves ignore Abilities.',
		shortDesc: 'No crits; stat drops +1 Def/SpD; takes 0.8x; Rock Head + Mold Breaker.',
	},
	draconicforce: {
		name: 'Draconic Force',
		desc: "This Pokemon has Dragonize, Sheer Force, and Guts's effects.",
		shortDesc: 'Dragonize + Sheer Force + Guts.',
	},
	ironmountain: {
		name: 'Iron Mountain',
		desc: 'This Pokemon has Filter, Stamina, and Heavy Metal\'s effects. Super-effective attacks deal 0.75x damage to it. Once per turn when hit by an opposing damaging move, its Defense rises by 1 stage and it restores 1/16 max HP. Its weight is doubled.',
		shortDesc: 'Filter + Stamina + Heavy Metal.',
	},
	woolyconductor: {
		name: 'Wooly Conductor',
		desc: 'This Pokemon has Fur Coat, Mold Breaker, and Static\'s effects. Its Defense is doubled, its moves ignore opposing Abilities, and contact moves used against it may paralyze the attacker.',
		shortDesc: 'Fur Coat + Mold Breaker + Static.',
	},
	sacrededge: {
		name: 'Sacred Edge',
		desc: 'This Pokemon has Sharpness and Sworn Duty\'s effects. Its slicing moves ignore Substitute, Reflect, Light Screen, and Aurora Veil. On switch-in or Mega Evolution, it heals its ally by 1/4 max HP, or 1/3 on Fairy Tale Field.',
		shortDesc: 'Sharpness + Sworn Duty; slicing moves ignore screens/Substitute.',
	},
	royalvoice: {
		name: 'Royal Voice',
		desc: 'This Pokemon has Pixilate, Queenly Majesty, and Sworn Duty\'s effects. Its Normal-type moves become Fairy type and have 1.2x power. Its Psychic- and Fairy-type moves have 1.2x power. On switch-in or Mega Evolution, it heals its ally by 1/4 max HP, or 1/3 on Fairy Tale Field.',
		shortDesc: 'Pixilate + Queenly Majesty + Sworn Duty; Psychic/Fairy moves 1.2x.',
	},
	fallenstar: {
		name: 'Fallen Star',
		desc: "This Pokemon's arrow moves ignore the target's Ability and have 1.2x power. If this Pokemon has 1/3 or less of its maximum HP, its arrow moves gain +1 priority. If an arrow move targets a Pokemon that cannot switch out, it has 1.5x power instead. This Pokemon is immune to hail damage. Arrow moves are Spirit Shackle, Thousand Arrows, Triple Arrows, Snipe Shot, Razor Leaf, and Magical Leaf.",
		shortDesc: 'Arrow moves ignore Abilities and are 1.2x; at <=1/3 HP +1 priority; hail immune.',
	},
	ragingstorm: {
		name: 'Raging Storm',
		desc: "This Pokemon's attacks have Mold Breaker, remove the target's positive stat changes before damage, and ignore Reflect, Light Screen, Aurora Veil, and defensive stat boosts. If this Pokemon gets a KO, it damages remaining foes for 60% of the last damage in multi battles, or raises Attack by 1 if there is no valid target or no damage is dealt. Magic Guard users do not take this damage. This Pokemon is immune to hail damage.",
		shortDesc: 'Mold Breaker; attacks clear target boosts and ignore screens/boosts; KO bonus; hail immune.',
	},
	safeharbor: {
		name: 'Safe Harbor',
		desc: 'This Pokemon absorbs Water- and Ice-type attacks to restore 1/4 of its maximum HP. It also has Ice Body and Hydration\'s effects.',
		shortDesc: 'Absorbs Water/Ice moves; Ice Body + Hydration.',
	},
	voltagevolley: {
		name: 'Voltage Volley',
		desc: "This Pokemon's multi-hit moves become special attacks and use its Special Attack.",
		shortDesc: 'Multi-hit moves become special and use Sp. Atk.',
	},
	waterveil: {
		name: 'Water Veil',
		desc: 'This Pokemon cannot be burned and is immune to Hail and Sandstorm damage. Gaining this Ability while burned cures it. On switch-in, it gains Aqua Ring.',
		shortDesc: 'Cannot be burned; immune to Hail/Sandstorm; gains Aqua Ring.',
	},
	atrocity: {
		name: 'Atrocity',
		desc: "This Pokemon's damaging moves have 1.3x power, +1 critical hit ratio, ignore Abilities, ignore defensive stat boosts, and bypass Substitute, Reflect, Light Screen, and Aurora Veil. Its Defense and Special Defense are 1.3x. It heals 30% of the damage it deals with attacks, doubled against G-Max Pokemon, up to 33% of its max HP per hit, and restores 1/16 max HP at the end of each turn. This Pokemon is immune to hail damage.",
		shortDesc: 'Moves 1.3x and bypass defenses/screens; drains up to 33%; heals 1/16; hail immune.',
	},
	ultraego: {
		name: 'Ultra Ego',
		desc: 'This Pokemon\'s moves ignore abilities. Once per turn, its damaging attacks heal 1/16 max HP, and if one of its moves knocks out a Pokemon it heals 1/10 max HP. After this Pokemon uses a damaging move, the next opposing damaging hit raises its Attack and Special Attack by 1 and heals 1/16 max HP, or once per switch-in heals 1/4 max HP instead at 50% HP or less on boosted fields. Additional hits before it attacks again heal 1/20 max HP. Ally hits never trigger the boost or healing.',
		shortDesc: 'Mold Breaker; attacks heal; move KOs heal 1/10; next enemy hit boosts Atk/SpA.',
	},
};

const CUSTOM_MOVE_UPDATES: {[id: string]: AnyObject} = {
	bonemerang: {
		name: 'Bonemerang',
		critRatio: 2,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		desc: 'Hits twice. Has an increased critical hit ratio. Each hit has a 30% chance to make the target flinch.',
		shortDesc: 'Hits 2 times. High crit ratio. 30% flinch each hit.',
	},
	bonerush: {
		name: 'Bone Rush',
		accuracy: 95,
		basePower: 30,
		multihit: [2, 6],
		secondary: {
			chance: 10,
			boosts: {def: -1},
		},
		desc: 'Hits 2 to 6 times. If the user holds Thick Club, hits 4 or 6 times. Each hit has a 10% chance to lower Defense by 1 stage.',
		shortDesc: 'Hits 2-6 times; Thick Club: 4/6 hits. 10% Def drop each hit.',
	},
	cometpunch: {
		name: 'Comet Punch',
		accuracy: 100,
		basePower: 20,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1},
		multihit: [3, 5],
		desc: 'Hits 3 to 5 times. The final hit has double power and always results in a critical hit.',
		shortDesc: 'Hits 3-5 times. Final hit: 2x power and always crits.',
	},
	doubleslap: {
		name: 'Double Slap',
		accuracy: 100,
		basePower: 20,
		type: 'Fairy',
		multihit: [2, 5],
		secondary: {
			chance: 10,
			boosts: {atk: -1},
		},
		desc: 'Hits 2 to 5 times. Each hit has a 10% chance to lower Attack by 1 stage.',
		shortDesc: 'Fairy; hits 2-5 times. 10% Atk drop each hit.',
	},
	furyattack: {
		name: 'Fury Attack',
		accuracy: 100,
		basePower: 20,
		type: 'Ground',
		flags: {contact: 1, protect: 1, mirror: 1, drill: 1, metronome: 1, bone: 1},
		multihit: [3, 5],
		desc: 'Hits 3 to 5 times. This drill move hits Flying-type Pokemon neutrally. The final hit heals the user based on damage dealt.',
		shortDesc: 'Ground; hits 3-5. Hits Flying neutrally. Final hit drains.',
	},
	hornattack: {
		name: 'Horn Attack',
		type: 'Rock',
		secondary: {
			chance: 50,
			boosts: {def: -1},
		},
		desc: 'Has a 50% chance to lower the target\'s Defense by 1 stage.',
		shortDesc: 'Rock type. 50% chance to lower Defense by 1.',
	},
	spikecannon: {
		name: 'Spike Cannon',
		accuracy: 100,
		basePower: 20,
		type: 'Steel',
		multihit: [3, 5],
		critRatio: 2,
		desc: 'Hits 3 to 5 times. Has an increased critical hit ratio.',
		shortDesc: 'Steel; hits 3-5 times. High crit ratio.',
	},
	supercellslam: {
		name: 'Supercell Slam',
		basePower: 120,
	},
	volttackle: {
		name: 'Volt Tackle',
		basePower: 140,
	},
	wildcharge: {
		name: 'Wild Charge',
		basePower: 120,
	},
	zippyzap: {
		num: 729,
		accuracy: 100,
		basePower: 60,
		category: 'Physical',
		isNonstandard: 'LGPE',
		name: 'Zippy Zap',
		pp: 10,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		willCrit: true,
		target: 'normal',
		type: 'Electric',
		contestType: 'Cool',
		desc: 'Usually moves before other attacks. This move will always result in a critical hit.',
		shortDesc: 'Usually moves first. Always crits.',
	},
};

const CUSTOM_LEARNSET_REPLACEMENTS: {[id: string]: {[id: string]: string[]}} = {
	hypno: {
		afteryou: ['9M'],
		allyswitch: ['9M'],
		aurasphere: ['9M'],
		batonpass: ['9M'],
		blizzard: ['9M'],
		confuseray: ['9M'],
		darkpulse: ['9M'],
		dazzlinggleam: ['9M'],
		disable: ['9M'],
		drainpunch: ['9M'],
		dreameater: ['9M'],
		dynamicpunch: ['9M'],
		embargo: ['9M'],
		encore: ['9M'],
		energyball: ['9M'],
		expandingforce: ['9M'],
		firepunch: ['9M'],
		focusblast: ['9M'],
		foresight: ['9M'],
		foulplay: ['9M'],
		futuresight: ['9M'],
		gravity: ['9M'],
		healblock: ['9M'],
		helpinghand: ['9M'],
		hex: ['9M'],
		hypnosis: ['9M'],
		icebeam: ['9M'],
		icepunch: ['9M'],
		imprison: ['9M'],
		inferno: ['9M'],
		kinesis: ['9M'],
		knockoff: ['9M'],
		lashout: ['9M'],
		lightscreen: ['9M'],
		luckychant: ['9M'],
		magicroom: ['9M'],
		meditate: ['9M'],
		memento: ['9M'],
		miracleeye: ['9M'],
		mistyterrain: ['9M'],
		nightdaze: ['9M'],
		nightmare: ['9M'],
		partingshot: ['9M'],
		psybeam: ['9M'],
		psychic: ['9M'],
		psychicterrain: ['9M'],
		psyshock: ['9M'],
		psystrike: ['9M'],
		quash: ['9M'],
		reflect: ['9M'],
		safeguard: ['9M'],
		shadowball: ['9M'],
		signalbeam: ['9M'],
		snarl: ['9M'],
		storedpower: ['9M'],
		suckerpunch: ['9M'],
		taunt: ['9M'],
		telekinesis: ['9M'],
		throatchop: ['9M'],
		thunder: ['9M'],
		thunderbolt: ['9M'],
		thunderpunch: ['9M'],
		thunderwave: ['9M'],
		torment: ['9M'],
		toxic: ['9M'],
		trickroom: ['9M'],
		willowisp: ['9M'],
		wonderroom: ['9M'],
		zapcannon: ['9M'],
	},
};

const CUSTOM_LEARNSET_ADDITIONS: {[id: string]: {[id: string]: string[]}} = {
	pikachustarter: {
		drainingkiss: ['9M'],
		eeriespell: ['9M'],
		flashcannon: ['9M'],
		flyingpress: ['9M'],
		freezedry: ['9M'],
		heartstamp: ['9M'],
		iciclecrash: ['9M'],
		meteormash: ['9M'],
		playrough: ['9M'],
		vacuumwave: ['9M'],
	},
	raichu: {
		drainingkiss: ['9L1', '8M'],
		eeriespell: ['9M'],
		flashcannon: ['9M'],
		flyingpress: ['9L1'],
		freezedry: ['9M'],
		heartstamp: ['9L1'],
		iciclecrash: ['9L1'],
		meteormash: ['9L1'],
		playrough: ['9M', '8M'],
		vacuumwave: ['9M'],
	},
	raichualola: {
		drainingkiss: ['9L1', '8M'],
		eeriespell: ['9M'],
		flashcannon: ['9M'],
		flyingpress: ['9L1'],
		freezedry: ['9M'],
		heartstamp: ['9L1'],
		iciclecrash: ['9L1'],
		meteormash: ['9L1'],
		playrough: ['8M'],
		vacuumwave: ['9M'],
	},
	overqwil: {
		flipturn: ['9M'],
		spikecannon: ['9M'],
	},
	blastoise: {
		electroshot: ['9M'],
	},
	sandslash: {
		spikecannon: ['9M'],
	},
	sandslashalola: {
		spikecannon: ['9M'],
	},
	nidoqueen: {
		spikecannon: ['9M'],
	},
	nidoking: {
		spikecannon: ['9M'],
	},
	shellder: {
		spikecannon: ['9M'],
	},
	rhyhorn: {
		spikecannon: ['9M'],
	},
	rhydon: {
		spikecannon: ['9M'],
	},
	rhyperior: {
		spikecannon: ['9M'],
	},
	jolteon: {
		spikecannon: ['9M'],
	},
	feraligatr: {
		cometpunch: ['9M'],
	},
	clodsire: {
		spikecannon: ['9M'],
	},
	qwilfish: {
		spikecannon: ['9M'],
	},
	qwilfishhisui: {
		spikecannon: ['9M'],
	},
	sneasler: {
		spikecannon: ['9M'],
	},
	cursola: {
		spikecannon: ['9M'],
	},
	aron: {
		spikecannon: ['9M'],
	},
	lairon: {
		spikecannon: ['9M'],
	},
	aggron: {
		spikecannon: ['9M'],
	},
	roserade: {
		spikecannon: ['9M'],
	},
	maractus: {
		spikecannon: ['9M'],
	},
	ferroseed: {
		spikecannon: ['9M'],
	},
	ferrothorn: {
		spikecannon: ['9M'],
	},
	chesnaught: {
		spikecannon: ['9M'],
	},
	clawitzer: {
		electroshot: ['9M'],
	},
	goodra: {
		hypervoice: ['9M'],
	},
	goodrahisui: {
		hypervoice: ['9M'],
	},
	turtonator: {
		spikecannon: ['9M'],
	},
	togedemaru: {
		spikecannon: ['9M'],
	},
	dhelmise: {
		spikecannon: ['9M'],
	},
	coalossal: {
		spikecannon: ['9M'],
	},
	pincurchin: {
		spikecannon: ['9M'],
	},
	glimmora: {
		spikecannon: ['9M'],
	},
	brambleghast: {
		spikecannon: ['9M'],
	},
	ironthorns: {
		spikecannon: ['9M'],
	},
	ogerpon: {
		spikecannon: ['9M'],
	},
	archaludon: {
		spikecannon: ['9M'],
	},
};

const CUSTOM_BW_SPRITE_IDS = Object.keys(CUSTOM_BW_SPRITES);
const CUSTOM_SPECIES_IDS = Object.keys(CUSTOM_SPECIES);
const CUSTOM_SPECIES_UPDATE_IDS = Object.keys(CUSTOM_SPECIES_UPDATES);
const CUSTOM_BATTLE_SPRITE_MAX_SIZE = 64;
const CUSTOM_TEAMBUILDER_SPRITE_MAX_WIDTH = 48;
const CUSTOM_TEAMBUILDER_SPRITE_MAX_HEIGHT = 48;
const CUSTOM_ABILITY_UPDATE_IDS = Object.keys(CUSTOM_ABILITY_UPDATES);
const CUSTOM_MOVE_UPDATE_IDS = Object.keys(CUSTOM_MOVE_UPDATES);
const CUSTOM_LEARNSET_REPLACEMENT_IDS = Object.keys(CUSTOM_LEARNSET_REPLACEMENTS);
const CUSTOM_LEARNSET_ADDITION_IDS = Object.keys(CUSTOM_LEARNSET_ADDITIONS);

let customBWSpriteDataTable: AnyObject | null = null;
let customPokedexDataTable: AnyObject | null = null;
let customPokedexAltFormsTable: AnyObject | null = null;
let customAbilityDataTable: AnyObject | null = null;
let customMoveDataTable: AnyObject | null = null;
let customTeambuilderDataTable: AnyObject | null = null;
let customSpeciesDataTable: AnyObject | null = null;

function ensureCustomBWSpriteData() {
	if (!window.BattlePokemonSpritesBW) return;
	if (customBWSpriteDataTable === window.BattlePokemonSpritesBW) return;
	for (const id of CUSTOM_BW_SPRITE_IDS) {
		if (!window.BattlePokemonSpritesBW[id]) {
			window.BattlePokemonSpritesBW[id] = CUSTOM_BW_SPRITES[id];
		} else {
			Object.assign(window.BattlePokemonSpritesBW[id], CUSTOM_BW_SPRITES[id]);
		}
	}
	customBWSpriteDataTable = window.BattlePokemonSpritesBW;
}

function ensureCustomDataPatches() {
	if (
		(customPokedexDataTable || undefined) === window.BattlePokedex &&
		(customPokedexAltFormsTable || undefined) === window.BattlePokedexAltForms &&
		(customAbilityDataTable || undefined) === window.BattleAbilities &&
		(customMoveDataTable || undefined) === window.BattleMovedex &&
		(customTeambuilderDataTable || undefined) === window.BattleTeambuilderTable
	) return;
	if (window.BattlePokedex && customPokedexDataTable !== window.BattlePokedex) {
		delete window.BattlePokedex.banettemegaz;
		for (const id of CUSTOM_SPECIES_UPDATE_IDS) {
			if (!window.BattlePokedex[id]) window.BattlePokedex[id] = {};
			Object.assign(window.BattlePokedex[id], CUSTOM_SPECIES_UPDATES[id]);
		}
		customPokedexDataTable = window.BattlePokedex;
	}
	if (window.BattlePokedexAltForms && customPokedexAltFormsTable !== window.BattlePokedexAltForms) {
		delete window.BattlePokedexAltForms.banettemegaz;
		customPokedexAltFormsTable = window.BattlePokedexAltForms;
	}
	if (window.BattleAbilities && customAbilityDataTable !== window.BattleAbilities) {
		for (const id of CUSTOM_ABILITY_UPDATE_IDS) {
			if (!window.BattleAbilities[id]) window.BattleAbilities[id] = {};
			Object.assign(window.BattleAbilities[id], CUSTOM_ABILITY_UPDATES[id]);
		}
		customAbilityDataTable = window.BattleAbilities;
	}
	if (window.BattleMovedex && customMoveDataTable !== window.BattleMovedex) {
		for (const id of CUSTOM_MOVE_UPDATE_IDS) {
			if (!window.BattleMovedex[id]) window.BattleMovedex[id] = {};
			Object.assign(window.BattleMovedex[id], CUSTOM_MOVE_UPDATES[id]);
		}
		customMoveDataTable = window.BattleMovedex;
	}
	if (window.BattleTeambuilderTable && customTeambuilderDataTable !== window.BattleTeambuilderTable) {
		const table = window.BattleTeambuilderTable;
		if (!table.overrideSpeciesData) table.overrideSpeciesData = {};
		for (const id of CUSTOM_SPECIES_UPDATE_IDS) {
			table.overrideSpeciesData[id] = {
				...(table.overrideSpeciesData[id] || {}),
				...CUSTOM_SPECIES_UPDATES[id],
			};
		}
		if (!table.overrideAbilityData) table.overrideAbilityData = {};
		for (const id of CUSTOM_ABILITY_UPDATE_IDS) {
			table.overrideAbilityData[id] = {
				...(table.overrideAbilityData[id] || {}),
				...CUSTOM_ABILITY_UPDATES[id],
			};
		}
		if (!table.learnsets) table.learnsets = {};
		for (const id of CUSTOM_LEARNSET_REPLACEMENT_IDS) {
			table.learnsets[id] = {...CUSTOM_LEARNSET_REPLACEMENTS[id]};
		}
		for (const id of CUSTOM_LEARNSET_ADDITION_IDS) {
			table.learnsets[id] = {
				...(table.learnsets[id] || {}),
				...CUSTOM_LEARNSET_ADDITIONS[id],
			};
		}
		customTeambuilderDataTable = window.BattleTeambuilderTable;
	}
}

function ensureCustomSpecies(id?: string) {
	if (!window.BattlePokedex) return;
	ensureCustomDataPatches();
	if (customSpeciesDataTable !== window.BattlePokedex) {
		for (const customId of CUSTOM_SPECIES_IDS) {
			const customSpecies = CUSTOM_SPECIES[customId];
			const baseData = window.BattlePokedex[customSpecies.base];
			if (!baseData) continue;
			const existingData = window.BattlePokedex[customId];
			window.BattlePokedex[customId] = {
				...(existingData || baseData),
				...customSpecies.data,
			};
		}
		customSpeciesDataTable = window.BattlePokedex;
	} else if (id && CUSTOM_SPECIES[id] && !window.BattlePokedex[id]) {
		const customSpecies = CUSTOM_SPECIES[id];
		const baseData = window.BattlePokedex[customSpecies.base];
		if (baseData) {
			window.BattlePokedex[id] = {
				...baseData,
				...customSpecies.data,
			};
		}
	}
	ensureCustomBWSpriteData();
	const garchomp = window.BattlePokedex.garchomp;
	if (garchomp) {
		const otherFormes = garchomp.otherFormes || [];
		for (const forme of ['Garchomp-Mega-Z', 'Garchomp-Battle-Bond']) {
			if (!otherFormes.includes(forme)) otherFormes.push(forme);
		}
		garchomp.otherFormes = otherFormes;
	}
	const flygon = window.BattlePokedex.flygon;
	if (flygon) {
		const otherFormes = flygon.otherFormes || [];
		if (!otherFormes.includes('Flygon-Mega-Z')) {
			flygon.otherFormes = [...otherFormes, 'Flygon-Mega-Z'];
		}
	}
	const banette = window.BattlePokedex.banette;
	if (banette) {
		banette.otherFormes = (banette.otherFormes || []).filter((forme: string) => forme !== 'Banette-Mega-Z');
		banette.formeOrder = (banette.formeOrder || []).filter((forme: string) => forme !== 'Banette-Mega-Z');
	}
}
window.ensureCustomDataPatches = ensureCustomDataPatches;
window.ensureCustomSpecies = ensureCustomSpecies;

type Comparable = number | string | boolean | Comparable[] | {reverse: Comparable};
const PSUtils = new class {
	/**
	 * Like string.split(delimiter), but only recognizes the first `limit`
	 * delimiters (default 1).
	 *
	 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
	 *
	 * `splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
	 *
	 * Returns an array of length exactly limit + 1.
	 */
	splitFirst(str: string, delimiter: string, limit: number = 1) {
		let splitStr: string[] = [];
		while (splitStr.length < limit) {
			let delimiterIndex = str.indexOf(delimiter);
			if (delimiterIndex >= 0) {
				splitStr.push(str.slice(0, delimiterIndex));
				str = str.slice(delimiterIndex + delimiter.length);
			} else {
				splitStr.push(str);
				str = '';
			}
		}
		splitStr.push(str);
		return splitStr;
	}

	/**
	 * Compares two variables; intended to be used as a smarter comparator.
	 * The two variables must be the same type (TypeScript will not check this).
	 *
	 * - Numbers are sorted low-to-high, use `-val` to reverse
	 * - Strings are sorted A to Z case-semi-insensitively, use `{reverse: val}` to reverse
	 * - Booleans are sorted true-first (REVERSE of casting to numbers), use `!val` to reverse
	 * - Arrays are sorted lexically in the order of their elements
	 *
	 * In other words: `[num, str]` will be sorted A to Z, `[num, {reverse: str}]` will be sorted Z to A.
	 */
	compare(a: Comparable, b: Comparable): number {
		if (typeof a === 'number') {
			return a - (b as number);
		}
		if (typeof a === 'string') {
			return a.localeCompare(b as string);
		}
		if (typeof a === 'boolean') {
			return (a ? 1 : 2) - (b ? 1 : 2);
		}
		if (Array.isArray(a)) {
			for (let i = 0; i < a.length; i++) {
				const comparison = PSUtils.compare(a[i], (b as Comparable[])[i]);
				if (comparison) return comparison;
			}
			return 0;
		}
		if (a.reverse) {
			return PSUtils.compare((b as {reverse: string}).reverse, a.reverse);
		}
		throw new Error(`Passed value ${a} is not comparable`);
	}
	/**
	 * Sorts an array according to the callback's output on its elements.
	 *
	 * The callback's output is compared according to `PSUtils.compare` (in
	 * particular, it supports arrays so you can sort by multiple things).
	 */
	sortBy<T>(array: T[], callback: (a: T) => Comparable): T[];
	/**
	 * Sorts an array according to `PSUtils.compare`. (Correctly sorts numbers,
	 * unlike `array.sort`)
	 */
	sortBy<T extends Comparable>(array: T[]): T[];
	sortBy<T>(array: T[], callback?: (a: T) => Comparable) {
		if (!callback) return (array as any[]).sort(PSUtils.compare);
		return array.sort((a, b) => PSUtils.compare(callback(a), callback(b)));
	}
};

/**
 * Sanitize a room ID by removing anything that isn't alphanumeric or `-`.
 * Shouldn't actually do anything except against malicious input.
 */
function toRoomid(roomid: string) {
	return roomid.replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase();
}

function toName(name: any) {
	if (typeof name !== 'string' && typeof name !== 'number') return '';
	name = ('' + name).replace(/[\|\s\[\]\,\u202e]+/g, ' ').trim();
	if (name.length > 18) name = name.substr(0, 18).trim();

	// remove zalgo
	name = name.replace(
		/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
		''
	);
	name = name.replace(/[\u239b-\u23b9]/g, '');

	return name;
}

interface SpriteData {
	w: number;
	h: number;
	y?: number;
	gen?: number;
	url?: string;
	rawHTML?: string;
	pixelated?: boolean;
	isFrontSprite?: boolean;
	cryurl?: string;
	shiny?: boolean;
}

interface TeambuilderSpriteData {
	x: number;
	y: number;
	spriteDir: string;
	spriteid: string;
	backgroundSize?: string;
	shiny?: boolean;
}

const Dex = new class implements ModdedDex {
	readonly gen = 9;
	readonly modid = 'gen9' as ID;
	readonly cache = null!;

	readonly statNames: ReadonlyArray<StatName> = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
	readonly statNamesExceptHP: ReadonlyArray<StatNameExceptHP> = ['atk', 'def', 'spa', 'spd', 'spe'];

	pokeballs: string[] | null = null;

	resourcePrefix = (() => {
		let prefix = '';
		if (window.document?.location?.protocol !== 'http:') prefix = 'https:';
		return `${prefix}//play.pokemonreborn-showdown.xyz/`;
	})();

	fxPrefix = (() => {
		const protocol = (window.document?.location?.protocol !== 'http:') ? 'https:' : '';
		return `${protocol}//${'play.pokemonreborn-showdown.xyz'}/fx/`;
	})();

	loadedSpriteData = {xy: 1, bw: 0};
	moddedDexes: {[mod: string]: ModdedDex} = {};

	mod(modid: ID): ModdedDex {
		if (modid === 'gen9') return this;
		if (!window.BattleTeambuilderTable) return this;
		if (modid in this.moddedDexes) {
			return this.moddedDexes[modid];
		}
		this.moddedDexes[modid] = new ModdedDex(modid);
		return this.moddedDexes[modid];
	}
	forGen(gen: number) {
		if (!gen) return this;
		return this.mod(`gen${gen}` as ID);
	}

	resolveAvatar(avatar: string): string {
		if (window.BattleAvatarNumbers && avatar in BattleAvatarNumbers) {
			avatar = BattleAvatarNumbers[avatar];
		}
		if (avatar.charAt(0) === '#') {
			return Dex.resourcePrefix + 'sprites/trainers-custom/' + toID(avatar.substr(1)) + '.png';
		}
		if (avatar.includes('.') && window.Config?.server?.registered) {
			// custom avatar served by the server
			let protocol = (Config.server.port === 443) ? 'https' : 'http';
			return protocol + '://' + Config.server.host + ':' + Config.server.port +
				'/avatars/' + encodeURIComponent(avatar).replace(/\%3F/g, '?');
		}
		return Dex.resourcePrefix + 'sprites/trainers/' + Dex.sanitizeName(avatar || 'unknown') + '.png';
	}

	/**
	 * This is used to sanitize strings from data files like `moves.js` and
	 * `teambuilder-tables.js`.
	 *
	 * This makes sure untrusted strings can't wreak havoc if someone forgets to
	 * escape it before putting it in HTML.
	 *
	 * None of these characters belong in these files, anyway. (They can be used
	 * in move descriptions, but those are served from `text.js`, which are
	 * definitely always treated as unsanitized.)
	 */
	sanitizeName(name: any) {
		if (!name) return '';
		return ('' + name)
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
			.slice(0, 50);
	}

	prefs(prop: string) {
		// @ts-ignore
		return window.Storage?.prefs?.(prop);
	}

	getShortName(name: string) {
		let shortName = name.replace(/[^A-Za-z0-9]+$/, '');
		if (shortName.indexOf('(') >= 0) {
			shortName += name.slice(shortName.length).replace(/[^\(\)]+/g, '').replace(/\(\)/g, '');
		}
		return shortName;
	}

	getEffect(name: string | null | undefined): PureEffect | Item | Ability | Move {
		name = (name || '').trim();
		if (name.substr(0, 5) === 'item:') {
			return Dex.items.get(name.substr(5).trim());
		} else if (name.substr(0, 8) === 'ability:') {
			return Dex.abilities.get(name.substr(8).trim());
		} else if (name.substr(0, 5) === 'move:') {
			return Dex.moves.get(name.substr(5).trim());
		}
		let id = toID(name);
		return new PureEffect(id, name);
	}

	moves = {
		get: (nameOrMove: string | Move | null | undefined): Move => {
			ensureCustomDataPatches();
			if (nameOrMove && typeof nameOrMove !== 'string') {
				// TODO: don't accept Moves here
				return nameOrMove;
			}
			let name = nameOrMove || '';
			let id = toID(nameOrMove);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleMovedex) window.BattleMovedex = {};
			let data = window.BattleMovedex[id];
			if (data && typeof data.exists === 'boolean') return data;

			if (!data && id.substr(0, 11) === 'hiddenpower' && id.length > 11) {
				let [, hpWithType, hpPower] = /([a-z]*)([0-9]*)/.exec(id)!;
				data = {
					...(window.BattleMovedex[hpWithType] || {}),
					basePower: Number(hpPower) || 60,
				};
			}
			if (!data && id.substr(0, 6) === 'return' && id.length > 6) {
				data = {
					...(window.BattleMovedex['return'] || {}),
					basePower: Number(id.slice(6)),
				};
			}
			if (!data && id.substr(0, 11) === 'frustration' && id.length > 11) {
				data = {
					...(window.BattleMovedex['frustration'] || {}),
					basePower: Number(id.slice(11)),
				};
			}

			if (!data) data = {exists: false};
			let move = new Move(id, name, data);
			window.BattleMovedex[id] = move;
			return move;
		},
	};

	getGen3Category(type: string) {
		return [
			'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon',
		].includes(type) ? 'Special' : 'Physical';
	}

	items = {
		get: (nameOrItem: string | Item | null | undefined): Item => {
			if (nameOrItem && typeof nameOrItem !== 'string') {
				// TODO: don't accept Items here
				return nameOrItem;
			}
			let name = nameOrItem || '';
			let id = toID(nameOrItem);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleItems) window.BattleItems = {};
			let data = window.BattleItems[id];
			if (data && typeof data.exists === 'boolean') return data;
			if (!data) data = {exists: false};
			let item = new Item(id, name, data);
			window.BattleItems[id] = item;
			return item;
		},
	};

	abilities = {
		get: (nameOrAbility: string | Ability | null | undefined): Ability => {
			ensureCustomDataPatches();
			if (nameOrAbility && typeof nameOrAbility !== 'string') {
				// TODO: don't accept Abilities here
				return nameOrAbility;
			}
			let name = nameOrAbility || '';
			let id = toID(nameOrAbility);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (!window.BattleAbilities) window.BattleAbilities = {};
			let data = window.BattleAbilities[id];
			if (data && typeof data.exists === 'boolean') return data;
			if (!data) data = {exists: false};
			let ability = new Ability(id, name, data);
			window.BattleAbilities[id] = ability;
			return ability;
		},
	};

	species = {
		get: (nameOrSpecies: string | Species | null | undefined): Species => {
			if (nameOrSpecies && typeof nameOrSpecies !== 'string') {
				// TODO: don't accept Species' here
				return nameOrSpecies;
			}
			let name = nameOrSpecies || '';
			let id = toID(nameOrSpecies);
			let formid = id;
			if (!window.BattlePokedexAltForms) window.BattlePokedexAltForms = {};
			if (formid in window.BattlePokedexAltForms && !(formid in CUSTOM_SPECIES)) return window.BattlePokedexAltForms[formid];
			if (window.BattleAliases && id in BattleAliases && !(id in CUSTOM_SPECIES)) {
				name = BattleAliases[id];
				id = toID(name);
			} else if (window.BattlePokedex && !(id in BattlePokedex) && !(id in CUSTOM_SPECIES) && window.BattleBaseSpeciesChart) {
				for (const baseSpeciesId of BattleBaseSpeciesChart) {
					if (formid.startsWith(baseSpeciesId)) {
						id = baseSpeciesId;
						break;
					}
				}
			}
			if (!window.BattlePokedex) window.BattlePokedex = {};
			ensureCustomSpecies(id);
			let data = window.BattlePokedex[id];

			let species: Species;
			if (data && typeof data.exists === 'boolean') {
				species = data;
			} else {
				if (!data) data = {exists: false};
				if (!data.tier && id.slice(-5) === 'totem') {
					data.tier = this.species.get(id.slice(0, -5)).tier;
				}
				if (!data.tier && data.baseSpecies && toID(data.baseSpecies) !== id) {
					data.tier = this.species.get(data.baseSpecies).tier;
				}
				species = new Species(id, name, data);
				window.BattlePokedex[id] = species;
			}

			if (species.cosmeticFormes && !(formid in CUSTOM_SPECIES)) {
				for (const forme of species.cosmeticFormes) {
					if (toID(forme) === formid) {
						species = new Species(formid, name, {
							...species,
							name: forme,
							forme: forme.slice(species.name.length + 1),
							baseForme: "",
							baseSpecies: species.name,
							otherFormes: null,
						});
						window.BattlePokedexAltForms[formid] = species;
						break;
					}
				}
			}

			return species;
		},
	};

	types = {
		allCache: null as Type[] | null,
		get: (type: any): Type => {
			if (!type || typeof type === 'string') {
				const id = toID(type) as string;
				const name = id.substr(0, 1).toUpperCase() + id.substr(1);
				type = (window.BattleTypeChart && window.BattleTypeChart[id]) || {};
				if (type.damageTaken) type.exists = true;
				if (!type.id) type.id = id;
				if (!type.name) type.name = name;
				if (!type.effectType) {
					type.effectType = 'Type';
				}
			}
			return type;
		},
		all: (): readonly Type[] => {
			if (this.types.allCache) return this.types.allCache;
			const types = [];
			for (const id in (window.BattleTypeChart || {})) {
				types.push(Dex.types.get(id));
			}
			if (types.length) this.types.allCache = types;
			return types;
		},
		isName: (name: string | null): boolean => {
			const id = toID(name);
			if (name !== id.substr(0, 1).toUpperCase() + id.substr(1)) return false;
			return (window.BattleTypeChart || {}).hasOwnProperty(id);
		},
	};

	hasAbility(species: Species, ability: string) {
		for (const i in species.abilities) {
			// @ts-ignore
			if (ability === species.abilities[i]) return true;
		}
		return false;
	}

	loadSpriteData(gen: 'xy' | 'bw') {
		if (this.loadedSpriteData[gen]) return;
		this.loadedSpriteData[gen] = 1;

		let path = $('script[src*="pokedex-mini.js"]').attr('src') || '';
		let qs = '?' + (path.split('?')[1] || '');
		path = (path.match(/.+?(?=data\/pokedex-mini\.js)/) || [])[0] || '';

		let el = document.createElement('script');
		el.src = path + 'data/pokedex-mini-bw.js' + qs;
		document.getElementsByTagName('body')[0].appendChild(el);
	}
	getSpriteData(pokemon: Pokemon | Species | string, isFront: boolean, options: {
		gen?: number,
		shiny?: boolean,
		gender?: GenderName,
		afd?: boolean,
		noScale?: boolean,
		mod?: string,
		dynamax?: boolean,
	} = {gen: 6}) {
		const mechanicsGen = options.gen || 6;
		let isDynamax = !!options.dynamax;
		if (pokemon instanceof Pokemon) {
			if (pokemon.volatiles.transform) {
				options.shiny = pokemon.volatiles.transform[2];
				options.gender = pokemon.volatiles.transform[3];
			} else {
				options.shiny = pokemon.shiny;
				options.gender = pokemon.gender;
			}
			let isGigantamax = false;
			if (pokemon.volatiles.dynamax) {
				if (pokemon.volatiles.dynamax[1]) {
					isGigantamax = true;
				} else if (options.dynamax !== false) {
					isDynamax = true;
				}
			}
			pokemon = pokemon.getSpeciesForme() + (isGigantamax ? '-Gmax' : '');
		}
		const requestedSpriteid = typeof pokemon === 'string' ? toID(pokemon) : '';
		const species = Dex.species.get(pokemon);
		ensureCustomBWSpriteData();
		// Gmax sprites are already extremely large, so we don't need to double.
		if (species.name.endsWith('-Gmax')) isDynamax = false;
		let spriteData = {
			gen: mechanicsGen,
			w: 96,
			h: 96,
			y: 0,
			url: Dex.resourcePrefix + 'sprites/',
			pixelated: true,
			isFrontSprite: false,
			cryurl: '',
			shiny: options.shiny,
		};
		let name = species.spriteid;
		if (requestedSpriteid && CUSTOM_STATIC_BATTLE_SPRITES[requestedSpriteid]) name = requestedSpriteid;
		if (CUSTOM_ICON_SPRITES[species.id]) name = CUSTOM_ICON_SPRITES[species.id] as ID;
		let dir;
		let facing;
		if (isFront) {
			spriteData.isFrontSprite = true;
			dir = '';
			facing = 'front';
		} else {
			dir = '-back';
			facing = 'back';
		}

		// Decide which gen sprites to use.
		//
		// There are several different generations we care about here:
		//
		//   - mechanicsGen: the generation number of the mechanics and battle (options.gen)
		//   - graphicsGen: the generation number of sprite/field graphics the user has requested.
		//     This will default to mechanicsGen, but may be altered depending on user preferences.
		//   - spriteData.gen: the generation number of a the specific Pokemon sprite in question.
		//     This defaults to graphicsGen, but if the graphicsGen doesn't have a sprite for the Pokemon
		//     (eg. Darmanitan in graphicsGen 2) then we go up gens until it exists.
		//
		let graphicsGen = mechanicsGen;
		if (Dex.prefs('nopastgens')) graphicsGen = 6;
		if (Dex.prefs('bwgfx') && graphicsGen >= 6) graphicsGen = 5;
		spriteData.gen = Math.max(graphicsGen, Math.min(species.gen, 5));
		const baseDir = ['', 'gen1', 'gen2', 'gen3', 'gen4', 'gen5', '', '', '', ''][spriteData.gen];

		let animationData = null;
		let miscData = null;
		let speciesid = species.id;
		if (requestedSpriteid && CUSTOM_STATIC_BATTLE_SPRITES[requestedSpriteid]) speciesid = requestedSpriteid;
		if (species.isTotem) speciesid = toID(name);
		if (baseDir === '' && window.BattlePokemonSprites) {
			animationData = BattlePokemonSprites[speciesid];
		}
		if (baseDir === 'gen5' && window.BattlePokemonSpritesBW) {
			animationData = BattlePokemonSpritesBW[speciesid];
		}
		if (window.BattlePokemonSprites) miscData = BattlePokemonSprites[speciesid];
		if (!miscData && window.BattlePokemonSpritesBW) miscData = BattlePokemonSpritesBW[speciesid];
		if (!animationData) animationData = {};
		if (!miscData) miscData = {};

		if (miscData.num !== 0 && miscData.num > -5000) {
			let baseSpeciesid = toID(species.baseSpecies);
			spriteData.cryurl = 'audio/cries/' + baseSpeciesid;
			let formeid = species.formeid;
			if (species.isMega || formeid && (
				formeid === '-crowned' ||
				formeid === '-eternal' ||
				formeid === '-eternamax' ||
				formeid === '-four' ||
				formeid === '-hangry' ||
				formeid === '-hero' ||
				formeid === '-lowkey' ||
				formeid === '-noice' ||
				formeid === '-primal' ||
				formeid === '-rapidstrike' ||
				formeid === '-roaming' ||
				formeid === '-school' ||
				formeid === '-sky' ||
				formeid === '-starter' ||
				formeid === '-super' ||
				formeid === '-therian' ||
				formeid === '-unbound' ||
				baseSpeciesid === 'calyrex' ||
				baseSpeciesid === 'kyurem' ||
				baseSpeciesid === 'cramorant' ||
				baseSpeciesid === 'indeedee' ||
				baseSpeciesid === 'lycanroc' ||
				baseSpeciesid === 'necrozma' ||
				baseSpeciesid === 'oinkologne' ||
				baseSpeciesid === 'oricorio' ||
				baseSpeciesid === 'slowpoke' ||
				baseSpeciesid === 'tatsugiri' ||
				baseSpeciesid === 'zygarde'
			)) {
				spriteData.cryurl += formeid;
			}
			spriteData.cryurl += '.mp3';
		}

		if (options.shiny && mechanicsGen > 1) dir += '-shiny';

		// April Fool's 2014
		if (window.Config?.server?.afd || Dex.prefs('afd') || options.afd) {
			dir = 'afd' + dir;
			spriteData.url += dir + '/' + name + '.png';
			// Duplicate code but needed to make AFD tinymax work
			// April Fool's 2020
			if (isDynamax && !options.noScale) {
				spriteData.w *= 0.25;
				spriteData.h *= 0.25;
				spriteData.y += -22;
			} else if (species.isTotem && !options.noScale) {
				spriteData.w *= 0.5;
				spriteData.h *= 0.5;
				spriteData.y += -11;
			}
			return spriteData;
		}

		// Mod Cries
		if (options.mod) {
			spriteData.cryurl = `sprites/${options.mod}/audio/${toID(species.baseSpecies)}`;
			spriteData.cryurl += '.mp3';
		}

		if (animationData[facing + 'f'] && options.gender === 'F') facing += 'f';
		let allowAnim = !Dex.prefs('noanim') && !Dex.prefs('nogif');
		if (CUSTOM_ICON_SPRITES[speciesid]) allowAnim = false;
		let customStaticBattleSpriteid = speciesid;
		if (options.gender === 'F' && CUSTOM_STATIC_BATTLE_SPRITES[`${speciesid}f`]) {
			customStaticBattleSpriteid = `${speciesid}f`;
		}
		const customStaticBattleSprite = CUSTOM_STATIC_BATTLE_SPRITES[customStaticBattleSpriteid];
		if (customStaticBattleSprite) allowAnim = false;
		const customBWSprite = CUSTOM_BW_SPRITES[speciesid];
		if (customBWSprite) allowAnim = false;
		if (allowAnim && spriteData.gen >= 6) spriteData.pixelated = false;
		if (allowAnim && animationData[facing] && spriteData.gen >= 5) {
			if (facing.slice(-1) === 'f') name += '-f';
			dir = baseDir + 'ani' + dir;

			spriteData.w = animationData[facing].w;
			spriteData.h = animationData[facing].h;
			spriteData.url += dir + '/' + name + '.gif';
		} else {
			// There is no entry or enough data in pokedex-mini.js
			// Handle these in case-by-case basis; either using BW sprites or matching the played gen.
			dir = (baseDir || 'gen5') + dir;

			// Gender differences don't exist prior to Gen 4,
			// so there are no sprites for it
			if (spriteData.gen >= 4 && (miscData['frontf'] || customStaticBattleSpriteid !== speciesid) && options.gender === 'F') {
				name += '-f';
			}

			spriteData.url += dir + '/' + name + '.png';
		}
		if (customStaticBattleSprite) {
			const customSpriteSize = options.shiny ?
				customStaticBattleSprite[isFront ? 'shinyFront' : 'shinyBack'] || customStaticBattleSprite[isFront ? 'front' : 'back'] :
				customStaticBattleSprite[isFront ? 'front' : 'back'];
			spriteData.w = customSpriteSize.w;
			spriteData.h = customSpriteSize.h;
		} else if (customBWSprite && spriteData.gen === 5) {
			const customSpriteSize = options.shiny ?
				customBWSprite[isFront ? 'shinyFront' : 'shinyBack'] || customBWSprite[isFront ? 'front' : 'back'] :
				customBWSprite[isFront ? 'front' : 'back'];
			spriteData.w = customSpriteSize.w;
			spriteData.h = customSpriteSize.h;
		}

		if (!options.noScale) {
			if (graphicsGen > 4) {
				// no scaling
			} else if (spriteData.isFrontSprite) {
				spriteData.w *= 2;
				spriteData.h *= 2;
				spriteData.y += -16;
			} else {
				// old gen backsprites are multiplied by 1.5x by the 3D engine
				spriteData.w *= 2 / 1.5;
				spriteData.h *= 2 / 1.5;
				spriteData.y += -11;
			}
			if (spriteData.gen <= 2) spriteData.y += 2;
		}
		if (!options.noScale && (customStaticBattleSprite || customBWSprite) && !isDynamax) {
			const scale = Math.min(
				CUSTOM_BATTLE_SPRITE_MAX_SIZE / spriteData.w,
				CUSTOM_BATTLE_SPRITE_MAX_SIZE / spriteData.h,
				1
			);
			if (scale < 1) {
				spriteData.w = Math.round(spriteData.w * scale);
				spriteData.h = Math.round(spriteData.h * scale);
			}
		}
		if (isDynamax && !options.noScale) {
			spriteData.w *= 2;
			spriteData.h *= 2;
			spriteData.y += -22;
		} else if (species.isTotem && !options.noScale) {
			spriteData.w *= 1.5;
			spriteData.h *= 1.5;
			spriteData.y += -11;
		}

		return spriteData;
	}

	getPokemonIconNum(id: ID, isFemale?: boolean, facingLeft?: boolean) {
		let num = 0;
		if (window.BattlePokemonSprites?.[id]?.num) {
			num = BattlePokemonSprites[id].num;
		} else if (window.BattlePokedex?.[id]?.num) {
			num = BattlePokedex[id].num;
		}
		if (num < 0) num = 0;
		if (num > 1025) num = 0;

		if (window.BattlePokemonIconIndexes?.[id]) {
			num = BattlePokemonIconIndexes[id];
		}

		if (isFemale) {
			if (['unfezant', 'frillish', 'jellicent', 'meowstic', 'pyroar'].includes(id)) {
				num = BattlePokemonIconIndexes[id + 'f'];
			}
		}
		if (facingLeft) {
			if (BattlePokemonIconIndexesLeft[id]) {
				num = BattlePokemonIconIndexesLeft[id];
			}
		}
		return num;
	}

	getPokemonIcon(pokemon: string | Pokemon | ServerPokemon | PokemonSet | null, facingLeft?: boolean) {
		if (pokemon === 'pokeball') {
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -0px 4px`;
		} else if (pokemon === 'pokeball-statused') {
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -40px 4px`;
		} else if (pokemon === 'pokeball-fainted') {
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)`;
		} else if (pokemon === 'pokeball-none') {
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px`;
		}

		let id = toID(pokemon);
		if (!pokemon || typeof pokemon === 'string') pokemon = null;
		// @ts-ignore
		if (pokemon?.speciesForme) id = toID(pokemon.speciesForme);
		// @ts-ignore
		if (pokemon?.species) id = toID(pokemon.species);
		// @ts-ignore
		if (pokemon?.volatiles?.formechange && !pokemon.volatiles.transform) {
			// @ts-ignore
			id = toID(pokemon.volatiles.formechange[1]);
		}
		const customIcon = CUSTOM_ICON_SPRITES[id];
		if (customIcon) {
			const fainted = ((pokemon as Pokemon | ServerPokemon)?.fainted ? `;opacity:.3;filter:grayscale(100%) brightness(.5)` : ``);
			return `background:transparent url(${Dex.resourcePrefix}sprites/gen5/${customIcon}.png) no-repeat center / contain${fainted}`;
		}
		let num = this.getPokemonIconNum(id, pokemon?.gender === 'F', facingLeft);

		let top = Math.floor(num / 12) * 30;
		let left = (num % 12) * 40;
		let fainted = ((pokemon as Pokemon | ServerPokemon)?.fainted ? `;opacity:.3;filter:grayscale(100%) brightness(.5)` : ``);
		return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-sheet.png?v16) no-repeat scroll -${left}px -${top}px${fainted}`;
	}

	getTeambuilderSpriteData(pokemon: any, gen: number = 0): TeambuilderSpriteData {
		let id = toID(pokemon.species);
		let spriteid = pokemon.spriteid;
		let species = Dex.species.get(pokemon.species);
		if (pokemon.gigantamax) {
			const gmaxSpecies = Dex.species.get(`${species.name}-Gmax`);
			const gmaxId = gmaxSpecies.exists ? gmaxSpecies.id : `${id}gmax`;
			if (gmaxSpecies.exists || CUSTOM_ICON_SPRITES[gmaxId] || CUSTOM_BW_SPRITES[gmaxId]) {
				id = gmaxId;
				if (gmaxSpecies.exists) species = gmaxSpecies;
				spriteid = CUSTOM_ICON_SPRITES[id] || species.spriteid || id;
			}
		}
		if (pokemon.species && !spriteid) {
			spriteid = species.spriteid || toID(pokemon.species);
		}
		if (CUSTOM_ICON_SPRITES[id]) spriteid = CUSTOM_ICON_SPRITES[id];
		if (species.exists === false) return { spriteDir: 'sprites/gen5', spriteid: '0', x: 10, y: 5 };
		if (window.Config?.server?.afd || Dex.prefs('afd')) {
			return {
				spriteid,
				spriteDir: 'sprites/afd',
				shiny: !!pokemon.shiny,
				x: 10,
				y: 5,
			};
		}
		const spriteData: TeambuilderSpriteData = {
			spriteid,
			spriteDir: 'sprites/dex',
			x: -2,
			y: -3,
		};
		if (pokemon.shiny) spriteData.shiny = true;
		if (id === 'greninjabond') {
			spriteData.spriteid = 'greninja';
			spriteData.x = -6;
			spriteData.y = -7;
			return spriteData;
		}
		if (CUSTOM_ICON_SPRITES[id] || CUSTOM_BW_SPRITES[id]) {
			spriteData.spriteDir = 'sprites/gen5';
			const customStaticData = CUSTOM_STATIC_BATTLE_SPRITES[id];
			const customBWData = CUSTOM_BW_SPRITES[id];
			const spriteDimensions = pokemon.shiny ?
				(customStaticData?.shinyFront || customBWData?.shinyFront || customStaticData?.front || customBWData?.front) :
				(customStaticData?.front || customBWData?.front);
			if (spriteDimensions) {
				const scale = Math.min(
					CUSTOM_TEAMBUILDER_SPRITE_MAX_WIDTH / spriteDimensions.w,
					CUSTOM_TEAMBUILDER_SPRITE_MAX_HEIGHT / spriteDimensions.h,
					1
				);
				const width = Math.max(1, Math.round(spriteDimensions.w * scale));
				const height = Math.max(1, Math.round(spriteDimensions.h * scale));
				spriteData.x = Math.round((96 - width) / 2);
				spriteData.y = Math.round((86 - height) / 2);
				spriteData.backgroundSize = `${width}px auto`;
			} else {
				const customSpriteData = CUSTOM_TEAMBUILDER_SPRITES[id] || {x: 12, y: 10, backgroundSize: '72px auto'};
				spriteData.x = customSpriteData.x;
				spriteData.y = customSpriteData.y;
				spriteData.backgroundSize = customSpriteData.backgroundSize;
			}
			return spriteData;
		}
		if (Dex.prefs('nopastgens')) gen = 6;
		if (Dex.prefs('bwgfx') && gen > 5) gen = 5;
		let xydexExists = (!species.isNonstandard || species.isNonstandard === 'Past' || species.isNonstandard === 'CAP') || [
			"pikachustarter", "eeveestarter", "meltan", "melmetal", "pokestarufo", "pokestarufo2", "pokestarbrycenman", "pokestarmt", "pokestarmt2", "pokestargiant", "pokestarhumanoid", "pokestarmonster", "pokestarf00", "pokestarf002", "pokestarspirit",
		].includes(species.id);
		if (species.gen === 8 && species.isNonstandard !== 'CAP') xydexExists = false;
		if ((!gen || gen >= 6) && xydexExists) {
			if (species.gen >= 7) {
				spriteData.x = -6;
				spriteData.y = -7;
			} else if (id.substr(0, 6) === 'arceus') {
				spriteData.x = -2;
				spriteData.y = 7;
			} else if (id === 'garchomp') {
				spriteData.x = -2;
				spriteData.y = 2;
			} else if (id === 'garchompmega') {
				spriteData.x = -2;
				spriteData.y = 0;
			}
			return spriteData;
		}
		spriteData.spriteDir = 'sprites/gen5';
		if (gen <= 1 && species.gen <= 1) spriteData.spriteDir = 'sprites/gen1';
		else if (gen <= 2 && species.gen <= 2) spriteData.spriteDir = 'sprites/gen2';
		else if (gen <= 3 && species.gen <= 3) spriteData.spriteDir = 'sprites/gen3';
		else if (gen <= 4 && species.gen <= 4) spriteData.spriteDir = 'sprites/gen4';
		spriteData.x = 10;
		spriteData.y = 5;
		if (spriteData.spriteDir === 'sprites/gen5') {
			const customStaticData = CUSTOM_STATIC_BATTLE_SPRITES[id];
			const customBWData = CUSTOM_BW_SPRITES[id];
			const spriteDimensions = pokemon.shiny ?
				(customStaticData?.shinyFront || customBWData?.shinyFront || customStaticData?.front || customBWData?.front) :
				(customStaticData?.front || customBWData?.front);
			if (spriteDimensions) {
				const scale = Math.min(
					CUSTOM_TEAMBUILDER_SPRITE_MAX_WIDTH / spriteDimensions.w,
					CUSTOM_TEAMBUILDER_SPRITE_MAX_HEIGHT / spriteDimensions.h,
					1
				);
				const width = Math.max(1, Math.round(spriteDimensions.w * scale));
				const height = Math.max(1, Math.round(spriteDimensions.h * scale));
				spriteData.x = Math.round((96 - width) / 2);
				spriteData.y = Math.round((86 - height) / 2);
				spriteData.backgroundSize = `${width}px auto`;
			}
		}
		return spriteData;
	}

	getTeambuilderSprite(pokemon: any, gen: number = 0) {
		if (!pokemon) return '';
		const data = this.getTeambuilderSpriteData(pokemon, gen);
		const shiny = (data.shiny ? '-shiny' : '');
		return 'background-image:url(' + Dex.resourcePrefix + data.spriteDir + shiny + '/' + data.spriteid + '.png);background-position:' + data.x + 'px ' + data.y + 'px;background-repeat:no-repeat' + (data.backgroundSize ? ';background-size:' + data.backgroundSize : '');
	}

	getItemIcon(item: any) {
		let num = 0;
		if (typeof item === 'string' && exports.BattleItems) item = exports.BattleItems[toID(item)];
		if (item?.spritenum) num = item.spritenum;

		let top = Math.floor(num / 16) * 24;
		let left = (num % 16) * 24;
		return 'background:transparent url(' + Dex.resourcePrefix + 'sprites/itemicons-sheet.png?v1) no-repeat scroll -' + left + 'px -' + top + 'px';
	}

	getTypeIcon(type: string | null, b?: boolean) { // b is just for utilichart.js
		type = this.types.get(type).name;
		if (!type) type = '???';
		let sanitizedType = type.replace(/\?/g, '%3f');
		return `<img src="${Dex.resourcePrefix}sprites/types/${sanitizedType}.png" alt="${type}" height="14" width="32" class="pixelated${b ? ' b' : ''}" />`;
	}

	getCategoryIcon(category: string | null) {
		const categoryID = toID(category);
		let sanitizedCategory = '';
		switch (categoryID) {
		case 'physical':
		case 'special':
		case 'status':
			sanitizedCategory = categoryID.charAt(0).toUpperCase() + categoryID.slice(1);
			break;
		default:
			sanitizedCategory = 'undefined';
			break;
		}
		return `<img src="${Dex.resourcePrefix}sprites/categories/${sanitizedCategory}.png" alt="${sanitizedCategory}" height="14" width="32" class="pixelated" />`;
	}

	getPokeballs() {
		if (this.pokeballs) return this.pokeballs;
		this.pokeballs = [];
		if (!window.BattleItems) window.BattleItems = {};
		for (const data of Object.values(window.BattleItems) as AnyObject[]) {
			if (!data.isPokeball) continue;
			this.pokeballs.push(data.name);
		}
		return this.pokeballs;
	}
};

class ModdedDex {
	readonly gen: number;
	readonly modid: ID;
	readonly cache = {
		Moves: {} as any as {[k: string]: Move},
		Items: {} as any as {[k: string]: Item},
		Abilities: {} as any as {[k: string]: Ability},
		Species: {} as any as {[k: string]: Species},
		Types: {} as any as {[k: string]: Effect},
	};
	pokeballs: string[] | null = null;
	constructor(modid: ID) {
		this.modid = modid;
		const gen = parseInt(modid.substr(3, 1), 10);
		if (!modid.startsWith('gen') || !gen) throw new Error("Unsupported modid");
		this.gen = gen;
	}
	moves = {
		get: (name: string): Move => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Moves.hasOwnProperty(id)) return this.cache.Moves[id];

			let data = {...Dex.moves.get(name)};

			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable[`gen${i}`];
				if (id in table.overrideMoveData) {
					Object.assign(data, table.overrideMoveData[id]);
				}
			}
			if (this.modid !== `gen${this.gen}`) {
				const table = window.BattleTeambuilderTable[this.modid];
				if (id in table.overrideMoveData) {
					Object.assign(data, table.overrideMoveData[id]);
				}
			}
			if (this.gen <= 3 && data.category !== 'Status') {
				data.category = Dex.getGen3Category(data.type);
			}

			const move = new Move(id, name, data);
			this.cache.Moves[id] = move;
			return move;
		},
	};

	items = {
		get: (name: string): Item => {
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Items.hasOwnProperty(id)) return this.cache.Items[id];

			let data = {...Dex.items.get(name)};

			for (let i = this.gen; i < 9; i++) {
				const table = window.BattleTeambuilderTable['gen' + i];
				if (id in table.overrideItemDesc) {
					data.shortDesc = table.overrideItemDesc[id];
					break;
				}
			}

			const item = new Item(id, name, data);
			this.cache.Items[id] = item;
			return item;
		},
	};

	abilities = {
		get: (name: string): Ability => {
			ensureCustomDataPatches();
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Abilities.hasOwnProperty(id)) return this.cache.Abilities[id];

			let data = {...Dex.abilities.get(name)};

			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable[`gen${i}`];
				if (id in table.overrideAbilityData) {
					Object.assign(data, table.overrideAbilityData[id]);
				}
			}
			if (this.modid !== `gen${this.gen}`) {
				const table = window.BattleTeambuilderTable[this.modid];
				if (id in table.overrideAbilityData) {
					Object.assign(data, table.overrideAbilityData[id]);
				}
			}

			const ability = new Ability(id, name, data);
			this.cache.Abilities[id] = ability;
			return ability;
		},
	};

	species = {
		get: (name: string): Species => {
			ensureCustomDataPatches();
			let id = toID(name);
			if (window.BattleAliases && id in BattleAliases) {
				name = BattleAliases[id];
				id = toID(name);
			}
			if (this.cache.Species.hasOwnProperty(id)) return this.cache.Species[id];

			let data = {...Dex.species.get(name)};

			for (let i = Dex.gen - 1; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable[`gen${i}`];
				if (id in table.overrideSpeciesData) {
					Object.assign(data, table.overrideSpeciesData[id]);
				}
			}
			if (this.modid !== `gen${this.gen}`) {
				const table = window.BattleTeambuilderTable[this.modid];
				if (id in table.overrideSpeciesData) {
					Object.assign(data, table.overrideSpeciesData[id]);
				}
			}
			if (this.gen < 3 || this.modid === 'gen7letsgo') {
				data.abilities = {0: "No Ability"};
			}

			const table = window.BattleTeambuilderTable[this.modid];
			if (id in table.overrideTier) data.tier = table.overrideTier[id];
			if (!data.tier && id.slice(-5) === 'totem') {
				data.tier = this.species.get(id.slice(0, -5)).tier;
			}
			if (!data.tier && data.baseSpecies && toID(data.baseSpecies) !== id) {
				data.tier = this.species.get(data.baseSpecies).tier;
			}
			if (data.gen > this.gen) data.tier = 'Illegal';

			const species = new Species(id, name, data);
			this.cache.Species[id] = species;
			return species;
		},
	};

	types = {
		get: (name: string): Effect => {
			const id = toID(name) as ID;
			name = id.substr(0, 1).toUpperCase() + id.substr(1);

			if (this.cache.Types.hasOwnProperty(id)) return this.cache.Types[id];

			let data = {...Dex.types.get(name)};

			for (let i = 7; i >= this.gen; i--) {
				const table = window.BattleTeambuilderTable['gen' + i];
				if (id in table.removeType) {
					data.exists = false;
					// don't bother correcting its attributes given it doesn't exist
					break;
				}
				if (id in table.overrideTypeChart) {
					data = {...data, ...table.overrideTypeChart[id]};
				}
			}

			this.cache.Types[id] = data;
			return data;
		},
	};

	getPokeballs() {
		if (this.pokeballs) return this.pokeballs;
		this.pokeballs = [];
		if (!window.BattleItems) window.BattleItems = {};
		for (const data of Object.values(window.BattleItems) as AnyObject[]) {
			if (data.gen && data.gen > this.gen) continue;
			if (!data.isPokeball) continue;
			this.pokeballs.push(data.name);
		}
		return this.pokeballs;
	}
}

const Teams = new class {
	unpack(buf: string) {
		if (!buf) return [];

		const team = [];
		let i = 0;
		let j = 0;

		while (true) {
			const set: PokemonSet = {} as any;
			team.push(set);

			// name
			j = buf.indexOf('|', i);
			set.name = buf.substring(i, j);
			i = j + 1;

			// species
			j = buf.indexOf('|', i);
			set.species = Dex.species.get(buf.substring(i, j)).name || set.name;
			i = j + 1;

			// item
			j = buf.indexOf('|', i);
			set.item = Dex.items.get(buf.substring(i, j)).name;
			i = j + 1;

			// ability
			j = buf.indexOf('|', i);
			const ability = Dex.abilities.get(buf.substring(i, j)).name;
			const species = Dex.species.get(set.species);
			set.ability = (species.abilities &&
				['', '0', '1', 'H', 'S'].includes(ability) ? species.abilities[ability as '0' || '0'] : ability);
			i = j + 1;

			// moves
			j = buf.indexOf('|', i);
			set.moves = buf.substring(i, j).split(',').map(function (moveid) {
				return Dex.moves.get(moveid).name;
			});
			i = j + 1;

			// nature
			j = buf.indexOf('|', i);
			set.nature = buf.substring(i, j) as NatureName;
			if (set.nature as any === 'undefined') delete set.nature;
			i = j + 1;

			// evs
			j = buf.indexOf('|', i);
			if (j !== i) {
				const evstring = buf.substring(i, j);
				if (evstring.length > 5) {
					const evs = evstring.split(',');
					set.evs = {
						hp: Number(evs[0]) || 0,
						atk: Number(evs[1]) || 0,
						def: Number(evs[2]) || 0,
						spa: Number(evs[3]) || 0,
						spd: Number(evs[4]) || 0,
						spe: Number(evs[5]) || 0,
					};
				} else if (evstring === '0') {
					set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
				}
			}
			i = j + 1;

			// gender
			j = buf.indexOf('|', i);
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;

			// ivs
			j = buf.indexOf('|', i);
			if (j !== i) {
				const ivs = buf.substring(i, j).split(',');
				set.ivs = {
					hp: ivs[0] === '' ? 31 : Number(ivs[0]),
					atk: ivs[1] === '' ? 31 : Number(ivs[1]),
					def: ivs[2] === '' ? 31 : Number(ivs[2]),
					spa: ivs[3] === '' ? 31 : Number(ivs[3]),
					spd: ivs[4] === '' ? 31 : Number(ivs[4]),
					spe: ivs[5] === '' ? 31 : Number(ivs[5]),
				};
			}
			i = j + 1;

			// shiny
			j = buf.indexOf('|', i);
			if (i !== j) set.shiny = true;
			i = j + 1;

			// level
			j = buf.indexOf('|', i);
			if (i !== j) set.level = parseInt(buf.substring(i, j), 10);
			i = j + 1;

			// happiness
			j = buf.indexOf(']', i);
			let misc;
			if (j < 0) {
				if (i < buf.length) misc = buf.substring(i).split(',', 6);
			} else {
				if (i !== j) misc = buf.substring(i, j).split(',', 6);
			}
			if (misc) {
				set.happiness = (misc[0] ? Number(misc[0]) : 255);
				set.hpType = misc[1];
				set.pokeball = misc[2];
				set.gigantamax = !!misc[3];
				set.dynamaxLevel = (misc[4] ? Number(misc[4]) : 10);
				set.teraType = misc[5];
			}
			if (j < 0) break;
			i = j + 1;
		}

		return team;
	}
	export(team: PokemonSet[] | string, gen: number, hidestats = false) {
		if (!team) return '';
		if (typeof team === 'string') {
			if (team.indexOf('\n') >= 0) return team;
			team = this.unpack(team);
		}
		let text = '';
		for (const curSet of team) {
			if (curSet.name && curSet.name !== curSet.species) {
				text += '' + curSet.name + ' (' + curSet.species + ')';
			} else {
				text += '' + curSet.species;
			}
			if (curSet.gender === 'M') text += ' (M)';
			if (curSet.gender === 'F') text += ' (F)';
			if (curSet.item) {
				text += ' @ ' + curSet.item;
			}
			text += "  \n";
			if (curSet.ability) {
				text += 'Ability: ' + curSet.ability + "  \n";
			}
			if (curSet.level && curSet.level !== 100) {
				text += 'Level: ' + curSet.level + "  \n";
			}
			if (curSet.shiny) {
				text += 'Shiny: Yes  \n';
			}
			if (typeof curSet.happiness === 'number' && curSet.happiness !== 255 && !isNaN(curSet.happiness)) {
				text += 'Happiness: ' + curSet.happiness + "  \n";
			}
			if (curSet.pokeball) {
				text += 'Pokeball: ' + curSet.pokeball + "  \n";
			}
			if (curSet.hpType) {
				text += 'Hidden Power: ' + curSet.hpType + "  \n";
			}
			if (typeof curSet.dynamaxLevel === 'number' && curSet.dynamaxLevel !== 10 && !isNaN(curSet.dynamaxLevel)) {
				text += 'Dynamax Level: ' + curSet.dynamaxLevel + "  \n";
			}
			if (curSet.gigantamax) {
				text += 'Gigantamax: Yes  \n';
			}
			if (gen === 9) {
				const species = Dex.species.get(curSet.species);
				text += 'Tera Type: ' + (species.forceTeraType || curSet.teraType || species.types[0]) + "  \n";
			}
			if (!hidestats) {
				let first = true;
				if (curSet.evs) {
					let j: StatName;
					for (j in BattleStatNames) {
						if (!curSet.evs[j]) continue;
						if (first) {
							text += 'EVs: ';
							first = false;
						} else {
							text += ' / ';
						}
						text += '' + curSet.evs[j] + ' ' + BattleStatNames[j];
					}
				}
				if (!first) {
					text += "  \n";
				}
				if (curSet.nature) {
					text += '' + curSet.nature + ' Nature' + "  \n";
				}
				first = true;
				if (curSet.ivs) {
					let defaultIvs = true;
					let hpType = '';
					for (const move of curSet.moves) {
						if (move.substr(0, 13) === 'Hidden Power ' && move.substr(0, 14) !== 'Hidden Power [') {
							hpType = move.substr(13);
							if (!Dex.types.isName(hpType)) {
								alert(move + " is not a valid Hidden Power type.");
								continue;
							}
							let stat: StatName;
							for (stat in BattleStatNames) {
								if ((curSet.ivs[stat] === undefined ? 31 : curSet.ivs[stat]) !== (Dex.types.get(hpType).HPivs?.[stat] || 31)) {
									defaultIvs = false;
									break;
								}
							}
						}
					}
					if (defaultIvs && !hpType) {
						let stat: StatName;
						for (stat in BattleStatNames) {
							if (curSet.ivs[stat] !== 31 && curSet.ivs[stat] !== undefined) {
								defaultIvs = false;
								break;
							}
						}
					}
					if (!defaultIvs) {
						let stat: StatName;
						for (stat in BattleStatNames) {
							if (typeof curSet.ivs[stat] === 'undefined' || isNaN(curSet.ivs[stat]) || curSet.ivs[stat] === 31) continue;
							if (first) {
								text += 'IVs: ';
								first = false;
							} else {
								text += ' / ';
							}
							text += '' + curSet.ivs[stat] + ' ' + BattleStatNames[stat];
						}
					}
				}
				if (!first) {
					text += "  \n";
				}
			}
			if (curSet.moves) {
				for (let move of curSet.moves) {
					if (move.substr(0, 13) === 'Hidden Power ') {
						move = move.substr(0, 13) + '[' + move.substr(13) + ']';
					}
					if (move) {
						text += '- ' + move + "  \n";
					}
				}
			}
			text += "\n";
		}
		return text;
	}
};

if (typeof require === 'function') {
	// in Node
	(global as any).Dex = Dex;
	(global as any).toID = toID;
}
