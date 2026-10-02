const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');
const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/client-teambuilder.js'), 'utf8');
const methods = source.slice(source.indexOf('\t\trosterExpandedSpecies:'), source.indexOf('\t\tpreviewRosterImport:')) + source.slice(source.indexOf('\t\trosterSpeciesID:'), source.indexOf('\t\trosterQuickChange:'));
const roster = new Function('Dex', 'window', 'toID', 'return ({' + methods + '});')(Dex, {BattlePokedex: require('../play.pokemonshowdown.com/data/pokedex').BattlePokedex}, toID);
describe('Roster list imports', () => {
	it('accepts the Leaf bot export and expands only the matching Mega family', () => {
		assert.deepEqual(roster.parseRosterImport('Charizard\nNinetales-Alola\nLapras-Aevian').species.sort(), ['charizard', 'charizardmegax', 'charizardmegay', 'ninetalesalola', 'laprasaevian'].sort());
		assert(!roster.rosterExpandedSpecies('charizard').includes('charizardmegaxalt'));
		assert(roster.rosterExpandedSpecies('charizardalt').includes('charizardmegaxalt'));
	});
	it('handles comments, CRLF, blank lines, duplicate species and explicit Mega entries', () => {
		const result = roster.parseRosterImport('# My locks\r\n\r\nCharizard\r\nCharizard-Mega-X\r\nCharizard\r\n# comment');
		assert.equal(result.name, 'My locks');
		assert.deepEqual(result.species.sort(), ['charizard', 'charizardmegax', 'charizardmegay'].sort());
		assert.deepEqual(result.unknown, []);
	});
	it('reports unknown names without converting them into entries', () => {
		const result = roster.parseRosterImport('Not A Pokemon\nNot A Pokemon\nPikachu');
		assert.deepEqual(result.unknown, ['Not A Pokemon']);
		assert.deepEqual(result.species, ['pikachu']);
	});
});
