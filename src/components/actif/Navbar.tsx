import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Why Actif", href: "#why-actif" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Manufacturing", href: "#manufacturing" },
  { label: "Products", href: "#products" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlayMode = !scrolled && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-border/70 bg-ivory/80 py-4 backdrop-blur-xl"
            : "border-b border-transparent py-7",
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
          <a
            href="#top"
            className={cn(
              "display text-2xl tracking-[0.34em] transition-colors duration-700 md:text-[1.7rem]",
              overlayMode ? "text-on-forest" : "text-charcoal",
            )}
          >
            ACTIF
          </a>

          <nav className="hidden items-center gap-8 xl:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline label-eyebrow tracking-[0.18em] transition-colors duration-500",
                  overlayMode
                    ? "text-on-forest/80 hover:text-on-forest"
                    : "text-charcoal-soft hover:text-charcoal",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <a
              href="#contact"
              className={cn(
                "btn-luxe hidden !px-6 !py-3 lg:inline-flex",
                overlayMode && "btn-luxe-light",
              )}
            >
              <span>Partner With Us</span>
            </a>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="group flex h-10 w-10 flex-col items-end justify-center gap-[7px] xl:hidden"
            >
              <span
                className={cn(
                  "h-px w-8 transition-all duration-500",
                  open ? "translate-y-[4px] rotate-45 bg-on-forest" : "",
                  !open && (overlayMode ? "bg-on-forest" : "bg-charcoal"),
                )}
              />
              <span
                className={cn(
                  "h-px transition-all duration-500",
                  open
                    ? "w-8 -translate-y-[4px] -rotate-45 bg-on-forest"
                    : cn("w-5 group-hover:w-8", overlayMode ? "bg-on-forest" : "bg-charcoal"),
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-forest-deep px-6 pb-12 pt-28 md:px-10"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <nav className="flex flex-1 flex-col justify-center gap-1">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={reduced ? undefined : { opacity: 0, y: 24 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.16 + i * 0.05, ease: EASE }}
                  className="display border-b border-on-forest/10 py-4 text-4xl text-on-forest sm:text-5xl"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-luxe btn-luxe-light mt-8 w-full"
            >
              <span>Partner With Us</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
