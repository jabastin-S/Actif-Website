import { createFileRoute } from "@tanstack/react-router";
import { StageProvider } from "@/components/stage/StageContext";
import { KnitStage } from "@/components/stage/KnitStage";
import { Header } from "@/components/site/Header";
import { Intro } from "@/components/site/Intro";
import { Heritage } from "@/components/site/Heritage";
import { HomeBedding, Industrial, Medical, Upholstery } from "@/components/site/Applications";
import { Capabilities } from "@/components/site/Capabilities";
import { Responsibility } from "@/components/site/Responsibility";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <StageProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-paper focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="pt-[var(--header-h)]">
        {/* One persistent specimen stage beside (desktop) or above (mobile) the chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="col-start-1 row-start-1 pt-[var(--stage-h)] lg:pt-0">
            <Intro />
            <Heritage />
            <HomeBedding />
            <Upholstery />
            <Industrial />
            <Medical />
            <Capabilities />
            <Responsibility />
          </div>
          <div className="sticky top-[var(--header-h)] z-10 col-start-1 row-start-1 h-[var(--stage-h)] self-start lg:col-start-2 lg:h-[calc(100svh-var(--header-h))]">
            <KnitStage />
          </div>
        </div>
        <Contact />
      </main>
      <Footer />
    </StageProvider>
  );
}
