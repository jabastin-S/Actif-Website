import { PROCESS } from "@/content/site";
import { ImageNote } from "./ImageNote";
import { MaskLine, Parallax } from "./motion";
import { Picture } from "./Picture";

/**
 * A wide photographic band carrying the heading and the introduction, then the seven stages in two
 * aligned rows. On phones each stage sets its number beside the title to keep the list compact.
 */
export function Process() {
  return (
    <section id="manufacturing" aria-labelledby="manufacturing-title" className="bg-ivory">
      <div className="on-dark relative isolate text-on-dark">
        <Parallax className="h-[64svh] min-h-[26rem] max-h-[44rem] md:h-[72svh]" amount={5}>
          <Picture name="yarnCones" sizes="100vw" className="h-full w-full object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/20" />
        <div className="shell absolute inset-x-0 bottom-0 grid gap-5 pb-9 md:grid-cols-12 md:items-end md:gap-x-8 md:pb-12">
          <h2
            id="manufacturing-title"
            className="display text-[clamp(2.8rem,8vw,6rem)] text-on-dark md:col-span-7"
          >
            <MaskLine>From fibre</MaskLine>
            <MaskLine delay={0.08}>to freight.</MaskLine>
          </h2>
          <p className="max-w-[40ch] text-[1rem] leading-relaxed text-on-dark md:col-span-5 md:pb-2 lg:col-span-4 lg:col-start-9">
            ACTIF develops and makes knitted textiles under one roof, from the choice of yarn to a
            packed container. Seven stages, one team.
          </p>
        </div>
        <ImageNote
          className="right-2.5 top-4 bottom-auto md:top-5"
          text="Illustrative image of yarn production, not an ACTIF facility"
        />
      </div>

      <div className="shell pt-[var(--space-continue)] pb-[var(--space-section)]">
        <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4">
          {PROCESS.map((stage, index) => (
            <li
              key={stage.title}
              className="grid grid-cols-[3rem_1fr] gap-x-3 border-t border-rule pt-5 sm:block sm:pt-6"
            >
              <span className="display row-span-2 block text-[2.1rem] leading-none text-olive tabular sm:text-[2.6rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="display text-[1.7rem] leading-[1.02] text-ink sm:mt-5 sm:text-[1.9rem]">
                {stage.title}
              </p>
              <p className="mt-2 max-w-[30ch] text-[0.9375rem] text-ink-soft sm:mt-3">{stage.body}</p>
            </li>
          ))}
          <li className="border-t border-rule pt-5 sm:col-span-2 sm:pt-6 lg:col-span-1">
            <p className="display text-[1.75rem] leading-[1.08] text-ink sm:text-[1.9rem]">
              Every stage is ESG-controlled: traceable and responsible, end to end.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
