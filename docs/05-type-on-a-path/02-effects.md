---
title: "Path effects"
description: "The effect field — follow stays native, skew and ribbon shear a height profile, rainbow rotates and bends along the arc."
---

# Path effects

The `effect` attribute on `<x:textpath>` picks the **field** that places the run's glyphs on the
curve. One choice — `follow` — stays native live SVG; the rest are geometry transforms of the outlined
run. This page details each, and when a run outlines its glyphs versus staying native `<text>`.

<Example file="textpath-effects" height={340} title="skew vs ribbon vs follow" caption="skew keeps verticals upright; ribbon tilts them perpendicular to the path; follow is SVG's own textPath — live and selectable." />

## follow — native `<textPath>`

`effect="follow"` is the *non-deforming* follow: it lowers to live `<text><textPath href="#id">`, so
glyphs stay **undeformed** and the text stays **selectable** — the renderer does the following.
`align` and `start` compile to `startOffset` (resolved against the path's arc length and the measured
run width), and `baseline-shift` is forwarded as the presentation attribute. It needs no font bytes;
the trade-off is renderer-dependent glyph placement and no warping. It is the one effect whose output
uses `<textPath>` rather than baked geometry.

## skew — vertical shear

`effect="skew"` (the default) reads the path as a **height profile** `f(x)` and shifts every outline
point vertically:

```text
(x, y) → (x, y + f(x) − baseline-shift)
```

Glyphs stay **upright**, vertical strokes stay vertical, and horizontal edges tilt by the local slope
`f'(x)` — the vertical shear Illustrator calls *Skew*. There is no arc-length reparameterization and no
normal offset, which makes it the cheapest field. The path is treated as a height field, so it should
be single-valued in `x`. Skew outlines the run and bakes one `<path>` per run. It is also the
**no-font fallback** for the other height-profile effect.

## ribbon — normal-offset heights

`effect="ribbon"` is skew's complement: the baseline rides the same height profile, but glyph heights
offset along the profile's **normal** instead of straight up:

```text
(x, y) → (x, f(x)) + (y − baseline-shift)·N(x)
```

with `N(x)` the profile's unit normal. Vertical strokes tilt perpendicular to the path while
horizontal strokes stay parallel to it — the twisting-ribbon look. Like skew, and unlike rainbow,
there is no arc-length reparameterization; the path is read as a height field, single-valued in `x`.
Ribbon outlines the run and bakes to `<path>` geometry.

## rainbow — arc-length follow and deform

`effect="rainbow"` reparameterizes the run by **arc length** (text-`x` becomes distance `s` along the
path) and maps every outline point onto the curve with a normal offset:

```text
(x, y) → P(s) + (y − baseline-shift)·N(s),   s = x
```

where `P(s)` is the path point at arc length `s` and `N(s)` is the unit normal (the tangent rotated
+90° in the y-down coordinate system). This both **rotates and deforms** glyphs along the curve: each
point maps independently, so strokes compress on the inside of a bend and stretch on the outside —
letters rotate rigidly and keep constant width and spacing on any curve. Unlike skew there is no
single-valued-in-`x` restriction, so loops and vertical segments are fine, and beyond either end the
frame extends straight along the end tangent so a long run continues rather than bunching. This is the
rainbow/rotate-along-an-arc effect. The bake is native (in `xsvg-core`) and runs at the tight,
quality-graded text tolerance. Rainbow outlines the run and bakes to `<path>` geometry.

## How the height-profile effects relate

Same skeleton, two independent choices — how advance is measured, and where each glyph's "up" points:

| effect | advance measured… | glyph "up" points… | consequence |
| --- | --- | --- | --- |
| skew | along **x** | straight up | upright letters; x-extent preserved |
| ribbon | along **x** | along the **normal** | letters lean with the slope; glyphs stretch on steep sections |
| rainbow | along **arc length** | along the **normal** | letters rotate rigidly, constant width/spacing on any curve |

## Native versus outlined

- **Native `<text>`** (no font bytes needed, selectable): `follow` and `stair`.
- **Outlined and baked to `<path>`** (needs the glyph outliner): `skew`, `ribbon`, `rainbow`.

If the outliner is unavailable, the height-profile effects (`skew`, `ribbon`) **degrade to the
stair-step lowering** — the same field applied per-glyph instead of per-point. Rainbow, or a run whose
height profile can't be sampled, degrades to a straight `<text>` at the element's position. The
document never breaks.

## See also

- [Type on a path overview](/docs/type-on-a-path/overview/) — the surface and `baseline-shift`.
- [Placement](/docs/type-on-a-path/placement/) — `align`, `start`, and the stair-step (`effect="stair"`).
- [Create outlines](/docs/vector-output/create-outlines/) — the outliner the warping effects use.
- [Warp overview](/docs/warp/overview/) — the shared geometry-transform pipeline.
