'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.resolve(__dirname, '../../play.pokemonshowdown.com/js/battle-animations.js');
const source = fs.readFileSync(file, 'utf8');
module.exports = vm.runInNewContext(source + '\nPokemonSprite.statusTable;', {window: {}, $: {easing: {}, fx: {}}});
