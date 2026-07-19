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
| `letter-spacing` | text elements | length | [Spacing](/docs/text-layout/spacing/) |
| `word-spacing` | text elements | length | [Spacing](/docs/text-layout/spacing/) |
| `x:glyph-x-scale` / `glyph-x-scale` | text elements | number | [Spacing](/docs/text-layout/spacing/) |
| `outline` | text elements | `true` | [Create outlines](/docs/vector-output/create-outlines/) |

## Compile-time structure

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `x:layer` | `<g>` | `background` · `foreground` | [Layers](/docs/layers-and-artboards/layers/) |
| `x:order` | `<g>` | number | [Layers](/docs/layers-and-artboards/layers/) |
| `x:hidden` | any | `true` | [Layers](/docs/layers-and-artboards/layers/) |
| `x:artboard` | `<g>` | name | [Artboards](/docs/layers-and-artboards/artboards/) |

## Paint

| Attribute | On | Values | Reference |
| --- | --- | --- | --- |
| `fill` / `stroke` = `var(name)` | any painted element | token name | [Theming](/docs/theming/overview/) |
| `x:font` | text elements | token name | [Theming](/docs/theming/overview/) |
| `filter` | any element | CSS filter functions, `-x-curve()` | [Filters](/docs/filters/overview/) |

## See also

- [Element index](/docs/reference/element-index/) — every `x:` and revived element.
