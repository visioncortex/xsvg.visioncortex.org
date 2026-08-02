---
title: "What is xsvg?"
description: "A graceful-degradation superset of SVG that compiles to a plain, static SVG file."
---

# What is xsvg?

**xsvg** is *eXtensible SVG* — you author a **superset of SVG** (plain XML with a handful of
`x:`-prefixed extensions) and the xsvg compiler **lowers it to a plain, static SVG file**. No
runtime, no script, no editor: the output opens anywhere an SVG does.

The extensions add the things SVG never got — real text layout (wrapping, justification,
shrink-to-fit, flow into any shape), envelope warps, boolean path algebra, offsets, self-routing
connectors, gradient meshes, and a data-coordinate frame for charts. Every one of them **lowers to
primitives SVG already renders**: `<path>`, `<text>`, `<image>`, gradients. The set isn't closed
either — a document can [load its own elements](/docs/extensibility/generators/) from a WASM
generator module and they compile like the built-ins.

<Example file="badges.xsvg" title="One document, many extensions" caption="Curved rim text, a warp-arched title, and a mesh-gradient medal — all compiled to plain SVG. Open the source to see the x: tags." />

## A superset, not a new format

You keep the `<svg>` root. Add one namespace declaration and start using extensions:

```xml
<svg viewBox="0 0 320 140" xmlns:x="https://xsvg.visioncortex.org">
  <rect id="node" x="10" y="10" width="300" height="120" rx="14"
        fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
  <x:textbox in="#node" align="center" valign="middle" fit="shrink">
    This label wraps, centers, and shrinks to fit the box.
  </x:textbox>
</svg>
```

The win should cost **one tag-swap or one attribute**, and nothing you add can break the file.

## Extensible for real

The `x` is not only ours to spend. A document can
[bind a namespace to a WASM module](/docs/extensibility/generators/) and use elements we never
wrote — your clipart, your diagram vocabulary — compiled exactly like the built-ins. Two framings,
both accurate: an **XML transformer in the XSLT tradition** (XML in, XML out, declaratively, with
namespace-bound extension elements), and a **geometry shader** (a pure function from parameters to
geometry, same numbers → same shape on every host).

## Degradation-safe by construction

The `x:` tags live in their own XML namespace, so a viewer that doesn't understand them simply
skips them — **the file never breaks**. You compile when you want the effects baked in. See
[Graceful degradation](/docs/introduction/graceful-degradation/) for the exact contract.

## Where it runs

| Package | Kind | What it is |
| --- | --- | --- |
| [`@visioncortex/xsvg-viewer`](https://www.npmjs.com/package/@visioncortex/xsvg-viewer) | npm · browser | WASM compiler + a drop-in preview / slide-deck surface |
| [`@visioncortex/xsvg-compile`](https://www.npmjs.com/package/@visioncortex/xsvg-compile) | npm · Node | Browser-free `compile()`; synchronous |
| `xsvg` CLI | binary | Pure-Rust ahead-of-time compile, no browser |

This whole documentation site compiles xsvg **in your browser** using the viewer package — every
example you see is live. Try one now in the [Playground](/playground/).

## Next steps

- [How it compiles](/docs/introduction/how-it-compiles/) — the lowering pipeline, one compiler on two backings.
- [Graceful degradation](/docs/introduction/graceful-degradation/) — what a plain SVG viewer does with raw xsvg.
- [Getting started](/docs/getting-started/installation/) — install and write your first document.
