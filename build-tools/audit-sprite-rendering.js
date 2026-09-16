const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
global.window = global;
for (const name of ['pokedex', 'pokedex-mini', 'pokedex-mini-bw']) Object.assign(global, require(path.join(root, 'data', name)));
for (const name of ['battle-dex-data', 'battle-dex', 'battle-scene-stub', 'battle-text-parser', 'battle']) require(path.join(root, 'js', name));
Dex.resourcePrefix = '/';
const sizes = new Map();
function size(url) {
	const file = path.join(root, url.split('?')[0]);
	if (!sizes.has(file)) {
		try { sizes.set(file, sizeOf(file)); } catch { sizes.set(file, null); }
	}
	return sizes.get(file);
}
const issues = [];
let checked = 0;
Dex.species.get('Nidoking-Alt');
for (const id of Object.keys(BattlePokedex)) {
	const species = Dex.species.get(id);
	for (const shiny of [false, true]) for (const gender of ['M', 'F']) {
		const builder = Dex.getTeambuilderSpriteData({species: species.name, shiny, gender}, 9);
		const url = builder.spriteDir + (builder.shiny ? '-shiny' : '') + '/' + builder.spriteid + '.png';
		const natural = size(url);
		if (!natural) issues.push({type: 'missing-builder', id, shiny, gender, url});
		else {
			const w = builder.backgroundSize ? parseFloat(builder.backgroundSize) : natural.width;
			const h = w * natural.height / natural.width;
			if (w > 97 || h > 98) issues.push({type: 'builder-overflow', id, shiny, gender, w, h, url});
		}
		for (const front of [false, true]) for (const teamPreview of [false, true]) {
			checked++;
			const data = Dex.getSpriteData(species.name, front, {gen: 9, shiny, gender, teamPreview, noScale: teamPreview});
			const natural = size(data.url);
			if (!natural) { issues.push({type: 'missing-battle', id, shiny, gender, front, teamPreview, url: data.url}); continue; }
			const ratio = natural.width / natural.height;
			// Allow integer rounding on either axis, including very wide/short sprites.
			if (Math.min(Math.abs(data.w - data.h * ratio), Math.abs(data.h - data.w / ratio)) > 1) issues.push({type: 'stretched', id, shiny, front, teamPreview, url: data.url});
			if (!teamPreview && Math.max(data.w, data.h) > 160) issues.push({type: 'large-battle', id, shiny, front, w: data.w, h: data.h});
		}
	}
}
const counts = {};
for (const issue of issues) counts[issue.type] = (counts[issue.type] || 0) + 1;
const output = process.argv[2] || path.join(__dirname, '../sprite-rendering-audit.json');
fs.writeFileSync(output, JSON.stringify({checked, counts, issues}, null, 2));
console.log(JSON.stringify({checked, counts, examples: issues.slice(0, 12)}, null, 2));

const names = ['Clefable', 'Gengar', 'Hydreigon', 'Golisopod-Mega', 'Nidoking-Alt', 'Banette', 'Scizor', 'Corviknight', 'Rillaboom', 'Charizard', 'Pikachu', 'Wailord'];
let html = '<!doctype html><meta charset="utf-8"><title>Sprite rendering audit</title><style>body{font:14px Arial;background:#e7edf0;color:#222;margin:16px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}section{border-bottom:1px solid #aaa}h2{font-size:16px}.row{display:flex;align-items:end;height:130px;gap:10px}.builder{width:96px;height:96px;flex:none}img{object-fit:contain;image-rendering:pixelated}label{display:block;font-size:12px}p{margin:4px 0}</style><main>';
for (const name of names) {
	html += '<section><h2>' + name + '</h2>';
	for (const shiny of [false, true]) {
		html += '<label>' + (shiny ? 'Shiny' : 'Normal') + '</label><div class="row">';
		html += '<div class="builder" style="' + Dex.getTeambuilderSprite({species: name, shiny}, 9) + '"></div>';
		for (const front of [true, false]) {
			const d = Dex.getSpriteData(name, front, {gen: 9, shiny});
			html += `<img src="${d.url}" width="${d.w}" height="${d.h}">`;
		}
		html += '</div>';
	}
	html += '<p>Lead selection</p><div class="row preview">';
	for (const front of [true, false]) {
		const d = Dex.getSpriteData(name, front, {gen: 9, teamPreview: true, noScale: true});
		html += `<img src="${d.url}" width="${d.w}" height="${d.h}">`;
	}
	html += '</div></section>';
}
fs.writeFileSync(output.replace(/\.json$/, '.html'), html + '</main>');
