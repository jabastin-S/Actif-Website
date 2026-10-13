import { COMPANY } from "@/content/site";

const LINKS = [
  { href: "#heritage", label: "Heritage" },
  { href: "#applications", label: "Applications" },
  { href: "#materials", label: "Materials" },
  { href: "#manufacturing", label: "Manufacturing" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#responsibility", label: "Responsibility" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="on-dark overflow-hidden bg-charcoal text-on-dark">
      <div className="shell border-t border-rule-dark pt-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <p className="max-w-[34ch] text-on-dark-soft sm:col-span-2 lg:col-span-4">
            Knitted textile development and manufacturing, Tiruppur. A unit of {COMPANY.parent},
            with textile heritage since {COMPANY.heritageYear}.
          </p>
          <nav aria-label="Footer" className="lg:col-span-5 lg:col-start-6">
            <ul className="grid grid-cols-2 gap-x-8">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-on-dark-soft transition-colors hover:text-on-dark"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-on-dark-soft lg:col-span-2 lg:col-start-11">
            <p className="py-2">{COMPANY.location}</p>
            <a href={`mailto:${COMPANY.email}`} className="inline-flex min-h-11 items-center transition-colors hover:text-on-dark">
              {COMPANY.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-sm text-on-dark-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="max-w-[56ch] sm:text-right">
            Photographs on this site are illustrative images and do not depict ACTIF facilities or
            products.
          </p>
        </div>

        <p
          aria-hidden
          className="display -mb-[0.16em] mt-8 select-none text-center text-[clamp(7rem,26vw,28rem)] leading-[0.8] tracking-[-0.03em] text-on-dark/10"
        >
          ACTIF
        </p>
      </div>
    </footer>
  );
}
