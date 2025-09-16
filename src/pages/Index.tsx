import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { WhatIsSection } from "@/components/WhatIsSection";
import { EcosystemSection } from "@/components/EcosystemSection";
import { InfrastructureSection } from "@/components/InfrastructureSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <WhatIsSection />
        <EcosystemSection />
        <InfrastructureSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
