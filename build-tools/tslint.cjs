'use strict';

// TSLint 5 uses push.apply to collect rule failures. Large data tables can
// exceed V8's argument limit; collect every failure without spreading it.
require('tslint/lib/utils').flatMap = function (inputs, getOutputs) {
	const output = [];
	for (let i = 0; i < inputs.length; i++) {
		const values = getOutputs(inputs[i], i);
		for (let j = 0; j < values.length; j++) output.push(values[j]);
	}
	return output;
};

if (require.main === module) require('tslint/lib/tslintCli');
