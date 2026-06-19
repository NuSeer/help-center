#!/usr/bin/env node
// extract.mjs — one-shot splitter
//
// Reads `help-center-system.html` (live, untouched) and produces src/ layout:
//   src/index.html         — shell with INCLUDE markers
//   src/styles/main.css    — extracted CSS block
//   src/js/app-phase1.js   — main app script (lines ~3961-12970)
//   src/js/app-phase2.js   — pathway script (lines ~12973-21881)
//   src/pages/<id>.html    — one file per `<div id="*-page" class="page">` block
//
// The original HTML file is NEVER modified.  Re-run any time to refresh src/.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_FILE = join(__dirname, 'help-center-system.html');
const OUT = join(__dirname, 'src');

const log = (...a) => console.log('[extract]', ...a);

let EOL = '\n'; // detected per-run; preserves CRLF on Windows sources

// ── Helpers ───────────────────────────────────────────────────────────────────

async function ensureDir(p) { await mkdir(p, { recursive: true }); }

// Walk forward from a `<div ...>` opener, tracking depth, ignoring divs inside
// <script>...</script> blocks (template literals in JS can contain `<div`).
// Returns the line index (1-based) where the matching </div> closes.
function findMatchingDivClose(lines, startIdx /* 1-based */) {
  let depth = 0;
  let inScript = false;
  for (let i = startIdx; i <= lines.length; i++) {
    let line = lines[i - 1];
    if (line == null) break;

    // Toggle inScript on a per-line basis. Handle "starts and ends same line."
    let workLine = line;
    while (true) {
      if (!inScript) {
        const m = workLine.match(/<script\b[^>]*>/);
        if (!m) break;
        // Count divs in the pre-script portion of this line
        const pre = workLine.slice(0, m.index);
        depth += countOccurrences(pre, /<div\b[^>]*>/g);
        depth -= countOccurrences(pre, /<\/div\s*>/g);
        if (depth <= 0 && i > startIdx) return i;
        // Now we're in a script — does it close on same line?
        const rest = workLine.slice(m.index + m[0].length);
        const close = rest.match(/<\/script\s*>/);
        if (close) {
          // Skip script contents on this line; continue scanning rest of line
          workLine = rest.slice(close.index + close[0].length);
          continue;
        } else {
          inScript = true;
          workLine = '';
          break;
        }
      } else {
        const close = workLine.match(/<\/script\s*>/);
        if (!close) { workLine = ''; break; }
        inScript = false;
        workLine = workLine.slice(close.index + close[0].length);
      }
    }

    if (inScript) continue;

    depth += countOccurrences(workLine, /<div\b[^>]*>/g);
    depth -= countOccurrences(workLine, /<\/div\s*>/g);
    if (depth <= 0 && i > startIdx) return i;
  }
  return -1;
}

function countOccurrences(str, regex) {
  return (str.match(regex) || []).length;
}

function joinLines(lines, fromIdx /* 1-based incl. */, toIdx /* 1-based incl. */) {
  return lines.slice(fromIdx - 1, toIdx).join(EOL);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log('reading', SRC_FILE);
  const raw = await readFile(SRC_FILE, 'utf8');
  EOL = raw.includes('\r\n') ? '\r\n' : '\n';
  const lines = raw.split(/\r?\n/);
  log('total lines:', lines.length, '(line endings:', EOL === '\r\n' ? 'CRLF' : 'LF', ')');

  await ensureDir(join(OUT, 'styles'));
  await ensureDir(join(OUT, 'js'));
  await ensureDir(join(OUT, 'pages'));

  // ── 1. Find anchor lines ────────────────────────────────────────────────────
  // Main CSS block: first `<style>` followed by `</style>` in head (line ~81)
  // Main script blocks: opening at `<script>` on its own line at body level

  const mainStyleStart = findLineExact(lines, /^\s*<style>\s*$/, 1);
  const mainStyleEnd = findLineExact(lines, /^\s*<\/style>\s*$/, mainStyleStart + 1);

  // Identify the two big body-level <script> blocks. They are on lines where
  // the tag is alone, with whitespace, AND appears after `</head>`.
  const headEnd = findLineExact(lines, /^\s*<\/head>\s*$/, 1);
  const scriptOpens = [];
  for (let i = headEnd + 1; i <= lines.length; i++) {
    if (/^\s*<script>\s*$/.test(lines[i - 1])) scriptOpens.push(i);
  }
  // The big ones are the last two — they bracket the entire app logic.
  // Earlier small scripts (iOS hint, inline page scripts) stay inline.
  // Heuristic: the two largest <script>...</script> blocks at body level.
  const blocks = scriptOpens.map(openIdx => {
    const closeIdx = findLineExact(lines, /^\s*<\/script>\s*$/, openIdx + 1);
    return { openIdx, closeIdx, size: closeIdx - openIdx };
  }).sort((a, b) => b.size - a.size);

  const [big1, big2] = blocks.slice(0, 2).sort((a, b) => a.openIdx - b.openIdx);
  log('main CSS lines:', mainStyleStart, '-', mainStyleEnd);
  log('main JS block 1 lines:', big1.openIdx, '-', big1.closeIdx, `(${big1.size} lines)`);
  log('main JS block 2 lines:', big2.openIdx, '-', big2.closeIdx, `(${big2.size} lines)`);

  // ── 2. Find all page divs ──────────────────────────────────────────────────
  const pageStarts = [];
  for (let i = 1; i <= lines.length; i++) {
    const m = lines[i - 1].match(/<div\s+id="([a-zA-Z0-9_-]+)-page"\s+class="page\b/);
    if (m) pageStarts.push({ idx: i, name: m[1] });
  }
  // Only count pages that are BEFORE the first big script — others are inside
  // template literals (e.g. report exports).
  const realPages = pageStarts.filter(p => p.idx < big1.openIdx);
  log('pages found:', realPages.length);

  for (const p of realPages) {
    const closeIdx = findMatchingDivClose(lines, p.idx);
    if (closeIdx < 0) {
      console.warn(`  ! could not find close for #${p.name}-page (start line ${p.idx})`);
      continue;
    }
    p.closeIdx = closeIdx;
  }

  // ── 3. Extract content to source files ─────────────────────────────────────

  // CSS (strip outer <style>...</style>, keep interior verbatim)
  const cssContent = joinLines(lines, mainStyleStart + 1, mainStyleEnd - 1);
  await writeFile(join(OUT, 'styles', 'main.css'), cssContent + EOL, 'utf8');
  log('wrote src/styles/main.css', cssContent.length, 'chars');

  // JS phase 1 (strip outer <script>...</script>)
  const js1 = joinLines(lines, big1.openIdx + 1, big1.closeIdx - 1);
  await writeFile(join(OUT, 'js', 'app-phase1.js'), js1 + EOL, 'utf8');
  log('wrote src/js/app-phase1.js', js1.length, 'chars');

  // JS phase 2
  const js2 = joinLines(lines, big2.openIdx + 1, big2.closeIdx - 1);
  await writeFile(join(OUT, 'js', 'app-phase2.js'), js2 + EOL, 'utf8');
  log('wrote src/js/app-phase2.js', js2.length, 'chars');

  // Each page: the FULL `<div id="X-page" class="page...">...</div>` block
  for (const p of realPages) {
    if (!p.closeIdx) continue;
    const block = joinLines(lines, p.idx, p.closeIdx);
    await writeFile(join(OUT, 'pages', `${p.name}.html`), block + EOL, 'utf8');
  }
  log('wrote', realPages.filter(p => p.closeIdx).length, 'page partials to src/pages/');

  // ── 4. Build src/index.html: original with INCLUDE markers in extracted ranges
  // Replace ranges in reverse line order so earlier line numbers stay valid.

  const replacements = [];

  // CSS
  replacements.push({
    from: mainStyleStart,
    to: mainStyleEnd,
    replacement: '  <!-- INCLUDE_STYLE: styles/main.css -->'
  });

  // Pages
  for (const p of realPages) {
    if (!p.closeIdx) continue;
    // Preserve indentation of the opening line
    const indent = (lines[p.idx - 1].match(/^(\s*)/) || ['', ''])[1];
    replacements.push({
      from: p.idx,
      to: p.closeIdx,
      replacement: `${indent}<!-- INCLUDE: pages/${p.name}.html -->`
    });
  }

  // JS blocks
  replacements.push({
    from: big1.openIdx,
    to: big1.closeIdx,
    replacement: '  <!-- INCLUDE_SCRIPT: js/app-phase1.js -->'
  });
  replacements.push({
    from: big2.openIdx,
    to: big2.closeIdx,
    replacement: '  <!-- INCLUDE_SCRIPT: js/app-phase2.js -->'
  });

  // Apply replacements bottom-up
  replacements.sort((a, b) => b.from - a.from);
  const newLines = lines.slice();
  for (const r of replacements) {
    newLines.splice(r.from - 1, r.to - r.from + 1, r.replacement);
  }

  await writeFile(join(OUT, 'index.html'), newLines.join(EOL), 'utf8');
  log('wrote src/index.html', newLines.length, 'lines');

  log('done.');
}

function findLineExact(lines, regex, fromIdx /* 1-based */) {
  for (let i = fromIdx; i <= lines.length; i++) {
    if (regex.test(lines[i - 1])) return i;
  }
  return -1;
}

main().catch(err => { console.error(err); process.exit(1); });
