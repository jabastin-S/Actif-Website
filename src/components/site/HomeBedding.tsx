import { FINISHES, RANGE } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { ImageNote } from "./ImageNote";
import { ClipReveal, MaskLine } from "./motion";
import { Picture } from "./Picture";

/**
 * Home & Bedding is the flagship, so it gets the largest picture on the page. The heading sits
 * in the quiet plaster wall of the photograph itself; the detail follows on ivory below it.
 */
export function HomeBedding() {
  return (
    <section id="home" aria-labelledby="home-title" className="bg-ivory">
      <div className="grain relative h-[72svh] min-h-[26rem] overflow-hidden bg-stone md:h-[88svh] md:max-h-[54rem]">
        <Picture
          name="bedWide"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[34%_70%] md:object-[50%_60%]"
        />
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
      </div>

      <div className="shell section-y grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <p className="copy text-ink">
            Our most developed line: knitted bed linen for brands selling in Australia, Europe and
            the USA, made in the fibres each programme calls for.
          </p>
          <a
            href="#contact"
            onClick={() => enquiry.set("home")}
            className="btn mt-9 w-full sm:w-auto sm:min-w-72"
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
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-4"
              >
                <p className="display text-[1.8rem] leading-none text-ink">{item.name}</p>
                <p className="text-[0.9375rem] text-ink-soft">{item.fibres}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell pb-[clamp(4.5rem,9vw,8.5rem)]">
        <ClipReveal>
          <h3 className="display text-[clamp(1.9rem,3.2vw,3.2rem)] text-ink">
            Finished to specification.
          </h3>
        </ClipReveal>
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {FINISHES.map((finish) => (
            <li key={finish.title} className="border-t border-rule pt-4">
              <p className="text-[1rem] font-medium text-ink">{finish.title}</p>
              <p className="mt-1 text-[1rem] text-ink-soft">{finish.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
