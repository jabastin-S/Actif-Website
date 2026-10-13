import { useEffect, useRef, useState } from "react";
import { CHAPTERS, SPECIMENS, type Specimen } from "@/content/chapters";
import { cn } from "@/lib/utils";
import { useStage } from "./useStage";

/**
 * The specimen stage: one WebGL canvas that shows a calm, slowly lit macro of a knitted
 * structure. When the active chapter changes, structure, scale and yarn colour glide to the
 * new specimen. Light follows the pointer a little. Idle frames are throttled; it pauses
 * off-screen and in hidden tabs; reduced-motion visitors get a still that snaps between
 * specimens. Without WebGL a flat chapter-colour field with a CSS weave is shown instead.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uMix;
uniform float uScale;
uniform vec3 uFace;
uniform vec3 uShade;
uniform vec3 uBack;
uniform float uRelief;
uniform vec2 uLight;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// every pattern returns vec2(cover, height) for loop-space coordinates c
vec2 jersey(vec2 c){
  // columns (wales) of chevrons: a continuous wave whose phase leans away from each column centre,
  // so every column reads as stacked Vs and neighbouring columns meet in a crease
  float sd = abs(fract(c.x) - 0.5) * 2.0;
  float wave = 0.5 + 0.5 * cos(6.2832 * (c.y + sd * 0.55));
  float h = pow(wave, 0.75);
  return vec2(1.0, h);
}

vec2 ribp(vec2 c){
  float cx = fract(c.x * 0.5);
  float knit = 1.0 - smoothstep(0.42, 0.5, cx);
  vec2 j = jersey(vec2(cx * 2.0, c.y));
  float cover = 1.0;
  float h = j.y * knit * 0.8 + knit * 0.32;
  return vec2(cover, h);
}

vec2 meshp(vec2 c){
  // diamond openings between twisted yarn bars
  vec2 f = fract(c) - 0.5;
  float d = abs(f.x) + abs(f.y);
  float cover = smoothstep(0.3, 0.4, d);
  float twist = 0.5 + 0.5 * cos(6.2832 * (c.x + c.y) * 2.0);
  float h = smoothstep(0.3, 0.58, d) * (0.62 + 0.38 * twist);
  return vec2(cover, h * cover);
}

vec2 wafflep(vec2 c){
  vec2 f = fract(c) - 0.5;
  float d = max(abs(f.x), abs(f.y));
  float ridge = smoothstep(0.2, 0.4, d) * (1.0 - smoothstep(0.43, 0.5, d) * 0.55);
  return vec2(1.0, ridge * 0.8 + 0.08);
}

vec2 field(vec2 c){
  vec2 r = vec2(0.0);
  if (uMix.x > 0.001) r += uMix.x * jersey(c);
  if (uMix.y > 0.001) r += uMix.y * ribp(c);
  if (uMix.z > 0.001) r += uMix.z * meshp(c);
  if (uMix.w > 0.001) r += uMix.w * wafflep(c);
  return r;
}

float foldH(vec2 p, float t){
  return 0.55 * sin(p.x * 2.1 + p.y * 0.9 + t) + 0.45 * sin(p.y * 1.7 - p.x * 0.8 + 1.3 - t * 0.7)
       + 0.4 * noise(p * 1.7 + vec2(t * 0.3, -t * 0.2));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);

  // the cloth is never perfectly flat: a slow, shallow sag in the surface
  float t = uTime * 0.03;
  vec2 warp = 0.05 * vec2(sin(p.y * 1.6 + t), sin(p.x * 1.3 - t * 0.8));
  float drape = sin(p.x * 1.1 + p.y * 0.6 + t) * 0.5 + sin(p.y * 0.9 - p.x * 0.4 + 1.7) * 0.5;

  vec2 c = (p + warp) * vec2(uScale, uScale * 1.15);

  float e = 0.03;
  vec2 f0 = field(c);
  vec2 fx = field(c + vec2(e, 0.0));
  vec2 fy = field(c + vec2(0.0, e));
  float dx = (fx.y - f0.y) / e;
  float dy = (fy.y - f0.y) / e;
  // soft cloth folds at large scale, fine stitch relief on top
  vec2 pf = p * 2.0;
  float fe = 0.02;
  float f00 = foldH(pf, t);
  vec2 fg = vec2(foldH(pf + vec2(fe, 0.0), t) - f00, foldH(pf + vec2(0.0, fe), t) - f00) / fe;
  vec3 n = normalize(vec3(-(dx * 0.1 * uRelief + fg.x * 0.32), -(dy * 0.1 * uRelief + fg.y * 0.32), 1.0));

  vec3 L = normalize(vec3(uLight.x * 0.55 - 0.35, uLight.y * 0.45 + 0.55, 0.75));
  float lam = clamp(dot(n, L) * 0.5 + 0.55, 0.0, 1.0);
  lam += (f00 * 0.12 + drape * 0.05);

  float h = f0.y;
  float ao = mix(0.72, 1.0, smoothstep(0.0, 0.55, h));
  vec3 yarn = mix(uShade, uFace, clamp(lam * 1.1 + h * 0.3 - 0.05, 0.0, 1.0)) * ao;
  float fibre = noise(c * 22.0);
  yarn *= 0.96 + 0.08 * fibre;
  float sheen = pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 26.0) * 0.1;
  yarn += uFace * sheen;

  // knit loops overlap, so the gaps between them are shadow; only an open mesh shows what is behind
  vec3 gap = mix(uShade * 0.62, uBack, uMix.z);
  vec3 col = mix(gap, yarn, f0.x);
  col *= 1.0 - 0.28 * pow(length(uv - 0.5) * 1.15, 2.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

type State = {
  mix: number[];
  logScale: number;
  face: number[];
  shade: number[];
  back: number[];
  relief: number;
};

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const toState = (s: Specimen): State => ({
  mix: [...s.mix],
  logScale: Math.log(s.scale),
  face: hexToRgb(s.face),
  shade: hexToRgb(s.shade),
  back: hexToRgb(s.back),
  relief: s.relief,
});

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("KnitStage shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function KnitStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { active } = useStage();
  const [glState, setGlState] = useState<"pending" | "ready" | "failed">("pending");
  const key = active === "contact" ? "intro" : active;
  const specimen = SPECIMENS[key];
  const targetRef = useRef<State>(toState(specimen));

  useEffect(() => {
    targetRef.current = toState(specimen);
  }, [specimen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setGlState("failed");
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setGlState("failed");
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setGlState("failed");
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mix: gl.getUniformLocation(program, "uMix"),
      scale: gl.getUniformLocation(program, "uScale"),
      face: gl.getUniformLocation(program, "uFace"),
      shade: gl.getUniformLocation(program, "uShade"),
      back: gl.getUniformLocation(program, "uBack"),
      relief: gl.getUniformLocation(program, "uRelief"),
      light: gl.getUniformLocation(program, "uLight"),
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // start exactly on the target so the first frame is already the right specimen
    const current: State = structuredClone(targetRef.current);
    const light = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let last = performance.now();
    let lastDraw = 0;
    let busyUntil = 0;
    let visible = true;
    let lost = false;
    const start = last;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr * 0.9));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr * 0.9));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const approach = (now: number) => {
      const target = targetRef.current;
      const dt = Math.min(0.1, (now - last) / 1000);
      const k = reduced.matches ? 1 : 1 - Math.exp(-dt * 2.6);
      let moving = false;
      const step = (a: number[], b: number[]) => {
        for (let i = 0; i < a.length; i++) {
          const next = a[i]! + (b[i]! - a[i]!) * k;
          if (Math.abs(b[i]! - next) > 0.0008) moving = true;
          a[i] = Math.abs(b[i]! - next) <= 0.0008 ? b[i]! : next;
        }
      };
      step(current.mix, target.mix);
      step(current.face, target.face);
      step(current.shade, target.shade);
      step(current.back, target.back);
      const ls = [current.logScale, current.relief];
      step(ls, [target.logScale, target.relief]);
      current.logScale = ls[0]!;
      current.relief = ls[1]!;
      return moving;
    };

    const draw = (now: number) => {
      if (lost) return;
      light.x += (light.tx - light.x) * 0.05;
      light.y += (light.ty - light.y) * 0.05;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, reduced.matches ? 4 : (now - start) / 1000);
      gl.uniform4f(u.mix, current.mix[0]!, current.mix[1]!, current.mix[2]!, current.mix[3]!);
      gl.uniform1f(u.scale, Math.exp(current.logScale));
      gl.uniform3f(u.face, current.face[0]!, current.face[1]!, current.face[2]!);
      gl.uniform3f(u.shade, current.shade[0]!, current.shade[1]!, current.shade[2]!);
      gl.uniform3f(u.back, current.back[0]!, current.back[1]!, current.back[2]!);
      gl.uniform1f(u.relief, current.relief);
      gl.uniform2f(u.light, light.x, light.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      lastDraw = now;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || lost) return;
      const moving = approach(now);
      last = now;
      const busy = moving || now < busyUntil;
      // idle frames are throttled: the cloth is calm, it does not need 60 fps
      if (busy || now - lastDraw > 90) draw(now);
      if (!reduced.matches || moving) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && !lost) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    draw(performance.now());
    setGlState("ready");
    kick();

    // re-arm the loop when the specimen changes (reduced motion stops it when still)
    const watch = window.setInterval(() => {
      const t = targetRef.current;
      const differs =
        Math.abs(t.logScale - current.logScale) > 0.001 ||
        t.mix.some((v, i) => Math.abs(v - current.mix[i]!) > 0.001);
      if (differs) kick();
    }, 250);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) kick();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) kick();
    };
    const onMove = (event: PointerEvent) => {
      light.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      light.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
      busyUntil = performance.now() + 1600;
      kick();
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setGlState("failed");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(watch);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  const index = Math.max(0, CHAPTERS.findIndex((c) => c.id === active));

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: specimen.face, transition: "background-color 1.6s ease" }}
    >
      {/* fallback weave when WebGL is unavailable */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          glState === "failed" ? "opacity-100" : "opacity-0",
        )}
        style={{
          backgroundColor: specimen.face,
          backgroundImage:
            "repeating-linear-gradient(60deg, rgb(0 0 0 / 0.1) 0 3px, transparent 3px 14px), repeating-linear-gradient(-60deg, rgb(0 0 0 / 0.1) 0 3px, transparent 3px 14px)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-[1400ms]",
          glState === "ready" ? "opacity-100" : "opacity-0",
        )}
      />

      <p className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] bg-paper px-3 py-1.5 text-[0.6875rem] leading-snug text-ink-soft sm:top-5 sm:left-5 sm:text-xs">
        Illustrative knit structure: {specimen.structure}
      </p>

      <nav
        aria-label="Chapters"
        className="absolute bottom-3 left-3 hidden max-w-[calc(100%-1.5rem)] items-center gap-4 bg-paper px-4 py-3 sm:bottom-5 sm:left-5 sm:flex"
      >
        <span className="text-xs font-medium tabular text-ink">
          {String(index + 1).padStart(2, "0")}/{String(CHAPTERS.length).padStart(2, "0")}
        </span>
        <ol className="flex items-center gap-1.5">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={chapter.href}
                aria-label={chapter.label}
                aria-current={chapter.id === active ? "true" : undefined}
                className="group flex h-6 w-3 items-center justify-center"
              >
                <span
                  className={cn(
                    "block w-px bg-ink/35 transition-[height,background-color] duration-500 group-hover:bg-ink",
                    chapter.id === active ? "h-5 w-0.5 bg-ink" : "h-3",
                  )}
                />
              </a>
            </li>
          ))}
        </ol>
        <span className="hidden text-xs text-ink md:inline">
          {CHAPTERS[index]?.label}
        </span>
      </nav>
    </div>
  );
}
