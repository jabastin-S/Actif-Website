import { useEffect, useRef, useState } from "react";
import { APPLICATIONS, CHAPTERS } from "@/content/chapters";
import { cn } from "@/lib/utils";
import { useStage } from "@/components/stage/useStage";

const LINKS = [
  { label: "Heritage", href: "#heritage" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Responsibility", href: "#responsibility" },
  { label: "Contact", href: "#contact" },
] as const;

export function Header() {
  const { active } = useStage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const appsWrap = useRef<HTMLDivElement>(null);

  // mobile menu: lock scroll, move focus in, close on Escape and return focus
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

  // applications dropdown: close on outside press and Escape
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

  const inApplications = (["home", "upholstery", "industrial", "medical"] as string[]).includes(
    active,
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-rule bg-paper">
        <div className="shell flex h-full items-center justify-between gap-6">
          <a
            href="#top"
            aria-label="ACTIF Global Ventures, back to top"
            className="flex items-center gap-3 py-2 text-[1.125rem] font-medium tracking-[0.28em] text-ink"
          >
            <span aria-hidden className="block size-2.5 bg-chap" />
            ACTIF
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            <div ref={appsWrap} className="relative">
              <button
                type="button"
                aria-expanded={appsOpen}
                aria-controls="apps-menu"
                onClick={() => setAppsOpen((value) => !value)}
                className={cn(
                  "flex h-11 items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink",
                  inApplications && "text-ink",
                )}
              >
                Applications
                <span
                  aria-hidden
                  className={cn(
                    "block h-1.5 w-1.5 rotate-45 border-r border-b border-current transition-transform duration-300",
                    appsOpen ? "-translate-y-px -rotate-[135deg]" : "-translate-y-0.5",
                  )}
                />
              </button>
              <ul
                id="apps-menu"
                hidden={!appsOpen}
                className="absolute top-full left-0 mt-2 w-72 border border-rule bg-paper p-2 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]"
              >
                {APPLICATIONS.map((app) => (
                  <li key={app.id}>
                    <a
                      href={app.href}
                      onClick={() => setAppsOpen(false)}
                      className="flex min-h-11 items-center justify-between px-3 text-sm text-ink transition-colors hover:bg-paper-2"
                    >
                      {app.name}
                      {active === app.id && (
                        <span aria-hidden className="size-2 bg-chap-ink" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-11 items-center text-sm font-medium text-ink-soft transition-colors hover:text-ink",
                  active === link.href.slice(1) && "text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" className="btn hidden min-h-11 gap-6 py-2 sm:inline-flex">
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
          "fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto bg-paper px-[var(--gutter)] pt-6 pb-10 transition-[clip-path] duration-[800ms] ease-[var(--ease-out)] lg:hidden",
          menuOpen ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Mobile">
          <ul>
            {CHAPTERS.filter((c) => c.id !== "intro").map((chapter, index) => (
              <li key={chapter.id} className="border-b border-rule">
                <a
                  ref={index === 0 ? firstMenuLink : undefined}
                  href={chapter.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-14 items-center justify-between py-3 text-[1.5rem] font-light tracking-[-0.02em] text-ink"
                >
                  {chapter.label}
                  {active === chapter.id && <span aria-hidden className="size-2.5 bg-chap-ink" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="btn mt-8 w-full">
          Enquire
        </a>
      </div>
    </>
  );
}
