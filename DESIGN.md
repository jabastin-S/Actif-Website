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
- No eyebrows or kickers. Numerals only where they carry information: development step order,
  bedding and capacity figures (shown static, never counted up).

## Composition

1. **Hero: a plate composition.** Grid areas `title / macro / text / bed` (`.hero-grid`): headline across
   two-thirds, a tall knit macro beside it, a room photograph overlapping the macro's edge with a 10px ivory
   print border. Tablet: macro left, text and room right. Mobile: stacked. Works with motion off.
2. **Heritage:** full-width statement, then a specification list (title / body rows) set against one sharp macro.
3. **Applications:** wide / narrow, narrow / wide zigzag on a 12-column grid from 768px, bottoms aligned.
4. **Materials:** native horizontal scroller of knitted studies on charcoal, buttons and keys, then
   the eight knitted structures and the fibre list.
5. **Home & Bedding:** the flagship gets the largest photograph; its heading sits in the photograph's own
   plaster wall. Range and finishes follow on ivory.
6. **Upholstery:** inset photograph run to the right edge; the heading crosses from the stone ground onto
   the photograph's pale wall.
7. **Industrial:** dark, type-led, small macro, horizontal prompt row. **Medical:** the only centred chapter.
8. **Process:** photographic band carrying "Understand the product. Engineer the textile. Deliver it
   consistently.", then the eight development steps in a ruled grid and the manufacturing journey row.
9. **Capacity, Responsibility, Transition, Contact, Footer.**

Rules: images and controls are square-edged; depth comes from overlap (hero plates, upholstery heading) and
two soft shadows (dropdown, print border); content max width 1520px.

Spacing: two tokens. `--space-section` (clamp 3.5rem to 6.5rem, via `section-y`) pads a chapter that
sets its own ground. `--space-continue` (clamp 2.5rem to 4rem) is used where a chapter continues on the
same ground (hero into heritage) and between blocks inside a chapter (image band to text, range to
finishes), so two full paddings never stack. Rows are filled rather than left half-empty: secondary text
sits beside its heading (manufacturing intro in the band, responsibility, capacity note, upholstery
prompts). Photographic bands are capped (`max-h`) so tall screens do not stretch them.

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

Library: `motion` 13 (already installed) plus CSS keyframes. No GSAP, no smooth-scroll library, no
scroll hijacking, no pinned sections. Shared code: `src/components/site/motion.tsx` (components) and
`src/lib/motion-hooks.ts` (`EASE`, `EASE_STEADY`, `useReached`, `useMedia`).

Thesis. Focal moment: the **course reveal**. Knit close-ups form from the bottom up with a band of fine
stitch rows running ahead of the solid edge, as courses come off a knitting machine (`CourseReveal`,
`.course-mask` driven by the registered `--course` property). Used only on textile close-ups: hero macro,
heritage macro, the Materials studies, the industrial macro. Room photographs use the plain clip reveal.

- **Hero entrance** (CSS, plays from first paint, ends visible without JS): headline lines rise from
  their masks (0, 0.09, 0.18s), the macro forms by courses (0.12s, 1.4s steady curve) while settling from
  1.07 scale, the room plate opens (0.42s), text and actions rise last (0.7s). On scroll-out the plate
  lifts faster than the headline (two depths), tablet and up.
- **Scroll storytelling:** Home & Bedding's photograph opens from an inset plate to full bleed as it rises
  (`ScrollExpand`, tablet and up). Parallax on selected photographs, 3-7% travel, halved on phones.
- **Reveals:** masked heading lines (heritage, Home & Bedding, upholstery, manufacturing, capacity rows,
  transition, contact); clip reveals with an image settle (applications, the second card of each pair a
  beat later; medical); process stages arrive as a list (stagger capped at 0.21s).
- **Materials gallery:** arrow keys, Home/End, mouse drag, previous/next snapping to studies, a
  `01 / 05` position counter, scroll progress bound to a motion value, and on fine pointers a close-up that
  zooms 1.75x toward the cursor (`.loupe`).
- **Interface:** reading-progress hairline on the header; nav underline grows on hover and stays for the
  active section; Applications dropdown fades and drops 6px (300ms in, 150ms out, inert when closed);
  mobile menu links rise in sequence after the panel opens; buttons press to 0.985; card hover grows the
  "See details" underline with the image scale.

Timing: expo-out `cubic-bezier(0.16, 1, 0.3, 1)` for arrivals; `--ease-soft` / `EASE_STEADY` only for the
travelling course edge. Feedback 150-300ms, overlays 150-300ms, reveals 0.9-1.4s.

Robustness and performance: content is visible in the server render; scroll reveals hide only after
hydration, and the hide snaps (only the reveal animates), then trigger when an element is reached or
already passed (one shared, frame-batched scroll check). Course masks are applied only while a course
reveal runs, the hero macro included. The hero room plate loads eagerly: lazy loading would treat it as
off-screen while `plate-in` clips it shut. Scroll-linked values are motion values bound to transforms or clip-path, so scrolling does not
re-render React. Metric-matched fallback fonts keep the web-font swap from shifting layout (CLS 0.001
measured with fonts delayed 1.5s). `prefers-reduced-motion`: no spatial motion, no delays, everything
visible at once; progress and state feedback remain. The Millis orb breathes twice when idle (from
1.8s, after the hero entrance; 4.8s of motion, inside WCAG 2.2.2's 5s limit) and then rests; its
listening, thinking and speaking states animate only during a conversation.

## Components

Header (solid ivory, hairline after scroll, Applications dropdown, active-section feedback, full-height
mobile menu with focus management), Hero, Statement, Applications, Materials, HomeBedding, Upholstery /
Industrial / Medical (`Sectors.tsx`), Process, Capacity, Responsibility, Transition, Contact (validation,
mailto hand-off, sector pre-selection), Footer, Picture, ImageNote, motion primitives (`MaskLine`,
`ClipReveal`, `Rise`, `Parallax`), and the Millis voice orb (in place, SDK loaded on demand).
