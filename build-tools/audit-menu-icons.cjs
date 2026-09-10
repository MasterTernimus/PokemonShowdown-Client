const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const client = path.join(root, 'play.pokemonshowdown.com');
const source = fs.readFileSync(path.join(client, 'src/battle-dex.ts'), 'utf8');
const official = JSON.parse(source.match(/const OFFICIAL_MENU_ICON_INDEXES:.*? = (\{[^\n]+\});/)[1]);
global.window = global;
global.BattlePokedex = require(path.join(client, 'data/pokedex')).BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
require(path.join(client, 'js/battle-dex-data'));
require(path.join(client, 'js/battle-dex'));
Dex.species.get('Dragonite'); // Register the custom profiles before enumerating.
const rows = Object.keys(BattlePokedex).map(id => {
	const species = Dex.species.get(id);
	const css = Dex.getPokemonIcon({species: species.name});
	const kind = css.includes('/sprites/gen5') ? 'battle fallback' :
		css.includes('/sprites/pokemonicons/') ? 'dedicated custom icon' :
		css.includes('official-sheet') ? 'official menu icon' : 'legacy sheet';
	return {id, name: species.name, kind, officialAvailable: official[id] !== undefined, css};
});
if (process.argv.includes('--save-before')) {
	fs.writeFileSync(path.join(root, 'menu-icons-before.json'), JSON.stringify(rows, null, 2) + '\n');
}
const counts = {};
for (const row of rows) counts[row.kind] = (counts[row.kind] || 0) + 1;
console.log(JSON.stringify({total: rows.length, counts, fixable: rows.filter(row => row.kind === 'battle fallback' && row.officialAvailable).length}, null, 2));
module.exports = {rows, official};
