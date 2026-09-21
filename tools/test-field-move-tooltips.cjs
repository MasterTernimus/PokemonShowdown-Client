'use strict';
require('./test-midnight-zone.cjs');
require('vm').runInThisContext(require('fs').readFileSync(require('path').resolve(__dirname, '../play.pokemonshowdown.com/js/battle-log.js'), 'utf8') + '\nglobal.BattleLog = BattleLog;');
const assert = require('assert').strict;
const fields = global.BattleFieldRules;
const preview = global.BattleFieldTooltips;
assert.equal(fields.length, 47);
const base = preview.pokemon();
let combinations = 0;
for (const field of fields) {
	for (const id of Object.keys(BattleMovedex)) {
		const move = Dex.moves.get(id);
		const before = JSON.stringify(move);
		for (const variant of field.uncertain ? [0, 1, 2, 3, 4] : [0]) {
			const result = preview.evaluate(field, move, base, base, '', variant);
			assert(Number.isFinite(result.factor), `${field.id}/${id}: invalid factor`);
			assert.equal(JSON.stringify(move), before, `${field.id}/${id}: mutated cached move`);
			combinations++;
		}
	}
}
function check(fieldid, moveid, factor, source = base, target = base) {
	const field = fields.find(f => f.id === fieldid);
	const move = Dex.moves.get(moveid);
	assert.equal(preview.evaluate(field, move, source, target).factor, factor, `${fieldid}/${moveid}`);
}
check('rockyterrain', 'accelerock', 2.25);
check('rockyterrain', 'rocksmash', 2);
check('rockyterrain', 'earthquake', 1.5);
check('flowergarden5', 'petalblizzard', 3);
check('burningterrain', 'flamethrower', 1.5);
check('burningterrain', 'flamethrower', 1, {...base, isGrounded: () => false});
check('midnightzoneterrain', 'psychic', 1);
check('midnightzoneterrain', 'tackle', 0.33);
check('midnightzoneterrain', 'tackle', 1, {...base, hasType: t => t === 'Water'});
check('midnightzoneterrain', 'earthpower', 1.8);
check('midnightzoneterrain', 'flashcannon', 0.5);
check('midnightzoneterrain', 'flamethrower', 0);
const thunder = Dex.moves.get('thunderbolt');
const circuit = fields.find(f => f.id === 'shortcircuitterrain');
assert.deepEqual([0,1,2,3,4].map(v => preview.evaluate(circuit, thunder, base, base, '', v).factor), [0.8,1.5,0.5,1.2,2]);
const notes = preview.allNotes(Dex.moves.get('accelerock'));
assert(notes.some(n => n.includes('Rocky Terrain: power ×2.25')));
assert(preview.teamBuilderHTML(Dex.moves.get('accelerock')).includes('<summary>Field effects</summary>'));
assert(preview.allNotes(Dex.moves.get('calmmind')).some(n => n.includes('Psychic Terrain: stat changes: +2 Sp. Atk, +2 Sp. Def')));
assert(!preview.allNotes(Dex.moves.get('thunder')).some(n => n.startsWith('Flower Garden')));
check('bigtopterrain', 'acrobatics', 3, {...base, item: 'leftovers'});
check('corrosiveterrain', 'venoshock', 2);
check('corrosiveterrain', 'venoshock', 1, base, {...base, status: 'psn'});
check('electricterrain', 'thunderbolt', 1.5);
check('electricterrain', 'psyblade', 1.5);
check('mistyterrain', 'mistyexplosion', 4.5);
check('psychicterrain', 'expandingforce', 2.25);
function battlePower(field, moveid, expected, options = {}) {
	const battle = new Battle({log: ['|init|battle', '|gen|9', '|tier|[Gen 9] Custom Game', '|gametype|singles',
		'|player|p1|One', '|player|p2|Two', '|start', '|switch|p1a: Mew|Mew|341/341',
		'|switch|p2a: Mew|Mew|341/341', `|-fieldstart|${field}`, '|turn|1']});
	battle.seekTurn(Infinity);
	const pokemon = battle.p1.active[0];
	const server = {speciesForme: 'Mew', ability: 'No Ability', item: options.item || '', hp: 341, maxhp: 341,
		stats: {atk: 200, def: 200, spa: 200, spd: 200, spe: 200}};
	if (options.boosts) pokemon.boosts = options.boosts;
	const tooltips = new BattleTooltips(battle);
	const move = Dex.moves.get(moveid);
	const type = tooltips.getMoveType(move, new ModifiableValue(battle, pokemon, server))[0];
	const value = tooltips.getMoveBasePower(move, type, new ModifiableValue(battle, pokemon, server), battle.p2.active[0]);
	assert.equal(value.value, expected, `${field}/${moveid}: displayed power`);
	if (options.type) assert.equal(type, options.type);
}
battlePower('Rocky Terrain', 'accelerock', 90);
battlePower('Electric Terrain', 'thunderbolt', 135);
battlePower('Electric Terrain', 'psyblade', 120);
battlePower('Psychic Terrain', 'expandingforce', 180);
battlePower('Misty Terrain', 'mistyexplosion', 450);
battlePower('Big Top Terrain', 'acrobatics', 165, {item: 'Leftovers'});
battlePower('Big Top Terrain', 'acrobatics', 165);
battlePower('Cold Eclipse Terrain', 'powertrip', 60, {boosts: {atk: 1}});
battlePower('Fairy Tale Terrain', 'slash', 135, {type: 'Steel'});
battlePower('Electric Terrain', 'terrainpulse', 75, {type: 'Electric'});
console.log(`PASS: ${combinations} field/move/state previews, immutability, stacked boosts, grounding, Midnight Zone exemptions, and Team Builder notes.`);

// Regression coverage for field-reference completeness and one-pass mutation.
const swamp = fields.find(f => f.id === 'swampterrain');
assert.deepEqual(preview.variantValues(swamp, Dex.moves.get('gigadrain')), [0,1,2,3,4,5,6]);
const swampNotes = preview.allNotes(Dex.moves.get('gigadrain')).filter(n => n.startsWith('Swamp Terrain:')).join(' ');
assert(swampNotes.includes('-1 Attack') && swampNotes.includes('-1 Defense'));
const rainbow = fields.find(f => f.id === 'rainbowterrain');
const rainbowNotes = preview.allNotes(Dex.moves.get('triattack')).filter(n => n.startsWith('Rainbow Terrain:')).join(' ');
assert(rainbowNotes.includes('gains a random secondary type'));
assert(!rainbowNotes.includes('Normal / Normal'));
const syntheticMove = {id: 'auditprobe', type: 'Normal', category: 'Special', basePower: 50, flags: {}, secondaries: [{chance: 10, status: 'brn'}]};
assert.equal(preview.evaluate(rainbow, syntheticMove, base, base).move.secondaries[0].chance, 20);
const midnight = fields.find(f => f.id === 'midnightzoneterrain');
assert.equal(preview.evaluate(midnight, {...syntheticMove, type: 'Dark', secondaries: []}, base, base).move.secondaries.length, 1);
const overrideDex = {abilities: {get: id => id === 'voidveil' ? {name: 'Void Veil', shortDesc: 'Insomnia.', desc: 'Insomnia.'} : Dex.abilities.get(id)}};
assert(!Dex.getAbilityEffects('voidveil', new Set(), overrideDex).has('levitate'));
assert(Dex.getAbilityEffects('voidveil').has('levitate'));
console.log('Field outcome, single-pass mutation, and format ability regressions passed.');
