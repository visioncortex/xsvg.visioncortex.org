---
title: "Plots"
description: "A linear data coordinate frame — map a data domain onto a pixel box and draw bars and lines in data units."
---

# Plots

`<x:plot>` is a **linear data coordinate frame** — the cartesian counterpart to a [pie](/docs/charts/pie/). It maps a data domain onto a pixel box (y inverted, so larger values sit higher) and **keeps stroke and marker sizes in pixels**, unlike a `<g transform>` that would stretch a 2px line into a slab. You express marks in *data* units; the compiler bakes them to plain shapes. It is a coordinate system, not a charting library.

<Example file="plot" height={320} title="Bars and a line graph" caption="Two plots: bottom-aligned bars over a 0–100 domain, and a line with dot markers and an area fill over a 20–25 domain." />

## Syntax

```xml
<x:plot x="90" y="92" width="270" height="220" y-domain="0 100" y-ticks="5">
  <x:bars fill="#6366f1" gap="0.35" radius="3">
    <x:bar value="45" label="Q1"/>
    <x:bar value="90" label="Q4" fill="#0ea5e9"/>
  </x:bars>
</x:plot>

<x:plot x="450" y="92" width="240" height="220" x-domain="0 6" y-domain="20 25" y-ticks="5">
  <x:line points="0,21.2 1,22 2,23.4 3,22.6"
          stroke="#0ea5e9" stroke-width="2.5"
          marker="dot" marker-size="4.5" marker-fill="#0369a1" area="#0ea5e9"/>
</x:plot>
```

## The coordinate frame

A plot occupies a pixel box given by `x`, `y`, `width`, and `height` (or taken from an `in="#rect"` reference). The `y-domain` maps data values onto that box with y inverted, so the domain floor is at the bottom edge and the ceiling at the top. `x-domain` does the same horizontally for line points. A domain of `auto` or an absent domain falls back to the marks' own extent (bars include a 0 baseline).

`y-ticks="N"` draws N+1 horizontal gridlines with value labels. Because sizes stay in pixels, a line drawn at `stroke-width="2.5"` is 2.5px wide regardless of how the domain scales.

## Bars

`<x:bars>` holds a run of `<x:bar>` children. Bars spread evenly across the width and are **always bottom-aligned**, with their base at the domain floor. Each bar's `value` is mapped through the y scale to a height.

```xml
<x:bars fill="#6366f1" gap="0.35" radius="3">
  <x:bar value="45" label="Q1"/>
  <x:bar value="72" label="Q2"/>
  <x:bar value="66" label="Q5" fill="#0ea5e9"/>
</x:bars>
```

## Lines

`<x:line>` takes a `points` list of `"x,y"` data pairs, mapping each point through both scales into a polyline. `marker` (any value) drops a dot at every point; `marker-size` and `marker-fill` size and color it (color defaults to `stroke`). `area="#color"` fills the region under the line down to the baseline.

## Attributes

| Attribute | On | Values | Default | Description |
|---|---|---|---|---|
| `x` `y` `width` `height` | `<x:plot>` | numbers | — | the pixel box (or take it from `in="#rect"`) |
| `x-domain` / `y-domain` | `<x:plot>` | `"lo hi"` or `auto` | marks' extent | data range mapped onto the box |
| `y-ticks` | `<x:plot>` | number | — | draw N+1 horizontal gridlines with value labels |
| `grid-color` / `grid-width` | `<x:plot>` | color / number | — | gridline color and stroke width |
| `label-fill` / `label-size` | `<x:plot>` | color / number | — | axis-label color and size |
| `fill` `gap` `radius` | `<x:bars>` | color / fraction / number | — | bar color, inter-bar gap (fraction of the band), corner radius |
| `value` `label` `fill` | `<x:bar>` | number / text / color | — | height (mapped, bottom-aligned), an x-axis label, per-bar color |
| `points` | `<x:line>` | `"x,y …"` | — | data points mapped to a polyline |
| `stroke` / `stroke-width` | `<x:line>` | color / number | — | line color and width |
| `marker` / `marker-size` / `marker-fill` | `<x:line>` | any / number / color | color = `stroke` | drop dots at each point; size and color |
| `area` | `<x:line>` | `"#color"` | — | fill under the line to the baseline |

## v0 limits

Linear scales only (no log, time, or ordinal), a single y-axis, and minimal axis rendering (y-gridlines with labels, plus bar labels). Richer axes and legends you compose yourself.

## How it lowers

Each mark maps through the scales to plain shapes: bars become `<rect>`/`<path>`, a line becomes a `<polyline>`/`<path>` with `<circle>` markers and an area `<path>`, and gridlines and labels become `<line>` and `<text>`. Each `<x:bar>` and `<x:line>` carries its own source range. No chart runtime or script is emitted.

## See also

- [Pie, donut & polar-area](/docs/charts/pie/) — the radial counterpart.
- [xsvg Specification §7.9](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)
