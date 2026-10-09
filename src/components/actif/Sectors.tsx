import { useState } from "react";
import { cn } from "@/lib/utils";
import { SECTORS } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { tintVar } from "@/lib/tint";
import { Fade, MaskLine, Swatch } from "./primitives";

export function Sectors() {
  const [active, setActive] = useState(0);

  return (
    <section id="sectors" className="relative bg-linen py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="display text-[clamp(2.4rem,5.2vw,4.75rem)] text-ink lg:col-span-7">
            <MaskLine>Four sectors,</MaskLine>
            <MaskLine delay={0.08}>one knitting mill.</MaskLine>
          </h2>
          <Fade delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="prose-measure text-ink-soft">
              Home textiles are where we are most developed. Upholstery, industrial and medical
              programmes are developed to each customer&rsquo;s brief.
            </p>
          </Fade>
        </div>

        <ul className="mt-14 flex flex-col gap-4 lg:mt-20 lg:h-[36rem] lg:flex-row lg:gap-3">
          {SECTORS.map((sector, index) => {
            const isActive = active === index;
            return (
              <li
                key={sector.id}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cn(
                  "group relative flex min-w-0 flex-col bg-bleach transition-[flex-grow] duration-[900ms] ease-[var(--ease-out)] lg:basis-0",
                  isActive ? "lg:grow-[2.6]" : "lg:grow-[1]",
                )}
              >
                <div className="pinked-bottom relative h-40 shrink-0 overflow-hidden sm:h-52 lg:h-auto lg:flex-1">
                  <Swatch
                    structure={sector.structure}
                    tint={tintVar(sector.tint)}
                    scale={isActive ? 1.15 : 1}
                    className="transition-transform duration-[1400ms] ease-[var(--ease-out)]"
                  />
                </div>

                <div className="flex flex-col gap-3 px-6 pt-5 pb-7 lg:h-48 lg:shrink-0">
                  <h3 className="display text-[1.6rem] leading-[1.08] text-ink lg:text-[1.75rem]">
                    {sector.name}
                  </h3>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-[900ms] ease-[var(--ease-out)] max-lg:grid-rows-[1fr] max-lg:opacity-100",
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[44ch] text-[0.95rem] text-ink-soft">{sector.body}</p>
                      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                        <a
                          href="#contact"
                          onClick={() => enquiry.set(sector.id)}
                          className="link-thread font-medium text-cochineal"
                        >
                          Enquire about {sector.short.toLowerCase()}
                        </a>
                        {sector.id === "home" ? (
                          <a href="#range" className="link-thread text-ink-soft hover:text-ink">
                            See the range
                          </a>
                        ) : (
                          <span className="text-ink-soft">{sector.note}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
