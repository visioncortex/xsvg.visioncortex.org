---
title: "Connectors"
description: "A line bound to two elements' edges that re-derives itself whenever a box moves — the diagramming primitive SVG lacks, with straight, orthogonal, and curved routes plus tinted arrowheads."
---

# Connectors

A `<x:connector from="#a" to="#b">` is a line bound to two elements — the diagramming primitive
Google Drawings has and SVG lacks. It resolves each endpoint to its **bounding box**, computes a
route between the two edges, and lowers to a plain `<path>` carrying the connector's own stroke.
Because it references its endpoints, moving or resizing a box **re-derives** the line.

<Example file="connectors" title="Four connector routes" caption="straight (edge-clipped), x-major and y-major orthogonal rails, and a curve — with end and both arrowheads tinted to each stroke." />

## Syntax

```xml
<rect id="a" x="48" y="86" width="110" height="52"/>
<rect id="b" x="250" y="150" width="110" height="52"/>
<x:connector from="#a" to="#b" route="x-major" arrow="end" stroke="#475569" stroke-width="2"/>
```

`from` and `to` each point at any referenceable element — a shape, a group, or an `x:` element's
compiled output. The connector reads the target's bounding box; it does not need the target to be a
particular kind of element.

## Endpoints — anchors & raw points

By default each end attaches to the target's bounding box and the connector picks the side facing the
other end. Two overrides take control of exactly where a line meets:

- **Forced anchor** — `from="#id:anchor"` / `to="#id:anchor"` pins which point of the box the line
  meets: an **edge** (`left` · `right` · `top` · `bottom`), a **corner** (`left-top` · `right-top` ·
  `left-bottom` · `right-bottom`), or `center`. This lets both ends leave the *same* side — e.g. two
  boxes side by side whose connectors both exit the top and arc over.
- **Raw point** — `to-point="x,y"` (or `from-point="x,y"`) aims an end at an exact coordinate, with
  no target element at all.

<Example file="connector-anchors" title="Forced anchors and raw points" caption="#id:anchor pins the attach side or corner (both ends leave the top, or the bottom); to-point aims at a bare coordinate." />

```xml
<x:connector from="#a:left-top" to="#b:top" route="curve" arrow="both"/>
<x:connector from="#p:right" to-point="470,312" route="curve"/>
```

## Routes

| `route` | Shape |
| --- | --- |
| `straight` *(default)* | direct line, endpoints clipped to each box's edge along the center-to-center ray |
| `x-major` | orthogonal rail, **horizontal-first** — exits the facing side and elbows at the horizontal midpoint (H–V–H) |
| `y-major` | orthogonal rail, **vertical-first** — exits top/bottom and elbows at the vertical midpoint (V–H–V) |
| `curve` | a cubic with tangents along the dominant axis (horizontal when the boxes are side-by-side, vertical when stacked) |

## Arrowheads

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `arrow` | `end` / `start` / `both` / `none` | `end` | which ends get a filled triangle, tinted to the stroke |
| `arrow-size` | length | `max(3.5·stroke-width, 7)` | the arrowhead height |

The arrowhead is a **computed triangle**, not an SVG `<marker>`: its tip sits exactly on the endpoint
(no overshoot into the box), and its size is a plain attribute. The base midpoint is found by walking
the actual route back from the tip until the straight-line (chord) distance equals `arrow-size` — for
a curve that point lies *on the curve*, so the triangle's base sits on the stroke and its axis matches
the visible exit angle. The drawn line is then trimmed to that base (the cubic is split with de
Casteljau; straight and orthogonal segments are shortened by `arrow-size`), so the stroke never
protrudes past the sharp tip regardless of its width.

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `from` | `#id` or `#id:anchor` | the source element (its bounding box is one endpoint); an optional anchor forces the attach point |
| `to` | `#id` or `#id:anchor` | the target element, with an optional forced anchor |
| `from-point` / `to-point` | `x,y` | attach an end to a raw coordinate instead of an element |
| `route` | `straight` / `x-major` / `y-major` / `curve` | route shape (see above); default `straight` |
| `arrow` | `end` / `start` / `both` / `none` | arrowhead placement; default `end` |
| `arrow-size` | length | arrowhead height; default `max(3.5·stroke-width, 7)` |
| `stroke`, `stroke-width`, … | paint | the connector's own stroke (the arrowhead tints to it) |

## Baked reference

The route is recomputed from the endpoints' boxes, so a connector is a **compile-time reference**:
moving or resizing either endpoint re-emits the connector (the incremental dependency scan covers
both `from` and `to`). A missing or non-geometry endpoint degrades with a marker. Like every baked
reference, the connector borrows a snapshot at compile time — later animation or script mutation of
an endpoint does not move the line; re-compile to re-derive.

## How it lowers

To one plain `<path>` for the routed line (edge-clipped and, where arrowed, trimmed to the arrowhead
base), plus a filled `<path>` triangle per arrowhead. No SVG `<marker>`, no runtime.

## See also

- [Booleans](/docs/diagrams/booleans/) — combine diagram shapes with path algebra.
- [Offset (inset & outset)](/docs/diagrams/offset/) — grow or shrink a region for halos and rings.
- [Element index](/docs/reference/element-index/) — every `x:` element at a glance.
