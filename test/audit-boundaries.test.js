const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');

describe('Approved audit boundaries', () => {
 it('does not carry Triple Arrows through Baton Pass or replay seeking', () => {
  const b = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
   '|player|p1|A', '|player|p2|B', '|start', '|switch|p1a: Eevee|Eevee, L100|100/100',
   '|-start|p1a: Eevee|move: Triple Arrows', '|-start|p1a: Eevee|Substitute',
   '|switch|p1a: Mew|Mew, L100|100/100|[from] move: Baton Pass']});
  for (let i = 0; i < 2; i++) {
   b.seekTurn(Infinity);
   assert(!b.p1.active[0].volatiles.triplearrows);
   assert(b.p1.active[0].volatiles.substitute, 'ordinary Baton Pass remains intact');
   b.seekTurn(0);
  }
  b.destroy();
 });
 for (const [species, id] of [['Furfrou-Heart', 'furfrou-heart'], ['Sylveon','sylveon'],
  ['Froslass','froslass'], ['Mightyena','mightyena'], ['Tyrantrum','tyrantrum'],
  ['Zoroark','zoroark'], ['Scizor','scizor'], ['Clefable','clefable'], ['Lopunny','lopunny'],
  ['Eelektross','eelektross'], ["Oricorio-Pa'u",'oricorio-pau'], ['Alakazam','alakazam'],
  ['Volcarona','volcarona'], ['Magearna','magearna'], ['Ursaluna','ursaluna'], ['Chandelure','chandelure']]) {
  for (const front of [true, false]) it(species + ' uses the installed BW animation for ' + (front ? 'front' : 'back'), () => {
   const root = path.join(__dirname, '../play.pokemonshowdown.com/sprites');
   const animation = 'gen5ani' + (front ? '' : '-back') + '/' + id + '.gif';
   const data = Dex.getSpriteData(species, front, {gen: 9});
   const local = data.url.split('/sprites/')[1].split('?')[0];
   assert(fs.existsSync(path.join(root, local)), data.url);
   if (fs.existsSync(path.join(root, animation))) assert.equal(local, animation);
   const shiny = Dex.getSpriteData(species, front, {gen: 9, shiny: true});
   assert(shiny.url.includes('-shiny/'), shiny.url);
   assert(fs.existsSync(path.join(root, shiny.url.split('/sprites/')[1].split('?')[0])));
   const prefs = Dex.prefs;
   for (const preference of ['nogif', 'noanim']) {
    Dex.prefs = key => key === preference ? true : prefs.call(Dex, key);
    try { assert(/\.png(?:\?|$)/.test(Dex.getSpriteData(species, front, {gen: 9}).url)); }
    finally { Dex.prefs = prefs; }
   }
  });
 }
});
