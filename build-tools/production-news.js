'use strict';
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
module.exports = function productionNews(root = path.resolve(__dirname, '..'), execute = childProcess.execFileSync) {
 if (!fs.existsSync(path.join(root, 'config/news.inc.php'))) throw new Error('Production news requires config/news.inc.php. No production HTML was written.');
 const result = JSON.parse(execute('php', [path.join(root, 'build-tools/news-embed.php')], {encoding: 'utf8'}));
 if (!Array.isArray(result) || result.length !== 2 || !Number.isFinite(Number(result[0])) || typeof result[1] !== 'string' || !result[1].trim()) throw new Error('Production news returned invalid or empty content. No production HTML was written.');
 return result;
};
