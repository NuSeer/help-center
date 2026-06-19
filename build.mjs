#!/usr/bin/env node
// build.mjs — assembler
//
// Reads src/ and produces help-center-system.built.html as a single deploy file.
// The live help-center-system.html is NEVER touched.
//
// Markers supported in src/index.html (and recursively in included partials):
//   <!-- INCLUDE: relative/path.html  -->        ← inline as-is
//   <!-- INCLUDE_STYLE: relative/path.css -->    ← wrap with <style>...</style>
//   <!-- INCLUDE_SCRIPT: relative/path.js -->    ← wrap with <script>...</script>
//
// Usage:  node build.mjs
//         (no flags; idempotent; safe to re-run)

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, 'src');
const OUT = join(__dirname, 'help-center-system.built.html');
const INDEX = join(SRC_DIR, 'index.html');

const log = (...a) => console.log('[build]', ...a);

// EOL detected from src/index.html on first read; preserves CRLF on Windows.
let EOL = '\n';

// Each pattern matches the entire line (with leading whitespace). The wrap
// function receives that whitespace + the file contents, so the marker's
// indent applies to the wrapping tags and the partial's own indentation is
// preserved verbatim. INCLUDE replaces the whole line because the partial
// itself already carries its baked-in indentation.
const PATTERNS = [
  { rx: /^([ \t]*)<!--\s*INCLUDE_STYLE:\s*([^\s>]+)\s*-->[ \t]*$/gm,
    pathGroup: 2,
    wrap: (ws, c) => `${ws}<style>${EOL}${c}${EOL}${ws}</style>` },
  { rx: /^([ \t]*)<!--\s*INCLUDE_SCRIPT:\s*([^\s>]+)\s*-->[ \t]*$/gm,
    pathGroup: 2,
    wrap: (ws, c) => `${ws}<script>${EOL}${c}${EOL}${ws}</script>` },
  { rx: /^([ \t]*)<!--\s*INCLUDE:\s*([^\s>]+)\s*-->[ \t]*$/gm,
    pathGroup: 2,
    wrap: (ws, c) => c }
];

async function resolveIncludes(text, baseDir, stack = new Set()) {
  let result = text;
  let pass = 0;
  const MAX_PASSES = 10; // guard against infinite loops

  while (pass++ < MAX_PASSES) {
    let changed = false;

    for (const { rx, pathGroup, wrap } of PATTERNS) {
      // Find all matches in current text
      const matches = [...result.matchAll(rx)];
      if (matches.length === 0) continue;
      changed = true;

      // Replace bottom-up to keep earlier indices valid
      for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        const ws = m[1] || '';
        const relPath = m[pathGroup].trim();
        const absPath = resolve(baseDir, relPath);
        if (stack.has(absPath)) {
          throw new Error(`circular include: ${absPath}`);
        }
        stack.add(absPath);
        let content;
        try {
          content = await readFile(absPath, 'utf8');
        } catch (err) {
          throw new Error(`include not found: ${absPath} (from marker "${m[0]}")`);
        }
        stack.delete(absPath);
        // Recurse: included file may itself contain includes
        content = await resolveIncludes(content, dirname(absPath), new Set(stack));
        // Trim trailing newline (CRLF or LF) so we don't accumulate blank lines
        if (content.endsWith('\r\n')) content = content.slice(0, -2);
        else if (content.endsWith('\n')) content = content.slice(0, -1);
        const wrapped = wrap(ws, content);
        result = result.slice(0, m.index) + wrapped + result.slice(m.index + m[0].length);
      }
    }
    if (!changed) break;
  }
  if (pass >= MAX_PASSES) {
    throw new Error('include resolver hit max passes — possible circular reference');
  }
  return result;
}

async function main() {
  log('reading', INDEX);
  const shell = await readFile(INDEX, 'utf8');
  EOL = shell.includes('\r\n') ? '\r\n' : '\n';
  log('line endings:', EOL === '\r\n' ? 'CRLF' : 'LF');
  log('resolving includes…');
  const output = await resolveIncludes(shell, SRC_DIR);
  await writeFile(OUT, output, 'utf8');
  log('wrote', OUT, `(${output.length} chars, ${output.split('\n').length} lines)`);
  log('done.');
}

main().catch(err => { console.error(err); process.exit(1); });
