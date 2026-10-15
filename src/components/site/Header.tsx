import { motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { COMPANY } from "@/content/site";
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
  // no bar link of its own: listed so the previous section's mark clears while it is in view
  "accreditations",
  "contact",
];

const MENU_ROW =
  "border-b border-rule-dark transition-[opacity,transform] duration-700 ease-[var(--ease-out)]";
const MENU_SHOWN = "translate-y-0 opacity-100";
const MENU_HIDDEN = "translate-y-5 opacity-0";
// display-size rows, a little smaller on short screens (landscape phones, small Android)
const MENU_LINK =
  "flex min-h-14 items-center justify-between py-2 font-display text-[2rem] leading-none [@media(max-height:44rem)]:min-h-12 [@media(max-height:44rem)]:text-[1.75rem]";
const menuDelay = (open: boolean, index: number) => ({
  transitionDelay: open ? `${180 + index * 35}ms` : "0ms",
});

/** Which section is under the upper-middle of the viewport; used for nav feedback only. */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
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
  const [menuApps, setMenuApps] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuItem = useRef<HTMLButtonElement>(null);
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

  // While the menu is open it is the whole page: the rest is inert (focus cannot wander behind
  // it), the root stops scrolling (body alone does not stop it on iOS) and the voice orb steps
  // aside so it cannot cover the menu's last item.
  useEffect(() => {
    if (!menuOpen) {
      setMenuApps(false);
      return;
    }
    const root = document.documentElement;
    root.dataset["menu"] = "open";
    const behind = [...document.body.children].filter(
      (node) =>
        !node.contains(menuButton.current) &&
        node.id !== "site-menu" &&
        node.tagName !== "SCRIPT",
    );
    behind.forEach((node) => node.setAttribute("inert", ""));
    firstMenuItem.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      delete root.dataset["menu"];
      behind.forEach((node) => node.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // the full bar takes over at 1024px (a tablet turned to landscape): close the overlay menu
  // rather than leave the page locked behind a menu that is no longer shown
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (wide.matches) setMenuOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

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

  const inApps =
    APPLICATIONS.some((app) => app.id === active) || active === "applications";

  const linkTone = "text-ink-soft hover:text-ink";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] bg-ivory transition-shadow duration-700 ease-[var(--ease-out)]",
          scrolled
            ? "shadow-[0_1px_0_var(--rule)]"
            : "shadow-[0_1px_0_transparent]",
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
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-11 items-center font-display text-[1.75rem] leading-none tracking-[0.3em] text-ink"
          >
            ACTIF
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-9 lg:flex"
          >
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
                    appsOpen
                      ? "-translate-y-px -rotate-[135deg]"
                      : "-translate-y-0.5",
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
                      {active === app.id && (
                        <span aria-hidden className="size-1.5 bg-olive" />
                      )}
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

          <div className="flex items-center gap-4 sm:gap-3">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-quiet min-h-11 py-2 text-sm sm:hidden"
            >
              Enquire
            </a>
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
          "on-dark fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-charcoal px-[var(--gutter)] pt-[calc(var(--header-h)+1.5rem)] pb-[max(2rem,env(safe-area-inset-bottom))] text-on-dark transition-[clip-path] duration-[900ms] ease-[var(--ease-out)] lg:hidden",
          menuOpen
            ? "[clip-path:inset(0_0_0_0)]"
            : "[clip-path:inset(0_0_100%_0)]",
        )}
      >
        {/* the same structure as the desktop bar: Applications opens its four chapters */}
        <nav aria-label="Mobile">
          <ul>
            <li
              className={cn(MENU_ROW, menuOpen ? MENU_SHOWN : MENU_HIDDEN)}
              style={menuDelay(menuOpen, 0)}
            >
              <button
                ref={firstMenuItem}
                type="button"
                aria-expanded={menuApps}
                aria-controls="menu-apps"
                onClick={() => setMenuApps((value) => !value)}
                className={cn(MENU_LINK, "w-full text-left")}
              >
                Applications
                <span
                  aria-hidden
                  className={cn(
                    "mr-1 block size-2.5 rotate-45 border-r border-b border-current transition-transform duration-500 ease-[var(--ease-out)]",
                    menuApps
                      ? "translate-y-1 -rotate-[135deg]"
                      : "-translate-y-1",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)]",
                  menuApps ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <ul
                  id="menu-apps"
                  inert={!menuApps}
                  className="overflow-hidden"
                >
                  {APPLICATIONS.map((app) => (
                    <li key={app.id}>
                      <a
                        href={`#${app.id}`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active === app.id ? "true" : undefined}
                        className="flex min-h-12 items-center justify-between pl-5 text-[1.0625rem] text-on-dark-soft transition-colors hover:text-on-dark"
                      >
                        {app.name}
                        {active === app.id && (
                          <span
                            aria-hidden
                            className="size-1.5 bg-olive-soft"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                  <li aria-hidden className="h-3" />
                </ul>
              </div>
            </li>
            {LINKS.map((link, index) => (
              <li
                key={link.id}
                className={cn(MENU_ROW, menuOpen ? MENU_SHOWN : MENU_HIDDEN)}
                style={menuDelay(menuOpen, index + 1)}
              >
                <a
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={MENU_LINK}
                >
                  {link.label}
                  {active === link.id && (
                    <span aria-hidden className="size-2 bg-olive-soft" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            "mt-auto pt-8",
            menuOpen ? MENU_SHOWN : MENU_HIDDEN,
            "transition-[opacity,transform] duration-700 ease-[var(--ease-out)]",
          )}
          style={menuDelay(menuOpen, LINKS.length + 1)}
        >
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="btn btn-light w-full"
          >
            Enquire
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="mt-2 inline-flex min-h-11 items-center text-[0.9375rem] text-on-dark-soft transition-colors hover:text-on-dark"
          >
            {COMPANY.email}
          </a>
        </div>
      </div>
    </>
  );
}
