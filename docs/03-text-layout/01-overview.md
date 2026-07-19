---
title: "Text layout overview"
description: "The progressive-adoption ladder for wrapped, fitted, box-bound text — from one attribute on a text element to the full x:textbox element."
---

# Text layout overview

SVG has no line breaking: a plain `<text>` element draws one run on one line and lets it spill past
any box you meant it to sit in. xsvg adds wrapping, box models, fitting and justification on top of
SVG's own text, so the same words wrap, fit and align instead of overflowing.

You adopt it one rung at a time. Each rung does more and costs a little more markup, and each
degrades predictably in a plain SVG viewer (see [graceful degradation](/docs/introduction/graceful-degradation/)).

<Example file="wrap-vs-overflow" title="Overflow, then two fixes" caption="Plain SVG text spills out of its box (left); inline-size wraps it (middle); x:textbox wraps, centers and shrinks it to fit (right)." />

## The progressive-adoption ladder

| Rung | You write | Cost | What you get |
| --- | --- | --- | --- |
| 1 | `inline-size` on a plain `<text>` | add one attribute | wrap to a width; degrades **visible** (uncompiled, the text still shows, just unwrapped) |
| 2 | swap `<text>` for `<textArea>` | swap the tag | SVG Tiny 1.2 flowed text — width/height regions, block alignment, forced breaks |
| 3 | `<x:textbox>` | a new element | full diagram ergonomics — `padding`, `align`/`valign`, shrink-to-fit, shape binding |

**Rung 1 — `<text inline-size>`.** The smallest possible change. Add `inline-size="W"` to a `<text>`
and it wraps to width `W`, flowing downward from the baseline at `y`. Because it is an *attribute* on
a standard element, an uncompiled file still renders the text — it just doesn't wrap. See
[Wrapping](/docs/text-layout/wrapping/).

**Rung 2 — `<textArea>`.** Swap `<text>` for the SVG Tiny 1.2 `<textArea>` and you get a real region:
explicit or automatic `width`/`height`, `text-align` and `display-align`, `line-increment` line
spacing, and `<tbreak/>` forced breaks. See [Wrapping](/docs/text-layout/wrapping/).

**Rung 3 — `<x:textbox>`.** The xsvg box, built for diagrams and UI. Inline `x`/`y`/`width`/`height`
or bind to any shape with `in="#id"`; add `padding`, `align`, `valign`, and
[shrink-to-fit](/docs/text-layout/shrink-to-fit/). See [Textbox](/docs/text-layout/textbox/).

## Shared behavior

All three front-ends share one layout core (spec §6.1):

- **Measurement** — words are measured once at the base size; trial sizes scale widths linearly.
- **Wrapping** — greedy first-fit, breaking only at whitespace. A token wider than the width is
  placed alone and overflows. No hyphenation in v0.
- **Fitting** — shrink-to-fit (`<x:textbox>` only) binary-searches the font size, re-wrapping each
  trial.

## How it lowers

Every rung compiles to plain, positioned SVG `<text>` (with `<tspan>`s per line) — no runtime, no
SVG-2 features required. The layout is computed at compile time and baked into ordinary text.

## See also

- [Wrapping](/docs/text-layout/wrapping/) — `inline-size` and `<textArea>`.
- [Textbox](/docs/text-layout/textbox/) — the `<x:textbox>` element.
- [Shrink to fit](/docs/text-layout/shrink-to-fit/) — auto-sizing text to a fixed box.
- [Graceful degradation](/docs/introduction/graceful-degradation/) — how each rung degrades.
