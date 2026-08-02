---
title: "Bordered text"
description: "x:border-width / x:border-color — an outline that hugs each glyph and sits behind the fill, so it reads against a busy background without thinning the letters."
---

# Bordered text

`x:border-width` and `x:border-color` draw an outline that hugs every glyph and sits **behind** the
fill (via `paint-order`), so the letters read against a busy or same-tone background without the
outline eating into their shapes. It works on any xsvg text element — `<x:textbox>`, `<textArea>`,
`<text>`.

<Example file="bordered-text" title="A glyph border behind the fill" caption="A white headline with a dark border over a gradient, and border-width = 1 · 3 · 6 — the fill stays crisp because the stroke sits behind it." />

## Syntax

```xml
<x:textbox x="20" y="22" width="520" height="104" font-size="92" align="center"
           fill="#ffffff" x:border-width="4" x:border-color="#1e1b4b">BORDERED</x:textbox>
```

## Behind the fill, not through it

A normal SVG `stroke` on text is painted **over** the fill and centered on the glyph outline, so
half of it lands inside the letter and visibly thins it. `x:border-width` instead renders the
outline first and the fill on top, and `x:border-width` is the width **visible outside** each glyph.
The fill therefore stays exactly its authored weight; the border only adds around it.

## Attributes

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `x:border-width` | length | `0` (no border) | width of the outline visible **outside** each glyph |
| `x:border-color` | paint | — | the border colour |
| `x:border-opacity` | number | `1` | the border's opacity |

All three are **declared** attributes, so an editing host offers them: the interactive viewer's
inspector shows them for a pinned `<x:textbox>` or `<x:textpath>`. They live in the xsvg namespace
(the unprefixed `border-*` spellings are reserved), so a host writes them with the prefix the
document binds — see [writing a generator](/docs/extensibility/writing-a-generator/).

## How it lowers

To the glyph geometry with a `stroke` + `paint-order` that places the outline under the fill (or to
outlined `<path>`s where the pipeline already outlines glyphs). The result is plain, self-contained
SVG — no runtime.

## See also

- [Styled runs](/docs/text-layout/styled-runs/) — per-run fill, weight, style and family.
- [Create outlines](/docs/vector-output/create-outlines/) — lower glyphs to `<path>` geometry.
- [Textbox](/docs/text-layout/textbox/) — the box-bound text element.
