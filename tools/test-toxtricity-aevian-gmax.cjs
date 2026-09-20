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
global.BattleMovedex = require(root + 'data/moves.js').BattleMovedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
global.BattleTeambuilderTable = require(root + 'data/teambuilder-tables.js').BattleTeambuilderTable;
require(root + 'js/battle-dex-data.js');
require(root + 'js/battle-dex.js');

assert.deepEqual(Dex.species.get('Toxtricity-Aevian').baseStats,
	{hp: 75, atk: 75, def: 70, spa: 115, spd: 70, spe: 97});
const species = Dex.species.get('Toxtricity-Aevian-Gmax');
assert.deepEqual(species.types, ['Fire', 'Poison']);
assert.deepEqual(species.baseStats, {hp: 128, atk: 75, def: 70, spa: 115, spd: 70, spe: 97});
assert.equal(species.abilities[0], 'Riot Amp');
assert.equal(Dex.abilities.get('Riot Amp').shortDesc, 'Galvanize + Resonance Force + Volt Absorb.');
assert.equal(Dex.moves.get('G-Max Flare Shock').type, 'Fire');

for (const shiny of [false, true]) {
	for (const facing of [0, 1]) {
		const data = Dex.getSpriteData(species.name, facing, {gen: 9, shiny});
		const directory = facing ? `gen5${shiny ? '-shiny' : ''}` : `gen5-back${shiny ? '-shiny' : ''}`;
		assert(data.url.includes(`/sprites/${directory}/toxtricity-aevian-gmax.png?v=toxtricity-aevian-icons-20260918`), data.url);
		assert(fs.statSync(root + `sprites/${directory}/toxtricity-aevian-gmax.png`).size > 0);
	}
	const icon = Dex.getPokemonIcon({species: species.name, shiny});
	const iconFile = `toxtricity-aevian-gmax${shiny ? '-shiny' : ''}.png`;
	assert(icon.includes(iconFile), icon);
	assert(fs.statSync(root + `sprites/pokemonicons/${iconFile}`).size > 0);
}

console.log('PASS: Toxtricity-Aevian-Gmax profile, move, battle sprites, and party icons are wired.');
