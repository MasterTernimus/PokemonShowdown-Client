const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

window = global;

global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex.js').BattlePokedex;
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

	it('removes Aura Wheel Plus from Morpeko in the Team Builder', () => {
		Dex.species.get('Morpeko');
		assert(!('aurawheelplus' in global.BattleTeambuilderTable.learnsets.morpeko));
	});

	it('syncs Meowscarada abilities from the server data', () => {
		assert.deepEqual(Dex.species.get('Meowscarada').abilities, {
			0: 'Magician', 1: 'Protean', H: 'Illusion',
		});
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
