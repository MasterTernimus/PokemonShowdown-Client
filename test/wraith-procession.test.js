'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const loadDex = require('./helpers/isolated-dex.cjs');

describe('Wraith Procession, Infernal Parade and Moon Veil client parity', () => {
	const context = loadDex(), {Dex} = context;
	it('shows the new hidden ability with existing choices and Blaze intact', () => {
		const species = Dex.species.get('Typhlosion-Hisui');
		assert.deepEqual({...species.abilities}, {0: 'Blazing Mane', 1: 'Soul Fire', H: 'Wraith Procession'});
		assert.deepEqual([...species.passives], ['blaze']);
		const ability = Dex.abilities.get('Wraith Procession');
		assert(ability.exists); assert(/second strike dealing 50%/.test(ability.desc));
		assert(/first-strike burn/.test(ability.desc));
		assert(!Dex.getAbilityEffects('wraithprocession').has('supremeoverlord'));
	});
	it('removes Friend Guard from Moon Veil without removing its other components', () => {
		const effects = Dex.getAbilityEffects('moonveil');
		assert(effects.has('pastelveil')); assert(effects.has('mistysurge')); assert(!effects.has('friendguard'));
		assert(!/Friend Guard|25% less damage/.test(Dex.abilities.get('moonveil').desc));
		assert(Dex.abilities.get('friendguard').exists);
	});
	it('updates Infernal Parade text and the actual preview callback', () => {
		const move = Dex.moves.get('infernalparade');
		assert(/Soul Fire does not independently double/.test(move.desc));
		vm.runInContext(fs.readFileSync(path.resolve(__dirname, '../play.pokemonshowdown.com/js/battle-field-rules.js'), 'utf8'), context);
		const callback = context.BattleFieldMoveRules.infernalparade.basePowerCallback;
		const actor = ability => ({hasAbility: input => [].concat(input).includes(ability), status: ''});
		const field = {isTerrain: () => false};
		const user = actor('soulfire'), foe = actor('noability');
		assert.equal(callback.call({field}, user, foe, move), 65);
		foe.status = 'brn'; assert.equal(callback.call({field}, user, foe, move), 130); foe.status = '';
		assert.equal(callback.call({field}, actor('sinisterblaze'), foe, move), 130);
		assert.equal(callback.call({field: {isTerrain: () => true}}, user, foe, move), 130);
	});
});
