import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Leaf, Scale, Users } from "lucide-react";
import { Reveal, Section, SectionLabel, Watermark } from "./primitives";
import { TextileBackground } from "./TextileBackground";

const PILLARS = [
  {
    key: "environmental",
    label: "Environmental",
    icon: Leaf,
    items: [
      "Solar & Wind Energy",
      "Water Stewardship",
      "Green Chemical Processing",
      "Responsible Waste",
      "Sustainable Materials",
    ],
  },
  {
    key: "social",
    label: "Social",
    icon: Users,
    items: [
      "Safe Workplace",
      "Ethical Labour",
      "Skill Development",
      "Employee Wellbeing",
      "Consumer Safety",
    ],
  },
  {
    key: "governance",
    label: "Governance",
    icon: Scale,
    items: [
      "Global Compliance",
      "Supply Chain Transparency",
      "Digital Product Passport",
      "Traceability Systems",
      "Continuous Improvement",
    ],
  },
];

function OrganicDrift({ index }: { index: number }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 400 120"
      aria-hidden
      className="absolute inset-0 h-full w-full text-on-forest/25"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.path
          key={i}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5}
          d={`M0 ${20 + i * 20} C 100 ${8 + i * 22 + index * 3}, 280 ${34 + i * 18}, 400 ${16 + i * 21}`}
          initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.circle
          key={`p-${i}`}
          r={0.9}
          fill="currentColor"
          cx={(i * 29) % 400}
          cy={12 + ((i * 37) % 96)}
          animate={reduced ? undefined : { cy: [12 + ((i * 37) % 96), 6 + ((i * 23) % 100)] }}
          transition={{
            duration: 14 + (i % 5) * 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

export function ESGSection() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="sustainability" className="bg-forest text-on-forest">
      <TextileBackground palette="forest" density={14} opacity={0.3} />
      <Watermark tone="light" className="bottom-0" />
      <div className="relative mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-36">
        <SectionLabel index="03" title="ESG integrated manufacturing" tone="light" />
        <h2 className="display mt-8 max-w-4xl text-[2.5rem] leading-[1.02] text-on-forest sm:text-6xl lg:text-[4.4rem]">
          Sustainability, engineered into every column.
        </h2>

        <div className="mt-16 lg:mt-24">
          {PILLARS.map((pillar, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={pillar.key} delay={i * 0.08}>
                <div
                  onMouseEnter={() => setOpen(i)}
                  className="group relative border-t border-on-forest/15 last:border-b"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="relative flex w-full items-center gap-6 py-8 text-left md:py-10"
                  >
                    <span className="label-eyebrow w-10 shrink-0 text-champagne">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <pillar.icon
                      className={`h-6 w-6 shrink-0 transition-all duration-700 ${
                        isOpen ? "text-champagne" : "text-on-forest-muted"
                      }`}
                      strokeWidth={0.9}
                    />
                    <span
                      className={`display flex-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? "text-[2.2rem] text-on-forest sm:text-[3.4rem]"
                          : "text-[1.8rem] text-on-forest/60 sm:text-[2.6rem]"
                      }`}
                    >
                      {pillar.label}
                    </span>
                    <span
                      className={`hidden h-px transition-all duration-700 md:block ${
                        isOpen ? "w-24 bg-champagne" : "w-10 bg-on-forest/30"
                      }`}
                    />
                  </button>

                  <div
                    className={`grid overflow-hidden transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "max-h-[36rem] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="relative pb-12 pl-0 md:pl-16">
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-60">
                        <OrganicDrift index={i} />
                      </div>
                      <ul className="relative grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pillar.items.map((item, j) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, y: 14 }}
                            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                            transition={{ duration: 0.9, delay: 0.1 + j * 0.07 }}
                            className="flex items-baseline gap-3 border-b border-on-forest/10 pb-3 text-on-forest/85"
                          >
                            <span className="h-1 w-1 shrink-0 translate-y-[-3px] rounded-full bg-champagne" />
                            <span className="text-base tracking-wide">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="display mt-16 max-w-3xl text-2xl italic text-champagne sm:text-3xl">
            ESG is embedded into every stage of manufacturing — not added afterwards.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
