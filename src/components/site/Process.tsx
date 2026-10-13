import { PROCESS } from "@/content/site";
import { ImageNote } from "./ImageNote";
import { MaskLine, Parallax } from "./motion";
import { Picture } from "./Picture";

/** A wide photographic band with the heading laid over it, then the seven steps in two aligned rows. */
export function Process() {
  return (
    <section id="manufacturing" aria-labelledby="manufacturing-title" className="bg-ivory">
      <div className="on-dark relative isolate text-on-dark">
        <Parallax className="h-[72svh] min-h-[26rem]" amount={7}>
          <Picture name="yarnCones" sizes="100vw" className="h-full w-full object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/15 to-charcoal/20" />
        <div className="shell absolute inset-x-0 bottom-0 pb-10 md:pb-14">
          <h2
            id="manufacturing-title"
            className="display text-[clamp(2.8rem,8vw,6rem)] text-on-dark"
          >
            <MaskLine>From fibre</MaskLine>
            <MaskLine delay={0.08}>to freight.</MaskLine>
          </h2>
        </div>
        <ImageNote
          className="right-4 bottom-4 left-auto md:right-6 md:bottom-5"
          text="Illustrative image of yarn production, not an ACTIF facility"
        />
      </div>

      <div className="shell section-y">
        <p className="copy text-ink lg:ml-[33%]">
          ACTIF develops and makes knitted textiles under one roof, from the choice of yarn to a
          packed container. Seven stages, one team.
        </p>

        <ol className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((stage, index) => (
            <li key={stage.title} className="border-t border-rule pt-6">
              <span className="display block text-[2.6rem] leading-none text-olive tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="display mt-5 text-[1.9rem] leading-[1.02] text-ink">{stage.title}</p>
              <p className="mt-3 max-w-[28ch] text-[0.9375rem] text-ink-soft">{stage.body}</p>
            </li>
          ))}
          <li className="border-t border-rule pt-6 sm:col-span-2 lg:col-span-1">
            <p className="display text-[1.9rem] leading-[1.08] text-ink">
              Every stage is ESG-controlled: traceable and responsible, end to end.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
