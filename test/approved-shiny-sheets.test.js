const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert').strict;require('./battle.test');
const root=path.resolve(__dirname,'..');
const normalSpriteHashes=require('./fixtures/normal-sprite-hashes.json');
describe('Approved shiny sprite sheets',()=>{
 for(const [species,id]of [['Delphox','delphox'],['Delphox-Mega','delphox-mega'],['Gyarados','gyarados'],['Gyarados-Mega','gyarados-mega']])for(const gender of ['M','F'])it(species+' '+gender+' selects exact front/back PNGs over old animations',()=>{const name=id+(species==='Gyarados'&&gender==='F'?'-f':'');for(const front of [true,false]){const s=Dex.getSpriteData(species,front,{gen:9,shiny:true,gender});assert(s.url.includes('/gen5'+(front?'':'-back')+'-shiny/'+name+'.png'));assert.equal(s.w,96);assert.equal(s.h,96);}const s=Dex.getTeambuilderSpriteData({species,gender,shiny:true},9);assert.equal(s.spriteid,name);assert.equal(s.spriteDir,'sprites/gen5');assert(s.shiny);});
 it('preserves every existing normal sprite byte-for-byte',()=>{for(const[p,h]of Object.entries(normalSpriteHashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex').toUpperCase(),h,p);});
 it('keeps normal battle routing independent from the shiny sheet override',()=>{for(const species of ['Delphox','Delphox-Mega','Gyarados','Gyarados-Mega'])assert(!Dex.getSpriteData(species,true,{gen:9,shiny:false}).url.includes('-shiny/'));});
});
