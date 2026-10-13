import { animate, motion, useMotionValue, useScroll, useTransform, type MotionStyle } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE, EASE_STEADY, useMedia, useReached } from "@/lib/motion-hooks";
import { useMotionOk } from "@/lib/use-motion-ok";
import { cn } from "@/lib/utils";

/* ---------- Text ---------- */

/**
 * One line of a heading lifted into view from behind a mask. Content is visible by default
 * (server render, no-JS, reduced motion); it is only hidden after hydration when motion is OK.
 * `immediate` lines (the hero) run as CSS keyframes from the first paint instead, so the
 * entrance plays before hydration and still ends visible if scripts fail.
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
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionOk = useMotionOk();
  const inView = useReached(ref, 0.92);
  const mask = cn("block overflow-hidden pb-[0.16em] -mb-[0.16em]", className);
  if (immediate) {
    return (
      <span className={mask}>
        <span
          className="block [animation:line-in_1.05s_var(--ease-out)_both]"
          style={{ animationDelay: `${delay}s` }}
        >
          {children}
        </span>
      </span>
    );
  }
  const show = !motionOk || inView;
  return (
    <span ref={ref} className={mask}>
      <motion.span
        className="block"
        initial={false}
        animate={{ y: show ? "0%" : "125%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ---------- Images ---------- */

/**
 * Clip reveal for a photograph: the frame opens from its top edge while the picture inside
 * settles from a slight enlargement (see `[data-reveal]` in styles.css). Once.
 */
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
  const inView = useReached(ref, 0.88);
  const show = !motionOk || inView;
  return (
    <motion.div
      ref={ref}
      data-reveal={show ? "shown" : "hidden"}
      className={className}
      initial={false}
      animate={{ clipPath: show ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Course reveal, the site's signature for knit close-ups: the fabric forms from the bottom up,
 * with a band of fine stitch rows running ahead of the solid edge, as courses come off a knitting
 * machine. Driven by the `--course` variable (0 to 1) read by `.course-mask` in styles.css.
 */
export function CourseReveal({
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
  const reached = useReached(ref, 0.86);
  const course = useMotionValue(1);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!motionOk) return;
    if (!reached) {
      course.set(0);
      return;
    }
    const controls = animate(course, 1, {
      duration: 1.4,
      delay,
      ease: EASE_STEADY,
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [motionOk, reached, delay, course]);
  const running = motionOk && !done;
  return (
    <motion.div
      ref={ref}
      data-course={running ? "run" : "done"}
      data-reveal={motionOk && !reached ? "hidden" : "shown"}
      className={cn("course-mask", className)}
      style={{ "--course": course } as unknown as MotionStyle}
    >
      {children}
    </motion.div>
  );
}

/** Opacity and a short rise, for members of a list arriving as a list. */
export function Rise({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const motionOk = useMotionOk();
  const inView = useReached(ref, 0.92);
  const show = !motionOk || inView;
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      ref={ref}
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 18 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Scroll-linked depth ---------- */

/**
 * Gentle depth: the child drifts a few percent against the scroll. The container clips it and
 * the child is oversized so no edge ever shows. Halved on narrow screens, off for reduced motion.
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
  const wide = useMedia("(min-width: 768px)");
  const travel = wide ? amount : amount / 2;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        className="h-full w-full"
        style={motionOk ? { y, scale: 1 + (travel * 1.6) / 100 } : {}}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * A plate that becomes the room: the frame starts inset from the page edges and opens to full
 * bleed as it rises to the top of the viewport, while the picture inside eases back from a slight
 * enlargement. Tablet and up only; static for reduced motion. `media` is the picture layer.
 */
export function ScrollExpand({
  media,
  children,
  className,
  inset = 4,
}: {
  media: ReactNode;
  children?: ReactNode;
  className?: string;
  /** starting inset, percent of the width on each side */
  inset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const wide = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [`inset(0% ${inset}% 0% ${inset}%)`, "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.07, 1]);
  const live = motionOk && wide;
  return (
    <motion.div ref={ref} className={className} style={live ? { clipPath } : {}}>
      <motion.div className="absolute inset-0" style={live ? { scale } : {}}>
        {media}
      </motion.div>
      {children}
    </motion.div>
  );
}
