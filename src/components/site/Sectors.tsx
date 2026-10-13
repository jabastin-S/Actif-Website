import { APPLICATION_COPY, FIRST_CONVERSATION, type SectorId } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { ImageNote } from "./ImageNote";
import { Parallax } from "./motion";
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

/** Upholstery: a wide photograph first, then the words below it, set left. */
export function Upholstery() {
  return (
    <section id="upholstery" aria-labelledby="upholstery-title" className="bg-ivory">
      <div className="relative">
        <Parallax className="h-[52svh] min-h-[18rem] md:h-[64svh]" amount={6}>
          <Picture name="upholsterySofa" sizes="100vw" className="h-full w-full object-cover" />
        </Parallax>
        <ImageNote />
      </div>
      <div className="shell grid gap-10 py-[clamp(4rem,8vw,8rem)] lg:grid-cols-12 lg:gap-x-12">
        <h2
          id="upholstery-title"
          className="display text-[clamp(3rem,8vw,6rem)] text-ink lg:col-span-6"
        >
          Upholstery
        </h2>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="copy text-ink">{APPLICATION_COPY.upholstery.line}</p>
          <p className="mt-8 text-[0.9375rem] text-ink-soft">For a first conversation, bring:</p>
          <Prompts id="upholstery" className="mt-2 text-ink" />
          <Enquire id="upholstery" label="Enquire about upholstery" className="mt-8" />
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
      className="on-dark relative overflow-hidden bg-charcoal py-[clamp(5rem,10vw,10rem)] text-on-dark"
    >
      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="industrial-title" className="display text-[clamp(3rem,8vw,6rem)]">
              Industrial &amp;
              <br />
              Technical Textiles
            </h2>
            <p className="copy mt-8 text-on-dark-soft">{APPLICATION_COPY.industrial.line}</p>
          </div>
          <div className="relative lg:col-span-4 lg:col-start-9">
            <div className="aspect-square w-[62%] overflow-hidden lg:ml-auto lg:w-full">
              <Picture
                name="knitDark"
                sizes="(min-width:1024px) 28vw, 62vw"
                className="h-full w-full object-cover"
              />
            </div>
            <ImageNote className="left-3 md:left-3" />
          </div>
        </div>

        <p className="mt-14 text-[0.9375rem] text-on-dark-soft">For a first conversation, bring:</p>
        <Prompts id="industrial" className="mt-2 grid text-on-dark md:grid-cols-3 md:gap-x-10" />
        <Enquire id="industrial" label="Enquire about technical textiles" className="btn-light mt-10" />
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
      className="bg-mist py-[clamp(5rem,10vw,10rem)]"
    >
      <div className="shell flex flex-col items-center text-center">
        <div className="relative w-[min(22rem,72%)]">
          <div className="aspect-[3/4] overflow-hidden">
            <Picture name="medicalKnit" sizes="22rem" className="h-full w-full object-cover" />
          </div>
          <ImageNote className="left-3 text-ink-soft [text-shadow:none]" />
        </div>
        <h2
          id="medical-title"
          className="display mt-12 max-w-[14ch] text-[clamp(3rem,7vw,6rem)] text-ink"
        >
          Medical &amp; Healthcare Textiles
        </h2>
        <p className="copy mt-6 text-ink">{APPLICATION_COPY.medical.line}</p>
        <p className="mt-10 text-[0.9375rem] text-ink-soft">For a first conversation, bring:</p>
        <Prompts id="medical" className="mt-2 w-full max-w-[34rem] text-ink" />
        <Enquire id="medical" label="Enquire about healthcare textiles" className="mt-8" />
      </div>
    </section>
  );
}
