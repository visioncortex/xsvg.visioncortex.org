---
title: "Letter, word & glyph spacing"
description: "Layout-aware letter-spacing and word-spacing, visual glyph-x-scale stretching, and the tbreak forced break."
---

# Letter, word & glyph spacing

Three controls tune the horizontal rhythm of text. `letter-spacing` and `word-spacing` add real space
that the layout counts (tracking that affects wrapping). `glyph-x-scale` stretches or condenses the
rendered glyphs without touching the layout. And `<tbreak/>` forces a line break where you author it.

<Example file="letter-spacing" height={330} title="letter-spacing (tracking)" caption="Increasing tracking on a word; kerning pairs survive; and tracked text wraps sooner in the same box because the layout counts the space." />

## `letter-spacing` and `word-spacing`

CSS/SVG tracking: uniform extra space between grapheme clusters (`letter-spacing`) and at each
inter-word gap (`word-spacing`), on every text element (spec §6.8). Both are unprefixed — they are
existing SVG/CSS names.

### Attributes

| Attribute | Values | Initial | Effect |
| --- | --- | --- | --- |
| `letter-spacing` | `normal` \| length | `normal` (= `0`) | extra advance added per inter-grapheme gap |
| `word-spacing` | `normal` \| length | `normal` (= `0`) | extra advance added per inter-word space |

### Model

Both are **absolute lengths** in user units — they do *not* scale with `font-size`, so under
[shrink-to-fit](/docs/text-layout/shrink-to-fit/) the spacing stays put while the glyphs shrink, matching CSS/SVG.
They are **additive on top of kerning**, not a replacement: the font's pair kerning stays in the glyph
advances and the spacing layers over it. For a run of `n` grapheme clusters containing `s` inter-word
spaces, the rendered advance is:

```
advance = kerned_advance(run) + (n − 1) × letter-spacing + s × word-spacing
```

**Layout-aware.** This spaced advance — not the raw glyph advance — drives wrapping, shrink-to-fit,
ellipsis truncation and alignment, so tracked text breaks and fits correctly. The attributes are then
emitted on the output `<text>` so the renderer reproduces the exact width the layout assumed. `normal`
and `0` emit nothing. Counts use code points in v0.

<Example file="word-spacing" height={330} title="word-spacing" caption="Wider inter-word gaps, and the same box wrapping sooner because the layout accounts for the added word space." />

## `glyph-x-scale` — visual width scaling

A purely **visual** horizontal scale on the rendered glyphs (spec §6.7): condensed or extended type
without a condensed or extended font. It applies to all three front-ends — unprefixed `glyph-x-scale`
on `<x:textbox>`, and the `x:`-prefixed `x:glyph-x-scale` on the reused SVG `<text inline-size>` and
`<textArea>` (a new attribute on a reused SVG element is namespaced).

| Attribute | Values | Initial | Effect |
| --- | --- | --- | --- |
| `glyph-x-scale` | number | `1` | multiply each line's advance width by this factor |

**Layout is unchanged.** Wrapping, fitting and overflow all run at the natural width; only the final
rendered glyphs are scaled. Per line, the compiler measures the natural advance `w` and emits
`textLength="w · scale" lengthAdjust="spacingAndGlyphs"` on the `<tspan>`, so the renderer stretches
both the glyphs and their spacing to hit that length. A value of `1` (the initial) emits nothing. When
combined with `letter-spacing`, the `textLength` target is computed from the letter-spaced advance, so
the two compose.

<Example file="tbreak-and-glyph-scale" height={340} title="Forced breaks and glyph-x-scale" caption="Forced breaks in an address block, three glyph-x-scale widths, and a stretched hand-broken banner." />

## `<tbreak/>`

A forced line break, per SVG Tiny 1.2. Each `<tbreak/>` child of a `<textArea>` (or `<x:textbox>`)
ends the current line and starts a new one; wrapping resumes independently on each side, and
consecutive breaks produce blank lines. It is the only child element `<textArea>` interprets in v0.
Justification and fitting treat the text on each side of a `<tbreak/>` as its own paragraph — see
[Justification](/docs/text-layout/justification/).

```xml
<textArea x="32" y="72" width="226" font-size="16">
  Ada Lovelace<tbreak/>12 Analytical Engine Way<tbreak/>London
</textArea>
```

## How it lowers

`letter-spacing` and `word-spacing` are emitted as the same-named attributes on the output `<text>`
(or forwarded on a passed-through `<text inline-size>`). `glyph-x-scale` becomes per-line
`textLength` + `lengthAdjust="spacingAndGlyphs"`. `<tbreak/>` is resolved at compile time into the
positioned per-line `<tspan>`s.

## See also

- [Wrapping](/docs/text-layout/wrapping/) — where line breaking and `<tbreak/>` fit in.
- [Justification](/docs/text-layout/justification/) — how `justify` interacts with spacing and per-paragraph breaks.
- [Shrink to fit](/docs/text-layout/shrink-to-fit/) — spacing is absolute, so it holds under fitting.
- [Styled runs](/docs/text-layout/styled-runs/) — runs share the paragraph's `letter-spacing` and `word-spacing`.
