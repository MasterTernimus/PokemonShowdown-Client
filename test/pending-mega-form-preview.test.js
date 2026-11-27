'use strict';
const assert = require('assert').strict;
const fs = require('fs');
require('./battle.test');
const scripts = 'play.pokemonshowdown.com/js/';
const {BattleTooltips, ModifiableValue} = new Function(
	fs.readFileSync(scripts + 'battle-tooltips.js', 'utf8') + '\nreturn {BattleTooltips, ModifiableValue};'
)();
const Panel = new Function('PSRoom', 'PSRoomPanel', 'ChatRoom', 'PS', 'preact', 'BattleTooltips', 'ModifiableValue',
	fs.readFileSync(scripts + 'panel-battle.js', 'utf8') + '\nreturn BattlePanel;'
)(class {}, class {}, class {}, {roomTypes: {}, updateRoomTypes() {}}, require('preact'), BattleTooltips, ModifiableValue);

describe('Selected Mega battle move previews', () => {
	let battle;
	afterEach(() => battle?.destroy());
	function setup(species) {
		battle = new Battle({debug:true,log:['|init|battle','|gen|9','|gametype|singles',
			'|switch|p1a: Lead|' + species + ', L100|100/100','|switch|p2a: Target|Mew, L100|100/100']});
		const user = battle.p1.active[0];
		const owner = {speciesForme:species,ability:'No Ability',baseAbility:'No Ability',passives:[],moves:[],hp:100,maxhp:100,
			level:100,status:'',item:'',stats:{atk:120,spa:120,def:100,spd:100,spe:100}};
		return {user, owner, foe:battle.p2.active[0]};
	}
	function render(owner, active, current) {
		return Panel.prototype.renderMoveControls.call({props:{room:{battle}}}, {side:{pokemon:[owner]}},
			{index:()=>0,current,currentMoveRequest:()=>active});
	}
	it('flips Garchomp between Battle Bond, normal Mega and Z while keeping the chosen slot', () => {
		const {user,owner} = setup('Garchomp-Battle-Bond');
		user.volatiles.formechange = ['formechange', 'Garchomp-Battle-Bond'];
		owner.moves = ['dualchop','dragonpulse','earthquake'];
		const active = {moves:['Apex Cleave','Dragon Pulse','Earthquake'].map((name,i)=>(
			{name,id:owner.moves[i],pp:3,maxpp:10})),megaForms:{mega:'Garchomp-Mega',megax:'Garchomp-Mega-Z'},
			megaFormStats:{mega:{atk:250,spa:100},megax:{atk:100,spa:260}}};
		const buttons = state => render(owner,active,state);
		const names = state => buttons(state).map(b=>b.children[0]);
		assert.deepEqual(names({}),['Apex Cleave','Dragon Pulse','Earthquake']);
		assert.deepEqual(names({mega:true}),['Dual Chop','Dragon Pulse','Fault Cleave']);
		const z = buttons({megax:true});
		assert.equal(z[1].children[0],'Sonic Lance');
		assert.equal(z[1].attributes.cmd,'/move 2');
		assert.equal(z[1].attributes.moveData.pp,3);
		assert.equal(z[1].attributes.tooltip,'move|Sonic Lance|0||garchompmegaz|100|260');
		const view = BattleTooltips.pendingMegaPokemon(user,owner,active.megaForms.megax,active.megaFormStats.megax);
		const html = new BattleTooltips(battle).showMoveTooltip(Dex.moves.get('soniclance'),'move',view.pokemon,view.serverPokemon);
		assert.match(html,/categories\/Special\.png/);
		assert.equal(user.getSpeciesForme(),'Garchomp-Battle-Bond');
		assert.equal(owner.stats.spa,120);
		assert.deepEqual(names({}),['Apex Cleave','Dragon Pulse','Earthquake']);
	});
	it('uses the private foe memory for a pending Mega Sableye and checks the current matchup', () => {
		global.BattleTypeChart = require('../play.pokemonshowdown.com/data/typechart').BattleTypeChart;
		const {user,owner,foe} = setup('Sableye');
		owner.moves = ['powergem'];
		const active = {moves:[{name:'Power Gem',id:'powergem',pp:4,maxpp:10}],megaForms:{mega:'Sableye-Mega'}};
		const button = () => render(owner,active,{mega:true})[0];
		assert.equal(button().children[0],'Greed Gospel');
		assert.equal(button().attributes.type,'Rock');
		owner.greedGospelTargets = ['p2b'];
		assert.equal(button().attributes.type,'Rock');
		owner.greedGospelTargets = ['p2a'];
		assert.equal(button().attributes.type,'Ghost');
		for (const type of ['Normal','Dark','Fire']) {
			foe.volatiles.typechange = ['typechange',type];
			assert.equal(button().attributes.type,'Rock',type);
		}
		delete foe.volatiles.typechange;
		assert.equal(button().attributes.type,'Ghost');
		assert.equal(render(owner,active,{})[0].children[0],'Power Gem');
		assert.equal(user.getSpeciesForme(),'Sableye');
	});
	it('swaps Meganium’s Solar Beam between its two distinct upgrades in the same move slot', () => {
		const {owner} = setup('Meganium');
		owner.moves = ['solarbeam'];
		const moves = [{name:'Solar Beam',id:'solarbeam',pp:6,maxpp:10}];
		const active = {moves,megaForms:{mega:'Meganium-Mega',megay:'Meganium-Mega-Y'}};
		for (const [state, name] of [[{mega:true},'Mega Sol Cannon'],[{megay:true},'Flare Cannon'],[{},'Solar Beam']]) {
			const [button] = render(owner,active,state);
			assert.equal(button.children[0],name);
			assert.equal(button.attributes.cmd,'/move 1');
			assert.equal(button.attributes.moveData.pp,6);
		}
		assert.equal(active.moves[0].id,'solarbeam');
	});
});
