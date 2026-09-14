'use strict';
require('./test-lapras-aevian-gmax.cjs');
const assert = require('assert').strict;
let checked = 0;
for (const raw of Object.values(BattlePokedex)) {
	if (!raw.name?.includes('Aevian')) continue;
	const species = Dex.species.get(raw.name);
	if (species.battleOnly || species.requiredItem || species.requiredItems?.length || /Mega|Gmax/.test(species.forme)) continue;
	assert.notEqual(species.tier, 'Illegal', species.name);
	assert(species.abilities[0], species.name);
	checked++;
}
assert(checked >= 10);
for (const name of ['Kommo-o-Aevian', 'Musharna']) {
	assert.notEqual(Dex.species.get(name).tier, 'Illegal', name);
}
assert(BattleTeambuilderTable.learnsets.kommooaevian.vileassault);
console.log(`PASS: ${checked} selectable Aevian profiles, Musharna, and Kommo-o's Vile Assault.`);
