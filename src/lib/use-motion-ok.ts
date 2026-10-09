import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * True once mounted and the visitor has not asked for reduced motion. Starts false so the
 * server render and the first client render agree (no hydration mismatch), then enables
 * scroll-linked motion.
 */
export function useMotionOk() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduced;
}
