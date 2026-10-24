'use strict';
const assert=require('assert').strict;
const {Dex}=require('./helpers/isolated-dex.cjs')();
describe('Beatdown approved client parity',()=>{
 it('keeps three 30-power hits, separate accuracy and explicit 160 Z power',()=>{const m=Dex.moves.get('beatdown'),raw=require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex.beatdown,snapshot=require('../server-data-sync-manifest.json').snapshot.moves.beatdown;assert.equal(m.basePower,30);assert.equal(m.multihit,3);assert.equal(m.accuracy,95);assert.equal(m.zMove.basePower,160);assert.equal(raw.zMove.basePower,160);assert(snapshot.desc.includes('Z-Move power: 160'));assert.equal(snapshot.basePower,30);assert.equal(Dex.moves.get('triplekick').zMove.basePower,175);});
 it('explains the shared entry budget, later misses, cap and four-turn Taunt',()=>{const m=Dex.moves.get('beatdown');assert.match(m.shortDesc,/first accuracy miss per entry/);assert(!m.shortDesc.includes('first-hit miss'));for(const text of['even after earlier hits','spent even at the Attack cap','4 effect-counter turns','without refreshing existing Taunt','Blunder Policy','semi-invulnerable','160'])assert(m.desc.includes(text),text);});
});
