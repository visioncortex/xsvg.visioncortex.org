---
title: "Textbox"
description: "The x:textbox element — box text with padding, horizontal and vertical alignment, cap-height centering and shape binding."
---

# Textbox

`<x:textbox>` is Rung 3 of [the ladder](/docs/text-layout/overview/): a purpose-built box for diagram and UI text
(spec §6.4). It shares `<textArea>`'s wrapping and cap-height vertical model but adds the ergonomics a
box actually needs — `padding`, `align`/`valign` keywords, [shrink-to-fit](/docs/text-layout/shrink-to-fit/), and
binding to a referenced shape.

<Example file="alignment" height={400} title="align × valign" caption="Every combination of align (start/center/end) and valign (top/middle/bottom) in a fixed box." />

## Syntax

Give it geometry inline, or bind it to a shape with `in="#id"`:

```xml
<!-- inline geometry -->
<x:textbox x="70" y="52" width="150" height="100"
           padding="8" align="center" valign="middle" font-size="18">Aa Gg</x:textbox>

<!-- bound to a shape's box -->
<rect id="b1" x="24" y="44" width="256" height="58" rx="16" fill="#e5e7eb"/>
<x:textbox in="#b1" padding="12" font-size="13" fill="#111827">Text laid into the bubble.</x:textbox>
```

When `in` is set, the referenced shape supplies the geometry and the inline `x`/`y`/`width`/`height`
are ignored. Binding to a non-rectangular shape flows text inside its outline — see
[Flow into shapes](/docs/text-layout/flow-into-shapes/).

## Attributes

| Attribute | Values | Default | Effect |
| --- | --- | --- | --- |
| `x`, `y`, `width`, `height` | length | — | box geometry (ignored when `in` is set) |
| `in` | `#id` | — | bind to a referenced shape (see [Flow into shapes](/docs/text-layout/flow-into-shapes/)) |
| `padding` | length | `0` | uniform content inset |
| `align` | `start` \| `center` \| `end` \| `justify` | `start` | horizontal alignment (see [Justification](/docs/text-layout/justification/)) |
| `valign` | `top` \| `middle` \| `bottom` | `top` | vertical alignment |
| `fit` | `none` \| `shrink` | `none` | shrink-to-fit (see [Shrink to fit](/docs/text-layout/shrink-to-fit/)) |
| `fit-min` | length | `6` | font-size floor for `shrink` |
| `line-height` | number | `1.2` | line advance multiplier |
| `text-indent` | length | `0` | first-line indent; **negative outdents** (a hanging first line). Applies to `start`/`justify` |

## Vertical alignment — the cap-height model

`valign` doesn't center the em box; it centers the **cap-height band** — the region from the first
line's **cap-top** to the last line's **baseline + descent** (spec §6.5). Centering the em box would
sit low, because a font's ascent is taller than its cap-height. Centering the ink band instead makes
`valign="middle"` look optically centered.

- `valign="top"` — cap-top at the top content edge.
- `valign="middle"` — the band centered in the content height.
- `valign="bottom"` — the band's bottom at the bottom content edge.

**Baseline-stability invariant.** Alignment reserves the *font's* descent (a constant), not each
string's actual ink. So a label with no descenders (`Aa`) and one with descenders (`Gg`) in the same
box land on the **same baseline** — descenders fill the reserved descent rather than pushing the text
up. This holds for every alignment.

`<x:textbox>` and `<textArea>` share this exact model, differing only in line spacing (`line-height`
here, `line-increment` there) and keyword (`valign` here, `display-align` there).

## A worked example — reusing one shape

<Example file="chat" height={380} title="Chat bubbles from two textboxes each" caption="Each bubble binds two <x:textbox> elements to the same rect — the message (top-start) and the timestamp (bottom-end)." />

Because a textbox can bind to a shape and align within it, two textboxes can share one bubble: the
message flows from the top-start and a small timestamp sits `align="end" valign="bottom"` in the same
box.

## How it lowers

`<x:textbox>` compiles to a plain SVG `<text>` carrying one positioned `<tspan>` per laid-out line —
wrapping, fitting and alignment all resolved at compile time. No `x:` element survives into the
output.

## See also

- [Text layout overview](/docs/text-layout/overview/) — the adoption ladder.
- [Wrapping](/docs/text-layout/wrapping/) — `<textArea>`, which shares this vertical model.
- [Shrink to fit](/docs/text-layout/shrink-to-fit/) — the `fit` attribute.
- [Overflow & truncation](/docs/text-layout/overflow/) — `text-overflow`.
- [Flow into shapes](/docs/text-layout/flow-into-shapes/) — `in="#id"` on a curved shape.
