'use strict';
const assert=require('assert').strict;const {Dex}=require('./helpers/isolated-dex.cjs')();
describe('Player-facing ability prose cleanup',()=>{
 it('shows only the three useful Cursed Marionette effect lines',()=>{const a=Dex.abilities.get('cursedmarionette');const lines=Dex.getAbilityDescriptionLines(a.desc);assert.equal(lines.length,3);assert.match(lines[0],/Once per entry per foe.*successful status move/);assert.match(lines[1],/1\/8/);assert.match(lines[2],/1\.3x/);assert(!/Prankster comes|No field|Failed, reflected/.test(a.desc));});
 it('removes historical exclusions and passive-location reminders',()=>{for(const id of ['cursedkeepsake','reapersgrip','evergreen','scavenger','burningquake','dreaddominion','voidcommand'])assert(!/No field creation|comes from its passive|Does not double item|Does not prevent Defense drops|Does not raise Speed|Does not change Dark\/Fairy|No damage reduction or separate KO boost/.test(Dex.abilities.get(id).desc),id);});
 it('retains restrictions that define battle behavior',()=>{assert.match(Dex.abilities.get('ange').desc,/Substitute/);assert.match(Dex.abilities.get('exaltedaether').desc,/Z.*Max/);assert.match(Dex.abilities.get('scavenger').desc,/once|At most one/i);});
});
