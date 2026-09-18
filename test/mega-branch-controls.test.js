const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync(require('path').join(__dirname, '../play.pokemonshowdown.com/js/client-battle.js'), 'utf8');
const controls = source.slice(source.indexOf('\t\t\tvar pokemon = switchables[pos]'), source.indexOf('\t\t\tthis.finalDecisionMove = curActive.maybeDisabled'));

function renderOptions(species, canMegaEvoX) {
	const context = {switchables: [{species, item: 'Banettite'}], pos: 0,
		curActive: {canMegaEvoX, moves: []}, canMegaEvo: species === 'Banette',
		toID: value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')};
	vm.runInNewContext(controls, context);
	return context;
}

describe('Banette branching Mega controls', () => {
	it('shows the server-authorized Z branch beside regular Mega Evolution', () => {
		const options = renderOptions('Banette', true);
		assert.equal(options.canMegaEvoX, true);
		assert.equal(options.megaLabel, 'Banette-Mega');
		assert.equal(options.megaXLabel, 'Banette-Mega-Z');
	});
	it('does not invent an alternate branch absent from the server request', () => {
		assert(!renderOptions('Banette', false).canMegaEvoX);
		assert(!renderOptions('Banette-Mega', false).canMegaEvoX);
	});
});
