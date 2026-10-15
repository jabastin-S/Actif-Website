/**
 * Position-based cloth (Müller et al., "Position Based Dynamics", 2007): a grid of particles
 * joined by structural, shear and bending distance constraints, integrated with Verlet under
 * gravity, air drag and a slow draught, and solved Gauss-Seidel (direction alternating each
 * pass, so no side of the cloth is favoured). Long-range attachments (Kim et al., 2012) keep each
 * particle within its rest distance of the pins it hangs from, so the knit never stretches under
 * its own weight or a pull.
 *
 * The cloth hangs from pins along its top edge, set closer together than the cloth is long
 * between them, so the slack falls into soft folds, as fabric does when clipped to a line.
 *
 * Framework-free and allocation-free per step: all state is in typed arrays.
 */

export interface ClothConfig {
  /** rest size of the cloth (world units) */
  width: number;
  height: number;
  /** particle spacing (world units); the grid is fitted to the cloth */
  spacing: number;
  /** cloth length between neighbouring pins, as a range (world units) */
  pinGap: [number, number];
  /** pinned distance / cloth length between pins, as a range: below 1 the slack falls into folds */
  gather: [number, number];
  /** pins sit up to this much lower than the top edge (world units), so the folds run unevenly */
  pinDrop: number;
  iterations: number;
  substeps: number;
  seed?: number;
}

/**
 * How the cloth hangs. Shared by the asset build, which settles it and stores the drape at rest in
 * the model (scripts/build-knit-glb.mjs), and the page, which starts from that drape.
 */
export const DRAPE = {
  width: 15,
  height: 10,
  pinGap: [3.2, 4.6] as [number, number],
  gather: [0.62, 0.74] as [number, number],
  pinDrop: 0.6,
  seed: 11,
};

/** Solver resolution: full, and lite for small or low-power devices. */
export const PROFILES = {
  full: { spacing: 0.3, iterations: 3, substeps: 2 },
  lite: { spacing: 0.42, iterations: 3, substeps: 2 },
};

/** Settling from the initial layout: heavy air drag first, then lighter, so the drape comes fully to rest. */
const SETTLE: [retain: number, steps: number][] = [
  [0.002, 150],
  [0.05, 300],
  [0.3, 150],
];

/** Settle the cloth step by step (a generator, so a page can spread the work over frames). */
export function* settle(sim: ClothSim) {
  for (const [retain, steps] of SETTLE) {
    sim.retain = retain;
    for (let i = 0; i < steps; i++) {
      sim.step(1 / 60);
      yield;
    }
  }
  sim.retain = 0.3;
}

const GRAVITY = 70; // units/s²: the cloth is ~10 units tall; a little slower than life reads as soft
const STRUCTURAL = 1;
const SHEAR = 0.5;
const BENDING = 0.06; // cotton jersey folds easily
const MAX_SPEED = 14; // units/s, a guard against runaway after a hard fling
const AIR_FORCE = 2.4; // units/s² at full draught: the hem drifts by about a tenth of a unit
const STRETCH = 1.02; // strain limit: no thread of the knit stretches more than 2%

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class ClothSim {
  readonly cols: number;
  readonly rows: number;
  readonly count: number;
  /** current positions, xyz per particle, row-major from the top-left corner */
  readonly pos: Float32Array;
  private readonly prev: Float32Array;
  private readonly settled: Float32Array;
  private readonly frameStart: Float32Array;
  /** an eased return to the settled drape: the shape it starts from, and its progress (s) */
  private readonly returnFrom: Float32Array;
  private returnTime = -1;
  private returnDuration = 1;
  private returnDrift = 0;
  /** how much the cloth moved in the last step: mean squared speed (units²/s²) */
  moved = 0;
  /** how far the cloth is from its settled drape: mean squared distance (units²) */
  drift = 0;
  private readonly invMass: Float32Array;
  /** constraints: offsets of both particles (index x 3), rest length, and each end's share of the correction */
  private readonly ia: Uint32Array;
  private readonly ib: Uint32Array;
  private readonly rest: Float32Array;
  private readonly stiff: Float32Array;
  /** the structural (weft and warp) constraints, for strain limiting */
  private readonly structural: Uint32Array;
  private readonly ca: Float32Array;
  private readonly cb: Float32Array;
  /** long-range attachments: two pins per particle and the rest distance to each */
  private readonly anchor: Int32Array;
  private readonly anchorRest: Float32Array;
  private readonly jitter: Float32Array;
  private readonly cfg: ClothConfig;
  /** the draught, per particle, refreshed each step; built from per-column and per-row terms */
  private readonly wind: Float32Array;
  private readonly windColumns: Float32Array;
  private readonly windRows: Float32Array;
  private time = 0;
  private pass = 0;

  /** velocity kept per second (air drag): lower settles faster */
  retain = 0.3;
  /**
   * How fast (per second) the cloth drifts back to its settled drape: real folds have several
   * stable arrangements, so after a pull they can come to rest somewhere else; this slow creep
   * (moving each particle and its previous position together, so it adds no speed) restores the
   * composition. The scene turns it on only once the pointer has left the cloth alone.
   */
  recover = 0;
  /** strength of the idle draught, 0..1 (0: still air) */
  air = 0;
  /**
   * The pointer as a soft pressure on the cloth: particles near its ray are pressed along the
   * ray (press, units/s²) and carried a little with its movement (wake, per second).
   */
  readonly pointer = {
    ox: 0,
    oy: 0,
    oz: 0,
    dx: 0,
    dy: 0,
    dz: -1,
    vx: 0,
    vy: 0,
    vz: 0,
    radius: 0.9,
    press: 0,
    wake: 0,
  };
  /** particle held by a drag, -1 when none */
  grabbed = -1;
  private readonly grabStart = new Float32Array(3);
  private readonly grabTarget = new Float32Array(3);
  /** last raycast hit: point, ray distance and the nearest particle */
  readonly hit = { x: 0, y: 0, z: 0, t: 0, particle: -1 };

  constructor(cfg: ClothConfig) {
    this.cfg = cfg;
    const { width, height, spacing } = cfg;
    const cols = Math.round(width / spacing) + 1;
    const rows = Math.round(height / spacing) + 1;
    this.cols = cols;
    this.rows = rows;
    this.count = cols * rows;
    this.pos = new Float32Array(this.count * 3);
    this.prev = new Float32Array(this.count * 3);
    this.settled = new Float32Array(this.count * 3);
    this.frameStart = new Float32Array(this.count * 3);
    this.returnFrom = new Float32Array(this.count * 3);
    this.invMass = new Float32Array(this.count).fill(1);
    this.anchor = new Int32Array(this.count * 2);
    this.anchorRest = new Float32Array(this.count * 2);
    this.wind = new Float32Array(this.count);
    this.windColumns = new Float32Array(cols * 6);
    this.windRows = new Float32Array(rows * 5);
    // the layout draws from its own sequence, so it is the same at every resolution
    const random = rng(cfg.seed ?? 11);
    const noise = rng((cfg.seed ?? 11) + 1);
    this.jitter = new Float32Array(this.count).map(() => noise());
    const dx = width / (cols - 1);
    const dy = height / (rows - 1);
    const between = (range: [number, number]) =>
      range[0] + (range[1] - range[0]) * random();

    // pins along the top edge at uneven gaps and heights, so the folds differ as real ones do
    const pinCols = [0];
    while (pinCols[pinCols.length - 1]! < cols - 1) {
      const last = pinCols[pinCols.length - 1]!;
      let next = Math.min(
        cols - 1,
        last + Math.max(2, Math.round(between(cfg.pinGap) / dx)),
      );
      if (cols - 1 - next < (cfg.pinGap[0] / dx) * 0.6) next = cols - 1;
      pinCols.push(next);
    }
    const pinX = [0];
    const pinY = pinCols.map(() => height / 2 - random() * cfg.pinDrop);
    for (let k = 1; k < pinCols.length; k++) {
      pinX.push(
        pinX[k - 1]! +
          (pinCols[k]! - pinCols[k - 1]!) * dx * between(cfg.gather),
      );
    }
    const centre = pinX[pinX.length - 1]! / 2;

    // start near the hanging shape: each gap between pins bowed alternately out and in
    for (let k = 0; k < pinCols.length - 1; k++) {
      const c0 = pinCols[k]!;
      const c1 = pinCols[k + 1]!;
      const chord = pinX[k + 1]! - pinX[k]!;
      const slack = Math.max(0, ((c1 - c0) * dx) / chord - 1);
      const bow =
        (k % 2 ? 1 : -1) *
        Math.min(0.5, (chord / Math.PI) * 2 * Math.sqrt(slack)) *
        (0.7 + 0.3 * random());
      for (let c = c0; c <= c1; c++) {
        const t = (c - c0) / (c1 - c0);
        for (let r = 0; r < rows; r++) {
          const i = r * cols + c;
          const o = i * 3;
          this.pos[o] = pinX[k]! + chord * t - centre;
          this.pos[o + 1] = pinY[k]! + (pinY[k + 1]! - pinY[k]!) * t - r * dy;
          this.pos[o + 2] =
            bow * Math.sin(Math.PI * t) * (1 - 0.4 * (r / rows));
          // long-range attachments to the two pins this particle hangs between
          this.anchor[i * 2] = c0;
          this.anchor[i * 2 + 1] = c1;
          this.anchorRest[i * 2] = Math.hypot((c - c0) * dx, r * dy);
          this.anchorRest[i * 2 + 1] = Math.hypot((c1 - c) * dx, r * dy);
        }
      }
    }
    for (const c of pinCols) {
      this.invMass[c] = 0;
      this.pos[c * 3 + 2] = 0;
    }
    this.prev.set(this.pos);
    this.settled.set(this.pos);

    // the draught's spatial terms over the cloth's rest coordinates (see `blow`)
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1) - 0.5) * width;
      this.windColumns.set(
        [
          Math.sin(0.33 * x),
          Math.cos(0.33 * x),
          Math.sin(0.23 * x),
          Math.cos(0.23 * x),
          Math.sin(0.13 * x),
          Math.cos(0.13 * x),
        ],
        c * 6,
      );
    }

    const ia: number[] = [];
    const ib: number[] = [];
    const rest: number[] = [];
    const stiff: number[] = [];
    const link = (a: number, b: number, length: number, k: number) => {
      ia.push(a * 3);
      ib.push(b * 3);
      rest.push(length);
      stiff.push(k);
    };
    const diagonal = Math.hypot(dx, dy);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (c + 1 < cols) link(i, i + 1, dx, STRUCTURAL);
        if (r + 1 < rows) link(i, i + cols, dy, STRUCTURAL);
        if (c + 1 < cols && r + 1 < rows) {
          link(i, i + cols + 1, diagonal, SHEAR);
          link(i + 1, i + cols, diagonal, SHEAR);
        }
        if (c + 2 < cols) link(i, i + 2, dx * 2, BENDING);
        if (r + 2 < rows) link(i, i + cols * 2, dy * 2, BENDING);
      }
    }
    this.ia = Uint32Array.from(ia);
    this.ib = Uint32Array.from(ib);
    this.rest = Float32Array.from(rest);
    this.stiff = Float32Array.from(stiff);
    this.structural = Uint32Array.from(
      stiff.flatMap((k, index) => (k === STRUCTURAL ? [index] : [])),
    );
    this.ca = new Float32Array(rest.length);
    this.cb = new Float32Array(rest.length);
    this.share();
  }

  /** Each constraint end's share of a correction, from the particles' inverse masses. */
  private share() {
    const { ia, ib, invMass, stiff, ca, cb } = this;
    for (let k = 0; k < stiff.length; k++) {
      const wa = invMass[ia[k]! / 3]!;
      const wb = invMass[ib[k]! / 3]!;
      const w = wa + wb;
      ca[k] = w ? (stiff[k]! * wa) / w : 0;
      cb[k] = w ? (stiff[k]! * wb) / w : 0;
    }
  }

  /** Advance by dt seconds (one rendered frame). */
  step(dt: number) {
    const { substeps, iterations } = this.cfg;
    const h = Math.min(dt, 1 / 30) / substeps;
    this.frameStart.set(this.pos);
    if (this.returnTime >= 0) {
      this.ease(dt);
      return;
    }
    if (this.air) this.blow();
    if (this.recover > 0) this.creep(this.recover * Math.min(dt, 1 / 30));
    for (let s = 0; s < substeps; s++) {
      this.time += h;
      this.pass = 0; // every substep sweeps the same way, so the cloth can come fully to rest
      this.integrate(h);
      for (let k = 0; k < iterations; k++) this.solve();
      this.limit();
      if (this.grabbed >= 0) this.limit(); // a held point pulls hardest on its neighbours
      this.attach();
    }
    // how far it actually moved (the solver's own corrections cancel out at rest), and a guard:
    // if anything went non-finite, return to the settled drape
    let sum = 0;
    for (let o = 0; o < this.pos.length; o++) {
      const d = this.pos[o]! - this.frameStart[o]!;
      sum += d * d;
    }
    this.moved = sum / this.count / (h * substeps) ** 2;
    let away = 0;
    for (let o = 0; o < this.pos.length; o++) {
      const d = this.pos[o]! - this.settled[o]!;
      away += d * d;
    }
    this.drift = away / this.count;
    if (!Number.isFinite(sum)) this.reset();
  }

  /**
   * The draught: slow travelling fields at incommensurate rates under a gust envelope, so it
   * never visibly repeats. Each term sin(ax + by + ct) is split into column and row factors
   * (sin(ax)cos(by + ct) + cos(ax)sin(by + ct)), so a frame costs a few sines per row, not per
   * particle. Weaker near the pinned top, where the cloth is held.
   */
  private blow() {
    const { rows, cols, wind, windColumns: wc, windRows: wr, time: t } = this;
    const { height } = this.cfg;
    const gust =
      (0.6 + 0.4 * Math.sin(0.071 * t + 0.6) * Math.sin(0.043 * t + 1.9)) *
      this.air *
      AIR_FORCE;
    const ct = Math.cos(-0.47 * t + 2.2);
    const st = Math.sin(-0.47 * t + 2.2);
    for (let r = 0; r < rows; r++) {
      const y = height / 2 - (r / (rows - 1)) * height;
      // none at the gathered top (where a push can snap a fold through), rising down the cloth
      const freedom = Math.min(1, r / (rows * 0.75)) ** 2 * gust;
      const a = 0.21 * y + 0.62 * t + 1.3;
      const envelope = 0.5 * Math.sin(0.17 * y - 0.29 * t + 0.4) * freedom;
      const b = -0.31 * y + 0.41 * t + 4.1;
      wr[r * 5] = Math.cos(a) * envelope;
      wr[r * 5 + 1] = Math.sin(a) * envelope;
      wr[r * 5 + 2] = 0.3 * Math.cos(b) * freedom;
      wr[r * 5 + 3] = 0.3 * Math.sin(b) * freedom;
      wr[r * 5 + 4] = 0.2 * Math.sin(0.57 * y + 0.37 * t) * freedom;
    }
    for (let r = 0; r < rows; r++) {
      const R = r * 5;
      for (let c = 0; c < cols; c++) {
        const C = c * 6;
        wind[r * cols + c] =
          wc[C]! * wr[R]! +
          wc[C + 1]! * wr[R + 1]! +
          wc[C + 2]! * wr[R + 2]! +
          wc[C + 3]! * wr[R + 3]! +
          wr[R + 4]! * (wc[C + 5]! * ct - wc[C + 4]! * st);
      }
    }
  }

  private integrate(h: number) {
    const { pos, prev, invMass, wind, pointer: p } = this;
    const h2 = h * h;
    const keep = Math.pow(this.retain, h);
    const air = this.air > 0;
    const maxStep = MAX_SPEED * h;
    const r2 = p.radius * p.radius;
    const pointing = p.press > 0 || p.wake > 0;
    for (let i = 0; i < this.count; i++) {
      if (invMass[i] === 0) continue;
      const o = i * 3;
      const x = pos[o]!;
      const y = pos[o + 1]!;
      const z = pos[o + 2]!;
      let vx = (x - prev[o]!) * keep;
      let vy = (y - prev[o + 1]!) * keep;
      let vz = (z - prev[o + 2]!) * keep;
      const speed2 = vx * vx + vy * vy + vz * vz;
      if (speed2 > maxStep * maxStep) {
        const s = maxStep / Math.sqrt(speed2);
        vx *= s;
        vy *= s;
        vz *= s;
      }
      prev[o] = x;
      prev[o + 1] = y;
      prev[o + 2] = z;
      let ax = 0;
      let ay = -GRAVITY;
      let az = 0;
      if (air) {
        az += wind[i]!;
        ax += wind[i]! * 0.25;
      }
      if (pointing) {
        // distance from the particle to the pointer's ray
        const rx = x - p.ox;
        const ry = y - p.oy;
        const rz = z - p.oz;
        const along = rx * p.dx + ry * p.dy + rz * p.dz;
        const qx = rx - along * p.dx;
        const qy = ry - along * p.dy;
        const qz = rz - along * p.dz;
        const d2 = qx * qx + qy * qy + qz * qz;
        if (along > 0 && d2 < r2) {
          const f = (1 - d2 / r2) ** 2;
          ax += (p.dx * p.press + p.vx * p.wake) * f;
          ay += (p.dy * p.press + p.vy * p.wake) * f;
          az += (p.dz * p.press + p.vz * p.wake) * f;
        }
      }
      pos[o] = x + vx + ax * h2;
      pos[o + 1] = y + vy + ay * h2;
      pos[o + 2] = z + vz + az * h2;
    }
    if (this.grabbed >= 0) {
      // the held particle follows the pointer; its last movement becomes its speed on release
      const o = this.grabbed * 3;
      prev[o] = pos[o]!;
      prev[o + 1] = pos[o + 1]!;
      prev[o + 2] = pos[o + 2]!;
      pos[o] = this.grabTarget[0]!;
      pos[o + 1] = this.grabTarget[1]!;
      pos[o + 2] = this.grabTarget[2]!;
    }
  }

  private solve() {
    const { pos, ia, ib, rest, ca, cb } = this;
    const n = rest.length;
    const forward = (this.pass++ & 1) === 0;
    for (let q = 0; q < n; q++) {
      const k = forward ? q : n - 1 - q;
      const oa = ia[k]!;
      const ob = ib[k]!;
      const dx = pos[ob]! - pos[oa]!;
      const dy = pos[ob + 1]! - pos[oa + 1]!;
      const dz = pos[ob + 2]! - pos[oa + 2]!;
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (length < 1e-6) continue;
      const s = (length - rest[k]!) / length;
      const sa = s * ca[k]!;
      const sb = s * cb[k]!;
      pos[oa] = pos[oa]! + dx * sa;
      pos[oa + 1] = pos[oa + 1]! + dy * sa;
      pos[oa + 2] = pos[oa + 2]! + dz * sa;
      pos[ob] = pos[ob]! - dx * sb;
      pos[ob + 1] = pos[ob + 1]! - dy * sb;
      pos[ob + 2] = pos[ob + 2]! - dz * sb;
    }
  }

  /** Move towards the settled drape by `amount` (rate x time), held hardest near the pins. */
  private creep(amount: number) {
    const { pos, prev, settled, invMass, rows, cols } = this;
    for (let r = 0; r < rows; r++) {
      // near the pins, where the gathered folds could otherwise snap into another arrangement,
      // the cloth is held four times as firmly; the lower cloth is free to move
      const near = Math.max(0, 1 - r / (rows * 0.45));
      const k = 1 - Math.exp(-amount * (1 + 3 * near * near));
      for (let i = r * cols; i < (r + 1) * cols; i++) {
        if (invMass[i] === 0) continue;
        for (let o = i * 3; o < i * 3 + 3; o++) {
          const d = (settled[o]! - pos[o]!) * k;
          pos[o] = pos[o]! + d;
          prev[o] = prev[o]! + d;
        }
      }
    }
  }

  /** Strain limiting: the solver's few passes leave some give; no structural link may stretch past the limit. */
  private limit() {
    const { pos, ia, ib, rest, ca, cb, structural } = this;
    for (let q = 0; q < structural.length; q++) {
      const k = structural[q]!;
      const oa = ia[k]!;
      const ob = ib[k]!;
      const dx = pos[ob]! - pos[oa]!;
      const dy = pos[ob + 1]! - pos[oa + 1]!;
      const dz = pos[ob + 2]! - pos[oa + 2]!;
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const most = rest[k]! * STRETCH;
      if (length <= most) continue;
      const s = (length - most) / length;
      const sa = s * ca[k]!;
      const sb = s * cb[k]!;
      pos[oa] = pos[oa]! + dx * sa;
      pos[oa + 1] = pos[oa + 1]! + dy * sa;
      pos[oa + 2] = pos[oa + 2]! + dz * sa;
      pos[ob] = pos[ob]! - dx * sb;
      pos[ob + 1] = pos[ob + 1]! - dy * sb;
      pos[ob + 2] = pos[ob + 2]! - dz * sb;
    }
  }

  /** Long-range attachments: no particle may hang further from its pins than the cloth allows. */
  private attach() {
    const { pos, invMass, anchor, anchorRest } = this;
    for (let i = 0; i < this.count; i++) {
      if (invMass[i] === 0) continue;
      const o = i * 3;
      for (let k = 0; k < 2; k++) {
        const pin = anchor[i * 2 + k]! * 3;
        const dx = pos[o]! - pos[pin]!;
        const dy = pos[o + 1]! - pos[pin + 1]!;
        const dz = pos[o + 2]! - pos[pin + 2]!;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const limit = anchorRest[i * 2 + k]!;
        if (d <= limit) continue;
        const s = limit / d;
        pos[o] = pos[pin]! + dx * s;
        pos[o + 1] = pos[pin + 1]! + dy * s;
        pos[o + 2] = pos[pin + 2]! + dz * s;
      }
    }
  }

  /**
   * A tap: particles near the point gain velocity along the direction given, unevenly (each by
   * its own random share), so the disturbance spreads through the cloth irregularly rather than
   * as a clean ring. `strength` is the peak speed given (units/s).
   */
  impulse(
    x: number,
    y: number,
    z: number,
    dx: number,
    dy: number,
    dz: number,
    radius: number,
    strength: number,
  ) {
    this.cancelReturn();
    const { pos, prev, invMass, jitter } = this;
    const h = 1 / 60 / this.cfg.substeps;
    for (let i = 0; i < this.count; i++) {
      if (invMass[i] === 0) continue;
      const o = i * 3;
      const d = Math.hypot(pos[o]! - x, pos[o + 1]! - y, pos[o + 2]! - z);
      if (d >= radius) continue;
      const share =
        (1 - d / radius) ** 2 * (0.45 + 0.55 * jitter[i]!) * strength * h;
      prev[o] = prev[o]! - dx * share;
      prev[o + 1] = prev[o + 1]! - dy * share;
      prev[o + 2] = prev[o + 2]! - dz * share;
    }
  }

  /**
   * Ease back to the settled drape over `seconds`. A pull can flip a fold into its mirror-image
   * buckle, a second resting shape the solver holds on to; a gradual pull never crosses the
   * midpoint between the two, so after a disturbance the cloth is eased back as one (no added
   * speed), as fabric relaxes into the folds it hangs in. Any touch cancels it.
   */
  returnToDrape(seconds: number) {
    this.returnFrom.set(this.pos);
    this.returnTime = 0;
    this.returnDuration = seconds;
    this.returnDrift = this.drift;
  }

  get returning() {
    return this.returnTime >= 0;
  }

  cancelReturn() {
    if (this.returnTime < 0) return;
    this.returnTime = -1;
    this.prev.set(this.pos);
  }

  private ease(dt: number) {
    this.returnTime += Math.min(dt, 1 / 30);
    const t = Math.min(1, this.returnTime / this.returnDuration);
    const e = t * t * (3 - 2 * t);
    const { pos, prev, settled, returnFrom: from } = this;
    for (let o = 0; o < pos.length; o++) {
      pos[o] = from[o]! + (settled[o]! - from[o]!) * e;
      prev[o] = pos[o]!;
    }
    let moved = 0;
    for (let o = 0; o < pos.length; o++) {
      const d = pos[o]! - this.frameStart[o]!;
      moved += d * d;
    }
    this.moved = moved / this.count / Math.min(dt, 1 / 30) ** 2;
    this.drift = this.returnDrift * (1 - e) ** 2;
    if (t >= 1) {
      this.returnTime = -1;
      this.drift = 0;
    }
  }

  /** Hold a particle; `drag` then moves it. */
  grab(i: number) {
    this.cancelReturn();
    if (this.invMass[i] === 0) return;
    this.grabbed = i;
    this.invMass[i] = 0;
    this.share();
    this.grabStart.set(this.pos.subarray(i * 3, i * 3 + 3));
    this.grabTarget.set(this.grabStart);
  }

  /** Move the held particle towards a point: at most `reach` from where it was taken, and never so far that the cloth would stretch. */
  drag(x: number, y: number, z: number, reach: number) {
    const i = this.grabbed;
    if (i < 0) return;
    const start = this.grabStart;
    const target = this.grabTarget;
    let dx = x - start[0]!;
    let dy = y - start[1]!;
    let dz = z - start[2]!;
    const d = Math.hypot(dx, dy, dz);
    if (d > reach) {
      dx *= reach / d;
      dy *= reach / d;
      dz *= reach / d;
    }
    target[0] = start[0]! + dx;
    target[1] = start[1]! + dy;
    target[2] = start[2]! + dz;
    for (let k = 0; k < 2; k++) {
      const pin = this.anchor[i * 2 + k]! * 3;
      const ax: number = target[0]! - this.pos[pin]!;
      const ay: number = target[1]! - this.pos[pin + 1]!;
      const az: number = target[2]! - this.pos[pin + 2]!;
      const length = Math.hypot(ax, ay, az);
      const limit = this.anchorRest[i * 2 + k]!;
      if (length <= limit) continue;
      target[0] = this.pos[pin]! + (ax * limit) / length;
      target[1] = this.pos[pin + 1]! + (ay * limit) / length;
      target[2] = this.pos[pin + 2]! + (az * limit) / length;
    }
  }

  release() {
    if (this.grabbed < 0) return;
    this.invMass[this.grabbed] = 1;
    this.grabbed = -1;
    this.share();
  }

  /** Mean squared speed (units²/s²): near zero once the cloth has come to rest. */
  energy() {
    const { pos, prev } = this;
    const perSecond = 60 * this.cfg.substeps;
    let sum = 0;
    for (let o = 0; o < this.count * 3; o++) {
      const v = pos[o]! - prev[o]!;
      sum += v * v;
    }
    return (sum / this.count) * perSecond * perSecond;
  }

  /** Start from a given drape (positions of every particle, pins included) and keep it as the settled one. */
  place(positions: ArrayLike<number>) {
    this.pos.set(positions);
    this.prev.set(positions);
    this.settled.set(positions);
  }

  /** Keep the current shape as the settled drape (the state `reset` returns to). */
  snapshot() {
    this.settled.set(this.pos);
  }

  reset() {
    this.release();
    this.pos.set(this.settled);
    this.prev.set(this.settled);
  }

  /** First hit of a ray on the cloth (its particle grid as triangles), written to `hit`. */
  raycast(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
  ): boolean {
    const { cols, rows } = this;
    let best = Infinity;
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = r * cols + c;
        best = this.triangle(a, a + cols, a + 1, ox, oy, oz, dx, dy, dz, best);
        best = this.triangle(
          a + 1,
          a + cols,
          a + cols + 1,
          ox,
          oy,
          oz,
          dx,
          dy,
          dz,
          best,
        );
      }
    }
    return best < Infinity;
  }

  /** Möller-Trumbore, both faces; records the hit when nearer than `best`. */
  private triangle(
    a: number,
    b: number,
    c: number,
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    best: number,
  ): number {
    const p = this.pos;
    const ax = p[a * 3]!;
    const ay = p[a * 3 + 1]!;
    const az = p[a * 3 + 2]!;
    const e1x = p[b * 3]! - ax;
    const e1y = p[b * 3 + 1]! - ay;
    const e1z = p[b * 3 + 2]! - az;
    const e2x = p[c * 3]! - ax;
    const e2y = p[c * 3 + 1]! - ay;
    const e2z = p[c * 3 + 2]! - az;
    const px = dy * e2z - dz * e2y;
    const py = dz * e2x - dx * e2z;
    const pz = dx * e2y - dy * e2x;
    const det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-9) return best;
    const inv = 1 / det;
    const tx = ox - ax;
    const ty = oy - ay;
    const tz = oz - az;
    const u = (tx * px + ty * py + tz * pz) * inv;
    if (u < 0 || u > 1) return best;
    const qx = ty * e1z - tz * e1y;
    const qy = tz * e1x - tx * e1z;
    const qz = tx * e1y - ty * e1x;
    const v = (dx * qx + dy * qy + dz * qz) * inv;
    if (v < 0 || u + v > 1) return best;
    const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
    if (t <= 0 || t >= best) return best;
    const hit = this.hit;
    hit.t = t;
    hit.x = ox + dx * t;
    hit.y = oy + dy * t;
    hit.z = oz + dz * t;
    // the nearest free corner of the triangle
    const w = 1 - u - v;
    let first: number;
    let second: number;
    if (w >= u && w >= v) {
      first = a;
      second = u >= v ? b : c;
    } else if (u >= v) {
      first = b;
      second = w >= v ? a : c;
    } else {
      first = c;
      second = w >= u ? a : b;
    }
    hit.particle =
      this.invMass[first] === 0 && this.grabbed !== first ? second : first;
    return t;
  }
}
