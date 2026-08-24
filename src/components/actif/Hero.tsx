import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import heroPoster from "@/assets/textile-hero.jpg";
import { TextileBackground } from "./TextileBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen cinematic hero.
 * The real ACTIF film can be dropped in at
 * /public/assets/videos/actif-textile-hero.mp4 — no code change required.
 * Until then the poster still + animated fibre canvas carry the motion.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[620px] w-full items-end overflow-hidden bg-forest-deep"
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: bgY, scale: bgScale }}
      >
        <img
          src={heroPoster}
          alt="Macro detail of ivory knitted bed-linen fabric in soft folds"
          width={1920}
          height={1200}
          className="h-full w-full object-cover"
        />
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          <source src="/assets/videos/actif-textile-hero.mp4" type="video/mp4" />
        </video>
        <TextileBackground palette="forest" density={22} opacity={0.4} interactive />
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/25 to-forest-deep/60" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 md:px-10 md:pb-20"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="label-eyebrow max-w-md text-champagne/90"
        >
          Future-ready sustainable knitted home textiles
        </motion.p>

        <div className="mt-8 overflow-hidden">
          <motion.h1
            initial={reduced ? undefined : { y: "108%" }}
            animate={reduced ? undefined : { y: "0%" }}
            transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
            className="display text-on-forest text-[22vw] leading-[0.82] tracking-[0.02em] sm:text-[18vw] lg:text-[13.5vw]"
          >
            ACTIF
          </motion.h1>
        </div>

        <motion.p
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 1.4, delay: 1, ease: EASE }}
          className="label-eyebrow mt-2 text-on-forest-muted"
        >
          Global Ventures Pvt Ltd
        </motion.p>

        <div className="mt-12 grid gap-10 border-t border-on-forest/15 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.15, ease: EASE }}
          >
            <h2 className="display max-w-xl text-3xl text-on-forest sm:text-4xl lg:text-[2.9rem]">
              Future-ready textiles. Responsibly made. Globally delivered.
            </h2>
            <p className="mt-6 text-sm tracking-[0.12em] text-on-forest-muted uppercase">
              Integrated Manufacturing · ESG Driven · DPP Ready · Global Compliance
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.35, ease: EASE }}
            className="flex flex-col justify-between gap-8"
          >
            <div className="label-eyebrow flex flex-wrap items-center gap-4 text-on-forest/70">
              <span>Australia</span>
              <span className="h-1 w-1 rounded-full bg-champagne" />
              <span>Europe</span>
              <span className="h-1 w-1 rounded-full bg-champagne" />
              <span>USA</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#about" className="btn-luxe btn-luxe-light flex-1">
                <span>Explore Actif</span>
              </a>
              <a href="#contact" className="btn-luxe btn-luxe-light flex-1">
                <span>Start a Conversation</span>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 right-6 hidden md:block"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.8 }}
      >
        <div className="flex h-24 w-px justify-center overflow-hidden bg-on-forest/20">
          <motion.span
            className="block h-10 w-px bg-champagne"
            animate={reduced ? undefined : { y: [-40, 96] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
