---
title: "Envelope presets"
description: "The fifteen Make-with-Warp presets — arch, flag, rise, wave, fisheye, inflate, squeeze, twist, and the arc & shell families — driven by the bend parameter."
---

# Envelope presets

Envelope presets are analytic deformation fields evaluated over the source geometry's bounding box.
They mirror Illustrator's **Make with Warp** menu: pick a `field`, dial the `bend`, and the field is
baked into plain `<path>` geometry. All fifteen presets are fold-free at every bend.

<Example file="warp-presets" height={760} title="The displacement & radial presets" caption="arch, flag, rise, wave, fisheye, inflate, squeeze, twist — each on a rect + outlined text (dashed = source box)." />

<Example file="warp-presets-arc" height={760} title="The arc & shell families" caption="arc, arc-lower/upper, bulge, fish, shell-lower/upper complete the Make-with-Warp catalog." />

## Syntax

```xml
<x:warp field="arch" bend="60">
  <rect x="0" y="0" width="240" height="80" fill="#172554"/>
  <x:textbox x="0" y="0" width="240" height="80" align="center" valign="middle"
             outline="true" font-family="-x-google-Anton" font-size="44">ARCH</x:textbox>
</x:warp>
```

## The `bend` parameter

Every preset is driven by one number, `bend` (−100…100 %). The bake normalizes the envelope frame to
`(u, v)` in `[−1, 1]²` (`u` runs along the bend axis) and sets the amplitude **`A = bend · L/4`**,
where `L` is the frame's bend-axis extent — so a preset scales with the art it warps. Positive `bend`
bows one way; **negative `bend` reverses it** (pincushion, barrel, arc-down). `bend="0"` is identity.

The `axis` attribute (`h` default, or `v`) picks the bend axis for the displacement family and for
`squeeze`; the radial and rotational presets are symmetric and ignore it.

## Displacement presets

These shift each point along the cross axis by a profile of `u`. Positive `bend` bows **up**
(`axis="h"`) or **right** (`axis="v"`).

| Preset | Profile | Shape |
|---|---|---|
| `arch` | `Δ = A(1 − u²)` | both edges ride one parabola |
| `flag` | `Δ = A·sin(πu)` | one full sine, uniform through the height |
| `rise` | `Δ = A·u` | a linear ramp (a pure shear profile) |
| `wave` | `Δ = A·sin(πu − (π/4)(v+1))` | a flag whose phase advances through the height |

## Radial & rotational presets

These evaluate over the whole frame with `r̂` the corner-normalized radius (1 at the corners, so
**corners stay pinned**). The fisheye and twist profiles are eased (squared), so the gradient also
vanishes at the corners — the fields never fold into corner slivers.

| Preset | Effect | Notes |
|---|---|---|
| `fisheye` | radial magnify, `s = 1 + b(1 − r̂²)²` | negative `bend` = pincushion |
| `inflate` | per-axis bulge, `sx = 1 + (b/2)(1 − ny²)`, `sy = 1 + (b/2)(1 − nx²)` | every edge bows outward |
| `squeeze` | waist pinch, `u′ = u·(1 − (b/2)(1 − v²))` | negative `bend` = barrel; honors `axis` |
| `twist` | angle-true swirl, `θ = b·(π/2)(1 − r̂²)²` | the center rotates most, corners pinned |

## Arc & shell families

The **scale family** rescales the cross-axis coordinate by a profile of `u` about an anchor:

| Preset | Effect |
|---|---|
| `bulge` | both edges bow outward about the midline (`v′ = v·s`, `s = 1 + (b/2)(1 − u²)`) |
| `arc-lower` / `arc-upper` | pin one edge, apply the same `s` from it — the free edge arcs at its center |
| `shell-lower` / `shell-upper` | pin one edge with the inverted profile `s = 1 + (b/2)u²` — the free edge's corners flare, its center stays |
| `fish` | neutral nose, bulged body, tail pinched to `1 − b/2` (`s = 1 + (b/2)(1 − u² − (1+u)²/4)`) |

**`arc`** is the one polar field: the box bends into an **annular sector** spanning `Θ = bend·π` (a
semicircle at 100 %). The midline becomes an arc of radius `R = L/Θ` and keeps its length,
perpendicular lines become radii, and the envelope relocates — `arc` has no pinned corners. Negative
`bend` arcs the other way.

## How it lowers

Each preset is a field function run through the [warp bake](/docs/warp/overview/): flatten → map → refit,
emitting the baked geometry inside a `<g>` that carries the element's paint and affine `transform`.
The output is a plain `<path>` polyline within tolerance of the true mapped curve.

## See also

- [Warp overview](/docs/warp/overview/) — the bake, what can be warped, and the field catalog.
- [Perspective & free distort](/docs/warp/perspective-and-distort/) — the corner-driven fields and distortion sliders.
- [Bend & roughen](/docs/warp/bend-and-roughen/) — the spine and noise fields.
- [Create outlines](/docs/vector-output/create-outlines/) — outline text so it can be warped.
