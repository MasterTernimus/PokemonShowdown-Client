/* global describe, it, Dex */
'use strict';
const assert = require('assert').strict;
require('./battle.test');
describe('Approved Fire Mane, Aqua Shell and Corona Furnace metadata', () => {
	it('keeps Fire Mane Fire-only and Blazing Mane free of extra-hit components', () => {
		assert(Dex.abilities.get('firemane').desc.includes('effective Fire'));
		assert(Dex.getAbilityEffects('blazingmane').has('firemane'));
		assert(!Dex.getAbilityEffects('blazingmane').has('proficient'));
		assert(Dex.abilities.get('blazingmane').desc.includes('1/4'));
	});
	it('gives regular Mega Golisopod Heatproof/Frisk with Tough Claws separately', () => {
		const s = Dex.species.get('golisopodmega'); assert.equal(s.abilities[0], 'Aqua Shell'); assert.deepEqual(s.passives, ['toughclaws']);
		const effects = Dex.getAbilityEffects('aquashell'); for (const id of ['heatproof', 'frisk']) assert(effects.has(id));
		for (const id of ['steadfast', 'waterveil', 'innerfocus']) assert(!effects.has(id), id);
		assert(Dex.abilities.get('aquashell').desc.includes('30%'));
	});
	it('publishes Fire/Electric Plasma Eruption with unchanged Mega stats/passive', () => {
		const s = Dex.species.get('typhlosionmega'); assert.deepEqual(s.types, ['Fire', 'Electric']); assert.deepEqual(s.abilities, {0:'Plasma Eruption'}); assert.deepEqual(s.passives, ['proficient']);
		assert.deepEqual(s.baseStats, {hp:83, atk:138, def:85, spa:139, spd:70, spe:130});
		const effects = Dex.getAbilityEffects('coronafurnace'); assert(effects.has('flamebody')); assert(!effects.has('moldbreaker')); assert(Dex.abilities.get('coronafurnace').desc.includes('Negative stages'));
	});
	it('uses shared Shed Skin recovery for Scrafty without changing its kit', () => {
		assert.equal(Dex.species.get('scrafty').abilities[0], 'Shed Skin');
		assert.deepEqual(Dex.species.get('scrafty').passives, ['rivalry']);
		assert.equal(Dex.species.get('scraftymega').abilities[0], 'Street Tyrant');
		assert.deepEqual(Dex.species.get('scraftymega').passives, ['shedskin']);
		for (const id of ['shedskin', 'streettyrant']) {
			assert(Dex.abilities.get('shedskin').desc.includes('1/4 max HP'));
			if (id === 'streettyrant') {assert(!Dex.getAbilityEffects(id).has('shedskin'));assert.deepEqual(Dex.species.get('scraftymega').passives,['shedskin']);}
			assert(!/Scrafty.*1\/8/.test(Dex.abilities.get(id).desc + Dex.abilities.get(id).shortDesc));
		}
	});

});
