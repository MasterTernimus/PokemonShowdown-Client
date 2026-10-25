'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
require('./battle.test');

describe('Cold Eclipse background and custom Gardevoir routes', () => {
	it('provides a distinct Cold Eclipse style backed by an existing local asset', () => {
		const css = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/style/battle.css'), 'utf8');
		const rule = css.match(/\.coldeclipseterrainweather\s*\{([^}]+)\}/);
		assert(rule, 'Cold Eclipse must have a renderer class');
		assert(rule[1].includes('linear-gradient'));
		const asset = rule[1].match(/url\(\.\.\/([^)]*)\)/)[1];
		assert(fs.statSync(path.join(__dirname, '../play.pokemonshowdown.com', asset)).size > 0);
	});
	for (const field of ['Cold Eclipse Terrain', 'coldeclipseterrain', 'Cold Eclipse terrain']) {
		it(`normalizes and removes ${field} through the public protocol`, () => {
			const battle = new Battle({debug: true});
			try {
				battle.gen = 9;
				battle.runMinor(['-fieldstart', field], {turns: '5'});
				assert(battle.pseudoWeather.some(w => battle.getTerrainId(w[0]) === 'coldeclipseterrain'));
				battle.runMinor(['-fieldend', field], {});
				assert(!battle.pseudoWeather.some(w => battle.getTerrainId(w[0]) === 'coldeclipseterrain'));
			} finally { battle.destroy(); }
		});
	}
	it('shows the actual Void routes instead of assuming baseSpecies equals the selected form', () => {
		assert.deepEqual(Dex.getGardevoirMegaRoutes('Gardevoir-Void', 'Gardevoirite'), {
			mega: 'Gardevoir-Mega-Alt', megax: 'Gardevoir-Mega-Z', megay: 'Gardevoir-Void-Mega',
		});
		assert.deepEqual(Dex.getGardevoirMegaRoutes('Gardevoir-Void', 'Shiny Stone'), {
			mega: 'Gardevoir-Mega-Z', megax: '', megay: '',
		});
		assert.deepEqual(Dex.getGardevoirMegaRoutes('Gardevoir', 'Gardevoirite'), {
			mega: 'Gardevoir-Mega', megax: 'Gardevoir-Mega-Z', megay: 'Gardevoir-Void-Mega',
		});
		assert.equal(Dex.getGardevoirMegaRoutes('Gardevoir-Void', 'Leftovers').mega, '');
		assert.equal(Dex.getGardevoirMegaRoutes('Golisopod-Aevian', 'Golisopite'), null);
	});
	const server = process.env.PS_SERVER_SOURCE;
	(server ? it : it.skip)('matches the authoritative server options for every Gardevoir branch', () => {
		const ServerBattle = require(path.join(server, 'dist/sim')).Battle;
		for (const species of ['Gardevoir', 'Gardevoir-Void', 'Gardevoir-Mega', 'Gardevoir-Mega-Alt', 'Gardevoir-Mega-Z', 'Gardevoir-Void-Mega']) {
			for (const item of ['Gardevoirite', 'Shiny Stone', 'Leftovers']) {
				const battle = new ServerBattle({formatid: 'gen9nofieldsinglesgame'});
				try {
					battle.setPlayer('p1', {name: 'Local', team: [{species, item, moves: ['splash']}]});
					battle.setPlayer('p2', {name: 'Foe', team: [{species: 'Mew', moves: ['splash']}]});
					battle.makeChoices('team 1', 'team 1');
					const p = battle.p1.active[0], routes = Dex.getGardevoirMegaRoutes(species, item);
					assert.equal(routes.mega, battle.actions.canMegaEvo(p) || '', `${species} / ${item}: primary`);
					assert.equal(routes.megax, battle.actions.canMegaEvoX(p) || '', `${species} / ${item}: X`);
					assert.equal(routes.megay, battle.actions.canMegaEvoY(p) || '', `${species} / ${item}: Y`);
				} finally { battle.destroy(); }
			}
		}
	});
});
