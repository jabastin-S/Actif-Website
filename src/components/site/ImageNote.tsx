import { cn } from "@/lib/utils";

/**
 * Credit line for a generated photograph, set vertically along the image edge like a print
 * credit. Kept beside the picture (not only in the footer) so no one mistakes a room or a
 * factory for an ACTIF site. `tone="ink"` is for light photographs.
 */
export function ImageNote({
  className,
  text = "Illustrative image",
  tone = "light",
}: {
  className?: string;
  text?: string;
  tone?: "light" | "ink";
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-2.5 bottom-3 z-10 rotate-180 text-[0.75rem] leading-none tracking-[0.06em] [writing-mode:vertical-rl] md:right-3 md:bottom-4",
        tone === "light"
          ? "text-on-dark/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.5)]"
          : "text-ink/75",
        className,
      )}
    >
      {text}
    </span>
  );
}
