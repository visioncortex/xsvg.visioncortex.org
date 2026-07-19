---
title: "Theming — design tokens"
description: "Declare a color palette and type scale once as tokens, reference them everywhere, and resolve them all at compile time."
---

# Theming — design tokens

`<x:theme>` declares a document's **design tokens** — the brand palette and type scale a whole document is built around — resolved at **compile time** so the output is plain SVG with no variables left to resolve live. Change a token and the whole document restyles; an uncompiled viewer degrades cleanly, since `<x:theme>` compiles to nothing and every reference already carries a literal fallback or resolves away.

<Example file="theme" title="Themed by tokens" caption="Colors reference var(name) and text pulls x:font tokens from one shared type scale — edit a token in x:theme and the whole document restyles." />

## Syntax

```xml
<x:theme>
  <x:color name="accent" value="#6366f1"/>
  <x:font  name="title" font-family="Georgia" font-size="40" font-weight="800" line-height="1.05"/>
</x:theme>

<text x:font="title" fill="var(accent)">Themed</text>
```

## Color tokens

`<x:color name value>` declares a color token. Reference it from **any paint attribute** — `fill`, `stroke`, `stop-color`, `marker-fill`, gradient stops, mesh stops — as **`var(name)`** or **`var(name, fallback)`** (CSS-variable syntax; a leading `--` is optional). Resolution runs over every emitted attribute value, so it reaches standard SVG elements too. An unknown token uses its fallback, otherwise is left verbatim (rendering as the property's initial value, like a dangling CSS variable).

## Font tokens

`<x:font name …>` declares a named bundle of type properties — `font-family`, `font-size`, `font-weight`, `font-style`, `line-height`, `letter-spacing`, `word-spacing` — like the CSS `font` shorthand. Apply it with **`x:font="name"`** on any text element (`<text>`, `<textArea>`, `<x:textbox>`, `<x:list>`, and inherited via `<g x:font>`).

A font token is an **overridable base**: the element's own `font-*` attributes win over the token; unset ones fall to the token, then to the built-in defaults.

## Attributes

| Attribute | On | Values | Description |
|---|---|---|---|
| `name` | `<x:color>` | identifier | token name referenced as `var(name)` |
| `value` | `<x:color>` | color | the color the token resolves to |
| `name` | `<x:font>` | identifier | token name referenced as `x:font="name"` |
| `font-family` `font-size` `font-weight` `font-style` `line-height` `letter-spacing` `word-spacing` | `<x:font>` | CSS values | the type properties the token bundles |
| `var(name)` / `var(name, fallback)` | any paint attribute | — | reference a color token, with an optional fallback |
| `x:font="name"` | any text element | token name | apply a font token as an overridable base |

Tokens load once per compile, and forward references work — a `var()` may appear before its `<x:theme>`.

## How it lowers

`<x:theme>` itself compiles to nothing (it is definitions only). Every `var()` is replaced by its resolved literal color, and `x:font` is stripped on emit after its properties are folded into the element's `font-*` attributes. The output is plain SVG that an unknown viewer never sees a `var()` in.

## See also

- [How it compiles](/docs/introduction/how-it-compiles/) — the resolve stage that folds tokens.
- [Graceful degradation](/docs/introduction/graceful-degradation/) — why uncompiled documents still render.
- [xsvg Specification §4.1](https://github.com/visioncortex/xsvg/blob/main/docs/Specification.md)
