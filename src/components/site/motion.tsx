import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionOk } from "@/lib/use-motion-ok";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One line of a heading lifted into view from behind a mask. Content is visible by default
 * (server render, no-JS, reduced motion); it is only hidden after hydration when motion is OK.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** play on mount instead of waiting to scroll into view (hero) */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionOk = useMotionOk();
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const show = !motionOk || immediate || inView;
  return (
    <span ref={ref} className={cn("block overflow-hidden pb-[0.16em] -mb-[0.16em]", className)}>
      <motion.span
        className="block"
        initial={false}
        animate={{ y: show ? "0%" : "108%" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Clean clip reveal for a block (an image, usually): opens from the bottom edge, once. */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const show = !motionOk || inView;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ clipPath: show ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.3, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Opacity and a short rise, for a single block that should arrive after its neighbours. */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = !motionOk || inView;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 22 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Gentle depth: the child drifts a few percent against the scroll. The container clips it and
 * the child is oversized so no edge ever shows. Off for reduced motion.
 */
export function Parallax({
  children,
  className,
  amount = 7,
}: {
  children: ReactNode;
  className?: string;
  /** percent of the container height the child travels either way */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        className="h-full w-full"
        style={motionOk ? { y, scale: 1 + (amount * 2.4) / 100 } : {}}
      >
        {children}
      </motion.div>
    </div>
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
