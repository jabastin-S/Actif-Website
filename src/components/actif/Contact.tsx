import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  const reduced = useReducedMotion();

  return (
    <section id="contact" className="relative bg-ivory py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 linen-veil opacity-40 pointer-events-none" />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <div className="grid gap-24 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <SectionHeader
              label="GET IN TOUCH"
              headline="Start a Conversation."
              className="mb-16"
            />

            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="flex flex-col gap-10"
            >
              <div>
                <h4 className="display text-3xl text-charcoal mb-4">
                  ACTIF GLOBAL VENTURES PVT LTD
                </h4>
                <div className="flex flex-col gap-2 text-charcoal-soft">
                  <p>Tirupur, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <a
                  href="mailto:info@actif.ltd"
                  className="group inline-flex items-center gap-4 text-charcoal transition-colors hover:text-sage"
                >
                  <span className="label-eyebrow text-charcoal/50 group-hover:text-sage/70">
                    EMAIL
                  </span>
                  <span className="text-xl">info@actif.ltd</span>
                </a>

                <a
                  href="https://actif.ltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 text-charcoal transition-colors hover:text-sage"
                >
                  <span className="label-eyebrow text-charcoal/50 group-hover:text-sage/70">
                    WEB
                  </span>
                  <span className="text-xl">actif.ltd</span>
                </a>

                <a
                  href="tel:+919894602235"
                  className="group inline-flex items-center gap-4 text-charcoal transition-colors hover:text-sage"
                >
                  <span className="label-eyebrow text-charcoal/50 group-hover:text-sage/70">
                    PHONE
                  </span>
                  <span className="text-xl">+91 98946 02235</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Minimal Luxury Form */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, x: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="rounded-3xl bg-bone p-8 sm:p-12"
          >
            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="label-eyebrow text-charcoal/70">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="label-eyebrow text-charcoal/70">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                  />
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="label-eyebrow text-charcoal/70">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="label-eyebrow text-charcoal/70">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                  />
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="country" className="label-eyebrow text-charcoal/70">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    className="border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="product" className="label-eyebrow text-charcoal/70">
                    Product Interest
                  </label>
                  <input
                    type="text"
                    id="product"
                    className="border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="label-eyebrow text-charcoal/70">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="resize-none border-b border-charcoal/20 bg-transparent pb-2 pt-1 text-charcoal outline-none transition-colors focus:border-sage"
                />
              </div>

              <button type="submit" className="btn-luxe self-start mt-4">
                <span>Submit Inquiry</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
