import { CAPACITY } from "@/content/site";
import { Counter } from "./motion";

/** Three full-width ruled lines on a deep olive field; the sentence is the layout. */
export function Capacity() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capacity-title"
      className="on-dark bg-olive-deep py-[clamp(5rem,10vw,10rem)] text-on-dark"
    >
      <h2 id="capacity-title" className="sr-only">
        Capacity
      </h2>
      <ul className="shell">
        {CAPACITY.map((row) => (
          <li key={row.text} className="border-t border-rule-dark py-7 md:py-10">
            <p className="display max-w-[24ch] text-[clamp(2.3rem,5.4vw,5.6rem)]">
              <Counter value={row.value} /> {row.text}
            </p>
          </li>
        ))}
        <li className="border-t border-rule-dark pt-8">
          <p className="max-w-[56ch] text-[0.9375rem] text-on-dark-soft">
            Figures as supplied by ACTIF and confirmed for each programme. Capacity flexes up and
            down with your orders, and sample-to-bulk turnaround is quick.
          </p>
        </li>
      </ul>
    </section>
  );
}
