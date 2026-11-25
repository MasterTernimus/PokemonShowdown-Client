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
		assert.equal(effect, '25 BP per hit · 100% accuracy · Adaptive. Three drill hits. Each has a 20% chance to poison.');
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
				assert.equal(Dex.signatureFieldBases[signature], baseMove, signature);
				const forme = Dex.species.get(id), mega = forme.name;
				const origins = Array.isArray(forme.battleOnly) ? forme.battleOnly : [forme.battleOnly || mega.split('-Mega')[0]];
				for (const species of [mega, ...origins]) {
					const item = Dex.species.get(id).requiredItems?.[0] || (/gardevoir/i.test(species) ? 'Gardevoirite' : /gallade/i.test(species) ? 'Galladite' : '');
					const suffix = /-Mega-([XYZ])(?:-Alt)?$/.exec(mega);
					const label = suffix ? 'Mega ' + suffix[1] : id === 'gardevoirvoidmega' ? 'Void Mega' : 'Mega';
					const hints = Dex.getMegaMoveHint(baseMove, {species, item}).split(' / ');
					assert(hints.includes(label + ' → ' + Dex.moves.get(signature).name), species + ' ' + baseMove);
					if (species === mega) assert.equal(hints.length, 1);
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
		assert.deepEqual(options('Glimmora', 'Glimmoranite'), ['Crystal Spin']);
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

	it('shows every eligible form with a shared stone and only the selected form with a dedicated stone', () => {
		const options = (species, item) => Array.from(Dex.getStoneMoveOptions({species, item}), row => row.move.name).sort();
		for (const [species, item, expected] of [
			['Garchomp', 'Garchompite', ['Fault Cleave', 'Sonic Lance']],
			['Garchomp', 'Garchompite Z', ['Sonic Lance']],
			['Banette', 'Banettite', ['Hex Stitch', 'Puppet Snare']],
			['Sharpedo', 'Sharpedonite', ['Razor Bite', 'Torpedo Jet']],
			['Meganium', 'Meganiumite', ['Flare Cannon', 'Mega Sol Cannon']],
			['Torterra', 'Torterranite', ['Fault Rush', 'Strata Cannon']],
			['Charizard', 'Charizardite X', ['Cinder Rush', 'Corona Flare']],
			['Charizard-Alt', 'Charizardite X', ['Cinder Rush']],
			['Charizard', 'Charizardite Y', ['Cinder Rush', 'Corona Flare']],
			['Charizard-Alt', 'Charizardite Y', ['Corona Flare']],
			['Venusaur', 'Venusaurite', ['Blight Bloom']],
			['Blastoise', 'Blastoisinite', ['Broadside']],
			['Absol', 'Absolite', ['Omen Pulse']],
			['Absol', 'Absolite Z', ['Dread Crescent']],
			['Clawitzer', 'Clawitzerite', ['Tide Mortar']],
			['Raichu', 'Raichunite X', ['Surge Ram']],
			['Raichu', 'Raichunite Y', ['Surge Rail']],
			['Typhlosion-Hisui', 'Typhlosionite', ['Flashpoint Burst']],
			['Typhlosion-Alt', 'Typhlosionite', ['Flashpoint Burst']],
			['Empoleon', 'Empoleonite Y', ['Crest Cannon']],
			['Empoleon', 'Empoleonite X', ['Crown Crash']],
			['Ampharos-Aevian', 'Ampharosite', ['Polar Beacon']],
			['Latias', 'Latiasite', ['Mist Glide']],
			['Latios', 'Latiosite', ['Luster Glide']],
			['Chesnaught', 'Chesnaughtite', ['Bramble Guard']],
			['Delphox', 'Delphoxite', ['Hexfire']],
			['Greninja', 'Greninjite', ['Mist Shuriken']],
		]) {
			assert.deepEqual(options(species, item), expected, species + ' / ' + item);
			assert.deepEqual(options(species, 'Leftovers'), []);
		}
		assert.deepEqual(options('Garchomp-Battle-Bond', 'Garchompite'), []);
		assert.deepEqual(options('Greninja-Ash', 'Greninjite'), []);
		assert.equal(Dex.getMegaMoveHint('Earthquake', {species: 'Garchomp-Battle-Bond', item: 'Garchompite'}), '');
		assert.equal(Dex.getMegaMoveHint('Ice Beam', {species: 'Ampharos', item: 'Ampharosite'}), '');
		assert.equal(Dex.getMegaMoveHint('Water Shuriken', {species: 'Greninja-Ash', item: 'Greninjite'}), '');
		const lance = Dex.getMegaMovePreview('Dragon Pulse', {species: 'Garchomp', item: 'Garchompite Z'}).move;
		assert.equal(lance.basePower, 125);
		assert.match(Dex.getMegaMoveEffect(lance), /125 BP/);
		assert.equal(Dex.moves.get('Dragon Pulse').basePower, 85);
		for (const [oldName, newName] of [
			['Briar Riposte', 'Bramble Guard'], ['Ember Riposte', 'Hexfire'], ['Tide Riposte', 'Mist Shuriken'],
		]) {
			assert.equal(Dex.moves.get(oldName).name, newName);
		}
		for (const [species, item, base] of [
			['Garchomp', 'Garchompite', 'Earthquake'], ['Garchomp', 'Garchompite Z', 'Dragon Pulse'],
			['Banette', 'Banettite', 'Shadow Claw'], ['Sharpedo', 'Sharpedonite', 'Riptide Fang'],
		]) {
			const set = {species, item, moves: []};
			DexSearch.equipNewSetMegaMove(set, 'gen9dragonsden', Dex);
			assert.deepEqual(set.moves, [base]);
		}
		for (const [species, item, base] of [
			['Chesnaught', 'Chesnaughtite', 'Spiky Shield'], ['Delphox', 'Delphoxite', 'Mystical Fire'],
			['Greninja', 'Greninjite', 'Water Shuriken'],
		]) {
			const move = Dex.getMegaMovePreview(base, {species, item}).move;
			assert.equal(Dex.signatureFieldBases[move.id], Dex.moves.get(base).id);
			const details = Dex.getMegaMoveEffect(move, true);
			assert.match(details, /blocking.*damaging/i);
			assert.match(details, /1\.2×/);
			assert.match(details, /switching/i);
			if (base === 'Water Shuriken') {
				assert.match(Dex.getMegaMoveEffect(move), /90 BP on the first hit, then 20/);
				assert.doesNotMatch(details, /20 BP per hit/);
				assert.match(details, /Speed/i);
				assert.doesNotMatch(details, /Spikes/);
			}
		}
	});

	it('shows both Solar Beam branches while equipping just the learned move', () => {
		const set = {species: 'Meganium', item: 'Meganiumite', moves: []};
		const previews = Dex.getStoneMoveOptions(set);
		assert.deepEqual(Array.from(previews, row => [row.base, row.move.type]), [['Solar Beam', 'Grass'], ['Solar Beam', 'Fire']]);
		const description = Dex.getTeambuilderMoveDisplay(Dex.moves.get('Solar Beam'), set).shortDesc;
		assert.match(description, /Mega Sol Cannon/);
		assert.match(description, /Flare Cannon/);
		assert.deepEqual(Array.from(Dex.getMegaMovePreviews('Solar Beam', {species: 'Meganium-Mega-Y'}), r => r.move.type), ['Fire']);
		DexSearch.equipNewSetMegaMove(set, 'gen9nofieldsinglesgame', Dex);
		assert.deepEqual(set.moves, ['Solar Beam']);
		assert.equal(Dex.getMegaMoveHint('Solar Beam', {...set, item: 'Leftovers'}), '');
	});

	it('offers each Water Pulse signature on its own Mega Stone and equips the learned move', () => {
		for (const [species, item, name] of [
			['Blastoise', 'Blastoisinite', 'Broadside'],
			['Milotic', 'Miloticide', 'Soothing Tide'],
			['Clawitzer', 'Clawitzerite', 'Tide Mortar'],
		]) {
			const set = {species, item, moves: []};
			const options = Dex.getMegaMovePreviews('Water Pulse', set);
			assert.deepEqual(Array.from(options, option => option.move.name), [name], species);
			assert.equal(Dex.signatureFieldBases[options[0].move.id], 'waterpulse');
			assert.equal(Dex.getMegaMoveHint('Water Pulse', {...set, item: 'Leftovers'}), '');
			DexSearch.equipNewSetMegaMove(set, 'gen9nofieldsinglesgame', Dex);
			assert.deepEqual(set.moves, ['Water Pulse'], species);
		}
		assert.equal(Dex.getMegaMoveHint('Flash Cannon', {species: 'Blastoise', item: 'Blastoisinite'}), '');
	});

	it('shows the active signature stats and filters by its type when a Mega form is selected directly', () => {
		for (const [species, item, learned, expected, type, power, accuracy] of [
			['Meganium-Mega', '', 'Solar Beam', 'Mega Sol Cannon', 'Grass', 140, 100],
			['Meganium-Mega-Y', 'Meganiumite', 'Solar Beam', 'Flare Cannon', 'Fire', 130, 100],
			['Charizard-Mega-X', '', 'Flare Blitz', 'Cinder Rush', 'Fire', 120, 100],
			['Charizard-Mega-Y', '', 'Heat Wave', 'Corona Flare', 'Fire', 95, 100],
			['Venusaur-Mega', '', 'Sludge Bomb', 'Blight Bloom', 'Poison', 90, 100],
			['Blastoise-Mega', '', 'Water Pulse', 'Broadside', 'Water', 75, 100],
		]) {
			const set = {species, item, moves: [learned]};
			const base = Dex.moves.get(learned);
			const row = Dex.getTeambuilderMoveDisplay(base, set);
			assert.deepEqual([row.name, row.id, row.type, row.basePower, row.accuracy],
				[learned, base.id, type, power, accuracy], species);
			assert.equal(row.shortDesc, Dex.moves.get(expected).shortDesc);
			const search = new MoveSearch('move', 'gen9nofieldsinglesgame', set);
			assert(search.filter(['move', base.id], [['type', type]]));
			if (type !== base.type) assert(!search.filter(['move', base.id], [['type', base.type]]));
		}
		const base = Dex.moves.get('Solar Beam');
		const holdingStone = Dex.getTeambuilderMoveDisplay(base, {species: 'Meganium', item: 'Meganiumite'});
		assert.equal(holdingStone.type, base.type);
		assert.equal(holdingStone.basePower, base.basePower);
	});

	it('discovers and equips the stance cut only when a Samurott selects Shogun Stance', () => {
		const AbilitySearch = require('vm').runInContext('BattleAbilitySearch', context);
		for (const [species, name, type] of [
			['Samurott', 'Cresting Cut', 'Water'], ['Samurott-Alt', 'Cresting Cut', 'Water'],
			['Samurott-Hisui', 'Moonless Cut', 'Water'], ['Samurott-Hisui-Alt', 'Moonless Cut', 'Water'],
		]) {
			const set = {species, ability: 'Shogun Stance', item: 'Leftovers', moves: []};
			const format = 'gen9nofieldsinglesgame';
			const abilities = new AbilitySearch('ability', format, set).getBaseResults();
			const event = abilities.findIndex(row => row[1] === 'Special Event Abilities');
			assert(event >= 0 && abilities[event + 1][1] === 'shogunstance', species);
			assert.equal(Dex.getMegaMoveHint('Razor Shell', set), 'Shogun Stance → ' + name);
			const search = () => new MoveSearch('move', format, set).getBaseResults();
			const rows = search();
			const start = rows.findIndex(row => row[1] === 'Ability signature moves');
			assert(start >= 0);
			assert.equal(rows[start + 1][1], 'razorshell');
			assert.equal(rows.filter(row => row[1] === 'razorshell').length, 1);
			const move = Dex.getTeambuilderMoveDisplay(Dex.moves.get('Razor Shell'), set);
			assert.equal(move.basePower, 85);
			assert.equal(move.type, type);
			const parts = Dex.getAbilityDisplayComponents('shogunstance', Dex, [], species);
			assert.equal(parts.includes('shellarmor'), species.includes('Hisui'));
			assert.equal(Dex.moves.get(name).critRatio, species.includes('Hisui') ? 2 : 1);
			DexSearch.equipNewSetMegaMove(set, format, Dex);
			assert.deepEqual(set.moves, ['Razor Shell']);
			set.moves[0] = 'Protect';
			DexSearch.equipNewSetMegaMove(set, format, Dex);
			assert.deepEqual(set.moves, ['Protect']);
			set.ability = 'Blade Mastery';
			assert.equal(Dex.getMegaMoveHint('Razor Shell', set), '');
			assert(!search().some(row => row[1] === 'Ability signature moves'));
			assert.equal(Dex.getTeambuilderMoveDisplay(Dex.moves.get('Razor Shell'), set).type, 'Water');
		}
	});
	it('distinguishes X and Y when a base Pokémon has multiple Mega forms', () => {
		const set = {species: 'Empoleon', item: ''};
		assert.equal(Dex.getMegaMoveHint('Wave Crash', set), '');
		set.item = 'Empoleonite Y';
		assert.equal(Dex.getMegaMoveHint('Wave Crash', set), '');
		set.item = 'Empoleonite X';
		assert.equal(Dex.getMegaMoveHint('Wave Crash', set), 'Mega X → Crown Crash');
	});

	it('uses the equipped Mega form and spread for adaptive move previews', () => {
		const pulse = Dex.moves.get('dragonpulse');
		const set = {species: 'Garchomp', item: 'Garchompite Z', moves: ['Dragon Pulse']};
		for (const [spread, category] of [[{}, 'Special'], [{evs: {atk: 252}}, 'Physical']]) {
			const selected = {...set, ...spread};
			assert.equal(Dex.getMegaMovePreview(pulse.id, selected).move.category, category);
			assert.equal(Dex.getTeambuilderMoveDisplay(pulse, selected).category, category);
			const search = new MoveSearch('move', 'gen9nofieldsinglesgame', selected);
			assert(search.filter(['move', pulse.id], [['category', category]]));
		}
		assert.equal(Dex.getTeambuilderMoveCategory(pulse, {...set, item: 'Leftovers', evs: {atk: 252}}), 'Special');
		assert.equal(Dex.getMegaMovePreview('Spiky Shield', {species: 'Chesnaught', item: 'Chesnaughtite'}).move.category, 'Status');
		assert.equal(pulse.category, 'Special');
		for (const [name, effect] of [['Leaf Rush', /trapping.*lost speed/i], ['Blaze Rush', /reflect/i], ['Tide Rush', /all entry hazards/i]]) {
			assert.match(Dex.getMegaMoveEffect(Dex.moves.get(name), true), effect);
		}
		for (const [name, power] of [['Comet Jab', 80], ['Gale Slice', 80], ['Veil Slash', 90], ['Dread Howl', 85]]) {
			assert.equal(Dex.moves.get(name).basePower, power, name);
		}
	});
});
