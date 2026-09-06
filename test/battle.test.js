const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

window = global;

global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex.js').BattlePokedex;
global.BattleAbilities = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
const BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables.js').BattleTeambuilderTable;
for (let gen = 1; gen <= 9; gen++) {
	const table = BattleTeambuilderTable['gen' + gen] = BattleTeambuilderTable.gen9natdex;
	for (const key of ['overrideAbilityData', 'overrideItemDesc', 'overrideMoveData', 'overrideSpeciesData', 'overrideTypeChart', 'removeType']) {
		if (!table[key]) table[key] = {};
	}
}
global.BattleTeambuilderTable = BattleTeambuilderTable;
require('../play.pokemonshowdown.com/js/battle-dex-data.js');
require('../play.pokemonshowdown.com/js/battle-dex.js');
require('../play.pokemonshowdown.com/js/battle-scene-stub.js');
// global.BattleText = require('../play.pokemonshowdown.com/data/text.js').BattleText;
require('../play.pokemonshowdown.com/js/battle-text-parser.js');
require('../play.pokemonshowdown.com/js/battle.js');

describe('Battle', () => {
	it('registers Mega Sunflora stats, stone, ability, and all four BW sprites', () => {
		global.BattleItems = require('../play.pokemonshowdown.com/data/items.js').BattleItems;
		const base = Dex.species.get('Sunflora');
		assert.equal(base.baseStats.def, 75);
		assert.equal(base.baseStats.spd, 90);
		assert(base.otherFormes.includes('Sunflora-Mega'));
		const mega = Dex.species.get('Sunflora-Mega');
		assert.deepEqual(mega.baseStats, {hp: 95, atk: 70, def: 105, spa: 155, spd: 115, spe: 30});
		assert.deepEqual(mega.types, ['Grass', 'Fire']);
		assert.equal(mega.abilities[0], 'Solar Hydra');
		assert.equal(Dex.items.get('Sunflorite').megaStone.Sunflora, 'Sunflora-Mega');
		assert.match(Dex.getItemIcon('Sunflorite'), /itemicons\/sunflorite.png/);
		for (const gen of [5, 9]) {
			for (const shiny of [false, true]) {
				for (const front of [false, true]) {
					const sprite = Dex.getSpriteData('Sunflora-Mega', front, {gen, shiny});
					const dir = `gen5${front ? '' : '-back'}${shiny ? '-shiny' : ''}`;
					assert(sprite.url.includes(`/sprites/${dir}/sunflora-mega.png`), sprite.url);
					assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', dir, 'sunflora-mega.png')));
				}
			}
		}
	});
	it('registers Claydol-Mega, Claydolite, and all four supplied BW sprites', () => {
		global.BattleItems = require('../play.pokemonshowdown.com/data/items.js').BattleItems;
		const mega = Dex.species.get('Claydol-Mega');
		assert.deepEqual(mega.types, ['Ground', 'Psychic']);
		assert.deepEqual(mega.baseStats, {hp: 60, atk: 70, def: 135, spa: 130, spd: 150, spe: 55});
		assert.equal(mega.abilities[0], 'Astral Engine');
		assert(Dex.species.get('Claydol').otherFormes.includes('Claydol-Mega'));
		assert.equal(Dex.items.get('Claydolite').megaStone.Claydol, 'Claydol-Mega');
		assert.match(Dex.getItemIcon('Claydolite'), /itemicons\/claydolite.png/);
		for (const gen of [5, 9]) {
			for (const shiny of [false, true]) {
				for (const front of [false, true]) {
					const sprite = Dex.getSpriteData('Claydol-Mega', front, {gen, shiny});
					const dir = `gen5${front ? '' : '-back'}${shiny ? '-shiny' : ''}`;
					assert(sprite.url.includes(`/sprites/${dir}/claydol-mega.png`), sprite.url);
					assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', dir, 'claydol-mega.png')));
				}
			}
		}
	});
	it('uses BW sprites for custom Furfrou trims and the base BW back sprite fallback', () => {
		for (const trim of ['Heart', 'Star', 'Diamond', 'Debutante', 'Matron', 'Dandy', 'La Reine', 'Kabuki', 'Pharaoh']) {
			const id = trim === 'La Reine' ? 'furfroulareine' : `furfrou${trim.toLowerCase()}`;
			const front = Dex.getSpriteData(`Furfrou-${trim}`, true, {gen: 9});
			assert(front.url.includes(`/sprites/gen5/furfrou-${id.slice(7)}.png`), front.url);
			assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites/gen5', `furfrou-${id.slice(7)}.png`)));
			const back = Dex.getSpriteData(`Furfrou-${trim}`, false, {gen: 9});
			assert(back.url.includes('/sprites/gen5-back/furfrou.png'), back.url);
		}
	});

	it('should process a bunch of messages properly', () => {
		let battle = new Battle({
			debug: true,
			log: [
				"|init|battle",
				"|title|FOO vs. BAR",
				"|j|FOO",
				"|j|BAR",
				"|request|",
				"|player|p1|FOO|169",
				"|player|p2|BAR|265",
				"|teamsize|p1|6",
				"|teamsize|p2|6",
				"|gametype|singles",
				"|gen|7",
				"|tier|[Gen 7] Random Battle",
				"|rated|",
				"|seed|",
				"|rule|Sleep Clause Mod: Limit one foe put to sleep",
				"|rule|HP Percentage Mod: HP is shown in percentages",
				"|",
				"|start",
				"|switch|p1a: Leafeon|Leafeon, L83, F|100/100",
				"|switch|p2a: Gliscor|Gliscor, L77, F|242/242",
				"|turn|1",
			],
		});

		let p1 = battle.sides[0];
		let p2 = battle.sides[1];

		assert(p1.name === 'FOO');
		let p1leafeon = p1.pokemon[0];
		assert(p1leafeon.ident === 'p1: Leafeon');
		assert(p1leafeon.details === 'Leafeon, L83, F');
		assert(p1leafeon.hp === 100);
		assert(p1leafeon.maxhp === 100);
		assert(p1leafeon.isActive());
		assert.deepEqual(p1leafeon.moveTrack, []);

		assert(p2.name === 'BAR');
		let p2gliscor = p2.pokemon[0];
		assert(p2gliscor.ident === 'p2: Gliscor');
		assert(p2gliscor.details === 'Gliscor, L77, F');
		assert(p2gliscor.hp === 242);
		assert(p2gliscor.maxhp === 242);
		assert(p2gliscor.isActive());
		assert.deepEqual(p2gliscor.moveTrack, []);

		for (const line of [
			"|",
			"|switch|p2a: Kyurem|Kyurem-White, L73|303/303",
			"|-ability|p2a: Kyurem|Turboblaze",
			"|move|p1a: Leafeon|Knock Off|p2a: Kyurem",
			"|-damage|p2a: Kyurem|226/303",
			"|-enditem|p2a: Kyurem|Leftovers|[from] move: Knock Off|[of] p1a: Leafeon",
			"|",
			"|upkeep",
			"|turn|2",
			"|inactive|Time left: 150 sec this turn | 740 sec total",
		]) {
			battle.add(line);
		}

		assert(!p2gliscor.isActive());
		let p2kyurem = p2.pokemon[1];
		assert(p2kyurem.ident === 'p2: Kyurem');
		assert(p2kyurem.details === 'Kyurem-White, L73');
		assert(p2kyurem.hp === 226);
		assert(p2kyurem.maxhp === 303);
		assert(p2kyurem.isActive());
		assert(p2kyurem.item === '');
		assert(p2kyurem.prevItem === 'Leftovers');

		assert.deepEqual(p1leafeon.moveTrack, [['Knock Off', 1]]);
	});
});

describe('Team Builder sprites', () => {
	it('uses one mutually exclusive normal or shiny sprite layer', () => {
		const shinySprite = Dex.getTeambuilderSprite({species: 'Lucario-Mega-Z', shiny: true}, 9);
		assert.match(shinySprite, /background-image:url\([^,]+\);/);
		assert(shinySprite.includes('/sprites/gen5-shiny/lucario-megaz.png'));
		assert(!shinySprite.includes('/sprites/gen5/lucario-megaz.png'));

		const normalSprite = Dex.getTeambuilderSprite({species: 'Lucario-Mega-Z'}, 9);
		assert.match(normalSprite, /background-image:url\([^,]+\);/);
		assert(normalSprite.includes('/sprites/gen5/lucario-megaz.png'));
		assert(!normalSprite.includes('/sprites/gen5-shiny/lucario-megaz.png'));
	});

	it('falls back to normal Team Builder art when a shiny asset is empty', () => {
		const sprite = Dex.getTeambuilderSprite({species: 'Togekiss', shiny: true}, 9);
		assert(sprite.includes('/sprites/dex/togekiss.png'), sprite);
		assert(!sprite.includes('/sprites/dex-shiny/togekiss.png'), sprite);
	});

	it('constrains oversized Team Builder sprites', () => {
		const sprite = Dex.getTeambuilderSprite({species: 'Hydreigon'}, 9);
		assert(sprite.includes('background-size:82px auto'), sprite);
		const feraligatr = Dex.getTeambuilderSprite({species: 'Feraligatr'}, 9);
		assert(feraligatr.includes('background-position:9px 8px'), feraligatr);
		assert(feraligatr.includes('background-size:78px auto'), feraligatr);
		const laprasGmax = Dex.getTeambuilderSprite({species: 'Lapras-Gmax'}, 9);
		assert(laprasGmax.includes('background-position:9px 8px'), laprasGmax);
		assert(laprasGmax.includes('background-size:79px auto'), laprasGmax);
	});

	it('resolves all Reborn trainer avatars to local client assets', () => {
		const avatars = [
			'adrienn', 'alainalt', 'amaria', 'amelia', 'asriel', 'aurora', 'charlotte', 'florinia', 'geara', 'julia',
			'lin', 'radomus', 'saphira', 'sirius', 'shiv', 'shivalt', 'taka', 'titania', 'tyrant', 'zetta',
		];
		const avatarPicker = fs.readFileSync(path.join(
			__dirname, '..', 'play.pokemonshowdown.com', 'js', 'panel-popups.js'
		), 'utf8');
		for (const avatar of avatars) {
			assert.equal(Dex.resolveAvatar(avatar), `/sprites/trainers/${avatar}.png`);
			assert(fs.existsSync(path.join(__dirname, '..', 'play.pokemonshowdown.com', 'sprites', 'trainers', `${avatar}.png`)));
			assert(avatarPicker.includes(`['${avatar}',`), `${avatar} should be present in the deployed avatar picker`);
		}
	});

	it('keeps opponent-facing Rotom sprites readable in battle', () => {
		const sprite = Dex.getSpriteData('Rotom-Wash', true, {gen: 9});
		assert.equal(sprite.w, 96);
		assert.equal(sprite.h, 77);
		assert(sprite.url.endsWith('/sprites/ani/rotom-wash.gif'));
	});

	it('uses static custom Magnezone shinies without disabling normal animation', () => {
		const animationData = require('../play.pokemonshowdown.com/data/pokedex-mini.js').BattlePokemonSprites.magnezone;
		global.BattlePokemonSprites.magnezone = animationData;
		try {
			assert(Dex.getSpriteData('Magnezone', true, {gen: 9}).url.endsWith('/sprites/ani/magnezone.gif'));
			assert(Dex.getSpriteData('Magnezone', false, {gen: 9}).url.endsWith('/sprites/ani-back/magnezone.gif'));
			assert(Dex.getSpriteData('Magnezone', true, {gen: 9, shiny: true}).url.endsWith('/sprites/gen5-shiny/magnezone.png'));
			assert(Dex.getSpriteData('Magnezone', false, {gen: 9, shiny: true}).url.endsWith('/sprites/gen5-back-shiny/magnezone.png'));
		} finally {
			delete global.BattlePokemonSprites.magnezone;
		}
	});

	it('uses the supplied Sylveon shinies without changing normal animation', () => {
		const animationData = require('../play.pokemonshowdown.com/data/pokedex-mini.js').BattlePokemonSprites.sylveon;
		global.BattlePokemonSprites.sylveon = animationData;
		try {
			assert(Dex.getSpriteData('Sylveon', true, {gen: 9}).url.endsWith('/sprites/ani/sylveon.gif'));
			assert(Dex.getSpriteData('Sylveon', false, {gen: 9}).url.endsWith('/sprites/ani-back/sylveon.gif'));
			assert(Dex.getSpriteData('Sylveon', true, {gen: 9, shiny: true}).url.endsWith('/sprites/gen5-shiny/sylveon.png'));
			assert(Dex.getSpriteData('Sylveon', false, {gen: 9, shiny: true}).url.endsWith('/sprites/gen5-back-shiny/sylveon.png'));
		} finally {
			delete global.BattlePokemonSprites.sylveon;
		}
	});

	it('uses all supplied Tinkaton normal and shiny battle sprites', () => {
		for (const front of [true, false]) {
			for (const shiny of [false, true]) {
				const sprite = Dex.getSpriteData('Tinkaton', front, {gen: 9, shiny, noScale: true});
				const directory = front ? (shiny ? 'gen5-shiny' : 'gen5') : (shiny ? 'gen5-back-shiny' : 'gen5-back');
				assert(sprite.url.endsWith(`/sprites/${directory}/tinkaton.png`));
				assert.equal(sprite.w, front ? 144 : 180);
				assert.equal(sprite.h, front ? 148 : 152);
			}
		}
	});

	it('uses all supplied Typhlosion form sprites', () => {
		const cases = [
			['Typhlosion', 118, 152, 110, 140],
			['Typhlosion-Hisui', 116, 154, 112, 150],
		];
		for (const [species, frontWidth, frontHeight, backWidth, backHeight] of cases) {
			for (const front of [true, false]) {
				for (const shiny of [false, true]) {
					const sprite = Dex.getSpriteData(species, front, {gen: 9, shiny, noScale: true});
					const directory = front ? (shiny ? 'gen5-shiny' : 'gen5') : (shiny ? 'gen5-back-shiny' : 'gen5-back');
					assert(sprite.url.endsWith(`/sprites/${directory}/${species.toLowerCase().replace('-', '-')}.png`));
					assert.equal(sprite.w, front ? frontWidth : backWidth);
					assert.equal(sprite.h, front ? frontHeight : backHeight);
				}
			}
		}
	});

	it('uses all supplied Tyrantrum normal and shiny sprites', () => {
		for (const front of [true, false]) {
			for (const shiny of [false, true]) {
				const sprite = Dex.getSpriteData('Tyrantrum', front, {gen: 9, shiny, noScale: true});
				const directory = front ? (shiny ? 'gen5-shiny' : 'gen5') : (shiny ? 'gen5-back-shiny' : 'gen5-back');
				assert(sprite.url.endsWith(`/sprites/${directory}/tyrantrum.png`));
				assert.equal(sprite.w, front ? 140 : 158);
				assert.equal(sprite.h, front ? 148 : 152);
			}
		}
	});

	it('keeps Zoroark form and gender sprites separate', () => {
		const cases = [
			['Zoroark', 'zoroark.png', 'zoroark-f.png', 136, 128, 148, 130],
			['Zoroark-Hisui', 'zoroark-hisui.png', 'zoroark-hisui-f.png', 140, 182, 140, 156],
		];
		for (const [species, maleFile, femaleFile, frontWidth, frontHeight, backWidth, backHeight] of cases) {
			for (const gender of [undefined, 'F']) {
				const filename = gender === 'F' ? femaleFile : maleFile;
				for (const front of [true, false]) {
					for (const shiny of [false, true]) {
						const sprite = Dex.getSpriteData(species, front, {gen: 9, gender, shiny, noScale: true});
						const directory = front ? (shiny ? 'gen5-shiny' : 'gen5') : (shiny ? 'gen5-back-shiny' : 'gen5-back');
						assert(sprite.url.endsWith(`/sprites/${directory}/${filename}`));
						assert.equal(sprite.w, front ? frontWidth : backWidth);
						assert.equal(sprite.h, front ? frontHeight : backHeight);
					}
				}
			}
		}
	});

	it('uses the supplied Medicham and Mega Medicham female sprites', () => {
		const expectedFiles = {
			'Medicham-F': 'medichamf.png',
			'Medicham-Mega': 'medichammega.png',
		};
		for (const [species, filename] of Object.entries(expectedFiles)) {
			for (const front of [true, false]) {
				for (const shiny of [false, true]) {
					const sprite = Dex.getSpriteData(species, front, {gen: 9, shiny});
					const directory = front ? (shiny ? 'gen5-shiny' : 'gen5') : (shiny ? 'gen5-back-shiny' : 'gen5-back');
					assert(sprite.url.endsWith(`/sprites/${directory}/${filename}`));
				}
			}
		}
	});

	it('keeps Scizor gender-specific sprites separate for normal and Mega forms', () => {
		const cases = [
			['Scizor', 'scizor.png', 'scizor-f.png'],
			['Scizor-Mega', 'scizormega.png', 'scizormega-f.png'],
		];
		for (const [species, maleFile, femaleFile] of cases) {
			for (const gender of [undefined, 'F']) {
				const filename = gender === 'F' ? femaleFile : maleFile;
				for (const front of [true, false]) {
					for (const shiny of [false, true]) {
						const sprite = Dex.getSpriteData(species, front, {gen: 9, gender, shiny});
						const directory = front ? (shiny ? 'gen5-shiny' : 'gen5') : (shiny ? 'gen5-back-shiny' : 'gen5-back');
						assert(sprite.url.endsWith(`/sprites/${directory}/${filename}`));
					}
				}
			}
		}
	});

	it('removes Aura Wheel Plus from Morpeko in the Team Builder', () => {
		Dex.species.get('Morpeko');
		assert(!('aurawheelplus' in global.BattleTeambuilderTable.learnsets.morpeko));
	});

	it('syncs Meowscarada abilities from the server data', () => {
		assert.deepEqual(Dex.species.get('Meowscarada').abilities, {
			0: 'Magician', 1: 'Protean', H: 'Illusion',
		});
	});

	it('adds Sludge Wave to Butterfree in the team builder', () => {
		assert(global.BattleTeambuilderTable.learnsets.butterfree.sludgewave);
	});

	it('syncs Golduck stats, abilities, and requested moves', () => {
		assert.deepEqual(Dex.species.get('Golduck').baseStats, {hp: 80, atk: 82, def: 78, spa: 115, spd: 80, spe: 90});
		assert.equal(Dex.species.get('Golduck').bst, 525);
		assert.deepEqual(Dex.species.get('Golduck').abilities, {0: 'Swift Swim', 1: 'Still Waters', H: 'Defragment'});
		const learnset = global.BattleTeambuilderTable.learnsets.golduck;
		for (const move of [
			'simplebeam', 'weatherball', 'futuresight', 'meditate', 'miracleeye', 'twinbeam', 'barrier', 'kinesis',
			'agility', 'aurasphere', 'aurorabeam', 'blizzard', 'calmmind', 'bulkup', 'skullbash', 'disable',
			'encore', 'eeriespell', 'flipturn', 'shockwave', 'chargebeam', 'zapcannon', 'psychicnoise',
			'topsyturvy', 'nastyplot', 'powergem',
		]) assert(learnset[move], `Golduck should learn ${move}`);
	});

	it('syncs the updated Zangoose and Seviper stat lines', () => {
		const zangoose = Dex.species.get('Zangoose');
		const seviper = Dex.species.get('Seviper');
		assert.deepEqual(zangoose.baseStats, {hp: 75, atk: 140, def: 110, spa: 60, spd: 70, spe: 95});
		assert.equal(zangoose.bst, 550);
		assert.deepEqual(seviper.baseStats, {hp: 75, atk: 120, def: 80, spa: 100, spd: 80, spe: 95});
		assert.equal(seviper.bst, 550);
	});

	it('syncs the updated Flapple and Cetitan abilities', () => {
		assert.deepEqual(Dex.species.get('Flapple').abilities, {0: 'Levitate', 1: 'Hustle', H: 'Corrosion'});
		assert.deepEqual(Dex.species.get('Cetitan').abilities, {0: 'Slush Rush', 1: 'Water Absorb', H: 'Glacial Mass'});
	});

	it('keeps recently supplied sprites inside the Team Builder frame', () => {
		for (const species of [
			'Blastoise', 'Blastoise-Mega', 'Feraligatr', 'Froslass', 'Gothitelle',
			'Hydreigon', 'Jolteon', 'Reuniclus', 'Sylveon', 'Clefable', 'Clefable-Mega',
			'Lopunny', 'Lopunny-Mega', 'Venusaur', 'Venusaur-Mega', 'Venusaur-Gmax',
		]) {
			for (const shiny of [false, true]) {
				const sprite = Dex.getTeambuilderSprite({species, shiny}, 5);
				assert(sprite.includes('/sprites/gen5'), `${species} should use the supplied Gen 5 sprite`);
				const match = sprite.match(/background-size:(\d+)px auto/);
				assert(match, `${species} should have bounded Team Builder sizing`);
				assert(Number(match[1]) <= 86, `${species} should fit the Team Builder frame`);
			}
		}
	});

	it('registers the supplied Clefable battle sprites', () => {
		for (const species of ['Clefable', 'Clefable-Mega']) {
			const filename = species === 'Clefable-Mega' ? 'clefable-mega.png' : 'clefable.png';
			for (const shiny of [false, true]) {
				for (const front of [false, true]) {
					const sprite = Dex.getSpriteData(species, front, {gen: 9, shiny});
					const dir = `gen5${front ? '' : '-back'}${shiny ? '-shiny' : ''}`;
					assert(sprite.url.includes(`/sprites/${dir}/${filename}`), `${species} should use its supplied sprite`);
					assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', dir, filename)));
				}
			}
		}
	});

	it('registers the supplied Lopunny and Mega Lopunny battle sprites', () => {
		const expected = {
			Lopunny: {filename: 'lopunny.png', front: {w: 106, h: 120}, back: {w: 108, h: 124}},
			'Lopunny-Mega': {filename: 'lopunny-mega.png', front: {w: 112, h: 126}, back: {w: 112, h: 128}},
		};
		for (const [species, data] of Object.entries(expected)) {
			for (const shiny of [false, true]) {
				for (const front of [false, true]) {
					const sprite = Dex.getSpriteData(species, front, {gen: 9, shiny, noScale: true});
					const directory = `gen5${front ? '' : '-back'}${shiny ? '-shiny' : ''}`;
					const dimensions = front ? data.front : data.back;
					assert(sprite.url.endsWith(`/sprites/${directory}/${data.filename}`), `${species} should use its supplied sprite`);
					assert.equal(sprite.w, dimensions.w);
					assert.equal(sprite.h, dimensions.h);
					assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', directory, data.filename)));
				}
			}
		}
	});

	it('registers the supplied Venusaur, Mega Venusaur, and G-Max Venusaur sprites', () => {
		const expected = {
			Venusaur: {filename: 'venusaur.png', front: {w: 152, h: 136}, back: {w: 162, h: 126}},
			'Venusaur-Mega': {filename: 'venusaur-mega.png', front: {w: 188, h: 148}, back: {w: 186, h: 144}},
			'Venusaur-Gmax': {filename: 'venusaur-gmax.png', front: {w: 192, h: 178}, back: {w: 188, h: 170}},
		};
		for (const [species, data] of Object.entries(expected)) {
			for (const gender of [undefined, 'F']) {
				for (const shiny of [false, true]) {
					for (const front of [false, true]) {
						const sprite = Dex.getSpriteData(species, front, {gen: 9, gender, shiny, noScale: true});
						const directory = `gen5${front ? '' : '-back'}${shiny ? '-shiny' : ''}`;
						const filename = gender === 'F' ? data.filename.replace('.png', '-f.png') : data.filename;
						const dimensions = front ? data.front : data.back;
						assert(sprite.url.endsWith(`/sprites/${directory}/${filename}`), `${species} ${gender || 'M'} should use its supplied sprite`);
						assert.equal(sprite.w, dimensions.w);
						assert.equal(sprite.h, dimensions.h);
						assert(fs.existsSync(path.join(__dirname, '../play.pokemonshowdown.com/sprites', directory, filename)));
					}
				}
			}
		}
	});

	it('shows the added composite ability effects', () => {
		assert.match(Dex.abilities.get('Pollen Bloom').desc, /Unaware/);
		assert.match(Dex.abilities.get('Territorial').desc, /Intimidate/);
		assert.match(Dex.abilities.get('Lunar Dread').desc, /Unaware/);
		assert.match(Dex.abilities.get('Atrocity').desc, /Mold Breaker/);
		assert.match(Dex.abilities.get('Ancient Bloom').desc, /Pollen Bloom/);
		assert.match(Dex.abilities.get('Fortress Shell').desc, /Water Barrage/);
		assert.match(Dex.abilities.get('Fortress Shell').desc, /Hidden effect: Friend Guard/);
		assert.doesNotMatch(Dex.abilities.get('Fortress Shell').shortDesc, /Friend Guard|Dual Wield/);
		assert.match(Dex.abilities.get('Burning Crown').desc, /Wildfire Core/);
		assert.match(Dex.abilities.get('Burning Crown').desc, /Hidden effect: Filter/);
		assert.doesNotMatch(Dex.abilities.get('Burning Crown').shortDesc, /Filter/);
		assert(Dex.getAbilityEffects('fortressshell').has('waterbarrage'));
		assert(Dex.getAbilityEffects('lunardread').has('unaware'));
		assert(Dex.getAbilityEffects('territorial').has('intimidate'));
		assert.match(Dex.abilities.get('Still Waters').desc, /Cloud Nine/);
		assert(Dex.getAbilityEffects('stillwaters').has('cloudnine'));
		assert(Dex.getAbilityEffects('stillwaters').has('magicguard'));
		assert(Dex.getAbilityEffects('stillwaters').has('unaware'));
		assert(!Dex.getAbilityEffects('fortressshell').has('friendguard'));
		assert(Dex.getAbilityEffects('burningcrown').has('wildfirecore'));
		assert(!Dex.getAbilityEffects('burningcrown').has('filter'));
	});

	it('keeps abilities on custom required-item Mega profiles', () => {
		const expected = {
			'Haxorus-Mega': 'Raging Overlord',
			'Emboar-Mega-Reborn': 'Burning Ego',
			'Roserade-Mega': 'Blind Devotion',
			'Cinderace-Mega': 'Perfect Striker',
			'Clawitzer-Mega': 'Heavy Artillery',
			'Flygon-Mega-Z': 'Tremor',
			'Gallade-Mega-Azzy': 'Sacred Edge',
			'Gardevoir-Void-Mega': 'Execution',
			'Gardevoir-Mega-Z': 'Argent Devotion',
			'Lucario-Mega-Z': 'Aura Master',
			'Scolipede-Mega-Azzy': 'Venom Bastion',
			'Chimecho-Mega-Y': 'Haunted Chime',
			'Meganium-Mega-Y': 'Blooming Sun',
			'Charizard-Mega-X-Alt': 'Atrocity',
			'Alakazam-Mega-Alt': 'Perfect Foresight',
			'Ledian-Mega': 'Star Boxer',
			'Ariados-Mega': 'Silken Decoy',
			'Banette-Mega-Z': 'Cursed Armament',
			'Arbok-Mega-X': 'Neurotoxin',
			'Arbok-Mega-Y': 'Pattern Shift',
		};
		for (const [speciesName, ability] of Object.entries(expected)) {
			assert.equal(Dex.species.get(speciesName).abilities[0], ability, `${speciesName} ability`);
		}
	});

	it('exposes the updated Mega Banette Z stats', () => {
		assert.deepEqual(Dex.species.get('Banette-Mega-Z').baseStats, {
			hp: 84, atk: 105, def: 110, spa: 90, spd: 100, spe: 151,
		});
	});

	it('keeps Banette coverage legal in the team builder', () => {
		Dex.species.get('Banette');
		const learnset = global.BattleTeambuilderTable.learnsets.banette;
		assert(learnset, 'Banette should have a Team Builder learnset');
		for (const move of ['flashcannon', 'magnetbomb', 'mirrorshot', 'bittermalice', 'ancientpower', 'eeriespell']) {
			assert(move in learnset, `Banette should learn ${move}`);
		}
	});
});

describe('Text parser', () => {
	it.skip('should process messages correctly', () => {
		let parser = new BattleTextParser();

		assert.equal(parser.extractMessage(`|-activate|p2a: Cool.|move: Skill Swap|Speed Boost|Cute Charm|[of] p1a: Speedy`), `[The opposing Cool.'s Speed Boost]
[Speedy's Cute Charm]
  The opposing Cool. swapped Abilities with its target!
`);
		assert.equal(parser.extractMessage(`|-activate|p2a: Cool.|move: Skill Swap|p1a: Speedy|[ability]Speed Boost|[ability2]Cute Charm`), `[The opposing Cool.'s Speed Boost]
[Speedy's Cute Charm]
  The opposing Cool. swapped Abilities with its target!
`);
		assert.equal(parser.extractMessage(`|move|p2a: Palkia|Swagger|p1a: Shroomish
|-boost|p1a: Shroomish|atk|2
|-start|p1a: Shroomish|confusion
|-activate|p1a: Shroomish|confusion
|move|p1a: Shroomish|Power-Up Punch|p2a: Palkia
`), `
The opposing Palkia used **Swagger**!
  Shroomish's Attack rose sharply!
  Shroomish became confused!

  Shroomish is confused!
Shroomish used **Power-Up Punch**!
`);
	});
});
