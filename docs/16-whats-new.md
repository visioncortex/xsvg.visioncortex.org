---
title: "What's new"
description: "Release highlights for the xsvg packages — what changed, in plain terms, newest first."
---

# What's new

Highlights from each release of the npm packages
([`@visioncortex/xsvg-viewer`](https://www.npmjs.com/package/@visioncortex/xsvg-viewer) and
[`@visioncortex/xsvg-compile`](https://www.npmjs.com/package/@visioncortex/xsvg-compile), released in
lockstep), newest first. The full, exhaustive record is the
[CHANGELOG](https://github.com/visioncortex/xsvg/blob/main/CHANGELOG.md).

## 0.2.0 — 2 Aug 2026

**xsvg became extensible by anyone.**

- **Your own elements.** [`<x:import>`](/docs/extensibility/generators/) binds an XML namespace to a
  compiled WASM module, so a document can use elements the compiler knows nothing about — procedural
  clipart, custom diagram shapes, whatever you write. They compose like built-ins: a generated shape
  is a valid boolean operand, warp target, or textbox container, and a *container* element gets its
  children compiled and measured first, so it can size itself to what it wraps.
- **`clipart`, the first official extension** — `<arrow>` (thick shafted arrow, one or two heads,
  optional outline and rounding) and `<callout>` (a bubble sized to its children). It loads through
  the same public seam as anyone else's module; nothing about it is privileged.
- **Same modules everywhere.** Generators run in the browser, the CLI, and Node from the same bytes,
  so their output is identical by construction. Every host verifies the module's `integrity` hash and
  isolates modules from each other; opt out with `xsvg --no-plugins` or `plugins: false`.
- **Plugin modules through your own loader.** A host that can't fetch — a VS Code webview under a
  strict CSP, for instance — now supplies a `PluginLoader` on `compileXsvg`, `createPreview`,
  `<xsvg-view>`, and `<xsvg-view-interactive>`. Previously external modules were simply unreachable
  in a sandboxed embedder.
- **Every element describes itself.** Built-in and loaded elements alike publish their attributes —
  types, defaults, ranges, help text — so an editor builds one property panel that treats both the
  same. See [writing a generator](/docs/extensibility/writing-a-generator/).
- **An inspector you can edit in.** Pinning an element in the
  [interactive viewer](/docs/getting-started/playground-and-viewer/) offers typed controls for its
  attributes, including elements from a module the compiler has never seen. Controls that would do
  nothing (overridden by another attribute) are disabled and say why.
- **Edits are live.** An edit re-emits only what it can have changed and patches the drawing in
  place, so pan/zoom, the source pane, the slide deck, and the pinned selection all survive it — and
  a bounded value gets a slider that updates as you drag.
- **Attributes panel, honestly scoped.** Position and size are *not* offered as number fields — they
  belong to canvas handles — while dimensions that shape a drawing without placing it
  (`stroke-width`, `bulge`, `pad`) stay editable. Text border attributes
  (`x:border-width` / `x:border-color` / `x:border-opacity`) are now declared, so they appear in the
  panel at last.

**Connectors got noticeably better at routing.**

- A rail no longer doubles back **through** its own boxes when the target sits behind the exit: it
  routes **around** them, the way Google Docs elbow connectors do, and `route="curve"` becomes a
  rounded elbow in the same situation. New `connector-rail-flip` sample.
- Same-side and corner anchors (`#a:left-top → #b:top`) arc over as intended instead of taking a
  detour, a forced anchor now decides which axis its rail leaves along, and rounded elbows stay
  rounded where two stubs meet.
- Moving a shape re-derives connectors attached to it **by anchor**, not just by plain id — before,
  those connectors could be left pointing at where the box used to be.

**Also**

- Tables and pies can be re-rendered incrementally instead of forcing a whole-document recompile, and
  the interactive viewer's source↔element mapping is no longer off by a few bytes on documents using
  Google-hosted fonts.
- Node gained incremental entry points (`compileFragment`, `fragmentRange`, `dependents`,
  `normalizeSource`) for editors that want to re-emit one element at a time.

Compiled output can differ from 0.1.6 for documents with anchored connectors — hence a minor version,
not a patch. No API changed shape.

## 0.1.6 — 23 Jul 2026

- **[Bordered text](/docs/text-layout/bordered-text/)** — `x:border-width` / `x:border-color` draw an
  outline that hugs each glyph and sits *behind* the fill, so it never thins the letters. Raw SVG
  `stroke` on live text passes through now too.
- **[Cross-file `<use>`](/docs/composition/cross-file-use/)** — `<use href="logo.xsvg">` (or
  `…#icon`) pulls in another file at compile time and bakes it in, so you author a logo once and the
  output stays self-contained. Works from disk in the CLI and Node (`basePath`) and over `fetch` or a
  custom loader in the browser.
- **[Connector endpoints](/docs/diagrams/connectors/)** — force which point a line meets
  (`#id:right`, `#id:left-top`, `#id:center`) or aim at a raw coordinate (`to-point="x,y"`). Curves
  now bow by a fixed, author-settable `bulge` rather than one that grew with distance.
- The slide deck pages with ArrowUp/ArrowDown as well as left/right, and thin or axis-aligned shapes
  finally get a visible inspector highlight.
- `@visioncortex/xsvg-compile` fixed failing to load under Node, and joined the viewer's version
  numbering.

## 0.1.5 — 19 Jul 2026

- Dark mode: the interactive viewer and preview chrome follow the reader's `prefers-color-scheme`.
  The drawing keeps its own colours.

## 0.1.4 — 19 Jul 2026

- `createPreview({ slides: false })` starts a multi-artboard preview with its slide rail collapsed;
  the toggle stays, so a reader can open it.

## 0.1.3 — 19 Jul 2026

- **The interactive viewer, shipped as a component** — `<xsvg-view-interactive>` and the React
  `XsvgViewInteractive`: pan/zoom canvas, artboard slide-deck rail, zoom and fit controls.
- Opt-in `inspector`: a source pane with a bidirectional element↔source link. Its CodeMirror
  dependency loads only when the inspector is enabled.

## 0.1.2 — 19 Jul 2026

- Rebuilt with release WebAssembly (0.1.1 shipped a debug build and is deprecated on npm).

## 0.1.1 — 19 Jul 2026 · deprecated

- The embeddable static viewer: the `<xsvg-view>` custom element, the React `XsvgView`, and a
  self-contained single-file build for zero-build `<script>` use.

## 0.1.0 — 19 Jul 2026

- First release: `@visioncortex/xsvg-viewer` for the browser, `@visioncortex/xsvg-compile` for Node,
  and the Rust crates behind them.

## See also

- [Installation](/docs/getting-started/installation/) — the packages and their entry points.
- [Loadable generators](/docs/extensibility/generators/) — the headline of 0.2.0.
