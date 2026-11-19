---
title: "Styled runs"
description: "tspan runs override fill, weight, size, decoration, links, highlights and borders while flowing and wrapping inline with the paragraph."
---

# Styled runs

A `<tspan>` inside laid-out text is a **run**: a stretch of text that shares the surrounding
paragraph's flow but overrides its paint or type. Bold a word, color a keyword, link a phrase,
highlight a sentence — the runs still wrap together as one paragraph (spec §6.11). This reuses SVG's
own inline `<tspan>` — the same element the compiler emits, now also read on input.

<Example file="styled-runs" title="Runs that flow inline" caption="Bold, italic and colored runs wrap together as one paragraph; on the right, a highlighted run inside justified text." />

## Syntax

```xml
<x:textbox x="34" y="72" width="300" height="140" font-size="15" fill="#0f172a">
  Ship <tspan font-weight="bold" fill="#dc2626">fast</tspan> and
  <tspan text-decoration="underline">safe</tspan> — E = mc<tspan baseline-shift="super"
  font-size="70%">2</tspan>, <tspan x:highlight="#fde047">highlighted</tspan>, and
  <tspan href="https://xsvg.visioncortex.org" fill="#2563eb">linked</tspan>.
</x:textbox>
```

## What a run can override

| On a run | Notes |
| --- | --- |
| `fill` | per-run colour |
| `font-weight`, `font-style`, `font-family` | bold / italic words, a different face |
| `font-size` | a length, or `%` / `em` of the paragraph's size — a line steps by the largest run on it |
| `baseline-shift` | `super` / `sub` / a length or percentage; pair with a smaller `font-size` for footnote marks and formulas |
| `text-decoration` | `underline`, `line-through`, or both |
| `href` | the run becomes a clickable SVG link (an authored `<a>` around a run works too) |
| `x:highlight` | a background colour behind the run — the highlighter |
| `x:border-width` / `-color` / `-opacity` | the run's own [border](/docs/text-layout/bordered-text/); what it leaves out comes from the enclosing run or the box |

## Model

Runs affect a word's **advance** — weight, style, family and size change glyph widths — so each word
is measured in its own run style and wrapping stays correct. A run boundary may fall **mid-word**.
With mixed sizes each line steps by its own tallest run, as a word processor lays mixed type, and
`fit="shrink"` scales run sizes with the base. Runs share the paragraph's `letter-spacing` and
`word-spacing` (see [Spacing](/docs/text-layout/spacing/)). Nested `<tspan>`s compose, inner
winning, and a `<tbreak/>` still breaks across runs.

An underline stops at the end of its run and continues across a space only between two underlined
words — the word-processor convention.

## Where runs apply

Everywhere text is laid out: `<textArea>`, `<x:textbox>` (its paragraphs and lists too), curved
[region flow](/docs/text-layout/flow-into-shapes/), `<text inline-size>`, list items, and table
cells. On [text on a path](/docs/type-on-a-path/overview/) and
[outlined](/docs/vector-output/create-outlines/) text a run repaints its stretch — fill and border.

## How it lowers

Each output line is one positioning `<tspan x y>`; within it, base-styled text is emitted bare and
each run becomes a **nested `<tspan>`** carrying only what differs from the base `<text>`. So a
plain paragraph emits exactly as before. Highlights and decorations have no SVG text equivalent that
draws the same everywhere, so they **bake to rectangles** behind the text, one per run per line,
spanning the run's measured advance — they stay whole under letter-spacing and justification, where
renderers would otherwise draw a decoration glyph by glyph.

## Limits

- Highlights under `direction="rtl"` don't handle mixed bidi: an embedded left-to-right word is
  reordered by the renderer and its highlight lands on the wrong glyphs.
- `<textArea>` measures runs at their sizes but steps by `line-increment` regardless (SVG Tiny
  semantics); only `<x:textbox>` steps mixed sizes line by line.
- A run's hand-written `stroke*` isn't lowered — use its border.

## See also

- [Textbox](/docs/text-layout/textbox/) — the box that carries runs.
- [Justification](/docs/text-layout/justification/) and [Overflow & truncation](/docs/text-layout/overflow/) — how runs interact.
- [Spacing](/docs/text-layout/spacing/) — runs share the paragraph's letter/word spacing.
