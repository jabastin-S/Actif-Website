import { CHAPTERS } from "@/content/chapters";
import { COMPANY } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell py-16 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-6">
            <p className="display text-[clamp(4.5rem,13vw,12rem)] leading-[0.85] tracking-[-0.05em]">
              ACTIF
            </p>
            <p className="mt-5 text-sm tracking-[0.2em] text-paper/70 uppercase">
              Global Ventures Pvt Ltd
            </p>
            <p className="mt-8 max-w-[40ch] text-paper/70">
              Knitted textile development and manufacturing, Tiruppur. A unit of {COMPANY.parent},
              with textile heritage since {COMPANY.heritageYear}.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-8">
            <ul className="space-y-1">
              {CHAPTERS.filter((c) => c.id !== "intro").map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={chapter.href}
                    className="inline-flex min-h-11 items-center text-paper/75 transition-colors hover:text-paper"
                  >
                    {chapter.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-1 text-paper/75 lg:col-span-3">
            <p className="py-2">{COMPANY.location}</p>
            <p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex min-h-11 items-center transition-colors hover:text-paper"
              >
                {COMPANY.email}
              </a>
            </p>
            <p>
              <a
                href={COMPANY.phoneHref}
                className="inline-flex min-h-11 items-center transition-colors hover:text-paper"
              >
                {COMPANY.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/20 pt-6 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <a href="#top" className="inline-flex min-h-11 items-center hover:text-paper">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
