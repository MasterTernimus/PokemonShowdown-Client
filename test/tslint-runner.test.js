'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawnSync} = require('child_process');
require('../build-tools/tslint.cjs');
const {Linter, Configuration} = require('tslint');

describe('TSLint failure collection', function () {
	this.timeout(15000);

	it('retains every failure when a rule exceeds the engine argument limit', () => {
		const count = 150000;
		const linter = new Linter({formatter: 'fileslist'});
		const config = Configuration.parseConfigFile({rules: {'no-trailing-whitespace': true}});
		linter.lint('large.ts', '// trailing space \n'.repeat(count), config);
		const result = linter.getResult();
		assert.equal(result.errorCount, count);
		assert.equal(result.failures.length, count);
		assert.equal(result.failures[0].getRuleName(), 'no-trailing-whitespace');
		assert(result.failures[0].getStartPosition().getPosition() <
			result.failures[count - 1].getStartPosition().getPosition());
	});

	it('keeps the CLI exit status and diagnostics for valid and invalid input', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ps-tslint-'));
		try {
			const config = path.join(dir, 'tslint.json');
			const source = path.join(dir, 'input.ts');
			fs.writeFileSync(config, JSON.stringify({rules: {semicolon: [true, 'always']}}));
			const run = () => spawnSync(process.execPath, [
				path.resolve(__dirname, '../build-tools/tslint.cjs'), '--config', config, source,
			], {encoding: 'utf8', windowsHide: true});
			fs.writeFileSync(source, 'const value = 1;\n');
			let result = run();
			assert.ifError(result.error);
			assert.equal(result.status, 0, result.stderr);
			fs.writeFileSync(source, 'const value = 1\n');
			result = run();
			assert.ifError(result.error);
			assert.equal(result.status, 2, result.stderr);
			assert.match(result.stdout, /semicolon/);
		} finally {
			fs.rmSync(dir, {recursive: true, force: true});
		}
	});
});
