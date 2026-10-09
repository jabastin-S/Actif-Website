import { COMPANY, NAV } from "@/content/site";

export function Footer() {
  return (
    <footer data-tone="dark" className="relative overflow-hidden bg-indigo pt-20 pb-10 text-on-indigo md:pt-28">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-6">
            <p className="display text-[clamp(4rem,12vw,9rem)] leading-[0.85] tracking-[-0.02em]">
              ACTIF
            </p>
            <p className="label mt-4 text-on-indigo-soft">Global Ventures Pvt Ltd</p>
            <p className="mt-8 max-w-[34ch] text-on-indigo-soft">
              Knitted textile development and manufacturing, Tiruppur. A unit of {COMPANY.parent},
              with textile heritage since {COMPANY.heritageYear}.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-8">
            <ul className="flex flex-col gap-3">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-thread text-on-indigo-soft hover:text-on-indigo">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 text-on-indigo-soft lg:col-span-3">
            <p>{COMPANY.location}</p>
            <a href={`mailto:${COMPANY.email}`} className="link-thread w-fit hover:text-on-indigo">
              {COMPANY.email}
            </a>
            <a href={COMPANY.phoneHref} className="link-thread w-fit hover:text-on-indigo">
              {COMPANY.phone}
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-on-indigo/15 pt-6 text-sm text-on-indigo-soft sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <a href="#top" className="link-thread hover:text-on-indigo">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
