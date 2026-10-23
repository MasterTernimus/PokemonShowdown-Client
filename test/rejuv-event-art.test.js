'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert').strict;
require('./battle.test');
const root=path.resolve('play.pokemonshowdown.com'),receipt=require('../play.pokemonshowdown.com/sprites/rejuv-event-art.json');
describe('Verified supplied LAWDS event artwork',()=>{
 it('retains all 18 source-frame assets and their independent hashes',()=>{
  assert.equal(receipt.files.length,18);
  for(const row of receipt.files){const bytes=fs.readFileSync(path.join(root,row.file));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),row.pngSHA256,row.file);assert.equal(bytes.readUInt32BE(16),192);assert.equal(bytes.readUInt32BE(20),192);}
 });
 for(const base of ['politoed','poliwrath','galvantula'])for(const front of [true,false])for(const shiny of [false,true])it(base+' '+(front?'front':'back')+' '+(shiny?'shiny':'normal')+' routes its own verified frame',()=>{
  const sprite=Dex.getSpriteData(base+'rejuv',front,{gen:9,shiny});
  assert(sprite.url.includes(base+'-rejuv.png'),sprite.url);
  assert(sprite.url.includes('gen5'+(front?'':'-back')+(shiny?'-shiny':'')),sprite.url);
  assert(sprite.w > 0 && sprite.w <= 192);assert.equal(sprite.w,sprite.h);
  assert(!Dex.getSpriteData(base,front,{gen:9,shiny}).url.includes('-rejuv'));
 });
 for(const base of ['politoed','poliwrath','galvantula'])it(base+' teambuilder retains its event art',()=>{for(const shiny of [false,true])assert(Dex.getTeambuilderSprite({species:base+'rejuv',shiny},9).includes(base+'-rejuv.png'));});
});
