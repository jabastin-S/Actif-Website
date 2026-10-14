import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Statement } from "@/components/site/Statement";
import { Applications } from "@/components/site/Applications";
import { Materials } from "@/components/site/Materials";
import { HomeBedding } from "@/components/site/HomeBedding";
import { Industrial, Medical, Upholstery } from "@/components/site/Sectors";
import { Process } from "@/components/site/Process";
import { Capacity } from "@/components/site/Capacity";
import { Responsibility } from "@/components/site/Responsibility";
import { Accreditations } from "@/components/site/Accreditations";
import { Transition } from "@/components/site/Transition";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ivory focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <Applications />
        <Materials />
        <HomeBedding />
        <Upholstery />
        <Industrial />
        <Medical />
        <Process />
        <Capacity />
        <Responsibility />
        <Accreditations />
        <Transition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
