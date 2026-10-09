import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV } from "@/content/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = !scrolled && !open; // light text over the dark hero

  return (
    <>
      <header
        data-tone={light || open ? "dark" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,padding] duration-700 ease-[var(--ease-out)]",
          scrolled && !open
            ? "bg-greige/88 py-3 shadow-[0_1px_0_var(--border)] backdrop-blur-md"
            : "py-5 md:py-6",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <a
            href="#top"
            aria-label="ACTIF Global Ventures, back to top"
            className={cn(
              "display text-[1.75rem] leading-none tracking-[0.12em] transition-colors duration-700",
              light || open ? "text-on-indigo" : "text-ink",
            )}
          >
            ACTIF
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 xl:flex">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "link-thread text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-colors duration-500",
                  light ? "text-on-indigo/85 hover:text-on-indigo" : "text-ink-soft hover:text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className={cn(
                "btn-label hidden min-h-11 px-5 py-2 text-xs md:inline-flex",
                light
                  ? "text-on-indigo [--btn-fill:var(--on-indigo)] hover:text-indigo"
                  : "text-ink [--btn-fill:var(--ink)] hover:text-bleach",
              )}
            >
              Partner with us
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "relative flex size-11 items-center justify-center xl:hidden",
                light || open ? "text-on-indigo" : "text-ink",
              )}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-3 w-7">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                    open ? "top-1.5 -rotate-45" : "top-3",
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
        aria-hidden={!open}
        inert={!open}
        data-tone="dark"
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between bg-indigo px-[var(--gutter)] pt-28 pb-10 text-on-indigo transition-[clip-path] duration-[900ms] ease-[var(--ease-out)] xl:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV.map((link, index) => (
              <li key={link.href} className="border-b border-on-indigo/15">
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="display flex items-baseline justify-between py-4 text-[2.4rem] leading-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-4 text-sm text-on-indigo-soft">
          <a href="mailto:info@actif.ltd" className="link-thread w-fit text-on-indigo">
            info@actif.ltd
          </a>
          <a href="tel:+919894602235" className="link-thread w-fit text-on-indigo">
            +91 98946 02235
          </a>
          <p>Tiruppur, Tamil Nadu, India</p>
        </div>
      </div>
    </>
  );
}
