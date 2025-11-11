import { LandingHero } from "../components/landing-hero"
import { LandingFeatures } from "../components/landing-features"
import { LandingHowItWorks } from "../components/landing-how-it-works"
import { LandingSocialProof } from "../components/landing-social-proof"
import { LandingCTA } from "../components/landing-cta"
import { LandingHeader } from "../components/landing-header"
import { LandingFooter } from "../components/landing-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingSocialProof />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
