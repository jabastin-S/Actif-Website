import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const PRODUCTS = [
  {
    name: "Bed Sheets",
    materials: "Cotton, Bamboo, Tencel, Blends",
    color: "var(--bone)",
  },
  {
    name: "Fitted Sheets",
    materials: "Cotton, Blends",
    color: "var(--ivory)",
  },
  {
    name: "Pillow Cases",
    materials: "Cotton, Bamboo, Silk-blends",
    color: "var(--sand)",
  },
  {
    name: "Duvet Covers",
    materials: "Cotton, Linen, Bamboo",
    color: "var(--champagne)",
  },
  {
    name: "Baby Collection",
    materials: "Organic Cotton, Bamboo",
    color: "var(--dusty-blue)",
  },
  {
    name: "Hospitality Collection",
    materials: "Cotton-Poly Blends, High-Durability",
    color: "var(--sage)",
  },
];

export function ProductPortfolio() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="products" className="relative bg-ivory py-32 overflow-hidden md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 relative z-10">
        <SectionHeader
          label="09 — PRODUCT PORTFOLIO"
          headline="A complete knitted bed-linen range."
          className="mb-20"
        />

        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-16">
          {/* List */}
          <div className="flex flex-col gap-4 lg:w-1/3">
            {PRODUCTS.map((product, i) => {
              const isActive = activeIndex === i;
              return (
                <motion.button
                  key={product.name}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  initial={reduced ? undefined : { opacity: 0, x: -20 }}
                  whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                  className={cn(
                    "group relative flex flex-col items-start px-6 py-4 text-left transition-all duration-500",
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full w-[2px] transition-colors duration-500",
                      isActive ? "bg-charcoal" : "bg-charcoal/10",
                    )}
                  />

                  <h3
                    className={cn(
                      "display text-3xl transition-colors duration-500 sm:text-4xl",
                      isActive ? "text-charcoal" : "text-charcoal/40 group-hover:text-charcoal/60",
                    )}
                  >
                    {product.name}
                  </h3>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="label-eyebrow mt-4 text-charcoal-soft">
                          Materials: {product.materials}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Visual Gallery */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.95 }}
            whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: EASE }}
            className="relative h-[50vh] min-h-[400px] w-full lg:h-[80vh] lg:w-[60%] overflow-hidden rounded-[2rem] bg-bone"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: PRODUCTS[activeIndex].color }}
              >
                {/* Abstract soft textile visual placeholder */}
                <div className="absolute inset-0 linen-veil mix-blend-multiply opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent" />
                <motion.div
                  className="absolute inset-0 animate-drift opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, var(--charcoal) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
