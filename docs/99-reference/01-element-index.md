---
title: "Element index"
description: "Every xsvg element — the x:-prefixed extensions and the revived SVG elements — with a link to its reference."
---

# Element index

Every element xsvg adds or revives, grouped by area. New elements are `x:`-prefixed; **revived** ones
are real SVG names the compiler implements that browsers dropped or never shipped.

## Text

| Element | Summary | Reference |
| --- | --- | --- |
| `<text inline-size>` | wrap plain `<text>` at a width (revived SVG 2 attribute) | [Wrapping](/docs/text-layout/wrapping/) |
| `<textArea>` | box text with align / auto-size (revived SVG Tiny 1.2) | [Wrapping](/docs/text-layout/wrapping/) |
| `<x:textbox>` | box- or shape-bound text: padding, align, fit, region flow | [Textbox](/docs/text-layout/textbox/) |
| `<tspan>` | inline styled run that flows and wraps with the paragraph | [Styled runs](/docs/text-layout/styled-runs/) |
| `<tbreak/>` | forced line break (revived SVG Tiny 1.2) | [Wrapping](/docs/text-layout/wrapping/) |
| `<x:p>` | a paragraph inside a textbox — spacing and per-paragraph style | [Paragraphs](/docs/paragraphs-lists-tables/paragraphs/) |
| `<x:list>` / `<x:li>` | hanging-indent bullet / numbered lists with cycling markers | [Lists](/docs/paragraphs-lists-tables/lists/) |
| `<x:table>` / `<x:tr>` / `<x:td>` / `<x:th>` / `<x:col>` | grid with author-set columns and content-driven row heights | [Tables](/docs/paragraphs-lists-tables/tables/) |
| `<x:textpath>` | set text along a path — follow, skew, ribbon | [Type on a path](/docs/type-on-a-path/overview/) |

## Geometry

| Element | Summary | Reference |
| --- | --- | --- |
| `<x:warp>` | envelope distortion — presets, perspective, free distort, bend | [Warp](/docs/warp/overview/) |
| `<x:boolean>` | live path algebra — union / subtract / intersect / exclude | [Booleans](/docs/diagrams/booleans/) |
| `<x:offset>` | grow / shrink a region by a Minkowski distance | [Offset](/docs/diagrams/offset/) |
| `<x:connector>` | a line routed between two elements' edges | [Connectors](/docs/diagrams/connectors/) |
| `x:corners` on a shape | live corners — round, chamfer or inverted, per anchor | [Corners](/docs/diagrams/corners/) |

## Charts

| Element | Summary | Reference |
| --- | --- | --- |
| `<x:plot>` / `<x:bars>` / `<x:bar>` / `<x:line>` | a linear data-coordinate frame for bar & line charts | [Plots](/docs/charts/plots/) |
| `<x:pie>` / `<x:slice>` | pie / donut / polar-area — value to angle | [Pie](/docs/charts/pie/) |

## Paint & theming

| Element | Summary | Reference |
| --- | --- | --- |
| `<x:theme>` / `<x:color>` / `<x:font>` | compile-time design tokens (`var(name)`, `x:font="name"`) | [Theming](/docs/theming/overview/) |
| `<x:mesh>` / `<x:face>` | Coons/tensor mesh gradients, baked to texel-aligned PNGs | [Mesh gradients](/docs/mesh-gradients/overview/) |
| `<meshgradient>` | SVG 2 / Inkscape mesh gradient (revived as a fill source) | [Mesh gradients](/docs/mesh-gradients/overview/) |

## Composition

| Element | Summary | Reference |
| --- | --- | --- |
| `<use href="file.xsvg">` | pull in a whole file, or one element by id (`file.xsvg#id`), baked at compile time | [Cross-file `<use>`](/docs/composition/cross-file-use/) |

## Extensibility

| Element | Summary | Reference |
| --- | --- | --- |
| `<x:import>` | bind an XML namespace to a WASM generator module, so its elements compile like built-ins | [Loadable generators](/docs/extensibility/generators/) |
| `<x:doc>` | an editor's document-level settings — dropped whole at compile, never read inside | [Document settings](#document-settings) |

## Document settings

`<x:doc>` is the one place for a tool's document-level settings — artboard defaults, a print size —
kept with the file but never rendered. The compiler drops it and its whole subtree: an `id` there
can't be referenced, an `<x:theme>` or `<x:import>` there binds nothing, and an edit there
invalidates nothing. One per document, first by convention; its children belong to the tool that
writes them, in the `x:` namespace.

```xml
<x:doc>
  <x:artboards width="720" height="405" fill="#ffffff" columns="4" gap="120 60"/>
</x:doc>
```

## See also

- [Attribute index](/docs/reference/attribute-index/) — extension attributes on standard elements.
