import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const SDGS = [
  { id: "06", title: "Water Stewardship", color: "#26BDE2" },
  { id: "07", title: "Renewable Energy", color: "#FCC30B" },
  { id: "08", title: "Safe & Ethical Employment", color: "#A21942" },
  { id: "09", title: "Manufacturing Innovation", color: "#FD6925" },
  { id: "12", title: "Responsible Production", color: "#BF8B2E" },
  { id: "13", title: "Climate Action", color: "#3F7E44" },
];

export function SDGSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-ivory py-32 md:py-48">
      <div className="absolute inset-0 knit-grain opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="11 — UN SUSTAINABLE DEVELOPMENT GOALS"
          headline="Advancing six UN Global Goals."
          className="mb-24"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SDGS.map((sdg, i) => (
            <motion.div
              key={sdg.id}
              initial={reduced ? undefined : { opacity: 0, scale: 0.95 }}
              whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              className="group relative flex aspect-square flex-col justify-between overflow-hidden bg-bone p-8 transition-all duration-700 hover:scale-[1.02]"
            >
              {/* Subtle background block using the official SDG color, heavily muted */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-10"
                style={{ backgroundColor: sdg.color }}
              />

              <div
                className="absolute top-0 left-0 w-2 h-full transition-transform duration-700 origin-top scale-y-0 group-hover:scale-y-100"
                style={{ backgroundColor: sdg.color }}
              />

              <div className="relative z-10">
                <span className="label-eyebrow text-charcoal/50">SDG {sdg.id}</span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="display text-3xl text-charcoal sm:text-4xl">{sdg.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="mt-24"
        >
          <p className="text-xl tracking-wide text-charcoal-soft lg:text-2xl">
            Every product contributes to a more responsible textile value chain.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
