import { PropertyHero } from "../../components/property-hero"
import { PropertyTimeline } from "../../components/property-timeline"
import { PropertyStats } from "../../components/property-stats"
import { PropertyDetails } from "../../components/property-details"
import { PropertyOwnership } from "../components/property-ownership"
import { PropertyPermits } from "../components/property-permits"
import { PropertyComps } from "../components/property-comps"

export default function PropertyReportPage() {
  return (
    <main className="min-h-screen bg-background">
      <PropertyHero />
      <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8 lg:space-y-12">
        <PropertyStats />
        <PropertyTimeline />
        <PropertyDetails />
        <PropertyOwnership />
        <PropertyPermits />
        <PropertyComps />
      </div>
    </main>
  )
}
