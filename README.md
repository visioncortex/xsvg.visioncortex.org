# xsvg.visioncortex.org

The documentation site for [**xsvg**](https://github.com/visioncortex/xsvg) — eXtensible
SVG, an XML graphics format that compiles to plain SVG. Built with
[Docusaurus 3](https://docusaurus.io/).

Every reference page carries a **live, compiled example** (an `<iframe>` to the in-site
`/preview/` page) and an **Edit in Playground** link. Both the preview and the playground
compile xsvg entirely in the browser via the published
[`@visioncortex/xsvg-viewer`](https://www.npmjs.com/package/@visioncortex/xsvg-viewer)
package (the WASM compiler is inlined, so no cross-repo build is needed).

## Setup

```bash
nvm use                       # Node 22 (reads .nvmrc)
npm install --legacy-peer-deps
```

## Develop

```bash
npm run start                 # dev server at http://localhost:3000, live reload
```

## Build

```bash
npm run build                 # static output in build/
npm run serve                 # preview the production build locally
```

For a full GitHub-Pages build (syncs samples, outputs to `dist/`):

```bash
bash build.sh
```

## Content

- **Docs** live in `docs/`. The sidebar is auto-generated from the numbered folder
  structure — numeric prefixes drive ordering and nesting; each folder's label comes
  from its `_category_.json`.
- **Live examples** use the global `<Example>` MDX component:

  ```mdx
  <Example file="pie" height={360} title="Pie, donut & polar-area" />
  ```

  `file` names a sample under `static/dataset/`. Use `src={`…`}` instead to inline a
  document written directly in the page.

## Samples & catalog

`static/dataset/*.xsvg` and `src/data/catalog.json` are **synced** from the sibling
`xsvg` repo (they're committed here so CI needs no access to it):

```bash
npm run sync:dataset          # refresh from ../xsvg
```

## Tools

- `/preview/?file=<name>` — chrome-less, fit-to-contain render (the `<iframe>` target).
- `/playground/?file=<name>` — CodeMirror editor + live preview, shareable via URL hash.
- `/examples/` — the full sample gallery, grouped by feature.
