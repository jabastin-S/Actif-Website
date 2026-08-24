import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  Boxes,
  Droplets,
  Layers3,
  Scissors,
  Ship,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionLabel } from "./primitives";

const STAGES: { no: string; title: string; icon: LucideIcon }[] = [
  { no: "01", title: "Responsible Fibres", icon: Sprout },
  { no: "02", title: "Knitting", icon: Layers3 },
  { no: "03", title: "Green Dyeing", icon: Droplets },
  { no: "04", title: "Functional Finishing", icon: Sparkles },
  { no: "05", title: "Cut & Sew", icon: Scissors },
  { no: "06", title: "Responsible Packaging", icon: Boxes },
  { no: "07", title: "Global Delivery", icon: Ship },
];

export function ManufacturingJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 45%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="manufacturing" className="bg-ivory">
      <div ref={ref} className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-36">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
          <SectionLabel index="04" title="Sustainable manufacturing journey" />
          <h2 className="display text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.8rem]">
            From responsible fibre to global delivery.
          </h2>
        </div>

        {/* Desktop / tablet: horizontal journey */}
        <div className="relative mt-24 hidden md:block">
          <div className="absolute left-0 right-0 top-[42px] h-px bg-border" />
          <motion.div
            className="absolute left-0 right-0 top-[42px] h-px origin-left bg-gold"
            style={reduced ? { scaleX: 1 } : { scaleX: lineScale }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[38px] h-[5px] w-[5px] rounded-full bg-gold"
            animate={reduced ? undefined : { left: ["0%", "100%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />
          <div className="grid grid-cols-7 gap-3">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.no}
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                animate={inView && !reduced ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1, delay: 0.25 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col items-start"
              >
                <span className="label-eyebrow text-charcoal-soft">{stage.no}</span>
                <span className="relative mt-4 flex h-6 w-6 items-center justify-center">
                  <span className="absolute h-6 w-6 rounded-full border border-gold/40 transition-transform duration-700 group-hover:scale-125" />
                  <span className="h-[7px] w-[7px] rounded-full bg-forest" />
                </span>
                <stage.icon
                  className="mt-8 h-6 w-6 text-charcoal-soft transition-all duration-700 group-hover:-translate-y-1 group-hover:text-forest"
                  strokeWidth={0.9}
                />
                <p className="display mt-4 text-xl leading-tight text-charcoal lg:text-[1.55rem]">
                  {stage.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical journey */}
        <div className="relative mt-16 md:hidden">
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-border" />
          <motion.div
            className="absolute left-[11px] top-2 w-px origin-top bg-gold"
            style={reduced ? { scaleY: 1, bottom: 8 } : { scaleY: lineScale, bottom: 8 }}
          />
          <div className="flex flex-col gap-10">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.no}
                initial={reduced ? undefined : { opacity: 0, x: 16 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-start gap-6 pl-10"
              >
                <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center">
                  <span className="absolute h-6 w-6 rounded-full border border-gold/40" />
                  <span className="h-[7px] w-[7px] rounded-full bg-forest" />
                </span>
                <div>
                  <span className="label-eyebrow text-charcoal-soft">{stage.no}</span>
                  <p className="display mt-2 text-2xl text-charcoal">{stage.title}</p>
                </div>
                <stage.icon className="ml-auto h-5 w-5 text-charcoal-soft" strokeWidth={0.9} />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="display mt-20 max-w-3xl text-xl italic text-charcoal-soft sm:text-2xl">
          Every stage is ESG-controlled — traceable, responsible and audited end to end.
        </p>
      </div>
    </Section>
  );
}
