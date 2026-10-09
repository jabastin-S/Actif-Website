# ACTIF redesign notes

Branch: `redesign/actif-luxury` (created from `Model-2`; the original site is untouched on `Model-2`).

## Creative direction: the shade card

The site is a mill's swatch book, not a marketing page. Cloth is the interface.

- **Ground**: undyed greige (cool, not cream). **Darks**: indigo-vat blues. **One accent**: cochineal crimson, used only for marks that matter (the marker thread in the hero cloth, links, the orb's live dot). Four muted dye-chip tints (celadon, dusty blue, sand, rose) colour the swatches.
- **Type**: Bodoni Moda (didone display, fixed low optical size so hairlines survive at scale) with Schibsted Grotesk for text.
- **Signature**: the hero is a real-time WebGL knitted cloth (V-stitch loops, slow folds, one crimson course) behind a huge ACTIF wordmark. Sections are swatches: pinked (zig-zag) edges, procedural knit-structure fills (jersey, rib, waffle, mesh), thread-line dividers.
- **Motion**: one authored moment (hero cloth + wordmark rise), a pinned sideways "fibre to freight" journey, mask-rise headings, focus-in text, draw-in rules, a capacity count-up. Nothing slides in from below on every block. All of it respects `prefers-reduced-motion`.

## Page structure (single route `/`)

| Section | Anchor | Content source |
|---|---|---|
| Hero | `#top` | brief + repo (Vani Fabrics, 1970, Tiruppur) |
| Heritage + strengths | `#heritage` | brief (1970, Vani Fabrics) + repo strengths, rewritten |
| Four sectors (swatch card) | `#sectors` | brief (four sectors); home detail from repo, others sector-level only |
| Home textiles range + finishes | `#range` | repo products, fibres, finishes |
| Fibre to freight (pinned horizontal) | `#manufacturing` | repo seven stages |
| Capacity ledger | `#capacity` | repo figures |
| Responsibility (ESG, standards, SDGs) | `#responsibility` | repo |
| Contact + form | `#contact` | repo contact data |

All copy and facts live in `src/content/site.ts`. Entries marked `// CONFIRM` are carried over from the original site as stated and should be verified by ACTIF before launch.

## What is not invented, and what is missing

- No logo file exists in the repo: the "ACTIF" wordmark is typeset. Supply the real logo to replace it.
- No photography beyond four textile JPGs (two are used). Swatches are decorative coded art and depict no specific ACTIF fabric.
- Upholstery, industrial and medical sectors have **no detail, capacity or proof in the source**; they carry a one-line description and "Specifications on request".
- Certifications (GOTS, OEKO-TEX, SEDEX, ZDHC), the 150 / 50 / 5 capacity figures, "solar and wind-powered production" and the SDG list are repo claims, not independently verified.
- The contact form has no backend. Submitting opens the visitor's email app with the enquiry prefilled to `info@actif.ltd`.

## Coded motion in the process section

Each of the seven stages carries a looping line-drawing over its swatch (`StageMotion.tsx`): fibres drift, loops form, dye rises, finish catches the light, a running stitch is sewn, the pack is tied, a route is travelled. Pure SVG and CSS; no video, no new dependency. Reduced-motion visitors get no looping (the one SMIL marker is not rendered).

## Asset provenance

- `src/assets/textile-hero.jpg` (hero fallback poster, under the WebGL cloth) and `src/assets/textile-drape.jpg` (Heritage section): pre-existing repo assets, origin not recorded.
- `src/assets/textile-dark.jpg` and `src/assets/textile-yarn.jpg`: pre-existing repo assets, origin not recorded, currently unused by the redesign.
- Everything else visual is generated in code: the WebGL knit cloth (`KnitCloth.tsx`) and the SVG knit-structure swatches (`primitives.tsx`). No images were generated or fetched.
- Fonts (Bodoni Moda, Schibsted Grotesk) load from Google Fonts at runtime.

## Hero video

Drop real footage at `public/assets/videos/actif-textile-hero.mp4` and restart the dev server (`vite.config.ts` detects the file at startup). It plays over the WebGL cloth; the cloth remains the fallback. No file means no request, so no 404.

## Millis voice orb

`src/components/MillisOrb.tsx`, mounted in `src/routes/__root.tsx`. Connection logic is the original integration (public key and agent id from `VITE_MILLIS_PUBLIC_KEY` / `VITE_MILLIS_AGENT_ID`); only presentation and accessibility changed. 56px on mobile, 64px from `md`. States: idle (breathing), connecting and thinking (rotating arc), listening (soft ring, slow bars), speaking (rings, fast bars), error (crimson). Click again to end. A live-region announces state. The old decorative `ChatbotIcon` (a second, non-functional floating button) was removed.

## Run and compare

```bash
# redesign
git checkout redesign/actif-luxury
npm run dev            # http://localhost:5173

# original, side by side (second terminal)
git worktree add ../Actif-Website-original Model-2
cd ../Actif-Website-original
npm install
npm run dev -- --port 5174   # http://localhost:5174
```

Remove the extra checkout later with `git worktree remove ../Actif-Website-original`.

Screenshots: `docs/screenshots/before/` (original) and `docs/screenshots/after/` (redesign), at 390, 820, 1366, 1440 and 1920 wide.

## Review

An independent finish review (fresh agent, screenshots and contract) returned "fix". Applied: certifications reframed as "Standards and frameworks we work to" with a certificate-scope prompt (no held-certificate display); Capacity rebuilt as swatch-chip ledger sentences instead of big-number stacks; Responsibility standards and SDGs rebuilt as ledger rows (no kicker labels, no multicolour stripes); pinked seams between every change of ground; hero link renamed "Home textiles"; stage swatches aligned; right-aligned range specs kept clear of the orb. Not applied: lot labels on sections (they would be section numbers/kickers, which the craft floor bans). A second review round was not run.

## Checks

```bash
npm run lint     # 0 errors (6 pre-existing warnings in src/components/ui)
npm run build
npx tsc --noEmit
```
