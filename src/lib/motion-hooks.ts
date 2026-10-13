import { useEffect, useState, type RefObject } from "react";

/** The one easing for the site: a confident expo-out. Mirrors `--ease-out` in styles.css. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Steady in-out for travelling reveals (the course reveal), so the edge reads as it moves. */
export const EASE_STEADY = [0.45, 0, 0.2, 1] as const;

/* ---------- Reached: one shared, frame-batched scroll check for every reveal ---------- */

type Watcher = { node: Element; fraction: number; done: () => void };
const watchers = new Set<Watcher>();
let frame = 0;
let bound = false;

function flush() {
  frame = 0;
  const limit = window.innerHeight;
  for (const watcher of watchers) {
    if (watcher.node.getBoundingClientRect().top < limit * watcher.fraction) {
      watchers.delete(watcher);
      watcher.done();
    }
  }
  if (watchers.size === 0) unbind();
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}
function unbind() {
  if (!bound) return;
  bound = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}
function watch(watcher: Watcher) {
  watchers.add(watcher);
  if (!bound) {
    bound = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
  return () => {
    watchers.delete(watcher);
    if (watchers.size === 0) unbind();
  };
}

/**
 * True once the element's top has reached the given fraction of the viewport height, including
 * when it is already above the viewport. An IntersectionObserver alone misses elements that a
 * jump (anchor link, restored scroll) carries straight past, which would leave them hidden.
 */
export function useReached(ref: RefObject<Element | null>, fraction = 0.9) {
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || reached) return;
    return watch({ node, fraction, done: () => setReached(true) });
  }, [ref, fraction, reached]);
  return reached;
}

/** Media query as state; false on the server and the first client render. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}
