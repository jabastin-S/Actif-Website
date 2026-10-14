/**
 * The rendered cloth's data: a dense grid of texture coordinates, and the simulation's particles
 * packed for the GPU (xyz: position; w: fold curvature). The vertex shader (cloth-shader.ts)
 * places each vertex of the grid on the cloth by Catmull-Rom interpolation of the particles, so
 * each vertex keeps a fixed texture coordinate: the knit is attached to the cloth, folds and moves
 * with it, and never slides across it.
 *
 * Allocation-free per update.
 */
export class ClothSurface {
  readonly cols: number;
  readonly rows: number;
  /** the rest (flat) grid: three.js needs a position attribute; the shader replaces it */
  readonly positions: Float32Array;
  readonly uvs: Float32Array;
  readonly indices: Uint16Array | Uint32Array;
  /** one RGBA float texel per particle */
  readonly particles: Float32Array;
  private readonly simCols: number;
  private readonly simRows: number;

  constructor(
    simCols: number,
    simRows: number,
    cols: number,
    rows: number,
    width: number,
    height: number,
  ) {
    this.simCols = simCols;
    this.simRows = simRows;
    this.cols = cols;
    this.rows = rows;
    const count = cols * rows;
    this.positions = new Float32Array(count * 3);
    this.uvs = new Float32Array(count * 2);
    this.particles = new Float32Array(simCols * simRows * 4);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const v = j * cols + i;
        this.uvs[v * 2] = i / (cols - 1);
        this.uvs[v * 2 + 1] = j / (rows - 1); // glTF convention: v = 0 at the top
        this.positions[v * 3] = (i / (cols - 1) - 0.5) * width;
        this.positions[v * 3 + 1] = (0.5 - j / (rows - 1)) * height;
      }
    }
    const indices =
      count > 65535
        ? new Uint32Array((cols - 1) * (rows - 1) * 6)
        : new Uint16Array((cols - 1) * (rows - 1) * 6);
    let n = 0;
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = j * cols + i;
        indices[n++] = a;
        indices[n++] = a + cols;
        indices[n++] = a + 1;
        indices[n++] = a + 1;
        indices[n++] = a + cols;
        indices[n++] = a + cols + 1;
      }
    }
    this.indices = indices;
  }

  /**
   * Pack the particles: position, and the curvature across the cloth at each particle (positive
   * in the valley of a fold, seen from the front), which darkens the valleys a little.
   */
  update(pos: Float32Array) {
    const { simCols: cols, simRows: rows, particles: out } = this;
    for (let r = 0; r < rows; r++) {
      const up = Math.max(0, r - 1) * cols;
      const down = Math.min(rows - 1, r + 1) * cols;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const o = i * 3;
        const left = (r * cols + Math.max(0, c - 1)) * 3;
        const right = (r * cols + Math.min(cols - 1, c + 1)) * 3;
        const top = (up + c) * 3;
        const bottom = (down + c) * 3;
        const ux = pos[right]! - pos[left]!;
        const uy = pos[right + 1]! - pos[left + 1]!;
        const uz = pos[right + 2]! - pos[left + 2]!;
        const vx = pos[bottom]! - pos[top]!;
        const vy = pos[bottom + 1]! - pos[top + 1]!;
        const vz = pos[bottom + 2]! - pos[top + 2]!;
        // v x u faces the front of the cloth
        const nx = vy * uz - vz * uy;
        const ny = vz * ux - vx * uz;
        const nz = vx * uy - vy * ux;
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        // discrete Laplacian along the normal: about (curvature across + down) x spacing² / 4
        const lx =
          (pos[left]! + pos[right]! + pos[top]! + pos[bottom]!) / 4 - pos[o]!;
        const ly =
          (pos[left + 1]! +
            pos[right + 1]! +
            pos[top + 1]! +
            pos[bottom + 1]!) /
            4 -
          pos[o + 1]!;
        const lz =
          (pos[left + 2]! +
            pos[right + 2]! +
            pos[top + 2]! +
            pos[bottom + 2]!) /
            4 -
          pos[o + 2]!;
        // (at an edge one of the differences spans a single spacing: take the longer)
        const spacing2 =
          Math.max(ux * ux + uy * uy + uz * uz, vx * vx + vy * vy + vz * vz) /
          4;
        const t = i * 4;
        out[t] = pos[o]!;
        out[t + 1] = pos[o + 1]!;
        out[t + 2] = pos[o + 2]!;
        out[t + 3] =
          ((lx * nx + ly * ny + lz * nz) / length) * (4 / (spacing2 || 1));
      }
    }
  }
}
