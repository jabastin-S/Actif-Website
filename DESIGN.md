---
name: ACTIF Global Ventures
description: A knitting mill's shade card. Undyed greige, indigo-vat darks, one cochineal dye mark, pinked seams.
colors:
  greige: "oklch(0.905 0.008 95)"
  bleach: "oklch(0.958 0.006 95)"
  linen: "oklch(0.85 0.012 92)"
  indigo: "oklch(0.2 0.045 265)"
  indigo-2: "oklch(0.27 0.06 265)"
  vat: "oklch(0.4 0.09 262)"
  ink: "oklch(0.2 0.03 265)"
  ink-soft: "oklch(0.4 0.025 265)"
  cochineal: "oklch(0.46 0.15 12)"
  cochineal-lite: "oklch(0.78 0.09 10)"
  celadon: "oklch(0.8 0.045 160)"
  dusty-blue: "oklch(0.75 0.05 250)"
  sand: "oklch(0.82 0.06 85)"
  rose: "oklch(0.79 0.06 20)"
  on-indigo: "oklch(0.95 0.008 95)"
  on-indigo-soft: "oklch(0.78 0.022 265)"
  destructive: "oklch(0.5 0.17 25)"
typography:
  display:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Times New Roman, serif"
    fontSize: "clamp(2.4rem, 5.2vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "'opsz' 18"
  wordmark:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Times New Roman, serif"
    fontSize: "clamp(5.25rem, 14vw, 18rem)"
    fontWeight: 500
    lineHeight: 0.82
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Times New Roman, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.14em"
rounded:
  none: "0"
  hairline: "1px"
  sm: "2px"
  md: "4px"
  full: "9999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  section-y: "6rem"
  section-y-md: "9rem"
  pink: "10px"
components:
  button-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.9rem 1.75rem"
    height: "3.25rem"
  button-label-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bleach}"
  button-label-on-indigo:
    backgroundColor: "transparent"
    textColor: "{colors.on-indigo}"
  button-label-on-indigo-hover:
    backgroundColor: "{colors.on-indigo}"
    textColor: "{colors.indigo}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.625rem 0"
  enquiry-sheet:
    backgroundColor: "{colors.bleach}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2.5rem 2.5rem 3.5rem"
  sector-swatch-card:
    backgroundColor: "{colors.bleach}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem 1.5rem 1.75rem"
  voice-orb:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.on-indigo}"
    rounded: "{rounded.full}"
    size: "4rem"
---

# Design System: ACTIF Global Ventures

## Overview

**Creative North Star: "The Shade Card"**

The site is a mill's swatch book, not a marketing page. Each section is a sample of ground laid against the next: undyed greige, linen and bleach for the light grounds, indigo vat for the dark ones. Sections meet at pinked (zig-zag) seams, the cut a mill makes on a swatch. Content is stated plainly, in ledgers and sample cards, for a buyer who is vetting a partner.

Colour is dyer's colour. One cochineal crimson marks what matters (focus, the enquiry link, process numerals on dark, the thread that tracks scroll). Four muted dye-chip tints (celadon, dusty blue, sand, rose) exist only as swatch fields. Bodoni Moda gives the display voice a fashion-house cut; Schibsted Grotesk carries everything else. Edges are square.

The build departs from the discarded ivory, serif, sage and gold look entirely. Where the surface brief imagined lot labels on each section, they were intentionally not built; do not add them.

**Key Characteristics:**
- Cool greige ground, never cream; indigo darks, never black.
- Cochineal is rare and always a mark, never a fill field.
- Square corners; the pinked edge is the only decorative edge.
- Procedural SVG knit swatches stand in for imagery of cloth.
- Hero is a real-time WebGL knitted cloth in indigo; an optional MP4 layers over it when the file exists.
- Reveals are masks and soft focus-ins, gated on hydration and reduced-motion.

## Colors

A cool, desaturated mill palette: pale undyed grounds, deep indigo, one crimson dye, four chalky tints. All values are OKLCH in `:root` of `src/styles.css`; components reference the tokens, never raw values.

### Primary
- **Indigo Vat** (indigo): hero, process, footer and the full-screen menu ground; primary in light mode. `indigo-2` is its raised sibling (Responsibility band, dark-mode cards); `vat` is the mid indigo for scrollbar thumbs and chart use.

### Secondary
- **Cochineal** (cochineal): focus ring, text selection, caret, enquiry links, input focus underline, voice orb active state. **Cochineal Lite** (cochineal-lite): the same mark on dark grounds (process numerals, scroll thread, secondary hero button outline, dark focus ring).

### Tertiary (swatch tints)
- **Celadon**, **Dusty Blue**, **Sand**, **Rose**: fields behind procedural swatches (sector cards, process stages, capacity thumbnails). Not for text, buttons, or UI chrome.

### Neutral
- **Greige** (greige): default page ground. **Linen** (linen): the sectors band and muted fills. **Bleach** (bleach): lifted sample surfaces (sector cards, enquiry sheet), the lightest ground.
- **Ink** (ink): text and dark buttons on light grounds. **Ink Soft** (ink-soft): secondary text and form labels.
- **On Indigo** / **On Indigo Soft**: text and secondary text on indigo grounds.
- **Destructive** (destructive): form errors only.
- Borders are ink at 16% alpha on light, white at 14% on dark.

### Named Rules
**The One Dye Rule.** Cochineal appears on small marks only: a link, a ring, a numeral, a hairline. It never floods a section or fills a button at rest.

**The Swatch Field Rule.** The four tints live only inside swatches. They are samples of cloth, not a UI accent palette.

**The Ground Pairing Rule.** Each section has one ground; dark sections set `data-tone="dark"` so focus rings and nav switch to the lite cochineal and on-indigo text.

## Typography

**Display Font:** Bodoni Moda (Didot, Bodoni 72, Times New Roman, serif), loaded from Google Fonts, 400-600.
**Body Font:** Schibsted Grotesk (Helvetica Neue, system sans), 400-600.

**Character:** A didone at fixed low optical size (`opsz 18`, optical sizing off) so hairlines stay strong at display scale, set against a plain, slightly humanist grotesque. The contrast is fashion-house versus mill ledger.

### Hierarchy
- **Wordmark** (500, clamp(5.25rem, 14vw, 18rem) on lg, 0.82 line-height, -0.02em): the hero ACTIF only, bottom-left, mask-rising.
- **Display / Headline** (400, clamp(2.4rem, 5.2vw, 4.75rem) for section H2s, 1.02, -0.015em, balanced): section titles, split into MaskLines.
- **Title** (400, 1.6-1.75rem, 1.08): sector names, address name, stage titles (to 2.4rem), menu links at 2.4rem on mobile.
- **Body** (400, 1rem, 1.6): default. `prose-measure` caps at 62ch with 1.7 line-height and `text-wrap: pretty`.
- **Label** (500, 0.75rem, 0.14em, uppercase): form labels and the hero legal-name line. Buttons and nav links use the same uppercase treatment at 0.8125rem with 0.1 / 0.08em tracking.
- **Numerals**: `tabular` (tabular lining figures) for counters and stage numbers.

### Named Rules
**The Didone Is For Display Rule.** Bodoni Moda is for headings, large statements, numerals and the wordmark. Never body copy, never small UI.

**The Plain Ledger Rule.** Facts (capacity, standards, contacts) are set in the grotesque or in display lines separated by thread rules; no decorative lead-ins above headings.

## Layout

A single scrolling route of full-width bands, each a `shell` (max 1520px, side padding from `--gutter`, clamp(1.25rem, 4vw, 4rem)) on a 12-column grid at lg. Sections pad 6rem vertical (9rem from md). Headings sit in 5-7 columns with a short prose block offset to the right (cols 9-12 or 6-12 for ledgers). The hero is 100svh (min 640px) with the wordmark and a two-column statement/button block anchored to the bottom.

Process is a pinned sideways scroll at lg (sticky 100svh track translated by scroll progress, with a cochineal-lite thread at the bottom), and a vertical one/two-column list below lg. Sectors is an accordion-like flex row at lg (active card grows 2.6x, 36rem tall) and a stacked list below. Skip link, scroll-padding-top 4.5rem and anchored nav links serve in-page navigation. The nav collapses to a full-screen indigo menu below xl.

Adjacent sections are joined by a `selvage` seam (10px teeth; `--from` and `--to` colours set per pair in `src/routes/index.tsx`). Alternation: indigo, greige, linen, bleach, indigo, greige, indigo-2, greige, indigo footer.

## Elevation & Depth

Flat. Depth comes from ground changes (greige, linen, bleach, indigo), pinked seams and the pinked bottom edge of swatches and the enquiry sheet, not from shadows. The only shadows are functional and on the floating voice orb and its tooltip (soft dark drop), and a 1px hairline under the scrolled nav (with backdrop blur at 88% greige). The hero uses an indigo scrim gradient at its bottom 60% purely for text legibility over moving cloth.

### Named Rules
**The Flat Sample Rule.** Surfaces carry no shadow at rest. A new surface differentiates itself by ground and pinked edge.

**The Orb Exception Rule.** The voice orb is the sole circular, shadowed element because it floats over content and must separate from every ground.

## Shapes

Square. The radius scale tops out at 4px (`--radius: 2px`), and cards, buttons, sheets and inputs use none. The recurring silhouette is the pinked edge: a zig-zag cut (10px default, 6px for small thumbnails) at the bottom of swatches and the enquiry sheet, and as the seam between sections. Rules are 1px; the `thread` utility is a dashed 1px hairline at 45% opacity; `Rule` draws a 1px line from the left on reveal. The orb alone is a circle.

## Components

### Buttons (sewn label)
- **Shape:** square, 1px current-colour border, min-height 3.25rem, padding 0.9rem 1.75rem.
- **Type:** 0.8125rem, 500, 0.1em, uppercase.
- **Rest:** transparent with border and text in `ink` (light) or `on-indigo` (dark).
- **Hover / Focus:** a fill wipes in from the left (`scaleX` 0 to 1, 700ms, ease-out) in `--btn-fill` (ink on light, on-indigo on dark, cochineal-lite for the hero's second button) while the text flips to the opposite tone.
- **Disabled:** 55% opacity.

### Inline links
Underline thread: a 1px line that grows from 0 to 100% width on hover/focus (600ms). Enquiry links are cochineal, 500.

### Fields (enquiry form)
- Underline-only: bottom border `ink` at 40%, transparent ground, no radius, 0.625rem vertical padding.
- Labels in the uppercase label style, `ink-soft`, above the field.
- **Focus:** bottom border turns cochineal (caret also cochineal). **Error:** border and message in destructive.
- Held on a bleach sheet with pinked bottom edge; submit opens a prepared mailto, with a polite status note beside the button.

### Sector swatch cards
Bleach cards in a row; a swatch fills the top with a pinked bottom edge, then a display title. The active card (hover/focus) grows, scales the swatch pattern 1.15, and reveals body copy and a cochineal enquiry link. Below lg all are open.

### Swatch (procedural)
SVG pattern fields in four structures: jersey, rib, waffle, mesh. Tint field plus ink-shade and light strokes plus a faint diagonal gradient for body. Decorative; it stands for cloth in general and never depicts a specific ACTIF fabric.

### Navigation
Fixed header. Over the hero: transparent, on-indigo text. After 60px of scroll: 88% greige with blur and a hairline, ink text. Wordmark in display with 0.12em tracking; links uppercase 0.8125rem with thread underline; outlined "Partner with us" sewn-label button from md. Below xl, a two-line hairline toggle opens a full-screen indigo dialog (clip-path reveal) with large display links and contact lines; Escape closes and returns focus.

### Ledger rows (Capacity)
Display-size statements separated by drawn 1px rules in ink at 25%, each with a small pinked swatch thumbnail at left.

### Hero cloth
Full-bleed WebGL knitted cloth (KnitCloth) over an indigo-tinted still poster, with a luminosity-blended MP4 layered above only if the file exists at build time. Parallax on scroll when motion is allowed.

### Voice orb
A 4-4.5rem indigo circle, bottom-right, with on-indigo ring; turns cochineal when live; pulsing rings, waveform bars and a spinner for phases; a small indigo tooltip pill.

### Motion
One easing: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`). Headings rise through a mask (1.1s), blocks focus in with 6px blur (1.2s), rules draw (1.4s), counters count up (2.2s). All reveals start visible until hydrated and are disabled by reduced motion; a global reduced-motion rule collapses animation and transition durations.

## Do's and Don'ts

### Do:
- **Do** set every colour from the OKLCH tokens (`greige`, `indigo`, `ink`, `cochineal`, ...); never hard-code values in components.
- **Do** change ground between sections and join them with a `selvage` seam carrying the correct `--from` and `--to`.
- **Do** keep corners square (0 to 2px) and use the pinked bottom edge for swatch-like surfaces.
- **Do** use cochineal for small marks only and cochineal-lite on dark grounds; set `data-tone="dark"` on dark sections.
- **Do** use Bodoni Moda at `opsz 18` with -0.015em tracking for display; Schibsted Grotesk for everything else.
- **Do** use the sewn-label button for every call to action, with the fill wipe on hover and focus.
- **Do** use the Swatch tints only inside swatch fields.
- **Do** gate reveals on hydration and respect `prefers-reduced-motion`.

### Don't:
- **Don't** return to ivory/cream, sage or gold grounds, or a Cormorant-style serif.
- **Don't** use rounded cards, pill buttons or drop-shadow cards; the orb is the only circle.
- **Don't** use cochineal as a section or button fill at rest.
- **Don't** use gradients as decoration; the only gradients are the hero's legibility scrim and the subtle body shading inside swatches.
- **Don't** use Bodoni Moda for body or small UI text.
- **Don't** add lot labels, eyebrows or kicker lines above headings; the build has none.
- **Don't** invent numbers, clients or certificates; swatches are not photographs of products.

---

Not canonized: the hero's small uppercase "Global Ventures Pvt Ltd" line sits under the wordmark and is the legal-name caption, not a pattern for kickers on other headings.
