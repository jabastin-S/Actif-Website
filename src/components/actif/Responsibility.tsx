import { PILLARS, SDGS, STANDARDS } from "@/content/site";
import { Fade, MaskLine, Rule } from "./primitives";

export function Responsibility() {
  return (
    <section
      id="responsibility"
      data-tone="dark"
      className="relative bg-indigo-2 py-24 text-on-indigo md:py-36"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="display text-[clamp(2.4rem,5.2vw,4.75rem)] lg:col-span-8">
            <MaskLine>Responsibility is part</MaskLine>
            <MaskLine delay={0.08}>of the process.</MaskLine>
          </h2>
          <Fade delay={0.1} className="lg:col-span-4 lg:self-end">
            <p className="prose-measure text-on-indigo-soft">
              ESG is built into each stage of manufacturing rather than added afterwards, with
              Digital Product Passport and traceability readiness for the markets we ship to.
            </p>
          </Fade>
        </div>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0 lg:mt-24">
          {PILLARS.map((pillar, index) => (
            <Fade
              as="li"
              key={pillar.name}
              delay={index * 0.1}
              className="relative md:px-8 md:first:pl-0 md:last:pr-0"
            >
              {index > 0 && (
                <span
                  aria-hidden
                  className="thread absolute inset-y-0 left-0 hidden w-px md:block"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, currentColor 0 6px, transparent 6px 10px)",
                    height: "100%",
                  }}
                />
              )}
              <h3 className="display text-[clamp(1.9rem,3vw,2.7rem)] leading-none">{pillar.name}</h3>
              <ul className="mt-7 flex flex-col">
                {pillar.items.map((item) => (
                  <li key={item} className="border-t border-on-indigo/15 py-3 text-on-indigo-soft first:border-t-0 md:first:border-t">
                    {item}
                  </li>
                ))}
              </ul>
            </Fade>
          ))}
        </ul>

        <div className="mt-24 grid gap-10 lg:mt-32 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <h3 className="display text-[clamp(1.8rem,2.8vw,2.5rem)] leading-[1.08]">
              Standards and frameworks we work to.
            </h3>
            <p className="mt-5 max-w-[32ch] text-sm text-on-indigo-soft">
              Ask us for current certificate scope and validity.
            </p>
          </div>
          <ul className="lg:col-span-8">
            {STANDARDS.map((group) => (
              <Fade as="li" key={group.group}>
                <Rule className="text-on-indigo/25" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5">
                  <p className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1]">
                    {group.names.join(", ")}
                  </p>
                  <p className="text-sm text-on-indigo-soft">{group.group}</p>
                </div>
              </Fade>
            ))}
            <li aria-hidden>
              <Rule className="text-on-indigo/25" />
            </li>
          </ul>
        </div>

        <div className="mt-24 grid gap-10 lg:mt-32 lg:grid-cols-12 lg:gap-x-10">
          <h3 className="display text-[clamp(1.8rem,2.8vw,2.5rem)] leading-[1.08] lg:col-span-4">
            Six UN Global Goals we work towards.
          </h3>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {SDGS.map((goal) => (
              <Fade as="li" key={goal.no}>
                <Rule className="text-on-indigo/25" />
                <div className="flex items-baseline gap-5 py-4">
                  <span className="display w-11 shrink-0 text-[1.9rem] leading-none text-cochineal-lite tabular">
                    {goal.no}
                  </span>
                  <p className="display text-[1.25rem] leading-[1.15]">{goal.title}</p>
                </div>
              </Fade>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
