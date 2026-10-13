# ACTIF design system: "Specimen Stage" (branch Design-3)

One idea: the page is a lab bench. A single specimen of knitted cloth stays on the stage while the
text turns chapter by chapter, and the specimen changes with it: structure, scale and yarn colour.
The interface borrows the stage's colour, so cloth and chrome always agree.

## Colour

Bright paper, graphite ink, and one living colour.

| Token | Value | Use |
|---|---|---|
| `--paper` | oklch(0.968 0.004 250) | page ground, header, labels on the stage |
| `--paper-2` | oklch(0.935 0.005 250) | contact band, hover fills |
| `--ink` | oklch(0.19 0.01 250) | text, primary buttons, footer ground |
| `--ink-soft` | oklch(0.42 0.012 250) | secondary text (>= 7:1 on paper) |
| `--rule` | ink at 16% | hairlines between list rows |
| `--chap` | set per chapter | fills: header mark, button dot, chapter ticks |
| `--chap-ink` | set per chapter | text-safe version (>= 4.5:1 on paper): numerals, hover, selection |

Chapter colours (fill / text-safe): natural `#d8d0bf / #6b6350` (intro, heritage, capabilities),
butter `#e4cf8e / #76611f` (home), jade `#2f6b57 / #235544` (upholstery), steel `#8d98a3 / #47525d`
(industrial), aqua `#b9e0db / #27706a` (medical), teal `#4f7f80 / #2f5f61` (responsibility).
`--chap` and `--chap-ink` are registered `<color>` properties tweened over 1.6 s. Colour is never the
only carrier of meaning.

## Type

- **Geologica** (variable, 300-600): display at weight 300 with -0.035em tracking, UI at 400-500.
  Chosen for a light, precise, slightly technical voice that suits material and engineering.
- **Source Serif 4**: reading text (`.copy`, 1.125rem / 1.65, measure 58ch).
- Scale: h1 clamp(2.4rem, 4.1vw, 4.6rem); h2 clamp(2.2rem, 4.2vw, 4.4rem); list titles 1.375-1.5rem;
  small labels 0.875rem 500. No all-caps eyebrows above headings; no numbered section kickers
  (the only numerals are the real seven-step process and UN Goal numbers).

## Layout

- >= 1024px: two equal columns. Text chapters on the left; the stage is sticky on the right,
  `100svh - header`. Header is a solid 4rem bar (no transparent overlay on the stage).
- < 1024px: the stage becomes a sticky strip (`--stage-h`, 22svh clamped 8.5-14rem) under the header and
  the chapters scroll beneath it. `scroll-padding-top` accounts for header + strip.
- Contact and footer are full-width; the stage ends before them.
- Square corners everywhere (radius 0-2px). Depth comes from rules and the stage, not shadows
  (the Applications dropdown is the only soft shadow). No cards.

## The stage (`KnitStage.tsx`)

One WebGL canvas, fragment shader only. Structures: plain jersey (chevron columns), rib, jersey+rib blend, open
diamond mesh, waffle; no two neighbouring chapters share a look. Soft cloth folds light the surface; the pointer nudges the light. Specimens glide
(exponential approach, about 1 s) when the active chapter changes. Idle frames are throttled to
about 11 fps; the loop pauses off-screen and in hidden tabs. Reduced motion: no loop, specimens snap.
No WebGL: flat yarn colour with a CSS weave. The caption always reads "Illustrative knit structure":
the stage stands for the kind of material, not a specific ACTIF product.

## Components

- **Header**: wordmark with a chapter-coloured square, Applications dropdown (disclosure button,
  Escape/outside-press to close), text links, Enquire button; full-height mobile menu with focus move,
  scroll lock and Escape.
- **Button**: ink block, chapter-coloured square at the right that scales on hover; hover fills with
  `--chap-ink`. Quiet button: text with an underline.
- **List rows**: hairline-ruled rows (title left, detail right). The only repeated container.
- **Photos**: three existing repo photographs (origin unrecorded), plain rectangles, 3:2 or 16:9.
- **Form**: underline fields, labels above, inline validation, hands off via `mailto`.
- **Voice orb**: 56px (mobile) / 64px (md+) ink disc, fixed bottom-right, in place; states: idle
  (breathing), connecting/thinking (arc), listening (ring), speaking (rings, bars), error. The Millis SDK
  (about 2 MB of WebAssembly) loads on first hover, focus or press.

## Motion

Authored moments only: the stage morph, mask-line headings (once, on enter), the Capacity count-up,
the dropdown and menu transitions. One easing, `cubic-bezier(0.16, 1, 0.3, 1)`. Everything is
visible by default and only hidden after hydration when motion is allowed; `prefers-reduced-motion`
removes all of it.

## Rules

1. One specimen, one stage. Do not add a second animated background.
2. New colour work goes through `--chap` / `--chap-ink`; never hard-code a chapter colour in a component.
3. Never claim a structure, certificate, figure or client the source does not support.
4. Headings carry their own weight: no eyebrows, no decorative numbering, no gradient text.
