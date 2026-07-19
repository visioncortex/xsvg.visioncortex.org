---
title: "Warp overview"
description: "The x:warp element bakes an envelope-preset deformation field into plain path geometry — presets, perspective, spine bend and roughen."
---

# Warp overview

`<x:warp field="…">` wraps arbitrary child geometry and applies a **deformation field** to it,
non-destructively. SVG's `transform` is affine-only, so perspective and envelope distortions cannot
ride on vector geometry — instead xsvg **bakes** the field into deformed `<path>`s at compile time.
The children stay editable in the source; the output is exact static SVG.

<Example file="warp-presets" height={760} title="Envelope presets baked to plain paths" caption="Eight Make-with-Warp presets applied to a rect + outlined text; the dashed box is the unwarped source." />

## Syntax

```xml
<x:warp field="flag" bend="60">
  <rect x="0" y="0" width="240" height="80" fill="#14532d"/>
  <x:textbox x="0" y="0" width="240" height="80" align="center" valign="middle"
             outline="true">WAVING</x:textbox>
</x:warp>
```

## The bake

Every warp is the same three steps, parameterized only by the field and a tolerance:

> **flatten → map → refit.** Flatten each source path to a polyline within a Hausdorff `tolerance`;
> **map** every vertex through the field; **refit** the mapped polyline back to `<path>` segments.

Bézier curves are affine-invariant, so an affine field could map control points directly — but a
**non-affine field must go through flatten → map → refit** (mapping control points alone is wrong).
Chords are subdivided **adaptively**: a segment splits while its mapped midpoint deviates from the
mapped chord by more than `tolerance`, so long straight edges curve smoothly under a nonlinear field
while line-preserving fields (perspective) emit zero waste.

The `tolerance` is the **graded quality knob**: the quality profile sets it (shapes bake at looser
tolerances than glyph runs), so tightening the profile trades path size for fidelity. It is the only
approximation step — the emitted `<path>` is exact SVG. Coordinates quantize to a decimal grid and
serialize as relative commands with implicit repetition, so dense glyph runs stay compact.

## What can be warped

Children first lower to pure `<path>` geometry:

- **Basic shapes** convert directly — `<rect>` (including a rounded `<rect>`, whose corners lower to
  arcs), `<circle>`, `<ellipse>`, `<polygon>`, `<polyline>`, and `<path>` as-is.
- **xsvg text** participates through its **outlined** form — set `outline="true"` on `<x:textbox>`,
  or use `<x:textpath>` output. Live `<text>` cannot be warped.
- **Nested `<x:warp>`s** bake innermost-first.

The **pre-warp union bbox** of that geometry is the envelope frame, so a preset scales with the art
it warps. A child that cannot become path geometry (live `<text>`, `<line>`, `<image>`, `<use>`) is
**skipped with a marker comment** — a warp never silently emits unwarped content.

## The field families

| Family | Fields | Page |
|---|---|---|
| **Envelope presets** | `arch` · `flag` · `rise` · `wave` · `fisheye` · `inflate` · `squeeze` · `twist` | [Envelope presets](/docs/warp/envelope-presets/) |
| **Arc & shell** | `arc` · `arc-lower` · `arc-upper` · `bulge` · `fish` · `shell-lower` · `shell-upper` | [Envelope presets](/docs/warp/envelope-presets/) |
| **Corner-driven** | `perspective` · `free`, plus `distort-h` / `distort-v` | [Perspective & free distort](/docs/warp/perspective-and-distort/) |
| **Spine & noise** | `bend` · `roughen` | [Bend & roughen](/docs/warp/bend-and-roughen/) |

## Attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `field` | one of the fields above | — | selects the deformation field |
| `bend` | number, −100…100 (%) | `0` | preset strength; clamped |
| `axis` | `h` \| `v` | `h` | the bend axis; ignored by radial/rotational presets |
| `corners` | `"x0,y0 x1,y1 x2,y2 x3,y3"` (TL TR BR BL) | — | target corners for `perspective` / `free` |
| `distort-h`, `distort-v` | number, −100…100 (%) | `0` | projective taper composed **after** the field |
| `in` | `#id` | — | the spine path for `bend` |
| `align`, `start` | as type-on-a-path | `start`, `0` | place the `bend` envelope along the spine |
| `detail` | number > 0 | `10` | `roughen` ridge frequency (ridges per 100 user units) |

An unknown or absent `field`, or no usable geometry, emits the children **unwarped behind a marker**.
A path that fails to bake keeps its original geometry, and non-finite coordinates never reach output.

## How it lowers

The compiler emits the baked `<path>`s inside a single `<g>` that carries the element's paint and its
affine `transform` (affine, so it composes after the bake for free). At the current profile grades the
bake emits the tolerance-graded polyline (`M`/`L`/`Z`), which stays within tolerance of the true mapped
geometry by construction.

## See also

- [Envelope presets](/docs/warp/envelope-presets/) — the fifteen Make-with-Warp presets and the `bend` parameter.
- [Perspective & free distort](/docs/warp/perspective-and-distort/) — corner-solved homography and the distortion sliders.
- [Bend & roughen](/docs/warp/bend-and-roughen/) — flow a group along a spine, or jitter outlines with seeded noise.
- [Create outlines](/docs/vector-output/create-outlines/) — lower glyphs to `<path>` so text can be warped.
