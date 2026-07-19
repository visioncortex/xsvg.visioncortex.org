---
title: "Tables"
description: "Presentation-style tables — author-set column widths, content-driven row heights, baked to plain rects and text."
---

# Tables

A `<x:table>` is a grid of `<x:tr>` rows of `<x:td>` (body) and `<x:th>` (header) cells. It follows
the **presentation-table model** — the one Google Slides/Draw and Canva use, and deliberately *not*
HTML's auto-layout: **column widths are author-set, row heights grow to fit content.** Each cell wraps
its text to its column width and the tallest cell sets the row's height. It bakes to plain `<rect>`s
(cell backgrounds and grid) plus positioned `<text>` — no live table needed.

<Example file="table" height={380} title="A content-driven table" caption="A fixed label column plus two flex columns; long cells wrap and grow their row, with header-fill, zebra stripes, and a per-cell background override." />

## Syntax

```xml
<x:table x="28" y="60" width="664" cols="150 * 2*" cell-padding="10" header-fill="#eef2ff">
  <x:tr><x:th>Feature</x:th><x:th>What it does</x:th></x:tr>
  <x:tr><x:td>Text layout</x:td><x:td>wraps, fits, justifies — this cell grows the row</x:td></x:tr>
</x:table>
```

## Columns: fixed and flex

`cols` lists a width per column. A value is either a **length** (a fixed column, e.g. `150`) or a
**flex weight** (`*` is 1, `2*` is 2). Flex columns split whatever width remains after the fixed ones,
in proportion to their weights. A missing or blank column entry is flex-1, so omitting `cols`
entirely gives even columns. In `cols="150 * 2*"`, the first column is a fixed 150px label column and
the remaining width splits 1:2 between the other two.

## Content-driven row heights

Every cell wraps its text to its column width (the area-layout model — see
[wrapping](/docs/text-layout/wrapping/)), and the tallest cell in a row sets that row's height. Rows
stack top-down and the table auto-heights to its content. `row-min-height` sets a floor for any row; a
larger per-cell `font-size` also grows its row.

## Header cells and backgrounds

`<x:th>` cells default to **bold** and the `header-fill` background. `stripe` adds a zebra background
to every other **body** row (rows with no header cell); the first data row is unstriped. Background
precedence, highest first, is per-cell `bg` › header › stripe › `cell-fill`.

Any cell — `td` or `th` — may override `align`, `valign`, `fill` (text color), `bg` (background), and
`font-*` (family / size / weight / style / line-height) for that cell alone.

## Attributes

| Attribute (on `<x:table>`) | Values | Default | Description |
| --- | --- | --- | --- |
| `x` `y` `width` | length | — | Top-left and total width; or take them from `in="#rect"`. |
| `cols` | list | even | Per-column width: a length (fixed) or a flex weight (`*` = 1, `2*` = 2). |
| `cell-padding` | length | `8` | Inset inside every cell. |
| `row-min-height` | length | `0` | Floor for a row's computed height. |
| `stroke` / `stroke-width` | color / length | — | Grid line color and width (`0` = no lines). |
| `cell-fill` / `header-fill` | color | — | Default background for `<x:td>` / `<x:th>` cells. |
| `stripe` | color | — | Zebra background for every other body row. |
| `fill`, `align`, `valign`, `font-*` | as text | — | Default text color, alignment, and style for all cells. |

Per cell, `<x:td>` / `<x:th>` accept `align`, `valign`, `fill`, `bg`, and `font-*` overrides.

## How it lowers

The table bakes to plain `<rect>`s for the cell backgrounds and grid, plus positioned `<text>` for the
wrapped cell content. Each cell compiles to its own `<g>` carrying the source range of its
`<x:td>` / `<x:th>`, so a viewer's inspector resolves a click to the individual **cell**, not the whole
table.

## v0 limits

No `colspan` / `rowspan` (merged cells) and no content-driven column widths — columns are author-set,
exactly as the presentation tools do; both are deliberate scope choices. One flattened paragraph per
cell (no inline `<tspan>` runs inside a cell yet).

## See also

- [Paragraphs](/docs/paragraphs-lists-tables/paragraphs/) — stacked paragraphs in one textbox.
- [Lists](/docs/paragraphs-lists-tables/lists/) — hanging-indent items with cycling markers.
- [Wrapping](/docs/text-layout/wrapping/) and [justification](/docs/text-layout/justification/) — the cell text model.
