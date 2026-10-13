import yarnPhoto from "@/assets/textile-yarn.jpg";
import { CAPACITY, PROCESS } from "@/content/site";
import { Chapter } from "@/components/stage/StageContext";
import { Counter } from "./motion";

export function Capabilities() {
  return (
    <Chapter
      id="capabilities"
      labelledBy="capabilities-title"
      className="border-t border-rule px-[var(--gutter)] py-20 lg:py-28"
    >
      <h2
        id="capabilities-title"
        className="display max-w-[38rem] text-[clamp(2.2rem,4.2vw,4.4rem)] text-ink"
      >
        <span className="block">From fibre</span>
        <span className="block">to freight.</span>
      </h2>
      <p className="copy mt-8 text-ink">
        ACTIF develops and makes knitted textiles under one roof, from the choice of yarn to a
        packed container.
      </p>

      <figure className="mt-10">
        <img
          src={yarnPhoto}
          alt="Dyed yarn skeins beside knitted loops"
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
        <figcaption className="mt-3 text-xs text-ink-soft">Yarn, before it becomes cloth.</figcaption>
      </figure>

      <ol className="mt-14 border-t border-rule">
        {PROCESS.map((stage, index) => (
          <li
            key={stage.title}
            className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-5 sm:grid-cols-[3.5rem_minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-8"
          >
            <span className="display text-[1.5rem] leading-none text-chap-ink tabular">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="display text-[1.375rem] leading-[1.15] text-ink">{stage.title}</p>
            <p className="col-start-2 mt-1 max-w-[44ch] text-[0.9375rem] text-ink-soft sm:col-start-3 sm:mt-0">
              {stage.body}
            </p>
          </li>
        ))}
      </ol>

      <h3 className="mt-16 text-sm font-medium text-ink">Capacity</h3>
      <ul className="mt-4 border-t border-rule">
        {CAPACITY.map((row) => (
          <li key={row.text} className="border-b border-rule py-5">
            <p className="display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15] text-ink">
              <Counter value={row.value} /> {row.text}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[48ch] text-sm text-ink-soft">
        Indicative monthly figures, confirmed for each programme. Capacity flexes up and down with
        your orders, and sample-to-bulk turnaround is quick.
      </p>
    </Chapter>
  );
}
