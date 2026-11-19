---
title: "Corners"
description: "x:corners rounds, chamfers or scallops any corner of a rect, polygon, polyline or path — a design tool's live corner as one attribute, compiled to exact arcs."
---

# Corners

A design tool's **live corner** as an attribute. `x:corners` rounds any corner of a `<rect>`,
`<polygon>`, `<polyline>` or `<path>`, and the shape stays what it was — a rect with radius 8 on two
corners, not six segments. Because a radius is a design property rather than geometry, it can be a
theme token, and "round the top corners to 8" is one attribute. Uncompiled, the shape just renders
sharp.

<Example
  title="Round, chamfer, inverted — per corner"
  caption="Every corner rounded; only the top two (anchors 0 and 1); a chamfered triangle; and a rect mixing styles per anchor."
  src={`<svg viewBox="0 0 560 170" xmlns="http://www.w3.org/2000/svg" xmlns:x="https://xsvg.visioncortex.org">
  <rect width="560" height="170" fill="#f8fafc"/>
  <rect x="20" y="30" width="110" height="110" fill="#6366f1" x:corners="24"/>
  <rect x="155" y="30" width="110" height="110" fill="#0ea5e9" x:corners="0:28 1:28"/>
  <polygon points="345,30 410,140 280,140" fill="#f59e0b" x:corners="14" x:corner-style="chamfer"/>
  <rect x="430" y="30" width="110" height="110" fill="#e11d48" x:corners="22" x:corner-style="round 1:inverted 3:chamfer"/>
</svg>`}
/>

## Syntax

```xml
<rect x="20" y="20" width="200" height="120" x:corners="24"/>              <!-- every corner -->
<path d="M0 0 L100 0 L100 50 L0 50 Z" x:corners="0:8 1:var(radius-md)"/>   <!-- anchors 0 and 1 -->
<polygon points="0,0 100,0 50,86.6" x:corners="10" x:corner-style="chamfer"/>
<rect width="100" height="60" x:corners="12" x:corner-style="round 1:inverted"/>
```

| Attribute | Values | Description |
| --- | --- | --- |
| `x:corners` | radius, or `anchor:radius` pairs | one radius for every corner, or radii for some; a radius is a length or a `var()` token |
| `x:corner-style` | `round` *(default)* / `chamfer` / `inverted`, or `anchor:style` pairs | the corner's shape — an exact arc, a straight cut, or a scallop bulging inward |

A pair wins over the single value at its anchor. On a `<rect>`, corners replace `rx`/`ry`.

## Anchors

Corners are numbered by the shape's points in order: a `<rect>` **0–3 clockwise from the top-left**,
a `<polygon>` by its points, a `<path>` by its on-curve points from the first `M`. A `<polyline>` and
an unclosed path are open, so their two ends have no corner.

## How a radius fits

The geometry is Illustrator's. A radius trims each side of its corner, and the trims on a side never
exceed its length: a lone corner may take a whole edge (a square's one corner at its side length is
a quarter circle), and two corners asking for more than the edge between them scale to share it. A
curved side is trimmed along its arc length and keeps the rest of its curve.

## Where it applies

In the element's **geometry**, so everything that reads the shape sees the rounding:
[booleans](/docs/diagrams/booleans/), [offsets](/docs/diagrams/offset/), [warps](/docs/warp/overview/)
and `in="#id"` references. A nested `<svg>` takes `x:corners` too — its clip becomes a rounded frame,
for a cropped picture with rounded corners.

## How it lowers

To one `<path>` with exact circular arcs (`A` commands), the element's other attributes kept and the
corner attributes spent.

## See also

- [Booleans](/docs/diagrams/booleans/) — combine rounded shapes.
- [Theming](/docs/theming/overview/) — share a radius as a token.
