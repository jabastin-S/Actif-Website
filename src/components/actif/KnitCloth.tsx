import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Real-time knitted cloth in raw WebGL: V-stitch loops drawn per cell, displaced by a
 * slow fold field and lit from a drifting light. One crimson course runs through it like a
 * selvedge marker thread. Pauses off-screen and when the tab is hidden; renders a single
 * still frame for reduced-motion visitors; falls back to the poster photo without WebGL.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + vec2(7.1, 3.7); a *= 0.5; }
  return v;
}
float folds(vec2 p, float t){
  float h = 0.0;
  h += sin(p.x * 1.5 + p.y * 0.8 + t * 0.9) * 0.55;
  h += sin(p.x * 0.7 - p.y * 1.4 - t * 0.7) * 0.5;
  h += fbm(p * 1.05 + vec2(t * 0.08, -t * 0.05)) * 1.3;
  return h;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y - 0.5) * 2.2;
  float t = uTime * 0.16;

  float e = 0.012;
  float h  = folds(p, t);
  float hx = (folds(p + vec2(e, 0.0), t) - h) / e;
  float hy = (folds(p + vec2(0.0, e), t) - h) / e;
  vec3 n = normalize(vec3(-hx * 0.3, -hy * 0.3, 1.0));

  // stitches stretch over the crests and bunch in the valleys
  vec2 sp = p * (1.0 - h * 0.035) + vec2(hx, hy) * 0.012;
  float k = uRes.y > 700.0 ? 8.5 : 7.0;
  vec2 c = sp * vec2(k, k * 1.18);
  vec2 f = fract(c);
  vec2 id = floor(c);

  float u = f.x, v = f.y;
  float w = 0.23;
  float dl = abs(u - (0.5 - 0.4 * v));
  float dr = abs(u - (0.5 + 0.4 * v));
  float l1 = 1.0 - smoothstep(w * 0.55, w, dl);
  float r1 = 1.0 - smoothstep(w * 0.55, w, dr);
  float yl = l1 * (1.0 - pow(clamp(dl / w, 0.0, 1.0), 2.0));
  float yr = r1 * (1.0 - pow(clamp(dr / w, 0.0, 1.0), 2.0));
  float yarn = max(yl, yr);
  float fibre = noise(vec2(c.x * 9.0 + c.y * 2.5, c.y * 22.0 + id.x));
  float body = mix(0.3, 1.0, yarn) * (0.9 + 0.2 * fibre);

  vec3 L = normalize(vec3(-0.55 + uMouse.x * 0.35, 0.55 + uMouse.y * 0.25, 0.65));
  float lam = clamp(dot(n, L) * 0.5 + 0.55, 0.0, 1.0);
  lam = pow(lam, 1.5);

  vec3 deep = vec3(0.035, 0.05, 0.11);
  vec3 mid  = vec3(0.11, 0.17, 0.36);
  vec3 hi   = vec3(0.62, 0.69, 0.84);
  float s = body * lam;
  vec3 col = mix(deep, mid, smoothstep(0.0, 0.75, s));
  col += hi * pow(s, 3.0) * 0.2;

  // the marker thread: one crimson course every so often
  float mark = step(abs(mod(id.y, 12.0)), 0.5);
  col = mix(col, vec3(0.62, 0.12, 0.25) * (0.35 + 0.9 * s), mark * 0.55 * yarn);

  // keep the lower-left calm for the wordmark, and soften the top edge
  float calm = smoothstep(1.15, 0.1, uv.x * 0.7 + (1.0 - uv.y) * 0.7 - 0.1);
  col *= mix(1.0, 0.3, smoothstep(0.0, 1.0, calm));
  col *= 0.8 + 0.2 * smoothstep(0.0, 0.35, uv.y);
  col = pow(col, vec3(0.96));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("KnitCloth shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function KnitCloth({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    let lost = false;
    const start = performance.now();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr * 0.85));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr * 0.85));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now: number) => {
      if (lost) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reducedQuery.matches ? 6 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || reducedQuery.matches) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && !lost) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(performance.now());
    setReady(true);
    kick();

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
      mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setReady(false);
    };
    const onMotionChange = () => {
      draw(performance.now());
      kick();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    reducedQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      reducedQuery.removeEventListener("change", onMotionChange);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "absolute inset-0 h-full w-full transition-opacity duration-[1600ms]",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
