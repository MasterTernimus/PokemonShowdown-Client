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

function isSilvallySpecies(name: string) {
	return toID(name).startsWith('silvally');
}

const CUSTOM_SPECIES: {[id: string]: {base: string, data: AnyObject}} = {
	sawsbuckspring: {
		base: 'sawsbuck',
		data: {
			name: 'Sawsbuck-Spring',
			baseSpecies: 'Sawsbuck',
			forme: 'Spring',
			spriteid: 'sawsbuck-spring',
			otherFormes: ['Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
			formeOrder: ['Sawsbuck', 'Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
		},
	},
	sawsbucksummer: {
		base: 'sawsbuck',
		data: {
			name: 'Sawsbuck-Summer',
			baseSpecies: 'Sawsbuck',
			forme: 'Summer',
			spriteid: 'sawsbuck-summer',
		},
	},
	sawsbuckautumn: {
		base: 'sawsbuck',
		data: {
			name: 'Sawsbuck-Autumn',
			baseSpecies: 'Sawsbuck',
			forme: 'Autumn',
			spriteid: 'sawsbuck-autumn',
		},
	},
	sawsbuckwinter: {
		base: 'sawsbuck',
		data: {
			name: 'Sawsbuck-Winter',
			baseSpecies: 'Sawsbuck',
			forme: 'Winter',
			spriteid: 'sawsbuck-winter',
		},
	},
	hypno: {
		base: 'hypno',
		data: {
			name: 'Hypno',
			types: ['Psychic', 'Ghost'],
			abilities: {0: 'Pendulum Swing', 1: 'Neutralizing Gas', H: 'Neutralization'},
			baseStats: {hp: 90, atk: 70, def: 105, spa: 80, spd: 110, spe: 45},
			bst: 500,
			isNonstandard: 'Custom',
		},
	},
	empoleonalt: {
		base: 'empoleon',
		data: {
			name: 'Empoleon-Alt',
			baseSpecies: 'Empoleon',
			forme: 'Alt',
			spriteid: 'empoleon-alt',
			changesFrom: 'Empoleon',
			isNonstandard: 'Custom',
		},
	},
	miloticalt: {
		base: 'milotic',
		data: {
			name: 'Milotic-Alt',
			baseSpecies: 'Milotic',
			forme: 'Alt',
			spriteid: 'milotic-alt',
			changesFrom: 'Milotic',
			isNonstandard: 'Custom',
		},
	},
	kingambitalt: {
		base: 'kingambit',
		data: {
			name: 'Kingambit-Alt',
			baseSpecies: 'Kingambit',
			forme: 'Alt',
			spriteid: 'kingambit-alt',
			changesFrom: 'Kingambit',
			isNonstandard: 'Custom',
		},
	},
	infernapealt: {
		base: 'infernape',
		data: {
			name: 'Infernape-Alt',
			baseSpecies: 'Infernape',
			forme: 'Alt',
			spriteid: 'infernape-alt',
			changesFrom: 'Infernape',
			isNonstandard: 'Custom',
		},
	},
	torterraalt: {
		base: 'torterra',
		data: {
			name: 'Torterra-Alt',
			baseSpecies: 'Torterra',
			forme: 'Alt',
			spriteid: 'torterra-alt',
			changesFrom: 'Torterra',
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
	aegislashgmax: {
		base: 'aegislash',
		data: {
			name: 'Aegislash-Gmax',
			baseSpecies: 'Aegislash',
			forme: 'Gmax',
			spriteid: 'aegislash-gmax',
			types: ['Steel', 'Ghost'],
			baseStats: {hp: 120, atk: 50, def: 150, spa: 50, spd: 150, spe: 60},
			abilities: {0: 'Imperial Mandate'},
			changesFrom: 'Aegislash',
			isGigantamax: true,
			isNonstandard: 'Gigantamax',
		},
	},
	dragapultgmax: {
		base: 'dragapult',
		data: {
			name: 'Dragapult-Gmax',
			baseSpecies: 'Dragapult',
			forme: 'Gmax',
			spriteid: 'dragapult-gmax',
			types: ['Dragon', 'Ghost'],
			baseStats: {hp: 150, atk: 120, def: 75, spa: 100, spd: 75, spe: 142},
			abilities: {0: 'Phantom Barrage'},
			changesFrom: 'Dragapult',
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
	scolipedealt: {
		base: 'scolipede',
		data: {
			name: 'Scolipede-Alt',
			baseSpecies: 'Scolipede',
			forme: 'Alt',
			spriteid: 'scolipede-alt',
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
	scolipedealt: 'scolipede-alt',
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
	aggronmega: 'aggron-mega',
	hatterenegmax: 'hatterene-gmax',
	aegislashgmax: 'aegislash-gmax',
	dragapultgmax: 'dragapult-gmax',
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
	pidgeotmega: 'pidgeot-mega',
	chesnaughtmega: 'chesnaught-mega',
	delphoxmega: 'delphox-mega',
	dragalgemega: 'dragalge-mega',
	dragonitemega: 'dragonite-mega',
	steelixmega: 'steelix-mega',
	drampamega: 'drampa-mega',
	empoleonalt: 'empoleon-alt',
	miloticalt: 'milotic-alt',
	kingambitalt: 'kingambit-alt',
	infernapealt: 'infernape-alt',
	torterraalt: 'torterra-alt',
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
		front: {w: 116, h: 111},
		back: {w: 104, h: 119},
		shinyBack: {w: 104, h: 117},
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
		front: {w: 158, h: 138},
		back: {w: 162, h: 136},
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
	scolipedealt: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
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
	dondozo: {
		front: {w: 168, h: 128},
		back: {w: 190, h: 180},
	},
	kingambit: {
		front: {w: 134, h: 192},
		back: {w: 120, h: 190},
	},
	kingambitalt: {
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
	mothim: {
		front: {w: 198, h: 172},
		back: {w: 178, h: 122},
		shinyFront: {w: 198, h: 172},
		shinyBack: {w: 178, h: 122},
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
		front: {w: 152, h: 122},
		back: {w: 136, h: 120},
	},
	rotomheat: {
		front: {w: 120, h: 106},
		back: {w: 120, h: 106},
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
	empoleonalt: {
		front: {w: 146, h: 156},
		back: {w: 136, h: 147},
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
	aurorus: {
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
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
		front: {w: 120, h: 128},
		back: {w: 96, h: 130},
	},
	weavilef: {
		front: {w: 120, h: 128},
		back: {w: 96, h: 130},
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
		front: {w: 148, h: 145},
		back: {w: 140, h: 150},
		shinyFront: {w: 156, h: 150},
		shinyBack: {w: 150, h: 158},
	},
	infernape: {
		front: {w: 148, h: 110},
		back: {w: 144, h: 136},
	},
	infernapealt: {
		front: {w: 172, h: 148},
		back: {w: 146, h: 136},
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
	torterraalt: {
		front: {w: 150, h: 152},
		back: {w: 160, h: 130},
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
	aegislashgmax: {
		front: {w: 240, h: 260},
		back: {w: 288, h: 304},
		shinyFront: {w: 240, h: 260},
		shinyBack: {w: 288, h: 304},
	},
	dragapultgmax: {
		front: {w: 246, h: 250},
		back: {w: 244, h: 248},
		shinyFront: {w: 246, h: 250},
		shinyBack: {w: 244, h: 248},
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
	miloticalt: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
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
		front: {w: 116, h: 111},
		back: {w: 104, h: 119},
		shinyBack: {w: 104, h: 117},
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
	miloticalt: {
		num: 350,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
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
	dondozo: {
		num: 977,
		front: {w: 168, h: 128},
		back: {w: 190, h: 180},
	},
	kingambit: {
		num: 983,
		front: {w: 134, h: 192},
		back: {w: 120, h: 190},
	},
	kingambitalt: {
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
	mothim: {
		num: 414,
		front: {w: 198, h: 172},
		back: {w: 178, h: 122},
		shinyFront: {w: 198, h: 172},
		shinyBack: {w: 178, h: 122},
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
		front: {w: 152, h: 122},
		back: {w: 136, h: 120},
	},
	rotomheat: {
		num: 479,
		front: {w: 120, h: 106},
		back: {w: 120, h: 106},
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
	empoleonalt: {
		num: 395,
		front: {w: 146, h: 156},
		back: {w: 136, h: 147},
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
		front: {w: 130, h: 134},
		back: {w: 132, h: 132},
		shinyBack: {w: 132, h: 132},
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
	aurorus: {
		num: 699,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
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
		front: {w: 120, h: 128},
		back: {w: 96, h: 130},
		frontf: {w: 120, h: 128},
		backf: {w: 96, h: 130},
	},
	weavilef: {
		num: 461,
		front: {w: 120, h: 128},
		back: {w: 96, h: 130},
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
		front: {w: 148, h: 145},
		back: {w: 140, h: 150},
	},
	infernape: {
		num: 392,
		front: {w: 148, h: 110},
		back: {w: 144, h: 136},
	},
	infernapealt: {
		num: 392,
		front: {w: 172, h: 148},
		back: {w: 146, h: 136},
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
	torterraalt: {
		num: 389,
		front: {w: 150, h: 152},
		back: {w: 160, h: 130},
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
	aegislashgmax: {
		num: 681,
		front: {w: 240, h: 260},
		back: {w: 288, h: 304},
		shinyFront: {w: 240, h: 260},
		shinyBack: {w: 288, h: 304},
	},
	dragapultgmax: {
		num: 887,
		front: {w: 246, h: 250},
		back: {w: 244, h: 248},
		shinyFront: {w: 246, h: 250},
		shinyBack: {w: 244, h: 248},
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
	scolipedealt: {
		num: 545,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
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
		back: {w: 118, h: 140},
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
	spiritomb: {
		num: 442,
		front: {w: 114, h: 112},
		back: {w: 108, h: 104},
	},
	dusknoir: {
		num: 477,
		front: {w: 170, h: 148},
		back: {w: 126, h: 134},
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
		front: {w: 124, h: 124},
		back: {w: 124, h: 124},
	},
	meowsticmmega: {
		num: 678,
		front: {w: 48, h: 96},
		back: {w: 60, h: 96},
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
	inteleon: {
		abilities: {0: 'High Noon', 1: 'Super Luck', H: 'Sniper'},
	},
	sawsbuck: {
		name: 'Sawsbuck',
		spriteid: 'sawsbuck-spring',
		otherFormes: ['Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
		formeOrder: ['Sawsbuck', 'Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
	},
	aegislash: {
		otherFormes: ['Aegislash-Blade', 'Aegislash-Gmax'],
		formeOrder: ['Aegislash', 'Aegislash-Blade', 'Aegislash-Gmax'],
		canGigantamax: 'G-Max Final Verdict',
	},
	dragapult: {
		otherFormes: ['Dragapult-Gmax'],
		formeOrder: ['Dragapult', 'Dragapult-Gmax'],
		canGigantamax: 'G-Max Spirit Volley',
	},
	charizard: {
		baseStats: {hp: 78, atk: 109, def: 75, spa: 114, spd: 78, spe: 100},
		abilities: {0: 'Wildfire Core', 1: 'Intimidate', H: 'Solar Power'},
	},
	charizardgmax: {
		baseStats: {hp: 133, atk: 109, def: 75, spa: 114, spd: 78, spe: 100},
		abilities: {0: 'Burning Crown'},
	},
	hypno: {
		name: 'Hypno',
		types: ['Psychic', 'Ghost'],
		baseStats: {hp: 90, atk: 70, def: 105, spa: 80, spd: 110, spe: 45},
		abilities: {0: 'Pendulum Swing', 1: 'Neutralizing Gas', H: 'Neutralization'},
	},
	milotic: {
		otherFormes: ['Milotic-Alt'],
		cosmeticFormes: ['Milotic-Alt'],
		formeOrder: ['Milotic', 'Milotic-Alt'],
	},
	kingambit: {
		otherFormes: ['Kingambit-Alt'],
		cosmeticFormes: ['Kingambit-Alt'],
		formeOrder: ['Kingambit', 'Kingambit-Alt'],
	},
	empoleon: {
		otherFormes: ['Empoleon-Alt'],
		cosmeticFormes: ['Empoleon-Alt'],
		formeOrder: ['Empoleon', 'Empoleon-Alt'],
	},
	infernape: {
		otherFormes: ['Infernape-Alt'],
		cosmeticFormes: ['Infernape-Alt'],
		formeOrder: ['Infernape', 'Infernape-Alt'],
	},
	torterra: {
		otherFormes: ['Torterra-Alt'],
		cosmeticFormes: ['Torterra-Alt'],
		formeOrder: ['Torterra', 'Torterra-Alt'],
	},
	scolipede: {
		otherFormes: ['Scolipede-Alt', 'Scolipede-Mega'],
		cosmeticFormes: ['Scolipede-Alt'],
		formeOrder: ['Scolipede', 'Scolipede-Alt', 'Scolipede-Mega'],
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
	starmiemega: {
		abilities: {0: 'Astral Core'},
	},
	meowstic: {
		types: ['Psychic', 'Fairy'],
	},
	meowsticf: {
		types: ['Psychic', 'Dark'],
	},
	meowsticmmega: {
		types: ['Psychic', 'Fairy'],
	},
	meowsticfmega: {
		types: ['Psychic', 'Dark'],
	},
	quagsire: {
		abilities: {0: 'Neutralization', 1: 'Water Absorb', H: 'Unaware'},
	},
	clodsire: {
		abilities: {0: 'Neutralization', 1: 'Water Absorb', H: 'Unaware'},
	},
	ariados: {
		baseStats: {hp: 80, atk: 110, def: 100, spa: 35, spd: 100, spe: 50},
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
		abilities: {0: 'Cursed Keepsake', 1: 'Intimidate', H: 'Shadow Shield'},
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
		abilities: {0: 'Levitate', 1: 'Resonance Force', H: 'Sand Stream'},
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
	angerpoint: {
		name: 'Anger Point',
		desc: 'The first damaging hit raises Attack by 1 stage. A critical hit raises Attack by 12 stages.',
		shortDesc: 'First damaging hit: +1 Attack; critical hits: +12 Attack.',
	},
	battlearmor: {
		name: 'Battle Armor',
		desc: 'No critical hits; takes 0.8x attack damage. Fairy Tale gives +1 Def on entry; opposing stat drops give +2 Def.',
		shortDesc: 'No critical hits; takes 0.8x; Fairy Tale +1 Def; stat drops give +2 Def.',
	},
	shellarmor: {
		name: 'Shell Armor',
		desc: "No critical hits; takes 0.8x attack damage. Fairy Tale or Dragon's Den gives +1 Def; opposing stat drops give +2 SpD.",
		shortDesc: "No critical hits; takes 0.8x; field +1 Def; stat drops give +2 SpD.",
	},
	damp: {
		name: 'Damp',
		desc: 'Blocks explosions and Aftermath; stifles ignition in Corrosive Mist; halves incoming Fire attacking stats.',
		shortDesc: 'Blocks explosions/Aftermath; Corrosive Mist stifles ignition and halves Fire stats.',
	},
	corrosion: {
		name: 'Corrosion',
		desc: 'Poison bypasses immunity. Wasteland adds status effects, Corrosive fields boost damage, and poisoned foes lose Def/SpD.',
		shortDesc: 'Poison bypasses immunity; Wasteland/status effects; Corrosive damage; poisoned foes lose Def/SpD.',
	},
	forewarn: {
		name: 'Forewarn',
		desc: 'Reveals a strongest foe move on switch-in; Psychic Terrain gives +2 SpA; takes 0.8x move damage.',
		shortDesc: 'Reveals a strongest foe move; Psychic Terrain +2 SpA; takes 0.8x move damage.',
	},
	frisk: {
		name: 'Frisk',
		desc: 'Reveals all foes\' items on switch-in; each foe has a 30% chance to be Embargoed.',
		shortDesc: 'Reveals all foes\' items; each foe has a 30% chance to be Embargoed.',
	},
	gluttony: {
		name: 'Gluttony',
		desc: 'Berries and supported seed items activate at 1/2 max HP instead of their normal threshold.',
		shortDesc: 'Berries and supported seeds activate at 1/2 max HP.',
	},
	harvest: {
		name: 'Harvest',
		desc: 'Restores a used Berry or seed: 50% chance each turn, or 100% in Sun or Grassy Terrain.',
		shortDesc: 'Restores used Berry/seed: 50%; 100% in Sun or Grassy Terrain.',
	},
	heavymetal: {
		name: 'Heavy Metal',
		desc: 'Weight is doubled; in Factory, +1 Def/-1 Spe; takes 0.5x physical damage.',
		shortDesc: 'Weight doubled; Factory +1 Def/-1 Spe; takes 0.5x physical damage.',
	},
	insomnia: {
		name: 'Insomnia',
		desc: 'Cannot sleep; Dark damaging moves have 1.3x power.',
		shortDesc: 'Cannot sleep; Dark damaging moves have 1.3x power.',
	},
	ironfist: {
		name: 'Iron Fist',
		desc: 'Punch-based attacks have 1.4x power.',
		shortDesc: 'Punch-based attacks have 1.4x power.',
	},
	lightmetal: {
		name: 'Light Metal',
		desc: 'Weight is halved; in Factory, +1 Spe; unstatused Pokemon have 1.25x Speed.',
		shortDesc: 'Weight halved; Factory +1 Spe; unstatused Pokemon have 1.25x Speed.',
	},
	limber: {
		name: 'Limber',
		desc: 'Cannot be paralyzed; cures paralysis; opposing Speed drops fail.',
		shortDesc: 'Cannot be paralyzed; cures paralysis; opposing Speed drops fail.',
	},
	alchemistsurge: {
		name: 'Alchemist Surge',
		desc: "This Pokemon creates Psychic Terrain on entry, gains Competitive, and has Hydra Bond's effects.",
		shortDesc: 'Psychic Surge + Competitive + Hydra Bond.',
	},
	battery: {
		name: 'Battery',
		shortDesc: 'This Pokemon and its allies have their special attacks boosted by 1.3x.',
	},
	battlebond: {
		name: 'Battle Bond',
		desc: "When this Pokemon knocks out another Pokemon, it transforms into its Bond form. While transformed, moves that match this Pokemon's type have 1.3x power, and knocking out a target restores 1/8 of this Pokemon's maximum HP.",
		shortDesc: 'After a KO: transforms. Bond form: matching-type moves 1.3x, KO heals 1/8 max HP.',
	},
	pendulumswing: {
		name: 'Pendulum Swing',
		desc: "This Pokemon's accuracy is 1.5x and its Special Attack is 1.5x.",
		shortDesc: 'Accuracy and Sp. Atk are 1.5x.',
	},
	razorcurrent: {
		name: 'Razor Current',
		desc: "This Pokemon's Steel-type moves have 1.5x power. At the end of each turn, its Speed rises by 1 stage.",
		shortDesc: 'Steel moves 1.5x; Speed rises by 1 each turn.',
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
		desc: 'This Pokemon cannot be critically hit. If an opposing Pokemon lowers its stats, its Defense and Special Defense rise by 1 stage. It takes 0.8x damage from attacks, and its moves ignore Abilities.',
		shortDesc: 'No crits; stat drops +1 Def/SpD; takes 0.8x; Mold Breaker.',
	},
	draconicforce: {
		name: 'Draconic Force',
		desc: "This Pokemon has Dragonize, Strong Jaw, and Guts's effects.",
		shortDesc: 'Dragonize + Strong Jaw + Guts.',
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
	astralcore: {
		name: 'Astral Core',
		desc: "This Pokemon has Illuminate, Pure Power, and Defragment's effects.",
		shortDesc: 'Illuminate + Pure Power + Defragment.',
	},
	lunarorbit: {
		name: 'Lunar Orbit',
		desc: "This Pokemon has Magic Bounce and Serene Grace. On switch-in, it sets Gravity for 5 turns. This Pokemon is immune to Gravity's negative effects: it is not grounded, its Ground immunity is not removed, and it can still use moves normally restricted by Gravity.",
		shortDesc: "Magic Bounce + Serene Grace; sets Gravity and ignores Gravity's negative effects.",
	},
	spiralevolution: {
		name: 'Spiral Evolution',
		desc: "This Pokemon has built-in Adaptability, Levitate, and Dual Wield. Its damaging moves can hit through protection for reduced damage and it takes 50% less damage from priority moves. In Trick Room, its non-priority moves act before other non-priority moves.",
		shortDesc: 'Adaptability + Levitate + Dual Wield; priority damage reduction.',
	},
	accumulation: { name: "Accumulation" },
	adaptivecell: { name: "Adaptive Cell" },
	alloycore: { name: "Alloy Core" },
	ancientbloom: {
		name: "Ancient Bloom",
		desc: "Boosted Hospitality + Effect Spore + Self Sufficient + Invigorate. Keeps its field-based Defense, Special Defense, and power boosts.",
		shortDesc: "Boosted Hospitality + Effect Spore + Self Sufficient + Invigorate; keeps field boosts.",
	},
	ange: { name: "Ange" },
	apexcleave: { name: "Apex Cleave", desc: "This Pokemon has Sharpness, Dual Wield, and Moxie's effects. Slicing moves use a second Dual Wield hit at 30% of their unboosted power.", shortDesc: "Sharpness + Dual Wield + Moxie." },
	apexpredator: { name: "Apex Predator" },
	aquashell: { name: "Aqua Shell" },
	argentdevotion: { name: "Argent Devotion" },
	ascendance: { name: "Ascendance" },
	astralwatcher: { name: "Astral Watcher" },
	astralwitchcraft: { name: "Astral Witchcraft" },
	aurainstinct: { name: "Aura Instinct", desc: "This Pokemon has Sworn Duty, Adaptability, Technician, and Second Wind's effects.", shortDesc: "Sworn Duty + Adaptability + Technician + Second Wind." },
	auramaster: { name: "Aura Master", desc: "This Pokemon has Mega Launcher, Dual Wield, and Inner Focus's effects, and takes 20% less damage from damaging moves.", shortDesc: "Mega Launcher + Dual Wield + Inner Focus; takes 0.8x damage." },
	auroracurrent: { name: "Aurora Current" },
	auroraresonance: { name: "Aurora Resonance" },
	battlefervor: { name: "Battle Fervor" },
	bewitchingmajesty: { name: "Bewitching Majesty" },
	blademastery: { name: "Blade Mastery" },
	blazingmane: { name: "Blazing Mane" },
	blazingtempo: { name: "Blazing Tempo" },
	bloomingsun: {
		name: "Blooming Sun",
		desc: "Mega Sol + always-active Leaf Guard + Invigorate + Natural Cure. Allies' Attack and Special Defense are multiplied by 1.5.",
		shortDesc: "Mega Sol + always-active Leaf Guard + Invigorate + Natural Cure; allies' Atk/SpD 1.5x.",
	},
	bonewarrior: { name: "Bone Warrior" },
	bruteforce: { name: "Brute Force" },
	burningcrown: {
		name: "Burning Crown",
		desc: "White Smoke + Filter + Self Sufficient. A faint raises its highest offensive stat by 1; Fire moves have 1.2x power and field bonuses remain active.",
		shortDesc: "White Smoke + Filter + Self Sufficient; faint +1 highest offense; Fire 1.2x.",
	},
	burningego: { name: "Burning Ego", desc: "This Pokemon has Ultra Ego, Brute Force, and Magma Armor's effects. Recoil moves keep their power without recoil damage, and Water- and Ice-type attacks are weakened against it.", shortDesc: "Ultra Ego + Brute Force + Magma Armor." },
	burningspirit: { name: "Burning Spirit" },
	byxbysiontouch: { name: "Byxbysion Touch" },
	calderacore: { name: "Caldera Core" },
	celestialheart: { name: "Celestial Heart" },
	conductivity: { name: "Conductivity" },
	corrosivedust: { name: "Corrosive Dust", desc: "This Pokemon has Shield Dust and Levitate's effects. Poisoned Pokemon become confused, and contact moves have a 30% chance to poison the attacker.", shortDesc: "Shield Dust + Levitate; poisoned Pokemon become confused; contact can poison." },
	corrosivescale: { name: "Corrosive Scale", desc: "This Pokemon has Marvel Scale, Invigorate, and Friend Guard's effects. When this Pokemon poisons a target, that target becomes confused.", shortDesc: "Marvel Scale + Invigorate + Friend Guard; poison causes confusion." },
	crueltag: { name: "Cruel Tag" },
	crumblingshell: { name: "Crumbling Shell" },
	cursedkeepsake: { name: "Cursed Keepsake" },
	cursedmarionette: { name: "Cursed Marionette", desc: "Prankster; attacks/status curse foes; cursed foes deal 0.8x damage; heals 1/2 Curse damage; its Curse deals 1/8 max HP.", shortDesc: "Prankster + curse effects; cursed foes deal 0.8x; heals 1/2 Curse damage." },
	defragment: { name: "Defragment" },
	divineintervention: { name: "Divine Intervention" },
	doomwarning: { name: "Doom Warning" },
	dreadmaw: { name: "Dread Maw" },
	dualwield: {
		name: "Dual Wield",
		desc: "Moves boosted by Sharpness, Mega Launcher, Horn, Drill, or Arrow effects hit twice. The first hit receives the boost and the second hit deals 30% of the move's unboosted power.",
		shortDesc: "Boosted Horn/Drill/Sharpness/Mega Launcher/Arrow moves hit twice; second hit is 30% unboosted.",
	},
	duneterror: { name: "Dune Terror" },
	duskdrive: { name: "Dusk Drive" },
	echofiend: { name: "Echo Fiend" },
	eclipse: { name: "Eclipse" },
	eclipsevision: { name: "Eclipse Vision" },
	elevate: { name: "Elevate" },
	emperorsresolve: { name: "Emperor's Resolve" },
	enlightenment: { name: "Enlightenment", desc: "This Pokemon has Pure Power, Inner Focus, and Technician's effects.", shortDesc: "Pure Power + Inner Focus + Technician." },
	evilsanta: { name: "Evil Santa" },
	execution: { name: "Execution" },
	falsedevotion: { name: "False Devotion" },
	firemane: { name: "Fire Mane" },
	forestsurge: { name: "Forest Surge" },
	fortressshell: {
		name: "Fortress Shell",
		desc: "Self Sufficient + Shell Armor + Friend Guard + Dual Wield. Keeps its field bonuses, including Electric redirection in Water Surface, Underwater, Factory, and Short Circuit fields.",
		shortDesc: "Self Sufficient + Shell Armor + Friend Guard + Dual Wield; keeps field bonuses.",
	},
	freezerburn: { name: "Freezer Burn", desc: "This Pokemon has Slush Rush, Ice Body, and Refrigerate's effects. Fire-type moves and Refrigerate-converted moves have 1.2x power, and its charge moves skip the charge turn.", shortDesc: "Slush Rush + Ice Body + Refrigerate; Fire moves 1.2x; skips charge turns." },
	frostsovereign: { name: "Frost Sovereign", desc: "Sets 5-turn Snow and 8-turn Aurora Veil; Ice Body + Filter; foes take 1/16 Ice scaling chip and Ice types are immune.", shortDesc: "Snow + Veil; Ice Body + Filter; Ice scaling chip." },
	frozenfortress: { name: "Frozen Fortress" },
	furnaceengine: { name: "Furnace Engine" },
	grandmaster: {
		name: "Grandmaster",
		desc: "Cannot flinch; immune to powder, Hail, and Sandstorm. Status moves grant 20% damage reduction for the turn. Faster Psychic moves ignore resistances. Damage, Future Sight, and fainting queue delayed Future Sight.",
		shortDesc: "Overcoat + no flinch; status grants 20% damage reduction; queues Future Sight.",
	},
	heatcoil: { name: "Heat Coil" },
	heavenlychorus: { name: "Heavenly Chorus", desc: "This Pokemon has Pixilate, Cloud Nine, Fluffy, and Natural Cure's effects.", shortDesc: "Pixilate + Cloud Nine + Fluffy + Natural Cure." },
	hellfireeclipse: { name: "Hellfire Eclipse" },
	highnoon: { name: "High Noon" },
	hydrabond: { name: "Hydra Bond" },
	hydrabreaker: { name: "Hydra Breaker" },
	hydratyrant: { name: "Hydra Tyrant" },
	hyperdrill: {
		name: "Hyper Drill",
		desc: "Power Drill + Dual Wield. Drill moves hit twice; the first receives Power Drill and the second deals 30% of the move's unboosted power. Rock moves receive STAB.",
		shortDesc: "Power Drill + Dual Wield; Rock moves get STAB.",
	},
	inversion: { name: "Inversion", desc: "On switch-in, this Pokemon sets Inverse Field. Its stat changes are inverted except for Z-Power effects.", shortDesc: "Sets Inverse Field and inverts its stat changes." },
	invigorate: { name: "Invigorate" },
	ironclad: { name: "Ironclad" },
	ironcognition: { name: "Iron Cognition" },
	irondominion: { name: "Iron Dominion" },
	ironwill: { name: "Iron Will" },
	joyride: { name: "Joyride", desc: "This Pokemon has Aerilate, Infiltrator, and Hyper Cutter's effects.", shortDesc: "Aerilate + Infiltrator + Hyper Cutter." },
	knightsguard: { name: "Knight's Guard" },
	lunaridol: { name: "Lunar Idol" },
	memoryleak: { name: "Memory Leak" },
	mindfreeze: { name: "Mind Freeze" },
	mirrorgreed: { name: "Mirror Greed" },
	moonlitwings: { name: "Moonlit Wings" },
	mountainhunger: { name: "Mountain Hunger" },
	mourningsnow: { name: "Mourning Snow" },
	mourningvessel: {
		name: "Mourning Vessel",
		desc: "This Pokemon has Prankster's effect. Its damaging moves deal 10% more damage for each fainted ally. At the end of each turn, it restores 5% of its max HP for each fainted opposing Pokemon, counting every opposing side in Free-For-All battles.",
		shortDesc: "Prankster; damaging moves +10% per fainted ally; heals 5% per fainted foe each turn.",
	},
	neutralization: { name: "Neutralization" },
	noseformation: {
		name: "Nose Formation",
		desc: "Filter; damaging hits trigger three organized 20 BP Mini-Noses using the best Steel, Electric, or Rock type. If a target faints, remaining Mini-Noses chain to the next valid foe.",
		shortDesc: "Filter; 3 organized 20 BP Mini-Noses chain after a KO.",
	},
	omenedge: { name: "Omen Edge" },
	orchardbond: { name: "Orchard Bond" },
	paradoxengine: { name: "Paradox Engine" },
	paradoxpower: { name: "Paradox Power" },
	paradoxpull: { name: "Paradox Pull" },
	paradoxwheel: { name: "Paradox Wheel" },
	parasitism: { name: "Parasitism" },
	patternshift: { name: "Pattern Shift" },
	perfectego: { name: "Perfect Ego" },
	perfectforesight: {
		name: "Perfect Foresight",
		desc: "On switch-in, gains the Ability of the opposing Pokemon with the highest offensive stat. Its queued Future Sight has 60 BP, ignores defensive boosts, screens, and Abilities, hits Dark neutrally, and stacks from attacks, damage, or Future Sight.",
		shortDesc: "Gains strongest foe's Ability; repeatedly queues 60 BP Future Sight.",
	},
	phantomfist: { name: "Phantom Fist", desc: "This Pokemon has Unseen Fist, Iron Fist, Self Sufficient, and Shadow Shield's effects. Its punching moves have 1.56x power, and Ghost-type punching moves ignore immunities and resistances.", shortDesc: "Unseen Fist + Iron Fist + Self Sufficient + Shadow Shield." },
	pollenbloom: {
		name: "Pollen Bloom",
		desc: "Thick Fat + Proficient + Invigorate. Opposing non-Grass Pokemon take 1/16 Grass-type scaling damage each turn, and this Pokemon heals the damage dealt.",
		shortDesc: "Thick Fat + Proficient + Invigorate; Grass scaling chip heals the user.",
	},
	powerdrill: { name: "Power Drill" },
	piercingdrill: {
		name: "Piercing Drill",
		desc: "This Pokemon has Mold Breaker's effect. Its contact moves ignore a target's protection and deal 1/4 the usual damage. It also has Power Drill's effect, boosting drill moves by 1.5x, or 2x in Rocky, Mountain, Snowy Mountain, Cave, and Volcanic fields.",
		shortDesc: "Mold Breaker; contact pierces protection for 1/4 damage; drill moves 1.5x, or 2x in listed fields.",
	},
	precision: { name: "Precision" },
	predator: { name: "Predator" },
	primaltactics: { name: "Primal Tactics" },
	prismscale: { name: "Prism Scale" },
	queensguard: { name: "Queen's Guard", desc: "This Pokemon has Contrary, Shed Skin, Inner Focus, and Multiscale's effects.", shortDesc: "Contrary + Shed Skin + Inner Focus + Multiscale." },
	ragingcurrent: { name: "Raging Current", desc: "This Pokemon has Swift Swim, Regenerator, and Stamina's effects.", shortDesc: "Swift Swim + Regenerator + Stamina." },
	railguncircuit: { name: "Railgun Circuit" },
	rainsovereign: { name: "Rain Sovereign" },
	rapidresponse: { name: "Rapid Response" },
	relentlesshunt: { name: "Relentless Hunt" },
	relentlesslink: { name: "Relentless Link", desc: "This Pokemon has Skill Link, Battle Armor, and Vital Spirit's effects.", shortDesc: "Skill Link + Battle Armor + Vital Spirit." },
	relicbeam: { name: "Relic Beam" },
	requiem: { name: "Requiem", desc: "Repeated hits apply Perish Song, Curse, Taunt, then Torment. KO healing; faint summons Haunted Field for 5 turns; cannot be suppressed.", shortDesc: "Perish Song -> Curse -> Taunt -> Torment; KO healing; Haunted Field on faint." },
	resonanceforce: { name: "Resonance Force" },
	rimeknuckle: { name: "Rime Knuckle", desc: "Filter + Iron Fist; moves have a 40% chance to cause frostbite; KO heals 1/8 or 1/4 against gimmicks.", shortDesc: "Filter + Iron Fist; 40% frostbite; KO healing." },
	riotamp: { name: "Riot Amp" },
	riptideclaws: { name: "Riptide Claws" },
	royalarmament: { name: "Royal Armament" },
	royalcurrent: { name: "Royal Current" },
	royaldecree: { name: "Royal Decree" },
	royalhive: { name: "Royal Hive" },
	royalsun: { name: "Royal Sun" },
	sandsovereign: { name: "Sand Sovereign" },
	seablessing: { name: "Sea Blessing" },
	seasonalstride: { name: "Seasonal Stride" },
	secondwind: { name: "Second Wind" },
	selfsufficient: {
		name: "Self Sufficient",
		desc: "This Pokemon restores 1/16 of its maximum HP at the end of each turn.",
		shortDesc: "Restores 1/16 HP each turn.",
	},
	shadowcurrent: { name: "Shadow Current", desc: "Protean + Precision + Technician + Sworn Duty.", shortDesc: "Protean + Precision + Technician + Sworn Duty." },
	guidingomen: { name: "Guiding Omen", desc: "Friend Guard + Invigorate + Serene Grace.", shortDesc: "Friend Guard + Invigorate + Serene Grace." },
	phalanxform: { name: "Phalanx Form", desc: "Hydra Bond + Friend Guard + Battle Armor.", shortDesc: "Hydra Bond + Friend Guard + Battle Armor." },
	windchime: { name: "Wind Chime", desc: "Ironclad + Wind Power + Levitate.", shortDesc: "Ironclad + Wind Power + Levitate." },
	shadowguard: { name: "Shadow Guard" },
	shelltrap: { name: "Shell Trap" },
	siegelauncher: {
		name: "Siege Launcher",
		desc: "Water Barrage + Mega Launcher + Self Sufficient + Stalwart. Mega Launcher-boosted moves use Dual Wield: the second hit deals 30% of the move's unboosted power.",
		shortDesc: "Water Barrage + Mega Launcher + Self Sufficient + Stalwart; second hit 30% unboosted.",
	},
	sinisterblaze: { name: "Sinister Blaze" },
	soaringspirit: { name: "Soaring Spirit" },
	solarbloom: { name: "Solar Bloom" },
	solaridol: { name: "Solar Idol" },
	solartrap: { name: "Solar Trap" },
	souleater: { name: "Soul Eater" },
	soulfire: { name: "Soul Fire" },
	soultag: { name: "Soul Tag" },
	starboxer: { name: "Star Boxer" },
	stormcircuit: { name: "Storm Circuit", desc: "This Pokemon creates Electric Terrain on entry and has Swift Swim and Elevate's effects. After it knocks out a foe, its highest stat rises by the number of targets fainted.", shortDesc: "Electric Surge + Swift Swim + Elevate." },
	stormfright: { name: "Storm Fright" },
	stormsovereign: { name: "Storm Sovereign", desc: "On switch-in, this Pokemon sets Strong Winds for 5 turns; the weather can be changed normally. This Pokemon has Wind Power and Speed Boost's effects, its moves cannot miss, and foes take 1/16 Flying-type scaling damage at the end of each turn.", shortDesc: "Wind Power + Speed Boost; 5-turn Strong Winds; moves cannot miss; Flying scaling chip." },
	streettyrant: { name: "Street Tyrant" },
	striker: { name: "Striker" },
	strikersmomentum: { name: "Striker's Momentum", desc: "This Pokemon has Striker and Libero's effects, and its moves cannot miss. Once per switch-in, a KO caused by this Pokemon raises its Speed by 1 stage.", shortDesc: "Moves cannot miss; Striker + Libero; first KO gives +1 Speed." },
	supremeoverlord: { name: "Supreme Overlord", desc: "Each fainted ally gives 1.1x move damage; FFA counts allies twice. At 1+, Clear Body and Self Sufficient; at 2+, Inner Focus; at 3+, Filter and Second Wind; at 4+, Infiltrator; at 5+, Magic Guard and +1 Attack/+1 Sp. Atk.", shortDesc: "Fallen allies boost damage; thresholds grant Clear Body, Filter, Infiltrator, and healing." },
	sunsovereign: {
		name: "Sun Sovereign",
		desc: "This Pokemon has Drought, Wildfire Core, and Self Sufficient's effects. Its sun lasts 5 turns.",
		shortDesc: "Drought + Wildfire Core + Self Sufficient; 5-turn Sun.",
	},
	surgeconduit: { name: "Surge Conduit", desc: "This Pokemon has Electric Surge, Lightning Rod, and Brute Force's effects.", shortDesc: "Electric Surge + Lightning Rod + Brute Force." },
	sweetsanctuary: { name: "Sweet Sanctuary" },
	swornduty: { name: "Sworn Duty" },
	technicalspecialist: { name: "Technical Specialist" },
	temporalshift: { name: "Temporal Shift" },
	terastaladaptability: { name: "Terastal Adaptability" },
	terraresolve: { name: "Terra Resolve" },
	toxicbloom: {
		name: "Toxic Bloom",
		desc: "This Pokemon has Pollen Bloom, Self Sufficient, and Byxbysion Touch's effects. Poison-type moves drain 1/2 of their damage and Poison moves can poison attackers that make contact.",
		shortDesc: "Pollen Bloom + Self Sufficient + Poison drain.",
	},
	toxicrenewal: { name: "Toxic Renewal" },
	treasuretitan: { name: "Treasure Titan" },
	tremor: { name: "Tremor" },
	tyrantstream: { name: "Tyrant Stream" },
	ultrainstinct: { name: "Ultra Instinct" },
	uncheckedassault: { name: "Unchecked Assault", desc: "This Pokemon has Scrappy, Technician, and Opportunist's effects.", shortDesc: "Scrappy + Technician + Opportunist." },
	unleashedego: { name: "Unleashed Ego" },
	vanguard: { name: "Vanguard" },
	vendetta: { name: "Vendetta", desc: "When hit by a damaging move, this Pokemon raises its Attack by 1. In Doubles, Multi, and Free-For-All, it endures the first damage KO at 1 HP. Its retaliatory Dark- and Ground-type moves ignore defensive boosts and screens, and a KO against that attacker heals 1/4 max HP.", shortDesc: "Hit: +1 Atk; once endures; retaliatory Dark/Ground bypass defenses; KO heals." },
	venombastion: { name: "Venom Bastion" },
	venomrush: { name: "Venom Rush" },
	verdantdrake: {
		name: "Verdant Drake",
		desc: "This Pokemon has Proficient, Regenerator, and Dual Wield's effects. Its STAB moves have 1.2x power, it restores 1/3 max HP when it switches out, and moves boosted by Sharpness or Mega Launcher, plus arrow moves, hit twice for reduced damage.",
		shortDesc: "Proficient + Regenerator + Dual Wield.",
	},
	verdanthospitality: { name: "Verdant Hospitality" },
	violentrush: { name: "Violent Rush" },
	voidveil: { name: "Void Veil" },
	warpath: { name: "War Path" },
	warship: { name: "War Ship" },
	wastingsurge: { name: "Wasting Surge" },
	waterbarrage: {
		name: "Water Barrage",
		desc: "Proficient + Water Veil + Dual Wield. Grants Aqua Ring and cycles 1/16, 2/16, then 3/16 Water scaling chip to opposing non-Water Pokemon each turn.",
		shortDesc: "Proficient + Water Veil + Dual Wield; Aqua Ring; cycling Water chip.",
	},
	webassassin: { name: "Web Assassin" },
	wickedcommand: { name: "Wicked Command" },
	wickedsnare: { name: "Wicked Snare" },
	wildfirecore: {
		name: "Wildfire Core",
		desc: "This Pokemon has Dragonize, Magma Armor, and Proficient's effects. It is immune to Hail damage. At the end of each turn, opposing Pokemon take Fire-type damage equal to 1/16 max HP, doubled if burned or if this Pokemon used a Fire- or Dragon-type move this turn. This damage uses Fire-type effectiveness and still deals damage to Fire-immune targets.",
		shortDesc: "Dragonize + Magma Armor + Proficient; Fire chip ignores Fire immunity.",
	},
	proficient: {
		name: "Proficient",
		desc: "This Pokemon's STAB moves have their power multiplied by 1.2.",
		shortDesc: "STAB moves have 1.2x power.",
	},
	dragonize: {
		name: "Dragonize",
		desc: "This Pokemon's Normal-type moves become Dragon-type moves and have their power multiplied by 1.2. This Pokemon gains STAB on Dragon-type moves.",
		shortDesc: "Normal moves become Dragon type; Dragon STAB; converted moves 1.2x.",
	},
	magmaarmor: {
		name: "Magma Armor",
		desc: "No freeze outside Cold Eclipse; field +Def/SpD; halves Water/Ice attacking stats; Dragon's Den absorbs Fire.",
		shortDesc: "No freeze outside Cold Eclipse; field +Def/SpD; halves Water/Ice; Dragon's Den absorbs Fire.",
	},
	megalauncher: {
		name: 'Mega Launcher',
		desc: 'Pulse and bullet moves have 1.5x power.',
		shortDesc: 'Pulse and bullet moves have 1.5x power.',
	},
	minus: {
		name: 'Minus',
		desc: 'Electric/Steel moves use 1.3x Atk/SpA; Electric Terrain gives 1.5x SpA.',
		shortDesc: 'Electric/Steel moves use 1.3x Atk/SpA; Electric Terrain gives 1.5x SpA.',
	},
	plus: {
		name: 'Plus',
		desc: 'Electric/Steel moves use 1.3x Atk/SpA; Electric Terrain gives 1.5x SpA.',
		shortDesc: 'Electric/Steel moves use 1.3x Atk/SpA; Electric Terrain gives 1.5x SpA.',
	},
	runaway: {
		name: 'Run Away',
		desc: 'Immune to entry-hazard effects on switch-in.',
		shortDesc: 'Immune to entry-hazard effects on switch-in.',
	},
	sniper: {
		name: 'Sniper',
		desc: '+1 Accuracy on entry; critical hits deal 3x damage.',
		shortDesc: '+1 Accuracy on entry; critical hits deal 3x damage.',
	},
	unnerve: {
		name: 'Unnerve',
		desc: 'Opposing Pokemon cannot use Berries while this Pokemon is active.',
		shortDesc: 'Opposing Pokemon cannot use Berries while this Pokemon is active.',
	},
	vitalspirit: {
		name: 'Vital Spirit',
		desc: 'Cannot sleep; Fighting moves use 1.3x Atk/SpA.',
		shortDesc: 'Cannot sleep; Fighting moves use 1.3x Atk/SpA.',
	},
	windysurge: { name: "Windy Surge" },
	wrathshield: { name: "Wrath Shield" },
	ragingfists: {
		name: 'Raging Fists',
		desc: "This Pokemon has Scrappy, Hydra Bond, Unseen Fist, and Skill Link's effects.",
		shortDesc: 'Scrappy + Hydra Bond + Unseen Fist + Skill Link.',
	},
	imperialmandate: {
		name: 'Imperial Mandate',
		shortDesc: 'This Pokemon has Imperial Mandate.',
	},
	phantombarrage: {
		name: 'Phantom Barrage',
		shortDesc: 'This Pokemon has Phantom Barrage.',
	},
	atrocity: {
		name: 'Atrocity',
		desc: "This Ability cannot be suppressed and has Wildfire Core, Self Sufficient, and draining attacks. This Pokemon's damaging moves have 1.3x power, +1 critical hit ratio, ignore Abilities, ignore defensive stat boosts, and bypass Substitute, Reflect, Light Screen, and Aurora Veil. Its Defense and Special Defense are 1.3x. It heals 30% of the damage it deals with attacks, doubled against G-Max Pokemon, up to 33% of its max HP per hit. In Cold Eclipse, its damaging moves gain another 1.3x boost, and its Defense and Special Defense become 1.5x.",
		shortDesc: 'Wildfire Core + Self Sufficient + draining attacks.',
	},
	ultraego: {
		name: 'Ultra Ego',
		desc: 'This Pokemon\'s moves ignore abilities. Once per turn, its damaging attacks heal 1/16 max HP, and if one of its moves knocks out a Pokemon it heals 1/10 max HP. After this Pokemon uses a damaging move, the next opposing damaging hit raises its Attack and Special Attack by 1 and heals 1/16 max HP, or once per switch-in heals 1/4 max HP instead at 50% HP or less on boosted fields. Additional hits before it attacks again heal 1/20 max HP. Ally hits never trigger the boost or healing.',
		shortDesc: 'Mold Breaker; attacks heal; move KOs heal 1/10; next enemy hit boosts Atk/SpA.',
	},
};

const CUSTOM_MOVE_UPDATES: {[id: string]: AnyObject} = {
	icespinner: {
		desc: "After a successful hit, ends Core terrain and temporary fields created by Z moves or abilities. Permanent fields remain.",
		shortDesc: "Clears Core and temporary Z/ability fields.",
	},
	steelroller: {
		desc: "Fails if there is no terrain or if the field lasts more than 10 turns. After a successful hit, ends Core terrain and temporary Z/ability fields. Permanent fields remain.",
		shortDesc: "Clears Core and temporary Z/ability fields; fails on long fields.",
	},
	blastburn: {
		name: 'Blast Burn',
		desc: '160-power Fire move using the higher Atk/SpA; 60% burn; recharge unless it KOs.',
		shortDesc: '160 BP; higher Atk/SpA; 60% burn; recharge unless it KOs.',
	},
	frenzyplant: {
		name: 'Frenzy Plant',
		desc: '160-power Grass move using the higher Atk/SpA; 80% bad poison; recharge unless it KOs.',
		shortDesc: '160 BP; higher Atk/SpA; 80% bad poison; recharge unless it KOs.',
	},
	hydrocannon: {
		name: 'Hydro Cannon',
		desc: '160-power Water move using the higher Atk/SpA; 60% freeze; recharge unless it KOs.',
		shortDesc: '160 BP; higher Atk/SpA; 60% freeze; recharge unless it KOs.',
	},
	bonemerang: {
		basePower: 50,
		name: 'Bonemerang',
		critRatio: 2,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		desc: 'Hits twice. Has an increased critical hit ratio. Each hit has a 30% chance to make the target flinch.',
		shortDesc: 'Hits 2 times. High crit ratio. 30% flinch each hit.',
	},
	ceaselessedge: {
		name: 'Ceaseless Edge',
		desc: 'If this move is successful, it sets up a layer of Spikes on the opposing side and gives the hit target Splinter for 3 turns. Splinter deals residual damage based on a 25 Base Power Dark-type physical attack from the original user, applying type effectiveness but no random damage variance.',
		shortDesc: 'Sets Spikes. Target takes 3 turns of Splinter.',
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
	needlearm: {
		name: 'Needle Arm',
		desc: 'Has a 30% chance to make the target flinch. If this move hits, the target takes Splinter residual damage for 3 turns based on a 25 Base Power Grass-type physical attack from the original user, applying type effectiveness but no random damage variance.',
		shortDesc: '30% flinch. Target takes 3 turns of Splinter.',
	},
	pinmissile: {
		name: 'Pin Missile',
		desc: 'Hits three to five times. If this move hits, the target takes Splinter residual damage for 3 turns based on a 25 Base Power Bug-type physical attack from the original user, applying type effectiveness but no random damage variance. If the user has the Skill Link Ability, this move will always hit five times. If the user is holding Loaded Dice, this move will hit 5-6 times.',
		shortDesc: 'Hits 3-5 times. Target takes 3 turns of Splinter.',
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
	stoneaxe: {
		name: 'Stone Axe',
		desc: 'If this move is successful, it sets Stealth Rock on the opposing side and gives the hit target Splinter for 3 turns. Splinter deals residual damage based on a 25 Base Power Rock-type physical attack from the original user, applying type effectiveness but no random damage variance.',
		shortDesc: 'Sets Stealth Rock. Target takes Splinter.',
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
	gmaxfinalverdict: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: 'Physical',
		isNonstandard: 'Gigantamax',
		name: 'G-Max Final Verdict',
		pp: 5,
		priority: 0,
		flags: {},
		isMax: 'Aegislash',
		target: 'adjacentFoe',
		type: 'Steel',
		desc: "Power is equal to the base move's Max Move power.",
		shortDesc: 'Base move affects power.',
	},
	gmaxspiritvolley: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: 'Physical',
		isNonstandard: 'Gigantamax',
		name: 'G-Max Spirit Volley',
		pp: 5,
		priority: 0,
		flags: {},
		isMax: 'Dragapult',
		target: 'adjacentFoe',
		type: 'Ghost',
		desc: "Power is equal to the base move's Max Move power.",
		shortDesc: 'Base move affects power.',
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
	meowstic: {
		aurasphere: ['9M'],
		drainingkiss: ['9M'],
		vacuumwave: ['9M'],
	},
	meowsticf: {
		aurasphere: ['9M'],
		drainingkiss: ['9M'],
		vacuumwave: ['9M'],
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
		rage: ['9M'],
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
const CUSTOM_ANIMATED_BW_SPRITES = new Set([
	'hydreigon', 'weavile', 'weavilef', 'garchomp', 'garchompf', 'garchompmega',
	...Object.keys(CUSTOM_STATIC_BATTLE_SPRITES), ...CUSTOM_BW_SPRITE_IDS,
]);
const CUSTOM_SPECIES_IDS = Object.keys(CUSTOM_SPECIES);
const CUSTOM_SPECIES_UPDATE_IDS = Object.keys(CUSTOM_SPECIES_UPDATES);
const SILVALLY_TYPE_FORMES: {[id: string]: string} = {
	fighting: 'Silvally-Fighting',
	flying: 'Silvally-Flying',
	poison: 'Silvally-Poison',
	ground: 'Silvally-Ground',
	rock: 'Silvally-Rock',
	bug: 'Silvally-Bug',
	ghost: 'Silvally-Ghost',
	steel: 'Silvally-Steel',
	unknown: 'Silvally-Unknown',
	fire: 'Silvally-Fire',
	water: 'Silvally-Water',
	grass: 'Silvally-Grass',
	electric: 'Silvally-Electric',
	psychic: 'Silvally-Psychic',
	ice: 'Silvally-Ice',
	dragon: 'Silvally-Dragon',
	dark: 'Silvally-Dark',
	fairy: 'Silvally-Fairy',
};
const SILVALLY_FORME_TYPES: {[id: string]: string} = {
	silvallyfighting: 'fighting',
	silvallyflying: 'flying',
	silvallypoison: 'poison',
	silvallyground: 'ground',
	silvallyrock: 'rock',
	silvallybug: 'bug',
	silvallyghost: 'ghost',
	silvallysteel: 'steel',
	silvallyunknown: 'unknown',
	silvallyfire: 'fire',
	silvallywater: 'water',
	silvallygrass: 'grass',
	silvallyelectric: 'electric',
	silvallypsychic: 'psychic',
	silvallyice: 'ice',
	silvallydragon: 'dragon',
	silvallydark: 'dark',
	silvallyfairy: 'fairy',
};
const CUSTOM_BATTLE_FRONT_SPRITE_MAX_WIDTH = 86;
const CUSTOM_BATTLE_FRONT_SPRITE_MAX_HEIGHT = 86;
const CUSTOM_BATTLE_FRONT_MEGA_SPRITE_MAX_WIDTH = 98;
const CUSTOM_BATTLE_FRONT_MEGA_SPRITE_MAX_HEIGHT = 98;
const CUSTOM_BATTLE_FRONT_GMAX_SPRITE_MAX_WIDTH = 122;
const CUSTOM_BATTLE_FRONT_GMAX_SPRITE_MAX_HEIGHT = 122;
const CUSTOM_BATTLE_BACK_SPRITE_MAX_WIDTH = 86;
const CUSTOM_BATTLE_BACK_SPRITE_MAX_HEIGHT = 86;
const CUSTOM_BATTLE_BACK_MEGA_SPRITE_MAX_WIDTH = 90;
const CUSTOM_BATTLE_BACK_MEGA_SPRITE_MAX_HEIGHT = 90;
const CUSTOM_BATTLE_BACK_GMAX_SPRITE_MAX_WIDTH = 112;
const CUSTOM_BATTLE_BACK_GMAX_SPRITE_MAX_HEIGHT = 112;
const CUSTOM_BATTLE_FRONT_MEDIUM_SPRITE_MAX_WIDTH = 82;
const CUSTOM_BATTLE_FRONT_MEDIUM_SPRITE_MAX_HEIGHT = 82;
const CUSTOM_BATTLE_BACK_MEDIUM_SPRITE_MAX_WIDTH = 82;
const CUSTOM_BATTLE_BACK_MEDIUM_SPRITE_MAX_HEIGHT = 82;
const NATIVE_BATTLE_SPRITE_SIZE_OVERRIDES: {[id: string]: {front?: {w: number, h: number}, back?: {w: number, h: number}}} = {
	garchomp: {back: {w: 112, h: 112}},
};
const NATIVE_TEAMBUILDER_SPRITE_OVERRIDES: {[id: string]: {x: number, y: number, backgroundSize: string}} = {
	garchomp: {x: 6, y: 10, backgroundSize: '78px auto'},
	garchompf: {x: 6, y: 10, backgroundSize: '78px auto'},
};
const CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_WIDTH = 66;
const CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_HEIGHT = 66;
const CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_WIDTH = 78;
const CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_HEIGHT = 78;
const CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_WIDTH = 90;
const CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_HEIGHT = 90;
const CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_WIDTH = 72;
const CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_HEIGHT = 72;
const CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_WIDTH = 84;
const CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_HEIGHT = 84;
const CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_WIDTH = 96;
const CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_HEIGHT = 96;
const CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	charizard: {w: 78, h: 78},
	dragapult: {w: 78, h: 78},
};
const CUSTOM_TEAM_PREVIEW_BACK_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	charizard: {w: 84, h: 84},
	dragapult: {w: 84, h: 84},
};
const CUSTOM_MEDIUM_SPRITE_MIN_DIMENSION = 104;
const CUSTOM_MEDIUM_SPRITE_MAX_DIMENSION = 170;
const CUSTOM_BATTLE_SPRITE_Y_OFFSETS: {[id: string]: {front?: number, back?: number}} = {
	sableye: {front: 22, back: 24},
};
const CUSTOM_BATTLE_SPRITE_X_OFFSETS: {[id: string]: {front?: number, back?: number}} = {
	hatterenegmax: {back: -42},
};
const CUSTOM_BATTLE_FRONT_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	aegislashgmax: {w: 120, h: 120},
	alcremie: {w: 60, h: 60},
	ariados: {w: 60, h: 60},
	banettemega: {w: 82, h: 82},
	butterfree: {w: 64, h: 64},
	butterfreemega: {w: 82, h: 82},
	clefable: {w: 72, h: 72},
	corviknight: {w: 70, h: 70},
	corviknightgmax: {w: 112, h: 112},
	dragapultgmax: {w: 120, h: 120},
	dondozo: {w: 100, h: 100},
	espeon: {w: 66, h: 66},
	excadrillmega: {w: 70, h: 70},
	gengar: {w: 62, h: 62},
	gardevoir: {w: 108, h: 108},
	gardevoirmega: {w: 108, h: 108},
	gardevoirmegaz: {w: 108, h: 108},
	gardevoirvoid: {w: 116, h: 116},
	gardevoirvoidmega: {w: 112, h: 112},
	flareon: {w: 110, h: 110},
	glaceon: {w: 110, h: 110},
	glalie: {w: 62, h: 62},
	glaliemega: {w: 74, h: 74},
	hydreigon: {w: 100, h: 100},
	infernapealt: {w: 84, h: 84},
	jolteon: {w: 110, h: 110},
	leafeon: {w: 110, h: 110},
	lucario: {w: 76, h: 76},
	lucariomega: {w: 74, h: 74},
	lucariomegaz: {w: 82, h: 82},
	maushold: {w: 60, h: 60},
	mausholdfour: {w: 60, h: 60},
	mothim: {w: 82, h: 82},
	ninetales: {w: 90, h: 90},
	ninetalesalola: {w: 74, h: 74},
	palafinhero: {w: 100, h: 100},
	perrserker: {w: 62, h: 62},
	ribombee: {w: 60, h: 60},
	sableye: {w: 126, h: 126},
	sableyemega: {w: 62, h: 62},
	spiritomb: {w: 58, h: 58},
	rotom: {w: 64, h: 64},
	rotomfan: {w: 68, h: 68},
	rotomfrost: {w: 68, h: 68},
	rotomheat: {w: 68, h: 68},
	rotommow: {w: 68, h: 68},
	rotomwash: {w: 68, h: 68},
	raichumegax: {w: 76, h: 76},
	raichumegay: {w: 76, h: 76},
	sinistcha: {w: 60, h: 60},
	sinistchamasterpiece: {w: 60, h: 60},
	tatsugiri: {w: 52, h: 52},
	tatsugiridroopy: {w: 52, h: 52},
	tatsugiridroopymega: {w: 78, h: 78},
	tatsugirimega: {w: 78, h: 78},
	tatsugiristretchy: {w: 52, h: 52},
	tatsugiristretchymega: {w: 78, h: 78},
	aurorus: {w: 90, h: 90},
	tyrantrum: {w: 90, h: 90},
	torterraalt: {w: 88, h: 88},
	venusaur: {w: 78, h: 78},
	venusaurmega: {w: 96, h: 96},
	weavile: {w: 62, h: 62},
	weavilef: {w: 62, h: 62},
	whimsicott: {w: 60, h: 60},
	zoroark: {w: 88, h: 88},
	zoroarkhisui: {w: 88, h: 88},
};
const CUSTOM_BATTLE_BACK_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	alcremie: {w: 60, h: 60},
	ariados: {w: 60, h: 60},
	banettemega: {w: 90, h: 90},
	butterfree: {w: 70, h: 70},
	butterfreemega: {w: 88, h: 88},
	corviknight: {w: 78, h: 78},
	corviknightgmax: {w: 132, h: 132},
	dondozo: {w: 110, h: 110},
	dusknoir: {w: 86, h: 86},
	espeon: {w: 74, h: 74},
	gengar: {w: 60, h: 60},
	gardevoir: {w: 124, h: 124},
	gardevoirmega: {w: 124, h: 124},
	gardevoirmegaz: {w: 124, h: 124},
	gardevoirvoid: {w: 132, h: 132},
	gardevoirvoidmega: {w: 128, h: 128},
	flareon: {w: 108, h: 108},
	garchompmega: {w: 90, h: 90},
	garchompmegaz: {w: 92, h: 92},
	garchompbattlebond: {w: 92, h: 92},
	glaceon: {w: 108, h: 108},
	glalie: {w: 66, h: 66},
	glaliemega: {w: 78, h: 78},
	indeedee: {w: 72, h: 72},
	indeedeef: {w: 72, h: 72},
	hydreigon: {w: 92, h: 92},
	infernapealt: {w: 92, h: 92},
	jolteon: {w: 108, h: 108},
	leafeon: {w: 108, h: 108},
	lucario: {w: 84, h: 84},
	lucariomega: {w: 76, h: 76},
	lucariomegaz: {w: 86, h: 86},
	maushold: {w: 60, h: 60},
	mausholdfour: {w: 60, h: 60},
	mothim: {w: 78, h: 78},
	ninetales: {w: 100, h: 100},
	ninetalesalola: {w: 84, h: 84},
	palafinhero: {w: 116, h: 116},
	pidgeot: {w: 84, h: 84},
	pidgeotmega: {w: 92, h: 92},
	perrserker: {w: 62, h: 62},
	ribombee: {w: 60, h: 60},
	sableye: {w: 134, h: 134},
	sableyemega: {w: 66, h: 66},
	excadrillmega: {w: 74, h: 74},
	spiritomb: {w: 64, h: 64},
	rotom: {w: 60, h: 60},
	rotomfan: {w: 64, h: 64},
	rotomfrost: {w: 64, h: 64},
	rotomheat: {w: 64, h: 64},
	rotommow: {w: 64, h: 64},
	rotomwash: {w: 64, h: 64},
	raichumegax: {w: 80, h: 80},
	raichumegay: {w: 80, h: 80},
	sinistcha: {w: 60, h: 60},
	sinistchamasterpiece: {w: 60, h: 60},
	tatsugiri: {w: 52, h: 52},
	tatsugiridroopy: {w: 52, h: 52},
	tatsugiridroopymega: {w: 78, h: 78},
	tatsugirimega: {w: 78, h: 78},
	tatsugiristretchy: {w: 52, h: 52},
	tatsugiristretchymega: {w: 78, h: 78},
	aurorus: {w: 104, h: 104},
	tyrantrum: {w: 104, h: 104},
	torterraalt: {w: 98, h: 98},
	talonflame: {w: 84, h: 84},
	venusaur: {w: 88, h: 88},
	venusaurmega: {w: 100, h: 100},
	victreebel: {w: 74, h: 74},
	victreebelmega: {w: 84, h: 84},
	sylveon: {w: 108, h: 108},
	umbreon: {w: 108, h: 108},
	vaporeon: {w: 108, h: 108},
	weavile: {w: 70, h: 70},
	weavilef: {w: 70, h: 70},
	whimsicott: {w: 60, h: 60},
	zoroark: {w: 96, h: 96},
	zoroarkhisui: {w: 96, h: 96},
};
const CUSTOM_TEAMBUILDER_SPRITE_MAX_WIDTH = 78;
const CUSTOM_TEAMBUILDER_SPRITE_MAX_HEIGHT = 86;
const CUSTOM_TEAMBUILDER_MEDIUM_SPRITE_MAX_WIDTH = 76;
const CUSTOM_TEAMBUILDER_MEDIUM_SPRITE_MAX_HEIGHT = 76;
const CUSTOM_TEAMBUILDER_LARGE_SPRITE_MAX_WIDTH = 82;
const CUSTOM_TEAMBUILDER_LARGE_SPRITE_MAX_HEIGHT = 82;
const CUSTOM_TEAMBUILDER_GMAX_SPRITE_MAX_WIDTH = 86;
const CUSTOM_TEAMBUILDER_GMAX_SPRITE_MAX_HEIGHT = 86;
const CUSTOM_TEAMBUILDER_OVERRIDE_MAX_WIDTH = 86;
const CUSTOM_TEAMBUILDER_OVERRIDE_MAX_HEIGHT = 86;
const CUSTOM_TEAMBUILDER_MAX_UPSCALE = 1.12;
const CUSTOM_TEAMBUILDER_SPRITE_Y_OFFSET = 4;
const CUSTOM_TEAMBUILDER_SPRITE_Y_OFFSETS: {[id: string]: number} = {
	sableye: 18,
};
const CUSTOM_TEAMBUILDER_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	aegislashgmax: {w: 74, h: 74},
	corviknight: {w: 62, h: 62},
	alcremie: {w: 60, h: 60},
	ariados: {w: 60, h: 60},
	butterfree: {w: 58, h: 58},
	butterfreemega: {w: 70, h: 70},
	dragapultgmax: {w: 74, h: 74},
	dondozo: {w: 82, h: 82},
	espeon: {w: 58, h: 58},
	gardevoir: {w: 82, h: 82},
	gardevoirmega: {w: 82, h: 82},
	gardevoirmegaz: {w: 82, h: 82},
	gardevoirvoid: {w: 82, h: 82},
	gardevoirvoidmega: {w: 86, h: 86},
	flareon: {w: 86, h: 86},
	glaceon: {w: 86, h: 86},
	hatterene: {w: 82, h: 82},
	hydreigon: {w: 82, h: 82},
	infernapealt: {w: 74, h: 74},
	jolteon: {w: 86, h: 86},
	leafeon: {w: 86, h: 86},
	indeedee: {w: 56, h: 56},
	indeedeef: {w: 56, h: 56},
	maushold: {w: 60, h: 60},
	mausholdfour: {w: 60, h: 60},
	mothim: {w: 74, h: 74},
	ninetales: {w: 76, h: 76},
	ninetalesalola: {w: 66, h: 66},
	palafinhero: {w: 82, h: 82},
	perrserker: {w: 60, h: 60},
	ribombee: {w: 60, h: 60},
	sableye: {w: 108, h: 108},
	sableyemega: {w: 58, h: 58},
	excadrillmega: {w: 66, h: 66},
	spiritomb: {w: 56, h: 56},
	rotom: {w: 68, h: 68},
	rotomfan: {w: 72, h: 72},
	rotomfrost: {w: 72, h: 72},
	rotomheat: {w: 72, h: 72},
	rotommow: {w: 72, h: 72},
	rotomwash: {w: 72, h: 72},
	sinistcha: {w: 60, h: 60},
	sinistchamasterpiece: {w: 60, h: 60},
	sneasler: {w: 90, h: 90},
	tatsugiri: {w: 52, h: 52},
	tatsugiridroopy: {w: 52, h: 52},
	tatsugiristretchy: {w: 52, h: 52},
	tyrantrum: {w: 82, h: 82},
	torterraalt: {w: 78, h: 78},
	sylveon: {w: 86, h: 86},
	umbreon: {w: 86, h: 86},
	vaporeon: {w: 86, h: 86},
	weavile: {w: 60, h: 60},
	weavilef: {w: 60, h: 60},
	whimsicott: {w: 60, h: 60},
	zoroark: {w: 74, h: 74},
	zoroarkhisui: {w: 74, h: 74},
};

function applyCustomTeambuilderSpriteSizing(spriteData: SpriteData, id: string, spriteDimensions: {w: number, h: number}) {
	const sizeOverride = CUSTOM_TEAMBUILDER_SPRITE_SIZE_OVERRIDES[id];
	const isGmaxCustomForm = id.includes('gmax');
	const isLargeCustomForm = id.includes('mega') || isGmaxCustomForm || id.includes('battlebond');
	const isMediumCustomForm = !sizeOverride && !isLargeCustomForm &&
		Math.max(spriteDimensions.w, spriteDimensions.h) >= CUSTOM_MEDIUM_SPRITE_MIN_DIMENSION &&
		Math.max(spriteDimensions.w, spriteDimensions.h) <= CUSTOM_MEDIUM_SPRITE_MAX_DIMENSION;
	const defaultMaxWidth = isGmaxCustomForm ? CUSTOM_TEAMBUILDER_GMAX_SPRITE_MAX_WIDTH :
		isLargeCustomForm ? CUSTOM_TEAMBUILDER_LARGE_SPRITE_MAX_WIDTH :
		isMediumCustomForm ? CUSTOM_TEAMBUILDER_MEDIUM_SPRITE_MAX_WIDTH : CUSTOM_TEAMBUILDER_SPRITE_MAX_WIDTH;
	const defaultMaxHeight = isGmaxCustomForm ? CUSTOM_TEAMBUILDER_GMAX_SPRITE_MAX_HEIGHT :
		isLargeCustomForm ? CUSTOM_TEAMBUILDER_LARGE_SPRITE_MAX_HEIGHT :
		isMediumCustomForm ? CUSTOM_TEAMBUILDER_MEDIUM_SPRITE_MAX_HEIGHT : CUSTOM_TEAMBUILDER_SPRITE_MAX_HEIGHT;
	const targetWidth = sizeOverride?.w ? Math.min(sizeOverride.w, CUSTOM_TEAMBUILDER_OVERRIDE_MAX_WIDTH) : defaultMaxWidth;
	const targetHeight = sizeOverride?.h ? Math.min(sizeOverride.h, CUSTOM_TEAMBUILDER_OVERRIDE_MAX_HEIGHT) : defaultMaxHeight;
	let scale = Math.min(targetWidth / spriteDimensions.w, targetHeight / spriteDimensions.h);
	if (!sizeOverride) scale = Math.min(scale, CUSTOM_TEAMBUILDER_MAX_UPSCALE);
	const width = Math.max(1, Math.round(spriteDimensions.w * scale));
	const height = Math.max(1, Math.round(spriteDimensions.h * scale));
	spriteData.x = Math.round((96 - width) / 2);
	spriteData.y = Math.round((86 - height) / 2) + CUSTOM_TEAMBUILDER_SPRITE_Y_OFFSET +
		(CUSTOM_TEAMBUILDER_SPRITE_Y_OFFSETS[id] || 0);
	spriteData.backgroundSize = `${width}px auto`;
}
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
let customNativeBWSpriteSizes: {[id: string]: AnyObject} = {};

function copySpriteSize(size?: {w?: number, h?: number}) {
	if (!size?.w || !size?.h) return undefined;
	return {w: size.w, h: size.h};
}

function getSpriteSize(data: AnyObject | undefined, isFront: boolean, shiny?: boolean) {
	if (!data) return undefined;
	const facing = isFront ? 'front' : 'back';
	const shinyFacing = isFront ? 'shinyFront' : 'shinyBack';
	return shiny ? copySpriteSize(data[shinyFacing] || data[facing]) : copySpriteSize(data[facing]);
}

function copySpriteSizeSet(data: AnyObject | undefined) {
	if (!data) return undefined;
	return {
		front: copySpriteSize(data.front),
		back: copySpriteSize(data.back),
		shinyFront: copySpriteSize(data.shinyFront),
		shinyBack: copySpriteSize(data.shinyBack),
	};
}

function getCustomBaseSpriteId(id: string) {
	const customSpeciesBase = CUSTOM_SPECIES[id]?.base;
	if (customSpeciesBase) return customSpeciesBase;

	const species = window.BattlePokedex?.[id];
	const baseSpeciesId = toID(species?.baseSpecies);
	if (baseSpeciesId && baseSpeciesId !== id) return baseSpeciesId;

	for (const suffix of ['battlebond', 'megaz', 'megax', 'megay', 'mega', 'gmax', 'alt']) {
		if (id.endsWith(suffix) && id.length > suffix.length) return id.slice(0, -suffix.length);
	}
	return '';
}

function getNativeSpriteSizeSet(id: string) {
	return copySpriteSizeSet(customNativeBWSpriteSizes[id] || window.BattlePokemonSpritesBW?.[id]);
}

function getCustomSpriteSize(id: string, customData: AnyObject, isFront: boolean, shiny?: boolean) {
	return getSpriteSize(customNativeBWSpriteSizes[id], isFront, shiny) || getSpriteSize(customData, isFront, shiny)!;
}

function ensureCustomBWSpriteData() {
	if (!window.BattlePokemonSpritesBW) return;
	if (customBWSpriteDataTable === window.BattlePokemonSpritesBW) return;
	customNativeBWSpriteSizes = {};
	for (const id of CUSTOM_BW_SPRITE_IDS) {
		const nativeSpriteData = window.BattlePokemonSpritesBW[id];
		if (nativeSpriteData) {
			customNativeBWSpriteSizes[id] = copySpriteSizeSet(nativeSpriteData)!;
		}
		if (!nativeSpriteData) {
			window.BattlePokemonSpritesBW[id] = CUSTOM_BW_SPRITES[id];
		} else {
			Object.assign(nativeSpriteData, CUSTOM_BW_SPRITES[id]);
		}
	}
	for (const id of CUSTOM_BW_SPRITE_IDS) {
		if (customNativeBWSpriteSizes[id]) continue;
		const baseSpriteId = getCustomBaseSpriteId(id);
		const baseSpriteSize = baseSpriteId && getNativeSpriteSizeSet(baseSpriteId);
		if (baseSpriteSize) customNativeBWSpriteSizes[id] = baseSpriteSize;
	}
	customBWSpriteDataTable = window.BattlePokemonSpritesBW;
}

function applyCustomTeambuilderLearnsets(table: AnyObject) {
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
}

function applyCustomTeambuilderSpecies(table: AnyObject) {
	if (!table.overrideSpeciesData) table.overrideSpeciesData = {};
	for (const id of CUSTOM_SPECIES_IDS) {
		const customSpecies = CUSTOM_SPECIES[id];
		table.overrideSpeciesData[id] = {
			...(table.overrideSpeciesData[id] || {}),
			...customSpecies.data,
		};
	}
	if (table.tiers) {
		for (const id of CUSTOM_SPECIES_IDS) {
			const customSpecies = CUSTOM_SPECIES[id];
			const baseIndex = table.tiers.indexOf(customSpecies.base);
			if (baseIndex >= 0 && !table.tiers.includes(id)) table.tiers.splice(baseIndex + 1, 0, id);
		}
	}
	if (!table.overrideTier) table.overrideTier = {};
	for (const id of CUSTOM_SPECIES_IDS) {
		const customSpecies = CUSTOM_SPECIES[id];
		if (!table.overrideTier[id] && table.overrideTier[customSpecies.base]) {
			table.overrideTier[id] = table.overrideTier[customSpecies.base];
		}
	}
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
	if (window.BattleAliases) window.BattleAliases.alchemicsurge = 'Alchemist Surge';
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
		applyCustomTeambuilderSpecies(table);
		if (!table.overrideAbilityData) table.overrideAbilityData = {};
		for (const id of CUSTOM_ABILITY_UPDATE_IDS) {
			table.overrideAbilityData[id] = {
				...(table.overrideAbilityData[id] || {}),
				...CUSTOM_ABILITY_UPDATES[id],
			};
		}
		applyCustomTeambuilderLearnsets(table);
		for (const subtableid in table) {
			const subtable = table[subtableid];
			if (subtable && typeof subtable === 'object' && subtable.learnsets) {
				applyCustomTeambuilderSpecies(subtable);
				applyCustomTeambuilderLearnsets(subtable);
			}
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
		teamPreview?: boolean,
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
			const speciesForme = pokemon.getSpeciesForme();
			const speciesid = toID(speciesForme);
			let activeSilvallyForme = '';
			if (speciesid.startsWith('silvally') && !pokemon.terastallized) {
				const types = pokemon.getTypes();
				const typeName = pokemon.volatiles.typechange?.[1] || types[0];
				const typeid = typeName === '???' ? 'unknown' : toID(typeName);
				activeSilvallyForme = typeid === 'normal' ? 'Silvally' : SILVALLY_TYPE_FORMES[typeid];
			}
			pokemon = (activeSilvallyForme || speciesForme) + (isGigantamax ? '-Gmax' : '');
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
		if (requestedSpriteid && SILVALLY_FORME_TYPES[requestedSpriteid]) name = CUSTOM_ICON_SPRITES[requestedSpriteid] || requestedSpriteid;
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
		// Use Lucario's native BW animated back sprite for a cleaner battle silhouette.
		if (species.id === 'milotic' || species.id === 'miloticalt' || species.id === 'kingambitalt' ||
			(!isFront && (species.id === 'lucario' || species.id === 'lucariomega'))) graphicsGen = 5;
		spriteData.gen = Math.max(graphicsGen, Math.min(species.gen, 5));
		const baseDir = ['', 'gen1', 'gen2', 'gen3', 'gen4', 'gen5', '', '', '', ''][spriteData.gen];

		let animationData = null;
		let miscData = null;
		let speciesid = species.id;
		if (requestedSpriteid && SILVALLY_FORME_TYPES[requestedSpriteid]) speciesid = requestedSpriteid;
		if (requestedSpriteid && (
			CUSTOM_STATIC_BATTLE_SPRITES[requestedSpriteid] ||
			CUSTOM_BW_SPRITES[requestedSpriteid] ||
			CUSTOM_ICON_SPRITES[requestedSpriteid]
		)) speciesid = requestedSpriteid;
		if (CUSTOM_ICON_SPRITES[speciesid]) name = CUSTOM_ICON_SPRITES[speciesid] as ID;
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
		let customStaticBattleSpriteid = speciesid;
		if (options.gender === 'F' && CUSTOM_STATIC_BATTLE_SPRITES[`${speciesid}f`]) {
			customStaticBattleSpriteid = `${speciesid}f`;
		}
		const allowCustomAnimation = CUSTOM_ANIMATED_BW_SPRITES.has(customStaticBattleSpriteid) ||
			CUSTOM_ANIMATED_BW_SPRITES.has(speciesid);
		if (CUSTOM_ICON_SPRITES[speciesid] && !allowCustomAnimation) allowAnim = false;
		const customStaticBattleSprite = CUSTOM_STATIC_BATTLE_SPRITES[customStaticBattleSpriteid];
		if (customStaticBattleSprite && !allowCustomAnimation) allowAnim = false;
		const customBWSprite = CUSTOM_BW_SPRITES[speciesid];
		if (customBWSprite && !allowCustomAnimation) allowAnim = false;
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
		let customSpriteNaturalSize: {w: number, h: number} | undefined;
		if (customStaticBattleSprite) {
			const customSpriteSize = getCustomSpriteSize(customStaticBattleSpriteid, customStaticBattleSprite, isFront, options.shiny);
			customSpriteNaturalSize = customSpriteSize;
			spriteData.w = customSpriteSize.w;
			spriteData.h = customSpriteSize.h;
		} else if (customBWSprite && spriteData.gen === 5) {
			const customSpriteSize = getCustomSpriteSize(speciesid, customBWSprite, isFront, options.shiny);
			customSpriteNaturalSize = customSpriteSize;
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
		if (!options.noScale && !customStaticBattleSprite && !customBWSprite && !isDynamax) {
			const nativeBattleSpriteMaxSize = NATIVE_BATTLE_SPRITE_SIZE_OVERRIDES[speciesid]?.[isFront ? 'front' : 'back'];
			if (nativeBattleSpriteMaxSize) {
				const scale = Math.min(nativeBattleSpriteMaxSize.w / spriteData.w, nativeBattleSpriteMaxSize.h / spriteData.h);
				if (scale < 1) {
					spriteData.w = Math.round(spriteData.w * scale);
					spriteData.h = Math.round(spriteData.h * scale);
				}
			}
		}
		if (options.teamPreview && (customStaticBattleSprite || customBWSprite) && !isDynamax) {
			const isLargeCustomForm = speciesid.includes('mega') ||
				speciesid.includes('battlebond');
			const isGmaxCustomForm = speciesid.includes('gmax');
			const previewSpriteMaxSize = isFront ?
				(CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_SIZE_OVERRIDES[customStaticBattleSpriteid] ||
					CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_SIZE_OVERRIDES[speciesid]) :
				(CUSTOM_TEAM_PREVIEW_BACK_SPRITE_SIZE_OVERRIDES[customStaticBattleSpriteid] ||
					CUSTOM_TEAM_PREVIEW_BACK_SPRITE_SIZE_OVERRIDES[speciesid]);
			const defaultMaxWidth = isFront ?
				(previewSpriteMaxSize?.w || (isGmaxCustomForm ? CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_WIDTH :
					isLargeCustomForm ? CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_WIDTH :
					CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_WIDTH)) :
				(previewSpriteMaxSize?.w || (isGmaxCustomForm ? CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_WIDTH :
					isLargeCustomForm ? CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_WIDTH :
					CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_WIDTH));
			const defaultMaxHeight = isFront ?
				(previewSpriteMaxSize?.h || (isGmaxCustomForm ? CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_HEIGHT :
					isLargeCustomForm ? CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_HEIGHT :
					CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_HEIGHT)) :
				(previewSpriteMaxSize?.h || (isGmaxCustomForm ? CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_HEIGHT :
					isLargeCustomForm ? CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_HEIGHT :
					CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_HEIGHT));
			const scale = Math.min(defaultMaxWidth / spriteData.w, defaultMaxHeight / spriteData.h);
			if (scale < 1) {
				spriteData.w = Math.round(spriteData.w * scale);
				spriteData.h = Math.round(spriteData.h * scale);
			}
		}
		if (!options.noScale && (customStaticBattleSprite || customBWSprite) && !isDynamax) {
			const battleSpriteMaxSize = isFront ?
				(CUSTOM_BATTLE_FRONT_SPRITE_SIZE_OVERRIDES[customStaticBattleSpriteid] ||
					CUSTOM_BATTLE_FRONT_SPRITE_SIZE_OVERRIDES[speciesid]) :
				(CUSTOM_BATTLE_BACK_SPRITE_SIZE_OVERRIDES[customStaticBattleSpriteid] ||
					CUSTOM_BATTLE_BACK_SPRITE_SIZE_OVERRIDES[speciesid]);
			const isGmaxCustomForm = speciesid.includes('gmax');
			const isLargeCustomForm = speciesid.includes('mega') ||
				isGmaxCustomForm || speciesid.includes('battlebond');
			const isMediumCustomForm = !isLargeCustomForm && customSpriteNaturalSize &&
				Math.max(customSpriteNaturalSize.w, customSpriteNaturalSize.h) >= CUSTOM_MEDIUM_SPRITE_MIN_DIMENSION &&
				Math.max(customSpriteNaturalSize.w, customSpriteNaturalSize.h) <= CUSTOM_MEDIUM_SPRITE_MAX_DIMENSION;
			const defaultMaxWidth = isFront ?
				(isGmaxCustomForm ? CUSTOM_BATTLE_FRONT_GMAX_SPRITE_MAX_WIDTH :
					isLargeCustomForm ? CUSTOM_BATTLE_FRONT_MEGA_SPRITE_MAX_WIDTH :
					isMediumCustomForm ? CUSTOM_BATTLE_FRONT_MEDIUM_SPRITE_MAX_WIDTH : CUSTOM_BATTLE_FRONT_SPRITE_MAX_WIDTH) :
				(isGmaxCustomForm ? CUSTOM_BATTLE_BACK_GMAX_SPRITE_MAX_WIDTH :
					isLargeCustomForm ? CUSTOM_BATTLE_BACK_MEGA_SPRITE_MAX_WIDTH :
					isMediumCustomForm ? CUSTOM_BATTLE_BACK_MEDIUM_SPRITE_MAX_WIDTH : CUSTOM_BATTLE_BACK_SPRITE_MAX_WIDTH);
			const defaultMaxHeight = isFront ?
				(isGmaxCustomForm ? CUSTOM_BATTLE_FRONT_GMAX_SPRITE_MAX_HEIGHT :
					isLargeCustomForm ? CUSTOM_BATTLE_FRONT_MEGA_SPRITE_MAX_HEIGHT :
					isMediumCustomForm ? CUSTOM_BATTLE_FRONT_MEDIUM_SPRITE_MAX_HEIGHT : CUSTOM_BATTLE_FRONT_SPRITE_MAX_HEIGHT) :
				(isGmaxCustomForm ? CUSTOM_BATTLE_BACK_GMAX_SPRITE_MAX_HEIGHT :
					isLargeCustomForm ? CUSTOM_BATTLE_BACK_MEGA_SPRITE_MAX_HEIGHT :
					isMediumCustomForm ? CUSTOM_BATTLE_BACK_MEDIUM_SPRITE_MAX_HEIGHT : CUSTOM_BATTLE_BACK_SPRITE_MAX_HEIGHT);
			const scale = Math.min(
				(battleSpriteMaxSize?.w || defaultMaxWidth) / spriteData.w,
				(battleSpriteMaxSize?.h || defaultMaxHeight) / spriteData.h
			);
			spriteData.w = Math.round(spriteData.w * scale);
			spriteData.h = Math.round(spriteData.h * scale);
			const customBattleYOffset = CUSTOM_BATTLE_SPRITE_Y_OFFSETS[customStaticBattleSpriteid] ||
				CUSTOM_BATTLE_SPRITE_Y_OFFSETS[speciesid];
			if (customBattleYOffset) spriteData.y += isFront ? (customBattleYOffset.front || 0) : (customBattleYOffset.back || 0);
			const customBattleXOffset = CUSTOM_BATTLE_SPRITE_X_OFFSETS[customStaticBattleSpriteid] ||
				CUSTOM_BATTLE_SPRITE_X_OFFSETS[speciesid];
			if (customBattleXOffset) spriteData.x += isFront ? (customBattleXOffset.front || 0) : (customBattleXOffset.back || 0);
		}
		if (!options.noScale && !isFront && !isDynamax) {
			const universalBackMax = speciesid.includes('gmax') ? 112 : speciesid.includes('mega') ? 90 : 86;
			const scale = Math.min(universalBackMax / spriteData.w, universalBackMax / spriteData.h);
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
		if (options.teamPreview && !isDynamax) {
			const isGmax = speciesid.includes('gmax');
			const isMega = speciesid.includes('mega') || speciesid.includes('battlebond');
			const maxWidth = isFront ?
				(isGmax ? CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_WIDTH :
					isMega ? CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_WIDTH : CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_WIDTH) :
				(isGmax ? CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_WIDTH :
					isMega ? CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_WIDTH : CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_WIDTH);
			const maxHeight = isFront ?
				(isGmax ? CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_HEIGHT :
					isMega ? CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_HEIGHT : CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_HEIGHT) :
				(isGmax ? CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_HEIGHT :
					isMega ? CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_HEIGHT : CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_HEIGHT);
			const scale = Math.min(maxWidth / spriteData.w, maxHeight / spriteData.h);
			if (scale < 1) {
				spriteData.w = Math.max(1, Math.round(spriteData.w * scale));
				spriteData.h = Math.max(1, Math.round(spriteData.h * scale));
			}
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
		ensureCustomBWSpriteData();
		let id = toID(pokemon.species);
		let spriteid = pokemon.spriteid;
		let species = Dex.species.get(pokemon.species);
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
		if (id.startsWith('silvally')) spriteData.shiny = true;
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
			const spriteDimensions = customStaticData ?
				getCustomSpriteSize(id, customStaticData, true, pokemon.shiny) :
				customBWData ? getCustomSpriteSize(id, customBWData, true, pokemon.shiny) : undefined;
			if (spriteDimensions) {
				applyCustomTeambuilderSpriteSizing(spriteData, id, spriteDimensions);
			} else {
				const customSpriteData = CUSTOM_TEAMBUILDER_SPRITES[id] || {x: 12, y: 10, backgroundSize: '72px auto'};
				spriteData.x = customSpriteData.x;
				spriteData.y = customSpriteData.y;
				spriteData.backgroundSize = customSpriteData.backgroundSize;
			}
			return spriteData;
		}
		const nativeTeambuilderOverride = NATIVE_TEAMBUILDER_SPRITE_OVERRIDES[pokemon.gender === 'F' ? `${id}f` : id] ||
			NATIVE_TEAMBUILDER_SPRITE_OVERRIDES[id];
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
				if (nativeTeambuilderOverride) {
					Object.assign(spriteData, nativeTeambuilderOverride);
				} else {
					spriteData.x = -2;
					spriteData.y = 2;
				}
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
			const spriteDimensions = customStaticData ?
				getCustomSpriteSize(id, customStaticData, true, pokemon.shiny) :
				customBWData ? getCustomSpriteSize(id, customBWData, true, pokemon.shiny) : undefined;
			if (spriteDimensions) {
				applyCustomTeambuilderSpriteSizing(spriteData, id, spriteDimensions);
			}
		}
		if (nativeTeambuilderOverride) Object.assign(spriteData, nativeTeambuilderOverride);
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
			if (isSilvallySpecies(set.species)) set.shiny = true;
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
			if (isSilvallySpecies(curSet.species)) curSet.shiny = true;
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
