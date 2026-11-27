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
 it('shows the correct stance cut and unmodified attacking stats and Speed, including suppression', () => {
  for (const [form, cut] of [['Samurott', 'Cresting Cut'], ['Samurott-Hisui', 'Moonless Cut']]) {
   p.speciesForme = own.speciesForme = form;
   p.ability = own.ability = own.baseAbility = 'Shogun Stance';
   own.stats = {atk: 103, def: 100, spa: 98, spd: 100, spe: 201};
   const stats = () => tips.calculateModifiedStats(p, own);
   const tooltip = () => tips.showMoveTooltip(Dex.moves.get('Razor Shell'), 'move', p, own);
   assert.deepEqual(stats(), own.stats);
   assert(tooltip().includes(cut));
   assert(p.hasKnownAbilityEffect('shellarmor', own), form);
   p.volatiles.gastroacid = ['gastroacid'];
   assert.deepEqual(stats(), own.stats);
   assert(!tooltip().includes(cut));
   assert.equal(p.hasKnownAbilityEffect('shellarmor', own), false);
   delete p.volatiles.gastroacid;
  }
  p.speciesForme = own.speciesForme = 'Mew';
  assert.deepEqual(tips.calculateModifiedStats(p, own), own.stats);
 });
 it('previews Mega signature categories from staged stats, retaining each move’s category on a tie', () => {
  for (const id of ['faultcleave', 'soniclance', 'leafrush', 'blazerush', 'tiderush', 'snarevine', 'fmimpression', 'gildedwing', 'crowncrash']) {
   const move = Dex.moves.get(id);
   assert(move.flags.adaptivecategory && move.flags.megasignature, id);
   const category = () => tips.getMoveType(move, new ModifiableValue(battle, p, own))[1];
   p.boosts = {}; assert.equal(category(), move.category, id);
   p.boosts = {atk: 1}; assert.equal(category(), 'Physical', id);
   p.boosts = {spa: 1}; assert.equal(category(), 'Special', id);
  }
  for (const id of ['brambleguard', 'pulsechime', 'sacredrush', 'apexcleave', 'shadowshuriken']) {
   assert(!Dex.moves.get(id).flags.megasignature, id);
  }
 });
 it('compares Defense with Sp. Atk for Armor Slam and previews the matching Wonder Room interaction', () => {
  const move = Dex.moves.get('armorslam');
  battle.pseudoWeather = [['Wonder Room', 0, 0]];
  own.stats.atk = 300;
  p.boosts = {spa: 1};
  const category = () => tips.getMoveType(move, new ModifiableValue(battle, p, own))[1];
  const power = () => tips.getMoveBasePower(move, move.type, new ModifiableValue(battle, p, own), battle.p2.active[0]).toString();
  assert.equal(category(), 'Special'); assert.doesNotMatch(power(), /Wonder Room/);
  p.boosts = {spa: 1, spd: 1}; // Wonder Room applies Sp. Def stages to the Defense comparison.
  assert.equal(category(), 'Physical'); assert.match(power(), /Wonder Room/);
 });
 for (const id of ['venamskiss', 'firepledge', 'waterpledge', 'grasspledge', 'needlegun', 'dragondarts', 'barrage', 'explosion', 'selfdestruct', 'radiantassault', 'roaroftime', 'spacialrend', 'shadowforce', 'veeveevolley',
  'bouncybubble', 'buzzybuzz', 'sizzlyslide', 'glitzyglow', 'baddybad', 'sappyseed', 'freezyfrost', 'sparklyswirl',
  'punchypummel', 'twirlytwister', 'rockyrampage', 'dustydrift', 'steelystrike', 'stabbyswarm', 'ickyinjection', 'spookyspell', 'scalyscorn', 'watershuriken']) {
  it(id + ' follows stat stages, tie rules and preserves Dex data', () => {
   const m = Dex.moves.get(id), original = m.category;
   const category = () => tips.getMoveType(m, new ModifiableValue(battle, p, own))[1];
   const physicalTie = ['needlegun', 'dragondarts', 'barrage', 'explosion', 'selfdestruct'].includes(id);
   assert.equal(category(), physicalTie ? 'Physical' : 'Special');
   p.boosts.spa = 1; assert.equal(category(), 'Special'); p.boosts = {atk: 1}; assert.equal(category(), 'Physical');
   p.boosts = {}; own.stats.spa = 101; own.item = 'Choice Band'; assert.equal(category(), 'Special'); assert.equal(m.category, original);
  });
 }
 it('previews adaptive Venams Kiss using the exact Mega stats without mutating the request', () => {
  own.speciesForme = p.speciesForme = 'Seviper'; own.stats.atk = 256; own.stats.spa = 279;
  own.megaStats = {...own.stats, atk: 316, spe: 166}; battle.myPokemon = [own];
  const before = JSON.stringify(own), move = Dex.moves.get('venamskiss');
  assert.equal(tips.getMoveType(move, new ModifiableValue(battle,p,own))[1], 'Special');
  let category;
  tips.showMoveTooltip = (m, type, preview, server) => {category = tips.getMoveType(m, new ModifiableValue(battle, preview, server))[1]; return '';};
  tips.placeTooltip = () => {};
  tips.showTooltip({dataset:{tooltip:'move|Venams Kiss|0||sevipermega'}});
  assert.equal(category, 'Physical'); assert.equal(JSON.stringify(own), before); assert.equal(p.speciesForme, 'Seviper');
 });
 it('previews adaptive Eevee attacks in field power, while Max conversions retain the base category', () => {
  const previous = window.BattleFieldTooltips;
  try {
   for (const [id, boosts, category] of [['punchypummel', {spa: 1}, 'Special'], ['twirlytwister', {atk: 1}, 'Physical']]) {
    const seen = [], move = Dex.moves.get(id);
    p.boosts = boosts;
    window.BattleFieldTooltips = {preview(b, attack) {seen.push(attack.category); return null;}};
    tips.getMoveBasePower(move, move.type, new ModifiableValue(battle, p, own));
    assert.deepEqual(seen, [category]);
    assert.equal(tips.getMoveType(move, new ModifiableValue(battle, p, own), true)[1], move.category);
   }
  } finally {window.BattleFieldTooltips = previous;}
 });
 it('uses the selected spread for Eevee move icons and category filters in both teambuilders', () => {
  const picker = require('./helpers/exclusive-move-picker.cjs')();
  picker.preact = require('preact');
  const modernCode = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-searchresults.js'), 'utf8');
  const Results = require('vm').runInContext(modernCode + '\nPSSearchResults', picker);
  const modern = Object.create(Results.prototype), legacy = Object.create(picker.BattleSearch.prototype);
  const move = picker.Dex.moves.get('punchypummel');
  assert.match(move.shortDesc, /higher of Attack and Sp\. Atk/);
  for (const [spread, category] of [[{}, 'Special'], [{nature: 'Adamant'}, 'Physical'], [{evs: {spa: 252}}, 'Special'], [{ivs: {spa: 0}}, 'Physical']]) {
   const set = {species: 'Mew', moves: [move.name], ...spread};
   const search = new picker.MoveSearch('move', 'gen9nofieldsinglesgame', set);
   modern.props = {search: {dex: picker.Dex, typedSearch: search}};
   legacy.engine = modern.props.search;
   legacy.moveDisplaySet = set;
   assert(search.filter(['move', move.id], [['category', category]]));
   assert(!search.filter(['move', move.id], [['category', category === 'Physical' ? 'Special' : 'Physical']]));
   const icon = 'sprites/categories/' + category + '.png';
   const html = legacy.renderMoveRow(move, 0, 0);
   assert(html.includes(icon));
   assert(html.includes(move.shortDesc));
   const tree = JSON.stringify(modern.renderMoveRow(move.id, 0, 0));
   assert(tree.includes(icon));
   assert(tree.includes(move.shortDesc));
  }
  assert.equal(move.category, 'Physical');
  assert.equal(picker.Dex.getTeambuilderMoveCategory(picker.Dex.moves.get('glitchygraphics'), legacy.moveDisplaySet), 'Status');
 });
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
  assert(Dex.getAbilityEffects('railsight').has('innerfocus')); assert(Dex.abilities.get('Rail Sight').desc.includes('1.5x'));
  assert(Dex.moves.get('needlegun').desc.includes('category'));
 });
	it('exposes approved Tidal Voice sound protection and post-attack chance', () => {
		assert(!/restores.*negative|heals.*allies/i.test(Dex.abilities.get('Tidal Voice').desc));
		assert(Dex.getAbilityEffects('tidalvoice').has('liquidvoice'));assert(Dex.getAbilityEffects('tidalvoice').has('soundproof'));assert(Dex.abilities.get('tidalvoice').desc.includes('30%'));
	});

 it('shows Limber field protection for direct and composite holders, including suppression', () => {
  const fields = ['Water Surface Terrain', 'Murkwater Surface Terrain', 'New World Terrain', 'Cold Eclipse Terrain', 'Icy Terrain', 'Snowy Terrain', 'Underwater Terrain', 'Midnight Zone Terrain'];
  for (const ability of ['Limber', 'Kick Fiend']) {
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

 it('applies field Speed penalties to Raging Thicket after Limber removal',()=>{
  p.ability='Raging Thicket';own.ability=own.baseAbility='Raging Thicket';
  battle.pseudoWeather=[];const normal=tips.calculateModifiedStats(p,own).spe;
  battle.pseudoWeather=[['Water Surface Terrain',0,0]];assert(tips.calculateModifiedStats(p,own).spe<normal);
 });

 it('suppresses selected Limber field protection without inflating ordinary stats', () => {
  p.speciesForme='Lopunny-Mega';own.speciesForme='Lopunny-Mega';p.ability='Unchecked Assault';own.ability=own.baseAbility='Unchecked Assault';
  const normal=tips.calculateModifiedStats(p,own).spe;assert.equal(normal,100);
  for(const field of ['Water Surface Terrain','Underwater Terrain','Midnight Zone Terrain']){
   battle.pseudoWeather=[[field,0,0]];delete p.volatiles.gastroacid;assert.equal(tips.calculateModifiedStats(p,own).spe,normal,field);p.volatiles.gastroacid=['gastroacid'];assert(tips.calculateModifiedStats(p,own).spe<normal,field);
  }
 });
 it('applies selected Telepathy Speed only while its Psychic field is active',()=>{
  p.speciesForme='Slowking-Galar';own.speciesForme='Slowking-Galar';p.ability='Telepathy';own.ability=own.baseAbility='Telepathy';
  const normal=tips.calculateModifiedStats(p,own).spe;battle.pseudoWeather=[['Psychic Terrain',0,0]];assert.equal(tips.calculateModifiedStats(p,own).spe,normal*2);
  battle.pseudoWeather=[];assert.equal(tips.calculateModifiedStats(p,own).spe,normal);
 });

});
