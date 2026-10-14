/**
 * Generates the knit plate's model (v4): a draped swatch of fine cotton single jersey.
 *
 *   npm run build:model
 *
 * Writes public/models/cotton-jersey-v4.glb and its maps (for reference) to
 * assets-source/models/v4-maps/. Earlier versions are kept in assets-source/models/.
 *
 * Why v4: v1-v3 showed a handful of large, twisted loops, which read as chain mail rather than
 * cloth. v4 shows what a buyer would see: a continuous piece of fine jersey lying in soft folds,
^ * about 55 wales across the view, so the knit reads as fabric texture first and as stitches on closer
 * inspection.
 *
 *  - Knit: a seamless tile of 4 wales x 6 courses of single jersey is modelled at yarn level
 *    (the interlocking loop path of the v3 stitch, with a soft single cotton yarn instead of
 *    plied rope) and baked to a height field: height, normal, occlusion, roughness and albedo
 *    maps, with per-stitch irregularity, per-yarn tone and fine fibre striations twisting along
 *    the yarn.
 *  - Cloth: a 16 x 12 surface in soft folds (steeper on one side, fading at their ends), with
 *    fold-valley shading and gentle tonal variation baked into vertex colours.
 *  - Material: natural cotton, matte with a soft fabric sheen; maps tiled by KHR_texture_transform.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import jpeg from "jpeg-js";
import { Document, NodeIO, Primitive } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMaterialsSheen, KHRMeshQuantization, KHRTextureTransform } from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/models/cotton-jersey-v4.glb");
const MAPS = resolve(ROOT, "assets-source/models/v4-maps");

/* ---------- Knit structure (units of the wale) ---------- */

const COURSE = 2 / 3; // 6 courses = 4 wales, so the tile is square
const TILE_WALES = 4;
const TILE_COURSES = 6;
const TILE = 4; // tile size in wale units
const N = 512; // texels per tile side (128 per wale)
const TEXEL = TILE / N;
const YARN_HALF_WIDTH = 0.17; // soft single cotton yarn, flattened in the fabric plane
const YARN_HALF_DEPTH = 0.115;
const BACKGROUND = -0.32;

// one jersey loop, sinker to sinker (as v3): x across, y up, z towards the viewer
const LOOP = [
  [0.0, -0.28, -0.13],
  [0.33, -0.11, -0.12],
  [0.37, 0.05, 0.13],
  [0.27, COURSE * 0.5, 0.12],
  [0.13, COURSE * 0.9, 0.05],
  [0.5, COURSE + 0.16, -0.15],
  [0.87, COURSE * 0.9, 0.05],
  [0.73, COURSE * 0.5, 0.12],
  [0.63, 0.05, 0.13],
  [0.67, -0.11, -0.12],
];
const FIXED = new Set([0, 1, 9]); // shared with neighbours: never jittered

/* ---------- Cloth ---------- */

const CLOTH_W = 16;
const CLOTH_H = 12;
const GRID_X = 160; // ~0.1 spacing: the folds are smooth
const GRID_Y = 120;
const WALE_SIZE = 0.16; // world units per wale: 100 wales across the cloth, ~55 in view

/* ---------- Helpers ---------- */

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => scale(a, 1 / (len(a) || 1));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const mod = (v, m) => ((v % m) + m) % m;

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (a, b) => {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Catmull-Rom through the points (ends excluded as tangent guides), resampled every `step`. */
function evenPath(points, step) {
  const dense = [];
  for (let k = 1; k < points.length - 2; k++) {
    const [p0, p1, p2, p3] = [points[k - 1], points[k], points[k + 1], points[k + 2]];
    for (let s = 0; s < 24; s++) {
      const u = s / 24;
      const u2 = u * u;
      const u3 = u2 * u;
      dense.push(
        [0, 1, 2].map(
          (c) =>
            0.5 *
            (2 * p1[c] + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u3),
        ),
      );
    }
  }
  dense.push(points[points.length - 2]);
  const out = [];
  let carried = 0;
  for (let i = 1; i < dense.length; i++) {
    const seg = sub(dense[i], dense[i - 1]);
    const l = len(seg);
    const t = norm(seg);
    while (carried <= l) {
      out.push({ p: add(dense[i - 1], scale(seg, carried / l)), t });
      carried += step;
    }
    carried -= l;
  }
  let s = 0;
  out.forEach((x, i) => (x.s = i ? (s += step) : 0));
  return out;
}

/* ---------- Bake the knit tile ---------- */

function bakeKnit() {
  const height = new Float32Array(N * N).fill(BACKGROUND);
  const across = new Float32Array(N * N);
  const along = new Float32Array(N * N);
  const yarn = new Float32Array(N * N).fill(-1);
  const radius = Math.ceil(YARN_HALF_WIDTH / TEXEL);

  for (let k = 0; k < TILE_COURSES; k++) {
    // one course through stitches -1..TILE_WALES so the spline is continuous across the tile edge
    const points = [];
    for (let s = -2; s <= TILE_WALES + 1; s++) {
      const random = rng(1000 + mod(s, TILE_WALES) * 37 + k * 101);
      const tall = 1 + (random() - 0.5) * 0.05;
      LOOP.forEach((p, i) => {
        const j = FIXED.has(i) ? [0, 0, 0] : [(random() - 0.5) * 0.04, (random() - 0.5) * 0.035, (random() - 0.5) * 0.03];
        points.push([p[0] + s + j[0], p[1] * (FIXED.has(i) ? 1 : tall) + k * COURSE + j[1], p[2] + j[2]]);
      });
    }
    const samples = evenPath(points, TEXEL * 0.5);
    for (const { p, t, s } of samples) {
      if (p[0] < -1 || p[0] > TILE_WALES + 1) continue;
      const tx = t[0];
      const ty = t[1];
      const tl = Math.hypot(tx, ty) || 1;
      const cx = mod(p[0], TILE);
      const cy = mod(p[1], TILE);
      const col = Math.floor(cx / TEXEL);
      const row = Math.floor((TILE - cy) / TEXEL);
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const ox = (col + dc + 0.5) * TEXEL - cx;
          const oy = TILE - (row + dr + 0.5) * TEXEL - cy;
          const d2 = ox * ox + oy * oy;
          if (d2 > YARN_HALF_WIDTH * YARN_HALF_WIDTH) continue;
          const h = p[2] + YARN_HALF_DEPTH * Math.sqrt(1 - d2 / (YARN_HALF_WIDTH * YARN_HALF_WIDTH));
          const idx = mod(row + dr, N) * N + mod(col + dc, N);
          if (h > height[idx]) {
            height[idx] = h;
            across[idx] = (tx * oy - ty * ox) / tl / YARN_HALF_WIDTH;
            along[idx] = s;
            yarn[idx] = k * TILE_WALES + mod(Math.floor(p[0] + 0.5), TILE_WALES);
          }
        }
      }
    }
  }

  // fibres: fine striations twisting gently along the yarn (about 22 degrees), plus fibre grain
  const fibre = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    if (yarn[i] < 0) continue;
    const phase = hash(yarn[i], 7) * 6.28;
    const a = across[i];
    const w = along[i];
    const f =
      0.5 * Math.sin(a * Math.PI * 8 + w * 2 * Math.PI * 9.4 + phase) +
      0.3 * Math.sin(a * Math.PI * 18.7 + w * 2 * Math.PI * 21 + phase * 1.7) +
      0.2 * (hash(i % N, Math.floor(i / N)) - 0.5) * 2;
    fibre[i] = f;
    height[i] += 0.009 * f;
  }

  // soft occlusion from the height field (cavities and the gaps between loops)
  const blur = (src, r) => {
    const tmp = new Float32Array(N * N);
    const out = new Float32Array(N * N);
    for (let y = 0; y < N; y++) {
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += src[y * N + mod(x, N)];
      for (let x = 0; x < N; x++) {
        tmp[y * N + x] = acc / (2 * r + 1);
        acc += src[y * N + mod(x + r + 1, N)] - src[y * N + mod(x - r, N)];
      }
    }
    for (let x = 0; x < N; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += tmp[mod(y, N) * N + x];
      for (let y = 0; y < N; y++) {
        out[y * N + x] = acc / (2 * r + 1);
        acc += tmp[mod(y + r + 1, N) * N + x] - tmp[mod(y - r, N) * N + x];
      }
    }
    return out;
  };
  const broad = blur(blur(height, 9), 9);
  const ao = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) ao[i] = clamp(1 - 2.6 * Math.max(0, broad[i] - height[i]), 0.22, 1);

  // the surface used for normals is lightly smoothed so yarn edges do not alias
  const surface = blur(height, 1);
  const at = (x, y) => surface[mod(y, N) * N + mod(x, N)];

  const rgba = (pixel) => {
    const data = Buffer.alloc(N * N * 4);
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const [r, g, b] = pixel(x, y, y * N + x);
        const o = (y * N + x) * 4;
        data[o] = clamp(Math.round(r), 0, 255);
        data[o + 1] = clamp(Math.round(g), 0, 255);
        data[o + 2] = clamp(Math.round(b), 0, 255);
        data[o + 3] = 255;
      }
    return data;
  };

  // tangent-space normal: +X along u (fabric x), +Y towards the top of the image (fabric up)
  const normal = rgba((x, y) => {
    const gx = (at(x + 1, y) - at(x - 1, y)) / (2 * TEXEL);
    const gy = (at(x, y - 1) - at(x, y + 1)) / (2 * TEXEL);
    const n = norm([-gx, -gy, 1]);
    return n.map((c) => (c * 0.5 + 0.5) * 255);
  });

  // natural cotton; each yarn a touch different; occlusion partly baked so crevices stay dark
  // under direct light as well as ambient
  const base = [233, 223, 205];
  const albedo = rgba((x, y, i) => {
    if (yarn[i] < 0) return [92, 84, 74].map((c) => c * ao[i]);
    const tone = 1 + (hash(yarn[i], 3) - 0.5) * 0.06;
    const shade = tone * (1 + 0.035 * fibre[i]) * (1 - 0.06 * across[i] * across[i]) * (0.5 + 0.5 * ao[i]);
    return [base[0] * shade * (1 + (hash(yarn[i], 5) - 0.5) * 0.015), base[1] * shade, base[2] * shade * (1 + (hash(yarn[i], 9) - 0.5) * 0.02)];
  });
  const orm = rgba((x, y, i) => [ao[i] * 255, (yarn[i] < 0 ? 0.95 : 0.8 + 0.12 * (0.5 - 0.5 * fibre[i])) * 255, 0]);

  const open = yarn.reduce((n, v) => n + (v < 0 ? 1 : 0), 0) / (N * N);
  return { normal, albedo, orm, open };
}

/* ---------- Cloth ---------- */

// soft folds: ridges steeper on one side, fading towards their ends, over a gentle undulation
const FOLDS = [
  { at: [-2.6, 1.3], angle: 62, width: 1.0, amp: 0.66, length: 4.2, skew: 0.45 },
  { at: [0.9, -0.3], angle: 58, width: 1.3, amp: 0.92, length: 5.4, skew: 0.35 },
  { at: [3.8, -1.7], angle: 66, width: 0.9, amp: 0.58, length: 3.8, skew: 0.5 },
  { at: [-0.8, 3.0], angle: 72, width: 0.65, amp: 0.28, length: 2.2, skew: 0.3 },
  { at: [-4.6, -2.6], angle: 55, width: 0.7, amp: 0.32, length: 2.6, skew: 0.4 },
];
function drape(x, y) {
  let z = 0.22 * Math.sin(0.33 * x + 0.5) * Math.cos(0.27 * y - 0.3) + 0.08 * Math.sin(0.9 * y + 0.2 * x);
  for (const f of FOLDS) {
    const a = (f.angle * Math.PI) / 180;
    const dx = x - f.at[0];
    const dy = y - f.at[1];
    const alongF = dx * Math.cos(a) + dy * Math.sin(a);
    let across = (-dx * Math.sin(a) + dy * Math.cos(a)) / f.width;
    if (across < 0) across *= 1 + f.skew;
    z += f.amp * Math.exp(-across * across) * Math.exp(-((alongF / f.length) ** 4));
  }
  return z;
}

function cloth() {
  const positions = [];
  const normals = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const e = 0.02;
  const tone = (x, y) => 1 + 0.025 * Math.sin(0.7 * x + 1.3) * Math.sin(0.55 * y + 0.4) + 0.012 * Math.sin(2.1 * x - 1.7 * y);
  for (let j = 0; j <= GRID_Y; j++) {
    for (let i = 0; i <= GRID_X; i++) {
      const x = (i / GRID_X - 0.5) * CLOTH_W;
      const y = (0.5 - j / GRID_Y) * CLOTH_H;
      const z = drape(x, y);
      positions.push(x, y, z);
      const n = norm([-(drape(x + e, y) - drape(x - e, y)) / (2 * e), -(drape(x, y + e) - drape(x, y - e)) / (2 * e), 1]);
      normals.push(...n);
      uvs.push(i / GRID_X, j / GRID_Y);
      // valleys of the folds sit a little in shadow; ridges catch the light
      const h = 0.25;
      const laplacian = (drape(x + h, y) + drape(x - h, y) + drape(x, y + h) + drape(x, y - h) - 4 * z) / (h * h);
      const fold = clamp(1 - 0.22 * Math.max(0, laplacian), 0.78, 1);
      const t = tone(x, y) * fold;
      colors.push(t, t, t);
    }
  }
  const row = GRID_X + 1;
  for (let j = 0; j < GRID_Y; j++) {
    for (let i = 0; i < GRID_X; i++) {
      const a = j * row + i;
      indices.push(a, a + row, a + 1, a + 1, a + row, a + row + 1);
    }
  }
  return { positions, normals, uvs, colors, indices };
}

/* ---------- Document ---------- */

const knit = bakeKnit();
mkdirSync(MAPS, { recursive: true });
const encode = (data, quality) => Buffer.from(jpeg.encode({ data, width: N, height: N }, quality).data);
const maps = {
  albedo: encode(knit.albedo, 86),
  normal: encode(knit.normal, 86),
  orm: encode(knit.orm, 80),
};
for (const [name, data] of Object.entries(maps)) writeFileSync(resolve(MAPS, `knit-${name}.jpg`), data);

const doc = new Document();
const buffer = doc.createBuffer();
doc.createExtension(KHRMeshQuantization);
const sheen = doc.createExtension(KHRMaterialsSheen);
const transform = doc.createExtension(KHRTextureTransform);
const repeats = [CLOTH_W / (TILE * WALE_SIZE), CLOTH_H / (TILE * WALE_SIZE)];
const tiled = (info) => info.setExtension("KHR_texture_transform", transform.createTransform().setScale(repeats));
const texture = (name, data) => doc.createTexture(name).setImage(data).setMimeType("image/jpeg");
const albedoTex = texture("Knit albedo", maps.albedo);
const normalTex = texture("Knit normal", maps.normal);
const ormTex = texture("Knit occlusion-roughness", maps.orm);

const material = doc
  .createMaterial("Cotton single jersey")
  .setBaseColorTexture(albedoTex)
  .setBaseColorFactor([1, 1, 1, 1])
  .setNormalTexture(normalTex)
  .setNormalScale(1)
  .setOcclusionTexture(ormTex)
  .setOcclusionStrength(1)
  .setMetallicRoughnessTexture(ormTex)
  .setRoughnessFactor(1)
  .setMetallicFactor(0)
  .setExtension("KHR_materials_sheen", sheen.createSheen().setSheenColorFactor([0.82, 0.76, 0.66]).setSheenRoughnessFactor(0.5));
tiled(material.getBaseColorTextureInfo());
tiled(material.getNormalTextureInfo());
tiled(material.getOcclusionTextureInfo());
tiled(material.getMetallicRoughnessTextureInfo());

const c = cloth();
const accessor = (array, type, ctor = Float32Array) => doc.createAccessor().setType(type).setArray(new ctor(array)).setBuffer(buffer);
const mesh = doc.createMesh("Cotton jersey swatch").addPrimitive(
  doc
    .createPrimitive()
    .setMode(Primitive.Mode.TRIANGLES)
    .setMaterial(material)
    .setIndices(accessor(c.indices, "SCALAR", Uint32Array))
    .setAttribute("POSITION", accessor(c.positions, "VEC3"))
    .setAttribute("NORMAL", accessor(c.normals, "VEC3"))
    .setAttribute("TEXCOORD_0", accessor(c.uvs, "VEC2"))
    .setAttribute("COLOR_0", accessor(c.colors, "VEC3")),
);
doc.createScene("Cotton jersey").addChild(doc.createNode("CottonJerseySwatch").setMesh(mesh));
doc.getRoot().getAsset().generator = "ACTIF cotton jersey v4 (scripts/build-knit-glb.mjs)";
doc.getRoot().getAsset().extras = { cloth: [CLOTH_W, CLOTH_H], waleSize: WALE_SIZE, walesAcross: Math.round(CLOTH_W / WALE_SIZE) };

await MeshoptEncoder.ready;
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: "high" }));
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMaterialsSheen, KHRMeshQuantization, KHRTextureTransform])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const glb = await io.writeBinary(doc);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, glb);

const kb = (b) => `${Math.round(b.length / 1024)} KB`;
console.log(
  `cotton-jersey-v4.glb: ${c.positions.length / 3} vertices, ${c.indices.length / 3} triangles, ` +
    `${Math.round(CLOTH_W / WALE_SIZE)} wales across; knit tile ${TILE_WALES}x${TILE_COURSES} stitches at ${N}px, ` +
    `open area in the knit ${(knit.open * 100).toFixed(1)}%; maps albedo ${kb(maps.albedo)}, normal ${kb(maps.normal)}, ` +
    `orm ${kb(maps.orm)}; file ${kb(glb)}`,
);
