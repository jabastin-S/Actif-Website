import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionOk } from "@/lib/use-motion-ok";
import heroPoster from "@/assets/textile-hero.jpg";
import { COMPANY, SECTORS } from "@/content/site";
import { KnitCloth } from "./KnitCloth";

/**
 * Hero: live knitted cloth behind the ACTIF wordmark.
 * To use real footage, drop it at /public/assets/videos/actif-textile-hero.mp4 and restart
 * the dev server (vite.config.ts detects the file); the WebGL cloth stays underneath as fallback.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const motionOk = useMotionOk();
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const clothY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section
      id="top"
      ref={ref}
      data-tone="dark"
      className="relative isolate flex min-h-[640px] h-[100svh] w-full items-end overflow-hidden bg-indigo text-on-indigo"
    >
      <motion.div className="absolute inset-0 -z-10" style={motionOk ? { y: clothY } : {}}>
        {/* Still fallback while WebGL starts, or when it is unavailable */}
        <img
          src={heroPoster}
          alt=""
          aria-hidden
          width={1920}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-indigo-2/70" />
        <KnitCloth />
        {__HERO_VIDEO__ && (
          <video
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover mix-blend-luminosity transition-opacity duration-[1600ms] ${
              videoReady ? "opacity-60" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            onCanPlay={() => setVideoReady(true)}
          >
            <source src="/assets/videos/actif-textile-hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-indigo/85 via-indigo/30 to-transparent" />
      </motion.div>

      <motion.div
        className="shell relative pb-8 md:pb-12"
        style={motionOk ? { y: textY } : {}}
      >
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
          <div>
            <h1 className="overflow-hidden pb-[0.06em]">
              <span
                className="display block text-[clamp(4.5rem,24vw,7.5rem)] sm:text-[clamp(5.25rem,22vw,12rem)] lg:text-[clamp(5.25rem,14vw,18rem)] leading-[0.82] tracking-[-0.02em] font-medium [animation:mask-rise_1.6s_var(--ease-out)_0.2s_both]"
              >
                ACTIF
                <span className="sr-only"> Global Ventures</span>
              </span>
            </h1>
            <p className="label mt-3 text-on-indigo-soft [animation:fade-in_1.4s_ease_1.1s_both]">
              Global Ventures Pvt Ltd
            </p>
          </div>

          <div className="flex flex-col gap-7 pb-1 [animation:fade-in_1.4s_ease_1.3s_both] ">
            <p className="display text-[clamp(1.6rem,2.6vw,2.5rem)] leading-[1.12] text-on-indigo">
              Knitted textiles, developed and made in Tiruppur by a house with roots in{" "}
              {COMPANY.heritageYear}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#sectors"
                className="btn-label text-on-indigo [--btn-fill:var(--on-indigo)] hover:text-indigo"
              >
                See what we make
              </a>
              <a
                href="#contact"
                className="btn-label border-cochineal-lite/70 text-on-indigo [--btn-fill:var(--cochineal-lite)] hover:text-indigo"
              >
                Talk to our team
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-on-indigo/20 pt-4 text-[0.8125rem] text-on-indigo-soft md:mt-10 pr-16 lg:pr-24 [animation:fade-in_1.4s_ease_1.6s_both]">
          <ul className="flex flex-wrap gap-x-7 gap-y-1">
            {SECTORS.map((sector) => (
              <li key={sector.id}>
                <a href="#sectors" className="link-thread hover:text-on-indigo">
                  {sector.short}
                </a>
              </li>
            ))}
          </ul>
          <p>A unit of {COMPANY.parent}</p>
        </div>
      </motion.div>
    </section>
  );
}
