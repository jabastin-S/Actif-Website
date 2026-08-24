import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/actif/Navbar";
import { Hero } from "@/components/actif/Hero";
import { AboutSection } from "@/components/actif/AboutSection";
import { WhyActif } from "@/components/actif/WhyActif";
import { ESGSection } from "@/components/actif/ESGSection";
import { ManufacturingJourney } from "@/components/actif/ManufacturingJourney";
import { SupplyChain } from "@/components/actif/SupplyChain";
import { HygieneWellness } from "@/components/actif/HygieneWellness";
import { ValueAddedFinishes } from "@/components/actif/ValueAddedFinishes";
import { Capacity } from "@/components/actif/Capacity";
import { ProductPortfolio } from "@/components/actif/ProductPortfolio";
import { Certifications } from "@/components/actif/Certifications";
import { SDGSection } from "@/components/actif/SDGSection";
import { FinalCTA } from "@/components/actif/FinalCTA";
import { Contact } from "@/components/actif/Contact";
import { Footer } from "@/components/actif/Footer";
import { ChatbotIcon } from "@/components/actif/ChatbotIcon";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-ivory font-sans text-charcoal selection:bg-sage/40">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <WhyActif />
        <ESGSection />
        <ManufacturingJourney />
        <SupplyChain />
        <HygieneWellness />
        <ValueAddedFinishes />
        <Capacity />
        <ProductPortfolio />
        <Certifications />
        <SDGSection />
        <FinalCTA />
        <Contact />
      </main>
      <ChatbotIcon />
      <Footer />
    </div>
  );
}
