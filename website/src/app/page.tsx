import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { InstallSteps } from "@/components/sections/InstallSteps";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-to-content">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <InstallSteps />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
