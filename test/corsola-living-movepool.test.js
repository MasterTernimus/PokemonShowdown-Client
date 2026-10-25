/* global describe, it */
'use strict';
const assert = require('assert').strict;
const raw = require('../play.pokemonshowdown.com/data/learnsets').BattleLearnsets;
const encoded = require('../play.pokemonshowdown.com/data/teambuilder-tables').BattleTeambuilderTable.learnsets;
const removed = ['hex', 'nightshade', 'willowisp', 'trickroom', 'shadowball'];

describe('Living Corsola client selection pools', () => {
	for (const id of ['corsola', 'corsolaalt']) {
		it(id + ' removes all five moves from raw and picker data', () => {
			for (const move of removed) {
				assert(!raw[id].learnset[move], id + ': ' + move);
				assert(!encoded[id][move], id + ': ' + move);
			}
		});
		it(id + ' retains established coral support', () => {
			for (const move of ['surf', 'ancientpower', 'confuseray', 'curse']) {
				assert(raw[id].learnset[move], id + ': ' + move);
				assert(encoded[id][move], id + ': ' + move);
			}
		});
	}
	for (const id of ['corsolagalar', 'cursola']) {
		it(id + ' keeps legitimate Ghost-form moves', () => {
			for (const move of removed.filter(move => move !== 'trickroom')) {
				assert(raw[id].learnset[move], id + ': ' + move);
				assert(encoded[id][move], id + ': ' + move);
			}
		});
	}
});
