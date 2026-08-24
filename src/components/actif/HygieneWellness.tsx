import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const CAPABILITIES = [
  {
    title: "Chemical-Free Antimicrobial",
    description: "Protection without harsh chemistry.",
  },
  {
    title: "Lifetime Durable",
    description: "Performance that lasts wash after wash.",
  },
  {
    title: "Odour Control",
    description: "Fresher fabrics, naturally.",
  },
  {
    title: "Skin Friendly",
    description: "Gentle enough for the whole family.",
  },
  {
    title: "Sustainable Technology",
    description: "Responsible, low-impact finishing.",
  },
  {
    title: "Home & Hospitality",
    description: "Trusted across homes and hotels.",
  },
];

export function HygieneWellness() {
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] bg-sand py-32 overflow-hidden md:py-48">
      {/* Background with slow floating effect and linen texture */}
      <div className="absolute inset-0 linen-veil bg-gradient-ivory opacity-50" />
      <motion.div
        className="absolute -inset-[20%] animate-breathe pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, var(--bone) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="06 — HYGIENE & WELLNESS"
          headline="More than comfort — textiles that care for you."
          className="mb-24"
        />

        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-24">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={reduced ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
              className="group flex flex-col gap-4"
            >
              <div className="h-px w-full bg-charcoal/10 relative overflow-hidden">
                <div className="absolute inset-0 h-full w-full bg-sage -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </div>
              <h3 className="display text-3xl text-charcoal">{cap.title}</h3>
              <p className="body-copy max-w-sm">{cap.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.95 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: EASE }}
          className="mt-32 text-center"
        >
          <p className="display text-4xl text-sage md:text-6xl lg:text-7xl">
            Cleaner Textiles. <br className="md:hidden" /> Healthier Living.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
