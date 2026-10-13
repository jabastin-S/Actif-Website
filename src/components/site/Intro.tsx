import { APPLICATIONS, SPECIMENS } from "@/content/chapters";
import { COMPANY } from "@/content/site";
import { Chapter } from "@/components/stage/StageContext";
import { MaskLine } from "./motion";

export function Intro() {
  return (
    <Chapter
      id="intro"
      labelledBy="intro-title"
      className="flex min-h-[calc(100svh-var(--header-h)-var(--stage-h))] flex-col justify-between gap-12 px-[var(--gutter)] py-10 lg:min-h-[calc(100svh-var(--header-h))] lg:py-16"
    >
      <div className="max-w-[46rem]">
        <h1
          id="intro-title"
          className="display text-[clamp(2.4rem,4.1vw,4.6rem)] text-ink"
        >
          <span className="sr-only">ACTIF Global Ventures: </span>
          <MaskLine>Knitted textiles</MaskLine>
          <MaskLine delay={0.08}>for home, interiors,</MaskLine>
          <MaskLine delay={0.16}>industry and care.</MaskLine>
        </h1>
        <p className="copy mt-8 text-ink-soft">
          ACTIF develops and manufactures knitted textiles in Tiruppur, India. A unit of{" "}
          {COMPANY.parent}, with textile heritage since {COMPANY.heritageYear}.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <a href="#home" className="btn sm:min-w-64">
            Explore applications
          </a>
          <a href="#contact" className="btn-quiet w-fit">
            Start an enquiry
          </a>
        </div>
      </div>

      <nav aria-label="Applications">
        <ul className="grid max-w-[46rem] border-t border-rule sm:grid-cols-2">
          {APPLICATIONS.map((app) => (
            <li key={app.id} className="border-b border-rule sm:odd:pr-6">
              <a
                href={app.href}
                className="group flex min-h-14 items-center gap-4 py-3 text-[0.9375rem] text-ink"
              >
                <span
                  aria-hidden
                  className="block size-3 shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-150"
                  style={{ backgroundColor: SPECIMENS[app.id].chap }}
                />
                <span className="link-line">{app.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Chapter>
  );
}
