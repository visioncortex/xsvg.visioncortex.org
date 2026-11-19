---
title: "Cross-file <use>"
description: "Author a graphic once and reuse it everywhere — <use href=\"file.xsvg\"> pulls a whole file, or href=\"file.xsvg#id\" a single element, in at compile time and bakes it into self-contained SVG."
---

# Cross-file `<use>`

SVG's `<use>` can only reference elements **within the same document**. xsvg extends it to reference
**other files**: `<use href="logo.xsvg">` pulls in the whole file, and `<use href="logo.xsvg#icon">`
pulls in a single element by id. The reference is resolved and **baked at compile time**, so the
output is one plain, self-contained SVG with no external dependency.

<Example file="use-link" iframe title="Author once, reuse everywhere" caption="href=&quot;logo.xsvg&quot; brings in the whole lockup as a nested viewport; href=&quot;logo.xsvg#icon&quot; reuses just the mark, sized to each &lt;use&gt;." />

## Two forms

| `href` | Brings in | Placement |
| --- | --- | --- |
| `file.xsvg` | the **whole file**, as a clipped viewport | position with `x`/`y`; scale with `width`/`height` |
| `file.xsvg#id` | a **single element** by id, sized to its own extent | position with `x`/`y`; scale with `width`/`height` |

```xml
<!-- the whole logo lockup -->
<use href="logo.xsvg" x="28" y="90" width="250"/>

<!-- just the mark, reused at three sizes -->
<use href="logo.xsvg#icon" x="28"  y="198" width="72" height="72"/>
<use href="logo.xsvg#icon" x="116" y="214" width="56" height="56"/>
```

A linked drawing's `<use>` keeps its `transform`, `opacity` and `filter`, and `preserveAspectRatio`
is forwarded to the viewport — `none` stretches the drawing to the frame instead of letterboxing it.
The viewport lowers to a clipped `<g>` rather than a nested `<svg>`, so a rotated or cropped link
draws alike in every renderer (WebKit ignores a transform on a nested `<svg>`).

## Single source of truth

Because every instance resolves the same file, editing `logo.xsvg` once updates every place it's
used. This is the authoring win of a component without a component runtime — you keep one canonical
asset and compose it into pages, diagrams, and badges.

## How it resolves

The dependency is fetched **same-origin** over the compiler's lazy fetch, relative to the document's
base URL (see [processing model](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)).
A missing target, a cross-origin `href` (blocked by CORS), or a reference cycle degrades with a
marker rather than failing the whole compile. The pulled-in geometry is baked into the output — the
result never refers back to `logo.xsvg`.

## Compose compiled output, too

`<use>` brings in another *file*; the `in="#id"` attribute on many `x:` elements composes another
element's **compiled output** in the same document — a textbox flowed inside a
[boolean](/docs/diagrams/booleans/) union, type set on a [warp](/docs/warp/overview/)'s spine, a
`path → warp → textpath` chain. Both are references resolved at compile time.

## See also

- [Booleans](/docs/diagrams/booleans/) — operands by `<use href>` reference.
- [Create outlines](/docs/vector-output/create-outlines/) — referenced text auto-outlines.
- [Element index](/docs/reference/element-index/) — every `x:` and revived element.
