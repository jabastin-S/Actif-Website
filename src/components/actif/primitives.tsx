import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * True only after hydration. Reveals hide their content only once armed, so the
 * server-rendered page (and any no-JS or reduced-motion visitor) always sees content.
 */
function useArmed() {
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return armed && !reduced;
}

/** One line of a heading, lifted into view from behind a mask. */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useArmed();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <span ref={ref} className={cn("block overflow-hidden pb-[0.12em] -mb-[0.12em]", className)}>
      <motion.span
        className="block"
        initial={false}
        animate={{ y: !armed || inView ? "0%" : "108%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Soft focus-in: opacity and a little blur, no slide. */
export function Fade({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "li" | "section" | "ul" | "dl";
}) {
  const ref = useRef<HTMLElement>(null);
  const armed = useArmed();
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const MotionTag = motion[Tag] as typeof motion.div;
  const show = !armed || inView;
  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0, filter: show ? "blur(0px)" : "blur(6px)" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** A thread-thin rule that draws itself in. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useArmed();
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={cn("h-px origin-left bg-current", className)}
      initial={false}
      animate={{ scaleX: !armed || inView ? 1 : 0 }}
      transition={{ duration: 1.4, delay, ease: EASE }}
    />
  );
}

/** Counts up once when scrolled into view. Final value is the server-rendered default. */
export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useArmed();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [armed, inView, value]);
  return (
    <span ref={ref} className={cn("tabular", className)}>
      {armed && !inView ? 0 : shown}
    </span>
  );
}

export type Structure = "jersey" | "rib" | "waffle" | "mesh";

/**
 * Procedural knit-structure swatch, drawn as an SVG pattern. Decorative: it stands for
 * a sample of cloth, it does not depict any specific ACTIF fabric.
 */
export function Swatch({
  structure,
  tint,
  className,
  scale = 1,
}: {
  structure: Structure;
  tint: string; // any CSS colour, e.g. var(--celadon)
  className?: string;
  scale?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const shade = "color-mix(in oklab, var(--ink) 34%, transparent)";
  const light = "color-mix(in oklab, white 42%, transparent)";
  const dims: Record<Structure, [number, number]> = {
    jersey: [10, 12],
    rib: [12, 6],
    waffle: [16, 16],
    mesh: [12, 12],
  };
  const [w, h] = dims[structure];
  return (
    <svg
      aria-hidden
      className={cn("block h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={`p${uid}`}
          width={w}
          height={h}
          patternUnits="userSpaceOnUse"
          patternTransform={`scale(${scale})`}
        >
          {structure === "jersey" && (
            <>
              <path d="M0.8 -1 L5 11.5 L9.2 -1" fill="none" stroke={shade} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0.8 -1 L5 11.5 L9.2 -1" fill="none" stroke={light} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" transform="translate(-0.4 -0.4)" />
            </>
          )}
          {structure === "rib" && (
            <>
              <rect x="0" y="0" width="12" height="6" fill="none" />
              <rect x="1" y="0" width="5" height="6" fill={light} />
              <rect x="7" y="0" width="4" height="6" fill={shade} />
            </>
          )}
          {structure === "waffle" && (
            <>
              <rect x="1.5" y="1.5" width="13" height="13" fill="none" stroke={shade} strokeWidth="2" />
              <rect x="3.5" y="3.5" width="9" height="9" fill={light} />
            </>
          )}
          {structure === "mesh" && (
            <>
              <circle cx="6" cy="6" r="3.2" fill={shade} />
              <circle cx="6" cy="5.4" r="3.2" fill="none" stroke={light} strokeWidth="0.8" />
            </>
          )}
        </pattern>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.22" />
          <stop offset="0.35" stopColor="black" stopOpacity="0.1" />
          <stop offset="0.6" stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="black" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={tint} />
      <rect width="100%" height="100%" fill={`url(#p${uid})`} />
      <rect width="100%" height="100%" fill={`url(#g${uid})`} />
    </svg>
  );
}
