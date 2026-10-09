import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/actif/Navbar";
import { Hero } from "@/components/actif/Hero";
import { Heritage } from "@/components/actif/Heritage";
import { Sectors } from "@/components/actif/Sectors";
import { HomeRange } from "@/components/actif/HomeRange";
import { Process } from "@/components/actif/Process";
import { Capacity } from "@/components/actif/Capacity";
import { Responsibility } from "@/components/actif/Responsibility";
import { Contact } from "@/components/actif/Contact";
import { Footer } from "@/components/actif/Footer";

/** Pinked seam where one swatch of ground meets the next. */
function Seam({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden
      className="selvage"
      style={{ "--from": `var(--${from})`, "--to": `var(--${to})` } as React.CSSProperties}
    />
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-greige font-sans text-ink">
      <a
        href="#heritage"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-bleach focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Seam from="indigo" to="greige" />
        <Heritage />
        <Seam from="greige" to="linen" />
        <Sectors />
        <Seam from="linen" to="bleach" />
        <HomeRange />
        <Seam from="bleach" to="indigo" />
        <Process />
        <Seam from="indigo" to="greige" />
        <Capacity />
        <Seam from="greige" to="indigo-2" />
        <Responsibility />
        <Seam from="indigo-2" to="greige" />
        <Contact />
      </main>
      <Seam from="greige" to="indigo" />
      <Footer />
    </div>
  );
}
