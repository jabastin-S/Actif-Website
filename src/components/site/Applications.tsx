import { APPLICATION_COPY } from "@/content/site";
import type { ImageKey } from "@/content/images";
import { cn } from "@/lib/utils";
import { ClipReveal, MaskLine, Rise } from "./motion";
import { Picture } from "./Picture";

type Item = {
  id: "home" | "upholstery" | "industrial" | "medical";
  name: string;
  image: ImageKey;
  aspect: string;
  width: string;
  sizes: string;
};

const LEFT: Item[] = [
  { id: "home", name: "Home & Bedding", image: "homeInterior", aspect: "aspect-[4/5]", width: "w-full", sizes: "(min-width:1024px) 42vw, 92vw" },
  { id: "industrial", name: "Industrial & Technical Textiles", image: "knitMesh", aspect: "aspect-square", width: "w-[78%] ml-auto", sizes: "(min-width:1024px) 32vw, 72vw" },
];
const RIGHT: Item[] = [
  { id: "upholstery", name: "Upholstery", image: "upholsteryChair", aspect: "aspect-[3/2]", width: "w-full", sizes: "(min-width:1024px) 46vw, 92vw" },
  { id: "medical", name: "Medical & Healthcare Textiles", image: "medicalFolded", aspect: "aspect-[3/4]", width: "w-[64%]", sizes: "(min-width:1024px) 30vw, 60vw" },
];

function Card({ item }: { item: Item }) {
  return (
    <article className={cn("group", item.width)}>
      <a href={`#${item.id}`} className="block" aria-label={`${item.name}: see details`}>
        <ClipReveal>
          <div className={cn("relative overflow-hidden", item.aspect)}>
            <Picture
              name={item.image}
              sizes={item.sizes}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.045]"
            />
          </div>
        </ClipReveal>
        <div className="mt-5 max-w-[30rem]">
          <h3 className="display text-[clamp(1.8rem,2.6vw,2.7rem)] leading-[1.02] text-ink">
            {item.name}
          </h3>
          <p className="mt-2 text-[0.9375rem] text-ink-soft">{APPLICATION_COPY[item.id].line}</p>
          <span className="link-line mt-3 inline-block text-sm font-medium text-ink">
            See details
          </span>
        </div>
      </a>
    </article>
  );
}

/** Offset two-column masonry: unequal widths, aspect ratios and starting heights. */
export function Applications() {
  return (
    <section
      id="applications"
      aria-labelledby="applications-title"
      className="bg-linen py-[clamp(6rem,12vw,12rem)]"
    >
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="applications-title"
            className="display text-[clamp(2.6rem,7vw,6rem)] text-ink"
          >
            <MaskLine>Four applications,</MaskLine>
            <MaskLine delay={0.08}>one mill.</MaskLine>
          </h2>
          <Rise className="lg:max-w-sm">
            <p className="text-[0.9375rem] text-ink-soft">
              Home textiles are where we are most developed. Upholstery, industrial and healthcare
              programmes are developed to each customer&rsquo;s brief.
            </p>
          </Rise>
        </div>

        <div className="mt-16 grid gap-y-20 lg:mt-24 lg:grid-cols-[5fr_1fr_6fr] lg:gap-y-0">
          <div className="flex flex-col gap-24">
            {LEFT.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
          <div className="hidden lg:block" aria-hidden />
          <div className="flex flex-col gap-24 lg:mt-56">
            {RIGHT.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
