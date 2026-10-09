import { FINISHES, RANGE } from "@/content/site";
import { tintVar } from "@/lib/tint";
import { Fade, MaskLine, Rule, Swatch, type Structure } from "./primitives";

const STRUCTURES: Structure[] = ["jersey", "rib", "jersey", "waffle", "mesh", "rib"];

export function HomeRange() {
  return (
    <section id="range" className="relative bg-bleach py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="display text-[clamp(2.2rem,4.2vw,3.9rem)] text-ink">
              <MaskLine>The home</MaskLine>
              <MaskLine delay={0.08}>textiles range.</MaskLine>
            </h2>
            <Fade delay={0.1}>
              <p className="prose-measure mt-8 text-ink-soft">
                Six lines of knitted bed linen, each made in the fibres the programme calls for,
                for brands selling in Australia, Europe and the USA.
              </p>
            </Fade>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul>
            {RANGE.map((item, index) => (
              <Fade as="li" key={item.name} className="group relative">
                <Rule className="text-ink/25" />
                <div className="flex items-center gap-5 py-6 md:gap-8 md:py-7">
                  <div className="pinked-bottom [--pink:6px] size-14 shrink-0 overflow-hidden transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-110 md:size-16">
                    <Swatch structure={STRUCTURES[index] ?? "jersey"} tint={tintVar(item.tone)} />
                  </div>
                  <h3 className="display flex-1 text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.05] text-ink">
                    {item.name}
                  </h3>
                  <p className="max-w-[18ch] text-right text-sm text-ink-soft md:mr-16 md:max-w-[26ch] md:text-base">
                    {item.fibres}
                  </p>
                </div>
              </Fade>
            ))}
            <li aria-hidden>
              <Rule className="text-ink/25" />
            </li>
          </ul>

          <div className="mt-20 grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <h3 className="display text-[clamp(1.7rem,2.6vw,2.3rem)] leading-[1.08] text-ink">
              Finished to specification.
            </h3>
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {FINISHES.map((finish, index) => (
                <Fade as="li" key={finish.title} delay={(index % 2) * 0.06}>
                  <p className="font-medium text-ink">{finish.title}</p>
                  <p className="mt-1 text-[0.95rem] text-ink-soft">{finish.body}</p>
                </Fade>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
