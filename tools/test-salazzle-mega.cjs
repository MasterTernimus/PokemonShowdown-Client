const fs = require('fs');
const assert = require('assert').strict;
const path = require('path');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com') + '/';

global.window = global;
global.Pokemon = class {};
global.Config = {};
global.BattlePokedex = require(root + 'data/pokedex.js').BattlePokedex;
global.BattleItems = require(root + 'data/items.js').BattleItems;
global.BattleAbilities = require(root + 'data/abilities.js').BattleAbilities;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
require(root + 'js/battle-dex-data.js');
require(root + 'js/battle-dex.js');

const mega = Dex.species.get('Salazzle-Mega');
assert.deepEqual(mega.types, ['Poison', 'Fire']);
assert.deepEqual(mega.baseStats, {hp: 68, atk: 64, def: 70, spa: 148, spd: 150, spe: 80});
assert.equal(mega.abilities[0], 'Corrosive Burn');
assert.deepEqual(mega.requiredItems, ['Salazzite']);
assert.equal(Dex.items.get('Salazzite').megaStone.Salazzle, 'Salazzle-Mega');
assert.equal(Dex.abilities.get('Corrosive Burn').shortDesc, 'Merciless + Regenerator + Corrosion.');

for (const shiny of [false, true]) {
	for (const facing of [true, false]) {
		const sprite = Dex.getSpriteData('Salazzle-Mega', facing, {gen: 5, shiny});
		const folder = `gen5-${facing ? '' : 'back-'}${shiny ? 'shiny' : ''}`.replace(/-$/, '');
		assert(sprite.url.includes(`/sprites/${folder}/salazzle-mega.png`), sprite.url);
		const file = root + sprite.url.slice(sprite.url.indexOf('sprites/')).split('?')[0];
		assert(fs.existsSync(file), file);
	}
}
assert(fs.existsSync(root + 'sprites/itemicons/salazzite.png'));
console.log('PASS: Mega Salazzle data, Salazzite, ability text, and all four sprites.');
