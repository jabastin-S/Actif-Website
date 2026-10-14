import { FIRST_CONVERSATION, SECTOR_COPY, type SectorId } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { ImageNote } from "./ImageNote";
import { ClipReveal, CourseReveal, MaskLine, Parallax } from "./motion";
import { Picture } from "./Picture";

type Id = Exclude<SectorId, "home">;

function Prompts({ id, className }: { id: Id; className?: string }) {
  return (
    <ul className={className}>
      {FIRST_CONVERSATION[id].map(([title, body]) => (
        <li key={title} className="border-t border-current/20 py-4">
          <p className="text-[0.9375rem] font-medium">{title}</p>
          <p className="mt-0.5 text-[0.9375rem] opacity-70">{body}</p>
        </li>
      ))}
    </ul>
  );
}

function Enquire({ id, label, className }: { id: Id; label: string; className?: string }) {
  return (
    <a
      href="#contact"
      onClick={() => enquiry.set(id)}
      className={`btn w-full sm:w-auto sm:min-w-72 ${className ?? ""}`}
    >
      {label}
    </a>
  );
}

/**
 * Upholstery: an inset photograph run to the right edge, with the heading laid across its pale
 * left side, so the word and the cloth share one plane. Text follows in a narrow right column.
 */
export function Upholstery() {
  return (
    <section id="upholstery" aria-labelledby="upholstery-title" className="section-y bg-stone">
      <div className="relative lg:ml-[calc(var(--gutter)+16vw)]">
        <div className="grain relative aspect-[4/3] overflow-hidden bg-sand md:aspect-[16/8]">
          <Parallax className="absolute inset-0" amount={4}>
            <Picture
              name="upholsterySofa"
              sizes="(min-width:1024px) 84vw, 100vw"
              className="h-full w-full object-cover object-[60%_center]"
            />
          </Parallax>
          <ImageNote />
        </div>
        <h2
          id="upholstery-title"
          className="display shell mt-8 text-[clamp(3.4rem,8vw,6rem)] text-ink lg:absolute lg:top-[4%] lg:left-[-16vw] lg:z-10 lg:mt-0 lg:w-auto lg:px-0"
        >
          <MaskLine>Upholstery</MaskLine>
        </h2>
      </div>
      <div className="shell grid gap-x-8 gap-y-8 pt-8 md:grid-cols-12 md:grid-rows-[auto_1fr] lg:gap-x-12 lg:pt-12">
        <div className="md:col-span-5">
          <p className="copy text-ink">{SECTOR_COPY.upholstery.lead}</p>
          <p className="mt-4 max-w-[52ch] text-[1rem] text-ink-soft">{SECTOR_COPY.upholstery.detail}</p>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:row-span-2 lg:col-span-5 lg:col-start-8">
          <p className="text-[0.9375rem] text-ink-soft">For a first conversation, bring:</p>
          <Prompts id="upholstery" className="mt-2 text-ink" />
        </div>
        <div className="md:col-span-5 md:row-start-2">
          <Enquire id="upholstery" label="Enquire about upholstery" />
        </div>
      </div>
    </section>
  );
}

/** Industrial: a dark, type-led chapter with a small knit macro and a horizontal prompt row. */
export function Industrial() {
  return (
    <section
      id="industrial"
      aria-labelledby="industrial-title"
      className="on-dark relative overflow-hidden bg-charcoal section-y text-on-dark"
    >
      <div className="shell relative">
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7">
            <h2 id="industrial-title" className="display text-[clamp(3rem,8vw,6rem)]">
              Industrial &amp;
              <br />
              Technical Textiles
            </h2>
            <p className="copy mt-8 text-on-dark">{SECTOR_COPY.industrial.lead}</p>
            <p className="mt-4 max-w-[52ch] text-[1rem] text-on-dark-soft">{SECTOR_COPY.industrial.detail}</p>
          </div>
          <div className="relative md:col-span-5 lg:col-span-4 lg:col-start-9">
            <CourseReveal className="aspect-[4/3] overflow-hidden md:aspect-square">
              <Picture
                name="knitDark"
                sizes="(min-width:1024px) 28vw, (min-width:768px) 40vw, 92vw"
                className="h-full w-full object-cover"
              />
            </CourseReveal>
            <ImageNote className="left-3 md:left-3" />
          </div>
        </div>

        <p className="mt-12 text-[0.9375rem] text-on-dark-soft">For a first conversation, bring:</p>
        <Prompts id="industrial" className="mt-2 grid text-on-dark md:grid-cols-3 md:gap-x-10" />
        <Enquire id="industrial" label="Enquire about technical textiles" className="btn-light mt-8" />
      </div>
    </section>
  );
}

/** Medical: a calm, cool, centred column, the only centred chapter on the page. */
export function Medical() {
  return (
    <section
      id="medical"
      aria-labelledby="medical-title"
      className="bg-mist section-y"
    >
      <div className="shell flex flex-col items-center text-center">
        <div className="relative w-[min(20rem,64%)]">
          <ClipReveal className="aspect-[3/4] overflow-hidden">
            <Picture name="medicalKnit" sizes="(min-width:640px) 20rem, 64vw" className="h-full w-full object-cover" />
          </ClipReveal>
          <ImageNote className="left-3 text-ink-soft [text-shadow:none]" />
        </div>
        <h2
          id="medical-title"
          className="display mt-10 max-w-[14ch] text-[clamp(3rem,7vw,6rem)] text-ink"
        >
          Medical &amp; Healthcare Textiles
        </h2>
        <p className="copy mt-6 text-ink">{SECTOR_COPY.medical.lead}</p>
        <p className="mt-4 max-w-[52ch] text-[1rem] text-ink-soft">{SECTOR_COPY.medical.detail}</p>
        <p className="mt-8 text-[0.9375rem] text-ink-soft">For a first conversation, bring:</p>
        <Prompts id="medical" className="mt-2 grid w-full max-w-[34rem] text-ink md:max-w-[60rem] md:grid-cols-3 md:gap-x-8" />
        <Enquire id="medical" label="Enquire about healthcare textiles" className="mt-8" />
      </div>
    </section>
  );
}
