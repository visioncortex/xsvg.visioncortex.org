---
title: "Placement"
description: "Place a run along its path — align distributes the slack, start adds a head-start, and effect=\"stair\" steps live glyphs."
---

# Placement

Once an `effect` decides how glyphs sit on the curve, `align` and `start` decide **where** along the
path the run begins. This page covers both, plus `effect="stair"` — the authorable stepped baseline
that stays live `<text>`.

<Example file="textpath-align" height={420} title="align, start, and stair" caption="align distributes the run's slack within the path's extent; start adds an arc-length head-start; the stair effect steps live glyphs." />

## align

`align` places the run within the path's **extent** — its x-extent under skew, its **arc length** under
rainbow and follow:

| Value | Meaning |
| --- | --- |
| `start` *(default)* | run begins at the path's start |
| `middle` | run centered in the extent |
| `end` | run ends at the path's end |

The slack is `extent − run width`. It may be **negative** for a run longer than the path; `middle` and
`end` then shift the run before the path's start, symmetric with the past-the-end overshoot. The run
width used here matches the geometry being placed — the outline advance for warped runs, the
spacing-inclusive advance for the stepped fallback.

## start

`start` is an absolute **head-start** in user units, added after `align`: x units under skew, arc
length under rainbow (default `0`). Use it to push a run further along the path than `align` alone
would, or to leave a gap at the path's head.

## effect="stair" — stepped live glyphs

`effect="stair"` is the authorable **stepped baseline**: glyphs stay upright and **undeformed**, each
absolutely positioned via per-glyph `x`/`y` lists. The `x` comes from kerned prefix advances plus the
letter/word-spacing gaps (honoring `align` and `start`); the `y` is `f(x_glyph) − baseline-shift`,
sampled from the native height profile. Because it lowers to live `<text>` — never the outliner — it
**needs no font bytes**, stays selectable, and uses the live face. It is the one path effect available
everywhere (only the text measurer is required), and it is what the height-profile effects (skew,
ribbon) degrade to when a family has no outline bytes.

## See also

- [Type on a path overview](/docs/type-on-a-path/overview/) — the surface and `baseline-shift`.
- [Path effects](/docs/type-on-a-path/effects/) — follow, skew, ribbon, rainbow.
- [Spacing](/docs/text-layout/spacing/) — letter- and word-spacing that feed the stepped advance.
