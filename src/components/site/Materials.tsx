import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ImageKey } from "@/content/images";
import { FIBRES, STRUCTURES } from "@/content/site";
import { cn } from "@/lib/utils";
import { CourseReveal } from "./motion";
import { Picture } from "./Picture";

const STUDIES: {
  image: ImageKey;
  title: string;
  note: string;
  aspect: string;
  width: string;
}[] = [
  // Knitted subjects only, captioned in the knowledge base's words (KB §9, §12, §15).
  { image: "knitJersey", title: "Single Jersey", note: "Soft, versatile and adaptable, including for bedding.", aspect: "aspect-[3/4]", width: "w-[72vw] sm:w-[22rem]" },
  { image: "knitMesh", title: "Specialty knits", note: "Custom constructions for individual programmes.", aspect: "aspect-square", width: "w-[78vw] sm:w-[30rem]" },
  { image: "knitRib", title: "Rib", note: "Flexible, with strong stretch characteristics.", aspect: "aspect-[4/5]", width: "w-[68vw] sm:w-[24rem]" },
  { image: "knitDark", title: "Technical constructions", note: "Adapted around technical parameters, not fashion criteria.", aspect: "aspect-square", width: "w-[78vw] sm:w-[28rem]" },
  { image: "matThreads", title: "Yarn", note: "Fibre and yarn, selected for the application.", aspect: "aspect-[4/5]", width: "w-[68vw] sm:w-[23rem]" },
];

const ARROW =
  "flex size-12 items-center justify-center border border-rule-dark text-on-dark transition-[background-color,color,transform] duration-300 hover:bg-on-dark hover:text-charcoal active:scale-95 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-on-dark";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Horizontal material explorer. Native scrolling (no hijack), plus previous/next buttons, arrow
 * keys, Home/End, mouse drag, and on fine pointers a close-up that zooms toward the cursor.
 * Scroll position is read as a motion value; React only re-renders when the current study changes.
 */
export function Materials() {
  const scroller = useRef<HTMLDivElement>(null);
  const starts = useRef<number[]>([]);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [current, setCurrent] = useState(0);
  const [edge, setEdge] = useState<"start" | "middle" | "end">("start");
  const { scrollXProgress } = useScroll({ container: scroller });
  const bar = useTransform(scrollXProgress, (value) => Math.max(0.06, value));

  // cache each study's snap position so scrolling never reads layout
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const measure = () => {
      const left = node.getBoundingClientRect().left + parseFloat(getComputedStyle(node).paddingLeft);
      starts.current = [...node.querySelectorAll("figure")].map(
        (figure) => figure.getBoundingClientRect().left - left + node.scrollLeft,
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    const node = scroller.current;
    if (!node) return;
    setEdge(value <= 0.01 ? "start" : value >= 0.99 ? "end" : "middle");
    const left = node.scrollLeft;
    let nearest = 0;
    starts.current.forEach((start, index) => {
      if (Math.abs(start - left) < Math.abs(starts.current[nearest]! - left)) nearest = index;
    });
    setCurrent(value >= 0.99 ? STUDIES.length - 1 : nearest);
  });

  const go = (index: number) => {
    const node = scroller.current;
    const target = starts.current[Math.max(0, Math.min(STUDIES.length - 1, index))];
    if (!node || target === undefined) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: STUDIES.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key]!);
  };

  // mouse drag; touch and trackpads keep their native scrolling
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const node = scroller.current;
    if (!node || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, left: node.scrollLeft };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = scroller.current;
    if (!node || !drag.current) return;
    const dx = event.clientX - drag.current.x;
    if (!node.dataset["dragging"] && Math.abs(dx) > 4) {
      node.dataset["dragging"] = "true";
      node.setPointerCapture(event.pointerId);
    }
    if (node.dataset["dragging"]) node.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    const node = scroller.current;
    drag.current = null;
    if (node?.dataset["dragging"]) {
      delete node.dataset["dragging"];
      go(current);
    }
  };

  // close-up origin follows the pointer; written to the element, not to React state
  const aim = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--zx", `${((event.clientX - box.left) / box.width) * 100}%`);
    event.currentTarget.style.setProperty("--zy", `${((event.clientY - box.top) / box.height) * 100}%`);
  };

  return (
    <section
      id="materials"
      aria-labelledby="materials-title"
      className="on-dark bg-charcoal section-y text-on-dark"
    >
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="materials-title" className="display text-[clamp(2.6rem,6.6vw,6rem)]">
            Materials,
            <br />
            up close.
          </h2>
          <p className="mt-6 max-w-md text-[0.9375rem] text-on-dark-soft">
            Illustrative studies of the knitted structures we develop. They are images, not
            product specifications.
            <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">
              {" "}
              Hover a study to look closer; drag or use the arrows to browse.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-5">
          <p aria-hidden className="tabular text-sm text-on-dark-soft">
            <span className="text-on-dark">{pad(current + 1)}</span> / {pad(STUDIES.length)}
          </p>
          <div className="flex items-center gap-3" role="group" aria-label="Browse the material studies">
            <button
              type="button"
              onClick={() => go(current - 1)}
              disabled={edge === "start"}
              aria-label="Previous study"
              className={ARROW}
            >
              <span aria-hidden className="relative block h-px w-6 bg-current">
                <span className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 -rotate-45 border-t border-l border-current" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              disabled={edge === "end"}
              aria-label="Next study"
              className={ARROW}
            >
              <span aria-hidden className="relative block h-px w-6 bg-current">
                <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rotate-45 border-t border-r border-current" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        role="region"
        aria-label="Material studies. Use the left and right arrow keys to browse."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        className="mt-10 flex snap-x snap-proximity scroll-px-[var(--gutter)] items-end gap-6 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none data-[dragging=true]:select-none md:gap-10 [@media(pointer:fine)]:cursor-grab [&::-webkit-scrollbar]:hidden"
      >
        {STUDIES.map((study, index) => (
          <figure
            key={study.title}
            className={cn("shrink-0 snap-start", study.width, index % 2 === 1 && "md:mb-16")}
          >
            <CourseReveal
              delay={Math.min(index, 4) * 0.09}
              className={cn("loupe relative overflow-hidden", study.aspect)}
            >
              <div onPointerMove={aim} className="h-full w-full">
                <Picture
                  name={study.image}
                  sizes="(min-width:640px) 30rem, 78vw"
                  alt=""
                  className="pointer-events-none h-full w-full object-cover select-none"
                />
              </div>
            </CourseReveal>
            <figcaption className="mt-4">
              <p className="display text-[1.7rem] leading-none">{study.title}</p>
              <p className="mt-2 text-[0.875rem] text-on-dark-soft">{study.note}</p>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[var(--gutter)] shrink-0" />
      </div>

      <div className="shell mt-6">
        <div aria-hidden className="h-px w-full bg-rule-dark">
          <motion.div className="h-px origin-left bg-on-dark" style={{ scaleX: bar }} />
        </div>
      </div>

      <div className="shell mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-8">
          <h3 className="display text-[clamp(1.9rem,3vw,2.8rem)]">Knitted structures</h3>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
            {STRUCTURES.map((structure) => (
              <li key={structure.name} className="border-t border-rule-dark py-4">
                <p className="display text-[1.6rem] leading-none">{structure.name}</p>
                <p className="mt-2 text-[0.9375rem] text-on-dark-soft">{structure.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <h3 className="display text-[clamp(1.9rem,3vw,2.8rem)]">Fibres and blends</h3>
          <p className="mt-6 border-t border-rule-dark pt-4 text-[1rem] leading-relaxed">{FIBRES}</p>
          <p className="mt-4 text-[0.9375rem] text-on-dark-soft">
            Chosen for the comfort, performance and commercial needs of each application, and
            confirmed for each development.
          </p>
        </div>
      </div>
    </section>
  );
}
