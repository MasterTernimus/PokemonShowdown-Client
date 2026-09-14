'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com') + '/';
global.window = global;
global.Pokemon = class {};
global.Config = {};
global.BattlePokedex = require(root + 'data/pokedex.js').BattlePokedex;
global.BattleAbilities = require(root + 'data/abilities.js').BattleAbilities;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
global.BattleTeambuilderTable = require(root + 'data/teambuilder-tables.js').BattleTeambuilderTable;
require(root + 'js/battle-dex-data.js');
require(root + 'js/battle-dex.js');

const base = Dex.species.get('Glalie-Aevian');
assert.deepEqual(base.types, ['Grass', 'Rock']);
assert.deepEqual(base.baseStats, {hp: 110, atk: 110, def: 100, spa: 50, spd: 80, spe: 50});
assert.deepEqual(base.abilities, {0: 'Grassy Surge', 1: 'Brute Force', H: 'Stamina'});
const mega = Dex.species.get('Glalie-Aevian-Mega');
assert.deepEqual(mega.baseStats, {hp: 110, atk: 155, def: 115, spa: 50, spd: 90, spe: 85});
assert.equal(mega.abilities[0], 'Moss Armor');
assert.equal(Dex.abilities.get('Moss Armor').shortDesc, 'Brute Force + Stamina + Natural Recovery.');

for (const species of ['Glalie', 'Glalie-Aevian', 'Glalie-Mega', 'Glalie-Aevian-Mega']) {
	const id = species.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	for (const shiny of [false, true]) {
		for (const facing of [0, 1]) {
			const data = Dex.getSpriteData(species, facing, {gen: 9, shiny});
			const directory = facing ? `gen5${shiny ? '-shiny' : ''}` : `gen5-back${shiny ? '-shiny' : ''}`;
			assert(data.url.includes(`/sprites/${directory}/${id}.png?v=glalie-aevian-1`), data.url);
			assert(fs.statSync(root + `sprites/${directory}/${id}.png`).size > 0);
		}
		const iconFile = `${id}${shiny ? '-shiny' : ''}.png`;
		assert(Dex.getPokemonIcon({species, shiny}).includes(iconFile));
		assert(fs.statSync(root + `sprites/pokemonicons/${iconFile}`).size > 0);
	}
}

const learnset = BattleTeambuilderTable.learnsets.glalieaevian;
for (const move of ['absorb', 'woodhammer', 'grassyglide', 'leechseed', 'arenitewall', 'slashandburn', 'mudslap', 'accelerock']) {
	assert(learnset[move], `missing ${move}`);
}
assert(BattleTeambuilderTable.learnsets.ampharosaevian.paraboliccharge);
assert(BattleTeambuilderTable.learnsets.ampharos.dragondance);

console.log('PASS: Aevian Glalie profiles, Glalie sprite groups, icons, layouts, abilities, and moves are wired.');
