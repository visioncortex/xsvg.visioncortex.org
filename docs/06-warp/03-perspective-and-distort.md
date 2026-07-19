---
title: "Perspective & free distort"
description: "Corner-driven warp fields — a solved homography that keeps straight lines straight, a bilinear free distort, and the distortion sliders that compose after a preset."
---

# Perspective & free distort

The corner-driven fields deform geometry to four **target corners** you author directly, rather than
by a `bend` amount. `field="perspective"` solves a true projective map; `field="free"` is the cheaper
bilinear blend. Both take a `corners` attribute; neither can be expressed by SVG's affine `transform`,
so xsvg bakes them into `<path>` geometry.

<Example file="warp-perspective" height={360} title="Perspective, free distort & the distortion sliders" caption="corners = TL TR BR BL; distort-h / distort-v compose a taper after a preset." />

## Syntax

```xml
<x:warp field="perspective" corners="108,116 228,116 298,190 38,190">
  <rect x="48" y="110" width="240" height="80" fill="#172554"/>
  <x:textbox x="48" y="110" width="240" height="80" align="center" valign="middle"
             outline="true" font-family="-x-google-Anton" font-size="34">TILTED BACK</x:textbox>
</x:warp>
```

## Corners

`corners` is eight numbers — four points in **TL TR BR BL** order — giving the target position of each
frame corner. It is required by both `perspective` and `free`.

| Attribute | Values | Default | Description |
|---|---|---|---|
| `corners` | `"x0,y0 x1,y1 x2,y2 x3,y3"` (TL TR BR BL) | — | target corners for `perspective` / `free` |

## Perspective — solved homography

`field="perspective"` solves the **8-DOF homography** taking the envelope frame's corners to the
authored `corners` (a Gauss-eliminated DLT over the normalized frame, precomputed once). **Straight
lines stay straight** — and because the bake measures distance to the mapped **chord segment**,
already-straight output is not subdivided, so a perspective bake emits zero waste.

A singular corner configuration (for example collinear targets) degrades like an unknown field. Near
the map's horizon line the denominator is clamped, so extreme quads stay bounded.

## Free distort — bilinear blend

`field="free"` is the cheaper 4-corner **bilinear blend** (Illustrator's Free Distort): each point is
interpolated between the four corners. Edges **shear** rather than converge — there is no straightness
promise, but it is fast and always well-defined.

## Distortion sliders

`distort-h` and `distort-v` (−100…100 %) apply a center-anchored **projective taper composed after
any field**, matching Illustrator's Distortion sliders. Offsets from the frame center divide by
`w = 1 − (dh/2)·nx − (dv/2)·ny` (clamped away from zero): **positive `distort-h` grows the right
side**, **positive `distort-v` grows the bottom**. Because it composes after the field, you can stack
it on a preset:

```xml
<x:warp field="arch" bend="40" distort-h="40">
  <rect x="48" y="330" width="240" height="80" fill="#451a03"/>
  <x:textbox x="48" y="330" width="240" height="80" align="center" valign="middle"
             outline="true" font-family="-x-google-Anton" font-size="34">ARCH + H</x:textbox>
</x:warp>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `distort-h` | number, −100…100 (%) | `0` | horizontal taper; positive grows the right side |
| `distort-v` | number, −100…100 (%) | `0` | vertical taper; positive grows the bottom |

## How it lowers

Each field runs through the [warp bake](/docs/warp/overview/) and emits baked `<path>`s inside a `<g>`
carrying the element's paint and affine `transform`. Perspective's line-preserving output stays as
straight segments; free distort and the tapers subdivide only where the mapped geometry curves.

## See also

- [Warp overview](/docs/warp/overview/) — the bake and the full field catalog.
- [Envelope presets](/docs/warp/envelope-presets/) — the `bend`-driven presets the sliders compose onto.
- [Bend & roughen](/docs/warp/bend-and-roughen/) — the spine and noise fields.
