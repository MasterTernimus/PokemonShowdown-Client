/* global describe, it */
'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path'), crypto = require('crypto'), vm = require('vm'), ts = require('typescript');
const context = require('./helpers/isolated-dex.cjs')();
const Dex = context.Dex;
const toID = context.toID;
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
function storage() {
	const tree = ts.createSourceFile('storage.js', fs.readFileSync(path.join(root, 'js/storage.js'), 'utf8'), ts.ScriptTarget.Latest, true);
	const names = ['setInitialDisguise', 'getInitialDisguiseSlot', 'bindInitialDisguises', 'packTeam', 'fastUnpackTeam', 'packedTeamNames', 'packedTeamIcons'];
	const host = vm.createContext({Storage:{}, Dex, toID});
	for (const statement of tree.statements) if (ts.isExpressionStatement(statement) && ts.isBinaryExpression(statement.expression) && names.includes(statement.expression.left.getText().replace('Storage.', ''))) vm.runInContext(statement.getText(), host);
	return host.Storage;
}
describe('Supplied Poli Rejuv party icons', () => {
	for (const species of ['Politoed', 'Poliwrath']) {
		it(species + ' Rejuv uses the supplied normal/shiny panels across genders and facing directions', () => {
			for (const shiny of [false, true]) for (const gender of ['M', 'F']) for (const left of [false, true]) {
				const css = Dex.getPokemonIcon({species:species + '-Rejuv', shiny, gender}, left);
				assert(css.includes('/sprites/pokemonicons/' + species.toLowerCase() + '-rejuv' + (shiny ? '-shiny' : '') + '.png'), css);
				assert(!css.includes('-sheet.png'));
			}
			assert(Dex.getPokemonIcon(species + '-Rejuv').includes('/pokemonicons/' + species.toLowerCase() + '-rejuv.png'));
		});
		it(species + ' ordinary forms retain their official icons', () => {
			for (const shiny of [false, true]) for (const left of [false, true]) assert(Dex.getPokemonIcon({species, shiny}, left).includes('pokemonicons-official-sheet.png'));
		});
		it(species + ' event preview resolves without changing saved species or ordinary options', () => {
			const set = {species, ability:species === 'Politoed' ? 'Aevian King' : 'Aevian Ascendance', shiny:true}, before = JSON.stringify(set);
			assert(Dex.getPokemonIcon(Dex.getAbilityFormPreviewSet(set)).includes(species.toLowerCase() + '-rejuv-shiny.png'));
			assert.equal(JSON.stringify(set), before);
			assert(Dex.getPokemonIcon(Dex.getAbilityFormPreviewSet({...set, ability:species === 'Politoed' ? 'Zen' : 'Reservoir'})).includes('pokemonicons-official-sheet.png'));
		});
		it(species + ' live form changes use the new icon, with normal fainted treatment', () => {
			const pokemon = {speciesForme:species, shiny:true, fainted:true, volatiles:{formechange:['formechange', species + '-Rejuv']}};
			const css = Dex.getPokemonIcon(pokemon); assert(css.includes(species.toLowerCase() + '-rejuv-shiny.png')); assert(css.includes('opacity:.3'));
			pokemon.volatiles.transform = ['transform']; assert(Dex.getPokemonIcon(pokemon).includes('pokemonicons-official-sheet.png'));
		});
	}
	it('preserves event ability and shiny identity in packed team strips without replacing ordinary icons', () => {
		const S = storage(), set = (species, ability, shiny) => ({species, ability, shiny, moves:['Protect']});
		const html = S.packedTeamIcons(S.packTeam([set('Politoed', 'Aevian King', true), set('Poliwrath', 'Aevian Ascendance', false), set('Politoed', 'Zen', false), set('Poliwrath', 'Reservoir', false)]));
		assert(html.includes('politoed-rejuv-shiny.png')); assert(html.includes('poliwrath-rejuv.png')); assert.equal((html.match(/pokemonicons-official-sheet/g) || []).length, 2);
	});
	it('keeps all four transparent original panel assets at their unscaled size', () => {
		for (const file of ['politoed-rejuv.png', 'politoed-rejuv-shiny.png', 'poliwrath-rejuv.png', 'poliwrath-rejuv-shiny.png']) {
			const full = path.join(root, 'sprites/pokemonicons', file), size = require('image-size')(full); assert.deepEqual([size.width, size.height], [192, 192]);
		}
	});
});
