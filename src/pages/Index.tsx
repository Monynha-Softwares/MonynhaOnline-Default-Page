import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const HeroSection = lazy(() =>
  import("@/components/HeroSection").then((module) => ({
    default: module.HeroSection,
  }))
);
const WhatIsSection = lazy(() =>
  import("@/components/WhatIsSection").then((module) => ({
    default: module.WhatIsSection,
  }))
);
const EcosystemSection = lazy(() =>
  import("@/components/EcosystemSection").then((module) => ({
    default: module.EcosystemSection,
  }))
);
const InfrastructureSection = lazy(() =>
  import("@/components/InfrastructureSection").then((module) => ({
    default: module.InfrastructureSection,
  }))
);

const SectionFallback = () => (
  <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-muted-foreground">
    Loading section...
  </div>
);

const Index = () => {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<SectionFallback />}>
            <HeroSection />
            <WhatIsSection />
            <EcosystemSection />
            <InfrastructureSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
