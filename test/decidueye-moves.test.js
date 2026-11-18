'use strict';
const assert=require('assert').strict, fs=require('fs');
require('./battle.test');
global.BattleSearchIndex=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndex;
global.BattleSearchIndexOffset=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexOffset;
global.BattleSearchIndexCount=require('../play.pokemonshowdown.com/data/search-index').BattleSearchIndexCount;
global.BattleTeambuilderTable=require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable;
const {DexSearch}=new Function(fs.readFileSync('play.pokemonshowdown.com/js/battle-dex-search.js','utf8')+'\nreturn {DexSearch};')();
describe('Decidueye move removals and Fallen Star wording',()=>{
	for(const species of ['Rowlet','Dartrix','Decidueye','Decidueye-Alt','Decidueye-Hisui','Decidueye-Hisui-Alt'])it(species+' excludes both removed moves in the picker',()=>{
		const search=new DexSearch();search.setType('move','gen9nofieldsinglesgame',{species,ability:Dex.species.get(species).abilities[0],moves:[]});search.find('');
		const moves=search.results.filter(row=>row[0]==='move').map(row=>row[1]);assert(moves.length>0);assert(!moves.includes('iciclespear'));assert(!moves.includes('spikecannon'));
	});
	it('shows priority wording and omits Skill Link and the hidden Triple Arrows effect',()=>{
		const a=Dex.abilities.get('fallenstar');for(const text of [a.desc,a.shortDesc]){assert(/priority at 1\/4 (?:max )?HP/.test(text));assert(!/Skill Link|\bheals?\b|\brecovery\b/i.test(text));}
		assert.match(a.desc, /\+1 priority/);
		assert.match(a.desc, /Free-for-All, arrows strike one chosen foe twice/i);
		const m=Dex.moves.get('triplearrows');assert(!/Chi Strike|ally crit|raises the critical|user.s side/i.test(m.desc+' '+m.shortDesc));
	});
	it('offers Endure to the six pre-evolutions but excludes it from the twelve final forms', () => {
		const allowed = ['cyndaquil', 'quilava', 'rowlet', 'dartrix', 'oshawott', 'dewott'];
		const removed = ['typhlosion', 'typhlosionalt', 'typhlosionhisui', 'typhlosionmega', 'decidueye', 'decidueyealt',
			'decidueyehisui', 'decidueyehisuialt', 'samurott', 'samurottalt', 'samurotthisui', 'samurotthisuialt'];
		for (const species of [...allowed, ...removed]) {
			const search = new DexSearch();
			search.setType('move', 'gen9nofieldsinglesgame', {species, ability: Dex.species.get(species).abilities[0], moves: []});
			search.find('');
			const moves = search.results.filter(row => row[0] === 'move').map(row => row[1]);
			assert(moves.length, species);
			assert.equal(moves.includes('endure'), allowed.includes(species), species);
		}
	});
});
