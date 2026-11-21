'use strict';

// Emit one sprite per row and keep its numeric dimensions together.
function spriteTableSource(table, depth = 0) {
	if (Array.isArray(table)) return '[' + table.join(', ') + ']';
	const indent = '\t'.repeat(depth);
	const rows = Object.entries(table).map(([key, value]) =>
		indent + '\t' + JSON.stringify(key) + ': ' + spriteTableSource(value, depth + 1) + ',');
	return rows.length ? '{\n' + rows.join('\n') + '\n' + indent + '}' : '{}';
}
module.exports = {spriteTableSource};
