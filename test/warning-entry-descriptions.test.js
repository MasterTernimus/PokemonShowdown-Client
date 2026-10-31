const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const client = path.resolve(__dirname, '../play.pokemonshowdown.com');

function loadDex(bundled) {
	const context = vm.createContext({Config: {}, Pokemon: class {}, BattlePokemonSprites: {}, BattlePokemonSpritesBW: {}});
	context.window = context;
	for (const [file, name] of [
		['pokedex', 'BattlePokedex'], ['abilities', 'BattleAbilities'], ['moves', 'BattleMovedex'], ['items', 'BattleItems'],
	]) {
		const dataContext = {exports: {}};
		vm.runInNewContext(fs.readFileSync(path.join(client, 'data', file + '.js'), 'utf8'), dataContext, {filename: file + '.js'});
		context[name] = JSON.parse(JSON.stringify(dataContext.exports[name]));
	}
	for (const script of bundled ? ['battledata'] : ['battle-dex-data', 'battle-dex']) {
		vm.runInContext(fs.readFileSync(path.join(client, 'js', `${script}.js`), 'utf8'), context);
	}
	return context.Dex;
}


describe('Opponent entry warning descriptions', () => {
 for (const bundled of [false, true]) {
  it((bundled ? 'bundle' : 'individual scripts') + ' describes per-opponent checks and preserved custom effects', () => {
   const dex = loadDex(bundled);
   for (const id of ['anticipation', 'forewarn', 'coldlogic', 'shadowcurrent', 'silentreprisal', 'greatmarsh', 'omensight', 'stillmind', 'astralconcord']) {
    const desc = dex.abilities.get(id).desc;
    assert(/foes|opposing|opponent/.test(desc), id);
    assert(/opposing switch-ins|every switch-in/.test(desc), id);
   }
   assert(dex.abilities.get('forewarn').desc.includes('20% less move damage'));
   assert(dex.abilities.get('forewarn').desc.includes('25% less'));
   assert(dex.abilities.get('anticipation').desc.includes('+2 Sp. Atk'));
   assert(dex.abilities.get('anticipation').desc.includes('latest warned move'));
   assert.equal(dex.abilities.get('astralconcord').gen, 9, 'description overrides retain synchronized generation metadata');
  });
 }
});
