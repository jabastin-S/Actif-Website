import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const CERTIFICATIONS = [
  {
    category: "Environmental",
    certs: ["GOTS", "OEKO-TEX"],
  },
  {
    category: "Social",
    certs: ["SEDEX"],
  },
  {
    category: "Chemical",
    certs: ["ZDHC"],
  },
  {
    category: "Quality",
    certs: ["Company Standards"],
  },
  {
    category: "Digital Readiness",
    certs: ["DPP Ready", "Traceability Enabled"],
  },
];

export function Certifications() {
  const reduced = useReducedMotion();

  return (
    <section id="certifications" className="relative bg-bone py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="10 — GLOBAL CERTIFICATIONS"
          headline="Independently certified, end to end."
          className="mb-24"
        />

        <div className="grid gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
          {CERTIFICATIONS.map((group, i) => (
            <motion.div
              key={group.category}
              initial={reduced ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
              className="flex flex-col"
            >
              <div className="h-px w-full bg-charcoal/20 mb-8" />
              <h3 className="label-eyebrow text-charcoal/50 mb-6">{group.category}</h3>
              <ul className="flex flex-col gap-4">
                {group.certs.map((cert) => (
                  <li key={cert} className="display text-3xl text-charcoal sm:text-4xl">
                    {cert}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
