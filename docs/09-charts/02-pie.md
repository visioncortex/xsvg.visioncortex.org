---
title: "Pie, donut & polar-area"
description: "A radial chart coordinate primitive — value sets each slice's angle, with independent per-slice radius and explode."
---

# Pie, donut & polar-area

`<x:pie>` is a **chart coordinate primitive**, not a charting library: it maps values to sectors so you draw the marks, and it bakes to plain `<path>`s. A pie is a ring of `<x:slice>` children, each with **three independent channels** — angle, radius, and radial offset — which is what lets one primitive express a pie, a donut, an emphasized slice, and a polar-area (Nightingale rose).

<Example file="pie" title="Pie, donut & polar-area" caption="One primitive, three charts: a pie with one slice grown and exploded, a donut carved by inner-radius, and a polar-area rose with equal angles and per-slice radius." />

## Syntax

```xml
<x:pie cx="140" cy="140" r="90" start="-90" gap="1.5" inner-radius="0">
  <x:slice value="40" grow="1.12" explode="16"/>   <!-- fatter AND popped out -->
  <x:slice value="25"/>
  <x:slice value="35"/>
</x:pie>
```

## Angle from value

Each `<x:slice>` takes an angle proportional to its `value` as a share of the total (default `1`, giving equal angles). Slices lay out clockwise from `start` — `-90` degrees puts the first slice's start at the top. `gap` insets a padding between slices in degrees without changing the proportions.

## Donut

Set `inner-radius` on the `<x:pie>` to carve a hole; slices become annular sectors. A parallel `gap` insets each slice for the segmented-ring look.

```xml
<x:pie cx="370" cy="215" r="88" inner-radius="46" gap="3">
  <x:slice value="34" fill="#6366f1"/>
  <x:slice value="28" fill="#0ea5e9"/>
</x:pie>
```

## Per-slice radius and explode

A slice's radius is its second channel: `r` sets an absolute outer radius, or `grow` scales the pie `r` by a factor. `explode` pushes the slice out along its bisector by a distance. An exploded slice is the same sector drawn about a translated apex, so explode and radius compose freely.

## Polar-area (Nightingale rose)

The rose falls out with no extra feature: **omit `value`** so every slice gets an equal angle, then drive each slice's `r` from the datum.

```xml
<x:pie cx="600" cy="215" r="40" gap="1.5">
  <x:slice r="98"/>
  <x:slice r="72"/>
  <x:slice r="110"/>
</x:pie>
```

## Attributes

| Attribute | On | Values | Default | Description |
|---|---|---|---|---|
| `cx` `cy` `r` | `<x:pie>` | numbers | — | center and base radius |
| `start` | `<x:pie>` | degrees | `-90` (top) | first slice's start angle, clockwise |
| `gap` | `<x:pie>` | degrees | — | padding inset between slices (proportions unchanged) |
| `inner-radius` | `<x:pie>` | number | `0` | hole radius, giving annular sectors (donut) |
| `stroke` / `stroke-width` | either | color / number | — | slice border (per-slice overrides the pie) |
| `value` | `<x:slice>` | number | `1` | angle = this slice's share of the total |
| `r` / `grow` | `<x:slice>` | number / factor | — | radius: absolute outer radius, or a factor on the pie `r` |
| `explode` | `<x:slice>` | number | — | push the slice out along its bisector by this distance |
| `fill` | `<x:slice>` | color | palette cycles | slice color |

## v0 limits

Linear value-to-angle only, no built-in labels or legends (draw those yourself), and radius maps to length not area. For a perceptually honest area encoding, scale `r` by the square root of the value yourself. A slice thinner than `gap` is dropped; a slice spanning the full circle emits a circle or ring, avoiding SVG's degenerate 360-degree arc.

## How it lowers

Each `<x:slice>` bakes to its own `<g>` (carrying its source range) containing plain sector `<path>`s — annular sectors when `inner-radius` is set, a `<circle>`/ring for a full-circle slice. No script is emitted.

## See also

- [Plots](/docs/charts/plots/) — the linear (cartesian) counterpart.
- [xsvg Specification §7.8](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)
