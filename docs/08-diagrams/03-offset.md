---
title: "Offset (inset & outset)"
description: "Grow or shrink a referenced region by a Minkowski offset — the Offset Path / Inset & Outset operation SVG never got — with round, miter, and bevel joins, baked to one plain <path>."
---

# Offset (inset & outset)

`<x:offset in="#id" distance="d">` grows (positive `distance`) or shrinks (negative) a referenced
region by a **Minkowski offset** — the "Offset Path" (Illustrator) / "Inset & Outset" (Inkscape)
operation SVG never got. It is a **baked reference**: `in` resolves to the target's compiled geometry,
so editing the target re-emits the offset. It lowers to one plain `<path>`.

<Example file="offset" title="Inset & outset" caption="Concentric ripples around a blob, a self-intersecting pentagram outset, a spiky star inset and outset, and stacked offsets as a sticker halo behind outlined text." />

## Syntax

```xml
<x:offset in="#logo" distance="6" join="round"/>    <!-- outset 6 -->
<x:offset in="#logo" distance="-4" join="miter"/>   <!-- inset 4 -->
```

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `in` | `#id` | the region to offset (a baked reference — a shape, a group, or an `x:` element's output; referenced text auto-outlines) |
| `distance` | length | **positive** outsets (grows), **negative** insets (shrinks) |
| `join` | `round` *(default)* / `miter` / `bevel` | corner style — `round` is the true disc offset, `miter` keeps corners sharp (to the limit), `bevel` cuts them flat |
| `miter-limit` | number (default `4`) | the miter-to-bevel fallback threshold |
| `fill-rule` | `nonzero` *(default)* / `evenodd` | how the region's contours combine before offsetting |

## How it works

Offset adds no new engine — it composes the two robust primitives xsvg already has. The region's
boundary is **stroked** by `2·|distance|` into a band that reaches `distance` to each side; a **union**
(outset) or **difference** (inset) of that band with the region yields the result, using the same
`i_overlay` boolean engine that powers [booleans](/docs/diagrams/booleans/). That boolean pass also cleans up the
offset's self-overlaps at concave corners. Curves flatten at the profile tolerance, exactly as in a
boolean.

An inset larger than the region's half-thickness legitimately empties (it emits an empty `<g>`); a
missing or non-geometry reference degrades with a marker.

## Stacking

Because an offset is a baked reference to one region, you can stack several `<x:offset>` at increasing
distances to build **concentric rings** and **sticker halos** — each ring paints in document order, so
a larger halo behind a smaller one behind the artwork reads as a layered outline. When the reference
is outlined text, editing the word re-flows every ring (the offset example does exactly this behind
the word "OFFSET").

## How it lowers

To one plain `<path>` carrying the offset's own paint. No new dependency: it reuses the stroke
primitive and the boolean pass, so the output is the same static SVG subset a boolean emits.

## See also

- [Booleans](/docs/diagrams/booleans/) — the path-algebra engine the offset builds on.
- [Connectors](/docs/diagrams/connectors/) — the other diagramming primitive.
- [Create outlines](/docs/vector-output/create-outlines/) — turning text into the region a halo offsets.
- [Element index](/docs/reference/element-index/) — every `x:` element at a glance.
