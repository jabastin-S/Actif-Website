import type { ReactNode } from "react";
import homePhoto from "@/assets/textile-hero.jpg";
import upholsteryPhoto from "@/assets/textile-dark.jpg";
import { FINISHES, RANGE, type SectorId } from "@/content/site";
import { enquiry } from "@/lib/enquiry";
import { Chapter } from "@/components/stage/StageContext";

function Enquire({ sector, label }: { sector: SectorId; label: string }) {
  return (
    <a href="#contact" onClick={() => enquiry.set(sector)} className="btn mt-10 w-full sm:w-auto sm:min-w-72">
      {label}
    </a>
  );
}

function Photo({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <img
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        loading="lazy"
        decoding="async"
        className="aspect-[3/2] w-full object-cover"
      />
      <figcaption className="mt-3 text-xs text-ink-soft">{caption}</figcaption>
    </figure>
  );
}

function FirstConversation({ prompts }: { prompts: [string, string][] }) {
  return (
    <div className="mt-12">
      <h3 className="text-sm font-medium text-ink">What to bring to a first conversation</h3>
      <ul className="mt-4 border-t border-rule">
        {prompts.map(([title, body]) => (
          <li
            key={title}
            className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
          >
            <p className="text-[0.9375rem] font-medium text-ink">{title}</p>
            <p className="text-[0.9375rem] text-ink-soft">{body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Panel({
  id,
  title,
  lead,
  children,
}: {
  id: "home" | "upholstery" | "industrial" | "medical";
  title: ReactNode;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <Chapter
      id={id}
      labelledBy={`${id}-title`}
      className="border-t border-rule px-[var(--gutter)] py-20 lg:min-h-[calc(100svh-var(--header-h))] lg:py-28"
    >
      <h2
        id={`${id}-title`}
        className="display max-w-[38rem] text-[clamp(2.2rem,4.2vw,4.4rem)] text-ink"
      >
        {title}
      </h2>
      <p className="copy mt-8 text-ink">{lead}</p>
      {children}
    </Chapter>
  );
}

export function HomeBedding() {
  return (
    <Panel
      id="home"
      title={
        <>
          <span className="block">Home &amp;</span>
          <span className="block">Bedding</span>
        </>
      }
      lead="Our most developed line: knitted bed linen for brands selling in Australia, Europe and the USA, made in the fibres each programme calls for."
    >
      <div className="mt-10">
        <Photo
          src={homePhoto}
          alt="Close view of ivory knitted fabric in soft folds"
          caption="Knitted cloth, in detail."
        />
      </div>

      <h3 className="mt-14 text-sm font-medium text-ink">The range</h3>
      <ul className="mt-4 border-t border-rule">
        {RANGE.map((item) => (
          <li
            key={item.name}
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-rule py-4"
          >
            <p className="display text-[1.5rem] leading-[1.1] text-ink">{item.name}</p>
            <p className="text-[0.9375rem] text-ink-soft">{item.fibres}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-14 text-sm font-medium text-ink">Finished to specification</h3>
      <ul className="mt-4 grid gap-x-10 border-t border-rule sm:grid-cols-2">
        {FINISHES.map((finish) => (
          <li key={finish.title} className="border-b border-rule py-4">
            <p className="text-[0.9375rem] font-medium text-ink">{finish.title}</p>
            <p className="mt-0.5 text-[0.9375rem] text-ink-soft">{finish.body}</p>
          </li>
        ))}
      </ul>

      <Enquire sector="home" label="Enquire about home & bedding" />
    </Panel>
  );
}

export function Upholstery() {
  return (
    <Panel
      id="upholstery"
      title={<span className="block">Upholstery</span>}
      lead="Knitted fabrics for seating and soft furnishings, developed with interior and upholstery businesses."
    >
      <div className="mt-10">
        <Photo
          src={upholsteryPhoto}
          alt="Close view of deep green fabric in soft folds"
          caption="Deep-coloured knitted cloth, in detail."
        />
      </div>
      <FirstConversation
        prompts={[
          ["The interior", "The furniture or space the fabric is for."],
          ["The feel and wear", "Handle, drape and the durability it must show."],
          ["The programme", "Colours, volumes and delivery timing."],
        ]}
      />
      <Enquire sector="upholstery" label="Enquire about upholstery" />
    </Panel>
  );
}

export function Industrial() {
  return (
    <Panel
      id="industrial"
      title={
        <>
          <span className="block">Industrial &amp;</span>
          <span className="block">Technical Textiles</span>
        </>
      }
      lead="Knitted fabrics engineered for functional and technical applications, developed to your performance brief."
    >
      <FirstConversation
        prompts={[
          ["The function", "What the fabric must do in use."],
          ["The conditions", "The environment and standards it must meet."],
          ["The programme", "Volumes and the delivery schedule."],
        ]}
      />
      <Enquire sector="industrial" label="Enquire about technical textiles" />
    </Panel>
  );
}

export function Medical() {
  return (
    <Panel
      id="medical"
      title={
        <>
          <span className="block">Medical &amp;</span>
          <span className="block">Healthcare Textiles</span>
        </>
      }
      lead="Knitted textiles for healthcare settings, where hygiene and consumer safety come first."
    >
      <FirstConversation
        prompts={[
          ["The setting", "Where the fabric will be used, and who it touches."],
          ["The requirements", "Hygiene, safety and regulatory needs."],
          ["The programme", "Volumes and delivery timing."],
        ]}
      />
      <Enquire sector="medical" label="Enquire about healthcare textiles" />
    </Panel>
  );
}
