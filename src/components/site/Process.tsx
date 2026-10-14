import { DEVELOPMENT, JOURNEY } from "@/content/site";
import { ImageNote } from "./ImageNote";
import { MaskLine, Parallax, Rise } from "./motion";
import { Picture } from "./Picture";

/**
 * A wide photographic band carrying the approach in three lines, then the eight development
 * steps in two aligned rows, then the manufacturing journey as one ruled row. On phones each
 * step sets its number beside the title to keep the list compact.
 */
export function Process() {
  return (
    <section id="manufacturing" aria-labelledby="manufacturing-title" className="bg-ivory">
      <div className="on-dark relative isolate text-on-dark">
        <Parallax className="h-[64svh] min-h-[28rem] max-h-[44rem] md:h-[72svh]" amount={5}>
          <Picture name="yarnCones" sizes="100vw" className="h-full w-full object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/20" />
        <div className="shell absolute inset-x-0 bottom-0 grid gap-5 pb-9 md:grid-cols-12 md:items-end md:gap-x-8 md:pb-12">
          <h2
            id="manufacturing-title"
            className="display text-[clamp(2.4rem,5.6vw,4.8rem)] text-on-dark md:col-span-8"
          >
            <MaskLine>Understand the product.</MaskLine>
            <MaskLine delay={0.08}>Engineer the textile.</MaskLine>
            <MaskLine delay={0.16}>
              Deliver it <em>consistently.</em>
            </MaskLine>
          </h2>
          <p className="max-w-[40ch] text-[1rem] leading-relaxed text-on-dark md:col-span-4 md:pb-2">
            Every development starts from where and how the textile will be used, and moves from
            concept through development and approval to production.
          </p>
        </div>
        <ImageNote
          className="right-2.5 top-4 bottom-auto md:top-5"
          text="Illustrative image of yarn production, not an ACTIF facility"
        />
      </div>

      <div className="shell pt-[var(--space-continue)]">
        <h3 className="sr-only">How a development runs</h3>
        <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4">
          {DEVELOPMENT.map((step, index) => (
            <Rise
              as="li"
              key={step.title}
              delay={(index % 4) * 0.07}
              className="grid grid-cols-[3rem_1fr] gap-x-3 border-t border-rule pt-5 sm:block sm:pt-6"
            >
              <span className="display row-span-2 block text-[2.1rem] leading-none text-olive tabular sm:text-[2.6rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="display text-[1.7rem] leading-[1.02] text-ink sm:mt-5 sm:text-[1.9rem]">
                {step.title}
              </p>
              <p className="mt-2 max-w-[30ch] text-[0.9375rem] text-ink-soft sm:mt-3">{step.body}</p>
            </Rise>
          ))}
        </ol>
      </div>

      <div className="shell pt-[var(--space-continue)] pb-[var(--space-section)]">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <h3 className="display text-[clamp(1.9rem,3.2vw,3.2rem)] text-ink lg:col-span-6">
            The manufacturing journey.
          </h3>
          <p className="max-w-[48ch] text-[1rem] text-ink-soft lg:col-span-5 lg:col-start-8">
            Knitting, finishing and selected made-up production, connected. The stages a programme
            uses depend on the product.
          </p>
        </div>
        <ol className="mt-8 grid grid-cols-2 gap-x-6 sm:grid-cols-4 lg:grid-cols-8">
          {JOURNEY.map((stage) => (
            <li key={stage} className="border-t border-ink/40 py-3.5 text-[0.9375rem] font-medium text-ink">
              {stage}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
