import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { COMPANY } from "@/content/site";
import { useMedia } from "@/lib/motion-hooks";
import { useMotionOk } from "@/lib/use-motion-ok";
import { MaskLine, Parallax } from "./motion";
import { ImageNote } from "./ImageNote";
import { Picture } from "./Picture";

/**
 * A printed-plate composition on the ivory ground: the headline sets the scale, a tall macro of
 * the knit stands against it, and a wide room scene overlaps the macro's edge. Memorable with
 * every animation off; motion only adds the entrance.
 */
export function Hero() {
  // On the way out the room plate lifts a little faster than the headline: two depths, no pinning.
  const motionOk = useMotionOk();
  const wide = useMedia("(min-width: 768px)");
  const { scrollY } = useScroll();
  const plateY = useTransform(scrollY, [0, 900], [0, -70]);
  const titleY = useTransform(scrollY, [0, 900], [0, -28]);
  const depth = motionOk && wide;

  // The course mask is only needed while the CSS entrance runs (as in CourseReveal); once the
  // macro has formed, drop it so the parallax layer scrolls without a mask over it.
  const macro = useRef<HTMLDivElement>(null);
  const [formed, setFormed] = useState(false);
  useEffect(() => {
    const node = macro.current;
    if (!node) return;
    let live = true;
    Promise.all(node.getAnimations().map((animation) => animation.finished))
      .then(() => live && setFormed(true))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-ivory pt-[calc(var(--header-h)+1.5rem)] pb-[var(--space-continue)] md:pt-[calc(var(--header-h)+2.5rem)]"
    >
      <div className="shell hero-grid">
        <motion.h1
          style={depth ? { y: titleY } : {}}
          id="hero-title"
          className="display area-title text-[clamp(2.6rem,11.2vw,4.5rem)] text-ink md:text-[clamp(3.8rem,7.6vw,5.1rem)] xl:text-[clamp(4.6rem,6.7vw,6rem)]"
        >
          <span className="sr-only">ACTIF Global Ventures: </span>
          <MaskLine immediate>Knitted textiles</MaskLine>
          <MaskLine immediate delay={0.09}>
            for home, interiors,
          </MaskLine>
          <MaskLine immediate delay={0.18}>
            industry and <em>care.</em>
          </MaskLine>
        </motion.h1>

        <div className="area-macro md:min-h-[26rem]">
          <div
            ref={macro}
            data-course={formed ? "done" : "run"}
            className="course-mask grain relative aspect-[4/3] overflow-hidden bg-linen [animation:course-in_1.4s_var(--ease-soft)_0.12s_both] md:aspect-auto md:h-full md:min-h-[26rem]"
          >
            <Parallax className="absolute inset-0" amount={3}>
              <Picture
                name="macroSoft"
                priority
                sizes="(min-width:1280px) 30vw, (min-width:768px) 40vw, 92vw"
                alt="Close view of oatmeal knitted jersey folding in a diagonal ridge"
                className="h-full w-full object-cover object-[50%_40%] [animation:plate-settle_1.9s_var(--ease-out)_0.12s_both]"
              />
            </Parallax>
            <ImageNote tone="ink" />
          </div>
        </div>

        <div className="area-text self-end [animation:rise-in_0.9s_var(--ease-out)_0.7s_both]">
          <p className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-soft">
            Developed and made in Tiruppur, India. A unit of {COMPANY.parent}, with textile heritage
            since {COMPANY.heritageYear}.
          </p>
          <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8 xl:flex-col xl:items-start xl:gap-1">
            <a href="#applications" className="btn w-full sm:w-auto sm:min-w-64">
              Explore applications
            </a>
            <a href="#contact" className="btn-quiet w-fit">
              Start an enquiry
            </a>
          </div>
        </div>

        <motion.div
          style={depth ? { y: plateY } : {}}
          className="area-bed relative z-10 [animation:plate-in_1.1s_var(--ease-out)_0.42s_both] xl:-mr-14 xl:self-end"
        >
          <div className="grain relative aspect-[16/10] overflow-hidden shadow-[0_0_0_10px_var(--ivory)] md:aspect-[16/9] xl:aspect-[16/10]">
            {/* eager: lazy loading treats the plate as off-screen while plate-in clips it shut,
                so the photo arrived after the reveal had opened onto the placeholder */}
            <Picture
              name="homeInterior"
              priority
              sizes="(min-width:1280px) 44vw, (min-width:768px) 54vw, 92vw"
              alt="A calm bedroom corner with neutral linen bedding"
              className="h-full w-full object-cover object-[40%_60%] [animation:plate-settle_1.7s_var(--ease-out)_0.42s_both]"
            />
            <ImageNote />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
