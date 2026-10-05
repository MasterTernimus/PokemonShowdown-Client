const fs = require('fs');
const path = require('path');
const vm = require('vm');
module.exports = function loadDex() {
 const root = path.resolve(__dirname, '../../play.pokemonshowdown.com');
 const context = vm.createContext({Config: {}, Pokemon: class {}});
 context.window = context;
 for (const file of ['pokedex', 'abilities', 'moves', 'items', 'pokedex-mini', 'pokedex-mini-bw']) {
  const data = {exports: {}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'data', file + '.js'), 'utf8'), data);
  Object.assign(context, data.exports);
 }
 for (const file of ['battle-dex-data', 'battle-dex']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file + '.js'), 'utf8'), context);
 }
 return context;
};
