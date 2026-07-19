---
title: "Layers"
description: "Compile-time z-order via x: attributes on a plain group — restack, refine, and hide, while staying valid SVG."
---

# Layers

SVG has no layers, only document order. xsvg adds **compile-time restacking** the degradation-safe way — as `x:`-prefixed attributes on a plain `<g>`, exactly the shape of Inkscape's `inkscape:groupmode="layer"`. A layered file is **valid SVG that renders in any plain viewer** (in document order); the compiler reorders the groups and strips the metadata.

<Example file="layers" title="Compile-time layers" caption="Authored order is watermark, card, grid, badge — but x:layer restacks the compiled paint order to grid (background), card, badge, watermark (foreground)." />

## Syntax

```xml
<g x:layer="foreground" x:label="Badge" x:order="10"> … </g>   <!-- floats in front -->
<g x:label="Card"> … </g>                                       <!-- content band, stays put -->
<g x:layer="background"> … </g>                                 <!-- sinks behind -->
```

## Bands and ordering

`x:layer` sorts a group into a z-band: `background` sinks, `foreground` floats, and any other value is the content band. Within a band, `x:order` is a numeric z-key that refines the order; it also works standalone as a plain z-index on any sibling. `x:hidden` with any value but `false` drops the element and its subtree entirely — the eyeball toggle.

Loose (non-layer) content is treated as content band, order 0, so it keeps its document position; only bucketed or explicitly-ordered elements move. Direct children stable-sort by the key `(band, x:order, document-index)`.

## Attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `x:layer` | `background` \| `foreground` \| any | content band | z-band: `background` sinks (−1), `foreground` floats (+1), any other value is the content band (0) |
| `x:order` | number | `0` | within-band z-key; also works standalone as a plain z-index on any sibling |
| `x:label` | text | — | human name; authoring metadata, stripped on emit |
| `x:hidden` | any but `false` | — | the element and its subtree compile to nothing |

## Still plain SVG uncompiled

Because these are ignorable `x:` attributes on an otherwise plain `<g>`, an uncompiled viewer just renders the groups in document order and skips the attributes. The **attribute-on-`<g>` form is the primitive** on purpose: an `<x:layer>` *element* would hide its content in an uncompiled viewer (unknown elements are skipped with their subtree), so it never degrades to empty.

## How it lowers

Restacking triggers when any direct child carries `x:layer` or `x:order`; the compiler stable-sorts the direct children by `(band, x:order, document-index)`, drops insignificant whitespace text nodes in a restacked container, and strips every `x:` attribute on emit — a layer becomes a plain `<g>`, so the output carries no trace of the layering.

## See also

- [Artboards](/docs/layers-and-artboards/artboards/) — named slide frames, degradation-safe the same way.
- [xsvg Specification §5.1](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)
