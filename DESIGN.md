# ACTIF design system: "Material Narrative" (branch Design-3-v2)

Photography-led and typographic. Each chapter has its own composition; nothing repeats two sections
in a row. Evolved from Design-3 ("Specimen Stage"), whose persistent split-screen was the problem to solve.

## Colour

Warm and mineral, with one cool note for technical and clinical imagery.

| Token | Use |
|---|---|
| `--ivory` oklch(0.955 0.014 85) | page ground, header once scrolled, light buttons |
| `--linen` oklch(0.925 0.017 82) | applications and responsibility grounds |
| `--stone` oklch(0.875 0.02 80) | sector chapters |
| `--sand` oklch(0.8 0.035 78) | reserved neutral |
| `--olive` / `--olive-deep` / `--olive-soft` | numerals and active marks / capacity field and button hover / marks on dark |
| `--charcoal` / `--charcoal-2` | materials, transition, contact, footer, orb |
| `--slate` oklch(0.6 0.025 245) | cool technical note (kept for imagery and future use) |
| `--ink` / `--ink-soft` | text on light (>= 7:1 / >= 4.5:1) |
| `--on-dark` / `--on-dark-soft` | text on charcoal and olive-deep |

Dark and light alternate by chapter: image, ivory, linen, charcoal, image + ivory, stone, image + ivory, olive,
linen, charcoal image, charcoal.

## Type

- **Instrument Serif** (400): display, one weight, large and tight (-0.015em, 0.98 leading). Condensed
  proportions let long lines sit at poster size.
- **Hanken Grotesk** (400/500/600): reading text, labels, buttons. Body 1.0625rem / 1.7, measure 54ch.
- No uppercase eyebrows, no numbered kickers. Numerals appear only where they carry information: the
  seven process stages, the UN Goal numbers and the capacity figures.

## Composition rules

1. No two adjacent chapters share a structure. Used here: full-bleed image with type over it (hero,
   process, transition), full-width typography (statement, capacity), offset two-column masonry (applications),
   horizontal scroller (materials), image with an overlapping panel that runs into the next chapter
   (Home & Bedding), three staggered text columns (sectors), staggered numbered grid (process steps).
2. A split-screen is allowed only where it is not the default. There is none in this build.
3. Sections have different heights; headings change position and scale.
4. Images are never rounded; edges are square. Panels and buttons are square.
5. Depth comes from overlap and two soft shadows (the overlapping panel and the dropdown).

## Imagery

Thirteen generated images (Figma `generate_image`, model gemini-3.1-flash-lite-image) plus one repo photo.
Originals are in `assets-source/generated/`; `scripts/optimize-images.py` writes responsive WebP files to
`public/images/` and the manifest `src/content/images.ts` (srcsets, intrinsic sizes, average colour used as
placeholder, alt text). Generated imagery is illustrative: the page says so beside the process image,
in the materials chapter and in the footer, and it never depicts a claimed ACTIF facility or product.
Source resolution is 1376 px at most for the widest images.

## Motion

Library: `motion` (already installed). Techniques: masked line reveals (headings, once), clip reveal
(application images, once), short rise (supporting blocks, once), gentle parallax (hero, Home & Bedding,
process, transition; at most 7% travel), image hover scale (1.045), counter (capacity), hero image settle
(2.4 s CSS), scroll cue (three loops, then still). Everything is visible by default and hidden only after
hydration when motion is allowed. `prefers-reduced-motion` removes all of it. No scroll hijacking, no
perpetual background motion, no cursor effects, no hover-only information.

## Components

Header (transparent over the hero, solid ivory after 40 px, Applications dropdown, active-section feedback,
full-height mobile menu with focus management), Hero, Statement, Applications, Materials (native
scrolling with previous/next, keyboard-focusable region, progress line), HomeBedding, Sectors, Process,
Capacity, Responsibility, Transition, Contact (validation, mailto hand-off), Footer, Picture, motion
primitives, and the Millis voice orb (64 px desktop, 56 px mobile, in place; SDK loaded on demand).
