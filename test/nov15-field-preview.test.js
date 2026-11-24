'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
require('../play.pokemonshowdown.com/js/battle-field-rules.js');
require('../play.pokemonshowdown.com/js/battle-field-tooltips.js');
const {BattleTooltips, ModifiableValue} = new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};')();
describe('Terrain Pulse random-type preview', () => {
	it('shows uncertainty on New World, then the exact Aura type when overridden', () => {
		const battle = new Battle({debug:true, log:['|init|battle','|gen|9','|gametype|singles',
			'|switch|p1a: Mew|Mew, L100|100/100','|switch|p2a: Mew|Mew, L100|100/100']});
		try {
			battle.pseudoWeather = [['New World Terrain',0,0]];
			const p = battle.p1.active[0], move = Dex.moves.get('terrainpulse');
			const server = {speciesForme:'Mew', ability:'No Ability', item:'', hp:100, maxhp:100, level:100, stats:{atk:100,def:100,spa:100,spd:100,spe:100}};
			const tips = new BattleTooltips(battle), value = new ModifiableValue(battle,p,server);
			assert.equal(tips.getMoveType(move,value)[0], '???');
			assert.match(BattleFieldTooltips.activeNotes(battle,move,p,server), /type is random/);
			battle.pseudoWeather.push(['Electric Aura',5,0]);
			assert.equal(tips.getMoveType(move,value)[0], 'Electric');
			assert(!BattleFieldTooltips.activeNotes(battle,move,p,server).includes('type is random'));
			battle.pseudoWeather = [['Cold Eclipse Terrain', 0, 0], ['Rainbow Aura', 5, 0]];
			const type = tips.getMoveType(move, value)[0];
			assert.equal(type, 'Dragon');
			const power = tips.getMoveBasePower(move, type, value, battle.p2.active[0]);
			assert.equal(power.value, 200);
			assert.match(String(power), /Cold Eclipse Terrain \+ Rainbow Aura/);
		} finally { battle.destroy(); }
	});
	it('publishes the changed mechanics and Rampardos move removal', () => {
		assert.equal(Dex.moves.get('tailsmash').pp, 15);
		assert.match(Dex.abilities.get('download').desc, /Once per battle/);
		assert.match(Dex.abilities.get('defragment').desc, /Once per battle/);
		assert.equal(Dex.species.get('infernape').abilities[0], 'Opportunist');
		assert(!Dex.getAbilityEffects('burningspirit').has('opportunist'));
		assert(Dex.getAbilityEffects('insight').has('ultrainstinct'));
		assert(!Dex.getAbilityEffects('starlens').has('relicbeam'));
		const learnsets = require('../play.pokemonshowdown.com/data/learnsets.js').BattleLearnsets;
		assert(!learnsets.rampardos.learnset.accelerock);
	});
});
