'use strict';
const assert = require('assert').strict, fs = require('fs'), path = require('path');
require('./battle.test');
const { BattleAbilitySearch } = new Function(fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-dex-search.js'), 'utf8') + '\nreturn {BattleAbilitySearch};')();
describe('Approved event, Relic Armor and Pulse client parity', () => {
    for (const [id, slot, ability] of [['bewear', 'S', 'multipulse'], ['primarina', 'S', 'aquabatics'], ['toxtricityaevian', 'S', 'feverpitch'], ['electivire', 'S', 'thunderraid'], ['torterra', 'S', 'desertsmark'], ['metagross', 'S', 'superumdmove'], ['duraludon', 'S', 'superumdmove'], ['lucario', 'S', 'galestrike'], ['dusclops', 'S', 'spectralscream'], ['chandelure', 'E', 'spectralscream'], ['mismagius', 'S', 'spectralscream'], ['araquanid', 'S', 'barbedweb'], ['walrein', 'S', 'coldtruth'], ['medicham', 'S', 'bunrakubeatdown'], ['meowsticf', 'S', 'bunrakubeatdown'], ['aerodactyl', 'S', 'matrixshot'], ['alakazam', 'S', 'pyrokinesis'], ['delphox', 'S', 'pyrokinesis'], ['seviper', 'S', 'venamskiss'], ['pidgeot', 'S', 'heavenlywing']])
        it(id + ' exposes its event alternative in the actual selector', () => {
            const a = Dex.abilities.get(ability);
            assert.equal(Dex.species.get(id).abilities[slot], a.name);
            assert(a.desc.length > 40);
            assert(a.shortDesc.length < 160);
            const rows = BattleAbilitySearch.prototype.getBaseResults.call({ dex: Dex, species: id, format: 'gen9nofieldsinglesgame' });
            assert(rows.some(r => r[0] === 'header' && r[1] === 'Special Event Abilities'));
            assert(rows.some(r => r[0] === 'ability' && r[1] === ability));
        });
    it('Chandelure keeps Soul Fire and both event alternatives', () => {
        const rows = BattleAbilitySearch.prototype.getBaseResults.call({ dex: Dex, species: 'chandelure', format: 'gen9nofieldsinglesgame' });
        assert(rows.some(r => r[1] === 'soulfire'));
        assert(rows.some(r => r[1] === 'spectralscream'));
    });
    for (const id of ['laprasaevian', 'omastar', 'kabutops', 'aerodactyl', 'cradily', 'armaldo', 'relicanth', 'rampardos', 'bastiodon', 'carracosta', 'tyrantrum', 'aurorus', 'aerodactylmega', 'tyrantrummega', 'aurorusmega'])
        it(id + ' exposes Relic Armor as a passive without a selectable duplicate', () => {
            const s = Dex.species.get(id);
            assert.deepEqual(s.passives, ['relicarmor']);
            assert(!Object.values(s.abilities).includes('Relic Armor'));
            assert(Dex.hasAbilityEffect(s, 'relicarmor'));
        });
    for (const id of ['apexpredator', 'tyrantdomain', 'auroradomain'])
        it(id + ' excludes migrated components from Includes', () => {
            assert(!Dex.getAbilityDisplayComponents(id).some(p => ['relicarmor', 'selfsufficient'].includes(p)));
        });
    it('regular Deep Chill keeps Oblivious with the new physical-hit Speed effect', () => {
        const a = Dex.abilities.get('deepchill');
        assert(Dex.getAbilityEffects(a.id).has('oblivious'));
        assert(a.desc.includes('Physical'));
        assert(!a.desc.includes('Torment'));
    });
    for (const id of ['nightmarepulse', 'pulsewaste', 'pulsefiltration', 'pulseblockade', 'pulsetriad', 'pulsebulwark', 'pulseeruption'])
        it(id + ' advertises exactly three turns without Amplifield extension', () => {
            const a = Dex.abilities.get(id);
            assert(a.desc.includes('exactly 3 turns'));
            assert(!/5 turns|5-turn|five turns/.test(a.desc));
        });
    it('contains both settled fossil replacements and approved base-Venusaur Uproot', () => {
        assert.equal(Dex.species.get('armaldo').abilities[0], 'Grappling Claws');
        assert.equal(Dex.species.get('carracosta').abilities[0], 'Dredger');
        assert.equal(Dex.species.get('venusaur').abilities.S,'Uproot');
    });
});
