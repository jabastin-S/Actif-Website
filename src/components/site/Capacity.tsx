import { CAPACITY } from "@/content/site";
import { MaskLine } from "./motion";

/**
 * Four ruled sentences on a deep olive field; the sentence is the layout. On wide screens the
 * scope note sits in the right-hand column on the same top rule instead of below the list.
 * The figures are stated at different stages of production, so the note says they are not
 * interchangeable rather than converting one into another.
 */
export function Capacity() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capacity-title"
      className="on-dark bg-olive-deep section-y text-on-dark"
    >
      <h2 id="capacity-title" className="sr-only">
        Manufacturing capability
      </h2>
      <div className="shell grid lg:grid-cols-12 lg:gap-x-10">
        <ul className="border-b border-rule-dark lg:col-span-8">
          {CAPACITY.map((row, index) => (
            <li key={row.text} className="border-t border-rule-dark py-5 md:py-7">
              <p className="display max-w-[24ch] text-[clamp(2.1rem,4.6vw,4.4rem)]">
                <MaskLine delay={index * 0.08}>
                  {row.before && `${row.before} `}
                  <span className="tabular">{row.value}</span> {row.text}
                </MaskLine>
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-7 max-w-[56ch] space-y-4 text-[0.9375rem] text-on-dark-soft lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0 lg:self-start lg:border-t lg:border-rule-dark lg:pt-8">
          <p className="text-on-dark">
            Machine diameters of about 16 to 60 inches, in multiple gauges and configurations,
            across more than 2 lakh sq ft (200,000 sq ft) of manufacturing infrastructure.
          </p>
          <p>
            The figures describe capability at different stages of production and are not
            interchangeable. Capacity for a specific order is confirmed by our production team.
          </p>
        </div>
      </div>
    </section>
  );
}
