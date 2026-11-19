---
title: "Paragraphs"
description: "Stack multiple paragraphs inside one textbox — each with its own spacing, alignment, first-line indent, and style."
---

# Paragraphs

A `<x:textbox>` whose children are `<x:p>` elements flows them as **separate paragraphs**, stacked
top-down inside the box with vertical gaps — the multi-paragraph body real documents need, instead of
one endless run. Each paragraph wraps to the content width and carries its own alignment, indent,
style, and spacing. It lowers to one live `<text>` per paragraph, so the output stays selectable
plain SVG.

<Example file="paragraphs" title="Paragraphs in a textbox" caption="A heading, a first-line-indented body paragraph, and a justified one — plus a vertically centered pull-quote column." />

## Syntax

```xml
<x:textbox x="40" y="60" width="384" height="360" font-size="14" paragraph-spacing="14">
  <x:p font-size="22" font-weight="800" space-after="6">A heading paragraph</x:p>
  <x:p text-indent="22">A body paragraph, led in by a first-line indent…</x:p>
  <x:p align="justify">…and a justified one, keeping the paragraph gap above it.</x:p>
</x:textbox>
```

## How paragraphs stack

Each `<x:p>` is wrapped independently to the box's content width, then the paragraphs are stacked from
the top. The gap between two paragraphs is the `space-after` of the first **plus** the `space-before`
of the second. `space-after` defaults to the box's `paragraph-spacing`, so setting that once on the
`<x:textbox>` gives every paragraph a consistent gap; `space-before`/`space-after` on an individual
`<x:p>` add to it where you want more air (a heading, a byline).

Once the whole block is stacked, it is placed by the box's `valign` (`top` / `middle` / `bottom`).
Lines whose baseline leaves the box are clipped.

## Per-paragraph style

Any `<x:p>` overrides the box defaults for its own run: `align` (including `justify`), `text-indent`
for a first-line indent (see [Justification](/docs/text-layout/justification/) and the [spacing](/docs/text-layout/spacing/)
model), and `font-*` / `fill` for size, weight, and color. This is how one textbox holds a large bold
heading, an indented body paragraph, and a small colored label without three separate elements.

## Attributes

| Attribute | On | Values | Default | Description |
| --- | --- | --- | --- | --- |
| `paragraph-spacing` | `<x:textbox>` | length | `0` | Default gap after each paragraph (each paragraph's `space-after` default). |
| `space-before` | `<x:p>` | length | `0` | Extra gap above this paragraph. |
| `space-after` | `<x:p>` | length | `paragraph-spacing` | Extra gap below this paragraph. |
| `align` | `<x:p>` | `start` / `middle` / `end` / `justify` | box's `align` | Per-paragraph alignment. |
| `text-indent` | `<x:p>` | length | `0` | First-line indent for this paragraph. |
| `font-*`, `fill`, spacings | `<x:p>` | as text | box's value | Per-paragraph style over the box defaults. |
| `direction` | box, `<x:p>` | `ltr` / `rtl` | `ltr` | Under `rtl` the start edge is the right one: `start` right-aligns and the indent insets from the right. |

A paragraph can hold [styled runs](/docs/text-layout/styled-runs/), and a
[`<x:list>`](/docs/paragraphs-lists-tables/lists/#lists-inside-a-textbox) can stand among the
paragraphs. An empty `<x:p>` owns one blank row — the blank line a double Enter produces.

## How it lowers

Each `<x:p>` compiles to its own `<text>` element carrying the source range of that paragraph, so a
viewer's inspector resolves a click to the individual paragraph. There is no runtime — the output is
positioned live `<text>`.

## Limits

Paragraph mode applies to the **rectangular** box only — a curved `in="#shape"` region ignores `<x:p>`
and flows as one block. Glyph order within a right-to-left line is left to the renderer's bidi
algorithm.

## See also

- [Lists](/docs/paragraphs-lists-tables/lists/) — hanging-indent items with cycling markers.
- [Tables](/docs/paragraphs-lists-tables/tables/) — content-driven grids of wrapped cells.
- [Textbox](/docs/text-layout/textbox/) and [text layout overview](/docs/text-layout/overview/).
- [Styled runs](/docs/text-layout/styled-runs/) — inline `<tspan>` styling within a run.
