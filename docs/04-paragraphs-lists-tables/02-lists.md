---
title: "Lists"
description: "Ordered and unordered lists SVG never got — hanging-indent items, drawn bullet shapes, and numbers that cycle by depth."
---

# Lists

A `<x:list>` is a vertical stack of `<x:li>` items, each flowed and wrapped like a mini `<x:textbox>`
but with a **hanging indent**: the marker sits in the gutter and continuation lines align to the text
column, not back under the marker. It is the ordered/unordered list SVG never got, and lowers to a
`<g>` of drawn bullet shapes plus one plain `<text>` of positioned `<tspan>`s — live and selectable.

<Example file="lists" title="Bullet and numbered lists" caption="Bullets that cycle by depth, decimal→alpha→roman numbering with a resuming outer counter, and a list flowed inside a referenced card." />

## Syntax

```xml
<x:list x="40" y="80" width="300" list="bullet" font-size="14" item-spacing="5">
  <x:li>Top-level item that wraps under its own text column</x:li>
  <x:li indent="1">A nested item — one indent step in</x:li>
  <x:li indent="2">Deeper still</x:li>
</x:list>
```

## Hanging indent and nesting

Each `<x:li>` is one item; `indent="N"` sets its **nesting level** (`0` is the top). Every level steps
the text column right by the `indent` step, and continuation lines of a wrapped item align to that
column — the marker hangs in the gutter to its left. An empty item still advances one line.

## Markers cycle by depth

Bullet markers are **drawn shapes**, not font glyphs, so they don't vary by font and stay optically
balanced. They cycle every three levels: a filled **disc**, a hollow **ring**, then a filled
**square**. The shapes are area-compensated — the square's side is `r·√π` so its area matches the
disc's, and the ring's outer diameter is enlarged about 12% since a hollow mark reads lighter.

With `list="number"`, markers cycle **decimal → lower-alpha → lower-roman** by depth and keep an
**outline counter per level**. The counter restarts whenever nesting pops back to a shallower level,
so a top item after a sublist resumes where it left off — `1. 2. a. b. 3.` Numbers are right-aligned
into the gutter, so `1.` and `10.` share a column edge.

`list="none"` suppresses the marker but keeps the indent. A `marker` on the list — or on a single
`<x:li>` — forces a named drawn shape (`disc` / `circle` / `square` / `dash`) or any literal string
(`▸`, `—`, `★`, …), overriding the cycle.

## Flowing inside a shape

Instead of `x` / `y` / `width`, give the list `in="#rect"` to take its left edge, top, and width from
a referenced shape's bounding box (a baked reference). That box also supplies the height for `valign`,
so a list can sit `top`, `middle`, or `bottom` inside a card.

## Attributes

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `list` | `bullet` / `number` / `none` | `bullet` | Marker style for the whole list. |
| `marker` | `disc` / `circle` / `square` / `dash`, or a literal string | — | Force a marker (drawn shape or literal text); overrides the `list` cycle. |
| `marker-size` | number | `1` | Scale factor on the drawn bullet shapes. |
| `marker-fill` | color | `fill` | Marker color (shapes and number/character markers). |
| `x` `y` `width` | length | — | The block's left edge, top, and content width. |
| `in` | `#id` | — | Bind geometry to a referenced shape's bounding box; also supplies the height for `valign`. |
| `valign` | `top` / `middle` / `bottom` | `top` | Vertical placement within the height. |
| `indent` | length | `1.5em` | Per-level indent step. |
| `marker-gap` | length | `0.5em` | Gap between the marker and the text column. |
| `item-spacing` | length | `0.35em` | Extra vertical gap between items. |
| `font-*`, `line-height`, `fill` | as text | — | Base style for every item. |

| `direction` | `ltr` / `rtl` | `ltr` | Item text starts from the right edge of its column under `rtl`. |
| `transform` | transform list | — | Passes through to the list's `<g>` — rotate or scale the list. |
| `outline` | `true` | — | Trace items and generated markers to paths. |

An `<x:li>` may set `indent="N"` and `marker="…"`, and takes the whole type block over its list —
`font-*`, `line-height`, `fill`, the spacings, `text-transform`, `direction`. Its marker scales with
its size, and [styled runs](/docs/text-layout/styled-runs/) inside an item render.

## Lists inside a textbox

A `<x:list>` can stand among a textbox's [paragraphs](/docs/paragraphs-lists-tables/paragraphs/) as a
block of the same stack — one box holds a heading, bullets and a closing paragraph, the way a
presentation text box does, all under the box's shrink-to-fit, `valign` and padding:

```xml
<x:textbox x="40" y="60" width="384" height="240" font-size="14" fit="shrink">
  <x:p font-weight="800">Agenda</x:p>
  <x:list list="bullet"><x:li>Where we are</x:li><x:li indent="1">the numbers</x:li></x:list>
  <x:p>Questions after.</x:p>
</x:textbox>
```

Inside a box the list's placement attributes (`x`, `y`, `width`, `height`, `in`) are ignored; its
markers, indent, spacing and style apply. The standalone list remains for a list placed on its own.

## How it lowers

A `<x:list>` compiles to a `<g>` containing the drawn bullet shapes plus one plain `<text>` whose
positioned `<tspan>`s carry the item text and any number/character markers — no runtime, fully
selectable.

## v0 limits

A standalone list has no shrink-to-fit or height clipping (put it in a textbox for that) — the list flows from `valign` within the height but doesn't shrink
to fit it. Number, roman, and character markers are live text (the glyphs must exist in the font);
bullet shapes are drawn and font-independent.

## See also

- [Paragraphs](/docs/paragraphs-lists-tables/paragraphs/) — stacked paragraphs in one textbox.
- [Tables](/docs/paragraphs-lists-tables/tables/) — content-driven grids of wrapped cells.
- [Wrapping](/docs/text-layout/wrapping/) and [flow into shapes](/docs/text-layout/flow-into-shapes/).
