import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number | undefined;
  y?: number | undefined;
  className?: string | undefined;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? {} : { opacity: 0, y }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.15, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Mask reveal: content slides up from behind a clipping edge. */
export function MaskReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number | undefined;
  className?: string | undefined;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span
        className="block"
        initial={reduced ? {} : { y: "110%" }}
        whileInView={reduced ? {} : { y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.3, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Word-by-word stagger for major statements only. */
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string | undefined;
  delay?: number | undefined;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduced ? {} : { y: "105%", opacity: 0 }}
            whileInView={reduced ? {} : { y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1.1, delay: delay + i * 0.055, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionLabel({
  index,
  title,
  tone = "dark",
  className,
}: {
  index: string;
  title: string;
  tone?: "dark" | "light" | undefined;
  className?: string | undefined;
}) {
  return (
    <Reveal className={className}>
      <div
        className={cn(
          "label-eyebrow flex items-center gap-4",
          tone === "light" ? "text-on-forest-muted" : "text-charcoal-soft",
        )}
      >
        <span className={cn(tone === "light" ? "text-champagne" : "text-gold")}>{index}</span>
        <span
          className={cn(
            "h-px w-10",
            tone === "light" ? "bg-on-forest-muted/50" : "bg-charcoal-soft/40",
          )}
        />
        <span>{title}</span>
      </div>
    </Reveal>
  );
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2200,
  className,
}: {
  value: number;
  suffix?: string | undefined;
  duration?: number | undefined;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

/** Oversized ACTIF wordmark watermark — always behind content, never dominant. */
export function Watermark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light" | undefined;
  className?: string | undefined;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 select-none overflow-hidden",
        className,
      )}
    >
      <span
        className={cn(
          "display block whitespace-nowrap text-[26vw] leading-none tracking-[0.06em]",
          tone === "light" ? "text-on-forest/[0.045]" : "text-charcoal/[0.04]",
        )}
      >
        ACTIF
      </span>
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section id={id} className={cn("relative w-full overflow-hidden", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  label,
  headline,
  className,
  tone = "dark",
}: {
  label: string;
  headline: string;
  className?: string | undefined;
  tone?: "dark" | "light" | undefined;
}) {
  const labelParts = label.split(" — ");
  const index = labelParts[0] || "";
  const title = labelParts[1] || "";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SectionLabel index={index} title={title} tone={tone} />
      <h2
        className={cn(
          "display max-w-4xl text-4xl sm:text-5xl lg:text-6xl",
          tone === "dark" ? "text-charcoal" : "text-on-forest",
        )}
      >
        <WordReveal text={headline} />
      </h2>
    </div>
  );
}
