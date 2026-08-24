import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Palette = "ivory" | "forest";

/**
 * Canvas fallback / ambient layer: slow flowing textile fibres.
 * Used behind the hero (under the video, or alone if the video asset is absent)
 * and as a subtle motif layer in dark sections.
 * Pauses when off-screen and disables itself under prefers-reduced-motion.
 */
export function TextileBackground({
  palette = "ivory",
  density = 18,
  opacity = 0.55,
  interactive = false,
  className,
}: {
  palette?: Palette;
  density?: number;
  opacity?: number;
  interactive?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    const lines = Math.max(6, Math.round(density * (isSmall ? 0.55 : 1)));

    const colors =
      palette === "forest"
        ? ["rgba(214,226,205,", "rgba(178,203,196,", "rgba(226,214,190,"]
        : ["rgba(96,104,92,", "rgba(120,134,126,", "rgba(150,132,104,"];

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const fibres = Array.from({ length: lines }, (_, i) => ({
      y: (i + 0.5) / lines,
      amp: 0.02 + Math.random() * 0.07,
      freq: 0.9 + Math.random() * 2.1,
      speed: 0.00006 + Math.random() * 0.00012,
      phase: Math.random() * Math.PI * 2,
      weight: 0.4 + Math.random() * 1.1,
      color: colors[i % colors.length],
      alpha: 0.12 + Math.random() * 0.3,
    }));

    const pointer = { x: 0.5, y: 0.5, active: false };
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    if (interactive) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = !reduced;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const f of fibres) {
        ctx.beginPath();
        ctx.lineWidth = f.weight;
        ctx.strokeStyle = `${f.color}${f.alpha})`;
        const pull = interactive && pointer.active ? (pointer.y - f.y) * 0.05 : 0;
        for (let px = 0; px <= width; px += 6) {
          const u = px / Math.max(width, 1);
          const wave =
            Math.sin(u * Math.PI * 2 * f.freq + f.phase + t * f.speed * 1000) * f.amp +
            Math.sin(u * Math.PI * 5.5 + f.phase * 1.7 + t * f.speed * 420) * f.amp * 0.28;
          const y = (f.y + wave + pull) * height;
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      if (running) draw(t);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        running = !reduced && entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (interactive) window.removeEventListener("pointermove", onPointer);
    };
  }, [palette, density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    />
  );
}
