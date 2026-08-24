import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { TextileBackground } from "./TextileBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-forest-deep py-32"
    >
      {/* Background Motion */}
      <motion.div
        className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center"
        style={reduced ? undefined : { scale: logoScale }}
      >
        <span className="display text-[40vw] text-ivory/5 select-none tracking-[0.2em]">ACTIF</span>
      </motion.div>
      <div className="absolute inset-0 pointer-events-none">
        <TextileBackground palette="forest" density={15} opacity={0.2} interactive={false} />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10 w-full text-center flex flex-col items-center">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: EASE }}
          style={reduced ? undefined : { y: textY }}
          className="flex flex-col items-center"
        >
          <span className="label-eyebrow text-champagne/80 mb-8">PARTNERING FOR A</span>
          <h2 className="display text-6xl text-on-forest sm:text-8xl md:text-9xl lg:text-[10rem] leading-[0.9]">
            Sustainable
            <br />
            Future.
          </h2>

          <div className="mt-24 flex flex-wrap justify-center gap-x-8 gap-y-4 label-eyebrow tracking-widest text-on-forest/60 max-w-4xl">
            <span>ESG Manufacturing</span>
            <span className="h-1 w-1 rounded-full bg-champagne/40 my-auto" />
            <span>DPP Ready</span>
            <span className="h-1 w-1 rounded-full bg-champagne/40 my-auto" />
            <span>Traceable Supply Chains</span>
            <span className="h-1 w-1 rounded-full bg-champagne/40 my-auto" />
            <span>Integrated Production</span>
            <span className="h-1 w-1 rounded-full bg-champagne/40 my-auto" />
            <span>Export Excellence</span>
            <span className="h-1 w-1 rounded-full bg-champagne/40 my-auto" />
            <span>Long-Term Partnership</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
