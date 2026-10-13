import { PILLARS, SDGS, STANDARDS } from "@/content/site";
import { Chapter } from "@/components/stage/StageContext";

export function Responsibility() {
  return (
    <Chapter
      id="responsibility"
      labelledBy="responsibility-title"
      className="border-t border-rule px-[var(--gutter)] py-20 lg:py-28"
    >
      <h2
        id="responsibility-title"
        className="display max-w-[38rem] text-[clamp(2.2rem,4.2vw,4.4rem)] text-ink"
      >
        <span className="block">Responsibility is</span>
        <span className="block">part of the process.</span>
      </h2>
      <p className="copy mt-8 text-ink">
        ESG is built into each stage of manufacturing rather than added afterwards, with Digital
        Product Passport and traceability readiness for the markets we ship to.
      </p>

      <h3 className="mt-14 text-sm font-medium text-ink">Environmental, social, governance</h3>
      <ul className="mt-4 border-t border-rule">
        {PILLARS.map((pillar) => (
          <li
            key={pillar.name}
            className="grid gap-2 border-b border-rule py-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8"
          >
            <p className="display text-[1.5rem] leading-[1.1] text-ink">{pillar.name}</p>
            <p className="max-w-[48ch] text-[0.9375rem] text-ink-soft">{pillar.items.map((item) => (item.startsWith("Digital") ? item : item.charAt(0).toLowerCase() + item.slice(1))).join("; ")}.</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-14 text-sm font-medium text-ink">Standards and frameworks we work to</h3>
      <ul className="mt-4 border-t border-rule">
        {STANDARDS.map((group) => (
          <li
            key={group.group}
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-rule py-4"
          >
            <p className="display text-[1.375rem] leading-[1.15] text-ink">{group.names.join(", ")}</p>
            <p className="text-sm text-ink-soft">{group.group}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[48ch] text-sm text-ink-soft">
        Ask us for current certificate scope and validity.
      </p>

      <h3 className="mt-14 text-sm font-medium text-ink">UN Global Goals we work towards</h3>
      <ul className="mt-4 grid gap-x-10 border-t border-rule sm:grid-cols-2">
        {SDGS.map((goal) => (
          <li key={goal.no} className="flex items-baseline gap-5 border-b border-rule py-4">
            <span className="display w-9 shrink-0 text-[1.6rem] leading-none text-chap-ink tabular">
              {goal.no}
            </span>
            <p className="text-[0.9375rem] text-ink">{goal.title}</p>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
