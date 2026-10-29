const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const sourcePaths=['data','sim','lib','config/formats.ts','config/custom-formats.ts','build','tools/build-utils.js','tools/build-cache.js','tsconfig.json','package-lock.json'];
// Include compiler inputs as well as game data. Never label arbitrary old dist as a new source revision.
function sourceFingerprint(root) {
 const hash=crypto.createHash('sha256');
 const walk=(relative)=>{const absolute=path.join(root,relative);if(!fs.existsSync(absolute))return;
  if(fs.statSync(absolute).isDirectory()) {for(const name of fs.readdirSync(absolute).sort())walk(relative+'/'+name);}
  else {hash.update(relative);hash.update(fs.readFileSync(absolute,'utf8').replace(/\r\n/g,'\n'));}
 };
 for(const relative of sourcePaths)walk(relative);
 return hash.digest('hex');
}
function freshServerBuild(root) {
 root=fs.realpathSync(root);
 const before=sourceFingerprint(root);
 cp.execFileSync(process.execPath,['build','--force'],{cwd:root,stdio:'inherit'});
 if(sourceFingerprint(root)!==before)throw Error('Server sources changed during export build; retry from a stable checkout.');
 // Multiple exports in one process must not reuse a pre-build Dex/module cache.
 const prefix=path.join(root,'dist')+path.sep;
 for(const file of Object.keys(require.cache))if(file.startsWith(prefix))delete require.cache[file];
 return before;
}
module.exports={sourceFingerprint,freshServerBuild,sourcePaths};
