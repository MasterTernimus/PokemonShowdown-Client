const assert = require('assert').strict, fs = require('fs'), path = require('path');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
require('./battle.test');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-tooltips.js'), 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();
describe('Adaptive category client parity', () => {
 let battle, p, own, tips;
 beforeEach(() => {
  battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Mew|Mew, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
  p = battle.p1.active[0]; own = {speciesForme: 'Mew', ability: 'No Ability', baseAbility: 'No Ability', item: '', hp: 100, maxhp: 100, level: 100, status: '', stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}}; tips = new BattleTooltips(battle);
 });
 afterEach(() => battle.destroy());
 for (const id of ['needlegun', 'dragondarts', 'barrage', 'explosion', 'selfdestruct', 'radiantassault', 'roaroftime', 'spacialrend', 'shadowforce', 'veeveevolley', 'watershuriken']) {
  it(id + ' follows stat stages, tie rules and preserves Dex data', () => {
   const m = Dex.moves.get(id), original = m.category;
   const category = () => tips.getMoveType(m, new ModifiableValue(battle, p, own))[1];
   const physicalTie = ['needlegun', 'dragondarts', 'barrage', 'explosion', 'selfdestruct'].includes(id);
   assert.equal(category(), physicalTie ? 'Physical' : 'Special');
   p.boosts.spa = 1; assert.equal(category(), 'Special'); p.boosts = {atk: 1}; assert.equal(category(), 'Physical');
   p.boosts = {}; own.stats.spa = 101; own.item = 'Choice Band'; assert.equal(category(), 'Special'); assert.equal(m.category, original);
  });
 }
 it('passes Special Needle Gun to field power and ability previews', () => {
  p.boosts.spa = 1; const previous = window.BattleFieldTooltips, observed = [];
  window.BattleFieldTooltips = {preview(b, move) {observed.push(move.category); return null;}, activeNotes() {return '';}};
  try { tips.showMoveTooltip(Dex.moves.get('needlegun'), '', p, own); assert(observed.length > 1); assert(observed.every(x => x === 'Special')); }
  finally {window.BattleFieldTooltips = previous;}
 });
 it('keeps deliberate split-stat and inactive Tera moves unchanged', () => {
  p.boosts.spa = 1;
  for (const id of ['bodypress', 'flowertrick', 'hexingslash']) assert.equal(tips.getMoveType(Dex.moves.get(id), new ModifiableValue(battle, p, own))[1], 'Physical');
  p.boosts = {atk: 2}; assert.equal(tips.getMoveType(Dex.moves.get('terablast'), new ModifiableValue(battle, p, own))[1], 'Special');
 });
 it('exposes approved Archaludon composites and descriptions', () => {
  for (const id of ['sturdy', 'solidrock']) assert(Dex.getAbilityEffects('anchorbridge').has(id));
  assert(Dex.getAbilityEffects('railsight').has('stalwart')); assert(Dex.abilities.get('Rail Sight').desc.includes('1.5x'));
  assert(Dex.moves.get('needlegun').desc.includes('category'));
 });
	it('exposes the Tidal Voice Aria healing rider without adding an ability component', () => {
		assert(Dex.abilities.get('Tidal Voice').desc.includes('each active adjacent ally heals 1/8'));
		assert(Dex.getAbilityEffects('tidalvoice').has('liquidvoice'));
	});

 it('shows Limber field protection for direct and composite holders, including suppression', () => {
  const fields = ['Water Surface Terrain', 'Murkwater Surface Terrain', 'New World Terrain', 'Cold Eclipse Terrain', 'Icy Terrain', 'Snowy Terrain', 'Underwater Terrain', 'Midnight Zone Terrain'];
  for (const ability of ['Limber', 'Verdant Drake', 'Kick Fiend']) {
   p.ability = ability; own.ability = own.baseAbility = ability;
   for (const field of fields) {
    battle.pseudoWeather = []; const normal = tips.calculateModifiedStats(p, own).spe;
    battle.pseudoWeather = [[field, 0, 0]];
    assert.equal(tips.calculateModifiedStats(p, own).spe, normal, ability + ': ' + field);
    p.volatiles.gastroacid = ['gastroacid']; assert(tips.calculateModifiedStats(p, own).spe < normal, JSON.stringify({ability, field, normal, actual: tips.calculateModifiedStats(p, own).spe, effective: p.effectiveAbility(own), grounded: p.isGrounded(own), gen: battle.gen}));
    delete p.volatiles.gastroacid;
   }
  }
 });

 it('keeps passive Limber field protection under suppression without inflating ordinary stats', () => {
  p.speciesForme='Lopunny-Mega';own.speciesForme='Lopunny-Mega';p.ability='Unchecked Assault';own.ability=own.baseAbility='Unchecked Assault';
  const normal=tips.calculateModifiedStats(p,own).spe;assert.equal(normal,100);
  for(const field of ['Water Surface Terrain','Underwater Terrain','Midnight Zone Terrain']){
   battle.pseudoWeather=[[field,0,0]];p.volatiles.gastroacid=['gastroacid'];assert.equal(tips.calculateModifiedStats(p,own).spe,normal,field);
  }
 });
 it('applies passive Telepathy Speed only while its Psychic field is active',()=>{
  p.speciesForme='Slowking-Galar';own.speciesForme='Slowking-Galar';p.ability='No Ability';own.ability=own.baseAbility='No Ability';
  const normal=tips.calculateModifiedStats(p,own).spe;battle.pseudoWeather=[['Psychic Terrain',0,0]];assert.equal(tips.calculateModifiedStats(p,own).spe,normal*2);
  battle.pseudoWeather=[];assert.equal(tips.calculateModifiedStats(p,own).spe,normal);
 });

});
