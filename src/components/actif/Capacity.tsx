import { motion, useReducedMotion } from "motion/react";
import { SectionHeader, AnimatedCounter } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Capacity() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-sand py-32 md:py-48">
      <div className="absolute inset-0 bg-gradient-ivory opacity-60 pointer-events-none" />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="08 — MANUFACTURING CAPACITY"
          headline="Scale that flexes to your programme."
          className="mb-24"
        />

        <div className="grid gap-16 md:grid-cols-3 md:gap-10">
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 30 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="flex flex-col items-start border-l border-charcoal/20 pl-8"
          >
            <div className="display text-6xl text-charcoal sm:text-7xl lg:text-8xl">
              <AnimatedCounter value={150} />
            </div>
            <p className="label-eyebrow mt-4 text-charcoal-soft">Greige fabric / month (MT)</p>
          </motion.div>

          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 30 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="flex flex-col items-start border-l border-charcoal/20 pl-8"
          >
            <div className="display text-6xl text-charcoal sm:text-7xl lg:text-8xl">
              <AnimatedCounter value={50} />
            </div>
            <p className="label-eyebrow mt-4 text-charcoal-soft">Finished fabric / month (MT)</p>
          </motion.div>

          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 30 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="flex flex-col items-start border-l border-charcoal/20 pl-8"
          >
            <div className="display text-6xl text-charcoal sm:text-7xl lg:text-8xl">
              <AnimatedCounter value={5} />
            </div>
            <p className="label-eyebrow mt-4 text-charcoal-soft">Containers / month</p>
          </motion.div>
        </div>

        <div className="mt-32 grid gap-10 md:grid-cols-2">
          <motion.div
            initial={reduced ? {} : { opacity: 0 }}
            whileInView={reduced ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
          >
            <h4 className="text-xl text-charcoal">Flexible Scaling</h4>
            <p className="body-copy mt-2">Capacity that grows with your orders.</p>
          </motion.div>

          <motion.div
            initial={reduced ? {} : { opacity: 0 }}
            whileInView={reduced ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
          >
            <h4 className="text-xl text-charcoal">Fast Production Response</h4>
            <p className="body-copy mt-2">Rapid turnaround from sample to bulk.</p>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
          className="mt-32"
        >
          <p className="display text-3xl text-sage sm:text-4xl md:text-5xl">
            Integrated knit-to-pack capacity — scaled to your programme, delivered on time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
