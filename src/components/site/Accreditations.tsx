import { ACCREDITATIONS } from "@/content/site";
import { KnitModel } from "./KnitModel";
import { MaskLine, Rise } from "./motion";

/**
 * Its own chapter on the ivory ground: the claim beside a plate on which a swatch of jersey is
 * knitted course by course as it scrolls into view (yarn, knit, finish), then the four standards
 * in a ruled band with room around each.
 */
export function Accreditations() {
  return (
    <section id="accreditations" aria-labelledby="accreditations-title" className="bg-ivory section-y">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <div className="lg:col-span-5">
          <h2 id="accreditations-title" className="display text-[clamp(2.6rem,4.6vw,4.8rem)] text-ink">
            <MaskLine>Certified at every</MaskLine>
            <MaskLine delay={0.08}>stage: yarn, knit</MaskLine>
            <MaskLine delay={0.16}>
              and <em>finish.</em>
            </MaskLine>
          </h2>
          <p className="copy mt-8 text-ink-soft">
            Certificate scope and validity apply to specific operations and products. Ask us for
            the certificates and documentation that cover your programme.
          </p>
          <a href="#contact" className="btn-quiet mt-4 w-fit">
            Request documentation
          </a>
        </div>
        <KnitModel className="lg:col-span-7" />
      </div>

      <div className="shell mt-14 lg:mt-20">
        <ul className="ruled-cells grid border-y border-rule sm:grid-cols-2 lg:grid-cols-4">
          {ACCREDITATIONS.map((item, index) => (
            <li key={item.name} className="py-8 sm:px-8 lg:py-12">
              <Rise delay={index * 0.08}>
                <p className="display text-[clamp(2.4rem,3.2vw,3.2rem)] leading-none text-ink">{item.name}</p>
                <p className="mt-6 max-w-[28ch] text-[0.9375rem] leading-relaxed text-ink-soft">{item.body}</p>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
