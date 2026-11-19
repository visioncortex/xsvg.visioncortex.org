---
title: "Overflow & truncation"
description: "text-overflow (clip or ellipsis) for box-bound text — one property that handles both block and inline overflow, after shrink-to-fit runs."
---

# Overflow & truncation

When more text than fits lands in a box, `text-overflow` decides what happens to the excess: drop it
silently (`clip`) or mark the cut with an ellipsis (`ellipsis`). One property covers **both** kinds of
overflow — too many lines (block) and a line too wide (inline) — and it works on box-bound text:
`<textArea>` and `<x:textbox>`, not point text or `inline-size` flow (spec §6.6).

<Example file="textarea-ellipsis" title="clip vs ellipsis" caption="clip drops trailing lines with no marker; ellipsis marks a block cut on the last visible line and trims an over-wide word inline." />

## Attributes

| Attribute | Values | Default | Effect |
| --- | --- | --- | --- |
| `text-overflow` | `clip` \| `ellipsis` | `clip` | how overflow is resolved on box-bound text |
| `overflow` | `hidden` \| `visible` | `hidden` | whether the box crops at all (`<x:textbox>`, `<textArea>`) |

`text-overflow` is the unprefixed CSS/SVG 2 name. `clip` is the default and reproduces SVG Tiny 1.2
behavior. In paragraph mode the ellipsis lands on the block's last rendered line, whichever paragraph
it falls in.

**`overflow="visible"`** lifts the crop: every line renders where layout placed it, keeping the
box's `valign` — so middle-aligned overflow spills both ways — and `text-overflow` has nothing to act
on. Text flowed into a curved shape continues past it at the shape's bounding-box width. Fit still
runs first; only the cropping is lifted.

## The two overflow axes

- **Block overflow** — more wrapped lines than fit the content height.
- **Inline overflow** — a single line wider than the content width (an unbreakable token).

## The pipeline

Overflow is resolved in a fixed order (spec §6.6):

1. **Resolve the font size** — apply [`fit`](/docs/text-layout/shrink-to-fit/) first.
2. **Wrap** the text at that size.
3. **Count the fitting lines** `C` — the lines whose **baseline** lies within the content height
   (`C` = all lines if `height` is `auto`).
4. **Apply `text-overflow`.**

A line is counted by its **baseline**, not its full ink band. So a line whose cap-top or descent
merely grazes the edge still renders and visually overflows rather than vanishing — only a baseline
past the box is genuine block overflow.

### `clip`

Render lines `0 … C−1` and drop the rest. Inline overflow (and the ink of a grazing line) renders
past the box; a higher-quality backend may emit a clip path.

### `ellipsis`

Render lines `0 … C−1`; if lines were dropped, the **last rendered line** is ellipsized. Any rendered
line wider than the content width is also ellipsized. If `C = 0`, nothing renders.

Ellipsizing a line strips trailing whitespace, then trims trailing **characters** until the line plus
the `…` marker fits, re-stripping exposed whitespace so the result reads `word…` and not `word …`. If
the line empties before the marker fits, just `…` is drawn.

| Edge case | Result |
| --- | --- |
| empty / whitespace-only | nothing |
| box too short for one line (`C = 0`) | nothing |
| box narrower than `…` | nothing |
| text fits | no marker (identical to `clip`) |
| line trims to empty before `…` fits | just `…` |

v0 truncates at the inline **end** only, with a single `…` (U+2026) marker.

## Fit and truncate are sequential, not rival

`fit` and `text-overflow` answer different questions — *should the font adapt to the box?* and *what
becomes of whatever still overflows?* `fit="shrink"` reduces how much overflows by shrinking the font,
but only down to the `fit-min` floor; `text-overflow` then handles the residual at that floor. So
truncation fires **only when fit bottoms out at `fit-min` and the text still doesn't fit**. With no
`fit`, `text-overflow` acts at the authored size.

## How it lowers

`text-overflow` is implemented by emitting `<tspan>`s — the dropped lines simply aren't emitted, and
an ellipsized line is emitted as its trimmed text plus the marker. Because it lowers to ordinary
positioned text, it renders without any SVG-2 support (unlike CSS `-webkit-line-clamp`).

## See also

- [Shrink to fit](/docs/text-layout/shrink-to-fit/) — runs before truncation.
- [Textbox](/docs/text-layout/textbox/) and [Wrapping](/docs/text-layout/wrapping/) — the box front-ends this applies to.
- [Justification](/docs/text-layout/justification/) — an ellipsized line is never justified.
