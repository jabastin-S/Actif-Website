# Knit plate model

The Accreditations plate: `src/components/site/KnitModel.tsx` (UI) and
`src/components/site/knit/fabric-scene.ts` (three.js scene, lazy-loaded).

## Production (v4): fine cotton single jersey

v1-v3 showed a handful of large, twisted loops; however refined, they read as chain mail. v4
replaces the concept: a continuous piece of fine single jersey lying in soft folds, as a textile
sample is photographed. ACTIF is a knitting specialist and the section reads "yarn, knit and
finish", so the fabric is knitted, not woven.

Built by `npm run build:model` (`scripts/build-knit-glb.mjs`; seeded, reproducible). Dev
dependencies: `@gltf-transform/*`, `meshoptimizer`, `jpeg-js`. No Blender needed.

| Item | Detail |
| --- | --- |
| `public/models/cotton-jersey-v4.glb` | 412 KB raw, 279 KB gzip |
| Cloth | 16 x 12 units, 19,481 vertices, 38,400 triangles, soft folds |
| Gauge | 0.16 units per wale: 100 wales across the cloth, ~55 across the plate |
| Knit tile | 4 wales x 6 courses, 512 px (128 px per wale), seamless |
| Maps | albedo 58 KB, normal 131 KB, occlusion/roughness 57 KB (JPEG; copies in `v4-maps/`) |

### How the knit is made

1. Each course of the tile is modelled at yarn level: the interlocking jersey loop path (heads
   tucked behind the next course's necks, sinkers behind the gaps between wales) with per-stitch
   irregularity, as a soft single cotton yarn (0.34 x 0.23 of the wale, flattened).
2. The yarn is baked to a height field: open area 6.6% (the small openings real jersey has).
3. Fibre striations twisting along each yarn (about 22 degrees) and fibre grain are added to the
   height; normal, occlusion (from the height field's cavities), roughness and albedo (natural
   cotton, slight per-yarn tone, occlusion partly baked so crevices stay dark under direct light)
   are derived from it.

### Cloth and material

Five soft folds (each steeper on one side and fading towards its ends) over a gentle undulation;
fold valleys and low-frequency tone baked into vertex colours. Material: KHR_materials_sheen
(soft fabric sheen), KHR_texture_transform (tiling), quantised and meshopt-compressed geometry.

## Backups

- v3 (instanced large-gauge stitches, rib/technical variants): `knit-jersey-v3.glb`,
  `knit-jersey-v3-lite.glb`, `build-knit-glb-v3.mjs`, `knit-scene-v3.ts.txt`,
  `KnitModel-v3.tsx.txt`, `knit-lattice-poster-v3.webp`.
- v2: `knit-lattice-v2*.glb`, `build-knit-glb-v2.mjs`, `KnitModel-v2.tsx.txt`, poster.
- v1: `knit-lattice-v1.glb`, `build-knit-glb-v1.mjs`, poster.

## Screenshots

`docs/screenshots/knit/`: `before-after-v3-v4.png` and `before-after-v3-v4-closeup.png` (same
framing), `v4-desktop-1440.png`, `v4-default.png`, `v4-inspect.png`, `v4-inspect-roam.png`,
`v4-pointer-light.png`, `v4-scroll-*.png`, `v4-desktop-1920.png`, `v4-laptop-1366.png`,
`v4-tablet-820.png`, `v4-mobile-390.png`; earlier versions as `v1-*`, `v2-*`, `v3-*`.
