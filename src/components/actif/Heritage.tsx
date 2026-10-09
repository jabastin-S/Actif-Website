import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionOk } from "@/lib/use-motion-ok";
import drape from "@/assets/textile-drape.jpg";
import { COMPANY, STRENGTHS } from "@/content/site";
import { Fade, MaskLine, Rule } from "./primitives";

export function Heritage() {
  const ref = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.16, 1.04]);

  return (
    <section id="heritage" className="relative bg-greige py-24 md:py-36">
      <div ref={ref} className="shell grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        <figure className="lg:col-span-5 lg:row-span-2">
          <div className="pinked-bottom relative aspect-[4/5] overflow-hidden bg-linen lg:sticky lg:top-24">
            <motion.img
              src={drape}
              alt="Close view of knitted fabric falling in soft folds"
              width={1200}
              height={1600}
              loading="lazy"
              className="h-full w-full object-cover saturate-[0.7]"
              style={motionOk ? { y: imgY, scale: imgScale } : {}}
            />
          </div>
          <figcaption className="mt-5 max-w-xs text-sm text-ink-soft">
            Knitted cloth, in detail.
          </figcaption>
        </figure>

        <div className="lg:col-span-7 lg:pl-6">
          <h2 className="display text-[clamp(2.4rem,5.2vw,4.75rem)] text-ink">
            <MaskLine>Textile heritage since {COMPANY.heritageYear}.</MaskLine>
            <MaskLine delay={0.08}>A knit-to-pack mill</MaskLine>
            <MaskLine delay={0.16}>for today&rsquo;s brands.</MaskLine>
          </h2>

          <Fade delay={0.1} className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
            <p className="prose-measure text-lg text-ink">
              ACTIF Global Ventures is a unit of {COMPANY.parent}, based in Tiruppur, India&rsquo;s
              knitwear capital.
            </p>
            <p className="prose-measure text-ink-soft">
              We develop and manufacture knitted textiles for home, interior, industrial and
              healthcare use, with every stage from yarn to finished pack under one roof.
            </p>
          </Fade>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:pl-6">
          <h3 className="sr-only">Why brands work with ACTIF</h3>
          <ul className="grid gap-x-10 md:grid-cols-2">
            {STRENGTHS.map((item, index) => (
              <Fade as="li" key={item.title} delay={(index % 2) * 0.08} className="relative pt-6 pb-9">
                <Rule className="absolute inset-x-0 top-0 text-ink/25" />
                <p className="display text-[1.55rem] leading-[1.1] text-ink">{item.title}</p>
                <p className="mt-3 max-w-[34ch] text-[0.95rem] text-ink-soft">{item.body}</p>
              </Fade>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
