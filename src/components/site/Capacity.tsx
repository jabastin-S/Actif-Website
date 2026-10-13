import { CAPACITY } from "@/content/site";
import { MaskLine } from "./motion";

/**
 * Three ruled sentences on a deep olive field; the sentence is the layout. On wide screens the
 * source note sits in the right-hand column on the same top rule instead of below the list.
 */
export function Capacity() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capacity-title"
      className="on-dark bg-olive-deep section-y text-on-dark"
    >
      <h2 id="capacity-title" className="sr-only">
        Capacity
      </h2>
      <div className="shell grid lg:grid-cols-12 lg:gap-x-10">
        <ul className="border-b border-rule-dark lg:col-span-8">
          {CAPACITY.map((row, index) => (
            <li key={row.text} className="border-t border-rule-dark py-6 md:py-8">
              <p className="display max-w-[24ch] text-[clamp(2.3rem,5.4vw,5.2rem)]">
                <MaskLine delay={index * 0.1}>
                  <span className="tabular">{row.value}</span> {row.text}
                </MaskLine>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-7 max-w-[56ch] text-[0.9375rem] text-on-dark-soft lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0 lg:self-start lg:border-t lg:border-rule-dark lg:pt-8">
          Figures as supplied by ACTIF and confirmed for each programme. Capacity flexes up and down
          with your orders, and sample-to-bulk turnaround is quick.
        </p>
      </div>
    </section>
  );
}
