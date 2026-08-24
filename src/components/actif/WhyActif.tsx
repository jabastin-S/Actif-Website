import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  Fingerprint,
  Globe2,
  Layers,
  ScanLine,
  ShieldCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Section, SectionLabel } from "./primitives";

type Item = {
  title: string;
  copy: string;
  icon: LucideIcon;
  tint: string;
  motif: "loops" | "weave" | "grid" | "rings" | "dash" | "flow";
};

const ITEMS: Item[] = [
  {
    title: "Sustainability Integrated",
    copy: "Embedded across every process, not added later.",
    icon: Layers,
    tint: "bg-eucalyptus/35",
    motif: "loops",
  },
  {
    title: "Global Compliance",
    copy: "Audited to international standards, end to end.",
    icon: Globe2,
    tint: "bg-dusty-blue/30",
    motif: "grid",
  },
  {
    title: "DPP & Traceability Ready",
    copy: "Digital Product Passport and full traceability.",
    icon: ScanLine,
    tint: "bg-teal-muted/25",
    motif: "dash",
  },
  {
    title: "Chemical-Free Hygiene",
    copy: "Antimicrobial protection without harsh chemistry.",
    icon: ShieldCheck,
    tint: "bg-sage/35",
    motif: "rings",
  },
  {
    title: "Quick Turnaround",
    copy: "Rapid response from sample to bulk.",
    icon: Timer,
    tint: "bg-champagne/45",
    motif: "flow",
  },
  {
    title: "Flexible Capacity",
    copy: "Scales up and down with your programme.",
    icon: Fingerprint,
    tint: "bg-rose-dust/30",
    motif: "weave",
  },
];

function Motif({ kind }: { kind: Item["motif"] }) {
  const reduced = useReducedMotion();
  const stroke = "currentColor";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 0.6,
    vectorEffect: "non-scaling-stroke" as const,
  };
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-charcoal/45" aria-hidden>
      {kind === "loops" &&
        Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 9 }).map((__, c) => (
            <path
              key={`${r}-${c}`}
              {...common}
              d={`M${6 + c * 11} ${8 + r * 11} c 3 -6 8 -6 11 0 c -3 6 -8 6 -11 0`}
            />
          )),
        )}
      {kind === "weave" &&
        Array.from({ length: 14 }).map((_, i) => (
          <g key={i}>
            <line {...common} x1={i * 7.5} y1={0} x2={i * 7.5} y2={100} />
            <line {...common} x1={0} y1={i * 7.5} x2={100} y2={i * 7.5} opacity={0.5} />
          </g>
        ))}
      {kind === "grid" &&
        Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} {...common} cx={50} cy={50} r={6 + i * 5.6} />
        ))}
      {kind === "rings" &&
        Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} {...common} cx={50} cy={50} rx={12 + i * 7} ry={30 + i * 5} />
        ))}
      {kind === "dash" &&
        Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            {...common}
            strokeDasharray="3 5"
            x1={0}
            y1={i * 6}
            x2={100}
            y2={i * 6 + 4}
          />
        ))}
      {kind === "flow" &&
        Array.from({ length: 12 }).map((_, i) => (
          <motion.path
            key={i}
            {...common}
            d={`M0 ${8 + i * 8} C 25 ${i * 8}, 60 ${16 + i * 8}, 100 ${6 + i * 8}`}
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={reduced ? undefined : { pathLength: 1 }}
            transition={{ duration: 2.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
    </svg>
  );
}

export function WhyActif() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = ITEMS[active];
  const Icon = current.icon;

  return (
    <Section id="why-actif" className="knit-grain bg-bone">
      <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-36">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
          <SectionLabel index="02" title="Why Actif" />
          <h2 className="display text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.8rem]">
            Beyond manufacturing — a partner built for what&rsquo;s next.
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            {ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group block w-full border-b border-charcoal/10 py-6 text-left first:border-t"
                >
                  <div className="flex items-center gap-5">
                    <span
                      className={`label-eyebrow shrink-0 transition-colors duration-500 ${
                        active === i ? "text-gold" : "text-charcoal-soft/60"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`display flex-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active === i
                          ? "translate-x-1 text-[2rem] text-charcoal sm:text-[2.6rem]"
                          : "text-[1.6rem] text-charcoal/55 sm:text-[2rem]"
                      }`}
                    >
                      {item.title}
                    </span>
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-all duration-700 ${
                        active === i
                          ? "translate-x-0 text-charcoal opacity-100"
                          : "translate-x-3 opacity-0"
                      }`}
                      strokeWidth={1}
                    />
                  </div>
                  <div
                    className={`overflow-hidden pl-11 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active === i ? "mt-3 max-h-16 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="body-copy text-base">{item.copy}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden lg:sticky lg:top-28 lg:aspect-auto lg:h-[34rem]">
            <AnimatePresence mode="sync">
              <motion.div
                key={active}
                className={`absolute inset-0 ${current.tint}`}
                initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute inset-0 p-10 opacity-70">
                  <Motif kind={current.motif} />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8">
              <div>
                <Icon className="h-7 w-7 text-charcoal" strokeWidth={0.9} />
                <p className="display mt-4 max-w-[16ch] text-2xl leading-tight text-charcoal">
                  {current.title}
                </p>
              </div>
              <span className="display text-6xl text-charcoal/25">
                {String(active + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
