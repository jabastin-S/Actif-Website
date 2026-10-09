import { useSyncExternalStore } from "react";
import type { SectorId } from "@/content/site";

/** Tiny store so a sector panel can pre-select the sector in the contact form. */
let current: SectorId | "" = "";
const subscribers = new Set<() => void>();

export const enquiry = {
  get: () => current,
  set(next: SectorId | "") {
    current = next;
    subscribers.forEach((notify) => notify());
  },
  subscribe(notify: () => void) {
    subscribers.add(notify);
    return () => {
      subscribers.delete(notify);
    };
  },
};

export function useEnquirySector() {
  return useSyncExternalStore(enquiry.subscribe, enquiry.get, () => "" as const);
}
