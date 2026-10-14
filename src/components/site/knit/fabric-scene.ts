import type * as ThreeModule from "three";
import { ClothSim, DRAPE, PROFILES, settle } from "./cloth-sim";
import { drawAsCloth, type ClothUniforms } from "./cloth-shader";
import { ClothSurface } from "./cloth-surface";

export interface FabricScene {
  /** Scroll progress through the section, 0 (plate entering) to 1 (plate leaving). */
  setScroll(progress: number): void;
  /** Close-up of the stitches, following the cloth as it moves. */
  setInspect(on: boolean): void;
  /** The idle draught on or off (the cloth still answers the pointer). */
  setPlaying(on: boolean): void;
  dispose(): void;
}

interface Options {
  /** Element the canvas is appended to. */
  host: HTMLElement;
  /** The plate: pointer input is read from it. */
  frame: HTMLElement;
  lite: boolean;
  /** Read live, so a change of preference applies without a reload. */
  motionOk: () => boolean;
  modelUrl: string;
}

/* ---------- Composition ---------- */

// the camera stands a little left of and above the cloth, so the folds read in depth and the key
// light, from further left, rakes across them
const VIEW = {
  azimuth: -0.3,
  elevation: 0.1,
  target: [0, -2.1, 0] as [number, number, number],
  height: 7.6,
};
const INSPECT = {
  distance: 0.24,
  at: [0.56, 0.6] as const,
  azimuth: -0.18,
  elevation: 0.04,
};

/* ---------- Simulation ---------- */

const RENDER_SPACING = 0.08; // ~24,000 vertices; lite 0.128 (~9,500)
const AIR = 1; // full draught when idle motion is on (the sim scales it)
const PRESS = 40; // units/s² under a pointer moving at FULL_SPEED or faster
const WAKE = 2.5; // share of the pointer's speed passed to the cloth, per second
const FULL_SPEED = 8; // units/s across the cloth
const REACH = 1.3; // furthest a drag can move the cloth (units)
const TAP = { radius: 1.6, speed: 3.2 };
const STEP = 1 / 60; // seconds per solver step
const REST_ENERGY = 2e-4; // mean squared speed (units²/s², frame to frame) below which the cloth is at rest
const RECOVER = { delay: 1200, rate: 1.2 }; // ms after the last touch; per second

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const approach = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

/** Wider as the plate enters, closest to the knit as it is centred, the default as it leaves. */
function scrollShot(q: number) {
  const inward = easeInOut(clamp(q / 0.5, 0, 1));
  const outward = easeInOut(clamp((q - 0.5) / 0.5, 0, 1));
  return {
    distance: q < 0.5 ? lerp(1.16, 0.78, inward) : lerp(0.78, 1, outward),
    azimuth: q < 0.5 ? lerp(0.12, -0.05, inward) : lerp(-0.05, 0, outward),
  };
}

export async function createFabricScene(
  options: Options,
): Promise<FabricScene> {
  const { host, frame, lite, motionOk, modelUrl } = options;
  const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] =
    await Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/libs/meshopt_decoder.module.js"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ]);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  let pixelRatio = Math.min(window.devicePixelRatio, lite ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = !lite;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.className = "block h-full w-full";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 100);

  // textile studio lighting: a soft environment, a wide warm key raking across the folds from the
  // upper left (the folds shadow one another), a warm low fill, and a warm light under the pointer
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environment = environment;
  scene.environmentIntensity = 0.3;
  const key = new THREE.SpotLight(0xffeedb, 3.3, 0, 0.6, 1, 0);
  key.position.set(-12, 6.5, 7);
  key.target.position.set(0, -1.5, 0);
  key.castShadow = !lite;
  key.shadow.mapSize.setScalar(2048);
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.035;
  key.shadow.radius = 4;
  key.shadow.camera.near = 6;
  key.shadow.camera.far = 32;
  const fill = new THREE.DirectionalLight(0xeee4d6, 0.45);
  fill.position.set(9, -2, 8);
  const sky = new THREE.HemisphereLight(0xfff3e2, 0x3a3226, 0.3);
  const pointer = new THREE.PointLight(0xfff0d8, 0, 3, 2);
  scene.add(key, key.target, fill, sky, pointer);

  // the asset carries the knit material and the cloth hanging at rest, settled by this solver
  // at build time for each resolution (scripts/build-knit-glb.mjs); the simulation continues it
  const profile = lite ? "lite" : "full";
  const gltf = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .loadAsync(modelUrl);
  let material: ThreeModule.MeshPhysicalMaterial | null = null;
  const stored: { grid: [number, number]; positions: ArrayLike<number> }[] = [];
  for (const root of gltf.scenes) {
    root.traverse((object) => {
      const found = object as ThreeModule.Mesh;
      if (!found.isMesh) return;
      material ??= found.material as ThreeModule.MeshPhysicalMaterial;
      const { profile: kind, grid } = found.userData as {
        profile?: string;
        grid?: [number, number];
      };
      if (kind === profile && grid) {
        stored.push({
          grid,
          positions: found.geometry.getAttribute("position").array,
        });
      }
      found.geometry.dispose();
    });
  }
  if (!material) throw new Error("The fabric model has no material.");
  const cloth: ThreeModule.MeshPhysicalMaterial = material;
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  for (const value of Object.values(cloth)) {
    // the knit is fine and seen at an angle: full anisotropic filtering keeps it crisp
    if (value instanceof THREE.Texture) value.anisotropy = maxAnisotropy;
  }
  cloth.side = THREE.DoubleSide;
  const { width: clothWidth, height: clothHeight } = DRAPE;

  // tuning handles in development only
  const tuning = import.meta.env.DEV
    ? (window as unknown as { __fabricConfig?: object; __fabricView?: object })
    : {};
  Object.assign(VIEW, tuning.__fabricView);
  const sim = new ClothSim({
    ...DRAPE,
    ...PROFILES[profile],
    ...tuning.__fabricConfig,
  });
  const baked = stored[0];
  if (
    baked &&
    baked.grid[0] === sim.cols &&
    baked.grid[1] === sim.rows &&
    !tuning.__fabricConfig
  ) {
    sim.place(baked.positions);
  } else {
    // no stored drape for this layout: settle it here, a slice at a time, before it is shown
    const steps = settle(sim);
    await new Promise<void>((resolve) => {
      const slice = () => {
        const start = performance.now();
        while (performance.now() - start < 12) {
          if (steps.next().done) return resolve();
        }
        setTimeout(slice, 0);
      };
      slice();
    });
    sim.snapshot();
  }
  // the render grid: placed on the cloth by the vertex shader from the particles (cloth-shader.ts)
  const spacing = lite ? RENDER_SPACING * 1.6 : RENDER_SPACING;
  const surface = new ClothSurface(
    sim.cols,
    sim.rows,
    Math.round(clothWidth / spacing) + 1,
    Math.round(clothHeight / spacing) + 1,
    clothWidth,
    clothHeight,
  );
  const particles = new THREE.DataTexture(
    surface.particles,
    sim.cols,
    sim.rows,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  const uniforms: ClothUniforms = {
    clothParticles: { value: particles },
    clothGrid: { value: new THREE.Vector2(sim.cols, sim.rows) },
    clothOcclusion: { value: 0.07 },
  };
  drawAsCloth(cloth, uniforms, true);
  const depth = new THREE.MeshDepthMaterial();
  drawAsCloth(depth, uniforms, false);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(surface.positions, 3),
  );
  geometry.setAttribute("uv", new THREE.BufferAttribute(surface.uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(surface.indices, 1));
  geometry.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(),
    Math.hypot(clothWidth, clothHeight),
  );
  const mesh = new THREE.Mesh(geometry, cloth);
  mesh.customDepthMaterial = depth;
  mesh.castShadow = !lite;
  mesh.receiveShadow = !lite;
  mesh.frustumCulled = false; // the shape is the simulation's, not the geometry's
  scene.add(mesh);

  // the solver runs at a fixed 60 steps a second whatever the display's rate (a cloth's rest
  // shape depends on its step), and frames show a blend of the last two steps
  const before = Float32Array.from(sim.pos);
  const blend = Float32Array.from(sim.pos);
  let pending = 0; // time not yet simulated
  const uploadSurface = (t = 1) => {
    for (let o = 0; o < blend.length; o++) {
      blend[o] = before[o]! + (sim.pos[o]! - before[o]!) * t;
    }
    surface.update(blend);
    particles.needsUpdate = true;
  };
  uploadSurface();

  /* ---------- State ---------- */

  const view = {
    scroll: 1,
    inspect: 0,
    inspectTarget: 0,
    light: 0,
    lightTarget: 0,
    playing: true,
    air: 0,
    press: 0,
  };
  const stats = { simMs: 0, surfaceMs: 0, frameMs: 0 };
  let baseDistance = 12;
  const target = new THREE.Vector3();
  const rest = new THREE.Vector3(...VIEW.target);
  const follow = new THREE.Vector3();
  const followParticle =
    Math.round(sim.rows * INSPECT.at[1]) * sim.cols +
    Math.round((sim.cols - 1) * INSPECT.at[0]);
  follow.fromArray(sim.pos, followParticle * 3);

  const fit = () => {
    const { width, height } = frame.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
    baseDistance =
      VIEW.height / 2 / Math.tan(halfV) / Math.min(1, camera.aspect / (4 / 3));
    camera.updateProjectionMatrix();
  };

  /** Place the camera; true while a view transition is still under way. */
  const place = (dt: number) => {
    const instant = !motionOk();
    view.inspect +=
      (view.inspectTarget - view.inspect) * (instant ? 1 : approach(4.2, dt));
    const moving = Math.abs(view.inspectTarget - view.inspect) > 1e-4;
    const shot = motionOk()
      ? scrollShot(view.scroll)
      : { distance: 1, azimuth: 0 };
    const inspect = easeInOut(clamp(view.inspect, 0, 1));
    // in close-up the view follows a point on the cloth, a little behind it, as a hand-held loupe would
    const particle = followParticle * 3;
    const k = instant ? 1 : approach(2.5, dt);
    follow.x += (sim.pos[particle]! - follow.x) * k;
    follow.y += (sim.pos[particle + 1]! - follow.y) * k;
    follow.z += (sim.pos[particle + 2]! - follow.z) * k;
    target.lerpVectors(rest, follow, inspect);
    const azimuth = lerp(VIEW.azimuth + shot.azimuth, INSPECT.azimuth, inspect);
    const elevation = lerp(VIEW.elevation, INSPECT.elevation, inspect);
    const distance =
      baseDistance * lerp(shot.distance, INSPECT.distance, inspect);
    camera.position
      .set(
        Math.sin(azimuth) * Math.cos(elevation),
        Math.sin(elevation),
        Math.cos(azimuth) * Math.cos(elevation),
      )
      .multiplyScalar(distance)
      .add(target);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    return moving;
  };

  /* ---------- Input ---------- */

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovering = false;
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const onPlane = new THREE.Vector3();
  const lastOnPlane = new THREE.Vector3();
  let planeValid = false;
  const pointerVelocity = new THREE.Vector3();
  const dragPlane = new THREE.Plane();
  const dragGoal = new THREE.Vector3();
  const dragPoint = new THREE.Vector3();
  const facing = new THREE.Vector3();
  let down: {
    id: number;
    x: number;
    y: number;
    time: number;
    particle: number;
    dragging: boolean;
  } | null = null;
  let calm = 0; // consecutive frames at rest
  let touched = 0; // when the pointer last pressed or held the cloth

  const aim = (event: PointerEvent) => {
    const box = frame.getBoundingClientRect();
    ndc.set(
      ((event.clientX - box.left) / box.width) * 2 - 1,
      -(((event.clientY - box.top) / box.height) * 2 - 1),
    );
    raycaster.setFromCamera(ndc, camera);
  };
  const castRay = () => {
    const { origin: o, direction: d } = raycaster.ray;
    return sim.raycast(o.x, o.y, o.z, d.x, d.y, d.z);
  };

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || down) return;
    aim(event);
    if (!castRay() || sim.hit.particle < 0) return;
    down = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
      particle: sim.hit.particle,
      dragging: false,
    };
    wake();
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      hovering = true;
      view.lightTarget = 1;
    }
    aim(event);
    if (down && event.pointerId === down.id) {
      if (
        !down.dragging &&
        Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6
      ) {
        down.dragging = true;
        sim.grab(down.particle);
        dragPoint.fromArray(sim.pos, down.particle * 3);
        dragGoal.copy(dragPoint);
        camera.getWorldDirection(facing);
        dragPlane.setFromNormalAndCoplanarPoint(facing, dragPoint);
        frame.setPointerCapture(event.pointerId);
        frame.style.cursor = "grabbing";
      }
      if (down.dragging) raycaster.ray.intersectPlane(dragPlane, dragGoal);
    }
    wake();
  };
  const finish = (event: PointerEvent, cancelled: boolean) => {
    if (!down || event.pointerId !== down.id) return;
    if (down.dragging) {
      sim.release();
      frame.style.cursor = "";
      if (frame.hasPointerCapture(event.pointerId))
        frame.releasePointerCapture(event.pointerId);
    } else if (!cancelled && motionOk() && event.timeStamp - down.time < 600) {
      // a tap stirs the cloth where it lands, pressing it away from the viewer
      aim(event);
      if (castRay()) {
        const d = raycaster.ray.direction;
        sim.impulse(
          sim.hit.x,
          sim.hit.y,
          sim.hit.z,
          d.x,
          d.y,
          d.z,
          TAP.radius,
          TAP.speed,
        );
      }
    }
    down = null;
    wake();
  };
  const onUp = (event: PointerEvent) => finish(event, false);
  const onCancel = (event: PointerEvent) => finish(event, true);
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    hovering = false;
    view.lightTarget = 0;
    kick();
  };
  frame.addEventListener("pointerdown", onDown);
  frame.addEventListener("pointermove", onMove);
  frame.addEventListener("pointerup", onUp);
  frame.addEventListener("pointercancel", onCancel);
  frame.addEventListener("pointerleave", onLeave);

  /** Pointer pressure, the drag and the pointer light, for this frame. */
  const steer = (dt: number) => {
    const p = sim.pointer;
    if (hovering) {
      raycaster.setFromCamera(ndc, camera); // the camera may have moved under a still pointer
      const { origin: o, direction: d } = raycaster.ray;
      p.ox = o.x;
      p.oy = o.y;
      p.oz = o.z;
      p.dx = d.x;
      p.dy = d.y;
      p.dz = d.z;
      // the pointer's speed across the cloth, measured on the cloth's plane
      if (raycaster.ray.intersectPlane(plane, onPlane)) {
        if (planeValid) {
          const k = approach(14, dt);
          pointerVelocity.x +=
            ((onPlane.x - lastOnPlane.x) / dt - pointerVelocity.x) * k;
          pointerVelocity.y +=
            ((onPlane.y - lastOnPlane.y) / dt - pointerVelocity.y) * k;
          pointerVelocity.z +=
            ((onPlane.z - lastOnPlane.z) / dt - pointerVelocity.z) * k;
        }
        lastOnPlane.copy(onPlane);
        planeValid = true;
      }
      p.vx = pointerVelocity.x;
      p.vy = pointerVelocity.y;
      p.vz = pointerVelocity.z;
    } else {
      planeValid = false;
      pointerVelocity.setScalar(0);
    }
    // a moving pointer pushes the air against the cloth, as a passing hand does; a still one does not
    const push =
      motionOk() && hovering && !down?.dragging
        ? Math.min(1, pointerVelocity.length() / FULL_SPEED)
        : 0;
    view.press +=
      (push - view.press) * approach(push > view.press ? 10 : 3, dt);
    if (view.press < 1e-3 && !push) view.press = 0;
    p.press = PRESS * view.press;
    p.wake = WAKE * view.press;

    if (down?.dragging) {
      dragPoint.lerp(dragGoal, approach(18, dt));
      sim.drag(dragPoint.x, dragPoint.y, dragPoint.z, REACH);
    }

    // the pointer light rides just in front of the cloth under the cursor
    if (view.light > 0.002 && hovering) {
      raycaster.setFromCamera(ndc, camera);
      if (castRay()) {
        const inspect = easeInOut(clamp(view.inspect, 0, 1));
        pointer.position
          .set(sim.hit.x, sim.hit.y, sim.hit.z)
          .addScaledVector(raycaster.ray.direction, -lerp(0.9, 0.35, inspect));
        pointer.distance = lerp(3, 1.4, inspect);
      }
    }
    pointer.intensity = view.light * (lite ? 2.2 : 2.8);
    return view.light > 0.002 && Math.abs(view.lightTarget - view.light) > 1e-3;
  };

  /* ---------- Loop ---------- */

  // runs while the plate is on screen and the cloth moves (or the view does); otherwise it stops
  let frameId = 0;
  let last = 0;
  let onScreen = true;
  const slow: number[] = [];
  const loop = (now: number) => {
    frameId = 0;
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    if (last) {
      stats.frameMs += (now - last - stats.frameMs) * 0.05;
      slow.push(now - last);
      if (slow.length > 40) slow.shift();
      if (
        slow.length === 40 &&
        slow.reduce((a, b) => a + b, 0) / 40 > 24 &&
        pixelRatio > 1
      ) {
        pixelRatio = Math.max(1, pixelRatio - 0.5); // adaptive resolution if frames run long
        renderer.setPixelRatio(pixelRatio);
        fit();
        slow.length = 0;
      }
    }
    last = now;

    view.air +=
      ((view.playing && motionOk() ? AIR : 0) - view.air) * approach(0.6, dt);
    if (view.air < 0.02 && !(view.playing && motionOk())) view.air = 0;
    sim.air = view.air;
    const lightMoving = steer(dt);
    if (down || view.press > 0) touched = now;
    // once left alone, the folds creep back to the composed drape
    sim.recover = now - touched > RECOVER.delay ? RECOVER.rate : 0;
    const active =
      view.air > 0 || view.press > 0 || down?.dragging || calm < 45;
    if (active) {
      const t0 = performance.now();
      pending += dt;
      for (let n = 0; pending >= STEP && n < 2; n++) {
        before.set(sim.pos);
        sim.step(STEP);
        pending -= STEP;
        calm = sim.moved < REST_ENERGY ? calm + 1 : 0;
      }
      if (pending >= STEP) pending = 0; // a slow device: let time slip rather than fall behind
      const t1 = performance.now();
      uploadSurface(pending / STEP);
      stats.simMs += (t1 - t0 - stats.simMs) * 0.05;
      stats.surfaceMs += (performance.now() - t1 - stats.surfaceMs) * 0.05;
    } else pending = 0;
    const viewMoving = place(dt);
    renderer.render(scene, camera);
    if (onScreen && (active || viewMoving || lightMoving))
      frameId = requestAnimationFrame(loop);
    else last = 0;
  };
  /** Render a frame (the loop continues while anything moves). */
  function kick() {
    if (!frameId && onScreen) frameId = requestAnimationFrame(loop);
  }
  /** Wake the cloth: something touched it. */
  function wake() {
    calm = 0;
    kick();
  }

  const resize = new ResizeObserver(() => {
    fit();
    kick();
  });
  resize.observe(frame);
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true;
    if (onScreen) kick();
    else {
      cancelAnimationFrame(frameId);
      frameId = 0;
      last = 0;
    }
  });
  visibility.observe(frame);

  fit();
  place(1 / 60);
  host.appendChild(renderer.domElement);
  wake();
  if (import.meta.env.DEV) {
    // QA handle in development only
    (window as unknown as { __fabric?: object }).__fabric = {
      camera,
      scene,
      mesh,
      particles,
      sim,
      surface,
      view,
      stats,
      renderer,
    };
  }

  return {
    setScroll(progress) {
      view.scroll = clamp(progress, 0, 1);
      kick();
    },
    setInspect(on) {
      view.inspectTarget = on ? 1 : 0;
      kick();
    },
    setPlaying(on) {
      view.playing = on;
      wake();
    },
    dispose() {
      cancelAnimationFrame(frameId);
      resize.disconnect();
      visibility.disconnect();
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointercancel", onCancel);
      frame.removeEventListener("pointerleave", onLeave);
      frame.style.cursor = "";
      geometry.dispose();
      particles.dispose();
      depth.dispose();
      for (const value of Object.values(cloth))
        if (value instanceof THREE.Texture) value.dispose();
      cloth.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
