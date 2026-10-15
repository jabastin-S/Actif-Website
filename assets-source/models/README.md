# Knit plate model

The Accreditations plate: `src/components/site/KnitModel.tsx` (UI) and
`src/components/site/knit/fabric-scene.ts` (three.js scene, lazy-loaded).

## Production (v5): fine cotton single jersey, simulated as cloth

v4 was a fixed drape baked into a mesh. v5 keeps v4's knit (the same yarn-level maps) and makes
the cloth live: it hangs from pins and is simulated in the page (`src/components/site/knit/`:
`cloth-sim.ts` solver, `cloth-surface.ts` + `cloth-shader.ts` GPU surface, `fabric-scene.ts`
scene and input). v1-v3 showed a handful of large twisted loops that read as chain mail; v4 and
v5 show a continuous piece of fine jersey, as a textile sample is photographed.

Built by `npm run build:model` (`scripts/build-knit-glb.mjs`; Node 22 with
`--experimental-strip-types`, since it imports the page's own solver). Dev dependencies:
`@gltf-transform/*`, `meshoptimizer`, `jpeg-js`. No Blender needed.

| Item | Detail |
| --- | --- |
| `public/models/cotton-jersey-v5.glb` | 295 KB raw, 284 KB gzip |
| Content | the knit material, and the cloth hanging at rest for each solver resolution (full 51 x 34 particles, lite 37 x 25), settled by the solver at build time until it no longer moves; positions stored exactly, normals and texture coordinates quantised, meshopt-packed |
| Cloth | 15 x 10 units, pinned at uneven gaps and heights (`DRAPE` in `cloth-sim.ts`) |
| Gauge | 0.16 units per wale: 94 wales across the cloth |
| Knit tile | 4 wales x 6 courses, 512 px (128 px per wale), seamless |
| Maps | albedo 58 KB, normal 131 KB, occlusion/roughness 57 KB (JPEG; copies in `v5-maps/`) |
| Poster | `public/images/knit-lattice-poster.webp` (800 x 600, 122 KB): the settled drape, shown before load, without WebGL and on devices that cannot keep the simulation smooth |

### How the knit is made

1. Each course of the tile is modelled at yarn level: the interlocking jersey loop path (heads
   tucked behind the next course's necks, sinkers behind the gaps between wales) with per-stitch
   irregularity, as a soft single cotton yarn (0.34 x 0.23 of the wale, flattened).
2. The yarn is baked to a height field: open area 6.6% (the small openings real jersey has).
3. Fibre striations twisting along each yarn (about 22 degrees) and fibre grain are added to the
   height; normal, occlusion (from the height field's cavities), roughness and albedo (natural
   cotton, slight per-yarn tone, occlusion partly baked so crevices stay dark under direct light)
   are derived from it.

### Material

KHR_materials_sheen (soft fabric sheen) and KHR_texture_transform (tiling). Fold shading comes
from the live surface: lighting and shadows on the simulated folds, plus a fold occlusion term
from the cloth's curvature (`cloth-shader.ts`).

## Backups

- v4 (fixed drape baked into a 38,400-triangle mesh): `cotton-jersey-v4.glb`,
  `build-knit-glb-v4.mjs`, `fabric-scene-v4.ts.txt`, `KnitModel-v4.tsx.txt`, `v4-maps/`,
  `knit-lattice-poster-v4.webp`. v5's poster is kept as `knit-lattice-poster-v5.webp`.
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
