'use strict';
const assert = require('assert').strict;
const fs = require('fs'), path = require('path'), vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
const {Dex} = context;
describe('Omen Sight and concise warning displays', () => {
	for (const species of ['Absol', 'Absol-Mega', 'Absol-Mega-Z']) {
		it(species + ' shows the Omen Sight passive', () => {
			assert.deepEqual([...Dex.species.get(species).passives], ['omensight']);
		});
	}
	it('shows the sensing effects and numerical protection without implementation notes', () => {
		for (const id of ['anticipation', 'forewarn', 'omensight']) {
			const ability = Dex.abilities.get(id);
			assert(ability.exists);
			assert(ability.shortDesc.includes('25%'));
			assert(ability.desc.includes('Psychic Terrain'));
			assert(!/Allies are not checked|initial checks|trigger twice|component:|This replaces/.test(ability.desc));
			assert(ability.shortDesc.length <= 100);
		}
		assert(Dex.abilities.get('omensight').desc.includes("each foe's warned moves"));
	});
	it('keeps Magic Bounce on Doom Warning and moves sensing to the passive', () => {
		const ability = Dex.abilities.get('doomwarning');
		assert(ability.shortDesc.includes('Magic Bounce'));
		assert(!/Anticipation|reveals threats/.test(ability.desc + ability.shortDesc));
		assert(Dex.hasAbilityEffect(Dex.species.get('absolmega'), 'magicbounce'));
		assert(Dex.hasAbilityEffect(Dex.species.get('absolmega'), 'forewarn'));
	});
	it('renders the revealed move and records it on the correct opponent', () => {
		const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
		context.BattleText = require(path.join(root, 'data/text.js')).BattleText;
		for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle']) {
			vm.runInContext(fs.readFileSync(path.join(root, 'js', file + '.js'), 'utf8'), context);
		}
		const line = '|-activate|p1a: Absol|passive: Omen Sight|Moonblast|[of] p2a: Mew';
		const {args, kwArgs} = context.BattleTextParser.parseBattleLine(line);
		assert.equal(kwArgs.move, 'Moonblast');
		const parser = new context.BattleTextParser();
		assert(parser.parseArgs(args, kwArgs).includes('Moonblast'));
		const battle = new context.Battle({debug: true, log: ['|init|battle', '|gen|9', '|gametype|singles',
			'|switch|p1a: Absol|Absol, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
		battle.runMinor(args, kwArgs);
		assert(battle.p2.active[0].moveTrack.some(entry => entry[0] === 'Moonblast'));
		battle.destroy();
	});
});
