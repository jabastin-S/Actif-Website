import { CAPACITY } from "@/content/site";
import { tintVar } from "@/lib/tint";
import { Counter, Fade, MaskLine, Rule, Swatch } from "./primitives";

export function Capacity() {
  return (
    <section id="capacity" className="relative bg-greige py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <h2 className="display text-[clamp(2.4rem,5vw,4.5rem)] text-ink">
            <MaskLine>Capacity,</MaskLine>
            <MaskLine delay={0.08}>stated plainly.</MaskLine>
          </h2>
          <Fade delay={0.1}>
            <p className="prose-measure mt-8 text-ink-soft">
              The monthly output of our integrated knit-to-pack line. It flexes up and down with
              your programme, and sample-to-bulk turnaround is quick.
            </p>
          </Fade>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul>
            {CAPACITY.map((row) => (
              <Fade as="li" key={row.text} className="relative">
                <Rule className="text-ink/25" />
                <div className="flex items-center gap-5 py-6 md:gap-8 md:py-8">
                  <div className="pinked-bottom size-14 shrink-0 overflow-hidden [--pink:6px] md:size-16">
                    <Swatch structure={row.structure} tint={tintVar(row.tone)} />
                  </div>
                  <p className="display text-[clamp(1.6rem,2.9vw,2.6rem)] leading-[1.1] text-ink">
                    <Counter value={row.value} /> {row.text}
                  </p>
                </div>
              </Fade>
            ))}
            <li aria-hidden>
              <Rule className="text-ink/25" />
            </li>
          </ul>
          <p className="mt-6 text-sm text-ink-soft">
            Indicative monthly figures, confirmed for each programme.
          </p>
        </div>
      </div>
    </section>
  );
}
