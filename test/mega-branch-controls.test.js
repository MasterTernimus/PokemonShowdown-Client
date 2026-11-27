const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync(require('path').join(__dirname, '../play.pokemonshowdown.com/js/client-battle.js'), 'utf8');
const controls = source.slice(source.indexOf('\t\t\tvar pokemon = switchables[pos]'), source.indexOf('\t\t\tthis.finalDecisionMove = curActive.maybeDisabled'));

function renderOptions(species, canMegaEvoX, item = 'Banettite', canMegaEvoY = false, Dex) {
	const context = {switchables: [{species, item}], pos: 0,
		curActive: {canMegaEvoX, canMegaEvoY, moves: []}, canMegaEvo: species === 'Banette', Dex,
		toID: value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')};
	vm.runInNewContext(controls, context);
	return context;
}

describe('Shared Mega Y controls', () => {
	const {Dex} = require('./helpers/isolated-dex.cjs')();
	for (const [species, item, primary, alternate] of [
		['Meganium', 'Meganiumite', 'Meganium-Mega', 'Meganium-Mega-Y'],
		['Torterra', 'Torterranite', 'Torterra-Mega-X', 'Torterra-Mega-Y'],
		['Chimecho', 'Chimechite', 'Chimecho-Mega', 'Chimecho-Mega-Y'],
	]) it(species + ' labels each authorized form, including a return from the alternate', () => {
		assert(!renderOptions(species, false, item, false, Dex).canMegaEvoY);
		const options = renderOptions(species, false, item, true, Dex);
		assert.equal(options.megaLabel, primary);
		assert.equal(options.megaYLabel, alternate);
		assert.equal(renderOptions(alternate, false, item, true, Dex).megaYLabel, primary);
	});
});

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

describe('Garchompite branching Mega controls', () => {
	it('prefers the request destinations, including an occupied Battle Bond form', () => {
		const {Dex} = require('./helpers/isolated-dex.cjs')();
		const forms = {mega: 'Garchomp-Mega', megax: 'Garchomp-Mega-Z'};
		assert.deepEqual(Dex.getBattleMegaForms({megaForms:forms}, 'Garchomp-Battle-Bond', 'Garchompite'), forms);
		assert.deepEqual(Dex.getBattleMegaForms({megaForms:{mega:'Garchomp-Mega-Z'}}, 'Garchomp', 'Garchompite Z'),
			{mega:'Garchomp-Mega-Z'});
		assert.equal(Dex.getPendingMegaMove(forms.mega, 'dualchop', 'Apex Cleave').name, 'Dual Chop');
		assert.equal(Dex.getPendingMegaMove(forms.megax, 'dragonpulse', 'Dragon Pulse').name, 'Sonic Lance');
		assert.equal(Dex.getPendingMegaMove(forms.mega, 'earthquake', 'Earthquake').name, 'Fault Cleave');
	});
	it('maps older boolean requests to known alternate stones, cosmetic forms and Rayquaza', () => {
		const {Dex} = require('./helpers/isolated-dex.cjs')();
		const rows = [
			['Rayquaza','Leftovers','mega','Rayquaza-Mega'], ['Flygon','Flygonite','megax','Flygon-Mega-Z'],
			['Scolipede-Azzy','Scolipite','mega','Scolipede-Mega-Azzy'], ['Gallade-Azzy','Galladite','mega','Gallade-Mega-Azzy'],
			['Alakazam-Alt','Alakazite','mega','Alakazam-Mega-Alt'], ['Charizard-Alt','Charizardite X','mega','Charizard-Mega-X-Alt'],
			['Floette','Floettite','mega','Floette-Mega'], ['Emboar-Mega-Reborn','Emboarite','mega','Emboar-Mega'],
		];
		for (const [species, item, token, form] of rows) {
			const routes = Dex.getBattleMegaForms({canMegaEvo:true, canMegaEvoX:token === 'megax'}, species, item);
			assert.equal(routes[token], form, species);
		}
	});
	it('equips the shared stone when adding the Z form in the teambuilder', () => {
		const source = fs.readFileSync(require('path').join(__dirname, '../play.pokemonshowdown.com/js/client-teambuilder.js'), 'utf8');
		const start = source.indexOf("\t\t\tif (!(this.curTeam.format.includes('hackmons')");
		const code = source.slice(start, source.indexOf('\t\t\tapplySilvallyVariant', start));
		const species = require('./helpers/isolated-dex.cjs')().Dex.species.get('Garchomp-Mega-Z');
		const context = {species, set: {}, curTeam: {format: 'gen9dragonsden'}};
		vm.runInNewContext(code, context);
		assert.equal(context.set.item, 'Garchompite');
		assert.deepEqual([...species.requiredItems], ['Garchompite', 'Garchompite Z']);
	});
	it('labels the regular and Z branches authorized by the server', () => {
		const options = renderOptions('Garchomp', true, 'Garchompite');
		assert.equal(options.canMegaEvoX, true);
		assert.equal(options.megaLabel, 'Garchomp-Mega');
		assert.equal(options.megaXLabel, 'Garchomp-Mega-Z');
	});
	it('does not show an unauthorized Z branch on an older server', () => {
		assert(!renderOptions('Garchomp', false, 'Garchompite').canMegaEvoX);
	});
});
