---
title: "Your first document"
description: "Write a small xsvg document, understand its structure, and compile it to plain SVG."
---

# Your first document

An xsvg document is an SVG document with the extension namespace declared. Here's a complete one that
uses a single extension — a box-bound label that wraps, centers, and shrinks to fit:

<Example title="A box-bound label" src={`<svg viewBox="0 0 320 160" xmlns:x="https://xsvg.visioncortex.org">
  <rect id="card" x="20" y="20" width="280" height="120" rx="16"
        fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
  <x:textbox in="#card" padding="16" align="center" valign="middle" fit="shrink"
             font-family="sans-serif" font-size="24" fill="#3730a3">
    Draw the box once, then attach a label that fits it.
  </x:textbox>
</svg>`} />

## Anatomy

```xml
<svg viewBox="0 0 320 160" xmlns:x="https://xsvg.visioncortex.org">
  <!--            ^ the extension namespace, conventional prefix x:  -->

  <rect id="card" .../>                <!-- a normal SVG shape, given an id     -->

  <x:textbox in="#card" .../>          <!-- an extension element bound to it    -->
</svg>
```

1. **The root is `<svg>`** with `xmlns:x="https://xsvg.visioncortex.org"` declared. (You could also
   use the `<xsvg>` root alias.)
2. **Plain SVG works as-is.** The `<rect>` is ordinary SVG — the compiler passes it through
   untouched.
3. **Extensions reference plain shapes.** `<x:textbox in="#card">` borrows the rect's geometry.
   Attributes *inside* an `x:` element are unprefixed (`padding`, `align`, `valign`, `fit`).

## What compiles out

The `<x:textbox>` lowers to positioned `<text>`/`<tspan>` at the solved font size; the `<rect>` is
unchanged. The result is a plain SVG file with no trace of the `x:` namespace — it opens anywhere.

## Try it yourself

Every example on this site has an **Edit in Playground** link. Open the one above, change the text or
the `fit` value, and watch it recompile live. Or start from scratch in the [Playground](/playground/).

## Next steps

- [Playground & preview](/docs/getting-started/playground-and-viewer/) — the in-browser tools and how to embed them.
- [Text layout](/docs/text-layout/overview/) — the full text model.
