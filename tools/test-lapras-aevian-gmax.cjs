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

assert.deepEqual(Dex.species.get('Lapras-Aevian').otherFormes, ['Lapras-Aevian-Gmax']);
assert(!(Dex.species.get('Milotic-Aevian').otherFormes || []).includes('Lapras-Aevian-Gmax'));
const species = Dex.species.get('Lapras-Aevian-Gmax');
assert.deepEqual(species.types, ['Rock', 'Psychic']);
assert.deepEqual(species.baseStats, {hp: 195, atk: 100, def: 90, spa: 85, spd: 105, spe: 60});
assert.equal(species.abilities[0], 'Crystal Resonance');
assert.equal(Dex.abilities.get('Crystal Resonance').shortDesc, 'Amethyst Glow + Magic Bounce.');
assert.equal(Dex.moves.get('G-Max Echo Resonance').type, 'Psychic');

for (const shiny of [false, true]) {
	for (const facing of [0, 1]) {
		const data = Dex.getSpriteData(species.name, facing, {gen: 9, shiny});
		const directory = facing ? `gen5${shiny ? '-shiny' : ''}` : `gen5-back${shiny ? '-shiny' : ''}`;
		assert(data.url.includes(`/sprites/${directory}/lapras-aevian-gmax.png?v=lapras-aevian-gmax-1`), data.url);
		assert(fs.existsSync(root + `sprites/${directory}/lapras-aevian-gmax.png`));
	}
	const icon = Dex.getPokemonIcon({species: species.name, shiny});
	const iconFile = `lapras-aevian-gmax${shiny ? '-shiny' : ''}.png`;
	assert(icon.includes(iconFile), icon);
	assert(fs.existsSync(root + `sprites/pokemonicons/${iconFile}`));
}

console.log('PASS: Lapras-Aevian-Gmax profile, battle sprites, and party icons are wired.');
