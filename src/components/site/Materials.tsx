import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageKey } from "@/content/images";
import { cn } from "@/lib/utils";
import { Picture } from "./Picture";

const STUDIES: {
  image: ImageKey;
  title: string;
  note: string;
  aspect: string;
  width: string;
}[] = [
  { image: "knitJersey", title: "Plain jersey knit", note: "Columns of interlocking stitches.", aspect: "aspect-[3/4]", width: "w-[72vw] sm:w-[22rem]" },
  { image: "knitMesh", title: "Technical knit mesh", note: "Regular openings, engineered structure.", aspect: "aspect-square", width: "w-[78vw] sm:w-[30rem]" },
  { image: "knitRib", title: "Rib knit", note: "Pronounced vertical ribs.", aspect: "aspect-[4/5]", width: "w-[68vw] sm:w-[24rem]" },
  { image: "matSheer", title: "Sheer cloth", note: "Light passing through a fine weave.", aspect: "aspect-[3/4]", width: "w-[72vw] sm:w-[21rem]" },
  { image: "knitDark", title: "Dense technical knit", note: "Tight loops in deep charcoal.", aspect: "aspect-square", width: "w-[78vw] sm:w-[28rem]" },
  { image: "matThreads", title: "Fine threads", note: "Strands held under tension.", aspect: "aspect-[4/5]", width: "w-[68vw] sm:w-[23rem]" },
  { image: "matNonwoven", title: "Nonwoven web", note: "Bonded fibres, soft and even.", aspect: "aspect-[3/4]", width: "w-[72vw] sm:w-[21rem]" },
];

const ARROW =
  "flex size-12 items-center justify-center border border-rule-dark text-on-dark transition-colors hover:bg-on-dark hover:text-charcoal disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-on-dark";

/** Horizontal material explorer. Native scrolling (no scroll hijack); buttons and keys also work. */
export function Materials() {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  const update = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setProgress(max > 0 ? node.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(update);
  };

  const step = (direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section
      id="materials"
      aria-labelledby="materials-title"
      className="on-dark bg-charcoal py-[clamp(5rem,10vw,10rem)] text-on-dark"
    >
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="materials-title" className="display text-[clamp(2.6rem,6.6vw,6rem)]">
            Materials,
            <br />
            up close.
          </h2>
          <p className="mt-6 max-w-md text-[0.9375rem] text-on-dark-soft">
            Illustrative studies of the surfaces we work with. They are images, not product
            specifications.
          </p>
        </div>
        <div className="flex items-center gap-3" role="group" aria-label="Scroll the material studies">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={progress <= 0.01}
            aria-label="Previous studies"
            className={ARROW}
          >
            <span aria-hidden className="relative block h-px w-6 bg-current">
              <span className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 -rotate-45 border-t border-l border-current" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={progress >= 0.99}
            aria-label="Next studies"
            className={ARROW}
          >
            <span aria-hidden className="relative block h-px w-6 bg-current">
              <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rotate-45 border-t border-r border-current" />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        role="region"
        aria-label="Material studies, scrollable"
        tabIndex={0}
        className="mt-14 flex snap-x snap-proximity scroll-px-[var(--gutter)] items-end gap-6 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] md:gap-10 [&::-webkit-scrollbar]:hidden"
      >
        {STUDIES.map((study, index) => (
          <figure
            key={study.title}
            className={cn("group shrink-0 snap-start", study.width, index % 2 === 1 && "md:mb-16")}
          >
            <div className={cn("overflow-hidden", study.aspect)}>
              <Picture
                name={study.image}
                sizes="(min-width:640px) 30rem, 78vw"
                alt=""
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
              />
            </div>
            <figcaption className="mt-4">
              <p className="display text-[1.7rem] leading-none">{study.title}</p>
              <p className="mt-2 text-[0.875rem] text-on-dark-soft">{study.note}</p>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[var(--gutter)] shrink-0" />
      </div>

      <div className="shell mt-8">
        <div aria-hidden className="h-px w-full bg-rule-dark">
          <div
            className="h-px origin-left bg-on-dark transition-transform duration-300"
            style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
          />
        </div>
      </div>
    </section>
  );
}
