/**
 * Generates public/models/knit-lattice.glb: a swatch of weft-knitted single jersey, modelled at
 * yarn level. Each course is one continuous yarn, swept as a tube along a Catmull-Rom path of
 * omega-shaped loops. A loop's head sits behind the legs of the course above, so the courses
 * interlock the way they come off a circular knitting machine.
 *
 * No dependencies: geometry and the GLB container are written by hand.
 *   node scripts/build-knit-glb.mjs
 *
 * Indices run along the yarn ring by ring, so a renderer can "knit" a course by growing its draw
 * range. Each mesh records the index count of one ring in `extras.ringIndexCount`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/models/knit-lattice.glb");

const STITCHES = 6; // wales across
const COURSES = 5; // rows up
const WALE = 1; // stitch width
const PITCH = 0.9; // course spacing; less than the loop height, so loops overlap and interlock
const RADIUS = 0.092; // yarn radius
const PER_SPAN = 4; // samples between control points (8 spans per stitch)
const RADIAL = 8; // sides of the yarn tube
const PLY_PITCH = 0.34; // yarn length per turn of the ply twist (one texture tile)
const PLIES = 3;

// One stitch in local units, seen from the technical face: the sinker runs behind between
// wales, the two legs rise in front as a V (narrow where they pass through the loop below),
// and the head opens wider than the legs and tucks behind the course above, wrapping its legs.
// x across, y up, z towards the viewer.
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

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => scale(a, 1 / Math.hypot(a[0], a[1], a[2]));

/** Uniform Catmull-Rom through the control points, ends clamped. */
function sample(points) {
  const out = [];
  const at = (i) => points[Math.max(0, Math.min(points.length - 1, i))];
  for (let k = 0; k < points.length - 1; k++) {
    const [p0, p1, p2, p3] = [at(k - 1), at(k), at(k + 1), at(k + 2)];
    for (let s = 0; s < PER_SPAN; s++) {
      const u = s / PER_SPAN;
      const u2 = u * u;
      const u3 = u2 * u;
      out.push(
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
  out.push(points[points.length - 1]);
  return out;
}

/**
 * Sweep a tube along the path with parallel-transport frames (no twisting). Each ring has a
 * duplicated seam vertex so the twist texture wraps cleanly: u runs along the yarn in ply
 * turns, v around it.
 */
function tube(path) {
  const n = path.length;
  const ring = RADIAL + 1;
  const tangents = path.map((_, i) => norm(sub(path[Math.min(n - 1, i + 1)], path[Math.max(0, i - 1)])));
  let normal = norm(cross(tangents[0], Math.abs(tangents[0][2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
  const positions = [];
  const normals = [];
  const uvs = [];
  let length = 0;
  for (let i = 0; i < n; i++) {
    if (i > 0) length += Math.hypot(...sub(path[i], path[i - 1]));
    const t = tangents[i];
    normal = norm(sub(normal, scale(t, dot(normal, t))));
    const binormal = cross(t, normal);
    for (let j = 0; j < ring; j++) {
      const a = (j / RADIAL) * Math.PI * 2;
      const dir = add(scale(normal, Math.cos(a)), scale(binormal, Math.sin(a)));
      positions.push(...add(path[i], scale(dir, RADIUS)));
      normals.push(...dir);
      uvs.push(length / PLY_PITCH, j / RADIAL);
    }
  }
  const indices = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * ring + j;
      const b = (i + 1) * ring + j;
      const c = (i + 1) * ring + j + 1;
      const d = i * ring + j + 1;
      indices.push(a, d, b, b, d, c); // counter-clockwise seen from outside
    }
  }
  return { positions, normals, uvs, indices };
}

/**
 * A tiling tangent-space normal map of a plied yarn: PLIES rounded strands spiralling once per
 * tile, written as an RGB PNG.
 */
function plyNormalMap(size = 64) {
  const height = (x, y) => {
    const phase = (((x / size + (PLIES * y) / size) % 1) + 1) % 1; // position across one ply
    return Math.pow(Math.sin(Math.PI * ((phase * PLIES) % 1)), 0.7); // rounded strand, grooved edges
  };
  const strength = 1.4;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = [0]; // PNG filter: none
    for (let x = 0; x < size; x++) {
      const dx = height((x + 1) % size, y) - height((x - 1 + size) % size, y);
      const dy = height(x, (y + 1) % size) - height(x, (y - 1 + size) % size);
      const [nx, ny, nz] = norm([-dx * strength, -dy * strength, 1]);
      row.push(Math.round((nx * 0.5 + 0.5) * 255), Math.round((ny * 0.5 + 0.5) * 255), Math.round((nz * 0.5 + 0.5) * 255));
    }
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
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Build every course, then centre the swatch on the origin.
const courses = [];
for (let k = 0; k < COURSES; k++) {
  const points = [];
  for (let s = 0; s < STITCHES; s++) {
    for (const [x, y, z] of LOOP) points.push([x + s * WALE, y + k * PITCH, z]);
  }
  points.push([STITCHES * WALE, k * PITCH, LOOP[0][2]]);
  courses.push(tube(sample(points)));
}
const all = courses.flatMap((c) => c.positions);
const lo = [0, 1, 2].map((c) => Math.min(...all.filter((_, i) => i % 3 === c)));
const hi = [0, 1, 2].map((c) => Math.max(...all.filter((_, i) => i % 3 === c)));
const centre = [0, 1, 2].map((c) => (lo[c] + hi[c]) / 2);
for (const course of courses) {
  for (let i = 0; i < course.positions.length; i++) course.positions[i] -= centre[i % 3];
}

// ---------- GLB container ----------

const chunks = [];
let byteOffset = 0;
const bufferViews = [];
const accessors = [];

function addView(typed, target) {
  const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
  const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
  bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.length, ...(target ? { target } : {}) });
  chunks.push(padded);
  byteOffset += padded.length;
  return bufferViews.length - 1;
}

function addAccessor(view, componentType, count, type, extra = {}) {
  accessors.push({ bufferView: view, componentType, count, type, ...extra });
  return accessors.length - 1;
}

const meshes = courses.map((course, k) => {
  const pos = new Float32Array(course.positions);
  const min = [0, 1, 2].map((c) => Math.min(...course.positions.filter((_, i) => i % 3 === c)));
  const max = [0, 1, 2].map((c) => Math.max(...course.positions.filter((_, i) => i % 3 === c)));
  const POSITION = addAccessor(addView(pos, 34962), 5126, pos.length / 3, "VEC3", { min, max });
  const NORMAL = addAccessor(addView(new Float32Array(course.normals), 34962), 5126, pos.length / 3, "VEC3");
  const TEXCOORD_0 = addAccessor(addView(new Float32Array(course.uvs), 34962), 5126, pos.length / 3, "VEC2");
  const idx = new Uint16Array(course.indices);
  const indices = addAccessor(addView(idx, 34963), 5123, idx.length, "SCALAR");
  return {
    name: `Course ${k + 1}`,
    primitives: [{ attributes: { POSITION, NORMAL, TEXCOORD_0 }, indices, material: 0, mode: 4 }],
    extras: { ringIndexCount: RADIAL * 6 },
  };
});

const plyPng = plyNormalMap();
const plyView = addView(new Uint8Array(plyPng.buffer, plyPng.byteOffset, plyPng.byteLength));

// Oatmeal yarn (linear colour), matte with a soft fabric sheen and the ply twist as a normal map.
const gltf = {
  asset: { version: "2.0", generator: "ACTIF knit lattice (scripts/build-knit-glb.mjs)" },
  extensionsUsed: ["KHR_materials_sheen"],
  scene: 0,
  scenes: [{ name: "Single jersey swatch", nodes: [0] }],
  nodes: [
    { name: "KnitLattice", children: courses.map((_, k) => k + 1) },
    ...courses.map((_, k) => ({ name: `course-${k + 1}`, mesh: k })),
  ],
  meshes,
  materials: [
    {
      name: "Yarn",
      doubleSided: true,
      pbrMetallicRoughness: { baseColorFactor: [0.716, 0.604, 0.448, 1], metallicFactor: 0, roughnessFactor: 0.8 },
      normalTexture: { index: 0, scale: 0.65 },
      extensions: { KHR_materials_sheen: { sheenColorFactor: [0.9, 0.82, 0.7], sheenRoughnessFactor: 0.55 } },
    },
  ],
  images: [{ name: "Ply twist", bufferView: plyView, mimeType: "image/png" }],
  samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
  textures: [{ sampler: 0, source: 0 }],
  accessors,
  bufferViews,
  buffers: [{ byteLength: byteOffset }],
};

const json = Buffer.from(JSON.stringify(gltf));
const jsonChunk = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
const binChunk = Buffer.concat(chunks);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0); // "glTF"
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const chunkHead = (length, type) => {
  const b = Buffer.alloc(8);
  b.writeUInt32LE(length, 0);
  b.writeUInt32LE(type, 4);
  return b;
};
const glb = Buffer.concat([
  header,
  chunkHead(jsonChunk.length, 0x4e4f534a), // "JSON"
  jsonChunk,
  chunkHead(binChunk.length, 0x004e4942), // "BIN\0"
  binChunk,
]);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, glb);
const verts = courses.reduce((n, c) => n + c.positions.length / 3, 0);
const tris = courses.reduce((n, c) => n + c.indices.length / 3, 0);
console.log(`knit-lattice.glb: ${COURSES} courses x ${STITCHES} stitches, ${verts} vertices, ${tris} triangles, ${(glb.length / 1024).toFixed(0)} KB`);
