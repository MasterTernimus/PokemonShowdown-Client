'use strict';

const assert = require('assert').strict;

global.window = global;
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves.js').BattleMovedex;
global.BattlePokedex = require('../play.pokemonshowdown.com/data/pokedex.js').BattlePokedex;
global.BattleAbilities = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
global.BattlePokemonSprites = {};
global.BattlePokemonSpritesBW = {};
global.BattleTeambuilderTable = require('../play.pokemonshowdown.com/data/teambuilder-tables.js').BattleTeambuilderTable;
for (let gen = 1; gen <= 9; gen++) {
	const table = BattleTeambuilderTable['gen' + gen] = BattleTeambuilderTable.gen9natdex;
	for (const key of ['overrideAbilityData', 'overrideItemDesc', 'overrideMoveData', 'overrideSpeciesData', 'overrideTypeChart', 'removeType']) {
		table[key] ||= {};
	}
}
require('../play.pokemonshowdown.com/js/battle-dex-data.js');
require('../play.pokemonshowdown.com/js/battle-dex.js');
require('../play.pokemonshowdown.com/js/battle-scene-stub.js');
require('../play.pokemonshowdown.com/js/battle-text-parser.js');
require('../play.pokemonshowdown.com/js/battle.js');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
require('../play.pokemonshowdown.com/js/battle-field-tooltips.js');

describe('Live field status', () => {
	let battle;
	afterEach(() => battle?.destroy());

	it('tracks an exact Mega field duration and its remaining turns', () => {
		battle = new Battle({debug: true});
		battle.gen = 9;
		const parsed = BattleTextParser.parseBattleLine("|-fieldstart|Dragon's Den Terrain|[turns] 5");
		assert.equal(parsed.kwArgs.turns, '5');
		battle.runMinor(parsed.args, parsed.kwArgs);
		let status = BattleFieldTooltips.liveStatus(battle);
		assert.equal(status.field.name, "Dragon's Den Terrain");
		assert.equal(status.field.turns, '5 turns');
		assert(status.field.notes.some(note => note.includes('Dragon')));
		battle.updateTurnCounters();
		status = BattleFieldTooltips.liveStatus(battle);
		assert.equal(status.field.turns, '4 turns');
	});

	it('updates stage, aura, weather, and room state without inventing exact timers', () => {
		battle = new Battle({debug: true});
		battle.gen = 9;
		battle.runMinor(['-fieldstart', 'Flower Garden 3'], {});
		battle.runMinor(['-fieldstart', 'Trick Room'], {});
		let status = BattleFieldTooltips.liveStatus(battle);
		assert.equal(status.field.name, 'Flower Garden 3');
		assert.equal(status.field.turns, 'Persistent');
		assert.equal(status.rooms[0].name, 'Trick Room');
		battle.runMinor(['-fieldstart', 'Cold Eclipse Terrain'], {});
		status = BattleFieldTooltips.liveStatus(battle);
		assert.equal(status.field.name, 'Cold Eclipse Terrain');
		assert.equal(status.field.turns, '5-8 turns');
	});

	it('explains the Dive field-change power bonus only for the active field', () => {
		battle = new Battle({debug: true});
		battle.gen = 9;
		const pokemon = {
			name: 'Mew', speciesForme: 'Mew', boosts: {}, volatiles: {}, status: '',
			getTypes: () => [['Psychic']], effectiveAbility: () => 'No Ability', isGrounded: () => true,
			side: {foe: {active: []}},
		};
		const server = {ability: 'No Ability', item: '', status: '', speciesForme: 'Mew'};
		const dive = Dex.moves.get('dive');
		battle.runMinor(['-fieldstart', 'Water Surface Terrain'], {});
		let note = BattleFieldTooltips.activeNotes(battle, dive, pokemon, server);
		assert.match(note, /power ×3\.51/);
		assert.match(note, /field-change power bonus ×1\.3.*Underwater/);
		battle.runMinor(['-fieldstart', 'Underwater Terrain'], {});
		note = BattleFieldTooltips.activeNotes(battle, dive, pokemon, server);
		assert.match(note, /power ×1\.95/);
		assert.match(note, /field-change power bonus ×1\.3.*Water Surface/);
		assert.equal(BattleFieldTooltips.transitionBonusNote('electricterrain', dive), '');
	});
});
