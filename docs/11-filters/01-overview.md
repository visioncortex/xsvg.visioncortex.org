---
title: "Filters — pixel adjustments"
description: "Write standard CSS filter functions on the filter attribute; the compiler lowers them to portable SVG filter primitives."
---

# Filters — pixel adjustments

You write the **standard `filter` attribute with CSS function syntax** — the form browsers already render live, so an uncompiled document degrades perfectly — and the compiler lowers it to an equivalent **`<filter>` element graph**, so the static SVG subset gets the same pixels. xsvg also adds `-x-curve()` Photoshop-style tone curves sampled into lookup tables.

<Example file="adjust" height={420} title="Pixel adjustments" caption="One artwork stamped with filter='…' — brightness, contrast, saturate, sepia, hue-rotate, invert, plus -x-curve tone curves and -x-levels." />

## Syntax

```xml
<use href="#photo" filter="brightness(1.1) contrast(1.2) -x-curve(0 0, .3 .15, .7 .9, 1 1)"/>
```

## Vocabulary

The standard CSS filter functions: `brightness()`, `contrast()`, `saturate()`, `grayscale()`, `sepia()`, `invert()`, `opacity()` (number or percentage; the 0–1 family clamps like CSS), and `hue-rotate()` (degrees).

`blur(r)` and `drop-shadow(dx dy [r] [#color])` (user units) *bleed*: on a plain shape the `<filter>` region is computed exactly as a `userSpaceOnUse` box grown by 3σ per blur, the shadow offset, and half the stroke width; on unmeasurable content such as groups it falls back to ±50% of the bbox.

xsvg extensions add `-x-levels(black white [gamma])` (Photoshop *Levels*: remap the input range, then gamma) and `-x-curve(x0 y0, x1 y1, …)` — a Photoshop-style tone curve through control points in the unit square (at least 2 points, x strictly increasing), interpolated monotone-cubically (no overshoot) and sampled into a `feComponentTransfer` lookup table. `-x-curve-r`, `-x-curve-g`, `-x-curve-b`, and `-x-curve-a` target a single channel.

Like other `-x-` vocabulary, an unsupporting browser ignores the whole declaration and renders the element unfiltered — degradation, not breakage.

## Functions

| Function | Argument | Effect |
|---|---|---|
| `brightness()` | number / % | scale luminance |
| `contrast()` | number / % | scale contrast |
| `saturate()` | number / % | scale color saturation |
| `grayscale()` | 0–1 / % | desaturate toward gray |
| `sepia()` | 0–1 / % | sepia tone |
| `invert()` | 0–1 / % | invert colors |
| `opacity()` | 0–1 / % | fade the element |
| `hue-rotate()` | degrees | rotate hue on the color wheel |
| `blur(r)` | user units | Gaussian blur (bleeds) |
| `drop-shadow(dx dy [r] [#color])` | user units + color | offset shadow (bleeds) |
| `-x-levels(black white [gamma])` | numbers | remap input range, then gamma |
| `-x-curve(x y, …)` | points in the unit square | monotone-cubic tone curve to a lookup table |

## How it lowers

Each filtered element gets its own `<filter>` definition emitted immediately before it, with `color-interpolation-filters="sRGB"` (the CSS shorthands are specified in sRGB; SVG's linearRGB default is the classic mismatch bug), a region of −10% / 120% (so strokes outside the fill bbox survive), one primitive per function **in authored order**, and the numeric mappings the Filter Effects spec defines for each shorthand — so lowered output matches live browser rendering. The element's `filter` attribute is rewritten to `url(#…)`.

`filter="url(#…)"` references, `none`, and any list the parser declines (an unknown function or an invalid argument) pass through untouched — mirroring CSS's whole-declaration-invalid rule; browsers still honor those live.

## See also

- [Graceful degradation](/docs/introduction/graceful-degradation/) — why the CSS form renders live uncompiled.
- [Mesh gradients](/docs/mesh-gradients/overview/) — the rest of the paint & pixels pillar.
- [xsvg Specification §8](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)
