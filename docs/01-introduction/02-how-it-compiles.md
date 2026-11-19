---
title: "How it compiles"
description: "The lowering pipeline — one Rust compiler on two platform backings, verified pixel-identical."
---

# How it compiles

xsvg is an XML interchange format that a compiler **lowers to a static SVG subset** renderable in
any SVG engine. The pipeline is four stages:

```
parse → resolve → lower (quality-parameterized) → emit SVG subset
```

- **parse** — read the XML; `<svg xmlns:x="…">` or the `<xsvg>` alias is the root.
- **resolve** — resolve `in="#id"` references and theme tokens. Because a referenced `x:` element
  contributes its *compiled output*, features **chain by reference** (a textbox can flow inside a
  boolean union; type can ride a warp's spine).
- **lower** — turn each extension into plain SVG, parameterized by a **quality profile** that grades
  bake tolerance (`fast` · `balanced` · `fine`).
- **emit** — write the plain-SVG subset: `<path>`, `<text>`/`<tspan>`, `<image>`, gradients, filters.

## Reaching outside the document

Those stages describe one file compiling alone. Two features reach past it — a
[cross-file `<use>`](/docs/composition/cross-file-use/) pulls in another document, and an
[`<x:import>`](/docs/extensibility/generators/) pulls in a generator module — and they arrive by
opposite routes.

### Cross-file `<use>` — discovered while lowering

There is no pre-scan and no dependency graph built up front. The compiler discovers a link the
moment it *reaches* one, and asks the host for that file's source; the host resolves the `href`
relative to the referrer and applies its own security model. How the host answers depends on whether
its I/O is synchronous:

- **CLI and Node** read from disk on demand — one compile pass, no rounds.
- **The browser** can't answer a synchronous compiler mid-call, so it converges in **rounds**:
  compile, note which dependencies were missing, fetch exactly those, run again. The intermediate
  rounds are cheap probes whose output is thrown away, and misses are cached by canonical key — so a
  diamond (`A→B→D`, `A→C→D`) fetches `D` once. The default loader is same-origin `fetch`; an
  embedder can supply its own.

Each dependency is compiled first, then **baked in**: a whole file becomes a clipped, positioned group (its viewport),
a `file.xsvg#id` becomes that element sized to its own extent. Links form a DAG with cycle and depth
guards, and anything unresolvable degrades with a marker instead of failing the compile. Nothing in
the output refers back to the dependency.

### `<x:import>` — loaded before lowering starts

A generator module is *declared*, not discovered: parsing alone reports every binding a document has,
so the host fetches, integrity-checks, and instantiates the modules **before** the first compile and
lowering never waits on I/O. From there a generator element behaves like any other element — the
module returns markup, and the compiler **compiles that markup exactly like document content**: it
may contain `x:` elements, which lower normally — and then the whole result is held to **stricter**
rules than authored markup: no script or event handlers, no `<style>`, no `<foreignObject>`, no URL
that leaves the document (links and paints must be same-document `#fragment`s or embedded images),
and its ids are namespaced so they can't capture the document's own references. Container elements get
their children compiled and measured first, and a child with no measurable geometry reports no box.

Modules are cached across compiles (recompiling on every keystroke must not re-instantiate), while
their *instances* are dropped between compiles, so no state carries from one compile to the next.
Imports are read from the entry document only — a linked dependency's own imports aren't visible, and
plugin elements inside it degrade.

Both are **baked references**: editing a dependency re-emits its dependents, and editing an
`<x:import>` re-emits every element in that namespace.

## One compiler, two backings

`xsvg-core` holds the whole lowering pipeline behind three platform seams:

- a **measurer** — font metrics (advance width; ascent/descent/cap-height/x-height) for text layout;
- a **shaper** — coarse per-row inside-spans of a filled path, for flowing text inside a shape;
- a **rasterizer** — for baking mesh gradients to texel-aligned PNGs.

The browser backing (`xsvg-wasm`, used by the viewer package) fills these with canvas `measureText`,
`getBBox` + `isPointInFill`, and canvas. The native backing (the CLI and the Node package) uses
`ttf-parser`, `kurbo`, and opentype.js. Because both run the **same** compiler, their output is
verified pixel-identical for geometry and within a hair for text.

## Total on well-formed input

Compilation never panics and never emits `NaN`/`inf` coordinates. Degenerate input — zero or
negative sizes, negative spacing, reference cycles, pathological metrics — collapses to empty or
zero-sized output instead of failing. Every failed reference emits a **marker naming the reason**
(target not found, no path geometry, chain too deep), so a blank result is diagnosable from the
output alone.

## Quality profiles

Anything that bakes a curve, field, or gradient to discrete geometry is graded by a quality profile —
`fast`, `balanced`, or `highest`. `balanced` is the default; `highest` tightens tolerances (more,
smaller path segments) and `fast` loosens them. In the browser it's the `quality` option to
`compileXsvg`:

```ts
import { compileXsvg } from "@visioncortex/xsvg-viewer";
const svg = await compileXsvg(source, { quality: "highest" });
```

## Next steps

- [Graceful degradation](/docs/introduction/graceful-degradation/) — the exact degradation contract.
- [Namespaces & prefixes](/docs/introduction/namespaces-and-prefixes/) — the naming rules for extensions.
- [Cross-file `<use>`](/docs/composition/cross-file-use/) — authoring once and linking it everywhere.
- [Loadable generators](/docs/extensibility/generators/) — elements the compiler doesn't ship with.
