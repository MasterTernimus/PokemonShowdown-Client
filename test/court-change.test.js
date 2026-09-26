const assert=require('assert').strict;
global.window=global;
global.BattlePokedex=require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex;
for(const n of ['battle-dex-data','battle-dex','battle-scene-stub','battle-text-parser','battle'])require('../play.pokemonshowdown.com/js/'+n);
describe('Court Change display',()=>{
 it('moves custom walls and other supported conditions with their timers',()=>{
  const b=new Battle({debug:true});
  try {
   for(const id of ['arenitewall','atlantiswall','luckychant','gmaxvolcalith']) {
    b.p1.sideConditions[id]=[id,1,3,7];
   }
   b.p2.sideConditions.atlantiswall=['atlantiswall',1,2,0];
   b.p1.sideConditions.wish=['wish',1,1,0];
   b.runMinor(['-swapsideconditions'],{});
   assert.deepEqual(b.p1.sideConditions.atlantiswall,['atlantiswall',1,2,0]);
   for(const id of ['arenitewall','atlantiswall','luckychant','gmaxvolcalith'])assert.deepEqual(b.p2.sideConditions[id],[id,1,3,7]);
   assert(!b.p1.sideConditions.arenitewall);assert(b.p1.sideConditions.wish);
  } finally {b.destroy();}
 });
 it('rotates four sides simultaneously without losing layers, timers, or unrelated conditions',()=>{
  const b=new Battle({debug:true,log:['|init|battle','|gametype|freeforall']});
  try {
   const order=[0,3,1,2];
   for(let i=0;i<4;i++){
    b.sides[i].sideConditions.spikes=['Spikes',i%3+1,0,0];
    b.sides[i].sideConditions.atlantiswall=['Atlantis Wall',1,i+1,0];
    b.sides[i].sideConditions.wish=['Wish',1,i+1,0];
   }
   b.runMinor(['-swapsideconditions'],{});
   for(let i=0;i<4;i++){
    const target=b.sides[order[(i+1)%4]],source=order[i];
    assert.deepEqual(target.sideConditions.spikes,['Spikes',source%3+1,0,0]);
    assert.deepEqual(target.sideConditions.atlantiswall,['Atlantis Wall',1,source+1,0]);
    assert.equal(target.sideConditions.wish[2],target.n+1);
   }
  } finally {b.destroy();}
 });
});
