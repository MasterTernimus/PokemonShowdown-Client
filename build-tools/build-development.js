'use strict';
require('child_process').execFileSync(process.execPath,['build'],{cwd:require('path').resolve(__dirname,'..'),env:{...process.env,PS_SKIP_PRODUCTION_HTML:'1'},stdio:'inherit'});
