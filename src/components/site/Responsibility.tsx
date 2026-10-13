import { PILLARS, SDGS, STANDARDS } from "@/content/site";

const lower = (item: string) =>
  item.startsWith("Digital") ? item : item.charAt(0).toLowerCase() + item.slice(1);

export function Responsibility() {
  return (
    <section
      id="responsibility"
      aria-labelledby="responsibility-title"
      className="bg-linen section-y"
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <h2
            id="responsibility-title"
            className="display max-w-[16ch] text-[clamp(2.8rem,7vw,6rem)] text-ink lg:col-span-7"
          >
            Responsibility is part of the process.
          </h2>
          <p className="copy text-ink lg:col-span-5 lg:col-start-8 lg:pb-2">
            ESG is built into each stage of manufacturing rather than added afterwards, with Digital
            Product Passport and traceability readiness for the markets we ship to.
          </p>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3 lg:mt-14">
          {PILLARS.map((pillar) => (
            <div key={pillar.name} className="border-t border-rule pt-6">
              <h3 className="display text-[2.2rem] leading-none text-ink">{pillar.name}</h3>
              <p className="mt-4 max-w-[34ch] text-[0.9375rem] text-ink-soft">
                {pillar.items.map(lower).join("; ")}.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <h3 className="display text-[clamp(1.9rem,3vw,2.8rem)] text-ink">
              Standards and frameworks we work to.
            </h3>
            <ul className="mt-6 space-y-2">
              {STANDARDS.map((group) => (
                <li key={group.group} className="flex flex-wrap items-baseline gap-x-4">
                  <span className="display text-[1.5rem] text-ink">{group.names.join(", ")}</span>
                  <span className="text-sm text-ink-soft">{group.group}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[44ch] text-sm text-ink-soft">
              Listed as supplied by ACTIF. Certificate scope and validity are confirmed on request.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="display text-[clamp(1.9rem,3vw,2.8rem)] text-ink">
              UN Global Goals we work towards.
            </h3>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {SDGS.map((goal) => (
                <li key={goal.no} className="flex items-baseline gap-4 border-t border-rule py-3.5">
                  <span className="display w-9 shrink-0 text-[1.6rem] leading-none text-olive tabular">
                    {goal.no}
                  </span>
                  <p className="text-[0.9375rem] text-ink">{goal.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
