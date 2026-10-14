/**
 * Generates the knit plate's model: a swatch of weft-knitted single jersey at yarn level.
 *
 *   npm run build:model
 *
 * Writes public/models/knit-lattice-v2.glb (desktop) and knit-lattice-v2-lite.glb (phones).
 * The v1 asset and its generator are kept in assets-source/models/.
 *
 * Structure (unchanged from v1): five courses of six stitches. Each course is one continuous
 * yarn following omega-shaped loops; a loop's head tucks behind the legs of the course above, so
 * the courses interlock as they do off a circular knitting machine.
 *
 * v2 detail:
 *  - each yarn is three real plies twisted around its path (a lobed, twisted silhouette rather
 *    than one smooth tube), with slub (thickness) variation and natural irregularity in every
 *    loop, from a seeded generator so builds are reproducible;
 *  - a tiling fibre normal map and a matching occlusion/roughness map, read along each ply;
 *  - ambient occlusion baked into vertex colours from every nearby ply, so crossings and the
 *    crevices between plies carry soft contact shadow at no runtime cost, plus slight colour
 *    variation between plies and courses;
 *  - restrained fuzz: hair-thin filaments (line primitives) on exposed yarn surfaces only;
 *  - the knitting reveal reads TEXCOORD_0.x (0..1 along each ply; on the fuzz, along the yarn)
 *    in the shader rather than relying on index order, so the file can be quantised, reordered
 *    and compressed (EXT_meshopt_compression) without breaking it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";
import { Document, NodeIO, Primitive } from "@gltf-transform/core";
import {
  EXTMeshoptCompression,
  KHRMaterialsSheen,
  KHRMaterialsUnlit,
  KHRMeshQuantization,
  KHRTextureTransform,
} from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- Structure (as v1) ---------- */

const STITCHES = 6;
const COURSES = 5;
const WALE = 1;
const PITCH = 0.9;
const LOOP = [
  [0.0, 0.0, -0.1], // sinker, behind, between wales
  [0.39, 0.22, 0.02], // leg comes forward through the loop below
  [0.29, 0.76, 0.15], // leg in front: the visible V of the jersey face
  [0.15, 1.28, -0.03], // head flares wider than the legs
  [0.5, 1.6, -0.19], // crown, behind the legs of the course above
  [0.85, 1.28, -0.03],
  [0.71, 0.76, 0.15],
  [0.61, 0.22, 0.02],
];

/* ---------- Yarn ---------- */

const YARN_RADIUS = 0.1; // outer radius of the plied yarn
const PLIES = 3;
const PLY_RADIUS = 0.5 * YARN_RADIUS; // three plies, pressed into each other as spun yarn is
const PLY_OFFSET = 0.46 * YARN_RADIUS; // ply centre from the yarn axis (overlap keeps crevices soft)
const TWIST_PITCH = 0.78; // yarn length per full turn of the plies (a soft, knitting-yarn twist of about 20 degrees)
const FIBRE_TILE = 0.42; // ply length covered by one tile of the fibre texture

const VARIANTS = {
  desktop: { file: "knit-lattice-v2.glb", perUnit: 13, radial: 6, fuzz: 420 },
  lite: { file: "knit-lattice-v2-lite.glb", perUnit: 10, radial: 5, fuzz: 180 },
};

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

/** Smooth 1D noise from a few sines with random phases (no visible period over a course). */
function wobble(random, octaves = 3) {
  const terms = Array.from({ length: octaves }, (_, i) => ({
    f: (0.6 + random() * 0.8) * 2 ** i,
    p: random() * Math.PI * 2,
    a: 1 / 2 ** i,
  }));
  const total = terms.reduce((s, t) => s + t.a, 0);
  return (x) => terms.reduce((s, t) => s + t.a * Math.sin(x * t.f + t.p), 0) / total;
}

/** Catmull-Rom through the points, then resampled to even arc-length spacing. */
function evenPath(points, perUnit) {
  const dense = [];
  const at = (i) => points[clamp(i, 0, points.length - 1)];
  for (let k = 0; k < points.length - 1; k++) {
    const [p0, p1, p2, p3] = [at(k - 1), at(k), at(k + 1), at(k + 2)];
    for (let s = 0; s < 16; s++) {
      const u = s / 16;
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
  dense.push(points[points.length - 1]);
  const cumulative = [0];
  for (let i = 1; i < dense.length; i++) cumulative.push(cumulative[i - 1] + len(sub(dense[i], dense[i - 1])));
  const total = cumulative[cumulative.length - 1];
  const count = Math.ceil(total * perUnit);
  const out = [];
  let j = 0;
  for (let i = 0; i <= count; i++) {
    const target = (i / count) * total;
    while (j < dense.length - 2 && cumulative[j + 1] < target) j++;
    const t = (target - cumulative[j]) / (cumulative[j + 1] - cumulative[j] || 1);
    out.push({ p: add(dense[j], scale(sub(dense[j + 1], dense[j]), t)), s: target });
  }
  return { samples: out, total };
}

/** Parallel-transport frames along a polyline (no twisting). */
function frames(points) {
  const n = points.length;
  const tangents = points.map((_, i) => norm(sub(points[Math.min(n - 1, i + 1)], points[Math.max(0, i - 1)])));
  let normal = norm(cross(tangents[0], Math.abs(tangents[0][2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
  return tangents.map((t) => {
    normal = norm(sub(normal, scale(t, dot(normal, t))));
    return { t, n: normal, b: cross(t, normal) };
  });
}

/* ---------- Textures ---------- */

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

/**
 * A tiling field of fibres running along the ply (x = along, y = around): each fibre is a soft
 * ridge that wanders, thickens and fades along its length, so the tile has no visible stripes.
 */
function fibreField(size) {
  const random = rng(7);
  // coarse bundles read at normal viewing distance; fine fibres appear on closer inspection
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
    const dx = at(x + 1, y) - at(x - 1, y);
    const dy = at(x, y + 1) - at(x, y - 1);
    const n = norm([-dx * 3.2, -dy * 3.2, 1]);
    return n.map((c) => Math.round((c * 0.5 + 0.5) * 255));
  });
  // R: fibre-scale occlusion (gaps between fibres), G: roughness (fibre crowns a little smoother)
  const orm = png(size, size, (x, y) => {
    const v = at(x, y);
    return [Math.round((0.62 + 0.38 * Math.sqrt(v)) * 255), Math.round((0.95 - 0.16 * v) * 255), 0];
  });
  return { normal, orm };
}

/* ---------- Geometry ---------- */

function buildCourses(variant) {
  const random = rng(1970);
  const courses = [];
  for (let k = 0; k < COURSES; k++) {
    // a slightly irregular course: no two loops quite the same, as on a real machine
    const points = [];
    for (let s = 0; s < STITCHES; s++) {
      const tall = 1 + (random() - 0.5) * 0.06;
      const lean = (random() - 0.5) * 0.04;
      for (const [x, y, z] of LOOP) {
        points.push([
          x + s * WALE + lean * y + (random() - 0.5) * 0.03,
          y * tall + k * PITCH + (random() - 0.5) * 0.025,
          z + (random() - 0.5) * 0.025,
        ]);
      }
    }
    points.push([STITCHES * WALE, k * PITCH, LOOP[0][2]]);

    const { samples, total } = evenPath(points, variant.perUnit);
    const axis = frames(samples.map((x) => x.p));
    const slub = wobble(random);
    const drift = wobble(random, 2);
    const phase = random() * Math.PI * 2;
    const plyTint = Array.from({ length: PLIES }, () => ({ l: 1 + (random() - 0.5) * 0.07, w: (random() - 0.5) * 2 }));
    const courseTint = 1 + (random() - 0.5) * 0.04;

    const plies = Array.from({ length: PLIES }, (_, p) => {
      const path = samples.map(({ p: c, s }, i) => {
        const thick = 1 + 0.05 * slub(s * 1.7);
        const angle = (2 * Math.PI * s) / TWIST_PITCH + phase + 0.25 * drift(s * 0.8) + (2 * Math.PI * p) / PLIES;
        const offset = add(scale(axis[i].n, Math.cos(angle)), scale(axis[i].b, Math.sin(angle)));
        return { c: add(c, scale(offset, PLY_OFFSET * thick)), r: PLY_RADIUS * thick, s };
      });
      return { path, tint: plyTint[p] };
    });
    courses.push({ k, total, samples, plies, courseTint, slub });
  }
  return courses;
}

/**
 * Sweep each ply as a tube; returns flat arrays plus per-vertex data for the AO bake. u runs
 * 0..1 along the ply, which tracks the yarn path closely enough to drive the knitting reveal;
 * v runs 0..1..0 around it, so the ring needs no seam vertex (the fibres run along u, so the
 * mirrored half is invisible).
 */
function sweep(course, variant) {
  const ring = variant.radial;
  const positions = [];
  const normals = [];
  const uv0 = [];
  const along = [];
  const tints = [];
  const indices = [];
  for (const [p, ply] of course.plies.entries()) {
    const base = positions.length / 3;
    const pts = ply.path.map((x) => x.c);
    const f = frames(pts);
    let run = 0;
    const lengths = pts.map((pt, i) => (i === 0 ? 0 : (run += len(sub(pt, pts[i - 1])))));
    const plyLength = run;
    for (let i = 0; i < pts.length; i++) {
      for (let j = 0; j < ring; j++) {
        const a = (j / ring) * Math.PI * 2;
        const dir = add(scale(f[i].n, Math.cos(a)), scale(f[i].b, Math.sin(a)));
        positions.push(...add(pts[i], scale(dir, ply.path[i].r)));
        normals.push(...dir);
        uv0.push(lengths[i] / plyLength, 1 - Math.abs((2 * j) / ring - 1));
        along.push(ply.path[i].s);
        tints.push(p);
      }
    }
    for (let i = 0; i < pts.length - 1; i++) {
      for (let j = 0; j < ring; j++) {
        const a = base + i * ring + j;
        const b = base + (i + 1) * ring + j;
        const c = base + (i + 1) * ring + ((j + 1) % ring);
        const d = base + i * ring + ((j + 1) % ring);
        indices.push(a, d, b, b, d, c);
      }
    }
  }
  return { positions, normals, uv0, along, tints, indices };
}

/* ---------- Baked ambient occlusion ---------- */

function occluders(courses) {
  const spheres = [];
  for (const course of courses) {
    for (const [p, ply] of course.plies.entries()) {
      for (const x of ply.path) spheres.push({ c: x.c, r: x.r, s: x.s, id: course.k * PLIES + p, course: course.k });
    }
  }
  const cell = 0.3;
  const grid = new Map();
  const key = (x, y, z) => `${x},${y},${z}`;
  for (const [i, sp] of spheres.entries()) {
    const k = key(...sp.c.map((v) => Math.floor(v / cell)));
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(i);
  }
  /** 1 = open, lower = occluded. `self` excludes the ply's own nearby samples. */
  return (point, normal, self) => {
    const [cx, cy, cz] = point.map((v) => Math.floor(v / cell));
    let occ = 0;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const bucket = grid.get(key(cx + dx, cy + dy, cz + dz));
          if (!bucket) continue;
          for (const i of bucket) {
            const sp = spheres[i];
            if (sp.id === self.id && Math.abs(sp.s - self.s) < 0.16) continue;
            const w = sub(sp.c, point);
            const d = len(w);
            if (d < 1e-5 || d > cell) continue;
            const cos = dot(normal, w) / d;
            if (cos <= 0) continue;
            const fall = (1 - d / cell) ** 2;
            occ += ((sp.r * sp.r) / (d * d)) * cos * fall;
          }
        }
    return clamp(1 / (1 + 1.25 * occ), 0.28, 1);
  };
}

/* ---------- Fuzz ---------- */

function fuzz(course, variant, ao, random) {
  const positions = [];
  const colors = [];
  const uv0 = [];
  const indices = [];
  let placed = 0;
  let tries = 0;
  while (placed < variant.fuzz && tries++ < variant.fuzz * 8) {
    const ply = course.plies[Math.floor(random() * PLIES)];
    const i = 1 + Math.floor(random() * (ply.path.length - 2));
    const here = ply.path[i];
    const t = norm(sub(ply.path[i + 1].c, ply.path[i - 1].c));
    const side = norm(cross(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
    const angle = random() * Math.PI * 2;
    const out = norm(add(scale(side, Math.cos(angle)), scale(cross(t, side), Math.sin(angle))));
    const root = add(here.c, scale(out, here.r * 0.96));
    const open = ao(root, out, { id: course.k * PLIES + course.plies.indexOf(ply), s: here.s });
    if (open < 0.82) continue; // no fuzz in crevices or under crossings
    const lift = ((12 + random() * 38) * Math.PI) / 180;
    let dir = norm(add(scale(random() < 0.5 ? t : scale(t, -1), Math.cos(lift)), scale(out, Math.sin(lift))));
    const length = 0.035 + random() ** 2 * 0.12;
    const curl = norm(cross(dir, out));
    const base = positions.length / 3;
    let p = root;
    for (let segment = 0; segment <= 3; segment++) {
      positions.push(...p);
      const fade = 1 - segment / 3;
      colors.push(1, 0.97, 0.9, 0.1 + 0.32 * fade * open);
      uv0.push(here.s / course.total, 0);
      dir = norm(add(dir, scale(curl, (random() - 0.5) * 0.9)));
      p = add(p, scale(dir, length / 3));
    }
    indices.push(base, base + 1, base + 1, base + 2, base + 2, base + 3);
    placed++;
  }
  return { positions, colors, uv0, indices, placed };
}

/* ---------- Document ---------- */

async function build(name, variant, maps) {
  const courses = buildCourses(variant);
  const ao = occluders(courses);
  const random = rng(55);

  // centre the swatch on the origin
  const all = courses.flatMap((c) => c.plies.flatMap((p) => p.path.map((x) => x.c)));
  const lo = [0, 1, 2].map((i) => Math.min(...all.map((p) => p[i])));
  const hi = [0, 1, 2].map((i) => Math.max(...all.map((p) => p[i])));
  const centre = lo.map((v, i) => (v + hi[i]) / 2);

  const doc = new Document();
  const buffer = doc.createBuffer();
  doc.createExtension(KHRMeshQuantization);
  const sheen = doc.createExtension(KHRMaterialsSheen);
  const unlit = doc.createExtension(KHRMaterialsUnlit);
  const transform = doc.createExtension(KHRTextureTransform);

  const normalTex = doc.createTexture("Fibre normal").setImage(maps.normal).setMimeType("image/png");
  const ormTex = doc.createTexture("Fibre occlusion-roughness").setImage(maps.orm).setMimeType("image/png");
  // u runs 0..1 along each ply (so it quantises cleanly); repeat the fibre tile every FIBRE_TILE
  const plyLengths = courses.flatMap((c) =>
    c.plies.map((p) => p.path.reduce((sum, x, i) => (i ? sum + len(sub(x.c, p.path[i - 1].c)) : 0), 0)),
  );
  const repeats = plyLengths.reduce((a, b) => a + b, 0) / plyLengths.length / FIBRE_TILE;
  const tiling = (target) =>
    target.setExtension("KHR_texture_transform", transform.createTransform().setScale([repeats, 1]));

  // natural cotton, warm ivory (linear); vertex colours carry the baked occlusion and tint
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
    .setExtension("KHR_materials_sheen", sheen.createSheen().setSheenColorFactor([0.86, 0.8, 0.7]).setSheenRoughnessFactor(0.62));
  tiling(yarn.getNormalTextureInfo());
  tiling(yarn.getOcclusionTextureInfo());
  tiling(yarn.getMetallicRoughnessTextureInfo());

  const fuzzMat = doc
    .createMaterial("Cotton fuzz")
    .setBaseColorFactor([0.95, 0.84, 0.66, 1])
    .setAlphaMode("BLEND")
    .setExtension("KHR_materials_unlit", unlit.createUnlit());

  const root = doc.createNode("KnitLattice");
  doc.createScene("Single jersey swatch").addChild(root);
  const stats = { vertices: 0, triangles: 0, fibres: 0, aoMin: 1, aoSum: 0 };

  for (const course of courses) {
    const g = sweep(course, variant);
    const colors = [];
    for (let v = 0; v < g.positions.length / 3; v++) {
      const point = g.positions.slice(v * 3, v * 3 + 3);
      const normal = g.normals.slice(v * 3, v * 3 + 3);
      const ply = course.plies[g.tints[v]];
      const s = g.along[v];
      const open = ao(point, normal, { id: course.k * PLIES + g.tints[v], s });
      stats.aoMin = Math.min(stats.aoMin, open);
      stats.aoSum += open;
      const tone = ply.tint.l * course.courseTint * (1 + 0.025 * course.slub(s * 1.7)) * open;
      colors.push(tone * (1 + 0.01 * ply.tint.w), tone, tone * (1 - 0.015 * ply.tint.w));
    }
    for (let v = 0; v < g.positions.length; v++) g.positions[v] -= centre[v % 3];
    stats.vertices += g.positions.length / 3;
    stats.triangles += g.indices.length / 3;

    const accessor = (array, type, ctor = Float32Array) =>
      doc.createAccessor().setType(type).setArray(new ctor(array)).setBuffer(buffer);
    const surface = doc
      .createPrimitive()
      .setMode(Primitive.Mode.TRIANGLES)
      .setMaterial(yarn)
      .setIndices(accessor(g.indices, "SCALAR", Uint32Array))
      .setAttribute("POSITION", accessor(g.positions, "VEC3"))
      .setAttribute("NORMAL", accessor(g.normals, "VEC3"))
      .setAttribute("TEXCOORD_0", accessor(g.uv0, "VEC2"))
      .setAttribute("COLOR_0", accessor(colors, "VEC3"));

    const f = fuzz(course, variant, ao, random);
    for (let v = 0; v < f.positions.length; v++) f.positions[v] -= centre[v % 3];
    stats.fibres += f.placed;
    const filaments = doc
      .createPrimitive()
      .setMode(Primitive.Mode.LINES)
      .setMaterial(fuzzMat)
      .setIndices(accessor(f.indices, "SCALAR", Uint32Array))
      .setAttribute("POSITION", accessor(f.positions, "VEC3"))
      .setAttribute("COLOR_0", accessor(f.colors, "VEC4"))
      .setAttribute("TEXCOORD_0", accessor(f.uv0, "VEC2"));

    const mesh = doc.createMesh(`Course ${course.k + 1}`).addPrimitive(surface).addPrimitive(filaments);
    root.addChild(doc.createNode(`course-${course.k + 1}`).setMesh(mesh));
  }

  doc.getRoot().getAsset().generator = "ACTIF knit lattice v2 (scripts/build-knit-glb.mjs)";
  await MeshoptEncoder.ready;
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: "high" })); // quantise + reorder + filtered compression

  const io = new NodeIO().registerExtensions([
    EXTMeshoptCompression,
    KHRMaterialsSheen,
    KHRMaterialsUnlit,
    KHRMeshQuantization,
    KHRTextureTransform,
  ]).registerDependencies({ "meshopt.encoder": MeshoptEncoder });
  const glb = await io.writeBinary(doc);
  const out = resolve(ROOT, "public/models", variant.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, glb);
  console.log(
    `${name.padEnd(8)} ${variant.file}: ${stats.vertices} vertices, ${stats.triangles} triangles, ` +
      `${stats.fibres} fibres, AO min ${stats.aoMin.toFixed(2)} mean ${(stats.aoSum / stats.vertices).toFixed(2)}, ` +
      `${(glb.length / 1024).toFixed(0)} KB`,
  );
}

const maps = textures();
console.log(`textures: fibre normal ${(maps.normal.length / 1024).toFixed(0)} KB, occlusion-roughness ${(maps.orm.length / 1024).toFixed(0)} KB`);
for (const [name, variant] of Object.entries(VARIANTS)) await build(name, variant, maps);
