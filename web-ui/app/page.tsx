"use client";

import {
	Nav,
	Hero,
	ComparisonTable,
	AIEnhancements,
	RecordingFeatures,
	FinishingTools,
	PricingSection,
	FAQ,
	FinalCTA,
	Footer,
	PageDirectory,
} from "@/components";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-[#f3eee0]">
      <div className="grain">
        <Nav />
        <Hero />
        <ComparisonTable />
        <AIEnhancements />
        <RecordingFeatures />
        <FinishingTools />
        <PricingSection />
        <FAQ />
        <PageDirectory />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
