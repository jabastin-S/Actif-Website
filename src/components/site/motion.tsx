import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionOk } from "@/lib/use-motion-ok";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One line of a heading, lifted into view from behind a mask. Content is visible by default
 * (server render, no-JS, reduced motion); it is only hidden after hydration when motion is OK.
 */
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
  const motionOk = useMotionOk();
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <span ref={ref} className={cn("block overflow-hidden pb-[0.14em] -mb-[0.14em]", className)}>
      <motion.span
        className="block"
        initial={false}
        animate={{ y: !motionOk || inView ? "0%" : "108%" }}
        transition={{ duration: 1.3, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Counts up once when scrolled into view; the final value is the server-rendered default. */
export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionOk = useMotionOk();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!motionOk || !inView) return;
    const controls = animate(0, value, {
      duration: 2.4,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [motionOk, inView, value]);
  return (
    <span ref={ref} className={cn("tabular", className)}>
      {motionOk && !inView ? 0 : shown}
    </span>
  );
}
