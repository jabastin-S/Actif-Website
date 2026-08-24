import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="relative bg-forest-deep pt-32 pb-12 overflow-hidden text-on-forest">
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        {/* Subtle animated textile pattern */}
        <div className="absolute inset-0 animate-drift knit-grain" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="flex flex-col gap-8"
          >
            <div>
              <h2 className="display text-4xl sm:text-5xl tracking-widest">ACTIF</h2>
              <p className="label-eyebrow text-champagne/80 mt-2">GLOBAL VENTURES PVT LTD</p>
            </div>

            <p className="display text-2xl text-on-forest/80 max-w-sm mt-8">
              Future-ready sustainable knitted home textiles.
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="grid gap-12 sm:grid-cols-2"
          >
            <nav className="flex flex-col gap-4">
              <a
                href="#about"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                About
              </a>
              <a
                href="#why-actif"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                Why Actif
              </a>
              <a
                href="#sustainability"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                Sustainability
              </a>
              <a
                href="#manufacturing"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                Manufacturing
              </a>
              <a
                href="#products"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                Products
              </a>
              <a
                href="#certifications"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                Certifications
              </a>
              <a
                href="#contact"
                className="link-underline w-fit text-on-forest/70 hover:text-on-forest transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex flex-col gap-4 text-on-forest/70 text-sm font-light">
              <p>Tirupur, Tamil Nadu, India</p>
              <a href="mailto:info@actif.ltd" className="hover:text-on-forest transition-colors">
                info@actif.ltd
              </a>
              <a href="tel:+919894602235" className="hover:text-on-forest transition-colors">
                +91 98946 02235
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          className="mt-32 border-t border-on-forest/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 label-eyebrow text-on-forest/40"
        >
          <p>
            &copy; {new Date().getFullYear()} ACTIF GLOBAL VENTURES PVT LTD. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
