const fs = require('fs'), vm = require('vm'), path = require('path');
module.exports = function () {
	const context = require('./isolated-dex.cjs')();
	context.BattleTeambuilderTable = JSON.parse(JSON.stringify(require('../../play.pokemonshowdown.com/data/teambuilder-tables.js').BattleTeambuilderTable));
	for (let gen = 1; gen <= 9; gen++) {
		const table = context.BattleTeambuilderTable['gen' + gen] = context.BattleTeambuilderTable.gen9natdex;
		for (const key of ['overrideAbilityData', 'overrideItemDesc', 'overrideMoveData', 'overrideSpeciesData', 'overrideTypeChart', 'removeType']) table[key] ||= {};
	}
	context.jQuery = () => {};
	context.BattleLog = {escapeHTML: value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')};
	for (const file of ['battle-dex-search', 'search']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../../play.pokemonshowdown.com/js', file + '.js'), 'utf8'), context);
	context.MoveSearch = vm.runInContext('BattleMoveSearch', context);
	return context;
};
