/* global describe, it, Dex, Battle, toID, BattleStatNames, BattleStatIDs */
'use strict';
const assert = require('assert').strict, fs = require('fs'), ts = require('typescript'), vm = require('vm');
require('./battle.test');
function storage() {
	const source = fs.readFileSync('play.pokemonshowdown.com/js/storage.js', 'utf8');
	const tree = ts.createSourceFile('storage.js', source, ts.ScriptTarget.Latest, true);
	const names = ['setInitialDisguise', 'getInitialDisguiseSlot', 'bindInitialDisguises', 'packTeam', 'fastUnpackTeam', 'unpackTeam', 'importTeam', 'exportTeam'];
	const context = vm.createContext({Storage:{}, Dex, toID, BattleStatNames:{hp:'HP', atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'}, BattleStatIDs:{HP:'hp', Atk:'atk', Def:'def', SpA:'spa', SpD:'spd', Spe:'spe'}, $:{trim:s => s.trim()}});
	for (const statement of tree.statements) if (ts.isExpressionStatement(statement) && ts.isBinaryExpression(statement.expression) && names.includes(statement.expression.left.getText().replace('Storage.', ''))) vm.runInContext(statement.getText(), context);
	return context.Storage;
}
const make = () => [{species:'Zorua', ability:'Illusion', moves:['Splash'], initialDisguise:2}, {species:'Pikachu', name:'Sparky', ability:'Static', moves:['Splash']}, {species:'Charizard', ability:'Blaze', moves:['Splash']}];
describe('Initial disguise client persistence', () => {
	it('round trips packed and text exports without adding fields to default teams', () => {
		const S = storage(), team = make(), packed = S.packTeam(team);
		assert.equal(S.unpackTeam(packed)[0].initialDisguise, 2);
		assert.equal(S.fastUnpackTeam(packed)[0].initialDisguise, 2);
		const text = S.exportTeam(team, 9); assert(text.includes('Initial Disguise: 2'));
		assert.equal(S.importTeam(text)[0].initialDisguise, 2);
		const legacy = [{species:'Pikachu', ability:'Static', moves:['Splash']}];
		assert(!S.packTeam(legacy).includes('undefined')); assert(!S.exportTeam(legacy, 9).includes('Initial Disguise'));
	});
	it('follows teammate identity through repeated reorder, rename, save and reload', () => {
		const S = storage(), team = S.unpackTeam(S.packTeam(make())), holder = team[0], target = team[1];
		team.splice(1, 1); team.push(target); target.name = 'New name';
		assert.equal(S.getInitialDisguiseSlot(holder, team), 3);
		const restored = S.unpackTeam(S.packTeam(team)); assert.equal(restored[0].initialDisguise, 3);
		assert.equal(restored[2].name, 'New name');
		team.unshift(team.pop()); assert.equal(S.getInitialDisguiseSlot(holder, team), 1);
		assert(!JSON.stringify(team).includes('_initialDisguiseTarget'));
	});
	it('does not retarget a removed teammate to its replacement or another equal name', () => {
		const S = storage(), team = S.unpackTeam(S.packTeam(make())), holder = team[0];
		team.splice(1, 1, {...team[1]});
		assert.equal(S.getInitialDisguiseSlot(holder, team), undefined);
		assert.equal(S.unpackTeam(S.packTeam(team))[0].initialDisguise, undefined);
	});
	it('supports explicit Auto, rejects self and keeps duplicate-name teammates distinct', () => {
		const S = storage(), team = make(); team[2].name = 'Sparky'; S.bindInitialDisguises(team);
		S.setInitialDisguise(team[0], team, 3); assert.equal(S.getInitialDisguiseSlot(team[0], team), 3);
		S.setInitialDisguise(team[0], team, 0); assert.equal(S.getInitialDisguiseSlot(team[0], team), undefined);
		S.setInitialDisguise(team[0], team, 1); assert.equal(S.getInitialDisguiseSlot(team[0], team), undefined);
	});
	it('clears owner-only current disguise on public reveal and switch, on either side', () => {
		for (const side of ['p1', 'p2']) {
			const b = new Battle({debug:true, log:['|init|battle', '|gen|9', '|gametype|singles', '|switch|p1a: Mew|Mew, L100|100/100', '|switch|p2a: Mew|Mew, L100|100/100']});
			b.mySide = b.getSide(side); b.myPokemon = [{disguise:{name:'Sparky', species:'Pikachu', mode:'illusion'}}];
			b.runMajor(['replace', side + 'a: Fox', 'Zorua, L100', '100/100'], {}); assert(!b.myPokemon[0].disguise);
			b.myPokemon[0].disguise = {name:'Sparky'}; b.runMajor(['switch', side + 'a: Mew', 'Mew, L100', '100/100'], {}); assert(!b.myPokemon[0].disguise);
			b.destroy();
		}
	});
});
