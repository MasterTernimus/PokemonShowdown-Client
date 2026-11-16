'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();

describe('Cherrim personal sunlight previews', () => {
	let battle, tips, p, ally, own, partner;
	beforeEach(() => {
		battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|doubles',
			'|switch|p1a: Cherrim|Cherrim-Sunshine, L100|100/100', '|switch|p1b: Mew|Mew, L100|100/100',
			'|switch|p2a: Mew|Mew, L100|100/100']});
		p = battle.p1.active[0]; ally = battle.p1.active[1]; tips = new BattleTooltips(battle);
		own = {speciesForme: 'Cherrim-Sunshine', ability: 'Everlasting Bloom', item: '', hp: 100, maxhp: 100,
			level: 100, stats: {atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, passives: ['flowergift']};
		partner = {...own, speciesForme: 'Mew', ability: 'No Ability', passives: []};
		p.ability = 'Everlasting Bloom';
	});
	afterEach(() => battle.destroy());
	it('publishes both assignments and the personal sunlight description', () => {
		for (const id of ['cherrim', 'cherrimsunshine']) {
			assert.deepEqual(Dex.species.get(id).abilities, {0: 'Chlorophyll', 1: 'Everlasting Bloom', H: 'Flower Veil'});
			assert.deepEqual(Dex.species.get(id).passives, ['flowergift']);
		}
		assert.match(Dex.abilities.get('everlastingbloom').desc, /Actual weather is unchanged/);
	});
	it('shows personal Flower Gift boosts in rain without boosting its ally', () => {
		battle.weather = 'raindance';
		assert.equal(new ModifiableValue(battle, p, own).effectiveWeather(), 'sunnyday');
		assert.equal(new ModifiableValue(battle, ally, partner).effectiveWeather(), 'raindance');
		assert.equal(tips.calculateModifiedStats(p, own).atk, 150);
		assert.equal(tips.calculateModifiedStats(p, own).spd, 150);
		assert.equal(tips.calculateModifiedStats(ally, partner).atk, 100);
		battle.weather = 'sunnyday';
		assert.equal(tips.calculateModifiedStats(ally, partner).atk, 150);
	});
	it('handles suppression and Umbrella without losing the passive in actual sun', () => {
		p.volatiles.gastroacid = ['gastroacid'];
		assert.equal(tips.calculateModifiedStats(p, own).atk, 100);
		battle.weather = 'sunnyday';
		assert.equal(tips.calculateModifiedStats(p, own).atk, 150);
		delete p.volatiles.gastroacid;
		own.item = 'Utility Umbrella';
		assert.equal(tips.calculateModifiedStats(p, own).atk, 100);
	});
	it('shows stage 1 Flower Gift and stage 4 Chlorophyll without double Speed in sun', () => {
		p.ability = own.ability = 'Chlorophyll';
		battle.pseudoWeather = [['Flower Garden 1', 0, 0]];
		assert.equal(tips.calculateModifiedStats(p, own).atk, 150);
		battle.pseudoWeather = [['Flower Garden 4', 0, 0]];
		assert.equal(tips.calculateModifiedStats(p, own).spe, 200);
		battle.weather = 'sunnyday';
		assert.equal(tips.calculateModifiedStats(p, own).spe, 200);
	});
});
