---
title: "Mesh gradients"
description: "Corner colors on a quad/tri mesh — smooth multi-focal blends, cracks and feathering, baked to tiny texel-aligned PNGs that any renderer's bilinear filter reconstructs."
---

# Mesh gradients

A mesh gradient paints **corner colors on a quad-dominant mesh**: each face carries a color at each
of its corners, and the color blends across the face. It expresses smooth multi-focal blends — a
sky, a gel highlight, a photographic wash — that no single linear or radial gradient can. SVG 2
specified a `<meshgradient>` element, but every browser dropped it; xsvg keeps the same idea and
lowers it to a **tiny texel-aligned PNG** that the renderer's own bilinear image filter
reconstructs, so the result draws in any SVG engine.

<Example file="mesh" height={680} title="Mesh gradients: quads, triangles, cracks, and grid sugar" caption="Smooth two-quad region, the four-corner bilinear twist, a crack from disagreeing edge colors, a barycentric triangle fan, grid-sugar, and an Inkscape/SVG2 meshgradient." />

<Example file="aqua" title="Aqua gel buttons" caption="Each button is two meshes: an opaque gel body plus a feathered gloss overlay whose shape is its own capsule mesh — shine from per-vertex alpha." />

## Syntax

The `points` attribute holds the shared vertices in SVG's own `<polygon points>` syntax (`x,y` pairs,
comma or whitespace separated). Each `<x:face>` names its corners by index in `v` and gives one color
per corner in `fill`.

```xml
<x:mesh points="0,0 120,0 240,10  0,90 120,80 240,100">
  <x:face v="0 1 4 3" fill="#e11 #fa0 #3b7 #06c"/>
  <x:face v="1 2 5 4" fill="#fa0 #ff5 #09f #3b7"/>
  <x:face v="3 4 5"   fill="#06c #3b7 #09f"/>
</x:mesh>
```

## A mesh as paint

Give an `<x:mesh>` an `id` and any shape can name it — like a `<meshgradient>` — as its **fill, its
stroke, or both**:

```xml
<path d="…" fill="url(#sky)" stroke="url(#rim)" stroke-width="6"/>
```

A fill paints the mesh inside a clip of the geometry; a stroke paints it inside a clip of the stroke
outline (width, caps, joins, dashes included). It works on the basic shapes, on
[booleans](/docs/diagrams/booleans/) and [offsets](/docs/diagrams/offset/), and — outlined — on text,
and it inherits from an ancestor like any paint. The mesh's coordinates are the painted element's
user space, or, with **`units="objectBoundingBox"`** on the `<x:mesh>`, fractions of the element's
bounding box — one mesh then fits every shape it paints. The reference is baked, so editing the mesh
re-emits what it paints.

## Faces, corners, and interpolation

Each `<x:face v="…">` names **3 or 4** counter-clockwise vertex indices into `points`, and the same
number of corner colors in `fill`. A single color replicates to all corners.

Quad corners map to local `(u,v)` coordinates as `0→(0,0) 1→(1,0) 2→(1,1) 3→(0,1)`; color
interpolates **bilinearly** (inverse-bilinear for non-rectangular quads), and **barycentrically**
for triangles. Interpolation happens in **linear-light RGB**.

### Attributes

| Attribute | On | Values | Description |
| --- | --- | --- | --- |
| `points` | `<x:mesh>` | `x,y` pairs (polygon syntax) | the shared vertices all faces index into |
| `v` | `<x:face>` | 3 or 4 CCW vertex indices | the face's corners, in order |
| `fill` | `<x:face>` | one color per corner | `#rgb` / `#rrggbb`, or with alpha `#rgba` / `#rrggbbaa`; one color replicates to all corners |

## Colors

Corner colors accept `#rgb` / `#rrggbb`, and the alpha forms `#rgba` / `#rrggbbaa`. Per-corner
transparency is **feathering** — the alpha channel is fitted and blended just like the color, so a
region can fade softly to nothing (the gloss overlays in the aqua example are pure feathering).

## Cracks and regions

An edge shared by two faces is **smooth** if and only if both faces agree on the color *and* alpha
at each shared endpoint. A mismatch is a **crack** — a hard discontinuity. A **region** is a maximal
set of faces connected through smooth edges. Cracks need no extra markup: they fall directly out of
the colors you write. (The "crack" panel in the example shares an edge between two quads whose colors
disagree, so it stays hard-split; the "smooth mesh" panel agrees on its shared edge, so its two quads
fit as one region.)

**T-junctions** are supported both on cracks (each side clips independently) and inside smooth
regions: a hanging node whose color and alpha match the coarse edge's interpolation at that point
joins the faces into one region; a mismatch is a crack, as always.

## Grid sugar

The smooth common case needs no indices. Give the mesh a box and a cell count, and one `fill`
attribute of per-vertex colors:

```xml
<x:mesh x="48" y="446" width="600" height="52" cols="3" rows="2"
        fill="#1e1b4b #7c3aed #1e1b4b #1e1b4b
              #7c3aed #fde68a #7c3aed #1e1b4b
              #1e1b4b #7c3aed #1e1b4b #1e1b4b"/>
```

This lays a `cols×rows`-cell grid over the box, with `fill` holding the `(cols+1)·(rows+1)` **vertex**
colors, row-major. Per-vertex colors are smooth by construction (one region), and the form desugars
to exactly the indexed mesh. Use the indexed form when you need cracks or irregular geometry.

| Attribute | Values | Description |
| --- | --- | --- |
| `x` `y` `width` `height` | length | the grid's box |
| `cols` `rows` | 1..64 | cell counts along each axis |
| `fill` | `(cols+1)·(rows+1)` colors | vertex colors, row-major |

A malformed grid (wrong color count, `cols`/`rows` outside 1..64, non-positive extent) degrades with
a marker.

## Inkscape / SVG 2 `<meshgradient>` input

Inkscape is the only major tool that authors SVG 2 mesh gradients, and no browser renders them —
xsvg compiles them. A shape whose `fill` references a `<meshgradient>` lowers through the same
pipeline: each Coons patch (four cubic edges, four corner colors) tessellates into the straight-quad
mesh, the shape's geometry becomes the clip, and the stroke (if any) re-emits on top.

Covered dialect: `meshrow` / `meshpatch` / `stop` with one `c`/`C`/`l`/`L` edge per stop,
`stop-color` (as an attribute or inside `style`, hex and alpha forms) with `stop-opacity` honored
(feathering), the standard edge/corner inheritance (a patch after the first inherits its left edge
reversed from its neighbour; later rows inherit top edges from above), `gradientTransform`,
`gradientUnits="objectBoundingBox"`, and `type="bicubic"` (smoothstep-eased so adjacent patches meet
C¹ and the bilinear Mach bands at seams disappear). The reference is compile-time baked, and the
`<meshgradient>` definition itself is consumed — the output carries only the paint it lowers to. An
unparseable dialect leaves the element as authored with a marker (unrendered live, exactly as in a
browser).

## How it lowers

Render, then refit. The mesh is rasterized in memory at a profile-graded resolution (in linear-light,
with per-pixel region labels), then each region is refit with a seam-free shared-vertex grid field —
one global least-squares fit, grown until the residual passes the profile tolerance — and serialized
as a **tiny PNG** (often 2×2 texels, ~40 bytes of base64). The image is placed so its **texel centers
land exactly on the grid vertices**, so the renderer's own smooth bilinear image filter reconstructs
the fitted field. Each region is clipped by the **outline of its faces**, so cracks stay
geometry-sharp at any zoom and the clip stays small. A region whose fit collapses to a constant emits a plain
`<path fill>` instead (with `fill-opacity` when translucent). Feathering serializes an **RGBA** PNG;
fully opaque regions stay RGB. Degradations (bad indices, color-count mismatch, degenerate extent)
skip with markers.

Two v1 limits follow from the reconstruction: `image-rendering` must remain default (smooth) for the
bilinear filter to hold, and alpha interpolates in straight (unpremultiplied) form — so a steep alpha
cliff against a strongly different color can fringe slightly at extreme zoom.

## See also

- [Warp](/docs/warp/overview/) — mesh output is geometry-plus-image, and composes under a warp.
- [Filters](/docs/filters/overview/) — the rest of xsvg's paint-and-pixels vocabulary.
- [Graceful degradation](/docs/introduction/graceful-degradation/) — what a plain viewer shows for an uncompiled mesh.
- [Element index](/docs/reference/element-index/) — every `x:` element at a glance.
