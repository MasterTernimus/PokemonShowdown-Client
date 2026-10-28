'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');
describe('Approved Rejuv passive displays', () => {
	const {Dex} = loadDex();
	const expected = {
		parasectrejuv: 'mycelialbond', poliwrathrejuv: 'innerfocus', politoedrejuv: 'royalremedy',
		donphanrejuv: 'heatproof', breloomrejuv: 'owntempo', bronzongrejuv: 'clearbody',
		drapionrejuv: 'stickyhold', musharnarejuv: 'synchronize', unfezantrejuv: 'rivalry',
		sigilyphrejuv: 'frisk', galvantularejuv: 'compoundeyes', druddigonrejuv: 'raindish',
		turtonatorrejuv: 'oblivious', veluzarejuv: 'unnerve',
	};
	for (const [id, passive] of Object.entries(expected)) it(`shows ${passive} for ${id}`, () => {
		const species = Dex.species.get(id);
		assert(species.exists);
		assert.deepEqual([...species.passives], [passive]);
		assert(Dex.abilities.get(passive).exists);
	});
	it('shows Royal Remedy and its full component rules', () => {
		const ability = Dex.abilities.get('royalremedy');
		assert.equal(ability.name, 'Royal Remedy');
		assert.equal(ability.shortDesc, 'Natural Cure + Healer.');
		assert(/1\/8/.test(ability.desc)); assert(/30%/.test(ability.desc));
		assert(/Bewitched Woods/.test(ability.desc));
		const effects = Dex.getPassiveAbilityEffects('royalremedy');
		assert(effects.has('naturalcure')); assert(effects.has('healer'));
	});
	it('preserves the ordinary forms’ passives', () => {
		for (const [id, passive] of Object.entries({parasect: 'mycelialbond', poliwrath: 'tirelessmuscle', politoed: 'oraclesrefrain', donphan: 'battlearmor', breloom: 'effectspore', bronzong: 'clearbody', drapion: 'keeneye', musharna: 'owntempo', unfezant: 'rivalry', sigilyph: 'anticipation', galvantula: 'compoundeyes', druddigon: 'roughskin', turtonator: 'aftermath', veluza: 'keeneye'})) {
			assert.deepEqual([...Dex.species.get(id).passives], [passive], id);
		}
	});
});
