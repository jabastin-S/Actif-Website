import { BEDDING_SELECTED, FINISHES, HOME_LEAD, RANGE } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { ImageNote } from "./ImageNote";
import { ClipReveal, MaskLine, ScrollExpand } from "./motion";
import { Picture } from "./Picture";

/**
 * Home & Bedding is the flagship, so it gets the largest picture on the page. The heading sits
 * in the quiet plaster wall of the photograph itself; the detail follows on ivory below it.
 */
export function HomeBedding() {
  return (
    <section id="home" aria-labelledby="home-title" className="bg-ivory">
      <ScrollExpand
        className="grain relative h-[62svh] min-h-[24rem] max-h-[34rem] overflow-hidden bg-stone md:h-[86svh] md:max-h-[52rem]"
        media={
          <Picture
            name="bedWide"
            sizes="100vw"
            className="h-full w-full object-cover object-[34%_70%] md:object-[50%_60%]"
          />
        }
      >
        <div className="shell relative z-10 pt-[clamp(2.5rem,6vw,5.5rem)]">
          <h2
            id="home-title"
            className="display ml-auto max-w-[9ch] text-[clamp(3rem,7.2vw,6rem)] text-ink md:max-w-[10ch]"
          >
            <MaskLine>Home &amp;</MaskLine>
            <MaskLine delay={0.08}>
              <em>Bedding</em>
            </MaskLine>
          </h2>
        </div>
        <ImageNote text="Illustrative image of knitted bed linen" />
      </ScrollExpand>

      <div className="shell grid gap-10 pt-[var(--space-continue)] lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <p className="copy text-ink">{HOME_LEAD}</p>
          <dl className="mt-8 border-b border-rule">
            {BEDDING_SELECTED.map((item) => (
              <div key={item.text} className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-rule py-4">
                <dt className="text-[0.9375rem] text-ink-soft">{item.text}</dt>
                <dd className="display text-[1.8rem] leading-none text-ink tabular">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-ink-soft">
            Selected reference capabilities, confirmed for each construction and finish.
          </p>
          <a
            href="#contact"
            onClick={() => enquiry.set("home")}
            className="btn mt-8 w-full sm:w-auto sm:min-w-72"
          >
            Enquire about home &amp; bedding
          </a>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="sr-only">The range</h3>
          <ul className="border-t border-rule">
            {RANGE.map((item) => (
              <li
                key={item.name}
                className="grid gap-x-6 gap-y-1.5 border-b border-rule py-4 sm:grid-cols-[minmax(0,15rem)_1fr]"
              >
                <p className="display text-[1.8rem] leading-none text-ink">{item.name}</p>
                <p className="text-[0.9375rem] text-ink-soft">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell pt-[var(--space-continue)] pb-[var(--space-section)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <ClipReveal className="lg:col-span-6">
            <h3 className="display text-[clamp(1.9rem,3.2vw,3.2rem)] text-ink">
              Finished to the application.
            </h3>
          </ClipReveal>
          <p className="max-w-[52ch] text-[1rem] text-ink-soft lg:col-span-5 lg:col-start-8">
            Finishes are application-specific. Each functional claim is developed and validated
            against the intended application, your specification and the applicable testing
            standards.
          </p>
        </div>
        <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-5">
          {FINISHES.map((finish) => (
            <li key={finish} className="border-t border-rule py-3.5 text-[1rem] font-medium text-ink">
              {finish}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
