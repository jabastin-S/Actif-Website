import { IMAGES, type ImageKey } from "@/content/images";
import { cn } from "@/lib/utils";

/**
 * Responsive image from the optimised manifest (scripts/optimize-images.py): WebP srcset,
 * reserved intrinsic size (no layout shift), average-colour placeholder, lazy unless `priority`.
 */
export function Picture({
  name,
  sizes,
  alt,
  priority = false,
  className,
}: {
  name: ImageKey;
  sizes: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const image = IMAGES[name];
  const srcSet = image.files.map((file) => `${file.src} ${file.w}w`).join(", ");
  const fallback = image.files[Math.min(2, image.files.length - 1)]!;
  return (
    <img
      src={fallback.src}
      srcSet={srcSet}
      sizes={sizes}
      width={image.w}
      height={image.h}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      style={{ backgroundColor: image.color }}
      className={cn("block", className)}
    />
  );
}
