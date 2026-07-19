---
title: "Type on a path overview"
description: "Ride a text run along any curve — native follow, or glyphs deformed with skew and ribbon, plus baseline-shift."
---

# Type on a path overview

`<x:textpath in="#path">` binds a text run to an open path so the run rides the curve. The run is
shaped on a flat baseline, then either lowered to SVG's own `<textPath>` (live, selectable) or
**outlined** (see [create outlines](/docs/vector-output/create-outlines/)) and warped onto the path.
The `effect` attribute picks which — text on a path is a specialization of the geometry-transform
pipeline, and each effect is just a different **field** applied to the outlined run.

<Example file="textpath" height={420} title="Text on a path" caption="skew shears upright glyphs onto a wave; rainbow rotates and bends them along an arc, with baseline-shift floating a second run off the same path." />

## Syntax

```xml
<path id="wave" d="M0,40 C60,0 140,80 200,40" fill="none"/>
<x:textpath in="#wave" effect="skew" font-family="-x-google-Anton" font-size="32" fill="#111">rides the wave</x:textpath>
```

`in="#id"` is required and points at the reference path — an open `<path>`, `<line>`, or `<polyline>`,
or an `x:` element whose compiled output supplies the path. Like `clipPath`, only its **geometry** is
used; its own paint is ignored. Type on a path is **single line only** — a path is a 1-D track, so
`inline-size` and wrapping do not apply, and a run longer than the path continues past its end.

## The effects at a glance

`effect` selects how glyphs sit on the curve:

- **`follow`** — lowers to SVG's native `<text><textPath>`. Glyphs stay undeformed and selectable; the
  renderer does the following. Needs no font bytes.
- **`skew`** *(default)* — shears the run vertically onto a height profile: glyphs stay **upright**,
  verticals stay vertical, horizontal edges tilt by the local slope. It is also the no-font fallback.
- **`ribbon`** — like skew, but glyph heights offset along the profile's **normal**, so verticals
  **tilt with the curve** — the twisting-ribbon look.
- **`rainbow`** — reparameterizes by arc length so glyphs **rotate and bend** rigidly along the curve,
  keeping constant width and spacing on any bend.
- **`stair`** — per-glyph steps on live `<text>`: upright, undeformed, selectable, no font bytes.

See [effects](/docs/type-on-a-path/effects/) for the full behavior of each, and [placement](/docs/type-on-a-path/placement/) for
`align`, `start`, and the stair-step.

## baseline-shift

`baseline-shift` (a length, default `0`) offsets the run's baseline from the path along the local
**normal** — positive lifts the text above the path, matching SVG `baseline-shift` semantics. It
applies to every effect. Two runs on the same path with opposite shifts sit above and below it — one
line of large text riding the curve, a caption hanging beneath.

## Attributes

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `in` | `#id` *(required)* | — | The reference path; only its geometry is used. |
| `effect` | `skew` / `rainbow` / `stair` / `ribbon` / `follow` | `skew` | Which field places the glyphs. |
| `baseline-shift` | length | `0` | Offset from the path along the local normal (positive lifts). |
| `align` | `start` / `middle` / `end` | `start` | Where the run sits within the path's extent. |
| `start` | length | `0` | Absolute head-start along the path, added after `align`. |
| `font-*`, `fill`, `stroke*`, `letter-spacing`, `word-spacing` | as text | — | Standard text attributes. |

## How it lowers

`follow` and `stair` lower to live `<text>` (with `<textPath>` for follow) and need no font bytes. The
warping effects (skew, ribbon, rainbow) outline the run and emit baked `<path>` geometry inside a
`<g fill=… stroke=…>`. If the outliner is unavailable, skew and ribbon degrade to the stair-step
lowering and rainbow degrades to straight `<text>` — the document never breaks.

## See also

- [Path effects](/docs/type-on-a-path/effects/) — follow, skew, ribbon, rainbow in detail.
- [Placement](/docs/type-on-a-path/placement/) — `align`, `start`, and the stair-step.
- [Create outlines](/docs/vector-output/create-outlines/) — the glyph outliner the warping effects use.
- [Warp overview](/docs/warp/overview/) — the same geometry-transform pipeline.
