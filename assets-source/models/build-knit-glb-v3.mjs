/**
 * Generates the knit plate's model (v3): a dense swatch of weft-knitted single jersey.
 *
 *   npm run build:model
 *
 * Writes public/models/knit-jersey-v3.glb (desktop) and knit-jersey-v3-lite.glb (phones).
 * Earlier versions and their generators are kept in assets-source/models/.
 *
 * Why v3: v1/v2 used yarn only 0.2 of the wale wide with tall, open loops, so about 27% of the
 * plate showed background through the fabric. v3 rebuilds the stitch itself:
 *
 *  - Proportions of real jersey: yarn about 0.33 of the wale, course pitch 0.78 of the wale.
 *    The V legs nearly touch at the neck and flare to the head; each head wraps behind the neck
 *    of the course above, so the chevrons nest; sinkers sit behind the gaps between wales.
 *    Crossing yarns are about one yarn depth apart front to back, so they layer, not intersect.
 *  - One stitch is a seamless tile: its ends are fixed points with a +x tangent, so any tile
 *    joins any other. Four variants differ inside the loop (shape, twist phase, slub), giving a
 *    natural irregularity without seams.
 *  - Each yarn is three twisted plies with a whole number of turns per stitch (so the twist is
 *    continuous across tiles), flattened slightly in the fabric plane as knitted yarn is.
 *  - Detail at three scales: macro (stitch rhythm), meso (plies), micro (a fibre normal map and
 *    occlusion/roughness map, restrained fibres as fine lit strands).
 *  - Contact occlusion baked into vertex colours from a 5x5 neighbourhood of stitches.
 *  - The fabric is drawn with EXT_mesh_gpu_instancing: one mesh per variant (plus its fibres),
 *    placed by per-instance translation and a slight per-stitch tint (_COLOR_0). The site
 *    re-lays the same instances out for its other structures (rib, technical).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";
import { Document, NodeIO, Primitive } from "@gltf-transform/core";
import {
  EXTMeshGPUInstancing,
  EXTMeshoptCompression,
  KHRMaterialsSheen,
  KHRMeshQuantization,
  KHRTextureTransform,
} from "@gltf-transform/extensions";
import { quantize, reorder } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- Stitch (one wale wide, units of the wale) ---------- */

export const WALE = 1;
export const COURSE = 0.68; // course pitch: tight jersey, each neck nests low in the V below
const CROSS = 0.13; // half the front-to-back separation at crossings

// One jersey loop from sinker to sinker, x across, y up, z towards the viewer, with heights tied to
// the course pitch so the loop always interlocks with its neighbours. Points marked fixed never
// vary, so every variant meets its neighbours with the same position and tangent.
const LOOP = [
  { p: [0.0, -0.28, -0.13], fixed: true }, // sinker, behind, between wales
  { p: [0.33, -0.11, -0.12], fixed: true }, // rising from behind, through the loop below
  { p: [0.37, 0.05, CROSS] }, // neck, in front of the head below
  { p: [0.27, COURSE * 0.5, 0.12] }, // leg, front: the visible V
  { p: [0.13, COURSE * 0.9, 0.05] }, // head flares out, in front of the yarn rising through it
  { p: [0.5, COURSE + 0.16, -0.15] }, // crown, behind the neck of the course above
  { p: [0.87, COURSE * 0.9, 0.05] },
  { p: [0.73, COURSE * 0.5, 0.12] },
  { p: [0.63, 0.05, CROSS] },
  { p: [0.67, -0.11, -0.12], fixed: true },
  { p: [1.0, -0.28, -0.13], fixed: true },
];

/* ---------- Yarn ---------- */

const PLIES = 3;
const PLY_RADIUS = 0.068;
const PLY_SPREAD = 0.104; // ply centre from the yarn axis, in the fabric plane (yarn ~0.34 wide)
const PLY_DEPTH = 0.046; // ... and front to back (~0.23 deep): knitted yarn lies flattened
const TWIST_PITCH = 1.05; // target yarn length per turn; rounded to whole turns per stitch
const FIBRE_TILE = 0.42; // ply length per tile of the fibre texture
const VARIANTS = 4;

const BUILDS = {
  desktop: { file: "knit-jersey-v3.glb", perTurn: 12, radial: 6, fibres: 14 },
  lite: { file: "knit-jersey-v3-lite.glb", perTurn: 9, radial: 5, fibres: 8 },
};

// default layout written into the file (the site re-lays it out per structure)
const COLS = 14;
const ROWS = 17;

/* ---------- Helpers ---------- */

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => scale(a, 1 / (len(a) || 1));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform Catmull-Rom over `points` (with one extra neighbour at each end), resampled evenly. */
function evenPath(points, segments) {
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
            (2 * p1[c] +
              (-p0[c] + p2[c]) * u +
              (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u2 +
              (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u3),
        ),
      );
    }
  }
  dense.push(points[points.length - 2]);
  const cumulative = [0];
  for (let i = 1; i < dense.length; i++) cumulative.push(cumulative[i - 1] + len(sub(dense[i], dense[i - 1])));
  const total = cumulative[cumulative.length - 1];
  const out = [];
  let j = 0;
  for (let i = 0; i <= segments; i++) {
    const target = (i / segments) * total;
    while (j < dense.length - 2 && cumulative[j + 1] < target) j++;
    const t = (target - cumulative[j]) / (cumulative[j + 1] - cumulative[j] || 1);
    out.push({ p: add(dense[j], scale(sub(dense[j + 1], dense[j]), t)), s: target });
  }
  return { samples: out, total };
}

/** A frame tied to the fabric plane: B lies in the plane, N leans towards the viewer. */
function fabricFrame(t) {
  const n = norm(sub([0, 0, 1], scale(t, t[2])));
  return { t, n, b: cross(t, n) };
}

const tangents = (pts) =>
  pts.map((_, i) => norm(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)])));

/* ---------- Textures (as v2) ---------- */

function png(width, height, pixel) {
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = [0];
    for (let x = 0; x < width; x++) row.push(...pixel(x, y));
    rows.push(Buffer.from(row));
  }
  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
    return Buffer.concat([head, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(2, 9);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** A tiling field of fibres along the ply: coarse bundles plus fine fibres that wander and fade. */
function fibreField(size) {
  const random = rng(7);
  const fibres = Array.from({ length: 70 }, (_, i) => ({
    y: random() * size,
    amp: i < 14 ? 0.55 + random() * 0.4 : 0.3 + random() * 0.4,
    width: i < 14 ? 3 + random() * 3 : 0.8 + random() * 1,
    waveA: random() * 3.5,
    waveM: 1 + Math.floor(random() * 2),
    waveP: random() * Math.PI * 2,
    fadeM: 1 + Math.floor(random() * 3),
    fadeP: random() * Math.PI * 2,
  }));
  const field = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let keep = 1;
      for (const f of fibres) {
        const cy = f.y + f.waveA * Math.sin((2 * Math.PI * f.waveM * x) / size + f.waveP);
        let dy = Math.abs(y - cy) % size;
        dy = Math.min(dy, size - dy);
        if (dy > f.width * 3) continue;
        const fade = 0.55 + 0.45 * Math.sin((2 * Math.PI * f.fadeM * x) / size + f.fadeP);
        keep *= 1 - f.amp * fade * Math.exp(-(dy * dy) / (2 * f.width * f.width));
      }
      field[y * size + x] = 1 - keep;
    }
  }
  return field;
}

function textures() {
  const size = 192;
  const h = fibreField(size);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  const normal = png(size, size, (x, y) => {
    const n = norm([-(at(x + 1, y) - at(x - 1, y)) * 3.2, -(at(x, y + 1) - at(x, y - 1)) * 3.2, 1]);
    return n.map((c) => Math.round((c * 0.5 + 0.5) * 255));
  });
  const orm = png(size, size, (x, y) => {
    const v = at(x, y);
    return [Math.round((0.62 + 0.38 * Math.sqrt(v)) * 255), Math.round((0.95 - 0.16 * v) * 255), 0];
  });
  return { normal, orm };
}

/* ---------- One stitch variant ---------- */

function stitch(variant, build) {
  const random = rng(101 + variant * 977);
  const jitter = (v) => (random() - 0.5) * v;
  const pts = LOOP.map(({ p, fixed }) => (fixed ? p : [p[0] + jitter(0.035), p[1] + jitter(0.035), p[2] + jitter(0.02)]));
  // neighbours for the spline ends: the previous stitch's last rising point, the next stitch's first
  const extended = [sub(pts[pts.length - 2], [WALE, 0, 0]), ...pts, add(pts[1], [WALE, 0, 0])];

  // whole number of ply turns per stitch, so the twist continues across tiles
  const rough = evenPath(extended, 200).total;
  const turns = Math.max(2, Math.round(rough / TWIST_PITCH));
  const { samples, total } = evenPath(extended, turns * build.perTurn);
  const axis = tangents(samples.map((x) => x.p)).map(fabricFrame);
  const phase = (Math.floor(random() * 3) * 2 * Math.PI) / 3; // multiples of a third: seamless
  const envelope = (s) => Math.sin((Math.PI * s) / total); // 0 at both ends
  const slubP = random() * Math.PI * 2;
  const driftP = random() * Math.PI * 2;

  const plies = Array.from({ length: PLIES }, (_, k) =>
    samples.map(({ p, s }, i) => {
      const thick = 1 + 0.06 * Math.sin((4 * Math.PI * s) / total + slubP) * envelope(s);
      const angle =
        (2 * Math.PI * turns * s) / total + phase + (2 * Math.PI * k) / PLIES + 0.22 * Math.sin((2 * Math.PI * s) / total + driftP) * envelope(s);
      const offset = add(scale(axis[i].b, Math.cos(angle) * PLY_SPREAD), scale(axis[i].n, Math.sin(angle) * PLY_DEPTH));
      return { c: add(p, scale(offset, thick)), r: PLY_RADIUS * thick, s };
    }),
  );
  return { plies, samples, total, turns };
}

/* ---------- Baked occlusion from the neighbourhood ---------- */

function occluders(tiles) {
  const spheres = [];
  for (let dc = -2; dc <= 2; dc++) {
    for (let dr = -2; dr <= 2; dr++) {
      const tile = tiles[(((dc * 7 + dr * 3) % VARIANTS) + VARIANTS) % VARIANTS];
      const shift = [dc * WALE, dr * COURSE, 0];
      tile.plies.forEach((ply, k) => {
        for (const x of ply) spheres.push({ c: add(x.c, shift), r: x.r, s: x.s, self: dc === 0 && dr === 0 ? k : -1 });
      });
    }
  }
  const cell = 0.32;
  const grid = new Map();
  const key = (x, y, z) => `${x},${y},${z}`;
  spheres.forEach((sp, i) => {
    const k = key(...sp.c.map((v) => Math.floor(v / cell)));
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(i);
  });
  return (point, normal, ply, s) => {
    const [cx, cy, cz] = point.map((v) => Math.floor(v / cell));
    let occ = 0;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          for (const i of grid.get(key(cx + dx, cy + dy, cz + dz)) ?? []) {
            const sp = spheres[i];
            if (sp.self === ply && Math.abs(sp.s - s) < 0.18) continue;
            const w = sub(sp.c, point);
            const d = len(w);
            if (d < 1e-5 || d > cell) continue;
            const cos = dot(normal, w) / d;
            if (cos <= 0) continue;
            occ += ((sp.r * sp.r) / (d * d)) * cos * (1 - d / cell) ** 2;
          }
        }
    return clamp(1 / (1 + 1.1 * occ), 0.3, 1);
  };
}

/* ---------- Meshes ---------- */

function yarnMesh(tile, build, ao) {
  const ring = build.radial;
  const positions = [];
  const normals = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  let aoSum = 0;
  let aoMin = 1;
  tile.plies.forEach((ply, k) => {
    const base = positions.length / 3;
    const pts = ply.map((x) => x.c);
    const frames = tangents(pts).map(fabricFrame);
    let run = 0;
    const lengths = pts.map((p, i) => (i ? (run += len(sub(p, pts[i - 1]))) : 0));
    pts.forEach((p, i) => {
      for (let j = 0; j < ring; j++) {
        const a = (j / ring) * Math.PI * 2;
        const dir = add(scale(frames[i].b, Math.cos(a)), scale(frames[i].n, Math.sin(a)));
        const v = add(p, scale(dir, ply[i].r));
        positions.push(...v);
        normals.push(...dir);
        uvs.push(lengths[i] / run, 1 - Math.abs((2 * j) / ring - 1));
        const open = ao(v, dir, k, ply[i].s);
        aoSum += open;
        aoMin = Math.min(aoMin, open);
        const tone = (1 + (k - 1) * 0.02) * open;
        colors.push(tone * 1.005, tone, tone * 0.99);
      }
    });
    for (let i = 0; i < pts.length - 1; i++) {
      for (let j = 0; j < ring; j++) {
        const a = base + i * ring + j;
        const b = base + (i + 1) * ring + j;
        const c = base + (i + 1) * ring + ((j + 1) % ring);
        const d = base + i * ring + ((j + 1) % ring);
        indices.push(a, b, d, b, c, d); // counter-clockwise seen from outside (ring runs B to N)
      }
    }
  });
  return { positions, normals, uvs, colors, indices, aoMean: aoSum / (positions.length / 3), aoMin, plyLength: 0 };
}

/** Restrained fibres: fine lit strands rooted on exposed yarn, lying mostly along it. */
function fibreMesh(tile, build, ao, seed) {
  const random = rng(seed);
  const positions = [];
  const normals = [];
  const indices = [];
  let placed = 0;
  for (let tries = 0; placed < build.fibres && tries < build.fibres * 12; tries++) {
    const k = Math.floor(random() * PLIES);
    const ply = tile.plies[k];
    const i = 2 + Math.floor(random() * (ply.length - 4));
    const t = norm(sub(ply[i + 1].c, ply[i - 1].c));
    const f = fabricFrame(t);
    const a = random() * Math.PI * 2;
    const out = add(scale(f.b, Math.cos(a)), scale(f.n, Math.sin(a)));
    const root = add(ply[i].c, scale(out, ply[i].r * 0.95));
    if (out[2] < -0.2 || ao(root, out, k, ply[i].s) < 0.85) continue; // exposed, front-facing only
    const lift = ((10 + random() * 35) * Math.PI) / 180;
    let dir = norm(add(scale(random() < 0.5 ? t : scale(t, -1), Math.cos(lift)), scale(out, Math.sin(lift))));
    const length = 0.05 + random() ** 2 * 0.11;
    const curl = norm(cross(dir, out));
    const spine = [root];
    for (let s = 0; s < 3; s++) {
      dir = norm(add(dir, scale(curl, (random() - 0.5) * 0.8)));
      spine.push(add(spine[s], scale(dir, length / 3)));
    }
    const base = positions.length / 3;
    spine.forEach((p, s) => {
      const r = 0.0055 * (1 - s / 4);
      const fr = fabricFrame(norm(s < 3 ? sub(spine[s + 1], p) : sub(p, spine[s - 1])));
      for (let j = 0; j < 3; j++) {
        const ang = (j / 3) * Math.PI * 2;
        const d = add(scale(fr.b, Math.cos(ang)), scale(fr.n, Math.sin(ang)));
        positions.push(...add(p, scale(d, r)));
        normals.push(...d);
      }
    });
    for (let s = 0; s < 3; s++) {
      for (let j = 0; j < 3; j++) {
        const a = base + s * 3 + j;
        const b = base + (s + 1) * 3 + j;
        const c = base + (s + 1) * 3 + ((j + 1) % 3);
        const d = base + s * 3 + ((j + 1) % 3);
        indices.push(a, b, d, b, c, d); // counter-clockwise seen from outside (ring runs B to N)
      }
    }
    placed++;
  }
  return { positions, normals, indices, placed };
}

/**
 * Separation check: closest approach between this stitch's yarn axis and its neighbours'
 * (courses above and below, and the loop interiors beside it; stitches in a course share their
 * end points by design). Crossing yarns should sit about one yarn depth apart (~0.29).
 */
function clearance(tiles) {
  let worst = { d: Infinity };
  const centre = tiles[0].samples;
  const fmt = (p) => p.map((v) => v.toFixed(2)).join(",");
  for (let dc = -1; dc <= 1; dc++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (!dc && !dr) continue;
      const tile = tiles[(dc + 2 + dr + VARIANTS) % VARIANTS];
      const interior = (x, total) => dr !== 0 || (x.s > 0.6 && x.s < total - 0.6);
      const other = tile.samples.filter((x) => interior(x, tile.total)).map((x) => add(x.p, [dc * WALE, dr * COURSE, 0]));
      for (const a of centre.filter((x) => interior(x, tiles[0].total))) {
        for (const b of other) {
          const d = len(sub(a.p, b));
          if (d < worst.d) worst = { d, at: `neighbour (${dc},${dr}) at [${fmt(a.p)}] vs [${fmt(b)}]` };
        }
      }
    }
  }
  return `${worst.d.toFixed(3)} ${worst.at}`;
}

/* ---------- Document ---------- */

async function build(name, cfg, maps) {
  const tiles = Array.from({ length: VARIANTS }, (_, v) => stitch(v, cfg));
  const ao = occluders(tiles);

  const doc = new Document();
  const buffer = doc.createBuffer();
  doc.createExtension(KHRMeshQuantization);
  const sheen = doc.createExtension(KHRMaterialsSheen);
  const transform = doc.createExtension(KHRTextureTransform);
  const instancing = doc.createExtension(EXTMeshGPUInstancing);

  const plyLength = tiles[0].plies[0].reduce((sum, x, i, all) => (i ? sum + len(sub(x.c, all[i - 1].c)) : 0), 0);
  const tiling = (info) =>
    info.setExtension("KHR_texture_transform", transform.createTransform().setScale([plyLength / FIBRE_TILE, 1]));
  const normalTex = doc.createTexture("Fibre normal").setImage(maps.normal).setMimeType("image/png");
  const ormTex = doc.createTexture("Fibre occlusion-roughness").setImage(maps.orm).setMimeType("image/png");

  const yarn = doc
    .createMaterial("Cotton yarn")
    .setBaseColorFactor([0.7, 0.58, 0.42, 1])
    .setRoughnessFactor(1)
    .setMetallicFactor(0)
    .setDoubleSided(true)
    .setNormalTexture(normalTex)
    .setNormalScale(1)
    .setOcclusionTexture(ormTex)
    .setOcclusionStrength(0.8)
    .setMetallicRoughnessTexture(ormTex)
    .setExtension("KHR_materials_sheen", sheen.createSheen().setSheenColorFactor([0.86, 0.8, 0.7]).setSheenRoughnessFactor(0.6));
  tiling(yarn.getNormalTextureInfo());
  tiling(yarn.getOcclusionTextureInfo());
  tiling(yarn.getMetallicRoughnessTextureInfo());
  const fibre = doc
    .createMaterial("Cotton fibre")
    .setBaseColorFactor([0.86, 0.76, 0.6, 1])
    .setRoughnessFactor(0.9)
    .setMetallicFactor(0)
    .setExtension("KHR_materials_sheen", sheen.createSheen().setSheenColorFactor([0.95, 0.9, 0.8]).setSheenRoughnessFactor(0.4));

  const accessor = (array, type, ctor = Float32Array) =>
    doc.createAccessor().setType(type).setArray(new ctor(array)).setBuffer(buffer);

  // the default layout: a jersey swatch, centred, each stitch a variant and a slight tint
  const random = rng(4242);
  const placements = Array.from({ length: VARIANTS }, () => ({ t: [], c: [] }));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = Math.floor(random() * VARIANTS);
      const tone = 1 + (random() - 0.5) * 0.08;
      placements[v].t.push((c - COLS / 2) * WALE, (r - (ROWS - 1) / 2) * COURSE, 0);
      placements[v].c.push(tone * (1 + (random() - 0.5) * 0.02), tone, tone * (1 + (random() - 0.5) * 0.03));
    }
  }

  const root = doc.createNode("KnitSwatch");
  doc.createScene("Single jersey swatch").addChild(root);
  const stats = { vertices: 0, triangles: 0, fibres: 0, aoMean: 0, aoMin: 1 };

  tiles.forEach((tile, v) => {
    const y = yarnMesh(tile, cfg, ao);
    const f = fibreMesh(tile, cfg, ao, 900 + v);
    stats.vertices += y.positions.length / 3 + f.positions.length / 3;
    stats.triangles += (y.indices.length + f.indices.length) / 3;
    stats.fibres += f.placed;
    stats.aoMean += y.aoMean / VARIANTS;
    stats.aoMin = Math.min(stats.aoMin, y.aoMin);

    const yarnMeshDef = doc.createMesh(`Stitch ${v + 1}`).addPrimitive(
      doc
        .createPrimitive()
        .setMode(Primitive.Mode.TRIANGLES)
        .setMaterial(yarn)
        .setIndices(accessor(y.indices, "SCALAR", Uint32Array))
        .setAttribute("POSITION", accessor(y.positions, "VEC3"))
        .setAttribute("NORMAL", accessor(y.normals, "VEC3"))
        .setAttribute("TEXCOORD_0", accessor(y.uvs, "VEC2"))
        .setAttribute("COLOR_0", accessor(y.colors, "VEC3")),
    );
    const fibreMeshDef = doc.createMesh(`Fibres ${v + 1}`).addPrimitive(
      doc
        .createPrimitive()
        .setMode(Primitive.Mode.TRIANGLES)
        .setMaterial(fibre)
        .setIndices(accessor(f.indices, "SCALAR", Uint32Array))
        .setAttribute("POSITION", accessor(f.positions, "VEC3"))
        .setAttribute("NORMAL", accessor(f.normals, "VEC3")),
    );
    const batch = () =>
      instancing
        .createInstancedMesh()
        .setAttribute("TRANSLATION", accessor(placements[v].t, "VEC3"))
        .setAttribute("_COLOR_0", accessor(placements[v].c, "VEC3"));
    root.addChild(doc.createNode(`stitch-${v + 1}`).setMesh(yarnMeshDef).setExtension("EXT_mesh_gpu_instancing", batch()));
    root.addChild(doc.createNode(`fibres-${v + 1}`).setMesh(fibreMeshDef).setExtension("EXT_mesh_gpu_instancing", batch()));
  });

  doc.getRoot().getAsset().generator = "ACTIF knit swatch v3 (scripts/build-knit-glb.mjs)";
  doc.getRoot().getAsset().extras = { wale: WALE, course: COURSE, cols: COLS, rows: ROWS };
  await MeshoptEncoder.ready;
  // meshopt() would also quantise POSITION, and for instanced meshes it moves the dequantisation
  // into the instance transforms, which the site replaces with its own layouts. So: reorder,
  // quantise only UVs and colours, and let the meshopt filters compress float positions/normals.
  await doc.transform(
    reorder({ encoder: MeshoptEncoder, target: "size" }),
    quantize({ pattern: /^(TEXCOORD|COLOR)(_\d+)?$/, patternTargets: /^$/ }),
  );
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });

  const io = new NodeIO()
    .registerExtensions([EXTMeshGPUInstancing, EXTMeshoptCompression, KHRMaterialsSheen, KHRMeshQuantization, KHRTextureTransform])
    .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
  const glb = await io.writeBinary(doc);
  const out = resolve(ROOT, "public/models", cfg.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, glb);
  const swatchTris = (stats.triangles / VARIANTS) * COLS * ROWS;
  console.log(
    `${name.padEnd(8)} ${cfg.file}: tile ${Math.round(stats.vertices / VARIANTS)} vertices / ${Math.round(stats.triangles / VARIANTS)} triangles ` +
      `(${tiles[0].turns} ply turns, ${Math.round(stats.fibres / VARIANTS)} fibres), swatch ${COLS}x${ROWS} = ${Math.round(swatchTris / 1000)}k triangles, ` +
      `AO min ${stats.aoMin.toFixed(2)} mean ${stats.aoMean.toFixed(2)}, axis clearance ${clearance(tiles)}, ${(glb.length / 1024).toFixed(0)} KB`,
  );
}

const maps = textures();
for (const [name, cfg] of Object.entries(BUILDS)) await build(name, cfg, maps);
