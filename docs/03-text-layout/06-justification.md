---
title: "Justification"
description: "Full-justify box text with text-align=\"justify\" or align=\"justify\" — full lines flush both edges, last lines ragged."
---

# Justification

Justification stretches each full line to the content width so both edges line up, leaving the last
line of a paragraph ragged in the normal typographic convention. It is available on the box
front-ends: `<textArea>` via `text-align="justify"` and `<x:textbox>` via `align="justify"`. The
`justify` value extends the SVG Tiny 1.2 vocabulary with the CSS/SVG 2 value (spec §6.9).

<Example file="justify" height={400} title="start vs justify, and justify across a break" caption="The same paragraph ragged (left) and justified (right); below, justify with a <tbreak/> — every line but each paragraph's last is stretched." />

## Syntax

```xml
<textArea x="312" y="70" width="236" height="130" font-size="14" text-align="justify">
  Justification spreads the slack on every full line so both edges line up,
  while the final line of the paragraph is left alone.
</textArea>
```

## Attributes

| Element | Attribute | Value | Effect |
| --- | --- | --- | --- |
| `<textArea>` | `text-align` | `justify` | full-justify each qualifying line |
| `<x:textbox>` | `align` | `justify` | full-justify each qualifying line |

## When a line is justified

After wrapping, a line is stretched to the content width only if **all** of these hold (spec §6.9):

- alignment is `justify` **and** the box has a **positive, known content width**. An auto-width
  `<textArea>` has no target width, so it degrades to `start`.
- the line is **not** the last line of its paragraph — the last line, and the last line before each
  `<tbreak/>`, stay ragged.
- the line contains **more than one word** — a lone word has nothing to stretch between.

Justification therefore **resets per `<tbreak/>`**: each forced break starts a fresh paragraph whose
own last line is left ragged. An [ellipsized](/docs/text-layout/overflow/) line is never justified. Justified lines
anchor at the **start** edge.

## How it lowers

A justified line emits `textLength="<content-width>" lengthAdjust="spacing"` on its `<tspan>`; the
renderer distributes the slack into the inter-glyph and inter-word spacing. Glyph *shapes* are not
scaled — contrast [`glyph-x-scale`](/docs/text-layout/spacing/), which uses `lengthAdjust="spacingAndGlyphs"`. On a
line that would carry both, justification wins. v0 spreads the slack uniformly across all gaps rather
than word-gaps only.

## See also

- [Wrapping](/docs/text-layout/wrapping/) — `text-align` and the `<textArea>` region.
- [Textbox](/docs/text-layout/textbox/) — `align` on `<x:textbox>`.
- [Spacing](/docs/text-layout/spacing/) — `<tbreak/>` and `glyph-x-scale`.
- [Overflow & truncation](/docs/text-layout/overflow/) — ellipsized lines aren't justified.
