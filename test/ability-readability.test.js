'use strict';
const assert = require('assert').strict;
const loadDex = require('./helpers/isolated-dex.cjs');
describe('Concise ability displays', () => {
	const {Dex} = loadDex();
	it('shows concise summaries and keeps full rules for every synced ability', () => {
		const snapshot = require('../server-data-sync-manifest.json').snapshot;
		for (const id of Object.keys(snapshot.abilities)) {
			const ability = Dex.abilities.get(id);
			assert(ability.shortDesc.length > 0 && ability.shortDesc.length <= 100, `${id}: ${ability.shortDesc}`);
			assert.equal(ability.desc, snapshot.abilities[id].desc, id);
		}
	});
	it('removes only redundant leading component labels, independent of their order', () => {
		assert.equal(Dex.getAbilityExtraSummary('Inner Focus + Serene Grace.', ['serenegrace', 'innerfocus']), '');
		assert.equal(Dex.getAbilityExtraSummary('Levitate + Hydra Bond; once per battle heals 1/4 HP.', ['hydrabond', 'levitate']), 'once per battle heals 1/4 HP.');
		assert.equal(Dex.getAbilityExtraSummary('Keen Eye; ignores positive Defense stages.', ['keeneye']), 'ignores positive Defense stages.');
		assert.equal(Dex.getAbilityExtraSummary('Serene Grace on Forest only.', ['serenegrace']), 'Serene Grace on Forest only.');
		assert.equal(Dex.getAbilityExtraSummary('Raises Sp. Atk by 1; heals 1/8 HP.', ['serenegrace']), 'Raises Sp. Atk by 1; heals 1/8 HP.');
	});
});

describe('Current Mega stone choices', () => {
	const {Dex} = loadDex();
	for (const [item, base, mega] of [
		['Lucarionite', 'Lucario', 'Lucario-Mega'],
		['Lucarionite Z', 'Lucario', 'Lucario-Mega-Z'],
		['Hydreigonite', 'Hydreigon', 'Hydreigon-Mega'],
	]) it(`${item} selects ${mega}`, () => {
		const stone = Dex.items.get(item), species = Dex.species.get(mega);
		assert(stone.exists && species.exists);
		assert.equal(stone.megaStone[base], mega);
		assert.deepEqual([...species.requiredItems], [item]);
		assert.notEqual(stone.isNonstandard, 'Future');
	});
	it('never exposes Mega Hydreigon X', () => {
		assert(!Dex.species.get('Hydreigon-Mega-X').exists);
		assert.deepEqual([...Dex.species.get('Hydreigon').otherFormes], ['Hydreigon-Mega']);
		assert.equal(Dex.species.get('Hydreigon').abilities.H, 'False Liberation');
	});
});
