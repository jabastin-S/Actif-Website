import { PILLARS, RESPONSIBLE_MATERIALS } from "@/content/site";

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
            Responsible choices, from fibre to governance.
          </h2>
          <p className="copy text-ink lg:col-span-5 lg:col-start-8 lg:pb-2">
            Our sustainability framework covers environmental, social and governance areas, with
            growing alignment to export-market readiness, ESG integration, traceability and
            digital readiness.
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
          <div className="lg:col-span-6">
            <h3 className="display text-[clamp(1.9rem,3vw,2.8rem)] text-ink">
              Responsible material pathways.
            </h3>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {RESPONSIBLE_MATERIALS.map((item) => (
                <li key={item} className="border-t border-rule py-3.5 text-[0.9375rem] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="display text-[clamp(1.9rem,3vw,2.8rem)] text-ink">
              Certification and documentation.
            </h3>
            <p className="mt-6 border-t border-rule pt-4 text-[1rem] text-ink">
              We share certifications and sustainability claims only when they are currently
              valid, apply to the operation or product in question, and are officially authorised.
            </p>
            <p className="mt-4 text-[0.9375rem] text-ink-soft">
              Ask us for the documentation that applies to your programme.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
