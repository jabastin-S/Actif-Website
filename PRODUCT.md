# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
B2B buyers: textile and home-brand sourcing and procurement teams, product developers, interior and upholstery businesses, and industrial and healthcare-textile customers, mostly international. They are vetting a manufacturing partner: is this a credible, capable, compliant mill?

## Product Purpose
Corporate website for ACTIF Global Ventures, a premium knitted-textile development and manufacturing company in Tiruppur, Tamil Nadu, India. Success is a qualified enquiry (form, email, phone, or the Millis voice assistant) from a buyer who trusts the company's expertise and reliability.

## Positioning
A unit of Vani Fabrics Private Limited with a heritage dating to 1970, pairing that textile lineage with a vertically integrated knit-to-pack operation and ESG / Digital Product Passport readiness.

## Operating Context
Buyers evaluate by application (home textiles and bedding; upholstery and interiors; industrial and technical textiles; medical and healthcare textiles), by process (fibre, knitting, dyeing, finishing, cut and sew, packaging, delivery), and by compliance evidence.

## Capabilities and Constraints
- Single route `/` (TanStack Start, React 19, Tailwind v4, motion, lucide-react, Radix). No backend; the contact form has no endpoint, so it hands off by mailto.
- Millis AI web SDK voice agent (public key + agent id from env) must stay in place as a small bottom-right orb: no modal, page, or route change.
- Home textiles is the documented flagship: bed sheets, fitted sheets, pillow cases, duvet covers, baby collection, hospitality collection; export focus Australia, Europe, USA; claimed capacity 150 MT greige / 50 MT finished fabric / 5 containers per month; certifications listed in the source: GOTS, OEKO-TEX, SEDEX, ZDHC; six UN SDGs (6, 7, 8, 9, 12, 13).
- Open: detail, capacity and proof for upholstery, industrial and medical sectors are not in the source; never invent it. Certificate scope, validity and numbers are unconfirmed.

## Brand Commitments
Name "ACTIF" (typeset wordmark; no logo file exists in the repo) / ACTIF GLOBAL VENTURES PVT LTD. Contact on file: info@actif.ltd, +91 98946 02235, actif.ltd, Tiruppur (also spelled Tirupur), Tamil Nadu, India.

## Evidence on Hand
Four textile JPGs in `src/assets`. No certificates, client names, case studies, factory photography, logo file or hero video. Hero video path reserved: `/public/assets/videos/actif-textile-hero.mp4`.

## Product Principles
1. Facts first: nothing claimed that the source does not support.
2. Show process and material, not generic factory imagery.
3. One clear next step: start a conversation.
4. The voice assistant stays one click away, in place.

## Accessibility & Inclusion
Keyboard operable, visible focus, reduced-motion respected, readable contrast; international English-speaking audience.
