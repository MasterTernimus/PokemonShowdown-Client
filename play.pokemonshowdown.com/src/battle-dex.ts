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

const LOCAL_CUSTOM_AVATAR_IDS = new Set([
	'adrienn', 'alainalt', 'amaria', 'amelia', 'asriel', 'aurora', 'charlotte', 'florinia', 'geara', 'julia',
	'lin', 'radomus', 'saphira', 'sirius', 'shiv', 'shivalt', 'taka', 'titania', 'tyrant', 'zetta',
]);

function toUserid(text: any) {
	return toID(text);
}

function isSilvallySpecies(name: string) {
	return toID(name).startsWith('silvally');
}

const CUSTOM_ITEM_ICON_SPRITES: {[id: string]: string} = {
	breloomite: 'breloomite.png',
	luxranite: 'luxranite.png',
	noctowlite: 'noctowlite.png',
	dusknoirite: 'dusknoirite.png',
	weavilite: 'weavilite.png',
	noivernite: 'noivernite.png',
	bronzongite: 'bronzongite.png',
	absolitez: 'absolitez.png',
	barbaracite: 'barbaracite.png',
	baxcalibrite: 'baxcalibrite.png',
	chandelurite: 'chandelurite.png',
	chesnaughtite: 'chesnaughtite.png',
	chimechite: 'chimechite.png',
	clefablite: 'clefablite.png',
	crabominite: 'crabominite.png',
	darkranite: 'darkranite.png',
	delphoxite: 'delphoxite.png',
	dragalgite: 'dragalgite.png',
	dragoninite: 'dragoninite.png',
	drampanite: 'drampanite.png',
	eelektrossite: 'eelektrossite.png',
	emboarite: 'emboarite.png',
	excadrite: 'excadrite.png',
	falinksite: 'falinksite.png',
	feraligite: 'feraligite.png',
	floettite: 'floettite.png',
	froslassite: 'froslassite.png',
	garchompitez: 'garchompitez.png',
	glimmoranite: 'glimmoranite.png',
	golisopite: 'golisopite.png',
	golurkite: 'golurkite.png',
	greninjite: 'greninjite.png',
	hawluchanite: 'hawluchanite.png',
	heatranite: 'heatranite.png',
	lucarionitez: 'lucarionitez.png',
	magearnite: 'magearnite.png',
	malamarite: 'malamarite.png',
	meganiumite: 'meganiumite.png',
	meowsticite: 'meowsticite.png',
	pyroarite: 'pyroarite.png',
	raichunitex: 'raichunitex.png',
	raichunitey: 'raichunitey.png',
	scolipite: 'scolipite.png',
	scovillainite: 'scovillainite.png',
	scraftinite: 'scraftinite.png',
	skarmorite: 'skarmorite.png',
	staraptite: 'staraptite.png',
	starminite: 'starminite.png',
	tatsugirinite: 'tatsugirinite.png',
	victreebelite: 'victreebelite.png',
	zeraorite: 'zeraorite.png',
	zygardite: 'zygardite.png',
	belliboltite: 'belliboltite.png',
	reuniclusite: 'reuniclusite.png',
	sunflorite: 'sunflorite.png',
	claydolite: 'claydolite.png',
	cinderite: 'cinderite.png',
	ledianite: 'ledianite.png',
	roseradite: 'roseradite.png',
	aridiate: 'aridiate.png',
	clawitzerite: 'clawitzerite.png',
	haxorite: 'haxorite.png',
	arbokite: 'arbokite.png',
	anomalycore: 'anomalycore.png',
};

const CUSTOM_SPECIES: {[id: string]: {base: string, data: AnyObject}} = {
	gardevoirmegaalt: {base: 'gardevoirmega', data: {name: 'Gardevoir-Mega-Alt', baseSpecies: 'Gardevoir', forme: 'Mega-Alt', spriteid: 'gardevoir-void', abilities: {0: 'Royal Voice'}, requiredItem: 'Gardevoirite', battleOnly: 'Gardevoir-Void', isNonstandard: 'Custom'}},
	breloommega: {"base":"breloom","data":{"num":286,"name":"Breloom-Mega","baseSpecies":"Breloom","forme":"Mega","types":["Poison","Fighting"],"baseStats":{"hp":80,"atk":160,"def":90,"spa":55,"spd":105,"spe":110},"abilities":{"0":"Corrosive Touch"},"heightm":1.2,"weightkg":39.2,"color":"Purple","eggGroups":["Fairy","Grass"],"requiredItem":"Breloomite","battleOnly":"Breloom","isNonstandard":"Custom","spriteid":"breloom-mega","tier":"OU","gen":9}},
	luxraymega: {"base":"luxray","data":{"num":405,"name":"Luxray-Mega","baseSpecies":"Luxray","forme":"Mega","types":["Electric","Dark"],"baseStats":{"hp":85,"atk":160,"def":91,"spa":90,"spd":104,"spe":105},"abilities":{"0":"Night Hunt"},"heightm":1.4,"weightkg":42,"color":"Blue","eggGroups":["Field"],"requiredItem":"Luxranite","battleOnly":"Luxray","isNonstandard":"Custom","spriteid":"luxray-mega","tier":"OU","gen":9}},
	gardevoirvoid: {"base":"gardevoir","data":{"name":"Gardevoir-Void","baseSpecies":"Gardevoir","forme":"Void","spriteid":"gardevoir-void","changesFrom":"Gardevoir","isNonstandard":"Custom"}},
	noctowlmega: {"base":"noctowl","data":{"num":164,"name":"Noctowl-Mega","baseSpecies":"Noctowl","forme":"Mega","types":["Dark","Flying"],"baseStats":{"hp":100,"atk":65,"def":98,"spa":106,"spd":141,"spe":100},"abilities":{"0":"Sacred Power"},"heightm":1.6,"weightkg":40.8,"color":"Brown","eggGroups":["Flying"],"requiredItem":"Noctowlite","battleOnly":"Noctowl","isNonstandard":"Custom","spriteid":"noctowl-mega","tier":"OU","gen":9}},
	dusknoirmega: {"base":"dusknoir","data":{"num":477,"name":"Dusknoir-Mega","baseSpecies":"Dusknoir","forme":"Mega","types":["Ghost","Dark"],"baseStats":{"hp":65,"atk":180,"def":155,"spa":70,"spd":155,"spe":45},"abilities":{"0":"Reaper's Grip"},"heightm":2.2,"weightkg":106.6,"color":"Black","eggGroups":["Amorphous"],"requiredItem":"Dusknoirite","battleOnly":"Dusknoir","isNonstandard":"Custom","spriteid":"dusknoir-mega","tier":"OU","gen":9}},
	weavilemega: {"base":"weavile","data":{"num":461,"name":"Weavile-Mega","baseSpecies":"Weavile","forme":"Mega","types":["Dark","Ice"],"baseStats":{"hp":85,"atk":160,"def":85,"spa":50,"spd":100,"spe":160},"abilities":{"0":"Frost Stalker"},"heightm":1.1,"weightkg":34,"color":"Black","eggGroups":["Field"],"requiredItem":"Weavilite","battleOnly":"Weavile","isNonstandard":"Custom","spriteid":"weavile-mega","tier":"OU","gen":9}},
	noivernmega: {"base":"noivern","data":{"num":715,"name":"Noivern-Mega","baseSpecies":"Noivern","forme":"Mega","types":["Flying","Dragon"],"baseStats":{"hp":85,"atk":100,"def":80,"spa":127,"spd":90,"spe":153},"abilities":{"0":"Echo Sense"},"heightm":1.5,"weightkg":85,"color":"Purple","eggGroups":["Flying","Dragon"],"requiredItem":"Noivernite","battleOnly":"Noivern","isNonstandard":"Custom","spriteid":"noivern-mega","tier":"OU","gen":9}},
	bronzongmega: {"base":"bronzong","data":{"num":437,"name":"Bronzong-Mega","baseSpecies":"Bronzong","forme":"Mega","types":["Steel","Psychic"],"gender":"N","baseStats":{"hp":67,"atk":104,"def":156,"spa":104,"spd":156,"spe":23},"abilities":{"0":"Storm Bell"},"heightm":1.3,"weightkg":187,"color":"Blue","eggGroups":["Mineral"],"requiredItem":"Bronzongite","battleOnly":"Bronzong","isNonstandard":"Custom","spriteid":"bronzong-mega","tier":"OU"}},
	sharpedomegay: {
		base: 'sharpedo',
		data: {name: 'Sharpedo-Mega-Y', baseSpecies: 'Sharpedo', forme: 'Mega-Y',
			types: ['Water', 'Steel'], baseStats: {hp: 70, atk: 40, def: 125, spa: 150, spd: 125, spe: 90},
			abilities: {0: 'Apex Armor'}, requiredItem: 'Sharpedonite', battleOnly: 'Sharpedo',
			spriteid: 'sharpedo-megay', gen: 9, isNonstandard: 'Custom', tier: 'OU'},
	},
	belliboltmega: {
		base: 'bellibolt',
		data: {name: 'Bellibolt-Mega', baseSpecies: 'Bellibolt', forme: 'Mega', types: ['Electric'],
			baseStats: {hp: 119, atk: 74, def: 111, spa: 153, spd: 113, spe: 45}, abilities: {0: 'Bog Body'},
			requiredItem: 'Belliboltite', battleOnly: 'Bellibolt', changesFrom: 'Bellibolt', spriteid: 'bellibolt-mega', gen: 9, isNonstandard: 'Custom'},
	},
	sunfloramega: {
		base: 'sunflora',
		data: {
			name: 'Sunflora-Mega', baseSpecies: 'Sunflora', forme: 'Mega',
			types: ['Grass', 'Fire'], baseStats: {hp: 95, atk: 70, def: 105, spa: 155, spd: 115, spe: 30}, abilities: {0: 'Solar Hydra'},
			requiredItem: 'Sunflorite', battleOnly: 'Sunflora', changesFrom: 'Sunflora',
			spriteid: 'sunflora-mega', gen: 9, tier: 'OU', natDexTier: 'OU', isNonstandard: 'Custom',
		},
	},
	claydolmega: {
		base: 'claydol',
		data: {
			name: 'Claydol-Mega', baseSpecies: 'Claydol', forme: 'Mega',
			types: ['Ground', 'Psychic'], baseStats: { hp: 60, atk: 70, def: 135, spa: 130, spd: 150, spe: 55 },
			abilities: {0: 'Astral Engine'}, requiredItem: 'Claydolite',
			battleOnly: 'Claydol', changesFrom: 'Claydol', spriteid: 'claydol-mega',
			gen: 9, tier: 'OU', natDexTier: 'OU', isNonstandard: 'Custom',
		},
	},
	sawsbuckspring: {
		base: 'sawsbuck',
		data: {
			name: 'Sawsbuck-Spring',
			baseSpecies: 'Sawsbuck',
			forme: 'Spring',
			// Spring uses the base Sawsbuck artwork; the other seasons have
			// dedicated sprite files.
			spriteid: 'sawsbuck',
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
	hypnopulse: {
		base: 'hypno',
		data: {
			name: 'Hypno-Pulse',
			baseSpecies: 'Hypno',
			forme: 'Pulse',
			spriteid: 'hypno-pulse',
			types: ['Psychic', 'Dark'],
			abilities: {0: 'Nightmare Pulse'},
			baseStats: {hp: 90, atk: 60, def: 125, spa: 105, spd: 140, spe: 80},
			requiredItem: 'Anomaly Core',
			isMega: true,
			changesFrom: 'Hypno',
			isNonstandard: 'Custom',
		},
	},
	lilligantrift: {
		base: 'lilligant',
		data: {
			name: 'Lilligant-Rift',
			baseSpecies: 'Lilligant',
			forme: 'Rift',
			spriteid: 'lilligant-rift',
			types: ['Grass', 'Fairy'],
			abilities: {0: 'Rift Dancer'},
			baseStats: {hp: 80, atk: 90, def: 80, spa: 130, spd: 120, spe: 100},
			requiredItem: 'Anomaly Core',
			isMega: true,
			changesFrom: 'Lilligant',
			isNonstandard: 'Custom',
		},
	},
	lilliganthisuirift: {
		base: 'lilliganthisui',
		data: {
			name: 'Lilligant-Hisui-Rift',
			baseSpecies: 'Lilligant-Hisui',
			forme: 'Rift',
			spriteid: 'lilligant-hisui-rift',
			types: ['Grass', 'Fighting'],
			abilities: {0: 'Rift Dancer'},
			baseStats: {hp: 100, atk: 130, def: 70, spa: 90, spd: 100, spe: 110},
			requiredItem: 'Anomaly Core',
			isMega: true,
			changesFrom: 'Lilligant-Hisui',
			isNonstandard: 'Custom',
		},
	},
	eeveestarteralt: {
		base: 'eeveestarter',
		data: {
			name: 'Eevee-Starter-Alt',
			baseSpecies: 'Eevee-Starter',
			forme: 'Alt',
			spriteid: 'eevee-starter-alt',
			types: ['Normal'],
			abilities: {0: 'Z Protean', 1: 'Opportunist', H: 'Unstable Evo', S: 'Mind Freeze', E: 'Sinister Blaze', F: 'Eclipse', G: 'Ascendance'},
			baseStats: {hp: 65, atk: 75, def: 70, spa: 65, spd: 85, spe: 75},
			changesFrom: 'Eevee-Starter',
			canGigantamax: 'G-Max Cuddle',
			isNonstandard: 'Custom',
		},
	},
	divineon: {
		base: 'eeveestarter',
		data: {
			name: 'Divineon',
			baseSpecies: 'Eevee-Starter',
			forme: 'Divineon',
			spriteid: 'divineon',
			types: ['???'],
			abilities: {0: 'Ascendance'},
			baseStats: {hp: 65, atk: 110, def: 65, spa: 110, spd: 65, spe: 130},
			battleOnly: 'Eevee-Starter',
			changesFrom: 'Eevee-Starter',
			isNonstandard: 'Custom',
		},
	},
	auroreon: {
		base: 'espeon',
		data: {
			name: 'Auroreon',
			baseSpecies: 'Eevee',
			forme: 'Auroreon',
			spriteid: 'auroreon',
			types: ['Ice', 'Psychic'],
			baseStats: {hp: 60, atk: 60, def: 95, spa: 130, spd: 95, spe: 110},
			abilities: {0: 'Mind Freeze'},
			battleOnly: 'Espeon',
			changesFrom: 'Espeon',
			isNonstandard: 'Custom',
		},
	},
	soluneon: {
		base: 'espeon',
		data: {
			name: 'Soluneon',
			baseSpecies: 'Eevee',
			forme: 'Soluneon',
			spriteid: 'soluneon',
			types: ['Dark', 'Psychic'],
			abilities: {0: 'Eclipse'},
			baseStats: {hp: 80, atk: 60, def: 110, spa: 95, spd: 110, spe: 95},
			battleOnly: 'Espeon',
			changesFrom: 'Espeon',
			isNonstandard: 'Custom',
		},
	},
	abysseon: {
		base: 'eeveestarter',
		data: {
			name: 'Abysseon',
			baseSpecies: 'Eevee-Starter',
			forme: 'Abysseon',
			spriteid: 'abysseon',
			types: ['???'],
			abilities: {0: 'Sinister Blaze'},
			baseStats: {hp: 110, atk: 65, def: 130, spa: 65, spd: 130, spe: 65},
			battleOnly: 'Eevee-Starter',
			changesFrom: 'Eevee-Starter',
			isNonstandard: 'Custom',
		},
	},
	empoleonalt: {
		base: 'empoleon',
		data: {
			name: 'Empoleon-Reborn',
			baseSpecies: 'Empoleon',
			forme: 'Reborn',
			spriteid: 'empoleon-alt',
			changesFrom: 'Empoleon',
			isNonstandard: 'Custom',
		},
	},
	miloticalt: {
		base: 'milotic',
		data: {
			name: 'Milotic-Reborn',
			baseSpecies: 'Milotic',
			forme: 'Reborn',
			spriteid: 'milotic-alt',
			changesFrom: 'Milotic',
			isNonstandard: 'Custom',
		},
	},
	miloticaevian: {
		base: 'milotic',
		data: {
			name: 'Milotic-Aevian',
			baseSpecies: 'Milotic-Aevian',
			types: ['Poison', 'Fairy'],
			baseStats: {hp: 95, atk: 115, def: 85, spa: 89, spd: 135, spe: 81},
			abilities: {0: 'Prism Scale', 1: 'Defiant', H: 'Queenly Majesty'},
			otherFormes: [],
			formeOrder: [],
			standalone: true,
			spriteid: 'milotic-aevian',
			isNonstandard: 'Custom',
		},
	},
	laprasaevian: {
		base: 'lapras',
		data: {
			name: 'Lapras-Aevian',
			baseSpecies: 'Lapras-Aevian',
			forme: 'Aevian',
			types: ['Rock', 'Psychic'],
			baseStats: {hp: 140, atk: 110, def: 90, spa: 95, spd: 105, spe: 60},
			abilities: {0: 'Protective Ward', 1: 'Amethyst Glow', H: 'Relic Armor'},
			otherFormes: [],
			formeOrder: [],
			standalone: true,
			spriteid: 'lapras-aevian',
			canGigantamax: null,
			isNonstandard: 'Custom',
		},
	},
	drapionaevian: {
		base: 'drapion',
		data: {
			name: 'Drapion-Aevian',
			baseSpecies: 'Drapion-Aevian',
			types: ['Ice', 'Poison'],
			baseStats: {hp: 85, atk: 130, def: 115, spa: 60, spd: 80, spe: 100},
			abilities: {0: 'Merciless', 1: 'Strong Jaw', H: 'Layered Coat'},
			otherFormes: [],
			formeOrder: [],
			standalone: true,
			spriteid: 'drapion-aevian',
			canGigantamax: null,
			isNonstandard: 'Custom',
		},
	},
	sneasleraevian: {
		base: 'sneasler',
		data: {
			name: 'Sneasler-Aevian',
			baseSpecies: 'Sneasler-Aevian',
			types: ['Fighting', 'Fairy'],
			baseStats: {hp: 90, atk: 120, def: 80, spa: 80, spd: 60, spe: 130},
			abilities: {0: 'Wind Rider', 1: 'Inner Focus', H: 'Aevian Oath'},
			otherFormes: [],
			formeOrder: [],
			standalone: true,
			spriteid: 'sneasler-aevian',
			canGigantamax: null,
			isNonstandard: 'Custom',
		},
	},
	mismagiusaevian: {
		base: 'mismagius',
		data: {
			name: 'Mismagius-Aevian',
			baseSpecies: 'Mismagius-Aevian',
			types: ['Ghost', 'Grass'],
			baseStats: {hp: 70, atk: 110, def: 70, spa: 110, spd: 70, spe: 110},
			abilities: {0: 'Sharpness', 1: 'Magic Bounce', H: 'Levitate'},
			otherFormes: [],
			formeOrder: [],
			standalone: true,
			spriteid: 'mismagius-aevian',
			canGigantamax: null,
			isNonstandard: 'Custom',
		},
	},
	volcaronaaevian: {
		base: 'volcarona',
		data: {
			name: 'Volcarona-Aevian',
			baseSpecies: 'Volcarona-Aevian',
			types: ['Flying'],
			baseStats: {hp: 100, atk: 60, def: 90, spa: 135, spd: 100, spe: 115},
			abilities: {0: 'Air Lock', 1: 'Wind Power', H: 'Pressure'},
			otherFormes: [],
			formeOrder: [],
			standalone: true,
			spriteid: 'volcarona-aevian',
			isNonstandard: 'Custom',
		},
	},
	toxtricityaevian: {
		base: 'toxtricity',
		data: {
			name: 'Toxtricity-Aevian',
			baseSpecies: 'Toxtricity',
			forme: 'Aevian',
			spriteid: 'toxtricity-aevian',
			changesFrom: 'Toxtricity',
			canGigantamax: null,
			cannotDynamax: true,
			isNonstandard: 'Custom',
		},
	},
	laprasazzy: {
		base: 'lapras',
		data: {
			name: 'Lapras-Azzy',
			baseSpecies: 'Lapras',
			forme: 'Azzy',
			spriteid: 'lapras-azzy',
			changesFrom: 'Lapras',
			isNonstandard: 'Custom',
		},
	},
	jellicentazzy: {
		base: 'jellicent',
		data: {
			name: 'Jellicent-Azzy',
			baseSpecies: 'Jellicent',
			forme: 'Azzy',
			spriteid: 'jellicent-azzy',
			changesFrom: 'Jellicent',
			isNonstandard: 'Custom',
		},
	},
	samurottalt: {
		base: 'samurott',
		data: {
			name: 'Samurott-Alt',
			baseSpecies: 'Samurott',
			forme: 'Alt',
			spriteid: 'samurott-alt',
			changesFrom: 'Samurott',
			isNonstandard: 'Custom',
		},
	},
	samurotthisuialt: {
		base: 'samurotthisui',
		data: {
			name: 'Samurott-Hisui-Alt',
			baseSpecies: 'Samurott-Hisui',
			forme: 'Hisui-Alt',
			spriteid: 'samurott-hisui-alt',
			changesFrom: 'Samurott-Hisui',
			isNonstandard: 'Custom',
		},
	},
	goodrahisuialt: {
		base: 'goodrahisui',
		data: {
			name: 'Goodra-Hisui-Alt',
			baseSpecies: 'Goodra-Hisui',
			forme: 'Hisui-Alt',
			spriteid: 'goodra-hisui-alt',
			changesFrom: 'Goodra-Hisui',
			isNonstandard: 'Custom',
		},
	},
	machampalt: {
		base: 'machamp',
		data: {
			name: 'Machamp-Alt',
			baseSpecies: 'Machamp',
			forme: 'Alt',
			spriteid: 'machamp-alt',
			changesFrom: 'Machamp',
			isNonstandard: 'Custom',
		},
	},
	machampgmaxalt: {
		base: 'machampgmax',
		data: {
			name: 'Machamp-Gmax-Alt',
			baseSpecies: 'Machamp-Gmax',
			forme: 'Gmax-Alt',
			spriteid: 'machamp-gmax-alt',
			changesFrom: 'Machamp-Gmax',
			isNonstandard: 'Custom',
		},
	},
	toxtricitylowkeyalt: {
		base: 'toxtricitylowkey',
		data: {
			name: 'Toxtricity-Low-Key-Alt',
			baseSpecies: 'Toxtricity-Low-Key',
			forme: 'Low-Key-Alt',
			spriteid: 'toxtricity-lowkey-alt',
			changesFrom: 'Toxtricity-Low-Key',
			isNonstandard: 'Custom',
		},
	},
	toxtricitylowkeygmaxalt: {
		base: 'toxtricitylowkeygmax',
		data: {
			name: 'Toxtricity-Low-Key-Gmax-Alt',
			baseSpecies: 'Toxtricity-Low-Key-Gmax',
			forme: 'Gmax-Alt',
			spriteid: 'toxtricity-lowkey-gmax-alt',
			changesFrom: 'Toxtricity-Low-Key-Gmax',
			isNonstandard: 'Custom',
		},
	},
	skeledirgealt: {
		base: 'skeledirge',
		data: {
			name: 'Skeledirge-Alt',
			baseSpecies: 'Skeledirge',
			forme: 'Alt',
			spriteid: 'skeledirge-alt',
			changesFrom: 'Skeledirge',
			isNonstandard: 'Custom',
		},
	},
	tsareenaalt: {
		base: 'tsareena',
		data: {
			name: 'Tsareena-Alt',
			baseSpecies: 'Tsareena',
			forme: 'Alt',
			spriteid: 'tsareena-alt',
			changesFrom: 'Tsareena',
			isNonstandard: 'Custom',
		},
	},
	primarinaalt: {
		base: 'primarina',
		data: {
			name: 'Primarina-Alt',
			baseSpecies: 'Primarina',
			forme: 'Alt',
			spriteid: 'primarina-alt',
			changesFrom: 'Primarina',
			isNonstandard: 'Custom',
		},
	},
	decidueyealt: {
		base: 'decidueye',
		data: {
			name: 'Decidueye-Alt',
			baseSpecies: 'Decidueye',
			forme: 'Alt',
			spriteid: 'decidueye-alt',
			changesFrom: 'Decidueye',
			isNonstandard: 'Custom',
		},
	},
	decidueyehisuialt: {
		base: 'decidueyehisui',
		data: {
			name: 'Decidueye-Hisui-Alt',
			baseSpecies: 'Decidueye-Hisui',
			forme: 'Hisui-Alt',
			spriteid: 'decidueye-hisui-alt',
			changesFrom: 'Decidueye-Hisui',
			isNonstandard: 'Custom',
		},
	},
	incineroaralt: {
		base: 'incineroar',
		data: {
			name: 'Incineroar-Alt',
			baseSpecies: 'Incineroar',
			forme: 'Alt',
			spriteid: 'incineroar-alt',
			changesFrom: 'Incineroar',
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
		base: 'gastrodoneast',
		data: {
			name: 'Gastrodon-East-Aevian',
			baseSpecies: 'Gastrodon',
			forme: 'East-Aevian',
			spriteid: 'gastrodon-east-aevian',
			changesFrom: 'Gastrodon-East',
			isNonstandard: 'Custom',
		},
	},
	gastrodonazzy: {
		base: 'gastrodon',
		data: {
			name: 'Gastrodon-Azzy',
			baseSpecies: 'Gastrodon',
			forme: 'Azzy',
			spriteid: 'gastrodon-azzy',
			changesFrom: 'Gastrodon',
			isNonstandard: 'Custom',
		},
	},
	gastrodonazzy2: {
		base: 'gastrodon',
		data: {
			name: 'Gastrodon-Azzy2',
			baseSpecies: 'Gastrodon',
			forme: 'Azzy2',
			spriteid: 'gastrodon-azzy2',
			changesFrom: 'Gastrodon',
			isNonstandard: 'Custom',
		},
	},
	jynxalt: {
		base: 'jynx',
		data: {
			name: 'Jynx-Alt',
			baseSpecies: 'Jynx',
			forme: 'Alt',
			spriteid: 'jynx-alt',
			changesFrom: 'Jynx',
			isNonstandard: 'Custom',
		},
	},
	lumineonalt: {
		base: 'lumineon',
		data: {
			name: 'Lumineon-Alt',
			baseSpecies: 'Lumineon',
			forme: 'Alt',
			spriteid: 'lumineon-alt',
			changesFrom: 'Lumineon',
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
			name: 'Nidoking-Reborn',
			baseSpecies: 'Nidoking',
			forme: 'Reborn',
			spriteid: 'nidoking-alt',
			changesFrom: 'Nidoking',
			isNonstandard: 'Custom',
		},
	},
	nidoqueenalt: {
		base: 'nidoqueen',
		data: {
			name: 'Nidoqueen-Reborn',
			baseSpecies: 'Nidoqueen',
			forme: 'Reborn',
			spriteid: 'nidoqueen-alt',
			changesFrom: 'Nidoqueen',
			isNonstandard: 'Custom',
		},
	},
	ninetalesalt: {
		base: 'ninetales',
		data: {
			name: 'Ninetales-Reborn',
			baseSpecies: 'Ninetales',
			forme: 'Reborn',
			spriteid: 'ninetales-alt',
			changesFrom: 'Ninetales',
			isNonstandard: 'Custom',
		},
	},
	infernapealt: {
		base: 'infernape',
		data: {
			name: 'Infernape-Reborn',
			baseSpecies: 'Infernape',
			forme: 'Reborn',
			spriteid: 'infernape-alt',
			changesFrom: 'Infernape',
			isNonstandard: 'Custom',
		},
	},
	torterraalt: {
		base: 'torterra',
		data: {
			name: 'Torterra-Reborn',
			baseSpecies: 'Torterra',
			forme: 'Reborn',
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
	sandslashalt: {
		base: 'sandslash',
		data: {
			name: 'Sandslash-Reborn',
			baseSpecies: 'Sandslash',
			forme: 'Reborn',
			spriteid: 'sandslash-alt',
			changesFrom: 'Sandslash',
			isNonstandard: 'Custom',
		},
	},
	haxorusmega: {
		base: 'haxorus',
		data: {
			name: 'Haxorus-Mega',
			baseSpecies: 'Haxorus',
			forme: 'Mega',
			types: ['Dragon', 'Steel'],
			baseStats: {hp: 95, atk: 177, def: 131, spa: 60, spd: 110, spe: 97},
			abilities: {0: 'Raging Overlord'},
			battleOnly: 'Haxorus',
			requiredItem: 'Haxorite',
			spriteid: 'haxorus-alt',
			changesFrom: 'Haxorus',
			isNonstandard: 'Custom',
		},
	},
	arcaninealt: {
		base: 'arcanine',
		data: {
			name: 'Arcanine-Alt',
			baseSpecies: 'Arcanine',
			forme: 'Alt',
			spriteid: 'arcanine-alt',
			changesFrom: 'Arcanine',
			isNonstandard: 'Custom',
		},
	},
	crobatalt: {
		base: 'crobat',
		data: {
			name: 'Crobat-Alt',
			baseSpecies: 'Crobat',
			forme: 'Alt',
			spriteid: 'crobat-alt',
			changesFrom: 'Crobat',
			isNonstandard: 'Custom',
		},
	},
	corsolaalt: {
		base: 'corsola',
		data: {
			name: 'Corsola-Reborn',
			baseSpecies: 'Corsola',
			forme: 'Reborn',
			spriteid: 'corsola-alt',
			changesFrom: 'Corsola',
			isNonstandard: 'Custom',
		},
	},
	zangoosereborn: {
		base: 'zangoose',
		data: {
			name: 'Zangoose-Reborn',
			baseSpecies: 'Zangoose',
			forme: 'Reborn',
			spriteid: 'zangoose-reborn',
			changesFrom: 'Zangoose',
			isNonstandard: 'Custom',
		},
	},
	seviperreborn: {
		base: 'seviper',
		data: {
			name: 'Seviper-Reborn',
			baseSpecies: 'Seviper',
			forme: 'Reborn',
			spriteid: 'seviper-reborn',
			changesFrom: 'Seviper',
			isNonstandard: 'Custom',
		},
	},
	mukpulse: {
		base: 'muk',
		data: {
			name: 'Muk-Pulse',
			baseSpecies: 'Muk',
			forme: 'Pulse',
			types: ['Poison'],
			baseStats: {hp: 105, atk: 105, def: 75, spa: 108, spd: 167, spe: 40},
			abilities: {0: 'Pulse Waste'},
			requiredItem: 'Anomaly Core',
			isMega: true,
			changesFrom: 'Muk',
			spriteid: 'muk-pulse',
			isNonstandard: 'Custom',
		},
	},
	palossandrocky: {
		base: 'palossand',
		data: {
			name: 'Palossand-Rocky',
			baseSpecies: 'Palossand',
			forme: 'Rocky',
			types: ['Ghost', 'Rock'],
			baseStats: {hp: 100, atk: 75, def: 110, spa: 105, spd: 75, spe: 35},
			abilities: {0: 'Clear Body', 1: 'Solid Rock', H: 'Sand Stream'},
			spriteid: 'palossand-rocky',
			changesFrom: 'Palossand',
			isNonstandard: 'Custom',
			isCosmeticForme: true,
		},
	},
	palossandfiery: {
		base: 'palossand',
		data: {
			name: 'Palossand-Fiery',
			baseSpecies: 'Palossand',
			forme: 'Fiery',
			types: ['Ghost', 'Fire'],
			baseStats: {hp: 100, atk: 75, def: 110, spa: 105, spd: 75, spe: 35},
			abilities: {0: 'Soul Fire', 1: 'Steam Engine', H: 'Drought'},
			spriteid: 'palossand-fiery',
			changesFrom: 'Palossand',
			isNonstandard: 'Custom',
			isCosmeticForme: true,
		},
	},
	palossandicy: {
		base: 'palossand',
		data: {
			name: 'Palossand-Icy',
			baseSpecies: 'Palossand',
			forme: 'Icy',
			types: ['Ghost', 'Ice'],
			baseStats: {hp: 100, atk: 75, def: 110, spa: 105, spd: 75, spe: 35},
			abilities: {0: 'Bulletproof', 1: 'Ice Body', H: 'Snow Warning'},
			spriteid: 'palossand-icy',
			changesFrom: 'Palossand',
			isNonstandard: 'Custom',
			isCosmeticForme: true,
		},
	},
	tentacruelalt: {
		base: 'tentacruel',
		data: {
			name: 'Tentacruel-Reborn',
			baseSpecies: 'Tentacruel',
			forme: 'Reborn',
			spriteid: 'tentacruel-alt',
			changesFrom: 'Tentacruel',
			isNonstandard: 'Custom',
		},
	},
	emboaralt: {
		base: 'emboar',
		data: {
			name: 'Emboar-Reborn',
			baseSpecies: 'Emboar',
			forme: 'Reborn',
			spriteid: 'emboar-alt',
			otherFormes: ['Emboar-Mega-Reborn'],
			formeOrder: ['Emboar-Reborn', 'Emboar-Mega-Reborn'],
			changesFrom: 'Emboar',
			isNonstandard: 'Custom',
		},
	},
	emboarmegaalt: {
		base: 'emboarmega',
		data: {
			name: 'Emboar-Mega-Reborn',
			baseSpecies: 'Emboar',
			forme: 'Mega-Reborn',
			abilities: {0: 'Burning Ego'},
			battleOnly: 'Emboar-Reborn',
			changesFrom: 'Emboar-Reborn',
			requiredItem: 'Emboarite',
			spriteid: 'emboar-mega-alt',
			isNonstandard: 'Custom',
		},
	},
	roserademega: {
		base: 'roserade',
		data: {
			name: 'Roserade-Mega',
			baseSpecies: 'Roserade',
			forme: 'Mega',
			battleOnly: 'Roserade',
			requiredItem: 'Roseradite',
			abilities: {0: 'True Devotion'},
			spriteid: 'roserade-mega',
			changesFrom: 'Roserade',
			isNonstandard: 'Custom',
		},
	},
	cinderacemega: {
		base: 'cinderace',
		data: {
			name: 'Cinderace-Mega',
			baseSpecies: 'Cinderace',
			forme: 'Mega',
			types: ['Fire', 'Normal'],
			baseStats: {hp: 80, atk: 146, def: 95, spa: 75, spd: 85, spe: 149},
			abilities: {0: 'Perfect Striker'},
			requiredItem: 'Cinderite',
			battleOnly: 'Cinderace',
			spriteid: 'cinderace-mega',
			changesFrom: 'Cinderace',
			isNonstandard: 'Custom',
		},
	},
	clawitzermega: {
		base: 'clawitzer',
		data: {
			name: 'Clawitzer-Mega',
			baseSpecies: 'Clawitzer',
			forme: 'Mega',
			types: ['Water', 'Dragon'],
			baseStats: {hp: 71, atk: 93, def: 108, spa: 160, spd: 109, spe: 59},
			abilities: {0: 'Heavy Artillery'},
			requiredItem: 'Clawitzerite',
			battleOnly: 'Clawitzer',
			spriteid: 'clawitzer-mega',
			changesFrom: 'Clawitzer',
			isNonstandard: 'Custom',
		},
	},
	mightyenadeso: {
		base: 'mightyena',
		data: {
			name: 'Mightyena-Deso',
			baseSpecies: 'Mightyena',
			forme: 'Deso',
			spriteid: 'mightyena-deso',
			changesFrom: 'Mightyena',
			isNonstandard: 'Custom',
		},
	},
	toxicroakdeso: {
		base: 'toxicroak',
		data: {
			name: 'Toxicroak-Deso',
			baseSpecies: 'Toxicroak',
			forme: 'Deso',
			spriteid: 'toxicroak-deso',
			changesFrom: 'Toxicroak',
			isNonstandard: 'Custom',
		},
	},
	cinccinodeso: {
		base: 'cinccino',
		data: {
			name: 'Cinccino-Deso',
			baseSpecies: 'Cinccino',
			forme: 'Deso',
			spriteid: 'cinccino-deso',
			changesFrom: 'Cinccino',
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
	umbreonperfect: {
		base: 'umbreon',
		data: {
			name: 'Umbreon-Perfect',
			baseSpecies: 'Umbreon',
			forme: 'Perfect',
			spriteid: 'umbreon-perfect',
			changesFrom: 'Umbreon',
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
			abilities: {0: 'Tremor'},
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
	serperiorazzy: {
		base: 'serperior',
		data: {
			name: 'Serperior-Azzy',
			baseSpecies: 'Serperior',
			forme: 'Azzy',
			spriteid: 'serperior-azzy',
			changesFrom: 'Serperior',
			isNonstandard: 'Custom',
		},
	},
	galladeazzy: {
		base: 'gallade',
		data: {
			name: 'Gallade-Azzy',
			baseSpecies: 'Gallade',
			forme: 'Azzy',
			spriteid: 'gallade',
			otherFormes: ['Gallade-Mega-Azzy'],
			formeOrder: ['Gallade', 'Gallade-Mega', 'Gallade-Azzy', 'Gallade-Mega-Azzy'],
			changesFrom: 'Gallade',
			isNonstandard: 'Custom',
		},
	},
	grimmsnarlazzy: {
		base: 'grimmsnarl',
		data: {
			name: 'Grimmsnarl-Azzy',
			baseSpecies: 'Grimmsnarl',
			forme: 'Azzy',
			spriteid: 'grimmsnarl-azzy',
			changesFrom: 'Grimmsnarl',
			isNonstandard: 'Custom',
		},
	},
	grimmsnarlgmaxazzy: {
		base: 'grimmsnarlgmax',
		data: {
			name: 'Grimmsnarl-Gmax-Azzy',
			baseSpecies: 'Grimmsnarl-Gmax',
			forme: 'Gmax-Alt',
			spriteid: 'grimmsnarl-gmax-azzy',
			changesFrom: 'Grimmsnarl-Gmax',
			isNonstandard: 'Custom',
		},
	},
	gallademegaazzy: {
		base: 'gallademega',
		data: {
			name: 'Gallade-Mega-Azzy',
			baseSpecies: 'Gallade',
			forme: 'Mega-Azzy',
			spriteid: 'gallade-mega-azzy',
			abilities: {0: 'Sacred Edge'},
			requiredItem: 'Galladite',
			battleOnly: 'Gallade-Azzy',
			changesFrom: 'Gallade-Azzy',
			isNonstandard: 'Custom',
		},
	},
	mismagiusmega: {
		base: 'mismagius',
		data: {
			name: 'Mismagius-Mega',
			baseSpecies: 'Mismagius',
			forme: 'Mega',
			abilities: {0: 'Shadow Guard'},
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
	dipplingmax: {
		base: 'dipplin',
		data: {
			name: 'Dipplin-Gmax',
			baseSpecies: 'Dipplin',
			forme: 'Gmax',
			spriteid: 'dipplin-gmax',
			types: ['Grass', 'Dragon'],
			baseStats: {hp: 130, atk: 80, def: 115, spa: 100, spd: 85, spe: 40},
			abilities: {0: 'Sweet Resonance'},
			changesFrom: 'Dipplin',
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
	feraligatrgmax: {
		base: 'feraligatr',
		data: {
			name: 'Feraligatr-Gmax',
			baseSpecies: 'Feraligatr',
			forme: 'Gmax',
			spriteid: 'feraligatr-gmax',
			types: ['Water', 'Dark'],
			baseStats: {hp: 150, atk: 109, def: 100, spa: 59, spd: 93, spe: 78},
			abilities: {0: 'Tidal Jaw'},
			changesFrom: 'Feraligatr',
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
			abilities: {0: 'Execution'},
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
			abilities: {0: 'Argent Devotion'},
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
			abilities: {0: 'Aura Master'},
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
	scolipedeazzy: {
		base: 'scolipede',
		data: {
			name: 'Scolipede-Azzy',
			baseSpecies: 'Scolipede',
			forme: 'Azzy',
			spriteid: 'scolipede-azzy',
			otherFormes: ['Scolipede-Mega-Azzy'],
			formeOrder: ['Scolipede', 'Scolipede-Azzy', 'Scolipede-Mega', 'Scolipede-Mega-Azzy'],
			changesFrom: 'Scolipede',
			isNonstandard: 'Custom',
		},
	},
	scolipedemegaazzy: {
		base: 'scolipedemega',
		data: {
			name: 'Scolipede-Mega-Azzy',
			baseSpecies: 'Scolipede',
			forme: 'Mega-Azzy',
			spriteid: 'scolipede-mega-azzy',
			abilities: {0: 'Venom Bastion'},
			requiredItem: 'Scolipite',
			battleOnly: 'Scolipede-Azzy',
			changesFrom: 'Scolipede-Azzy',
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
			replaceAbilities: true,
			abilities: {0: 'Wrath Shield'},
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
	chimechomegay: {
		base: 'chimecho',
		data: {
			name: 'Chimecho-Mega-Y',
			baseSpecies: 'Chimecho',
			forme: 'Mega-Y',
			types: ['Psychic', 'Ghost'],
			baseStats: {hp: 75, atk: 50, def: 80, spa: 145, spd: 100, spe: 105},
			abilities: {0: 'Haunted Chime'},
			battleOnly: 'Chimecho',
			requiredItem: 'Chimechite',
			spriteid: 'chimecho-mega-y',
			changesFrom: 'Chimecho',
			isNonstandard: 'Custom',
		},
	},
	meganiummegay: {
		base: 'meganium',
		data: {
			name: 'Meganium-Mega-Y',
			baseSpecies: 'Meganium',
			forme: 'Mega-Y',
			types: ['Grass', 'Fire'],
			baseStats: {hp: 80, atk: 82, def: 130, spa: 113, spd: 130, spe: 90},
			abilities: {0: 'Blooming Sun'},
			battleOnly: 'Meganium',
			requiredItem: 'Meganiumite',
			spriteid: 'meganium-mega-y',
			changesFrom: 'Meganium',
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
	charizardalt: {
		base: 'charizard',
		data: {
			name: 'Charizard-Alt',
			baseSpecies: 'Charizard',
			forme: 'Alt',
			spriteid: 'charizard',
			otherFormes: ['Charizard-Mega-X-Alt'],
			formeOrder: ['Charizard-Alt', 'Charizard-Mega-X-Alt'],
			changesFrom: 'Charizard',
			isNonstandard: 'Custom',
		},
	},
	charizardmegaxalt: {
		base: 'charizardmegax',
		data: {
			name: 'Charizard-Mega-X-Alt',
			baseSpecies: 'Charizard',
			forme: 'Mega-X-Alt',
			abilities: {0: 'Atrocity'},
			battleOnly: 'Charizard-Alt',
			changesFrom: 'Charizard-Alt',
			requiredItem: 'Charizardite X',
			isNonstandard: 'Custom',
		},
	},
	alakazamalt: {
		base: 'alakazam',
		data: {
			name: 'Alakazam-Alt',
			baseSpecies: 'Alakazam',
			forme: 'Alt',
			spriteid: 'alakazam-alt',
			otherFormes: ['Alakazam-Mega-Alt'],
			formeOrder: ['Alakazam-Alt', 'Alakazam-Mega-Alt'],
			changesFrom: 'Alakazam',
			isNonstandard: 'Custom',
		},
	},
	alakazammegaalt: {
		base: 'alakazammega',
		data: {
			name: 'Alakazam-Mega-Alt',
			baseSpecies: 'Alakazam',
			forme: 'Mega-Alt',
			abilities: {0: 'Perfect Foresight'},
			battleOnly: 'Alakazam-Alt',
			requiredItem: 'Alakazite',
			changesFrom: 'Alakazam-Alt',
			isNonstandard: 'Custom',
		},
	},
	ledianmega: {
		base: 'ledian',
		data: {
			name: 'Ledian-Mega',
			baseSpecies: 'Ledian',
			forme: 'Mega',
			types: ['Bug', 'Fighting'],
			baseStats: {hp: 85, atk: 65, def: 90, spa: 95, spd: 90, spe: 115},
			abilities: {0: 'Star Boxer'},
			requiredItem: 'Ledianite',
			battleOnly: 'Ledian',
			spriteid: 'ledian-mega',
			changesFrom: 'Ledian',
			isNonstandard: 'Custom',
		},
	},
	ariadosmega: {
		base: 'ariados',
		data: {
			name: 'Ariados-Mega',
			baseSpecies: 'Ariados',
			forme: 'Mega',
			types: ['Bug', 'Poison'],
			baseStats: {hp: 80, atk: 130, def: 120, spa: 40, spd: 120, spe: 85},
			abilities: {0: 'Silken Decoy'},
			requiredItem: 'Aridiate',
			battleOnly: 'Ariados',
			spriteid: 'ariados-mega',
			changesFrom: 'Ariados',
			isNonstandard: 'Custom',
		},
	},
	banettemegaz: {
		base: 'banettemega',
		data: {
			name: 'Banette-Mega-Z',
			baseSpecies: 'Banette',
			forme: 'Mega-Z',
			types: ['Ghost', 'Steel'],
			baseStats: {hp: 84, atk: 105, def: 110, spa: 90, spd: 100, spe: 151},
			abilities: {0: 'Cursed Armament'},
			requiredItem: 'Banettite',
			battleOnly: 'Banette',
			spriteid: 'banette-megaz',
			changesFrom: 'Banette',
			isNonstandard: 'Custom',
		},
	},
	arbokmegax: {
		base: 'arbok',
		data: {
			name: 'Arbok-Mega-X',
			baseSpecies: 'Arbok',
			forme: 'Mega-X',
			types: ['Poison', 'Dark'],
			baseStats: {hp: 80, atk: 130, def: 100, spa: 60, spd: 140, spe: 90},
			abilities: {0: 'Neurotoxin'},
			requiredItem: 'Arbokite',
			battleOnly: 'Arbok',
			spriteid: 'arbok-mega-x',
			changesFrom: 'Arbok',
			isNonstandard: 'Custom',
		},
	},
	arbokmegay: {
		base: 'arbok',
		data: {
			name: 'Arbok-Mega-Y',
			baseSpecies: 'Arbok',
			forme: 'Mega-Y',
			types: ['Poison', 'Fire'],
			baseStats: {hp: 80, atk: 65, def: 110, spa: 135, spd: 90, spe: 120},
			abilities: {0: 'Pattern Shift'},
			requiredItem: 'Arbokite',
			battleOnly: 'Arbok',
			spriteid: 'arbok-mega-y',
			changesFrom: 'Arbok',
			isNonstandard: 'Custom',
		},
	},
};

// Official menu icons use their own sheet so custom icon slots remain unchanged.
const OFFICIAL_MENU_ICON_INDEXES: {[id: string]: number} = {"bulbasaur":1,"ivysaur":2,"venusaur":3,"venusaurmega":1320,"venusaurgmax":1397,"charmander":4,"charmeleon":5,"charizard":6,"charizardmegax":1321,"charizardmegay":1322,"charizardgmax":1370,"squirtle":7,"wartortle":8,"blastoise":9,"blastoisemega":1323,"blastoisegmax":1398,"caterpie":10,"metapod":11,"butterfree":12,"butterfreegmax":1371,"weedle":13,"kakuna":14,"beedrill":15,"beedrillmega":1324,"pidgey":16,"pidgeotto":17,"pidgeot":18,"pidgeotmega":1325,"rattata":19,"rattataalola":1151,"raticate":20,"raticatealola":1152,"raticatealolatotem":1152,"spearow":21,"fearow":22,"ekans":23,"arbok":24,"pikachu":25,"pikachucosplay":1039,"pikachurockstar":1038,"pikachubelle":1034,"pikachupopstar":1037,"pikachuphd":1036,"pikachulibre":1035,"pikachuoriginal":1185,"pikachuhoenn":1186,"pikachusinnoh":1187,"pikachuunova":1188,"pikachukalos":1189,"pikachualola":1190,"pikachupartner":1191,"pikachustarter":1196,"pikachugmax":1372,"pikachuworld":1231,"raichu":26,"raichualola":1153,"raichumegax":1430,"raichumegay":1431,"sandshrew":27,"sandshrewalola":1154,"sandslash":28,"sandslashalola":1155,"nidoranf":29,"nidorina":30,"nidoqueen":31,"nidoranm":32,"nidorino":33,"nidoking":34,"clefairy":35,"clefable":36,"clefablemega":1404,"vulpix":37,"vulpixalola":1156,"ninetales":38,"ninetalesalola":1157,"jigglypuff":39,"wigglytuff":40,"zubat":41,"golbat":42,"oddish":43,"gloom":44,"vileplume":45,"paras":46,"parasect":47,"venonat":48,"venomoth":49,"diglett":50,"diglettalola":1158,"dugtrio":51,"dugtrioalola":1159,"meowth":52,"meowthalola":1160,"meowthgalar":1198,"meowthgmax":1373,"persian":53,"persianalola":1161,"psyduck":54,"golduck":55,"mankey":56,"primeape":57,"growlithe":58,"growlithehisui":1238,"arcanine":59,"arcaninehisui":1239,"poliwag":60,"poliwhirl":61,"poliwrath":62,"abra":63,"kadabra":64,"alakazam":65,"alakazammega":1326,"machop":66,"machoke":67,"machamp":68,"machampgmax":1374,"bellsprout":69,"weepinbell":70,"victreebel":71,"victreebelmega":1405,"tentacool":72,"tentacruel":73,"geodude":74,"geodudealola":1162,"graveler":75,"graveleralola":1163,"golem":76,"golemalola":1164,"ponyta":77,"ponytagalar":1199,"rapidash":78,"rapidashgalar":1200,"slowpoke":79,"slowpokegalar":1228,"slowbro":80,"slowbromega":1327,"slowbrogalar":1229,"magnemite":81,"magneton":82,"farfetchd":83,"farfetchdgalar":1201,"doduo":84,"dodrio":85,"seel":86,"dewgong":87,"grimer":88,"grimeralola":1165,"muk":89,"mukalola":1166,"shellder":90,"cloyster":91,"gastly":92,"haunter":93,"gengar":94,"gengarmega":1328,"gengargmax":1375,"onix":95,"drowzee":96,"hypno":97,"krabby":98,"kingler":99,"kinglergmax":1376,"voltorb":100,"voltorbhisui":1240,"electrode":101,"electrodehisui":1241,"exeggcute":102,"exeggutor":103,"exeggutoralola":1167,"cubone":104,"marowak":105,"marowakalola":1168,"marowakalolatotem":1168,"hitmonlee":106,"hitmonchan":107,"lickitung":108,"koffing":109,"weezing":110,"weezinggalar":1202,"rhyhorn":111,"rhydon":112,"chansey":113,"tangela":114,"kangaskhan":115,"kangaskhanmega":1329,"horsea":116,"seadra":117,"goldeen":118,"seaking":119,"staryu":120,"starmie":121,"starmiemega":1406,"mrmime":122,"mrmimegalar":1203,"scyther":123,"jynx":124,"electabuzz":125,"magmar":126,"pinsir":127,"pinsirmega":1330,"tauros":128,"taurospaldeacombat":1256,"taurospaldeablaze":1257,"taurospaldeaaqua":1258,"magikarp":129,"gyarados":130,"gyaradosmega":1331,"lapras":131,"laprasgmax":1377,"ditto":132,"eevee":133,"eeveestarter":1197,"eeveegmax":1378,"vaporeon":134,"jolteon":135,"flareon":136,"porygon":137,"omanyte":138,"omastar":139,"kabuto":140,"kabutops":141,"aerodactyl":142,"aerodactylmega":1332,"snorlax":143,"snorlaxgmax":1379,"articuno":144,"articunogalar":1232,"zapdos":145,"zapdosgalar":1233,"moltres":146,"moltresgalar":1234,"dratini":147,"dragonair":148,"dragonite":149,"dragonitemega":1407,"mewtwo":150,"mewtwomegax":1333,"mewtwomegay":1334,"mew":151,"chikorita":152,"bayleef":153,"meganium":154,"meganiummega":1408,"cyndaquil":155,"quilava":156,"typhlosion":157,"typhlosionhisui":1242,"totodile":158,"croconaw":159,"feraligatr":160,"feraligatrmega":1409,"sentret":161,"furret":162,"hoothoot":163,"noctowl":164,"ledyba":165,"ledian":166,"spinarak":167,"ariados":168,"crobat":169,"chinchou":170,"lanturn":171,"pichu":172,"pichuspikyeared":172,"cleffa":173,"igglybuff":174,"togepi":175,"togetic":176,"natu":177,"xatu":178,"mareep":179,"flaaffy":180,"ampharos":181,"ampharosmega":1335,"bellossom":182,"marill":183,"azumarill":184,"sudowoodo":185,"politoed":186,"hoppip":187,"skiploom":188,"jumpluff":189,"aipom":190,"sunkern":191,"sunflora":192,"yanma":193,"wooper":194,"wooperpaldea":1259,"quagsire":195,"espeon":196,"umbreon":197,"murkrow":198,"slowking":199,"slowkinggalar":1235,"misdreavus":200,"unown":201,"wobbuffet":202,"girafarig":203,"pineco":204,"forretress":205,"dunsparce":206,"gligar":207,"steelix":208,"steelixmega":1336,"snubbull":209,"granbull":210,"qwilfish":211,"qwilfishhisui":1243,"scizor":212,"scizormega":1337,"shuckle":213,"heracross":214,"heracrossmega":1338,"sneasel":215,"sneaselhisui":1244,"teddiursa":216,"ursaring":217,"slugma":218,"magcargo":219,"swinub":220,"piloswine":221,"corsola":222,"corsolagalar":1204,"remoraid":223,"octillery":224,"delibird":225,"mantine":226,"skarmory":227,"skarmorymega":1410,"houndour":228,"houndoom":229,"houndoommega":1339,"kingdra":230,"phanpy":231,"donphan":232,"porygon2":233,"stantler":234,"smeargle":235,"tyrogue":236,"hitmontop":237,"smoochum":238,"elekid":239,"magby":240,"miltank":241,"blissey":242,"raikou":243,"entei":244,"suicune":245,"larvitar":246,"pupitar":247,"tyranitar":248,"tyranitarmega":1340,"lugia":249,"hooh":250,"celebi":251,"treecko":252,"grovyle":253,"sceptile":254,"sceptilemega":1341,"torchic":255,"combusken":256,"blaziken":257,"blazikenmega":1342,"mudkip":258,"marshtomp":259,"swampert":260,"swampertmega":1343,"poochyena":261,"mightyena":262,"zigzagoon":263,"zigzagoongalar":1205,"linoone":264,"linoonegalar":1206,"wurmple":265,"silcoon":266,"beautifly":267,"cascoon":268,"dustox":269,"lotad":270,"lombre":271,"ludicolo":272,"seedot":273,"nuzleaf":274,"shiftry":275,"taillow":276,"swellow":277,"wingull":278,"pelipper":279,"ralts":280,"kirlia":281,"gardevoir":282,"gardevoirmega":1344,"surskit":283,"masquerain":284,"shroomish":285,"breloom":286,"slakoth":287,"vigoroth":288,"slaking":289,"nincada":290,"ninjask":291,"shedinja":292,"whismur":293,"loudred":294,"exploud":295,"makuhita":296,"hariyama":297,"azurill":298,"nosepass":299,"skitty":300,"delcatty":301,"sableye":302,"sableyemega":1345,"mawile":303,"mawilemega":1346,"aron":304,"lairon":305,"aggron":306,"aggronmega":1347,"meditite":307,"medicham":308,"medichammega":1348,"electrike":309,"manectric":310,"manectricmega":1349,"plusle":311,"minun":312,"volbeat":313,"illumise":314,"roselia":315,"gulpin":316,"swalot":317,"carvanha":318,"sharpedo":319,"sharpedomega":1350,"wailmer":320,"wailord":321,"numel":322,"camerupt":323,"cameruptmega":1351,"torkoal":324,"spoink":325,"grumpig":326,"spinda":327,"trapinch":328,"vibrava":329,"flygon":330,"cacnea":331,"cacturne":332,"swablu":333,"altaria":334,"altariamega":1352,"zangoose":335,"seviper":336,"lunatone":337,"solrock":338,"barboach":339,"whiscash":340,"corphish":341,"crawdaunt":342,"baltoy":343,"claydol":344,"lileep":345,"cradily":346,"anorith":347,"armaldo":348,"feebas":349,"milotic":350,"castform":351,"castformsunny":1069,"castformrainy":1067,"castformsnowy":1068,"kecleon":352,"shuppet":353,"banette":354,"banettemega":1353,"duskull":355,"dusclops":356,"tropius":357,"chimecho":358,"chimechomega":1432,"absol":359,"absolmega":1354,"absolmegaz":1433,"wynaut":360,"snorunt":361,"glalie":362,"glaliemega":1355,"spheal":363,"sealeo":364,"walrein":365,"clamperl":366,"huntail":367,"gorebyss":368,"relicanth":369,"luvdisc":370,"bagon":371,"shelgon":372,"salamence":373,"salamencemega":1356,"beldum":374,"metang":375,"metagross":376,"metagrossmega":1357,"regirock":377,"regice":378,"registeel":379,"latias":380,"latiasmega":1358,"latios":381,"latiosmega":1359,"kyogre":382,"kyogreprimal":1360,"groudon":383,"groudonprimal":1361,"rayquaza":384,"rayquazamega":1362,"jirachi":385,"deoxys":386,"deoxysattack":1070,"deoxysdefense":1071,"deoxysspeed":1072,"turtwig":387,"grotle":388,"torterra":389,"chimchar":390,"monferno":391,"infernape":392,"piplup":393,"prinplup":394,"empoleon":395,"starly":396,"staravia":397,"staraptor":398,"staraptormega":1434,"bidoof":399,"bibarel":400,"kricketot":401,"kricketune":402,"shinx":403,"luxio":404,"luxray":405,"budew":406,"roserade":407,"cranidos":408,"rampardos":409,"shieldon":410,"bastiodon":411,"burmy":412,"wormadam":413,"wormadamsandy":1075,"wormadamtrash":1076,"mothim":414,"combee":415,"vespiquen":416,"pachirisu":417,"buizel":418,"floatzel":419,"cherubi":420,"cherrim":421,"cherrimsunshine":1077,"shellos":422,"gastrodon":423,"ambipom":424,"drifloon":425,"drifblim":426,"buneary":427,"lopunny":428,"lopunnymega":1363,"mismagius":429,"honchkrow":430,"glameow":431,"purugly":432,"chingling":433,"stunky":434,"skuntank":435,"bronzor":436,"bronzong":437,"bonsly":438,"mimejr":439,"happiny":440,"chatot":441,"spiritomb":442,"gible":443,"gabite":444,"garchomp":445,"garchompmega":1364,"garchompmegaz":1435,"munchlax":446,"riolu":447,"lucario":448,"lucariomega":1365,"lucariomegaz":1436,"hippopotas":449,"hippowdon":450,"skorupi":451,"drapion":452,"croagunk":453,"toxicroak":454,"carnivine":455,"finneon":456,"lumineon":457,"mantyke":458,"snover":459,"abomasnow":460,"abomasnowmega":1366,"weavile":461,"magnezone":462,"lickilicky":463,"rhyperior":464,"tangrowth":465,"electivire":466,"magmortar":467,"togekiss":468,"yanmega":469,"leafeon":470,"glaceon":471,"gliscor":472,"mamoswine":473,"porygonz":474,"gallade":475,"gallademega":1367,"probopass":476,"dusknoir":477,"froslass":478,"froslassmega":1411,"rotom":479,"rotomheat":1082,"rotomwash":1084,"rotomfrost":1081,"rotomfan":1080,"rotommow":1083,"uxie":480,"mesprit":481,"azelf":482,"dialga":483,"dialgaorigin":1269,"palkia":484,"palkiaorigin":1270,"heatran":485,"heatranmega":1437,"regigigas":486,"giratina":487,"giratinaorigin":1085,"cresselia":488,"phione":489,"manaphy":490,"darkrai":491,"darkraimega":1438,"shaymin":492,"shayminsky":1086,"arceus":493,"arceusbug":1278,"arceusdark":1279,"arceusdragon":1280,"arceuselectric":1281,"arceusfairy":1282,"arceusfighting":1283,"arceusfire":1284,"arceusflying":1285,"arceusghost":1286,"arceusgrass":1287,"arceusground":1288,"arceusice":1289,"arceuspoison":1290,"arceuspsychic":1291,"arceusrock":1292,"arceussteel":1293,"arceuswater":1294,"victini":494,"snivy":495,"servine":496,"serperior":497,"tepig":498,"pignite":499,"emboar":500,"emboarmega":1412,"oshawott":501,"dewott":502,"samurott":503,"samurotthisui":1245,"patrat":504,"watchog":505,"lillipup":506,"herdier":507,"stoutland":508,"purrloin":509,"liepard":510,"pansage":511,"simisage":512,"pansear":513,"simisear":514,"panpour":515,"simipour":516,"munna":517,"musharna":518,"pidove":519,"tranquill":520,"unfezant":521,"blitzle":522,"zebstrika":523,"roggenrola":524,"boldore":525,"gigalith":526,"woobat":527,"swoobat":528,"drilbur":529,"excadrill":530,"excadrillmega":1413,"audino":531,"audinomega":1368,"timburr":532,"gurdurr":533,"conkeldurr":534,"tympole":535,"palpitoad":536,"seismitoad":537,"throh":538,"sawk":539,"sewaddle":540,"swadloon":541,"leavanny":542,"venipede":543,"whirlipede":544,"scolipede":545,"scolipedemega":1414,"cottonee":546,"whimsicott":547,"petilil":548,"lilligant":549,"lilliganthisui":1246,"basculin":550,"basculinbluestriped":1088,"basculinwhitestriped":1271,"sandile":551,"krokorok":552,"krookodile":553,"darumaka":554,"darumakagalar":1207,"darmanitan":555,"darmanitanzen":1089,"darmanitangalar":1208,"darmanitangalarzen":1209,"maractus":556,"dwebble":557,"crustle":558,"scraggy":559,"scrafty":560,"scraftymega":1415,"sigilyph":561,"yamask":562,"yamaskgalar":1210,"cofagrigus":563,"tirtouga":564,"carracosta":565,"archen":566,"archeops":567,"trubbish":568,"garbodor":569,"garbodorgmax":1380,"zorua":570,"zoruahisui":1247,"zoroark":571,"zoroarkhisui":1248,"minccino":572,"cinccino":573,"gothita":574,"gothorita":575,"gothitelle":576,"solosis":577,"duosion":578,"reuniclus":579,"ducklett":580,"swanna":581,"vanillite":582,"vanillish":583,"vanilluxe":584,"deerling":585,"sawsbuck":586,"emolga":587,"karrablast":588,"escavalier":589,"foongus":590,"amoonguss":591,"frillish":592,"jellicent":593,"alomomola":594,"joltik":595,"galvantula":596,"ferroseed":597,"ferrothorn":598,"klink":599,"klang":600,"klinklang":601,"tynamo":602,"eelektrik":603,"eelektross":604,"eelektrossmega":1416,"elgyem":605,"beheeyem":606,"litwick":607,"lampent":608,"chandelure":609,"chandeluremega":1417,"axew":610,"fraxure":611,"haxorus":612,"cubchoo":613,"beartic":614,"cryogonal":615,"shelmet":616,"accelgor":617,"stunfisk":618,"stunfiskgalar":1211,"mienfoo":619,"mienshao":620,"druddigon":621,"golett":622,"golurk":623,"golurkmega":1439,"pawniard":624,"bisharp":625,"bouffalant":626,"rufflet":627,"braviary":628,"braviaryhisui":1249,"vullaby":629,"mandibuzz":630,"heatmor":631,"durant":632,"deino":633,"zweilous":634,"hydreigon":635,"larvesta":636,"volcarona":637,"cobalion":638,"terrakion":639,"virizion":640,"tornadus":641,"tornadustherian":1098,"thundurus":642,"thundurustherian":1099,"reshiram":643,"zekrom":644,"landorus":645,"landorustherian":1100,"kyurem":646,"kyuremblack":1101,"kyuremwhite":1102,"keldeo":647,"keldeoresolute":1103,"meloetta":648,"meloettapirouette":1104,"genesect":649,"genesectdouse":1295,"genesectshock":1296,"genesectburn":1297,"genesectchill":1298,"chespin":650,"quilladin":651,"chesnaught":652,"chesnaughtmega":1418,"fennekin":653,"braixen":654,"delphox":655,"delphoxmega":1419,"froakie":656,"frogadier":657,"greninja":658,"greninjabond":658,"greninjaash":1169,"greninjamega":1420,"bunnelby":659,"diggersby":660,"fletchling":661,"fletchinder":662,"talonflame":663,"scatterbug":664,"spewpa":665,"vivillon":666,"vivillonfancy":1108,"vivillonpokeball":1117,"litleo":667,"pyroar":668,"pyroarmega":1421,"flabebe":669,"floette":670,"floetteeternal":1130,"floettemega":1422,"florges":671,"skiddo":672,"gogoat":673,"pancham":674,"pangoro":675,"furfrou":676,"espurr":677,"meowstic":678,"meowsticf":1147,"meowsticmmega":1440,"meowsticfmega":1440,"honedge":679,"doublade":680,"aegislash":681,"aegislashblade":1148,"spritzee":682,"aromatisse":683,"swirlix":684,"slurpuff":685,"inkay":686,"malamar":687,"malamarmega":1423,"binacle":688,"barbaracle":689,"barbaraclemega":1424,"skrelp":690,"dragalge":691,"dragalgemega":1425,"clauncher":692,"clawitzer":693,"helioptile":694,"heliolisk":695,"tyrunt":696,"tyrantrum":697,"amaura":698,"aurorus":699,"sylveon":700,"hawlucha":701,"hawluchamega":1426,"dedenne":702,"carbink":703,"goomy":704,"sliggoo":705,"sliggoohisui":1250,"goodra":706,"goodrahisui":1251,"klefki":707,"phantump":708,"trevenant":709,"pumpkaboo":710,"pumpkaboosmall":710,"pumpkaboolarge":710,"pumpkaboosuper":710,"gourgeist":711,"gourgeistsmall":711,"gourgeistlarge":711,"gourgeistsuper":711,"bergmite":712,"avalugg":713,"avalugghisui":1252,"noibat":714,"noivern":715,"xerneas":716,"xerneasneutral":1149,"yveltal":717,"zygarde":718,"zygarde10":1170,"zygardecomplete":1171,"zygardemega":1427,"diancie":719,"dianciemega":1369,"hoopa":720,"hoopaunbound":1150,"volcanion":721,"rowlet":722,"dartrix":723,"decidueye":724,"decidueyehisui":1253,"litten":725,"torracat":726,"incineroar":727,"popplio":728,"brionne":729,"primarina":730,"pikipek":731,"trumbeak":732,"toucannon":733,"yungoos":734,"gumshoos":735,"gumshoostotem":735,"grubbin":736,"charjabug":737,"vikavolt":738,"vikavolttotem":738,"crabrawler":739,"crabominable":740,"crabominablemega":1441,"oricorio":741,"oricoriopompom":1172,"oricoriopau":1173,"oricoriosensu":1174,"cutiefly":742,"ribombee":743,"ribombeetotem":743,"rockruff":744,"rockruffdusk":744,"lycanroc":745,"lycanrocmidnight":1175,"lycanrocdusk":1192,"wishiwashi":746,"wishiwashischool":1176,"mareanie":747,"toxapex":748,"mudbray":749,"mudsdale":750,"dewpider":751,"araquanid":752,"araquanidtotem":752,"fomantis":753,"lurantis":754,"lurantistotem":754,"morelull":755,"shiinotic":756,"salandit":757,"salazzle":758,"salazzletotem":758,"stufful":759,"bewear":760,"bounsweet":761,"steenee":762,"tsareena":763,"comfey":764,"oranguru":765,"passimian":766,"wimpod":767,"golisopod":768,"golisopodmega":1442,"sandygast":769,"palossand":770,"pyukumuku":771,"typenull":772,"silvally":773,"silvallybug":1299,"silvallydark":1300,"silvallydragon":1301,"silvallyelectric":1302,"silvallyfairy":1303,"silvallyfighting":1304,"silvallyfire":1305,"silvallyflying":1306,"silvallyghost":1307,"silvallygrass":1308,"silvallyground":1309,"silvallyice":1310,"silvallypoison":1311,"silvallypsychic":1312,"silvallyrock":1313,"silvallysteel":1314,"silvallywater":1315,"minior":774,"miniormeteor":1177,"komala":775,"turtonator":776,"togedemaru":777,"togedemarutotem":777,"mimikyu":778,"mimikyubusted":778,"mimikyutotem":778,"mimikyubustedtotem":778,"bruxish":779,"drampa":780,"drampamega":1428,"dhelmise":781,"jangmoo":782,"hakamoo":783,"kommoo":784,"kommoototem":784,"tapukoko":785,"tapulele":786,"tapubulu":787,"tapufini":788,"cosmog":789,"cosmoem":790,"solgaleo":791,"lunala":792,"nihilego":793,"buzzwole":794,"pheromosa":795,"xurkitree":796,"celesteela":797,"kartana":798,"guzzlord":799,"necrozma":800,"necrozmaduskmane":1193,"necrozmadawnwings":1194,"necrozmaultra":1195,"magearna":801,"magearnaoriginal":1184,"magearnamega":1443,"magearnaoriginalmega":1444,"marshadow":802,"poipole":803,"naganadel":804,"stakataka":805,"blacephalon":806,"zeraora":807,"zeraoramega":1445,"meltan":808,"melmetal":809,"melmetalgmax":1381,"grookey":810,"thwackey":811,"rillaboom":812,"rillaboomgmax":1399,"scorbunny":813,"raboot":814,"cinderace":815,"cinderacegmax":1400,"sobble":816,"drizzile":817,"inteleon":818,"inteleongmax":1401,"skwovet":819,"greedent":820,"rookidee":821,"corvisquire":822,"corviknight":823,"corviknightgmax":1382,"blipbug":824,"dottler":825,"orbeetle":826,"orbeetlegmax":1383,"nickit":827,"thievul":828,"gossifleur":829,"eldegoss":830,"wooloo":831,"dubwool":832,"chewtle":833,"drednaw":834,"drednawgmax":1384,"yamper":835,"boltund":836,"rolycoly":837,"carkol":838,"coalossal":839,"coalossalgmax":1385,"applin":840,"flapple":841,"flapplegmax":1386,"appletun":842,"appletungmax":1387,"silicobra":843,"sandaconda":844,"sandacondagmax":1388,"cramorant":845,"cramorantgulping":1212,"cramorantgorging":1213,"arrokuda":846,"barraskewda":847,"toxel":848,"toxtricity":849,"toxtricitylowkey":1214,"toxtricitygmax":1389,"toxtricitylowkeygmax":1389,"sizzlipede":850,"centiskorch":851,"centiskorchgmax":1390,"clobbopus":852,"grapploct":853,"sinistea":854,"sinisteaantique":854,"polteageist":855,"polteageistantique":855,"hatenna":856,"hattrem":857,"hatterene":858,"hatterenegmax":1391,"impidimp":859,"morgrem":860,"grimmsnarl":861,"grimmsnarlgmax":1392,"obstagoon":862,"perrserker":863,"cursola":864,"sirfetchd":865,"mrrime":866,"runerigus":867,"milcery":868,"alcremie":869,"alcremiegmax":1393,"falinks":870,"falinksmega":1429,"pincurchin":871,"snom":872,"frosmoth":873,"stonjourner":874,"eiscue":875,"eiscuenoice":1223,"indeedee":876,"indeedeef":1224,"morpeko":877,"morpekohangry":1225,"cufant":878,"copperajah":879,"copperajahgmax":1394,"dracozolt":880,"arctozolt":881,"dracovish":882,"arctovish":883,"duraludon":884,"duraludongmax":1395,"dreepy":885,"drakloak":886,"dragapult":887,"zacian":888,"zaciancrowned":1226,"zamazenta":889,"zamazentacrowned":1227,"eternatus":890,"eternatuseternamax":1396,"kubfu":891,"urshifu":892,"urshifurapidstrike":892,"urshifugmax":1402,"urshifurapidstrikegmax":1403,"zarude":893,"zarudedada":1230,"regieleki":894,"regidrago":895,"glastrier":896,"spectrier":897,"calyrex":898,"calyrexice":1236,"calyrexshadow":1237,"wyrdeer":899,"kleavor":900,"ursaluna":901,"ursalunabloodmoon":1272,"basculegion":902,"basculegionf":1254,"sneasler":903,"overqwil":904,"enamorus":905,"enamorustherian":1255,"sprigatito":906,"floragato":907,"meowscarada":908,"fuecoco":909,"crocalor":910,"skeledirge":911,"quaxly":912,"quaxwell":913,"quaquaval":914,"lechonk":915,"oinkologne":916,"oinkolognef":1260,"tarountula":917,"spidops":918,"nymble":919,"lokix":920,"pawmi":921,"pawmo":922,"pawmot":923,"tandemaus":924,"maushold":925,"mausholdfour":1262,"fidough":926,"dachsbun":927,"smoliv":928,"dolliv":929,"arboliva":930,"squawkabilly":931,"squawkabillyblue":1265,"squawkabillyyellow":1266,"squawkabillywhite":1267,"nacli":932,"naclstack":933,"garganacl":934,"charcadet":935,"armarouge":936,"ceruledge":937,"tadbulb":938,"bellibolt":939,"wattrel":940,"kilowattrel":941,"maschiff":942,"mabosstiff":943,"shroodle":944,"grafaiai":945,"bramblin":946,"brambleghast":947,"toedscool":948,"toedscruel":949,"klawf":950,"capsakid":951,"scovillain":952,"scovillainmega":1446,"rellor":953,"rabsca":954,"flittle":955,"espathra":956,"tinkatink":957,"tinkatuff":958,"tinkaton":959,"wiglett":960,"wugtrio":961,"bombirdier":962,"finizen":963,"palafin":964,"palafinhero":1261,"varoom":965,"revavroom":966,"cyclizar":967,"orthworm":968,"glimmet":969,"glimmora":970,"glimmoramega":1447,"greavard":971,"houndstone":972,"flamigo":973,"cetoddle":974,"cetitan":975,"veluza":976,"dondozo":977,"tatsugiri":978,"tatsugiridroopy":1263,"tatsugiristretchy":1264,"tatsugiricurlymega":1448,"tatsugiridroopymega":1449,"tatsugiristretchymega":1450,"annihilape":979,"clodsire":980,"farigiraf":981,"dudunsparce":982,"dudunsparcethreesegment":982,"kingambit":983,"greattusk":984,"screamtail":985,"brutebonnet":986,"fluttermane":987,"slitherwing":988,"sandyshocks":989,"irontreads":990,"ironbundle":991,"ironhands":992,"ironjugulis":993,"ironmoth":994,"ironthorns":995,"frigibax":996,"arctibax":997,"baxcalibur":998,"baxcaliburmega":1451,"gimmighoul":999,"gimmighoulroaming":1268,"gholdengo":1000,"wochien":1001,"chienpao":1002,"tinglu":1003,"chiyu":1004,"roaringmoon":1005,"ironvaliant":1006,"koraidon":1007,"miraidon":1008,"walkingwake":1009,"ironleaves":1010,"dipplin":1011,"poltchageist":1012,"poltchageistartisan":1012,"sinistcha":1013,"sinistchamasterpiece":1013,"okidogi":1014,"munkidori":1015,"fezandipiti":1016,"ogerpon":1017,"ogerponwellspring":1273,"ogerponhearthflame":1274,"ogerponcornerstone":1275,"ogerpontealtera":1017,"ogerponwellspringtera":1273,"ogerponhearthflametera":1274,"ogerponcornerstonetera":1275,"archaludon":1018,"hydrapple":1019,"gougingfire":1020,"ragingbolt":1021,"ironboulder":1022,"ironcrown":1023,"terapagos":1024,"terapagosterastal":1276,"terapagosstellar":1277,"pecharunt":1025,"egg":1033,"unownexclamation":1040,"unownquestion":1041,"unownb":1042,"unownc":1043,"unownd":1044,"unowne":1045,"unownf":1046,"unowng":1047,"unownh":1048,"unowni":1049,"unownj":1050,"unownk":1051,"unownl":1052,"unownm":1053,"unownn":1054,"unowno":1055,"unownp":1056,"unownq":1057,"unownr":1058,"unowns":1059,"unownt":1060,"unownu":1061,"unownv":1062,"unownw":1063,"unownx":1064,"unowny":1065,"unownz":1066,"burmysandy":1073,"burmytrash":1074,"shelloseast":1078,"gastrodoneast":1079,"unfezantf":1087,"deerlingautumn":1090,"deerlingsummer":1091,"deerlingwinter":1092,"sawsbuckautumn":1093,"sawsbucksummer":1094,"sawsbuckwinter":1095,"frillishf":1096,"jellicentf":1097,"vivillonarchipelago":1105,"vivilloncontinental":1106,"vivillonelegant":1107,"vivillongarden":1109,"vivillonhighplains":1110,"vivillonicysnow":1111,"vivillonjungle":1112,"vivillonmarine":1113,"vivillonmodern":1114,"vivillonmonsoon":1115,"vivillonocean":1116,"vivillonpolar":1118,"vivillonriver":1119,"vivillonsandstorm":1120,"vivillonsavanna":1121,"vivillonsun":1122,"vivillontundra":1123,"pyroarf":1124,"flabebeblue":1125,"flabebeorange":1126,"flabebewhite":1127,"flabebeyellow":1128,"floetteblue":1129,"floetteorange":1131,"floettewhite":1132,"floetteyellow":1133,"florgesblue":1134,"florgesorange":1135,"florgeswhite":1136,"florgesyellow":1137,"furfroudandy":1138,"furfroudebutante":1139,"furfroudiamond":1140,"furfrouheart":1141,"furfroukabuki":1142,"furfroulareine":1143,"furfroumatron":1144,"furfroupharaoh":1145,"furfroustar":1146,"miniororange":1178,"minioryellow":1179,"miniorgreen":1180,"miniorblue":1181,"miniorindigo":1182,"miniorviolet":1183,"alcremierubycream":1215,"alcremiematchacream":1216,"alcremiemintcream":1217,"alcremielemoncream":1218,"alcremiesaltedcream":1219,"alcremierubyswirl":1220,"alcremiecaramelswirl":1221,"alcremierainbowswirl":1222,"syclant":1560,"revenankh":1561,"pyroak":1562,"fidgit":1563,"stratagem":1564,"arghonaut":1565,"kitsunoh":1566,"cyclohm":1567,"colossoil":1568,"krilowatt":1569,"voodoom":1570,"tomohawk":1571,"necturna":1572,"mollux":1573,"aurumoth":1574,"malaconda":1575,"cawmodore":1576,"volkraken":1577,"plasmanta":1578,"naviathan":1579,"crucibelle":1580,"crucibellemega":1581,"kerfluffle":1582,"pajantom":1583,"jumbao":1584,"caribolt":1585,"smokomodo":1586,"snaelstrom":1587,"equilibra":1588,"astrolotl":1589,"miasmaw":1590,"chromera":1591,"venomicon":1592,"venomiconepilogue":1593,"saharaja":1594,"hemogoblin":1595,"syclar":1596,"embirch":1597,"flarelm":1598,"breezi":1599,"scratchet":1600,"necturine":1601,"cupra":1602,"argalis":1603,"brattler":1604,"cawdet":1605,"volkritter":1606,"snugglow":1607,"floatoy":1608,"caimanoe":1609,"pluffle":1610,"rebble":1611,"tactite":1612,"privatyke":1613,"nohface":1614,"monohm":1615,"duohm":1616,"protowatt":1617,"voodoll":1618,"mumbao":1619,"fawnifer":1620,"electrelk":1621,"smogecko":1622,"smoguana":1623,"swirlpool":1624,"coribalis":1625,"justyke":1626,"solotl":1627,"miasmite":1628,"dorsoil":1629,"saharascal":1630,"ababo":1631,"scattervein":1632,"cresceidon":1633,"chuggalong":1634,"shox":1635,"chuggon":1636,"draggalong":1637,"ramnarok":1638,"ramnarokradiant":1639,"flox":1640,"obliteryx":1641};
const OFFICIAL_MENU_ICON_INDEXES_LEFT: {[id: string]: number} = {"pikachubelle":1452,"pikachupopstar":1453,"clefairy":1454,"clefable":1455,"jigglypuff":1456,"wigglytuff":1457,"dugtrioalola":1458,"poliwhirl":1459,"poliwrath":1460,"mukalola":1461,"kingler":1462,"croconaw":1463,"cleffa":1464,"igglybuff":1465,"politoed":1466,"unownb":1467,"unownc":1468,"unownd":1469,"unowne":1470,"unownf":1471,"unowng":1472,"unownh":1473,"unownj":1474,"unownk":1475,"unownl":1476,"unownm":1477,"unownn":1478,"unownp":1479,"unownq":1480,"unownquestion":1481,"unownr":1482,"unowns":1483,"unownt":1484,"unownv":1485,"unownz":1486,"sneasel":1487,"teddiursa":1488,"roselia":1489,"zangoose":1490,"seviper":1491,"castformsnowy":1492,"absolmega":1493,"absol":1494,"regirock":1495,"torterra":1496,"budew":1497,"roserade":1498,"magmortar":1499,"togekiss":1500,"rotomwash":1501,"shayminsky":1502,"emboar":1503,"pansear":1504,"simisear":1505,"drilbur":1506,"excadrill":1507,"sawk":1508,"lilligant":1509,"garbodor":1510,"solosis":1511,"vanilluxe":1512,"amoonguss":1513,"klink":1514,"klang":1515,"klinklang":1516,"litwick":1517,"golett":1518,"golurk":1519,"kyuremblack":1520,"kyuremwhite":1521,"kyurem":1522,"keldeoresolute":1523,"meloetta":1524,"greninja":1525,"greninjabond":1525,"greninjaash":1526,"furfroudebutante":1527,"barbaracle":1528,"clauncher":1529,"clawitzer":1530,"sylveon":1531,"klefki":1532,"zygarde":1533,"zygarde10":1534,"zygardecomplete":1535,"dartrix":1536,"steenee":1537,"tsareena":1538,"comfey":1539,"miniormeteor":1540,"minior":1541,"miniororange":1542,"minioryellow":1543,"miniorgreen":1544,"miniorblue":1545,"miniorviolet":1546,"miniorindigo":1547,"dhelmise":1548,"necrozma":1549,"marshadow":1550,"pikachuoriginal":1551,"pikachupartner":1552,"necrozmaduskmane":1553,"necrozmadawnwings":1554,"necrozmaultra":1555,"stakataka":1556,"blacephalon":1557};

const CUSTOM_ICON_SPRITES: {[id: string]: string} = {
	scizormega: 'scizormega',
	scizormegaf: 'scizormega-f',
	breloommega: 'breloom-mega',
	lopunny: 'lopunny',
	luxraymega: 'luxray-mega',
	gardevoirvoid: 'gardevoir-void',
	gardevoirmegaalt: 'gardevoir-void',
	noctowlmega: 'noctowl-mega',
	dusknoirmega: 'dusknoir-mega',
	weavilemega: 'weavile-mega',
	noivernmega: 'noivern-mega',
	bronzongmega: 'bronzong-mega',
	roserademega: 'roserade-mega',
	sharpedo: 'sharpedo',
	sharpedomega: 'sharpedo-mega',
	sharpedomegay: 'sharpedo-megay',
	belliboltmega: 'bellibolt-mega',
	reuniclus: 'reuniclus',
	reuniclusmega: 'reuniclus-mega',
	sunfloramega: 'sunflora-mega',
	claydolmega: 'claydol-mega',
	cacturnealt: 'cacturne-alt',
	crobatalt: 'crobat-alt',
	corsolaalt: 'corsola-alt',
	zangoosereborn: 'zangoose-reborn',
	seviperreborn: 'seviper-reborn',
	mukpulse: 'muk-pulse',
	palossandrocky: 'palossand-rocky',
	palossandfiery: 'palossand-fiery',
	palossandicy: 'palossand-icy',
	granbullalt: 'granbull-alt',
	furfrouheart: 'furfrou-heart',
	furfroustar: 'furfrou-star',
	furfroudiamond: 'furfrou-diamond',
	furfroudebutante: 'furfrou-debutante',
	furfroumatron: 'furfrou-matron',
	furfroudandy: 'furfrou-dandy',
	furfroulareine: 'furfrou-lareine',
	furfroukabuki: 'furfrou-kabuki',
	furfroupharaoh: 'furfrou-pharaoh',
	lanturnalt: 'lanturn-alt',
	jynxalt: 'jynx-alt',
	lumineonalt: 'lumineon-alt',
	arbokmegax: 'arbok-mega-x',
	arbokmegay: 'arbok-mega-y',
	sandslashalt: 'sandslash-alt',
	haxorusmega: 'haxorus-alt',
	arcaninealt: 'arcanine-alt',
	emboaralt: 'emboar-alt',
	emboarmegaalt: 'emboar-mega-alt',
	mightyenadeso: 'mightyena-deso',
	toxicroakdeso: 'toxicroak-deso',
	cinccinodeso: 'cinccino-deso',
	gligaralt: 'gligar-alt',
	gliscoralt: 'gliscor-alt',
	sneasleraevian: 'sneasler-aevian',
	mismagiusaevian: 'mismagius-aevian',
	volcaronaaevian: 'volcarona-aevian',
	volcarona: 'volcarona',
	volcaronaf: 'volcarona-f',
	spiritombalt: 'spiritomb-alt',
	parasectparasitism: 'parasect-parasitism',
	parasectparasite: 'parasect-parasite',
	bronzongrejuv: 'bronzong-rejuv',
	musharnarejuv: 'musharna-rejuv',
	unfezantrejuv: 'unfezant-rejuv',
	gastrodonazzy: 'gastrodon-azzy',
	gastrodonazzy2: 'gastrodon-azzy2',
	sawsbuckspring: 'sawsbuck',
	sawsbucksummer: 'sawsbuck-summer',
	sawsbuckautumn: 'sawsbuck-autumn',
	sawsbuckwinter: 'sawsbuck-winter',
	florgesreborn: 'florges-reborn',
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
	meganiummegay: 'meganium-mega-y',
	raichumegax: 'raichu-megax',
	raichumegay: 'raichu-megay',
	scolipedemega: 'scolipede-mega',
	scolipedeazzy: 'scolipede-azzy',
	scolipedemegaazzy: 'scolipede-mega-azzy',
	golisopodmega: 'golisopod-mega',
	golurkmega: 'golurk-mega',
	glimmoramega: 'glimmora-mega',
	greninjamega: 'greninja-mega',
	greninjaash: 'greninja-ash',
	greninjabond: 'greninja',
	silvally: 'silvally',
	alakazam: 'alakazam',
	alakazamf: 'alakazam-f',
	alakazammega: 'alakazam-mega',
	alakazammegaf: 'alakazam-mega-f',
	alakazamalt: 'alakazam-alt',
	alakazammegaalt: 'alakazam-mega-alt',
	magearna: 'magearna',
	magearnamega: 'magearna-mega',
	gengarmega: 'gengar-mega',
	gengargmax: 'gengar-gmax',
	houndoommega: 'houndoom-mega',
	hawluchamega: 'hawlucha-mega',
	salamencemega: 'salamence-mega',
	aggronmega: 'aggron-mega',
	hatterenegmax: 'hatterene-gmax',
	aegislashgmax: 'aegislash-gmax',
	dragapultgmax: 'dragapult-gmax',
	feraligatrgmax: 'feraligatr-gmax',
	palafinhero: 'palafin-hero',
	mausholdfour: 'maushold-four',
	sinistchamasterpiece: 'sinistcha-masterpiece',
	venusaurmega: 'venusaur-mega',
	venusaurgmax: 'venusaur-gmax',
	centiskorchgmax: 'centiskorch-gmax',
	charizardmegaxalt: 'charizard-megax-alt',
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
	banettemegaz: 'banette-megaz',
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
	laprasaevian: 'lapras-aevian',
	laprasazzy: 'lapras-azzy',
	jellicentazzy: 'jellicent-azzy',
	samurottalt: 'samurott-alt',
	samurotthisuialt: 'samurott-hisui-alt',
	goodrahisuialt: 'goodra-hisui-alt',
	toxtricitylowkeyalt: 'toxtricity-lowkey-alt',
	toxtricitylowkeygmaxalt: 'toxtricity-lowkey-gmax-alt',
	machampalt: 'machamp-alt',
	machampgmaxalt: 'machamp-gmax-alt',
	skeledirgealt: 'skeledirge-alt',
	tsareenaalt: 'tsareena-alt',
	primarinaalt: 'primarina-alt',
	decidueyealt: 'decidueye-alt',
	decidueyehisuialt: 'decidueye-hisui-alt',
	incineroaralt: 'incineroar-alt',
	grimmsnarlazzy: 'grimmsnarl-azzy',
	grimmsnarlgmaxazzy: 'grimmsnarl-gmax-azzy',
	gastrodonaevian: 'gastrodon-aevian',
	gastrodoneastaevian: 'gastrodon-east-aevian',
	toxtricityaevian: 'toxtricity-aevian',
	hypnopulse: 'hypno-pulse',
	eeveestarteralt: 'eevee-starter-alt',
	auroreon: 'auroreon',
	soluneon: 'soluneon',
	abysseon: 'abysseon',
	typhlosionalt: 'typhlosion-alt',
	nidokingalt: 'nidoking-alt',
	nidoqueenalt: 'nidoqueen-alt',
	ninetalesalt: 'ninetales-alt',
	infernapealt: 'infernape-alt',
	torterraalt: 'torterra-alt',
	baxcaliburmega: 'baxcalibur-mega',
	emboarmega: 'emboar-mega',
	chandeluremega: 'chandelure-mega',
	crabominablemega: 'crabominable-mega',
	floettemega: 'floette-mega',
	floetteeternalmega: 'floette-eternal-mega',
	floetteeternal: 'floette-eternal',
	oricorio: 'oricorio',
	oricoriopompom: 'oricorio-pompom',
	oricoriopau: 'oricorio-pau',
	oricoriosensu: 'oricorio-sensu',
	chimechomega: 'chimecho-mega',
	chimechomegay: 'chimecho-mega-y',
	froslassmega: 'froslass-mega',
	feraligatrmega: 'feraligatr-mega',
	eelektrossmega: 'eelektross-mega',
	excadrillmega: 'excadrill-mega',
	meowsticmmega: 'meowstic-mmega',
	meowsticfmega: 'meowstic-fmega',
	scovillainmega: 'scovillain-mega',
	malamarmega: 'malamar-mega',
	clefablemega: 'clefable-mega',
	lopunnymega: 'lopunny-mega',
	pyroarmega: 'pyroar-mega',
	appletungmax: 'appletun-gmax',
	dipplingmax: 'dipplin-gmax',
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
	serperiorazzy: 'serperior-azzy',
	galladeazzy: 'gallade',
	gallademegaazzy: 'gallade-mega-azzy',
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

// Exact custom-form artwork for menu slots that otherwise show a base or unknown icon.
const CUSTOM_MENU_SPRITE_FALLBACKS: {[id: string]: string} = {
	"umbreonperfect": "umbreon-perfect",
	"castformsandy": "castform-sandy",
	"castformwindy": "castform-windy",
	"missingno": "missingno",
	"pokestarsmeargle": "pokestarsmeargle",
	"pokestarufo": "pokestarufo",
	"pokestarufo2": "pokestarufo-2",
	"pokestarbrycenman": "pokestarbrycenman",
	"pokestarmt": "pokestarmt",
	"pokestarmt2": "pokestarmt2",
	"pokestartransport": "pokestartransport",
	"pokestargiant": "pokestargiant",
	"pokestarhumanoid": "pokestarhumanoid",
	"pokestarmonster": "pokestarmonster",
	"pokestarf00": "pokestarf00",
	"pokestarf002": "pokestarf002",
	"pokestarspirit": "pokestarspirit",
	"pokestarblackdoor": "pokestarblackdoor",
	"pokestarwhitedoor": "pokestarwhitedoor",
	"pokestarblackbelt": "pokestarblackbelt",
	"pokestarufopropu2": "pokestarufo-propu2",
	"tentacruelalt": "tentacruel-alt",
	"cinderacemega": "cinderace-mega",
	"ledianmega": "ledian-mega",
	"ariadosmega": "ariados-mega",
	"clawitzermega": "clawitzer-mega",
	"divineon": "divineon",
	"lilligantrift": "lilligant-rift",
	"lilliganthisuirift": "lilligant-hisui-rift",
	"braveon": "braveon",
	"nimbeon": "nimbeon",
	"toxeon": "toxeon",
	"dusteon": "dusteon",
	"basaleon": "basaleon",
	"ephemeon": "ephemeon",
	"kitsuneon": "kitsuneon",
	"titaneon": "titaneon",
	"byteon": "byteon",
	"drekeon": "drekeon"
};

const CUSTOM_PARTY_ICON_SPRITES: {[id: string]: {
	normal: string,
	normalFemale: string,
	shiny: string,
	shinyFemale: string,
}} = {
	garchomp: {normal: 'garchomp-menu.svg', normalFemale: 'garchomp-menu.svg', shiny: 'garchomp-menu-shiny.svg', shinyFemale: 'garchomp-menu-shiny.svg'},
	garchompmega: {normal: 'garchompmega-menu.svg', normalFemale: 'garchompmega-menu.svg', shiny: 'garchompmega-menu-shiny.svg', shinyFemale: 'garchompmega-menu-shiny.svg'},
	garchompmegaz: {normal: 'garchompmegaz-menu.svg', normalFemale: 'garchompmegaz-menu.svg', shiny: 'garchompmegaz-menu-shiny.svg', shinyFemale: 'garchompmegaz-menu-shiny.svg'},
	garchompbattlebond: {normal: 'garchompbattlebond-menu.svg', normalFemale: 'garchompbattlebond-menu.svg', shiny: 'garchompbattlebond-menu-shiny.svg', shinyFemale: 'garchompbattlebond-menu-shiny.svg'},
	gardevoir: {normal: 'gardevoir-menu.svg', normalFemale: 'gardevoir-menu.svg', shiny: 'gardevoir-menu-shiny.svg', shinyFemale: 'gardevoir-menu-shiny.svg'},
	gardevoirmega: {normal: 'gardevoirmega-menu.svg', normalFemale: 'gardevoirmega-menu.svg', shiny: 'gardevoirmega-menu-shiny.svg', shinyFemale: 'gardevoirmega-menu-shiny.svg'},
	gardevoirvoidmega: {normal: 'gardevoirvoidmega-menu.svg', normalFemale: 'gardevoirvoidmega-menu.svg', shiny: 'gardevoirvoidmega-menu-shiny.svg', shinyFemale: 'gardevoirvoidmega-menu-shiny.svg'},
	gardevoirmegaz: {normal: 'gardevoirmegaz-menu.svg', normalFemale: 'gardevoirmegaz-menu.svg', shiny: 'gardevoirmegaz-menu-shiny.svg', shinyFemale: 'gardevoirmegaz-menu-shiny.svg'},
	breloommega: {normal: "breloom-mega.png", normalFemale: "breloom-mega-f.png", shiny: "breloom-mega.png", shinyFemale: "breloom-mega-f.png"},
	raichumegay: {"normal":"raichu-megay.png","normalFemale":"raichu-megay.png","shiny":"raichu-megay.png","shinyFemale":"raichu-megay.png"},
	raichumegax: {"normal":"raichu-megax.png","normalFemale":"raichu-megax.png","shiny":"raichu-megax.png","shinyFemale":"raichu-megax.png"},
	drapionaevian: {
		normal: 'drapion-aevian-party.png',
		normalFemale: 'drapion-aevian-party-f.png',
		shiny: 'drapion-aevian-party-shiny.png',
		shinyFemale: 'drapion-aevian-party-shiny-f.png',
	},
	volcaronaaevian: {
		normal: 'volcarona-aevian-party.png',
		normalFemale: 'volcarona-aevian-party-f.png',
		shiny: 'volcarona-aevian-party-shiny.png',
		shinyFemale: 'volcarona-aevian-party-shiny-f.png',
	},
	sneasleraevian: {
		normal: 'sneasler-aevian-party.png',
		normalFemale: 'sneasler-aevian-party-f.png',
		shiny: 'sneasler-aevian-party-shiny.png',
		shinyFemale: 'sneasler-aevian-party-shiny-f.png',
	},
	ursaluna: {
		normal: 'ursaluna.png',
		normalFemale: 'ursaluna.png',
		shiny: 'ursaluna-shiny.png',
		shinyFemale: 'ursaluna-shiny.png',
	},
	ursalunabloodmoon: {
		normal: 'ursaluna-bloodmoon.png',
		normalFemale: 'ursaluna-bloodmoon.png',
		shiny: 'ursaluna-bloodmoon-shiny.png',
		shinyFemale: 'ursaluna-bloodmoon-shiny.png',
	},
	reuniclus: {
		normal: 'reuniclus.png',
		normalFemale: 'reuniclus.png',
		shiny: 'reuniclus-shiny.png',
		shinyFemale: 'reuniclus-shiny.png',
	},
	reuniclusmega: {
		normal: 'reuniclus-mega.png',
		normalFemale: 'reuniclus-mega.png',
		shiny: 'reuniclus-mega-shiny.png',
		shinyFemale: 'reuniclus-mega-shiny.png',
	},
	musharna: {
		normal: 'musharna.png',
		normalFemale: 'musharna.png',
		shiny: 'musharna-shiny.png',
		shinyFemale: 'musharna-shiny.png',
	},
	musharnarejuv: {
		normal: 'musharna-rejuv.png',
		normalFemale: 'musharna-rejuv.png',
		shiny: 'musharna-rejuv-shiny.png',
		shinyFemale: 'musharna-rejuv-shiny.png',
	},
	alakazam: {
		normal: 'alakazam.png',
		normalFemale: 'alakazam.png',
		shiny: 'alakazam-shiny.png',
		shinyFemale: 'alakazam-shiny.png',
	},
	alakazammega: {
		normal: 'alakazam-mega.png',
		normalFemale: 'alakazam-mega.png',
		shiny: 'alakazam-mega-shiny.png',
		shinyFemale: 'alakazam-mega-shiny.png',
	},
	palossand: {
		normal: 'palossand.png',
		normalFemale: 'palossand.png',
		shiny: 'palossand-shiny.png',
		shinyFemale: 'palossand-shiny.png',
	},
	palossandrocky: {
		normal: 'palossand-rocky.png',
		normalFemale: 'palossand-rocky.png',
		shiny: 'palossand-rocky-shiny.png',
		shinyFemale: 'palossand-rocky-shiny.png',
	},
	palossandfiery: {
		normal: 'palossand-fiery.png',
		normalFemale: 'palossand-fiery.png',
		shiny: 'palossand-fiery-shiny.png',
		shinyFemale: 'palossand-fiery-shiny.png',
	},
	palossandicy: {
		normal: 'palossand-icy.png',
		normalFemale: 'palossand-icy.png',
		shiny: 'palossand-icy-shiny.png',
		shinyFemale: 'palossand-icy-shiny.png',
	},
	sandslash: {
		normal: 'sandslash.png',
		normalFemale: 'sandslash.png',
		shiny: 'sandslash-shiny.png',
		shinyFemale: 'sandslash-shiny.png',
	},
	sandslashalola: {
		normal: 'sandslash-alola.png',
		normalFemale: 'sandslash-alola.png',
		shiny: 'sandslash-alola-shiny.png',
		shinyFemale: 'sandslash-alola-shiny.png',
	},
	sandslashalt: {
		normal: 'sandslash-alt.png',
		normalFemale: 'sandslash-alt.png',
		shiny: 'sandslash-alt-shiny.png',
		shinyFemale: 'sandslash-alt-shiny.png',
	},
	sharpedo: {
		normal: 'sharpedo.png',
		normalFemale: 'sharpedo.png',
		shiny: 'sharpedo-shiny.png',
		shinyFemale: 'sharpedo-shiny.png',
	},
	sharpedomega: {
		normal: 'sharpedo-mega.png',
		normalFemale: 'sharpedo-mega.png',
		shiny: 'sharpedo-mega-shiny.png',
		shinyFemale: 'sharpedo-mega-shiny.png',
	},
	sharpedomegay: {
		normal: 'sharpedo-megay.png',
		normalFemale: 'sharpedo-megay.png',
		shiny: 'sharpedo-megay-shiny.png',
		shinyFemale: 'sharpedo-megay-shiny.png',
	},
	cinccino: {
		normal: 'cinccino.png',
		normalFemale: 'cinccino.png',
		shiny: 'cinccino-shiny.png',
		shinyFemale: 'cinccino-shiny.png',
	},
	cinccinodeso: {
		normal: 'cinccino-deso.png',
		normalFemale: 'cinccino-deso.png',
		shiny: 'cinccino-deso-shiny.png',
		shinyFemale: 'cinccino-deso-shiny.png',
	},
	luxray: {
		normal: 'luxray.png',
		normalFemale: 'luxray.png',
		shiny: 'luxray-shiny.png',
		shinyFemale: 'luxray-shiny.png',
	},
	luxraymega: {
		normal: 'luxray-mega.png',
		normalFemale: 'luxray-mega.png',
		shiny: 'luxray-mega-shiny.png',
		shinyFemale: 'luxray-mega-shiny.png',
	},
	toxicroak: {
		normal: 'toxicroak.png',
		normalFemale: 'toxicroak.png',
		shiny: 'toxicroak-shiny.png',
		shinyFemale: 'toxicroak-shiny.png',
	},
	toxicroakdeso: {
		normal: 'toxicroak-deso.png',
		normalFemale: 'toxicroak-deso.png',
		shiny: 'toxicroak-deso-shiny.png',
		shinyFemale: 'toxicroak-deso-shiny.png',
	},
	mightyena: {
		normal: 'mightyena.png',
		normalFemale: 'mightyena.png',
		shiny: 'mightyena-shiny.png',
		shinyFemale: 'mightyena-shiny.png',
	},
	mightyenadeso: {
		normal: 'mightyena-deso.png',
		normalFemale: 'mightyena-deso.png',
		shiny: 'mightyena-deso-shiny.png',
		shinyFemale: 'mightyena-deso-shiny.png',
	},
	florgesreborn: {
		normal: 'florges-reborn.png',
		normalFemale: 'florges-reborn.png',
		shiny: 'florges-reborn-shiny.png',
		shinyFemale: 'florges-reborn-shiny.png',
	},
	aerodactyl: {
		normal: 'aerodactyl.png',
		normalFemale: 'aerodactyl.png',
		shiny: 'aerodactyl-shiny.png',
		shinyFemale: 'aerodactyl-shiny.png',
	},
	aerodactylmega: {
		normal: 'aerodactyl-mega.png',
		normalFemale: 'aerodactyl-mega.png',
		shiny: 'aerodactyl-mega-shiny.png',
		shinyFemale: 'aerodactyl-mega-shiny.png',
	},
	greninja: {
		normal: 'greninja.png',
		normalFemale: 'greninja.png',
		shiny: 'greninja-shiny.png',
		shinyFemale: 'greninja-shiny.png',
	},
	greninjamega: {
		normal: 'greninja-mega.png',
		normalFemale: 'greninja-mega.png',
		shiny: 'greninja-mega-shiny.png',
		shinyFemale: 'greninja-mega-shiny.png',
	},
	blastoise: {
		normal: 'blastoise.png',
		normalFemale: 'blastoise.png',
		shiny: 'blastoise-shiny.png',
		shinyFemale: 'blastoise-shiny.png',
	},
	blastoisemega: {
		normal: 'blastoise-mega.png',
		normalFemale: 'blastoise-mega.png',
		shiny: 'blastoise-mega-shiny.png',
		shinyFemale: 'blastoise-mega-shiny.png',
	},
	lapras: {
		normal: 'lapras.png',
		normalFemale: 'lapras.png',
		shiny: 'lapras-shiny.png',
		shinyFemale: 'lapras-shiny.png',
	},
	laprasaevian: {
		normal: 'lapras-aevian.png',
		normalFemale: 'lapras-aevian.png',
		shiny: 'lapras-aevian-shiny.png',
		shinyFemale: 'lapras-aevian-shiny.png',
	},
	laprasgmax: {
		normal: 'lapras-gmax.png',
		normalFemale: 'lapras-gmax.png',
		shiny: 'lapras-gmax-shiny.png',
		shinyFemale: 'lapras-gmax-shiny.png',
	},
	absol: {
		normal: 'absol.png',
		normalFemale: 'absol.png',
		shiny: 'absol-shiny.png',
		shinyFemale: 'absol-shiny.png',
	},
	absolmega: {
		normal: 'absol-mega.png',
		normalFemale: 'absol-mega.png',
		shiny: 'absol-mega-shiny.png',
		shinyFemale: 'absol-mega-shiny.png',
	},
	darkrai: {
		normal: 'darkrai.png',
		normalFemale: 'darkrai.png',
		shiny: 'darkrai-shiny.png',
		shinyFemale: 'darkrai-shiny.png',
	},
	chesnaught: {
		normal: 'chesnaught.png',
		normalFemale: 'chesnaught.png',
		shiny: 'chesnaught-shiny.png',
		shinyFemale: 'chesnaught-shiny.png',
	},
	chesnaughtmega: {
		normal: 'chesnaught-mega.png',
		normalFemale: 'chesnaught-mega.png',
		shiny: 'chesnaught-mega-shiny.png',
		shinyFemale: 'chesnaught-mega-shiny.png',
	},
	venusaur: {
		normal: 'venusaur.png',
		normalFemale: 'venusaur.png',
		shiny: 'venusaur-shiny.png',
		shinyFemale: 'venusaur-shiny.png',
	},
	venusaurmega: {
		normal: 'venusaur-mega.png',
		normalFemale: 'venusaur-mega.png',
		shiny: 'venusaur-mega-shiny.png',
		shinyFemale: 'venusaur-mega-shiny.png',
	},
	venusaurgmax: {
		normal: 'venusaur-gmax.png',
		normalFemale: 'venusaur-gmax.png',
		shiny: 'venusaur-gmax-shiny.png',
		shinyFemale: 'venusaur-gmax-shiny.png',
	},
	rillaboom: {
		normal: 'rillaboom.png',
		normalFemale: 'rillaboom.png',
		shiny: 'rillaboom-shiny.png',
		shinyFemale: 'rillaboom-shiny.png',
	},
	rillaboomgmax: {
		normal: 'rillaboom-gmax.png',
		normalFemale: 'rillaboom-gmax.png',
		shiny: 'rillaboom-gmax-shiny.png',
		shinyFemale: 'rillaboom-gmax-shiny.png',
	},
	corviknight: {
		normal: 'corviknight.png',
		normalFemale: 'corviknight.png',
		shiny: 'corviknight-shiny.png',
		shinyFemale: 'corviknight-shiny.png',
	},
	corviknightgmax: {
		normal: 'corviknight-gmax.png',
		normalFemale: 'corviknight-gmax.png',
		shiny: 'corviknight-gmax-shiny.png',
		shinyFemale: 'corviknight-gmax-shiny.png',
	},
	milotic: {
		normal: 'milotic.png',
		normalFemale: 'milotic.png',
		shiny: 'milotic-shiny.png',
		shinyFemale: 'milotic-shiny.png',
	},
	miloticaevian: {
		normal: 'milotic-aevian.png',
		normalFemale: 'milotic-aevian.png',
		shiny: 'milotic-aevian-shiny.png',
		shinyFemale: 'milotic-aevian-shiny.png',
	},
	scolipede: {
		normal: 'scolipede.png',
		normalFemale: 'scolipede-f.png',
		shiny: 'scolipede-shiny.png',
		shinyFemale: 'scolipede-f-shiny.png',
	},
	scolipedemega: {
		normal: 'scolipede-mega.png',
		normalFemale: 'scolipede-mega-f.png',
		shiny: 'scolipede-mega-shiny.png',
		shinyFemale: 'scolipede-mega-f-shiny.png',
	},
	tinkaton: {
		normal: 'tinkaton.png',
		normalFemale: 'tinkaton.png',
		shiny: 'tinkaton-shiny.png',
		shinyFemale: 'tinkaton-shiny.png',
	},
	cradily: {
		normal: 'cradily.png',
		normalFemale: 'cradily.png',
		shiny: 'cradily-shiny.png',
		shinyFemale: 'cradily-shiny.png',
	},
	froslass: {
		normal: 'froslass.png',
		normalFemale: 'froslass.png',
		shiny: 'froslass-shiny.png',
		shinyFemale: 'froslass-shiny.png',
	},
	froslassmega: {
		normal: 'froslass-mega.png',
		normalFemale: 'froslass-mega.png',
		shiny: 'froslass-mega-shiny.png',
		shinyFemale: 'froslass-mega-shiny.png',
	},
	hawlucha: {
		normal: 'hawlucha.png',
		normalFemale: 'hawlucha.png',
		shiny: 'hawlucha-shiny.png',
		shinyFemale: 'hawlucha-shiny.png',
	},
	hawluchamega: {
		normal: 'hawlucha-mega.png',
		normalFemale: 'hawlucha-mega.png',
		shiny: 'hawlucha-mega-shiny.png',
		shinyFemale: 'hawlucha-mega-shiny.png',
	},
	bronzongrejuv: {
		normal: 'bronzong-rejuv.png',
		normalFemale: 'bronzong-rejuv.png',
		shiny: 'bronzong-rejuv-shiny.png',
		shinyFemale: 'bronzong-rejuv-shiny.png',
	},
	charizard: {
		normal: 'charizard.png',
		normalFemale: 'charizard.png',
		shiny: 'charizard-shiny.png',
		shinyFemale: 'charizard-shiny.png',
	},
	charizardmegax: {
		normal: 'charizard-megax.png',
		normalFemale: 'charizard-megax.png',
		shiny: 'charizard-megax-shiny.png',
		shinyFemale: 'charizard-megax-shiny.png',
	},
	charizardmegay: {
		normal: 'charizard-megay.png',
		normalFemale: 'charizard-megay.png',
		shiny: 'charizard-megay-shiny.png',
		shinyFemale: 'charizard-megay-shiny.png',
	},
	charizardgmax: {
		normal: 'charizard-gmax.png',
		normalFemale: 'charizard-gmax.png',
		shiny: 'charizard-gmax-shiny.png',
		shinyFemale: 'charizard-gmax-shiny.png',
	},
	gengar: {
		normal: 'gengar.png',
		normalFemale: 'gengar.png',
		shiny: 'gengar-shiny.png',
		shinyFemale: 'gengar-shiny.png',
	},
	gengarmega: {
		normal: 'gengar-mega.png',
		normalFemale: 'gengar-mega.png',
		shiny: 'gengar-mega-shiny.png',
		shinyFemale: 'gengar-mega-shiny.png',
	},
	gengargmax: {
		normal: 'gengar-gmax.png',
		normalFemale: 'gengar-gmax.png',
		shiny: 'gengar-gmax-shiny.png',
		shinyFemale: 'gengar-gmax-shiny.png',
	},
	unfezantrejuv: {
		normal: 'unfezant-rejuv.png',
		normalFemale: 'unfezant-rejuv.png',
		shiny: 'unfezant-rejuv-shiny.png',
		shinyFemale: 'unfezant-rejuv-shiny.png',
	},
	scizor: {
		normal: 'scizor.png',
		normalFemale: 'scizor-f.png',
		shiny: 'scizor-shiny.png',
		shinyFemale: 'scizor-f-shiny.png',
	},
	scizormega: {
		normal: 'scizor-mega.png',
		normalFemale: 'scizor-mega-f.png',
		shiny: 'scizor-mega-shiny.png',
		shinyFemale: 'scizor-mega-f-shiny.png',
	},
	abysseon: {
		normal: 'abysseon.png',
		normalFemale: 'abysseon.png',
		shiny: 'abysseon-shiny.png',
		shinyFemale: 'abysseon-shiny.png',
	},
	divineon: {
		normal: 'divineon.png',
		normalFemale: 'divineon.png',
		shiny: 'divineon-shiny.png',
		shinyFemale: 'divineon-shiny.png',
	},
	miloticalt: {
		normal: 'milotic-alt.png',
		normalFemale: 'milotic-alt.png',
		shiny: 'milotic-alt-shiny.png',
		shinyFemale: 'milotic-alt-shiny.png',
	},
	nidoqueen: {
		normal: 'nidoqueen.png',
		normalFemale: 'nidoqueen.png',
		shiny: 'nidoqueen-shiny.png',
		shinyFemale: 'nidoqueen-shiny.png',
	},
	nidoqueenalt: {
		normal: 'nidoqueen-alt.png',
		normalFemale: 'nidoqueen-alt.png',
		shiny: 'nidoqueen-alt-shiny.png',
		shinyFemale: 'nidoqueen-alt-shiny.png',
	},
	emboar: {
		normal: 'emboar.png',
		normalFemale: 'emboar.png',
		shiny: 'emboar-shiny.png',
		shinyFemale: 'emboar-shiny.png',
	},
	emboarmega: {
		normal: 'emboar-mega.png',
		normalFemale: 'emboar-mega.png',
		shiny: 'emboar-mega-shiny.png',
		shinyFemale: 'emboar-mega-shiny.png',
	},
	espeon: {
		normal: 'espeon.png',
		normalFemale: 'espeon.png',
		shiny: 'espeon-shiny.png',
		shinyFemale: 'espeon-shiny.png',
	},
	auroreon: {
		normal: 'auroreon.png',
		normalFemale: 'auroreon.png',
		shiny: 'auroreon-shiny.png',
		shinyFemale: 'auroreon-shiny.png',
	},
	soluneon: {
		normal: 'soluneon.png',
		normalFemale: 'soluneon.png',
		shiny: 'soluneon-shiny.png',
		shinyFemale: 'soluneon-shiny.png',
	},
	granbull: {
		normal: 'granbull.png',
		normalFemale: 'granbull.png',
		shiny: 'granbull-shiny.png',
		shinyFemale: 'granbull-shiny.png',
	},
	granbullalt: {
		normal: 'granbull-alt.png',
		normalFemale: 'granbull-alt.png',
		shiny: 'granbull-alt-shiny.png',
		shinyFemale: 'granbull-alt-shiny.png',
	},
	haxorus: {
		normal: 'haxorus.png',
		normalFemale: 'haxorus.png',
		shiny: 'haxorus-shiny.png',
		shinyFemale: 'haxorus-shiny.png',
	},
	haxorusmega: {
		normal: 'haxorus-mega.png',
		normalFemale: 'haxorus-mega.png',
		shiny: 'haxorus-mega-shiny.png',
		shinyFemale: 'haxorus-mega-shiny.png',
	},
	butterfree: {
		normal: 'butterfree.png',
		normalFemale: 'butterfree.png',
		shiny: 'butterfree-shiny.png',
		shinyFemale: 'butterfree-shiny.png',
	},
	butterfreemega: {
		normal: 'butterfree-mega.png',
		normalFemale: 'butterfree-mega.png',
		shiny: 'butterfree-mega-shiny.png',
		shinyFemale: 'butterfree-mega-shiny.png',
	},
	centiskorch: {
		normal: 'centiskorch.png',
		normalFemale: 'centiskorch.png',
		shiny: 'centiskorch-shiny.png',
		shinyFemale: 'centiskorch-shiny.png',
	},
	centiskorchgmax: {
		normal: 'centiskorch-gmax.png',
		normalFemale: 'centiskorch-gmax.png',
		shiny: 'centiskorch-gmax-shiny.png',
		shinyFemale: 'centiskorch-gmax-shiny.png',
	},
	cinderace: {
		normal: 'cinderace.png',
		normalFemale: 'cinderace.png',
		shiny: 'cinderace-shiny.png',
		shinyFemale: 'cinderace-shiny.png',
	},
	cinderacegmax: {
		normal: 'cinderace-gmax.png',
		normalFemale: 'cinderace-gmax.png',
		shiny: 'cinderace-gmax-shiny.png',
		shinyFemale: 'cinderace-gmax-shiny.png',
	},
	cinderacemega: {
		normal: 'cinderace-mega.png',
		normalFemale: 'cinderace-mega.png',
		shiny: 'cinderace-mega-shiny.png',
		shinyFemale: 'cinderace-mega-shiny.png',
	},
	chimecho: {
		normal: 'chimecho.png',
		normalFemale: 'chimecho.png',
		shiny: 'chimecho-shiny.png',
		shinyFemale: 'chimecho-shiny.png',
	},
	chimechomega: {
		normal: 'chimecho-mega.png',
		normalFemale: 'chimecho-mega.png',
		shiny: 'chimecho-mega-shiny.png',
		shinyFemale: 'chimecho-mega-shiny.png',
	},
	chimechomegay: {
		normal: 'chimecho-mega-y.png',
		normalFemale: 'chimecho-mega-y.png',
		shiny: 'chimecho-mega-y-shiny.png',
		shinyFemale: 'chimecho-mega-y-shiny.png',
	},
	dragapult: {
		normal: 'dragapult.png',
		normalFemale: 'dragapult.png',
		shiny: 'dragapult-shiny.png',
		shinyFemale: 'dragapult-shiny.png',
	},
	dragapultgmax: {
		normal: 'dragapult-gmax.png',
		normalFemale: 'dragapult-gmax.png',
		shiny: 'dragapult-gmax-shiny.png',
		shinyFemale: 'dragapult-gmax-shiny.png',
	},
	aegislash: {
		normal: 'aegislash.png',
		normalFemale: 'aegislash.png',
		shiny: 'aegislash-shiny.png',
		shinyFemale: 'aegislash-shiny.png',
	},
	aegislashblade: {
		normal: 'aegislash-blade.png',
		normalFemale: 'aegislash-blade.png',
		shiny: 'aegislash-blade-shiny.png',
		shinyFemale: 'aegislash-blade-shiny.png',
	},
	aegislashgmax: {
		normal: 'aegislash-gmax.png',
		normalFemale: 'aegislash-gmax.png',
		shiny: 'aegislash-gmax-shiny.png',
		shinyFemale: 'aegislash-gmax-shiny.png',
	},
	arbok: {
		normal: 'arbok.png',
		normalFemale: 'arbok.png',
		shiny: 'arbok-shiny.png',
		shinyFemale: 'arbok-shiny.png',
	},
	arbokmegax: {
		normal: 'arbok-mega-x.png',
		normalFemale: 'arbok-mega-x.png',
		shiny: 'arbok-mega-x-shiny.png',
		shinyFemale: 'arbok-mega-x-shiny.png',
	},
	arbokmegay: {
		normal: 'arbok-mega-y.png',
		normalFemale: 'arbok-mega-y.png',
		shiny: 'arbok-mega-y-shiny.png',
		shinyFemale: 'arbok-mega-y-shiny.png',
	},
	ariadosmega: {
		normal: 'ariados-mega.png',
		normalFemale: 'ariados-mega.png',
		shiny: 'ariados-mega-shiny.png',
		shinyFemale: 'ariados-mega-shiny.png',
	},
	banette: {
		normal: 'banette.png',
		normalFemale: 'banette.png',
		shiny: 'banette-shiny.png',
		shinyFemale: 'banette-shiny.png',
	},
	banettemega: {
		normal: 'banette-mega.png',
		normalFemale: 'banette-mega.png',
		shiny: 'banette-mega-shiny.png',
		shinyFemale: 'banette-mega-shiny.png',
	},
	banettemegaz: {
		normal: 'banette-megaz.png',
		normalFemale: 'banette-megaz.png',
		shiny: 'banette-mega-shiny.png',
		shinyFemale: 'banette-mega-shiny.png',
	},
	basculegion: {
		normal: 'basculegion.png',
		normalFemale: 'basculegion.png',
		shiny: 'basculegion-shiny.png',
		shinyFemale: 'basculegion-shiny.png',
	},
	basculegionf: {
		normal: 'basculegion-f.png',
		normalFemale: 'basculegion-f.png',
		shiny: 'basculegion-f-shiny.png',
		shinyFemale: 'basculegion-f-shiny.png',
	},
};
Object.assign(CUSTOM_PARTY_ICON_SPRITES, {"aurorus":{"normal":"aurorus.png","normalFemale":"aurorus.png","shiny":"aurorus-shiny.png","shinyFemale":"aurorus-shiny.png"},"tyrantrum":{"normal":"tyrantrum.png","normalFemale":"tyrantrum.png","shiny":"tyrantrum-shiny.png","shinyFemale":"tyrantrum-shiny.png"}});

Object.assign(CUSTOM_PARTY_ICON_SPRITES,{"silvally":{"normal":"silvally.png","normalFemale":"silvally.png","shiny":"silvally-shiny.png","shinyFemale":"silvally-shiny.png"},"silvallyfighting":{"normal":"silvally-fighting.png","normalFemale":"silvally-fighting.png","shiny":"silvally-fighting-shiny.png","shinyFemale":"silvally-fighting-shiny.png"},"silvallyflying":{"normal":"silvally-flying.png","normalFemale":"silvally-flying.png","shiny":"silvally-flying-shiny.png","shinyFemale":"silvally-flying-shiny.png"},"silvallypoison":{"normal":"silvally-poison.png","normalFemale":"silvally-poison.png","shiny":"silvally-poison-shiny.png","shinyFemale":"silvally-poison-shiny.png"},"silvallyground":{"normal":"silvally-ground.png","normalFemale":"silvally-ground.png","shiny":"silvally-ground-shiny.png","shinyFemale":"silvally-ground-shiny.png"},"silvallyrock":{"normal":"silvally-rock.png","normalFemale":"silvally-rock.png","shiny":"silvally-rock-shiny.png","shinyFemale":"silvally-rock-shiny.png"},"silvallybug":{"normal":"silvally-bug.png","normalFemale":"silvally-bug.png","shiny":"silvally-bug-shiny.png","shinyFemale":"silvally-bug-shiny.png"},"silvallyghost":{"normal":"silvally-ghost.png","normalFemale":"silvally-ghost.png","shiny":"silvally-ghost-shiny.png","shinyFemale":"silvally-ghost-shiny.png"},"silvallysteel":{"normal":"silvally-steel.png","normalFemale":"silvally-steel.png","shiny":"silvally-steel-shiny.png","shinyFemale":"silvally-steel-shiny.png"},"silvallyunknown":{"normal":"silvally-unknown.png","normalFemale":"silvally-unknown.png","shiny":"silvally-unknown-shiny.png","shinyFemale":"silvally-unknown-shiny.png"},"silvallyfire":{"normal":"silvally-fire.png","normalFemale":"silvally-fire.png","shiny":"silvally-fire-shiny.png","shinyFemale":"silvally-fire-shiny.png"},"silvallywater":{"normal":"silvally-water.png","normalFemale":"silvally-water.png","shiny":"silvally-water-shiny.png","shinyFemale":"silvally-water-shiny.png"},"silvallygrass":{"normal":"silvally-grass.png","normalFemale":"silvally-grass.png","shiny":"silvally-grass-shiny.png","shinyFemale":"silvally-grass-shiny.png"},"silvallyelectric":{"normal":"silvally-electric.png","normalFemale":"silvally-electric.png","shiny":"silvally-electric-shiny.png","shinyFemale":"silvally-electric-shiny.png"},"silvallypsychic":{"normal":"silvally-psychic.png","normalFemale":"silvally-psychic.png","shiny":"silvally-psychic-shiny.png","shinyFemale":"silvally-psychic-shiny.png"},"silvallyice":{"normal":"silvally-ice.png","normalFemale":"silvally-ice.png","shiny":"silvally-ice-shiny.png","shinyFemale":"silvally-ice-shiny.png"},"silvallydragon":{"normal":"silvally-dragon.png","normalFemale":"silvally-dragon.png","shiny":"silvally-dragon-shiny.png","shinyFemale":"silvally-dragon-shiny.png"},"silvallydark":{"normal":"silvally-dark.png","normalFemale":"silvally-dark.png","shiny":"silvally-dark-shiny.png","shinyFemale":"silvally-dark-shiny.png"},"silvallyfairy":{"normal":"silvally-fairy.png","normalFemale":"silvally-fairy.png","shiny":"silvally-fairy-shiny.png","shinyFemale":"silvally-fairy-shiny.png"}});


// These custom profiles intentionally use their shiny artwork in every view.
const FORCE_SHINY_CUSTOM_SPRITE_IDS = new Set<ID>(['spiritombalt']);
// Some legacy shiny paths are tracked as empty placeholders. Use normal art
// for those entries instead of leaving a blank sprite in the Team Builder.
const MISSING_SHINY_SPRITE_IDS = new Set(['abra','aerodactyl','alcremie-matchacream','ampharos','anorith','arceus','arceus-fire','arceus-ground','arceus-ice','arceus-normal','arceus-poison','arceus-psychic','arceus-rock','arceus-steel','arceus-water','archen','archeops','arctovolt','argalis','arghonaut','arghonaut-f','armaldo','aron','articuno','audino','aurumoth','axew','azelf','azumarill','azurill','bagon','baltoy','banette','barboach','basculin','basculin-bluestriped','bastiodon','bayleef','beautifly','beautifly-f','beheeyem','beldum','bellossom','bellsprout','bibarel','bibarel-f','bidoof','bidoof-f','bisharp','blaziken','blissey','boldore','bouffalant','braixen','breezi','bronzong','buneary','burmy','burmy-plant','burmy-trash','butterfree-f','cacnea','caimanoe','caribolt','carnivine','carracosta','chansey','cherrim','cherubi','chinchou','chuggalong','cinccino','clefairy','cleffa','cloyster','cofagrigus','colossoil','colossoil-f','conkeldurr','coribalis','corphish','corsola','corsola-galar','cranidos','crawdaunt','cresceidon','cresselia','cyndaquil','darkrai','darmanitan-galarzen','deerling','deerling-summer','deerling-winter','deino','delcatty','delibird','diancie','doduo-f','donphan-f','dratini','druddigon','ducklett','durant','eevee','emolga','entei','equilibra','floette-red','forretress','gastrodon','gible','gigalith','golurk','gothita','grimer','gyarados','gyarados-f','hemogoblin','hitmonlee','honchkrow','hooh','houndoom-f','houndour','hypno','illumise','karrablast','keldeo','keldeo-resolute','kerfluffle','kerfluffle-f','kingdra','koffing','krillowatt','krilowatt','krilowatt-f','krokorok','krookodile','kyogre','lanturn','lileep','ludicolo','lugia','lycanroc-midday','mantyke','maractus','mienfoo','mienshao','mightyena','miltank','minior','monferno','munchlax','munna','nidorina','nincada','nuzleaf-f','omastar','pachirisu-f','pangoro','pansear','pelipper','persian','phanpy','pidgeotto','pikachu-hoenn','pineco','plusle','pokestarbrycenman','poliwrath','ponyta-galar','porygonz','primeape','prinplup','privatyke','pumpkaboo','raichu','raticate-f','rattata','rayquaza','regice','regirock','rhydon-f','rhyhorn','riolu','sceptile','seaking','seaking-f','shaymin','shedinja','shelgon','shellder','skiploom','slowpoke','snaelstrom','spinarak','spinda','spoink','squirtle','staraptor','stratagem','stunfisk-galar','swampert','swanna','teddiursa','tentacool','tentacruel','terrakion','throh','thundurus','thundurus-therian','timburr','tirtouga','togekiss','togepi','togetic','tomohawk','tomohawk-f','torchic','tornadus','tornadus-therian','totodile','toxicroak','toxicroak-f','tranquill','trapinch','trubbish','turtwig','tympole','tynamo','tyranitar','tyrogue','umbreon','unfezant','unfezant-f','unown','unown-a','unown-b','unown-c','unown-d','unown-e','unown-exclamation','unown-f','unown-g','unown-h','unown-i','unown-j','unown-k','unown-l','unown-m','unown-n','unown-o','unown-p','unown-q','unown-question','unown-s','unown-t','unown-u','unown-v','unown-w','unown-x','unown-y','unown-z','ursaring','ursaring-f','uxie','vanillish','vanillite','venipede','venomoth','venonat','venusaur-f','vespiquen','vibrava','victini','vigoroth','vileplume','vileplume-f','virizion','vivillon-pokeball','volbeat','volcanion','volcarona','volkraken','volkritter','voltorb','voodoll','voodoom','voodoom-f','vullaby','vulpix','wailmer','wailord','walrein','wartortle','watchog','weedle','weepinbell','weezing','whirlipede','whiscash','whismur','wigglytuff','wingull','wobbuffet','wobbuffet-f','woobat','wooper','wormadam','wormadam-plant','wormadam-trash','wurmple','wynaut','xatu','xatu-f','yamask','zigzagoon','zigzagoon-galar']);

// Volcarona now has supplied shiny assets for both gender variants.
MISSING_SHINY_SPRITE_IDS.delete('volcarona');
MISSING_SHINY_SPRITE_IDS.delete('archeops');
MISSING_SHINY_SPRITE_IDS.delete('mightyena');

// These species start shiny when selected, but can still be switched back to
// normal in the team editor. This is intentionally separate from the forced
// set above so an explicit "No" shiny choice remains respected in battle.
const DEFAULT_SHINY_CUSTOM_SPRITE_IDS = new Set<ID>(['basculegion', 'basculegionf', 'spiritombalt']);
export function isDefaultShinyCustomSpecies(name: string) {
	return DEFAULT_SHINY_CUSTOM_SPRITE_IDS.has(toID(name));
}

// These cosmetic forms use custom front artwork but retain their species'
// standard back sprite in battle.
const CUSTOM_DEFAULT_BACK_SPRITES: {[id: string]: ID} = {
	// Rift has front artwork only; use the existing Hisuian back sprite.
	lilliganthisuirift: 'lilliganthisui' as ID,
	jynxalt: 'jynx' as ID,
	lumineonalt: 'lumineon' as ID,
	primarinaalt: 'primarina' as ID,

	decidueyehisuialt: 'decidueyehisui' as ID,
	incineroaralt: 'incineroar' as ID,
	samurottalt: 'samurott' as ID,
	samurotthisuialt: 'samurotthisui' as ID,
	goodrahisuialt: 'goodrahisui' as ID,
	toxtricitylowkeyalt: 'toxtricitylowkey' as ID,
	toxtricitylowkeygmaxalt: 'toxtricitylowkeygmax' as ID,
	arcaninealt: 'arcanine' as ID,
	machampalt: 'machamp' as ID,
	machampgmaxalt: 'machampgmax' as ID,
	skeledirgealt: 'skeledirge' as ID,
	tsareenaalt: 'tsareena' as ID,
	gligaralt: 'gligar' as ID,
	gliscoralt: 'gliscor' as ID,
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
	banettemegaz: {x: 20, y: 3, backgroundSize: '56px auto'},
	starmiemega: {x: 16, y: 3, backgroundSize: '64px auto'},
	heracrossmega: {x: 9, y: 5, backgroundSize: '78px auto'},
	arbokmegax: {x: 9, y: 3, backgroundSize: '78px auto'},
	arbokmegay: {x: 9, y: 3, backgroundSize: '78px auto'},
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
	front?: {w: number, h: number},
	back?: {w: number, h: number},
	shinyFront?: {w: number, h: number},
	shinyBack?: {w: number, h: number},
}} = {
	abysseon: {front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	divineon: {front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	froslass: {front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	zoroark: {front: {w: 136, h: 128}, back: {w: 148, h: 130}, shinyFront: {w: 136, h: 128}, shinyBack: {w: 148, h: 130}},
	zoroarkf: {front: {w: 136, h: 128}, back: {w: 148, h: 130}, shinyFront: {w: 136, h: 128}, shinyBack: {w: 148, h: 130}},
	zoroarkhisui: {front: {w: 140, h: 182}, back: {w: 140, h: 156}, shinyFront: {w: 140, h: 182}, shinyBack: {w: 140, h: 156}},
	zoroarkhisuif: {front: {w: 140, h: 182}, back: {w: 140, h: 156}, shinyFront: {w: 140, h: 182}, shinyBack: {w: 140, h: 156}},
	scizor: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	scizorf: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	scizormega: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	scizormegaf: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	medichamf: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	medichammega: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	cradily: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 106, h: 156}, shinyBack: {w: 110, h: 156}},
	beedrill: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 124, h: 112}, shinyBack: {w: 120, h: 118}},
	beedrillmega: {front: {w: 126, h: 132}, back: {w: 128, h: 134}, shinyFront: {w: 126, h: 132}, shinyBack: {w: 128, h: 134}},
	lopunny: {front: {w: 106, h: 120}, back: {w: 108, h: 124}, shinyFront: {w: 106, h: 120}, shinyBack: {w: 108, h: 124}},
	lopunnymega: {front: {w: 112, h: 126}, back: {w: 112, h: 128}, shinyFront: {w: 112, h: 126}, shinyBack: {w: 112, h: 128}},
	scrafty: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 88, h: 122}, shinyBack: {w: 90, h: 122}},
	samurott: {front: {w: 154, h: 160}, back: {w: 154, h: 158}, shinyFront: {w: 154, h: 160}, shinyBack: {w: 154, h: 158}},
	samurotthisui: {front: {w: 158, h: 162}, back: {w: 154, h: 160}, shinyFront: {w: 158, h: 162}, shinyBack: {w: 154, h: 160}},
	sunfloramega: {front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	claydolmega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	lilligantrift: {front: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}},
	lilliganthisuirift: {front: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}},
	gligaralt: {
		front: {w: 64, h: 64},
		back: {w: 96, h: 96},
		shinyFront: {w: 64, h: 64},
	},
	gliscoralt: {
		front: {w: 64, h: 64},
		back: {w: 96, h: 96},
		shinyFront: {w: 64, h: 64},
	},
	dusknoir: {
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
		back: {w: 126, h: 132},
		shinyBack: {w: 126, h: 132},
	},
	pidgeotmega: {
		front: {w: 184, h: 170},
		back: {w: 182, h: 176},
	},
	aggron: {
		front: {w: 146, h: 140},
		back: {w: 128, h: 146},
		shinyBack: {w: 128, h: 144},
	},
	aggronmega: {
		front: {w: 194, h: 152},
		back: {w: 186, h: 144},
		shinyFront: {w: 190, h: 150},
		shinyBack: {w: 186, h: 142},
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
	banettemegaz: {
		front: {w: 138, h: 192},
		back: {w: 138, h: 192},
		shinyFront: {w: 138, h: 192},
		shinyBack: {w: 138, h: 192},
	},
	arbokmegax: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	arbokmegay: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	charizardmegaxalt: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
	},
	belliboltmega: {
		front: {w: 152, h: 172},
		back: {w: 150, h: 168},
	},
	jynxalt: {
		front: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
	},
	lumineonalt: {
		front: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
	},
	typhlosionalt: {
		front: {w: 64, h: 64},
		back: {w: 150, h: 178},
		shinyFront: {w: 64, h: 64},
	},
	nidokingalt: {
		front: {w: 192, h: 192},
		back: {w: 96, h: 96},
	},
	nidoqueenalt: {
		front: {w: 168, h: 170},
		back: {w: 164, h: 166},
	},
	ninetalesalt: {
		front: {w: 170, h: 170},
		back: {w: 178, h: 170},
	},
	primarinaalt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	decidueyealt: {
		front: {w: 64, h: 64},
		back: {w: 76, h: 152},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 76, h: 152},
	},
	decidueyehisuialt: {
		front: {w: 64, h: 64},
		back: {w: 98, h: 156},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 98, h: 156},
	},
	incineroaralt: {
		front: {w: 64, h: 64},
		back: {w: 168, h: 144},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 168, h: 144},
	},
	appletun: {
		front: {w: 132, h: 148},
		back: {w: 144, h: 144},
		shinyFront: {w: 132, h: 148},
		shinyBack: {w: 144, h: 144},
	},
	appletungmax: {
		front: {w: 140, h: 188},
		back: {w: 122, h: 190},
		shinyFront: {w: 140, h: 188},
		shinyBack: {w: 122, h: 190},
	},
	coalossal: {
		front: {w: 138, h: 166},
		back: {w: 138, h: 160},
		shinyFront: {w: 138, h: 166},
		shinyBack: {w: 138, h: 160},
	},
	coalossalgmax: {
		front: {w: 152, h: 190},
		back: {w: 172, h: 192},
		shinyFront: {w: 152, h: 190},
		shinyBack: {w: 172, h: 192},
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
	flapple: {
		front: {w: 136, h: 100},
		back: {w: 136, h: 100},
		shinyFront: {w: 136, h: 100},
		shinyBack: {w: 136, h: 100},
	},
	flapplegmax: {
		front: {w: 140, h: 188},
		back: {w: 122, h: 190},
		shinyFront: {w: 140, h: 188},
		shinyBack: {w: 122, h: 190},
	},
	dipplingmax: {
		front: {w: 140, h: 188},
		back: {w: 122, h: 190},
		shinyFront: {w: 140, h: 188},
		shinyBack: {w: 122, h: 190},
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
		front: {w: 188, h: 186},
		back: {w: 188, h: 190},
		shinyFront: {w: 188, h: 186},
		shinyBack: {w: 188, h: 190},
	},
	lapras: {
		front: {w: 136, h: 124},
		back: {w: 150, h: 142},
		shinyFront: {w: 136, h: 124},
		shinyBack: {w: 150, h: 142},
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
		front: {w: 190, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 190, h: 192},
		shinyBack: {w: 192, h: 192},
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
	toxtricitylowkeyalt: {
		front: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
	},
	toxtricitylowkeygmaxalt: {
		front: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
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
	serperiorazzy: {
		front: {w: 312, h: 272},
		back: {w: 192, h: 192},
	},
	gallademegaazzy: {
		front: {w: 300, h: 281},
		back: {w: 300, h: 290},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	dragonitemega: {
		front: {w: 178, h: 174},
		back: {w: 174, h: 184},
	},
	raichumegay: {"front":{"h":150,"w":174},"back":{"h":207,"w":282},"shinyBack":{"h":207,"w":282},"shinyFront":{"h":150,"w":174}},
	scolipede: {
		front: {w: 178, h: 164},
		back: {w: 180, h: 158},
		shinyFront: {w: 178, h: 164},
		shinyBack: {w: 180, h: 158},
	},
	scolipedef: {
		front: {w: 178, h: 164},
		back: {w: 180, h: 158},
		shinyFront: {w: 178, h: 164},
		shinyBack: {w: 180, h: 158},
	},
	scolipedeazzy: {
		front: {w: 300, h: 300},
		back: {w: 300, h: 300},
		shinyFront: {w: 300, h: 300},
		shinyBack: {w: 300, h: 300},
	},
	scolipedemegaazzy: {
		front: {w: 300, h: 300},
		back: {w: 189, h: 175},
		shinyFront: {w: 300, h: 300},
		shinyBack: {w: 189, h: 175},
	},
	scolipedemega: {
		front: {w: 178, h: 192},
		back: {w: 186, h: 170},
		shinyFront: {w: 178, h: 192},
		shinyBack: {w: 186, h: 170},
	},
	scolipedemegaf: {
		front: {w: 178, h: 192},
		back: {w: 186, h: 170},
		shinyFront: {w: 178, h: 192},
		shinyBack: {w: 186, h: 170},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	centiskorchgmax: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	cacturnealt: {
		front: {w: 132, h: 160},
		back: {w: 132, h: 160},
		shinyFront: {w: 132, h: 160},
		shinyBack: {w: 132, h: 160},
	},
	sandslashalt: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	haxorusmega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	arcaninealt: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	mightyena: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	mightyenadeso: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	toxicroakdeso: {
		front: {w: 180, h: 152},
		back: {w: 130, h: 128},
		shinyFront: {w: 180, h: 152},
		shinyBack: {w: 130, h: 128},
	},
	cinccinodeso: {
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 124, h: 164},
		back: {w: 124, h: 164},
		shinyFront: {w: 124, h: 164},
		shinyBack: {w: 124, h: 166},
	},
	oricorio: {
		front: {w: 160, h: 170},
		back: {w: 160, h: 170},
		shinyFront: {w: 160, h: 170},
		shinyBack: {w: 160, h: 170},
	},
	oricoriopompom: {
		front: {w: 186, h: 122},
		back: {w: 186, h: 118},
		shinyFront: {w: 186, h: 122},
		shinyBack: {w: 186, h: 118},
	},
	oricoriopau: {
		front: {w: 140, h: 136},
		back: {w: 140, h: 136},
		shinyFront: {w: 140, h: 136},
		shinyBack: {w: 140, h: 136},
	},
	oricoriosensu: {
		front: {w: 146, h: 118},
		back: {w: 152, h: 116},
		shinyFront: {w: 146, h: 118},
		shinyBack: {w: 152, h: 116},
	},
	volcarona: {
		front: {w: 152, h: 132},
		back: {w: 148, h: 134},
		shinyFront: {w: 152, h: 132},
		shinyBack: {w: 148, h: 134},
	},
	volcaronaf: {
		front: {w: 152, h: 132},
		back: {w: 148, h: 134},
		shinyFront: {w: 152, h: 132},
		shinyBack: {w: 148, h: 134},
	},
	alakazam: {
		front: {w: 128, h: 130},
		back: {w: 152, h: 132},
		shinyFront: {w: 144, h: 148},
		shinyBack: {w: 168, h: 148},
	},
	alakazamf: {
		front: {w: 128, h: 130},
		back: {w: 152, h: 132},
		shinyFront: {w: 144, h: 148},
		shinyBack: {w: 168, h: 148},
	},
	alakazammega: {
		front: {w: 178, h: 172},
		back: {w: 152, h: 178},
		shinyFront: {w: 182, h: 176},
		shinyBack: {w: 158, h: 182},
	},
	alakazammegaf: {
		front: {w: 178, h: 172},
		back: {w: 152, h: 178},
		shinyFront: {w: 182, h: 176},
		shinyBack: {w: 158, h: 182},
	},
	mothim: {
		front: {w: 184, h: 160},
		back: {w: 166, h: 114},
		shinyFront: {w: 184, h: 160},
		shinyBack: {w: 166, h: 114},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	gholdengo: {
		front: {w: 120, h: 146},
		back: {w: 116, h: 146},
		shinyFront: {w: 120, h: 146},
		shinyBack: {w: 116, h: 146},
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
		front: {w: 190, h: 182},
		back: {w: 160, h: 182},
		shinyFront: {w: 190, h: 182},
		shinyBack: {w: 160, h: 182},
	},
	tyrantrum: {
		front: {w: 140, h: 148},
		back: {w: 158, h: 152},
		shinyFront: {w: 140, h: 148},
		shinyBack: {w: 158, h: 152},
	},
	venusaur: {
		front: {w: 152, h: 136},
		back: {w: 162, h: 126},
	},
	venusaurf: {
		front: {w: 152, h: 136},
		back: {w: 162, h: 126},
	},
	venusaurmega: {
		front: {w: 188, h: 148},
		back: {w: 186, h: 144},
	},
	venusaurmegaf: {
		front: {w: 188, h: 148},
		back: {w: 186, h: 144},
	},
	venusaurgmax: {
		front: {w: 192, h: 178},
		back: {w: 188, h: 170},
	},
	venusaurgmaxf: {
		front: {w: 192, h: 178},
		back: {w: 188, h: 170},
	},
	floettemega: {
		front: {w: 176, h: 138},
		back: {w: 166, h: 150},
		shinyFront: {w: 176, h: 138},
		shinyBack: {w: 166, h: 150},
	},
	floetteeternal: {
		front: {w: 124, h: 134},
		back: {w: 124, h: 134},
		shinyFront: {w: 124, h: 134},
		shinyBack: {w: 124, h: 134},
	},
	eelektross: {
		front: {w: 154, h: 118},
		back: {w: 166, h: 124},
		shinyFront: {w: 154, h: 118},
		shinyBack: {w: 166, h: 124},
	},
	eelektrossmega: {
		front: {w: 174, h: 154},
		back: {w: 192, h: 164},
		shinyFront: {w: 174, h: 154},
		shinyBack: {w: 192, h: 164},
	},
	magearna: {
		front: {w: 90, h: 128},
		back: {w: 82, h: 128},
		shinyFront: {w: 90, h: 128},
		shinyBack: {w: 82, h: 128},
	},
	magearnamega: {
		front: {w: 164, h: 152},
		back: {w: 190, h: 148},
		shinyFront: {w: 164, h: 152},
		shinyBack: {w: 190, h: 148},
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
		shinyFront: {w: 64, h: 64},
	},
	tinkaton: {
		front: {w: 144, h: 148},
		back: {w: 180, h: 152},
		shinyFront: {w: 144, h: 148},
		shinyBack: {w: 180, h: 152},
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
		front: {w: 104, h: 112},
		back: {w: 82, h: 112},
	},
	weavilef: {
		front: {w: 104, h: 112},
		back: {w: 82, h: 112},
	},
	espeon: {
		front: {w: 100, h: 106},
		back: {w: 80, h: 100},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	gengar: {
		front: {w: 112, h: 104},
		back: {w: 110, h: 108},
		shinyFront: {w: 116, h: 108},
		shinyBack: {w: 114, h: 112},
	},
	gengarmega: {
		front: {w: 152, h: 132},
		back: {w: 172, h: 132},
		shinyFront: {w: 156, h: 136},
		shinyBack: {w: 176, h: 136},
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
		front: {w: 182, h: 188},
		back: {w: 188, h: 190},
		shinyFront: {w: 182, h: 188},
		shinyBack: {w: 188, h: 190},
	},
	ironvaliant: {
		front: {w: 120, h: 162},
		back: {w: 120, h: 162},
	},
	grimmsnarl: {
		front: {w: 192, h: 152},
		back: {w: 192, h: 152},
	},
	grimmsnarlazzy: {
		front: {w: 300, h: 261},
		back: {w: 300, h: 300},
		shinyFront: {w: 300, h: 261},
		shinyBack: {w: 300, h: 300},
	},
	grimmsnarlgmaxazzy: {
		front: {w: 300, h: 334},
		back: {w: 400, h: 505},
		shinyFront: {w: 300, h: 334},
		shinyBack: {w: 400, h: 505},
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
		back: {w: 154, h: 144},
	},
	inteleon: {
		front: {w: 114, h: 192},
		back: {w: 114, h: 192},
		shinyFront: {w: 112, h: 160},
		shinyBack: {w: 112, h: 156},
	},
	inteleongmax: {
		front: {w: 126, h: 192},
		back: {w: 124, h: 180},
		shinyFront: {w: 126, h: 192},
		shinyBack: {w: 124, h: 180},
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
		front: {w: 118, h: 152},
		back: {w: 110, h: 140},
		shinyFront: {w: 118, h: 152},
		shinyBack: {w: 110, h: 140},
	},
	typhlosionhisui: {
		front: {w: 116, h: 154},
		back: {w: 112, h: 150},
		shinyFront: {w: 116, h: 154},
		shinyBack: {w: 112, h: 150},
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
	cinderacemega: {
		front: {w: 130, h: 130},
		back: {w: 94, h: 170},
		shinyFront: {w: 130, h: 130},
		shinyBack: {w: 94, h: 170},
	},
	ledianmega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	ariadosmega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	clawitzermega: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
	feraligatrgmax: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	silvallywater: {
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
		shinyFront: {w: 142, h: 186},
		shinyBack: {w: 126, h: 184},
	},
	silvallygrass: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	silvallyelectric: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
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
	laprasaevian: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	eeveestarteralt: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	laprasazzy: {
		front: {w: 300, h: 300},
		back: {w: 300, h: 300},
		shinyFront: {w: 300, h: 300},
		shinyBack: {w: 300, h: 300},
	},
	jellicentazzy: {
		front: {w: 300, h: 300},
		back: {w: 300, h: 300},
		shinyFront: {w: 300, h: 300},
		shinyBack: {w: 300, h: 300},
	},
	samurottalt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	samurotthisuialt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	goodrahisuialt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	machampalt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	machampgmaxalt: {
		front: {w: 64, h: 64},
		back: {w: 96, h: 96},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 96, h: 96},
	},
	skeledirgealt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	tsareenaalt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
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
	zangoosereborn: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	seviperreborn: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	chimechomegay: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	meganiummegay: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	raichumegax: {"front":{"h":138,"w":182},"back":{"h":204,"w":273},"shinyBack":{"h":204,"w":273},"shinyFront":{"h":138,"w":182}},
};

// Supplied Furfrou trims, including distinct female shiny palettes.
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES, {
	furfroupharaoh: {"back":{"h":126,"w":94},"front":{"h":130,"w":96},"shinyFront":{"h":130,"w":96},"shinyBack":{"h":126,"w":94}},
	furfrouf: {"back":{"h":128,"w":96},"front":{"h":124,"w":88},"shinyFront":{"h":124,"w":88},"shinyBack":{"h":128,"w":96}},
	furfroudiamondf: {"back":{"h":118,"w":82},"front":{"h":122,"w":84},"shinyFront":{"h":122,"w":84},"shinyBack":{"h":118,"w":82}},
	furfrouheartf: {"back":{"h":128,"w":88},"front":{"h":132,"w":88},"shinyFront":{"h":132,"w":88},"shinyBack":{"h":128,"w":88}},
	furfroumatron: {"back":{"h":126,"w":98},"front":{"h":128,"w":100},"shinyFront":{"h":128,"w":100},"shinyBack":{"h":126,"w":98}},
	furfroulareinef: {"back":{"h":124,"w":94},"front":{"h":128,"w":94},"shinyFront":{"h":128,"w":94},"shinyBack":{"h":124,"w":94}},
	furfroustarf: {"back":{"h":126,"w":96},"front":{"h":128,"w":96},"shinyFront":{"h":128,"w":96},"shinyBack":{"h":126,"w":96}},
	furfroupharaohf: {"back":{"h":126,"w":94},"front":{"h":130,"w":96},"shinyFront":{"h":130,"w":96},"shinyBack":{"h":126,"w":94}},
	furfrouheart: {"back":{"h":128,"w":88},"front":{"h":132,"w":88},"shinyFront":{"h":132,"w":88},"shinyBack":{"h":128,"w":88}},
	furfroudandyf: {"back":{"h":130,"w":92},"front":{"h":132,"w":92},"shinyFront":{"h":132,"w":92},"shinyBack":{"h":130,"w":92}},
	furfroustar: {"back":{"h":126,"w":96},"front":{"h":128,"w":96},"shinyFront":{"h":128,"w":96},"shinyBack":{"h":126,"w":96}},
	furfroulareine: {"back":{"h":124,"w":94},"front":{"h":128,"w":94},"shinyFront":{"h":128,"w":94},"shinyBack":{"h":124,"w":94}},
	furfrou: {"back":{"h":128,"w":96},"front":{"h":124,"w":88},"shinyFront":{"h":124,"w":88},"shinyBack":{"h":128,"w":96}},
	furfroudebutantef: {"back":{"h":128,"w":102},"front":{"h":130,"w":102},"shinyFront":{"h":130,"w":102},"shinyBack":{"h":128,"w":102}},
	furfroumatronf: {"back":{"h":126,"w":98},"front":{"h":128,"w":100},"shinyFront":{"h":128,"w":100},"shinyBack":{"h":126,"w":98}},
	furfroudebutante: {"back":{"h":128,"w":102},"front":{"h":130,"w":102},"shinyFront":{"h":130,"w":102},"shinyBack":{"h":128,"w":102}},
	furfroukabukif: {"back":{"h":126,"w":80},"front":{"h":128,"w":80},"shinyFront":{"h":128,"w":80},"shinyBack":{"h":126,"w":80}},
	furfroukabuki: {"back":{"h":126,"w":80},"front":{"h":128,"w":80},"shinyFront":{"h":128,"w":80},"shinyBack":{"h":126,"w":80}},
	furfroudiamond: {"back":{"h":118,"w":82},"front":{"h":122,"w":84},"shinyFront":{"h":122,"w":84},"shinyBack":{"h":118,"w":82}},
	furfroudandy: {"back":{"h":130,"w":92},"front":{"h":132,"w":92},"shinyFront":{"h":132,"w":92},"shinyBack":{"h":130,"w":92}},
});

const CUSTOM_BW_SPRITES: {[id: string]: AnyObject} = {
	abysseon: {num: 133, front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	divineon: {num: 133, front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	froslass: {num: 478, front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	lilligantrift: {num: 549, front: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}},
	scizor: {num: 212, front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	scizormega: {num: 212, front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	medichamf: {num: 308, front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	medichammega: {num: 308, front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}},
	aerodactylmega: {num: 142, front: {w: 192, h: 192}, back: {w: 192, h: 192}, shinyFront: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}},
	reuniclusmega: {num: 579, front: {w: 192, h: 192}, back: {w: 192, h: 192}},
	sunfloramega: {num: 192, front: {w: 192, h: 192}, back: {w: 192, h: 192}},
	claydolmega: {num: 344, front: {w: 192, h: 192}, back: {w: 192, h: 192}},
	clefable: {
		num: 36,
		front: {w: 104, h: 102},
		back: {w: 106, h: 102},
		shinyFront: {w: 104, h: 102},
		shinyBack: {w: 106, h: 102},
	},
	clefablemega: {
		num: 36,
		front: {w: 192, h: 124},
		back: {w: 192, h: 124},
		shinyFront: {w: 192, h: 124},
		shinyBack: {w: 192, h: 124},
	},
	froslassmega: {
		num: 478,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	glimmora: {
		num: 970,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	glimmoramega: {
		num: 970,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	delphox: {
		num: 655,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	delphoxmega: {
		num: 655,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	chandelure: {
		num: 609,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	chesnaught: {
		num: 652,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	crobatalt: {
		num: 169,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	corsolaalt: {
		num: 222,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	mukpulse: {
		num: 89,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	tentacruelalt: {
		num: 73,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	granbullalt: {
		num: 210,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	furfrouheart: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroustar: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroudiamond: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroudebutante: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroumatron: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroudandy: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroulareine: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroukabuki: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	furfroupharaoh: {front: {w: 120, h: 120}, shinyFront: {w: 120, h: 120}},
	// Cosplay forms use explicit BW assets so the team builder and battle
	// renderer agree on the sprite ID instead of falling back to missing
	// modern dex art for the less common forms.
	pikachucosplay: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachurockstar: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachubelle: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachupopstar: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachuphd: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachulibre: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachupartner: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	pikachustarter: {
		num: 25,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	lanturnalt: {
		num: 171,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	umbreonperfect: {
		num: 197,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	jynxalt: {
		num: 124,
		front: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
	},
	lumineonalt: {
		num: 457,
		front: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
	},
	roserademega: {
		num: 407,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	lycanroc: {
		num: 745,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	lycanrocmidday: {
		num: 745,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	lycanrocmidnight: {
		num: 745,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	lycanrocdusk: {
		num: 745,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	glimmora: {
		num: 970,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
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
	rillaboom: {
		num: 812,
		front: {w: 174, h: 190},
		back: {w: 174, h: 178},
		shinyFront: {w: 174, h: 190},
		shinyBack: {w: 174, h: 178},
	},
	rillaboomgmax: {
		num: 812,
		front: {w: 190, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 190, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	kleavor: {
		num: 900,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	golisopod: {
		num: 768,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	noivern: {
		num: 715,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
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
		shinyBack: {w: 126, h: 132},
	},
	pidgeotmega: {
		num: 18,
		front: {w: 184, h: 170},
		back: {w: 182, h: 176},
	},
	heracross: {
		num: 214,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	staraptor: {
		num: 398,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	aggron: {
		num: 306,
		front: {w: 146, h: 140},
		back: {w: 128, h: 146},
		shinyBack: {w: 128, h: 144},
	},
	aggronmega: {
		num: 306,
		front: {w: 194, h: 152},
		back: {w: 186, h: 144},
		shinyFront: {w: 190, h: 150},
		shinyBack: {w: 186, h: 142},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
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
	laprasaevian: {
		num: 131,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	drapionaevian: {
		num: 452,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	sneasleraevian: {
		num: 903,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	mismagiusaevian: {
		num: 429,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	volcaronaaevian: {
		num: 905,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	volcarona: {
		num: 637,
		front: {w: 152, h: 132},
		back: {w: 148, h: 134},
		shinyFront: {w: 152, h: 132},
		shinyBack: {w: 148, h: 134},
	},
	volcaronaf: {
		num: 637,
		front: {w: 152, h: 132},
		back: {w: 148, h: 134},
		shinyFront: {w: 152, h: 132},
		shinyBack: {w: 148, h: 134},
	},
	magearna: {
		num: 801,
		front: {w: 90, h: 128},
		back: {w: 82, h: 128},
		shinyFront: {w: 90, h: 128},
		shinyBack: {w: 82, h: 128},
	},
	magearnamega: {
		num: 801,
		front: {w: 164, h: 152},
		back: {w: 190, h: 148},
		shinyFront: {w: 164, h: 152},
		shinyBack: {w: 190, h: 148},
	},
	toxtricityaevian: {
		num: 849,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
		shinyFront: {w: 96, h: 96},
		shinyBack: {w: 96, h: 96},
	},
	eeveestarteralt: {
		num: 133,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	laprasazzy: {
		num: 131,
		front: {w: 300, h: 300},
		back: {w: 300, h: 300},
		shinyFront: {w: 300, h: 300},
		shinyBack: {w: 300, h: 300},
	},
	jellicentazzy: {
		num: 593,
		front: {w: 300, h: 300},
		back: {w: 300, h: 300},
		shinyFront: {w: 300, h: 300},
		shinyBack: {w: 300, h: 300},
	},
	samurottalt: {
		num: 503,
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	samurotthisuialt: {
		num: 503,
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	goodrahisuialt: {
		num: 706,
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	machampalt: {
		num: 68,
		front: {w: 64, h: 64},
		back: {w: 96, h: 96},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 96, h: 96},
	},
	machampgmaxalt: {
		num: 68,
		front: {w: 64, h: 64},
		back: {w: 96, h: 96},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 96, h: 96},
	},
	skeledirgealt: {
		num: 911,
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	tsareenaalt: {
		num: 763,
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	primarinaalt: {
		num: 730,
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	decidueyealt: {
		num: 724,
		front: {w: 64, h: 64},
		back: {w: 76, h: 152},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 76, h: 152},
	},
	decidueyehisuialt: {
		num: 724,
		front: {w: 64, h: 64},
		back: {w: 98, h: 156},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 98, h: 156},
	},
	incineroaralt: {
		num: 727,
		front: {w: 64, h: 64},
		back: {w: 168, h: 144},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 168, h: 144},
	},
	belliboltmega: {
		num: 939,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	typhlosionalt: {
		num: 157,
		front: {w: 64, h: 64},
		back: {w: 192, h: 192},
		shinyFront: {w: 64, h: 64},
	},
	nidokingalt: {
		num: 34,
		front: {w: 192, h: 192},
		back: {w: 96, h: 96},
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
	zangoosereborn: {
		num: 335,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	seviperreborn: {
		num: 336,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	charizardgmax: {
		num: 6,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	appletun: {
		num: 842,
		front: {w: 132, h: 148},
		back: {w: 144, h: 144},
		shinyFront: {w: 132, h: 148},
		shinyBack: {w: 144, h: 144},
	},
	appletungmax: {
		num: 842,
		front: {w: 140, h: 188},
		back: {w: 122, h: 190},
		shinyFront: {w: 140, h: 188},
		shinyBack: {w: 122, h: 190},
	},
	blastoisegmax: {
		num: 9,
		front: {w: 182, h: 180},
		back: {w: 190, h: 186},
	},
	coalossal: {
		num: 839,
		front: {w: 138, h: 166},
		back: {w: 138, h: 160},
		shinyFront: {w: 138, h: 166},
		shinyBack: {w: 138, h: 160},
	},
	coalossalgmax: {
		num: 839,
		front: {w: 152, h: 190},
		back: {w: 172, h: 192},
		shinyFront: {w: 152, h: 190},
		shinyBack: {w: 172, h: 192},
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
	flapple: {
		num: 841,
		front: {w: 136, h: 100},
		back: {w: 136, h: 100},
		shinyFront: {w: 136, h: 100},
		shinyBack: {w: 136, h: 100},
	},
	flapplegmax: {
		num: 841,
		front: {w: 140, h: 188},
		back: {w: 122, h: 190},
		shinyFront: {w: 140, h: 188},
		shinyBack: {w: 122, h: 190},
	},
	dipplingmax: {
		num: 1011,
		front: {w: 140, h: 188},
		back: {w: 122, h: 190},
		shinyFront: {w: 140, h: 188},
		shinyBack: {w: 122, h: 190},
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
		shinyFront: {w: 182, h: 176},
		shinyBack: {w: 158, h: 182},
	},
	alakazam: {
		num: 65,
		front: {w: 128, h: 130},
		back: {w: 152, h: 132},
		shinyFront: {w: 144, h: 148},
		shinyBack: {w: 168, h: 148},
	},
	alakazamf: {
		num: 65,
		front: {w: 128, h: 130},
		back: {w: 152, h: 132},
		shinyFront: {w: 144, h: 148},
		shinyBack: {w: 168, h: 148},
	},
	alakazammegaf: {
		num: 65,
		front: {w: 178, h: 172},
		back: {w: 152, h: 178},
		shinyFront: {w: 182, h: 176},
		shinyBack: {w: 158, h: 182},
	},
	alakazamalt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
	},
	alakazammegaalt: {
		front: {w: 64, h: 64},
		back: {w: 64, h: 64},
		shinyFront: {w: 64, h: 64},
		shinyBack: {w: 64, h: 64},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	centiskorchgmax: {
		num: 851,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	cacturnealt: {
		num: 332,
		front: {w: 132, h: 160},
		back: {w: 132, h: 160},
		shinyFront: {w: 132, h: 160},
		shinyBack: {w: 132, h: 160},
	},
	mightyena: {
		num: 262,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	mightyenadeso: {
		num: 262,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	toxicroakdeso: {
		num: 454,
		front: {w: 180, h: 152},
		back: {w: 130, h: 128},
		shinyFront: {w: 180, h: 152},
		shinyBack: {w: 130, h: 128},
	},
	cinccinodeso: {
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 124, h: 164},
		back: {w: 124, h: 164},
		shinyFront: {w: 124, h: 164},
		shinyBack: {w: 124, h: 166},
	},
	oricorio: {
		num: 741,
		front: {w: 160, h: 170},
		back: {w: 160, h: 170},
		shinyFront: {w: 160, h: 170},
		shinyBack: {w: 160, h: 170},
	},
	oricoriopompom: {
		num: 741,
		front: {w: 186, h: 122},
		back: {w: 186, h: 118},
		shinyFront: {w: 186, h: 122},
		shinyBack: {w: 186, h: 118},
	},
	oricoriopau: {
		num: 741,
		front: {w: 140, h: 136},
		back: {w: 140, h: 136},
		shinyFront: {w: 140, h: 136},
		shinyBack: {w: 140, h: 136},
	},
	oricoriosensu: {
		num: 741,
		front: {w: 146, h: 118},
		back: {w: 152, h: 116},
		shinyFront: {w: 146, h: 118},
		shinyBack: {w: 152, h: 116},
	},
	mothim: {
		num: 414,
		front: {w: 184, h: 160},
		back: {w: 166, h: 114},
		shinyFront: {w: 184, h: 160},
		shinyBack: {w: 166, h: 114},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	charizardmegax: {
		num: 6,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	charizardmegay: {
		num: 6,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	charizardalt: {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	gholdengo: {
		num: 1000,
		front: {w: 120, h: 146},
		back: {w: 116, h: 146},
		shinyFront: {w: 120, h: 146},
		shinyBack: {w: 116, h: 146},
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
		front: {w: 190, h: 182},
		back: {w: 160, h: 182},
		shinyFront: {w: 190, h: 182},
		shinyBack: {w: 160, h: 182},
	},
	tyrantrum: {
		num: 697,
		front: {w: 140, h: 148},
		back: {w: 158, h: 152},
		shinyFront: {w: 140, h: 148},
		shinyBack: {w: 158, h: 152},
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
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
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
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	scraftymega: {
		num: 560,
		front: {w: 98, h: 130},
		back: {w: 106, h: 126},
		shinyFront: {w: 98, h: 130},
		shinyBack: {w: 106, h: 126},
	},
	skarmorymega: {
		num: 227,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		shinyFront: {w: 64, h: 64},
	},
	tinkaton: {
		num: 959,
		front: {w: 144, h: 148},
		back: {w: 180, h: 152},
		shinyFront: {w: 144, h: 148},
		shinyBack: {w: 180, h: 152},
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
		front: {w: 104, h: 112},
		back: {w: 82, h: 112},
		frontf: {w: 104, h: 112},
		backf: {w: 82, h: 112},
	},
	weavilef: {
		num: 461,
		front: {w: 104, h: 112},
		back: {w: 82, h: 112},
	},
	espeon: {
		num: 196,
		front: {w: 100, h: 106},
		back: {w: 80, h: 100},
		// The supplied shiny canvases are 192px, with BW artwork centered inside.
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		shinyFront: {w: 102, h: 144},
		shinyBack: {w: 120, h: 130},
	},
	corviknightgmax: {
		num: 823,
		front: {w: 182, h: 188},
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
		back: {w: 154, h: 144},
	},
	inteleon: {
		num: 818,
		front: {w: 114, h: 192},
		back: {w: 114, h: 192},
		shinyFront: {w: 112, h: 160},
		shinyBack: {w: 112, h: 156},
	},
	inteleongmax: {
		num: 818,
		front: {w: 126, h: 192},
		back: {w: 124, h: 180},
		shinyFront: {w: 126, h: 192},
		shinyBack: {w: 124, h: 180},
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
		front: {w: 118, h: 152},
		back: {w: 110, h: 140},
		shinyFront: {w: 118, h: 152},
		shinyBack: {w: 110, h: 140},
	},
	typhlosionhisui: {
		num: 157,
		front: {w: 116, h: 154},
		back: {w: 112, h: 150},
		shinyFront: {w: 116, h: 154},
		shinyBack: {w: 112, h: 150},
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
	cinderacemega: {
		num: 815,
		front: {w: 130, h: 130},
		back: {w: 94, h: 170},
		shinyFront: {w: 130, h: 130},
		shinyBack: {w: 94, h: 170},
	},
	ledianmega: {
		num: 166,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	ariadosmega: {
		num: 168,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	clawitzer: {
		num: 693,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	clawitzermega: {
		num: 693,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
	feraligatrgmax: {
		num: 160,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	silvallywater: {
		num: 773,
		front: {w: 138, h: 184},
		back: {w: 118, h: 180},
	},
	silvallygrass: {
		num: 773,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	silvallyelectric: {
		num: 773,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
	raichumegax: {"num":26,"front":{"h":138,"w":182},"back":{"h":204,"w":273},"shinyBack":{"h":204,"w":273},"shinyFront":{"h":138,"w":182}},
	raichumegay: {"num":26,"front":{"h":150,"w":174},"back":{"h":207,"w":282},"shinyBack":{"h":207,"w":282},"shinyFront":{"h":150,"w":174}},
	scolipede: {
		num: 545,
		front: {w: 178, h: 164},
		back: {w: 180, h: 158},
		shinyFront: {w: 178, h: 164},
		shinyBack: {w: 180, h: 158},
	},
	scolipedemega: {
		num: 545,
		front: {w: 178, h: 192},
		back: {w: 186, h: 170},
		shinyFront: {w: 178, h: 192},
		shinyBack: {w: 186, h: 170},
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
	greninja: {
		num: 658,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	greninjabond: {
		num: 658,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	greninjamega: {
		num: 658,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	pyroarmega: {
		num: 668,
		front: {w: 96, h: 96},
		back: {w: 96, h: 96},
	},
	chesnaughtmega: {
		num: 652,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
	bronzongrejuv: {
		num: 437,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	palossandrocky: {
		num: 770,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	palossandfiery: {
		num: 770,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	palossandicy: {
		num: 770,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	musharnarejuv: {
		num: 518,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	florgesreborn: {
		num: 671,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	unfezantrejuv: {
		num: 521,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
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
		shinyFront: {w: 136, h: 128},
		shinyBack: {w: 148, h: 130},
	},
	zoroarkhisui: {
		num: 571,
		front: {w: 140, h: 182},
		back: {w: 140, h: 156},
		shinyFront: {w: 140, h: 182},
		shinyBack: {w: 140, h: 156},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	manectric: {
		num: 310,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
	},
	manectricmega: {
		num: 310,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
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
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	crabominablemega: {
		num: 740,
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
	absol: {
		num: 359,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	absolmega: {
		num: 359,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
	absolmegaz: {
		num: 359,
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	},
};

const Z_PROTEAN_STATIC_SPRITE_IDS = [
	'braveon', 'nimbeon', 'toxeon', 'dusteon', 'basaleon',
	'ephemeon', 'kitsuneon', 'titaneon', 'byteon', 'drekeon',
] as const;
for (const id of Z_PROTEAN_STATIC_SPRITE_IDS) {
	const dimensions = {
		front: {w: 192, h: 192},
		back: {w: 192, h: 192},
		shinyFront: {w: 192, h: 192},
		shinyBack: {w: 192, h: 192},
	};
	CUSTOM_STATIC_BATTLE_SPRITES[id] = dimensions;
	CUSTOM_BW_SPRITES[id] = {num: 133, ...dimensions};
}

Object.assign(CUSTOM_SPECIES, {
	braveon: {
		base: 'eeveestarter',
		data: {name: 'Braveon', baseSpecies: 'Eevee-Starter', forme: 'Fighting', spriteid: 'braveon', types: ['Fighting'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	nimbeon: {
		base: 'eeveestarter',
		data: {name: 'Nimbeon', baseSpecies: 'Eevee-Starter', forme: 'Flying', spriteid: 'nimbeon', types: ['Flying'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	toxeon: {
		base: 'eeveestarter',
		data: {name: 'Toxeon', baseSpecies: 'Eevee-Starter', forme: 'Poison', spriteid: 'toxeon', types: ['Poison'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	dusteon: {
		base: 'eeveestarter',
		data: {name: 'Dusteon', baseSpecies: 'Eevee-Starter', forme: 'Ground', spriteid: 'dusteon', types: ['Ground'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	basaleon: {
		base: 'eeveestarter',
		data: {name: 'Basaleon', baseSpecies: 'Eevee-Starter', forme: 'Rock', spriteid: 'basaleon', types: ['Rock'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	ephemeon: {
		base: 'eeveestarter',
		data: {name: 'Ephemeon', baseSpecies: 'Eevee-Starter', forme: 'Bug', spriteid: 'ephemeon', types: ['Bug'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	kitsuneon: {
		base: 'eeveestarter',
		data: {name: 'Kitsuneon', baseSpecies: 'Eevee-Starter', forme: 'Ghost', spriteid: 'kitsuneon', types: ['Ghost'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	titaneon: {
		base: 'eeveestarter',
		data: {name: 'Titaneon', baseSpecies: 'Eevee-Starter', forme: 'Steel', spriteid: 'titaneon', types: ['Steel'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	byteon: {
		base: 'eeveestarter',
		data: {name: 'Byteon', baseSpecies: 'Eevee-Starter', forme: 'Qmarks', spriteid: 'byteon', types: ['???'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	drekeon: {
		base: 'eeveestarter',
		data: {name: 'Drekeon', baseSpecies: 'Eevee-Starter', forme: 'Dragon', spriteid: 'drekeon', types: ['Dragon'], battleOnly: 'Eevee-Starter', isNonstandard: 'Custom'},
	},
	unfezantrejuv: {
		base: 'unfezant',
		data: {
			name: 'Unfezant-Rejuv',
			baseSpecies: 'Unfezant',
			forme: 'Rejuv',
			spriteid: 'unfezant-rejuv',
			types: ['Rock', 'Fighting'],
			baseStats: {hp: 90, atk: 125, def: 105, spa: 40, spd: 80, spe: 107},
			abilities: {0: 'Unova Wing', 1: 'Aevian Wing'},
			battleOnly: 'Unfezant',
			requiredAbility: 'Aevian Wing',
			standalone: true,
			isNonstandard: 'Custom',
		},
	},
	gligaralt: {
		base: 'gligar',
		data: {
			name: 'Gligar-Alt',
			baseSpecies: 'Gligar',
			forme: 'Alt',
			spriteid: 'gligar-alt',
			changesFrom: 'Gligar',
			isNonstandard: 'Custom',
		},
	},
	gliscoralt: {
		base: 'gliscor',
		data: {
			name: 'Gliscor-Alt',
			baseSpecies: 'Gliscor',
			forme: 'Alt',
			spriteid: 'gliscor-alt',
			changesFrom: 'Gliscor',
			isNonstandard: 'Custom',
		},
	},
	bronzongrejuv: {
		base: 'bronzong',
		data: {
			name: 'Bronzong-Rejuv',
			baseSpecies: 'Bronzong',
			forme: 'Rejuv',
			spriteid: 'bronzong-rejuv',
			types: ['Steel'],
			changesFrom: 'Bronzong',
			isNonstandard: 'Custom',
		},
	},
	musharnarejuv: {
		base: 'musharna',
		data: {
			name: 'Musharna-Rejuv',
			baseSpecies: 'Musharna',
			forme: 'Rejuv',
			spriteid: 'musharna-rejuv',
			types: ['Dark', 'Fairy'],
			baseStats: {hp: 120, atk: 110, def: 105, spa: 45, spd: 95, spe: 25},
			abilities: {0: 'Aevian Dream'},
			battleOnly: 'Musharna',
			requiredAbility: 'Aevian Dream',
			changesFrom: 'Musharna',
			isNonstandard: 'Custom',
		},
	},
	florgesreborn: {
		base: 'florges',
		data: {
			name: 'Florges-Reborn',
			baseSpecies: 'Florges',
			forme: 'Reborn',
			spriteid: 'florges-reborn',
			types: ['Fairy', 'Fire'],
			baseStats: {hp: 74, atk: 65, def: 67, spa: 125, spd: 128, spe: 92},
			abilities: {0: 'Reborn Flower', 1: 'Sworn Duty', H: 'Symbiosis'},
			changesFrom: 'Florges',
			isNonstandard: 'Custom',
		},
	},
});

const CUSTOM_SPECIES_UPDATES: {[id: string]: AnyObject} = {
	pinsir: {types: ['Bug', 'Ground'], abilities: {0: 'Hyper Cutter', 1: 'Hardy Skin', H: 'Violent Rush'}},
	noctowl: {"baseStats":{"hp":100,"atk":50,"def":78,"spa":96,"spd":106,"spe":80},"otherFormes":["Noctowl-Mega"],"formeOrder":["Noctowl","Noctowl-Mega"]},
	hypno: {baseStats: {hp: 85, atk: 60, def: 80, spa: 93, spd: 115, spe: 67}, otherFormes: ['Hypno-Pulse'], formeOrder: ['Hypno', 'Hypno-Pulse']},
	lilligant: {baseStats: {hp: 80, atk: 60, def: 80, spa: 110, spd: 80, spe: 90}, otherFormes: ['Lilligant-Hisui', 'Lilligant-Rift', 'Lilligant-Hisui-Rift'], formeOrder: ['Lilligant', 'Lilligant-Hisui', 'Lilligant-Rift', 'Lilligant-Hisui-Rift']},
	lilliganthisui: {baseStats: {hp: 80, atk: 105, def: 80, spa: 50, spd: 80, spe: 105}, otherFormes: ['Lilligant-Hisui-Rift'], formeOrder: ['Lilligant-Hisui', 'Lilligant-Hisui-Rift']},
	bellibolt: {otherFormes: ['Bellibolt-Mega'], cosmeticFormes: [], formeOrder: ['Bellibolt', 'Bellibolt-Mega']},
	sunflora: {baseStats: {hp: 95, atk: 55, def: 75, spa: 125, spd: 90, spe: 30}, otherFormes: ['Sunflora-Mega'], formeOrder: ['Sunflora', 'Sunflora-Mega']},
	claydol: {otherFormes: ['Claydol-Mega'], formeOrder: ['Claydol', 'Claydol-Mega']},
	meganium: {
		otherFormes: ['Meganium-Mega', 'Meganium-Mega-Y'],
		formeOrder: ['Meganium', 'Meganium-Mega', 'Meganium-Mega-Y'],
	},
	chimecho: {
		otherFormes: ['Chimecho-Mega', 'Chimecho-Mega-Y'],
		formeOrder: ['Chimecho', 'Chimecho-Mega', 'Chimecho-Mega-Y'],
	},
	// Furfrou's trims are server-defined forms, but the team builder needs
	// explicit cosmetic links and sprite IDs for every graphics preference.
	furfrou: {
		otherFormes: [
			'Furfrou-Heart', 'Furfrou-Star', 'Furfrou-Diamond', 'Furfrou-Debutante',
			'Furfrou-Matron', 'Furfrou-Dandy', 'Furfrou-La Reine', 'Furfrou-Kabuki', 'Furfrou-Pharaoh',
		],
		cosmeticFormes: [
			'Furfrou-Heart', 'Furfrou-Star', 'Furfrou-Diamond', 'Furfrou-Debutante',
			'Furfrou-Matron', 'Furfrou-Dandy', 'Furfrou-La Reine', 'Furfrou-Kabuki', 'Furfrou-Pharaoh',
		],
		formeOrder: [
			'Furfrou', 'Furfrou-Heart', 'Furfrou-Star', 'Furfrou-Diamond', 'Furfrou-Debutante',
			'Furfrou-Matron', 'Furfrou-Dandy', 'Furfrou-La Reine', 'Furfrou-Kabuki', 'Furfrou-Pharaoh',
		],
	},
	furfrouheart: {spriteid: 'furfrou-heart'},
	furfroustar: {spriteid: 'furfrou-star'},
	furfroudiamond: {spriteid: 'furfrou-diamond'},
	furfroudebutante: {spriteid: 'furfrou-debutante'},
	furfroumatron: {spriteid: 'furfrou-matron'},
	furfroudandy: {spriteid: 'furfrou-dandy'},
	furfroulareine: {spriteid: 'furfrou-lareine'},
	furfroukabuki: {spriteid: 'furfrou-kabuki'},
	furfroupharaoh: {spriteid: 'furfrou-pharaoh'},
	florges: {
		abilities: {0: 'Reborn Flower', 1: 'Sworn Duty', H: 'Symbiosis'},
		otherFormes: ['Florges-Reborn'],
		cosmeticFormes: ['Florges-Blue', 'Florges-Orange', 'Florges-White', 'Florges-Yellow', 'Florges-Reborn'],
		formeOrder: ['Florges', 'Florges-Yellow', 'Florges-Orange', 'Florges-Blue', 'Florges-White', 'Florges-Reborn'],
	},
	florgesreborn: {
		types: ['Fairy', 'Fire'],
		baseStats: {hp: 74, atk: 65, def: 67, spa: 125, spd: 128, spe: 92},
		abilities: {0: 'Reborn Flower', 1: 'Sworn Duty', H: 'Symbiosis'},
	},
	falinksmega: {
		types: ['Fighting', 'Steel'],
	},
	staraptor: {
		baseStats: {hp: 85, atk: 120, def: 80, spa: 50, spd: 70, spe: 105},
	},
	staraptormega: {
		baseStats: {hp: 85, atk: 140, def: 110, spa: 60, spd: 100, spe: 115},
	},
	luxray: {
		otherFormes: ['Luxray-Mega'],
		cosmeticFormes: [],
		formeOrder: ['Luxray', 'Luxray-Mega'],
	},
	mismagius: {
		abilities: {0: 'Levitate', 1: 'Temporal Shift', H: 'Shadow Tag'},
	},
	lucario: {
		abilities: {0: "Mind's Eye", 1: 'Sworn Duty', H: 'Armorize'},
	},
	bronzong: {
		baseStats: {spa: 89},
		abilities: {0: 'Elevate', 1: 'Defragment', H: 'Reflector'},
		otherFormes: ['Bronzong-Rejuv', 'Bronzong-Mega'],
		cosmeticFormes: ['Bronzong-Rejuv'],
		formeOrder: ['Bronzong', 'Bronzong-Rejuv', 'Bronzong-Mega'],
	},
	samurott: {
		types: ['Water', 'Fighting'],
		baseStats: {hp: 95, atk: 100, def: 95, spa: 120, spd: 85, spe: 75},
		abilities: {0: 'Swift Swim', 1: 'Blade Mastery', H: 'Shell Armor'},
	},
	samurotthisui: {
		baseStats: {hp: 90, atk: 130, def: 80, spa: 105, spd: 70, spe: 95},
		abilities: {0: 'Lightning Rod', 1: 'Blade Mastery', H: 'Swift Swim'},
	},
	audino: {
		abilities: {0: 'Invigorate', 1: 'Regenerator', H: 'Triage'},
	},
	charizard: {
		otherFormes: ['Charizard-Mega-X', 'Charizard-Mega-Y', 'Charizard-Gmax'],
		cosmeticFormes: ['Charizard-Alt'],
		formeOrder: ['Charizard', 'Charizard-Mega-X', 'Charizard-Mega-Y', 'Charizard-Gmax', 'Charizard-Alt'],
		baseStats: {hp: 78, atk: 109, def: 75, spa: 114, spd: 78, spe: 100},
		abilities: {0: 'Wildfire Core', 1: 'Intimidate', H: 'Solar Power'},
	},
	arcanine: {
		abilities: {0: 'Living Legend', 1: 'Vanguard', H: 'Drought'},
		otherFormes: ['Arcanine-Hisui', 'Arcanine-Alt'],
		cosmeticFormes: ['Arcanine-Alt'],
		formeOrder: ['Arcanine', 'Arcanine-Hisui', 'Arcanine-Alt'],
	},
	arcaninealt: {
		baseStats: {hp: 90, atk: 120, def: 90, spa: 110, spd: 90, spe: 100},
		abilities: {0: 'Living Legend', 1: 'Vanguard', H: 'Drought'},
	},
	alakazam: {
		types: ['Psychic', 'Dark'],
		baseStats: {hp: 80, atk: 50, def: 50, spa: 135, spd: 95, spe: 120},
		abilities: {0: 'Insomnia', 1: 'Grandmaster', H: 'Magic Guard'},
	},
	alakazamalt: {
		types: ['Psychic', 'Dark'],
		baseStats: {hp: 80, atk: 50, def: 50, spa: 135, spd: 95, spe: 120},
		abilities: {0: 'Insomnia', 1: 'Grandmaster', H: 'Magic Guard'},
	},
	alakazammegaalt: {
		types: ['Psychic', 'Dark'],
		baseStats: {hp: 80, atk: 48, def: 60, spa: 175, spd: 105, spe: 162},
		abilities: {0: 'Perfect Foresight'},
	},
	alakazammega: {
		types: ['Psychic', 'Dark'],
		baseStats: {hp: 80, atk: 58, def: 70, spa: 175, spd: 105, spe: 162},
	},
	manectric: {
		baseStats: {hp: 70, atk: 110, def: 65, spa: 125, spd: 65, spe: 105},
		abilities: {0: 'Strong Jaw', 1: 'Competitive', H: 'Lightning Rod'},
	},
	hypno: {
		types: ['Psychic', 'Ghost'],
		baseStats: {hp: 85, atk: 60, def: 80, spa: 93, spd: 115, spe: 67},
		abilities: {0: 'Pendulum Swing', 1: 'Neutralizing Gas', H: 'Neutralization'},
		otherFormes: ['Hypno-Pulse'],
		formeOrder: ['Hypno', 'Hypno-Pulse'],
	},
	manectricmega: {
		baseStats: {hp: 70, atk: 120, def: 80, spa: 135, spd: 80, spe: 155},
	},
	gengargmax: {
		abilities: {0: 'Soul Strike'},
	},
	bellibolt: {
		baseStats: {hp: 119, atk: 64, def: 91, spa: 103, spd: 93, spe: 45},
		abilities: {0: 'Electromorphosis', 1: 'Static', H: 'Dry Skin'},
		otherFormes: ['Bellibolt-Mega'],
		cosmeticFormes: [],
		formeOrder: ['Bellibolt', 'Bellibolt-Mega'],
	},
	typhlosion: {
		otherFormes: ['Typhlosion-Hisui', 'Typhlosion-Alt'],
		formeOrder: ['Typhlosion', 'Typhlosion-Hisui', 'Typhlosion-Alt'],
	},
	typhlosionalt: {
		baseStats: {hp: 83, atk: 105, def: 85, spa: 122, spd: 70, spe: 105},
	},
	nidoking: {
		otherFormes: ['Nidoking-Reborn'],
		formeOrder: ['Nidoking', 'Nidoking-Reborn'],
	},
	nidokingalt: {
		baseStats: {hp: 84, atk: 113, def: 90, spa: 106, spd: 87, spe: 90},
	},
	nidoqueen: {
		otherFormes: ['Nidoqueen-Reborn'],
		formeOrder: ['Nidoqueen', 'Nidoqueen-Reborn'],
	},
	nidoqueenalt: {
		baseStats: {hp: 92, atk: 100, def: 105, spa: 93, spd: 100, spe: 80},
	},
	ninetales: {
		otherFormes: ['Ninetales-Alola', 'Ninetales-Reborn'],
		formeOrder: ['Ninetales', 'Ninetales-Alola', 'Ninetales-Reborn'],
	},
	ninetalesalt: {
		baseStats: {hp: 73, atk: 76, def: 75, spa: 101, spd: 110, spe: 110},
	},
	primarina: {
		abilities: {0: 'Serene Grace'},
		cosmeticFormes: ['Primarina-Alt'],
		formeOrder: ['Primarina', 'Primarina-Alt'],
	},
	decidueye: {
		cosmeticFormes: ['Decidueye-Alt'],
		formeOrder: ['Decidueye', 'Decidueye-Alt', 'Decidueye-Hisui'],
	},
	decidueyehisui: {
		cosmeticFormes: ['Decidueye-Hisui-Alt'],
		formeOrder: ['Decidueye-Hisui', 'Decidueye-Hisui-Alt'],
		abilities: {0: 'Fallen Star', 1: 'Unburden', H: 'Scrappy'},
	},
	incineroar: {
		abilities: {1: 'Tough Claws'},
		cosmeticFormes: ['Incineroar-Alt'],
		formeOrder: ['Incineroar', 'Incineroar-Alt'],
	},
	chesnaught: {
		abilities: {0: 'Friend Guard'},
	},
	gardevoir: {
		replaceAbilities: true,
		abilities: {"0":"Trace","1":"Dream Sickness","H":"Void Veil"},
		otherFormes: ['Gardevoir-Mega', 'Gardevoir-Void-Mega', 'Gardevoir-Mega-Z'],
		formeOrder: ['Gardevoir', 'Gardevoir-Mega', 'Gardevoir-Void-Mega', 'Gardevoir-Mega-Z'],
	},
	gallade: {
		abilities: {0: 'Dual Wield', 1: 'Sworn Duty', H: 'Inner Focus', S: "Knight's Guard"},
	},
	blastoise: {
		baseStats: {hp: 79, atk: 75, def: 95, spa: 100, spd: 108, spe: 78},
		abilities: {0: 'Water Barrage', 1: 'Bulletproof', H: 'Shell Armor'},
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
		otherFormes: ['Empoleon-Reborn'],
		cosmeticFormes: ['Empoleon-Reborn'],
		formeOrder: ['Empoleon', 'Empoleon-Reborn'],
	},
	sandaconda: {
		abilities: {0: 'Sand Spit', 1: 'Stamina', H: 'Shed Skin'},
	},
	obstagoon: {
		abilities: {0: 'Violent Rush', 1: 'Guts', H: 'Defiant'},
	},
	mightyena: {
		baseStats: {hp: 90, atk: 125, def: 90, spa: 60, spd: 80, spe: 125},
		otherFormes: ['Mightyena-Deso'],
		cosmeticFormes: ['Mightyena-Deso'],
		formeOrder: ['Mightyena', 'Mightyena-Deso'],
	},
	hydrapple: {
		baseStats: {hp: 116, atk: 85, def: 110, spa: 120, spd: 85, spe: 54},
		abilities: {0: 'Supersweet Syrup', 1: 'Regenerator', H: 'Hydra Heart'},
	},
	dipplin: {
		baseStats: {hp: 80, atk: 80, def: 115, spa: 100, spd: 85, spe: 40},
		abilities: {0: 'Supersweet Syrup', 1: 'Gluttony', H: 'Aroma Veil'},
		otherFormes: ['Dipplin-Gmax'],
		formeOrder: ['Dipplin', 'Dipplin-Gmax'],
	},
	granbull: {
		types: ['Fairy', 'Ground'],
		baseStats: {hp: 100, atk: 135, def: 95, spa: 70, spd: 85, spe: 45},
		abilities: {0: 'Loyal Guard', 1: 'Violent Rush', H: 'Strong Jaw'},
		otherFormes: ['Granbull-Reborn'],
		cosmeticFormes: ['Granbull-Reborn'],
		formeOrder: ['Granbull', 'Granbull-Reborn'],
	},
	corsola: {
		types: ['Water', 'Rock'],
		baseStats: {hp: 85, atk: 65, def: 80, spa: 130, spd: 135, spe: 35},
		abilities: {0: 'Withering Shell', 1: 'Perish Body', H: 'Lightning Rod'},
		otherFormes: ['Corsola-Galar', 'Corsola-Reborn'],
		cosmeticFormes: ['Corsola-Reborn'],
		formeOrder: ['Corsola', 'Corsola-Galar', 'Corsola-Reborn'],
	},
	crobat: {
		baseStats: {hp: 80, atk: 100, def: 80, spa: 100, spd: 80, spe: 130},
		abilities: {0: 'Inner Focus', 1: 'Wind Rider', H: 'Winged Wraith'},
		otherFormes: ['Crobat-Alt'],
		cosmeticFormes: ['Crobat-Alt'],
		formeOrder: ['Crobat', 'Crobat-Alt'],
	},
	crobatalt: {
		types: ['Poison', 'Flying'],
		baseStats: {hp: 80, atk: 100, def: 80, spa: 100, spd: 80, spe: 130},
		abilities: {0: 'Inner Focus', 1: 'Wind Rider', H: 'Winged Wraith'},
	},
	corsolaalt: {
		types: ['Water', 'Rock'],
		baseStats: {hp: 85, atk: 65, def: 80, spa: 130, spd: 135, spe: 35},
		abilities: {0: 'Withering Shell', 1: 'Perish Body', H: 'Lightning Rod'},
	},
	muk: {
		types: ['Poison', 'Ghost'],
		baseStats: {hp: 105, atk: 105, def: 75, spa: 85, spd: 100, spe: 30},
		abilities: {0: 'Accumulation', 1: 'Poison Touch', H: 'Regenerator'},
		otherFormes: ['Muk-Alola', 'Muk-Pulse'],
		formeOrder: ['Muk', 'Muk-Alola', 'Muk-Pulse'],
	},
	mukpulse: {
		baseSpecies: 'Muk',
		forme: 'Pulse',
		types: ['Poison'],
		baseStats: {hp: 105, atk: 105, def: 75, spa: 108, spd: 167, spe: 40},
		abilities: {0: 'Pulse Waste'},
		requiredItem: 'Anomaly Core',
		isMega: true,
		changesFrom: 'Muk',
	},
	mukalola: {
		abilities: {0: 'Mold Breaker', 1: 'Gluttony', H: 'Power of Alchemy'},
		otherFormes: ['Muk-Pulse'],
		formeOrder: ['Muk-Alola', 'Muk-Pulse'],
	},
	granbullalt: {
		baseSpecies: 'Granbull',
		name: 'Granbull-Reborn',
		forme: 'Reborn',
		changesFrom: 'Granbull',
		types: ['Fairy', 'Ground'],
		baseStats: {hp: 100, atk: 135, def: 95, spa: 70, spd: 85, spe: 45},
		abilities: {0: 'Loyal Guard', 1: 'Violent Rush', H: 'Strong Jaw'},
		isNonstandard: 'Custom',
	},
	cetitan: {
		types: ['Ice', 'Ground'],
		baseStats: {hp: 170, atk: 128, def: 72, spa: 30, spd: 65, spe: 75},
		abilities: {0: 'Slush Rush', 1: 'Water Absorb', H: 'Glacial Mass'},
	},
	oricorio: {baseStats: {hp: 79, atk: 80, def: 75, spa: 98, spd: 75, spe: 93}},
	oricoriopompom: {baseStats: {hp: 79, atk: 80, def: 75, spa: 98, spd: 75, spe: 93}},
	oricoriopau: {baseStats: {hp: 79, atk: 80, def: 75, spa: 98, spd: 75, spe: 93}},
	oricoriosensu: {baseStats: {hp: 79, atk: 80, def: 75, spa: 98, spd: 75, spe: 93}},
	mightyenadeso: {
		baseStats: {hp: 90, atk: 125, def: 85, spa: 60, spd: 80, spe: 125},
		abilities: {0: 'Intimidate', 1: 'Black Fang', H: 'Stakeout'},
	},
	toxicroak: {
		baseStats: {hp: 83, atk: 131, def: 70, spa: 121, spd: 70, spe: 95},
		abilities: {0: 'Battle Fervor', 1: 'Corrosion', H: 'Great Marsh'},
		otherFormes: ['Toxicroak-Deso'],
		cosmeticFormes: ['Toxicroak-Deso'],
		formeOrder: ['Toxicroak', 'Toxicroak-Deso'],
	},
	toxicroakdeso: {
		baseStats: {hp: 83, atk: 126, def: 70, spa: 116, spd: 70, spe: 95},
		abilities: {0: 'Battle Fervor', 1: 'Corrosion', H: 'Great Marsh'},
	},
	cinccino: {
		baseStats: {hp: 75, atk: 110, def: 85, spa: 70, spd: 85, spe: 125},
		abilities: {0: 'Pixilate', 1: 'Skill Link', H: 'Fluffy Craft'},
		otherFormes: ['Cinccino-Deso'],
		cosmeticFormes: ['Cinccino-Deso'],
		formeOrder: ['Cinccino', 'Cinccino-Deso'],
	},
	cinccinodeso: {
		baseStats: {hp: 75, atk: 110, def: 100, spa: 60, spd: 100, spe: 125},
		abilities: {0: 'Pixilate', 1: 'Skill Link', H: 'Fluffy Craft'},
	},
	glalie: {
		baseStats: {hp: 80, atk: 80, def: 80, spa: 80, spd: 95, spe: 105},
	},
	pidgeotmega: {
		baseStats: {hp: 83, atk: 60, def: 95, spa: 140, spd: 90, spe: 126},
	},
	persian: {
		baseStats: {hp: 70, atk: 100, def: 65, spa: 105, spd: 65, spe: 120},
	},
	persianalola: {
		baseStats: {hp: 70, atk: 105, def: 65, spa: 100, spd: 65, spe: 120},
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
	chimechomegay: {
		types: ['Psychic', 'Ghost'],
		baseStats: {hp: 75, atk: 50, def: 80, spa: 145, spd: 100, spe: 105},
		abilities: {0: 'Haunted Chime'},
	},
	gliscor: {
		baseStats: {hp: 105, atk: 105, def: 135, spa: 40, spd: 90, spe: 95},
		abilities: {0: 'Venom Heal', 1: 'Toxic Boost', H: 'Wind Rider'},
	},
	gliscoralt: {
		baseStats: {hp: 105, atk: 105, def: 135, spa: 40, spd: 90, spe: 95},
		abilities: {0: 'Venom Heal', 1: 'Toxic Boost', H: 'Wind Rider'},
	},
	hydreigon: {
		abilities: {0: 'Levitate', 1: 'Dark Aura', H: 'Hydra Tyrant'},
	},
	skarmory: {
		abilities: {0: 'Self Sufficient', 1: 'Sturdy', H: 'Weak Armor'},
	},
	skarmorymega: {
		abilities: {0: 'Golden Talons'},
	},
	wyrdeer: {
		baseStats: {hp: 103, atk: 105, def: 82, spa: 105, spd: 85, spe: 70},
		abilities: {0: 'Intimidate', 1: 'Magic Guard', H: 'Hisuian Path'},
	},
	mantine: {
		baseStats: {hp: 95, atk: 95, def: 80, spa: 100, spd: 115, spe: 65},
		abilities: {0: 'Island Current', 1: 'Regenerator', H: 'Oceanic Wings'},
	},
	arbok: {
		otherFormes: ['Arbok-Mega-X', 'Arbok-Mega-Y'],
		formeOrder: ['Arbok', 'Arbok-Mega-X', 'Arbok-Mega-Y'],
		types: ['Poison'],
		baseStats: {hp: 80, atk: 95, def: 90, spa: 65, spd: 90, spe: 80},
		abilities: {0: 'Intimidate', 1: 'Shed Skin', H: 'Accumulation'},
	},
	golduck: {
		baseStats: {hp: 80, atk: 82, def: 78, spa: 115, spd: 80, spe: 90},
		abilities: {0: 'Swift Swim', 1: 'Still Waters', H: 'Defragment'},
	},
	machamp: {baseStats: {hp: 100, atk: 140, def: 105, spa: 65, spd: 85, spe: 75}, abilities: {0: 'Guts', 1: 'Stamina', H: 'Fighting Fiend'}},
	machampgmax: {baseStats: {hp: 150, atk: 140, def: 105, spa: 65, spd: 85, spe: 75}, abilities: {0: 'Raging Fists', 1: 'Stamina', H: 'Guts'}},
	kingdra: {
		baseStats: {hp: 85, atk: 120, def: 90, spa: 120, spd: 90, spe: 95},
		abilities: {0: 'Swift Swim', 1: 'Abyss Sniper', H: 'Royal Decree'},
	},
	hitmonlee: {
		baseStats: {hp: 80, atk: 130, def: 73, spa: 40, spd: 100, spe: 117},
		abilities: {H: 'Kick Fiend'},
	},
	hitmonchan: {baseStats: {hp: 80, atk: 130, def: 89, spa: 40, spd: 120, spe: 81}, abilities: {0: 'Scrappy', 1: 'Ultra Ego', H: 'Punch Fiend'}},
	hitmontop: {baseStats: {hp: 80, atk: 120, def: 105, spa: 45, spd: 115, spe: 75}},
	exploud: {baseStats: {hp: 119, atk: 101, def: 73, spa: 116, spd: 73, spe: 88}},
	hariyama: {baseStats: {hp: 134, atk: 120, def: 88, spa: 40, spd: 88, spe: 50}},
	wailord: {baseStats: {hp: 160, atk: 40, def: 75, spa: 105, spd: 90, spe: 50}},
	zangoose: {
		types: ['Normal', 'Steel'],
		baseStats: {hp: 75, atk: 140, def: 110, spa: 60, spd: 70, spe: 95},
		abilities: {0: 'Venom Armor', 1: 'Violent Rush', H: 'Scrappy'},
		otherFormes: ['Zangoose-Reborn'],
		cosmeticFormes: ['Zangoose-Reborn'],
		formeOrder: ['Zangoose', 'Zangoose-Reborn'],
	},
	beartic: {baseStats: {hp: 110, atk: 130, def: 90, spa: 55, spd: 85, spe: 75}, abilities: {0: 'Raging Beast', 1: 'Slush Rush', H: 'Swift Swim'}},
	mandibuzz: {
		baseStats: {hp: 115, atk: 65, def: 115, spa: 65, spd: 100, spe: 80},
		abilities: {0: 'Scavenger', 1: 'Stamina', H: 'Weak Armor'},
	},
	toxapex: {
		baseStats: {hp: 85, atk: 73, def: 152, spa: 63, spd: 142, spe: 35},
		abilities: {0: 'Battle Armor', 1: 'Toxic Spines', H: 'Regenerator'},
	},
	wishiwashi: {baseStats: {hp: 80, atk: 20, def: 20, spa: 25, spd: 25, spe: 40}},
	wishiwashischool: {baseStats: {hp: 80, atk: 135, def: 130, spa: 135, spd: 130, spe: 60}},
	swellow: {baseStats: {hp: 72, atk: 85, def: 72, spa: 85, spd: 61, spe: 127}},
	rabsca: {baseStats: {hp: 100, atk: 50, def: 90, spa: 120, spd: 100, spe: 60}, abilities: {0: 'Sand Rush', 1: 'Elevate', H: 'Telepathy'}},
	salazzle: {abilities: {0: 'Corrosion', 1: 'Dragonize', H: 'Aroma Veil'}},
	lunatone: {baseStats: {hp: 110, atk: 35, def: 95, spa: 125, spd: 95, spe: 70}},
	solrock: {baseStats: {hp: 110, atk: 125, def: 95, spa: 35, spd: 95, spe: 70}},
	rhyperior: {baseStats: {hp: 120, atk: 150, def: 140, spa: 55, spd: 85, spe: 20}},
	seismitoad: {baseStats: {hp: 105, atk: 110, def: 85, spa: 90, spd: 86, spe: 74}},
	crustle: {baseStats: {hp: 85, atk: 115, def: 130, spa: 45, spd: 95, spe: 50}},
	druddigon: {
		types: ['Dragon', 'Rock'],
		baseStats: {hp: 107, atk: 130, def: 100, spa: 50, spd: 100, spe: 68},
		abilities: {0: 'Solar Recharge', 1: 'Cavern Drake', H: 'Rough Scale'},
	},
	vikavolt: {baseStats: {hp: 77, atk: 103, def: 107, spa: 145, spd: 75, spe: 43}, abilities: {0: 'Levitate', 1: 'Speed Boost', H: 'Battery'}},
	turtonator: {baseStats: {hp: 80, atk: 80, def: 130, spa: 80, spd: 100, spe: 50}},
	cursola: {baseStats: {hp: 60, atk: 95, def: 57, spa: 145, spd: 130, spe: 50}},
	drednaw: {
		baseStats: {hp: 90, atk: 125, def: 110, spa: 48, spd: 78, spe: 74},
		abilities: {0: 'Strong Jaw', 1: 'Brute Force', H: 'Shell Armor'},
		otherFormes: ['Drednaw-Gmax'],
		formeOrder: ['Drednaw', 'Drednaw-Gmax'],
	},
	drednawgmax: {
		baseStats: {hp: 153, atk: 125, def: 110, spa: 48, spd: 78, spe: 74},
		abilities: {0: 'War Ship'},
	},
	mrrime: {
		baseStats: {hp: 85, atk: 110, def: 90, spa: 110, spd: 105, spe: 70},
		abilities: {0: 'Magic Guard', 1: 'Royal Decree', H: 'Ice Body'},
	},
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
		baseStats: {hp: 100, atk: 130, def: 80, spa: 40, spd: 80, spe: 70},
		abilities: {0: 'Raging Beast', 1: 'Tough Claws', H: 'Intimidate'},
	},
	pangoro: {
		baseStats: {hp: 105, atk: 126, def: 76, spa: 69, spd: 69, spe: 70},
		abilities: {0: 'Iron Fist', 1: 'Raging Beast', H: 'Scrappy'},
	},
	tropius: {baseStats: {hp: 115, atk: 90, def: 95, spa: 75, spd: 95, spe: 70}},
	huntail: {baseStats: {hp: 70, atk: 114, def: 115, spa: 94, spd: 85, spe: 52}},
	gorebyss: {baseStats: {hp: 70, atk: 84, def: 115, spa: 124, spd: 85, spe: 52}},
	ambipom: {
		types: ['Normal', 'Fighting'],
		baseStats: {hp: 80, atk: 110, def: 70, spa: 100, spd: 70, spe: 120},
		abilities: {0: 'Unburden', 1: 'Double Strike', H: 'Scrappy'},
	},
	weavile: {
		otherFormes: ["Weavile-Mega"], formeOrder: ["Weavile", "Weavile-Mega"],
		baseStats: {hp: 85, atk: 130, def: 75, spa: 30, spd: 90, spe: 130},
		abilities: {0: 'Violent Rush', 1: 'Pressure', H: 'Technician'},
	},
	ribombee: {baseStats: {hp: 65, atk: 55, def: 60, spa: 90, spd: 105, spe: 125}},
	zoroark: {baseStats: {hp: 55, atk: 105, def: 60, spa: 125, spd: 60, spe: 105}},
	dusknoir: {
		baseStats: {"hp":65,"atk":120,"def":135,"spa":70,"spd":135,"spe":45}, abilities: {0: 'Requiem', 1: 'Pressure', H: 'Shadow Tag'}, otherFormes: ['Dusknoir-Mega'], cosmeticFormes: [], formeOrder: ['Dusknoir','Dusknoir-Mega'],
	},
	spiritomb: {
		baseStats: {hp: 108, atk: 108, def: 108, spa: 108, spd: 108, spe: 30},
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
	dodrio: {baseStats: {hp: 90, atk: 135, def: 85, spa: 40, spd: 75, spe: 125}},
	noivern: {otherFormes: ['Noivern-Mega'], formeOrder: ['Noivern', 'Noivern-Mega'], baseStats: {hp: 85, atk: 60, def: 80, spa: 105, spd: 80, spe: 125}},
	rapidash: {baseStats: {hp: 80, atk: 115, def: 70, spa: 80, spd: 80, spe: 125}},
	rapidashgalar: {baseStats: {hp: 80, atk: 115, def: 70, spa: 80, spd: 80, spe: 125}},
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
	palossand: {
		baseStats: {hp: 100, atk: 75, def: 110, spa: 105, spd: 75, spe: 35},
		otherFormes: ['Palossand-Rocky', 'Palossand-Fiery', 'Palossand-Icy'],
		cosmeticFormes: ['Palossand-Rocky', 'Palossand-Fiery', 'Palossand-Icy'],
		formeOrder: ['Palossand', 'Palossand-Rocky', 'Palossand-Fiery', 'Palossand-Icy'],
	},
	dhelmise: {
		baseStats: {hp: 100, atk: 140, def: 110, spa: 60, spd: 110, spe: 30},
		abilities: {0: 'Water Bubble', 1: 'Steelworker', H: 'Rocky Payload'},
	},
	rillaboom: {abilities: {0: 'Violent Rush', 1: 'Soundproof', H: 'Grassy Surge'}},
	cinderace: {
		abilities: {0: 'Defiant', 1: 'No Guard', H: 'Libero'},
		otherFormes: ['Cinderace-Mega'],
		formeOrder: ['Cinderace', 'Cinderace-Mega'],
	},
	ledian: {
		baseStats: {hp: 85, atk: 45, def: 50, spa: 55, spd: 110, spe: 95},
		abilities: {0: 'Dazzling', 1: 'Unaware', H: 'Defiant'},
		otherFormes: ['Ledian-Mega'],
		formeOrder: ['Ledian', 'Ledian-Mega'],
	},
	ariados: {
		baseStats: {hp: 90, atk: 100, def: 85, spa: 75, spd: 85, spe: 40},
		otherFormes: ['Ariados-Mega'],
		formeOrder: ['Ariados', 'Ariados-Mega'],
	},
	ariadosmega: {
		types: ['Bug', 'Poison'],
		baseStats: {hp: 80, atk: 130, def: 120, spa: 40, spd: 120, spe: 85},
		abilities: {0: 'Silken Decoy'},
	},
	cinderacemega: {
		types: ['Fire', 'Normal'],
		baseStats: {hp: 80, atk: 146, def: 95, spa: 75, spd: 85, spe: 149},
		abilities: {0: 'Perfect Striker'},
	},
	orbeetle: {abilities: {0: 'Magic Bounce', 1: 'Psychic Surge', H: 'Telepathy'}},
	coalossal: {abilities: {0: 'Steam Engine', 1: 'Flame Body', H: 'Earth Eater'}},
	sandslash: {
		baseStats: {hp: 95, atk: 120, def: 130, spa: 45, spd: 75, spe: 85},
		otherFormes: ['Sandslash-Alola', 'Sandslash-Reborn'],
		cosmeticFormes: ['Sandslash-Reborn'],
		formeOrder: ['Sandslash', 'Sandslash-Alola', 'Sandslash-Reborn'],
	},
	sandslashalola: {baseStats: {hp: 95, atk: 120, def: 130, spa: 45, spd: 75, spe: 85}},
	sandslashalt: {
		baseStats: {hp: 95, atk: 120, def: 130, spa: 45, spd: 75, spe: 85},
		abilities: {0: 'Tough Claws', 1: 'Iron Barbs', H: 'Sand Rush'},
	},
	haxorus: {
		baseStats: {hp: 95, atk: 147, def: 90, spa: 50, spd: 91, spe: 97},
		otherFormes: ['Haxorus-Mega'],
		formeOrder: ['Haxorus', 'Haxorus-Mega'],
	},
	haxorusmega: {
		baseStats: {hp: 95, atk: 177, def: 131, spa: 60, spd: 110, spe: 97},
		abilities: {0: 'Raging Overlord'},
	},
	golurk: {abilities: {0: 'Iron Fist', 1: 'No Guard', H: 'Self Repair'}},
	sawsbuck: {
		name: 'Sawsbuck',
		otherFormes: ['Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
		cosmeticFormes: ['Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
		formeOrder: ['Sawsbuck', 'Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter'],
	},
	silvally: {
		cosmeticFormes: [
			'Silvally', 'Silvally-Fighting', 'Silvally-Flying', 'Silvally-Poison',
			'Silvally-Ground', 'Silvally-Rock', 'Silvally-Bug', 'Silvally-Ghost',
			'Silvally-Steel', 'Silvally-Fire', 'Silvally-Water', 'Silvally-Grass',
			'Silvally-Electric', 'Silvally-Psychic', 'Silvally-Ice', 'Silvally-Dragon',
			'Silvally-Dark', 'Silvally-Fairy',
		],
		formeOrder: [
			'Silvally', 'Silvally-Fighting', 'Silvally-Flying', 'Silvally-Poison',
			'Silvally-Ground', 'Silvally-Rock', 'Silvally-Bug', 'Silvally-Ghost',
			'Silvally-Steel', 'Silvally-Fire', 'Silvally-Water', 'Silvally-Grass',
			'Silvally-Electric', 'Silvally-Psychic', 'Silvally-Ice', 'Silvally-Dragon',
			'Silvally-Dark', 'Silvally-Fairy',
		],
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
	charizardgmax: {
		baseStats: {hp: 133, atk: 109, def: 75, spa: 114, spd: 78, spe: 100},
		abilities: {0: 'Burning Crown'},
	},
	milotic: {
		baseStats: {hp: 95, atk: 89, def: 85, spa: 115, spd: 135, spe: 81},
		abilities: {0: 'Prism Scale', 1: 'Competitive', H: 'Queenly Majesty'},
		otherFormes: ['Milotic-Reborn'],
		cosmeticFormes: ['Milotic-Reborn'],
		formeOrder: ['Milotic', 'Milotic-Reborn'],
	},
	miloticalt: {
		types: ['Water', 'Fairy'],
		baseStats: {hp: 95, atk: 89, def: 85, spa: 115, spd: 135, spe: 81},
		abilities: {0: 'Prism Scale', 1: 'Competitive', H: 'Queenly Majesty'},
	},
	jellicent: {
		otherFormes: ['Jellicent-Azzy'],
		cosmeticFormes: ['Jellicent-Azzy'],
		formeOrder: ['Jellicent', 'Jellicent-Azzy'],
	},
	miloticaevian: {
		name: 'Milotic-Aevian',
		baseSpecies: 'Milotic-Aevian',
		types: ['Poison', 'Fairy'],
		baseStats: {hp: 95, atk: 115, def: 85, spa: 89, spd: 135, spe: 81},
		abilities: {0: 'Prism Scale', 1: 'Defiant', H: 'Queenly Majesty'},
		otherFormes: [],
		formeOrder: [],
		standalone: true,
		spriteid: 'milotic-aevian',
		isNonstandard: 'Custom',
	},
	gastrodon: {
		otherFormes: ['Gastrodon-East', 'Gastrodon-Aevian', 'Gastrodon-East-Aevian', 'Gastrodon-Azzy', 'Gastrodon-Azzy2'],
		cosmeticFormes: ['Gastrodon-East', 'Gastrodon-Aevian', 'Gastrodon-East-Aevian', 'Gastrodon-Azzy', 'Gastrodon-Azzy2'],
		formeOrder: ['Gastrodon', 'Gastrodon-East', 'Gastrodon-Aevian', 'Gastrodon-East-Aevian', 'Gastrodon-Azzy', 'Gastrodon-Azzy2'],
	},
	gastrodonaevian: {
		baseStats: {hp: 111, atk: 83, def: 78, spa: 97, spd: 92, spe: 39},
	},
	gastrodoneastaevian: {
		baseStats: {hp: 111, atk: 83, def: 78, spa: 97, spd: 92, spe: 39},
	},
	toxtricitylowkey: {
		types: ['Dark', 'Poison'],
	},
	toxtricitylowkeygmax: {
		types: ['Dark', 'Poison'],
	},
	toxtricityaevian: {
		types: ['Fire', 'Poison'],
		baseStats: {hp: 75, atk: 105, def: 80, spa: 123, spd: 70, spe: 97},
		abilities: {0: 'Galvanize', 1: 'Punk Rock', H: 'Solid Rock'},
		canGigantamax: null,
		cannotDynamax: true,
	},
	infernape: {
		baseStats: {hp: 76, atk: 115, def: 70, spa: 115, spd: 76, spe: 118},
		abilities: {0: 'Burning Spirit', 1: 'Ultra Instinct', H: 'Burning Rage'},
		otherFormes: ['Infernape-Reborn'],
		cosmeticFormes: ['Infernape-Reborn'],
		formeOrder: ['Infernape', 'Infernape-Reborn'],
	},
	infernapealt: {
		baseStats: {hp: 76, atk: 115, def: 70, spa: 115, spd: 76, spe: 118},
		abilities: {0: 'Burning Spirit', 1: 'Ultra Instinct', H: 'Burning Rage'},
	},
	toxtricitylowkeyalt: {
		types: ['Dark', 'Poison'],
	},
	toxtricitylowkeygmaxalt: {
		types: ['Dark', 'Poison'],
	},
	torterra: {
		baseStats: {hp: 95, atk: 119, def: 130, spa: 65, spd: 105, spe: 56},
		abilities: {0: 'Terra Resolve', 1: 'Shell Armor', H: 'Terra Gift'},
		otherFormes: ['Torterra-Reborn'],
		cosmeticFormes: ['Torterra-Reborn'],
		formeOrder: ['Torterra', 'Torterra-Reborn'],
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
	brambleghast: {
		abilities: {0: 'Wind Rider', 1: 'Infiltrator', H: 'Sand Rush'},
	},
	seviper: {
		baseStats: {hp: 75, atk: 120, def: 80, spa: 100, spd: 80, spe: 95},
		abilities: {0: 'Apex Venom', 1: 'Rapid Response', H: 'Accumulation'},
		otherFormes: ['Seviper-Reborn'],
		cosmeticFormes: ['Seviper-Reborn'],
		formeOrder: ['Seviper', 'Seviper-Reborn'],
	},
	scolipede: {
		otherFormes: ['Scolipede-Azzy', 'Scolipede-Mega', 'Scolipede-Mega-Azzy'],
		cosmeticFormes: ['Scolipede-Azzy'],
		formeOrder: ['Scolipede', 'Scolipede-Azzy', 'Scolipede-Mega', 'Scolipede-Mega-Azzy'],
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
		otherFormes: ['Lapras-Gmax'],
		formeOrder: ['Lapras', 'Lapras-Gmax'],
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
		baseStats: {hp: 90, atk: 100, def: 85, spa: 75, spd: 85, spe: 40},
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
		types: ['Water', 'Poison'],
		baseStats: {hp: 100, atk: 109, def: 100, spa: 59, spd: 93, spe: 78},
		abilities: {0: 'Water Veil', 1: 'Mighty Jaw', H: 'Sheer Force'},
		otherFormes: ['Feraligatr-Mega', 'Feraligatr-Gmax'],
		formeOrder: ['Feraligatr', 'Feraligatr-Mega', 'Feraligatr-Gmax'],
	},
	feraligatrmega: {
		baseStats: {hp: 100, atk: 164, def: 125, spa: 59, spd: 108, spe: 83},
		abilities: {0: 'Draconic Force'},
	},
	feraligatrgmax: {
		baseStats: {hp: 150, atk: 109, def: 100, spa: 59, spd: 93, spe: 78},
		abilities: {0: 'Tidal Jaw'},
	},
	banette: {
		abilities: {0: 'Cursed Keepsake', 1: 'Intimidate', H: 'Cursed Doll'},
		otherFormes: ['Banette-Mega', 'Banette-Mega-Z'],
		formeOrder: ['Banette', 'Banette-Mega', 'Banette-Mega-Z'],
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
		otherFormes: ['Clawitzer-Mega'],
		formeOrder: ['Clawitzer', 'Clawitzer-Mega'],
	},
	clawitzermega: {
		baseStats: {hp: 71, atk: 93, def: 108, spa: 160, spd: 109, spe: 59},
		abilities: {0: 'Heavy Artillery'},
	},
	sharpedomega: {
		baseStats: {hp: 70, atk: 150, def: 70, spa: 120, spd: 65, spe: 125},
		abilities: {0: 'Razor Current'},
	},
	sharpedo: {
		otherFormes: ['Sharpedo-Mega', 'Sharpedo-Mega-Y'],
		formeOrder: ['Sharpedo', 'Sharpedo-Mega', 'Sharpedo-Mega-Y'],
		abilities: {0: 'Rapid Response', 1: 'Strong Jaw', H: 'Speed Boost'},
	},
	greninja: {
		baseStats: {hp: 72, atk: 100, def: 67, spa: 103, spd: 71, spe: 122},
		abilities: {0: 'Technician', 1: 'Protean', H: 'Battle Bond'},
	},
	serperior: {
		abilities: {0: 'Multiscale'},
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
		baseStats: {hp: 80, atk: 105, def: 80, spa: 50, spd: 80, spe: 105},
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
		abilities: {0: 'Noble Rider', 1: 'Supreme Overlord', H: 'Adaptability'},
	},
	basculegionf: {
		baseStats: {hp: 120, atk: 80, def: 75, spa: 112, spd: 85, spe: 78},
		abilities: {0: 'Noble Rider', 1: 'Supreme Overlord', H: 'Rapid Response'},
	},
	breloom: {
		baseStats: {"hp":80,"atk":130,"def":80,"spa":60,"spd":80,"spe":70},
		abilities: {0: 'Technician', 1: 'Poison Heal', H: 'Guts'},
	},
	azumarill: {
		baseStats: {hp: 100, atk: 70, def: 115, spa: 100, spd: 115, spe: 60},
		abilities: {0: 'Huge Power', 1: 'Sap Sipper', H: 'Mold Breaker'},
	},
	tsareena: {
		types: ['Grass', 'Fairy'],
		baseStats: {hp: 72, atk: 128, def: 108, spa: 72, spd: 108, spe: 98},
		abilities: {0: 'Empress', 1: 'Supreme Overlord', H: 'Imperial Princess'},
	},
	pikachucosplay: {types: ['Electric', 'Ice'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Serene Grace'}, canGigantamax: 'G-Max Volt Crash'},
	pikachurockstar: {types: ['Electric', 'Steel'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'No Guard'}, canGigantamax: 'G-Max Volt Crash'},
	pikachubelle: {types: ['Electric', 'Ice'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Serene Grace'}, canGigantamax: 'G-Max Volt Crash'},
	pikachupopstar: {types: ['Electric', 'Fairy'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Costar'}, canGigantamax: 'G-Max Volt Crash'},
	pikachuphd: {types: ['Electric', 'Psychic'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Neutralization'}, canGigantamax: 'G-Max Volt Crash'},
	pikachulibre: {types: ['Electric', 'Fighting'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Moxie'}, canGigantamax: 'G-Max Volt Crash'},
	pikachupartner: {types: ['Electric'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Mold Breaker'}, canGigantamax: 'G-Max Volt Crash'},
	pikachustarter: {types: ['Electric'], baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120}, abilities: {0: 'Mold Breaker'}, canGigantamax: 'G-Max Volt Crash'},
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
	eeveestarter: {
		abilities: {0: 'Z Protean', 1: 'Opportunist', H: 'Unstable Evo', S: 'Mind Freeze', E: 'Sinister Blaze', F: 'Eclipse', G: 'Ascendance'},
		otherFormes: ['Eevee-Starter-Alt', 'Divineon'],
		cosmeticFormes: ['Eevee-Starter-Alt'],
		formeOrder: ['Eevee-Starter', 'Eevee-Starter-Alt', 'Divineon'],
	},
	eeveestarteralt: {
		abilities: {0: 'Z Protean', 1: 'Opportunist', H: 'Unstable Evo', S: 'Mind Freeze', E: 'Sinister Blaze', F: 'Eclipse', G: 'Ascendance'},
	},
	divineon: {
		types: ['???'],
		baseStats: {hp: 65, atk: 110, def: 65, spa: 110, spd: 65, spe: 130},
		abilities: {0: 'Ascendance'},
	},
	flareon: {abilities: {0: 'Fire Mane'}},
	houndoom: {abilities: {0: 'Flash Fire', 1: 'Dark Aura', H: 'Battle Fervor'}},
	typhlosionhisui: {abilities: {0: 'Blazing Mane', 1: 'Soul Fire', H: 'Soul Heart'}},
	auroreon: {
		baseStats: {hp: 60, atk: 60, def: 95, spa: 130, spd: 95, spe: 110},
		abilities: {0: 'Mind Freeze'},
	},
	garchompbattlebond: {baseStats: {spe: 122}},
	lanturn: {
		types: ['Water', 'Electric'],
		baseStats: {hp: 125, atk: 58, def: 88, spa: 116, spd: 106, spe: 67},
		abilities: {0: 'Abyss Lure', 1: 'Drizzle', H: 'Dazzling'},
		otherFormes: ['Lanturn-Alt'],
		cosmeticFormes: ['Lanturn-Alt'],
		formeOrder: ['Lanturn', 'Lanturn-Alt'],
	},
	lanturnalt: {
		baseSpecies: 'Lanturn',
		forme: 'Alt',
		changesFrom: 'Lanturn',
		types: ['Water', 'Electric'],
		baseStats: {hp: 125, atk: 58, def: 88, spa: 116, spd: 106, spe: 67},
		abilities: {0: 'Abyss Lure', 1: 'Drizzle', H: 'Dazzling'},
		isNonstandard: 'Custom',
	},
	jynx: {
		types: ['Ice', 'Psychic'],
		baseStats: {hp: 75, atk: 50, def: 75, spa: 125, spd: 125, spe: 90},
		abilities: {0: 'Queenly Majesty', 1: 'Resonance Force', H: 'Frost Siren'},
		otherFormes: ['Jynx-Alt'],
		cosmeticFormes: ['Jynx-Alt'],
		formeOrder: ['Jynx', 'Jynx-Alt'],
	},
	jynxalt: {
		types: ['Ice', 'Psychic'],
		baseStats: {hp: 75, atk: 50, def: 75, spa: 125, spd: 125, spe: 90},
		abilities: {0: 'Queenly Majesty', 1: 'Resonance Force', H: 'Frost Siren'},
	},
	unfezant: {
		types: ['Normal', 'Flying'],
		baseStats: {hp: 90, atk: 40, def: 105, spa: 125, spd: 80, spe: 107},
		abilities: {0: 'Unova Wing', 1: 'Aevian Wing'},
		otherFormes: ['Unfezant-Rejuv'],
		formeOrder: ['Unfezant', 'Unfezant-Rejuv'],
	},
	unfezantrejuv: {
		types: ['Rock', 'Fighting'],
		baseStats: {hp: 90, atk: 125, def: 105, spa: 40, spd: 80, spe: 107},
		abilities: {0: 'Unova Wing', 1: 'Aevian Wing'},
	},
	musharna: {
		abilities: {0: 'Neutralization', 1: 'Telepathy', H: 'Aevian Dream'},
		otherFormes: ['Musharna-Rejuv'],
		cosmeticFormes: ['Musharna-Rejuv'],
		formeOrder: ['Musharna', 'Musharna-Rejuv'],
	},
	musharnarejuv: {
		types: ['Dark', 'Fairy'],
		baseStats: {hp: 120, atk: 110, def: 105, spa: 45, spd: 95, spe: 25},
		abilities: {0: 'Aevian Dream'},
	},
};

Object.assign(CUSTOM_SPECIES_UPDATES, {
	vileplume: {abilities: {0: 'Chlorophyll', 1: 'Storm Drain', H: 'Toxic Sink'}},
	espeon: {abilities: {0: 'Trace', 1: 'Magic Bounce', H: 'Telepathy', S: 'Mind Freeze', E: 'Eclipse'}},
	umbreon: {abilities: {0: 'Poison Heal', 1: 'Inner Focus', H: 'Pressure', S: 'Eclipse', G: 'Ascendance'}},
	glaceon: {abilities: {0: 'Ice Scales', 1: 'Slush Rush', H: 'Ice Body', S: 'Mind Freeze'}},
	scizor: {abilities: {0: 'Tough Claws', 1: 'Technician', H: 'Light Metal'}},
	swampert: {abilities: {0: 'Dry Skin', 1: 'Regenerator', H: 'Damp'}},
	swampertmega: {replaceAbilities: true, abilities: {0: 'Raging Current'}},
	chesnaughtmega: {replaceAbilities: true, abilities: {0: 'Wrath Shield'}},
	delphox: {replaceAbilities: true, abilities: {0: 'Sworn Duty', 1: 'Magic Guard', H: 'Magician'}},
	greninja: {replaceAbilities: true, abilities: {0: 'Technician', 1: 'Protean', H: 'Battle Bond'}},
	altaria: {abilities: {0: 'Natural Cure', 1: 'Fluffy', H: 'Cloud Nine', S: 'Echo Fiend'}},
	cacturne: {baseStats: {spa: 90}},
	mightyena: {
		baseStats: {hp: 90, atk: 125, def: 90, spa: 60, spd: 80, spe: 125},
		abilities: {0: 'Intimidate', 1: 'Black Fang', H: 'Stakeout'},
		otherFormes: ['Mightyena-Deso'], cosmeticFormes: ['Mightyena-Deso'],
		formeOrder: ['Mightyena', 'Mightyena-Deso'],
	},
	mightyenadeso: {
		baseStats: {hp: 90, atk: 125, def: 85, spa: 60, spd: 80, spe: 125},
		abilities: {0: 'Intimidate', 1: 'Black Fang', H: 'Stakeout'},
	},
	cinccino: {
		baseStats: {hp: 75, atk: 110, def: 85, spa: 70, spd: 85, spe: 125},
		abilities: {0: 'Pixilate', 1: 'Skill Link', H: 'Fluffy Craft'},
		otherFormes: ['Cinccino-Deso'], cosmeticFormes: ['Cinccino-Deso'],
		formeOrder: ['Cinccino', 'Cinccino-Deso'],
	},
	cinccinodeso: {
		baseStats: {hp: 75, atk: 110, def: 100, spa: 60, spd: 100, spe: 125},
		abilities: {0: 'Pixilate', 1: 'Skill Link', H: 'Fluffy Craft'},
	},
	crawdaunt: {
		baseStats: {hp: 83, atk: 120, def: 105, spa: 100, spd: 77, spe: 60},
		abilities: {0: 'Adaptability', 1: 'Swift Swim', H: 'Cruel Shell'},
	},
	exploud: {baseStats: {hp: 109, atk: 101, def: 73, spa: 116, spd: 73, spe: 78}},
	infernape: {baseStats: {hp: 76, atk: 115, def: 75, spa: 115, spd: 81, spe: 108}},
	infernapealt: {baseStats: {hp: 76, atk: 115, def: 75, spa: 115, spd: 81, spe: 108}},
	machamp: {baseStats: {hp: 100, atk: 140, def: 95, spa: 65, spd: 75, spe: 75}},
	machampgmaxalt: {abilities: {0: 'Raging Fists', 1: 'Stamina', H: 'Guts'}},
	machampgmax: {baseStats: {hp: 150, atk: 140, def: 95, spa: 65, spd: 75, spe: 75}, abilities: {0: 'Raging Fists', 1: 'Stamina', H: 'Guts'}},
	probopass: {baseStats: {hp: 75, atk: 50, def: 150, spa: 95, spd: 155, spe: 25}},
	samurott: {baseStats: {hp: 95, atk: 110, def: 90, spa: 120, spd: 80, spe: 75}},
	samurotthisui: {baseStats: {hp: 90, atk: 110, def: 75, spa: 105, spd: 65, spe: 95}},
	samurottalt: {baseStats: {hp: 95, atk: 110, def: 90, spa: 120, spd: 80, spe: 75}},
	samurotthisuialt: {baseStats: {hp: 90, atk: 110, def: 75, spa: 105, spd: 65, spe: 95}},
	toxicroak: {
		baseStats: {hp: 83, atk: 131, def: 70, spa: 121, spd: 70, spe: 95},
		abilities: {0: 'Battle Fervor', 1: 'Corrosion', H: 'Great Marsh'},
		otherFormes: ['Toxicroak-Deso'], cosmeticFormes: ['Toxicroak-Deso'],
		formeOrder: ['Toxicroak', 'Toxicroak-Deso'],
	},
	toxicroakdeso: {
		baseStats: {hp: 83, atk: 126, def: 70, spa: 116, spd: 70, spe: 95},
		abilities: {0: 'Battle Fervor', 1: 'Corrosion', H: 'Great Marsh'},
	},
	alakazam: {baseStats: {hp: 80, atk: 50, def: 50, spa: 135, spd: 95, spe: 120}},
	alakazammega: {types: ['Psychic', 'Dark'], baseStats: {hp: 80, atk: 48, def: 60, spa: 175, spd: 105, spe: 162}},
	dodrio: {baseStats: {hp: 90, atk: 115, def: 85, spa: 40, spd: 75, spe: 120}, abilities: {0: 'Triple Threat', 1: 'Speed Boost', H: 'Striker Frenzy'}},
	honchkrow: {baseStats: {hp: 100, atk: 135, def: 72, spa: 71, spd: 72, spe: 100}},
	flamigo: {baseStats: {hp: 82, atk: 125, def: 80, spa: 75, spd: 70, spe: 105}},
	flapple: {
		baseStats: {hp: 80, atk: 115, def: 85, spa: 95, spd: 60, spe: 90},
		abilities: {0: 'Levitate', 1: 'Hustle', H: 'Corrosion'},
		otherFormes: ['Flapple-Gmax'],
		formeOrder: ['Flapple', 'Flapple-Gmax'],
	},
	flapplegmax: {
		baseStats: {hp: 120, atk: 115, def: 85, spa: 95, spd: 60, spe: 90},
		abilities: {0: 'Sweet Decay'},
	},
	appletun: {
		baseStats: {hp: 110, atk: 95, def: 90, spa: 105, spd: 95, spe: 30},
		abilities: {0: 'Thick Fat', 1: 'Well-Baked Body', H: 'Harvest'},
		otherFormes: ['Appletun-Gmax'],
		formeOrder: ['Appletun', 'Appletun-Gmax'],
	},
	appletungmax: {
		baseStats: {hp: 165, atk: 95, def: 90, spa: 105, spd: 95, spe: 30},
		abilities: {0: 'Baked Bliss'},
	},
	garbodor: {baseStats: {hp: 80, atk: 125, def: 90, spa: 70, spd: 90, spe: 75}},
	garbodorgmax: {baseStats: {hp: 120, atk: 125, def: 90, spa: 70, spd: 90, spe: 75}},
	gigalith: {baseStats: {hp: 100, atk: 135, def: 130, spa: 80, spd: 80, spe: 25}},
	kingler: {baseStats: {hp: 80, atk: 125, def: 115, spa: 60, spd: 60, spe: 75}},
	kinglergmax: {baseStats: {hp: 120, atk: 125, def: 115, spa: 60, spd: 60, spe: 75}},
	rapidash: {baseStats: {hp: 80, atk: 110, def: 70, spa: 80, spd: 80, spe: 120}},
	rapidashgalar: {baseStats: {hp: 80, atk: 110, def: 70, spa: 80, spd: 80, spe: 120}},
	vikavolt: {baseStats: {hp: 77, atk: 95, def: 99, spa: 145, spd: 75, spe: 43}},
	ninetales: {baseStats: {hp: 73, atk: 66, def: 75, spa: 111, spd: 110, spe: 110}},
	ninetalesalt: {baseStats: {hp: 73, atk: 66, def: 75, spa: 111, spd: 110, spe: 110}},
	ninetalesalola: {baseStats: {hp: 73, atk: 57, def: 75, spa: 111, spd: 110, spe: 119}},
	breloom: {baseStats: {"hp":80,"atk":130,"def":80,"spa":60,"spd":80,"spe":70}},
	golurk: {baseStats: {hp: 100, atk: 125, def: 100, spa: 45, spd: 95, spe: 55}},
	golurkmega: {baseStats: {hp: 100, atk: 170, def: 125, spa: 70, spd: 100, spe: 55}},
	blastoise: {
		baseStats: {hp: 89, atk: 80, def: 95, spa: 100, spd: 108, spe: 78},
		abilities: {0: 'Water Barrage', 1: 'Bulletproof', H: 'Shell Armor'},
	},
	blastoisemega: {baseStats: {hp: 89, atk: 90, def: 135, spa: 135, spd: 123, spe: 78}},
	blastoisegmax: {baseStats: {hp: 145, atk: 80, def: 95, spa: 100, spd: 108, spe: 78}},
	grapploct: {baseStats: {hp: 80, atk: 128, def: 85, spa: 40, spd: 90, spe: 82}},
	incineroar: {baseStats: {hp: 95, atk: 115, def: 90, spa: 85, spd: 90, spe: 60}},
	primarina: {baseStats: {hp: 80, atk: 74, def: 74, spa: 126, spd: 116, spe: 65}},
	mabosstiff: {baseStats: {hp: 110, atk: 140, def: 90, spa: 60, spd: 70, spe: 85}},
	glalie: {baseStats: {hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 100}},
	glaliemega: {baseStats: {hp: 80, atk: 140, def: 100, spa: 80, spd: 95, spe: 105}},
	lumineon: {
		baseStats: {hp: 89, atk: 40, def: 86, spa: 94, spd: 90, spe: 81},
		abilities: {0: 'Protean', 1: 'Storm Drain', H: 'Drizzle'},
		otherFormes: ['Lumineon-Alt'],
		cosmeticFormes: ['Lumineon-Alt'],
		formeOrder: ['Lumineon', 'Lumineon-Alt'],
	},
	lumineonalt: {
		types: ['Water', 'Fairy'],
		baseStats: {hp: 89, atk: 40, def: 86, spa: 94, spd: 90, spe: 81},
		abilities: {0: 'Protean', 1: 'Storm Drain', H: 'Drizzle'},
	},
	seaking: {baseStats: {hp: 80, atk: 95, def: 75, spa: 60, spd: 90, spe: 70}},
	bombirdier: {baseStats: {hp: 70, atk: 103, def: 85, spa: 103, spd: 85, spe: 97}},
	durant: {baseStats: {hp: 58, atk: 109, def: 112, spa: 48, spd: 98, spe: 109}},
	persian: {
		baseStats: {hp: 70, atk: 100, def: 70, spa: 105, spd: 70, spe: 115},
		abilities: {0: 'Competitive', 1: 'Technician', H: 'Limber'},
	},
	persianalola: {baseStats: {hp: 70, atk: 105, def: 70, spa: 100, spd: 70, spe: 115}},
	floatzel: {baseStats: {hp: 90, atk: 105, def: 65, spa: 90, spd: 50, spe: 115}},
	gallademega: {baseStats: {hp: 75, atk: 165, def: 95, spa: 68, spd: 125, spe: 112}},
	castform: {baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 100}},
	heliolisk: {baseStats: {hp: 62, atk: 50, def: 60, spa: 110, spd: 99, spe: 109}},
	typhlosion: {baseStats: {hp: 83, atk: 105, def: 85, spa: 122, spd: 70, spe: 100}},
	typhlosionhisui: {
		baseStats: {hp: 83, atk: 105, def: 80, spa: 137, spd: 65, spe: 95},
		abilities: {0: 'Blazing Mane', 1: 'Soul Fire', H: 'Soul Heart'},
	},
	xatu: {baseStats: {hp: 65, atk: 75, def: 90, spa: 105, spd: 90, spe: 95}},
	gligar: {
		baseStats: {hp: 85, atk: 85, def: 115, spa: 35, spd: 75, spe: 90},
		abilities: {0: 'Venom Heal', 1: 'Filter', H: 'Immunity'},
	},
	gligaralt: {
		baseStats: {hp: 85, atk: 85, def: 115, spa: 35, spd: 75, spe: 90},
		abilities: {0: 'Venom Heal', 1: 'Filter', H: 'Immunity'},
	},
	luxray: {baseStats: {hp: 85, atk: 125, def: 85, spa: 65, spd: 85, spe: 90}},
	tentacruel: {
		baseStats: {hp: 80, atk: 70, def: 85, spa: 100, spd: 135, spe: 100},
		abilities: {0: 'Venom Veil', 1: 'Regenerator', H: 'Water Absorb'},
		otherFormes: ['Tentacruel-Reborn'],
		cosmeticFormes: ['Tentacruel-Reborn'],
		formeOrder: ['Tentacruel', 'Tentacruel-Reborn'],
	},
	tentacruelalt: {
		baseStats: {hp: 80, atk: 70, def: 85, spa: 100, spd: 135, spe: 100},
		abilities: {0: 'Venom Veil', 1: 'Regenerator', H: 'Water Absorb'},
	},
	toedscruel: {
		baseStats: {hp: 80, atk: 70, def: 85, spa: 100, spd: 135, spe: 100},
	},
	roserade: {
		baseStats: {hp: 75, atk: 60, def: 75, spa: 125, spd: 115, spe: 90},
		abilities: {0: 'False Devotion', 1: 'Invigorate', H: 'Technician'},
		otherFormes: ['Roserade-Mega'],
		formeOrder: ['Roserade', 'Roserade-Mega'],
	},
	roserademega: {
		baseStats: {hp: 75, atk: 65, def: 85, spa: 150, spd: 135, spe: 130},
		abilities: {0: 'True Devotion'},
	},
	emboar: {
		otherFormes: ['Emboar-Mega', 'Emboar-Reborn'],
		formeOrder: ['Emboar', 'Emboar-Mega', 'Emboar-Reborn', 'Emboar-Mega-Reborn'],
	},
	emboaralt: {
		baseStats: {hp: 110, atk: 123, def: 65, spa: 100, spd: 65, spe: 65},
		abilities: {0: 'Gluttony', 1: 'Violent Rush', H: 'Brute Force'},
	},
	emboarmegaalt: {
		baseStats: {hp: 110, atk: 150, def: 110, spa: 80, spd: 120, spe: 58},
		abilities: {0: 'Burning Ego'},
	},
});

// Keep Gmax eligibility available to custom base entries and their cosmetic forms.
const CUSTOM_GIGANTAMAX_MOVES: {[id: string]: string} = {
	venusaur: 'G-Max Vine Lash',
	charizard: 'G-Max Wildfire',
	blastoise: 'G-Max Cannonade',
	butterfree: 'G-Max Befuddle',
	pikachu: 'G-Max Volt Crash',
	meowth: 'G-Max Gold Rush',
	machamp: 'G-Max Chi Strike',
	gengar: 'G-Max Terror',
	kingler: 'G-Max Foam Burst',
	lapras: 'G-Max Resonance',
	eevee: 'G-Max Cuddle',
	snorlax: 'G-Max Replenish',
	garbodor: 'G-Max Malodor',
	aegislash: 'G-Max Final Verdict',
	melmetal: 'G-Max Meltdown',
	rillaboom: 'G-Max Drum Solo',
	cinderace: 'G-Max Fireball',
	inteleon: 'G-Max Hydrosnipe',
	corviknight: 'G-Max Wind Rage',
	orbeetle: 'G-Max Gravitas',
	drednaw: 'G-Max Stonesurge',
	coalossal: 'G-Max Volcalith',
	flapple: 'G-Max Tartness',
	appletun: 'G-Max Sweetness',
	dipplin: 'G-Max Syrupfall',
	sandaconda: 'G-Max Sandblast',
	toxtricity: 'G-Max Stun Shock',
	toxtricitylowkey: 'G-Max Stun Shock',
	centiskorch: 'G-Max Centiferno',
	hatterene: 'G-Max Smite',
	grimmsnarl: 'G-Max Snooze',
	alcremie: 'G-Max Finale',
	copperajah: 'G-Max Steelsurge',
	duraludon: 'G-Max Depletion',
	dragapult: 'G-Max Spirit Volley',
	feraligatr: 'G-Max Death Roll',
	urshifu: 'G-Max One Blow',
	urshifurapidstrike: 'G-Max Rapid Flow',
};
for (const [id, canGigantamax] of Object.entries(CUSTOM_GIGANTAMAX_MOVES)) {
	CUSTOM_SPECIES_UPDATES[id] = {...CUSTOM_SPECIES_UPDATES[id], canGigantamax};
}

const CUSTOM_ABILITY_UPDATES: {[id: string]: AnyObject} = {
	corrosivetouch: {"name":"Corrosive Touch","desc":"Technician + Poison Touch + Corrosion. Moves with 60 or less power receive a 1.5x boost (80 or less on Factory Field). Contact attacks have a 30% chance to poison. Can poison Poison- and Steel-types; Poison attacks can hit Steel-types. Poisoning a foe lowers its Defense and Special Defense by 1 stage. Includes Corrosion field effects. Grass attacks receive a 1.5x same-type attack bonus.","shortDesc":"Technician + Poison Touch + Corrosion; Grass STAB."},
	nighthunt: {"name":"Night Hunt","desc":"Strong Jaw + Infiltrator + Intimidate. Biting moves have 1.5x power. Moves bypass substitutes and opposing screens. Lowers adjacent foes' Attack on entry.","shortDesc":"Strong Jaw + Infiltrator + Intimidate."},
	sacredpower: {"name":"Sacred Power","desc":"Duskilate + Adaptability + Magic Guard. Eligible Normal moves become Dark (Fairy on Holy and Rainbow fields) with 1.3x power, or 1.5x on Duskilate-boosting fields. STAB is 2x (2.25x when already 2x). Prevents indirect damage. Gains +1 Sp. Def on entry in Fairy Tale Field and ignores hail damage on Cold Eclipse.","shortDesc":"Duskilate + Adaptability + Magic Guard."},
	froststalker: {"name":"Frost Stalker","desc":"Stakeout + Sharpness + Refrigerate. Doubles attacking stats against foes that just entered battle. Slicing moves have 1.5x power except on Cold Eclipse. Eligible Normal moves become Ice with 1.2x power, or 1.5x on Icy and Snowy Mountain fields.","shortDesc":"Stakeout + Sharpness + Refrigerate."},
	echosense: {"name":"Echo Sense","desc":"This Pokemon has Echo Fiend, Frisk, Telepathy, and Infiltrator's effects.","shortDesc":"Echo Fiend + Frisk + Telepathy + Infiltrator."},
	stormbell: {"name":"Storm Bell","desc":"Mirror Armor + Drizzle + Elevate. Starts rain, reflects opposing stat drops, reduces attack damage by 20%, is airborne, and boosts its best stat after a move KO. Retains Mirror Armor field effects, including +1 Defense and Sp. Def on Fairy Tale entry.","shortDesc":"Mirror Armor + Drizzle + Elevate."},
	apexarmor: {"name":"Apex Armor","desc":"Bulletproof + Rough Skin + Stalwart + Self Sufficient. Blocks bullet/pulse moves, reduces attack damage by 20%, damages contact attackers by 1/8 max HP, and ignores redirection. Restores 1/16 max HP each turn and prevents hail and sandstorm damage.","shortDesc":"Bulletproof + Rough Skin + Stalwart + Self Sufficient."},
	solarhydra: {
		name: "Solar Hydra",
		desc: "This Pokemon has Hydra Bond, Grassy Surge, Solar Power, and Self Repair's effects.",
		shortDesc: "Hydra Bond + Grassy Surge + Solar Power + Self Repair.",
	},

	astralengine: {
		name: "Astral Engine",
		desc: "This Pokemon has Elevate, Filter, and Analytic's effects.",
		shortDesc: "Elevate + Filter + Analytic.",
	},
	riftdancer: {
		name: 'Rift Dancer',
		desc: "This Pokemon has Opportunist, Chlorophyll, and Dancer's effects.",
		shortDesc: 'Opportunist + Chlorophyll + Dancer.',
	},
	glacialmass: {
		name: 'Glacial Mass',
		desc: "This Pokemon has Heavy Metal and Thick Fat's effects.",
		shortDesc: 'Heavy Metal + Thick Fat.',
	},
	nightrealm: {
		name: 'Night Realm',
		desc: 'This Pokemon can use Dream Eater and Nightmare on awake targets.',
		shortDesc: 'Dream Eater and Nightmare affect awake targets.',
	},
	nightmarepulse: {
		name: 'Nightmare Pulse',
		desc: "This Pokemon has Pendulum Swing and Night Realm's effects.",
		shortDesc: 'Pendulum Swing + Night Realm.',
	},

	ascendance: {
		name: 'Ascendance',
		desc: "All damaging moves deal 1.5x damage, can hit type immunities, and gain off-type STAB when the move type is not one of this Pokemon's types. On Holy Field, this Pokemon's Attack and Special Attack are raised by 1 on entry. Eevee-Starter and Umbreon transform into Divineon on entry; Umbreon uses Umbreon-Perfect's appearance while retaining Umbreon's full movepool.",
		shortDesc: 'Damaging moves 1.5x, bypass immunities, and gain off-type STAB; transforms Eevee-Starter/Umbreon into Divineon.',
	},
	aeviandream: {
		name: 'Aevian Dream',
		desc: "This Pokemon has Bad Dreams, Shed Skin, and Tough Claws's effects. When it enters battle as Musharna, it transforms into Musharna-Rejuv.",
		shortDesc: 'Bad Dreams + Shed Skin + Tough Claws; transforms Musharna into Musharna-Rejuv.',
	},
	aevianoath: {
		name: 'Aevian Oath',
		desc: "This Pokemon has Sworn Duty, Dual Wield, and Battle Armor's effects.",
		shortDesc: 'Sworn Duty + Dual Wield + Battle Armor.',
	},
	layeredcoat: {
		name: 'Layered Coat',
		desc: 'This Pokemon has Fur Coat and Overcoat\'s effects.',
		shortDesc: 'Fur Coat + Overcoat.',
	},
	illusion: {
		name: 'Illusion',
		desc: "On switch-in, this Pokemon disguises itself as the ally judged most threatening to the opposing active Pokemon using matchups, Speed, STAB, and damaging moves. It copies that ally's Ability and gains STAB from its types while keeping its own defensive typing. The disguise ends when it takes direct damage.",
		shortDesc: 'Disguises as the ally with the best matchup; copies its Ability and STAB until directly damaged.',
	},
	selfrepair: {
		name: 'Self Repair',
		desc: "This Pokemon has Self Sufficient and Natural Cure's effects.",
		shortDesc: 'Self Sufficient + Natural Cure.',
	},
	naturalrecovery: {
		name: 'Natural Recovery',
		desc: "This Pokemon has Natural Cure and Regenerator's effects.",
		shortDesc: 'Natural Cure + Regenerator.',
	},
	unstableevo: {
		name: 'Unstable Evo',
		desc: "Eevee-Starter's IVs carry through form changes. Before a Let's Go partner move, it becomes its matching evolution and uses that form's stats, typing, and Speed. It keeps Unstable Evo, Filter, and Self Sufficient, and gains both of that evolution's built-in Ability effects. Switching out restores Eevee-Starter. It cannot use battle gimmicks or hold Eevium Z.",
		shortDesc: "Filter + Self Sufficient; Let's Go moves change form and grant two Ability effects; no gimmicks.",
	},
	schooling: {
		name: 'Schooling',
		desc: "A level 20 or higher Wishiwashi changes to School Form above 1/4 maximum HP and returns to Solo Form at or below 1/4 maximum HP. While in School Form, it has Hydra Bond, Self Repair, and Filter's effects.",
		shortDesc: 'Changes form by HP; School: Hydra Bond + Self Repair + Filter.',
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
		desc: "On switch-in, this Pokemon compares the opposing side's combined Defense and Special Defense. If Defense is lower, its Attack rises; otherwise its Special Attack rises. Its first damaging move after switching in is a critical hit.",
		shortDesc: "Boosts the offense targeting foes' weaker defense; first damaging move crits.",
	},
	watercompaction: {
		name: 'Water Compaction',
		desc: 'Halves damage from Water attacks. Taking Water damage raises Defense by 2 stages.',
		shortDesc: 'Halves Water damage; taking Water damage raises Defense by 2.',
	},
	greatmarsh: {
		name: "Great Marsh",
		desc: "This Pokemon has Dry Skin, Adaptability, Poison Touch, and Anticipation's effects. On switch-in, it removes foe Illusions.",
		shortDesc: "Dry Skin + Adaptability + Poison Touch + Anticipation; removes foe Illusions on entry.",
	},
	blackfang: {
		name: "Black Fang",
		desc: "This Pokemon has Strong Jaw, Insomnia, and Moxie's effects.",
		shortDesc: "Strong Jaw + Insomnia + Moxie.",
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
	unovawing: {
		name: "Unova Wing",
		desc: "This Pokemon has Super Luck, Competitive, and Unburden's effects.",
		shortDesc: "+1 critical-hit stage; opposing stat drops give +2 Sp. Atk; item loss doubles Speed.",
	},
	aevianwing: {
		name: "Aevian Wing",
		desc: "This Pokemon has Scrappy, Rock Head, and Defiant's effects. It changes into Unfezant-Rejuv once when it enters battle.",
		shortDesc: "Transforms once; Scrappy + Rock Head + Defiant.",
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
		desc: "This Pokemon has Swift Swim and Mold Breaker's effects.",
		shortDesc: "Swift Swim + Mold Breaker.",
	},
	gooey: {
		name: 'Gooey',
		desc: "Any opposing damaging hit lowers the attacker's Speed by 2 and highest offense by 1. Hydration + Sap Sipper.",
		shortDesc: 'Damaging hit: attacker -2 Spe/-1 offense; Hydration + Sap Sipper.',
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
		shortDesc: 'Poison bypasses immunity; Wasteland/Corrosive effects; poison lowers Def/SpD.',
	},
	forewarn: {
		name: 'Forewarn',
		desc: 'Reveals a strongest foe move and removes foe Illusions on switch-in; Psychic Terrain gives +2 SpA; takes 0.8x move damage.',
		shortDesc: 'Reveals strongest foe move; removes Illusions; Psychic Terrain +2 SpA; takes 0.8x.',
	},
	frisk: {
		name: 'Frisk',
		desc: 'Reveals all foes\' items and removes foe Illusions on switch-in; each foe has a 30% chance to be Embargoed.',
		shortDesc: 'Reveals items; removes Illusions; foes have a 30% Embargo chance.',
	},
	anticipation: {
		name: 'Anticipation',
		desc: 'Warns of super-effective or OHKO moves and removes foe Illusions on switch-in.',
		shortDesc: 'Warns of dangerous moves; removes foe Illusions on entry.',
	},
	unaware: {
		name: 'Unaware',
		desc: 'Ignores foe stat stages when taking or dealing damage; removes foe Illusions on switch-in.',
		shortDesc: 'Ignores foe stat stages; removes foe Illusions on entry.',
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
		desc: 'Cannot sleep; Dark- and Ghost-type damaging moves have 1.3x power.',
		shortDesc: 'Cannot sleep; Dark/Ghost damaging moves have 1.3x power.',
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
		desc: "This Pokemon creates Psychic Terrain on entry, gains Competitive, Neuroforce, and Hydra Bond's effects.",
		shortDesc: "Psychic Surge + Competitive + Neuroforce + Hydra Bond.",
	},
	protectiveward: {
		name: 'Protective Ward',
		desc: 'This Pokemon is immune to Hail and has Liquid Voice and Storm Drain. It can use Arenite Wall and Aurora Veil regardless of weather or field, and counts as Ice in Hail and Ice fields.',
		shortDesc: 'Liquid Voice + Storm Drain; ignores Arenite Wall/Aurora Veil conditions; Hail immune; Ice in Ice fields.',
	},
	amethystglow: {
		name: 'Amethyst Glow',
		desc: "This Pokemon's moves cannot miss and it has Ice Body and Refrigerate. It counts as Ice in Hail and Ice fields.",
		shortDesc: 'Moves cannot miss; Ice Body + Refrigerate; Ice in Ice fields.',
	},
	battery: {
		name: 'Battery',
		desc: "This Pokemon and its allies have 1.3x power on Special attacks. The user's Special attacks get an additional 1.5x multiplier in Electric Terrain or Rain.",
		shortDesc: 'Self/ally Special attacks 1.3x; user gets extra 1.5x in Electric Terrain/Rain.',
	},
	battlebond: {
		name: 'Battle Bond',
		desc: "When this Pokemon is Greninja or Greninja-Bond, it transforms into Ash-Greninja after knocking out another Pokemon, and knocking out a target restores 1/8 max HP. It takes 0.75x damage from attacks and 30% less damage from Fighting Clause Abilities. In Doubles, Multi, or Free-for-All, it can survive one KO from above 1/3 HP. Its attacks deal 1.3x damage to Royal Decree or Neutralization users. Cold Eclipse boosts its attacks by 1.3x and reduces attack damage to 0.6x.",
		shortDesc: 'After a KO, Greninja or Greninja-Bond becomes Ash-Greninja; takes 0.75x attack damage; KO healing.',
	},
	pendulumswing: {
		name: "Pendulum Swing",
		desc: "This Pokemon has Insomnia's effect, and its moves cannot miss.",
		shortDesc: "Insomnia; moves cannot miss.",
	},
	fightingfiend: {
		name: "Fighting Fiend",
		desc: "This Pokemon has Vital Spirit and Multiscale's effects, and its moves cannot miss.",
		shortDesc: "Vital Spirit + Multiscale; moves cannot miss.",
	},
	punchfiend: {
		name: "Punch Fiend",
		desc: "This Pokemon has Iron Fist, Inner Focus, and Unseen Fist's effects.",
		shortDesc: "Iron Fist + Inner Focus + Unseen Fist.",
	},
	spinfiend: {
		name: "Spin Fiend",
		desc: "This Pokemon has Technician and Vital Spirit's effects.",
		shortDesc: "Technician + Vital Spirit.",
	},
	perishbody: {
		name: "Perish Body",
		desc: "Any opposing damaging hit gives all foes Perish Song; repeat hits reduce their count. In Haunted Field, affected adjacent foes are trapped. Holy Field blocks this effect, and allies cannot trigger it.",
		shortDesc: "Enemy hit: foes get Perish Song; repeat hits lower the count; Haunted traps.",
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
		shortDesc: "Hit: +1 Atk/Spe and confusion; confusion takes 1.25x; Klutz; self-hit costs 1/8.",
	},
	relicarmor: {
		name: "Relic Armor",
		desc: "In Desert, Fairy Tale, Cave, Crystal Cavern, New World, or Volcanic Field, this Pokemon's Defense and Special Defense rise by 1. Its Rock typing does not add weaknesses to Fighting, Ground, Steel, Water, or Grass. It cannot be critically hit, takes 0.8x damage from attacks, and has Self Sufficient's effects. After an opposing Pokemon lowers one of its stats, its Defense and Special Defense rise by 1.",
		shortDesc: "Rock weaknesses removed; field +1 Def/SpD; no crits; 0.8x damage; Self Sufficient.",
	},
	relicmishap: {
		name: "Relic Mishap",
		desc: "This Pokemon takes 0.9x damage from attacks and has Self Sufficient, Water Absorb, and Volt Absorb. It restores 1/16 max HP each turn and is immune to Sandstorm and Hail damage. During Sandstorm, its Special Defense is multiplied by 1.5. During Hail or Snow, its Defense is multiplied by 1.5.",
		shortDesc: "0.9x damage; Self Sufficient; Water/Volt Absorb; Sand +SpD; Hail/Snow +Def.",
	},
	shedskin: {
		name: "Shed Skin",
		desc: "At the end of each turn, this Pokemon has a 50% chance to cure its non-volatile status, remove common negative effects including Curse and Perish Song, reset its negative stat stages to 0, and restore 1/4 max HP. This can also activate while at or below half HP. In Dragon's Den, activation is guaranteed; it instead raises the higher offensive stat by 1, lowers Defense and Special Defense by 1, and restores 1/4 max HP.",
		shortDesc: "50% to cure effects, reset drops, and heal 1/4; guaranteed in Dragon's Den.",
	},
	draconicforce: {
		name: "Draconic Force",
		desc: "This Pokemon has Dragonize, Strong Jaw, and Mold Breaker's effects.",
		shortDesc: "Dragonize + Strong Jaw + Mold Breaker.",
	},
	ironmountain: {
		name: "Iron Mountain",
		desc: "This Pokemon has Filter, Stamina, and Heavy Metal's effects. Super-effective attacks deal 0.75x damage to it. Once per turn when hit by an opposing damaging move, its Defense rises by 1 stage and it restores 1/16 max HP. Its weight is doubled.",
		shortDesc: "Filter + Stamina + Heavy Metal.",
	},
	woolyconductor: {
		name: "Wooly Conductor",
		desc: "This Pokemon has Fluffy, Mold Breaker, and Static's effects. It takes half damage from contact moves, but takes double damage from Fire moves. Its moves ignore opposing Abilities, and contact moves used against it may paralyze the attacker.",
		shortDesc: "Fluffy + Mold Breaker + Static.",
	},
	sacrededge: {
		name: "Sacred Edge",
		desc: "This Pokemon has Sharpness, Dual Wield, and Sworn Duty's effects. Its slicing moves have 1.5x power. When Dual Wield applies to one of those slicing moves, the first hit keeps the 1.5x Sharpness boost and the second hit has 20% of the move's unboosted power. On switch-in or Mega Evolution, it heals its ally by 1/4 max HP, or 1/3 on Fairy Tale Field.",
		shortDesc: "Sharpness + Dual Wield + Sworn Duty.",
	},
	royalvoice: {"name":"Royal Voice","desc":"Pixilate + Queenly Majesty + Dream Sickness. Normal moves become Fairy and receive Pixilate power boosts. Blocks opposing priority moves targeting its side. Includes all Dream Sickness effects: ally protection, healing, stat-drop protection and dream shelter.","shortDesc":"Pixilate + Queenly Majesty + Dream Sickness."},
	fallenstar: {
		name: "Fallen Star",
		desc: "This Ability cannot be suppressed. This Pokemon has Mold Breaker, Dual Wield, Skill Link, and Self Sufficient. Existing multi-hit Arrow moves use Skill Link normally. Arrow moves deal 1.5x damage to trapped targets. At half HP or less, Arrow moves gain +1 priority and this Pokemon takes half damage. After an Arrow move, it takes 0.25x damage for the turn. An Arrow KO repeats the move at half power. In Free-for-All, Arrow moves hit every foe twice at full power.",
		shortDesc: "Mold Breaker + Dual Wield + Self Sufficient; at half HP, Arrows gain +1 priority.",
	},
	ragingstorm: {
		name: "Raging Storm",
		desc: "This Ability cannot be suppressed. This Pokemon has Mold Breaker and Battle Armor. Its attacks remove the target's positive stat changes before damage and ignore Reflect, Light Screen, Aurora Veil, and defensive stat boosts. If this Pokemon gets a KO, it damages remaining foes for 60% of the last damage in multi battles, or raises Attack by 1 if there is no valid target or no damage is dealt. Magic Guard users do not take this damage.",
		shortDesc: "Cannot be suppressed; Mold Breaker + Battle Armor; attacks clear boosts/ignore screens; KO bonus.",
	},
	ragingoverlord: {
		name: "Raging Overlord",
		desc: "This Ability cannot be suppressed. This Pokemon has Raging Storm and Supreme Overlord's effects.",
		shortDesc: "Raging Storm + Supreme Overlord.",
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
		desc: "This Pokemon has Magic Bounce, Serene Grace, and Triage. On switch-in, it sets Gravity for 5 turns.",
		shortDesc: "Magic Bounce + Serene Grace + Triage; sets Gravity for 5 turns.",
	},
	spiralevolution: {
		name: "Spiral Evolution",
		desc: "This Pokemon has Adaptability, Levitate, Dual Wield, Infiltrator, and Shield Dust. Its damaging moves pierce protection for reduced damage, its normal-priority moves act first in Trick Room without gaining priority, it ignores field-based Speed penalties, and it takes 0.8x damage.",
		shortDesc: "Adaptability + Levitate + Dual Wield + Infiltrator + Shield Dust; ignores field Speed penalties; protection pierce; takes 0.8x.",
	},
	accumulation: {
		name: "Accumulation",
		desc: "This Pokemon has Thick Fat and ignores sandstorm and hail. It can use Belch without a Berry and gains one Stockpile each turn. At 3 stacks it waits one full turn, then randomly chooses Belch or Spit Up with equal odds every other turn. Its Spit Up and Swallow combinations still apply.",
		shortDesc: "Thick Fat; auto-Stockpiles; at 3 waits one turn, then auto-releases every other turn.",
	},
	adaptivecell: {
		name: "Adaptive Cell",
		desc: "This Pokemon has Overcoat's effect and its Special Attack is multiplied by 1.3. Its first damaging move sets its opening type: Fighting for physical moves or Psychic for special moves. Each later damaging move changes its type to match its category. Physical moves use its boosted Special Attack as Attack; special moves use its boosted Special Attack normally.",
		shortDesc: "Overcoat; SpA 1.3x; physical -> Fighting using SpA; special -> Psychic using SpA.",
	},
	alloycore: {
		name: "Alloy Core",
		desc: "This Pokemon has Magic Guard, Self Sufficient, and Stalwart's effects.",
		shortDesc: "Magic Guard + Self Sufficient + Stalwart.",
	},
	ancientbloom: {
		name: "Ancient Bloom",
		desc: "This Pokemon has Effect Spore and Pollen Bloom's effects. Thick Fat applies once through Pollen Bloom: Fire and Ice damage is halved, not quartered. It keeps its field-based Defense, Special Defense, and power boosts.",
		shortDesc: "Effect Spore + Pollen Bloom; Thick Fat applies once; field boosts.",
	},
	ange: {
		name: "Ange",
		desc: "This Pokemon has Eternal Flower, Fairy Aura, and Magic Guard's effects. In Fairy Tale or Cold Eclipse, its Attack and Special Attack are multiplied by 2x; in Starlight Arena, New World, or Bewitched, they are multiplied by 1.5x. Grass-type moves use another 1.5x multiplier. Fairy-type moves are boosted, and opposing Mega, G-Max, Terastallized, Stellar, and Ultra Beast Pokemon have their stats reduced to 0.7x. When this Pokemon faints, it creates Bewitched Woods for 5 turns.",
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
	aquashell: {"name":"Aqua Shell","desc":"Water Veil + Tough Claws + Inner Focus. Prevents and cures burns, grants Aqua Ring on switch-in, prevents hail and sandstorm damage, and cures status at turn end on Water Surface and Underwater fields. Contact moves have 1.3x power. Prevents flinching and Intimidate's Attack drop.","shortDesc":"Water Veil + Tough Claws + Inner Focus."},
	argentdevotion: {
		name: "Argent Devotion",
		desc: "This Pokemon has Armorize and Sworn Duty's effects.",
		shortDesc: "Armorize + Sworn Duty.",
	},
	fluffyevo: {
		name: "Fluffy Evo",
		desc: "Moves that do not match this Pokemon's type gain STAB. Its damaging moves ignore type immunities while respecting resistances, and it has Overcoat's effects.",
		shortDesc: "Off-type moves gain STAB; hits type immunities; Overcoat.",
	},
	astralwatcher: {
		name: "Astral Watcher",
		desc: "This Pokemon has Prankster, Telepathy, and Defragment. On entry, it reveals foes' items and each foe has a 30% chance to gain Embargo.",
		shortDesc: "Prankster + Telepathy + Defragment; reveals foes' items.",
	},
	astralwitchcraft: {
		name: "Astral Witchcraft",
		desc: "Its same-type attacks have 1.2x power (Proficient). This Pokemon has Sworn Duty, Levitate, and Magic Guard's effects. In Fairy Tale or New World, its Special Attack and Special Defense rise by 1 on entry.",
		shortDesc: "Proficient + Sworn Duty + Levitate + Magic Guard; Fairy Tale/New World: +1 SpA/SpD.",
	},
	aurainstinct: {
		name: "Aura Instinct",
		desc: "This Pokemon has Adaptability, Dual Wield, and Second Wind's effects.",
		shortDesc: "Adaptability + Dual Wield + Second Wind.",
	},
	auramaster: {
		name: "Aura Master",
		desc: "This Pokemon takes half damage from contact moves and has Dual Wield, Inner Focus, and Technician's effects.",
		shortDesc: "0.5x from contact; Dual Wield + Inner Focus + Technician.",
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
		shortDesc: "Fast attacks 1.2x; slow-hit guard once; first hit +Atk/SpA; blocks Berries/Seeds.",
	},
	bewitchingmajesty: {
		name: "Bewitching Majesty",
		desc: "On switch-in, this Pokemon creates Bewitched Woods for 5 turns. This Pokemon has Magic Bounce and Queenly Majesty's effects.",
		shortDesc: "Sets Bewitched Woods for 5 turns. Magic Bounce + Queenly Majesty.",
	},
	blademastery: {
		name: "Blade Mastery",
		desc: "This Pokemon has Sharpness and Super Luck. Below half HP, its slicing moves gain +1 priority.",
		shortDesc: "Sharpness + Super Luck; below half HP, slicing moves gain +1 priority.",
	},
	goldentalons: {
		name: "Golden Talons",
		desc: "This Pokemon has Stalwart, Good as Gold, and Sharpness's effects.",
		shortDesc: "Stalwart + Good as Gold + Sharpness.",
	},
	blazingmane: {
		name: "Blazing Mane",
		desc: "Fire attacks have 1.5x power and damaging moves hit twice, with the second hit at 30% power. At half HP or less, Fire attacks gain +1 priority. Burning and Volcanic Fields raise its Speed by 1 on entry or when the field starts.",
		shortDesc: "Fire 1.5x; second hit 30%; half-HP Fire +1 priority; fire fields +1 Spe.",
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
	doublestrike: {
		name: 'Double Strike',
		desc: "This Pokemon has Iron Fist, Technician, and Skill Link's effects.",
		shortDesc: 'Iron Fist + Technician + Skill Link.',
	},
	burningcrown: {
		name: "Burning Crown",
		desc: "This Pokemon has Intimidate, White Smoke, Mold Breaker, and Wildfire Core. It takes 20% less damage from attacks. It gains no boosts when a Pokemon faints. Its field bonuses remain active.",
		shortDesc: "Intimidate + White Smoke + Mold Breaker + Wildfire Core; no KO boost.",
	},
	burningego: {
		name: "Burning Ego",
		desc: "This Pokemon has Ultra Ego and Magma Armor's effects.",
		shortDesc: "Ultra Ego + Magma Armor.",
	},
	burningspirit: {
		name: "Burning Spirit",
		desc: "This Pokemon has Self Sufficient, Opportunist, Magma Armor, and Filter's effects.",
		shortDesc: "Self Sufficient + Opportunist + Magma Armor + Filter.",
	},
	byxbysiontouch: {
		name: "Byxbysion Touch",
		desc: "This Pokemon's Poison-type damaging moves restore 1/4 of the damage dealt. Ground-type moves deal 1/2 damage to this Pokemon. It has Poison Touch's effect.",
		shortDesc: "Poison attacks drain 1/4; Ground damage halved; Poison Touch.",
	},
	calderacore: {
		name: "Caldera Core",
		desc: "This Pokemon has Magma Armor, Sheer Force, and Drought's effects. It starts sunlight on entry. Eligible moves have 1.3x power but lose their secondary effects. Incoming Water- and Ice-type attacks deal half damage. It cures freezing and prevents freezing outside Cold Eclipse. On entry in Dragon's Den, Volcanic, or Cold Eclipse, it gains +1 Defense and +1 Special Defense. In Dragon's Den, it also blocks incoming Fire-type moves.",
		shortDesc: "Magma Armor + Sheer Force + Drought; halves Water/Ice damage; field bonuses.",
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
	cruelshell: {
		name: "Cruel Shell",
		desc: "This Pokemon has Hyper Cutter, Shell Armor, and Anger Shell's effects.",
		shortDesc: "Hyper Cutter + Shell Armor + Anger Shell.",
	},
	crumblingshell: {
		name: "Crumbling Shell",
		desc: "When this Pokemon is hit by a Physical attack, Stealth Rock is set on the attacker's side unless a water field is active or that side already has Stealth Rock.",
		shortDesc: "Physical hits set Stealth Rock, except in water fields.",
	},
	witheringshell: {
		name: 'Withering Shell',
		desc: "This Pokemon has Crumbling Shell, Natural Recovery, and Sturdy's effects. Physical hits set Stealth Rock on the attacker's side except in water fields. It cures status and restores 1/3 max HP when switching out. If it is at full HP, it survives one hit with at least 1 HP, and OHKO moves fail.",
		shortDesc: 'Crumbling Shell + Natural Recovery + Sturdy.',
	},
	wingedwraith: {
		name: 'Winged Wraith',
		desc: "This Pokemon has Infiltrator and Gale Wings' effects.",
		shortDesc: 'Infiltrator + Gale Wings.',
	},
	toxicsink: {
		name: 'Toxic Sink',
		desc: 'This Pokemon has Effect Spore and Invigorate. It redirects and absorbs Poison-type moves, raising its Attack and Special Attack by 1.',
		shortDesc: 'Effect Spore + Invigorate; absorbs Poison moves for +1 Atk/SpA.',
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
	cursedarmament: {
		name: "Cursed Armament",
		desc: "This Pokemon has Filter's effects. Curse used by this Pokemon becomes a 100 BP physical or special Ghost-type attack using its higher Attack or Special Attack, with 100% accuracy, that hits all adjacent foes and curses each target. Curse from this Pokemon deals 1/8 max HP each turn. This Pokemon restores 1/4 of the damage dealt by its attacks and by Curse damage it caused. When this Pokemon reaches half HP or faints, it creates Haunted Field for 5 turns.",
		shortDesc: "Filter; Curse becomes a 100 BP spread Ghost attack using the higher Attack or Sp. Atk; curses foes; heals 1/4 damage; half HP/faint sets Haunted Field.",
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
	apexvenom: {
		name: "Apex Venom",
		desc: "This Pokemon has Strong Jaw and Shed Skin's effects. Poison moves, including Poison Fang, are super effective against Poison- and Steel-type Pokemon. Poison Fang is Dragon-type and has 1.5x power. Biting moves bypass protection and have a 30% chance to badly poison the target.",
		shortDesc: "Strong Jaw + Shed Skin; Poison hits Poison/Steel; Poison Fang is Dragon/1.5x; bites bypass protection and badly poison 30%.",
	},
	curseddoll: {
		name: "Cursed Doll",
		desc: "This Pokemon has Tough Claws and Shadow Shield's effects. Its damaging moves curse the foes they hurt. When it faints, it creates Haunted Field for 5 turns.",
		shortDesc: "Tough Claws + Shadow Shield; damaging moves curse; faint sets Haunted.",
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
		shortDesc: "Unsuppressible sound immunity; sound -> Flying 1.5x; allies avoid own sound damage.",
	},
	eclipse: {
		name: "Eclipse",
		desc: "During weather, this Pokemon's attacks deal 1.5x damage. In clear weather, attacks deal 0.5x damage to this Pokemon. Its Psychic-type moves become Dark type if Dark would do more damage, and its Dark-type moves become Psychic type if Psychic would do more damage. It restores 1/4 max HP instead of taking damage from Psychic- or Dark-type moves.",
		shortDesc: "Weather attacks 1.5x; clear damage halved; Psychic/Dark choose type; absorbs both.",
	},
	eclipsevision: {
		name: "Eclipse Vision",
		desc: "This Pokemon's Special Attack is multiplied by 1.5. Its first Psychic- or Dark-type move sets its opening battle type, and each later Psychic- or Dark-type move changes it to that type. If this Pokemon is Psychic type, it restores 1/8 of its max HP at the end of each turn. If this Pokemon is Dark type, its damaging moves restore HP equal to 1/4 of the damage dealt.",
		shortDesc: "SpA 1.5x; first Psychic/Dark move sets type, later moves switch it; Psychic heals; Dark drains.",
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
		shortDesc: "Duskilate; 2x vs low HP; KO heals 1/8.",
	},
	falsedevotion: {
		name: "False Devotion",
		desc: "This Pokemon has Serene Grace, Natural Recovery, and Prankster's effects.",
		shortDesc: "Built-in Serene Grace, Natural Recovery, and Prankster.",
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
		desc: "This Pokemon has Shell Armor and Water Barrage's effects, plus Power Spot and Friend Guard. In Electric Terrain, Murkwater Surface, Water Surface, Underwater, Factory, and Short Circuit fields, incoming Electric moves are blocked and redirected to it, raising its Attack and Special Attack by 1. Fairy Tale, New World, Cold Eclipse, and Starlight Arena give it +1 Defense and +1 Special Defense once per active terrain. New World, Cold Eclipse, and Starlight Arena also boost its move power by 1.5x.",
		shortDesc: "Shell Armor + Water Barrage; field Electric absorption; ally support.",
	},
	freezerburn: {
		name: "Freezer Burn",
		desc: "This Pokemon has Slush Rush and Refrigerate. Refrigerate-converted moves have 1.2x power.",
		shortDesc: "Slush Rush + Refrigerate; converted moves have 1.2x power.",
	},
	livinglegend: {
		name: "Living Legend",
		desc: "This Pokemon has Flash Fire, Download, and Sheer Force. Hidden effect: Extreme Speed has 1.5x power.",
		shortDesc: "Flash Fire + Download + Sheer Force; Extreme Speed 1.5x.",
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
		desc: "This Pokemon has Speed Boost, Magma Armor, and Flame Body's effects.",
		shortDesc: "Speed Boost + Magma Armor + Flame Body.",
	},
	heavenlychorus: {
		name: "Heavenly Chorus",
		desc: "This Pokemon has Pixilate, Cloud Nine, and Fluffy's effects.",
		shortDesc: "Pixilate + Cloud Nine + Fluffy.",
	},
	hellfireeclipse: {
		name: "Hellfire Eclipse",
		desc: "This Pokemon has Flash Fire and Dark Aura's effects. During harsh sunlight, its Attack and Special Attack are multiplied by 1.5. After it uses a Fire-type move, it sets Sunny Day for 2 turns.",
		shortDesc: "Flash Fire + Dark Aura; Sun: Atk/SpA 1.5x; Fire moves set 2-turn Sun.",
	},
	highnoon: {
		name: "High Noon",
		desc: "This Pokemon's Water-type moves have 1.2x power. Its attacks cannot miss unless the target is in the semi-invulnerable turn of a move. Moves that would be boosted by Sharpness or Mega Launcher, plus arrow moves, trigger Dual Wield. Its moves have +1 critical hit ratio against targets that have not moved yet this turn.",
		shortDesc: "Water moves 1.2x; attacks cannot miss; Dual Wield; +1 crit vs unmoved targets.",
	},
	hydrabond: {
		name: "Hydra Bond",
		desc: "This Pokemon's damaging moves become multi-hit moves that hit three times. The second and third hits deal 30% damage and retarget the foe's ally if the first target fainted. In Free-for-All battles, single-target moves hit all foes once at 1.3x power; spread moves hit all foes three times, with later hits at 30% power, and full-power spread moves stay full power.",
		shortDesc: "Damaging moves hit 3x; hits 2/3 at 30%; FFA singles hit all foes at 1.3x.",
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
	armorize: {
		name: "Armorize",
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
		desc: "This Pokemon has Aerilate, Hyper Cutter, and Vital Spirit's effects.",
		shortDesc: "Aerilate + Hyper Cutter + Vital Spirit.",
	},
	hardyskin: {
		name: "Hardy Skin",
		desc: "This Pokemon has Dry Skin, Vital Spirit, and Moxie's effects.",
		shortDesc: "Dry Skin + Vital Spirit + Moxie.",
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
		desc: "This Pokemon is immune to Ice-type attacks and restores 1/4 of its maximum HP when hit by one. It has Ice Body's healing and hail immunity. Its damaging Psychic-type moves have a 40% chance to cause frostbite, and Freezing Glare's frostbite chance is doubled. Its Physical Ice-type moves become Special.",
		shortDesc: "Ice immunity heals 1/4; Ice Body; damaging Psychic may frostbite; physical Ice -> special.",
	},
	mirrorgreed: {
		name: "Mirror Greed",
		desc: "This Pokemon has Magic Bounce, Analytic, and Filter's effects.",
		shortDesc: "Magic Bounce + Analytic + Filter.",
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
		shortDesc: "Prankster + Magic Guard; fallen allies boost damage; foes fainted heal 5% each turn.",
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
		desc: "This Pokemon has Sharpness, Dual Wield, and Pressure. When it faints, it casts a physical Doom Desire on each opposing Pokemon.",
		shortDesc: "Sharpness + Dual Wield + Pressure; on faint: Doom Desire on foes.",
	},
	orchardbond: {
		name: "Orchard Bond",
		desc: "This Pokemon has Hydra Bond and Harvest's effects.",
		shortDesc: "Hydra Bond + Harvest.",
	},
	paradoxengine: {
		name: "Paradox Engine",
		desc: "If Sun or Electric Terrain is active, this Pokemon's Speed is multiplied by 1.5. This Pokemon's Fighting-type and Electric-type moves have 1.5x power.",
		shortDesc: "Sun/Electric Terrain: Speed 1.5x. Fighting/Electric moves have 1.5x power.",
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
		desc: "This Pokemon has Protean, Shed Skin, and Unaware's effects.",
		shortDesc: "Protean + Shed Skin + Unaware.",
	},
	perfectego: {
		name: "Perfect Ego",
		desc: "This Pokemon has Ultra Ego's effects, and its moves cannot miss.",
		shortDesc: "Ultra Ego; moves cannot miss.",
	},
	perfectforesight: {
		name: "Perfect Foresight",
		desc: "Includes Insomnia: prevents sleep and Yawn, cures sleep, and boosts damaging Dark- and Ghost-type moves by 1.3x. On activation, prioritizes opposing Speed abilities whose conditions are met for this Pokemon (Sand Rush, Chlorophyll, Swift Swim, Slush Rush, Surge Surfer, Quick Feet, or Speed Boost). Ties and fallback use the highest Attack or Special Attack. Future Sight queued by this Ability has 90 BP, ignores defensive boosts, screens, and Abilities, and hits Dark-type Pokemon neutrally. If this Pokemon uses a move on opposing Pokemon, is damaged by an opposing attack, or uses Future Sight, Future Sight is queued on the affected opposing slots. Spread moves queue Future Sight on all enemies, and existing Perfect Foresight delayed attacks stack instead of blocking new ones.",
		shortDesc: "Insomnia + strongest foe's Ability; queues 90 BP Future Sight.",
	},
	phantomfist: {
		name: "Phantom Fist",
		desc: "This Pokemon's moves cannot miss and it has Filter, Self Repair, and Unseen Fist's effects.",
		shortDesc: "Moves cannot miss + Filter + Self Repair + Unseen Fist.",
	},
	pollenbloom: {
		name: "Pollen Bloom",
		desc: "This Pokemon has Thick Fat, Proficient, and Unaware's effects. At the end of each turn, opposing non-Grass Pokemon take Grass-type damage equal to 1/16 max HP, scaled by effectiveness and blocked by Grass immunities; this Pokemon heals the damage dealt.",
		shortDesc: "Thick Fat + Proficient + Unaware; Grass chip scales and heals the user.",
	},
	powerdrill: {
		name: "Power Drill",
		desc: "This Pokemon's drill moves have 1.5x power.",
		shortDesc: "Drill moves have 1.5x power.",
	},
	piercingdrill: {
		name: "Piercing Drill",
		desc: "This Pokemon has Mold Breaker's effect. Its contact moves ignore a target's protection and deal 1/4 the usual damage. It also has Power Drill's effect, boosting drill moves by 1.5x, or 2x in Rocky, Mountain, Snowy Mountain, Cave, and Volcanic fields.",
		shortDesc: "Mold Breaker; contact pierces Protect at 1/4; drill moves 1.5x, or 2x in fields.",
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
		desc: "This Pokemon has Marvel Scale and Dragonize's effects.",
		shortDesc: "Marvel Scale + Dragonize.",
	},
	queensguard: {
		name: "Queen's Guard",
		desc: "This Pokemon has Contrary, Shed Skin, and Intimidate's effects.",
		shortDesc: "Contrary + Shed Skin + Intimidate.",
	},
	ragingcurrent: {
		name: "Raging Current",
		desc: "Its same-type attacks have 1.2x power (Proficient). This Pokemon has Swift Swim, Damp, Water Veil, Dry Skin, and Stamina's effects.",
		shortDesc: "Proficient + Swift Swim + Damp + Water Veil + Dry Skin + Stamina.",
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
		desc: "This Pokemon has Levitate. Its moves with 60 or less Base Power gain +1 priority. In Fairy Tale, Big Top, Dragon's Den, Mountain, Snowy Mountain, or Cold Eclipse, its damaging moves deal 2x damage. In Desert, Rocky, Forest, Burning, Superheated, Ashen Beach, Water Surface, Cave, Starlight Arena, or New World, its damaging moves deal 1.5x damage.",
		shortDesc: "Levitate; moves <=60 BP gain +1 priority; boosted fields give 1.5x or 2x damage.",
	},
	relentlesslink: {
		name: "Relentless Link",
		desc: "This Pokemon has Skill Link, Battle Armor, Mold Breaker's, and Guts's effects.",
		shortDesc: "Skill Link + Battle Armor + Mold Breaker + Guts.",
	},
	relicbeam: {
		name: "Relic Beam",
		desc: "This Pokemon's Sp. Atk becomes equal to its Defense, and Special Attack stat stages use Defense stages instead. Beam moves and moves boosted by Mega Launcher have 1.5x power.",
		shortDesc: "SpA equals Defense using Def stages; beam/Mega Launcher moves have 1.5x power.",
	},
	requiem: {
		name: "Requiem",
		desc: "This Pokemon has Cursed Body's effect. Its first direct damaging interaction with each opposing Pokemon applies Perish Song to that foe. The mark clears when the foe switches out. Whenever an opposing Pokemon faints, this Pokemon restores 1/4 max HP. When this Pokemon faints, it creates Haunted Field for 5 turns. This Ability cannot be suppressed.",
		shortDesc: "Cursed Body; first hit marks foes with Perish Song; foe KO heals 1/4; faint sets Haunted.",
	},
	reapersgrip: {"name":"Reaper's Grip","desc":"Unaware + Iron Fist + Dark Aura + Self Sufficient. Restores 1/16 max HP each turn and prevents hail and sandstorm damage. Ignores opposing stat changes when attacking or taking attacks. Punching moves have 1.4x power; all Dark moves receive Dark Aura's boost. The first damaging hit that leaves this Pokemon at half HP or less creates Haunted Field for 3 turns (or refreshes it to at least 3). Fainting creates Haunted Field for 5 turns, or adds 5 turns to an existing Haunted Field.","shortDesc":"Unaware + Iron Fist + Dark Aura + Self Sufficient; half HP: 3-turn Haunted Field; faint: +5 turns."},
	resonanceforce: {
		name: "Resonance Force",
		desc: "Sound-based moves used by this Pokemon's side deal 1.5x damage. This Pokemon's side is immune to its own damaging sound-based moves. Sound-based moves used by this Pokemon use its higher offensive stat.",
		shortDesc: "Side sound moves 1.5x; allies avoid own sound damage; sound uses higher offense.",
	},
	rimeknuckle: {"name":"Rime Knuckle","desc":"Filter + Iron Fist + Ice Body. Damaging moves have a 40% chance to cause frostbite (80% on Icy Field). KOs restore 1/8 max HP, or 1/4 against Mega, G-Max, Terastallized, Stellar or Z-Move item targets. Ice Body adds a 30% chance to frostbite contact attackers, hail immunity, and healing in hail/snow or on Icy, Snowy Mountain and Cold Eclipse fields. Healing is 1/16 max HP, or 1/8 in hail on Cold Eclipse.","shortDesc":"Filter + Iron Fist + Ice Body; frostbite chance; KO healing."},
	riotamp: {
		name: "Riot Amp",
		desc: "This Pokemon has Proficient, Galvanize, Resonance Force, and Volt Absorb's effects.",
		shortDesc: "Proficient + Galvanize + Resonance Force + Volt Absorb.",
	},
	riptideclaws: {
		name: "Riptide Claws",
		desc: "This Pokemon has Swift Swim, Tough Claws, and Shell Armor's effects.",
		shortDesc: "Swift Swim + Tough Claws + Shell Armor.",
	},
	stancechange: {
		name: 'Stance Change',
		desc: "This Pokemon has Dual Wield. Aegislash changes to Blade Forme before attacking and Shield Forme before King's Shield. Shield Forme takes 20% less damage; consecutive Free-for-All hits deal 30% less damage. Blade Forme deals 1.2x damage. On Fairy Tale and Chessboard, activation raises Defense and Special Defense by 1; switching to Blade raises Attack and Special Attack by 1 and lowers both defenses by 1, with the reverse on switching to Shield.",
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
		shortDesc: "Dual Wield; Shield: 20% less damage; Blade: 1.2x damage.",
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
	empress: {
		name: 'Empress',
		desc: "This Pokemon has Queenly Majesty and Royal Decree's effects, gains normal STAB on Fighting-type moves, and ignores the Fairy-type component of Poison- and Steel-type weaknesses.",
		shortDesc: "Queenly Majesty + Royal Decree; Fighting STAB; ignores Fairy's Poison/Steel weakness.",
	},
	imperialprincess: {
		name: 'Imperial Princess',
		desc: "This Pokemon has Striker, Vital Spirit, and Moxie's effects, gains normal STAB on Fighting-type moves, and ignores the Fairy-type component of Poison- and Steel-type weaknesses.",
		shortDesc: "Striker + Vital Spirit + Moxie; Fighting STAB; ignores Fairy's Poison/Steel weakness.",
	},
	loyalguard: {
		name: 'Loyal Guard',
		desc: "This Pokemon has Friend Guard, Guard Dog, and Intimidate's effects.",
		shortDesc: 'Friend Guard + Guard Dog + Intimidate.',
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
		desc: "On entry, this Pokemon sets Sandstorm for 8 turns. It has Dauntless Shield and Solid Rock. Arenite Wall lasts 5 turns, or 8 turns when extended. Each turn, foes take immunity-aware Rock damage equal to 1/16 max HP, scaled by effectiveness.",
		shortDesc: "8-turn Sand; Dauntless Shield + Solid Rock; Arenite Wall 5/8 turns; Rock chip.",
	},
	seablessing: {
		name: "Sea Blessing",
		desc: "This Pokemon's Defense and Special Defense are 1.5x. On entry, it and adjacent allies heal 1/4 max HP, and it gains Aqua Ring. It has Water Veil and Rain Dish.",
		shortDesc: "1.5x Def/SpD; entry heals self/allies 1/4; Water Veil + Rain Dish.",
	},
	seasonalstride: {
		name: "Seasonal Stride",
		desc: "Normal moves become this Pokemon's primary type and have 1.2x power. Kicking moves have 1.4x power. It has Chlorophyll and changes forme with weather: Spring in rain, Summer in sun, Autumn in sand, Winter in snow.",
		shortDesc: "Normal -> primary type 1.2x; kicks 1.4x; Chlorophyll; weather forms.",
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
		desc: "Its same-type attacks have 1.2x power (Proficient). This Pokemon has Protean, Technician, Infiltrator, and Anticipation's effects. Before using a move, it becomes that move's type.",
		shortDesc: "Proficient + Protean + Technician + Infiltrator + Anticipation.",
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
		desc: "This Pokemon has Armorize, Punk Rock, and Levitate's effects.",
		shortDesc: "Armorize + Punk Rock + Levitate.",
	},
	hauntedchime: {
		name: "Haunted Chime",
		desc: "This Pokemon has Elevate, Wind Power, and Cursed Body's effects.",
		shortDesc: "Elevate + Wind Power + Cursed Body.",
	},
	shadowguard: {
		name: "Shadow Guard",
		desc: "This Pokemon has Shadow Tag, Shadow Shield, and Elevate's effects. It also queues a full-power Temporal Shift Future Sight every turn, using whichever of Ghost, Dark, or Fairy would hit the target best. Shadow Tag's faint effect also applies.",
		shortDesc: "Shadow Tag + Shadow Shield + Elevate; every turn queues Ghost/Dark/Fairy Temporal Shift.",
	},
	siegelauncher: {
		name: "Siege Launcher",
		desc: "This Pokemon has Water Barrage, Mega Launcher, Self Sufficient, and Stalwart's effects. Moves boosted by Mega Launcher are used twice through Dual Wield; the second hit deals 20% of the move's unboosted power.",
		shortDesc: "Water Barrage + Mega Launcher + Self Sufficient + Stalwart; boosted moves add 20% hit.",
	},
	sinisterblaze: {
		name: "Sinister Blaze",
		desc: "This Pokemon is burned on switch-in, even through Misty Terrain, and its burn can overwrite other status conditions. In Fairy Tale, Starlight Arena, New World, Burning Field, Volcanic Field, or Superheated Field, its Defense and Special Defense rise by 1 stage on entry. Its burn damage becomes healing and deals the same damage to each foe. It does not heal from that generated damage, but heals from real burn damage dealt to foes. Its physical attacks are not weakened by burn. This Ability cannot be Skill Swapped, suppressed, copied by Role Play, given by Entrainment, or Traced.",
		shortDesc: "Burn becomes healing + equal foe damage; heals from foe burns; no burn penalty.",
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
		desc: "This Pokemon has Intimidate, Shed Skin, and Mold Breaker's effects.",
		shortDesc: "Intimidate + Shed Skin + Mold Breaker.",
	},
	striker: {
		name: "Striker",
		desc: "This Pokemon's kicking moves have 1.4x power.",
		shortDesc: "Kicking moves have 1.4x power.",
	},
	perfectstriker: {
		name: "Perfect Striker",
		desc: "This Pokemon has Striker, No Guard, and Libero's effects.",
		shortDesc: "Striker + No Guard + Libero.",
	},
	silkendecoy: {
		name: "Silken Decoy",
		desc: "On becoming Mega Ariados, this Pokemon spins a protective cocoon and remembers whether it is still available when switching. When any Pokemon faints while this Pokemon is active, it spins a cocoon if it does not already have one. The cocoon blocks the next damaging hit and the remaining hits of that multi-hit move. It also has Insomnia and Self Sufficient's effects.",
		shortDesc: "A persistent cocoon blocks a hit and the rest of that multi-hit move; Insomnia + Self Sufficient.",
	},
	strikersmomentum: {
		name: "Striker's Momentum",
		desc: "This Pokemon has Striker, Defiant, and Libero's effects, and its moves cannot miss. Once per switch-in, a KO caused by this Pokemon raises its Speed by 1 stage.",
		shortDesc: "Moves cannot miss; Striker + Defiant + Libero; first KO gives +1 Speed.",
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
	supersweetsyrup: {
		name: "Supersweet Syrup",
		desc: "On switch-in, this Pokemon lowers the evasiveness of adjacent opposing Pokemon by 1 stage every time it switches in. This Pokemon has Sticky Hold. When this Pokemon is hit by an attack, the attacker is Embargoed for 5 turns.",
		shortDesc: "On switch-in, lowers adjacent foes' evasiveness 1 stage; Sticky Hold; attackers are Embargoed for 5 turns.",
	},
	hydraheart: {
		name: "Hydra Heart",
		desc: "This Pokemon has Hydra Bond, Self Sufficient, and Stamina's effects.",
		shortDesc: "Hydra Bond + Self Sufficient + Stamina.",
	},
	sweetresonance: {
		name: "Sweet Resonance",
		desc: "On switch-in, this Pokemon has Supersweet Syrup, Self Sufficient, and Hydra Bond's effects, and gives its adjacent ally Dragon Cheer.",
		shortDesc: "Supersweet Syrup + Self Sufficient + Hydra Bond; ally gets Dragon Cheer on entry.",
	},
	bakedbliss: {
		name: "Baked Bliss",
		desc: "This Pokemon has Well-Baked Body, Thick Fat, Sweet Veil, and Gluttony's effects.",
		shortDesc: "Well-Baked Body + Thick Fat + Sweet Veil + Gluttony.",
	},
	sweetdecay: {
		name: "Sweet Decay",
		desc: "This Pokemon has Hustle, Gluttony, Sweet Veil, and Corrosion's effects.",
		shortDesc: "Hustle + Gluttony + Sweet Veil + Corrosion.",
	},
	sweetsanctuary: {
		name: "Sweet Sanctuary",
		desc: "This Pokemon has Friend Guard, Sweet Veil, Aroma Veil, and Pastel Veil's effects.",
		shortDesc: "Friend Guard + Sweet Veil + Aroma Veil + Pastel Veil.",
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
		desc: "This Pokemon has Pollen Bloom and Self Sufficient. Its Poison-type attacks restore 1/4 of the damage they deal.",
		shortDesc: "Pollen Bloom + Self Sufficient; Poison attacks heal 1/4 damage.",
	},
	toxicrenewal: {
		name: "Toxic Renewal",
		desc: "This Pokemon has Adaptability and Regenerator's effects.",
		shortDesc: "Adaptability + Regenerator.",
	},
	treasuretitan: {
		name: "Treasure Titan",
		desc: "This Pokemon has Filter, Earth Eater, and Heavy Metal's effects. Copperajah-Gmax's weight-based moves always use their maximum power.",
		shortDesc: "Filter + Earth Eater + Heavy Metal; weight moves use max power.",
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
		shortDesc: "Mold Breaker + Inner Focus; screens 2x; acts-first 1.5x; field bonuses.",
	},
	uncheckedassault: {
		name: "Unchecked Assault",
		desc: "This Pokemon has Scrappy, Technician, Opportunist, and Limber's effects.",
		shortDesc: "Scrappy + Technician + Opportunist + Limber.",
	},
	unleashedego: {
		name: "Unleashed Ego",
		desc: "This Pokemon has Ultra Ego, Levitate, and Raging Storm's effects.",
		shortDesc: "Ultra Ego + Levitate + Raging Storm.",
	},
	vanguard: {
		name: "Vanguard",
		desc: "This Pokemon has Intimidate built in. Extreme Speed has 1.5x power and becomes Fire-type if Fire would deal more damage. After Extreme Speed, this Pokemon takes 0.25x damage from attacks for the rest of the turn. Its next Extreme Speed is guaranteed to crit after its one-time Endure activates. Opposing Pokemon cannot lower its stats, and non-move damage cannot affect it. Once per battle, it survives a direct-move KO at 1 HP.",
		shortDesc: "Intimidate; Extreme Speed 1.5x; post-ES 0.25x damage; one-time 1 HP Endure.",
	},
	vendetta: {
		name: "Vendetta",
		desc: "This Pokemon has Anger Point, Second Wind, and Self Sufficient's effects.",
		shortDesc: "Anger Point + Second Wind + Self Sufficient.",
	},
	venombastion: {
		name: "Venom Bastion",
		desc: "This Pokemon has Stamina's effect: when hit by an opposing attack, its Defense rises by 1 stage once per turn and it restores 1/16 max HP. Its Bug-type moves have 1.5x power.",
		shortDesc: "Stamina + Bug moves 1.5x; hit: +1 Def once/turn and heals 1/16.",
	},
	venomarmor: {
		name: "Venom Armor",
		desc: "On switch-in, this Pokemon becomes poisoned if it has no status, even if it is Steel-type. This Pokemon has Poison Heal and Dual Wield's effects. While poisoned, its physical damage is multiplied by 1.3. Metal Claw has 1.5x power.",
		shortDesc: "Self-poisons on switch-in; Poison Heal + Dual Wield; poisoned physical damage 1.3x; Metal Claw 1.5x.",
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
	dreamsickness: {
		name: "Dream Sickness",
		desc: "This Pokemon has Telepathy and Sworn Duty. Its stats cannot be lowered, and its allies' Speed cannot be lowered. At the end of each turn, this Pokemon and its allies restore 1/16 max HP. If an opposing attack would knock out an ally while this Pokemon is above 25% HP, this Pokemon takes the damage instead. Once per switch-in, an ally at 25% HP or lower heals 1/4 max HP, is cured of status, and is sheltered through the next turn.",
		shortDesc: "Telepathy + Sworn Duty; heals and protects allies.",
	},
	voidveil: {
		name: "Void Veil",
		desc: "Levitate + Friend Guard + Insomnia. Each turn heals itself and allies by 1/16 max HP. Once per entry, an ally at 25% HP or less before healing gets another 1/4 max HP heal, a status cure, and Dream Sickness shelter.",
		shortDesc: "Levitate + Friend Guard + Insomnia; Dream Sickness healing.",
	},
	knightsguard: {
		name: "Knight's Guard",
		desc: "This Pokemon has Sworn Duty, Justified, and Steadfast's effects.",
		shortDesc: "Sworn Duty + Justified + Steadfast.",
	},
	warpath: {
		name: "War Path",
		desc: "This Pokemon has Overcoat's immunity to powder, Hail, and Sandstorm. Its Attack is 1.5x while statused. Its Rock-, Fighting-, and Ground-type moves ignore Reflect, Light Screen, Aurora Veil, and defensive boosts. It cannot flinch and ignores stat increases.",
		shortDesc: "Overcoat; status Atk 1.5x; Rock/Fighting/Ground ignore screens/boosts; no flinch.",
	},
	warship: {
		name: "War Ship",
		desc: "This Pokemon has Swift Swim, Unaware, Solid Rock, and Strong Jaw's effects. In rain, its Speed is doubled, it ignores opposing stat boosts, takes reduced damage from attacks, and bite-based moves have 1.5x power.",
		shortDesc: "Swift Swim + Unaware + Solid Rock + Strong Jaw.",
	},
	wastingsurge: {
		name: "Wasting Surge",
		desc: "On switch-in, this Pokemon sets Wasteland Terrain. On Water Surface or Underwater, it creates Murkwater Surface instead; from Underwater, non-Poison and non-Steel Pokemon that are not semi-invulnerable faint. If Neutralization is active on Water Surface or Underwater, this effect fails. This Pokemon also has Byxbysion Touch's effects.",
		shortDesc: "Sets Wasteland/Murkwater; Underwater KOs non-Poison/Steel; Byxbysion Touch.",
	},
	waterbarrage: {
		name: "Water Barrage",
		desc: "This Pokemon has Proficient and Dual Wield's effects. At the end of each turn, opposing Pokemon take cycling Water damage of 1/16, 2/16, then 3/16 max HP, scaled by effectiveness and blocked by Water immunities.",
		shortDesc: "Proficient + Dual Wield; cycling Water chip respects effectiveness and immunities.",
	},
	webassassin: {
		name: "Web Assassin",
		desc: "This Pokemon's Speed is doubled and cannot be lowered. This Pokemon has Sniper's effect. Its attacks are always critical hits against targets that are poisoned or have lowered Speed.",
		shortDesc: "Speed doubled and cannot drop; Sniper; always crits poisoned or Speed-lowered targets.",
	},
	wickedsnare: {
		name: "Wicked Snare",
		desc: "This Pokemon has Stakeout, Tangling Hair, and Prankster's effects.",
		shortDesc: "Stakeout + Tangling Hair + Prankster.",
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
		shortDesc: "No freeze; field +Def/SpD; halves Water/Ice; Dragon's Den absorbs Fire.",
	},
	megalauncher: {
		name: 'Mega Launcher',
		desc: 'Pulse and bullet moves have 1.5x power.',
		shortDesc: 'Pulse and bullet moves have 1.5x power.',
	},
	heavyartillery: {
		name: 'Heavy Artillery',
		desc: 'Damaging pulse and bullet moves have 2x power, hit both opposing Pokemon in Doubles and all opponents at full power in Free-for-All, and lower the user\'s Defense and Special Defense by 1 after use. Also has Unaware and Shell Armor.',
		shortDesc: 'Damaging pulse/bullet moves 2x; spread in Doubles, full power in FFA; lowers Def/SpD; Unaware + Shell Armor.',
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
		desc: '+1 Accuracy on entry; critical hits deal 2.25x damage.',
		shortDesc: '+1 Accuracy on entry; critical hits deal 2.25x damage.',
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
		desc: "Its same-type attacks have 1.2x power (Proficient). This Pokemon has Bulletproof, Dauntless Shield, and Self Repair's effects. It gains 1 Defense stage on entry, plus 1 Special Defense stage in Cold Eclipse, New World, Starlight Arena, or Fairy Tale. It is immune to bullet and pulse moves and restores HP through Self Repair.",
		shortDesc: "Proficient + Bulletproof + Dauntless Shield + Self Repair; boosted fields also give +1 SpD.",
	},
	ragingfists: {
		name: "Raging Fists",
		desc: "This Pokemon has Hydra Bond, Fighting Fiend, and Scrappy's effects.",
		shortDesc: "Hydra Bond + Fighting Fiend + Scrappy.",
	},
	imperialmandate: {
		name: "Imperial Mandate",
		desc: "Outside boosted fields: at 50% HP or higher, attacks have 2.4x power; below 50%, attacks have 1.2x power and Speed is doubled. Takes 20% less attack damage outside boosted fields. On Fairy Tale, Chessboard, New World, Starlight Arena, and Cold Eclipse: at 50% HP or higher, grants +1 Defense and Special Defense with no attack boost; below 50%, removes its granted defense stages and grants 1.5x attack power and double Speed. Field defense stages do not stack and are removed on leaving these fields.",
		shortDesc: "Boosted fields: high HP +1 Def/SpD; low HP 1.5x power, 2x Speed.",
	},
	phantombarrage: {
		name: "Phantom Barrage",
		desc: "This Pokemon has Infiltrator, Levitate, and Hydra Bond's effects. Dragon Darts and G-Max Spirit Volley use this Pokemon's higher offensive stat. In Free-for-All battles, Dragon Darts and G-Max Spirit Volley hit all opposing Pokemon twice.",
		shortDesc: "Infiltrator + Levitate + Hydra Bond; higher offensive stat for signature attacks.",
	},
	atrocity: {
		name: "Atrocity",
		desc: "This Ability cannot be suppressed and has Wildfire Core, Self Sufficient, and Mold Breaker's effects. This Pokemon's damaging moves have 1.3x power, +1 critical hit ratio, ignore Abilities, ignore defensive stat boosts, and bypass Substitute, Reflect, Light Screen, and Aurora Veil. Its Defense and Special Defense are 1.3x. Each damaging hit restores 1/4 of the damage dealt, with no per-hit cap. In Cold Eclipse, its damaging moves gain another 1.3x boost, and its Defense and Special Defense become 1.5x.",
		shortDesc: "Wildfire Core + Self Sufficient + Mold Breaker; damaging hits heal 1/4 damage.",
	},
	ultraego: {
		name: "Ultra Ego",
		desc: "Moves ignore abilities; it heals after combat. KOs heal more, and the first enemy hit boosts Attack and Sp. Atk. Bewitched Woods, Haunted, and Holy Field disable these effects.",
		shortDesc: "Mold Breaker; combat healing and boosts; inactive in Bewitched/Haunted/Holy.",
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
	rebornflower: {
		name: 'Reborn Flower',
		desc: 'This Pokemon has Invigorate and Flower Veil\'s effects. It permanently becomes Florges-Reborn when it enters battle.',
		shortDesc: 'Invigorate + Flower Veil; permanently becomes Florges-Reborn on entry.',
	},
};

const CUSTOM_MOVE_UPDATES: {[id: string]: AnyObject} = {
	gmaxsyrupfall: {
		num: 1000,
		accuracy: true,
		basePower: 120,
		category: 'Special',
		isMax: 'Dipplin',
		isNonstandard: 'Gigantamax',
		name: 'G-Max Syrupfall',
		pp: 5,
		priority: 0,
		flags: {},
		target: 'allAdjacentFoes',
		type: 'Grass',
		desc: "This 120 BP Special move deals damage and applies Syrup Bomb's syrup effect to all opposing Pokemon for 4 turns.",
		shortDesc: '120 BP Special; all foes get Syrup for 4 turns.',
	},
	// Keep this standard move usable if a stale generated move catalog is loaded.
	meteorbeam: {
		num: 800,
		accuracy: 90,
		basePower: 120,
		category: 'Special',
		name: 'Meteor Beam',
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1, metronome: 1},
		target: 'normal',
		type: 'Rock',
		desc: 'This attack charges on the first turn and executes on the second. Raises the user\'s Special Attack by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.',
		shortDesc: 'Raises user\'s Sp. Atk by 1 on turn 1. Hits turn 2.',
	},
	crosspoison: {
		basePower: 85,
		secondary: {chance: 30, status: 'psn'},
	},
	radiantassault: {
		num: 10005,
		name: 'Radiant Assault',
		type: '???',
		category: 'Physical',
		basePower: 110,
		accuracy: 100,
		pp: 10,
		target: 'allAdjacentFoes',
		flags: {contact: 1, recharge: 1, protect: 1, mirror: 1, metronome: 1},
		desc: "Hits all opposing Pokemon. Uses the user's higher offensive stat, including stat stages and field modifiers. The user must recharge unless this move knocks out at least one target.",
		shortDesc: '110 BP; hits all foes; uses higher offense; recharges unless it gets a KO.',
	},
	armthrust: {
		multihit: [2, 5],
		desc: 'Hits two to five times. Skill Link makes it hit five times.',
		shortDesc: 'Hits 2-5 times.',
	},
	aurorabeam: {
		basePower: 80,
		flags: {protect: 1, mirror: 1, metronome: 1, pulse: 1},
		desc: "Has a 10% chance to lower the target's Attack by 1 stage. Boosted by Mega Launcher and Dual Wield.",
		shortDesc: "10% chance to lower Attack. Boosted by Mega Launcher and Dual Wield.",
	},
	arenitewall: {
		desc: "For 5 turns, the user's side takes half damage from super-effective attacks. Its duration is 8 turns when extended by Sand Sovereign, Light Clay, or the field. Critical hits and moves that bypass screens ignore it.",
		shortDesc: "5 turns; side takes 0.5x from super-effective hits; may last 8.",
	},
	astonish: {
		basePower: 40,
		pp: 10,
		priority: 3,
		secondary: {chance: 100, volatileStatus: 'flinch'},
		desc: "Has a 100% chance to make the target flinch. Fails unless it is the user's first turn on the field.",
		shortDesc: "Ghost-type Fake Out. First turn out only; 100% flinch.",
	},
	radiantclaw: {
		basePower: 120,
		accuracy: 100,
		pp: 15,
		critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1},
		recoil: [1, 4],
		desc: 'A 120-power Fairy-type slicing move with a high critical-hit ratio. Makes contact and deals one quarter of its normal recoil to the user.',
		shortDesc: '120 BP; slicing; high crit; 1/4 recoil; contact.',
	},
	hexingslash: {
		basePower: 90,
		accuracy: 100,
		pp: 15,
		critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1},
		drain: [1, 2],
		desc: "A 90-power Ghost-type physical slicing move with a high critical-hit ratio. It uses the user's higher offensive stat, has a 30% chance to poison, makes contact, and restores half the damage dealt to the user.",
		shortDesc: '90 BP; higher offense; slicing; high crit; 30% poison; drains 1/2 damage.',
	},
	etherealtempest: {
		basePower: 100,
		accuracy: 100,
		pp: 15,
		secondaries: [
			{chance: 30, status: 'par'},
			{chance: 10, volatileStatus: 'flinch'},
		],
		desc: 'A 100-power Flying-type special move with a 30% chance to paralyze and a 10% chance to flinch the target. It is 1.5x in Volcanic Terrain, Mountain, and Snowy Mountain, and 0.5x in Cave.',
		shortDesc: '100 BP; 30% paralysis; 10% flinch; field-modified.',
	},
	reflecttype: {
		desc: "User becomes the target's types. Reflector instead refreshes its copied types without replacing its original typing.",
		shortDesc: "Copies the target's types; Reflector refreshes copied types without replacing its typing.",
	},
	mirrorbeam: {
		name: 'Mirror Beam',
		basePower: 90,
		accuracy: 100,
		pp: 10,
		category: 'Special',
		type: 'Steel',
		target: 'normal',
		desc: "Uses the best damage type from Steel and the user's reflected types; field boosts apply.",
		shortDesc: '90 BP; best Steel/reflected type; field boosts.',
	},
	cauterize: {
		name: 'Cauterize',
		basePower: 90,
		accuracy: 100,
		pp: 15,
		category: 'Special',
		type: 'Fire',
		target: 'normal',
		desc: "Deals Fire-type damage to foes. When used on an ally, it deals no damage and restores 50% of that ally's maximum HP.",
		shortDesc: 'Fire damage; heals an ally for 50% max HP instead.',
	},
	searingvoid: {
		basePower: 40,
		accuracy: 100,
		category: 'Special',
		name: 'Searing Void',
		pp: 10,
		target: 'allAdjacent',
		type: '???',
		desc: 'Hits all active Pokemon except the user and burns each target.',
		shortDesc: '40 BP; burns all active Pokemon except the user.',
	},
	veeveevolley: {
		desc: "Power is based on the user's happiness and uses the higher of Attack or Special Attack.",
		shortDesc: 'Max happiness: 102 power; uses higher Atk or SpA; cannot miss.',
	},
	punchypummel: {
		name: 'Punchy Pummel',
		basePower: 90,
		accuracy: 95,
		pp: 10,
		category: 'Physical',
		type: 'Fighting',
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		desc: "Lowers the target's Defense and Speed by 1 stage after a successful hit.",
		shortDesc: 'Lowers Defense and Speed by 1 after a successful hit.',
	},
	twirlytwister: {
		name: 'Twirly Twister',
		basePower: 80,
		accuracy: 95,
		pp: 10,
		category: 'Special',
		type: 'Flying',
		flags: {protect: 1, mirror: 1, metronome: 1, wind: 1},
		desc: 'After a successful hit, removes entry hazards from both sides and all active Substitutes.',
		shortDesc: 'After hitting, clears hazards and active Substitutes.',
	},
	rockyrampage: {
		name: 'Rocky Rampage',
		basePower: 85,
		accuracy: 100,
		pp: 10,
		category: 'Physical',
		type: 'Rock',
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		desc: "After a successful hit, sets Stealth Rock on the target's side if it is not already active.",
		shortDesc: 'After hitting, sets Stealth Rock on the target side.',
	},
	dustydrift: {
		name: 'Dusty Drift',
		basePower: 80,
		accuracy: 95,
		pp: 10,
		category: 'Physical',
		type: 'Ground',
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		desc: 'After a successful hit, starts Sandstorm if it is not already active. Sandstorm may last 8 turns.',
		shortDesc: 'After hitting, starts Sandstorm; may last 8 turns.',
	},
	steelystrike: {
		name: 'Steely Strike',
		basePower: 75,
		accuracy: 100,
		pp: 10,
		category: 'Physical',
		type: 'Steel',
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1},
		desc: "Ignores and removes Reflect, Light Screen, Aurora Veil, and Arenite Wall from the target's side. 1.5x power in Fairy Tale Field.",
		shortDesc: 'Removes screens and Arenite Wall; 1.5x in Fairy Tale.',
	},
	stabbyswarm: {
		name: 'Stabby Swarm',
		basePower: 75,
		accuracy: 100,
		pp: 20,
		category: 'Physical',
		type: 'Bug',
		flags: {protect: 1, mirror: 1, metronome: 1},
		target: 'allAdjacentFoes',
		desc: 'Traps opposing Pokemon for 4-5 turns and damages them each turn. In Forest Field, power is 1.5x and Defense falls by 1. Grip Claw extends the trap to 7 turns.',
		shortDesc: 'Traps foes; 1.5x and -1 Def in Forest; Grip Claw extends it.',
	},
	ickyinjection: {
		name: 'Icky Injection',
		basePower: 100,
		accuracy: 95,
		pp: 10,
		category: 'Physical',
		type: 'Poison',
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		desc: 'Poisons the target. Badly poisons in Corrosive, Corrosive Mist, Murkwater Surface, and Wasteland fields.',
		shortDesc: 'Poisons; badly poisons in toxic fields.',
	},
	spookyspell: {
		name: 'Spooky Spell',
		basePower: 60,
		accuracy: 100,
		pp: 10,
		category: 'Special',
		type: 'Ghost',
		flags: {protect: 1, mirror: 1, metronome: 1},
		desc: 'Applies Curse to the damaged target if it is not already cursed.',
		shortDesc: 'Damaging a target applies Curse.',
	},
	scalyscorn: {
		name: 'Scaly Scorn',
		basePower: 75,
		accuracy: 100,
		pp: 15,
		category: 'Special',
		type: 'Dragon',
		flags: {protect: 1, mirror: 1, metronome: 1},
		desc: "Raises the user's Special Attack by 1 stage after a successful hit, or by 2 in Dragon's Den or Fairy Tale Field.",
		shortDesc: "After hitting, raises Sp. Atk by 1; +2 in Dragon's Den/Fairy Tale.",
	},
	glitchygraphics: {
		name: 'Glitchy Graphics',
		basePower: 0,
		accuracy: true,
		pp: 10,
		category: 'Status',
		type: '???',
		flags: {metronome: 1},
		desc: 'Creates Glitch Field for 5 turns. If Glitch Field is active, randomizes each opposing active Pokemon type.',
		shortDesc: 'Creates Glitch Field; while active, randomizes opposing types.',
	},
	beatup: {
		basePower: 30,
		multihit: [2, 6],
		desc: 'Hits two to six times. Each hit has 30 base power.',
		shortDesc: 'Hits 2-6 times. Each hit has 30 power.',
	},
	barrage: {
		multihit: [2, 5],
		desc: "Hits two to five times, uses the user's higher attacking stat, and has a 20% chance per hit to lower Special Defense. A five-hit use crits on the last hit.",
		shortDesc: 'Hits 2-5; higher Atk/SpA; 20% -SpD per hit; 5 hits crit last.',
	},
	bulletseed: {
		multihit: [2, 5],
		desc: 'Hits two to five times. Skill Link makes it hit five times.',
		shortDesc: 'Hits 2-5 times.',
	},
	cut: {
		basePower: 60,
		desc: 'A 60 Base Power physical Normal-type move.',
		shortDesc: '60 BP physical Normal move.',
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
		category: 'Physical',
		type: 'Steel',
		multihit: 6,
		desc: "A 30 Base Power physical Steel-type attack that hits exactly six times. It uses whichever is higher, the user's Attack or Special Attack, against whichever is lower, the target's Defense or Special Defense.",
		shortDesc: '30 BP physical Steel; hits 6 times; higher Atk/SpA vs lower Def/SpD.',
	},
	skullbash: {
		desc: "Charges for one turn, raising Attack, Defense, and Special Defense by 1. While charging, damage taken is reduced to 0.8x. The attack fires at normal priority and heals 1/10 max HP on a successful hit.",
		shortDesc: "Charge: +Atk/Def/SpD, 0.8x damage taken. Hit heals 1/10.",
	},
	watershuriken: {
		basePower: 20,
		multihit: [2, 6],
		critRatio: 2,
		desc: '20 BP, +1 priority, high critical-hit ratio, and hits 2-6 times. Shadow Current: 90 BP first hit, then 1-4 hits at 20 BP, or 2-5 follow-ups in FFA; all crit. Ash-Greninja: 30 BP, exactly 3 hits, all crit.',
		shortDesc: '+1 priority. 20 BP, high crit, hits 2-6. Greninja forms have special patterns.',
	},
	crosspoison: {
		desc: "Has a high critical hit ratio and a 30% chance to poison the target. If the target is poisoned or badly poisoned, this move ignores the target's positive Defense boosts.",
		shortDesc: "High crit. 30% poison; ignores positive Def boosts vs poisoned targets.",
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
		desc: 'A 60 Base Power Psychic-type move that hits all adjacent foes at full power.',
		shortDesc: '60 BP Psychic; hits adjacent foes at full power.',
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
		accuracy: 95,
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
		desc: 'Hits two to five times. Skill Link makes it hit five times.',
		shortDesc: 'Hits 2-5 times.',
	},
	iciclespear: {
		multihit: [2, 5],
		desc: 'Hits two to five times. Skill Link makes it hit five times.',
		shortDesc: 'Hits 2-5 times.',
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
		desc: 'Hits two to five times. Skill Link makes it hit five times.',
		shortDesc: 'Hits 2-5 times.',
	},
	scaleshot: {
		multihit: [2, 5],
		desc: "Hits two to five times. After the last hit, the user's Defense falls by 1 and Speed rises by 1.",
		shortDesc: 'Hits 2-5; user -1 Def and +1 Spe after the last hit.',
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
		desc: 'Hits two to five times. Skill Link makes it hit five times.',
		shortDesc: 'Hits 2-5 times.',
	},
	supercellslam: {
		name: 'Supercell Slam',
		basePower: 120,
		desc: 'A 120 Base Power Electric-type move. If it misses, the user loses half its maximum HP.',
		shortDesc: '120 BP; user loses half max HP if it misses.',
	},
	volttackle: {
		name: 'Volt Tackle',
		basePower: 140,
		desc: 'A 140 Base Power Electric-type move that causes recoil damage to the user.',
		shortDesc: '140 BP; recoil damage.',
	},
	wildcharge: {
		name: 'Wild Charge',
		basePower: 120,
		desc: 'A 120 Base Power Electric-type move that causes recoil damage to the user.',
		shortDesc: '120 BP; recoil damage.',
	},
	focuspunch: {
		desc: 'If the user is hit by a damaging move before it moves, this move\'s power is reduced to 50. It bypasses Protect at full power.',
		shortDesc: '50 BP if interrupted; bypasses Protect at full power.',
	},
	foresight: {
		desc: "Ignores the target's positive Evasion and lets Normal- and Fighting-type attacks hit Ghost types. The user takes half damage from Ghost-type attacks until it switches out.",
		shortDesc: 'Normal/Fighting hit Ghost; ignores Evasion; user resists Ghost.',
	},
	gravity: {
		desc: 'For 5 turns, all Pokemon are grounded, move accuracy is raised, and certain airborne moves cannot be used.',
		shortDesc: '5 turns: no Ground immunities; 1.67x accuracy.',
	},
	miracleeye: {
		desc: "Ignores the target's positive Evasion and lets Psychic-type attacks hit Dark types. The user takes half damage from Ghost-type attacks until it switches out. On Psychic Terrain, Fairy Tale, or Holy Field, the user gains +2 Special Attack.",
		shortDesc: 'Psychic hits Dark; ignores Evasion; user resists Ghost; field +2 SpA.',
	},
	mudslap: {
		desc: 'A 25 Base Power special Ground-type move with 95% accuracy that hits two to five times. On Murkwater Surface, it becomes Water type.',
		shortDesc: '25 BP special Ground; hits 2-5; Water on Murkwater Surface.',
	},
	odorsleuth: {
		desc: "Ignores the target's positive Evasion and lets Normal- and Fighting-type attacks hit Ghost types. The user takes half damage from Ghost-type attacks until it switches out.",
		shortDesc: 'Normal/Fighting hit Ghost; ignores Evasion; user resists Ghost.',
	},
	rockwrecker: {
		desc: 'If this move fails to KO its target, it has a 60% chance to paralyze the target. If successful, the user must recharge on the following turn.',
		shortDesc: 'If it fails to KO, 60% chance to paralyze; user must recharge.',
	},
	triplearrows: {
		desc: 'Has a 50% chance to lower Defense, a 30% chance to flinch, and a raised critical-hit ratio. Each use raises the user\'s side critical-hit ratio by 1.',
		shortDesc: 'High crit; 50% -1 Def; 30% flinch; +1 side crit per use.',
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
	gmaxdeathroll: {
		num: 1000,
		accuracy: true,
		basePower: 140,
		category: 'Physical',
		isNonstandard: 'Gigantamax',
		name: 'G-Max Death Roll',
		pp: 5,
		priority: 0,
		flags: {contact: 1},
		isMax: 'Feraligatr',
		onModifyMove(move: AnyObject) {
			move.category = 'Physical';
		},
		secondaries: [{chance: 30, volatileStatus: 'flinch'}],
		target: 'allAdjacentFoes',
		type: 'Dark',
		desc: 'Always hits and has a 30% chance to make each opposing Pokemon flinch.',
		shortDesc: '140 BP; always hits; 30% chance to flinch each foe.',
	},
};

const CUSTOM_LEARNSET_REPLACEMENTS: {[id: string]: {[id: string]: string[]}} = {
	bronzong: {
		flash: ['9L1'], nightshade: ['9L1'], mirrorshot: ['9L1'], magiccoat: ['9L1'],
		mimic: ['9L1'], signalbeam: ['9L1'], reflecttype: ['9L1'], mefirst: ['9L1'],
		flashcannon: ['9L1'], healblock: ['9L1'], mirrorcoat: ['9L1'], synchronoise: ['9L1'],
		afteryou: ['9M'], assurance: ['9M'], aurasphere: ['9M'], darkpulse: ['9M'],
		dazzlinggleam: ['9M'], eerieimpulse: ['9M'], icebeam: ['9M'], magicroom: ['9M'],
		magicalleaf: ['9M'], mysticalfire: ['9M'], rocksmash: ['9M'], roleplay: ['9M'],
		selfdestruct: ['9M'], shockwave: ['9M'], snatch: ['9M'], terrainpulse: ['9M'],
		thunderwave: ['9M'], thunderbolt: ['9M'], torment: ['9M'], triattack: ['9M'],
		waterpulse: ['9M'], snowscape: ['9M'], mirrorbeam: ['9M'],
	},
	toxtricityaevian: {
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
		snatch: ['9M'],
		cosmicpower: ['9M'],
		drainpunch: ['9M'],
		nightmare: ['9M'],
		assist: ['9M'],
		powertrip: ['9M'],
		storedpower: ['9M'],
		teleport: ['9M'],
		meditate: ['9M'],
		hypnosis: ['9M'],
		poisongas: ['9M'],
		smog: ['9M'],
		clearsmog: ['9M'],
		flatter: ['9M'],
		allyswitch: ['9M'],
		quash: ['9M'],
		dreameater: ['9M'],
		entrainment: ['9M'],
		futuresight: ['9M'],
		instruct: ['9M'],
		barrier: ['9M'],
		encore: ['9M'],
		aurasphere: ['9M'],
		focusblast: ['9M'],
		eeriespell: ['9M'],
		confuseray: ['9M'],
		lightscreen: ['9M'],
		reflect: ['9M'],
		helpinghand: ['9M'],
		nastyplot: ['9M'],
		nightshade: ['9M'],
		protect: ['9M'],
		psybeam: ['9M'],
		psychic: ['9M'],
		psychicnoise: ['9M'],
		psychicterrain: ['9M'],
		rest: ['9M'],
		sleeptalk: ['9M'],
		secretpower: ['9M'],
		seismictoss: ['9M'],
		shadowball: ['9M'],
		skillswap: ['9M'],
		spotlight: ['9M'],
		substitute: ['9M'],
		taunt: ['9M'],
		topsyturvy: ['9M'],
		torment: ['9M'],
		toxic: ['9M'],
		trickroom: ['9M'],
		zenheadbutt: ['9M'],
	},
	sneasleraevian: {
		radiantclaw: ['9L1'],
		calmmind: ['9L1'],
		drainingkiss: ['9L1'],
		direclaw: ['9L1'],
		fling: ['9L1'],
		scratch: ['9L1'],
		leer: ['9L1'],
		fairywind: ['9L1'],
		taunt: ['9L1'],
		quickattack: ['9L1'],
		metalclaw: ['9L1'],
		spiritbreak: ['9L1'],
		brickbreak: ['9L1'],
		honeclaws: ['9L1', '9M'],
		acrobatics: ['9L1'],
		agility: ['9L1'],
		screech: ['9L1', '9M'],
		closecombat: ['9L1'],
		aerialace: ['9M'],
		afteryou: ['9M'],
		aircutter: ['9M'],
		airslash: ['9M'],
		allyswitch: ['9M'],
		assurance: ['9M'],
		aurasphere: ['9M'],
		bulkup: ['9M'],
		charm: ['9M'],
		chillingwater: ['9M'],
		coaching: ['9M'],
		cut: ['9M'],
		dazzlinggleam: ['9M'],
		dig: ['9M'],
		disarmingvoice: ['9M'],
		doubleedge: ['9M'],
		drainpunch: ['9M'],
		encore: ['9M'],
		endeavor: ['9M'],
		falseswipe: ['9M'],
		featherdance: ['9M'],
		flash: ['9M'],
		focusblast: ['9M'],
		focusenergy: ['9M'],
		focuspunch: ['9M'],
		gigaimpact: ['9M'],
		gunkshot: ['9M'],
		healbell: ['9M'],
		helpinghand: ['9M'],
		hyperbeam: ['9M'],
		icepunch: ['9M'],
		knockoff: ['9M'],
		laserfocus: ['9M'],
		lowkick: ['9M'],
		lowsweep: ['9M'],
		magiccoat: ['9M'],
		megakick: ['9M'],
		megapunch: ['9M'],
		payday: ['9M'],
		playrough: ['9M'],
		poweruppunch: ['9M'],
		psychic: ['9M'],
		psychocut: ['9M'],
		raindance: ['9M'],
		reflect: ['9M'],
		retaliate: ['9M'],
		reversal: ['9M'],
		rockslide: ['9M'],
		rocksmash: ['9M'],
		shadowclaw: ['9M'],
		stoneedge: ['9M'],
		strength: ['9M'],
		sunnyday: ['9M'],
		superpower: ['9M'],
		surf: ['9M'],
		swordsdance: ['9M'],
		throatchop: ['9M'],
		thunderpunch: ['9M'],
		trailblaze: ['9M'],
		tripleaxel: ['9M'],
		waterpulse: ['9M'],
		whirlpool: ['9M'],
		xscissor: ['9M'],
		slash: ['9M'],
		fakeout: ['9M'],
		feint: ['9M'],
		quickguard: ['9M'],
		switcheroo: ['9M'],
		mefirst: ['9M'],
	},
	mismagiusaevian: {
		growl: ['9L1'],
		vinewhip: ['9L1'],
		poisonpowder: ['9L1'],
		astonish: ['9L1'],
		hexingslash: ['9L1'],
		leafblade: ['9L1', '9M'],
		poisonjab: ['9L1', '9M'],
		powergem: ['9L1', '9M'],
		phantomforce: ['9L1', '9M'],
		luckychant: ['9L1'],
		magicalleaf: ['9L1', '9M'],
		acrobatics: ['9M'],
		aerialace: ['9M'],
		allyswitch: ['9M'],
		batonpass: ['9M'],
		bind: ['9M'],
		bulletseed: ['9M'],
		crosspoison: ['9M'],
		cut: ['9M'],
		drainingkiss: ['9M'],
		echoedvoice: ['9M'],
		embargo: ['9M'],
		energyball: ['9M'],
		futuresight: ['9M'],
		gastroacid: ['9M'],
		gigadrain: ['9M'],
		gigaimpact: ['9M'],
		grassknot: ['9M'],
		grassyglide: ['9M'],
		grassyterrain: ['9M'],
		gunkshot: ['9M'],
		healbell: ['9M'],
		hex: ['9M'],
		honeclaws: ['9M'],
		hyperbeam: ['9M'],
		hypervoice: ['9M'],
		infestation: ['9M'],
		knockoff: ['9M'],
		laserfocus: ['9M'],
		leafstorm: ['9M'],
		leechlife: ['9M'],
		magicroom: ['9M'],
		nastyplot: ['9M'],
		naturepower: ['9M'],
		painsplit: ['9M'],
		pinmissile: ['9M'],
		poltergeist: ['9M'],
		psychup: ['9M'],
		quash: ['9M'],
		raindance: ['9M'],
		rocktomb: ['9M'],
		scaryface: ['9M'],
		screech: ['9M'],
		seedbomb: ['9M'],
		shadowball: ['9M'],
		shadowclaw: ['9M'],
		skillswap: ['9M'],
		sludgewave: ['9M'],
		smackdown: ['9M'],
		snatch: ['9M'],
		solarbeam: ['9M'],
		solarblade: ['9M'],
		spikes: ['9M'],
		spite: ['9M'],
		strength: ['9M'],
		suckerpunch: ['9M'],
		sunnyday: ['9M'],
		swordsdance: ['9M'],
		synthesis: ['9M'],
		taunt: ['9M'],
		throatchop: ['9M'],
		toxicspikes: ['9M'],
		trick: ['9M'],
		uproar: ['9M'],
		venomdrench: ['9M'],
		venoshock: ['9M'],
		waterpulse: ['9M'],
		willowisp: ['9M'],
		wonderroom: ['9M'],
		workup: ['9M'],
		worryseed: ['9M'],
		xscissor: ['9M'],
	},
	volcaronaaevian: {
		quiverdance: ['9L1'], gust: ['9L1'], leer: ['9L1'], twister: ['9L1'], takedown: ['9L1'],
		airslash: ['9L1', '9E', '9M'], whirlwind: ['9L1'], roost: ['9L1', '9E', '9M'],
		psychic: ['9L1', '9M'], courtchange: ['9L1', '9E', '9M'], aurasphere: ['9L1', '9E', '9M'],
		hurricane: ['9L1', '9E', '9M'], etherealtempest: ['9L1', '9M'], aerialace: ['9E', '9M'],
		psybeam: ['9E'], doubleedge: ['9E'], acrobatics: ['9E', '9M'], zenheadbutt: ['9E', '9M'],
		barrier: ['9E'], thrash: ['9E'], skyattack: ['9E', '9M'], ancientpower: ['9E'], foresight: ['9E'],
		healblock: ['9E'], imprison: ['9E'], morningsun: ['9E'], agility: ['9M'], allyswitch: ['9M'],
		bodyslam: ['9M'], bounce: ['9M'], bugbite: ['9M'], calmmind: ['9M'], cosmicpower: ['9M'],
		dazzlinggleam: ['9M'], defog: ['9M'], dig: ['9M'], dragonpulse: ['9M'], dreameater: ['9M'],
		dualwingbeat: ['9M'], echoedvoice: ['9M'], electroweb: ['9M'], flamethrower: ['9M'], flash: ['9M'],
		fly: ['9M'], focusblast: ['9M'], focusenergy: ['9M'], futuresight: ['9M'], gigaimpact: ['9M'],
		heatwave: ['9M'], helpinghand: ['9M'], hyperbeam: ['9M'], icebeam: ['9M'], icywind: ['9M'],
		infestation: ['9M'], leechlife: ['9M'], lightscreen: ['9M'], magicalleaf: ['9M'], magiccoat: ['9M'],
		mysticalfire: ['9M'], psychup: ['9M'], psyshock: ['9M'], raindance: ['9M'], reflect: ['9M'],
		safeguard: ['9M'], scaryface: ['9M'], screech: ['9M'], shockwave: ['9M'], signalbeam: ['9M'],
		skillswap: ['9M'], skydrop: ['9M'], steelwing: ['9M'], strength: ['9M'], strugglebug: ['9M'],
		sunnyday: ['9M'], tailwind: ['9M'], thunder: ['9M'], thunderbolt: ['9M'], thunderwave: ['9M'],
		uturn: ['9M'], waterpulse: ['9M'], weatherball: ['9M'], wildcharge: ['9M'], snowscape: ['9M'],
		ragepowder: ['9M'], fireblast: ['9M'], blizzard: ['9M'],
	},
};
const CUSTOM_LEARNSET_ADDITIONS: {[id: string]: {[id: string]: string[]}} = {
	lilligant: {
		shadowball: ['9M'], fierydance: ['9M'], aurasphere: ['9M'], flowertrick: ['9M'], axekick: ['9M'], petalblizzard: ['9M'],
	},
	lilliganthisui: {
		shadowball: ['9M'], fierydance: ['9M'], aurasphere: ['9M'], flowertrick: ['9M'], axekick: ['9M'], petalblizzard: ['9M'],
	},
	furfrou: {
		tailslap: ['9M'], nuzzle: ['9M'], volttackle: ['9M'], heartstamp: ['9M'], psyshieldbash: ['9M'], shadowbone: ['9M'],
		destinybond: ['9M'], direclaw: ['9M'], gunkshot: ['9M'], jawlock: ['9M'], knockoff: ['9M'], brickbreak: ['9M'],
		highjumpkick: ['9M'], aquatail: ['9M'], wavecrash: ['9M'], spiritbreak: ['9M'], playrough: ['9M'], stoneedge: ['9M'],
		diamondstorm: ['9M'],
	},
	tsareena: {
		acrobatics: ['9M'], knockoff: ['9M'], skullbash: ['9M'], moonlight: ['9M'], spikes: ['9M'], taunt: ['9M'], thunderouskick: ['9M'],
	},
	florges: {
		tackle: ['9M'], ember: ['9M'], fairywind: ['9M'], flamewheel: ['9M'], incinerate: ['9M'], mysticalfire: ['9M'],
		morningsun: ['9M'], cauterize: ['9M'],
	},
	florgesreborn: {
		tackle: ['9M'], ember: ['9M'], fairywind: ['9M'], flamewheel: ['9M'], wish: ['9M'], incinerate: ['9M'],
		sunnyday: ['9M'], mysticalfire: ['9M'], morningsun: ['9M'], cauterize: ['9M'], revivalblessing: ['9M'],
	},
	crawdaunt: {
		icehammer: ['9M'], powertrip: ['9M'],
	},
	eeveestarter: {
		punchypummel: ['9M'], twirlytwister: ['9M'], rockyrampage: ['9M'], dustydrift: ['9M'],
		steelystrike: ['9M'], stabbyswarm: ['9M'], ickyinjection: ['9M'], spookyspell: ['9M'],
		scalyscorn: ['9M'], glitchygraphics: ['9M'],
		firefang: ['9M'], icefang: ['9M'], crunch: ['9M'], thunderfang: ['9M'], iceshard: ['9M'],
		tripleaxel: ['9M'], icebeam: ['9M'], blizzard: ['9M'], psychic: ['9M'], hypervoice: ['9M'],
		earthpower: ['9M'], extremespeed: ['9M'], chargebeam: ['9M'], safeguard: ['9M'],
		conversion: ['9M'], conversion2: ['9M'], calmmind: ['9M'], triattack: ['9M'],
		paraboliccharge: ['9M'], magnetbomb: ['9M'], terrainpulse: ['9M'], victorydance: ['9M'],
		quiverdance: ['9M'], firstimpression: ['9M'], ironhead: ['9M'], noretreat: ['9M'],
		playrough: ['9M'], bulkup: ['9M'], triplekick: ['9M'], defog: ['9M'], airslash: ['9M'],
		tailwind: ['9M'], swift: ['9M'], aeroblast: ['9M'], hurricane: ['9M'], tidyup: ['9M'],
		bonerush: ['9M'], shoreup: ['9M'], earthquake: ['9M'], sandtomb: ['9M'], accelerock: ['9M'],
		stoneedge: ['9M'], rockblast: ['9M'], rockslide: ['9M'], poisonfang: ['9M'], poisontail: ['9M'],
		clearsmog: ['9M'], gastroacid: ['9M'], crosspoison: ['9M'], acidarmor: ['9M'], gunkshot: ['9M'],
		toxic: ['9M'], ominouswind: ['9M'], lick: ['9M'], shadowsneak: ['9M'], nightshade: ['9M'],
		grudge: ['9M'], hex: ['9M'], curse: ['9M'], nastyplot: ['9M'], hydropump: ['9M'],
		thunder: ['9M'], dragonpulse: ['9M'], dragonbreath: ['9M'],
		strengthsap: ['9M'], pursuit: ['9M'], punishment: ['9M'], spiritbreak: ['9M'],
		bittermalice: ['9M'], infernalparade: ['9M'], destinybond: ['9M'], dreameater: ['9M'],
		eeriespell: ['9M'], perishsong: ['9M'], blueflare: ['9M'], doomdesire: ['9M'],
		searingvoid: ['9M'], radiantassault: ['9M'],
	},
	jynx: {
		sparklingaria: ['9M'],
		eeriespell: ['9M'],
		spotlight: ['9M'],
	},
	obstagoon: {
		return: ['9M'],
		slash: ['9M'],
		extremespeed: ['9M'],
		taunt: ['9M'],
		metalclaw: ['9M'],
		thunderpunch: ['9M'],
	},
	misdreavus: {
		drainingkiss: ['9M'],
	},
	mismagius: {
		hexingslash: ['9M'],
	},
	volcarona: {
		etherealtempest: ['9M'],
	},
	toxtricity: {
		snarl: ['9M'],
		darkpulse: ['9M'],
		bite: ['9M'],
		foulplay: ['9M'],
		nightslash: ['9M'],
		thief: ['9M'],
		torment: ['9M'],
		voltswitch: ['9M'],
	},
	toxtricitylowkey: {
		snarl: ['9M'],
		darkpulse: ['9M'],
		bite: ['9M'],
		foulplay: ['9M'],
		nightslash: ['9M'],
		thief: ['9M'],
		torment: ['9M'],
		voltswitch: ['9M'],
	},
	toxtricityaevian: {
		snarl: ['9M'],
		darkpulse: ['9M'],
		bite: ['9M'],
		foulplay: ['9M'],
		nightslash: ['9M'],
		thief: ['9M'],
		torment: ['9M'],
		voltswitch: ['9M'],
	},
	palossandrocky: {
		stealthrock: ['9M'], rockblast: ['9M'], rocktomb: ['9M'], powergem: ['9M'], recover: ['9M'],
		dreameater: ['9M'], explosion: ['9M'], grassknot: ['9M'], laserfocus: ['9M'], meteorbeam: ['9M'],
		naturepower: ['9M'], selfdestruct: ['9M'], sludgewave: ['9M'], smackdown: ['9M'], strength: ['9M'],
		taunt: ['9M'], waterpulse: ['9M'],
	},
	palossandfiery: {
		willowisp: ['9M'], firespin: ['9M'], flameburst: ['9M'], lavaplume: ['9M'], morningsun: ['9M'], sunnyday: ['9M'],
		burningjealousy: ['9M'], fireblast: ['9M'], flamecharge: ['9M'], flamethrower: ['9M'], focusblast: ['9M'], heatcrash: ['9M'],
		heatwave: ['9M'], incinerate: ['9M'], laserfocus: ['9M'], mysticalfire: ['9M'], overheat: ['9M'], phantomforce: ['9M'],
		shockwave: ['9M'], solarbeam: ['9M'], solarblade: ['9M'], workup: ['9M'],
	},
	palossandicy: {
		coldsnap: ['9M'], haze: ['9M'], iceshard: ['9M'], aurorabeam: ['9M'], freezedry: ['9M'], moonlight: ['9M'], snowscape: ['9M'],
		auroraveil: ['9M'], avalanche: ['9M'], blizzard: ['9M'], calmmind: ['9M'], frostbreath: ['9M'], gyroball: ['9M'], icebeam: ['9M'],
		iciclespear: ['9M'], icywind: ['9M'], laserfocus: ['9M'], thunderwave: ['9M'], tripleaxel: ['9M'], whirlpool: ['9M'],
	},
	persian: {
		dazzlinggleam: ['9M'],
		powergem: ['9M'],
	},
	persianalola: {
		dazzlinggleam: ['9M'],
		powergem: ['9M'],
	},
	primarina: {
		boomburst: ['9M'],
	},
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
	arcanine: {
		jawlock: ['9M'],
		doublekick: ['9M'],
		nobleroar: ['9M'],
		snarl: ['9M'],
		wideguard: ['9M'],
		safeguard: ['9M'],
	},
	tyranitar: {
		knockoff: ['9M'],
		rockwrecker: ['9M'],
		breakingswipe: ['9M'],
		bodypress: ['9M'],
		dragoncheer: ['9M'],
		nastyplot: ['9M'],
		taunt: ['9M'],
		weatherball: ['9M'],
		wideguard: ['9M'],
	},
	basculegion: {
		skullbash: ['9M'],
		wavecrash: ['9M'],
		finalgambit: ['9M'],
		blizzard: ['9M'],
		curse: ['9M'],
		dive: ['9M'],
		flipturn: ['9M'],
		haze: ['9M'],
		hex: ['9M'],
		hydropump: ['9M'],
		icebeam: ['9M'],
		nastyplot: ['9M'],
		nightshade: ['9M'],
		shadowball: ['9M'],
		soak: ['9M'],
		surf: ['9M'],
		taunt: ['9M'],
		swordsdance: ['9M'],
		weatherball: ['9M'],
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
		bouncybubble: ['9M'], bounce: ['9M'], icefang: ['9M'], ironhead: ['9M'],
		psychicfangs: ['9M'], strength: ['9M'], tripledive: ['9M'], wavecrash: ['9M'],
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
	drednaw: {
		psychicfangs: ['9M'],
		icefang: ['9M'],
		crunch: ['9M'],
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
		calmmind: ['9M'],
	},
	nidoking: {
		spikecannon: ['9M'],
		bulkup: ['9M'],
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
		agility: ['9M'], chillingwater: ['9M'], breakingswipe: ['9M'], detect: ['9M'], dragonclaw: ['9M'],
		dragonpulse: ['9M'], faketears: ['9M'], flipturn: ['9M'], focusblast: ['9M'], honeclaws: ['9M'],
		iciclespear: ['9M'], lashout: ['9M'], metalclaw: ['9M'], muddywater: ['9M'], poweruppunch: ['9M'],
		psychicfangs: ['9M'], razorshell: ['9M'], scaleshot: ['9M'], snarl: ['9M'], stompingtantrum: ['9M'], trailblaze: ['9M'], fishiousrend: ['9M'],
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
		soak: ['9M'],
	},
	qwilfishhisui: {
		spikecannon: ['9M'],
	},
	sneasler: {
		radiantclaw: ['9M'],
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
		electroshot: ['9M'], waterpulse: ['9M'], darkpulse: ['9M'], dragonpulse: ['9M'],
		aurasphere: ['9M'], healpulse: ['9M'], smackdown: ['9M'], bubblebeam: ['9M'],
		flashcannon: ['9M'], focusblast: ['9M'], hyperbeam: ['9M'], icebeam: ['9M'],
		shadowball: ['9M'], sludgebomb: ['9M'], terrainpulse: ['9M'], chillingwater: ['9M'],
		scald: ['9M'], watergun: ['9M'], hydropump: ['9M'], flipturn: ['9M'], liquidation: ['9M'],
		muddywater: ['9M'], sludgewave: ['9M'], pounce: ['9M'], uturn: ['9M'], venoshock: ['9M'],
		swordsdance: ['9M'], honeclaws: ['9M'],
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

const CUSTOM_BODY_PRESS_LEARNSET_IDS = [
	'jigglypuff', 'wigglytuff', 'graveler', 'golemalola', 'slowbrogalar', 'hypno',
	'rhyhorn', 'taurospaldeacombat', 'taurospaldeablaze', 'taurospaldeaaqua', 'meganium',
	'wooperpaldea', 'quagsire', 'ursaluna', 'ursalunabloodmoon', 'makuhita', 'numel',
	'grumpig', 'regice', 'torterra', 'rampardos', 'hippopotas', 'abomasnow', 'emboar',
	'eelektross', 'cubchoo', 'cobalion', 'goodrahisui', 'avalugghisui', 'crabominable',
	'falinks', 'oinkolognef', 'scratchet', 'tomohawk', 'cresceidon', 'ramnarok', 'obliteryx',
];

const CUSTOM_LEARNSET_REMOVALS: {[id: string]: string[]} = {
	abomasnow: ['partingshot', 'sappyseed'],
	absol: ['partingshot'],
	aerodactyl: ['bravebird', 'dragonascent'],
	altaria: ['roaroftime'],
	arcanine: ['mightycleave'],
	arcaninehisui: ['accelerock', 'shoreup'],
	archeops: ['dragonascent'],
	armaldo: ['shoreup'],
	chimecho: ['lightofruin'],
	clawitzer: ['originpulse'],
	claydol: ['lightofruin', 'lusterpurge', 'shoreup'],
	crobat: ['direclaw'],
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
	feraligatr: ['mightycleave', 'shoreup', 'firefang', 'thunderfang', 'poisonfang'],
	falinks: ['astonish', 'destinybond', 'nightshade', 'ominouswind', 'phantomforce', 'poltergeist', 'shadowball', 'shadowclaw', 'shadowpunch', 'shadowsneak', 'spectralthief'],
	flygon: ['roaroftime'],
	gallade: ['bitterblade', 'tachyoncutter', 'triplearrows'],
	garchomp: ['roaroftime', 'spacialrend'],
	gardevoir: ['lunardance', 'lunarwish', 'psyblade', 'psychoboost', 'tachyoncutter'],
	goodra: ['roaroftime', 'slackoff'],
	goodrahisui: ['roaroftime', 'slackoff'],
	goomy: ['roaroftime'],
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
	milotic: ['bouncybubble', 'takeheart'],
	morpeko: ['aurawheelplus'],
	phione: ['takeheart'],
	primarina: ['takeheart'],
	muk: ['partingshot'],
	mukalola: ['partingshot'],
	musharna: ['partingshot'],
	nidoking: ['partingshot'],
	ninetales: ['torchsong'],
	noivern: ['aeroblast', 'partingshot', 'torchsong'],
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
	seviper: [
		'direclaw', 'partingshot', 'earthpower', 'secretsword', 'sacredsword',
		'barbbarrage', 'glaiverush', 'leafblade', 'powerwhip',
	],
	simisage: ['slackoff'],
	simisear: ['slackoff'],
	simipour: ['slackoff'],
	samurott: ['flashcannon', 'ironhead', 'irontail', 'metalclaw', 'tachyoncutter'],
	samurotthisui: ['flashcannon', 'ironhead', 'irontail', 'metalclaw', 'tachyoncutter'],
	zoroark: ['bloodmoon'], zoroarkhisui: ['bloodmoon'],
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
	zangoose: [
		'partingshot', 'machpunch', 'drainpunch', 'doublekick',
		'sacredsword', 'bulkup',
	],
	trapinch: ['roaroftime'],
	gabite: ['roaroftime'],
	deino: ['roaroftime'],
};

for (const id of ["furfroupharaoh","furfrouf","furfroudiamondf","furfrouheartf","furfroumatron","furfroulareinef","furfroustarf","furfroupharaohf","furfrouheart","furfroudandyf","furfroustar","furfroulareine","furfrou","furfroudebutantef","furfroumatronf","furfroudebutante","furfroukabukif","furfroukabuki","furfroudiamond","furfroudandy"]) {
	CUSTOM_BW_SPRITES[id] = {num: 676, ...CUSTOM_STATIC_BATTLE_SPRITES[id]};
}


Object.assign(CUSTOM_STATIC_BATTLE_SPRITES, {"sharpedomega":{"back":{"h":154,"w":146},"front":{"h":156,"w":180},"shinyFront":{"h":156,"w":180},"shinyBack":{"h":154,"w":146}},"sharpedomegay":{"back":{"h":104,"w":158},"front":{"h":136,"w":148},"shinyFront":{"h":136,"w":148},"shinyBack":{"h":104,"w":158}},"sharpedo":{"back":{"h":138,"w":114},"front":{"h":140,"w":124},"shinyFront":{"h":140,"w":124},"shinyBack":{"h":138,"w":114}}});
Object.assign(CUSTOM_BW_SPRITES, {"sharpedomega":{"num":319,"back":{"h":154,"w":146},"front":{"h":156,"w":180},"shinyFront":{"h":156,"w":180},"shinyBack":{"h":154,"w":146}},"sharpedomegay":{"num":319,"back":{"h":104,"w":158},"front":{"h":136,"w":148},"shinyFront":{"h":136,"w":148},"shinyBack":{"h":104,"w":158}},"sharpedo":{"num":319,"back":{"h":138,"w":114},"front":{"h":140,"w":124},"shinyFront":{"h":140,"w":124},"shinyBack":{"h":138,"w":114}}});

Object.assign(CUSTOM_STATIC_BATTLE_SPRITES, {roserademega: {"back":{"h":96,"w":96},"front":{"h":80,"w":80},"shinyFront":{"h":80,"w":80},"shinyBack":{"h":96,"w":96}}});
Object.assign(CUSTOM_BW_SPRITES, {roserademega: {"num":407,"back":{"h":96,"w":96},"front":{"h":80,"w":80},"shinyFront":{"h":80,"w":80},"shinyBack":{"h":96,"w":96}}});

Object.assign(CUSTOM_STATIC_BATTLE_SPRITES, {bronzongmega: {"back":{"h":132,"w":132},"front":{"h":132,"w":132},"shinyFront":{"h":132,"w":132},"shinyBack":{"h":132,"w":132}}});
Object.assign(CUSTOM_BW_SPRITES, {bronzongmega: {"num":437,"back":{"h":132,"w":132},"front":{"h":132,"w":132},"shinyFront":{"h":132,"w":132},"shinyBack":{"h":132,"w":132}}});

Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{noivernmega:{"back":{"h":192,"w":192},"front":{"h":192,"w":192},"shinyFront":{"h":192,"w":192},"shinyBack":{"h":192,"w":192}}});
Object.assign(CUSTOM_BW_SPRITES,{noivernmega:{"num":715,"back":{"h":192,"w":192},"front":{"h":192,"w":192},"shinyFront":{"h":192,"w":192},"shinyBack":{"h":192,"w":192}}});

Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{weavilemega:{"back":{"h":192,"w":192},"front":{"h":192,"w":192},"shinyFront":{"h":192,"w":192},"shinyBack":{"h":192,"w":192}}});
Object.assign(CUSTOM_BW_SPRITES,{weavilemega:{"num":461,"back":{"h":192,"w":192},"front":{"h":192,"w":192},"shinyFront":{"h":192,"w":192},"shinyBack":{"h":192,"w":192}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{dusknoirmega:{"shinyBack":{"h":212,"w":192},"front":{"h":200,"w":200},"back":{"h":240,"w":192},"shinyFront":{"h":200,"w":200}}});
Object.assign(CUSTOM_BW_SPRITES,{dusknoirmega:{"num":477,"shinyBack":{"h":212,"w":192},"front":{"h":200,"w":200},"back":{"h":240,"w":192},"shinyFront":{"h":200,"w":200}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{noctowlmega:{"shinyBack":{"h":132,"w":132},"front":{"h":132,"w":132},"back":{"h":132,"w":132},"shinyFront":{"h":132,"w":132}}});
Object.assign(CUSTOM_BW_SPRITES,{noctowlmega:{"num":164,"shinyBack":{"h":132,"w":132},"front":{"h":132,"w":132},"back":{"h":132,"w":132},"shinyFront":{"h":132,"w":132}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES.decidueyealt, {back: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}});
Object.assign(CUSTOM_BW_SPRITES.decidueyealt, {back: {w: 192, h: 192}, shinyBack: {w: 192, h: 192}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{gardevoirvoid:{"back":{"h":64,"w":64},"front":{"h":64,"w":64},"shinyFront":{"h":64,"w":64},"shinyBack":{"h":64,"w":64}}});
Object.assign(CUSTOM_BW_SPRITES,{gardevoirvoid:{"num":282,"back":{"h":64,"w":64},"front":{"h":64,"w":64},"shinyFront":{"h":64,"w":64},"shinyBack":{"h":64,"w":64}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES, {gardevoirmegaalt: CUSTOM_STATIC_BATTLE_SPRITES.gardevoirvoid});
Object.assign(CUSTOM_BW_SPRITES, {gardevoirmegaalt: CUSTOM_BW_SPRITES.gardevoirvoid});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{luxraymega:{"shinyBack":{"h":192,"w":192},"front":{"h":192,"w":192},"back":{"h":192,"w":192},"shinyFront":{"h":192,"w":192}}});
Object.assign(CUSTOM_BW_SPRITES,{luxraymega:{"num":405,"shinyBack":{"h":192,"w":192},"front":{"h":192,"w":192},"back":{"h":192,"w":192},"shinyFront":{"h":192,"w":192}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES, {archeops: {front: {w: 96, h: 96}, back: {w: 96, h: 96}, shinyFront: {w: 96, h: 96}, shinyBack: {w: 96, h: 96}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{"lopunny":{"back":{"h":122,"w":106},"front":{"h":119,"w":105},"shinyFront":{"h":119,"w":104},"shinyBack":{"h":122,"w":106}},"lopunnymega":{"back":{"h":130,"w":101},"front":{"h":134,"w":126},"shinyFront":{"h":134,"w":126},"shinyBack":{"h":130,"w":101}}});
Object.assign(CUSTOM_BW_SPRITES,{"lopunny":{"num":428,"back":{"h":122,"w":106},"front":{"h":119,"w":105},"shinyFront":{"h":119,"w":104},"shinyBack":{"h":122,"w":106}},"lopunnymega":{"num":428,"back":{"h":130,"w":101},"front":{"h":134,"w":126},"shinyFront":{"h":134,"w":126},"shinyBack":{"h":130,"w":101}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{"breloommegaf":{"shinyBack":{"w":150,"h":210},"shinyFront":{"w":120,"h":132},"front":{"w":120,"h":132},"back":{"w":150,"h":210}},"breloommega":{"shinyBack":{"w":150,"h":210},"shinyFront":{"w":120,"h":132},"front":{"w":120,"h":132},"back":{"w":150,"h":210}}});
Object.assign(CUSTOM_BW_SPRITES,{"breloommegaf":{"num":286,"shinyBack":{"w":150,"h":210},"shinyFront":{"w":120,"h":132},"front":{"w":120,"h":132},"back":{"w":150,"h":210}},"breloommega":{"num":286,"shinyBack":{"w":150,"h":210},"shinyFront":{"w":120,"h":132},"front":{"w":120,"h":132},"back":{"w":150,"h":210}}});
Object.assign(CUSTOM_STATIC_BATTLE_SPRITES,{"silvally":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyfighting":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyflying":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallypoison":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyground":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyrock":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallybug":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyghost":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallysteel":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyunknown":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyfire":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallywater":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallygrass":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyelectric":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallypsychic":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyice":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallydragon":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallydark":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyfairy":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}}});
Object.assign(CUSTOM_BW_SPRITES,{"silvally":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyfighting":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyflying":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallypoison":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyground":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyrock":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallybug":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyghost":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallysteel":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyunknown":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyfire":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallywater":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallygrass":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyelectric":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallypsychic":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyice":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallydragon":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallydark":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}},"silvallyfairy":{"front":{"w":192,"h":192},"back":{"w":192,"h":192},"shinyFront":{"w":192,"h":192},"shinyBack":{"w":192,"h":192}}});
const CUSTOM_BW_SPRITE_IDS = Object.keys(CUSTOM_BW_SPRITES);
const CUSTOM_ANIMATED_BW_SPRITES = new Set([
	'aggron', 'ariados', 'butterfree', 'cacturne', 'cinderacegmax',
	'crobat', 'dragapult', 'duraludon', 'dusknoir', 'electivire', 'empoleon', 'espeon', 'garbodorgmax',
	'garchomp', 'garchompf', 'garchompmega', 'gardevoirmega', 'glalie', 'gliscor', 'grimmsnarl',
	'heracross', 'hydreigon', 'infernape', 'lilligant', 'lucariomega', 'luxray', 'magmortar', 'magneton',
	'magnezone', 'metagross', 'milotic', 'mothim', 'ninetales', 'obstagoon', 'perrserker', 'pidgeot',
	'ribombee', 'rotom', 'rotomfan', 'rotomfrost', 'rotomheat', 'rotommow', 'rotomwash', 'salamence',
	'scolipede', 'slowbro', 'slowking', 'sneasel', 'staraptor', 'steelix', 'talonflame',
	'torterra', 'typhlosion', 'venusaur', 'victreebel', 'vikavolt',
	'whimsicott', 'unfezantrejuv',
]);
const ROTOM_SHINY_SPRITE_IDS = new Set(['rotom', 'rotomheat', 'rotomwash', 'rotomfrost', 'rotomfan', 'rotommow']);
const CUSTOM_STATIC_SHINY_BW_SPRITES = new Set(['magnezone', 'sylveon', ...Array.from(ROTOM_SHINY_SPRITE_IDS)]);
function customSpriteRevision(id: string) {
 if (toID(id).startsWith('silvally')) return '?v=silvally-forms-20260912';
 if (['aurorus', 'tyrantrum'].includes(toID(id))) return '?v=fossils-20260912';
 if (ROTOM_SHINY_SPRITE_IDS.has(toID(id))) return '?v=rotom-shiny-1';
 if (['raichu-megax', 'raichu-megay'].includes(id)) return '?v=raichu-refresh-1';
 return ['sharpedo', 'sharpedo-mega', 'sharpedo-megay', 'lopunny', 'lopunny-mega'].includes(id) ? '?v=bw-refresh-2' : '';
}
const CUSTOM_SPECIES_IDS = Object.keys(CUSTOM_SPECIES);
const CUSTOM_SPECIES_UPDATE_IDS = Object.keys(CUSTOM_SPECIES_UPDATES);
const REMOVED_SPECIES_IDS = ['belliboltalt', 'dusknoiralt', 'luxrayalt'];
const CLEAN_BASE_FORMES: {[id: string]: string[]} = {
	bellibolt: ['Bellibolt', 'Bellibolt-Mega'],
	luxray: ['Luxray', 'Luxray-Mega'],
	dusknoir: ['Dusknoir', 'Dusknoir-Mega'],
};
function getCustomSpeciesBaseData(customSpecies: {base: string}) {
	if (!window.BattlePokedex) return undefined;
	return window.BattlePokedex[customSpecies.base] || window.BattlePokedex[toID(customSpecies.base)];
}
function mergeCustomSpeciesData(baseData: AnyObject, existingData: AnyObject | undefined, customData: AnyObject) {
	const replaceAbilities = !!(customData.replaceAbilities || customData.requiredItem || customData.requiredAbility);
	const merged = {
		...baseData,
		...(existingData || {}),
		...customData,
		baseStats: {
			...(baseData.baseStats || {}),
			...(existingData?.baseStats || {}),
			...(customData.baseStats || {}),
		},
		abilities: {
			...(replaceAbilities ? {} : (baseData.abilities || {})),
			...(replaceAbilities ? {} : (existingData?.abilities || {})),
			...(customData.abilities || {}),
		},
	};
	if (!customData.types && !existingData?.types && baseData.types) merged.types = [...baseData.types];
	return merged;
}
function isCustomVisualForm(data: AnyObject) {
	if (data?.name === 'Gardevoir-Void') return true;
	const forme = data?.forme;
	if (typeof forme !== 'string') return false;
	return ['Alt', 'Aevian', 'East-Aevian', 'Hisui-Alt', 'Pulse', 'Azzy', 'Azzy2', 'Spring', 'Summer', 'Autumn', 'Winter', 'Rejuv', 'Reborn', 'Perfect', 'Deso', 'Rocky', 'Fiery', 'Icy'].includes(forme) ||
		forme.endsWith('-Alt') || forme.endsWith('-Reborn');
}
function isCustomVisualVariantName(name: unknown, speciesTable?: AnyObject) {
	if (typeof name !== 'string' || !name) return false;
	const id = toID(name);
	const data = speciesTable?.[id] || window.BattlePokedex?.[id] || CUSTOM_SPECIES[id]?.data;
	return isCustomVisualForm(data);
}
const CUSTOM_VARIANT_BASE_ALIASES: {[id: string]: string} = {
	charizardmegax: 'charizard',
	gastrodoneast: 'gastrodon',
};
const CUSTOM_SPECIES_ID_ALIASES: {[id: string]: string} = {
	// Granbull-Reborn is stored by the server under the legacy custom key.
	granbullreborn: 'granbullalt',
	// Emboar-Reborn forms use the same legacy custom-key convention.
	emboarreborn: 'emboaralt',
	emboarmegareborn: 'emboarmegaalt',
};
// Battle logs use display names, which can differ from custom data keys (Alt/Reborn/Deso).
// Derive these aliases directly so sprite resolution does not depend on loading aliases.js.
for (const [id, species] of Object.entries(CUSTOM_SPECIES)) {
 const displayId = toID(species.data.name);
 if (displayId && displayId !== id && !(displayId in CUSTOM_SPECIES)) {
  CUSTOM_SPECIES_ID_ALIASES[displayId] = id;
 }
}

const PROFILE_VARIANT_FORMES: {[familyId: string]: string[]} = {
	palossand: [
		'Palossand', 'Palossand-Rocky', 'Palossand-Fiery', 'Palossand-Icy',
	],
	pikachu: [
		'Pikachu', 'Pikachu-Cosplay', 'Pikachu-Starter', 'Pikachu-Belle',
		'Pikachu-Libre', 'Pikachu-PhD', 'Pikachu-Pop-Star', 'Pikachu-Rock-Star',
	],
	furfrou: [
		'Furfrou', 'Furfrou-Heart', 'Furfrou-Star', 'Furfrou-Diamond', 'Furfrou-Debutante',
		'Furfrou-Matron', 'Furfrou-Dandy', 'Furfrou-La Reine', 'Furfrou-Kabuki', 'Furfrou-Pharaoh',
	],
	granbull: [
		'Granbull', 'Granbull-Reborn',
	],
	sawsbuck: [
		'Sawsbuck', 'Sawsbuck-Spring', 'Sawsbuck-Summer', 'Sawsbuck-Autumn', 'Sawsbuck-Winter',
	],
	rotom: [
		'Rotom', 'Rotom-Heat', 'Rotom-Wash', 'Rotom-Frost', 'Rotom-Fan', 'Rotom-Mow',
	],
	eeveestarter: [
		'Eevee-Starter', 'Eevee-Starter-Alt', 'Divineon',
	],
	musharna: [
		'Musharna', 'Musharna-Rejuv',
	],
	silvally: [
		'Silvally', 'Silvally-Fighting', 'Silvally-Flying', 'Silvally-Poison',
		'Silvally-Ground', 'Silvally-Rock', 'Silvally-Bug', 'Silvally-Ghost',
		'Silvally-Steel', 'Silvally-Fire', 'Silvally-Water', 'Silvally-Grass',
		'Silvally-Electric', 'Silvally-Psychic', 'Silvally-Ice', 'Silvally-Dragon',
		'Silvally-Dark', 'Silvally-Fairy',
	],
};
const PROFILE_VARIANT_FAMILY_IDS: {[speciesId: string]: string} = {};
for (const [familyId, formes] of Object.entries(PROFILE_VARIANT_FORMES)) {
	for (const forme of formes) PROFILE_VARIANT_FAMILY_IDS[toID(forme)] = familyId;
}
function customVariantFamilyBaseId(base: string) {
	const id = toID(base);
	return CUSTOM_VARIANT_BASE_ALIASES[id] || id;
}
function customVariantFamilyId(species: AnyObject) {
	const id = toID(species?.id || species?.name || '');
	if (PROFILE_VARIANT_FAMILY_IDS[id]) return PROFILE_VARIANT_FAMILY_IDS[id];
	const directCustomSpecies = CUSTOM_SPECIES[id];
	if (directCustomSpecies?.data.standalone || species?.standalone) return id;
	for (const customSpecies of Object.values(CUSTOM_SPECIES)) {
		if (isCustomVisualForm(customSpecies.data) && customVariantFamilyBaseId(customSpecies.base) === id) {
			return id;
		}
	}
	const customSpecies = directCustomSpecies;
	if (customSpecies && isCustomVisualForm(customSpecies.data)) {
		return customVariantFamilyBaseId(customSpecies.base);
	}
	const baseId = toID(species?.baseSpecies || id);
	return customVariantFamilyBaseId(baseId);
}
export function getCustomVisualFamilyId(species: AnyObject) {
	return customVariantFamilyId(species);
}
export function isProfileVariantForm(species: AnyObject) {
	return !!PROFILE_VARIANT_FORMES[customVariantFamilyId(species)];
}
export function getCustomCosmeticFormes(species: AnyObject) {
	window.ensureCustomSpecies?.();
	const familyId = customVariantFamilyId(species);
	const profileFormes = PROFILE_VARIANT_FORMES[familyId];
	// This is the canonical list for profile families. The server owns these
	// forms, so do not hide a selector because a raw alternate-form record has
	// not been wrapped by the client yet.
	if (profileFormes) return profileFormes;
	const baseData = window.BattlePokedex?.[familyId] || {};
	const names: string[] = [];
	const addName = (name: unknown) => {
		if (typeof name !== 'string' || !name || names.some(existing => toID(existing) === toID(name))) return;
		names.push(name);
	};
	addName(baseData.name || (toID(species?.name) === familyId ? species.name : undefined));
	for (const customSpecies of Object.values(CUSTOM_SPECIES)) {
		if (customSpecies.data.standalone) continue;
		if (!isCustomVisualForm(customSpecies.data) || customVariantFamilyBaseId(customSpecies.base) !== familyId) continue;
		addName(customSpecies.data.name);
		for (const forme of customSpecies.data.otherFormes || []) {
			if (isCustomVisualVariantName(forme)) addName(forme);
		}
	}
	for (const forme of baseData.cosmeticFormes || []) {
		if (isCustomVisualVariantName(forme)) addName(forme);
	}
	if (names.length <= 1) {
		for (const forme of species.cosmeticFormes || []) {
			if (isCustomVisualVariantName(forme)) addName(forme);
		}
	}
	return names;
}
function addCustomVariantFormes(formeOrder: string[], formes: unknown) {
	if (!Array.isArray(formes)) return;
	for (const forme of formes) {
		if (typeof forme === 'string' && !formeOrder.includes(forme)) formeOrder.push(forme);
	}
}
function applyCustomVisualVariantLinks(speciesTable: AnyObject) {
	var groups: {[baseId: string]: {ids: string[], names: Set<string>}} = {};
	for (var id of CUSTOM_SPECIES_IDS) {
		var customSpecies = CUSTOM_SPECIES[id];
		if (!isCustomVisualForm(customSpecies.data) || customSpecies.data.standalone) continue;
		var baseId = customVariantFamilyBaseId(customSpecies.base);
		var group = groups[baseId] || (groups[baseId] = {ids: [], names: new Set()});
		group.ids.push(id);
		group.names.add(customSpecies.data.name);
		for (var forme of customSpecies.data.otherFormes || []) {
			if (isCustomVisualVariantName(forme, speciesTable)) group.names.add(forme);
		}
	}
	for (var groupEntry of Object.entries(groups)) {
		var baseId = groupEntry[0];
		var group = groupEntry[1];
		var baseData = speciesTable[baseId] || {};
		var baseName = baseData.name || speciesTable[group.ids[0]]?.baseSpecies || baseId;
		var formeOrder: string[] = [];
		formeOrder.push(baseName);
		addCustomVariantFormes(formeOrder, baseData.formeOrder);
		addCustomVariantFormes(formeOrder, baseData.otherFormes);
		addCustomVariantFormes(formeOrder, baseData.cosmeticFormes);
		for (var id of group.ids) {
			var data = speciesTable[id] || CUSTOM_SPECIES[id].data;
			addCustomVariantFormes(formeOrder, data.formeOrder);
			addCustomVariantFormes(formeOrder, data.otherFormes);
			if (typeof data.name === 'string' && !formeOrder.includes(data.name)) formeOrder.push(data.name);
		}
		for (var name of group.names) {
			if (!formeOrder.includes(name)) formeOrder.push(name);
		}
		var cosmeticFormes = new Set((baseData.cosmeticFormes || []).filter((forme: string) =>
			isCustomVisualVariantName(forme, speciesTable)
		));
		for (var name of group.names) {
			if (name !== baseName) cosmeticFormes.add(name);
		}
		speciesTable[baseId] = {
			...baseData,
			cosmeticFormes: [...cosmeticFormes],
			formeOrder,
		};
		for (var id of group.ids) {
			var data = speciesTable[id] || CUSTOM_SPECIES[id].data;
			speciesTable[id] = {
				...data,
				baseSpecies: baseName,
				otherFormes: formeOrder.filter(forme => forme !== data.name),
				cosmeticFormes: [...cosmeticFormes],
				formeOrder,
			};
		}
	}
}
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
	feraligatr: {x: 7, y: 6, backgroundSize: '82px auto'},
	garchomp: {x: 6, y: 10, backgroundSize: '78px auto'},
	garchompf: {x: 6, y: 10, backgroundSize: '78px auto'},
	hydreigon: {x: 7, y: 6, backgroundSize: '82px auto'},
	inteleon: {x: 8, y: 3, backgroundSize: '80px auto'},
	pinsir: {x: 12, y: 7, backgroundSize: '72px auto'},
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
	charizardalt: {w: 78, h: 78},
	dragapult: {w: 78, h: 78},
	cofagrigus: {w: 88, h: 88},
};
const CUSTOM_TEAM_PREVIEW_BACK_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	charizard: {w: 84, h: 84},
	charizardalt: {w: 84, h: 84},
	dragapult: {w: 84, h: 84},
	cofagrigus: {w: 88, h: 88},
};
const CUSTOM_MEDIUM_SPRITE_MIN_DIMENSION = 104;
const CUSTOM_MEDIUM_SPRITE_MAX_DIMENSION = 170;
const CUSTOM_BATTLE_SPRITE_Y_OFFSETS: {[id: string]: {front?: number, back?: number}} = {
	sableye: {front: 0, back: 0},
	sableyemega: {front: 0, back: 0},
	tentacruelalt: {front: 10, back: 8},
	// These custom canvases have different transparent bottom margins. Keep the
	// visible artwork on the battle baseline without changing its battle size.
	alakazamalt: {front: 12, back: 1},
	alakazammegaalt: {front: 2, back: 1},
};
const CUSTOM_BATTLE_SPRITE_X_OFFSETS: {[id: string]: {front?: number, back?: number}} = {
	hatterenegmax: {back: -42},
};
const CUSTOM_BATTLE_FRONT_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	aegislashgmax: {w: 120, h: 120},
	alcremie: {w: 60, h: 60},
	ariados: {w: 60, h: 60},
	zangoosereborn: {w: 78, h: 78},
	seviperreborn: {w: 78, h: 78},
	banettemega: {w: 82, h: 82},
	butterfree: {w: 64, h: 64},
	butterfreemega: {w: 82, h: 82},
	clefable: {w: 72, h: 72},
	corviknightgmax: {w: 112, h: 112},
	dragapultgmax: {w: 120, h: 120},
	feraligatrgmax: {w: 120, h: 120},
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
	tentacruelalt: {w: 82, h: 82},
	rotom: {w: 88, h: 88},
	rotomfan: {w: 96, h: 96},
	rotomfrost: {w: 96, h: 96},
	rotomheat: {w: 96, h: 96},
	rotommow: {w: 96, h: 96},
	rotomwash: {w: 96, h: 96},
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
	weavile: {w: 52, h: 52},
	weavilef: {w: 52, h: 52},
	corviknight: {w: 86, h: 98},
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
	corviknight: {w: 62, h: 70},
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
	weavile: {w: 46, h: 46},
	weavilef: {w: 46, h: 46},
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
const CUSTOM_TEAMBUILDER_GMAX_SPRITE_MAX_HEIGHT = 78;
const CUSTOM_TEAMBUILDER_OVERRIDE_MAX_WIDTH = 86;
const CUSTOM_TEAMBUILDER_OVERRIDE_MAX_HEIGHT = 86;
const CUSTOM_TEAMBUILDER_MAX_UPSCALE = 1.12;
const CUSTOM_TEAMBUILDER_SPRITE_Y_OFFSET = 4;
const CUSTOM_TEAMBUILDER_SPRITE_Y_OFFSETS: {[id: string]: number} = {
	sableye: 18,
};
// Espeon's shiny BW file keeps the same 100x106 artwork centered on a 192px canvas.
const CUSTOM_TEAMBUILDER_BACKGROUND_SIZE_OVERRIDES: {[id: string]: {normal?: string, shiny?: string}} = {
	espeon: {shiny: '106px auto'},
};
const CUSTOM_TEAMBUILDER_BACKGROUND_POSITION_OVERRIDES: {[id: string]: {normal?: {x: number, y: number}, shiny?: {x: number, y: number}}} = {
	espeon: {shiny: {x: -7, y: -9}},
};
const CUSTOM_TEAMBUILDER_SPRITE_SIZE_OVERRIDES: {[id: string]: {w: number, h: number}} = {
	garchompbattlebond: {w: 96, h: 96},
	aegislashgmax: {w: 74, h: 74},
	corviknight: {w: 62, h: 62},
	alcremie: {w: 60, h: 60},
	ariados: {w: 60, h: 60},
	butterfree: {w: 58, h: 58},
	cacturnealt: {w: 64, h: 64},
	sandslashalt: {w: 76, h: 76},
	haxorusmega: {w: 78, h: 78},
	arcaninealt: {w: 78, h: 78},
	tentacruelalt: {w: 82, h: 82},
	roserademega: {w: 72, h: 72},
	auroreon: {w: 72, h: 72},
	soluneon: {w: 72, h: 72},
	abysseon: {w: 78, h: 78},
	divineon: {w: 78, h: 78},
	emboaralt: {w: 78, h: 78},
	emboarmegaalt: {w: 82, h: 82},
	butterfreemega: {w: 70, h: 70},
	dragapultgmax: {w: 74, h: 74},
	feraligatrgmax: {w: 74, h: 74},
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
	gligaralt: {w: 64, h: 64},
	gliscoralt: {w: 64, h: 64},
	inteleon: {w: 76, h: 76},
	whimsicott: {w: 60, h: 60},
	zoroark: {w: 74, h: 74},
	zoroarkhisui: {w: 74, h: 74},
};
const CUSTOM_TEAMBUILDER_SPRITE_DIMENSIONS: {[id: string]: {w: number, h: number, shinyW?: number, shinyH?: number}} = {
	blastoise: {w: 192, h: 192, shinyW: 192, shinyH: 192},
	blastoisemega: {w: 192, h: 192, shinyW: 192, shinyH: 192},
	feraligatr: {w: 192, h: 192, shinyW: 192, shinyH: 192},
	froslass: {w: 192, h: 192, shinyW: 192, shinyH: 192},
	gothitelle: {w: 192, h: 192, shinyW: 192, shinyH: 192},
	hydreigon: {w: 160, h: 156, shinyW: 192, shinyH: 192},
	jolteon: {w: 96, h: 96, shinyW: 92, shinyH: 98},
	reuniclus: {w: 96, h: 96, shinyW: 96, shinyH: 96},
	sylveon: {w: 96, h: 96, shinyW: 96, shinyH: 96},
};

function applyCustomTeambuilderSpriteSizing(spriteData: TeambuilderSpriteData, id: string, spriteDimensions: {w: number, h: number}) {
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
	const backgroundSizeOverride = CUSTOM_TEAMBUILDER_BACKGROUND_SIZE_OVERRIDES[id];
	spriteData.backgroundSize = backgroundSizeOverride?.[spriteData.shiny ? 'shiny' : 'normal'] || `${width}px auto`;
	const backgroundPositionOverride = CUSTOM_TEAMBUILDER_BACKGROUND_POSITION_OVERRIDES[id];
	const position = backgroundPositionOverride?.[spriteData.shiny ? 'shiny' : 'normal'];
	if (position) {
		spriteData.x = position.x;
		spriteData.y = position.y;
	}
}
Object.assign(CUSTOM_ABILITY_UPDATES, {
	kickfiend: {
		name: 'Kick Fiend',
		desc: "This Pokemon has Striker, Violent Rush, and Limber's effects.",
		shortDesc: 'Striker + Violent Rush + Limber.',
	},
	truedevotion: {
		name: 'True Devotion',
		desc: "This Pokemon has False Devotion, Protean, and Technician's effects.",
		shortDesc: 'False Devotion + Protean + Technician.',
	},
	solarrecharge: {
		name: 'Solar Recharge',
		desc: "This Pokemon's Fire-type moves have STAB. It is immune to Fire-type moves and restores 1/4 of its maximum HP when hit by one. In Sun, it restores 1/8 of its maximum HP at the end of each turn.",
		shortDesc: 'Fire STAB; Fire immunity heals 1/4; heals 1/8 each turn in Sun.',
	},
	caverndrake: {
		name: 'Cavern Drake',
		desc: "This Pokemon has Earth Eater, Solid Rock, and Mold Breaker's effects.",
		shortDesc: 'Earth Eater + Solid Rock + Mold Breaker.',
	},
	roughscale: {
		name: 'Rough Scale',
		desc: "This Pokemon has Rough Skin and Tough Claws' effects.",
		shortDesc: 'Rough Skin + Tough Claws.',
	},
	zprotean: {
		name: 'Z Protean',
		desc: "Before each attack other than Struggle, this Pokemon changes to the move's type and gains STAB. If it is Eevee-Starter, its battle sprite shifts to the matching Eeveelution until it leaves battle.",
		shortDesc: 'Before each attack, changes type and battle sprite to match its move.',
	},
	triplethreat: {
		name: 'Triple Threat',
		desc: "This Pokemon has Hydra Bond, Tangled Feet, Sniper, Big Pecks, and Keen Eye's effects.",
		shortDesc: 'Hydra Bond + Tangled Feet + Sniper + Big Pecks + Keen Eye.',
	},
	strikerfrenzy: {
		name: 'Striker Frenzy',
		desc: "This Pokemon has Striker and Vital Spirit's effects.",
		shortDesc: 'Striker + Vital Spirit.',
	},
	venomveil: {
		name: 'Venom Veil',
		desc: "This Pokemon has Liquid Ooze, Corrosion, and Water Veil's effects.",
		shortDesc: 'Liquid Ooze + Corrosion + Water Veil.',
	},
	abysslure: {
		name: 'Abyss Lure',
		desc: 'This Pokemon redirects Electric- and Water-type moves to itself, is immune to them, restores 1/4 of its maximum HP, and raises its Attack and Special Attack by 1 stage. It also has Illuminate\'s effect.',
		shortDesc: 'Redirects Electric/Water; heals 1/4; +1 Atk/SpA; Illuminate.',
	},
	bogbody: {
		name: 'Bog Body',
		desc: "This Pokemon has Dry Skin, Thick Fat, and Unaware's effects.",
		shortDesc: 'Dry Skin + Thick Fat + Unaware.',
	},
	frostsiren: {
		name: 'Frost Siren',
		desc: "This Pokemon has Refrigerate, Forewarn, and Dry Skin's effects.",
		shortDesc: 'Refrigerate + Forewarn + Dry Skin.',
	},
	mindfreeze: {
		desc: "This Pokemon cannot have this Ability suppressed. It is immune to Ice-type attacks and restores 1/4 of its maximum HP when hit by one. It has Ice Body's healing and hail immunity. Its damaging Psychic-type moves have a 40% chance to cause frostbite, and Freezing Glare's frostbite chance is doubled. Its Physical Ice-type moves become Special.",
		shortDesc: 'Cannot be suppressed; Ice immunity heals 1/4; Ice Body; Psychic may frostbite.',
	},
	eclipse: {
		desc: "This Ability cannot be suppressed. During weather, this Pokemon's attacks deal 1.5x damage. In clear weather, attacks deal 0.5x damage to this Pokemon. Its Psychic-type moves become Dark type if Dark would do more damage, and its Dark-type moves become Psychic type if Psychic would do more damage. It restores 1/4 max HP instead of taking damage from Psychic- or Dark-type moves.",
		shortDesc: 'Cannot be suppressed; weather attacks 1.5x; clear damage halved; Psychic/Dark choose type.',
	},
	sinisterblaze: {
		desc: 'Cannot be suppressed; burns the user on entry, converts burn damage to healing, damages foes for 1/8 max HP or 1/4 if burned, has no physical burn penalty, is immune to hail/sandstorm damage, counts as Ice in ice weather/fields, and gains +1 Def/SpD in Cold Eclipse and fire fields.',
		shortDesc: 'Burn heals user; foes take 1/8, or 1/4 if burned; no burn penalty; hail/sand immune.',
	},
	reflector: {
		name: 'Reflector',
		desc: "On entry, copies the active foe's types and adds them to this Pokemon's typing. Matching attacks deal half damage unless this Pokemon is immune. Reflect Type refreshes the copied types.",
		shortDesc: 'Copies foe types; adds them to its typing; matching attacks deal 0.5x unless immune.',
	},
	neurotoxin: {
		name: 'Neurotoxin',
		desc: "This Pokemon has Strong Jaw, Shed Skin, Hydra Bond, and Regenerator's effects.",
		shortDesc: 'Strong Jaw + Shed Skin + Hydra Bond + Regenerator.',
	},
	patternshift: {
		name: 'Pattern Shift',
		desc: "This Pokemon has Protean, Shed Skin, and Unaware's effects.",
		shortDesc: 'Protean + Shed Skin + Unaware.',
	},
	ragingbeast: {
		name: 'Raging Beast',
		desc: "This Pokemon has Guts and Mold Breaker's effects.",
		shortDesc: 'Guts + Mold Breaker.',
	},
	scavenger: {
		name: 'Scavenger',
		desc: "This Pokemon has Overcoat, Big Pecks, and Regenerator's effects.",
		shortDesc: 'Overcoat + Big Pecks + Regenerator.',
	},
	territorial: {
		name: 'Territorial',
		desc: "This Pokemon has Unnerve, Unaware, Tough Claws, and Intimidate's effects.",
		shortDesc: 'Unnerve + Unaware + Tough Claws + Intimidate.',
	},
	toxicspines: {
		name: 'Toxic Spines',
		desc: "This Pokemon has Toxic Debris, Corrosion, and Merciless's effects.",
		shortDesc: 'Toxic Debris + Corrosion + Merciless.',
	},
	lunardread: {
		name: 'Lunar Dread',
		desc: "This Pokemon has Magic Guard, Pressure, and Unaware's effects.",
		shortDesc: 'Magic Guard + Pressure + Unaware.',
	},
	stillwaters: {
		name: 'Still Waters',
		desc: "This Pokemon has Cloud Nine, Magic Guard, and Unaware's effects.",
		shortDesc: 'Cloud Nine + Magic Guard + Unaware.',
	},
	tidaljaw: {
		name: 'Tidal Jaw',
		desc: "This Pokemon has Strong Jaw, Swift Swim, and Filter's effects.",
		shortDesc: 'Strong Jaw + Swift Swim + Filter.',
	},
});
const CUSTOM_ABILITY_UPDATE_IDS = Object.keys(CUSTOM_ABILITY_UPDATES);
const CUSTOM_ARROW_MOVE_IDS = [
	'spiritshackle', 'thousandarrows', 'triplearrows', 'snipeshot', 'razorleaf', 'magicalleaf',
	'spikecannon', 'pinmissile', 'iciclespear', 'rockblast', 'bulletseed', 'scaleshot',
	'psychocut', 'ceaselessedge',
];
const CUSTOM_HORN_MOVE_IDS = ['hornattack', 'horndrill', 'hornleech', 'megahorn'];
const CUSTOM_ABILITY_COMPONENT_OVERRIDES: {[id: string]: readonly ID[]} = {
	astralwitchcraft: ['proficient' as ID, 'levitate' as ID, 'magicguard' as ID, 'swornduty' as ID],
	corrosivetouch: ['technician' as ID, 'poisontouch' as ID, 'corrosion' as ID],
	hardyskin: ['dryskin' as ID, 'vitalspirit' as ID, 'moxie' as ID],
	joyride: ['aerilate' as ID, 'hypercutter' as ID, 'vitalspirit' as ID],
	nighthunt: ['strongjaw' as ID, 'infiltrator' as ID, 'intimidate' as ID],
	rimeknuckle: ['filter' as ID, 'ironfist' as ID, 'icebody' as ID],
	royalvoice: ['pixilate' as ID, 'queenlymajesty' as ID, 'dreamsickness' as ID],
	aquashell: ["waterveil" as ID, "toughclaws" as ID, "innerfocus" as ID],
	sacredpower: ['duskilate' as ID, 'adaptability' as ID, 'magicguard' as ID],
	froststalker: ['stakeout' as ID, 'sharpness' as ID, 'refrigerate' as ID],
	echosense: ['echofiend' as ID, 'frisk' as ID, 'telepathy' as ID, 'infiltrator' as ID],
	stormbell: ['mirrorarmor' as ID, 'drizzle' as ID, 'elevate' as ID],
	apexarmor: ['bulletproof' as ID, 'roughskin' as ID, 'stalwart' as ID, 'selfsufficient' as ID],
	bogbody: ['electromorphosis' as ID, 'levitate' as ID, 'dryskin' as ID],
	solarhydra: ['hydrabond' as ID, 'grassysurge' as ID, 'solarpower' as ID, 'selfrepair' as ID, 'selfsufficient' as ID, 'naturalcure' as ID],
	astralengine: ['elevate' as ID, 'filter' as ID, 'analytic' as ID],
	alchemistsurge: ['psychicsurge' as ID, 'competitive' as ID, 'hydrabond' as ID, 'neuroforce' as ID],
	argentdevotion: ['armorize' as ID, 'swornduty' as ID],
	windchime: ['armorize' as ID, 'punkrock' as ID, 'levitate' as ID],
	hauntedchime: ['elevate' as ID, 'windpower' as ID, 'cursedbody' as ID],
	auramaster: ['dualwield' as ID, 'innerfocus' as ID, 'technician' as ID],
	doublestrike: ['ironfist' as ID, 'technician' as ID, 'skilllink' as ID],
	lunarorbit: ['magicbounce' as ID, 'serenegrace' as ID, 'triage' as ID],
	territorial: ['unnerve' as ID, 'unaware' as ID, 'toughclaws' as ID, 'intimidate' as ID],
	truedevotion: ['falsedevotion' as ID, 'protean' as ID, 'technician' as ID],
	falsedevotion: ['serenegrace' as ID, 'naturalrecovery' as ID, 'prankster' as ID],
	aeviandream: ['baddreams' as ID, 'shedskin' as ID, 'toughclaws' as ID],
	schooling: ['hydrabond' as ID, 'selfrepair' as ID, 'filter' as ID],
	wingedwraith: ['infiltrator' as ID, 'galewings' as ID],
	toxicsink: ['effectspore' as ID, 'stormdrain' as ID, 'invigorate' as ID],
	neurotoxin: ['strongjaw' as ID, 'shedskin' as ID, 'hydrabond' as ID, 'regenerator' as ID],
	patternshift: ['protean' as ID, 'shedskin' as ID, 'unaware' as ID],
	nightmarepulse: ['pendulumswing' as ID, 'nightrealm' as ID],
	riftdancer: ['opportunist' as ID, 'chlorophyll' as ID, 'dancer' as ID],
	glacialmass: ['heavymetal' as ID, 'thickfat' as ID],
	warship: ['swiftswim' as ID, 'unaware' as ID, 'solidrock' as ID, 'strongjaw' as ID],
	naturalrecovery: ['naturalcure' as ID, 'regenerator' as ID],
	ragingbeast: ['guts' as ID, 'moldbreaker' as ID],
	lunardread: ['magicguard' as ID, 'pressure' as ID, 'unaware' as ID],
	stillwaters: ['cloudnine' as ID, 'magicguard' as ID, 'unaware' as ID],
	scavenger: ['overcoat' as ID, 'bigpecks' as ID, 'regenerator' as ID],
	toxicspines: ['toxicdebris' as ID, 'corrosion' as ID, 'merciless' as ID],
	witheringshell: ['crumblingshell' as ID, 'naturalrecovery' as ID, 'sturdy' as ID],
	caverndrake: ['eartheater' as ID, 'solidrock' as ID, 'moldbreaker' as ID],
	roughscale: ['roughskin' as ID, 'toughclaws' as ID],
	empress: ['queenlymajesty' as ID, 'royaldecree' as ID],
	imperialprincess: ['striker' as ID, 'vitalspirit' as ID, 'moxie' as ID],
	loyalguard: ['friendguard' as ID, 'guarddog' as ID, 'intimidate' as ID],
	abysslure: ['lightningrod' as ID, 'stormdrain' as ID, 'voltabsorb' as ID, 'waterabsorb' as ID, 'illuminate' as ID],
	greatmarsh: ['dryskin' as ID, 'adaptability' as ID, 'poisontouch' as ID, 'anticipation' as ID],
	blackfang: ['strongjaw' as ID, 'insomnia' as ID, 'moxie' as ID],
	bogbody: ['dryskin' as ID, 'thickfat' as ID, 'unaware' as ID],
	unovawing: ['superluck' as ID, 'competitive' as ID, 'unburden' as ID],
	aevianwing: ['scrappy' as ID, 'rockhead' as ID, 'defiant' as ID],
	frostsiren: ['refrigerate' as ID, 'forewarn' as ID, 'dryskin' as ID],
	// Ultra Ego implements Mold Breaker's effect without delegating to the base Ability.
	ultraego: ['moldbreaker' as ID],
	relicarmor: ['selfsufficient' as ID],
	relicmishap: ['selfsufficient' as ID, 'waterabsorb' as ID, 'voltabsorb' as ID],
	apexpredator: ['relicarmor' as ID, 'precision' as ID, 'windrider' as ID],
	apexvenom: ['strongjaw' as ID, 'shedskin' as ID],
	venomarmor: ['poisonheal' as ID, 'dualwield' as ID],
	curseddoll: ['toughclaws' as ID, 'shadowshield' as ID],
	shadowguard: ['shadowtag' as ID],
	sandsovereign: ['dauntlessshield' as ID, 'solidrock' as ID],
	alloycore: ['magicguard' as ID, 'selfsufficient' as ID, 'stalwart' as ID],
	treasuretitan: ['filter' as ID, 'eartheater' as ID, 'heavymetal' as ID],
	supersweetsyrup: ['stickyhold' as ID],
	hydraheart: ['hydrabond' as ID, 'selfsufficient' as ID, 'stamina' as ID],
	sweetresonance: ['supersweetsyrup' as ID, 'selfsufficient' as ID, 'hydrabond' as ID],
	bakedbliss: ['wellbakedbody' as ID, 'thickfat' as ID, 'sweetveil' as ID, 'gluttony' as ID],
	sweetdecay: ['hustle' as ID, 'gluttony' as ID, 'sweetveil' as ID, 'corrosion' as ID],
	sweetsanctuary: ['friendguard' as ID, 'sweetveil' as ID, 'aromaveil' as ID, 'pastelveil' as ID],
	heatcoil: ['speedboost' as ID, 'magmaarmor' as ID, 'flamebody' as ID],
	wickedsnare: ['stakeout' as ID, 'tanglinghair' as ID, 'prankster' as ID],
	ancientbloom: ['effectspore' as ID, 'pollenbloom' as ID],
	fortressshell: ['shellarmor' as ID, 'waterbarrage' as ID],
	astralcore: ['purepower' as ID, 'naturalcure' as ID, 'illuminate' as ID],
	bloomingsun: ['megasol' as ID, 'invigorate' as ID, 'naturalcure' as ID],
	burningspirit: ['selfsufficient' as ID, 'opportunist' as ID, 'magmaarmor' as ID, 'filter' as ID],
	burningcrown: ['intimidate' as ID, 'moldbreaker' as ID, 'whitesmoke' as ID, 'wildfirecore' as ID],
	celestialheart: ['multiscale' as ID, 'soulheart' as ID],
	calderacore: ['magmaarmor' as ID, 'sheerforce' as ID, 'drought' as ID],
	doomwarning: ['magicbounce' as ID, 'magicguard' as ID],
	draconicforce: ['dragonize' as ID, 'strongjaw' as ID, 'moldbreaker' as ID],
	tidaljaw: ['strongjaw' as ID, 'swiftswim' as ID, 'filter' as ID],
	omenedge: ['sharpness' as ID, 'dualwield' as ID, 'pressure' as ID],
	ragingcurrent: ['proficient' as ID, 'swiftswim' as ID, 'damp' as ID, 'waterveil' as ID, 'dryskin' as ID, 'stamina' as ID],
	shadowcurrent: ['proficient' as ID, 'protean' as ID, 'technician' as ID, 'infiltrator' as ID, 'anticipation' as ID],
	relentlesshunt: ['levitate' as ID],
	dreadmaw: ['hugepower' as ID, 'strongjaw' as ID],
	freezerburn: ['slushrush' as ID, 'refrigerate' as ID],
	furnaceengine: ['steamengine' as ID, 'flamebody' as ID, 'selfsufficient' as ID],
	hisuianoath: ['swornduty' as ID, 'toughclaws' as ID, 'corrosion' as ID],
	aevianoath: ['swornduty' as ID, 'dualwield' as ID, 'battlearmor' as ID],
	moonlitwings: ['serenegrace' as ID],
	phalanxform: ['hydrabond' as ID, 'friendguard' as ID, 'battlearmor' as ID],
riotamp: ['proficient' as ID, 'galvanize' as ID, 'resonanceforce' as ID, 'voltabsorb' as ID],
	waterbubble: ['waterveil' as ID],
	requiem: ['cursedbody' as ID],
	reapersgrip: ['unaware' as ID, 'ironfist' as ID, 'darkaura' as ID, 'selfsufficient' as ID],
	ragingstorm: ['moldbreaker' as ID, 'battlearmor' as ID],
	ragingoverlord: ['ragingstorm' as ID, 'supremeoverlord' as ID],
	pendulumswing: ['insomnia' as ID, 'filter' as ID],
	fightingfiend: ['vitalspirit' as ID, 'multiscale' as ID],
	kickfiend: ['striker' as ID, 'violentrush' as ID, 'limber' as ID],
	punchfiend: ['ironfist' as ID, 'innerfocus' as ID, 'unseenfist' as ID],
	spinfiend: ['technician' as ID, 'vitalspirit' as ID],
	ultrainstinct: ['moldbreaker' as ID, 'innerfocus' as ID],
	hisuianpath: ['sapsipper' as ID, 'innerfocus' as ID, 'fluffy' as ID],
	hydratyrant: ['hydrabond' as ID, 'berserk' as ID, 'selfsufficient' as ID],
	blademastery: ['sharpness' as ID, 'superluck' as ID],
	goldentalons: ['stalwart' as ID, 'goodasgold' as ID, 'sharpness' as ID],
	toxicevolution: ['corrosion' as ID, 'dualwield' as ID, 'shielddust' as ID],
	parasitism: ['dryskin' as ID, 'magicguard' as ID],
	resuscitation: ['selfrepair' as ID, 'magicguard' as ID],
	spiralevolution: ['adaptability' as ID, 'levitate' as ID, 'dualwield' as ID, 'infiltrator' as ID, 'shielddust' as ID],
	venombastion: ['stamina' as ID],
	wrathshield: ['proficient' as ID, 'bulletproof' as ID, 'dauntlessshield' as ID, 'selfrepair' as ID],
	hellfireeclipse: ['solarpower' as ID, 'darkaura' as ID],
	islandcurrent: ['swiftswim' as ID, 'windrider' as ID],
	oceanicwings: ['waterabsorb' as ID, 'hydration' as ID, 'friendguard' as ID],
	ruinjaw: ['strongjaw' as ID, 'eartheater' as ID],
	stormfright: ['strongjaw' as ID],
	unstableevo: [
		'lightningrod' as ID, 'voltabsorb' as ID, 'soulfire' as ID, 'fluffy' as ID,
		'stormdrain' as ID, 'waterabsorb' as ID, 'pressure' as ID, 'innerfocus' as ID,
		'magicbounce' as ID, 'telepathy' as ID, 'icescales' as ID, 'slushrush' as ID,
		'chlorophyll' as ID, 'regenerator' as ID, 'friendguard' as ID, 'competitive' as ID,
		'filter' as ID, 'selfsufficient' as ID,
	],
	triplethreat: ['hydrabond' as ID, 'tangledfeet' as ID, 'sniper' as ID, 'bigpecks' as ID, 'keeneye' as ID],
	perfectstriker: ['striker' as ID, 'noguard' as ID, 'libero' as ID],
	strikersmomentum: ['striker' as ID, 'defiant' as ID, 'libero' as ID, 'noguard' as ID],
	heavyartillery: ['unaware' as ID, 'shellarmor' as ID],
	strikerfrenzy: ['striker' as ID, 'vitalspirit' as ID],
	venomveil: ['liquidooze' as ID, 'corrosion' as ID, 'waterveil' as ID],
	venomheal: ['hypercutter' as ID, 'poisonheal' as ID, 'poisonpoint' as ID],
	silkendecoy: ['insomnia' as ID, 'selfsufficient' as ID],
};
const CUSTOM_MOVE_UPDATE_IDS = Object.keys(CUSTOM_MOVE_UPDATES);
const CUSTOM_LEARNSET_REPLACEMENT_IDS = Object.keys(CUSTOM_LEARNSET_REPLACEMENTS);
Object.assign(CUSTOM_LEARNSET_ADDITIONS, {
	salamence: {bloodmoon: ['9M'], moongeistbeam: ['9M']},
	ursalunabloodmoon: {moongeistbeam: ['9M']},
	alakazam: {darkpulse: ['9M'], snarl: ['9M']},
	umbreon: {radiantassault: ['9M']},
	ariados: {
		darkestlariat: ['9M'], spikes: ['9M'], sonicboom: ['9M'], twineedle: ['9M'],
	},
	arbok: {
		nastyplot: ['9M'], psychicfangs: ['9M'], scaleshot: ['9M'], lashout: ['9M'], trailblaze: ['9M'],
		skittersmack: ['9M'], throatchop: ['9M'], stompingtantrum: ['9M'], mudbomb: ['9M'], earthpower: ['9M'],
		flamethrower: ['9M'], fireblast: ['9M'], overheat: ['9M'], heatwave: ['9M'], flameburst: ['9M'],
		fierydance: ['9M'], burningjealousy: ['9M'], firespin: ['9M'], firelash: ['9M'],
	},
	seviper: {
		fakeout: ['9M'], skittersmack: ['9M'], lashout: ['9M'],
	},
	zangoose: {
		aurasphere: ['9M'], crosspoison: ['9M'], fakeout: ['9M'], lashout: ['9M'],
		reversal: ['9M'], bulletpunch: ['9M'], smartstrike: ['9M'],
	},
	musharna: {
		drainingkiss: ['9L1'], leer: ['9L1'], scratch: ['9L1'], yawn: ['9L1'], assurance: ['9L1'],
		nightmare: ['9L1'], moonlight: ['9L1'], hypnosis: ['9L1'], nightslash: ['9L1'], slash: ['9L1'],
		playrough: ['9L1'], shadowclaw: ['9L1'], honeclaws: ['9L1'], throatchop: ['9L1'], lovelykiss: ['9L1'],
		glare: ['9L1'], assist: ['9E'], curse: ['9E'], disable: ['9E'], encore: ['9E'], meanlook: ['9E'],
		memento: ['9E'], nightshade: ['9E'], snore: ['9E'], sonicboom: ['9E'],
		aerialace: ['9M'], amnesia: ['9M'], aurasphere: ['9M'], batonpass: ['9M'], beatup: ['9M'], block: ['9M'], bodypress: ['9M'], bodyslam: ['9M'],
		breakingswipe: ['9M'], brutalswing: ['9M'], crosspoison: ['9M'], cut: ['9M'], darkestlariat: ['9M'],
		chargebeam: ['9M'], darkpulse: ['9M'], dazzlinggleam: ['9M'], dreameater: ['9M'], dualchop: ['9M'], eerieimpulse: ['9M'], explosion: ['9M'],
		faketears: ['9M'], falseswipe: ['9M'], fling: ['9M'], fly: ['9M'], foulplay: ['9M'], futuresight: ['9M'],
		gastroacid: ['9M'], gigaimpact: ['9M'], gravity: ['9M'], gyroball: ['9M'], hyperbeam: ['9M'], knockoff: ['9M'],
		laserfocus: ['9M'], lashout: ['9M'], leechlife: ['9M'], magiccoat: ['9M'], magicroom: ['9M'], mistyterrain: ['9M'],
		painsplit: ['9M'], payback: ['9M'], phantomforce: ['9M'], poisonjab: ['9M'], powergem: ['9M'], powerswap: ['9M'],
		psychic: ['9M'], psychocut: ['9M'], psychup: ['9M'], quash: ['9M'], rockclimb: ['9M'], rockslide: ['9M'],
		rocksmash: ['9M'], rocktomb: ['9M'], sandstorm: ['9M'], scaryface: ['9M'], screech: ['9M'], selfdestruct: ['9M'],
		shadowball: ['9M'], skillswap: ['9M'], smackdown: ['9M'], snarl: ['9M'], snatch: ['9M'], spite: ['9M'],
		storedpower: ['9M'], strength: ['9M'], swordsdance: ['9M'], suckerpunch: ['9M'], taunt: ['9M'], torment: ['9M'],
		trick: ['9M'], trickroom: ['9M'], uproar: ['9M'], venomdrench: ['9M'], waterpulse: ['9M'], willowisp: ['9M'],
		wonderroom: ['9M'], workup: ['9M'], worryseed: ['9M'], xscissor: ['9M'], zenheadbutt: ['9M'], snowscape: ['9M'],
	},
	mandibuzz: {
		bulkup: ['9M'], spikes: ['9M'], taunt: ['9M'], thief: ['9M'], toxic: ['9M'],
		whirlwind: ['9M'], icywind: ['9M'],
	},
	granbull: {
		highhorsepower: ['9M'], spiritbreak: ['9M'], stompingtantrum: ['9M'], suckerpunch: ['9M'],
		partingshot: ['9M'], closecombat: ['9M'], smellingsalts: ['9M'], brickbreak: ['9M'],
		leechlife: ['9M'], poweruppunch: ['9M'], wideguard: ['9M'],
	},
	druddigon: {
		accelerock: ['9M'], headsmash: ['9M'], flareblitz: ['9M'], dragondance: ['9M'],
		dragonrush: ['9M'], ragingfury: ['9M'], swordsdance: ['9M'],
	},
	lycanroc: {accelerock: ['9M']},
	lycanrocmidday: {accelerock: ['9M']},
	lycanrocmidnight: {accelerock: ['9M']},
	lycanrocdusk: {accelerock: ['9M']},
	gligar: {barbbarrage: ['9M']},
	gliscor: {
		barbbarrage: ['9M'], poisonfang: ['9M'], toxicthread: ['9M'], sludgewave: ['9M'],
		clearsmog: ['9M'], poisonjab: ['9M'], poisontail: ['9M'], venomdrench: ['9M'],
	},
	rotomheat: {
		flameburst: ['9M'], blazingtorque: ['9M'], fireblast: ['9M'], flamethrower: ['9M'], willowisp: ['9M'],
	},
	rotomwash: {
		splishysplash: ['9M'], surf: ['9M'],
	},
	rotomfrost: {
		freezyfrost: ['9M'], frostbreath: ['9M'], icebeam: ['9M'],
	},
	rotomfan: {
		razorwind: ['9M'], aircutter: ['9M'], hurricane: ['9M'],
	},
	rotommow: {
		leechseed: ['9M'], energyball: ['9M'], gigadrain: ['9M'],
	},
});
const DOCUMENT_LEARNSET_ADDITIONS: {[id: string]: {[id: string]: string[]}} = {
	abomasnow: {coldsnap: ["9M"], icehammer: ["9L1"]},
	absol: {phantomforce: ["9M"], shadowsneak: ["9L1"]},
	accelgor: {fakeout: ["9M"], mudslap: ["9M"]},
	aegislash: {doublehit: ["9M"], poltergeist: ["9M"], zenheadbutt: ["9M"]},
	aggron: {bulletpunch: ["9M"], magnetbomb: ["9M"], scorchingsands: ["9M"]},
	alakazam: {hypnosis: ["9M"]},
	alomomola: {bodypress: ["9M"], muddywater: ["9M"], powerswap: ["9M"], razorshell: ["9M"]},
	altaria: {coldsnap: ["9M"], petaldance: ["9M"]},
	ambipom: {assurance: ["9M"], aurasphere: ["9M"], axekick: ["9M"], beatup: ["9M"], bodyslam: ["9M"], breakingswipe: ["9M"], bulkup: ["9M"], closecombat: ["9M"], cometpunch: ["9M"], crosschop: ["9M"], curse: ["9M"], defensecurl: ["9M"], drainpunch: ["9M"], doubleslap: ["9M"], dynamicpunch: ["9M"], forcepalm: ["9M"], focusblast: ["9M"], focuspunch: ["9M"], hammerarm: ["9M"], karatechop: ["9M"], machpunch: ["9M"], megakick: ["9M"], megapunch: ["9M"], mimic: ["9M"], nastyplot: ["9M"], nightmare: ["9M"], seismictoss: ["9M"], swordsdance: ["9M"], tailslap: ["9M"], triattack: ["9M"], vacuumwave: ["9M"], victorydance: ["9M"], zapcannon: ["9M"]},
	amoonguss: {dazzlinggleam: ["9M"], defensecurl: ["9M"], firstimpression: ["9M"], rollout: ["9M"], toxicspikes: ["9M"]},
	ampharos: {charm: ["9M"], cometpunch: ["9M"], flashcannon: ["9M"], paraboliccharge: ["9L1"], risingvoltage: ["9M"]},
	annihilape: {aerialace: ["9M"], beatup: ["9M"], bide: ["9M"], blazekick: ["9M"], burningjealousy: ["9M"], covet: ["9M"], darkestlariat: ["9M"], defensecurl: ["9M"], detect: ["9M"], dualchop: ["9M"], dynamicpunch: ["9M"], headbutt: ["9M"], honeclaws: ["9M"], irontail: ["9M"], knockoff: ["9M"], megakick: ["9M"], megapunch: ["9M"], mimic: ["9M"], mudslap: ["9M"], payback: ["9M"], payday: ["9M"], poweruppunch: ["9M"], psychup: ["9M"], rage: ["9M"], retaliate: ["9M"], revenge: ["9M"], roar: ["9M"], rockclimb: ["9M"], rocksmash: ["9M"], roleplay: ["9M"], skullbash: ["9M"], strength: ["9M"], superpower: ["9M"], workup: ["9M"]},
	appletun: {naturepower: ["9M"], suckerpunch: ["9M"], twister: ["9L1"]},
	araquanid: {watersport: ["9L1"]},
	arbok: {beatup: ["9M"], corrosivegas: ["9M"], crosspoison: ["9M"], fakeout: ["9M"], nastyplot: ["9M"], venomdrench: ["9M"]},
	arboliva: {naturepower: ["9M"], synthesis: ["9M"]},
	archaludon: {laserfocus: ["9M"], screech: ["9M"], steelroller: ["9M"], stompingtantrum: ["9M"], strength: ["9M"]},
	archeops: {bite: ["9M"], switcheroo: ["9M"]},
	arctozolt: {coldsnap: ["9M"]},
	ariados: {darkestlariat: ["9M"], firstimpression: ["9L1"], megahorn: ["9M"], spikes: ["9M"]},
	armarouge: {burnup: ["9L1"]},
	aromatisse: {healblock: ["9M"], hypnosis: ["9L1"]},
	audino: {triattack: ["9M"]},
	aurorus: {coldsnap: ["9M"], icehammer: ["9L1"]},
	avalugg: {coldsnap: ["9M"]},
	banette: {ancientpower: ["9M"], astonish: ["9L1"], bittermalice: ["9M"], eeriespell: ["9M"], fakeout: ["9M"], flashcannon: ["9M"], healblock: ["9M"], iciclespear: ["9M"], magnetbomb: ["9M"], mirrorshot: ["9M"], playrough: ["9M"], psychocut: ["9M"], shadowpunch: ["9M"], slash: ["9M"], vacuumwave: ["9M"], xscissor: ["9M"], zenheadbutt: ["9M"]},
	barbaracle: {closecombat: ["9M"], cometpunch: ["9M"], doublehit: ["9M"], powergem: ["9M"], waterfall: ["9M"]},
	bastiodon: {firefang: ["9M"], guardsplit: ["9M"], icefang: ["9M"], screech: ["9M"], thunderfang: ["9M"]},
	baxcalibur: {aquatail: ["9M"], coldsnap: ["9M"], hail: ["9M"], icehammer: ["9L1"], psychicfangs: ["9M"]},
	beartic: {coldsnap: ["9M"]},
	beautifly: {airslash: ["9M"], charm: ["9M"], drainingkiss: ["9M"], dualwingbeat: ["9M"], harden: ["9L1"], hurricane: ["9M"], imprison: ["9M"], leechlife: ["9L1"], magicalleaf: ["9M"], poisonsting: ["9L1"], pollenpuff: ["9M"], skittersmack: ["9M"], tackle: ["9L1"]},
	beedrill: {airslash: ["9M"], beatup: ["9M"], bugbuzz: ["9M"], crosspoison: ["9M"], doublehit: ["9M"], dualwingbeat: ["9M"], harden: ["9L1"], lunge: ["9M"], megahorn: ["9M"], poisonsting: ["9L1"], skittersmack: ["9M"], venomdrench: ["9M"]},
	bellossom: {bide: ["9M"], headbutt: ["9M"], leechseed: ["9L1"], rage: ["9M"], takedown: ["9M"]},
	bewear: {defensecurl: ["9M"], playrough: ["9M"], rollout: ["9M"]},
	bibarel: {bodyslam: ["9M"], hydropump: ["9M"], icefang: ["9M"], psychicfangs: ["9M"], razorshell: ["9M"], thunderfang: ["9M"]},
	blastoise: {block: ["9M"], celebrate: ["9M"], ironhead: ["9M"]},
	blaziken: {drainpunch: ["9M"]},
	blissey: {babydolleyes: ["9M"], bide: ["9M"], bubblebeam: ["9M"], celebrate: ["9M"], drainingkiss: ["9M"], psywave: ["9M"], rage: ["9M"], skullbash: ["9M"], submission: ["9M"], sweetscent: ["9M"], teleport: ["9M"], watergun: ["9M"], wish: ["9L1"]},
	boltund: {fakeout: ["9M"], icefang: ["9M"]},
	brambleghast: {beatup: ["9M"], block: ["9M"], naturepower: ["9M"]},
	braviary: {ominouswind: ["9M"], twister: ["9M"]},
	breloom: {barbbarrage: ["9M"], coaching: ["9M"]},
	brutebonnet: {naturepower: ["9M"]},
	bruxish: {bodyslam: ["9M"], drainingkiss: ["9M"], storedpower: ["9M"]},
	butterfree: {dazzlinggleam: ["9M"], poisongas: ["9L1"], sludge: ["9M"], sludgebomb: ["9M"], sludgewave: ["9M"], venomdrench: ["9M"]},
	cacturne: {assurance: ["9M"], scorchingsands: ["9M"]},
	camerupt: {ancientpower: ["9M"], burningjealousy: ["9M"], powergem: ["9M"], terrainpulse: ["9M"]},
	carbink: {magnetbomb: ["9M"], selfdestruct: ["9M"]},
	carnivine: {assurance: ["9M"], darkestlariat: ["9M"], grassyterrain: ["9M"], lashout: ["9M"], skittersmack: ["9M"]},
	castform: {bleakwindstorm: ["9L1"], coldsnap: ["9M"], muddywater: ["9M"], mudslap: ["9L1"], mysticalfire: ["9M"], nastyplot: ["9M"], powergem: ["9L1"], sandsearstorm: ["9L1"], scorchingsands: ["9L1"], terrainpulse: ["9M"], thundershock: ["9L1"], triattack: ["9M"], wildboltstorm: ["9L1"]},
	ceruledge: {burnup: ["9L1"]},
	cetitan: {coldsnap: ["9M"], hail: ["9M"], superpower: ["9M"]},
	chandelure: {healblock: ["9M"]},
	charizard: {ancientpower: ["9M"], block: ["9M"], celebrate: ["9M"], howl: ["9L1"], quickattack: ["9L1"]},
	chatot: {airslash: ["9M"], bravebird: ["9M"], charm: ["9M"], dualwingbeat: ["9M"], hurricane: ["9M"], partingshot: ["9L1"], screech: ["9M"]},
	chesnaught: {defensecurl: ["9M"], focusenergy: ["9M"], headbutt: ["9M"], heavyslam: ["9M"], megakick: ["9M"], megapunch: ["9M"], revenge: ["9M"], skullbash: ["9M"], solarblade: ["9M"]},
	chimecho: {amnesia: ["9M"], boomburst: ["9L1"], flashcannon: ["9M"], guardswap: ["9M"], meteorbeam: ["9M"], powerswap: ["9M"], speedswap: ["9M"], waterpulse: ["9M"]},
	cinccino: {fakeout: ["9M"]},
	cinderace: {suckerpunch: ["9M"]},
	clefable: {airslash: ["9M"], babydolleyes: ["9M"], coldsnap: ["9M"], healblock: ["9M"]},
	clodsire: {afteryou: ["9M"], aquatail: ["9M"], encore: ["9M"], flash: ["9M"], gastroacid: ["9M"], irontail: ["9M"], mimic: ["9M"], rocksmash: ["9M"], rollout: ["9M"], whirlpool: ["9M"]},
	cloyster: {coldsnap: ["9M"]},
	cofagrigus: {icywind: ["9M"], nightmare: ["9M"], partingshot: ["9L1"], psyshock: ["9M"], stealthrock: ["9M"], thunderwave: ["9M"]},
	conkeldurr: {machpunch: ["9M"]},
	crabominable: {assurance: ["9M"], beatup: ["9M"], firstimpression: ["9M"], iciclespear: ["9M"], machpunch: ["9L1"], megapunch: ["9M"], retaliate: ["9M"], taunt: ["9M"], visegrip: ["9L1"]},
	crobat: {bide: ["9M"], feintattack: ["9M"], headbutt: ["9M"], hypnosis: ["9M"], knockoff: ["9M"], megadrain: ["9M"], nightslash: ["9M"], psychicfangs: ["9M"], rage: ["9M"], razorwind: ["9M"], takedown: ["9M"], whirlwind: ["9M"]},
	cryogonal: {coldsnap: ["9M"]},
	cursola: {mimic: ["9M"]},
	cyclizar: {fakeout: ["9M"], flamecharge: ["9M"]},
	dachsbun: {flamecharge: ["9M"], seedbomb: ["9M"]},
	dedenne: {fakeout: ["9M"], magnetbomb: ["9M"]},
	delcatty: {agility: ["9M"], assist: ["9L1"], babydolleyes: ["9L1"], beatup: ["9M"], burningjealousy: ["9M"], charm: ["9M"], copycat: ["9L1"], disarmingvoice: ["9L1"], drainingkiss: ["9M"], faketears: ["9M"], firefang: ["9M"], highhorsepower: ["9M"], icefang: ["9M"], lashout: ["9M"], nastyplot: ["9M"], playrough: ["9M"], powerswap: ["9M"], psychicfangs: ["9M"], tackle: ["9L1"], tailwhip: ["9L1"], thunderfang: ["9M"], tripleaxel: ["9M"]},
	delibird: {coldsnap: ["9M"]},
	delphox: {chargebeam: ["9M"], fakeout: ["9M"], hypnosis: ["9M"], powerswap: ["9M"], wish: ["9M"]},
	dewgong: {coldsnap: ["9M"], icefang: ["9M"], razorshell: ["9M"]},
	diggersby: {circlethrow: ["9M"], cometpunch: ["9M"], defensecurl: ["9M"], drainpunch: ["9M"], rollout: ["9M"], skullbash: ["9M"]},
	ditto: {attract: ["9M"], captivate: ["9M"], confide: ["9M"], doubleteam: ["9M"], endure: ["9M"], facade: ["9M"], frustration: ["9M"], hiddenpower: ["9M"], naturalgift: ["9M"], protect: ["9M"], rest: ["9M"], return: ["9M"], round: ["9M"], secretpower: ["9M"], sleeptalk: ["9M"], snore: ["9M"], substitute: ["9M"], swagger: ["9M"], toxic: ["9M"]},
	dodrio: {airslash: ["9M"], assurance: ["9M"], beatup: ["9M"], blazekick: ["9M"], feintattack: ["9M"], furyswipes: ["9L1"], lashout: ["9M"], megakick: ["9M"], revenge: ["9M"]},
	dondozo: {irontail: ["9M"], whirlpool: ["9M"]},
	donphan: {darkestlariat: ["9M"], tackle: ["9L1"]},
	dragalge: {poisonjab: ["9M"]},
	dragonite: {vacuumwave: ["9M"], whirlwind: ["9M"]},
	drampa: {bodyslam: ["9M"], chargebeam: ["9M"], earthpower: ["9M"], triattack: ["9M"], whirlwind: ["9M"]},
	drapion: {gunkshot: ["9M"]},
	drifblim: {coldsnap: ["9M"], firepledge: ["9M"], flamethrower: ["9M"], heatwave: ["9M"], mysticalfire: ["9M"]},
	dudunsparce: {aquatail: ["9M"], bind: ["9M"], bite: ["9M"], chargebeam: ["9M"], counter: ["9M"], dreameater: ["9M"], headbutt: ["9M"], incinerate: ["9M"], irontail: ["9M"], lastresort: ["9M"], magiccoat: ["9M"], mimic: ["9M"], nightmare: ["9M"], retaliate: ["9M"], rocksmash: ["9M"], selfdestruct: ["9M"], shockwave: ["9M"], strength: ["9M"], terrainpulse: ["9M"], thunderwave: ["9M"], waterpulse: ["9M"], zapcannon: ["9M"]},
	dugtrio: {ancientpower: ["9M"], fakeout: ["9M"], feintattack: ["9M"]},
	durant: {lunge: ["9M"]},
	dustox: {airslash: ["9M"], corrosivegas: ["9M"], crosspoison: ["9M"], dualwingbeat: ["9M"], extrasensory: ["9L1"], harden: ["9L1"], hex: ["9M"], hurricane: ["9M"], leechlife: ["9L1"], nastyplot: ["9M"], poisonsting: ["9L1"], scaleshot: ["9M"], scaryface: ["9M"], skittersmack: ["9M"], tackle: ["9L1"], venomdrench: ["9M"]},
	eelektross: {cometpunch: ["9M"], corrosivegas: ["9M"], megapunch: ["9M"], poisonfang: ["9M"], psychicfangs: ["9M"], risingvoltage: ["9M"], venomdrench: ["9M"], waterfall: ["9M"]},
	eldegoss: {naturepower: ["9M"]},
	electivire: {bide: ["9M"], bulletpunch: ["9M"], counter: ["9M"], curse: ["9M"], detect: ["9M"], dynamicpunch: ["9M"], mimic: ["9M"], psywave: ["9M"], rage: ["9M"], seismictoss: ["9M"], skullbash: ["9M"], submission: ["9M"], teleport: ["9M"], zapcannon: ["9M"]},
	electrode: {risingvoltage: ["9M"], speedswap: ["9M"]},
	emboar: {burningjealousy: ["9M"], circlethrow: ["9M"], cometpunch: ["9M"], flamewheel: ["9L1"], scorchingsands: ["9M"], stormthrow: ["9M"], suckerpunch: ["9M"], vacuumwave: ["9M"]},
	empoleon: {iciclespear: ["9M"], sing: ["9L1"]},
	escavalier: {bulletpunch: ["9M"], counter: ["9M"], feintattack: ["9M"]},
	espathra: {allyswitch: ["9M"], roost: ["9M"]},
	espeon: {bide: ["9M"], fakeout: ["9M"], glitzyglow: ["9L1"], healblock: ["9M"], rage: ["9M"], safeguard: ["9M"], sing: ["9L1"], skullbash: ["9M"]},
	excadrill: {agility: ["9M"], megahorn: ["9M"], skullbash: ["9M"]},
	exeggutor: {sweetscent: ["9M"], wish: ["9L1"]},
	exploud: {overdrive: ["9L1"], snarl: ["9M"]},
	farigiraf: {allyswitch: ["9M"], dreameater: ["9M"], echoedvoice: ["9M"], flash: ["9M"], headbutt: ["9M"], magiccoat: ["9M"], mimic: ["9M"], mudslap: ["9M"], nightmare: ["9M"], odorsleuth: ["9L1"], recycle: ["9M"], retaliate: ["9M"], rocksmash: ["9M"], shockwave: ["9M"], signalbeam: ["9M"], strength: ["9M"], suckerpunch: ["9M"], telekinesis: ["9M"], workup: ["9M"], zapcannon: ["9M"]},
	fearow: {airslash: ["9M"], batonpass: ["9M"], bravebird: ["9M"], dualwingbeat: ["9M"], featherdance: ["9M"], feintattack: ["9M"], hurricane: ["9M"], scaryface: ["9M"]},
	feraligatr: {iciclespear: ["9M"], razorshell: ["9M"], razorwind: ["9M"], revenge: ["9M"]},
	ferrothorn: {bodyslam: ["9M"]},
	flamigo: {brickbreak: ["9M"], knockoff: ["9M"], tripleaxel: ["9M"], waterfall: ["9M"], whirlwind: ["9M"]},
	flapple: {naturepower: ["9M"], suckerpunch: ["9M"]},
	flareon: {flamewheel: ["9L1"], sing: ["9L1"], sizzlyslide: ["9L1"], swordsdance: ["9M"], taunt: ["9M"]},
	floatzel: {assurance: ["9M"], fakeout: ["9M"], iciclespear: ["9M"], megapunch: ["9M"], psychicfangs: ["9M"], razorshell: ["9M"], tackle: ["9L1"], tailslap: ["9M"], tripleaxel: ["9M"]},
	florges: {tearfullook: ["9M"]},
	forretress: {darkestlariat: ["9M"], pinmissile: ["9M"], steelroller: ["9M"]},
	froslass: {coldsnap: ["9M"], defensecurl: ["9M"], doubleedge: ["9M"], fakeout: ["9M"], healblock: ["9M"], mimic: ["9M"], nastyplot: ["9M"], petaldance: ["9M"]},
	furfrou: {bodyslam: ["9M"], crunch: ["9M"], doubleedge: ["9M"], doublehit: ["9M"], firefang: ["9M"], hyperbeam: ["9M"], icefang: ["9M"], playrough: ["9M"], skullbash: ["9M"], tailslap: ["9L1"], thunderfang: ["9M"]},
	furret: {assurance: ["9M"], fakeout: ["9M"], focusenergy: ["9M"], megapunch: ["9M"], payday: ["9M"], skittersmack: ["9M"], tailslap: ["9M"], tidyup: ["9L1"]},
	gallade: {cometpunch: ["9M"], defensecurl: ["9M"], doubleedge: ["9M"], mimic: ["9M"], nightmare: ["9M"]},
	galvantula: {acidarmor: ["9L1"], feintattack: ["9M"]},
	garbodor: {bulletseed: ["9M"], healblock: ["9M"], magnetbomb: ["9M"], poisonjab: ["9M"], rollout: ["9M"]},
	garchomp: {nastyplot: ["9M"], vacuumwave: ["9M"]},
	gardevoir: {icebeam: ["9M"], spiritbreak: ["9L1"]},
	garganacl: {ancientpower: ["9M"], dynamicpunch: ["9M"]},
	gengar: {shadowsneak: ["9L1"]},
	gholdengo: {surf: ["9M"]},
	glaceon: {bide: ["9M"], coldsnap: ["9M"], detect: ["9M"], freezyfrost: ["9L1"], rage: ["9M"], sing: ["9L1"], skullbash: ["9M"], taunt: ["9M"]},
	glalie: {coldsnap: ["9M"], fakeout: ["9M"], hypervoice: ["9M"], skullbash: ["9M"]},
	glimmora: {explosion: ["9M"], naturepower: ["9M"]},
	gliscor: {airslash: ["9M"], beatup: ["9M"], crosspoison: ["9M"], darkestlariat: ["9M"], lashout: ["9M"], pinmissile: ["9M"], powerwhip: ["9M"], scorchingsands: ["9M"]},
	gogoat: {assurance: ["9M"], bodypress: ["9M"], charm: ["9M"], defensecurl: ["9M"], megahorn: ["9M"], megakick: ["9M"], rollout: ["9M"], skullbash: ["9M"], solarblade: ["9M"]},
	golduck: {
		hypnosis: ["9M"], triattack: ["9M"], simplebeam: ["9M"], weatherball: ["9M"],
		futuresight: ["9M"], meditate: ["9M"], miracleeye: ["9M"], twinbeam: ["9M"], barrier: ["9M"],
		kinesis: ["9M"], agility: ["9M"], aurasphere: ["9M"], aurorabeam: ["9M"], blizzard: ["9M"],
		calmmind: ["9M"], bulkup: ["9M"], skullbash: ["9M"], disable: ["9M"], encore: ["9M"],
		eeriespell: ["9M"], flipturn: ["9M"], shockwave: ["9M"], chargebeam: ["9M"], zapcannon: ["9M"],
		psychicnoise: ["9M"], topsyturvy: ["9M"], nastyplot: ["9M"], powergem: ["9M"],
	},
	golem: {meteorbeam: ["9M"], powergem: ["9M"]},
	golisopod: {agility: ["9M"], gunkshot: ["9M"], nightslash: ["9L1"], rollout: ["9M"], uturn: ["9M"]},
	golurk: {bulletpunch: ["9M"], headlongrush: ["9L1"], ironhead: ["9M"], machpunch: ["9M"], suckerpunch: ["9M"]},
	goodra: {counter: ["9M"], gigadrain: ["9M"]},
	gorebyss: {charm: ["9M"], flipturn: ["9M"], irondefense: ["9L1"], muddywater: ["9M"], playrough: ["9M"], razorshell: ["9M"], shellsmash: ["9L1"], watergun: ["9L1"]},
	gothitelle: {fakeout: ["9M"]},
	gougingfire: {bodypress: ["9M"], helpinghand: ["9M"], mimic: ["9M"]},
	gourgeist: {curse: ["9M"], firespin: ["9M"], hypnosis: ["9L1"], selfdestruct: ["9M"], shadowclaw: ["9M"]},
	grafaiai: {crosspoison: ["9M"], fakeout: ["9M"], firstimpression: ["9M"], hyperbeam: ["9M"], lightscreen: ["9M"], reflect: ["9M"], seedbomb: ["9M"], toxicspikes: ["9M"]},
	granbull: {agility: ["9M"], assurance: ["9M"], beatup: ["9M"]},
	grapploct: {bulletpunch: ["9M"], machpunch: ["9M"]},
	greedent: {fakeout: ["9M"]},
	greninja: {flipturn: ["9M"], muddywater: ["9M"], nastyplot: ["9M"], psyshock: ["9M"], vacuumwave: ["9M"], whirlpool: ["9M"]},
	grumpig: {fakeout: ["9M"], hypnosis: ["9L1"]},
	gumshoos: {assurance: ["9M"], coaching: ["9M"], playrough: ["9M"], revenge: ["9M"]},
	gyarados: {celebrate: ["9M"], dragonrush: ["9L1"], focusenergy: ["9M"], happyhour: ["9M"]},
	hariyama: {bulletpunch: ["9M"], darkestlariat: ["9M"], highhorsepower: ["9M"], machpunch: ["9M"]},
	hawlucha: {bulletpunch: ["9M"], cometpunch: ["9M"], skullbash: ["9M"]},
	haxorus: {counter: ["9M"], dragonrush: ["9L1"], razorwind: ["9M"]},
	heliolisk: {morningsun: ["9L1"], seedbomb: ["9M"], shedtail: ["9L1"]},
	heracross: {circlethrow: ["9M"], encore: ["9M"], mudshot: ["9M"], outrage: ["9M"], sandtomb: ["9M"], skullbash: ["9M"]},
	hitmonchan: {icespinner: ["9M"], meditate: ["9L1"]},
	hitmonlee: {bulletpunch: ["9M"], machpunch: ["9M"]},
	hitmontop: {bulletpunch: ["9M"], machpunch: ["9M"], meditate: ["9L1"]},
	honchkrow: {assurance: ["9M"], curse: ["9M"], detect: ["9M"], mimic: ["9M"], nightmare: ["9M"], screech: ["9M"]},
	houndoom: {agility: ["9M"], hex: ["9M"], mysticalfire: ["9M"], scorchingsands: ["9M"]},
	houndstone: {allyswitch: ["9M"], seedbomb: ["9M"], shadowclaw: ["9M"], workup: ["9M"], zenheadbutt: ["9M"]},
	huntail: {breakingswipe: ["9M"], flipturn: ["9M"], irondefense: ["9L1"], muddywater: ["9M"], razorshell: ["9M"], shellsmash: ["9L1"], thunderfang: ["9M"], watergun: ["9L1"]},
	hydrapple: {helpinghand: ["9M"], mimic: ["9M"], naturepower: ["9M"], rollout: ["9M"], suckerpunch: ["9M"]},
	hydreigon: {dualchop: ["9L1"]},
	hypno: {bellydrum: ["9L1"], guardswap: ["9M"], mysticalfire: ["9M"], psychocut: ["9M"], wish: ["9L1"]},
	illumise: {chillingwater: ["9M"], fakeout: ["9M"], magicalleaf: ["9M"], pollenpuff: ["9M"], powergem: ["9M"]},
	indeedee: {batonpass: ["9M"], chargebeam: ["9M"], followme: ["9M"], guardsplit: ["9M"], healpulse: ["9M"], heatwave: ["9M"], moonblast: ["9M"], moonlight: ["9M"], sing: ["9M"], vacuumwave: ["9M"], wish: ["9M"]},
	infernape: {beatup: ["9M"], megakick: ["9M"], megapunch: ["9M"], revenge: ["9M"]},
	inteleon: {fakeout: ["9M"]},
	ironboulder: {helpinghand: ["9M"], mimic: ["9M"]},
	ironbundle: {airslash: ["9M"], coldsnap: ["9M"], hail: ["9M"]},
	ironcrown: {helpinghand: ["9M"], mimic: ["9M"]},
	ironhands: {bulletpunch: ["9M"]},
	ironleaves: {naturepower: ["9M"]},
	ironvaliant: {bulletpunch: ["9M"]},
	jellicent: {constrict: ["9M"]},
	jolteon: {buzzybuzz: ["9L1"], sing: ["9L1"]},
	jumpluff: {agility: ["9M"], airslash: ["9M"], amnesia: ["9M"], leafblade: ["9M"], naturepower: ["9M"]},
	jynx: {coldsnap: ["9M"], fakeout: ["9M"]},
	kabutops: {aquacutter: ["9L1"]},
	kecleon: {breakingswipe: ["9M"], conversion: ["9L1"], conversion2: ["9L1"], darkestlariat: ["9M"], detect: ["9L1"], firstimpression: ["9M"], gigaimpact: ["9M"], powerwhip: ["9M"], psychicfangs: ["9M"], scaleshot: ["9M"], shedtail: ["9L1"], skittersmack: ["9M"], terrainpulse: ["9M"]},
	kingambit: {beatup: ["9M"], cut: ["9M"], dualchop: ["9M"], embargo: ["9M"], feintattack: ["9M"], honeclaws: ["9M"], knockoff: ["9M"], laserfocus: ["9M"], magnetrise: ["9M"], payback: ["9M"], poweruppunch: ["9M"], psychocut: ["9M"], revenge: ["9M"], rockpolish: ["9M"], rocksmash: ["9M"], roleplay: ["9M"], screech: ["9M"], snatch: ["9M"], suckerpunch: ["9M"], upperhand: ["9M"]},
	kingdra: {bide: ["9M"], dragonrage: ["9M"], rage: ["9M"], razorwind: ["9M"], skullbash: ["9M"]},
	klefki: {futuresight: ["9M"], magnetbomb: ["9M"]},
	komala: {dig: ["9M"], leafblade: ["9M"], retaliate: ["9M"], revenge: ["9M"]},
	kommoo: {counter: ["9M"]},
	kricketune: {breakingswipe: ["9M"], darkestlariat: ["9M"]},
	krookodile: {ironhead: ["9M"]},
	lapras: {coldsnap: ["9M"]},
	leafeon: {bide: ["9M"], detect: ["9M"], petaldance: ["9M"], rage: ["9M"], sappyseed: ["9L1"], sing: ["9L1"], skullbash: ["9M"], taunt: ["9M"]},
	leavanny: {leechlife: ["9M"], screech: ["9M"], solarblade: ["9M"]},
	ledian: {bulletpunch: ["9M"], closecombat: ["9M"], dualwingbeat: ["9M"], focusenergy: ["9M"], lunge: ["9L1"], pounce: ["9L1"], skittersmack: ["9M"]},
	lickilicky: {bide: ["9M"], bubblebeam: ["9M"], counter: ["9M"], curse: ["9M"], doubleedge: ["9M"], dynamicpunch: ["9M"], fissure: ["9M"], healbell: ["9M"], iceball: ["9M"], mimic: ["9M"], nightmare: ["9M"], rage: ["9M"], seismictoss: ["9M"], skullbash: ["9M"], submission: ["9M"], takedown: ["9M"], watergun: ["9M"], wish: ["9L1"]},
	liepard: {agility: ["9M"], crunch: ["9M"], firefang: ["9M"], firstimpression: ["9M"], icefang: ["9M"], partingshot: ["9L1"], psychicfangs: ["9M"], swordsdance: ["9M"], thunderfang: ["9M"], xscissor: ["9M"]},
	lokix: {fakeout: ["9M"], feintattack: ["9M"], furycutter: ["9M"], hyperbeam: ["9M"], pursuit: ["9M"], quickattack: ["9M"]},
	lopunny: {circlethrow: ["9M"], cometpunch: ["9M"], cottonguard: ["9L1"], doublehit: ["9M"], drainingkiss: ["9M"], dynamicpunch: ["9M"], fakeout: ["9M"], machpunch: ["9M"], swordsdance: ["9M"]},
	lucario: {bite: ["9M"], circlethrow: ["9M"], machpunch: ["9M"]},
	lumineon: {faketears: ["9M"], hurricane: ["9M"], muddywater: ["9M"], skittersmack: ["9M"]},
	lunatone: {coldsnap: ["9M"], dazzlinggleam: ["9M"]},
	luvdisc: {encore: ["9M"], expandingforce: ["9M"], faketears: ["9M"], mistyterrain: ["9M"], speedswap: ["9M"], terrainpulse: ["9M"]},
	lycanroc: {happyhour: ["9M"]},
	mabosstiff: {knockoff: ["9M"], lunge: ["9M"], retaliate: ["9M"], seedbomb: ["9M"]},
	machamp: {bulletpunch: ["9M"], cometpunch: ["9M"], drainpunch: ["9M"], machpunch: ["9M"], stormthrow: ["9M"]},
	magcargo: {meteorbeam: ["9M"], mysticalfire: ["9M"]},
	magmortar: {bide: ["9M"], counter: ["9M"], detect: ["9M"], dynamicpunch: ["9M"], machpunch: ["9M"], mimic: ["9M"], psywave: ["9M"], rage: ["9M"], seismictoss: ["9M"], skullbash: ["9M"], submission: ["9M"], teleport: ["9M"]},
	magnezone: {bide: ["9M"], curse: ["9M"], headbutt: ["9M"], mimic: ["9M"], rage: ["9M"], teleport: ["9M"]},
	malamar: {bulkup: ["9M"], circlethrow: ["9M"], closecombat: ["9M"], cometpunch: ["9M"], doublehit: ["9M"], healblock: ["9M"], octolock: ["9L1"], poisonjab: ["9M"], stealthrock: ["9M"], zenheadbutt: ["9M"]},
	mamoswine: {coldsnap: ["9M"], defensecurl: ["9M"], detect: ["9M"], mimic: ["9M"]},
	manectric: {flamecharge: ["9M"], trailblaze: ["9M"]},
	marowak: {ancientpower: ["9M"], bodypress: ["9M"], bulkup: ["9M"], closecombat: ["9M"], revenge: ["9M"], superpower: ["9M"]},
	masquerain: {flipturn: ["9M"]},
	maushold: {afteryou: ["9M"]},
	mawile: {dazzlinggleam: ["9M"]},
	medicham: {agility: ["9M"], blazekick: ["9M"], bulletpunch: ["9M"], coaching: ["9M"], cometpunch: ["9M"], focusenergy: ["9M"], guardswap: ["9M"], machpunch: ["9M"], powerswap: ["9M"], terrainpulse: ["9M"]},
	meganium: {dazzlinggleam: ["9M"], earthpower: ["9M"], leafage: ["9L1"], leafblade: ["9M"], powder: ["9L1"]},
	meowscarada: {allyswitch: ["9M"], fakeout: ["9M"], feintattack: ["9M"], naturepower: ["9M"], suckerpunch: ["9M"]},
	meowstic: {healblock: ["9M"], moonblast: ["9M"], spikes: ["9M"], stealthrock: ["9M"], taunt: ["9M"], teleport: ["9M"], toxicspikes: ["9M"], triattack: ["9M"], wish: ["9M"]},
	metagross: {cometpunch: ["9M"], magnetbomb: ["9M"], refresh: ["9L1"], shadowpunch: ["9M"], skullbash: ["9M"]},
	mightyena: {agility: ["9M"], beatup: ["9M"], burningjealousy: ["9M"], closecombat: ["9M"], faketears: ["9M"]},
	milotic: {calmmind: ["9M"], dazzlinggleam: ["9M"], liquidation: ["9M"]},
	mimikyu: {fakeout: ["9M"], nightslash: ["9L1"], poltergeist: ["9M"]},
	minior: {spikes: ["9M"]},
	minun: {drainingkiss: ["9M"], eerieimpulse: ["9M"], guardswap: ["9M"], hex: ["9M"], risingvoltage: ["9M"], screech: ["9M"], terrainpulse: ["9M"]},
	mismagius: {defensecurl: ["9M"], doubleedge: ["9M"], mimic: ["9M"], nightmare: ["9M"], zapcannon: ["9M"]},
	mothim: {pollenpuff: ["9M"]},
	muk: {corrosivegas: ["9M"], megapunch: ["9M"]},
	musharna: {nightmare: ["9M"], triattack: ["9M"]},
	nidoking: {bulletpunch: ["9M"], heavyslam: ["9M"], ironhead: ["9M"], metalclaw: ["9M"]},
	nidoqueen: {suckerpunch: ["9M"]},
	ninetales: {babydolleyes: ["9M"], celebrate: ["9M"], feintattack: ["9M"]},
	ninjask: {sonicboom: ["9L1"]},
	noivern: {alluringvoice: ["9M"], scaleshot: ["9M"], snarl: ["9M"]},
	obstagoon: {blazekick: ["9M"], machpunch: ["9M"]},
	octillery: {acidspray: ["9M"]},
	omastar: {powergem: ["9M"]},
	oricorio: {bravebird: ["9M"], fakeout: ["9M"]},
	overqwil: {mortalspin: ["9L1"]},
	pachirisu: {drainingkiss: ["9M"], fakeout: ["9M"], psychicfangs: ["9M"], risingvoltage: ["9M"], tailslap: ["9M"]},
	palafin: {bounce: ["9M"]},
	palossand: {ancientpower: ["9M"], darkpulse: ["9M"], fakeout: ["9M"], nastyplot: ["9M"], powergem: ["9M"]},
	pangoro: {comeuppance: ["9L1"], gigadrain: ["9M"], headlongrush: ["9L1"], machpunch: ["9M"], seismictoss: ["9M"], stormthrow: ["9M"]},
	parasect: {agility: ["9M"], breakingswipe: ["9M"], bugbuzz: ["9M"], grassyterrain: ["9M"], metalclaw: ["9M"], psychocut: ["9M"], skittersmack: ["9M"], solarblade: ["9M"]},
	passimian: {fakeout: ["9M"], machpunch: ["9M"]},
	pawmot: {drainpunch: ["9M"], machpunch: ["9M"]},
	pelipper: {pursuit: ["9L1"]},
	perrserker: {bulkup: ["9M"], bulletpunch: ["9M"], covet: ["9M"], hypnosis: ["9L1"], liquidation: ["9M"], outrage: ["9M"], spikes: ["9M"], thunderwave: ["9M"]},
	persian: {happyhour: ["9M"], sing: ["9L1"], spikes: ["9M"]},
	pidgeot: {bravebird: ["9M"], dualwingbeat: ["9M"], feintattack: ["9M"], hypervoice: ["9M"]},
	dhelmise: {strengthsap: ["9M"]},
	pinsir: {aerialace: ["9M"], circlethrow: ["9M"], dualwingbeat: ["9M"], extremespeed: ["9M"], lunge: ["9M"]},
	plusle: {drainingkiss: ["9M"], mysticalfire: ["9M"], powerswap: ["9M"], risingvoltage: ["9M"], screech: ["9M"], terrainpulse: ["9M"]},
	politoed: {bide: ["9M"], fissure: ["9M"], iceball: ["9M"], psywave: ["9M"], rage: ["9M"], skullbash: ["9M"], submission: ["9M"]},
	poliwrath: {iceball: ["9M"], jetpunch: ["9L1"], machpunch: ["9M"]},
	porygonz: {bide: ["9M"], curse: ["9M"], flashcannon: ["9M"], headbutt: ["9M"], mimic: ["9M"], nightmare: ["9M"], psywave: ["9M"], rage: ["9M"], sharpen: ["9L1"], skullbash: ["9M"], teleport: ["9M"], voltswitch: ["9M"]},
	primarina: {bubble: ["9L1"]},
	probopass: {recover: ["9M"], defensecurl: ["9M"], dynamicpunch: ["9M"], eerieimpulse: ["9M"], mimic: ["9M"], screech: ["9M"], selfdestruct: ["9M"], steelroller: ["9M"], swift: ["9M"]},
	purugly: {assurance: ["9M"], beatup: ["9M"], bite: ["9M"], faketears: ["9M"], heavyslam: ["9M"], lashout: ["9M"], payday: ["9M"], playrough: ["9M"], scaryface: ["9M"], screech: ["9M"], tailslap: ["9M"]},
	pyroar: {beatup: ["9M"], charm: ["9M"], earthpower: ["9M"], focusenergy: ["9M"], heatcrash: ["9M"], scaryface: ["9M"]},
	rabsca: {cosmicpower: ["9M"]},
	ragingbolt: {helpinghand: ["9M"], mimic: ["9M"]},
	raichu: {babydolleyes: ["9M"], dazzlinggleam: ["9M"], drainpunch: ["9M"], extremespeed: ["9M"], fly: ["9M"], followme: ["9L1"], happyhour: ["9M"], holdhands: ["9M"], magnetbomb: ["9M"], sing: ["9L1"], sweetscent: ["9M"], teeterdance: ["9L1"], volttackle: ["9M"], yawn: ["9L1"]},
	rampardos: {highhorsepower: ["9M"]},
	raticate: {agility: ["9M"], fakeout: ["9M"], icefang: ["9M"], playrough: ["9M"], revenge: ["9M"], reversal: ["9M"], screech: ["9M"], thunderfang: ["9M"]},
	reuniclus: {magicroom: ["9L1"]},
	revavroom: {selfdestruct: ["9M"], torment: ["9M"]},
	rhyperior: {bide: ["9M"], bubblebeam: ["9M"], counter: ["9M"], dynamicpunch: ["9M"], fissure: ["9M"], mimic: ["9M"], rage: ["9M"], seismictoss: ["9M"], skullbash: ["9M"], submission: ["9M"], watergun: ["9M"], zapcannon: ["9M"]},
	ribombee: {fakeout: ["9M"]},
	rillaboom: {bulletpunch: ["9M"], fakeout: ["9M"], naturepower: ["9M"]},
	roserade: {doubleedge: ["9M"], mimic: ["9M"], mortalspin: ["9L1"], nightmare: ["9M"]},
	rotom: {agility: ["9M"], curse: ["9M"], overheat: ["9L1"], paraboliccharge: ["9L1"], partingshot: ["9L1"], taunt: ["9M"]},
	runerigus: {chipaway: ["9L1"], partingshot: ["9L1"]},
	sableye: {healblock: ["9M"], nightslash: ["9L1"], partingshot: ["9L1"], safeguard: ["9M"], shadowpunch: ["9M"]},
	salamence: {flamecharge: ["9M"], scaleshot: ["9M"], skullbash: ["9M"], wish: ["9L1"]},
	salazzle: {scorchingsands: ["9M"]},
	samurott: {agility: ["9M"], assurance: ["9M"], brine: ["9M"], icefang: ["9M"]},
	sawk: {blazekick: ["9M"], bodyslam: ["9M"], drainpunch: ["9M"], dynamicpunch: ["9M"], ironhead: ["9M"], machpunch: ["9M"], matblock: ["9L1"], outrage: ["9M"], swordsdance: ["9M"]},
	sawsbuck: {leafblade: ["9M"], megakick: ["9M"], powerwhip: ["9M"], revenge: ["9M"], solarblade: ["9M"]},
	sceptile: {dragonrush: ["9L1"], earthpower: ["9M"]},
	scizor: {bide: ["9M"], magnetbomb: ["9M"], rage: ["9M"], skullbash: ["9M"]},
	scolipede: {doublehit: ["9M"], firstimpression: ["9M"], gunkshot: ["9M"], leechlife: ["9M"], mortalspin: ["9L1"], skullbash: ["9M"], trailblaze: ["9M"], uturn: ["9M"]},
	scovillain: {beatup: ["9M"], bulldoze: ["9M"], firelash: ["9M"], flareblitz: ["9M"], heatwave: ["9M"], knockoff: ["9M"], lunge: ["9M"], nastyplot: ["9M"], naturepower: ["9M"], outrage: ["9M"], pounce: ["9M"], snarl: ["9M"], suckerpunch: ["9M"], swagger: ["9M"], thunderfang: ["9M"]},
	scrafty: {counter: ["9M"], detect: ["9M"], dynamicpunch: ["9M"], fakeout: ["9M"], partingshot: ["9L1"], skullbash: ["9M"], suckerpunch: ["9M"]},
	screamtail: {hail: ["9M"]},
	serperior: {aromatherapy: ["9L1"], dracometeor: ["9M"], solarblade: ["9M"]},
	seviper: {crosspoison: ["9M"], fakeout: ["9M"], scaleshot: ["9M"]},
	sharpedo: {bulletpunch: ["9M"], flashcannon: ["9M"], heavyslam: ["9M"], irondefense: ["9L1"], ironhead: ["9M"], mirrorshot: ["9L1"], steelbeam: ["9M"]},
	shedinja: {lastrespects: ["9L1"]},
	shuckle: {guardswap: ["9L1"], powerswap: ["9L1"]},
	simipour: {bite: ["9M"], bodyslam: ["9M"], brine: ["9L1"], crunch: ["9L1"], fakeout: ["9M"], flipturn: ["9M"], liquidation: ["9L1"], megapunch: ["9M"], playnice: ["9L1"], scratch: ["9L1"], stuffcheeks: ["9L1"], watergun: ["9L1"], watersport: ["9L1"], whirlpool: ["9M"]},
	simisage: {bite: ["9M"], bulletseed: ["9M"], crunch: ["9L1"], drainpunch: ["9M"], fakeout: ["9M"], grassyglide: ["9M"], leechseed: ["9L1"], naturalgift: ["9L1"], playnice: ["9L1"], scratch: ["9L1"], solarblade: ["9M"], stuffcheeks: ["9L1"], trailblaze: ["9M"], vinewhip: ["9L1"]},
	simisear: {amnesia: ["9L1"], bite: ["9L1"], blazekick: ["9M"], bodyslam: ["9M"], crunch: ["9L1"], fakeout: ["9M"], firespin: ["9M"], flamewheel: ["9L1"], megapunch: ["9M"], naturalgift: ["9L1"], playnice: ["9L1"], scorchingsands: ["9M"], scratch: ["9L1"], stuffcheeks: ["9L1"], temperflare: ["9M"], yawn: ["9L1"]},
	sinistcha: {naturepower: ["9M"]},
	sirfetchd: {agility: ["9M"], counter: ["9M"], covet: ["9M"], irontail: ["9M"], skyattack: ["9M"], uturn: ["9M"], vacuumwave: ["9M"]},
	skarmory: {acrobatics: ["9M"], magnetbomb: ["9M"], scaleshot: ["9M"], skullbash: ["9M"]},
	skeledirge: {burnup: ["9L1"]},
	slaking: {focusenergy: ["9M"]},
	slowbro: {ancientpower: ["9M"], healblock: ["9M"], powergem: ["9M"]},
	slowking: {ancientpower: ["9M"], bide: ["9M"], bubblebeam: ["9M"], fissure: ["9M"], healblock: ["9M"], psywave: ["9M"], rage: ["9M"], skullbash: ["9M"], teleport: ["9M"]},
	slurpuff: {selfdestruct: ["9M"], swordsdance: ["9M"]},
	smeargle: {attract: ["9M"], confide: ["9M"], doubleteam: ["9M"], endure: ["9M"], facade: ["9M"], frustration: ["9M"], hiddenpower: ["9M"], naturalgift: ["9M"], protect: ["9M"], rest: ["9M"], return: ["9M"], round: ["9M"], secretpower: ["9M"], snore: ["9M"], substitute: ["9M"], swagger: ["9M"], toxic: ["9M"]},
	snorlax: {happyhour: ["9M"], iceball: ["9M"]},
	solrock: {ragingfury: ["9M"]},
	spidops: {fakeout: ["9M"], hyperbeam: ["9M"], suckerpunch: ["9M"]},
	spinda: {agility: ["9M"], amnesia: ["9M"], beatup: ["9M"], breakingswipe: ["9M"], charm: ["9M"], closecombat: ["9M"], darkestlariat: ["9M"], dragondance: ["9M"], drainingkiss: ["9M"], firefang: ["9M"], highhorsepower: ["9M"], icefang: ["9M"], lashout: ["9M"], mudshot: ["9M"], payday: ["9M"], playrough: ["9M"], psychicfangs: ["9M"], revenge: ["9M"], reversal: ["9M"], skittersmack: ["9M"], terrainpulse: ["9M"], thunderfang: ["9M"]},
	squawkabilly: {bulkup: ["9M"], ironhead: ["9M"], knockoff: ["9M"], lunge: ["9M"], seedbomb: ["9M"], skyattack: ["9M"]},
	staraptor: {blazekick: ["9M"], bodypress: ["9M"], brickbreak: ["9M"], bulkup: ["9M"], knockoff: ["9M"], lowsweep: ["9M"], outrage: ["9M"]},
	starmie: {ancientpower: ["9M"], aquajet: ["9M"], bulkup: ["9M"], chargebeam: ["9M"], healblock: ["9M"], liquidation: ["9M"], reflecttype: ["9L1"], safeguard: ["9M"], selfdestruct: ["9M"], tripleaxel: ["9M"], zenheadbutt: ["9M"]},
	steelix: {bide: ["9M"], fissure: ["9M"], skullbash: ["9M"], takedown: ["9M"]},
	stunfisk: {crunch: ["9M"], fakeout: ["9M"], flashcannon: ["9M"], icefang: ["9M"], irondefense: ["9M"], magnetbomb: ["9M"]},
	sudowoodo: {fakeout: ["9M"]},
	sunflora: {bide: ["9M"], charm: ["9M"], leafblade: ["9M"], pollenpuff: ["9M"], solarblade: ["9M"]},
	swalot: {corrosivegas: ["9M"], crunch: ["9M"], powerswap: ["9M"], terrainpulse: ["9M"]},
	swampert: {fissure: ["9M"], sludgebomb: ["9M"], wavecrash: ["9M"]},
	swanna: {brine: ["9M"], dualwingbeat: ["9M"], muddywater: ["9M"]},
	swellow: {dualwingbeat: ["9M"], featherdance: ["9L1"], hurricane: ["9M"], screech: ["9M"], tripleaxel: ["9M"]},
	sylveon: {bide: ["9M"], detect: ["9M"], rage: ["9M"], sing: ["9L1"], skullbash: ["9M"], sparklyswirl: ["9L1"], taunt: ["9M"]},
	talonflame: {blazekick: ["9M"], skyattack: ["9M"], whirlwind: ["9M"]},
	tangrowth: {bide: ["9M"], curse: ["9M"], doubleedge: ["9M"], mimic: ["9M"], rage: ["9M"], skullbash: ["9M"], sweetscent: ["9M"], takedown: ["9M"]},
	tatsugiri: {ancientpower: ["9M"], calmmind: ["9M"], darkpulse: ["9M"], dragonrush: ["9L1"], flipturn: ["9M"], icebeam: ["9M"], scald: ["9M"], tripleaxel: ["9M"], waterfall: ["9M"]},
	thievul: {fakeout: ["9M"], firstimpression: ["9M"], icywind: ["9M"], roar: ["9M"], trailblaze: ["9M"], willowisp: ["9M"]},
	throh: {amnesia: ["9M"], closecombat: ["9M"], dynamicpunch: ["9M"], gunkshot: ["9M"], irondefense: ["9M"], ironhead: ["9M"], outrage: ["9M"], rockblast: ["9M"], seedbomb: ["9M"]},
	tinkaton: {bulkup: ["9M"], poweruppunch: ["9M"], quash: ["9M"], woodhammer: ["9L1"]},
	toedscruel: {naturepower: ["9M"]},
	togekiss: {curse: ["9M"], defensecurl: ["9M"], detect: ["9M"], mimic: ["9M"], moonblast: ["9L1"], seismictoss: ["9M"], softboiled: ["9M"], zapcannon: ["9M"]},
	torterra: {dig: ["9M"], screech: ["9M"]},
	toucannon: {assurance: ["9M"], retaliate: ["9M"], revenge: ["9M"]},
	toxicroak: {bulletpunch: ["9M"], dynamicpunch: ["9M"], machpunch: ["9M"]},
	toxtricity: {fakeout: ["9M"], zapcannon: ["9M"]},
	trevenant: {healblock: ["9M"], shadowpunch: ["9M"], suckerpunch: ["9M"]},
	tropius: {grassyglide: ["9M"]},
	typhlosion: {bite: ["9M"], closecombat: ["9M"], drainpunch: ["9M"], machpunch: ["9M"], submission: ["9M"]},
	tyranitar: {scaleshot: ["9M"], scorchingsands: ["9M"]},
	tyrantrum: {curse: ["9M"]},
	umbreon: {baddybad: ["9L1"], bide: ["9M"], knockoff: ["9M"], rage: ["9M"], sing: ["9L1"], skullbash: ["9M"]},
	unown: {attract: ["9M"], bide: ["9M"], captivate: ["9M"], confide: ["9M"], doubleteam: ["9M"], endure: ["9M"], facade: ["9M"], frustration: ["9M"], naturalgift: ["9M"], protect: ["9M"], rest: ["9M"], return: ["9M"], round: ["9M"], secretpower: ["9M"], sleeptalk: ["9M"], snore: ["9M"], substitute: ["9M"], swagger: ["9M"], toxic: ["9M"]},
	ursaluna: {babydolleyes: ["9M"], bloodmoon: ["9M"], cut: ["9M"], dynamicpunch: ["9M"], focusblast: ["9M"], focusenergy: ["9M"], furycutter: ["9M"], harden: ["9M"], headbutt: ["9M"], honeclaws: ["9M"], laserfocus: ["9M"], lastresort: ["9M"], megakick: ["9M"], megapunch: ["9M"], mimic: ["9M"], moonblast: ["9M"], moonlight: ["9M"], mudslap: ["9M"], poweruppunch: ["9M"], rockclimb: ["9M"], rocksmash: ["9M"], rollout: ["9M"], strength: ["9M"], superpower: ["9M"], torment: ["9M"], workup: ["9M"], zapcannon: ["9M"]},
	vanilluxe: {coldsnap: ["9M"]},
	vaporeon: {bouncybubble: ["9L1"], sing: ["9L1"], taunt: ["9M"]},
	veluza: {hail: ["9M"]},
	venomoth: {crosspoison: ["9M"], futuresight: ["9M"], psychicfangs: ["9M"]},
	venusaur: {celebrate: ["9M"], razorwind: ["9M"], skullbash: ["9M"], sludgewave: ["9M"]},
	victreebel: {crosspoison: ["9M"], solarblade: ["9M"], toxicspikes: ["9M"], venomdrench: ["9M"]},
	vileplume: {leechseed: ["9L1"]},
	vivillon: {agility: ["9M"], dazzlinggleam: ["9M"], dualwingbeat: ["9M"], holdhands: ["9M"], petaldance: ["9M"], stringshot: ["9M"], whirlwind: ["9M"]},
	volbeat: {drainingkiss: ["9M"], fakeout: ["9M"], faketears: ["9M"], magicalleaf: ["9M"], pollenpuff: ["9M"], powergem: ["9M"]},
	walkingwake: {coldsnap: ["9M"]},
	walrein: {coldsnap: ["9M"]},
	watchog: {doubleedge: ["9M"], encore: ["9M"], firefang: ["9M"], icefang: ["9M"], megapunch: ["9M"], psychicfangs: ["9M"], skullbash: ["9M"], thunderfang: ["9M"], triattack: ["9M"]},
	weavile: {coldsnap: ["9M"], counter: ["9M"], curse: ["9M"], defensecurl: ["9M"], doubleedge: ["9M"], dynamicpunch: ["9M"], mimic: ["9M"], nightmare: ["9M"]},
	weezing: {psywave: ["9M"]},
	whimsicott: {fakeout: ["9M"]},
	wigglytuff: {coldsnap: ["9M"], fakeout: ["9M"], feintattack: ["9M"], moonblast: ["9M"], tickle: ["9L1"]},
	wobbuffet: {tickle: ["9L1"]},
	wormadam: {magicalleaf: ["9M"]},
	yanmega: {curse: ["9M"], mimic: ["9M"]},
	zangoose: {extremespeed: ["9M"], bulletpunch: ["9M"], crosspoison: ["9M"], fakeout: ["9M"], lashout: ["9M"], smartstrike: ["9M"]},
	zebstrika: {megakick: ["9M"]},
	zoroark: {counter: ["9M"], detect: ["9M"], fakeout: ["9M"]},
};
Object.assign(CUSTOM_LEARNSET_ADDITIONS, DOCUMENT_LEARNSET_ADDITIONS, {
	cradily: {sappyseed: ['9M']},
	cetitan: {
		earthquake: ['9M'], highhorsepower: ['9M'], headlongrush: ['9M'], icespinner: ['9M'],
		iciclecrash: ['9M'], heavyslam: ['9M'], bodypress: ['9M'], knockoff: ['9M'], shoreup: ['9M'],
	},
	flapple: {
		firstimpression: ['9M'], victorydance: ['9M'], bulletseed: ['9M'], gravapple: ['9M'],
		fellstinger: ['9M'], dragonenergy: ['9M'], gunkshot: ['9M'], poisonjab: ['9M'],
		acidspray: ['9M'], venoshock: ['9M'], toxic: ['9M'],
	},
	appletun: {
		junglehealing: ['9M'], dragonenergy: ['9M'], ragepowder: ['9M'],
	},
	dipplin: {
		naturepower: ['9M'], bodypress: ['9M'], irondefense: ['9M'],
	},
	hydrapple: {
		triattack: ['9M'], flamethrower: ['9M'], fireblast: ['9M'], irondefense: ['9M'],
	},
});
const CUSTOM_LEARNSET_ADDITION_IDS = Object.keys(CUSTOM_LEARNSET_ADDITIONS);
const CUSTOM_LEARNSET_REMOVAL_IDS = Object.keys(CUSTOM_LEARNSET_REMOVALS);
const CUSTOM_ITEM_UPDATES: {[id: string]: AnyObject} = {
	gardevoirite: {megaStone: {'Gardevoir': 'Gardevoir-Mega', 'Gardevoir-Void': 'Gardevoir-Mega-Alt'}, itemUser: ['Gardevoir', 'Gardevoir-Void']},
	breloomite: {"name":"Breloomite","spritenum":619,"megaStone":{"Breloom":"Breloom-Mega"},"itemUser":["Breloom"],"num":11102,"gen":9,"isNonstandard":"Custom","desc":"Allows Breloom to Mega Evolve into Mega Breloom.","shortDesc":"Allows Breloom to Mega Evolve."},
	luxranite: {"name":"Luxranite","spritenum":619,"megaStone":{"Luxray":"Luxray-Mega"},"itemUser":["Luxray"],"num":11100,"gen":9,"isNonstandard":"Custom","desc":"Allows Luxray to Mega Evolve into Mega Luxray.","shortDesc":"Allows Luxray to Mega Evolve."},
	noctowlite: {"name":"Noctowlite","spritenum":619,"megaStone":{"Noctowl":"Noctowl-Mega"},"itemUser":["Noctowl"],"num":11098,"gen":9,"isNonstandard":"Custom","desc":"Allows Noctowl to Mega Evolve into Mega Noctowl.","shortDesc":"Allows Noctowl to Mega Evolve."},
	dusknoirite: {"name":"Dusknoirite","spritenum":619,"megaStone":{"Dusknoir":"Dusknoir-Mega"},"itemUser":["Dusknoir"],"num":11097,"gen":9,"isNonstandard":"Custom","desc":"Allows Dusknoir to Mega Evolve into Mega Dusknoir.","shortDesc":"Allows Dusknoir to Mega Evolve."},
	weavilite: {"name":"Weavilite","spritenum":619,"megaStone":{"Weavile":"Weavile-Mega"},"itemUser":["Weavile"],"num":11095,"gen":9,"isNonstandard":"Custom","desc":"Allows Weavile to Mega Evolve into Mega Weavile.","shortDesc":"Allows Weavile to Mega Evolve."},
	noivernite: {"name":"Noivernite","spritenum":619,"megaStone":{"Noivern":"Noivern-Mega"},"itemUser":["Noivern"],"num":11093,"gen":9,"isNonstandard":"Custom","desc":"Allows Noivern to Mega Evolve into Mega Noivern.","shortDesc":"Allows Noivern to Mega Evolve."},
	bronzongite: {"name":"Bronzongite","spritenum":619,"megaStone":{"Bronzong":"Bronzong-Mega"},"itemUser":["Bronzong"],"num":11091,"gen":9,"isNonstandard":"Custom","desc":"Allows Bronzong to Mega Evolve into Mega Bronzong.","shortDesc":"Allows Bronzong to Mega Evolve."},
	anomalycore: {
		name: 'Anomaly Core', spritenum: 0, megaStone: {Hypno: 'Hypno-Pulse', Lilligant: 'Lilligant-Rift', 'Lilligant-Hisui': 'Lilligant-Hisui-Rift', Muk: 'Muk-Pulse', 'Muk-Alola': 'Muk-Pulse'}, itemUser: ['Hypno', 'Lilligant', 'Lilligant-Hisui', 'Muk', 'Muk-Alola'], num: 2662, gen: 9,
		desc: 'If held by a designated Pulse or Rift Pokemon, this Anomaly Core allows it to undergo its Pulse or Rift Evolution in battle.',
		shortDesc: 'Pulse/Rift Evolution item for designated Anomaly Pokemon.',
	},
	belliboltite: {
		name: 'Belliboltite', spritenum: 0, megaStone: {Bellibolt: 'Bellibolt-Mega'}, itemUser: ['Bellibolt'], num: 2661, gen: 9,
		desc: 'If held by a Bellibolt, this item allows it to Mega Evolve in battle.',
		shortDesc: 'If held by a Bellibolt, this item allows it to Mega Evolve in battle.',
	},
	sunflorite: {
		name: "Sunflorite",
		spritenum: 0,
		megaStone: {Sunflora: "Sunflora-Mega"},
		itemUser: ["Sunflora"],
		num: 2660,
		gen: 9,
		desc: "If held by a Sunflora, this item allows it to Mega Evolve in battle.",
		shortDesc: "If held by a Sunflora, this item allows it to Mega Evolve in battle.",
	},
	claydolite: {
		name: "Claydolite",
		spritenum: 0,
		megaStone: { Claydol: "Claydol-Mega" },
		itemUser: ["Claydol"],
		num: 2659,
		gen: 9,
		desc: "If held by a Claydol, this item allows it to Mega Evolve in battle.",
		shortDesc: "If held by a Claydol, this item allows it to Mega Evolve in battle.",
	},
	charizarditex: {
		desc: 'If held by a Charizard, this item allows it to Mega Evolve into either Mega Charizard X or Mega Charizard Y.',
		shortDesc: 'If held by a Charizard, this item allows it to Mega Evolve into either Mega Charizard X or Mega Charizard Y.',
	},
	charizarditey: {
		desc: 'If held by a Charizard, this item allows it to Mega Evolve into either Mega Charizard X or Mega Charizard Y.',
		shortDesc: 'If held by a Charizard, this item allows it to Mega Evolve into either Mega Charizard X or Mega Charizard Y.',
	},
	chimechite: {
		name: 'Chimechite',
		spritenum: 498,
		megaStone: {Chimecho: 'Chimecho-Mega'},
		itemUser: ['Chimecho'],
		num: 2637,
		gen: 9,
		desc: 'If held by a Chimecho, this item allows it to Mega Evolve into either Chimecho-Mega or Chimecho-Mega-Y in battle.',
		shortDesc: 'If held by a Chimecho, this item allows it to Mega Evolve into either Chimecho-Mega or Chimecho-Mega-Y in battle.',
	},
	meganiumite: {
		name: 'Meganiumite',
		spritenum: 548,
		megaStone: {Meganium: 'Meganium-Mega'},
		itemUser: ['Meganium'],
		num: 2563,
		gen: 9,
		desc: 'If held by a Meganium, this item allows it to Mega Evolve into either Meganium-Mega or Meganium-Mega-Y in battle.',
		shortDesc: 'If held by a Meganium, this item allows it to Mega Evolve into either Meganium-Mega or Meganium-Mega-Y in battle.',
	},
	cinderite: {
		name: 'Cinderite',
		spritenum: 0,
		megaStone: {Cinderace: 'Cinderace-Mega'},
		itemUser: ['Cinderace'],
		num: 2652,
		gen: 9,
		desc: 'If held by a Cinderace, this item allows it to Mega Evolve in battle.',
		shortDesc: 'If held by a Cinderace, this item allows it to Mega Evolve in battle.',
	},
	roseradite: {
		name: 'Roseradite',
		spritenum: 0,
		megaStone: {Roserade: 'Roserade-Mega'},
		itemUser: ['Roserade'],
		num: 2651,
		gen: 9,
		desc: 'If held by a Roserade, this item allows it to Mega Evolve in battle.',
		shortDesc: 'If held by a Roserade, this item allows it to Mega Evolve in battle.',
	},
	aridiate: {
		name: 'Aridiate',
		spritenum: 0,
		megaStone: {Ariados: 'Ariados-Mega'},
		itemUser: ['Ariados'],
		num: 2654,
		gen: 9,
		desc: 'If held by an Ariados, this item allows it to Mega Evolve in battle.',
		shortDesc: 'If held by an Ariados, this item allows it to Mega Evolve in battle.',
	},
	clawitzerite: {
		name: 'Clawitzerite',
		spritenum: 0,
		megaStone: {Clawitzer: 'Clawitzer-Mega'},
		itemUser: ['Clawitzer'],
		num: 2655,
		gen: 9,
		desc: 'If held by a Clawitzer, this item allows it to Mega Evolve in battle.',
		shortDesc: 'If held by a Clawitzer, this item allows it to Mega Evolve in battle.',
	},
	haxorite: {
		name: 'Haxorite',
		spritenum: 0,
		megaStone: {Haxorus: 'Haxorus-Mega'},
		itemUser: ['Haxorus'],
		num: 2657,
		gen: 9,
		desc: 'If held by a Haxorus, this item allows it to Mega Evolve into Haxorus-Mega in battle.',
		shortDesc: 'If held by a Haxorus, this item allows it to Mega Evolve into Haxorus-Mega in battle.',
	},
	arbokite: {
		name: 'Arbokite',
		spritenum: 0,
		megaStone: {Arbok: 'Arbok-Mega-X'},
		itemUser: ['Arbok'],
		num: 2658,
		gen: 9,
		desc: 'If held by an Arbok, this item allows it to Mega Evolve into either Arbok-Mega-X or Arbok-Mega-Y in battle.',
		shortDesc: 'If held by an Arbok, this item allows it to Mega Evolve into either Arbok-Mega-X or Arbok-Mega-Y in battle.',
	},
};
const CUSTOM_ITEM_IDS = Object.keys(CUSTOM_ITEM_UPDATES);
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
	// Custom asset metadata is authoritative. Native dimensions describe the
	// original sprite and can be stale after a custom PNG replaces it.
	return getSpriteSize(customData, isFront, shiny) || getSpriteSize(customNativeBWSpriteSizes[id], isFront, shiny)!;
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

function getNatDexNaturePowerIds() {
	const natDexLearnsets = window.BattleTeambuilderTable?.gen9natdex?.learnsets;
	const ids = new Set<string>();
	if (!natDexLearnsets) return ids;
	for (const [id, learnset] of Object.entries(natDexLearnsets) as [string, AnyObject][]) {
		if (learnset.naturepower) ids.add(id);
	}
	return ids;
}

function isGrassFinalEvolution(id: string, table: AnyObject) {
	const species = table.overrideSpeciesData?.[id] || window.BattlePokedex?.[id] || CUSTOM_SPECIES[id]?.data;
	if (!species) return false;
	const baseId = toID(species.baseSpecies || CUSTOM_SPECIES[id]?.base || '');
	const baseSpecies = table.overrideSpeciesData?.[baseId] || window.BattlePokedex?.[baseId] || CUSTOM_SPECIES[baseId]?.data;
	const types = species.types || baseSpecies?.types;
	const evos = species.evos ?? baseSpecies?.evos;
	const forme = String(species.forme || '').toLowerCase();
	return types?.includes('Grass') && !evos?.length && !forme.includes('mega') && !forme.includes('gmax');
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
	const visualLearnsetBases: {[id: string]: string} = {};
	for (const [id, customSpecies] of Object.entries(CUSTOM_SPECIES)) {
		if (!isCustomVisualForm(customSpecies.data) || customSpecies.data.standalone) continue;
		visualLearnsetBases[id] = toID(customSpecies.base);
	}
	for (const [baseId, update] of Object.entries(CUSTOM_SPECIES_UPDATES)) {
		for (const forme of update.cosmeticFormes || []) {
			visualLearnsetBases[toID(forme)] = baseId;
		}
	}
	for (const [target, base] of Object.entries(visualLearnsetBases)) {
		if (target === base || !table.learnsets[base]) continue;
		table.learnsets[target] = {
			...table.learnsets[base],
			...(table.learnsets[target] || {}),
		};
	}
	// Appliance forms inherit Rotom's normal learnset in the simulator. The
	// generated client table stores only each form's signature move, so merge
	// the base learnset before applying the appliance-specific additions.
	for (const id of ['rotomheat', 'rotomwash', 'rotomfrost', 'rotomfan', 'rotommow']) {
		if (!table.learnsets.rotom) continue;
		table.learnsets[id] = {
			...table.learnsets.rotom,
			...(table.learnsets[id] || {}),
		};
	}
	for (const id of CUSTOM_BODY_PRESS_LEARNSET_IDS) {
		if (!table.learnsets[id]) table.learnsets[id] = {};
		if (!table.learnsets[id].bodypress) {
			table.learnsets[id].bodypress = encodeCustomLearnsetSources(['9M']);
		}
	}
	if (table.learnsets.eeveestarter) {
		table.learnsets.eeveestarteralt = {
			...table.learnsets.eeveestarter,
			...(table.learnsets.eeveestarteralt || {}),
		};
	}
	if (table.learnsets.bronzong) {
		table.learnsets.bronzongrejuv = {
			...table.learnsets.bronzong,
			...(table.learnsets.bronzongrejuv || {}),
		};
	}
	if (table.learnsets.florges) {
		table.learnsets.florgesreborn = {
			...table.learnsets.florges,
			...(table.learnsets.florgesreborn || {}),
		};
	}
	if (table.learnsets.alakazam) {
		table.learnsets.alakazamalt = {
			...table.learnsets.alakazam,
			...(table.learnsets.alakazamalt || {}),
		};
		table.learnsets.alakazammegaalt = {
			...table.learnsets.alakazamalt,
			...(table.learnsets.alakazammegaalt || {}),
		};
	}
	if (table.learnsets.corsola) {
		table.learnsets.corsolaalt = {
			...table.learnsets.corsola,
			...(table.learnsets.corsolaalt || {}),
		};
	}
	if (table.learnsets.crobat) {
		table.learnsets.crobatalt = {
			...table.learnsets.crobat,
			...(table.learnsets.crobatalt || {}),
		};
	}
	if (table.learnsets.muk) {
		table.learnsets.mukpulse = {
			...table.learnsets.muk,
			...(table.learnsets.mukpulse || {}),
		};
	}
	for (const [target, base] of [['goodrahisui', 'goodra'], ['arcaninehisui', 'arcanine']]) {
		if (!table.learnsets[base]) continue;
		table.learnsets[target] = {
			...table.learnsets[base],
			...(table.learnsets[target] || {}),
		};
	}
	if (table.learnsets.basculegion && table.learnsets.basculegionf) {
		table.learnsets.basculegionf = {...table.learnsets.basculegion};
	}
	if (table.learnsets.samurott && table.learnsets.samurotthisui) {
		table.learnsets.samurotthisui = {
			...table.learnsets.samurotthisui,
			...table.learnsets.samurott,
		};
	}
	const natDexNaturePowerIds = getNatDexNaturePowerIds();
	for (const [id, learnset] of Object.entries(table.learnsets) as [string, AnyObject][]) {
		if ((natDexNaturePowerIds.has(id) || isGrassFinalEvolution(id, table)) &&
			!Object.prototype.hasOwnProperty.call(learnset, 'naturepower')) {
			learnset.naturepower = encodeCustomLearnsetSources(['9M']);
		}
	}
	if (table.learnsets.milotic) {
		table.learnsets.miloticaevian = {
			...table.learnsets.milotic,
			...(table.learnsets.miloticaevian || {}),
		};
		for (const moveid of 'moonlight poisonsting fairywind refresh poisontail venoshock disarmingvoice slam charm dragontail playrough attract painsplit poisongas poisonjab toxic gunkshot coil wrap workup taunt icebeam blizzard hyperbeam raindance sludgewave sludgebomb rocktomb torment thief echoedvoice quash embargo payback gigaimpact thunderwave psychup bulldoze infestation dreameater snarl dazzlinggleam rockclimb leechlife whirlpool faketears mudshot brine assurance powerswap tailslap drainingkiss mistyterrain surf strength waterfall dive uproar bind lastresort covet snatch irontail spite allyswitch signalbeam bounce waterpulse aquatail icywind magiccoat gastroacid skillswap knockoff bodyslam dragondance toxicspikes venomdrench mistyexplosion corrosivegas mudslap confuseray haze mudsport belch hypnosis boomburst dragonpulse dragoncheer twister scaleshot hypervoice recover return frustration helpinghand secretpower splash swift safeguard weatherball sleeptalk rest'.split(' ')) {
			table.learnsets.miloticaevian[moveid] ??= encodeCustomLearnsetSources(['9M']);
		}
	}
	if (!table.learnsets.laprasaevian) table.learnsets.laprasaevian = {};
	for (const moveid of 'harden psywave sing rockpolish gravity powergem confuseray rockslide zenheadbutt bodyslam psychic sandstorm miracleeye perishsong stoneedge recover ancientpower curse dragondance heavyslam rocktomb teleport afteryou allyswitch amnesia arenitewall auroraveil avalanche blizzard block bodypress breakingswipe bulldoze bulkup calmmind charm cosmicpower dazzlinggleam dragonpulse dragontail dreameater drillrun earthpower earthquake echoedvoice encore expandingforce explosion flash flashcannon focusblast frostbreath futuresight gigaimpact gyroball guardswap healbell helpinghand hyperbeam hypervoice icebeam irondefense ironhead irontail lightscreen magiccoat magicroom megahorn meteorbeam naturepower outrage powerswap psychicfangs psychicterrain psychocut psyshock reflect roar rockblast rockclimb rocksmash safeguard screech selfdestruct shadowball shockwave smackdown smartstrike speedswap stealthrock stompingtantrum strength telekinesis thunderwave trickroom uproar wonderroom zapcannon weatherball hyperdrill iceshard freezedry thunderbolt wildcharge solarblade solarbeam psychicnoise pursuit thunder icywind sleeptalk rest dive waterfall whirlpool dragoncheer dragonbreath skullbash'.split(' ')) {
		table.learnsets.laprasaevian[moveid] ??= encodeCustomLearnsetSources(['9M']);
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
	// Tera Blast, Hidden Power and its typed variants are removed from all learnsets.
	for (const learnset of Object.values(table.learnsets) as AnyObject[]) {
		for (const moveid of Object.keys(learnset)) {
			if (moveid === 'terablast' || moveid === 'hiddenpower' || moveid.startsWith('hiddenpower')) delete learnset[moveid];
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
		if (isCustomVisualForm(customSpecies.data) && !customSpecies.data.standalone) {
			const baseData = table.overrideSpeciesData[customSpecies.base] || table.overrideSpeciesData[toID(customSpecies.base)] || {};
			const cosmeticFormes = new Set(baseData.cosmeticFormes || []);
			cosmeticFormes.add(customSpecies.data.name);
			table.overrideSpeciesData[customSpecies.base] = {
				...baseData,
				cosmeticFormes: [...cosmeticFormes],
			};
		}
	}
	applyCustomVisualVariantLinks(table.overrideSpeciesData);
	if (table.tiers) {
		for (const id of CUSTOM_SPECIES_IDS) {
			const customSpecies = CUSTOM_SPECIES[id];
			if (isCustomVisualForm(customSpecies.data) && !customSpecies.data.standalone) continue;
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
	const hasItem = (rows: any[], id: string) => rows.some(row =>
		typeof row === 'string' ? row === id : row?.[0] === 'item' && row?.[1] === id
	);
	if (Array.isArray(table.items)) {
		for (const id of CUSTOM_ITEM_IDS) {
			if (!hasItem(table.items, id)) table.items.push(id);
		}
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
		for (const id of CUSTOM_ITEM_IDS) {
			if (!hasItem(table.itemSet, id)) table.itemSet.push(['item', id]);
		}
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
		for (const id of REMOVED_SPECIES_IDS) delete window.BattlePokedex[id];
		for (const id of CUSTOM_SPECIES_UPDATE_IDS) {
			if (!window.BattlePokedex[id]) window.BattlePokedex[id] = {};
			const update = CUSTOM_SPECIES_UPDATES[id];
			const species = window.BattlePokedex[id];
			const baseStats = species.baseStats;
			const abilities = species.abilities;
			Object.assign(species, update);
			if (update.baseStats) species.baseStats = {...(baseStats || {}), ...update.baseStats};
			if (update.abilities) species.abilities = {...(update.replaceAbilities ? {} : (abilities || {})), ...update.abilities};
		}
		for (const [id, formeOrder] of Object.entries(CLEAN_BASE_FORMES)) {
			const species = window.BattlePokedex[id];
			if (!species) continue;
			species.otherFormes = formeOrder.slice(1);
			species.cosmeticFormes = [];
			species.formeOrder = formeOrder;
		}
		customPokedexDataTable = window.BattlePokedex;
	}
	if (window.BattlePokedexAltForms && customPokedexAltFormsTable !== window.BattlePokedexAltForms) {
		for (const id of REMOVED_SPECIES_IDS) delete window.BattlePokedexAltForms[id];
		customPokedexAltFormsTable = window.BattlePokedexAltForms;
	}
	if (window.BattleAliases) {
		delete window.BattleAliases.luxraydeso;
		window.BattleAliases.alchemicsurge = 'Alchemist Surge';
		window.BattleAliases.amuletcoin = 'Star Sweet';
		window.BattleAliases.richard = 'Jellicent-Azzy';
		window.BattleAliases.venomrush = 'Venom Armor';
		window.BattleAliases.ironclad = 'Armorize';
		window.BattleAliases.corsolareborn = 'Corsola-Alt';
		window.BattleAliases.granbullreborn = 'Granbull-Alt';
		window.BattleAliases.miloticreborn = 'Milotic-Alt';
		window.BattleAliases.torterrareborn = 'Torterra-Alt';
		window.BattleAliases.infernapereborn = 'Infernape-Alt';
		window.BattleAliases.empoleonreborn = 'Empoleon-Alt';
		window.BattleAliases.nidoqueenreborn = 'Nidoqueen-Alt';
		window.BattleAliases.nidokingreborn = 'Nidoking-Alt';
		window.BattleAliases.ninetalesreborn = 'Ninetales-Alt';
		window.BattleAliases.sandslashreborn = 'Sandslash-Alt';
		window.BattleAliases.tentacruelreborn = 'Tentacruel-Alt';
		window.BattleAliases.emboarreborn = 'Emboar-Alt';
		window.BattleAliases.emboarmegareborn = 'Emboar-Mega-Alt';
		window.BattleAliases.mightyenaalt = 'Mightyena-Deso';
		window.BattleAliases.toxicroakalt = 'Toxicroak-Deso';
		window.BattleAliases.cinccinoalt = 'Cinccino-Deso';
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
			const update = CUSTOM_MOVE_UPDATES[id];
			const move = window.BattleMovedex[id];
			const flags = move.flags;
			Object.assign(move, update);
			if (update.flags) {
				move.flags = {...(flags || {}), ...update.flags};
				for (const flag of Object.keys(update.flags)) {
					if (!update.flags[flag]) delete move.flags[flag];
				}
			}
		}
		for (const id of CUSTOM_ARROW_MOVE_IDS) {
			if (!window.BattleMovedex[id]) continue;
			window.BattleMovedex[id].flags = {...(window.BattleMovedex[id].flags || {}), arrow: 1};
		}
		for (const id of CUSTOM_HORN_MOVE_IDS) {
			if (!window.BattleMovedex[id]) continue;
			const flags = {...(window.BattleMovedex[id].flags || {})};
			delete flags.drill;
			flags.horn = 1;
			window.BattleMovedex[id].flags = flags;
		}
		customMoveDataTable = window.BattleMovedex;
	}
	if (window.BattleItems && customItemDataTable !== window.BattleItems) {
		for (const id of CUSTOM_ITEM_IDS) {
			if (!window.BattleItems[id]) window.BattleItems[id] = {};
			Object.assign(window.BattleItems[id], CUSTOM_ITEM_UPDATES[id]);
		}
		window.BattleItems.eeviumz = {
			...(window.BattleItems.eeviumz || {}),
			desc: 'Eevee forms have 1.5x Defense and Special Defense, restore 1/16 max HP each turn, and can use Extreme Evoboost with Last Resort or Veevee Volley.',
			shortDesc: 'Eevee forms: Def/SpD 1.5x; heals 1/16; Extreme Evoboost via Last Resort or Veevee Volley.',
		};
		window.BattleItems.lightball = {
			...(window.BattleItems.lightball || {}),
			desc: 'Pikachu forms have 2x Attack and Special Attack, 1.5x Defense and Special Defense, and restore 1/16 max HP each turn.',
			shortDesc: 'Pikachu forms: Atk/SpA 2x, Def/SpD 1.5x; heals 1/16 each turn.',
		};
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
			const baseData = getCustomSpeciesBaseData(customSpecies);
			if (!baseData) continue;
			const existingData = window.BattlePokedex[customId];
			window.BattlePokedex[customId] = mergeCustomSpeciesData(baseData, existingData, customSpecies.data);
		}
		for (const customId of CUSTOM_SPECIES_IDS) {
			const customSpecies = CUSTOM_SPECIES[customId];
			if (!isCustomVisualForm(customSpecies.data) || customSpecies.data.standalone) continue;
			const baseData = getCustomSpeciesBaseData(customSpecies);
			if (!baseData) continue;
			const cosmeticFormes = new Set(baseData.cosmeticFormes || []);
			cosmeticFormes.add(customSpecies.data.name);
			baseData.cosmeticFormes = [...cosmeticFormes];
		}
		applyCustomVisualVariantLinks(window.BattlePokedex);
		customSpeciesDataTable = window.BattlePokedex;
	} else if (id && CUSTOM_SPECIES[id] && !window.BattlePokedex[id]) {
		const customSpecies = CUSTOM_SPECIES[id];
		const baseData = getCustomSpeciesBaseData(customSpecies);
		if (baseData) {
			window.BattlePokedex[id] = mergeCustomSpeciesData(baseData, undefined, customSpecies.data);
			if (isCustomVisualForm(customSpecies.data)) {
				const cosmeticFormes = new Set(baseData.cosmeticFormes || []);
				cosmeticFormes.add(customSpecies.data.name);
				baseData.cosmeticFormes = [...cosmeticFormes];
			}
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
}
window.ensureCustomDataPatches = ensureCustomDataPatches;
window.ensureCustomSpecies = ensureCustomSpecies;
window.getCustomVisualFamilyId = getCustomVisualFamilyId;
window.getCustomCosmeticFormes = getCustomCosmeticFormes;

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

// Exact-name native Team Builder artwork, verified by build-tools/sync-teambuilder-art.cjs.
const NATIVE_TEAMBUILDER_ART: {[spriteid: string]: {normal: {w: number, h: number}, shiny?: {w: number, h: number}}} = {
	"ababo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"abomasnow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"abomasnow-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"absol": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"absol-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"accelgor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aegislash": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aegislash-blade": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aerodactyl-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aggron": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aggron-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aipom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"alakazam": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"alakazam-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"alcremie": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-caramelswirl": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-lemoncream": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-matchacream": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-mintcream": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-rainbowswirl": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-rubycream": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alcremie-rubyswirl": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"alomomola": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"altaria": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"altaria-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"amaura": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ambipom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"amoonguss": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ampharos-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"annihilape": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"appletun": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"applin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"araquanid": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"arbok": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arboliva": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arcanine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arcanine-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"arceus-bug": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-dark": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-dragon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-electric": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-fairy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-fighting": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-fire": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-flying": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-ghost": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-grass": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-ground": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-ice": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-poison": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-psychic": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-rock": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-steel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arceus-water": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"archaludon": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"arctibax": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arctovish": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arctozolt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ariados": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"armarouge": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aromatisse": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"arrokuda": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"astrolotl": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"audino-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"aurorus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"avalugg": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"avalugg-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"banette-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"barbaracle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"barraskewda": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"basculegion": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"basculegion-f": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"basculin-bluestriped": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"baxcalibur": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"beartic": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"beedrill": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"beedrill-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bellibolt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bergmite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bewear": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"binacle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"blacephalon": {"normal":{"w":120,"h":120},"shiny":{"w":128,"h":128}},
	"blastoise": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"blastoise-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"blaziken-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"blipbug": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"blitzle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"boltund": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bombirdier": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bonsly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bounsweet": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"brambleghast": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bramblin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"brattler": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"braviary": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"breloom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"brionne": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"bronzor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"brutebonnet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bruxish": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"budew": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"buizel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bulbasaur": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"bunnelby": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"burmy-sandy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"burmy-trash": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"butterfree": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"buzzwole": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"cacturne": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"camerupt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"camerupt-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"capsakid": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"carbink": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"carkol": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"carvanha": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cascoon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"castform": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"castform-rainy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"castform-snowy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"castform-sunny": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"caterpie": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cawdet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cawmodore": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"celebi": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"celesteela": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"centiskorch": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ceruledge": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cetitan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cetoddle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chandelure": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chandelure-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"charcadet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"charizard": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"charizard-megax": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"charizard-megay": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"charjabug": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"charmander": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"charmeleon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chatot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cherrim-sunshine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chesnaught": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chesnaught-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"chespin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chewtle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chienpao": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chikorita": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chimchar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chimecho": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chimecho-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"chingling": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chiyu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chromera": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"chuggon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cinderace": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"clamperl": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"clauncher": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"clawitzer": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"claydol": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"clefable": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"clefable-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"clodsire": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"coalossal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cobalion": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"combee": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"combusken": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"comfey": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"copperajah": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"corviknight": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"corvisquire": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cosmoem": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"cosmog": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"cottonee": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"crabominable": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"crabominable-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"crabrawler": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"cradily": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cramorant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"croagunk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"crobat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"crocalor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"croconaw": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"crucibelle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"crucibelle-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"crustle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cryogonal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cubchoo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cubone": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cufant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cupra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cutiefly": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"cyclizar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"cyclohm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dachsbun": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"darmanitan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"darmanitan-zen": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dartrix": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"darumaka": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"decidueye": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"decidueye-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"dedenne": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"deerling-autumn": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"deerling-summer": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"deerling-winter": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"delphox": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"delphox-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"deoxys": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"deoxys-attack": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"deoxys-defense": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"deoxys-speed": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dewgong": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dewott": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dewpider": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"dhelmise": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"dialga": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"diancie-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"diggersby": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"diglett": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"diglett-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"dipplin": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ditto": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dodrio": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"doduo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dolliv": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dondozo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"donphan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dorsoil": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dottler": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"doublade": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dracovish": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dracozolt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dragalge": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dragapult": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"draggalong": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dragonair": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dragonite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dragonite-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"drakloak": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drampa": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"drampa-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"drapion": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drednaw": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dreepy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drifblim": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drifloon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drilbur": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drizzile": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"drowzee": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dubwool": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dudunsparce": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dudunsparce-threesegment": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dugtrio": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dugtrio-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"dunsparce": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"duohm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"duosion": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dusclops": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dusknoir": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"duskull": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dustox": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"dwebble": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"eelektrik": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"eelektross": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"eiscue": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"eiscue-noice": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ekans": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"eldegoss": {"normal":{"w":120,"h":120}},
	"electabuzz": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"electivire": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"electrelk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"electrike": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"electrode": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"elekid": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"elgyem": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"embirch": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"emboar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"emboar-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"empoleon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"escavalier": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"espathra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"espeon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"espurr": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"excadrill": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"excadrill-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"exeggcute": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"exeggutor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"exeggutor-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"exploud": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"farfetchd": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"farigiraf": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fawnifer": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fearow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"feebas": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fennekin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"feraligatr": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"feraligatr-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"ferroseed": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ferrothorn": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fezandipiti": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"fidgit": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fidough": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"finizen": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"finneon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flaaffy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flabebe": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flamigo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flapple": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flarelm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flareon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fletchinder": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fletchling": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flittle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"floatoy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"floatzel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"floette": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"floette-eternal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"floette-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"floragato": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"florges": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fluttermane": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"flygon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fomantis": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"foongus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"fraxure": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"frigibax": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"frillish": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"froakie": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"frogadier": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"froslass": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"froslass-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"fuecoco": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-dandy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-debutante": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-diamond": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-heart": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-kabuki": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-lareine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-matron": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-pharaoh": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furfrou-star": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"furret": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gabite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gallade": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gallade-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"galvantula": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"garbodor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"garchomp": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"garchomp-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gardevoir": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gardevoir-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"garganacl": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gastly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gastrodon-east": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"genesect": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"genesect-burn": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"genesect-chill": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"genesect-douse": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"genesect-shock": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gengar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gengar-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"geodude": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"geodude-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"gholdengo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gimmighoul": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gimmighoul-roaming": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"girafarig": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"giratina": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"giratina-origin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glaceon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glalie": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glalie-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glameow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gligar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glimmet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glimmora": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"glimmora-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"gliscor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gloom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gogoat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"golbat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"goldeen": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"golduck": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"golem": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"golem-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"golett": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"golisopod": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"golurk-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"goodra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"goodra-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"goomy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gorebyss": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gossifleur": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gothitelle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gothorita": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gourgeist": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gourgeist-large": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gourgeist-small": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gourgeist-super": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"grafaiai": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"granbull": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"graveler": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"graveler-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"greattusk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"greavard": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"greedent": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"greninja": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"greninja-ash": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"greninja-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"grimer-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"grookey": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"grotle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"groudon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"groudon-primal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"grovyle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"growlithe": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"grubbin": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"grumpig": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gulpin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"gumshoos": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"gurdurr": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"guzzlord": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"gyarados-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hakamoo": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"happiny": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hariyama": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hatterene": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"haunter": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hawlucha": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hawlucha-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"haxorus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"heatmor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"heatran": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"heliolisk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"helioptile": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"heracross": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"heracross-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"herdier": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hippopotas": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hippowdon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hitmonchan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hitmontop": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"honedge": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hoopa": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hoopa-unbound": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hoothoot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hoppip": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"horsea": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"houndoom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"houndoom-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"houndstone": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"huntail": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"hydrapple": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"hydreigon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"igglybuff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"incineroar": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"indeedee": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"indeedee-f": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"infernape": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"inkay": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"inteleon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironbundle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironhands": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironjugulis": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironleaves": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironmoth": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironthorns": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"irontreads": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ironvaliant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ivysaur": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jangmoo": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"jellicent": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jigglypuff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jirachi": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jolteon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"joltik": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jumbao": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jumpluff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"justyke": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"jynx": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kabuto": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kabutops": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kadabra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kakuna": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kangaskhan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kangaskhan-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kartana": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"kecleon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"keldeo-resolute": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kilowattrel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kingambit": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kingler": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kirlia": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kitsunoh": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"klang": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"klawf": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kleavor": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"klefki": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"klink": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"klinklang": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"komala": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"kommoo": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"koraidon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"krabby": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kricketot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kricketune": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kyogre-primal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kyurem": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kyurem-black": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"kyurem-white": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lairon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lampent": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"landorus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"landorus-therian": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lapras": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"larvesta": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"larvitar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"latias": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"latias-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"latios": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"latios-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"leafeon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"leavanny": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lechonk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ledian": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ledyba": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lickilicky": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lickitung": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"liepard": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lilligant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lillipup": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"linoone": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"litleo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"litten": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"litwick": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lokix": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lombre": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lopunny": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lopunny-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lotad": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"loudred": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lucario": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lucario-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lumineon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lunala": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"lunatone": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lurantis": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"luvdisc": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"luxio": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"luxray": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"lycanroc": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"lycanroc-dusk": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"lycanroc-midnight": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mabosstiff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"machamp": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"machoke": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"machop": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magby": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magcargo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magearna": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"magearna-original": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"magikarp": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magmar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magmortar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magnemite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magneton": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"magnezone": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"makuhita": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"malaconda": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"malamar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mamoswine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"manaphy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mandibuzz": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"manectric": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"manectric-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mankey": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mantine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mareanie": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mareep": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"marill": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"marowak": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"marowak-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"marshadow": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"marshtomp": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"maschiff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"masquerain": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"maushold": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"maushold-four": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mawile": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mawile-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"medicham": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"medicham-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meditite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meganium": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meganium-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"melmetal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meloetta": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meloetta-pirouette": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meltan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meowscarada": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meowstic": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meowstic-f": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meowstic-fmega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"meowstic-mmega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"meowth": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"meowth-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mesprit": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"metagross": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"metagross-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"metang": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"metapod": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mew": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mewtwo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mewtwo-megax": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mewtwo-megay": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"miasmaw": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"miasmite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"milotic": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mimejr": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mimikyu": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mimikyu-busted": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minccino": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"minior-blue": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minior-green": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minior-indigo": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minior-meteor": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minior-orange": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minior-violet": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minior-yellow": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"minun": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"miraidon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"misdreavus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mismagius": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mollux": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"moltres": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"monohm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"morelull": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"morpeko": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"morpeko-hangry": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mothim": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mrmime": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mrrime": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mudbray": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mudkip": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"mudsdale": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"muk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"muk-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"mumbao": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"munkidori": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"murkrow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"musharna": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nacli": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"naclstack": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"naganadel": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"natu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"naviathan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"necrozma": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"necrozma-dawnwings": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"necrozma-duskmane": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"necrozma-ultra": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"necturine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"necturna": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nickit": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nidoking": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nidoqueen": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nidoranf": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nidoranm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nidorino": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nihilego": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"ninetales": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ninetales-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"ninjask": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"noctowl": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nohface": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"noibat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"noivern": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nosepass": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"numel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nuzleaf": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"nymble": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"octillery": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"oddish": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ogerpon": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-cornerstone": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-cornerstonetera": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-hearthflame": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-hearthflametera": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-tealtera": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-wellspring": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"ogerpon-wellspringtera": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"oinkologne": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"oinkologne-f": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"okidogi": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"omanyte": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"onix": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"oranguru": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"orbeetle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"oricorio": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"oricorio-pau": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"oricorio-pompom": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"oricorio-sensu": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"orthworm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"oshawott": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pachirisu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pajantom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"palafin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"palafin-hero": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"palkia": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"palossand": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"palpitoad": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pancham": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"panpour": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pansage": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"paras": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"parasect": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"passimian": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"patrat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pawmi": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pawmo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pawmot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pawniard": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"persian-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"petilil": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"phantump": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pheromosa": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"phione": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pichu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pichu-spikyeared": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"pidgeot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pidgeot-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pidgey": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pidove": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pignite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pikachu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pikachu-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikachu-cosplay": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pikachu-hoenn": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikachu-kalos": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikachu-original": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikachu-partner": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikachu-sinnoh": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikachu-starter": {"normal":{"w":128,"h":128}},
	"pikachu-unova": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"pikipek": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"piloswine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pinsir": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pinsir-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"piplup": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"plasmanta": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pluffle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"poipole": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"politoed": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"poliwag": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"poliwhirl": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"poltchageist": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"poltchageist-artisan": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"polteageist": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"ponyta": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"poochyena": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"popplio": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"porygon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"porygon2": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"primarina": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"probopass": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"protowatt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"psyduck": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pumpkaboo-large": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pumpkaboo-small": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pumpkaboo-super": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pupitar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"purrloin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"purugly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pyroak": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pyroar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"pyukumuku": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"quagsire": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"quaquaval": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"quaxly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"quaxwell": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"quilava": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"quilladin": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"qwilfish": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"raboot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rabsca": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"raichu-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"raikou": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ralts": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ramnarok": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ramnarok-radiant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rampardos": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rapidash": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"raticate": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"raticate-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"rattata-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"rayquaza-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rebble": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"regigigas": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"registeel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"relicanth": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rellor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"remoraid": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"reshiram": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"reuniclus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"revavroom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"revenankh": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rhydon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rhyperior": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ribombee": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"rillaboom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"roaringmoon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rockruff": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"roggenrola": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rolycoly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rookidee": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"roselia": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"roserade": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rotom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rotom-fan": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rotom-frost": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rotom-heat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rotom-mow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rotom-wash": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"rowlet": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"rufflet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"runerigus": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"sableye": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sableye-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"saharaja": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"saharascal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"salamence": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"salamence-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"salandit": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"salazzle": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"samurott": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"samurott-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"sandaconda": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sandile": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sandshrew": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sandshrew-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"sandslash": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sandslash-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"sandygast": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"sandyshocks": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sawk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sawsbuck": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sawsbuck-autumn": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sawsbuck-summer": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sawsbuck-winter": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scatterbug": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scattervein": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sceptile-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scizor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scizor-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scolipede": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scorbunny": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scovillain": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scovillain-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"scrafty": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scraggy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scratchet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"screamtail": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"scyther": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"seadra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sealeo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"seedot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"seel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"seismitoad": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sentret": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"serperior": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"servine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"seviper": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sewaddle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sharpedo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sharpedo-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shaymin-sky": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shellos": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shellos-east": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shelmet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shieldon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shiftry": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shiinotic": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"shinx": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shox": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shroodle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shroomish": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shuckle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"shuppet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sigilyph": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"silcoon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"silicobra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"silvally": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-bug": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-dark": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-dragon": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-electric": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-fairy": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-fighting": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-fire": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-flying": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-ghost": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-grass": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-ground": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-ice": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-poison": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-psychic": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-rock": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-steel": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"silvally-water": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"simipour": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"simisage": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"simisear": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sinistcha": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"sinistcha-masterpiece": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"sizzlipede": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skarmory": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skarmory-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"skeledirge": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skiddo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skitty": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skorupi": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skrelp": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skuntank": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"skwovet": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slaking": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slakoth": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sliggoo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slitherwing": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slowbro": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slowbro-galar": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"slowbro-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slowking": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slowking-galar": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"slugma": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"slurpuff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"smeargle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"smogecko": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"smoguana": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"smokomodo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"smoliv": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"smoochum": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sneasel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sneasler": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"snivy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"snorlax": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"snorunt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"snover": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"snubbull": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"snugglow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sobble": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"solgaleo": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"solosis": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"solotl": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"solrock": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"spearow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"spewpa": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"spheal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"spidops": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"spiritomb": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sprigatito": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"spritzee": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"squawkabilly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"squawkabilly-blue": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"squawkabilly-white": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"squawkabilly-yellow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"stakataka": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"stantler": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"staraptor": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"staravia": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"starly": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"starmie": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"starmie-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"staryu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"steelix": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"steelix-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"steenee": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"stonjourner": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"stoutland": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"stufful": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"stunfisk": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"stunfisk-galar": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"stunky": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sudowoodo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"suicune": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sunflora": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sunkern": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"surskit": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swablu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swadloon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swalot": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swampert-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swellow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swinub": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swirlix": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swirlpool": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"swoobat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"syclant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"syclar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"sylveon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tactite": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tadbulb": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"taillow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"talonflame": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tandemaus": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tangela": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tangrowth": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tapubulu": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"tapufini": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"tapukoko": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"tapulele": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"tarountula": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tatsugiri": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tatsugiri-droopy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tatsugiri-stretchy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tauros": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tauros-paldeaaqua": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tauros-paldeablaze": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tauros-paldeacombat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tepig": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"thievul": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"thundurus-therian": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"thwackey": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tinglu": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tinkatink": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tinkaton": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tinkatuff": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"toedscool": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"toedscruel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"togedemaru": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"torkoal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tornadus-therian": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"torracat": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"torterra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"toucannon": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"toxapex": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"toxel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"toxtricity": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"toxtricity-lowkey": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"treecko": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"trevenant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tropius": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"trumbeak": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"tsareena": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"turtonator": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"typenull": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"typhlosion": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"typhlosion-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"tyranitar-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tyrantrum": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"tyrunt": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"unfezant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"ursaluna-bloodmoon": {"normal":{"w":96,"h":96},"shiny":{"w":96,"h":96}},
	"vanilluxe": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vaporeon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"varoom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"veluza": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"venomicon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"venomicon-epilogue": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"venusaur": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"venusaur-mega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"victreebel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"victreebel-mega": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"vikavolt": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"vivillon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-archipelago": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-continental": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-elegant": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-fancy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-garden": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-highplains": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-icysnow": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-jungle": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-marine": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-modern": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-monsoon": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-ocean": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-pokeball": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-polar": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-river": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-sandstorm": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-savanna": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-sun": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vivillon-tundra": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"volcarona": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"vulpix-alola": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"walkingwake": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wattrel": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"weavile": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"whimsicott": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wiglett": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wimpod": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"wishiwashi": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"wishiwashi-school": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"wochien": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wooloo": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wooper-paldea": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wormadam-sandy": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wormadam-trash": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wugtrio": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"wyrdeer": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"xerneas": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"xerneas-neutral": {"normal":{"w":120,"h":120}},
	"xurkitree": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"yamper": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"yanma": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"yanmega": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"yungoos": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"yveltal": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zangoose": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zapdos": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zebstrika": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zekrom": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zeraora": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"zoroark": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zoroark-hisui": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"zorua": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zubat": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zweilous": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zygarde": {"normal":{"w":120,"h":120},"shiny":{"w":120,"h":120}},
	"zygarde-10": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
	"zygarde-complete": {"normal":{"w":128,"h":128},"shiny":{"w":128,"h":128}},
};

// These species have supplied BW artwork that should take precedence over
// native 3D Team Builder art.
const FORCE_GEN5_TEAMBUILDER_SPRITES = new Set<ID>(['dusknoir', 'mightyena', 'mightyenadeso', 'reuniclus']);

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
	private spriteDataCache = new Map<string, AnyObject>();
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
		const avatarid = toID(avatar);
		if (LOCAL_CUSTOM_AVATAR_IDS.has(avatarid)) return `/sprites/trainers/${avatarid}.png`;
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
			const customSpeciesId = CUSTOM_SPECIES_ID_ALIASES[id];
			if (customSpeciesId) {
				id = customSpeciesId;
				formid = id;
			}
			const hasCustomUpdate = id in CUSTOM_SPECIES_UPDATES;
			if (!window.BattlePokedexAltForms) window.BattlePokedexAltForms = {};
			if (hasCustomUpdate) ensureCustomSpecies(id);
			if (formid in window.BattlePokedexAltForms && !(formid in CUSTOM_SPECIES) && !hasCustomUpdate) return window.BattlePokedexAltForms[formid];
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
		ensureCustomDataPatches();
		if (this.abilityEffectDataTable !== window.BattleAbilities) {
			this.abilityEffectDataTable = window.BattleAbilities;
			this.abilityEffectCache = {};
		}
		if (this.abilityEffectCache[abilityId]) return this.abilityEffectCache[abilityId];
		if (visiting.has(abilityId)) return new Set<ID>([abilityId]);

		const effects = new Set<ID>([abilityId]);
		const source = CUSTOM_ABILITY_UPDATES[abilityId] || window.BattleAbilities?.[abilityId];
		if (!source) {
			this.abilityEffectCache[abilityId] = effects;
			return effects;
		}

		const nextVisiting = new Set(visiting);
		nextVisiting.add(abilityId);
		const directComponents = new Set<ID>(CUSTOM_ABILITY_COMPONENT_OVERRIDES[abilityId] || []);
		// Compact descriptions are the canonical component summary; long descriptions may
		// mention abilities only as comparisons or examples. Keep the no-miss check narrow
		// so conditional effects such as Precision do not become No Guard.
		const description = `${source.shortDesc || source.desc || ''}`.replace(/\u2019/g, "'");
		const fullDescription = `${source.shortDesc || ''} ${source.desc || ''}`.replace(/\u2019/g, "'");
		if (
			/(?:this Pokemon's|its)\s+(?:moves|attacks)\s+(?:cannot|can't|never)\s+miss\b/i.test(fullDescription) ||
			/(?:^|[.;]\s*)(?:all\s+)?(?:moves|attacks)(?:\s+used by this Pokemon)?\s+(?:cannot|can't|never)\s+miss\b/i.test(fullDescription) ||
			/(?:this Pokemon's|its)\s+moves\s+ignore accuracy checks\b/i.test(fullDescription)
		) {
			directComponents.add('noguard' as ID);
		}
		for (const componentId in (window.BattleAbilities || {})) {
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
		this.spriteDataCache.clear();

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
		const baseSpeciesId = toID(species.baseSpecies || species.name);
		if (FORCE_SHINY_CUSTOM_SPRITE_IDS.has((requestedSpriteid || species.id) as ID)) options.shiny = true;
		ensureCustomBWSpriteData();
		const spriteCacheKey = [
			requestedSpriteid || species.id, species.id, isFront ? 1 : 0, options.gen || 6, options.shiny ? 1 : 0, options.gender || '',
			options.afd ? 1 : 0, options.noScale ? 1 : 0, options.teamPreview ? 1 : 0, options.mod || '',
			isDynamax ? 1 : 0, Dex.prefs('nopastgens') ? 1 : 0, Dex.prefs('bwgfx') ? 1 : 0,
			Dex.prefs('noanim') ? 1 : 0, Dex.prefs('nogif') ? 1 : 0,
		].join('|');
		const cachedSpriteData = this.spriteDataCache.get(spriteCacheKey);
		if (cachedSpriteData) return {...cachedSpriteData};
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
		const customSpriteSpeciesId = requestedSpriteid || species.id;
		let name = CUSTOM_SPECIES[customSpriteSpeciesId]?.data?.spriteid ||
			CUSTOM_SPECIES_UPDATES[customSpriteSpeciesId]?.spriteid || species.spriteid;
		if (requestedSpriteid && SILVALLY_FORME_TYPES[requestedSpriteid]) name = CUSTOM_ICON_SPRITES[requestedSpriteid] || requestedSpriteid;
		if (requestedSpriteid && CUSTOM_STATIC_BATTLE_SPRITES[requestedSpriteid]) {
			name = CUSTOM_SPECIES[customSpriteSpeciesId]?.data?.spriteid || requestedSpriteid;
		}
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
		if (species.id === 'heracross' || species.id === 'hydreigon' || species.id === 'milotic' || species.id === 'miloticalt' || species.id === 'miloticaevian' || species.id === 'gastrodonaevian' || species.id === 'gastrodoneastaevian' || species.id === 'hypnopulse' || species.id === 'pidgeot' || species.id === 'staraptor' || species.id === 'pinsirmega' || species.id === 'frosmoth' || species.id === 'runerigus' || species.id === 'manectric' || species.id === 'manectricmega' || species.id === 'basculegion' || species.id === 'basculegionf' || species.id === 'cinderacegmax' || species.id.startsWith('furfrou') ||
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
		const defaultBackSprite = !isFront && CUSTOM_DEFAULT_BACK_SPRITES[speciesid];
		if (defaultBackSprite) {
			speciesid = defaultBackSprite;
			name = Dex.species.get(defaultBackSprite).spriteid;
		}
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
		const baseSpriteId = getCustomBaseSpriteId(speciesid);
		if (!animationData && baseSpriteId) animationData = BattlePokemonSprites?.[baseSpriteId] || window.BattlePokemonSpritesBW?.[baseSpriteId];
		if (!miscData && baseSpriteId) miscData = BattlePokemonSprites?.[baseSpriteId] || window.BattlePokemonSpritesBW?.[baseSpriteId];
		if (!animationData) animationData = {};
		if (!miscData) miscData = {};
		const usesBaseVariantCry = isCustomVisualForm(species) && !species.standalone;
		const crySpecies = usesBaseVariantCry ? Dex.species.get(customVariantFamilyId(species)) : species;
		const cryBaseSpeciesid = toID(crySpecies.baseSpecies || crySpecies.name);
		const speciesNameId = toID(species.name);
		const customCryUrl = speciesNameId === 'breloommega' ? 'audio/cries/breloom.mp3' : speciesNameId === 'luxraymega' ? 'audio/cries/luxray.mp3' : speciesNameId === 'sharpedomegay' ? 'audio/cries/sharpedo-megay.ogg' :
			speciesNameId === 'noivernmega' ? 'audio/cries/noivern-mega.ogg' :
			speciesNameId === 'weavilemega' ? 'audio/cries/weavile-mega.ogg' :
			speciesNameId === 'noctowlmega' ? 'audio/cries/noctowl-mega.ogg' :
			speciesNameId === 'roserademega' ? 'audio/cries/roserade-mega.ogg' :
			speciesNameId === 'dusknoirmega' ? 'audio/cries/dusknoir-mega.ogg' :
			speciesNameId === 'umbreonperfect' ? 'audio/cries/umbreon-perfect.ogg' :
			speciesNameId === 'divineon' ? 'audio/cries/divineon.ogg' :
			speciesNameId === 'abysseon' ? 'audio/cries/abysseon.ogg' : '';

		if (miscData.num !== 0 && miscData.num > -5000) {
			spriteData.cryurl = 'audio/cries/' + cryBaseSpeciesid;
			let formeid = species.formeid;
			if (!usesBaseVariantCry && (species.isMega || formeid && (
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
				baseSpeciesId === 'calyrex' ||
				baseSpeciesId === 'kyurem' ||
				baseSpeciesId === 'cramorant' ||
				baseSpeciesId === 'indeedee' ||
				baseSpeciesId === 'lycanroc' ||
				baseSpeciesId === 'necrozma' ||
				baseSpeciesId === 'oinkologne' ||
				baseSpeciesId === 'oricorio' ||
				baseSpeciesId === 'slowpoke' ||
				baseSpeciesId === 'tatsugiri' ||
				cryBaseSpeciesid === 'zygarde'
			))) {
				spriteData.cryurl += formeid;
			}
			spriteData.cryurl += '.mp3';
		}
		if (customCryUrl) spriteData.cryurl = customCryUrl;

		if (options.shiny && mechanicsGen > 1 && !MISSING_SHINY_SPRITE_IDS.has(toID(name))) dir += '-shiny';

		// April Fool's 2014
		const hasCustomGen5Sprite = !!(
			CUSTOM_STATIC_BATTLE_SPRITES[speciesid] || CUSTOM_BW_SPRITES[speciesid] || CUSTOM_ICON_SPRITES[speciesid]
		);
		if ((window.Config?.server?.afd || Dex.prefs('afd') || options.afd) && !hasCustomGen5Sprite) {
			dir = 'afd' + dir;
			spriteData.url += dir + '/' + name + '.png' + customSpriteRevision(name);
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
			spriteData.cryurl = `sprites/${options.mod}/audio/${cryBaseSpeciesid}`;
			spriteData.cryurl += '.mp3';
		}
		if (customCryUrl) spriteData.cryurl = customCryUrl;

		if (animationData[facing + 'f'] && options.gender === 'F') facing += 'f';
		let allowAnim = !Dex.prefs('noanim') && !Dex.prefs('nogif');
		if (speciesid === 'jolteon' && options.shiny) allowAnim = false;
		if (speciesid === 'glaceon' && options.shiny) allowAnim = false;
		if (speciesid === 'espeon' && options.shiny) allowAnim = false;
		// Hydreigon keeps its normal animated sprites, but uses the supplied static shiny art.
		if (speciesid === 'hydreigon' && options.shiny) allowAnim = false;
		let customStaticBattleSpriteid = speciesid;
		if (options.gender === 'F' && CUSTOM_STATIC_BATTLE_SPRITES[`${speciesid}f`]) {
			customStaticBattleSpriteid = `${speciesid}f`;
		}
		const allowCustomAnimation = CUSTOM_ANIMATED_BW_SPRITES.has(customStaticBattleSpriteid) ||
			CUSTOM_ANIMATED_BW_SPRITES.has(speciesid);
		const forceStaticShiny = options.shiny && (
			CUSTOM_STATIC_SHINY_BW_SPRITES.has(customStaticBattleSpriteid) ||
			CUSTOM_STATIC_SHINY_BW_SPRITES.has(speciesid)
		);
		if (isSilvallySpecies(speciesid) || isSilvallySpecies(customStaticBattleSpriteid)) allowAnim = false;
		if (forceStaticShiny) allowAnim = false;
		if (CUSTOM_ICON_SPRITES[speciesid] && !allowCustomAnimation) allowAnim = false;
		const customStaticBattleSprite = CUSTOM_STATIC_BATTLE_SPRITES[customStaticBattleSpriteid];
		if (customStaticBattleSprite && !allowCustomAnimation) allowAnim = false;
		const customBWSprite = CUSTOM_BW_SPRITES[speciesid];
		const customBWUsesBaseSprite = !!customBWSprite && !getSpriteSize(customBWSprite, isFront, options.shiny);
		if (customBWSprite && !allowCustomAnimation) allowAnim = false;
		if (allowAnim && spriteData.gen >= 6) spriteData.pixelated = false;
		const animation = animationData?.[facing];
		if (allowAnim && animation?.w && animation?.h && spriteData.gen >= 5) {
			if (facing.slice(-1) === 'f') name += '-f';
			dir = baseDir + 'ani' + dir;

			spriteData.w = animation.w;
			spriteData.h = animation.h;
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
			if (customBWUsesBaseSprite && baseSpriteId) name = Dex.species.get(baseSpriteId).spriteid;

			spriteData.url += dir + '/' + name + '.png';
		}
		let customSpriteNaturalSize: {w: number, h: number} | undefined;
		if (speciesid === 'jolteon' && options.shiny && (baseDir === 'gen5' || !baseDir)) {
			spriteData.w = 92;
			spriteData.h = isFront ? 98 : 96;
		}
		if (customStaticBattleSprite) {
			const customSpriteSize = getCustomSpriteSize(customStaticBattleSpriteid, customStaticBattleSprite, isFront, options.shiny);
			customSpriteNaturalSize = customSpriteSize;
			spriteData.w = customSpriteSize.w;
			spriteData.h = customSpriteSize.h;
		} else if (customBWSprite && (spriteData.gen === 5 || options.shiny)) {
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
			const previewSpriteMaxSize = isFront ?
				CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_SIZE_OVERRIDES[speciesid] :
				CUSTOM_TEAM_PREVIEW_BACK_SPRITE_SIZE_OVERRIDES[speciesid];
			const maxWidth = isFront ?
				(isGmax ? CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_WIDTH :
					isMega ? CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_WIDTH :
						previewSpriteMaxSize?.w || CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_WIDTH) :
				(isGmax ? CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_WIDTH :
					isMega ? CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_WIDTH :
						previewSpriteMaxSize?.w || CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_WIDTH);
			const maxHeight = isFront ?
				(isGmax ? CUSTOM_TEAM_PREVIEW_FRONT_GMAX_SPRITE_MAX_HEIGHT :
					isMega ? CUSTOM_TEAM_PREVIEW_FRONT_MEGA_SPRITE_MAX_HEIGHT :
						previewSpriteMaxSize?.h || CUSTOM_TEAM_PREVIEW_FRONT_SPRITE_MAX_HEIGHT) :
				(isGmax ? CUSTOM_TEAM_PREVIEW_BACK_GMAX_SPRITE_MAX_HEIGHT :
					isMega ? CUSTOM_TEAM_PREVIEW_BACK_MEGA_SPRITE_MAX_HEIGHT :
						previewSpriteMaxSize?.h || CUSTOM_TEAM_PREVIEW_BACK_SPRITE_MAX_HEIGHT);
			const scale = Math.min(maxWidth / spriteData.w, maxHeight / spriteData.h);
			if (scale < 1) {
				spriteData.w = Math.max(1, Math.round(spriteData.w * scale));
				spriteData.h = Math.max(1, Math.round(spriteData.h * scale));
			}
		}

		if (this.spriteDataCache.size >= 512) this.spriteDataCache.clear();
		this.spriteDataCache.set(spriteCacheKey, spriteData);
		if (!spriteData.url.includes('?')) spriteData.url += customSpriteRevision(name);
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
				num = window.BattlePokemonIconIndexes?.[id + 'f'] ?? num;
			}
		}
		if (facingLeft) {
			if (window.BattlePokemonIconIndexesLeft?.[id]) {
				num = window.BattlePokemonIconIndexesLeft[id];
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
		const iconSpecies = Dex.species.get(id);
		if (iconSpecies.exists) id = iconSpecies.id;
		// Parasitism uses its covered host sprite everywhere except the battle team preview.
		// @ts-ignore
		if (id === 'parasect' && toID(pokemon?.ability) === 'parasitism') id = 'parasectparasitism' as ID;
		// @ts-ignore
		if (pokemon?.volatiles?.formechange && !pokemon.volatiles.transform) {
			// @ts-ignore
			id = toID(pokemon.volatiles.formechange[1]);
		}
		if (id.startsWith('furfrou') && CUSTOM_STATIC_BATTLE_SPRITES[id]) {
			const isFemale = pokemon?.gender === 'F' && !!CUSTOM_STATIC_BATTLE_SPRITES[`${id}f`];
			const spriteid = (CUSTOM_ICON_SPRITES[id] || iconSpecies.spriteid) + (isFemale ? '-f' : '');
			const shinyDir = pokemon?.shiny ? '-shiny' : '';
			const fainted = (pokemon as Pokemon | ServerPokemon)?.fainted ? ';opacity:.3;filter:grayscale(100%) brightness(.5)' : '';
			return `background:transparent url(${Dex.resourcePrefix}sprites/gen5${shinyDir}/${spriteid}.png) no-repeat center / contain${fainted}`;
		}
		if (ROTOM_SHINY_SPRITE_IDS.has(id) && typeof pokemon === 'object' && pokemon?.shiny) {
			const filename = id === 'rotom' ? 'rotom' : 'rotom-' + id.slice(5);
			const fainted = (pokemon as Pokemon | ServerPokemon).fainted ? ';opacity:.3;filter:grayscale(100%) brightness(.5)' : '';
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons/${filename}-shiny.png?v=rotom-shiny-1) no-repeat center / contain${fainted}`;
		}
		const customPartyIcon = CUSTOM_PARTY_ICON_SPRITES[id];
		if (customPartyIcon) {
			const iconPokemon = typeof pokemon === 'object' && pokemon !== null ? pokemon : null;
			const isShiny = !!iconPokemon?.shiny || isSilvallySpecies(id);
			const isFemale = iconPokemon?.gender === 'F';
			const iconFile = isShiny ? (isFemale ? customPartyIcon.shinyFemale : customPartyIcon.shiny) :
				(isFemale ? customPartyIcon.normalFemale : customPartyIcon.normal);
			const fainted = ((pokemon as Pokemon | ServerPokemon)?.fainted ? `;opacity:.3;filter:grayscale(100%) brightness(.5)` : ``);
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons/${iconFile}${customSpriteRevision(id)}) no-repeat center / contain${fainted}`;
		}
		// A sprite alias is safe only when it names the exact displayed artwork.
		let menuId: string = id;
		const spriteAlias = toID(CUSTOM_ICON_SPRITES[id] || iconSpecies.spriteid);
		if (OFFICIAL_MENU_ICON_INDEXES[menuId] === undefined && OFFICIAL_MENU_ICON_INDEXES[spriteAlias] !== undefined) {
			menuId = spriteAlias;
		}
		if (pokemon?.gender === 'F' && ['unfezant', 'frillish', 'jellicent', 'meowstic', 'pyroar'].includes(menuId)) menuId += 'f';
		const officialNum = (facingLeft ? OFFICIAL_MENU_ICON_INDEXES_LEFT[menuId] : undefined) ?? OFFICIAL_MENU_ICON_INDEXES[menuId];
		if (officialNum !== undefined) {
			const top = Math.floor(officialNum / 12) * 30;
			const left = (officialNum % 12) * 40;
			const fainted = (pokemon as Pokemon | ServerPokemon)?.fainted ? ';opacity:.3;filter:grayscale(100%) brightness(.5)' : '';
			return `background:transparent url(${Dex.resourcePrefix}sprites/pokemonicons-official-sheet.png?v1) no-repeat scroll -${left}px -${top}px${fainted}`;
		}
		// Only custom forms without an exact menu icon need battle-art fallback.
		const customIcon = CUSTOM_ICON_SPRITES[id] || CUSTOM_MENU_SPRITE_FALLBACKS[id];
		if (customIcon) {
			const shinyDir = FORCE_SHINY_CUSTOM_SPRITE_IDS.has(id) ? '-shiny' : '';
			const fainted = ((pokemon as Pokemon | ServerPokemon)?.fainted ? `;opacity:.3;filter:grayscale(100%) brightness(.5)` : ``);
			return `background:transparent url(${Dex.resourcePrefix}sprites/gen5${shinyDir}/${customIcon}.png${customSpriteRevision(customIcon)}) no-repeat center / contain${fainted}`;
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
		const forceShiny = FORCE_SHINY_CUSTOM_SPRITE_IDS.has(id);
		const isShiny = !!pokemon.shiny || forceShiny;
		let spriteid = pokemon.spriteid;
		let species = Dex.species.get(pokemon.species);
		// Use the resolved species ID so display aliases such as Granbull-Reborn
		// still reach their canonical custom sprite metadata.
		id = species.id;
		const customSpeciesData = CUSTOM_SPECIES[id]?.data;
		const customSpeciesUpdate = CUSTOM_SPECIES_UPDATES[id];
		if (id === 'parasect' && toID(pokemon.ability) === 'parasitism') {
			id = 'parasectparasitism' as ID;
			spriteid = 'parasect-parasitism';
			species = Dex.species.get('Parasect-Parasitism');
		}
		if (pokemon.species && !spriteid) {
			spriteid = customSpeciesData?.spriteid || customSpeciesUpdate?.spriteid || species.spriteid || toID(pokemon.species);
		}
		if (customSpeciesData?.spriteid) spriteid = customSpeciesData.spriteid;
		if (customSpeciesUpdate?.spriteid) spriteid = customSpeciesUpdate.spriteid;
		if (CUSTOM_ICON_SPRITES[id]) spriteid = CUSTOM_ICON_SPRITES[id];
		if (species.exists === false) return { spriteDir: 'sprites/gen5', spriteid: '0', x: 10, y: 5 };
		// Battle and menu overrides must not displace dedicated Team Builder art.
		// Keep explicit older-generation graphics and exact custom forme fallbacks.
		const artGen = Dex.prefs('nopastgens') ? 6 : gen;
		const nativeArt = NATIVE_TEAMBUILDER_ART[spriteid];
		if (nativeArt && !(id === 'archeops' && isShiny) && (!artGen || artGen >= 6) && !Dex.prefs('bwgfx') &&
			!(window.Config?.server?.afd || Dex.prefs('afd')) && !FORCE_GEN5_TEAMBUILDER_SPRITES.has(id) && !id.startsWith('furfrou') && !isSilvallySpecies(id)) {
			const useShiny = isShiny && !!nativeArt.shiny;
			const size = (useShiny ? nativeArt.shiny : nativeArt.normal)!;
			// Native dex images include their own padding; fit the entire canvas.
			const scale = Math.min(1, 96 / size.w, 96 / size.h);
			const width = Math.round(size.w * scale);
			return {
				spriteDir: 'sprites/dex', spriteid, shiny: useShiny,
				x: Math.round((96 - width) / 2), y: Math.round((96 - size.h * scale) / 2),
				backgroundSize: width + 'px auto',
			};
		}
		const femaleSpriteId = `${id}f`;
		if (pokemon.gender === 'F' && (
			CUSTOM_STATIC_BATTLE_SPRITES[femaleSpriteId] || CUSTOM_BW_SPRITES[femaleSpriteId]
		)) {
			id = femaleSpriteId as ID;
			spriteid = CUSTOM_ICON_SPRITES[id] || `${spriteid}-f`;
		}
		const hasCustomGen5Sprite = !!(
			CUSTOM_STATIC_BATTLE_SPRITES[id] || CUSTOM_ICON_SPRITES[id] || CUSTOM_BW_SPRITES[id] || CUSTOM_TEAMBUILDER_SPRITE_DIMENSIONS[id]
		);
		if ((window.Config?.server?.afd || Dex.prefs('afd')) && !hasCustomGen5Sprite) {
			return {
				spriteid,
				spriteDir: 'sprites/afd',
				shiny: isShiny,
				x: 10,
				y: 5,
			};
		}
		// Prefer the complete Gen 5 shiny art in Team Builder when it exists.
		// Known empty legacy shiny files still use the modern fallback below.
		const preferGen5Shiny = isShiny && !MISSING_SHINY_SPRITE_IDS.has(toID(spriteid));
	const customStaticData = CUSTOM_STATIC_BATTLE_SPRITES[id];
	const customBWData = CUSTOM_BW_SPRITES[id];
	const customTeamBuilderDimensions = CUSTOM_TEAMBUILDER_SPRITE_DIMENSIONS[id];
	const hasCustomShinySprite = customStaticData ?
		!!copySpriteSize(customStaticData.shinyFront) || !MISSING_SHINY_SPRITE_IDS.has(toID(spriteid)) :
		customBWData ?
			!!copySpriteSize(customBWData.shinyFront) || !!copySpriteSize(customNativeBWSpriteSizes[id]?.shinyFront) || !MISSING_SHINY_SPRITE_IDS.has(toID(spriteid)) :
		customTeamBuilderDimensions ? !MISSING_SHINY_SPRITE_IDS.has(toID(spriteid)) :
			hasCustomGen5Sprite ? !MISSING_SHINY_SPRITE_IDS.has(toID(spriteid)) : species.isNonstandard !== 'Custom';
	const spriteData: TeambuilderSpriteData = {
			spriteid,
			spriteDir: 'sprites/dex',
			x: -2,
			y: -3,
		};
		if (isShiny && hasCustomShinySprite) spriteData.shiny = true;
		if (id.startsWith('silvally')) spriteData.shiny = true;
		if (id === 'greninjabond' && !CUSTOM_BW_SPRITES[id]) {
			spriteData.spriteid = 'greninja';
			spriteData.x = -6;
			spriteData.y = -7;
			return spriteData;
		}
		if (CUSTOM_STATIC_BATTLE_SPRITES[id] || CUSTOM_ICON_SPRITES[id] || CUSTOM_BW_SPRITES[id] || customTeamBuilderDimensions) {
			spriteData.spriteDir = 'sprites/gen5';
			const customStaticData = CUSTOM_STATIC_BATTLE_SPRITES[id];
			const customBWData = CUSTOM_BW_SPRITES[id];
			const customTeamBuilderSize = CUSTOM_TEAMBUILDER_SPRITE_SIZE_OVERRIDES[id];
			const spriteDimensions = customStaticData ?
				getCustomSpriteSize(id, customStaticData, true, isShiny) :
				customBWData ? getCustomSpriteSize(id, customBWData, true, isShiny) :
				customTeamBuilderDimensions ? {
					w: isShiny ? (customTeamBuilderDimensions.shinyW || customTeamBuilderDimensions.w) : customTeamBuilderDimensions.w,
					h: isShiny ? (customTeamBuilderDimensions.shinyH || customTeamBuilderDimensions.h) : customTeamBuilderDimensions.h,
				} :
				customTeamBuilderSize;
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
		if ((!gen || gen >= 6) && xydexExists && !preferGen5Shiny) {
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
			if (isShiny && MISSING_SHINY_SPRITE_IDS.has(toID(spriteid))) spriteData.shiny = false;
			return spriteData;
		}
		if (gen === 5 && isShiny && spriteData.shiny && MISSING_SHINY_SPRITE_IDS.has(toID(spriteid)) && !hasCustomGen5Sprite) {
			// Legacy Gen 5 shiny placeholders should use the complete modern art.
			return {...spriteData, spriteDir: 'sprites/dex'};
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
				getCustomSpriteSize(id, customStaticData, true, isShiny) :
				customBWData ? getCustomSpriteSize(id, customBWData, true, isShiny) : undefined;
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
		const revision = customSpriteRevision(data.spriteid);
		const spriteURL = Dex.resourcePrefix + data.spriteDir + '/' + data.spriteid + '.png' + revision;
		// Keep the shiny and normal artwork mutually exclusive. Layering a
		// transparent shiny PNG over the normal PNG leaves the normal sprite
		// visible behind it in the Team Builder.
		const backgroundImage = 'url(' + (data.shiny ?
			Dex.resourcePrefix + data.spriteDir + '-shiny/' + data.spriteid + '.png' + revision : spriteURL) + ')';
		return 'background-image:' + backgroundImage + ';background-position:' + data.x + 'px ' + data.y + 'px;background-repeat:no-repeat' + (data.backgroundSize ? ';background-size:' + data.backgroundSize : '');
	}

	getItemIcon(item: any) {
		const itemId = toID(typeof item === 'string' ? item : item?.id || item?.name);
		const customIcon = CUSTOM_ITEM_ICON_SPRITES[itemId];
		if (customIcon) {
			return `background:transparent url(${Dex.resourcePrefix}sprites/itemicons/${customIcon}?v1) no-repeat center / 24px 24px`;
		}
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
		['', '0', '1', 'H', 'S', 'E', 'F'].includes(ability) ? species.abilities[ability as '0' | '1' | 'H' | 'S' | 'E' | 'F' || '0'] : ability);
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
