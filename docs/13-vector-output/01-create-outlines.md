---
title: "Create outlines"
description: "The outline=\"true\" attribute lowers a text element's glyphs to path geometry at compile time — the prerequisite for warping, type-on-a-path and booleans over text."
---

# Create outlines

`outline="true"` turns a text element's glyphs into vector `<path>` geometry at compile time — the
"Create Outlines" operation from Illustrator. Layout is unchanged: outlining is a purely **emit-time**
transform applied *after* wrapping, fitting, and alignment have run. The drawing then carries the true
display face as geometry and renders identically anywhere, with no font install or `@font-face` embed.

<Example file="outline" title="Outlined glyphs land on the live text" caption="One box drawn twice at identical geometry: live <text> fill, plus an outline='true' keyline on top." />

## Syntax

```xml
<x:textbox x="28" y="80" width="664" height="150" valign="middle"
           font-family="-x-google-Anton" font-size="104"
           fill="none" stroke="#fbbf24" stroke-width="1.25" outline="true">OUTLINE</x:textbox>
```

Set `outline="true"` on `<x:textbox>`, or the prefixed `x:outline="true"` on a reused `<textArea>`.

## Model

Each laid-out line is traced from its text at the element's **base style** and emitted as a `<path>`
inside a single `<g>` that carries the element's paint — `fill` plus any `stroke*` / `paint-order`, so
an outline can be filled, stroked as a keyline, or both. Lines are anchored by their measured width
(`text-anchor` resolved to an `x` origin), matching the live-text placement exactly.

Outlining is **all-or-nothing per element with graceful fallback**: if the backend cannot outline
*every* line — for example the font's bytes are unavailable — the element falls back to live `<text>`
unchanged. An outline request never breaks a drawing; it only upgrades it when the font is present.

| Attribute | Values | Default | Description |
|---|---|---|---|
| `outline` | `true` \| `false` | `false` | trace laid-out glyphs to `<path>` geometry at emit time |
| `font-family` | family name, or `-x-google-<Name>` | inherited | the display face; the `-x-google-` marker provisions a Google font |

## Fonts by name

Outlining needs the font's **bytes**. In the reference web app a `font-family="-x-google-<Name>"`
marker (for example `font-family="-x-google-Anton"`) resolves by fetching that family from Google
Fonts once, then registering it with the outliner **and** adding it to the document so live `<text>`
and canvas metrics use the real face too. The marker is stripped to the bare family before compile, so
a resolution failure degrades to the normal live-`<text>` fallback. This is app-level font
provisioning, not part of the interchange format — arbitrary installed system fonts are not outlinable.

## When you need outlines

Outlining is the prerequisite for every feature that treats text as vector art:

- **[Warp](/docs/warp/overview/)** — a warp can only deform `<path>` geometry, so text must be outlined
  to participate.
- **[Type on a path](/docs/type-on-a-path/overview/)** — the run is outlined, then its geometry is
  warped onto the path.
- **[Booleans](/docs/diagrams/booleans/)** — path algebra that references a text region needs that text
  as `<path>` geometry.

## What the trace keeps

An outline traces what live text draws. Each run is traced in its own face, weight and size, and a
line with `letter-spacing`, `word-spacing`, justification or `glyph-x-scale` is traced glyph by glyph
at the positions the live text is laid at — pinned so live and outlined text render to the same
pixels. A run's fill and [border](/docs/text-layout/bordered-text/) paint its own piece (all borders
behind all fills), highlights and decorations bake as rectangles beside the paths, and every contour
comes out **closed**, so a path editor sees closed shapes.

`outline="true"` also works on `<x:list>` and `<x:table>` (every item's and cell's lines, generated
numbers included), and `x:outline="true"` on `<text inline-size>` and plain point text.

## How it lowers

The compiler emits a `<g>` carrying the element's paint, containing one `<path>` per laid-out line
(traced glyph outlines). When the font's bytes are unavailable the element emits live `<text>` /
`<tspan>` instead, unchanged.

## See also

- [Warp overview](/docs/warp/overview/) — deform outlined text through envelope, perspective and spine fields.
- [Type on a path](/docs/type-on-a-path/overview/) — bind an outlined run to a path.
- [Booleans](/docs/diagrams/booleans/) — path algebra over filled regions, including outlined text.
