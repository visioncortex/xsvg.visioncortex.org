---
title: "Loadable generators"
description: "<x:import> binds an XML namespace to a compiled WASM module, so a document can use elements the compiler knows nothing about — procedural clipart and custom diagram shapes that compose exactly like built-ins."
---

# Loadable generators

Everything else in these docs is an element the compiler ships with. `<x:import>` adds elements it
**doesn't**: it binds an XML namespace to a compiled WASM module — a *geometry generator* — and every
element in that namespace is lowered by the module into the same plain-SVG subset as a built-in.

```xml
<xsvg viewBox="0 0 420 260"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:x="https://xsvg.visioncortex.org"
      xmlns:clip="https://xsvg.visioncortex.org/ext/clipart">

  <x:import ns="https://xsvg.visioncortex.org/ext/clipart" src="clipart.wasm"/>

  <clip:arrow x1="30" y1="60" x2="240" y2="60" thickness="22" head-width="56"/>
</xsvg>
```

<Example file="clipart" title="Elements the compiler has never heard of" caption="<clip:arrow> is a leaf generator — parameters in, geometry out; <clip:callout> is a container, sized to the textbox it wraps. Both come from clipart.wasm." />

This is the part of xsvg that isn't ours to finish. **Anyone can write a module** — the
[SDK](/docs/extensibility/writing-a-generator/) is one trait and one macro — and the official
`clipart` extension goes through exactly the same public seam as yours would, with no compiled-in
privilege. If a shape you draw over and over could be described by a handful of numbers, it can be an
element.

## Two ways to think about it

**An XML transformer, in the XSLT tradition.** xsvg is XML in, XML out: a declarative document
describing *what* it wants, lowered to plain SVG by a transformation you never write imperatively.
`<x:import>` is that tradition's extension mechanism — XSLT binds extension elements by namespace and
so does xsvg, except the implementation is a portable WASM module rather than a processor-specific
Java or C hook, so the same document transforms the same way in every host. You aren't scripting the
compiler; you're teaching it a new element.

**A geometry shader.** A module is a **pure function from parameters to geometry**: no document
access, no host callbacks, no network, no state carried between runs. Give it the same attributes and
it returns the same shape — in the browser, in the CLI, and in Node, from the same bytes. That's why
a generated shape is as trustworthy an operand as a built-in one, and why nothing it emits can escape
the static-SVG subset.

## `<x:import>`

| Attribute | Required | Meaning |
| --- | --- | --- |
| `ns` | yes | the namespace URI to bind |
| `src` | yes | the module, resolved like a cross-file [`<use href>`](/docs/composition/cross-file-use/) |
| `integrity` | recommended | SRI-style `sha256-…`, checked before the module runs |

Like [`<x:theme>`](/docs/theming/overview/), it is a **definition**: collected before compilation,
emits nothing, and may appear anywhere in the document — forward references work. A namespace binds
once (a conflicting second binding degrades with a marker, first wins), and the core `x:` namespace
can never be bound, so a module cannot shadow a built-in.

## Generators are ordinary elements

A generator element is not a second-class citizen bolted on at the end:

- **It composes.** Its emitted geometry is harvested like any other, so a `<clip:arrow>` is a valid
  [`<x:boolean>`](/docs/diagrams/booleans/) operand, a [`<x:warp>`](/docs/warp/overview/) target, or
  the `in="#id"` container for a [textbox](/docs/text-layout/textbox/).
- **It takes geometry in.** `in="#id"` resolves to a path and reaches the module as one.
- **It can wrap content.** An element the module declares a **container** gets its children compiled
  and measured *first*, then handed over as markup plus boxes — which is how `<clip:callout>` sizes a
  bubble to whatever text it holds.
- **Themes apply.** `var()` tokens are resolved before the module sees an attribute, so
  `fill="var(accent)"` works without the module knowing themes exist.
- **Reserved attributes stay reserved.** `id`, `transform`, `x:layer`, `x:order`, `x:hidden`, and
  `x:artboard` are handled by the compiler — the element stays referenceable, placeable, and
  layerable. Everything else on the element is the module's parameter surface.
- **It recompiles incrementally.** Editing the element re-emits it alone; editing an `<x:import>`
  re-emits every element in that namespace; editing an `in="#id"` target re-emits its dependents.

## Nothing a module returns escapes the sandbox

The module's output is **compiled by the core exactly like document content** — it may contain `x:`
elements, which lower normally (a generator can emit an `<x:offset>` and let the compiler do the
work). Then the whole lowered result passes one set of output rules, **stricter than for authored
markup**:

- nothing executes — `<script>`, `<animate*>` and `on*` handlers are dropped;
- nothing **fetches** — every `href`, `src` and `url(…)` must be a same-document `#fragment` or an
  embedded `data:image`, and `<foreignObject>` and `<style>` are dropped, so a module can't reach the
  network or make the host read another file;
- nothing **collides** — the ids a module emits are namespaced to the element that produced them, so
  they can't shadow the document's own and capture its references.

What was removed is counted in a marker rather than swallowed. The fetch rule matters most for
containers: a container module is handed its children already compiled — real document content — so
any outbound request would let it exfiltrate them. Authored markup is deliberately untouched; an
author writing a remote `<image href>` chose it.

None of this is a claim about cost: the native hosts bound a runaway module with wasmi fuel, but a
browser can't interrupt a synchronous call on its main thread. And a same-origin module without
`integrity` is trusted on first use — pin the hash for anything you didn't write.

[Totality](/docs/introduction/graceful-degradation/) holds too. A module that fails to load, fails
its `integrity` check, declines an element, or returns malformed markup degrades **that element**
with a marker naming the reason — never an error, never a lost document. An element in a namespace
nothing has bound degrades the same way, which is what makes unknown markup an extension point
rather than noise.

## The three tiers

Dispatch is by namespace URI, so the tiers *are* namespaces:

| Tier | Namespace URI | Ships from |
| --- | --- | --- |
| **Core** | `https://xsvg.visioncortex.org` | compiled into the compiler; normative and permanent |
| **Official extensions** | `https://xsvg.visioncortex.org/ext/<module>` | this project, as versioned WASM modules — experimental, may change or graduate to core |
| **Third-party** | any other URI you control | anyone |

Official extensions load through the **same public seam** as anyone else's — same explicit
`<x:import>`, same sandbox, no compiled-in privilege. `clipart` (`<arrow>`, `<callout>`) is the first
of them. Prefixes are convention: bind the namespace to whatever prefix you like.

## Across hosts

The same module bytes run in the browser, the CLI, and Node, so a generator's output is identical by
construction rather than by keeping two implementations in step.

- **Browser** — fetches `src` **same-origin by default**; a cross-origin `src` needs `integrity`.
- **CLI and Node** — **local paths only**. A `src` with a scheme degrades rather than being fetched:
  a command-line compile reaching the network would be a surprise. Vendor the module next to the
  document. The native hosts additionally bound a runaway generator with wasmi fuel.
- Every host checks `integrity` (one padded-base64 spelling works everywhere) and isolates modules
  from each other and from successive compiles.
- Opt out entirely with `xsvg --no-plugins` or `compile(src, { plugins: false })`.

### Supplying the bytes yourself

A host that can't fetch — a VS Code webview under a strict CSP reaches neither `file://` nor an
arbitrary origin — supplies a **`PluginLoader`** and the bytes arrive over whatever channel it
already has. Every browser surface takes it, mirroring the `loader` hook for cross-file deps:

```ts
import { compileXsvg, createPreview, type PluginLoader } from "@visioncortex/xsvg-viewer";

const plugins: PluginLoader = {
  key: (base, src) => new URL(src, base).href,          // canonical cache key
  fetch: async (key) => rpc.readFile(key),              // → Promise<ArrayBuffer>
};

await compileXsvg(source, { plugins });                 // or `plugins: false` to load none
createPreview(host, { plugins });
```

```html
<xsvg-view src="diagram.xsvg"></xsvg-view>
<script>document.querySelector("xsvg-view").plugins = plugins;</script>
```

`<xsvg-view-interactive>` takes the same property. Unset, the default same-origin fetch applies.

## See also

- [Writing a generator](/docs/extensibility/writing-a-generator/) — the plugin SDK and its manifest.
- [Cross-file `<use>`](/docs/composition/cross-file-use/) — the other compile-time dependency, and
  the resolution rules `src` follows.
- [Graceful degradation](/docs/introduction/graceful-degradation/) — why an unbound namespace is
  never an error.
