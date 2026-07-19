---
title: "Shrink to fit"
description: "The fit attribute on x:textbox — binary-search the font size so a paragraph of any length fills a fixed box."
---

# Shrink to fit

Shrink-to-fit sizes the type to the box instead of the box to the type. Set `fit="shrink"` on an
`<x:textbox>` and, when the text is too big for the box at its authored `font-size`, xsvg reduces the
size until the whole wrapped paragraph fits — down to a legibility floor (spec §6.1, §6.4). It is the
key to equal-sized cards, buttons and labels holding text of different lengths.

<Example file="cards" title="Cards that stay equal" caption="Three identical boxes; each description shrinks to fit, so the cards line up regardless of text length." />

## Syntax

```xml
<x:textbox x="20" y="70" width="160" height="110" padding="14"
           align="center" valign="middle"
           font-size="20" fit="shrink" fit-min="7">
  A textbox shrinks the font size until the whole paragraph fits the fixed box.
</x:textbox>
```

## Attributes

| Attribute | Values | Default | Effect |
| --- | --- | --- | --- |
| `fit` | `none` \| `shrink` | `none` | `shrink` reduces the font size to make the wrapped block fit the box height |
| `fit-min` | length | `6` | the smallest font size `shrink` will use — the legibility floor |
| `font-size` | length | inherited | the **maximum** (authored) size; fitting never grows past it |

`fit` applies to `<x:textbox>` only. The authored `font-size` is the ceiling: fitting searches
downward from it, never up.

## The algorithm

Fitting binary-searches the font size in the range `[fit-min, font-size]` for the **largest** size
whose wrapped block fits the box's content height, and **re-wraps on every trial** — because a smaller
size wraps into different lines, the search can't reuse one wrap (spec §6.1). Word widths are measured
once at the base size and scaled linearly per trial, so the search is cheap.

1. Try the authored `font-size`. If the wrapped block already fits, use it — nothing shrinks.
2. Otherwise binary-search down toward `fit-min`, re-wrapping at each candidate size.
3. Settle on the largest size that fits.

If the text still doesn't fit at `fit-min`, fitting stops at the floor and hands the residual overflow
to `text-overflow` (see [Overflow & truncation](/docs/text-layout/overflow/)) — the two are sequential, not in
conflict: `fit` reduces *how much* overflows, `text-overflow` handles whatever still does.

## How it lowers

Fitting happens entirely at compile time. The chosen size is applied, the text is wrapped and aligned,
and the box lowers to a plain SVG `<text>` at that resolved size — the output carries no hint that it
was fitted.

## See also

- [Textbox](/docs/text-layout/textbox/) — the `<x:textbox>` element.
- [Overflow & truncation](/docs/text-layout/overflow/) — what happens when fit bottoms out.
- [Wrapping](/docs/text-layout/wrapping/) — the greedy line breaker each trial re-runs.
