---
title: "Styled runs"
description: "tspan runs inside textArea and x:textbox override fill, weight, style and family while flowing and wrapping inline."
---

# Styled runs

A `<tspan>` child of a `<textArea>` or `<x:textbox>` is a **run**: a stretch of text that shares the
surrounding paragraph's flow but overrides its paint or style. Bold a word, color a keyword, italicize
a phrase — the runs still wrap together as one paragraph (spec §6.11). This reuses SVG's own inline
`<tspan>` — the same element the compiler emits, now also read on input.

<Example file="styled-runs" height={250} title="Runs that flow inline" caption="Bold, italic and colored runs wrap together as one paragraph; on the right, a highlighted run inside justified text." />

## Syntax

```xml
<textArea x="34" y="72" width="272" height="128" font-size="15" fill="#0f172a">
  Ship <tspan font-weight="bold" fill="#dc2626">fast</tspan> and
  <tspan font-style="italic" fill="#2563eb">safe</tspan> — the runs flow inline,
  wrap across lines, and each keeps its own
  <tspan font-weight="bold" fill="#059669">fill and weight</tspan>.
</textArea>
```

## What a run can override

| Overridable on a run | Notes |
| --- | --- |
| `fill` | per-run color |
| `font-weight`, `font-style` | e.g. bold / italic words |
| `font-family` | per-run typeface |

## Model

Runs affect a word's **advance** — weight, style and family change glyph widths — so each word is
measured in its own run style and wrapping stays correct. A run boundary may fall **mid-word** (two
pieces with no break between them). `font-size` is **not** overridable in v0 — mixed sizes would
perturb line-height and the baseline, so runs share the paragraph's size, `letter-spacing` and
`word-spacing` (see [Spacing](/docs/text-layout/spacing/)). Nested `<tspan>`s compose, inner winning, and a
`<tbreak/>` still breaks across runs.

Runs coexist with the other box features: a run can sit inside [justified](/docs/text-layout/justification/) text
(the line still stretches around it), and [ellipsis](/docs/text-layout/overflow/) truncation trims from the last run
inward.

## How it lowers

Each output line is one positioning `<tspan x y>` (which also carries any `justify` or `glyph-x-scale`
`textLength`); within it, base-styled text is emitted bare and each run becomes a **nested `<tspan>`**
carrying only the attributes that differ from the base `<text>`. So a plain paragraph with no runs
emits exactly as before — no nested spans.

## v0 limits

Styled runs apply to the **rectangular** box front-ends — `<textArea>` and `<x:textbox>`, including
`in="#rect"`. Curved-shape [region flow](/docs/text-layout/flow-into-shapes/) and `<text inline-size>` flatten runs
to the base style. Per-run `stroke` and `font-size` are future work.

## See also

- [Wrapping](/docs/text-layout/wrapping/) — `<textArea>`, which carries runs.
- [Textbox](/docs/text-layout/textbox/) — `<x:textbox>`, which carries runs.
- [Justification](/docs/text-layout/justification/) and [Overflow & truncation](/docs/text-layout/overflow/) — how runs interact.
- [Spacing](/docs/text-layout/spacing/) — runs share the paragraph's letter/word spacing.
