'use strict';
const assert = require('assert').strict;
const context = require('./helpers/exclusive-move-picker.cjs')();
const {Dex, BattleSearch, MoveSearch} = context;
const DexSearch = require('vm').runInContext('DexSearch', context);

describe('Teambuilder Mega move hints', () => {
	it('omits retired conversions even with the matching Mega Stone', () => {
		for (const [species, item, move] of [['Absol','Absolite','Night Slash'],['Metagross','Metagrossite','Meteor Mash'],['Kangaskhan','Kangaskhanite','Dizzy Punch']]) {
			assert.equal(Dex.getMegaMoveHint(move, {species,item}), '');
		}
	});
	it('discovers the legal base move with an empty search and equips it on a new set', () => {
		const set = {species: 'Beedrill', moves: []};
		const format = 'gen9doublesrockyfield';
		const rows = new MoveSearch('move', format, set).getBaseResults();
		const header = rows.findIndex(row => row[0] === 'header' && row[1] === 'Mega signature moves');
		assert(header >= 0 && rows[header + 1][1] === 'twineedle');
		assert.equal(rows.filter(row => row[0] === 'move' && row[1] === 'twineedle').length, 1);
		DexSearch.equipNewSetMegaMove(set, format, Dex);
		assert.deepEqual(set.moves, ['Twineedle']);
		set.moves[0] = 'Protect';
		DexSearch.equipNewSetMegaMove(set, format, Dex);
		assert.deepEqual(set.moves, ['Protect']);
		const effect = Dex.getMegaMoveEffect(Dex.getMegaMovePreview('Twineedle', set).move);
		assert.equal(effect, '25 BP per hit · 100% accuracy · Three drill hits. Each has a 20% chance to poison.');
		assert(Dex.getTeambuilderMoveDisplay(Dex.moves.get('Twineedle'), set).shortDesc.includes(effect));
	});
	it('shows the transformation in search while selecting the original move', () => {
		const row = Object.create(BattleSearch.prototype);
		row.engine = {dex: Dex};
		row.moveDisplaySet = {species: 'Beedrill', moves: ['Twineedle']};
		const move = Dex.moves.get('Twineedle');
		for (const html of [row.renderMoveRow(move, 0, 4), row.renderMoveRowInner(move), row.renderTaggedMoveRow(move, 'Bug')]) {
			assert(html.includes('Mega → Triple Sting'));
			assert(html.includes('data-entry="move|Twineedle"'));
		}
		assert.deepEqual(row.moveDisplaySet.moves, ['Twineedle']);
		assert.equal(Dex.getMegaMoveHint('Pin Missile', row.moveDisplaySet), '');
		assert.equal(Dex.getMegaMoveHint('Twineedle', {species: 'Mew'}), '');
	});

	it('shows each form conversion for its base species and for a preselected Mega', () => {
		for (const [baseMove, forms] of Object.entries(Dex.megaMoveConversions)) {
			for (const [id, signature] of Object.entries(forms)) {
				const mega = Dex.species.get(id).name;
				for (const species of [mega, mega.split('-Mega')[0]]) {
					const item = Dex.species.get(id).requiredItems?.[0] || (/gardevoir/i.test(species) ? 'Gardevoirite' : /gallade/i.test(species) ? 'Galladite' : '');
					const label = id.endsWith('megaz') ? 'Mega Z' : id === 'gardevoirvoidmega' ? 'Void Mega' : 'Mega';
					assert.equal(Dex.getMegaMoveHint(baseMove, {species, item}), label + ' → ' + Dex.moves.get(signature).name, species);
				}
			}
		}
	});

	it('resolves shared stones, distinct Lucarionites, and Aevian-only Injection', () => {
		const options = (species, item) => Array.from(Dex.getStoneMoveOptions({species, item}), row => row.move.name);
		assert.deepEqual(options('Flygon', 'Flygonite'), ['Wing Echo', 'Dune Echo']);
		assert.deepEqual(options('Lucario', 'Lucarionite'), ['Aura Fist']);
		assert.deepEqual(options('Lucario', 'Lucarionite Z'), ['Aura Lance']);
		assert.deepEqual(options('Glimmora-Aevian', 'Glimmoranite'), ['Petal Spike']);
		assert.deepEqual(options('Glimmora', 'Glimmoranite'), []);
		assert.deepEqual(options('Glimmora-Aevian', 'Leftovers'), []);
	});

	it('reveals the three Gardevoirite routes and both Galladite appearances on item selection', () => {
		for (const species of ['Gardevoir', 'Gardevoir-Void', 'Gallade', 'Gallade-Azzy']) {
			const set = {species, moves: ['Protect'], item: 'Leftovers'};
			assert.equal(Dex.getStoneMoveOptions(set).length, 0);
			set.item = species.startsWith('Gallade') ? 'Galladite' : 'Gardevoirite';
			const options = Array.from(Dex.getStoneMoveOptions(set), option => option.move.id);
			assert.deepEqual(options, species.startsWith('Gallade') ? ['saberparry'] : ['guardsong', 'veilslash', 'voidvolley']);
			assert.deepEqual(set.moves, ['Protect']);
		}
	});

	it('distinguishes X and Y when a base Pokémon has multiple Mega forms', () => {
		const set = {species: 'Empoleon', item: ''};
		assert.equal(Dex.getMegaMoveHint('Wave Crash', set), 'Mega X → Crown Crash');
		set.item = 'Empoleonite Y';
		assert.equal(Dex.getMegaMoveHint('Wave Crash', set), '');
		set.item = 'Empoleonite X';
		assert.equal(Dex.getMegaMoveHint('Wave Crash', set), 'Mega X → Crown Crash');
	});
});
