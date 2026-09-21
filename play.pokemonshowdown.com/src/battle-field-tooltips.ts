/** Read-only field previews shared by battle tooltips and Team Builder. */
const BattleFieldTooltips = {
	cache: new Map<string, string[]>(),
	variantValues(field: any, move: any) {
		if (move.id === 'terrainpulse' && field.id === 'newworldterrain') return Array.from({length: 18}, (_, i) => i);
		const uncertain = field.uncertain || (window as any).BattleFieldMoveRules?.[move.id]?.uncertain;
		return Array.from({length: field.id === 'swampterrain' ? 7 : uncertain ? 5 : 1}, (_, i) => i);
	},
	active(battle: Battle) {
		return (window as any).BattleFieldRules?.find((field: any) => battle.hasPseudoWeather(field.name));
	},
	pokemon(pokemon?: Pokemon | null, server?: ServerPokemon) {
		const types = pokemon?.getTypes(server)[0] || ['Normal'];
		const ability = toID(pokemon?.effectiveAbility(server) || server?.ability || '');
		return {
			name: pokemon?.name || 'Target', types, ability,
			item: server?.item || pokemon?.item || '', status: pokemon?.status || server?.status || '',
			species: {id: toID(server?.speciesForme || pokemon?.speciesForme || '')},
			positiveBoosts: () => Object.values(pokemon?.boosts || {}).reduce((sum, n) => sum + Math.max(0, n || 0), 0),
			isSemiInvulnerable: () => !!pokemon && ['fly', 'dig', 'dive', 'phantomforce', 'shadowforce'].some(id => !!pokemon.volatiles[id]),
			isAlly: () => false,
			boosts: {...pokemon?.boosts}, volatiles: {...pokemon?.volatiles},
			Role: (pokemon as any)?.Role || '',
			hasType: (type: string | string[]) => (Array.isArray(type) ? type : [type]).some(t => types.includes(t as TypeName)),
			hasAbility: (ids: string | string[]) => (Array.isArray(ids) ? ids : [ids]).some(id =>
				Dex.getAbilityEffects(ability).has(toID(id))),
			isGrounded: () => pokemon ? pokemon.isGrounded(server) : true,
			foes: () => pokemon ? pokemon.side.foe.active.filter(Boolean) : [{}],
		};
	},
	clone<T>(input: T): T {
		if (Array.isArray(input)) return input.map(x => this.clone(x)) as any;
		if (input && typeof input === 'object') {
			const copy: any = {};
			for (const key of Object.keys(input)) copy[key] = this.clone((input as any)[key]);
			return copy;
		}
		return input;
	},
	evaluate(field: any, original: any, source: any, target: any, weather = '', variant = 0) {
		const rule = (window as any).BattleFieldMoveRules?.[original.id];
		const move: any = this.clone({...rule?.base, ...original});
		move.flags ||= {};
		source = {...source, effectiveWeather: () => weather};
		target = {...target, effectiveWeather: () => weather};
		let factor = 1;
		const context: any = {
			field: {weather, terrain: field.id, pseudoWeather: {},
				getTerrain: () => field,
				isTerrain: (ids: any) => (Array.isArray(ids) ? ids : [ids]).includes(field.id),
				canSetTerrain: (id: string) => id !== field.id && !field.id.startsWith('flowergarden') &&
					!['underwaterterrain', 'midnightzoneterrain', 'newworldterrain', 'dragonsdenterrain'].includes(field.id) &&
					!(field.id === 'hauntedterrain' && ['electricterrain', 'grassyterrain', 'mistyterrain', 'psychicterrain', 'coldeclipseterrain'].includes(id)),
				isWeather: (w: any) => (Array.isArray(w) ? w : [w]).includes(weather),
				terrainState: {terrainChanges: {get: () => variant % 3},
					underlyingTerrain: variant ? 'watersurfaceterrain' : ''}, terrainStack: []},
			ShortCircuitCounter: variant % 5, CrystalCavernCounter: variant % 4,
			chainModify: (amount: number | number[]) => { factor *= Array.isArray(amount) ? amount[0] / amount[1] : amount; },
			add() {}, debug() {}, attrLastMove() {}, hint() {}, gameType: 'singles',
			dex: {moves: Dex.moves, getActiveMove: (id: string) => this.clone(Dex.moves.get(id))},
			effectState: {}, sample: (items: any[]) => items[variant % items.length],
		};
		// Compare move-owned hooks against the same situation without a field. This
		// isolates field bonuses from weather/status/item bonuses already in the tooltip.
		const baseline: any = this.clone(move);
		const neutral = {...context, field: {...context.field, terrain: '', getTerrain: () => ({id: ''}), isTerrain: () => false,
			canSetTerrain: () => true,
			terrainState: {terrainChanges: {get: () => 0}}}};
		rule?.onModifyType?.call(neutral, baseline, source, target);
		rule?.onModifyType?.call(context, move, source, target);
		field.onModifyType?.call(context, move, source, target);
		rule?.onModifyMove?.call(neutral, baseline, source, target);
		rule?.onModifyMove?.call(context, move, source, target);
		const modifiedPower = move.basePower;
		if (baseline.basePower && original.basePower) move.basePower = original.basePower * move.basePower / baseline.basePower;
		field.onModifyMove?.call(context, move, source, target);
		const allowed = field.onTryMove?.call(context, source, target, move);
		const failed = allowed === false || allowed === null;
		if (move.category !== 'Status' && !failed) {
			rule?.onBasePower?.call(neutral, baseline.basePower, source, target, baseline);
			const neutralFactor = ['venoshock', 'barbbarrage'].includes(original.id) ? factor : 1;
			factor = 1;
			rule?.onBasePower?.call(context, modifiedPower, source, target, move);
			factor /= neutralFactor;
			if (rule?.basePowerCallback) {
				const before = rule.basePowerCallback.call(neutral, source, target, baseline);
				const after = rule.basePowerCallback.call(context, source, target, move);
				if (before) factor *= after / before;
			}
			field.onBasePower?.call(context, move.basePower, source, target, move);
		}
		const accuracy = field.onAccuracy?.call(context, move.accuracy, target, source, move);
		const priority = field.onModifyPriority?.call(context, move.priority || 0, source, target, move);
		return {move, baseline, factor: failed ? 0 : Number(factor.toFixed(12)), failed,
			accuracy: accuracy === undefined ? move.accuracy : accuracy,
			priority: priority === undefined ? move.priority || 0 : priority};
	},
	preview(battle: Battle, move: any, pokemon: Pokemon, server: ServerPokemon, target?: Pokemon | null) {
		const field = this.active(battle);
		if (!field) return null;
		const source = this.pokemon(pokemon, server);
		const foe = this.pokemon(target);
		const variants = this.variantValues(field, move);
		const results = variants.map(v => this.evaluate(field, move, source, foe, battle.weather, v));
		if (field.id === 'chessboardterrain' && !source.Role) {
			results.push(this.evaluate(field, move, {...source, Role: 'Queen'}, foe, battle.weather));
			results.push(this.evaluate(field, move, {...source, Role: 'Knight'}, {...foe, Role: 'Queen'}, battle.weather));
		}
		return {field, result: results[0], min: Math.min(...results.map(r => r.factor)),
			max: Math.max(...results.map(r => r.factor)), results};
	},
	notes(original: any, result: any) {
		const notes: string[] = [];
		const move = result.move;
		const baseline = result.baseline || original;
		const stats: any = {atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', accuracy: 'accuracy', evasion: 'evasion'};
		const boosts = (values: any) => Object.keys(values || {}).map(k => `${values[k] > 0 ? '+' : ''}${values[k]} ${stats[k] || k}`).join(', ');
		const effects = (effect: any): string => [effect.status ? `inflicts ${effect.status}` : '',
			effect.volatileStatus ? `inflicts ${effect.volatileStatus}` : '', boosts(effect.boosts),
			effect.self?.boosts ? `user: ${boosts(effect.self.boosts)}` : ''].filter(Boolean).join(', ');
		if (result.failed) return ['Fails'];
		if (result.factor !== 1) notes.push(`power ×${Number(result.factor.toFixed(3))}`);
		if (move.basePower !== original.basePower) notes.push(`base power becomes ${move.basePower}`);
		if (move.type !== original.type) notes.push(`type becomes ${move.type}`);
		if (move.types?.length > 1) notes.push(`dual typing: ${move.types.join(' / ')}`);
		if (move.category !== original.category) notes.push(`becomes ${move.category}`);
		if (result.accuracy !== baseline.accuracy) notes.push(result.accuracy === true ? 'cannot miss' : `accuracy ${result.accuracy}%`);
		if (result.priority !== (original.priority || 0)) notes.push(`priority ${result.priority > 0 ? '+' : ''}${result.priority}`);
		if (original.flags?.charge && !move.flags.charge) notes.push('no charging turn');
		if (move.target !== original.target) notes.push(`target: ${move.target === 'allAdjacentFoes' ? 'all adjacent foes' : move.target}`);
		if (JSON.stringify(move.boosts) !== JSON.stringify(baseline.boosts)) notes.push(`stat changes: ${boosts(move.boosts) || 'none'}`);
		if (JSON.stringify(move.selfBoost) !== JSON.stringify(baseline.selfBoost) && move.selfBoost) notes.push(`user: ${boosts(move.selfBoost.boosts)}`);
		if (JSON.stringify(move.self) !== JSON.stringify(baseline.self) && move.self) notes.push(`user: ${effects(move.self) || move.self.sideCondition || 'additional effect'}`);
		for (const key of ['heal', 'recoil', 'drain']) {
			if (JSON.stringify(move[key]) !== JSON.stringify(baseline[key])) notes.push(`${key}: ${move[key] ? `${Number((100 * move[key][0] / move[key][1]).toFixed(1))}%` : 'none'}`);
		}
		if (move.volatileStatus !== baseline.volatileStatus && move.volatileStatus) notes.push(`adds ${move.volatileStatus}`);
		if (JSON.stringify(move.secondaries) !== JSON.stringify(baseline.secondaries)) {
			notes.push(`secondary effects: ${(move.secondaries || []).map((e: any) => `${e.chance ?? 100}% ${effects(e) || 'special effect'}`).join('; ') || 'none'}`);
		}
		if (move.critRatio !== original.critRatio) notes.push(`critical-hit stage ${move.critRatio}`);
		if (move.category !== 'Status' && move.ignoreImmunity?.Normal && !original.ignoreImmunity?.Normal) notes.push('Normal attacks bypass type immunity');
		return notes;
	},
	activeNotes(battle: Battle, move: Move, pokemon: Pokemon, server: ServerPokemon, target?: Pokemon | null) {
		const preview = this.preview(battle, move, pokemon, server, target);
		if (!preview) return '';
		const notes = this.notes(move, preview.result);
		if (preview.field.id === 'chessboardterrain') notes.push('role bonuses require the assigned chess role; King adds +1 priority');
		if (move.id === 'terrainpulse' && preview.field.id === 'newworldterrain') {
			const index = notes.findIndex(n => n.startsWith('type becomes'));
			if (index >= 0) notes.splice(index, 1);
			notes.push('type is random');
		}
		if (preview.min !== preview.max) {
			const index = notes.findIndex(n => n.startsWith('power ×'));
			if (index >= 0) notes.splice(index, 1);
			notes.unshift(`power ×${Number(preview.min.toFixed(3))}–${Number(preview.max.toFixed(3))} (depends on field state not sent to the client)`);
		}
		if (preview.field.id === 'rainbowterrain' && move.type === 'Normal' && move.category === 'Special') {
			const index = notes.findIndex(n => n.startsWith('dual typing:'));
			if (index >= 0) notes[index] = 'gains a random secondary type';
		}
		if (preview.field.id === 'crystalcavernterrain' && notes.some(n => n.startsWith('dual typing:'))) {
			return `${preview.field.name}: ${notes.filter(n => !n.startsWith('dual typing:')).join('; ')}; Rock + Fire/Water/Grass/Psychic, depending on the crystal cycle.`;
		}
		return notes.length ? `${preview.field.name}: ${notes.join('; ')}.` : '';
	},
	/** Team Builder is not tied to a battle: list conditional outcomes rather than inventing a current state. */
	allNotes(move: any): string[] {
		const key = `${move.id}/${move.type}/${move.category}/${move.basePower}`;
		if (this.cache.has(key)) return this.cache.get(key)!;
		const rows: string[] = [];
		const base: any = this.pokemon();
		const scenarios: any[] = [
			['', base, base, ''],
			['user airborne', {...base, isGrounded: () => false}, base, ''],
			['target airborne', base, {...base, isGrounded: () => false}, ''],
			['Water-type user', {...base, types: ['Water'], hasType: (t: string) => t === 'Water'}, base, ''],
			['Ghost-type user', {...base, types: ['Ghost'], hasType: (t: string) => t === 'Ghost'}, base, ''],
			['Grass-type target', base, {...base, hasType: (t: string) => t === 'Grass'}, ''],
			['sunlight', base, base, 'sunnyday'], ['rain', base, base, 'raindance'],
			['hail', base, base, 'hail'], ['target has raised evasion', base, {...base, boosts: {evasion: 1}}, ''],
		];
		['steelworker', 'schooling', 'swiftswim', 'elevate', 'propellertail', 'fullmetalbody', 'turboblaze', 'atrocity', 'soulfire', 'relentlesshunt', 'armorize', 'illuminate'].forEach(ability => {
			scenarios.push([`${Dex.abilities.get(ability).name} user`, {...base, ability, hasAbility: (ids: any) => (Array.isArray(ids) ? ids : [ids]).includes(ability)}, base, '']);
		});
		scenarios.push(['user holding an item', {...base, item: 'leftovers'}, base, ''],
			['user has +1 positive stat stage', {...base, positiveBoosts: () => 1}, base, ''],
			['target poisoned', base, {...base, status: 'psn'}, '']);
		((window as any).BattleFieldRules || []).forEach((field: any) => {
			const groups = new Map<string, string[]>();
			const cases = scenarios.slice();
			if (field.id === 'chessboardterrain') {
				cases.push(['Queen user', {...base, Role: 'Queen'}, base, ''], ['King user', {...base, Role: 'King'}, base, ''],
					['Knight attacking Queen', {...base, Role: 'Knight'}, {...base, Role: 'Queen'}, ''],
					['target has Unaware/Simple/Klutz/Oblivious/Defeatist or confusion', base, {...base, ability: 'simple'}, ''],
					['target has Adaptability/Synchronize/Anticipation/Telepathy', base, {...base, ability: 'adaptability'}, '']);
			}
			let ordinary = '';
			cases.forEach(([label, source, target, weather]) => {
				const results = this.variantValues(field, move).map(v => this.evaluate(field, move, source, target, weather, v));
				const variants = Array.from(new Set(results.map(r => this.notes(move, r).join('; ') || 'no modifier')));
				if (move.id === 'terrainpulse' && field.id === 'newworldterrain') {
					variants.splice(0, variants.length, 'random type; power depends on the selected type');
				}
				if (field.id === 'rainbowterrain' && move.type === 'Normal' && move.category === 'Special') {
					for (let i = 0; i < variants.length; i++) variants[i] = variants[i].replace(/dual typing: [^;]+/, 'gains a random secondary type');
				}
				const text = variants.join(' OR ');
				if (!label) ordinary = text;
				if (label && text === ordinary) return;
				if (!label && text === 'no modifier') return;
				groups.set(text, [...(groups.get(text) || []), label]);
			});
			groups.forEach((labels, text) => {
				rows.push(`${field.name}: ${text}${labels.some(Boolean) ? ` (${labels.filter(Boolean).join(', ')})` : ''}${text.includes(' OR ') ? ' [field cycle/history may vary]' : ''}`);
			});
		});
		this.cache.set(key, rows);
		return rows;
	},
	teamBuilderHTML(move: Move) {
		return '<details class="field-move-info" data-field-move="' + BattleLog.escapeHTML(move.id) +
			'"><summary>Field effects</summary><div></div></details>';
	},
	teamBuilderContent(move: Move) {
		const rows = this.allNotes(move);
		if (!rows.length) return '<p>No direct field modifiers for this move.</p>';
		return '<p>Conditional effects are shown separately. Power multipliers are additional field effects, including stacked boosts.</p>' +
			rows.map(row => '<p>' + BattleLog.escapeHTML(row) + '</p>').join('');
	},
};
// Compute the all-field reference only when expanded, keeping move searches fast.
if (typeof document !== 'undefined') document.addEventListener('toggle', event => {
	const details = event.target as HTMLDetailsElement;
	if (!details.open || !details.dataset.fieldMove) return;
	const content = details.querySelector('div');
	if (content && !content.innerHTML) content.innerHTML = BattleFieldTooltips.teamBuilderContent(Dex.moves.get(details.dataset.fieldMove));
}, true);
(window as any).BattleFieldTooltips = BattleFieldTooltips;
if (typeof require === 'function') (global as any).BattleFieldTooltips = BattleFieldTooltips;
