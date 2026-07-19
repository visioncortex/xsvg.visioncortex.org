---
title: "Graceful degradation"
description: "What a plain SVG viewer does with raw, uncompiled xsvg — the contract that keeps files from breaking."
---

# Graceful degradation

xsvg is a **graceful-degradation superset of SVG**. Adding an extension is always safe: a plain SVG
viewer that has never heard of xsvg either ignores your extension or skips it, and the rest of the
file renders normally. You compile when you want the effects baked in.

## The contract

| Input | Plain SVG viewer | xsvg compiler |
| --- | --- | --- |
| Unknown **attribute** on a known element (`inline-size`, `x:fit`) | ignores the attribute → the element still renders (text shows, just unwrapped/unfit) | applies it (wraps / fits) |
| Unknown **element** — `x:`-namespaced (`<x:textbox>`) or a revived-but-unsupported SVG element (`<textArea>`) | skips it → its content does **not** render | lowers it to plain SVG |
| Everything else | renders normally | passes through |

A document MUST remain well-formed SVG/XML, and the compiler never requires anything a plain SVG
viewer would reject.

## Degradation tracks the ladder rung

Degradation is **not uniform** — it depends on whether an extension is an *attribute* or an
*element*:

- **Attribute extensions** degrade to *visible-but-plain*. A `<text inline-size="150">` that isn't
  compiled still shows its text; it just doesn't wrap.
- **Element extensions** need the compiler to show anything. An uncompiled `<x:textbox>` or
  `<textArea>` renders nothing for that element until compiled.

So worst case for an attribute extension, raw xsvg renders like the SVG it already was; for an
element extension, raw xsvg shows nothing for that element until compiled. Pick the lowest rung that
solves your case — see the [text layout ladder](/docs/text-layout/overview/).

## Why this matters

Because the `x:` tags live in their own XML namespace and SVG ignores unknown attributes, you can:

- **Ship the compiled SVG** anywhere — it's plain `<path>`/`<text>`/gradients, no runtime.
- **Keep the source** as an editable superset; recompile after any edit.
- **Adopt incrementally** — one attribute or one tag at a time, never a rewrite.

## Next steps

- [Namespaces & prefixes](/docs/introduction/namespaces-and-prefixes/) — the naming rules.
- [Getting started](/docs/getting-started/installation/).
