'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
require('./battle.test');
global.BattleMovedex = require('../play.pokemonshowdown.com/data/moves').BattleMovedex;
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync(
	'play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();

describe('Mega signature battle forecasts', () => {
	let battle, user, foe, other, own, tips;
	beforeEach(() => {
		battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|doubles',
			'|switch|p1a: Caster|Gengar-Mega, L100|100/100', '|switch|p1b: Ally|Mew, L100|100/100',
			'|switch|p2a: Left|Mew, L100|100/100', '|switch|p2b: Right|Mew, L100|100/100']});
		user = battle.p1.active[0];
		[foe, other] = battle.p2.active;
		own = {speciesForme: 'Gengar-Mega', ability: 'No Ability', baseAbility: 'No Ability', passives: [],
			item: '', level: 100, hp: 100, maxhp: 100, stats: {atk: 200, def: 100, spa: 200, spd: 100, spe: 100}};
		user.ability = own.ability;
		tips = new BattleTooltips(battle);
	});
	afterEach(() => battle.destroy());
	function power(id, target = foe) {
		const move = Dex.moves.get(id);
		return tips.getMoveBasePower(move, move.type, new ModifiableValue(battle, user, own), target);
	}
	function accuracy(id, target = foe) {
		return tips.getMoveAccuracy(Dex.moves.get(id), new ModifiableValue(battle, user, own), target).value;
	}

	it('applies Crown Rend, Strata Cannon and Crucible Coil to the correct Defense stage', () => {
		foe.boosts.def = 1;
		assert.equal(power('crownrend').value, 100);
		assert.equal(power('crownrend', other).value, 80);
		assert.equal(power('stratacannon').value, 80);
		assert.equal(accuracy('cruciblecoil'), 75);
		user.boosts.def = 1;
		assert.equal(power('stratacannon').value, 100);
		assert.equal(accuracy('cruciblecoil'), 90);
		assert.equal(accuracy('magmastorm'), 75);
		assert.equal(power('dragonclaw').value, 80);
	});

	it('uses Flashpoint Burst’s HP floor and Furnace Crash’s weight floor', () => {
		user.hp = own.hp = 1;
		assert.equal(power('flashpointburst').value, 90);
		assert.equal(power('eruption').value, 1);
		user.hp = own.hp = 50;
		assert.equal(power('flashpointburst').value, 90);
		assert.equal(power('eruption').value, 75);
		user.hp = own.hp = 80;
		assert.equal(power('flashpointburst').value, 120);
		assert.equal(power('flashpointburst').value, power('eruption').value);
		user.getWeightKg = () => 100;
		foe.getWeightKg = () => 100;
		assert.equal(power('furnacecrash').value, 70);
		assert.equal(power('heatcrash').value, 40);
		foe.getWeightKg = () => 45;
		assert.equal(power('furnacecrash').value, 70);
		assert.equal(power('heatcrash').value, 60);
		foe.getWeightKg = () => 30;
		assert.equal(power('furnacecrash').value, 80);
		foe.getWeightKg = () => 20;
		assert.equal(power('furnacecrash').value, 120);
		const unknownWeight = power('furnacecrash', null);
		assert.equal(unknownWeight.value, 70);
		assert.equal(unknownWeight.maxValue, 120);
		foe.volatiles.dynamax = ['dynamax'];
		assert.equal(power('furnacecrash').value, 0);
	});

	it('shows Witching Hex’s status-based power and ordinary accuracy', () => {
		foe.status = 'brn';
		other.ability = 'Comatose';
		assert.equal(power('witchinghex').value, 140);
		assert.equal(power('witchinghex', other).value, 140);
		assert.equal(accuracy('witchinghex'), 100);
		assert.equal(accuracy('witchinghex', other), 100);
		const html = tips.showMoveTooltip(Dex.moves.get('hex'), 'move', user, own);
		assert.match(html, /Witching Hex/);
		assert.match(html, /Accuracy: 100%/);
		assert.doesNotMatch(html, /Accuracy vs/);
		foe.status = '';
		assert.equal(power('witchinghex').value, 70);
		assert.equal(accuracy('witchinghex'), 100);
	});

	it('forecasts Rescue Gale in normal weather, rain and sun, using each target’s umbrella', () => {
		assert.equal(accuracy('rescuegale'), 85);
		assert.equal(accuracy('hurricane'), 70);
		battle.weather = 'raindance';
		own.item = 'Utility Umbrella';
		other.item = 'Utility Umbrella';
		assert.equal(accuracy('rescuegale'), 0);
		assert.equal(accuracy('rescuegale', other), 85);
		battle.weather = 'sunnyday';
		assert.equal(accuracy('rescuegale'), 50);
		assert.equal(accuracy('rescuegale', other), 85);
	});

	it('shows the current form’s Water Pulse and applies Broadside’s evasion rule per target', () => {
		const pulse = Dex.moves.get('waterpulse');
		for (const [forme, name] of [
			['Blastoise-Mega', 'Broadside'], ['Milotic-Mega', 'Soothing Tide'],
			['Clawitzer-Mega', 'Tide Mortar'], ['Blastoise', 'Water Pulse'],
		]) {
			user.speciesForme = own.speciesForme = forme;
			assert(tips.showMoveTooltip(pulse, 'move', user, own).includes('<h2>' + name), forme);
		}
		user.speciesForme = own.speciesForme = 'Blastoise-Mega';
		const move = Dex.moves.get('broadside');
		assert.equal(move.type, 'Water');
		assert.equal(move.basePower, 75);
		assert(move.flags.pulse);
		assert.deepEqual(move.secondaries, pulse.secondaries);
		assert(move.secondaries.some(effect => effect.volatileStatus === 'confusion' && effect.chance === 20));
		user.boosts.accuracy = -2;
		foe.boosts.evasion = 2;
		other.boosts.evasion = -2;
		assert.equal(accuracy('broadside', foe), 60);
		assert.equal(accuracy('broadside', other), 100);
		const html = tips.showMoveTooltip(pulse, 'move', user, own);
		assert.match(html, /Accuracy vs Left: 60%/);
		assert.match(html, /Accuracy vs Right: 100%/);
		user.boosts.accuracy = 0;
		assert.equal(accuracy('broadside', other), 100);
		assert(tips.showMoveTooltip(Dex.moves.get('flashcannon'), 'move', user, own).includes('<h2>Flash Cannon'));
	});

	it('preserves native move-owned field effects for both the learned move and its Mega signature', () => {
		const tables = ['BattleFieldMoveRules', 'BattleFieldRules', 'BattleNaturePowerMoves', 'BattleFieldTooltips'];
		const previous = tables.map(key => global[key]);
		try {
			for (const name of ['battle-field-rules', 'battle-field-tooltips']) {
				new Function(fs.readFileSync('play.pokemonshowdown.com/js/' + name + '.js', 'utf8'))();
			}
			for (const [id, type, basePower, ability] of [
				['megasolcannon', 'Grass', 140, 'Verdant Eruption'], ['flarecannon', 'Fire', 130, 'Solar Eruption'],
			]) {
				const move = Dex.moves.get(id);
				assert.equal(move.type, type);
				battle.weather = 'raindance';
				assert.equal(power(id).value, basePower / 2);
				own.ability = user.ability = ability;
				assert.equal(power(id).value, basePower);
				own.ability = user.ability = 'No Ability';
				battle.weather = '';
				battle.pseudoWeather = [['Starlight Arena Terrain', 0, 0]];
				assert.equal(BattleFieldTooltips.preview(battle, move, user, own, foe).result.move.type, 'Fairy');
				battle.pseudoWeather = [];
			}
			battle.pseudoWeather = [['New World Terrain', 0, 0]];
			for (const id of ['voidfall', 'heavenfall']) {
				const result = BattleFieldTooltips.preview(battle, Dex.moves.get(id), user, own, foe).result;
				assert.equal(result.move.accuracy, true);
				assert.deepEqual(result.move.self.boosts, {spa: -1});
				assert.equal(accuracy(id), 0);
				assert.equal(power(id).value, 390);
			}
			battle.pseudoWeather = [['Infernal Eclipse Terrain', 0, 0]];
			const fieldOnly = power('witchinghex').value;
			assert(fieldOnly >= 140);
			foe.status = 'brn';
			assert.equal(power('witchinghex').value, fieldOnly);
			battle.pseudoWeather = [['Electric Terrain', 0, 0]];
			for (const id of ['surgeram', 'volttackle', 'railrush', 'wildcharge']) {
				const result = BattleFieldTooltips.preview(battle, Dex.moves.get(id), user, own, foe).result;
				assert(!result.move.recoil, id);
			}
			for (const id of ['pondcircuit', 'paraboliccharge']) {
				const result = BattleFieldTooltips.preview(battle, Dex.moves.get(id), user, own, foe).result;
				assert.deepEqual(result.move.drain, [3, 4], id);
			}
		} finally {
			tables.forEach((key, i) => { global[key] = previous[i]; });
		}
	});
});
