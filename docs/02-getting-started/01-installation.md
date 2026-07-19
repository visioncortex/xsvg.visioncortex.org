---
title: "Installation"
description: "Install the browser viewer, the Node compiler, or the pure-Rust CLI."
---

# Installation

xsvg ships as two npm packages and a CLI, all over one compiler. Pick the one that matches where you
compile.

## Browser — `@visioncortex/xsvg-viewer`

The WASM compiler plus drop-in viewer surfaces. The WASM is inlined, so it works in any bundler with
no extra configuration.

```bash
npm install @visioncortex/xsvg-viewer
```

### Compile & preview API

The low-level entry points — compile to a string, or mount a self-contained preview surface:

```ts
import { compileXsvg, createPreview } from "@visioncortex/xsvg-viewer";

// one-shot compile to a plain-SVG string
el.innerHTML = await compileXsvg(source);

// …or a self-contained preview (fit-to-contain, + a slide deck for multi-artboard docs)
createPreview(host, { hashDeepLink: true }).render(source);
```

### React components

`react` is an optional peer dependency. Two components, from the `/react` entry point:

```tsx
import { XsvgView, XsvgViewInteractive } from "@visioncortex/xsvg-viewer/react";

// static embed — compiles and renders inline, like an image
<XsvgView src="/diagrams/pie.xsvg" />            // or source={`<svg …>…</svg>`}

// full interactive viewer — pan/zoom, artboard deck, optional source inspector
<XsvgViewInteractive src="/diagrams/deck.xsvg" inspector />
```

This documentation site uses both: `XsvgView` powers the inline examples, and `XsvgViewInteractive`
powers the [viewer](/viewer/) behind every "Open in viewer" link. `XsvgViewInteractive` lazy-loads
CodeMirror only when `inspector` is enabled.

### Custom elements

Prefer plain HTML with a bundler? Import an element's entry point once to register it, then use the
tag anywhere:

```ts
import "@visioncortex/xsvg-viewer/element";       // registers <xsvg-view>
import "@visioncortex/xsvg-viewer/interactive";   // registers <xsvg-view-interactive>
```

```html
<xsvg-view src="diagram.xsvg"></xsvg-view>
<xsvg-view-interactive src="deck.xsvg"></xsvg-view-interactive>
```

### Single-file bundle

For the simplest embed with no bundler at all, the single-file build (`@visioncortex/xsvg-viewer/xsvg.js`)
registers `<xsvg-view>` from one script tag — drop the element in and it renders like an image. See
[Playground & preview](/docs/getting-started/playground-and-viewer/).

## Node — `@visioncortex/xsvg-compile`

The same compiler, no browser. Synchronous.

```bash
npm install @visioncortex/xsvg-compile
```

```ts
import { compile } from "@visioncortex/xsvg-compile";
import { writeFileSync } from "node:fs";

writeFileSync("out.svg", compile(source, { fontDir: "./fonts" }));
```

## CLI — pure Rust

A pure-Rust binary, no browser. Ahead-of-time compile.

```bash
cargo install --path crates/xsvg-cli
xsvg deck.xsvg --font-directory ./fonts -o deck.svg
```

## Next steps

- [Your first document](/docs/getting-started/your-first-document/) — write and compile an xsvg document.
- [Playground & preview](/docs/getting-started/playground-and-viewer/) — the in-browser tools.
