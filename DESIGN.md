# ACTIF design system: "Material Narrative" (branch Design-3-v2, upgrade pass)

Photography-led and typographic, set like a printed textile book: plates of photography laid on an ivory
ground, a condensed serif that sets the scale, and one italic word as the second voice. Each chapter has
its own composition; nothing repeats two sections in a row.

## Colour

Warm and mineral, with one cool note for technical and clinical chapters.

| Token | Use |
|---|---|
| `--ivory` oklch(0.955 0.014 85) | page ground, header (always solid), print border around overlapping plates |
| `--linen` oklch(0.925 0.017 82) | applications and responsibility grounds |
| `--stone` oklch(0.875 0.02 80) | upholstery chapter |
| `--sand` oklch(0.8 0.035 78) | image placeholder behind warm plates |
| `--olive` / `--olive-deep` / `--olive-soft` | numerals and active marks / capacity field and button hover / marks on dark |
| `--charcoal` / `--charcoal-2` | materials, industrial, transition, contact, footer, orb |
| `--mist` oklch(0.95 0.01 235) | medical chapter |
| `--ink` / `--ink-soft` | text on light (>= 7:1 / >= 4.5:1) |
| `--on-dark` / `--on-dark-soft` | text on charcoal and olive-deep |

Ground sequence: ivory (hero, heritage), linen, charcoal, photograph + ivory, stone, charcoal, mist,
photograph + ivory, olive, linen, charcoal photograph, charcoal.

## Type

- **Instrument Serif** (400 and italic): display. Tight (-0.015em, 0.98 leading), capped at 6rem. Its
  condensed proportions let long headline lines sit at poster size; the detector flags it as a common face
  and it is kept deliberately. Italic (`<em>` inside `.display`) marks one word per headline at most:
  *care*, *wards*, *one*, *Bedding*.
- **Hanken Grotesk** (400/500/600): reading text, labels, buttons. `.copy` is 1.0625 to 1.1875rem / 1.65,
  measure 52ch; supporting text is never below 1rem except captions.
- Wordmark: "ACTIF" in Instrument Serif, 1.75rem, 0.3em tracking. No logo file exists.
- No eyebrows or kickers. Numerals only where they carry information: process stage order, UN Goal
  numbers, capacity figures (shown static, never counted up).

## Composition

1. **Hero: a plate composition.** Grid areas `title / macro / text / bed` (`.hero-grid`): headline across
   two-thirds, a tall knit macro beside it, a room photograph overlapping the macro's edge with a 10px ivory
   print border. Tablet: macro left, text and room right. Mobile: stacked. Works with motion off.
2. **Heritage:** full-width statement, then a specification list (title / body rows) set against one sharp macro.
3. **Applications:** wide / narrow, narrow / wide zigzag on a 12-column grid from 768px, bottoms aligned.
4. **Materials:** native horizontal scroller on charcoal, buttons and keys.
5. **Home & Bedding:** the flagship gets the largest photograph; its heading sits in the photograph's own
   plaster wall. Range and finishes follow on ivory.
6. **Upholstery:** inset photograph run to the right edge; the heading crosses from the stone ground onto
   the photograph's pale wall.
7. **Industrial:** dark, type-led, small macro, horizontal prompt row. **Medical:** the only centred chapter.
8. **Manufacturing:** photographic band with overlaid heading, then the seven-stage ruled grid.
9. **Capacity, Responsibility, Transition, Contact, Footer.**

Rules: images and controls are square-edged; depth comes from overlap (hero plates, upholstery heading) and
two soft shadows (dropdown, print border); section padding is one unit, `section-y`
(clamp 4.5rem to 8.5rem); content max width 1520px.

## Imagery

Generated with Figma `generate_image`: 20 earlier images (gemini-3.1-flash-lite-image) and 3 from the
upgrade pass (gemini-3.1-flash-image, gpt-image-2.5-sunburst), plus one repo photograph. The generator
outputs 900 to 1400px; images are therefore placed at or near native size, crisp macro subjects carry the
largest plates, parallax overscan is kept to about 5%, and a static photographic grain (`.grain`) evens
out resampling. Originals: `assets-source/generated/`. Web: `public/images/` via
`scripts/optimize-images.py`, manifest `src/content/images.ts`.

Every generated photograph carries a vertical "Illustrative image" credit on its edge (`ImageNote`,
`tone="ink"` on light images), plus the footer disclosure. None depicts a claimed ACTIF facility or product.

## Motion

Library: `motion` plus CSS keyframes; one easing (expo-out, `cubic-bezier(0.16, 1, 0.3, 1)`), 1.2 to 1.3s.

- Hero entrance: headline lines rise from a mask in sequence, the macro opens from its lower edge, the room
  plate follows, the text fades in last.
- Masked headline reveals: hero, heritage, Home & Bedding, transition. Clip reveals: hero plates, heritage
  macro, application photographs. Hover: application images scale to 1.035 over 1.6s.
- Gentle parallax on selected photographs (3 to 7% travel).
- Reveals trigger once an element reaches the viewport or has already been passed (`useReached`), so an
  anchor jump never leaves content hidden. Content is visible by default; motion only applies after
  hydration and never under `prefers-reduced-motion`. No scroll hijacking, no counters, no cursor effects.
- The Millis orb keeps its own idle breathing animation (existing component).

## Components

Header (solid ivory, hairline after scroll, Applications dropdown, active-section feedback, full-height
mobile menu with focus management), Hero, Statement, Applications, Materials, HomeBedding, Upholstery /
Industrial / Medical (`Sectors.tsx`), Process, Capacity, Responsibility, Transition, Contact (validation,
mailto hand-off, sector pre-selection), Footer, Picture, ImageNote, motion primitives (`MaskLine`,
`ClipReveal`, `Rise`, `Parallax`), and the Millis voice orb (in place, SDK loaded on demand).
