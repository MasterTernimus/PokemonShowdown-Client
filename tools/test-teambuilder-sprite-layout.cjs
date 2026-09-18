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
require(root + 'js/battle-dex-data.js');
require(root + 'js/battle-dex.js');

const expected = {
	'Clefable-Mega': {x: 13, y: 18, size: '70px auto'},
	Gengar: {x: 19, y: 20, size: '58px auto'},
	'Arbok-Mega-Y': {x: 13, y: 12, size: '70px auto'},
	'Lapras-Gmax': {x: 14, y: 14, size: '68px auto'},
	'Lapras-Aevian-Gmax': {x: 14, y: 13, size: '68px auto'},
	'Toxtricity-Aevian-Gmax': {x: 14, y: 13, size: '68px auto'},
	'Glalie-Aevian': {x: 15, y: 14, size: '66px auto'},
	'Glalie-Aevian-Mega': {x: 11, y: 10, size: '74px auto'},
};

for (const [species, layout] of Object.entries(expected)) {
	const sprite = Dex.getTeambuilderSpriteData({species}, 9);
	assert.equal(sprite.x, layout.x, `${species} x position`);
	assert.equal(sprite.y, layout.y, `${species} y position`);
	assert.equal(sprite.backgroundSize, layout.size, `${species} size`);
}

const shinyAmpharos = Dex.getTeambuilderSpriteData({species: 'Ampharos', shiny: true}, 9);
assert.equal(shinyAmpharos.spriteDir, 'sprites/gen5');
assert.equal(shinyAmpharos.shiny, true);
assert(fs.statSync(root + 'sprites/gen5-shiny/ampharos.png').size > 0);
assert(fs.statSync(root + 'sprites/gen5-back-shiny/ampharos.png').size > 0);
const shinyAmpharosCSS = Dex.getTeambuilderSprite({species: 'Ampharos', shiny: true}, 9);
assert(shinyAmpharosCSS.includes('?v=bw-shiny-restored-1'), shinyAmpharosCSS);
for (const species of ['Abra', 'Lugia', 'Ponyta-Galar', 'Wobbuffet']) {
	const data = Dex.getTeambuilderSpriteData({species, shiny: true}, 9);
	assert.equal(data.spriteDir, 'sprites/gen5', `${species} should use restored BW shiny art`);
	assert.equal(data.shiny, true, `${species} should remain shiny`);
	const css = Dex.getTeambuilderSprite({species, shiny: true}, 9);
	assert(css.includes('?v=bw-shiny-restored-1'), css);
}

console.log('PASS: custom Team Builder layouts and Ampharos BW shiny routing are valid.');
