import { cn } from "@/lib/utils";

/**
 * A quiet label laid inside the bottom corner of a generated photograph. Placed next to the
 * picture, not only in the footer, so no one mistakes a room or a factory for an ACTIF site.
 */
export function ImageNote({
  className,
  text = "Illustrative image",
}: {
  className?: string;
  text?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-3 left-4 z-10 text-[0.6875rem] tracking-wide text-on-dark/85 [text-shadow:0_1px_8px_rgb(0_0_0/0.55)] md:bottom-4 md:left-6",
        className,
      )}
    >
      {text}
    </span>
  );
}
