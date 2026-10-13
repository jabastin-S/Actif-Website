import { FINISHES, RANGE } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { ImageNote } from "./ImageNote";
import { Parallax } from "./motion";
import { Picture } from "./Picture";

/**
 * A full-bleed photograph with an ivory panel that overlaps its lower edge and runs on into the
 * next chapter: one composition across two backgrounds.
 */
export function HomeBedding() {
  return (
    <section id="home" aria-labelledby="home-title" className="relative bg-ivory">
      <div className="relative">
        <Parallax className="h-[78svh] min-h-[28rem] md:h-[92svh]" amount={6}>
          <Picture name="homeKnit" sizes="100vw" className="h-full w-full object-cover" />
        </Parallax>
        <ImageNote text="Illustrative image of knitted bed linen" />
      </div>

      <div className="relative z-10 -mt-48 ml-auto w-[min(44rem,calc(100%-2*var(--gutter)))] bg-ivory p-8 shadow-[0_40px_80px_-50px_rgb(0_0_0/0.5)] sm:p-12 md:-mt-[22rem] md:mr-[var(--gutter)] md:p-16 lg:mr-[7vw]">
        <h2 id="home-title" className="display text-[clamp(2.6rem,5.2vw,5.4rem)] text-ink">
          Home &amp;
          <br />
          Bedding
        </h2>
        <p className="copy mt-6 text-ink">
          Our most developed line: knitted bed linen for brands selling in Australia, Europe and
          the USA, made in the fibres each programme calls for.
        </p>

        <h3 className="sr-only">The range</h3>
        <ul className="mt-10 border-t border-rule">
          {RANGE.map((item) => (
            <li
              key={item.name}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3.5"
            >
              <p className="display text-[1.6rem] leading-none text-ink">{item.name}</p>
              <p className="text-[0.875rem] text-ink-soft">{item.fibres}</p>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={() => enquiry.set("home")}
          className="btn mt-10 w-full sm:w-auto sm:min-w-72"
        >
          Enquire about home &amp; bedding
        </a>
      </div>

      <div className="shell pt-24 pb-[clamp(5rem,9vw,9rem)] md:pt-32">
        <h3 className="display text-[clamp(1.9rem,3.4vw,3.4rem)] text-ink">
          Finished to specification.
        </h3>
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {FINISHES.map((finish) => (
            <li key={finish.title} className="border-t border-rule pt-4">
              <p className="text-[0.9375rem] font-medium text-ink">{finish.title}</p>
              <p className="mt-1 text-[0.9375rem] text-ink-soft">{finish.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
