const assert = require('assert/strict');
const fs = require('fs');
const vm = require('vm');
const root = require('path').resolve(__dirname, '../play.pokemonshowdown.com') + '/';
global.window = global;
global.Config = {whitelist: [], routes: {root: 'pokemonshowdown.com'}};
global.BattlePokedex = require(root+'data/pokedex').BattlePokedex;
global.BattleMovedex = require(root+'data/moves').BattleMovedex;
global.BattleAbilities = require(root+'data/abilities').BattleAbilities;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
for (const file of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle']) require(root+'js/'+file);
vm.runInThisContext(fs.readFileSync(root+'js/battle-tooltips.js','utf8'));
const battle = new Battle({log: [
 '|init|battle', '|gen|9', '|tier|[Gen 9] Midnight Zone', '|gametype|singles',
 '|player|p1|One', '|player|p2|Two', '|start',
 '|switch|p1a: Mew|Mew|341/341', '|switch|p2a: Mew|Mew|341/341',
 '|-fieldstart|Midnight Zone Terrain', '|turn|1',
]});
battle.seekTurn(Infinity);
assert(battle.hasPseudoWeather('Midnight Zone Terrain'));
assert.deepEqual(battle.pseudoWeather.find(w => w[0] === 'Midnight Zone Terrain').slice(1), [0, 0]);
const pokemon = battle.p1.active[0];
const server = {speciesForme: 'Mew', ability: 'No Ability', baseAbility: 'No Ability', item: '', hp: 341, maxhp: 341, status: '', stats: {atk: 200, def: 200, spa: 200, spd: 200, spe: 200}};
const tooltips = new BattleTooltips(battle);
assert.equal(tooltips.calculateModifiedStats(pokemon, server).spe, 50);
server.ability = 'Swift Swim';
assert.equal(tooltips.calculateModifiedStats(pokemon, server).spe, 400);
server.ability = 'No Ability';
let value = new ModifiableValue(battle, pokemon, server);
assert.equal(tooltips.getMoveType(Dex.moves.get('earthpower'), value)[0], 'Water');
value = new ModifiableValue(battle, pokemon, server);
assert.equal(tooltips.getMoveBasePower(Dex.moves.get('earthpower'), 'Water', value, battle.p2.active[0]).value, 162);
server.ability = 'Illuminate';
value = new ModifiableValue(battle, pokemon, server);
assert.equal(tooltips.getMoveAccuracy(Dex.moves.get('fissure'), value).value, 0);
assert(fs.readFileSync(root+'style/battle.css','utf8').includes('.midnightzoneterrainweather'));
assert.equal(require('crypto').createHash('sha256').update(fs.readFileSync(root+'fx/weather-midnightzoneterrain.png')).digest('hex'), '281e128a075992e14bbd6ade92f1463ddf54a441b05ac3764d6bb022c8588010');
console.log('Midnight Zone client: field protocol, permanent duration, speed, move type/power, Illuminate, and exact background verified.');
