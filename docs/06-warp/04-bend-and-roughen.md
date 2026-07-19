---
title: "Bend & roughen"
description: "Flow a whole group along a referenced spine with field=\"bend\", or jitter outlines with deterministic seeded noise using field=\"roughen\"."
---

# Bend & roughen

Two warp fields work differently from the box-bound presets. `field="bend"` flows the whole group
along a **referenced spine path**; `field="roughen"` jitters every outline point with **seeded value
noise**. Both bake into plain `<path>` geometry like every other field.

<Example file="warp-bend" title="Bend along a spine, and seeded roughen" caption="bend flows a rect + outlined text along #spine; roughen jitters outlines deterministically." />

## Bend — flow along a spine

`field="bend"` (Inkscape's *LPE Bend*) maps the envelope's bend-axis extent onto the arc length of a
referenced spine, and its cross axis onto a **normal offset**: the envelope's vertical midline rides
the spine, and past either end the spine extends straight. It is the type-on-a-path *rainbow* field
generalized to arbitrary geometry.

```xml
<path id="spine" d="M40,170 C200,60 420,260 690,110" fill="none"/>
<x:warp field="bend" in="#spine">
  <rect x="0" y="0" width="400" height="44" fill="#1d4ed8"/>
  <x:textbox x="0" y="0" width="400" height="44" align="center" valign="middle"
             outline="true" font-family="-x-google-Anton" font-size="28">BEND ALONG A SPINE</x:textbox>
</x:warp>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `in` | `#id` | — | the spine path *(required)* |
| `align` | `start` \| `middle` \| `end` | `start` | where the envelope sits along the spine's arc length |
| `start` | number (arc length) | `0` | an absolute head-start added after `align` |

`in` accepts a plain open `<path>` / `<line>` / `<polyline>`, or an `x:` element whose **compiled
output** supplies the path — only the geometry is used, its own paint is ignored. `align` and `start`
place the envelope by arc length exactly as they do for type on a path, so `align="middle"` centers
the band on the spine.

## Roughen — seeded noise

`field="roughen"` (Illustrator's *Effect ▸ Roughen*) jitters every outline point by smooth 2-D value
noise. The amplitude is `|bend| · min(hw, hh)/4` at 100 % (`hw`/`hh` are the frame half-extents) and
the wavelength is `100/detail`. The noise lattice is **seeded deterministically** — the same input
always compiles to the same output.

```xml
<x:warp field="roughen" bend="40" detail="8">
  <rect x="48" y="330" width="240" height="80" fill="#14532d"/>
  <x:textbox x="48" y="330" width="240" height="80" align="center" valign="middle"
             outline="true" font-family="-x-google-Anton" font-size="40">ROUGH</x:textbox>
</x:warp>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `bend` | number, −100…100 (%) | `0` | noise amplitude |
| `detail` | number > 0 | `10` | ridge frequency — ridges per 100 user units |

Because roughen jitters points, its effect is strongest on geometry that already has many vertices —
outlined glyph runs bake to dense polylines and roughen crisply, where a bare `<rect>` roughens only
at its four corners.

## How it lowers

Both fields run through the [warp bake](/docs/warp/overview/): flatten → map → refit, emitting baked
`<path>`s inside a `<g>` that carries the element's paint and affine `transform`. Roughen's
deterministic seeding means the emitted geometry is reproducible across compiles.

## See also

- [Warp overview](/docs/warp/overview/) — the bake and the full field catalog.
- [Envelope presets](/docs/warp/envelope-presets/) — the box-bound `bend`-driven presets.
- [Perspective & free distort](/docs/warp/perspective-and-distort/) — the corner-driven fields.
- [Create outlines](/docs/vector-output/create-outlines/) — outline text so it can flow along a spine.
