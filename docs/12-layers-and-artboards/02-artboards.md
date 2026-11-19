---
title: "Artboards"
description: "Name slide frames with a plain group; tools page through them, while the file stays valid SVG in any viewer."
---

# Artboards

An artboard is a `<g x:artboard="Label">` — a named region, like an Illustrator artboard or a slide. It is degradation-safe the same way as [layers](/docs/layers-and-artboards/layers/): it compiles to a plain `<g>` that renders normally in any viewer, carrying `data-xsvg-artboard="Label"` so tools can enumerate, frame, and page through the frames.

<Example file="artboards" title="A ten-slide deck in one file" caption="Each slide is a <g x:artboard> with an explicit x:frame; in a plain viewer they tile as a grid, while the preview pages through them." />

## Syntax

```xml
<g x:artboard="Title" x:frame="0 0 720 405"> … </g>
<g x:artboard="Why"   x:frame="840 0 720 405" transform="translate(840,0)"> … </g>
```

## Frames

`x:artboard` marks the group and names it. An optional `x:frame="x y w h"` sets an explicit slide rectangle (content may bleed past it); without it, tools fall back to the group's bounding box. The compiler only tags and passes through — artboards do not reorder or clip content.

## Attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `x:artboard` | text | — | marks the group as an artboard; the value is its name |
| `x:frame` | `x y w h` | the group's bbox | optional explicit frame rectangle |
| `x:fill` | paint | — | the slide's backdrop: lowered to a `<rect>` filling the frame, as the group's first child |

`x:fill` replaces the hand-written background `<rect>` that repeated the frame's size — and it follows
the group's transform, so a placed slide gets its backdrop at its own origin:

```xml
<g x:artboard="Intro" x:frame="0 0 720 405" x:fill="#0b1020"> … </g>
```

## Tooling

The bundled tools treat artboards as **slides**. The standalone preview shows a `‹ ›` nav with a slide counter when a document has multiple artboards, paging by reframing the SVG `viewBox` to each frame. This is **deep-linkable** with a 1-based hash — `/preview/?file=<name>#N` frames the Nth artboard directly. The interactive viewer **zooms to the first artboard** on load. Both read the frames from the emitted `data-` attributes.

## How it lowers

Each `<g x:artboard>` becomes a plain `<g>` carrying `data-xsvg-artboard="Label"`, and `x:frame` is echoed as `data-xsvg-frame`. The `x:` attributes are stripped; the group renders normally in any plain viewer, which sees only a labeled group.

## See also

- [Layers](/docs/layers-and-artboards/layers/) — compile-time z-order, degradation-safe the same way.
- [Playground & viewer](/docs/getting-started/playground-and-viewer/) — the preview and viewer that page through artboards.
- [xsvg Specification §5.2](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)
