'use strict';
const assert=require('assert').strict,fs=require('fs');
const source=fs.readFileSync('play.pokemonshowdown.com/js/client-battle.js','utf8');
const method=source.slice(source.indexOf('canPreviewDrakeFang: function (active, pokemon) {')+'canPreviewDrakeFang: '.length,source.indexOf('\n\t\tupdateMegaChoice:'));
const preview=new Function('toID','return '+method.trim().replace(/,$/,''))(x=>String(x||'').toLowerCase().replace(/[^a-z0-9]/g,''));
describe('Seviper Mega move preview eligibility',()=>{
 const active=()=>({canMegaEvo:true,moves:[{id:'poisonfang',move:'Poison Fang',pp:3,maxpp:15,disabled:true,target:'normal'}]});
 const pokemon=()=>({speciesForme:'Seviper',item:'sevipite'});
 it('accepts eligible boolean Mega requests without changing disabled moves or PP',()=>{const a=active(),p=pokemon(),before=JSON.stringify([a,p]);assert(preview(a,p));assert.equal(JSON.stringify([a,p]),before);});
 it('accepts explicit Mega target and details-only species data',()=>assert(preview({...active(),canMegaEvo:'Seviper-Mega'},{details:'Seviper, L100, M'})));
 for(const [name,a,p]of [
 ['unavailable Mega',{...active(),canMegaEvo:false},pokemon()],
 ['wrong stone',active(),{...pokemon(),item:'leftovers'}],
 ['wrong target',{...active(),canMegaEvo:'Seviper-Pulse'},pokemon()],
 ['other species',active(),{...pokemon(),speciesForme:'Mew'}],
 ['already Mega',active(),{...pokemon(),speciesForme:'Seviper-Mega'}],
 ['absent Poison Fang',{...active(),moves:[{id:'crunch',move:'Crunch'}]},pokemon()],
 ['missing request',undefined,pokemon()],
 ['missing Pokemon',active(),undefined],
 ])it('does not preview '+name,()=>assert(!preview(a,p)));
});
