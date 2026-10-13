import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { COMPANY } from "@/content/site";
import { useMotionOk } from "@/lib/use-motion-ok";
import { ImageNote } from "./ImageNote";
import { MaskLine } from "./motion";
import { Picture } from "./Picture";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const motionOk = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-charcoal text-on-dark"
    >
      <motion.div className="absolute inset-0 -z-10" style={motionOk ? { y: imageY } : {}}>
        <Picture
          name="heroKnit"
          priority
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover object-[28%_center] [animation:hero-settle_2.4s_var(--ease-out)_both]"
        />
        {/* legibility scrim for the headline */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-charcoal/45" />
      </motion.div>

      <ImageNote className="right-4 bottom-4 left-auto md:right-28 md:bottom-5" />
      <motion.div className="shell relative pb-10 md:pb-14" style={motionOk ? { y: textY } : {}}>
        <h1
          id="hero-title"
          className="display max-w-[16ch] text-[clamp(2.7rem,11vw,4.6rem)] text-on-dark md:text-[clamp(4.6rem,9.6vw,10.5rem)]"
        >
          <span className="sr-only">ACTIF Global Ventures: </span>
          <MaskLine immediate>Knitted textiles</MaskLine>
          <MaskLine immediate delay={0.09}>
            for home, interiors,
          </MaskLine>
          <MaskLine immediate delay={0.18}>
            industry and care.
          </MaskLine>
        </h1>

        <div className="mt-10 flex flex-col gap-8 [animation:fade-in_1.2s_ease_0.9s_both] md:mt-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[34rem]">
            <p className="text-[1.0625rem] leading-relaxed text-on-dark-soft">
              Developed and made in Tiruppur, India. A unit of {COMPANY.parent}, with textile
              heritage since {COMPANY.heritageYear}.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
              <a href="#applications" className="btn btn-light sm:min-w-64">
                Explore applications
              </a>
              <a href="#contact" className="btn-quiet w-fit">
                Start an enquiry
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
