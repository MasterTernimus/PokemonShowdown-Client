/**
 * Tiny wrapper around babel/core to do most of the things babel-cli does,
 * plus incremental compilation
 *
 * Adds one option in addition to babel's built-in options: `incremental`
 *
 * Heavily copied from `babel-cli`: https://github.com/babel/babel/tree/main/packages/babel-cli
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const sourceMap = require('source-map');
const crypto = require('crypto');
const projectRoot = path.resolve(__dirname, '..');
const cacheDir = path.join(projectRoot, 'node_modules/.cache/ps-client-compiler');
let currentBuildContext = '';

const VERBOSE = false;
const transformedFiles = new Map();
const stats = {native: 0, babel: 0, reused: 0};


// Use the native emitter only for the explicitly selected large catalogs.
// Other files retain Babel's established JSX and class transformations.
function transformCatalog(input, src, opts) {
  const swc = require('@swc/core');
  const program = swc.parseSync(input, {syntax: 'typescript'});
  // Remove only top-level module syntax, preserving line/column positions.
  // Passing source text avoids serializing the full catalog AST back to Rust.
  const bytes = Buffer.from(input);
  const ranges = program.body.flatMap(node => {
    if (node.type === 'ExportDeclaration') return [[node.span.start - 1, node.declaration.span.start - 1]];
    if (node.type === 'ImportDeclaration' || node.type.startsWith('Export')) return [[node.span.start - 1, node.span.end - 1]];
    return [];
  }).map(([start, end]) => [bytes.subarray(0, start).toString().length, bytes.subarray(0, end).toString().length]);
  let script = input;
  for (const [start, end] of ranges.reverse()) script = script.slice(0, start) + script.slice(start, end).replace(/[^\r\n]/g, ' ') + script.slice(end);
  const result = swc.transformSync(script, {
    filename: src, configFile: false, swcrc: false,
    sourceMaps: !!opts.sourceMaps, minify: !!opts.compact,
    jsc: {parser: {syntax: 'typescript'}, target: 'es3', loose: true},
  });
  const map = result.map ? JSON.parse(result.map) : null;
  if (map) {
    map.sources = [opts.sourceFileName || path.basename(src)];
    map.sourcesContent = [input];
  }
  if (map && opts.sourceMaps === 'inline') {
    result.code += '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + Buffer.from(JSON.stringify(map)).toString('base64');
    return {code: result.code, map: null};
  }
  return {code: result.code, map};
}

// Large generated JSON catalogs contain no executable TypeScript. Keep them out
// of Babel's AST traversal and source-map generation, then restore their values.
function transformFile(src, opts) {
  const {fastFiles, ...transformOptions} = opts;
  const fast = (fastFiles || []).includes(path.basename(src));
  const options = {...transformOptions};
  delete options.incremental;
  delete options.sourceFileName;
  const input = fs.readFileSync(src, 'utf8');
  const key = currentBuildContext + path.resolve(src) + fast + JSON.stringify(options) + input;
  if (transformedFiles.has(key)) { stats.reused++; return transformedFiles.get(key); }
  const catalogs = [];
  const candidates = /^(?:\b(?:const|let|var)\s+[A-Z_][A-Z_0-9]*[^=\r\n]*=\s*|Object\.(?:assign|entries)\(\s*(?:[A-Z_][A-Z_0-9]*\s*,\s*)?)(?=[{\[])/gm;
  let masked = '', cursor = 0, match;
  while ((match = candidates.exec(input))) {
    const start = candidates.lastIndex;
    let depth = 0, quoted = false, escaped = false, end = start;
    for (; end < input.length; end++) {
      const ch = input[end];
      if (quoted) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quoted = false; continue; }
      if (ch === '"') quoted = true;
      else if (ch === '{' || ch === '[') depth++;
      else if ((ch === '}' || ch === ']') && --depth === 0) { end++; break; }
    }
    const literal = input.slice(start, end);
    if (literal.length < 16384) continue;
    try { JSON.parse(literal); } catch { continue; }
    const token = '__PS_RAW_CATALOG_' + catalogs.length + '__';
    if (input.includes(token)) throw new Error('Reserved catalog token in ' + src);
    catalogs.push(literal);
    masked += input.slice(cursor, start) + token;
    cursor = end;
    candidates.lastIndex = end;
  }
  stats[fast ? 'native' : 'babel']++;
  const transformInput = catalogs.length ? masked + input.slice(cursor) : input;
  const result = fast ? transformCatalog(transformInput, src, {...transformOptions, sourceMaps: catalogs.length ? false : transformOptions.sourceMaps}) : catalogs.length ? babel.transformSync(transformInput, {
    ...options, filename: src, sourceMaps: false,
  }) : babel.transformFileSync(src, transformOptions);
  if (result && catalogs.length) result.code = result.code.replace(/__PS_RAW_CATALOG_(\d+)__/g, (_, i) => catalogs[Number(i)]);
  transformedFiles.set(key, result);
  return result;
}

function outputFileSync(filePath, res, opts) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  let code = res.code;

  // we've requested explicit sourcemaps to be written to disk
  if (
    res.map &&
    opts.sourceMaps &&
    opts.sourceMaps !== "inline"
  ) {
    const mapLoc = filePath + ".map";
    code += "\n//# sourceMappingURL=" + path.basename(mapLoc);
    const map = {...(typeof res.map.toJSON === 'function' ? res.map.toJSON() : res.map), file: path.basename(filePath)};
    fs.writeFileSync(mapLoc, JSON.stringify(map));
  }

  fs.writeFileSync(filePath, code);
}

function slash(path) {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}

	return path.replace(/\\/g, '/');
}

async function combineResults(fileResults, sourceMapOptions, opts) {
  let map = null;
  if (fileResults.some(result => result?.map)) {
    map = new sourceMap.SourceMapGenerator(sourceMapOptions);
  }

  let code = "";
  let offset = 0;

  for (const result of fileResults) {
    if (!result) continue;

    code += result.code + "\n";

    if (result.map) {
      const consumer = await new sourceMap.SourceMapConsumer(result.map);
      const sources = new Set();

      consumer.eachMapping(function (mapping) {
        if (mapping.source != null) sources.add(mapping.source);

        map.addMapping({
          generated: {
            line: mapping.generatedLine + offset,
            column: mapping.generatedColumn,
          },
          source: mapping.source,
          original:
            mapping.source == null
              ? null
              : {
                  line: mapping.originalLine,
                  column: mapping.originalColumn,
                },
        });
      });

      for (const source of sources) {
        const content = consumer.sourceContentFor(source, true);
        if (content !== null) {
          map.setSourceContent(source, content);
        }
      }

      if (consumer.destroy) consumer.destroy();
    }
    // Every output contributes lines, including catalog files without maps.
    offset += result.code.split("\n").length;
  }

  if (opts.sourceMaps === "inline" && map) {
    const json = JSON.stringify(map.toJSON());
    const base64 = Buffer.from(json, 'utf8').toString('base64');
    code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + base64;
  }

  return {
    map: map,
    code: code,
  };
}

// Cache the complete build contract, not only source timestamps. This also
// invalidates outputs after configuration, dependency, or input-list changes.
function buildContext(opts) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(opts, (_, value) => typeof value === 'function' ? value.toString() : value));
  for (const file of ['build-tools/compiler.js', 'build-tools/update', '.babelrc', 'babel.config.js',
    'package.json', 'package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'node_modules/.package-lock.json']) {
    const filename = path.join(projectRoot, file);
    hash.update(file);
    hash.update(fs.existsSync(filename) ? fs.readFileSync(filename) : '<missing>');
  }
  for (const dependency of ['@babel/core', '@swc/core']) {
    hash.update(require(dependency + '/package.json').version);
  }
  currentBuildContext = hash.digest('hex');
  return currentBuildContext;
}
function requireInputs(inputs) {
  for (const src of inputs) {
    if (!fs.existsSync(src)) throw new Error('Missing required compiler input: ' + src);
  }
}
function inputFingerprint(inputs, context) {
  const hash = crypto.createHash('sha256').update(context);
  for (const src of inputs) {
    hash.update(path.resolve(src));
    hash.update(fs.readFileSync(src));
  }
  return hash.digest('hex');
}
function cacheFile(dest) {
  return path.join(cacheDir, crypto.createHash('sha256').update(path.resolve(dest)).digest('hex') + '.json');
}
function outputHash(dest) {
  return crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex');
}
function noRebuildNeeded(dest, fingerprint) {
  try {
    const cached = JSON.parse(fs.readFileSync(cacheFile(dest), 'utf8'));
    return cached.fingerprint === fingerprint && cached.output === outputHash(dest) &&
      (!cached.map || cached.map === outputHash(dest + '.map'));
  } catch { return false; }
}
function rememberBuild(dest, fingerprint, opts) {
  const entry = {fingerprint, output: outputHash(dest)};
  if (opts.sourceMaps && opts.sourceMaps !== 'inline' && fs.existsSync(dest + '.map')) entry.map = outputHash(dest + '.map');
  // A read-only optional cache must not prevent a successful build.
  try {
    fs.mkdirSync(cacheDir, {recursive: true});
    fs.writeFileSync(cacheFile(dest), JSON.stringify(entry));
  } catch {}
}

function compileToDir(srcDir, destDir, opts = {}) {
  const incremental = opts.incremental;
  opts = {...opts};
  delete opts.incremental;

  const context = buildContext(opts);

  function handleFile(src, base) {
    let relative = path.relative(base, src);

    if (!relative.endsWith('.ts') && !relative.endsWith('.tsx')) {
      return 0;
    }
    if (relative.endsWith('.d.ts')) return 0;

    relative = relative.slice(0, relative.endsWith('.tsx') ? -4 : -3) + '.js';

    const dest = path.join(destDir, relative);

    const fingerprint = inputFingerprint([src], context);
    if (incremental && noRebuildNeeded(dest, fingerprint)) return 0;

    const res = transformFile(src, {
      ...opts,
      sourceFileName: slash(path.relative(dest + "/..", src)),
    });

    if (!res) return 0;

    outputFileSync(dest, res, opts);
    fs.chmodSync(dest, fs.statSync(src).mode);
    rememberBuild(dest, fingerprint, opts);

    if (VERBOSE) {
      console.log(src + " -> " + dest);
    }

    return 1;
  }

  function handle(src, base) {
    const stat = fs.statSync(src, {throwIfNoEntry: false});

    if (!stat) throw new Error('Missing required compiler input: ' + src);

    if (stat.isDirectory()) {
      if (!base) base = src;

      let count = 0;

      const files = fs.readdirSync(src);
      for (const filename of files) {
        if (filename.startsWith('.')) continue;

        const srcFile = path.join(src, filename);

        count += handle(srcFile, base);
      }

      return count;
    } else {
      if (!base) base = path.dirname(src);
      return handleFile(src, base);
    }
  }

  let total = 0;
  const srcDirs = typeof srcDir === 'string' ? [srcDir] : srcDir;
  requireInputs(srcDirs);
  fs.mkdirSync(destDir, {recursive: true});
  for (const dir of srcDirs) total += handle(dir);
  return total;
}

async function compileToFile(srcFile, destFile, opts = {}) {
  const incremental = opts.incremental;
  opts = {...opts};
  delete opts.incremental;

  const srcFiles = typeof srcFile === 'string' ? [srcFile] : srcFile;

  requireInputs(srcFiles);
  const fingerprint = inputFingerprint(srcFiles, buildContext(opts));
  if (incremental && noRebuildNeeded(destFile, fingerprint)) {
    return 0;
  }

  const results = [];

  for (const src of srcFiles) {

    const res = transformFile(src, opts.sourceMaps === "inline" ? {...opts, sourceMaps: true} : opts);

    if (res) results.push(res);

    if (VERBOSE) console.log(src + " ->");
  }

  await combineResults(results, {
    file: path.basename(destFile),
    sourceRoot: opts.sourceRoot,
  }, opts).then(combined => {
    outputFileSync(destFile, combined, opts);
    rememberBuild(destFile, fingerprint, opts);
  });

  if (VERBOSE) console.log("-> " + destFile);
  return results.length;
}

exports.compileToDir = compileToDir;

exports.compileToFile = compileToFile;

exports.getStats = () => ({...stats});
