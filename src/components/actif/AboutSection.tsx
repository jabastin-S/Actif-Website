import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import drape from "@/assets/textile-drape.jpg";
import { MaskReveal, Reveal, Section, SectionLabel, Watermark } from "./primitives";

const CAPABILITIES = [
  {
    title: "Integrated Knit-to-Pack",
    copy: "One roof — from yarn to finished pack.",
  },
  { title: "Sustainability by Design", copy: "Responsible fibres, energy & chemistry." },
  { title: "Export-Focused", copy: "Built for Australia, Europe & USA." },
  { title: "Global Compliance", copy: "Audited to international standards." },
  { title: "Renewable Energy", copy: "Solar & wind-powered production." },
  { title: "Flexible Solutions", copy: "Programmes tailored to each brand." },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const fabricY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const fabricScale = useTransform(scrollYProgress, [0, 1], [1.14, 1.02]);

  return (
    <Section id="about" className="bg-ivory">
      <Watermark className="-top-10 opacity-90" />
      <div
        ref={ref}
        className="relative mx-auto grid max-w-[1600px] gap-14 px-6 py-28 md:px-10 md:py-36 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20"
      >
        <div className="relative h-[62vh] min-h-[380px] overflow-hidden lg:h-auto lg:min-h-[640px]">
          <motion.img
            src={drape}
            alt="Knitted bed-linen fabric draped in soft sage and sand folds"
            width={1200}
            height={1600}
            loading="lazy"
            className="h-full w-full object-cover"
            style={reduced ? undefined : { y: fabricY, scale: fabricScale }}
          />
          <div className="linen-veil absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ivory/70 to-transparent p-6">
            <p className="label-eyebrow text-charcoal">Tirupur · Tamil Nadu · India</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <SectionLabel index="01" title="Who we are" />

          <h2 className="display mt-8 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.2rem]">
            <MaskReveal>Your trusted knitted</MaskReveal>
            <MaskReveal delay={0.08}>home textile</MaskReveal>
            <MaskReveal delay={0.16}>
              <span className="italic text-charcoal-soft">manufacturing partner.</span>
            </MaskReveal>
          </h2>

          <Reveal delay={0.15}>
            <p className="body-copy mt-10 max-w-xl text-lg">
              A vertically integrated knit-to-pack manufacturer delivering premium,
              responsibly-made knitted bed linen for global brands.
            </p>
          </Reveal>

          <div className="mt-14 border-t border-border">
            {CAPABILITIES.map((item, i) => (
              <Reveal key={item.title} delay={0.04 * i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex w-full items-baseline gap-6 border-b border-border py-5 text-left transition-colors duration-500 hover:bg-bone/60"
                >
                  <span className="label-eyebrow w-8 shrink-0 text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`display block text-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-[1.9rem] ${
                        active === i ? "translate-x-2 text-charcoal" : "text-charcoal/80"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`block overflow-hidden text-sm text-charcoal-soft transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active === i ? "mt-2 max-h-12 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.copy}
                    </span>
                  </span>
                  <span
                    className={`h-px transition-all duration-700 ${
                      active === i ? "w-10 bg-gold" : "w-4 bg-border"
                    }`}
                  />
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="display mt-12 text-xl italic text-charcoal-soft sm:text-2xl">
              Responsibly manufactured in Tirupur — India&rsquo;s Knitwear Capital.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
