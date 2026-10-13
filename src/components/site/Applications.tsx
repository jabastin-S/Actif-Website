import { APPLICATION_COPY } from "@/content/site";
import type { ImageKey } from "@/content/images";
import { cn } from "@/lib/utils";
import { ClipReveal } from "./motion";
import { Picture } from "./Picture";

type Item = {
  id: "home" | "upholstery" | "industrial" | "medical";
  name: string;
  image: ImageKey;
  /** grid placement (12 columns on large screens) and picture shape */
  place: string;
  shape: string;
  sizes: string;
  focus?: string;
};

/** Wide, narrow / narrow, wide: each row is a different proportion, lined up on a common base. */
const ITEMS: Item[] = [
  { id: "home", name: "Home & Bedding", image: "homeKnit", place: "md:col-span-7", shape: "aspect-[4/3]", sizes: "(min-width:768px) 56vw, 92vw" },
  { id: "upholstery", name: "Upholstery", image: "upholsteryChair", place: "md:col-span-5", shape: "aspect-square md:aspect-[4/5]", sizes: "(min-width:768px) 40vw, 92vw", focus: "object-[42%_center]" },
  { id: "industrial", name: "Industrial & Technical Textiles", image: "knitMesh", place: "md:col-span-5", shape: "aspect-square md:aspect-[4/5]", sizes: "(min-width:768px) 40vw, 92vw" },
  { id: "medical", name: "Medical & Healthcare Textiles", image: "medicalFolded", place: "md:col-span-7", shape: "aspect-[4/3]", sizes: "(min-width:768px) 56vw, 92vw" },
];

function Card({ item }: { item: Item }) {
  return (
    <article className={cn("group", item.place)}>
      <a href={`#${item.id}`} className="block" aria-label={`${item.name}: see details`}>
        <ClipReveal>
          <div className={cn("grain relative overflow-hidden bg-stone", item.shape)}>
            <Picture
              name={item.image}
              sizes={item.sizes}
              className={cn(
                "h-full w-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-out)] group-hover:scale-[1.035]",
                item.focus,
              )}
            />
          </div>
        </ClipReveal>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <h3 className="display text-[clamp(1.9rem,2.8vw,2.8rem)] leading-[1.02] text-ink">
            {item.name}
          </h3>
          <span className="link-line text-sm font-medium text-ink">See details</span>
        </div>
        <p className="mt-2 max-w-[44ch] text-[1rem] text-ink-soft">{APPLICATION_COPY[item.id].line}</p>
      </a>
    </article>
  );
}

export function Applications() {
  return (
    <section
      id="applications"
      aria-labelledby="applications-title"
      className="section-y bg-linen"
    >
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="applications-title"
            className="display text-[clamp(2.6rem,6.4vw,5.6rem)] text-ink"
          >
            Four applications,
            <br />
            <em>one</em> mill.
          </h2>
          <div className="lg:max-w-sm">
            <p className="text-[1rem] text-ink-soft">
              Home textiles are where we are most developed. Upholstery, industrial and healthcare
              programmes are developed to each customer&rsquo;s brief.
            </p>
            <p className="mt-3 text-xs text-ink-soft">Photographs on this page are illustrative.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-12 md:items-end lg:mt-14 lg:gap-x-10 lg:gap-y-16">
          {ITEMS.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
