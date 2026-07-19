// Sync the sample .xsvg sources + the curated catalog from the sibling xsvg repo
// into this docs site, so the preview/playground iframes and the examples gallery
// have something to load.
//
//   static/dataset/*.xsvg   — fetched by /preview/ and /playground/ (?file=<name>)
//   src/data/catalog.json   — the curated, grouped index (drives /examples/)
//
// The sources are COMMITTED to this repo (CI has no access to the xsvg checkout).
// Run this whenever the upstream dataset changes. If the sibling repo isn't present
// (e.g. on CI), it's a no-op and the already-committed copy is used.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const upstream = resolve(root, '..', 'xsvg');
const datasetSrc = join(upstream, 'dataset');
const catalogSrc = join(upstream, 'web', 'src', 'core', 'catalog.ts');

const datasetOut = join(root, 'static', 'dataset');
const catalogOut = join(root, 'src', 'data', 'catalog.json');

if (!existsSync(datasetSrc)) {
  console.log(`[sync-dataset] sibling repo not found at ${upstream} — using committed copy.`);
  process.exit(0);
}

mkdirSync(datasetOut, { recursive: true });
const files = readdirSync(datasetSrc).filter((f) => f.endsWith('.xsvg'));
for (const f of files) copyFileSync(join(datasetSrc, f), join(datasetOut, f));
console.log(`[sync-dataset] copied ${files.length} .xsvg samples → static/dataset/`);

// Extract the CATALOG array literal from catalog.ts and evaluate it as JSON-ish data.
// The file is a hand-maintained TS module exporting `export const CATALOG: Category[] = [ … ];`.
if (existsSync(catalogSrc)) {
  const ts = readFileSync(catalogSrc, 'utf8');
  const start = ts.indexOf('export const CATALOG');
  const eq = ts.indexOf('=', start); // skip past the `: Category[]` type annotation
  const open = ts.indexOf('[', eq);
  // find the matching closing bracket
  let depth = 0;
  let end = -1;
  for (let i = open; i < ts.length; i++) {
    if (ts[i] === '[') depth++;
    else if (ts[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const literal = ts.slice(open, end + 1);
  // The literal is a plain array of object literals with string values — evaluate it
  // in a sandboxed Function so single quotes, trailing commas, etc. are handled.
  // eslint-disable-next-line no-new-func
  const catalog = Function(`"use strict"; return (${literal});`)();
  mkdirSync(dirname(catalogOut), { recursive: true });
  writeFileSync(catalogOut, JSON.stringify(catalog, null, 2) + '\n');
  const total = catalog.reduce((n, c) => n + c.samples.length, 0);
  console.log(`[sync-dataset] wrote catalog: ${catalog.length} categories, ${total} samples`);
}
