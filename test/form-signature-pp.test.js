'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const context = require('./helpers/isolated-dex.cjs')();
for (const file of ['battle-scene-stub', 'battle-text-parser', 'battle']) {
	vm.runInContext(fs.readFileSync('play.pokemonshowdown.com/js/' + file + '.js', 'utf8'), context);
}
const formerNames = vm.runInContext('FORMER_FORM_MOVES', context);
const Battle = vm.runInContext('Battle', context);
describe('Form signature replay PP', () => {
	for (const [form, base, variant] of [
		['Victreebel-Mega','Power Whip','Snare Vine'],
		['Golisopod-Mega','First Impression','F.M. Impression'],
		['Golisopod-Aevian-Mega','First Impression','F.M. Impression'],
		['Skarmory-Mega','Steel Wing','Gilded Wing'],
		['Empoleon-Mega-X','Wave Crash','Crown Crash'],
		['Arcanine-Battle-Bond','Extreme Speed','Sacred Rush'],
		['Garchomp-Battle-Bond','Dual Chop','Apex Cleave'],
		['Greninja-Ash','Water Shuriken','Shadow Shuriken'],
		['Feraligatr-Mega','Riptide Fang','Crush Bite'],
		['Sharpedo-Mega','Riptide Fang','Razor Bite'],
		['Ledian-Mega','Carapace Jab','Comet Jab'],
		["ampharos-Mega","Discharge","Beacon Beam"],
		["banette-Mega","Shadow Claw","Hex Stitch"],
		["altaria-Mega","Dragon Pulse","Cloud Song"],
		["lopunny-Mega","Jump Kick","Pivot Kick"],
		["sableye-Mega","Power Gem","Greed Gospel"],
		["camerupt-Mega","Lava Plume","Crater Burst"],
		["aggron-Mega","Heavy Slam","Armor Slam"],
		["audino-Mega","Heal Bell","Pulse Chime"],
		["steelix-Mega","Iron Tail","Anchor Slam"],
		["beedrill-Mega","Twineedle","Triple Sting"],
		["aerodactyl-Mega","Stone Edge","Talon Dive"],
		["houndoom-Mega","Dark Pulse","Dread Howl"],
		["manectric-Mega","Volt Switch","Bolt Dash"],
		["pidgeot-Mega","Air Slash","Gale Slice"],
		['Gallade-Mega','Psycho Cut','Saber Parry'],
		['Gallade-Mega-Azzy','Psycho Cut','Saber Parry'],
		['Gardevoir-Mega','Hyper Voice','Guard Song'],
		['Gardevoir-Mega-Alt','Hyper Voice','Guard Song'],
		['Gardevoir-Mega-Z','Slash','Veil Slash'],
		['Gardevoir-Void-Mega','Swift','Void Volley'],
		['Mawile-Mega','Play Rough','False Smile'],
		['Absol-Mega','Night Slash','Omen Slash'],
		['Kangaskhan-Mega','Dizzy Punch','Pouch Punch'],
		['Metagross-Mega','Meteor Mash','Quad Press'],
		['Scizor-Mega','Bullet Punch','Pincer Jab'],
		...require('../server-data-sync-manifest.json').snapshot.stoneMoveRoutes.map(route => [
			context.Dex.species.get(route.form).name, context.Dex.moves.get(route.base).name, context.Dex.moves.get(route.move).name,
		]),
	]) it(variant+' shares the original PP tracker', () => {
		const battle = new Battle({log:['|init|battle','|gen|9','|switch|p1a: User|'+form+', L100|100/100','|switch|p2a: Foe|Mew, L100|100/100']});
		try {
			battle.seekTurn(Infinity);
			const user = battle.p1.active[0];
			user.rememberMove(base,1);
			user.rememberMove(variant,1);
			const previousNames = Object.keys(formerNames).filter(id => formerNames[id] === context.Dex.moves.get(variant).id);
			// The original signatures (through number 32814) all shipped under two earlier names.
			if (context.Dex.moves.get(variant).num <= 32814) assert(previousNames.length >= 2, variant);
			for (const former of previousNames) user.rememberMove(former,1);
			assert.equal(user.moveTrack.length,1);
			assert.equal(user.moveTrack[0][0],base);
			assert.equal(user.moveTrack[0][1],2 + previousNames.length);
			assert(context.Dex.moves.get(variant).exists);
		} finally { battle.destroy(); }
	});
});
