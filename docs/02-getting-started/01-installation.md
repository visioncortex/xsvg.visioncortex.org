---
title: "Installation"
description: "Install the browser viewer, the Node compiler, or the pure-Rust CLI."
---

# Installation

xsvg ships as two npm packages and a CLI, all over one compiler. Pick the one that matches where you
compile.

## Browser — `@visioncortex/xsvg-viewer`

The WASM compiler plus a drop-in preview surface. The WASM is inlined, so it works in any bundler
with no extra configuration.

```bash
npm install @visioncortex/xsvg-viewer
```

```ts
import { compileXsvg, createPreview } from "@visioncortex/xsvg-viewer";

// one-shot compile to a plain-SVG string
el.innerHTML = await compileXsvg(source);

// …or a self-contained preview (fit-to-contain, + a slide deck for multi-artboard docs)
createPreview(host, { hashDeepLink: true }).render(source);
```

There's also a single-file **`<xsvg-view>`** custom element for the simplest embed — one script tag,
drop the element in, it renders like an image. See [Playground & preview](/docs/getting-started/playground-and-viewer/).

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
