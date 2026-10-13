import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SPECIMENS, type ChapterId } from "@/content/chapters";
import { StageContext, useStage } from "./useStage";

/** Tracks which chapter is on the stage and mirrors its colours into --chap / --chap-ink. */
export function StageProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<ChapterId>("intro");

  const setActive = useCallback((id: ChapterId) => setActiveState(id), []);

  useEffect(() => {
    const root = document.documentElement;
    const key = active === "contact" ? "intro" : active;
    const specimen = SPECIMENS[key];
    root.style.setProperty("--chap", specimen.chap);
    root.style.setProperty("--chap-ink", specimen.chapInk);
  }, [active]);

  const value = useMemo(() => ({ active, setActive }), [active, setActive]);
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}

/**
 * A chapter of the page. When it crosses a band just above the middle of the viewport it
 * becomes the active chapter and the stage switches specimen.
 */
export function Chapter({
  id,
  children,
  className,
  as: Tag = "section",
  labelledBy,
}: {
  id: ChapterId;
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { setActive } = useStage();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(id);
        }
      },
      { rootMargin: "-38% 0px -58% 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, setActive]);

  const sectionId = id === "intro" ? "top" : id;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      id={sectionId}
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </Tag>
  );
}
