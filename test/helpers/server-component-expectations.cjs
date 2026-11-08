// Expected search closure comes from the synchronized server metadata, not client output.
// Exact approved packages are also checked by the individual ability regression suites.
const snapshot = require('../../server-data-sync-manifest.json').snapshot;
const aliases = require('../../play.pokemonshowdown.com/data/aliases.js').BattleAliases;
const toID = value => String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
function effects(id, seen = new Set()) {
 id = toID(id);
 if (!snapshot.abilities[id] && aliases[id]) id = toID(aliases[id]);
 if (seen.has(id)) return [id];
 const next = new Set([...seen, id]);
 const parts = [id, ...(snapshot.components[id] || []).flatMap(part => effects(part, next))];
 return [...new Set(parts)].filter(part => !(snapshot.componentExclusions[id] || []).includes(part)).sort();
}
module.exports = {snapshot, effects};
