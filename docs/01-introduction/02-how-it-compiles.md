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
