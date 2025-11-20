import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SampleReportPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Sample Report</h1>
            <p className="text-lg text-muted-foreground">
              See what a TrueHome property report looks like
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Property Overview</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">123 Main Street, Plano, TX 75023</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-medium">1995</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="font-medium">2,400 sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">0.25 acres</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Sales History</h2>
                <div className="space-y-3">
                  <div className="border border-border rounded p-4">
                    <p className="font-medium">March 2020 - $425,000</p>
                    <p className="text-sm text-muted-foreground">Previous owner</p>
                  </div>
                  <div className="border border-border rounded p-4">
                    <p className="font-medium">June 2015 - $350,000</p>
                    <p className="text-sm text-muted-foreground">Previous owner</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Work History</h2>
                <div className="space-y-3">
                  <div className="border border-border rounded p-4">
                    <p className="font-medium">Roof Replacement</p>
                    <p className="text-sm text-muted-foreground">2022 - $12,500</p>
                  </div>
                  <div className="border border-border rounded p-4">
                    <p className="font-medium">HVAC System Update</p>
                    <p className="text-sm text-muted-foreground">2021 - $8,200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/pricing">Get Your Report</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

