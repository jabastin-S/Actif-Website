import { COMPANY, STRENGTHS } from "@/content/site";
import { CourseReveal, MaskLine, Parallax } from "./motion";
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
        {/* The four set lines fit from 640px up. Below that they would each wrap again into a
            ragged stack, so on phones the lines flow as one balanced paragraph instead. */}
        <h2
          id="heritage-title"
          className="display text-[clamp(2.3rem,5.6vw,5.4rem)] text-ink max-sm:[&>span]:inline max-sm:[&>span>span]:inline"
        >
          <MaskLine>A textile house with roots</MaskLine>{" "}
          <MaskLine delay={0.08}>in {COMPANY.heritageYear}, making knitted fabrics</MaskLine>{" "}
          <MaskLine delay={0.16}>for the beds, seats, machines</MaskLine>{" "}
          <MaskLine delay={0.24}>
            and <em>wards</em> where they work.
          </MaskLine>
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-x-8 lg:mt-14 lg:gap-x-10">
          <div className="md:col-span-7">
            <div className="max-w-[44rem] space-y-5">
              <p className="copy text-ink">
                {COMPANY.name} is a unit of {COMPANY.parent} in Tiruppur, Tamil Nadu, developing
                premium engineered knitted textiles for global customers.
              </p>
              <p className="copy text-ink-soft">
                We treat textiles as materials that shape how people rest, live, recover and work.
                Development begins with the intended application, the performance it requires and
                the experience the finished product must deliver.
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

          {/* Beside a one-column list (tablet) the macro is a plate that stays in view; on wide
              screens, where the list sets its rows in two columns, it runs the list's height. */}
          <CourseReveal className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:col-span-5 md:self-start lg:col-span-4 lg:col-start-9 xl:static xl:self-stretch">
            <div className="grain relative aspect-[4/3] overflow-hidden bg-linen md:aspect-[3/4] xl:aspect-auto xl:h-full xl:min-h-[24rem]">
              <Parallax className="absolute inset-0" amount={4}>
                <Picture
                  name="macroSharp"
                  sizes="(min-width:1024px) 30vw, (min-width:768px) 40vw, 92vw"
                  className="h-full w-full object-cover"
                />
              </Parallax>
              <ImageNote tone="ink" />
            </div>
          </CourseReveal>
        </div>
      </div>
    </section>
  );
}
