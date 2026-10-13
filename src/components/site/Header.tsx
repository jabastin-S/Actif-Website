import { motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const APPLICATIONS = [
  { id: "home", name: "Home & Bedding" },
  { id: "upholstery", name: "Upholstery" },
  { id: "industrial", name: "Industrial & Technical" },
  { id: "medical", name: "Medical & Healthcare" },
] as const;

const LINKS = [
  { id: "materials", label: "Materials" },
  { id: "heritage", label: "Heritage" },
  { id: "capabilities", label: "Capabilities" },
  { id: "responsibility", label: "Responsibility" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = [
  "heritage",
  "applications",
  "materials",
  "home",
  "upholstery",
  "industrial",
  "medical",
  "manufacturing",
  "capabilities",
  "responsibility",
  "contact",
];

/** Which section is under the upper-middle of the viewport; used for nav feedback only. */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    const onScroll = () => {
      if (window.scrollY < 120) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return active;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const appsWrap = useRef<HTMLDivElement>(null);
  const active = useActiveSection();
  // Reading progress: a motion value bound straight to the transform, no re-render per scroll.
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!appsOpen) return;
    const onDown = (event: PointerEvent) => {
      if (!appsWrap.current?.contains(event.target as Node)) setAppsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAppsOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [appsOpen]);

  const inApps = APPLICATIONS.some((app) => app.id === active) || active === "applications";

  const linkTone = "text-ink-soft hover:text-ink";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] bg-ivory transition-shadow duration-700 ease-[var(--ease-out)]",
          scrolled ? "shadow-[0_1px_0_var(--rule)]" : "shadow-[0_1px_0_transparent]",
        )}
      >
        <motion.span
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-olive"
        />
        <div className="shell flex h-full items-center justify-between gap-6">
          <a
            href="#top"
            aria-label="ACTIF Global Ventures, back to top"
            className="font-display text-[1.75rem] leading-none tracking-[0.3em] text-ink"
          >
            ACTIF
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            <div ref={appsWrap} className="relative">
              <button
                type="button"
                aria-expanded={appsOpen}
                aria-controls="apps-menu"
                onClick={() => setAppsOpen((value) => !value)}
                data-active={inApps}
                className={cn(
                  "nav-line flex h-11 items-center gap-2 text-sm font-medium transition-colors duration-500",
                  linkTone,
                  inApps && "text-ink",
                )}
              >
                Applications
                <span
                  aria-hidden
                  className={cn(
                    "block size-1.5 rotate-45 border-r border-b border-current transition-transform duration-300",
                    appsOpen ? "-translate-y-px -rotate-[135deg]" : "-translate-y-0.5",
                  )}
                />
              </button>
              <ul
                id="apps-menu"
                inert={!appsOpen}
                className={cn(
                  "absolute top-full left-0 mt-2 w-72 origin-top bg-ivory p-2 text-ink shadow-[0_24px_48px_-28px_rgb(0_0_0/0.45)] transition-[opacity,transform,visibility] ease-[var(--ease-out)]",
                  appsOpen
                    ? "visible translate-y-0 opacity-100 duration-300"
                    : "invisible -translate-y-1.5 opacity-0 duration-150",
                )}
              >
                {APPLICATIONS.map((app) => (
                  <li key={app.id}>
                    <a
                      href={`#${app.id}`}
                      onClick={() => setAppsOpen(false)}
                      className="flex min-h-11 items-center justify-between px-3 text-sm transition-colors duration-300 hover:bg-linen"
                    >
                      {app.name}
                      {active === app.id && <span aria-hidden className="size-1.5 bg-olive" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                data-active={active === link.id}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "nav-line flex h-11 items-center text-sm font-medium transition-colors duration-500",
                  linkTone,
                  active === link.id && "text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="btn hidden min-h-11 gap-6 py-2 sm:inline-flex"
            >
              Enquire
            </a>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-11 items-center gap-3 px-1 text-sm font-medium text-ink lg:hidden"
            >
              {menuOpen ? "Close" : "Menu"}
              <span aria-hidden className="relative block h-2.5 w-6">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                    menuOpen ? "top-1 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                    menuOpen ? "top-1 -rotate-45" : "top-2.5",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!menuOpen}
        className={cn(
          "on-dark fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-charcoal px-[var(--gutter)] pt-[calc(var(--header-h)+2rem)] pb-10 text-on-dark transition-[clip-path] duration-[900ms] ease-[var(--ease-out)] lg:hidden",
          menuOpen ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Mobile">
          <ul>
            {[...APPLICATIONS.map((a) => ({ id: a.id, label: a.name })), ...LINKS].map(
              (item, index) => (
                <li
                  key={item.id}
                  style={{ transitionDelay: menuOpen ? `${180 + index * 35}ms` : "0ms" }}
                  className={cn(
                    "border-b border-rule-dark transition-[opacity,transform] duration-700 ease-[var(--ease-out)]",
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
                  )}
                >
                  <a
                    ref={index === 0 ? firstMenuLink : undefined}
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-14 items-center justify-between py-2 font-display text-[2rem] leading-none"
                  >
                    {item.label}
                    {active === item.id && <span aria-hidden className="size-2 bg-olive-soft" />}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="btn btn-light mt-8 w-full">
          Enquire
        </a>
      </div>
    </>
  );
}
