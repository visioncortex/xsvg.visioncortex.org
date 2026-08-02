---
title: "Playground & preview"
description: "The in-browser tools — a live editor, a chrome-less preview for embedding, and the single-file element."
---

# Playground & preview

Everything on this site compiles xsvg **in your browser** with the viewer package. Three surfaces
share that one compiler.

## The Playground

The [Playground](/playground/) is a CodeMirror editor beside a live compiled preview. Edits
recompile as you type; a sample picker seeds the editor from the full [examples](/examples/) set; and
the document round-trips through the URL so links are shareable.

- `/playground/?file=<name>` — preload a bundled sample.
- The **Copy link** button encodes the current document into the URL hash.
- **Download SVG** saves the compiled plain SVG.

## The preview surface

Every live example on this site is an `<iframe>` pointing at the chrome-less **preview** page, which
renders a document fit-to-contain (letterboxed, never scrolls) so it embeds at any aspect ratio.

- `/preview/?file=<name>` — render a bundled sample.
- `/preview/?file=<name>#3` — jump to the 3rd [artboard](/docs/layers-and-artboards/artboards/) of a
  multi-artboard document.

It's built on the reusable `createPreview()` from the viewer package — the same one you can drop into
your own app:

```ts
import { createPreview } from "@visioncortex/xsvg-viewer";

const preview = createPreview(hostEl, { hashDeepLink: true, showErrors: true });
await preview.render(source);
```

Multi-artboard documents get a slide deck (thumbnail rail + ‹ n/N › nav) for free.

## The interactive viewer

The [viewer](/viewer/) behind every "Open in viewer" link is `<xsvg-view-interactive>`: pan/zoom, the
artboard deck, and an optional source inspector that maps a rendered element back to the source range
that produced it — and back again.

Pinning an element opens an **attributes** panel built from that element's own declaration: typed
fields with the declared defaults, ranges, and help text, disabled where an attribute is inert
(overridden by another) or can't be applied by an attribute edit alone. It works identically for
built-in `x:` elements and for elements from a
[loaded generator module](/docs/extensibility/generators/) the compiler has never heard of, because
both describe themselves the same way. Position and extent are deliberately absent — they belong to
canvas handles, and the attribute table above the panel still shows their values.

Edits are **live**: an edit re-emits only the elements it can have changed and patches them into the
rendered drawing, so pan/zoom, the source pane, the deck, the pinned selection, and the control under
the pointer all survive it. That is what makes a bounded parameter's slider commit as it moves.

## The single-file embed — `<xsvg-view>`

For the simplest possible embed, the single-file bundle registers a custom element. One script tag,
drop the element in, it renders like an image — no other code:

```html
<script src="xsvg.js"></script>
<xsvg-view src="diagram.xsvg"></xsvg-view>
```

Or with an inline data island (keeps the custom XML opaque to the HTML parser):

```html
<xsvg-view>
  <script type="application/xsvg+xml">
    <svg viewBox="0 0 320 140" xmlns:x="https://xsvg.visioncortex.org"> … </svg>
  </script>
</xsvg-view>
```

## Next steps

- [Text layout](/docs/text-layout/overview/) — start with the feature xsvg is built around.
- Browse the [examples gallery](/examples/).
