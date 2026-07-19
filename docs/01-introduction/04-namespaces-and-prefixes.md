---
title: "Namespaces & prefixes"
description: "The prefix policy — when an extension is unprefixed, x:-prefixed on an element, or plain inside one."
---

# Namespaces & prefixes

xsvg lives in one XML namespace beside SVG's own. Declaring it and following four naming rules is the
whole surface area.

## The two namespaces

| Namespace | URI |
| --- | --- |
| SVG | `http://www.w3.org/2000/svg` |
| xsvg extensions | `https://xsvg.visioncortex.org` (conventional prefix `x:`) |

The document root MAY be `<svg>` with `xmlns:x` declared, or `<xsvg>` — an alias the compiler treats
as `<svg>`:

```xml
<svg viewBox="0 0 200 100" xmlns:x="https://xsvg.visioncortex.org"> … </svg>
<!-- or -->
<xsvg viewBox="0 0 200 100"> … </xsvg>
```

## The prefix policy

| Kind | Rule | Examples |
| --- | --- | --- |
| A name SVG/CSS **already defines** | use it **unprefixed**, with SVG/CSS semantics | `inline-size`, `text-align`, `line-height`, `<textArea>`, `<meshgradient>`, `text-overflow` |
| A **new attribute** on a standard element | **`x:`-prefixed** (collision-proof) | `<text x:fit="shrink">`, `<path x:width-profile="…">`, `x:glyph-x-scale` |
| A **new element** | **`x:`-prefixed** (a dumb viewer skips it) | `<x:textbox>`, `<x:mesh>`, `<x:boolean>`, `<x:pie>` |
| Attributes **inside** an `x:` element | **plain / unprefixed** (the element disambiguates) | `<x:textbox padding="8" align="center">` |

The guiding idea: **reuse SVG's own under-supported vocabulary** rather than invent names. SVG
already specced features browsers fumbled — `inline-size` (SVG2 auto-wrap), `<textArea>` (SVG 1.2
Tiny box text), `<meshgradient>` (dropped from SVG2). Reviving them by their real names means models
already know them and raw files still render their valid parts. New names appear only where SVG has
no concept.

## Next steps

- [Getting started](/docs/getting-started/installation/) — install and write your first document.
- Browse the [element index](/docs/reference/element-index/) for every extension.
