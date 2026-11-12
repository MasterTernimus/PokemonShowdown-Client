const assert = require('assert').strict;
require('./battle.test');

describe('Johto Mega Eruption displays', () => {
	for (const [species, name, id, components] of [
		['Meganium-Mega', 'Verdant Eruption', 'bloomingsun', ['megasol', 'flowerveil']],
		['Meganium-Mega-Y', 'Solar Eruption', 'solareruption', ['megasol', 'flamebody']],
		['Feraligatr-Mega', 'Tidal Eruption', 'draconicforce', ['dragonize', 'strongjaw', 'moldbreaker']],
	]) {
		it(`${species} shows its matching name and components`, () => {
			const mon = Dex.species.get(species);
			assert.equal(mon.abilities[0], name);
			assert.equal(Dex.abilities.get(name).id, id);
			assert.equal(Dex.abilities.get(id).name, name);
			assert.deepEqual([...Dex.getAbilityDisplayComponents(id, Dex, mon.passives, mon.id)], components);
		});
	}
	it('describes the new bonuses without sharing the two Meganium descriptions', () => {
		assert.match(Dex.abilities.get('Verdant Eruption').desc, /adjacent allies.*once per turn/);
		assert.match(Dex.abilities.get('Solar Eruption').desc, /Once per entry.*after the attack finishes/);
		assert.equal(Dex.abilities.get('Blooming Sun').name, 'Verdant Eruption');
		assert.equal(Dex.abilities.get('Draconic Force').name, 'Tidal Eruption');
	});
});
