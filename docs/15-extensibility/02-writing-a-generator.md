---
title: "Writing a generator"
description: "The plugin SDK — declare an element's attributes as a Rust struct, implement one trait, and the derived manifest gives every host a property panel it can't get wrong."
---

# Writing a generator

A generator module is a WASM module with a small, boring string ABI: a JSON request in, a fragment
of markup out. You don't write that ABI by hand — `xsvg-plugin` is the SDK, and `xsvg-schema`
derives both an element's machine-readable description **and** the code that reads its attributes
from one declaration.

## Declare, then implement

```rust
use xsvg_plugin::{ElementSpec, Params, Plugin, Request};

#[derive(Params)]
#[element(name = "arrow", doc = "An outlined thick arrow.")]
struct Arrow {
    #[param(default = 0.0, geometry)] x1: f64,
    #[param(default = 0.0, geometry)] y1: f64,
    #[param(default = 16.0, min = 0.0, max = 200.0)] thickness: f64,
    #[param(min = 0.0, max = 400.0, doc = "defaults to 2.5x thickness")] head_width: Option<f64>,
    heads: Heads,                                        // an enum contributes its own spellings
    #[param(color, default = "currentColor")] fill: String,
}

struct Clipart;

impl Plugin for Clipart {
    const NS: &'static str = "https://example.com/xsvg-clipart";
    const NAME: &'static str = "clipart";
    const VERSION: &'static str = "0.1.0";

    fn elements() -> &'static [ElementSpec] {
        &[Arrow::SPEC]                                   // the derived description
    }

    fn generate(tag: &str, req: &Request) -> Result<String, String> {
        match tag {
            "arrow" => arrow(&Arrow::from_attrs(req), req),
            other => Err(format!("<{other}> is not a clipart element")),
        }
    }
}

xsvg_plugin::export_plugin!(Clipart);   // the whole ABI: alloc, describe, generate
```

Field names map to attributes by kebab-casing: `head_width` reads `head-width`. Values arrive as
strings with theme `var()` tokens already resolved, and a nonsense value falls back to the declared
default rather than to `NaN`.

## The manifest can't drift

The published manifest is **generated from the declarations**, so it cannot disagree with what the
module actually reads: an attribute with no field cannot be read, and a field nothing reads is a
`dead_code` warning. (The hand-written manifest this replaced had already lost two working aliases
within an hour.) Hosts read it to build UI without instantiating anything — reading a schema runs no
generator.

The compiler **describes its own elements through the same declarations**, exposed as `describe()`,
so a host merges built-ins and plugin manifests into one lookup and treats both tiers identically.
All eleven `x:` elements are declared, and none has a parameter its emitter doesn't read.

### What a declaration carries

| On `#[param(…)]` | Meaning for a host |
| --- | --- |
| `default`, `min`, `max`, `step` | typed control with its range — a bounded number gets a slider |
| `color` | a colour control |
| `doc = "…"` | the control's tooltip |
| `geometry` | this is **position or extent** — it belongs to canvas handles, not a number field, so the property panel omits it |
| `read_only` | show the value, disable editing, and say why |
| `superseded_by = "x2, y2"` | inert while those are present — the control is disabled and names what overrides it |
| `ns = "…"` | the attribute lives in another namespace (e.g. `x:border-width`), and a host must write it with **the prefix that document binds** |

`geometry` is a fact, not a policy: an editor with handles reads the same flag to know what its
handles own, undeclared means editable, and a dimension that shapes the drawing without placing it
(`stroke-width`, `bulge`, `pad`) stays editable.

## Leaves and containers

Declaring `children = "container"` on the element makes the compiler lower and measure the element's
children **first** and hand them over as `{ svg, bbox }` in document order — so the module can size
itself to what it wraps, then splice the child fragments verbatim inside its own geometry. Splicing
them unmodified preserves inspector round-tripping for that content.

`input = "optional" | "required"` asks for an `in="#id"` reference, pre-resolved to a path string.

## What a module can't do

The sandbox is the point. No WASI, no network, no DOM, no document access, no host callbacks — a
module is a pure function from request to markup, and it cannot re-lower a child, introspect child
source, define new paint servers, or add attributes to elements it doesn't own. Output is re-parsed
by the compiler, so it stays inside the static-SVG subset whatever the module returns.

Purity is enforced rather than promised: the browser host drops every instance between compiles, so
retained state is unobservable, and the native hosts bound each call with wasmi fuel.

## Editing generator elements

Because every element — built-in or loaded — describes itself, the interactive viewer's inspector
offers **typed controls** for whatever a pinned element declares: defaults, ranges, tooltips,
disabled controls with a reason. A bounded parameter's slider commits **as it moves**, which is
practical only because an edit re-emits the elements it can have changed and patches them into the
live drawing instead of recompiling everything. See
[Playground & preview](/docs/getting-started/playground-and-viewer/).

Hosts building their own panel reach the same schemas through `compileXsvg`'s `onPlugins` callback.

## Publishing

Ship the `.wasm` next to the documents that import it, or serve it and pin the bytes with
`integrity="sha256-…"`. Declare a namespace URI you control (a domain, or a `urn:`) — the
`https://xsvg.visioncortex.org/` space is reserved for official extensions. The module's declared
`ns` must match the `<x:import ns>` that binds it.

Official extensions live in the xsvg repo under `crates/ext/` and are published per release;
`clipart` is the worked example to read.

## See also

- [Loadable generators](/docs/extensibility/generators/) — `<x:import>` and what it guarantees.
- [Extensibility design doc](https://github.com/visioncortex/xsvg/blob/main/docs/Extensibility.md) —
  the full ABI, the sandbox contract, and the rationale.
