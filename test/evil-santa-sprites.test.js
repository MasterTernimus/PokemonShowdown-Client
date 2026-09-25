'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
global.window = global;
global.Config = {whitelist: [], routes: {root: 'pokemonshowdown.com'}};
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
for (const name of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle']) require('../play.pokemonshowdown.com/js/' + name);

describe('Evil Santa appearance', () => {
 it('uses the supplied front/back images in modern and BW graphics, including shiny and preview', () => {
  assert.equal(Dex.getSpriteData('Delibird-EvilSanta',true,{gen:9,dynamax:true}).w,192);
  assert.equal(Dex.getSpriteData('Delibird-EvilSanta',true,{gen:9,dynamax:true,noScale:true}).w,96);
  const prefs = Dex.prefs;
  try {
   for (const bw of [false, true]) for (const shiny of [false, true]) for (const front of [false, true]) {
    Dex.prefs = key => key === 'bwgfx' ? bw : prefs.call(Dex,key);
    const sprite = Dex.getSpriteData('Delibird-EvilSanta',front,{gen:9,shiny,teamPreview:true});
    const file = 'sprites/gen5' + (front ? '' : '-back') + '/delibird-evilsanta.png';
    assert(sprite.url.endsWith(file),sprite.url);
    assert(fs.existsSync(path.join(__dirname,'../play.pokemonshowdown.com',file)));
    assert.equal(sprite.w,96); assert.equal(sprite.h,96);
    assert(!Dex.getSpriteData('Delibird',front,{gen:9,shiny}).url.includes('evilsanta'));
   }
  } finally { Dex.prefs = prefs; }
 });
 it('uses the front artwork for Team Builder and menu icons without adding a battle species', () => {
  const set = {species:'Delibird',ability:'Evil Santa',shiny:true};
  for(const gen of [0,5,9]) assert.equal(Dex.getTeambuilderSpriteData(set,gen).spriteid,'delibird-evilsanta');
  assert(Dex.getPokemonIcon(set).includes('delibird-evilsanta.png'));
  assert(Dex.getPokemonIcon({...set,fainted:true}).includes('opacity:.3'));
  assert(!Dex.getPokemonIcon({...set,ability:'Insomnia'}).includes('evilsanta'));
  assert.notEqual(Dex.getTeambuilderSpriteData({...set,ability:'Insomnia'}).spriteid,'delibird-evilsanta');
  assert.equal(Dex.species.get('Delibird-EvilSanta').id,'delibird');
 });
 it('renders battle protocol appearance changes without resetting types, boosts, ability, or Transform', () => {
  const battle = new Battle({debug:true});
  battle.runMajor(['poke','p1','Delibird-EvilSanta, M'],{});
  assert(Dex.getPokemonIcon(battle.p1.pokemon[0]).includes('evilsanta'));
  battle.runMajor(['switch','p1a: Delibird','Delibird-EvilSanta, M','100/100'],{});
  battle.runMajor(['switch','p2a: Ditto','Ditto','100/100'],{});
  const p = battle.p1.active[0], ditto = battle.p2.active[0];
  p.ability = 'Insomnia'; p.boosts.def = 2; p.addVolatile('typechange','Water');
  battle.runMinor(['detailschange','p1a: Delibird','Delibird, M'],{cosmetic:'.',silent:'.'});
  assert.equal(p.ability,'Insomnia'); assert.equal(p.boosts.def,2);
  assert.equal(p.volatiles.typechange[1],'Water');
  assert(!Dex.getSpriteData(p,true).url.includes('evilsanta'));
  battle.runMinor(['detailschange','p1a: Delibird','Delibird-EvilSanta, M'],{cosmetic:'.',silent:'.'});
  assert(Dex.getSpriteData(p,true).url.includes('evilsanta'));
  battle.runMinor(['-transform','p2a: Ditto','p1a: Delibird'],{});
  assert(Dex.getSpriteData(ditto,true).url.includes('evilsanta'));
  p.addVolatile('formechange','Mew');
  assert(!Dex.getSpriteData(p,true).url.includes('evilsanta'));
  battle.destroy();
 });
});
