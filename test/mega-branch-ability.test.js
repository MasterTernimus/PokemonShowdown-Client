'use strict';
const assert = require('assert').strict;
require('./battle.test');

describe('Mega branch ability identity', () => {
	for (const [base, forme, stone] of [
		['Garchomp', 'Garchomp-Mega-Z', 'Garchompite'],
		['Garchomp', 'Garchomp-Mega', 'Garchompite'],
		['Garchomp', 'Garchomp-Mega-Z', 'Garchompite Z'],
		['Gardevoir', 'Gardevoir-Mega-Z', 'Gardevoirite'],
		['Charizard', 'Charizard-Mega-X', 'Charizardite X'],
	]) it(`${forme} retains the confirmed form's ability with ${stone}`, () => {
		const battle = new Battle({debug: true, log: [
			'|init|battle', '|gen|9', '|gametype|singles', '|start',
			`|switch|p1a: Holder|${base}, L100|100/100`,
			`|detailschange|p1a: Holder|${forme}, L100`,
			`|-mega|p1a: Holder|${base}|${stone}`,
		]});
		try {
			for (let i = 0; i < 2; i++) {
				battle.seekTurn(Infinity);
				const pokemon = battle.p1.active[0];
				assert.equal(pokemon.speciesForme, forme);
				assert.equal(pokemon.ability, Dex.species.get(forme).abilities[0]);
				assert.notEqual(pokemon.ability, 'No Ability');
				if (!i) battle.seekTurn(0);
			}
		} finally { battle.destroy(); }
	});
	it('retains a known form when an old replay omits the stone', () => {
		const battle = new Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
			'|switch|p1a: Holder|Garchomp, L100|100/100',
			'|detailschange|p1a: Holder|Garchomp-Mega-Z, L100', '|-mega|p1a: Holder|Garchomp|']});
		try { battle.seekTurn(Infinity); assert.equal(battle.p1.active[0].ability, 'Relentless Hunt'); }
		finally { battle.destroy(); }
	});
});

describe('Updated local roster displays', () => {
	it('shows Deso forms with base mechanics while retaining separate artwork identities', () => {
		for (const [skinId, baseId] of [['mightyenadeso', 'mightyena'], ['toxicroakdeso', 'toxicroak'],
			['cinccinodeso', 'cinccino'], ['samurottalt', 'samurott']]) {
			const skin = Dex.species.get(skinId), base = Dex.species.get(baseId);
			assert.notEqual(skin.id, base.id); assert(skin.isCosmeticForme);
			for (const key of ['abilities', 'types', 'baseStats', 'passives']) assert.deepEqual(skin[key], base[key], skinId + '/' + key);
		}
	});
	it('shows Centiskorch’s selectable abilities and its separate passive', () => {
		const base = Dex.species.get('Centiskorch');
		assert.deepEqual(base.abilities, {0: 'Coil Up', 1: 'White Smoke', H: 'Flame Body'});
		assert.deepEqual(base.passives, ['flashfire']);
		assert(Dex.abilities.get('coilup').desc.includes('Once per switch-in'));
		assert(Dex.getAbilityDisplayComponents('heatcoil', Dex, ['flamebody'], 'centiskorchgmax').includes('magmaarmor'));
	});
	it('shows the Lumineon swap on the ordinary and alternate forms', () => {
		for (const species of ['Lumineon', 'Lumineon-Alt']) {
			const data = Dex.species.get(species);
			assert.deepEqual(data.passives, ['stormdrain']);
			assert.equal(data.abilities[1], 'Swift Swim');
		}
	});
	it('describes Sawsbuck without the removed kicking bonus and revival with retained forms', () => {
		assert(!/kicks|kicking|Striker/i.test(Dex.abilities.get('seasonalstride').desc));
		assert(Dex.moves.get('revivalblessing').desc.includes('Keeps its Mega, Gmax or Battle Bond form'));
	});
});
