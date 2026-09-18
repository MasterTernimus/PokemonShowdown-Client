const assert = require('assert').strict;
const path = require('path');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com') + '/';

global.window = global;
global.Pokemon = class {};
global.Config = {};
global.BattlePokedex = require(root + 'data/pokedex.js').BattlePokedex;
global.BattleItems = require(root + 'data/items.js').BattleItems;
global.BattleAbilities = require(root + 'data/abilities.js').BattleAbilities;
global.BattleTeambuilderTable = require(root + 'data/teambuilder-tables.js').BattleTeambuilderTable;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
require(root + 'js/battle-dex-data.js');
require(root + 'js/battle-dex.js');

Dex.species.get('Minior');
const moves = ['gravity', 'accelerock', 'lunardance', 'headsmash', 'meteorbeam', 'bulkup', 'calmmind', 'hurricane', 'tailwind'];
for (const move of moves) assert(BattleTeambuilderTable.learnsets.minior[move], move);
const shieldsDown = Dex.abilities.get('Shields Down');
assert(shieldsDown.shortDesc.includes('Shell Armor + Self Repair + Crumbling Shell'));
const effects = Dex.getAbilityEffects('shieldsdown');
for (const component of ['shellarmor', 'selfrepair', 'crumblingshell']) {
	assert(effects.has(component), component);
}
console.log('PASS: Minior moves and Shields Down components are visible in the client.');
