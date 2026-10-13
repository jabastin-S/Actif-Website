import { COMPANY, STRENGTHS } from "@/content/site";
import { ClipReveal, MaskLine } from "./motion";
import { ImageNote } from "./ImageNote";
import { Picture } from "./Picture";

/** Type first, then one sharp macro set against the strengths read as a specification list. */
export function Statement() {
  return (
    <section
      id="heritage"
      aria-labelledby="heritage-title"
      className="section-y bg-ivory"
    >
      <div className="shell">
        <h2
          id="heritage-title"
          className="display text-[clamp(2.3rem,5.6vw,5.4rem)] text-ink"
        >
          <MaskLine>A textile house with roots</MaskLine>
          <MaskLine delay={0.08}>in {COMPANY.heritageYear}, making knitted fabrics</MaskLine>
          <MaskLine delay={0.16}>for the beds, seats, machines</MaskLine>
          <MaskLine delay={0.24}>
            and <em>wards</em> where they work.
          </MaskLine>
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <div className="max-w-[44rem] space-y-5">
              <p className="copy text-ink">
                ACTIF Global Ventures is a unit of {COMPANY.parent}, based in Tiruppur, India&rsquo;s
                knitwear capital.
              </p>
              <p className="copy text-ink-soft">
                We develop and manufacture knitted textiles for home, interior, industrial and
                healthcare use, with every stage from yarn to finished pack under one roof.
              </p>
            </div>

            <h3 className="sr-only">Why partners work with ACTIF</h3>
            <ul className="mt-14 border-b border-rule">
              {STRENGTHS.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-x-8 gap-y-2 border-t border-rule py-6 sm:grid-cols-[minmax(0,15rem)_1fr]"
                >
                  <p className="display text-[1.75rem] leading-[1.05] text-ink">{item.title}</p>
                  <p className="max-w-[42ch] text-[1rem] text-ink-soft">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <ClipReveal className="sm:ml-auto sm:w-[56%] lg:col-span-4 lg:col-start-9 lg:-mt-6 lg:w-auto">
            <div className="grain relative aspect-[3/4] overflow-hidden bg-linen">
              <Picture
                name="macroSharp"
                sizes="(min-width:1024px) 30vw, 92vw"
                className="h-full w-full object-cover"
              />
              <ImageNote tone="ink" />
            </div>
          </ClipReveal>
        </div>
      </div>
    </section>
  );
}
