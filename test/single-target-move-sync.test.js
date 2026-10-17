const assert=require('assert').strict;
require('./battle.test');
describe('Custom move presentation parity',()=>{
 it('shows Mortal Spin as single target',()=>{const move=Dex.moves.get('mortalspin');assert.equal(move.target,'normal');assert(move.shortDesc.includes('one target'));});
 it('describes Focus Punch full power and half-power Protect bypass',()=>{const move=Dex.moves.get('focuspunch');assert.equal(move.basePower,150);assert(move.shortDesc.includes('fails unless Focus Energy'));assert(move.desc.includes('Parental Bond')); assert(move.shortDesc.includes('75 BP'));assert(!move.desc.includes('reduced to 50'));});
});
