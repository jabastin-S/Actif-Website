import { useScroll } from "motion/react";
import { Pause, Play, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReached } from "@/lib/motion-hooks";
import { useMotionOk } from "@/lib/use-motion-ok";
import { cn } from "@/lib/utils";
import type { FabricScene } from "./knit/fabric-scene";

/** The knit material and the cloth's rest size (scripts/build-knit-glb.mjs). */
const MODEL = "/models/cotton-jersey-v5.glb";
const POSTER = "/images/knit-lattice-poster.webp";

/**
 * The knit plate: a piece of fine cotton single jersey hanging in soft folds, simulated as
 * cloth (knit/cloth-sim.ts) and lit like a textile sample. A slow draught keeps it barely
 * moving; the pointer presses into it, a drag pulls it (within what the cloth allows) and a tap
 * stirs it, and it settles back by itself. Scrolling past moves the view in towards the knit and
 * back; Inspect stitches brings the knit up close and follows it as it moves.
 *
 * three.js and the scene load only when the plate is near the viewport, and the simulation runs
 * only while the plate is on screen and the cloth is moving. The poster is the settled drape:
 * shown before load, without WebGL and in the server render. Pause motion stops the draught
 * (WCAG 2.2.2). Reduced motion: no draught, pressing or stirring, no scroll movement; a drag
 * still works and the cloth simply settles.
 */
export function KnitModel({ className }: { className?: string }) {
  const plate = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const motionRef = useRef(motionOk);
  motionRef.current = motionOk;
  const near = useReached(plate, 1.8);
  const { scrollYProgress } = useScroll({
    target: plate,
    offset: ["start end", "end start"],
  });
  const sceneRef = useRef<FabricScene | null>(null);
  const [status, setStatus] = useState<"waiting" | "live" | "failed">(
    "waiting",
  );
  const [inspect, setInspect] = useState(false);
  const inspectRef = useRef(inspect);
  inspectRef.current = inspect;
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const frame = plate.current;
    const mount = host.current;
    if (!near || !frame || !mount) return;
    let disposed = false;
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lite =
      window.matchMedia("(max-width: 767px)").matches ||
      memory <= 4 ||
      (navigator.hardwareConcurrency ?? 8) <= 2;

    import("./knit/fabric-scene")
      .then(({ createFabricScene }) =>
        createFabricScene({
          host: mount,
          frame,
          lite,
          motionOk: () => motionRef.current,
          modelUrl: MODEL,
        }),
      )
      .then((scene) => {
        if (disposed) return scene.dispose();
        sceneRef.current = scene;
        scene.setScroll(scrollYProgress.get());
        scene.setInspect(inspectRef.current);
        scene.setPlaying(playingRef.current);
        setStatus("live");
      })
      .catch((error: unknown) => {
        console.warn("Fabric model unavailable; showing the poster.", error);
        if (!disposed) setStatus("failed");
      });

    const unsubscribe = scrollYProgress.on("change", (value) =>
      sceneRef.current?.setScroll(value),
    );
    return () => {
      disposed = true;
      unsubscribe();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [near, scrollYProgress]);

  useEffect(() => {
    sceneRef.current?.setInspect(inspect);
    if (!inspect) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInspect(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inspect]);

  useEffect(() => {
    sceneRef.current?.setPlaying(playing);
  }, [playing]);

  const live = status === "live";
  const control =
    "inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-linen disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className={className}>
      <div
        ref={plate}
        role="img"
        aria-label="Fine cotton single jersey hanging in soft folds: an illustrative 3D simulation of the knit."
        className={cn(
          "grain relative aspect-[4/3] touch-pan-y select-none overflow-hidden bg-[radial-gradient(120%_95%_at_42%_36%,var(--charcoal-2),var(--charcoal)_72%)]",
          live && "cursor-grab",
        )}
      >
        <img
          src={POSTER}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out)]",
            live && "opacity-0",
          )}
        />
        <div
          ref={host}
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-out)]",
            live && "opacity-100",
          )}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-sm text-ink-soft">
          Fine cotton single jersey, an illustrative simulation.
          {live && (
            <>
              {" "}
              {motionOk ? (
                <>
                  <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">
                    Move across the cloth to press it; drag to pull, click to
                    stir.
                  </span>
                  <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">
                    Drag sideways to pull the cloth; tap to stir it.
                  </span>
                </>
              ) : (
                "Drag to pull the cloth."
              )}
            </>
          )}
        </p>
        {status !== "failed" && (
          <div className="flex flex-wrap items-center">
            {motionOk && (
              <button
                type="button"
                disabled={!live}
                onClick={() => setPlaying((value) => !value)}
                className={control}
              >
                {playing ? (
                  <Pause aria-hidden className="size-4" />
                ) : (
                  <Play aria-hidden className="size-4" />
                )}
                {playing ? "Pause motion" : "Play motion"}
              </button>
            )}
            <button
              type="button"
              disabled={!live}
              aria-pressed={inspect}
              onClick={() => setInspect((value) => !value)}
              className={control}
            >
              {inspect ? (
                <ZoomOut aria-hidden className="size-4" />
              ) : (
                <ZoomIn aria-hidden className="size-4" />
              )}
              {inspect ? "Full view" : "Inspect stitches"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
