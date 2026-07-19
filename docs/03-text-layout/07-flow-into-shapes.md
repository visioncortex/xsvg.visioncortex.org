---
title: "Flow into shapes"
description: "Bind an x:textbox to a shape with in=\"#id\" — text flows inside a curved outline (path, circle, ellipse, polygon), or uses a rect's box."
---

# Flow into shapes

Point `<x:textbox in="#id">` at a shape and the text flows **inside that shape's outline** — lines
shorten toward a triangle's apex, bulge across a circle's middle, taper into a diamond's points. This
is region flow: the "fit text in polygon" case SVG never had (spec §6.10). A `rect` target keeps the
plain rectangular box model; any other fillable shape flows inside the actual filled outline.

<Example file="region-flow" title="Text poured into outlines" caption="The same feature flows text inside a triangle, a circle, a diamond and an hourglass — each line wrapped to the shape's inside width at that height." />

## Syntax

```xml
<polygon id="tri" points="20,54 200,54 110,262" fill="#eef2ff"/>
<x:textbox in="#tri" align="center" padding="6" font-size="12" fill="#3730a3">
  Text poured into a triangle starts wide along the top edge, then steps inward
  line by line as the sides close in.
</x:textbox>
```

## Which target does what

`in="#id"` resolves to any element in the document. A **missing** target renders nothing (a comment
marker is emitted).

| Target | Behavior |
| --- | --- |
| `rect` | uses the rectangular box model — `fit`, `valign`, `padding`, `align` all apply (see [Textbox](/docs/text-layout/textbox/)) |
| `path`, `circle`, `ellipse`, `polygon`, `polyline` | text is flowed **inside the filled outline** — each line wraps to the shape's inside width at that height |
| an `x:` element | its **compiled output** supplies the outline — e.g. text flows inside a boolean union's merged silhouette |

## How region flow works

For a curved outline, each line is wrapped to the shape's **inside width at that line's height**, so a
triangle's lines shorten toward its apex and a circle's lines bulge across the middle. Geometry comes
through a host-supplied *shaper* that rasterizes the filled path into a coarse table of per-row
inside-spans `[left, right]`; the layout then flows text into that table. In v0 the browser is the
shaper — curve flattening, bounds and inside-testing use `getBBox` and `isPointInFill`.

### Alignment

Region flow honors both alignment keywords:

- **`align`** (`start`/`center`/`end`) positions each line within its own inside span.
- **`valign`** (`top`/`middle`/`bottom`) positions the whole flowed block within the region's vertical
  extent — a first pass sizes the block, then the flow re-runs from a shifted start so each line still
  gets the span at its final height. The shift clamps to `0` when the block is taller than the region,
  so it never drops words that top-alignment would have kept.

## v0 scope

- **No shrink-to-fit** in region mode (the `rect` fast-path only). See [Shrink to fit](/docs/text-layout/shrink-to-fit/).
- **`text-overflow`** clips at the region's bottom and can ellipsize the last line (see
  [Overflow](/docs/text-layout/overflow/)).
- Vertical resolution is coarse (row height ≈ `font-size / 3`).
- Any outline whose every horizontal slice is a **single run** flows correctly — including
  vertical-pinch concavities like an hourglass (lines just narrow at the waist).
- A row that splits into **two runs** (a donut, a horizontal bowtie, a `U`) collapses to its outer
  `[leftmost, rightmost]` span, so text bridges the gap — v0 has no multi-span rows.
- A word wider than a line's span still overflows the outline unless `text-overflow="ellipsis"` trims
  it.

## How it lowers

The flowed lines lower to a plain SVG `<text>` of positioned `<tspan>`s — one per line at its
computed `x`/`y` — exactly like the rectangular box, just with per-line widths and offsets taken from
the shape.

## See also

- [Textbox](/docs/text-layout/textbox/) — the `<x:textbox>` element and `in="#rect"` fast-path.
- [Shrink to fit](/docs/text-layout/shrink-to-fit/) — not available in region flow.
- [Overflow & truncation](/docs/text-layout/overflow/) — clipping and ellipsis in a region.
- [Booleans](/docs/diagrams/booleans/) — an `x:` target whose union silhouette can receive flowed text.
