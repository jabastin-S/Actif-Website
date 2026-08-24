import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const ITEMS = [
  { requirement: "ESG", capability: "Integrated Operations" },
  { requirement: "DPP", capability: "Ready & Enabled" },
  { requirement: "Traceability", capability: "End-to-end Visibility" },
  { requirement: "Chemical Safety", capability: "Green Chemistry" },
  { requirement: "Sustainability", capability: "Renewable Energy" },
  { requirement: "Compliance", capability: "International Standards" },
  { requirement: "Consumer Safety", capability: "Chemical-Free Antimicrobial" },
];

export function SupplyChain() {
  const reduced = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="capabilities" className="relative bg-ivory py-32 md:py-48">
      <div className="absolute inset-0 knit-grain opacity-40 pointer-events-none" />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="05 — FUTURE-READY SUPPLY CHAIN"
          headline="Built for tomorrow's global supply chains."
          className="mb-24"
        />

        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col border-t border-charcoal/10">
            {ITEMS.map((item, i) => (
              <motion.div
                key={item.requirement}
                className="group relative flex flex-col justify-between border-b border-charcoal/10 py-8 transition-colors hover:bg-bone/40 sm:flex-row sm:items-center sm:py-12 md:px-8"
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-6 sm:w-1/2">
                  <span className="label-eyebrow text-charcoal/40 transition-colors group-hover:text-charcoal/70">
                    Requirement
                  </span>
                  <span className="display text-3xl text-charcoal sm:text-4xl md:text-5xl">
                    {item.requirement}
                  </span>
                </div>

                {/* Animated connector line */}
                <div className="hidden flex-1 sm:block relative mx-8">
                  <div className="h-px w-full bg-charcoal/10" />
                  <motion.div
                    className="absolute inset-0 h-px bg-sage origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                  <motion.div
                    className="absolute top-1/2 -mt-1 h-2 w-2 rounded-full bg-sage"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={
                      hoveredIndex === i ? { left: "100%", opacity: 1 } : { left: "0%", opacity: 0 }
                    }
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-6 sm:mt-0 sm:w-1/2 sm:justify-end">
                  <span className="label-eyebrow text-sage/70 transition-colors group-hover:text-sage">
                    Actif Capability
                  </span>
                  <span className="text-xl font-light tracking-wide text-charcoal-soft transition-colors group-hover:text-charcoal md:text-2xl">
                    {item.capability}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
