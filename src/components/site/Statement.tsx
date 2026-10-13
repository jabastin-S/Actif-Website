import { COMPANY, STRENGTHS } from "@/content/site";
import { MaskLine } from "./motion";

/** Full-width typography, then the strengths as one aligned ruled row set. */
export function Statement() {
  return (
    <section
      id="heritage"
      aria-labelledby="heritage-title"
      className="bg-ivory py-[clamp(6rem,13vw,13rem)]"
    >
      <div className="shell">
        <h2
          id="heritage-title"
          className="display max-w-[22ch] text-[clamp(2.2rem,6vw,6rem)] text-ink lg:ml-[7%]"
        >
          <MaskLine>A textile house with roots</MaskLine>
          <MaskLine delay={0.08}>in {COMPANY.heritageYear}, making knitted fabrics</MaskLine>
          <MaskLine delay={0.16}>for the beds, seats, machines</MaskLine>
          <MaskLine delay={0.24}>and wards where they work.</MaskLine>
        </h2>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4 lg:col-start-8">
            <p className="copy text-ink">
              ACTIF Global Ventures is a unit of {COMPANY.parent}, based in Tiruppur, India&rsquo;s
              knitwear capital.
            </p>
            <p className="copy text-ink-soft">
              We develop and manufacture knitted textiles for home, interior, industrial and
              healthcare use, with every stage from yarn to finished pack under one roof.
            </p>
          </div>
        </div>

        <h3 className="sr-only">Why partners work with ACTIF</h3>
        <ul className="mt-24 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-32 lg:grid-cols-3">
          {STRENGTHS.map((item) => (
            <li key={item.title} className="border-t border-rule pt-6">
              <p className="display text-[1.9rem] leading-[1.05] text-ink">{item.title}</p>
              <p className="mt-3 max-w-[34ch] text-[0.9375rem] text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
