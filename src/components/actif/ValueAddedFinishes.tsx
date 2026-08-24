import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    id: "01",
    title: "Soil Release",
    desc: "Stains lift out with ease.",
    color: "var(--dusty-blue)",
  },
  {
    id: "02",
    title: "Moisture Management",
    desc: "Wicks and dries efficiently.",
    color: "var(--eucalyptus)",
  },
  {
    id: "03",
    title: "Soft Finish",
    desc: "Luxurious hand-feel.",
    color: "var(--champagne)",
  },
  {
    id: "04",
    title: "Easy Care",
    desc: "Low-maintenance, long-lasting.",
    color: "var(--bone)",
  },
  {
    id: "05",
    title: "Sustainable Finishing",
    desc: "Low-impact, responsible chemistry.",
    color: "var(--sage)",
  },
  {
    id: "06",
    title: "Customer-Specific",
    desc: "Bespoke functional finishes on request.",
    color: "var(--terracotta)",
  },
];

export function ValueAddedFinishes() {
  const reduced = useReducedMotion();
  const [activeFeature, setActiveFeature] = useState(FEATURES[0]);

  return (
    <section className="relative min-h-[100svh] bg-ivory py-32 overflow-hidden md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="07 — VALUE-ADDED FINISHES"
          headline="Functional finishing, engineered to specification."
          className="mb-20"
        />

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-6">
            {FEATURES.map((feature, i) => {
              const isActive = activeFeature.id === feature.id;
              return (
                <motion.button
                  key={feature.id}
                  onMouseEnter={() => setActiveFeature(feature)}
                  onClick={() => setActiveFeature(feature)}
                  initial={reduced ? undefined : { opacity: 0, x: -20 }}
                  whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                  className={cn(
                    "group flex flex-col items-start gap-2 border-l-2 py-4 pl-6 text-left transition-all duration-500",
                    isActive ? "border-sage" : "border-charcoal/10 hover:border-charcoal/30",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="label-eyebrow text-charcoal/40">{feature.id}</span>
                    <h3
                      className={cn(
                        "display text-3xl transition-colors duration-500 sm:text-4xl",
                        isActive ? "text-sage" : "text-charcoal group-hover:text-charcoal/70",
                      )}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="body-copy mt-2 max-w-sm pl-11"
                      >
                        {feature.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: EASE }}
            className="relative flex items-center justify-center lg:h-[70vh] min-h-[400px] overflow-hidden rounded-3xl bg-bone"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center"
                style={{ backgroundColor: activeFeature.color }}
              >
                {/* Abstract textile visual placeholder based on color */}
                <div className="absolute inset-0 knit-grain opacity-20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                <h4 className="display relative z-10 text-5xl text-charcoal/80">
                  {activeFeature.title}
                </h4>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="mt-24 text-xl tracking-wide text-charcoal-soft lg:text-2xl"
        >
          Tailored performance for every programme and market.
        </motion.p>
      </div>
    </section>
  );
}
