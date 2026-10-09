import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PROCESS } from "@/content/site";
import { Fade, MaskLine, Swatch, type Structure } from "./primitives";
import { StageMotion } from "./StageMotion";

/** Fibre to freight: swatch tint and structure travel from raw to finished. */
const STAGE_SWATCH: { structure: Structure; tint: string }[] = [
  { structure: "rib", tint: "var(--sand)" },
  { structure: "jersey", tint: "var(--greige)" },
  { structure: "jersey", tint: "var(--dusty-blue)" },
  { structure: "waffle", tint: "var(--celadon)" },
  { structure: "jersey", tint: "var(--rose)" },
  { structure: "mesh", tint: "var(--sand)" },
  { structure: "rib", tint: "var(--bleach)" },
];

function StageCard({ index, className }: { index: number; className?: string }) {
  const stage = PROCESS[index];
  const swatch = STAGE_SWATCH[index];
  if (!stage || !swatch) return null;
  return (
    <article className={className}>
      <div className="pinked-bottom relative h-44 overflow-hidden md:h-56 lg:h-[46vh] lg:max-h-[24rem]">
        <Swatch structure={swatch.structure} tint={swatch.tint} scale={1.25} />
        <StageMotion index={index} />
      </div>
      <div className="mt-6 flex items-baseline gap-5">
        <span className="display text-[2.4rem] leading-none text-cochineal-lite tabular">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="display text-[clamp(1.7rem,2.4vw,2.4rem)] leading-[1.05]">{stage.title}</h3>
      </div>
      <p className="mt-3 max-w-[38ch] text-[0.95rem] text-on-indigo-soft">{stage.body}</p>
    </article>
  );
}

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const thread = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="manufacturing"
      ref={sectionRef}
      data-tone="dark"
      className="relative bg-indigo text-on-indigo"
    >
      {/* Desktop: pinned sideways journey */}
      <div
        className="hidden lg:block"
        style={{ height: `calc(100svh + ${distance}px)` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <motion.div ref={trackRef} className="flex items-start gap-16 pr-[var(--gutter)] pl-[var(--gutter)]" style={{ x }}>
            <div className="w-[min(34rem,36vw)] shrink-0">
              <h2 className="display text-[clamp(2.6rem,5vw,4.6rem)]">
                <MaskLine>From fibre</MaskLine>
                <MaskLine delay={0.08}>to freight.</MaskLine>
              </h2>
              <p className="mt-8 max-w-[34ch] text-on-indigo-soft">
                Seven stages, one team. Keep scrolling and the cloth moves from raw yarn to a
                finished pack.
              </p>
            </div>
            {PROCESS.map((stage, index) => (
              <StageCard key={stage.title} index={index} className="w-[26rem] shrink-0 xl:w-[30rem]" />
            ))}
            <div className="w-[min(26rem,28vw)] shrink-0">
              <p className="display text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.1]">
                Every stage is ESG-controlled: traceable and responsible, end to end.
              </p>
              <a href="#contact" className="btn-label mt-10 text-on-indigo [--btn-fill:var(--on-indigo)] hover:text-indigo">
                Start a programme
              </a>
            </div>
          </motion.div>

          <div aria-hidden className="absolute inset-x-[var(--gutter)] bottom-10 h-px bg-on-indigo/20">
            <motion.div className="h-px origin-left bg-cochineal-lite" style={{ scaleX: thread }} />
          </div>
        </div>
      </div>

      {/* Tablet and mobile: vertical list */}
      <div className="shell py-24 md:py-32 lg:hidden">
        <h2 className="display text-[clamp(2.4rem,9vw,4rem)]">
          <MaskLine>From fibre</MaskLine>
          <MaskLine delay={0.08}>to freight.</MaskLine>
        </h2>
        <ol className="mt-12 grid gap-14 md:grid-cols-2 md:gap-x-10">
          {PROCESS.map((stage, index) => (
            <Fade as="li" key={stage.title}>
              <StageCard index={index} />
            </Fade>
          ))}
        </ol>
        <p className="display mt-16 max-w-xl text-[1.7rem] leading-[1.15]">
          Every stage is ESG-controlled: traceable and responsible, end to end.
        </p>
      </div>
    </section>
  );
}
