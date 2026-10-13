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
      className="bg-ivory pt-[var(--space-continue)] pb-[var(--space-section)]"
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

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-x-8 lg:mt-14 lg:gap-x-10">
          <div className="md:col-span-7">
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
            <ul className="mt-10 border-b border-rule lg:mt-12">
              {STRENGTHS.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-x-8 gap-y-1.5 border-t border-rule py-5 sm:grid-cols-[minmax(0,13rem)_1fr] md:grid-cols-1 xl:grid-cols-[minmax(0,14rem)_1fr]"
                >
                  <p className="display text-[1.75rem] leading-[1.05] text-ink">{item.title}</p>
                  <p className="max-w-[42ch] text-[1rem] text-ink-soft">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <ClipReveal className="md:col-span-5 lg:col-span-4 lg:col-start-9">
            <div className="grain relative aspect-[4/3] overflow-hidden bg-linen md:aspect-auto md:h-full md:min-h-[24rem]">
              <Picture
                name="macroSharp"
                sizes="(min-width:1024px) 30vw, (min-width:768px) 40vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <ImageNote tone="ink" />
            </div>
          </ClipReveal>
        </div>
      </div>
    </section>
  );
}
