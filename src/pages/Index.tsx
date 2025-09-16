import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { WhatIsSection } from "@/components/WhatIsSection";
import { EcosystemSection } from "@/components/EcosystemSection";
import { InfrastructureSection } from "@/components/InfrastructureSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <WhatIsSection />
          <EcosystemSection />
          <InfrastructureSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
