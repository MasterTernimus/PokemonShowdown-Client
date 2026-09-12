'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com') + '/';
global.window = global;
global.Pokemon = class {};
global.Config = {};
global.BattlePokedex = require(root + 'data/pokedex.js').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
global.BattleTeambuilderTable = require(root + 'data/teambuilder-tables.js').BattleTeambuilderTable;
for (let gen = 1; gen <= 9; gen++) {
	const table = BattleTeambuilderTable['gen' + gen] = BattleTeambuilderTable.gen9natdex;
	for (const key of ['overrideAbilityData', 'overrideItemDesc', 'overrideMoveData', 'overrideSpeciesData', 'overrideTypeChart', 'removeType']) {
		if (!table[key]) table[key] = {};
	}
}
require(root + 'js/battle-dex-data.js');
require(root + 'js/battle-dex.js');

const base = Dex.species.get('Ampharos-Aevian');
const mega = Dex.species.get('Ampharos-Aevian-Mega');
assert.deepEqual(base.types, ['Ice', 'Electric']);
assert.deepEqual(base.baseStats, {hp: 110, atk: 75, def: 90, spa: 115, spd: 85, spe: 55});
assert.deepEqual(base.abilities, {0: 'Ice Scales', 1: 'Fluffy', H: 'Filter'});
assert.deepEqual(mega.baseStats, {hp: 110, atk: 95, def: 110, spa: 165, spd: 105, spe: 45});
assert(mega.requiredItems.includes('Ampharosite'));
assert.equal(mega.abilities[0], 'Wooly Conductor');

for (const species of [base, mega]) for (const gender of ['M', 'F']) for (const shiny of [false, true]) {
	const id = species.spriteid + (gender === 'F' ? '-f' : '');
	const shinyDir = shiny ? '-shiny' : '';
	for (const gen of [5, 9]) for (const facing of [0, 1]) {
		const data = Dex.getSpriteData(species.name, facing, {gen, gender, shiny});
		const directory = facing ? `gen5${shinyDir}` : `gen5-back${shinyDir}`;
		assert(data.url.includes(`/sprites/${directory}/${id}.png?v=ampharos-aevian-1`), data.url);
		assert(fs.existsSync(root + `sprites/${directory}/${id}.png`));
	}
	for (const gen of [5, 9]) {
		const art = Dex.getTeambuilderSpriteData({species: species.name, gender, shiny}, gen);
		assert.equal(art.spriteid, id);
		assert.equal(art.spriteDir, 'sprites/gen5');
		assert.equal(!!art.shiny, shiny);
	}
	const icon = Dex.getPokemonIcon({species: species.name, gender, shiny});
	const iconFile = `${id}${shiny ? '-shiny' : ''}.png`;
	assert(icon.includes(iconFile), icon);
	assert(fs.existsSync(root + `sprites/pokemonicons/${iconFile}`));
}

const learnset = BattleTeambuilderTable.learnsets.ampharosaevian;
for (const move of ['tackle', 'snowscape', 'thundershock', 'iceball', 'blizzard', 'haze', 'auroraveil', 'iciclespear']) {
	assert(learnset[move], `missing ${move}`);
}
console.log('PASS: Aevian Ampharos profile, Mega, moves, and 32 battle selections, 16 team builder selections, and 8 menu icons.');

