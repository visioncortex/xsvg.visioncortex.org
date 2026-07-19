---
title: "Booleans"
description: "Pathfinder-style path algebra — union, subtract, intersect, exclude — over filled regions, baked to one plain <path>; operands as children or by reference, composable with warp."
---

# Booleans

`<x:boolean>` performs **Pathfinder-style boolean operations** over filled regions: union, subtract,
intersect, and exclude. The children stay editable in the source; the compiler folds them into one
combined region and emits it as a single plain `<path>`. Any operand that can become a filled shape —
a basic shape, outlined text, or another `x:` element — participates.

<Example file="boolean" height={420} title="The four boolean operations" caption="union (one silhouette), subtract (text punched from a plate), intersect (the overlap lens), exclude (overlap becomes a hole), and a boolean composed inside a warp." />

<Example file="boolean-refs" height={420} title="Operands by reference" caption="A venn lens derived from circles that still draw themselves; one motif stamped at several <use> offsets and fused; a union reused as an operand; live text punched by reference." />

## Syntax

```xml
<x:boolean op="subtract" fill="#1d4ed8">
  <rect x="40" y="40" width="280" height="90"/>
  <x:textbox x="40" y="40" width="280" height="90" align="center" valign="middle"
             outline="true">PUNCH</x:textbox>
</x:boolean>
```

## Operations

| `op` | Effect |
| --- | --- |
| `union` *(default)* | merge every operand into one region |
| `intersect` | keep only where all operands overlap |
| `subtract` | remove every later operand from the first (document order is back-to-front, so this is Illustrator's *Minus Front*) |
| `exclude` | XOR — the overlap becomes a hole |

`union`, `intersect`, and `exclude` are symmetric; `subtract` is order-sensitive. Each operand is
first resolved as a region under **its own `fill-rule`** (default `nonzero`), which also cleans up any
self-intersections, then the op folds over the operands. The operations themselves are integer-exact
and deterministic; curved operands flatten at the profile tolerance.

## Paint

The paint attributes go on `<x:boolean>` and style the **result** — a boolean yields one region, so
per-child paint is ignored.

| Attribute | Applies to |
| --- | --- |
| `op` | the operation (see above); default `union` |
| `fill`, `stroke`, `stroke-width`, `opacity`, `transform`, … | the result's paint |

The result's contours carry deterministic opposite windings for holes, so it renders identically
under either fill rule.

## Operands

**As children.** Each element child is one operand, lowered to path geometry exactly like `<x:warp>`
children: basic shapes convert, text participates through its outlined form, and nested `x:` elements
compose (a boolean can wrap a warp and a warp can wrap a boolean).

**By reference.** A `<use href="#id">` child is an operand that **borrows** the target's geometry
without consuming it — the target keeps rendering wherever it is. This is the derived-shape form: a
venn lens over circles that still draw themselves, or a plate punched by a motif that is also its own
artwork. The `<use>` element's own `transform` and its `x`/`y` offset both apply (composed in SVG's
order), so one motif can be stamped at several placements and fused. The operand's `fill-rule` is
read from the `<use>` element itself; legacy `xlink:href` is accepted.

> **Binding time.** A `<use>` operand is resolved **at compile time** — it borrows a snapshot of the
> target's geometry, unlike SVG's own live `<use>`. Later animation, script mutation, or any change
> to the target does not update geometry derived from it; re-compile to re-derive.

## Stroke expansion

A plain-shape operand's **stroke ink joins its region** (Illustrator expands strokes before
Pathfinder): the stroke is converted to fill geometry, honoring `stroke-width`, `stroke-linecap`,
`stroke-linejoin`, and `stroke-dasharray` / `stroke-dashoffset`. An `evenodd` operand pre-resolves
its fill (evenodd) union stroke (nonzero) so the mixed fill rules never meet. `<use>` and nested-`x:`
operands stay geometry-only.

## Degradation

A child that cannot become path geometry is skipped with a marker — never silently dropped from the
algebra. An unknown `op` emits the children un-combined behind a marker. A legitimately empty result
(for example, a disjoint `intersect`) emits an empty `<g>`; an element with no usable geometry at all
emits only a marker. Plain viewers skip the subtree entirely.

## How it lowers

To one plain `<path>` carrying the boolean's own paint (holes expressed as opposite-wound contours).
The backend is the `i_overlay` engine behind a swappable seam. v1 supports the four single-output ops
only — no multi-output Pathfinder modes (Divide / Trim / Merge).

## See also

- [Offset (inset & outset)](/docs/diagrams/offset/) — grows or shrinks a region, sharing the same boolean pass for cleanup.
- [Connectors](/docs/diagrams/connectors/) — the other diagramming primitive.
- [Warp](/docs/warp/overview/) — compose a boolean under a warp, or vice versa.
- [Create outlines](/docs/vector-output/create-outlines/) — how text becomes the geometry a boolean can punch.
