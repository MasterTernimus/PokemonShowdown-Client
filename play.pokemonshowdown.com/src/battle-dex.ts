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
	hypnopulse: {
		base: 'hypno',
		data: {
			name: 'Hypno-Pulse',
			baseSpecies: 'Hypno',
			forme: 'Pulse',
			spriteid: 'hypno-pulse',
			changesFrom: 'Hypno',
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
	miloticaevian: {
		base: 'milotic',
		data: {
			name: 'Milotic-Aevian',
			baseSpecies: 'Milotic',
			forme: 'Aevian',
			spriteid: 'milotic-aevian',
			changesFrom: 'Milotic',
			isNonstandard: 'Custom',
		},
	},
	gastrodonaevian: {
		base: 'gastrodon',
		data: {
			name: 'Gastrodon-Aevian',
			baseSpecies: 'Gastrodon',
			forme: 'Aevian',
			spriteid: 'gastrodon-aevian',
			changesFrom: 'Gastrodon',
			isNonstandard: 'Custom',
		},
	},
	gastrodoneastaevian: {
		base: 'gastrodon',
		data: {
			name: 'Gastrodon-East-Aevian',
			baseSpecies: 'Gastrodon',
			forme: 'East-Aevian',
			spriteid: 'gastrodon-east-aevian',
			changesFrom: 'Gastrodon-East',
			isNonstandard: 'Custom',
		},
	},
	belliboltalt: {
		base: 'bellibolt',
		data: {
			name: 'Bellibolt-Alt',
			baseSpecies: 'Bellibolt',
			forme: 'Alt',
			spriteid: 'bellibolt-alt',
			changesFrom: 'Bellibolt',
			isNonstandard: 'Custom',
		},
	},
	typhlosionalt: {
		base: 'typhlosion',
		data: {
			name: 'Typhlosion-Alt',
			baseSpecies: 'Typhlosion',
			forme: 'Alt',
			spriteid: 'typhlosion-alt',
			changesFrom: 'Typhlosion',
			isNonstandard: 'Custom',
		},
	},
	nidokingalt: {
		base: 'nidoking',
		data: {
			name: 'Nidoking-Alt',
			baseSpecies: 'Nidoking',
			forme: 'Alt',
			spriteid: 'nidoking-alt',
			changesFrom: 'Nidoking',
			isNonstandard: 'Custom',
		},
	},
	nidoqueenalt: {
		base: 'nidoqueen',
		data: {
			name: 'Nidoqueen-Alt',
			baseSpecies: 'Nidoqueen',
			forme: 'Alt',
			spriteid: 'nidoqueen-alt',
			changesFrom: 'Nidoqueen',
			isNonstandard: 'Custom',
		},
	},
	ninetalesalt: {
		base: 'ninetales',
		data: {
			name: 'Ninetales-Alt',
			baseSpecies: 'Ninetales',
			forme: 'Alt',
			spriteid: 'ninetales-alt',
			changesFrom: 'Ninetales',
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
	cacturnealt: {
		base: 'cacturne',
		data: {
			name: 'Cacturne-Alt',
			baseSpecies: 'Cacturne',
			forme: 'Alt',
			spriteid: 'cacturne-alt',
			changesFrom: 'Cacturne',
			isNonstandard: 'Custom',
		},
	},
	mightyenaalt: {
		base: 'mightyena',
		data: {
			name: 'Mightyena-Alt',
			baseSpecies: 'Mightyena',
			forme: 'Alt',
			spriteid: 'mightyena-alt',
			changesFrom: 'Mightyena',
			isNonstandard: 'Custom',
		},
	},
	toxicroakalt: {
		base: 'toxicroak',
		data: {
			name: 'Toxicroak-Alt',
			baseSpecies: 'Toxicroak',
			forme: 'Alt',
			spriteid: 'toxicroak-alt',
			changesFrom: 'Toxicroak',
			isNonstandard: 'Custom',
		},
	},
	cinccinoalt: {
		base: 'cinccino',
		data: {
			name: 'Cinccino-Alt',
			baseSpecies: 'Cinccino',
			forme: 'Alt',
			spriteid: 'cinccino-alt',
			changesFrom: 'Cinccino',
			isNonstandard: 'Custom',
		},
	},
	weavilealt: {
		base: 'weavile',
		data: {
			name: 'Weavile-Alt',
			baseSpecies: 'Weavile',
			forme: 'Alt',
			spriteid: 'weavile-alt',
			changesFrom: 'Weavile',
			isNonstandard: 'Custom',
		},
	},
	dusknoiralt: {
		base: 'dusknoir',
		data: {
			name: 'Dusknoir-Alt',
			baseSpecies: 'Dusknoir',
			forme: 'Alt',
			spriteid: 'dusknoir-alt',
			changesFrom: 'Dusknoir',
			isNonstandard: 'Custom',
		},
	},
	spiritombalt: {
		base: 'spiritomb',
		data: {
			name: 'Spiritomb-Alt',
			baseSpecies: 'Spiritomb',
			forme: 'Alt',
			spriteid: 'spiritomb-alt',
			changesFrom: 'Spiritomb',
			isNonstandard: 'Custom',
		},
	},
	parasectparasitism: {
		base: 'parasect',
		data: {
			name: 'Parasect-Parasitism',
			baseSpecies: 'Parasect',
			forme: 'Parasitism',
			spriteid: 'parasect-parasitism',
			types: ['Ghost', 'Bug'],
			baseStats: {hp: 90, atk: 120, def: 105, spa: 35, spd: 110, spe: 20},
			abilities: {0: 'Parasitism'},
			battleOnly: 'Parasect',
			isNonstandard: 'Custom',
		},
	},
	parasectparasite: {
		base: 'parasect',
		data: {
			name: 'Parasect-Parasite',
			baseSpecies: 'Parasect',
			forme: 'Parasite',
			spriteid: 'parasect-parasite',
			types: ['Ghost', 'Poison'],
			baseStats: {hp: 90, atk: 130, def: 70, spa: 30, spd: 70, spe: 110},
			abilities: {0: 'Resuscitation'},
			battleOnly: 'Parasect',
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
	gardevoirvoidmega: {
		base: 'gardevoirmega',
		data: {
			name: 'Gardevoir-Void-Mega',
			baseSpecies: 'Gardevoir',
			forme: 'Void-Mega',
			requiredItem: 'Gardevoirite',
			battleOnly: 'Gardevoir',
			changesFrom: 'Gardevoir',
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
			battleOnly: 'Gardevoir',
			changesFrom: 'Gardevoir',
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
	cacturnealt: 'cacturne-alt',
	mightyenaalt: 'mightyena-alt',
	toxicroakalt: 'toxicroak-alt',
	cinccinoalt: 'cinccino-alt',
	weavilealt: 'weavile-alt',
	dusknoiralt: 'dusknoir-alt',
	spiritombalt: 'spiritomb-alt',
	parasectparasitism: 'parasect-parasitism',
	parasectparasite: 'parasect-parasite',
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
	charizardmegax: 'charizard-megax',
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
	miloticaevian: 'milotic-aevian',
	gastrodonaevian: 'gastrodon-aevian',
	gastrodoneastaevian: 'gastrodon-east-aevian',
	hypnopulse: 'hypno-pulse',
	belliboltalt: 'bellibolt-alt',
	typhlosionalt: 'typhlosion-alt',
	nidokingalt: 'nidoking-alt',
	nidoqueenalt: 'nidoqueen-alt',
	ninetalesalt: 'ninetales-alt',
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
	weavilealt: {
		front: {w: 120, h: 128},
		back: {w: 96, h: 130},
	},
	weavilealtf: {
		front: {w: 120, h: 128},
		back: {w: 96, h: 130},
	},
	dusknoiralt: {
		front: {w: 170, h: 148},
		back: {w: 126, h: 134},
	},
	spiritombalt: {
		front: {w: 114, h: 112},
		back: {w: 108, h: 104},
	},
	parasectparasitism: {
		front: {w: 118, h: 132},
		back: {w: 128, h: 122},
	},
	parasectparasite: {
		front: {w: 130, h: 132},
		back: {w: 140, h: 122},
	},
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
		back: {w: 70, h: 67},
		shinyBack: {w: 68, h: 66},
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
	charizardmegax: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
	},
	belliboltalt: {
		front: {w: 152, h: 172},
		back: {w: 150, h: 168},
	},
	typhlosionalt: {
		front: {w: 156, h: 184},
		back: {w: 150, h: 178},
	},
	nidokingalt: {
		front: {w: 170, h: 178},
		back: {w: 144, h: 144},
	},
	nidoqueenalt: {
		front: {w: 168, h: 170},
		back: {w: 164, h: 166},
	},
	ninetalesalt: {
		front: {w: 170, h: 170},
		back: {w: 178, h: 170},
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
		shinyFront: {w: 180, h: 150},
		shinyBack: {w: 186, h: 150},
	},
	centiskorchgmax: {
		front: {w: 188, h: 188},
		back: {w: 186, h: 188},
		shinyFront: {w: 188, h: 188},
		shinyBack: {w: 186, h: 188},
	},
	cacturnealt: {
		front: {w: 96, h: 116},
		back: {w: 96, h: 116},
		shinyFront: {w: 96, h: 116},
		shinyBack: {w: 96, h: 116},
	},
	mightyenaalt: {
		front: {w: 172, h: 154},
		back: {w: 162, h: 152},
		shinyFront: {w: 172, h: 154},
		shinyBack: {w: 162, h: 152},
	},
	toxicroakalt: {
		front: {w: 180, h: 152},
		back: {w: 130, h: 128},
		shinyFront: {w: 180, h: 152},
		shinyBack: {w: 130, h: 128},
	},
	cinccinoalt: {
		front: {w: 166, h: 162},
		back: {w: 142, h: 142},
		shinyFront: {w: 166, h: 162},
		shinyBack: {w: 142, h: 142},
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
	miloticaevian: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	gastrodonaevian: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	gastrodoneastaevian: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	hypnopulse: {
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
		back: {w: 70, h: 67},
		shinyBack: {w: 68, h: 66},
	},
	pidgeotmega: {
		num: 18,
		front: {w: 184, h: 170},
		back: {w: 182, h: 176},
	},
	heracross: {
		num: 214,
		front: {w: 61, h: 70},
		back: {w: 67, h: 72},
	},
	staraptor: {
		num: 398,
		front: {w: 69, h: 69},
		back: {w: 74, h: 68},
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
	miloticaevian: {
		num: 350,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	belliboltalt: {
		num: 939,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	typhlosionalt: {
		num: 157,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	nidokingalt: {
		num: 34,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	nidoqueenalt: {
		num: 31,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	ninetalesalt: {
		num: 38,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	gastrodonaevian: {
		num: 423,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	gastrodoneastaevian: {
		num: 423,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	hypnopulse: {
		num: 97,
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
		shinyFront: {w: 180, h: 150},
		shinyBack: {w: 186, h: 150},
	},
	centiskorchgmax: {
		num: 851,
		front: {w: 188, h: 188},
		back: {w: 186, h: 188},
		shinyFront: {w: 188, h: 188},
		shinyBack: {w: 186, h: 188},
	},
	cacturnealt: {
		num: 332,
		front: {w: 96, h: 116},
		back: {w: 96, h: 116},
		shinyFront: {w: 96, h: 116},
		shinyBack: {w: 96, h: 116},
	},
	mightyenaalt: {
		num: 262,
		front: {w: 172, h: 154},
		back: {w: 162, h: 152},
		shinyFront: {w: 172, h: 154},
		shinyBack: {w: 162, h: 152},
	},
	toxicroakalt: {
		num: 454,
		front: {w: 180, h: 152},
		back: {w: 130, h: 128},
		shinyFront: {w: 180, h: 152},
		shinyBack: {w: 130, h: 128},
	},
	cinccinoalt: {
		num: 573,
		front: {w: 166, h: 162},
		back: {w: 142, h: 142},
		shinyFront: {w: 166, h: 162},
		shinyBack: {w: 142, h: 142},
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
		front: {w: 96, h: 96},
		back: {w: 63, h: 70},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 63, h: 70},
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
	manectric: {
		baseStats: {hp: 70, atk: 110, def: 65, spa: 125, spd: 65, spe: 105},
		abilities: {0: 'Strong Jaw', 1: 'Competitive', H: 'Lightning Rod'},
	},
	manectricmega: {
		baseStats: {hp: 70, atk: 120, def: 80, spa: 135, spd: 80, spe: 155},
	},
	gengargmax: {
		abilities: {0: 'Soul Strike'},
	},
	bellibolt: {
		otherFormes: ['Bellibolt-Alt'],
		formeOrder: ['Bellibolt', 'Bellibolt-Alt'],
	},
	belliboltalt: {
		baseStats: {hp: 109, atk: 64, def: 101, spa: 123, spd: 103, spe: 45},
	},
	typhlosion: {
		otherFormes: ['Typhlosion-Hisui', 'Typhlosion-Alt'],
		formeOrder: ['Typhlosion', 'Typhlosion-Hisui', 'Typhlosion-Alt'],
	},
	typhlosionalt: {
		baseStats: {hp: 83, atk: 105, def: 85, spa: 122, spd: 70, spe: 105},
	},
	nidoking: {
		otherFormes: ['Nidoking-Alt'],
		formeOrder: ['Nidoking', 'Nidoking-Alt'],
	},
	nidokingalt: {
		baseStats: {hp: 84, atk: 113, def: 90, spa: 106, spd: 87, spe: 90},
	},
	nidoqueen: {
		otherFormes: ['Nidoqueen-Alt'],
		formeOrder: ['Nidoqueen', 'Nidoqueen-Alt'],
	},
	nidoqueenalt: {
		baseStats: {hp: 92, atk: 100, def: 105, spa: 93, spd: 100, spe: 80},
	},
	ninetales: {
		otherFormes: ['Ninetales-Alola', 'Ninetales-Alt'],
		formeOrder: ['Ninetales', 'Ninetales-Alola', 'Ninetales-Alt'],
	},
	ninetalesalt: {
		baseStats: {hp: 73, atk: 76, def: 75, spa: 101, spd: 110, spe: 110},
	},
	gardevoir: {
		otherFormes: ['Gardevoir-Mega', 'Gardevoir-Void-Mega', 'Gardevoir-Mega-Z'],
		formeOrder: ['Gardevoir', 'Gardevoir-Mega', 'Gardevoir-Void-Mega', 'Gardevoir-Mega-Z'],
	},
	blastoise: {
		baseStats: {hp: 79, atk: 75, def: 95, spa: 100, spd: 108, spe: 78},
		abilities: {0: 'Water Barrage', 1: 'Regenerator', H: 'Shell Armor'},
	},
	blastoisemega: {
		baseStats: {hp: 79, atk: 85, def: 135, spa: 135, spd: 123, spe: 78},
	},
	blastoisegmax: {
		baseStats: {hp: 140, atk: 75, def: 95, spa: 100, spd: 108, spe: 78},
	},
	empoleon: {
		baseStats: {hp: 90, atk: 108, def: 90, spa: 111, spd: 101, spe: 70},
		abilities: {0: "Emperor's Resolve", 1: "Emperor's Pride", H: 'Royal Decree'},
	},
	sandaconda: {
		abilities: {0: 'Sand Spit', 1: 'Stamina', H: 'Shed Skin'},
	},
	obstagoon: {
		abilities: {0: 'Violent Rush', 1: 'Guts', H: 'Defiant'},
	},
	mightyena: {
		otherFormes: ['Mightyena-Alt'],
		cosmeticFormes: ['Mightyena-Alt'],
		formeOrder: ['Mightyena', 'Mightyena-Alt'],
	},
	mightyenaalt: {
		baseStats: {hp: 100, atk: 135, def: 90, spa: 60, spd: 80, spe: 105},
		abilities: {0: 'Intimidate', 1: 'Black Fang', H: 'Stakeout'},
	},
	toxicroak: {
		baseStats: {hp: 83, atk: 131, def: 70, spa: 121, spd: 70, spe: 95},
		abilities: {0: 'Battle Fervor', 1: 'Corrosion', H: 'Great Marsh'},
		otherFormes: ['Toxicroak-Alt'],
		cosmeticFormes: ['Toxicroak-Alt'],
		formeOrder: ['Toxicroak', 'Toxicroak-Alt'],
	},
	toxicroakalt: {
		baseStats: {hp: 83, atk: 131, def: 70, spa: 121, spd: 70, spe: 95},
		abilities: {0: 'Battle Fervor', 1: 'Corrosion', H: 'Great Marsh'},
	},
	cinccino: {
		baseStats: {hp: 75, atk: 105, def: 110, spa: 60, spd: 105, spe: 115},
		abilities: {0: 'Pixilate', 1: 'Skill Link', H: 'Fluffy Craft'},
		otherFormes: ['Cinccino-Alt'],
		cosmeticFormes: ['Cinccino-Alt'],
		formeOrder: ['Cinccino', 'Cinccino-Alt'],
	},
	cinccinoalt: {
		baseStats: {hp: 75, atk: 105, def: 110, spa: 60, spd: 105, spe: 115},
		abilities: {0: 'Pixilate', 1: 'Skill Link', H: 'Fluffy Craft'},
	},
	butterfreemega: {
		types: ['Bug', 'Poison'],
		baseStats: {hp: 75, atk: 30, def: 115, spa: 137, spd: 115, spe: 103},
		abilities: {0: 'Toxic Evolution'},
	},
	chimechomega: {
		types: ['Psychic', 'Steel'],
		baseStats: {hp: 75, atk: 50, def: 110, spa: 135, spd: 120, spe: 65},
		abilities: {0: 'Wind Chime'},
	},
	gliscor: {
		baseStats: {hp: 85, atk: 110, def: 140, spa: 45, spd: 90, spe: 100},
		abilities: {0: 'Hyper Cutter', 1: 'Poison Heal', H: 'Wind Rider'},
	},
	hydreigon: {
		abilities: {0: 'Levitate', 1: 'Dark Aura', H: 'Hydra Tyrant'},
	},
	skarmory: {
		abilities: {0: 'Self Sufficient', 1: 'Sturdy', H: 'Weak Armor'},
	},
	wyrdeer: {
		baseStats: {hp: 103, atk: 105, def: 82, spa: 105, spd: 85, spe: 70},
		abilities: {0: 'Intimidate', 1: 'Magic Guard', H: 'Hisuian Path'},
	},
	mantine: {
		baseStats: {hp: 95, atk: 95, def: 80, spa: 100, spd: 115, spe: 65},
		abilities: {0: 'Island Current', 1: 'Regenerator', H: 'Oceanic Wings'},
	},
	arbok: {baseStats: {hp: 95, atk: 125, def: 95, spa: 35, spd: 110, spe: 90}},
	golduck: {baseStats: {hp: 90, atk: 70, def: 90, spa: 110, spd: 90, spe: 70}},
	machamp: {baseStats: {hp: 100, atk: 145, def: 100, spa: 65, spd: 70, spe: 90}},
	machampgmax: {baseStats: {hp: 150, atk: 145, def: 100, spa: 65, spd: 70, spe: 90}},
	kingdra: {
		baseStats: {hp: 85, atk: 120, def: 90, spa: 120, spd: 90, spe: 95},
		abilities: {0: 'Swift Swim', 1: 'Abyss Sniper', H: 'Royal Decree'},
	},
	hitmontop: {baseStats: {hp: 80, atk: 130, def: 105, spa: 45, spd: 115, spe: 75}},
	exploud: {baseStats: {hp: 119, atk: 101, def: 73, spa: 116, spd: 73, spe: 88}},
	hariyama: {baseStats: {hp: 134, atk: 120, def: 88, spa: 40, spd: 88, spe: 50}},
	wailord: {baseStats: {hp: 160, atk: 40, def: 75, spa: 105, spd: 90, spe: 50}},
	zangoose: {baseStats: {hp: 85, atk: 125, def: 85, spa: 60, spd: 90, spe: 95}},
	lunatone: {baseStats: {hp: 110, atk: 35, def: 95, spa: 125, spd: 95, spe: 70}},
	solrock: {baseStats: {hp: 110, atk: 125, def: 95, spa: 35, spd: 95, spe: 70}},
	rhyperior: {baseStats: {hp: 120, atk: 150, def: 140, spa: 55, spd: 85, spe: 20}},
	seismitoad: {baseStats: {hp: 105, atk: 110, def: 85, spa: 90, spd: 86, spe: 74}},
	crustle: {baseStats: {hp: 85, atk: 115, def: 130, spa: 45, spd: 95, spe: 50}},
	druddigon: {baseStats: {hp: 90, atk: 125, def: 105, spa: 60, spd: 92, spe: 48}},
	vikavolt: {baseStats: {hp: 77, atk: 95, def: 99, spa: 145, spd: 75, spe: 79}},
	turtonator: {baseStats: {hp: 80, atk: 80, def: 130, spa: 80, spd: 100, spe: 50}},
	mrrime: {baseStats: {hp: 85, atk: 110, def: 90, spa: 110, spd: 105, spe: 70}},
	parasect: {
		baseStats: {hp: 90, atk: 120, def: 105, spa: 35, spd: 110, spe: 20},
		abilities: {0: 'Perish Body', 1: 'Poison Heal', H: 'Parasitism'},
	},
	dracozolt: {abilities: {0: 'Relic Mishap', 1: 'Hustle', H: 'Sand Rush'}},
	arctozolt: {abilities: {0: 'Relic Mishap', 1: 'Static', H: 'Slush Rush'}},
	dracovish: {abilities: {0: 'Relic Mishap', 1: 'Strong Jaw', H: 'Sand Rush'}},
	arctovish: {abilities: {0: 'Relic Mishap', 1: 'Ice Body', H: 'Slush Rush'}},
	inteleon: {
		abilities: {0: 'Dual Wield', 1: 'Sniper', H: 'Precision'},
	},
	misdreavus: {
		types: ['Ghost', 'Fairy'],
		baseStats: {hp: 80, atk: 40, def: 80, spa: 85, spd: 85, spe: 85},
		abilities: {0: 'Levitate', 1: 'Prankster', H: 'Perish Body'},
	},
	ursaring: {
		baseStats: {hp: 115, atk: 130, def: 115, spa: 40, spd: 115, spe: 35},
		abilities: {0: 'Guts', 1: 'Tough Claws', H: 'Intimidate'},
	},
	tropius: {baseStats: {hp: 115, atk: 90, def: 95, spa: 75, spd: 95, spe: 70}},
	huntail: {baseStats: {hp: 70, atk: 114, def: 115, spa: 94, spd: 85, spe: 52}},
	gorebyss: {baseStats: {hp: 70, atk: 84, def: 115, spa: 124, spd: 85, spe: 52}},
	ambipom: {
		baseStats: {hp: 80, atk: 105, def: 75, spa: 105, spd: 70, spe: 115},
		abilities: {0: 'Unburden', 1: 'Technician', H: 'Skill Link'},
	},
	weavile: {
		baseStats: {hp: 85, atk: 130, def: 80, spa: 30, spd: 90, spe: 135},
		abilities: {0: 'Violent Rush', 1: 'Pressure', H: 'Technician'},
		otherFormes: ['Weavile-Alt'],
		cosmeticFormes: ['Weavile-Alt'],
		formeOrder: ['Weavile', 'Weavile-Alt'],
	},
	dusknoir: {
		baseStats: {atk: 140, spe: 40},
		abilities: {0: 'Requiem', 1: 'Shadow Tag', H: "Reaper's Grip"},
		otherFormes: ['Dusknoir-Alt'],
		cosmeticFormes: ['Dusknoir-Alt'],
		formeOrder: ['Dusknoir', 'Dusknoir-Alt'],
	},
	spiritomb: {
		otherFormes: ['Spiritomb-Alt'],
		cosmeticFormes: ['Spiritomb-Alt'],
		formeOrder: ['Spiritomb', 'Spiritomb-Alt'],
	},
	mamoswine: {baseStats: {hp: 120, atk: 135, def: 90, spa: 70, spd: 70, spe: 85}},
	rotom: {baseStats: {hp: 60, atk: 50, def: 77, spa: 95, spd: 77, spe: 91}},
	rotomheat: {baseStats: {hp: 60, atk: 65, def: 107, spa: 105, spd: 107, spe: 86}},
	rotomwash: {baseStats: {hp: 60, atk: 65, def: 107, spa: 105, spd: 107, spe: 86}},
	rotomfrost: {baseStats: {hp: 60, atk: 65, def: 107, spa: 105, spd: 107, spe: 86}},
	rotomfan: {baseStats: {hp: 60, atk: 65, def: 107, spa: 105, spd: 107, spe: 86}},
	rotommow: {baseStats: {hp: 60, atk: 65, def: 107, spa: 105, spd: 107, spe: 86}},
	rapidash: {baseStats: {hp: 80, atk: 110, def: 70, spa: 80, spd: 80, spe: 130}},
	rapidashgalar: {baseStats: {hp: 80, atk: 110, def: 70, spa: 80, spd: 80, spe: 130}},
	kingler: {
		baseStats: {hp: 80, atk: 140, def: 125, spa: 60, spd: 60, spe: 85},
		abilities: {0: 'Swift Swim', 1: 'Hyper Cutter', H: 'Sheer Force'},
	},
	kinglergmax: {
		baseStats: {hp: 120, atk: 140, def: 125, spa: 60, spd: 60, spe: 85},
		abilities: {0: 'Riptide Claws'},
	},
	yanmega: {
		baseStats: {hp: 98, atk: 86, def: 81, spa: 126, spd: 64, spe: 95},
		abilities: {0: 'Speed Boost', 1: 'Tinted Lens', H: 'Compound Eyes'},
	},
	slurpuff: {
		types: ['Fairy', 'Fighting'],
		baseStats: {hp: 112, atk: 82, def: 99, spa: 91, spd: 96, spe: 65},
		abilities: {0: 'Unburden', 1: 'Violent Rush', H: 'Rapid Response'},
	},
	trevenant: {
		baseStats: {hp: 108, atk: 130, def: 100, spa: 30, spd: 106, spe: 76},
		abilities: {0: 'Harvest', 1: 'Tough Claws', H: 'Grassy Surge'},
	},
	gourgeist: {
		baseStats: {hp: 65, atk: 86, def: 122, spa: 118, spd: 75, spe: 84},
		abilities: {0: 'Soul Fire', 1: 'Harvest', H: 'Flare Boost'},
		isNonstandard: 'Unobtainable',
		tier: 'Illegal',
		otherFormes: [],
		formeOrder: ['Gourgeist'],
	},
	gourgeistsmall: {
		baseStats: {hp: 55, atk: 86, def: 122, spa: 113, spd: 75, spe: 99},
		abilities: {0: 'Soul Fire', 1: 'Harvest', H: 'Flare Boost'},
		isNonstandard: null,
		tier: 'RU',
	},
	gourgeistlarge: {
		baseStats: {hp: 75, atk: 86, def: 122, spa: 123, spd: 75, spe: 69},
		abilities: {0: 'Soul Fire', 1: 'Harvest', H: 'Flare Boost'},
		isNonstandard: 'Unobtainable',
		tier: 'Illegal',
	},
	gourgeistsuper: {
		baseStats: {hp: 85, atk: 86, def: 122, spa: 128, spd: 75, spe: 54},
		abilities: {0: 'Soul Fire', 1: 'Harvest', H: 'Flare Boost'},
		isNonstandard: null,
		tier: 'RU',
	},
	bewear: {
		types: ['Normal', 'Fighting'],
		baseStats: {hp: 130, atk: 135, def: 70, spa: 75, spd: 70, spe: 70},
		abilities: {0: 'Scrappy', 1: 'Fluffy', H: 'Unaware'},
	},
	palossand: {baseStats: {hp: 115, atk: 55, def: 75, spa: 135, spd: 115, spe: 55}},
	dhelmise: {
		baseStats: {hp: 100, atk: 140, def: 110, spa: 60, spd: 110, spe: 30},
		abilities: {0: 'Water Bubble', 1: 'Steelworker', H: 'Rocky Payload'},
	},
	rillaboom: {abilities: {0: 'Violent Rush', 1: 'Soundproof', H: 'Grassy Surge'}},
	cinderace: {abilities: {0: 'Defiant', 1: 'No Guard', H: 'Libero'}},
	orbeetle: {abilities: {0: 'Magic Bounce', 1: 'Psychic Surge', H: 'Telepathy'}},
	coalossal: {abilities: {0: 'Steam Engine', 1: 'Flame Body', H: 'Earth Eater'}},
	sandslash: {baseStats: {hp: 95, atk: 120, def: 130, spa: 45, spd: 75, spe: 85}},
	sandslashalola: {baseStats: {hp: 95, atk: 120, def: 130, spa: 45, spd: 75, spe: 85}},
	golurk: {abilities: {0: 'Iron Fist', 1: 'No Guard', H: 'Self Repair'}},
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
		otherFormes: ['Hypno-Pulse'],
		cosmeticFormes: ['Hypno-Pulse'],
		formeOrder: ['Hypno', 'Hypno-Pulse'],
	},
	milotic: {
		otherFormes: ['Milotic-Alt', 'Milotic-Aevian'],
		cosmeticFormes: ['Milotic-Alt', 'Milotic-Aevian'],
		formeOrder: ['Milotic', 'Milotic-Alt', 'Milotic-Aevian'],
	},
	miloticaevian: {
		baseStats: {hp: 95, atk: 89, def: 90, spa: 115, spd: 130, spe: 81},
	},
	gastrodon: {
		otherFormes: ['Gastrodon-East', 'Gastrodon-Aevian', 'Gastrodon-East-Aevian'],
		cosmeticFormes: ['Gastrodon-East', 'Gastrodon-Aevian', 'Gastrodon-East-Aevian'],
		formeOrder: ['Gastrodon', 'Gastrodon-East', 'Gastrodon-Aevian', 'Gastrodon-East-Aevian'],
	},
	gastrodonaevian: {
		baseStats: {hp: 111, atk: 83, def: 78, spa: 97, spd: 92, spe: 39},
	},
	gastrodoneastaevian: {
		baseStats: {hp: 111, atk: 83, def: 78, spa: 97, spd: 92, spe: 39},
	},
	toxtricitylowkey: {
		types: ['Fire', 'Poison'],
	},
	toxtricitylowkeygmax: {
		types: ['Fire', 'Poison'],
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
		baseStats: {hp: 82, atk: 115, def: 70, spa: 115, spd: 80, spe: 108},
		otherFormes: ['Infernape-Alt'],
		cosmeticFormes: ['Infernape-Alt'],
		formeOrder: ['Infernape', 'Infernape-Alt'],
	},
	infernapealt: {baseStats: {hp: 82, atk: 115, def: 70, spa: 115, spd: 80, spe: 108}},
	torterra: {
		baseStats: {hp: 95, atk: 119, def: 130, spa: 65, spd: 105, spe: 56},
		abilities: {0: 'Terra Resolve', 1: 'Shell Armor', H: 'Terra Gift'},
		otherFormes: ['Torterra-Alt'],
		cosmeticFormes: ['Torterra-Alt'],
		formeOrder: ['Torterra', 'Torterra-Alt'],
	},
	torterraalt: {
		baseStats: {hp: 95, atk: 119, def: 130, spa: 65, spd: 105, spe: 56},
		abilities: {0: 'Terra Resolve', 1: 'Shell Armor', H: 'Terra Gift'},
	},
	cacturne: {
		baseStats: {hp: 75, atk: 160, def: 70, spa: 105, spd: 70, spe: 90},
		abilities: {0: 'Sand Rush', 1: 'Scarecrow', H: 'Chlorophyll'},
		otherFormes: ['Cacturne-Alt'],
		cosmeticFormes: ['Cacturne-Alt'],
		formeOrder: ['Cacturne', 'Cacturne-Alt'],
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
		baseStats: {hp: 60, atk: 100, def: 105, spa: 135, spd: 105, spe: 120},
		abilities: {0: 'Astral Core'},
	},
	meowstic: {
		types: ['Psychic', 'Fairy'],
		abilities: {0: 'Symbiosis', 1: 'Infiltrator', H: 'Prankster'},
	},
	meowsticf: {
		types: ['Psychic', 'Dark'],
		abilities: {0: 'Symbiosis', 1: 'Infiltrator', H: 'Competitive'},
	},
	meowsticmmega: {
		types: ['Psychic', 'Fairy'],
	},
	meowsticfmega: {
		types: ['Psychic', 'Dark'],
	},
	quagsire: {
		baseStats: {hp: 105, atk: 95, def: 95, spa: 75, spd: 95, spe: 45},
		abilities: {0: 'Neutralization', 1: 'Water Absorb', H: 'Unaware'},
	},
	clodsire: {
		baseStats: {hp: 140, atk: 95, def: 70, spa: 75, spd: 110, spe: 20},
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
		abilities: {0: 'Strong Jaw', 1: 'Mighty Jaw', H: 'Sheer Force'},
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
	sharpedomega: {
		baseStats: {hp: 70, atk: 150, def: 70, spa: 110, spd: 65, spe: 135},
		abilities: {0: 'Razor Current'},
	},
	greninja: {
		baseStats: {hp: 72, atk: 100, def: 67, spa: 103, spd: 71, spe: 122},
	},
	greninjabond: {
		baseStats: {hp: 72, atk: 100, def: 67, spa: 103, spd: 71, spe: 122},
	},
	greninjaash: {
		baseStats: {hp: 72, atk: 150, def: 67, spa: 153, spd: 71, spe: 132},
	},
	greninjamega: {
		baseStats: {hp: 72, atk: 130, def: 77, spa: 133, spd: 81, spe: 142},
	},
	overqwil: {
		abilities: {0: 'Sea Fiend', 1: 'Swift Swim', H: 'Intimidate'},
	},
	sneasler: {
		abilities: {0: 'Unburden', 1: 'Sharpness', H: 'Hisuian Oath'},
	},
	braviary: {
		abilities: {0: 'Contrary', 1: 'Unova Vanguard', H: 'Defiant'},
	},
	braviaryhisui: {
		abilities: {0: 'Hisuian Vanguard', 1: 'Sheer Force', H: 'Tinted Lens'},
	},
	arcaninehisui: {
		abilities: {0: 'Intimidate', 1: 'Stamina', H: 'Hisuian Resolve'},
	},
	electrode: {
		abilities: {0: 'Noble Conduit', 1: 'Galvanize', H: 'Flame Body'},
	},
	electrodehisui: {
		abilities: {0: 'Noble Conduit', 1: 'Chlorophyll', H: 'Overcoat'},
	},
	lilligant: {
		abilities: {0: 'Chlorophyll', 1: 'Noble Dance', H: 'Pixilate'},
	},
	lilliganthisui: {
		abilities: {0: 'Chlorophyll', 1: 'Noble Dance', H: 'Invigorate'},
	},
	avalugg: {
		baseStats: {hp: 95, atk: 117, def: 184, spa: 44, spd: 86, spe: 28},
		abilities: {0: 'Own Tempo', 1: 'Noble Armor', H: 'Sturdy'},
	},
	avalugghisui: {
		baseStats: {hp: 95, atk: 127, def: 184, spa: 34, spd: 76, spe: 38},
		abilities: {0: 'Strong Jaw', 1: 'Noble Armor', H: 'Crumbling Shell'},
	},
	basculegion: {
		baseStats: {hp: 120, atk: 112, def: 75, spa: 80, spd: 85, spe: 78},
		abilities: {0: 'Noble Rider', 1: 'Supreme Overlord', H: 'Mold Breaker'},
	},
	basculegionf: {
		baseStats: {hp: 120, atk: 80, def: 75, spa: 112, spd: 85, spe: 78},
		abilities: {0: 'Noble Rider', 1: 'Supreme Overlord', H: 'Rapid Response'},
	},
	breloom: {
		baseStats: {hp: 80, atk: 150, def: 100, spa: 50, spd: 90, spe: 70},
		abilities: {0: 'Technician', 1: 'Poison Heal', H: 'Guts'},
	},
	azumarill: {
		baseStats: {hp: 100, atk: 70, def: 115, spa: 100, spd: 115, spe: 60},
		abilities: {0: 'Huge Power', 1: 'Sap Sipper', H: 'Mold Breaker'},
	},
	pikachucosplay: {types: ['Electric', 'Ice'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Serene Grace'}, canGigantamax: 'G-Max Volt Crash'},
	pikachurockstar: {types: ['Electric', 'Steel'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'No Guard'}, canGigantamax: 'G-Max Volt Crash'},
	pikachubelle: {types: ['Electric', 'Ice'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Serene Grace'}, canGigantamax: 'G-Max Volt Crash'},
	pikachupopstar: {types: ['Electric', 'Fairy'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Costar'}, canGigantamax: 'G-Max Volt Crash'},
	pikachuphd: {types: ['Electric', 'Psychic'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Neutralization'}, canGigantamax: 'G-Max Volt Crash'},
	pikachulibre: {types: ['Electric', 'Fighting'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Moxie'}, canGigantamax: 'G-Max Volt Crash'},
	pikachupartner: {types: ['Electric'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Mold Breaker'}, canGigantamax: 'G-Max Volt Crash'},
	pikachustarter: {types: ['Electric'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Static', H: 'Lightning Rod'}, canGigantamax: 'G-Max Volt Crash'},
	pikachugmax: {
		baseStats: {hp: 90, atk: 80, def: 50, spa: 75, spd: 60, spe: 120},
		abilities: {0: 'Static', H: 'Lightning Rod'},
	},
	murkrow: {baseStats: {hp: 60, atk: 85, def: 52, spa: 85, spd: 52, spe: 101}},
	octillery: {baseStats: {hp: 90, atk: 60, def: 100, spa: 125, spd: 105, spe: 60}},
	masquerain: {baseStats: {hp: 70, atk: 60, def: 72, spa: 100, spd: 82, spe: 90}},
	volbeat: {baseStats: {spa: 90}},
	illumise: {baseStats: {spa: 90}},
	grumpig: {
		baseStats: {hp: 120, atk: 65, def: 65, spa: 110, spd: 130, spe: 60},
		abilities: {0: 'Thick Fat', 1: 'Magic Bounce', H: 'Own Tempo'},
	},
	hippowdon: {baseStats: {hp: 118, atk: 127}, abilities: {0: 'Sand Stream', 1: 'Ruin Jaw', H: 'Accumulation'}},
	garchompbattlebond: {baseStats: {spe: 122}},
};

const CUSTOM_ABILITY_UPDATES: {[id: string]: AnyObject} = {
	selfrepair: {
		name: 'Self Repair',
		desc: "This Pokemon has Self Sufficient and Natural Cure's effects.",
		shortDesc: 'Self Sufficient + Natural Cure.',
	},
	scarecrow: {
		name: 'Scarecrow',
		desc: "This Pokemon has Wind Rider, Steelworker, and Stakeout's effects.",
		shortDesc: 'Wind Rider + Steelworker + Stakeout.',
	},
	powerofalchemy: {
		name: 'Power of Alchemy',
		desc: "This Pokemon has Self Sufficient and Regenerator. It copies a fainted ally's Ability while retaining both built-in effects until switching out.",
		shortDesc: "Self Sufficient + Regenerator; copies a fainted ally's Ability.",
	},
	rockypayload: {
		name: 'Rocky Payload',
		desc: 'Gains Rock STAB; Rock attacks get 1.5x offense, or 2x in Rocky Terrain; gains Rock resistances.',
		shortDesc: 'Rock STAB; Rock attacks 1.5x, or 2x in Rocky Terrain; gains Rock resistances.',
	},
	steamengine: {
		name: 'Steam Engine',
		desc: 'Magma Armor; Fire or Water hits raise Speed by 6; heat and water fields also activate it.',
		shortDesc: 'Magma Armor; Fire/Water hits raise Speed by 6; certain fields also activate it.',
	},
	steelworker: {
		name: 'Steelworker',
		desc: 'Gains Steel STAB; Steel attacks get 1.5x offense, or 2x in Factory; gains Steel defensive traits.',
		shortDesc: 'Steel STAB; Steel attacks 1.5x, or 2x in Factory; gains Steel traits.',
	},
	waterbubble: {
		name: 'Water Bubble',
		desc: "Gains Water STAB and 2x offense on Water attacks; halves incoming Fire offense; includes Water Veil's effects.",
		shortDesc: 'Water STAB/offense 2x; Fire offense 0.5x; Water Veil.',
	},
	download: {
		name: 'Download',
		desc: "In Singles, this Pokemon's Attack and Special Attack rise by 1 stage on switch-in. In other battle types, one offensive stat rises based on the opposing side's weaker combined defensive stat. Its first damaging move after switching in is a critical hit.",
		shortDesc: "Singles: +1 Atk/SpA; otherwise checks foes' defenses; first damaging move crits.",
	},
	watercompaction: {
		name: 'Water Compaction',
		desc: 'Halves damage from Water attacks. Taking Water damage raises Defense by 2 stages.',
		shortDesc: 'Halves Water damage; taking Water damage raises Defense by 2.',
	},
	greatmarsh: {
		name: "Great Marsh",
		desc: "This Pokemon has Dry Skin and Adaptability's effects.",
		shortDesc: "Dry Skin + Adaptability.",
	},
	blackfang: {
		name: "Black Fang",
		desc: "This Pokemon has Strong Jaw and Insomnia's effects.",
		shortDesc: "Strong Jaw + Insomnia.",
	},
	fluffycraft: {
		name: "Fluffy Craft",
		desc: "This Pokemon has Fluffy and Technician's effects.",
		shortDesc: "Fluffy + Technician.",
	},
	mightyjaw: {
		name: "Mighty Jaw",
		desc: "This Pokemon has Strong Jaw and Intimidate's effects. Until it takes its first action after switching in, its moves have 2 higher priority.",
		shortDesc: "Strong Jaw + Intimidate; first action after switch-in has +2 priority.",
	},
	seafiend: {
		name: "Sea Fiend",
		desc: "This Pokemon has Toxic Debris and Water Bubble's effects.",
		shortDesc: "Toxic Debris + Water Bubble.",
	},
	hisuianoath: {
		name: "Hisuian Oath",
		desc: "This Pokemon has Sworn Duty, Tough Claws, and Corrosion's effects.",
		shortDesc: "Sworn Duty + Tough Claws + Corrosion.",
	},
	hisuianvanguard: {
		name: "Hisuian Vanguard",
		desc: "This Pokemon has Rapid Response and Wind Power's effects.",
		shortDesc: "Rapid Response + Wind Power.",
	},
	unovavanguard: {
		name: "Unova Vanguard",
		desc: "This Pokemon has Violent Rush and Wind Rider's effects.",
		shortDesc: "Violent Rush + Wind Rider.",
	},
	hisuianresolve: {
		name: "Hisuian Resolve",
		desc: "This Pokemon has Brute Force and Magma Armor's effects.",
		shortDesc: "Brute Force + Magma Armor.",
	},
	nobleconduit: {
		name: "Noble Conduit",
		desc: "This Pokemon has Battery, Solar Power, and Aftermath's effects.",
		shortDesc: "Battery + Solar Power + Aftermath.",
	},
	nobledance: {
		name: "Noble Dance",
		desc: "This Pokemon has Dancer, Hospitality, and Own Tempo's effects.",
		shortDesc: "Dancer + Hospitality + Own Tempo.",
	},
	noblearmor: {
		name: "Noble Armor",
		desc: "This Pokemon has Prism Armor and Ice Body's effects.",
		shortDesc: "Prism Armor + Ice Body.",
	},
	noblerider: {
		name: "Noble Rider",
		desc: "This Pokemon has Swift Swim and Adaptability's effects.",
		shortDesc: "Swift Swim + Adaptability.",
	},
	gooey: {
		name: 'Gooey',
		desc: "Any opposing damaging hit lowers the attacker's Speed by 2 and highest offense by 1. Hydration + Sap Sipper.",
		shortDesc: 'Any hit: attacker -2 Spe/-1 offense; Hydration + Sap Sipper.',
	},
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
		name: "Alchemist Surge",
		desc: "This Pokemon creates Psychic Terrain on entry, gains Competitive, and has Hydra Bond's effects.",
		shortDesc: "Psychic Surge + Competitive + Hydra Bond.",
	},
	battery: {
		name: 'Battery',
		shortDesc: 'This Pokemon and its allies have their special attacks boosted by 1.3x.',
	},
	battlebond: {
		name: 'Battle Bond',
		desc: "When this Pokemon knocks out another Pokemon, it transforms into its Bond form, and knocking out a target restores 1/8 max HP. It takes 0.75x damage from attacks and 30% less damage from Fighting Clause Abilities. In Doubles, Multi, or Free-for-All, it can survive one KO from above 1/3 HP. Its attacks deal 1.3x damage to Royal Decree or Neutralization users. Cold Eclipse boosts its attacks by 1.3x and reduces attack damage to 0.6x.",
		shortDesc: '0.75x attack damage; KO transforms/heals; Cold Eclipse boosts offense and defense.',
	},
	pendulumswing: {
		name: "Pendulum Swing",
		desc: "This Pokemon's accuracy is multiplied by 1.5, and its Special Attack is multiplied by 1.5.",
		shortDesc: "1.5x accuracy and 1.5x Sp. Atk.",
	},
	perishbody: {
		name: "Perish Body",
		desc: "Any opposing damaging hit gives all foes Perish Song; repeat hits reduce their count. In Haunted Field, affected adjacent foes are trapped. Holy Field blocks this effect, and allies cannot trigger it.",
		shortDesc: "Any enemy hit gives foes Perish Song; repeat hits reduce the count; Haunted traps.",
	},
	razorcurrent: {
		name: "Razor Current",
		desc: "This Pokemon has Drizzle, Speed Boost, Steelworker, and Strong Jaw's effects.",
		shortDesc: "Drizzle + Speed Boost + Steelworker + Strong Jaw.",
	},
	relicinstinct: {
		name: "Relic Instinct",
		desc: "Above 50% HP, this Pokemon's moves ignore opposing Abilities. At 50% HP or less, it takes 0.75x damage from attacks, cannot be critically hit, restores 1/16 max HP each turn, and its Attack and Special Attack are halved. Once at 25% HP or less, it heals 25% max HP, clears negative stat stages, and lowers its Defense and Special Defense by 2.",
		shortDesc: ">50%: ignores Abilities. <=50%: defensive mode; <=25%: one pinch heal.",
	},
	fossilfrenzy: {
		name: "Fossil Frenzy",
		desc: "When this Pokemon is hit by a damaging move, its Attack and Speed rise by 1 stage and it becomes confused. While confused, it takes 1.25x damage from attacks. This Pokemon has Klutz's effect. If it hits itself in confusion, it also loses 1/8 of its maximum HP.",
		shortDesc: "Hit by attacks: +1 Atk/Spe and confusion; confused takes 1.25x; Klutz; self-hit costs 1/8.",
	},
	relicarmor: {
		name: "Relic Armor",
		desc: "On switch-in, this Pokemon lowers each foe's Defense and Special Defense by 1, or by 2 in Cold Eclipse. In Desert, Fairy Tale, Cave, Crystal Cavern, New World, or Volcanic Field, its Defense and Special Defense rise by 1. It cannot be critically hit, takes 0.8x damage from attacks, has no Rock weakness, and has Self Sufficient's effects. After an opposing Pokemon lowers one of its stats, its Defense and Special Defense rise by 1.",
		shortDesc: "Entry drops Def/SpD; no crits; 0.8x damage; no Rock weakness; Self Sufficient; reacts to drops.",
	},
	relicmishap: {
		name: "Relic Mishap",
		desc: "This Pokemon takes 0.9x damage from attacks and has Self Sufficient, Water Absorb, and Volt Absorb. It restores 1/16 max HP each turn and is immune to Sandstorm and Hail damage. During Sandstorm, its Special Defense is multiplied by 1.5. During Hail or Snow, its Defense is multiplied by 1.5.",
		shortDesc: "0.9x damage; heals 1/16; Water/Volt Absorb; weather chip immune; Sand: 1.5x SpD; Hail/Snow: 1.5x Def.",
	},
	shedskin: {
		name: "Shed Skin",
		desc: "At the end of each turn, this Pokemon has a 50% chance to cure its non-volatile status, remove common negative effects including Curse and Perish Song, reset its negative stat stages to 0, and restore 1/4 max HP. This can also activate while at or below half HP. In Dragon's Den, activation is guaranteed; it instead raises the higher offensive stat by 1, lowers Defense and Special Defense by 1, and restores 1/4 max HP.",
		shortDesc: "50% to cleanse status/effects and stat drops, then heal 1/4; altered and guaranteed in Dragon's Den.",
	},
	draconicforce: {
		name: "Draconic Force",
		desc: "This Pokemon has Dragonize and Strong Jaw's effects.",
		shortDesc: "Dragonize + Strong Jaw.",
	},
	ironmountain: {
		name: "Iron Mountain",
		desc: "This Pokemon has Filter, Stamina, and Heavy Metal's effects. Super-effective attacks deal 0.75x damage to it. Once per turn when hit by an opposing damaging move, its Defense rises by 1 stage and it restores 1/16 max HP. Its weight is doubled.",
		shortDesc: "Filter + Stamina + Heavy Metal.",
	},
	woolyconductor: {
		name: "Wooly Conductor",
		desc: "This Pokemon has Fur Coat, Mold Breaker, and Static's effects. Its Defense is doubled, its moves ignore opposing Abilities, and contact moves used against it may paralyze the attacker.",
		shortDesc: "Fur Coat + Mold Breaker + Static.",
	},
	sacrededge: {
		name: "Sacred Edge",
		desc: "This Pokemon has Sharpness, Dual Wield, and Sworn Duty's effects. Its slicing moves have 1.5x power. When Dual Wield applies to one of those slicing moves, the first hit keeps the 1.5x Sharpness boost and the second hit has 20% of the move's unboosted power. On switch-in or Mega Evolution, it heals its ally by 1/4 max HP, or 1/3 on Fairy Tale Field.",
		shortDesc: "Sharpness + Dual Wield + Sworn Duty.",
	},
	royalvoice: {
		name: "Royal Voice",
		desc: "This Pokemon has Pixilate, Queenly Majesty, and Sworn Duty's effects.",
		shortDesc: "Pixilate + Queenly Majesty + Sworn Duty.",
	},
	fallenstar: {
		name: "Fallen Star",
		desc: "This Ability cannot be suppressed. This Pokemon has Mold Breaker, Dual Wield, Skill Link, and Self Sufficient. Multi-hit Arrow moves have 1.5x power and Arrow moves have 1.5x power against trapped targets. At half HP or less, Arrow moves gain +1 priority and this Pokemon takes half damage. After an Arrow move, it takes 0.25x damage for the turn. An Arrow KO repeats the move at half power; in Free-for-All, Arrows hit all foes.",
		shortDesc: "Mold Breaker + Dual Wield + Self Sufficient; at half HP, Arrows gain +1 priority.",
	},
	ragingstorm: {
		name: "Raging Storm",
		desc: "This Ability cannot be suppressed. This Pokemon's attacks have Mold Breaker, remove the target's positive stat changes before damage, and ignore Reflect, Light Screen, Aurora Veil, and defensive stat boosts. If this Pokemon gets a KO, it damages remaining foes for 60% of the last damage in multi battles, or raises Attack by 1 if there is no valid target or no damage is dealt. Magic Guard users do not take this damage.",
		shortDesc: "Cannot be suppressed; Mold Breaker; attacks clear boosts/ignore screens; KO bonus.",
	},
	safeharbor: {
		name: "Safe Harbor",
		desc: "This Pokemon absorbs Water- and Ice-type attacks to restore 1/4 of its maximum HP. It also has Ice Body, Hydration, and Self Sufficient's effects.",
		shortDesc: "Absorbs Water/Ice moves; Ice Body + Hydration + Self Sufficient.",
	},
	voltagevolley: {
		name: "Voltage Volley",
		desc: "This Pokemon's multi-hit moves become special attacks and use its Special Attack.",
		shortDesc: "Multi-hit moves become special and use Sp. Atk.",
	},
	waterveil: {
		name: 'Water Veil',
		desc: 'This Pokemon cannot be burned and is immune to Hail and Sandstorm damage. Gaining this Ability while burned cures it. On switch-in, it gains Aqua Ring.',
		shortDesc: 'Cannot be burned; immune to Hail/Sandstorm; gains Aqua Ring.',
	},
	bulletproof: {
		name: 'Bulletproof',
		desc: 'This Pokemon is immune to bullet, pulse, and all Mega Launcher-boosted moves and takes 20% less damage from attacks.',
		shortDesc: 'Immune to bullet/pulse/Mega Launcher moves; takes 0.8x damage.',
	},
	mirrorarmor: {
		name: 'Mirror Armor',
		desc: "Reflects opposing stat drops onto their source. This Pokemon also takes 20% less damage from attacks.",
		shortDesc: 'Reflects opposing stat drops; takes 0.8x damage from attacks.',
	},
	astralcore: {
		name: "Astral Core",
		desc: "This Pokemon has Pure Power, Natural Cure, and Illuminate's effects.",
		shortDesc: "Pure Power + Natural Cure + Illuminate.",
	},
	lunarorbit: {
		name: "Lunar Orbit",
		desc: "This Pokemon has Magic Bounce and Serene Grace. On switch-in, it sets Gravity for 5 turns. This Pokemon is immune to Gravity's negative effects: it is not grounded, its Ground immunity is not removed, and it can still use moves normally restricted by Gravity.",
		shortDesc: "Magic Bounce + Serene Grace; sets Gravity and ignores Gravity's negative effects.",
	},
	spiralevolution: {
		name: "Spiral Evolution",
		desc: "This Pokemon has Adaptability, Levitate, and Dual Wield. Its damaging moves pierce protection for reduced damage, and its non-priority moves act first in Trick Room.",
		shortDesc: "Adaptability + Levitate + Dual Wield; protection pierce; acts first in Trick Room.",
	},
	accumulation: {
		name: "Accumulation",
		desc: "This Pokemon has Thick Fat and ignores sandstorm and hail. It can use Belch without a Berry and gains one Stockpile each turn. At 3 stacks it waits one full turn, then automatically chooses Belch or Spit Up every other turn. Its Spit Up and Swallow combinations still apply.",
		shortDesc: "Thick Fat; auto-Stockpiles; at 3 waits one turn, then releases every other turn.",
	},
	adaptivecell: {
		name: "Adaptive Cell",
		desc: "This Pokemon has Overcoat's effect and its Special Attack is multiplied by 1.3. Before using a physical move, it becomes Fighting type; before using a special move, it becomes Psychic type. If its Special Attack is higher than its Attack, its physical moves may use Special Attack while still targeting Defense.",
		shortDesc: "Overcoat; SpA 1.3x; physical moves become Fighting; special moves become Psychic; physical moves may use SpA.",
	},
	alloycore: {
		name: "Alloy Core",
		desc: "This Pokemon has Magic Guard and Self Sufficient's effects.",
		shortDesc: "Magic Guard + Self Sufficient.",
	},
	ancientbloom: {
		name: "Ancient Bloom",
		desc: "This Pokemon has Effect Spore and Self Sufficient's effects. It keeps its field-based Defense, Special Defense, and power boosts.",
		shortDesc: "Effect Spore + Self Sufficient; keeps field boosts.",
	},
	ange: {
		name: "Ange",
		desc: "This Pokemon has Eternal Flower, Fairy Aura, and Magic Guard's effects. Its Grass-type moves use 1.5x Attack and Special Attack, Fairy-type moves are boosted, and opposing Mega, G-Max, Terastallized, Stellar, and Ultra Beast Pokemon have their stats reduced to 0.7x. When this Pokemon faints, it creates Bewitched Woods for 5 turns.",
		shortDesc: "Eternal Flower + Fairy Aura + Magic Guard; weakens opposing gimmicks.",
	},
	apexcleave: {
		name: "Apex Cleave",
		desc: "This Pokemon has Sharpness, Dual Wield, and Moxie's effects. Slicing moves use a second Dual Wield hit at 20% of their unboosted power.",
		shortDesc: "Sharpness + Dual Wield + Moxie.",
	},
	apexpredator: {
		name: "Apex Predator",
		desc: "This Pokemon has Relic Armor, Precision, and Wind Rider's effects.",
		shortDesc: "Relic Armor + Precision + Wind Rider.",
	},
	aquashell: {
		name: "Aqua Shell",
		desc: "This Pokemon has Water Bubble and Water Veil. Its Water attacks are doubled, incoming Fire attacks are halved, it cannot be burned, it ignores Hail and Sandstorm damage, and it gains Aqua Ring on entry.",
		shortDesc: "Water Bubble + Water Veil; gains Aqua Ring on entry.",
	},
	argentdevotion: {
		name: "Argent Devotion",
		desc: "This Pokemon has Ironclad and Sworn Duty's effects.",
		shortDesc: "Ironclad + Sworn Duty.",
	},
	ascendance: {
		name: "Ascendance",
		desc: "Moves that do not match this Pokemon's type gain STAB. Its damaging moves ignore type immunities while respecting resistances, and it has Overcoat's effects.",
		shortDesc: "Off-type moves gain STAB; hits type immunities; Overcoat.",
	},
	astralwatcher: {
		name: "Astral Watcher",
		desc: "This Pokemon has Prankster, Telepathy, and Defragment. On entry, it reveals foes' items and may apply Embargo.",
		shortDesc: "Prankster + Telepathy + Defragment; reveals foes' items.",
	},
	astralwitchcraft: {
		name: "Astral Witchcraft",
		desc: "This Pokemon has Sworn Duty, Levitate, and Magic Guard's effects.",
		shortDesc: "Sworn Duty + Levitate + Magic Guard.",
	},
	aurainstinct: {
		name: "Aura Instinct",
		desc: "This Pokemon has Adaptability, Dual Wield, and Second Wind's effects.",
		shortDesc: "Adaptability + Dual Wield + Second Wind.",
	},
	auramaster: {
		name: "Aura Master",
		desc: "This Pokemon has Mega Launcher, Dual Wield, and Inner Focus's effects.",
		shortDesc: "Mega Launcher + Dual Wield + Inner Focus.",
	},
	auroracurrent: {
		name: "Aurora Current",
		desc: "This Pokemon has Snow Warning built in. On switch-in, it summons Snow. It gains STAB on Electric-type moves. During Snow, its Electric-type moves cannot miss and its Defense and Special Defense are boosted by 1.5x.",
		shortDesc: "Snow Warning; Electric STAB; in Snow, Electric never misses and Def/SpD 1.5x.",
	},
	auroraresonance: {
		name: "Aurora Resonance",
		desc: "This Pokemon has Liquid Voice, Water Absorb, and Hydration's effects.",
		shortDesc: "Liquid Voice + Water Absorb + Hydration.",
	},
	battlefervor: {
		name: "Battle Fervor",
		desc: "If this Pokemon moves before its target, its attacks deal 1.2x damage. Once per switch-in, if it would move after the attacker, damaging attacks against it deal 0.8x damage. The first time per battle it is hit by an opposing damaging move, its Attack and Special Attack rise by 1 stage. Foes cannot eat Berries while this Pokemon is active, and Seed items are prevented. Bewitched Woods, Haunted, and Holy Field disable these effects.",
		shortDesc: "Fast attacks 1.2x; slow hit 0.8x once; first hit boosts; inactive in Bewitched/Haunted/Holy.",
	},
	bewitchingmajesty: {
		name: "Bewitching Majesty",
		desc: "On switch-in, this Pokemon creates Bewitched Woods for 5 turns. This Pokemon has Magic Bounce and Queenly Majesty's effects.",
		shortDesc: "Sets Bewitched Woods for 5 turns. Magic Bounce + Queenly Majesty.",
	},
	blademastery: {
		name: "Blade Mastery",
		desc: "This Pokemon has Sharpness's effect and gains STAB on Fighting-type moves.",
		shortDesc: "Sharpness; gains Fighting STAB.",
	},
	blazingmane: {
		name: "Blazing Mane",
		desc: "Fire attacks have 1.5x power and damaging moves hit twice, with the second hit at 30% power. At half HP or less, Fire attacks gain +1 priority. Burning and Volcanic Fields raise its Speed by 1 on entry or when the field starts.",
		shortDesc: "Fire 1.5x; attacks hit twice; Fire gains priority at half HP; fire fields grant +1 Speed.",
	},
	blazingtempo: {
		name: "Blazing Tempo",
		desc: "This Pokemon has Speed Boost, Striker, and Proficient's effects.",
		shortDesc: "Speed Boost + Striker + Proficient.",
	},
	bloomingsun: {
		name: "Blooming Sun",
		desc: "This Pokemon has Mega Sol, Invigorate, and Natural Cure's effects.",
		shortDesc: "Mega Sol + Invigorate + Natural Cure.",
	},
	bonewarrior: {
		name: "Bone Warrior",
		desc: "This Pokemon has Battle Armor and Self Sufficient's effects.",
		shortDesc: "Battle Armor + Self Sufficient.",
	},
	bruteforce: {
		name: "Brute Force",
		desc: "This Pokemon has Reckless and Rock Head's effects.",
		shortDesc: "Reckless + Rock Head.",
	},
	burningcrown: {
		name: "Burning Crown",
		desc: "This Pokemon has White Smoke, Filter, and Self Sufficient. When a Pokemon faints, it raises the highest offensive stat of itself and its allies by 1. Its field bonuses remain active.",
		shortDesc: "White Smoke + Filter + Self Sufficient; faint raises the side's highest offenses.",
	},
	burningego: {
		name: "Burning Ego",
		desc: "This Pokemon has Ultra Ego and Magma Armor's effects.",
		shortDesc: "Ultra Ego + Magma Armor.",
	},
	burningspirit: {
		name: "Burning Spirit",
		desc: "This Pokemon has Self Sufficient, Opportunist, and Magma Armor's effects.",
		shortDesc: "Self Sufficient + Opportunist + Magma Armor.",
	},
	byxbysiontouch: {
		name: "Byxbysion Touch",
		desc: "This Pokemon's Poison-type damaging moves and damaging moves that can poison heal the user for 50% of the damage dealt. Ground-type moves deal 1/4 damage to this Pokemon. When an opposing Pokemon loses HP from poison or toxic poison, this Pokemon restores HP equal to the HP lost.",
		shortDesc: "Poison/poisoning attacks drain 50%; Ground damage is 1/4; drains foes' poison damage.",
	},
	calderacore: {
		name: "Caldera Core",
		desc: "This Pokemon has Magma Armor, Sheer Force, and Drought's effects. At the end of each turn, foes take Fire-type damage equal to 1/16 max HP, scaled by effectiveness and blocked by Fire immunities.",
		shortDesc: "Magma Armor + Sheer Force + Drought; Fire chip respects effectiveness and immunities.",
	},
	celestialheart: {
		name: "Celestial Heart",
		desc: "This Pokemon has Multiscale and Soul-Heart's effects.",
		shortDesc: "Multiscale + Soul Heart.",
	},
	conductivity: {
		name: "Conductivity",
		desc: "This Pokemon is immune to sound-based moves. Its Electric-type moves hit Steel-type Pokemon super effectively.",
		shortDesc: "Sound immunity; Electric moves hit Steel super effectively.",
	},
	toxicevolution: {
		name: "Toxic Evolution",
		desc: "This Pokemon has Corrosion, Dual Wield, and Shield Dust. When it poisons an opposing Pokemon, that Pokemon also becomes confused. Opposing Pokemon that hit it with a damaging move have a 50% chance to become poisoned.",
		shortDesc: "Corrosion + Dual Wield + Shield Dust; its poison confuses; attackers may be poisoned.",
	},
	corrosivescale: {
		name: "Corrosive Scale",
		desc: "This Pokemon has Marvel Scale, Invigorate, and Friend Guard's effects. When this Pokemon poisons a target, that target becomes confused.",
		shortDesc: "Marvel Scale + Invigorate + Friend Guard; poison causes confusion.",
	},
	crueltag: {
		name: "Cruel Tag",
		desc: "This Pokemon has Shadow Tag and Infiltrator's effects. When it faints, Haunted Field starts for 5 turns.",
		shortDesc: "Shadow Tag + Infiltrator; faint summons Haunted Field.",
	},
	crumblingshell: {
		name: "Crumbling Shell",
		desc: "When this Pokemon is hit by a Physical attack, Stealth Rock is set on the attacker's side of the field if that side does not already have Stealth Rock.",
		shortDesc: "When hit by a Physical attack, sets Stealth Rock on the attacker's side.",
	},
	cursedkeepsake: {
		name: "Cursed Keepsake",
		desc: "When this Pokemon is hit by an opposing damaging move, the attacker becomes cursed. Cursed Pokemon deal 0.5x damage to this Pokemon. This Pokemon restores HP equal to 1/2 of Curse damage it caused. When this Pokemon faints, opposing Pokemon become cursed and it creates Haunted Field for 5 turns, ignoring Neutralization.",
		shortDesc: "Curses attackers; cursed foes deal 0.5x; heals 1/2 Curse damage.",
	},
	cursedmarionette: {
		name: "Cursed Marionette",
		desc: "This Pokemon's status moves have +1 priority. Its attacks and status moves curse opposing targets, and being hit curses the attacker. Cursed foes deal 0.8x damage to this Pokemon. This Pokemon restores HP equal to 1/2 of Curse damage it caused. Its Curse deals 1/8 max HP. When it faints, opposing Pokemon become cursed and it creates Haunted Field for 5 turns, ignoring Neutralization.",
		shortDesc: "Prankster; attacks/status curse; cursed foes deal 0.8x; heals 1/2 Curse damage.",
	},
	defragment: {
		name: "Defragment",
		desc: "On switch-in, this Pokemon compares the opposing side's combined Attack and Special Attack. If Attack is higher or tied, its Defense rises; otherwise its Special Defense rises. This Pokemon's moves cannot miss.",
		shortDesc: "Entry defensive boost based on foes' offenses; moves cannot miss.",
	},
	divineintervention: {
		name: "Divine Intervention",
		desc: "This Pokemon has Sworn Duty, Friend Guard, and Regenerator's effects.",
		shortDesc: "Sworn Duty + Friend Guard + Regenerator.",
	},
	doomwarning: {
		name: "Doom Warning",
		desc: "This Pokemon has Magic Bounce and Magic Guard. When it faints, Doom Desire is cast on every opposing Pokemon.",
		shortDesc: "Magic Bounce + Magic Guard; faint casts Doom Desire.",
	},
	dreadmaw: {
		name: "Dread Maw",
		desc: "This Pokemon has Huge Power and Strong Jaw's effects.",
		shortDesc: "Huge Power + Strong Jaw.",
	},
	dualwield: {
		name: "Dual Wield",
		desc: "Eligible slicing, pulse, bullet, horn, drill, and Arrow moves hit twice at 65% power, with an independent accuracy check for each hit. When combined with Sharpness, Mega Launcher, or Power Drill, the first hit receives that boost and the second hit deals 20% of the move's unboosted power. In Free-for-All, both hits use full power: the first hits the selected foe and the second targets another random living foe when possible. Existing multi-hit moves are not given an additional Dual Wield pair.",
		shortDesc: "Two 65% independent rolls; boosting pairs: full +20%; FFA: two full-power targets.",
	},
	duneterror: {
		name: "Dune Terror",
		desc: "This Pokemon has Sand Stream and Shed Skin's effects. During Sandstorm, grounded foes take Ground-type residual damage based on effectiveness, blocked by Ground immunities.",
		shortDesc: "Sand Stream + Shed Skin; Ground chip respects immunities.",
	},
	duskdrive: {
		name: "Dusk Drive",
		desc: "This Pokemon has Precision, Opportunist, and Battle Fervor built in.",
		shortDesc: "Precision + Opportunist + Battle Fervor.",
	},
	echofiend: {
		name: "Echo Fiend",
		desc: "This Pokemon is immune to sound moves, and this immunity cannot be suppressed. Its sound moves become Flying type and have 1.5x power. This Pokemon's side is immune to its own damaging sound-based moves.",
		shortDesc: "Unsuppressible sound immunity; sound becomes Flying and 1.5x; allies avoid sound damage.",
	},
	eclipse: {
		name: "Eclipse",
		desc: "During weather, this Pokemon's attacks deal 1.5x damage. In clear weather, attacks deal 0.5x damage to this Pokemon. Its Psychic-type moves become Dark type if Dark would do more damage, and its Dark-type moves become Psychic type if Psychic would do more damage. It restores 1/4 max HP instead of taking damage from Psychic- or Dark-type moves.",
		shortDesc: "Weather attacks 1.5x; clear weather takes 0.5x; Psychic/Dark pick better type; absorbs both.",
	},
	eclipsevision: {
		name: "Eclipse Vision",
		desc: "This Pokemon's Special Attack is multiplied by 1.5. Before it uses any Psychic-type or Dark-type move, it becomes that type and remains that type. If this Pokemon is Psychic type, it restores 1/8 of its max HP at the end of each turn. If this Pokemon is Dark type, its damaging moves restore HP equal to 1/4 of the damage dealt.",
		shortDesc: "SpA 1.5x; any Psychic/Dark move changes type; Psychic heals 1/8; Dark drains.",
	},
	elevate: {
		name: "Elevate",
		desc: "This Pokemon is immune to Ground-type attacks and Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability. This Pokemon's highest stat is raised by 1 stage if it attacks and knocks out another Pokemon. Stat stage changes are not considered.",
		shortDesc: "Ground immunity plus Beast Boost-style boost after KO.",
	},
	emperorsresolve: {
		name: "Emperor's Resolve",
		desc: "This Pokemon has Competitive and Slush Rush, and gains STAB on Ice-type moves.",
		shortDesc: "Competitive + Slush Rush + Ice STAB.",
	},
	enlightenment: {
		name: "Enlightenment",
		desc: "This Pokemon has Pure Power, Inner Focus, and Technician's effects.",
		shortDesc: "Pure Power + Inner Focus + Technician.",
	},
	evilsanta: {
		name: "Evil Santa",
		desc: "This Pokemon's Present becomes a 120 Base Power Dark-type move that hits all opposing Pokemon. Delibird gets STAB on Dark-type moves. Present always applies one random extra effect that succeeds: damage equal to 1/8 of the target's max HP, bad poison, 3-turn confusion, or Curse.",
		shortDesc: "Present becomes 120 BP Dark spread and applies a random successful extra effect.",
	},
	execution: {
		name: "Execution",
		desc: "This Pokemon has Duskilate. Its attacks deal double damage to targets at half HP or less, move KOs heal 1/8 max HP per target, Attack and Special Attack cannot fall below -1, and fields cannot lower its Speed.",
		shortDesc: "Duskilate; 2x vs targets at half HP or less; move KOs heal 1/8.",
	},
	falsedevotion: {
		name: "False Devotion",
		desc: "This Pokemon has Serene Grace, Natural Cure, and Prankster's effects.",
		shortDesc: "Built-in Serene Grace, Natural Cure, and Prankster.",
	},
	firemane: {
		name: "Fire Mane",
		desc: "This Pokemon's Fire-type attacks have 1.5x power.",
		shortDesc: "This Pokemon's Fire-type attacks have 1.5x power.",
	},
	forestsurge: {
		name: "Forest Surge",
		desc: "On switch-in, this Pokemon sets Forest Terrain for 5 turns.",
		shortDesc: "On switch-in, this Pokemon sets Forest Terrain for 5 turns.",
	},
	fortressshell: {
		name: "Fortress Shell",
		desc: "This Pokemon has Self Sufficient, Shell Armor, Friend Guard, and Dual Wield's effects. In Water Surface, Underwater, Factory, and Short Circuit fields, Electric moves are redirected to it and raise its Attack and Special Attack. Fairy Tale, New World, Cold Eclipse, and Starlight Arena give it +1 Defense and +1 Special Defense once per active terrain.",
		shortDesc: "Self Sufficient + Shell Armor + Friend Guard + Dual Wield; keeps field bonuses.",
	},
	freezerburn: {
		name: "Freezer Burn",
		desc: "This Pokemon has Slush Rush and Refrigerate. Refrigerate-converted moves have 1.2x power, and charge moves skip their charge turn.",
		shortDesc: "Slush Rush + Refrigerate; 1.2x conversion; skips charges.",
	},
	frostsovereign: {
		name: "Frost Sovereign",
		desc: "On entry, this Pokemon sets Snow through Snow Warning for 8 turns. It has Ice Body and Filter. Manually used Aurora Veil lasts 8 turns. Each turn, foes take immunity-aware Ice damage equal to 1/16 max HP, scaled by effectiveness.",
		shortDesc: "8-turn Snow Warning; Ice Body + Filter; manual Veil lasts 8 turns; Ice chip.",
	},
	frozenfortress: {
		name: "Frozen Fortress",
		desc: "This Pokemon has Shell Armor, Ice Body, and Crumbling Shell's effects.",
		shortDesc: "Shell Armor + Ice Body + Crumbling Shell.",
	},
	furnaceengine: {
		name: "Furnace Engine",
		desc: "This Pokemon has Steam Engine, Flame Body, and Self Sufficient's effects. At the end of each turn, opposing Pokemon take Fire-type damage equal to 1/16 max HP, scaled by effectiveness and blocked by Fire immunities.",
		shortDesc: "Steam Engine + Flame Body + Self Sufficient; Fire chip.",
	},
	grandmaster: {
		name: "Grandmaster",
		desc: "This Pokemon cannot flinch. Miracle Eye makes it resist Dark moves. After a status move, it takes 20% less attack damage for the turn. Psychic moves ignore resistances when it moves first. Being attacked, using Future Sight, or fainting queues Future Sight on foes.",
		shortDesc: "No flinch; status grants 20% damage reduction; queues Future Sight.",
	},
	heatcoil: {
		name: "Heat Coil",
		desc: "This Pokemon has Speed Boost and Magma Armor's effects.",
		shortDesc: "Speed Boost + Magma Armor.",
	},
	heavenlychorus: {
		name: "Heavenly Chorus",
		desc: "This Pokemon has Pixilate, Cloud Nine, and Fluffy's effects.",
		shortDesc: "Pixilate + Cloud Nine + Fluffy.",
	},
	hellfireeclipse: {
		name: "Hellfire Eclipse",
		desc: "During harsh sunlight, this Pokemon's Attack and Special Attack are multiplied by 1.5. After this Pokemon uses a Fire-type move, it sets Sunny Day for 2 turns.",
		shortDesc: "In Sun: Atk/SpA 1.5x; Fire moves set 2-turn Sun.",
	},
	highnoon: {
		name: "High Noon",
		desc: "This Pokemon's Water-type moves have 1.2x power. Its attacks cannot miss unless the target is in the semi-invulnerable turn of a move. Moves that would be boosted by Sharpness or Mega Launcher, plus arrow moves, trigger Dual Wield. Its moves have +1 critical hit ratio against targets that have not moved yet this turn.",
		shortDesc: "Water moves 1.2x; attacks cannot miss; Dual Wield; +1 crit vs unmoved targets.",
	},
	hydrabond: {
		name: "Hydra Bond",
		desc: "This Pokemon's damaging moves become multi-hit moves that hit three times. The second and third hits deal 30% damage and retarget the foe's ally if the first target fainted. In Free-for-All battles, single-target moves hit all foes once at 1.3x power; spread moves hit all foes three times, with later hits at 30% power, and full-power spread moves stay full power.",
		shortDesc: "Damaging moves hit 3 times; hits 2/3 have 30% power. FFA: single-target hits all foes at 1.3x.",
	},
	hydrabreaker: {
		name: "Hydra Breaker",
		desc: "This Pokemon has Hydra Bond and Mold Breaker's effects.",
		shortDesc: "Hydra Bond + Mold Breaker.",
	},
	hydratyrant: {
		name: "Hydra Tyrant",
		desc: "This Pokemon has Hydra Bond, Berserk, and Self Sufficient's effects.",
		shortDesc: "Hydra Bond + Berserk + Self Sufficient.",
	},
	hyperdrill: {
		name: "Hyper Drill",
		desc: "This Pokemon has Power Drill and Dual Wield's effects. Drill moves are used twice; the first hit receives Power Drill and the second hit deals 20% of the move's unboosted power. Its Rock-type moves receive a same-type attack bonus.",
		shortDesc: "Power Drill + Dual Wield; Rock moves get STAB.",
	},
	inversion: {
		name: "Inversion",
		desc: "On switch-in, this Pokemon sets Inverse Field. Stat changes this Pokemon receives are inverted, except those from Z-Power effects.",
		shortDesc: "Sets Inverse Field and inverts its stat changes.",
	},
	invigorate: {
		name: "Invigorate",
		desc: "Healing received by this Pokemon and its allies is multiplied by 1.2. At the end of each turn, this Pokemon has a 50% chance to cure each adjacent ally's status condition.",
		shortDesc: "User/allies receive 1.2x healing; 50% to cure ally status each turn.",
	},
	ironclad: {
		name: "Ironclad",
		desc: "This Pokemon's Normal-type moves become Steel-type moves and have their power multiplied by 1.2.",
		shortDesc: "Normal moves become Steel type and have 1.2x power.",
	},
	ironcognition: {
		name: "Iron Cognition",
		desc: "This Pokemon has Tough Claws and Prism Armor's effects.",
		shortDesc: "Tough Claws + Prism Armor.",
	},
	irondominion: {
		name: "Iron Dominion",
		desc: "On switch-in or G-Max activation, this Pokemon activates Pressure and Mirror Armor's effects and heals its ally like Sworn Duty.",
		shortDesc: "Pressure + Mirror Armor + Sworn Duty.",
	},
	ironwill: {
		name: "Iron Will",
		desc: "This Pokemon has Prism Armor, Second Wind, and Self Sufficient's effects.",
		shortDesc: "Prism Armor + Second Wind + Self Sufficient.",
	},
	joyride: {
		name: "Joyride",
		desc: "This Pokemon has Aerilate and Hyper Cutter's effects.",
		shortDesc: "Aerilate + Hyper Cutter.",
	},
	lunaridol: {
		name: "Lunar Idol",
		desc: "This Pokemon has Levitate's Ground immunity and is immune to hail damage. Its Ice-type moves have 1.5x power, and its Special Attack is 1.5x during hail or snow.",
		shortDesc: "Levitate; immune to hail; Ice power 1.5x; Sp. Atk 1.5x in hail/snow.",
	},
	memoryleak: {
		name: "Memory Leak",
		desc: "Positive stat boosts this Pokemon would receive are passed to an adjacent ally instead.",
		shortDesc: "Passes positive stat boosts to an adjacent ally.",
	},
	mindfreeze: {
		name: "Mind Freeze",
		desc: "This Pokemon is immune to Ice-type attacks and restores 1/4 of its maximum HP when hit by one. It has Ice Body's healing and hail immunity. Its Psychic-type moves have a 40% chance to cause frostbite, and Freezing Glare's frostbite chance is doubled. Its Physical Ice-type moves become Special.",
		shortDesc: "Absorbs Ice for 25%; Ice Body effects; Psychic moves frostbite; Physical Ice becomes Special.",
	},
	mirrorgreed: {
		name: "Mirror Greed",
		desc: "This Pokemon has Magic Bounce and Analytic's effects.",
		shortDesc: "Magic Bounce + Analytic.",
	},
	moonlitwings: {
		name: "Moonlit Wings",
		desc: "This Pokemon has Serene Grace and gains STAB on Fairy-type moves.",
		shortDesc: "Serene Grace + Fairy STAB.",
	},
	mountainhunger: {
		name: "Mountain Hunger",
		desc: "This Pokemon has Thick Fat, Gluttony, and Sap Sipper's effects. It is immune to hail damage and takes reduced damage from Fire- and Ice-type attacks.",
		shortDesc: "Thick Fat + Gluttony + Sap Sipper.",
	},
	mourningsnow: {
		name: "Mourning Snow",
		desc: "On switch-in, this Pokemon summons Hail for 8 turns, and Aurora Veil used by this Pokemon lasts 8 turns. During Hail, this Pokemon has Ice Body's effect and opposing non-Ice Pokemon have a 30% chance to become frostbitten at the end of the turn. When another Pokemon faints, this Pokemon restores 1/8 max HP, or 1/4 if the faint was caused by an Ice move, Hail, Snow, or Curse. When this Pokemon faints, all opposing Pokemon become cursed. This Pokemon has a 100% Cursed Body effect.",
		shortDesc: "Sets 8-turn Hail/Veil; heals when others faint; frostbite; Cursed Body.",
	},
	mourningvessel: {
		name: "Mourning Vessel",
		desc: "This Pokemon has Prankster's effect. Its damaging moves deal 20% more damage for each fainted ally, up to 2x damage. At the end of each turn, it restores 5% of its max HP for each fainted opposing Pokemon, counting every opposing side in Free-For-All battles.",
		shortDesc: "Prankster; +20% damage per fainted ally (max 2x); heals 5% per fainted foe each turn.",
	},
	neutralization: {
		name: "Neutralization",
		desc: "Once per target per move, when this Pokemon directly hits an opposing Pokemon, the target's higher attacking stat is lowered by 2 stages and Speed is lowered by 1 stage. Spread hits do not trigger this effect. This does not affect other Neutralization users or Pokemon immune to stat drops. While active, field changes are neutralized; Trick Room, Magic Room, and Wonder Room are ended and cannot start; and Rainbow Field ends automatically. Ice Spinner and Steel Roller still remove terrain normally.",
		shortDesc: "Hits lower foe offense/Spe; blocks field changes and Trick/Magic/Wonder Room.",
	},
	noseformation: {
		name: "Nose Formation",
		desc: "This Pokemon has Filter and Elevate. After it hits, three 20 BP special Mini-Noses each select the strongest of Steel, Electric, or Rock against their current target. They chain to another valid foe after a KO, and their KOs trigger Elevate.",
		shortDesc: "Filter + Elevate; three adaptive 20 BP Mini-Noses chain after KOs and trigger Elevate.",
	},
	omenedge: {
		name: "Omen Edge",
		desc: "This Pokemon has Sharpness and Dual Wield. When it faints, it casts a physical Doom Desire on each opposing Pokemon.",
		shortDesc: "Sharpness + Dual Wield; on faint: Doom Desire on foes.",
	},
	orchardbond: {
		name: "Orchard Bond",
		desc: "This Pokemon has Hydra Bond and Harvest's effects.",
		shortDesc: "Hydra Bond + Harvest.",
	},
	paradoxengine: {
		name: "Paradox Engine",
		desc: "If Sun or Electric Terrain is active, this Pokemon's Speed is doubled. This Pokemon's Fighting-type and Electric-type moves have 1.5x power.",
		shortDesc: "Sun/Electric Terrain: Speed 2x. Fighting/Electric moves have 1.5x power.",
	},
	paradoxpower: {
		name: "Paradox Power",
		desc: "This Pokemon has Sheer Force's effect and gains STAB on Electric-type moves.",
		shortDesc: "Sheer Force; gains Electric STAB.",
	},
	paradoxpull: {
		name: "Paradox Pull",
		desc: "This Pokemon has Magnet Pull's effect. Its Steel typing only contributes resistances and immunities, not weaknesses.",
		shortDesc: "Magnet Pull; ignores Steel weaknesses.",
	},
	paradoxwheel: {
		name: "Paradox Wheel",
		desc: "This Pokemon gains STAB on Steel- and Electric-type moves.",
		shortDesc: "Gains Steel/Electric STAB.",
	},
	parasitism: {
		name: "Parasitism",
		desc: "This Pokemon has Dry Skin. While above 50% HP, its weaknesses are neutralized, Magic Guard is active, opposing status moves fail, and opposing attack secondary effects are blocked. The first time Parasect would faint, it fake-faints at 1 HP, then becomes Parasect-Parasite at the end of the turn and revives at full HP. This Ability cannot be suppressed and is immune to Neutralization.",
		shortDesc: "Dry Skin; above half: defensive protection; first KO triggers Resuscitation.",
	},
	resuscitation: {
		name: "Resuscitation",
		desc: "When Parasect revives as Parasect-Parasite, its status, stat stages, and volatile effects are cleared and it returns to full HP. Afterward, this Ability has Self Repair and Magic Guard's effects.",
		shortDesc: "Revival fully resets battle effects; Self Repair + Magic Guard.",
	},
	patternshift: {
		name: "Pattern Shift",
		desc: "This Pokemon has Shed Skin, Protean, and Merciless's effects.",
		shortDesc: "Shed Skin + Protean + Merciless.",
	},
	perfectego: {
		name: "Perfect Ego",
		desc: "This Pokemon has Ultra Ego's effects, and its moves cannot miss.",
		shortDesc: "Ultra Ego; moves cannot miss.",
	},
	perfectforesight: {
		name: "Perfect Foresight",
		desc: "On switch-in, this Pokemon identifies and gains the Ability of the opposing Pokemon with the highest offensive stat. Future Sight queued by this Ability has 60 BP, ignores defensive boosts, screens, and Abilities, and hits Dark-type Pokemon neutrally. If this Pokemon uses a move on opposing Pokemon, is damaged by an opposing attack, or uses Future Sight, Future Sight is queued on the affected opposing slots. Spread moves queue Future Sight on all enemies, and existing Perfect Foresight delayed attacks stack instead of blocking new ones.",
		shortDesc: "Gains strongest foe's Ability; repeatedly queues 60 BP Future Sight.",
	},
	phantomfist: {
		name: "Phantom Fist",
		desc: "This Pokemon's moves cannot miss and it has Filter, Self Repair, and Unseen Fist's effects.",
		shortDesc: "Moves cannot miss + Filter + Self Repair + Unseen Fist.",
	},
	pollenbloom: {
		name: "Pollen Bloom",
		desc: "This Pokemon has Thick Fat, Proficient, and Invigorate's effects. At the end of each turn, opposing non-Grass Pokemon take Grass-type damage equal to 1/16 max HP, scaled by effectiveness and blocked by Grass immunities; this Pokemon heals the damage dealt.",
		shortDesc: "Thick Fat + Proficient + Invigorate; Grass scaling chip respects immunities and heals the user.",
	},
	powerdrill: {
		name: "Power Drill",
		desc: "This Pokemon's drill moves have 1.5x power.",
		shortDesc: "Drill moves have 1.5x power.",
	},
	piercingdrill: {
		name: "Piercing Drill",
		desc: "This Pokemon has Mold Breaker's effect. Its contact moves ignore a target's protection and deal 1/4 the usual damage. It also has Power Drill's effect, boosting drill moves by 1.5x, or 2x in Rocky, Mountain, Snowy Mountain, Cave, and Volcanic fields.",
		shortDesc: "Mold Breaker; contact pierces protection for 1/4 damage; drill moves 1.5x, or 2x in listed fields.",
	},
	precision: {
		name: "Precision",
		desc: "Super-effective moves used by this Pokemon cannot miss and have an increased critical-hit ratio.",
		shortDesc: "Super-effective moves never miss; boosted critical-hit ratio.",
	},
	predator: {
		name: "Predator",
		desc: "Stat changes this Pokemon receives are inverted, except those from Z-Power effects. If the target has not moved yet or just switched in, this Pokemon's attacks deal 1.3x damage. Attacks deal 2x damage to targets with Neutralization or Royal Decree.",
		shortDesc: "Has Contrary; boosts attacks into slower/new targets; 2x into authority abilities.",
	},
	primaltactics: {
		name: "Primal Tactics",
		desc: "This Pokemon's Special Attack is multiplied by 1.5, but it can only select the first move it executes. These effects are prevented while this Pokemon is Dynamaxed.",
		shortDesc: "This Pokemon's Sp. Atk is 1.5x, but it can only select the first move it executes.",
	},
	prismscale: {
		name: "Prism Scale",
		desc: "This Pokemon has Marvel Scale, Dragonize, and Self Sufficient's effects.",
		shortDesc: "Marvel Scale + Dragonize + Self Sufficient.",
	},
	queensguard: {
		name: "Queen's Guard",
		desc: "This Pokemon has Contrary, Shed Skin, and Intimidate's effects.",
		shortDesc: "Contrary + Shed Skin + Intimidate.",
	},
	ragingcurrent: {
		name: "Raging Current",
		desc: "This Pokemon has Swift Swim, Regenerator, and Stamina's effects.",
		shortDesc: "Swift Swim + Regenerator + Stamina.",
	},
	railguncircuit: {
		name: "Railgun Circuit",
		desc: "This Pokemon has Transistor's effects. Moves used by this Pokemon never miss. Moves used against this Pokemon do not gain this accuracy effect.",
		shortDesc: "Transistor effects; this Pokemon's moves never miss.",
	},
	rainsovereign: {
		name: "Rain Sovereign",
		desc: "On entry, this Pokemon sets Rain for 8 turns. Its Electric-, Water-, and Flying-type moves receive STAB. Each turn, foes take immunity-aware Water damage equal to 1/16 max HP, scaled by effectiveness.",
		shortDesc: "8-turn Rain; Electric/Water/Flying STAB; immunity-aware Water chip.",
	},
	rapidresponse: {
		name: "Rapid Response",
		desc: "On this Pokemon's first active turn, its Speed is 1.5x and its Sp. Atk is 1.2x.",
		shortDesc: "First active turn: 1.5x Spe and 1.2x Sp. Atk.",
	},
	relentlesshunt: {
		name: "Relentless Hunt",
		desc: "This Pokemon's moves with 60 or less Base Power gain +1 priority. In Fairy Tale, Big Top, Dragon's Den, Mountain, Snowy Mountain, or Cold Eclipse, its damaging moves deal 2x damage. In Desert, Rocky, Forest, Burning, Superheated, Ashen Beach, Water Surface, Cave, Starlight Arena, or New World, its damaging moves deal 1.5x damage.",
		shortDesc: "Moves <=60 BP gain +1 priority; boosted fields give 1.5x or 2x damage.",
	},
	relentlesslink: {
		name: "Relentless Link",
		desc: "This Pokemon has Skill Link, Battle Armor, and Mold Breaker's effects.",
		shortDesc: "Skill Link + Battle Armor + Mold Breaker.",
	},
	relicbeam: {
		name: "Relic Beam",
		desc: "This Pokemon's Sp. Atk becomes equal to its Defense, and Special Attack stat stages use Defense stages instead. Beam moves and moves boosted by Mega Launcher have 1.5x power.",
		shortDesc: "SpA equals Defense using Def stages; beam/Mega Launcher moves have 1.5x power.",
	},
	requiem: {
		name: "Requiem",
		desc: "This Pokemon has Cursed Body's effect. Its first direct damaging interaction with each opposing Pokemon applies Perish Song to that foe. The mark clears when the foe switches out. Whenever an opposing Pokemon faints, this Pokemon restores 1/4 max HP. When this Pokemon faints, it creates Haunted Field for 5 turns. This Ability cannot be suppressed.",
		shortDesc: "Cursed Body; first interaction marks foe with Perish Song; foe KO heals 1/4; faint sets Haunted.",
	},
	reapersgrip: {
		name: "Reaper's Grip",
		desc: "This Pokemon has Iron Fist and Pressure's effects. Punch-based attacks have 1.4x power. Its foes lose 1 extra PP when targeting it. On entry, it lowers opposing Defense and Special Defense by 1 stage, or 2 stages in Cold Eclipse.",
		shortDesc: "Iron Fist + Pressure; entry lowers opposing Def/SpD, doubled in Cold Eclipse.",
	},
	resonanceforce: {
		name: "Resonance Force",
		desc: "Sound-based moves used by this Pokemon's side deal 1.5x damage. This Pokemon's side is immune to its own damaging sound-based moves. Sound-based moves used by this Pokemon use Attack instead of their usual attacking stat.",
		shortDesc: "Side's sound moves 1.5x; allies avoid own damaging sound moves; user's sound moves use Atk.",
	},
	rimeknuckle: {
		name: "Rime Knuckle",
		desc: "This Pokemon has Filter and Iron Fist. Its moves have a 40% chance to cause frostbite. If this Pokemon knocks out a target, it restores 1/8 of its maximum HP, or 1/4 if the target was Mega, G-Max, Terastallized, Stellar, or holding a Z-Move item.",
		shortDesc: "Filter + Iron Fist; 40% frostbite; KO heals 1/8 or 1/4 vs gimmicks.",
	},
	riotamp: {
		name: "Riot Amp",
		desc: "This Pokemon has Punk Rock, Galvanize, and Resonance Force's effects.",
		shortDesc: "Punk Rock + Galvanize + Resonance Force.",
	},
	riptideclaws: {
		name: "Riptide Claws",
		desc: "This Pokemon has Swift Swim, Tough Claws, and Shell Armor's effects.",
		shortDesc: "Swift Swim + Tough Claws + Shell Armor.",
	},
	stancechange: {
		name: 'Stance Change',
		desc: "This Pokemon has Dual Wield. Aegislash changes to Blade Forme before attacking and Shield Forme before King's Shield. Shield Forme takes 20% less damage; consecutive Free-for-All hits deal 30% less damage. Blade Forme deals 1.2x damage.",
		shortDesc: 'Dual Wield; Shield: 20% less damage; Blade: 1.2x damage.',
	},
	zerotohero: {
		name: 'Zero to Hero',
		desc: 'This Pokemon gains Fighting-type STAB. Palafin changes to Hero Form after switching out or entering in Water fields. In Doubles, Multi, or Free-for-All, it survives one KO at 1 HP. Hero Form grants Friend Guard and heals active allies on entry.',
		shortDesc: 'Becomes Hero; Fighting STAB; Hero: Friend Guard + entry healing.',
	},
	royalarmament: {
		name: "Royal Armament",
		desc: "This Pokemon gains STAB on Steel-type moves and has Power Drill's effects.",
		shortDesc: "Steel STAB + Power Drill.",
	},
	abysssniper: {
		name: "Abyss Sniper",
		desc: "This Pokemon has Sniper and Stalwart's effects. Its critical hits deal increased damage, and its moves cannot be redirected.",
		shortDesc: "Sniper + Stalwart.",
	},
	royaldecree: {
		name: "Royal Decree",
		desc: "On switch-in, all active Pokemon's stat stages are reset to 0, except Pokemon on a side protected by Safeguard, and Reflect, Light Screen, and Aurora Veil are removed from both sides. While this Pokemon is active, Reflect, Light Screen, and Aurora Veil cannot be created, enemy stat boosts fail, and enemy-caused stat drops fail. This Pokemon's own self-inflicted stat drops still work. This Pokemon's charge moves fire immediately without charge turns, but recharge moves still require recharge. Neutralization disables these Royal Decree effects while active.",
		shortDesc: "Haze/screen clear; Safeguard blocks reset; blocks setup/screens; skips charge turns.",
	},
	royalhive: {
		name: "Royal Hive",
		desc: "On switch-in, this Pokemon starts in Attack Stance and raises its Attack and Special Attack by 1 stage. After it uses a status move, it changes to Defense Stance, lowering its Attack and Special Attack by 1 stage and raising its Defense and Special Defense by 1 stage. After it uses a damaging move while in Defense Stance, it changes back to Attack Stance, lowering its Defense and Special Defense by 1 stage and raising its Attack and Special Attack by 1 stage. While in Defense Stance, it restores 1/16 of its maximum HP at the end of each turn.",
		shortDesc: "Starts +1 Atk/SpA; status moves swap to +1 Def/SpD and heal 1/16; attacks swap back.",
	},
	royalsun: {
		name: "Royal Sun",
		desc: "On switch-in, this Pokemon summons Sunny Day for 5 turns and activates Royal Decree's effects. Safeguard protects a side from Royal Decree's switch-in stat reset. Neutralization disables the Royal Decree effects while active.",
		shortDesc: "Drought + Royal Decree; Safeguard blocks the reset; disabled by Neutralization.",
	},
	sandsovereign: {
		name: "Sand Sovereign",
		desc: "On entry, this Pokemon sets Sandstorm for 8 turns. It has Filter and Battle Armor. Manually used Arenite Wall lasts 8 turns. Each turn, foes take immunity-aware Rock damage equal to 1/16 max HP, scaled by effectiveness.",
		shortDesc: "8-turn Sand; Filter + Battle Armor; manual Arenite Wall lasts 8 turns; Rock chip.",
	},
	seablessing: {
		name: "Sea Blessing",
		desc: "This Pokemon's Defense and Special Defense are 1.5x. On entry, it and adjacent allies heal 1/4 max HP, and it gains Aqua Ring. It has Water Veil and Rain Dish.",
		shortDesc: "1.5x Def/SpD; entry heals self/allies 1/4; Water Veil + Rain Dish.",
	},
	seasonalstride: {
		name: "Seasonal Stride",
		desc: "Normal moves become this Pokemon's primary type and have 1.2x power. Kicking moves have 1.4x power. It has Chlorophyll and changes forme with weather: Spring in rain, Summer in sun, Autumn in sand, Winter in snow.",
		shortDesc: "Normal moves become primary type at 1.2x; kicks 1.4x; Chlorophyll; weather changes forme.",
	},
	secondwind: {
		name: "Second Wind",
		desc: "Endures the first attack that would knock it out at 1 HP.",
		shortDesc: "Endures the first KO at 1 HP.",
	},
	selfsufficient: {
		name: "Self Sufficient",
		desc: "Restores 1/16 of this Pokemon's maximum HP at the end of each turn and is immune to Sandstorm and Hail damage.",
		shortDesc: "Heals 1/16 each turn; immune to Sandstorm and Hail.",
	},
	hisuianpath: {
		name: "Hisuian Path",
		desc: "This Pokemon has Sap Sipper, Inner Focus, and Fluffy's effects.",
		shortDesc: "Sap Sipper + Inner Focus + Fluffy.",
	},
	shadowcurrent: {
		name: "Shadow Current",
		desc: "This Pokemon has Protean, Technician, and Sworn Duty. Before using a move, it becomes that move's type.",
		shortDesc: "Protean + Technician + Sworn Duty.",
	},
	guidingomen: {
		name: "Guiding Omen",
		desc: "This Pokemon has Friend Guard and Serene Grace's effects.",
		shortDesc: "Friend Guard + Serene Grace.",
	},
	phalanxform: {
		name: "Phalanx Form",
		desc: "This Pokemon has Hydra Bond, Friend Guard, and Battle Armor's effects, gains STAB on Steel moves, and cannot be trapped.",
		shortDesc: "Hydra Bond + Friend Guard + Battle Armor; Steel STAB; untrappable.",
	},
	windchime: {
		name: "Wind Chime",
		desc: "This Pokemon has Ironclad, Wind Power, and Levitate's effects.",
		shortDesc: "Ironclad + Wind Power + Levitate.",
	},
	shadowguard: {
		name: "Shadow Guard",
		desc: "This Pokemon has Shadow Shield and Elevate's effects. It also queues a full-power Temporal Shift Future Sight every turn, using whichever of Ghost, Dark, or Fairy would hit the target best.",
		shortDesc: "Shadow Shield + Elevate; every turn queues full-power Ghost/Dark/Fairy Temporal Shift.",
	},
	shelltrap: {
		name: "Shell Trap",
		desc: "This Pokemon has Regenerator and Shell Armor's effects.",
		shortDesc: "Regenerator + Shell Armor.",
	},
	siegelauncher: {
		name: "Siege Launcher",
		desc: "This Pokemon has Water Barrage, Mega Launcher, Self Sufficient, and Stalwart's effects. Moves boosted by Mega Launcher are used twice through Dual Wield; the second hit deals 20% of the move's unboosted power.",
		shortDesc: "Water Barrage + Mega Launcher + Self Sufficient + Stalwart; boosted moves get a 20% second hit.",
	},
	sinisterblaze: {
		name: "Sinister Blaze",
		desc: "This Pokemon is always burned and its burn can overwrite other status conditions. Burn heals this Pokemon instead of damaging it. While this Pokemon is burned, opposing Pokemon lose doubled burn damage each turn, and this Pokemon heals the damage dealt to each foe this way. This Ability cannot be Skill Swapped, suppressed, copied by Role Play, given by Entrainment, or Traced.",
		shortDesc: "Always burned; burn heals user; foes lose burn damage and heal it; cannot be copied/suppressed.",
	},
	soaringspirit: {
		name: "Soaring Spirit",
		desc: "This Pokemon has Wind Power and Self Sufficient's effects.",
		shortDesc: "Wind Power + Self Sufficient.",
	},
	solarbloom: {
		name: "Solar Bloom",
		desc: "If sun is active, this Pokemon transforms into Cherrim-Sunshine and restores 1/8 of its maximum HP. While sun is active, its Speed is doubled.",
		shortDesc: "In sun: becomes Sunshine, heals 1/8, and has doubled Speed.",
	},
	solaridol: {
		name: "Solar Idol",
		desc: "This Pokemon has Levitate's Ground immunity. Its Fire-type moves have 1.5x power, its Attack is 1.5x during sun, and Grass-type attacks are resisted.",
		shortDesc: "Levitate; Fire power 1.5x; Attack 1.5x in sun; resists Grass.",
	},
	solartrap: {
		name: "Solar Trap",
		desc: "This Pokemon has Accumulation, Innards Out, and Solar Power. In Sun, Solar Power boosts Special Attack by 1.5x and costs 1/8 max HP each turn.",
		shortDesc: "Accumulation + Innards Out + Solar Power.",
	},
	soulstrike: {
		name: "Soul Strike",
		desc: "This Pokemon's moves ignore accuracy checks. It is immune to Ghost-type moves and restores 1/4 max HP when hit by one. Soul Fire cannot redirect or bypass this immunity. When this Pokemon faints, it creates Haunted Field for 5 turns, ignoring Neutralization. This Ability cannot be ignored or suppressed by Mold Breaker-style effects.",
		shortDesc: "Moves never miss; Ghost absorb; faint sets Haunted Field.",
	},
	soulfire: {
		name: "Soul Fire",
		desc: "This Pokemon draws in Fire- and Ghost-type moves to itself and is immune to Fire-type moves, Ghost-type moves, Will-O-Wisp, and damaging weather conditions, raising Attack and Special Attack by 1 stage when hit by them. Its Fire- and Ghost-type moves bypass type immunities, cannot hit Normal-type Pokemon with Ghost-type attacks, and are resisted by Steel- and Dark-type Pokemon. Burns caused by this Pokemon's Fire- and Ghost-type moves or Will-O-Wisp bypass burn immunities, Misty Terrain, and Mist. Fire- and Ghost-type moves from this Ability deal 4x damage to opposing Soul Fire users.",
		shortDesc: "Draws in and absorbs Fire/Ghost; burns bypass immunities; attacks ignore most resists.",
	},
	soultag: {
		name: "Soul Tag",
		desc: "This Pokemon has Soul Fire and Shadow Tag's effects.",
		shortDesc: "Soul Fire + Shadow Tag.",
	},
	starboxer: {
		name: "Star Boxer",
		desc: "This Pokemon's punching moves hit four times and have 1.5x power. Each hit is full power, but secondary effects only occur on the first two hits.",
		shortDesc: "Punching moves hit 4 times at full power and 1.5x; secondaries only on hits 1-2.",
	},
	stormcircuit: {
		name: "Storm Circuit",
		desc: "This Pokemon creates Electric Terrain on entry and has Swift Swim and Elevate's effects. After it knocks out a foe, its highest stat rises by the number of targets fainted.",
		shortDesc: "Electric Surge + Swift Swim + Elevate.",
	},
	stormfright: {
		name: "Storm Fright",
		desc: "On switch-in, opposing Pokemon have their Attack lowered by 1 stage. This Pokemon is immune to Electric-type moves and raises its Special Attack by 1 stage when hit by one. This Pokemon has Teravolt and Strong Jaw's effects.",
		shortDesc: "Intimidate + Lightning Rod + Teravolt + Strong Jaw.",
	},
	stormsovereign: {
		name: "Storm Sovereign",
		desc: "On entry, this Pokemon sets changeable Strong Winds for 8 turns and activates Windy Surge. It has Speed Boost, its moves cannot miss, and foes take immunity-aware Flying chip equal to 1/16 max HP, scaled by effectiveness.",
		shortDesc: "Windy Surge + Speed Boost; 8-turn Strong Winds; no misses; Flying chip.",
	},
	streettyrant: {
		name: "Street Tyrant",
		desc: "This Pokemon has Intimidate, Regenerator, and Mold Breaker's effects.",
		shortDesc: "Intimidate + Regenerator + Mold Breaker.",
	},
	striker: {
		name: "Striker",
		desc: "This Pokemon's kicking moves have 1.4x power.",
		shortDesc: "Kicking moves have 1.4x power.",
	},
	strikersmomentum: {
		name: "Striker's Momentum",
		desc: "This Pokemon has Striker and Libero's effects, and its moves cannot miss. Once per switch-in, a KO caused by this Pokemon raises its Speed by 1 stage.",
		shortDesc: "Moves cannot miss; Striker + Libero; first KO gives +1 Speed.",
	},
	supremeoverlord: { name: "Supreme Overlord", desc: "Each fainted ally gives 1.1x move damage; FFA counts allies twice. At 1+, Clear Body and Self Sufficient; at 2+, Inner Focus; at 3+, Filter and Second Wind; at 4+, Infiltrator; at 5+, Magic Guard and +1 Attack/+1 Sp. Atk.", shortDesc: "Fallen allies boost damage; thresholds grant Clear Body, Filter, Infiltrator, and healing." },
	sunsovereign: {
		name: "Sun Sovereign",
		desc: "This Pokemon has Drought, Wildfire Core, and Self Sufficient's effects. Its sun lasts 8 turns.",
		shortDesc: "Drought + Wildfire Core + Self Sufficient; 8-turn Sun.",
	},
	surgeconduit: {
		name: "Surge Conduit",
		desc: "This Pokemon has Electric Surge, Lightning Rod, and Brute Force's effects.",
		shortDesc: "Electric Surge + Lightning Rod + Brute Force.",
	},
	sweetsanctuary: {
		name: "Sweet Sanctuary",
		desc: "This Pokemon has Friend Guard, Sweet Veil, and Aroma Veil's effects.",
		shortDesc: "Friend Guard + Sweet Veil + Aroma Veil.",
	},
	swornduty: {
		name: "Sworn Duty",
		desc: "On switch-in, this Pokemon heals its adjacent ally by 1/4 max HP.",
		shortDesc: "On entry, heals an adjacent ally by 1/4 max HP.",
	},
	technicalspecialist: {
		name: "Technical Specialist",
		desc: "This Pokemon has Technician, Shed Skin, and Shell Armor's effects.",
		shortDesc: "Technician + Shed Skin + Shell Armor.",
	},
	temporalshift: {
		name: "Temporal Shift",
		desc: "This Pokemon's stats cannot be lowered by opposing Pokemon. After one turn out, every other turn it queues a 120 BP Future Sight matching the user's primary type against a random valid opposing target; multiple attacks can be queued and announce their strike turns.",
		shortDesc: "Stats cannot be lowered; after one turn, queues 120 BP Future Sight every other turn.",
	},
	terastaladaptability: {
		name: "Terastal Adaptability",
		desc: "This Pokemon has Adaptability's effect for Rock- and Poison-type moves. Its non-STAB damaging moves deal 1.5x damage. After it uses a damaging move, it gains that type's resistances until it uses another damaging move.",
		shortDesc: "Rock/Poison Adaptability; non-STAB 1.5x; gains last move type's resistances.",
	},
	terraresolve: {
		name: "Terra Resolve",
		desc: "This Pokemon has Stamina, Rocky Payload, and Self Sufficient's effects.",
		shortDesc: "Stamina + Rocky Payload + Self Sufficient.",
	},
	toxicbloom: {
		name: "Toxic Bloom",
		desc: "This Pokemon has Pollen Bloom and Self Sufficient. Its Poison-type attacks drain half the damage they deal.",
		shortDesc: "Pollen Bloom + Self Sufficient + Poison drain.",
	},
	toxicrenewal: {
		name: "Toxic Renewal",
		desc: "This Pokemon has Adaptability and Regenerator's effects.",
		shortDesc: "Adaptability + Regenerator.",
	},
	treasuretitan: {
		name: "Treasure Titan",
		desc: "This Pokemon has Filter and Earth Eater's effects.",
		shortDesc: "Filter + Earth Eater.",
	},
	tremor: {
		name: "Tremor",
		desc: "On switch-in, this Pokemon summons Sandstorm. This Pokemon is immune to Ground-type moves. Sound-based moves used by this Pokemon become physical, use Attack, have 1.5x power, and ignore sound-based Ability immunities. Sound-based moves used by this Pokemon's allies have 1.5x power and use the user's higher offensive stat. This Pokemon's side is immune to its own damaging sound-based moves.",
		shortDesc: "Sand Stream + Levitate; side sound moves 1.5x; user sound moves physical/use Atk.",
	},
	tyrantstream: {
		name: "Tyrant Stream",
		desc: "This Pokemon has Brute Force, Sand Stream, and Strong Jaw's effects.",
		shortDesc: "Brute Force + Sand Stream + Strong Jaw.",
	},
	ultrainstinct: {
		name: "Ultra Instinct",
		desc: "This Pokemon has Mold Breaker and Inner Focus. It deals 2x damage through screens and 1.5x damage when moving first. In Ashen Beach, New World, Starlight Arena, and Cold Eclipse, it gains 1 Accuracy on entry, deals 1.5x damage, and takes 50% less damage. Outside those fields, it takes 70% less damage when hit before its attacker has moved. Bewitched Woods, Haunted, and Holy Field disable these effects.",
		shortDesc: "Mold Breaker + Inner Focus; speed-based offense/guard; inactive in Bewitched/Haunted/Holy.",
	},
	uncheckedassault: {
		name: "Unchecked Assault",
		desc: "This Pokemon has Scrappy, Technician, and Opportunist's effects.",
		shortDesc: "Scrappy + Technician + Opportunist.",
	},
	unleashedego: {
		name: "Unleashed Ego",
		desc: "This Pokemon has Ultra Ego, Levitate, and Raging Storm's effects.",
		shortDesc: "Ultra Ego + Levitate + Raging Storm.",
	},
	vanguard: {
		name: "Vanguard",
		desc: "This Pokemon has Intimidate built in. Extreme Speed has 1.5x power and becomes Fire-type if Fire would deal more damage. This Pokemon heals 30% of the damage it deals with attacks, doubled against G-Max Pokemon, up to 33% of its max HP per hit. After using Extreme Speed, this Pokemon takes 0.25x damage until the end of the turn. This Pokemon can only be damaged by direct attacks. Its stats cannot be lowered by opposing Pokemon. Once per battle, it endures a KO and survives at 1 HP.",
		shortDesc: "Intimidate; Extreme Speed 1.5x; drains damage; Magic Guard; stats can't drop.",
	},
	vendetta: {
		name: "Vendetta",
		desc: "This Pokemon has Anger Point, Second Wind, and Self Sufficient's effects.",
		shortDesc: "Anger Point + Second Wind + Self Sufficient.",
	},
	venombastion: {
		name: "Venom Bastion",
		desc: "This Pokemon has Dauntless Shield's effect, raising its Defense by 1 stage on entry. In Fairy Tale, it also raises Defense and Special Defense by 1 stage. Its Bug-type moves have 1.5x power, and it restores 1/16 of its max HP at the end of each turn.",
		shortDesc: "Dauntless Shield; Bug moves 1.5x; heals 1/16 each turn.",
	},
	venomrush: {
		name: "Venom Rush",
		desc: "While poisoned or badly poisoned, or while Corrosive, Murkwater Surface, or Wasteland is active, this Pokemon's physical moves have 1.5x power. Poison damage heals it for 1/8 of its maximum HP instead.",
		shortDesc: "Physical moves 1.5x while poisoned or in toxic fields; poison damage heals 1/8.",
	},
	verdantdrake: {
		name: "Verdant Drake",
		desc: "This Pokemon has Proficient, Regenerator, and Dual Wield's effects. Its STAB moves have 1.2x power, it restores 1/3 max HP when it switches out, and moves boosted by Sharpness or Mega Launcher, plus arrow moves, hit twice for reduced damage.",
		shortDesc: "Proficient + Regenerator + Dual Wield.",
	},
	verdanthospitality: {
		name: "Verdant Hospitality",
		desc: "This Pokemon has Friend Guard's effect. On switch-in, it restores 1/8 of its ally's max HP. At the end of each turn, this Pokemon restores 1/8 of its max HP and its ally restores 1/16 of its max HP.",
		shortDesc: "Friend Guard; heals ally on switch-in; heals self and ally each turn.",
	},
	violentrush: {
		name: "Violent Rush",
		desc: "On this Pokemon's first active turn, its Speed is 1.5x and its Attack is 1.2x.",
		shortDesc: "First active turn: 1.5x Spe and 1.2x Atk.",
	},
	voidveil: {
		name: "Void Veil",
		desc: "This Pokemon has Telepathy and Temporal Shift's effects, but its delayed Future Sight starts after one turn out and queues every other turn. Its delayed Future Sight becomes Fairy type if that would hit the target harder. In Cold Eclipse, this delayed Future Sight is 90 Base Power instead of 60. It is immune to Gravity and its negative effects. This Pokemon and its allies cannot have their Speed lowered. At the end of each turn, this Pokemon and its ally restore 1/16 max HP. If an opposing attack would knock out this Pokemon's ally while this Pokemon is above 25% HP, this Pokemon takes that damage instead. Once per switch-in, if an ally is at 25% HP or lower at the end of the turn, that ally heals 1/4 max HP, is cured of status, and is sheltered until the end of the next turn.",
		shortDesc: "Telepathy + delayed Void Future Sight; Cold Eclipse makes it 90 BP; protects allies.",
	},
	warpath: {
		name: "War Path",
		desc: "This Pokemon has Overcoat's immunity to powder, Hail, and Sandstorm. Its Attack is 1.5x while statused. Its Rock-, Fighting-, and Ground-type moves ignore Reflect, Light Screen, Aurora Veil, and defensive boosts. It cannot flinch and ignores stat increases.",
		shortDesc: "Overcoat; status Atk 1.5x; Rock/Fighting/Ground ignore screens/boosts; no flinch.",
	},
	warship: {
		name: "War Ship",
		desc: "If Rain is active, this Pokemon's Speed is doubled. This Pokemon does not take recoil damage and ignores opposing stat boosts like Unaware.",
		shortDesc: "Swift Swim + Rock Head + Unaware.",
	},
	wastingsurge: {
		name: "Wasting Surge",
		desc: "On switch-in, this Pokemon sets Wasteland Terrain. On Water Surface or Underwater, it creates Murkwater Surface instead; from Underwater, non-Poison and non-Steel Pokemon that are not semi-invulnerable faint. If Neutralization is active on Water Surface or Underwater, this effect fails. This Pokemon also has Byxbysion Touch's effects.",
		shortDesc: "Sets Wasteland/Murkwater; Underwater KOs non-Poison/Steel; Byxbysion Touch.",
	},
	waterbarrage: {
		name: "Water Barrage",
		desc: "This Pokemon has Proficient and Dual Wield's effects. At the end of each turn, opposing non-Water Pokemon take cycling Water damage of 1/16, 2/16, then 3/16 max HP, scaled by effectiveness and blocked by Water immunities.",
		shortDesc: "Proficient + Dual Wield; cycling Water chip respects effectiveness and immunities.",
	},
	webassassin: {
		name: "Web Assassin",
		desc: "This Pokemon's Speed is doubled and cannot be lowered. This Pokemon has Sniper's effect. Its attacks are always critical hits against targets that are poisoned or have lowered Speed.",
		shortDesc: "Speed doubled and cannot drop; Sniper; always crits poisoned or Speed-lowered targets.",
	},
	wickedcommand: {
		name: "Wicked Command",
		desc: "This Pokemon has Insomnia and Super Luck's effects and takes 20% less damage from other Pokemon's damaging moves. If this Pokemon knocks out an enemy with a move, its higher attacking stat is raised by 1 stage, with Attack chosen on a tie. It also restores 1/4 of its maximum HP and removes entry hazards from its side.",
		shortDesc: "Insomnia + Super Luck; takes 0.8x damage; KO boosts higher offense, heals 1/4, clears hazards.",
	},
	wickedsnare: {
		name: "Wicked Snare",
		desc: "This Pokemon has Stakeout's effect. Opposing Pokemon that switch in have their Speed lowered by 1 stage. If this Pokemon knocks out a Pokemon that switched in this turn, it restores 1/8 of its maximum HP. Targets hit by this Pokemon become affected by Torment.",
		shortDesc: "Stakeout; switch-ins lose Speed; KO on switched-in target heals 1/8; hits Torment.",
	},
	wildfirecore: {
		name: "Wildfire Core",
		desc: "This Pokemon has Dragonize, Magma Armor, and Proficient's effects. It is immune to Hail damage. At the end of each turn, opposing Pokemon take Fire-type damage equal to 1/16 max HP, doubled if burned or if this Pokemon used a Fire- or Dragon-type move this turn. This damage uses Fire-type effectiveness and is blocked by Fire immunities.",
		shortDesc: "Dragonize + Magma Armor + Proficient; Fire scaling chip respects immunities.",
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
	windysurge: {
		name: "Windy Surge",
		desc: "On switch-in, this Pokemon sets Tailwind on its side for 2 turns.",
		shortDesc: "On switch-in, sets 2-turn Tailwind on this Pokemon's side.",
	},
	wrathshield: {
		name: "Wrath Shield",
		desc: "This Pokemon has Bulletproof, Filter, and Self Repair's effects. It is immune to bullet and pulse moves, takes their combined damage reductions from other attacks, heals 1/16 each turn, is immune to Sandstorm and Hail damage, and Natural Cure heals it when curing status on switch-out.",
		shortDesc: "Bulletproof + Filter + Self Repair.",
	},
	ragingfists: {
		name: "Raging Fists",
		desc: "This Pokemon has Hydra Bond, Unseen Fist, and Skill Link's effects.",
		shortDesc: "Hydra Bond + Unseen Fist + Skill Link.",
	},
	imperialmandate: {
		name: "Imperial Mandate",
		desc: "At 50% HP or higher, this Pokemon's damage dealt is doubled. Below 50% HP, its Speed is doubled instead. It also deals 1.2x damage and takes 0.8x damage from attacks. In Fairy Tale, Cold Eclipse, and New World, it raises Defense and Special Defense by 1 and deals 1.5x damage.",
		shortDesc: "High HP doubles damage; low HP doubles Speed; 1.2x dealt and 0.8x taken.",
	},
	phantombarrage: {
		name: "Phantom Barrage",
		desc: "This Pokemon has Infiltrator, Levitate, and Hydra Bond's effects. Dragon Darts and G-Max Spirit Volley use this Pokemon's higher offensive stat. In Free-for-All battles, Dragon Darts and G-Max Spirit Volley hit all opposing Pokemon twice.",
		shortDesc: "Infiltrator + Levitate + Hydra Bond; higher offensive stat for signature attacks.",
	},
	atrocity: {
		name: "Atrocity",
		desc: "This Ability cannot be suppressed and has Wildfire Core, Self Sufficient, and draining attacks. This Pokemon's damaging moves have 1.3x power, +1 critical hit ratio, ignore Abilities, ignore defensive stat boosts, and bypass Substitute, Reflect, Light Screen, and Aurora Veil. Its Defense and Special Defense are 1.3x. It heals 30% of the damage it deals with attacks, doubled against G-Max Pokemon, up to 33% of its max HP per hit. In Cold Eclipse, its damaging moves gain another 1.3x boost, and its Defense and Special Defense become 1.5x.",
		shortDesc: "Wildfire Core + Self Sufficient + draining attacks.",
	},
	ultraego: {
		name: "Ultra Ego",
		desc: "Moves ignore abilities; it heals each turn and after attacks. KOs heal more, and the first enemy hit boosts Attack and Sp. Atk. Bewitched Woods, Haunted, and Holy Field disable these effects.",
		shortDesc: "Mold Breaker; heals and boosts from combat; inactive in Bewitched/Haunted/Holy.",
	},
	triage: {
		name: 'Triage',
		desc: 'Healing and status-cleansing moves used by this Pokemon have their priority increased by 3.',
		shortDesc: 'Healing and status-cleansing moves have +3 priority.',
	},
	islandcurrent: {
		name: 'Island Current',
		desc: "This Pokemon has Swift Swim and Wind Rider's effects.",
		shortDesc: 'Swift Swim + Wind Rider.',
	},
	oceanicwings: {
		name: 'Oceanic Wings',
		desc: "This Pokemon has Water Absorb, Hydration, and Friend Guard's effects.",
		shortDesc: 'Water Absorb + Hydration + Friend Guard.',
	},
	ruinjaw: {
		name: 'Ruin Jaw',
		desc: "This Pokemon has Strong Jaw and Earth Eater's effects.",
		shortDesc: 'Strong Jaw + Earth Eater.',
	},
};

const CUSTOM_MOVE_UPDATES: {[id: string]: AnyObject} = {
	armthrust: {
		multihit: [2, 5],
	},
	aurorabeam: {
		basePower: 80,
		flags: {protect: 1, mirror: 1, metronome: 1, pulse: 1},
		desc: "Has a 10% chance to lower the target's Attack by 1 stage. Boosted by Mega Launcher and Dual Wield.",
		shortDesc: "10% chance to lower Attack. Boosted by Mega Launcher and Dual Wield.",
	},
	astonish: {
		basePower: 40,
		pp: 10,
		priority: 3,
		secondary: {chance: 100, volatileStatus: 'flinch'},
		desc: "Has a 100% chance to make the target flinch. Fails unless it is the user's first turn on the field.",
		shortDesc: "Ghost-type Fake Out. First turn out only; 100% flinch.",
	},
	beatup: {
		basePower: 30,
		multihit: [2, 6],
		desc: 'Hits two to six times. Each hit has 30 base power.',
		shortDesc: 'Hits 2-6 times. Each hit has 30 power.',
	},
	barrage: {
		multihit: [2, 5],
	},
	bulletseed: {
		multihit: [2, 5],
	},
	cut: {
		basePower: 60,
	},
	fireblast: {
		flags: {protect: 1, mirror: 1, metronome: 1, pulse: 1},
		desc: 'Has a 10% chance to burn the target. Boosted by Mega Launcher and Dual Wield.',
		shortDesc: '10% burn chance. Boosted by Mega Launcher and Dual Wield.',
	},
	skyattack: {
		desc: 'Charges, then attacks with +4 priority and a boosted critical-hit ratio. Instant use still keeps the critical-hit boost but not the charge priority.',
		shortDesc: 'Charges, then +4 priority with high crit; instant use keeps high crit.',
	},
	roaroftime: {
		desc: "Uses the user's higher offensive stat. Dialga also breaks protection, hits Fairy types as resisted damage, gains +3 priority in Trick Room, and queues a future hit after a non-KO.",
		shortDesc: "Higher offense. Dialga: breaks Protect, future hit, Fairies resist, +3 in Trick Room.",
	},
	shadowforce: {
		desc: "Uses the user's higher offensive stat. The user vanishes, then attacks through protection. A successful hit gives Giratina 0.7x damage taken through the next turn.",
		shortDesc: "Higher offense; breaks Protect. Giratina gains 0.7x damage guard on hit.",
	},
	spacialrend: {
		accuracy: 95,
		desc: "Uses the user's higher offensive stat and has a high critical-hit ratio. Palkia never misses and ignores protection and redirection.",
		shortDesc: "Higher offense; high crit. Palkia: never misses; ignores Protect/redirection.",
	},
	needlegun: {
		basePower: 30,
		type: 'Steel',
		multihit: 6,
		desc: 'A 30 Base Power Steel-type special attack that hits exactly six times.',
		shortDesc: 'Steel type. Hits exactly 6 times.',
	},
	skullbash: {
		desc: "Charges with +4 priority, raising Attack, Defense, and Special Defense by 1 and reducing damage taken to 0.7x. The attack fires at normal priority and heals 1/8 max HP on a successful hit. A skipped charge has no priority boost.",
		shortDesc: "+4 charge: +Atk/Def/SpD, 0.7x damage. Hit heals 1/8.",
	},
	watershuriken: {
		basePower: 20,
		multihit: [2, 6],
		critRatio: 2,
		desc: '20 BP, +1 priority, high critical-hit ratio, and hits 2-6 times. Shadow Current: 90 BP first hit, then 1-4 hits at 20 BP, or 2-5 follow-ups in FFA; all crit. Ash-Greninja: 30 BP, exactly 3 hits, all crit.',
		shortDesc: '+1 priority. 20 BP, high crit, hits 2-6. Greninja forms have special patterns.',
	},
	crosspoison: {
		desc: "Has a high critical hit ratio and a 50% chance to badly poison the target. If the target is poisoned or badly poisoned, this move ignores the target's positive Defense boosts.",
		shortDesc: "High crit. 50% toxic; ignores positive Def boosts vs poisoned targets.",
	},
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
		basePower: 160,
		flags: {recharge: 1, protect: 1, mirror: 1, metronome: 1, cantusetwice: 1, pulse: 1},
		desc: '160-power Water move using the higher Atk/SpA; 60% freeze; boosted by Mega Launcher and Dual Wield; recharge unless it KOs.',
		shortDesc: '160 BP; higher offense; 60% freeze; launcher/Dual Wield boost; recharge.',
	},
	psybeam: {
		basePower: 70,
		critRatio: 2,
		flags: {protect: 1, mirror: 1, metronome: 1, pulse: 1},
		desc: 'High critical-hit ratio; 10% confusion chance; boosted by Mega Launcher and Dual Wield.',
		shortDesc: 'High crit; 10% confusion; launcher/Dual Wield boost.',
	},
	twinbeam: {
		basePower: 60,
	},
	bonemerang: {
		basePower: 50,
		name: 'Bonemerang',
		critRatio: 2,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		desc: 'Hits twice. Has an increased critical-hit ratio. Each hit has a 30% flinch chance. Hits airborne targets neutrally.',
		shortDesc: 'Hits twice; high crit; 30% flinch each hit; hits airborne neutrally.',
	},
	ceaselessedge: {
		name: 'Ceaseless Edge',
		desc: 'If this move is successful, it sets up a layer of Spikes on the opposing side.',
		shortDesc: 'Sets Spikes on the opposing side.',
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
		desc: 'Hits 2 to 6 times. Thick Club makes it hit 5 or 6 times. Each hit has a 10% chance to lower Defense. Hits airborne targets neutrally.',
		shortDesc: 'Hits 2-6; Thick Club: 5-6; 10% Def drop; hits airborne neutrally.',
	},
	furyswipes: {
		multihit: [2, 5],
	},
	iciclespear: {
		multihit: [2, 5],
	},
	cometpunch: {
		name: 'Comet Punch',
		accuracy: 100,
		basePower: 30,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1},
		multihit: [2, 5],
		desc: 'Hits 2 to 5 times. The final hit has double power and always results in a critical hit.',
		shortDesc: 'Hits 2-5 times. Final hit: 2x power and always crits.',
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
		shortDesc: 'Fairy; hits 2-5 times; 10% Atk drop each hit.',
	},
	furyattack: {
		name: 'Fury Attack',
		accuracy: 100,
		basePower: 20,
		type: 'Ground',
		flags: {contact: 1, protect: 1, mirror: 1, drill: 1, metronome: 1, bone: 1},
		multihit: [2, 5],
		desc: 'Hits 2 to 5 times and hits airborne targets neutrally. The final hit drains its damage; a KO also heals 1/4 max HP.',
		shortDesc: 'Hits 2-5; final hit drains; KO heals 1/4; hits airborne neutrally.',
	},
	hornattack: {
		name: 'Horn Attack',
		type: 'Rock',
		secondary: {
			chance: 50,
			boosts: {def: -1},
		},
		desc: 'Has a 50% chance to lower Defense by 1 stage. Boosted by Power Drill and Dual Wield.',
		shortDesc: '50% Defense drop; boosted by Power Drill and Dual Wield.',
	},
	needlearm: {
		name: 'Needle Arm',
		basePower: 100,
		desc: 'Has a 30% chance to make the target flinch.',
		shortDesc: '30% chance to make the target flinch.',
	},
	meteormash: {
		name: 'Meteor Mash',
		basePower: 100,
		secondary: {chance: 30, self: {boosts: {atk: 1}}},
		desc: "Has a 30% chance to raise the user's Attack by 1 stage.",
		shortDesc: "30% chance to raise the user's Attack by 1.",
	},
	pinmissile: {
		name: 'Pin Missile',
		multihit: [2, 5],
		desc: 'Hits two to five times. Skill Link makes it hit five times. Loaded Dice makes it hit 5-6 times.',
		shortDesc: 'Hits 2-5 times.',
	},
	rockblast: {
		multihit: [2, 5],
	},
	scaleshot: {
		multihit: [2, 5],
	},
	spikecannon: {
		name: 'Spike Cannon',
		accuracy: 100,
		basePower: 25,
		type: 'Water',
		multihit: [2, 5],
		critRatio: 1,
		desc: 'A 25 Base Power Water-type attack that hits 2 to 5 times. Skill Link makes it hit five times.',
		shortDesc: '25 BP Water move. Hits 2-5 times.',
	},
	stoneaxe: {
		name: 'Stone Axe',
		desc: 'If this move is successful, it sets Stealth Rock on the opposing side.',
		shortDesc: 'Sets Stealth Rock on the opposing side.',
	},
	tailslap: {
		multihit: [2, 5],
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
		basePower: 130,
		category: 'Physical',
		isNonstandard: 'Gigantamax',
		name: 'G-Max Final Verdict',
		pp: 5,
		priority: 0,
		flags: {},
		isMax: 'Aegislash',
		target: 'adjacentFoe',
		type: 'Steel',
		desc: "Uses the user's higher offensive stat. After it hits, all opposing Pokemon at or below 20% HP faint.",
		shortDesc: '130 BP; uses higher offense; then executes foes at 20% HP or less.',
	},
	gmaxspiritvolley: {
		num: 1000,
		accuracy: true,
		basePower: 100,
		category: 'Physical',
		isNonstandard: 'Gigantamax',
		name: 'G-Max Spirit Volley',
		pp: 5,
		priority: 0,
		flags: {},
		isMax: 'Dragapult',
		target: 'adjacentFoe',
		type: 'Ghost',
		desc: "Uses the user's higher offensive stat. After it hits, all opposing Pokemon take extra damage equal to half the original hit.",
		shortDesc: '100 BP; uses higher offense; foes take half-hit splash damage.',
	},
};

const CUSTOM_LEARNSET_REPLACEMENTS: {[id: string]: {[id: string]: string[]}} = {
	toxtricitylowkey: {
		acid: ['9L1'],
		ember: ['9L1'],
		leer: ['9L1'],
		nobleroar: ['9L1'],
		incinerate: ['9L1'],
		scaryface: ['9L1'],
		taunt: ['9L1'],
		venoshock: ['9L1', '9M'],
		screech: ['9L1'],
		swagger: ['9L1'],
		toxic: ['9L1'],
		lavaplume: ['9L1'],
		poisonjab: ['9L1'],
		overheat: ['9L1'],
		boomburst: ['9L1'],
		shiftgear: ['9L1'],
		flameburst: ['9E'],
		sunnyday: ['9E', '9M'],
		belch: ['9E'],
		tearfullook: ['9E'],
		willowisp: ['9E', '9M'],
		growl: ['9E'],
		flail: ['9E'],
		acidspray: ['9E'],
		afteryou: ['9M'],
		agility: ['9M'],
		batonpass: ['9M'],
		blazekick: ['9M'],
		bounce: ['9M'],
		corrosivegas: ['9M'],
		crosspoison: ['9M'],
		defog: ['9M'],
		dig: ['9M'],
		dragonclaw: ['9M'],
		drainpunch: ['9M'],
		dualchop: ['9M'],
		dynamicpunch: ['9M'],
		echoedvoice: ['9M'],
		encore: ['9M'],
		endeavor: ['9M'],
		fireblast: ['9M'],
		firefang: ['9M'],
		firepunch: ['9M'],
		firespin: ['9M'],
		flamecharge: ['9M'],
		flamethrower: ['9M'],
		flareblitz: ['9M'],
		gastroacid: ['9M'],
		gigaimpact: ['9M'],
		gunkshot: ['9M'],
		heatcrash: ['9M'],
		heatwave: ['9M'],
		hyperbeam: ['9M'],
		hypervoice: ['9M'],
		knockoff: ['9M'],
		laserfocus: ['9M'],
		megakick: ['9M'],
		megapunch: ['9M'],
		mysticalfire: ['9M'],
		outrage: ['9M'],
		payback: ['9M'],
		poweruppunch: ['9M'],
		psychup: ['9M'],
		roar: ['9M'],
		rockclimb: ['9M'],
		rocksmash: ['9M'],
		roleplay: ['9M'],
		signalbeam: ['9M'],
		sludgebomb: ['9M'],
		sludgewave: ['9M'],
		snarl: ['9M'],
		solarbeam: ['9M'],
		solarblade: ['9M'],
		stompingtantrum: ['9M'],
		stoneedge: ['9M'],
		storedpower: ['9M'],
		strength: ['9M'],
		suckerpunch: ['9M'],
		terrainpulse: ['9M'],
		throatchop: ['9M'],
		thunder: ['9M'],
		thunderfang: ['9M'],
		thunderpunch: ['9M'],
		uproar: ['9M'],
		venomdrench: ['9M'],
		wildcharge: ['9M'],
		workup: ['9M'],
	},
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
	azumarill: {
		aurasphere: ['9M'],
		moonblast: ['9M'],
		muddywater: ['9M'],
		perishsong: ['9M'],
		focusblast: ['9M'],
		dazzlinggleam: ['9M'],
		drainingkiss: ['9M'],
	},
	slowking: {auroraveil: ['9M']},
	slowkinggalar: {auroraveil: ['9M']},
	walrein: {auroraveil: ['9M']},
	avalugg: {auroraveil: ['9M']},
	avalugghisui: {auroraveil: ['9M']},
	crabominable: {auroraveil: ['9M']},
	deoxys: {auroraveil: ['9M']},
	deoxysattack: {auroraveil: ['9M']},
	deoxysdefense: {auroraveil: ['9M']},
	deoxysspeed: {auroraveil: ['9M']},
	quagsire: {
		acidspray: ['9M'],
		mudbomb: ['9M'],
		encore: ['9M'],
		wavecrash: ['9M'],
		flipturn: ['9M'],
		haze: ['9M'],
	},
	clodsire: {
		megahorn: ['9M'],
		barbbarrage: ['9M'],
		banefulbunker: ['9M'],
		gunkshot: ['9M'],
		liquidation: ['9M'],
		hydropump: ['9M'],
		flipturn: ['9M'],
	},
	drifblim: {
		flamethrower: ['9M'],
	},
	tyranitar: {
		knockoff: ['9M'],
	},
	hitmonlee: {
		accelerock: ['9M'],
	},
	abomasnow: {
		glaciallance: ['9M'],
		sappyseed: ['9M'],
	},
	falinks: {
		gyroball: ['9M'],
		heavyslam: ['9M'],
		irondefense: ['9M'],
		ironhead: ['9M'],
		metalburst: ['9M'],
		smartstrike: ['9M'],
		steelroller: ['9M'],
	},
	mothim: {
		dazzlinggleam: ['9M'],
		energyball: ['9M'],
		flashcannon: ['9M'],
		hurricane: ['9M'],
		ragepowder: ['9M'],
		reflecttype: ['9M'],
		sludgebomb: ['9M'],
		spikes: ['9M'],
		stickyweb: ['9M'],
		venoshock: ['9M'],
		weatherball: ['9M'],
	},
	shiftry: {
		weatherball: ['9M'],
	},
	eevee: {
		bouncybubble: ['9M'],
		sappyseed: ['9M'],
	},
	eeveestarter: {
		bouncybubble: ['9M'],
		sappyseed: ['9M'],
	},
	vaporeon: {
		bouncybubble: ['9M'],
	},
	leafeon: {
		sappyseed: ['9M'],
	},
	luvdisc: {
		bouncybubble: ['9M'],
	},
	wishiwashi: {
		bouncybubble: ['9M'],
	},
	flareon: {
		sizzleslide: ['9M'],
	},
	wyrdeer: {
		hypervoice: ['9M'],
	},
	mantine: {
		airslash: ['9M'],
		calmmind: ['9M'],
		dualwingbeat: ['9M'],
		hurricane: ['9M'],
		nastyplot: ['9M'],
		signalbeam: ['9M'],
		twister: ['9M'],
		liquidation: ['9M'],
		wavecrash: ['9M'],
		aquacutter: ['9M'],
		flipturn: ['9M'],
		aquajet: ['9M'],
	},
	grumpig: {
		snatch: ['9M'],
		instruct: ['9M'],
		aurasphere: ['9M'],
		teleport: ['9M'],
	},
	hippowdon: {
		shoreup: ['9M'],
		psychicfangs: ['9M'],
	},
	milotic: {
		drainingkiss: ['9M'],
		dragondance: ['9M'],
		dragoncheer: ['9M'],
	},
	weavile: {
		closecombat: ['9M'],
		iciclespear: ['9M'],
	},
	slurpuff: {
		aurasphere: ['9M'],
		closecombat: ['9M'],
		drainpunch: ['9M'],
		focusblast: ['9M'],
		submission: ['9M'],
	},
	coalossal: {
		hydrosteam: ['9M'],
		magmastorm: ['9M'],
		spikecannon: ['9M'],
		steameruption: ['9M'],
	},
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
		heartswap: ['9M'],
		spotlight: ['9M'],
		twinbeam: ['9M'],
	},
	meowsticf: {
		aurasphere: ['9M'],
		drainingkiss: ['9M'],
		vacuumwave: ['9M'],
		heartswap: ['9M'],
		spotlight: ['9M'],
		twinbeam: ['9M'],
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
		landswrath: ['9M'],
		eerieimpulse: ['9M'],
		infestation: ['9M'],
	},
	quagsire: {
		landswrath: ['9M'],
		eerieimpulse: ['9M'],
		infestation: ['9M'],
	},
	jumpluff: {
		spore: ['9M'],
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
		sizzleslide: ['9M'],
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
		allyswitch: ['9M'],
		hypervoice: ['9M'],
		recover: ['9M'],
	},
	goodrahisui: {
		allyswitch: ['9M'],
		hypervoice: ['9M'],
		recover: ['9M'],
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
	tentacruel: {
		boltbeak: ['9M'],
	},
	kingler: {
		bodypress: ['9M'],
		clamp: ['9M'],
		flipturn: ['9M'],
		quickguard: ['9M'],
		tripledive: ['9M'],
	},
	porygon2: {
		shiftgear: ['9M'],
	},
	porygonz: {
		shiftgear: ['9M'],
	},
	yanmega: {
		hurricane: ['9M'],
		quickguard: ['9M'],
		quiverdance: ['9M'],
		weatherball: ['9M'],
	},
	chandelure: {
		trickortreat: ['9M'],
	},
	kilowattrel: {
		boltbeak: ['9M'],
	},
};

const CUSTOM_LEARNSET_REMOVALS: {[id: string]: string[]} = {
	abomasnow: ['partingshot'],
	absol: ['partingshot'],
	aerodactyl: ['dragonascent'],
	altaria: ['roaroftime'],
	arcanine: ['mightycleave'],
	arcaninehisui: ['accelerock', 'shoreup'],
	archeops: ['dragonascent'],
	armaldo: ['shoreup'],
	chimecho: ['lightofruin'],
	clawitzer: ['originpulse'],
	claydol: ['lightofruin', 'lusterpurge', 'shoreup'],
	crobat: ['direclaw'],
	cradily: ['sappyseed'],
	crustle: ['shoreup'],
	decidueye: ['ceaselessedge'],
	decidueyehisui: ['ceaselessedge'],
	delphox: ['torchsong'],
	dodrio: ['triplearrows'],
	donphan: ['mightycleave', 'milkdrink', 'shoreup'],
	drapion: ['ceaselessedge'],
	dragonite: ['roaroftime'],
	druddigon: ['mightycleave', 'partingshot'],
	dusknoir: ['partingshot'],
	empoleon: ['tachyoncutter'],
	escavalier: ['doubleironbash'],
	espeon: ['fierydance', 'lusterpurge'],
	exploud: ['torchsong'],
	feraligatr: ['mightycleave', 'shoreup'],
	falinks: ['astonish', 'destinybond', 'nightshade', 'ominouswind', 'phantomforce', 'poltergeist', 'shadowball', 'shadowclaw', 'shadowpunch', 'shadowsneak', 'spectralthief'],
	flygon: ['roaroftime'],
	gallade: ['bitterblade', 'tachyoncutter', 'triplearrows'],
	garchomp: ['roaroftime', 'spacialrend'],
	gardevoir: ['lunardance', 'lunarwish', 'psyblade', 'psychoboost', 'tachyoncutter'],
	goodra: ['roaroftime', 'slackoff'],
	goodrahisui: ['roaroftime', 'slackoff'],
	goomy: ['roaroftime'],
	granbull: ['partingshot'],
	gyarados: ['dragonascent'],
	hitmonchan: ['ragefist'],
	hydreigon: ['roaroftime'],
	kabutops: ['ceaselessedge'],
	kecleon: ['partingshot'],
	kleavor: ['sacredsword'],
	kommoo: ['roaroftime'],
	lapras: ['bouncybubble'],
	liepard: ['partingshot'],
	lucario: ['meteorassault', 'tachyoncutter'],
	lunatone: ['diamondstorm'],
	lycanroc: ['precipiceblades', 'shoreup'],
	lycanrocdusk: ['precipiceblades', 'shoreup'],
	lycanrocmidnight: ['precipiceblades', 'shoreup'],
	machamp: ['shoreup'],
	manectric: ['partingshot'],
	marowak: ['mightycleave', 'shoreup'],
	marowakalola: ['mightycleave', 'shoreup'],
	mawile: ['doubleironbash'],
	mienshao: ['meteorassault'],
	milotic: ['bouncybubble'],
	muk: ['partingshot'],
	mukalola: ['partingshot'],
	musharna: ['partingshot'],
	nidoking: ['partingshot'],
	ninetales: ['torchsong'],
	noivern: ['partingshot', 'torchsong'],
	omastar: ['shoreup'],
	pangoro: ['ragefist'],
	parasect: ['partingshot', 'shadowforce'],
	pidgeot: ['bleakwindstorm', 'windbolt', 'searingshot', 'springtidestorm'],
	reuniclus: ['lusterpurge'],
	rhydon: ['saltcure'],
	rhyperior: ['saltcure'],
	salamence: ['roaroftime'],
	shelgon: ['roaroftime'],
	sawsbuck: ['shoreup'],
	sceptile: ['tachyoncutter'],
	scizor: ['sacredsword'],
	scyther: ['sacredsword'],
	seismitoad: ['shoreup'],
	seviper: ['direclaw', 'partingshot'],
	simisage: ['slackoff'],
	simisear: ['slackoff'],
	simipour: ['slackoff'],
	typhlosionhisui: ['shadowforce'],
	solrock: ['diamondstorm', 'mightycleave'],
	spiritomb: ['partingshot'],
	sliggoohisui: ['roaroftime'],
	staraptor: ['thunderouskick'],
	starmie: ['diamondstorm'],
	stoutland: ['shoreup'],
	toxicroak: ['direclaw', 'partingshot'],
	umbreon: ['partingshot'],
	vespiquen: ['partingshot'],
	volcanion: ['hydrosteam'],
	wailord: ['originpulse', 'slackoff', 'sparklingaria'],
	weavile: ['ceaselessedge'],
	zangoose: ['partingshot'],
	trapinch: ['roaroftime'],
	gabite: ['roaroftime'],
	deino: ['roaroftime'],
};

const CUSTOM_BW_SPRITE_IDS = Object.keys(CUSTOM_BW_SPRITES);
const CUSTOM_ANIMATED_BW_SPRITES = new Set([
	'aggron', 'ariados', 'basculegion', 'basculegionf', 'butterfree', 'cacturne', 'charizard', 'cinderacegmax',
	'crobat', 'dragapult', 'duraludon', 'dusknoir', 'electivire', 'empoleon', 'espeon', 'garbodorgmax',
	'garchomp', 'garchompf', 'garchompmega', 'gardevoirmega', 'gengar', 'glalie', 'gliscor', 'grimmsnarl',
	'heracross', 'houndoom', 'hydreigon', 'infernape', 'inteleon', 'lilligant', 'lucariomega', 'luxray', 'magmortar', 'magneton',
	'magnezone', 'metagross', 'milotic', 'mothim', 'ninetales', 'obstagoon', 'perrserker', 'pidgeot',
	'ribombee', 'rotom', 'rotomfan', 'rotomfrost', 'rotomheat', 'rotommow', 'rotomwash', 'salamence',
	'scolipede', 'silvally', 'silvallybug', 'silvallydark', 'silvallydragon', 'silvallyelectric', 'silvallyfairy', 'silvallyfighting',
	'silvallyfire', 'silvallyflying', 'silvallyghost', 'silvallygrass', 'silvallyground', 'silvallyice', 'silvallypoison', 'silvallypsychic',
	'silvallysteel', 'silvallywater', 'slowbro', 'slowking', 'sneasel', 'staraptor', 'steelix', 'talonflame',
	'torterra', 'typhlosion', 'tyrantrum', 'venusaur', 'victreebel', 'vikavolt',
	'weavile', 'weavilef', 'whimsicott', 'zoroark',
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
	cacturne: {x: 9, y: 7, backgroundSize: '74px auto'},
	garchomp: {x: 6, y: 10, backgroundSize: '78px auto'},
	garchompf: {x: 6, y: 10, backgroundSize: '78px auto'},
	inteleon: {x: 8, y: 3, backgroundSize: '80px auto'},
	weavile: {x: 9, y: 6, backgroundSize: '76px auto'},
	weavilef: {x: 9, y: 6, backgroundSize: '76px auto'},
};
const CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_WIDTH = 72;
const CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_HEIGHT = 72;
const CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_WIDTH = 78;
const CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_HEIGHT = 78;
const CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_WIDTH = 90;
const CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_HEIGHT = 90;
const CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_WIDTH = 78;
const CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_HEIGHT = 78;
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
	sableye: {front: 0, back: 0},
	sableyemega: {front: 0, back: 0},
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
	corviknightgmax: {w: 112, h: 112},
	dragapultgmax: {w: 120, h: 120},
	dondozo: {w: 100, h: 100},
	espeon: {w: 66, h: 66},
	excadrillmega: {w: 70, h: 70},
	gengar: {w: 62, h: 62},
	gardevoir: {w: 108, h: 108},
	gardevoirmega: {w: 108, h: 108},
	gardevoirmegaz: {w: 108, h: 108},
	gardevoirvoidmega: {w: 112, h: 112},
	flareon: {w: 110, h: 110},
	glaceon: {w: 110, h: 110},
	glalie: {w: 62, h: 62},
	glaliemega: {w: 74, h: 74},
	infernapealt: {w: 84, h: 84},
	jolteon: {w: 110, h: 110},
	leafeon: {w: 110, h: 110},
	lucario: {w: 76, h: 76},
	lucariomega: {w: 74, h: 74},
	lucariomegaz: {w: 82, h: 82},
	lokix: {w: 56, h: 56},
	maushold: {w: 60, h: 60},
	mausholdfour: {w: 60, h: 60},
	mothim: {w: 82, h: 82},
	ninetales: {w: 90, h: 90},
	ninetalesalola: {w: 74, h: 74},
	palafinhero: {w: 100, h: 100},
	perrserker: {w: 62, h: 62},
	ribombee: {w: 60, h: 60},
	sableye: {w: 86, h: 86},
	sableyemega: {w: 98, h: 98},
	spiritomb: {w: 70, h: 70},
	spiritombalt: {w: 70, h: 70},
	parasect: {w: 68, h: 68},
	parasectparasitism: {w: 90, h: 100},
	parasectparasite: {w: 92, h: 100},
	heracross: {w: 92, h: 104},
	staraptor: {w: 96, h: 96},
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
	corviknightgmax: {w: 132, h: 132},
	dondozo: {w: 110, h: 110},
	dusknoir: {w: 86, h: 86},
	espeon: {w: 74, h: 74},
	gengar: {w: 60, h: 60},
	gardevoir: {w: 124, h: 124},
	gardevoirmega: {w: 124, h: 124},
	gardevoirmegaz: {w: 124, h: 124},
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
	infernapealt: {w: 92, h: 92},
	jolteon: {w: 108, h: 108},
	leafeon: {w: 108, h: 108},
	lucario: {w: 84, h: 84},
	lucariomega: {w: 76, h: 76},
	lucariomegaz: {w: 86, h: 86},
	lokix: {w: 56, h: 56},
	maushold: {w: 60, h: 60},
	mausholdfour: {w: 60, h: 60},
	mothim: {w: 78, h: 78},
	ninetales: {w: 100, h: 100},
	ninetalesalola: {w: 84, h: 84},
	palafinhero: {w: 116, h: 116},
	pidgeot: {w: 70, h: 68},
	pidgeotmega: {w: 92, h: 92},
	perrserker: {w: 62, h: 62},
	ribombee: {w: 60, h: 60},
	sableye: {w: 86, h: 86},
	sableyemega: {w: 90, h: 90},
	excadrillmega: {w: 74, h: 74},
	spiritomb: {w: 70, h: 70},
	spiritombalt: {w: 70, h: 70},
	parasectparasitism: {w: 104, h: 100},
	parasectparasite: {w: 106, h: 100},
	heracross: {w: 100, h: 106},
	staraptor: {w: 104, h: 100},
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
	weavile: {w: 56, h: 56},
	weavilef: {w: 56, h: 56},
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
	garchompbattlebond: {w: 96, h: 96},
	aegislashgmax: {w: 74, h: 74},
	corviknight: {w: 62, h: 62},
	alcremie: {w: 60, h: 60},
	ariados: {w: 60, h: 60},
	butterfree: {w: 58, h: 58},
	cacturnealt: {w: 64, h: 64},
	butterfreemega: {w: 70, h: 70},
	dragapultgmax: {w: 74, h: 74},
	dondozo: {w: 82, h: 82},
	espeon: {w: 58, h: 58},
	gardevoir: {w: 82, h: 82},
	gardevoirmega: {w: 82, h: 82},
	gardevoirmegaz: {w: 82, h: 82},
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
	sableye: {w: 72, h: 72},
	sableyemega: {w: 78, h: 78},
	excadrillmega: {w: 66, h: 66},
	spiritomb: {w: 56, h: 56},
	spiritombalt: {w: 56, h: 56},
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
	inteleon: {w: 76, h: 76},
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
const CUSTOM_ABILITY_COMPONENT_OVERRIDES: {[id: string]: readonly ID[]} = {
	// Ultra Ego implements Mold Breaker's effect without delegating to the base Ability.
	ultraego: ['moldbreaker' as ID],
	relicarmor: ['selfsufficient' as ID],
	relicmishap: ['selfsufficient' as ID, 'waterabsorb' as ID, 'voltabsorb' as ID],
	apexpredator: ['relicarmor' as ID, 'precision' as ID, 'windrider' as ID],
	alloycore: ['magicguard' as ID, 'selfsufficient' as ID],
	ancientbloom: ['effectspore' as ID, 'selfsufficient' as ID],
	astralcore: ['purepower' as ID, 'naturalcure' as ID, 'illuminate' as ID],
	bloomingsun: ['megasol' as ID, 'invigorate' as ID, 'naturalcure' as ID],
	celestialheart: ['multiscale' as ID, 'soulheart' as ID],
	doomwarning: ['magicbounce' as ID, 'magicguard' as ID],
	draconicforce: ['dragonize' as ID, 'strongjaw' as ID],
	dreadmaw: ['hugepower' as ID, 'strongjaw' as ID],
	freezerburn: ['slushrush' as ID, 'refrigerate' as ID],
	furnaceengine: ['steamengine' as ID, 'flamebody' as ID, 'selfsufficient' as ID],
	hisuianoath: ['swornduty' as ID, 'toughclaws' as ID, 'corrosion' as ID],
	moonlitwings: ['serenegrace' as ID],
	phalanxform: ['hydrabond' as ID, 'friendguard' as ID, 'battlearmor' as ID],
	riotamp: ['punkrock' as ID, 'galvanize' as ID, 'resonanceforce' as ID],
	waterbubble: ['waterveil' as ID],
	requiem: ['cursedbody' as ID],
	reapersgrip: ['ironfist' as ID, 'pressure' as ID],
	ultrainstinct: ['moldbreaker' as ID, 'innerfocus' as ID],
	hisuianpath: ['sapsipper' as ID, 'innerfocus' as ID, 'fluffy' as ID],
	hydratyrant: ['hydrabond' as ID, 'berserk' as ID, 'selfsufficient' as ID],
	toxicevolution: ['corrosion' as ID, 'dualwield' as ID, 'shielddust' as ID],
	parasitism: ['dryskin' as ID, 'magicguard' as ID],
	resuscitation: ['selfrepair' as ID, 'magicguard' as ID],
	islandcurrent: ['swiftswim' as ID, 'windrider' as ID],
	oceanicwings: ['waterabsorb' as ID, 'hydration' as ID, 'friendguard' as ID],
	ruinjaw: ['strongjaw' as ID, 'eartheater' as ID],
	stormfright: ['strongjaw' as ID],
};
const CUSTOM_MOVE_UPDATE_IDS = Object.keys(CUSTOM_MOVE_UPDATES);
const CUSTOM_LEARNSET_REPLACEMENT_IDS = Object.keys(CUSTOM_LEARNSET_REPLACEMENTS);
const CUSTOM_LEARNSET_ADDITION_IDS = Object.keys(CUSTOM_LEARNSET_ADDITIONS);
const CUSTOM_LEARNSET_REMOVAL_IDS = Object.keys(CUSTOM_LEARNSET_REMOVALS);
const REDUNDANT_ITEM_IDS = [
	'berserkgene',
	'berry', 'bitterberry', 'burntberry', 'goldberry', 'iceberry',
	'mintberry', 'miracleberry', 'mysteryberry', 'przcureberry', 'psncureberry',
	'belueberry', 'blukberry', 'cornnberry', 'durinberry', 'grepaberry',
	'hondewberry', 'kelpsyberry', 'magostberry', 'nanabberry', 'nomelberry',
	'pamtreberry', 'pinapberry', 'pomegberry', 'qualotberry', 'rabutaberry',
	'razzberry', 'spelonberry', 'tamatoberry', 'watmelberry', 'wepearberry',
];

let customBWSpriteDataTable: AnyObject | null = null;
let customPokedexDataTable: AnyObject | null = null;
let customPokedexAltFormsTable: AnyObject | null = null;
let customAbilityDataTable: AnyObject | null = null;
let customMoveDataTable: AnyObject | null = null;
let customItemDataTable: AnyObject | null = null;
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

function encodeCustomLearnsetSources(sources: string[]) {
	const gens = sources.map(source => Number(source.charAt(0))).filter(gen => gen >= 1 && gen <= 9);
	if (!gens.length) return '';
	const minGen = Math.min(...gens);
	let legalGens = '0123456789'.slice(minGen);
	if (gens.includes(6)) legalGens += 'p';
	if (gens.includes(7) && sources.some(source => source.startsWith('7') && source !== '7V')) legalGens += 'q';
	if (gens.includes(8) && sources.some(source => source.startsWith('8') && source !== '8V')) legalGens += 'g';
	if (gens.includes(9) && sources.some(source => source.startsWith('9') && source !== '9V')) legalGens += 'a';
	return `${legalGens}c`;
}

function applyCustomTeambuilderLearnsets(table: AnyObject) {
	if (!table.learnsets) table.learnsets = {};
	for (const id of CUSTOM_LEARNSET_REPLACEMENT_IDS) {
		table.learnsets[id] = {};
		for (const moveid in CUSTOM_LEARNSET_REPLACEMENTS[id]) {
			table.learnsets[id][moveid] = encodeCustomLearnsetSources(CUSTOM_LEARNSET_REPLACEMENTS[id][moveid]);
		}
	}
	for (const id of CUSTOM_LEARNSET_ADDITION_IDS) {
		if (!table.learnsets[id]) table.learnsets[id] = {};
		for (const moveid in CUSTOM_LEARNSET_ADDITIONS[id]) {
			table.learnsets[id][moveid] = encodeCustomLearnsetSources(CUSTOM_LEARNSET_ADDITIONS[id][moveid]);
		}
	}
	const pikachuSharedForms = [
		'pikachucosplay', 'pikachurockstar', 'pikachubelle', 'pikachupopstar',
		'pikachuphd', 'pikachulibre', 'pikachupartner', 'pikachustarter',
	];
	for (const id of pikachuSharedForms) {
		if (!table.learnsets[id]) table.learnsets[id] = {};
		for (const moveid in table.learnsets.pikachu || {}) {
			table.learnsets[id][moveid] ??= table.learnsets.pikachu[moveid];
		}
	}
	for (const id of CUSTOM_LEARNSET_REMOVAL_IDS) {
		for (const moveid of CUSTOM_LEARNSET_REMOVALS[id]) {
			delete table.learnsets[id]?.[moveid];
		}
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

function applyCustomTeambuilderItems(table: AnyObject) {
	if (Array.isArray(table.items)) {
		table.items = table.items.flatMap((row: string | [string, string]) => {
			if (typeof row === 'string') {
				if (REDUNDANT_ITEM_IDS.includes(row)) return [];
				return [row === 'starsweet' ? 'amuletcoin' : row];
			}
			if (row[0] !== 'item') return [row];
			if (REDUNDANT_ITEM_IDS.includes(row[1])) return [];
			return [row[1] === 'starsweet' ? [row[0], 'amuletcoin'] : row];
		});
	}
	if (Array.isArray(table.itemSet)) {
		table.itemSet = table.itemSet.flatMap((row: [string, string]) => {
			if (row[0] !== 'item') return [row];
			if (REDUNDANT_ITEM_IDS.includes(row[1])) return [];
			return [row[1] === 'starsweet' ? [row[0], 'amuletcoin'] : row];
		});
	}
}

function ensureCustomDataPatches() {
	if (
		(customPokedexDataTable || undefined) === window.BattlePokedex &&
		(customPokedexAltFormsTable || undefined) === window.BattlePokedexAltForms &&
		(customAbilityDataTable || undefined) === window.BattleAbilities &&
		(customMoveDataTable || undefined) === window.BattleMovedex &&
		(customItemDataTable || undefined) === window.BattleItems &&
		(customTeambuilderDataTable || undefined) === window.BattleTeambuilderTable
	) return;
	if (window.BattlePokedex && customPokedexDataTable !== window.BattlePokedex) {
		delete window.BattlePokedex.banettemegaz;
		for (const id of CUSTOM_SPECIES_UPDATE_IDS) {
			if (!window.BattlePokedex[id]) window.BattlePokedex[id] = {};
			const update = CUSTOM_SPECIES_UPDATES[id];
			const species = window.BattlePokedex[id];
			const baseStats = species.baseStats;
			Object.assign(species, update);
			if (update.baseStats) species.baseStats = {...(baseStats || {}), ...update.baseStats};
		}
		customPokedexDataTable = window.BattlePokedex;
	}
	if (window.BattlePokedexAltForms && customPokedexAltFormsTable !== window.BattlePokedexAltForms) {
		delete window.BattlePokedexAltForms.banettemegaz;
		customPokedexAltFormsTable = window.BattlePokedexAltForms;
	}
	if (window.BattleAliases) {
		window.BattleAliases.alchemicsurge = 'Alchemist Surge';
		window.BattleAliases.amuletcoin = 'Star Sweet';
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
	if (window.BattleItems && customItemDataTable !== window.BattleItems) {
		const starSweet = window.BattleItems.starsweet || {};
		window.BattleItems.starsweet = {
			...starSweet,
			name: 'Amulet Coin',
			desc: "In Dragon's Den, the holder cannot be afflicted with a status condition.",
			shortDesc: "In Dragon's Den, the holder cannot be afflicted with a status condition.",
		};
		window.BattleItems.amplifieldrock = {
			...(window.BattleItems.amplifieldrock || {}),
			desc: 'Extends temporary terrains and room effects created by the holder, usually by 3 turns.',
			shortDesc: 'Extends temporary terrains and room effects created by the holder, usually by 3 turns.',
		};
		for (const id of REDUNDANT_ITEM_IDS) delete window.BattleItems[id];
		customItemDataTable = window.BattleItems;
	}
	if (window.BattleTeambuilderTable && customTeambuilderDataTable !== window.BattleTeambuilderTable) {
		const table = window.BattleTeambuilderTable;
		applyCustomTeambuilderItems(table);
		if (!table.overrideSpeciesData) table.overrideSpeciesData = {};
		for (const id of CUSTOM_SPECIES_UPDATE_IDS) {
			const update = CUSTOM_SPECIES_UPDATES[id];
			const existing = table.overrideSpeciesData[id] || {};
			table.overrideSpeciesData[id] = {...existing, ...update};
			if (update.baseStats) {
				table.overrideSpeciesData[id].baseStats = {
					...(window.BattlePokedex?.[id]?.baseStats || {}),
					...(existing.baseStats || {}),
					...update.baseStats,
				};
			}
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
			if (subtable && typeof subtable === 'object') {
				applyCustomTeambuilderItems(subtable);
			}
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
	abilityEffectDataTable: AnyObject | null = null;
	abilityEffectCache: {[id: string]: ReadonlySet<ID>} = {};

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
			ensureCustomDataPatches();
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

	/** Used by Pokemon search filters; never by the ability picker or legality checks. */
	hasAbilityEffect(species: Species, ability: string) {
		ensureCustomDataPatches();
		const effectId = toID(ability);
		if (!effectId) return false;
		for (const slot in species.abilities) {
			// @ts-ignore
			const abilityId = toID(species.abilities[slot]);
			if (this.getAbilityEffects(abilityId).has(effectId)) return true;
		}
		return false;
	}

	getAbilityEffects(abilityId: ID, visiting = new Set<ID>()): ReadonlySet<ID> {
		if (this.abilityEffectDataTable !== window.BattleAbilities) {
			this.abilityEffectDataTable = window.BattleAbilities;
			this.abilityEffectCache = {};
		}
		if (this.abilityEffectCache[abilityId]) return this.abilityEffectCache[abilityId];
		if (visiting.has(abilityId)) return new Set<ID>([abilityId]);

		const effects = new Set<ID>([abilityId]);
		const source = CUSTOM_ABILITY_UPDATES[abilityId];
		if (!source) {
			this.abilityEffectCache[abilityId] = effects;
			return effects;
		}

		const nextVisiting = new Set(visiting);
		nextVisiting.add(abilityId);
		const directComponents = new Set<ID>(CUSTOM_ABILITY_COMPONENT_OVERRIDES[abilityId] || []);
		// Compact descriptions are the canonical component summary; long descriptions may
		// mention abilities only as comparisons or examples.
		const description = `${source.shortDesc || source.desc || ''}`.replace(/\u2019/g, "'");
		for (const componentId in window.BattleAbilities) {
			if (componentId === abilityId) continue;
			const component = window.BattleAbilities[componentId];
			const componentName = component?.name;
			if (!componentName) continue;
			const escapedName = componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			if (new RegExp(`(^|[^a-z0-9])${escapedName}($|[^a-z0-9])`, 'i').test(description)) {
				directComponents.add(componentId as ID);
			}
		}
		for (const componentId of Array.from(directComponents)) {
			for (const nestedEffect of Array.from(this.getAbilityEffects(componentId, nextVisiting))) {
				effects.add(nestedEffect);
			}
		}
		this.abilityEffectCache[abilityId] = effects;
		return effects;
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
		// Prefer selected native BW animations where their silhouettes fit the battle scene better.
		if (species.id === 'heracross' || species.id === 'hydreigon' || species.id === 'milotic' || species.id === 'miloticalt' || species.id === 'miloticaevian' || species.id === 'gastrodonaevian' || species.id === 'gastrodoneastaevian' || species.id === 'hypnopulse' || species.id === 'kingambitalt' || species.id === 'pidgeot' || species.id === 'staraptor' ||
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
		// Parasitism uses its covered host sprite everywhere except the battle team preview.
		// @ts-ignore
		if (id === 'parasect' && toID(pokemon?.ability) === 'parasitism') id = 'parasectparasitism' as ID;
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
		if (id === 'parasect' && toID(pokemon.ability) === 'parasitism') {
			id = 'parasectparasitism' as ID;
			spriteid = 'parasect-parasitism';
			species = Dex.species.get('Parasect-Parasitism');
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
			if (nativeTeambuilderOverride) Object.assign(spriteData, nativeTeambuilderOverride);
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
