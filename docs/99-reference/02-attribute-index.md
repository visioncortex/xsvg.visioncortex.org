---
title: "Attribute index"
description: "Extension attributes on standard SVG elements, and the revived SVG/CSS names xsvg implements."
---

# Attribute index

Attributes fall into two groups by the [prefix policy](/docs/introduction/namespaces-and-prefixes/):
**revived** SVG/CSS names used unprefixed, and **new** attributes that are `x:`-prefixed on standard
elements. (Attributes *inside* an `x:` element are unprefixed and documented on that element's page.)

## Text layout

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `inline-size` | `<text>` | length | [Wrapping](/docs/text-layout/wrapping/) |
| `text-wrap` | `<text>` | `wrap` · `balance` | [Wrapping](/docs/text-layout/wrapping/) |
| `line-height` | text elements | number · length | [Wrapping](/docs/text-layout/wrapping/) |
| `text-align` | `<textArea>`, textbox | `start` · `end` · `center` · `justify` | [Justification](/docs/text-layout/justification/) |
| `display-align` | `<textArea>` | `before` · `center` · `after` | [Wrapping](/docs/text-layout/wrapping/) |
| `line-increment` | `<textArea>` | `auto` · length | [Wrapping](/docs/text-layout/wrapping/) |
| `fit` | `<x:textbox>` | `none` · `shrink` | [Shrink to fit](/docs/text-layout/shrink-to-fit/) |
| `fit-min` | `<x:textbox>` | length (default 6) | [Shrink to fit](/docs/text-layout/shrink-to-fit/) |
| `text-overflow` | box text | `clip` · `ellipsis` | [Overflow](/docs/text-layout/overflow/) |
| `letter-spacing` | text elements and blocks | number | [Spacing](/docs/text-layout/spacing/) |
| `word-spacing` | text elements and blocks | number | [Spacing](/docs/text-layout/spacing/) |
| `x:glyph-x-scale` / `glyph-x-scale` | text elements | number | [Spacing](/docs/text-layout/spacing/) |
| `outline` / `x:outline` | `x:` text elements / `<text>`, `<textArea>` | `true` | [Create outlines](/docs/vector-output/create-outlines/) |
| `x:border-width` | text elements | length | [Bordered text](/docs/text-layout/bordered-text/) |
| `x:border-color` | text elements | paint | [Bordered text](/docs/text-layout/bordered-text/) |
| `x:border-opacity` | text elements | number | [Bordered text](/docs/text-layout/bordered-text/) |
| `text-transform` | text elements, `<tspan>` | `uppercase` · `lowercase` · `none` | [Spacing](/docs/text-layout/spacing/) |
| `overflow` | `<x:textbox>`, `<textArea>` | `hidden` · `visible` | [Overflow](/docs/text-layout/overflow/) |
| `direction` | textbox, `<x:p>`, list, table | `ltr` · `rtl` | [Paragraphs](/docs/paragraphs-lists-tables/paragraphs/) |
| `x:highlight` | `<tspan>` | paint | [Styled runs](/docs/text-layout/styled-runs/) |
| `font-size` | `<tspan>` | length · `%` · `em` | [Styled runs](/docs/text-layout/styled-runs/) |
| `baseline-shift` | `<tspan>` | `super` · `sub` · length | [Styled runs](/docs/text-layout/styled-runs/) |
| `text-decoration` | `<tspan>` | `underline` · `line-through` | [Styled runs](/docs/text-layout/styled-runs/) |
| `href` | `<tspan>` | URL | [Styled runs](/docs/text-layout/styled-runs/) |

## Compile-time structure

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `x:layer` | `<g>` | `background` · `foreground` | [Layers](/docs/layers-and-artboards/layers/) |
| `x:order` | `<g>` | number | [Layers](/docs/layers-and-artboards/layers/) |
| `x:hidden` | any | `true` | [Layers](/docs/layers-and-artboards/layers/) |
| `x:label` | `<g>` | text | [Layers](/docs/layers-and-artboards/layers/) |
| `x:layer-key` | `<g>` | text | [Layers](/docs/layers-and-artboards/layers/) |
| `x:artboard` | `<g>` | name | [Artboards](/docs/layers-and-artboards/artboards/) |
| `x:frame` / `x:fill` | artboard `<g>` | `x y w h` / paint | [Artboards](/docs/layers-and-artboards/artboards/) |

## Shape

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `x:corners` | `<rect>`, `<polygon>`, `<polyline>`, `<path>`, nested `<svg>` | radius, or `anchor:radius` pairs | [Corners](/docs/diagrams/corners/) |
| `x:corner-style` | same | `round` · `chamfer` · `inverted`, or pairs | [Corners](/docs/diagrams/corners/) |

## Composition

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `href="file.xsvg"` / `"file.xsvg#id"` | `<use>` | another file, or one element in it | [Cross-file `<use>`](/docs/composition/cross-file-use/) |
| `preserveAspectRatio` | `<use href="file.xsvg">` | SVG values | [Cross-file `<use>`](/docs/composition/cross-file-use/) |

## Paint

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `fill` / `stroke` = `var(name)` | any painted element | token name | [Theming](/docs/theming/overview/) |
| `fill` / `stroke` = `url(#mesh)` | any painted element | an `<x:mesh>` id | [Mesh gradients](/docs/mesh-gradients/overview/) |
| `x:font` | text elements | token name | [Theming](/docs/theming/overview/) |
| `filter` | any element | CSS filter functions, `-x-curve()` | [Filters](/docs/filters/overview/) |

## See also

- [Element index](/docs/reference/element-index/) — every `x:` and revived element.
