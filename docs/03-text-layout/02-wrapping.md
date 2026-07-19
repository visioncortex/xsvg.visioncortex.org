---
title: "Wrapping"
description: "Wrap SVG text to a width with inline-size on a plain text element (Rung 1) or the SVG Tiny 1.2 textArea region (Rung 2)."
---

# Wrapping

Wrapping is the base win: text that reflows to a width instead of running off the edge. xsvg offers
two rungs — one attribute on a plain `<text>`, or the SVG Tiny 1.2 `<textArea>` element. Both use the
same greedy, break-on-whitespace line breaker (spec §6.1).

<Example file="textarea" title="textArea flowed text" caption="A textArea wraps to its width and flows top-down; text-align and display-align place it within the region." />

## Rung 1 — `<text inline-size>`

Add `inline-size="W"` to a standard `<text>` and it wraps to width `W` and flows downward. The
**first line's baseline is at `y`** (the SVG `<text>` convention); each further baseline steps down by
`line-height · font-size` (default `line-height` = `1.2`). Horizontal alignment follows the inherited
`text-anchor` (spec §6.2).

```xml
<text x="215" y="86" font-size="14" inline-size="130">
  This caption is far too long, so it wraps to fit the box
</text>
```

Because `inline-size`, `line-height` and `text-wrap` are attributes on a standard element, an
uncompiled file still shows the text — it just won't wrap. This is the *visible* degradation of
[the ladder](/docs/text-layout/overview/).

### Attributes

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `inline-size` | length | — | wrap width; enables flow. Omit for point text (passes through) |
| `line-height` | number | `1.2` | baseline advance as a multiple of `font-size` |
| `text-wrap` | `wrap` \| `balance` | `wrap` | `balance` evens the line lengths of a short block |
| `text-anchor` | `start` \| `middle` \| `end` | `start` | horizontal alignment of each line (inherited) |

## Rung 2 — `<textArea>`

Swap `<text>` for the SVG Tiny 1.2 `<textArea>` to get a flowed **region** (spec §6.3). It adds
block-level controls a bare `inline-size` doesn't have: automatic sizing, block alignment, tunable
line spacing, and forced breaks.

```xml
<textArea x="220" y="62" width="150" height="124"
          font-size="14" text-align="center" display-align="center">
  Centered both ways using text-align and display-align.
</textArea>
```

### Attributes

| Property / attr | Values | Initial | Effect |
| --- | --- | --- | --- |
| `x`, `y` | length | `0` | region corner |
| `width`, `height` | length \| `auto` | `auto` | `width:auto` ⇒ no wrap; `height:auto` ⇒ grow (no clip) |
| `text-align` | `start` \| `end` \| `center` \| `justify` | `start` | inline alignment (`justify` — see [Justification](/docs/text-layout/justification/)) |
| `display-align` | `auto` \| `before` \| `center` \| `after` | `auto` (= `before`) | block alignment |
| `line-increment` | `auto` \| number | `auto` | line-box height; `auto` = `1.1 × font-size` |

### Sizing and line spacing

<Example file="textarea-sizing" title="Auto width, clipping height, and line-increment" caption="width=auto never wraps; a short height clips overflow lines; line-increment tunes the line-box height." />

- **`width:auto`** — no wrap; the text stays on one line (each `<tbreak/>` still starts a new one).
- **`height:auto`** — the region grows to hold every line; nothing is clipped.
- **Explicit `height`** — lines whose **baseline** falls outside the region are not rendered
  (clipped; see [Overflow](/docs/text-layout/overflow/)).
- **`line-increment`** — the SVG Tiny 1.2 line-box height that baselines step by; `auto` is
  `1.1 × font-size`. A larger value loosens the leading, a smaller one tightens it.

Block placement uses the **cap-height ink band**, not the em box, so centered text is optically
centered rather than biased low — the same vertical model `<x:textbox>` uses (see
[Textbox](/docs/text-layout/textbox/)).

### Forced breaks — `<tbreak/>`

A `<tbreak/>` child ends the current line and starts a new one; wrapping resumes independently on each
side, and consecutive breaks make blank lines. It is the only child element `<textArea>` interprets in
v0. See [Spacing](/docs/text-layout/spacing/#tbreak).

**Not yet implemented:** `xml:space="preserve"`, full UAX #14 line-breaking (v0 breaks on
whitespace), and `editable`.

## How it lowers

Both rungs compile to plain SVG `<text>`: `inline-size` flow is emitted as a `<text>` carrying one
positioned `<tspan>` per line; `<textArea>` becomes a `<text>` of positioned `<tspan>` lines. No
SVG-2 or Tiny-1.2 support is needed in the viewer.

## See also

- [Text layout overview](/docs/text-layout/overview/) — the adoption ladder.
- [Textbox](/docs/text-layout/textbox/) — Rung 3, with padding, valign and fit.
- [Justification](/docs/text-layout/justification/) — the `justify` value.
- [Spacing](/docs/text-layout/spacing/) — `<tbreak/>`, letter and word spacing.
- [Styled runs](/docs/text-layout/styled-runs/) — `<tspan>` runs inside a `<textArea>`.
