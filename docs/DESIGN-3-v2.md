# Design-3 v2: "Material Narrative"

Branch: `Design-3-v2` (created from `Design-3`; `Design-3` and `redesign/actif-luxury` are untouched).

## What changed and why

Design-3 used one repeated device: a sticky split screen with a WebGL knit stage. V2 removes it and
gives every chapter its own composition, carried by photography and type.

| Chapter | Composition |
| --- | --- |
| Hero | Full-bleed knit photograph, three-line display headline, masked line entrance |
| Heritage | Full-width statement typography, offset; strengths as one ruled row set |
| Applications | Offset masonry of four photographs, one asymmetric grid |
| Materials | Native horizontal scroller on charcoal (no scroll hijack), buttons + keyboard |
| Home & Bedding | Full-bleed photograph with an overlapping ivory panel |
| Upholstery | Wide photographic band, text set below |
| Industrial | Dark, type-led chapter, small knit macro, horizontal prompt row |
| Medical | Calm centred column on a cool mist field (the only centred chapter) |
| Manufacturing | Photographic band with overlaid heading, aligned seven-step grid |
| Capacity | Olive field, three ruled sentences with an inline counting figure |
| Responsibility | Linen field, three aligned pillars, standards and goals |
| Transition / Contact | Charcoal drape photograph, then the dark contact form |

Palette: warm ivory, linen, stone, olive, charcoal, with a cool slate/mist for technical and medical.
Type: Instrument Serif (display) with Hanken Grotesk (text). The detector flags Instrument Serif as
a commonly used face; it is kept deliberately because it suits the editorial, textile tone.

## Motion

Library: `motion` (already a dependency), plus CSS keyframes. No new dependencies.

- Hero: headline masked line entrance, slow image settle, gentle parallax on scroll.
- Masked line reveals on the hero, heritage statement and closing headline only.
- Clip reveals and hover scale on the application photographs; parallax on full-bleed bands.
- Capacity figures count up once when in view.
- Nav: scroll-spy underline, header turns ivory after 40px scroll.

Safety: content is visible by default; motion only starts after mount and only when
`prefers-reduced-motion` is not set (`src/lib/use-motion-ok.ts`, plus a global CSS rule). Nothing
loops in the background. Scrolling is native everywhere.

## Imagery

All photographs are AI-generated (Figma `generate_image`, 20 images) and are labelled
"Illustrative image" next to each one, plus a footer disclosure. They do not depict ACTIF
facilities, products or people, and must not be presented as such. Replace them with real
photography when available.

- Originals (max 1376px, JPG): `assets-source/generated/`
- Web versions (WebP, 480-1376px srcset): `public/images/`
- Manifest (sizes, average colour placeholder, alt text): `src/content/images.ts`
- Pipeline: `scripts/optimize-images.py` (ffmpeg libwebp), run to regenerate after adding a source.

The generated sources top out at 1376px, so full-bleed images on large screens are upscaled.
Real photography at 2400px+ would be sharper.

## Preserved

Single route `/`, Millis voice orb (lazy-loaded SDK, fixed bottom-right, in place), contact form
(validation, mailto hand-off, no backend), sector pre-selection from the application sections, env
vars and integrations.

## Content to confirm

`src/content/site.ts` carries `// CONFIRM` comments on supplied claims that need checking before
launch (renewable energy wording, antimicrobial finish, standards and certificate scope, capacity
figures).

## Verification (production preview, port 4173)

- `tsc --noEmit`: clean. ESLint: 0 errors (6 pre-existing warnings in shadcn `ui/` files).
- `npm run build`: passes.
- Browser (Playwright): no console errors; no horizontal overflow at 390, 820, 1440, 1920;
  one `h1`; no broken images; reduced-motion renders all content; skip link is the first tab stop;
  form validation and sector pre-selection work; orb sits 47px/32px from the viewport corner.
- Not verified: Lighthouse/LCP scores, a live Millis voice session, the mail client hand-off,
  screen-reader testing, real touch hardware.

## Upgrade pass ("radical UI quality upgrade")

Audit of the running v2 build, ranked by impact, and what was done:

1. Hero was a generic left-aligned headline over one soft full-bleed photo. Replaced with a plate
   composition: headline, tall knit macro, overlapping room photograph with an ivory print border.
2. Imagery read soft: parallax overscanned photographs by up to 17% beyond native size. Overscan cut to
   about 5%, large plates moved to crisp macro subjects at near-native size, static grain added, three new
   images from stronger models (gemini-3.1-flash-image, gpt-image-2.5-sunburst).
3. Rhythm: one section-padding unit (`section-y`), content max width 1520px (desktop page height 18,150px to 17,912px).
4. Flat type: italic as a second display voice (one word per headline), larger body copy, serif wordmark.
5. "Illustrative image" overlays looked like debug text: now a vertical print credit on each image edge.
6. Header over the hero had low-contrast nav: header is now solid ivory, hairline after scroll.
7. Applications masonry used arbitrary offsets: now a wide/narrow zigzag aligned on a common base, from tablet up.
8. Home & Bedding's overlapping panel was a stock pattern: the heading now sits in the photograph's plaster wall.
9. Upholstery repeated Home's full-bleed-plus-text structure: now an inset plate with the heading crossing onto it.
10. Capacity counter briefly showed wrong figures while counting (15 for 150): removed, figures are static.

Also fixed: reveals no longer stay hidden after an anchor jump carries the page past them (`useReached`).

Image generation stopped at the Figma plan's usage limit after 3 of 13 planned new images, so most
chapter imagery is still from the first set. Planned but not generated: upholstery armchair, technical
mesh, circular knitting machine detail, medical knit stack, rib and double-knit macros, sheer knit, yarn
cones still life, charcoal drape, folded sheet still life.

Evidence: `docs/design3-v3/` (contact sheets and hero captures at 390, 820, 1440, 1920).
