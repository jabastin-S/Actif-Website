# Design-3: "Specimen Stage"

Branch `Design-3`, built from `redesign/actif-luxury` (its content, orb and form plumbing) with the
whole visual layer replaced. `main` (design 1) and `redesign/actif-luxury` (design 2) are untouched.

## Why this direction

- **Design 1 (main):** ivory and sage, Cormorant, centred sections, ESG-template content.
- **Design 2 (redesign/actif-luxury):** greige and indigo, Bodoni, a huge wordmark hero, pinked swatch panels.
- **Design 3:** neither a mood nor a section look, but a *structure*: one persistent specimen of knitted
  cloth beside the text. The cloth changes with each chapter (plain knit, rib, open mesh, fine knit,
  waffle) and lends its yarn colour to the interface. It is the first of the three to show
  the material as the interface, in a bright, technical, quiet register.

| | Design 1 | Design 2 | Design 3 |
|---|---|---|---|
| Ground | ivory | greige + indigo | bright paper + graphite |
| Accent | sage / gold | cochineal crimson | living chapter yarn colour |
| Type | Cormorant + Jost | Bodoni Moda + Schibsted Grotesk | Geologica light + Source Serif 4 |
| Layout | stacked full-width sections | stacked sections + pinned sideways track | sticky split stage + ruled lists |
| Nav | transparent then ivory blur | transparent then greige blur | solid bar, Applications dropdown, chapter index |
| Imagery | one photo-led hero | swatch panels, WebGL hero cloth | live specimen stage + three repo photos |
| Sector treatment | cards | expanding swatch panels | four chapters, each its own material |

## Chapters (one route, `/`)

Introduction, Heritage, Home & Bedding, Upholstery, Industrial & Technical, Medical & Healthcare,
Capabilities (process + capacity), Responsibility, Contact. Copy and facts live in
`src/content/site.ts`; stage presets in `src/content/chapters.ts`.

## What is real and what is not

- The stage is a procedural illustration. It is captioned "Illustrative knit structure" and makes no claim about any ACTIF fabric.
- Photos: `textile-hero.jpg` (Home), `textile-dark.jpg` (Upholstery), `textile-yarn.jpg` (Capabilities). Pre-existing repo assets, origin not recorded. `textile-drape.jpg` is unused.
- Upholstery, Industrial and Medical carry sector-level copy and a "what to bring to a first conversation" list only; no capabilities, numbers or certificates were invented for them.
- Carried over unverified from the earlier repo content (marked `// CONFIRM` in `site.ts`): the 150/50/5 capacity figures, GOTS / OEKO-TEX / SEDEX / ZDHC, solar and wind power, SDG list.
- No logo file exists; the wordmark is typeset.
- The contact form has no backend; it opens a prefilled email to info@actif.ltd.
- No social-share image exists, so Open Graph has no image.

## Run and compare

```bash
git checkout Design-3 && npm run dev          # http://localhost:5173
# production build, closest to what users get
npm run build && npx vite preview --port 4173 # http://localhost:4173
# the earlier designs, side by side
git worktree add ../Actif-main main
git worktree add ../Actif-shade-card redesign/actif-luxury
```

Screenshots: `docs/design3/`. Earlier designs: `docs/screenshots/before/` (design 1) and `docs/screenshots/after/` (design 2).

## Independent review

A fresh reviewer returned "fix". Applied: distinct structure per chapter (heritage = knit with rib, responsibility = fine rib), a softer industrial mesh, claim wording softened (renewable energy and antimicrobial finishes now say "ask us for current figures / performance data"; "chemical-free" removed), form focus outline and stronger field borders, sector-specific "what to bring" prompts, heading reveals limited to the h1 and contact, lower-case pillar lists, a cooler paper tone. One finding (triangular spikes on Home & Bedding) came from a stale screenshot taken before the chevron rewrite; it was re-shot and is fixed. Not changed: about 200 px of space between the hero buttons and the application links on tall desktops, kept as an anchor. A second review round was not run.

## Checks run (local, headless Chromium via Playwright MCP)

Typecheck, lint (0 errors; 6 pre-existing react-refresh export warnings in `src/components/ui`),
production build, Impeccable detector (clean). In-browser: console clean on the production build, CLS 0
(measured), heading order, keyboard (Applications dropdown, mobile menu, Escape and focus return), reduced
motion (stage snaps, content visible), orb connect/cancel in place, form validation and sector
pre-select, no horizontal overflow at 390 / 820 / 1440 / 1920. Not run: Lighthouse, a real microphone
voice session, a real mail client, a screen reader, touch hardware. LCP was not reported by the test browser
and is therefore not claimed.
