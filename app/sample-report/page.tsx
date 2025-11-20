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
            <div className="space-y-8">
              {/* Property Overview */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Property Overview</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">123 Main Street, Plano, TX 75023</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-medium">1995</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">Single Family Residence</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="font-medium">2,400 sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">0.25 acres (10,890 sq ft)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms / Bathrooms</p>
                    <p className="font-medium">4 bedrooms / 2.5 bathrooms</p>
                  </div>
                </div>
              </div>

              {/* Ownership History */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Ownership History</h2>
                <div className="space-y-3">
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Current Owner</p>
                        <p className="text-sm text-muted-foreground">March 2020 - Present</p>
                        <p className="text-sm text-muted-foreground mt-1">Purchase Price: $425,000</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Current</span>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4">
                    <div>
                      <p className="font-medium">Previous Owner</p>
                      <p className="text-sm text-muted-foreground">June 2015 - March 2020</p>
                      <p className="text-sm text-muted-foreground mt-1">Purchase Price: $350,000</p>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4">
                    <div>
                      <p className="font-medium">Original Owner</p>
                      <p className="text-sm text-muted-foreground">1995 - June 2015</p>
                      <p className="text-sm text-muted-foreground mt-1">Original Purchase: $185,000</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sales History */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Sales History</h2>
                <div className="space-y-3">
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">March 15, 2020</p>
                        <p className="text-sm text-muted-foreground">Sale Price: $425,000</p>
                      </div>
                      <p className="text-lg font-semibold text-primary">$425,000</p>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">June 22, 2015</p>
                        <p className="text-sm text-muted-foreground">Sale Price: $350,000</p>
                      </div>
                      <p className="text-lg font-semibold">$350,000</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Work History & Maintenance */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Work History & Maintenance</h2>
                <div className="space-y-3">
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Roof Replacement</p>
                        <p className="text-sm text-muted-foreground">March 2022</p>
                        <p className="text-sm text-muted-foreground mt-1">Complete roof replacement with 30-year warranty</p>
                      </div>
                      <p className="font-semibold">$12,500</p>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">HVAC System Update</p>
                        <p className="text-sm text-muted-foreground">August 2021</p>
                        <p className="text-sm text-muted-foreground mt-1">New central air conditioning system installed</p>
                      </div>
                      <p className="font-semibold">$8,200</p>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Kitchen Renovation</p>
                        <p className="text-sm text-muted-foreground">January 2019</p>
                        <p className="text-sm text-muted-foreground mt-1">Complete kitchen remodel with new appliances</p>
                      </div>
                      <p className="font-semibold">$28,000</p>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Plumbing Update</p>
                        <p className="text-sm text-muted-foreground">November 2018</p>
                        <p className="text-sm text-muted-foreground mt-1">Replaced main water line and updated fixtures</p>
                      </div>
                      <p className="font-semibold">$5,400</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permits */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Building Permits</h2>
                <div className="space-y-3">
                  <div className="border border-border rounded p-4">
                    <p className="font-medium">Kitchen Remodel Permit</p>
                    <p className="text-sm text-muted-foreground">Permit #2019-01234 - Issued January 2019</p>
                    <p className="text-sm text-muted-foreground mt-1">Status: Completed</p>
                  </div>
                  <div className="border border-border rounded p-4">
                    <p className="font-medium">Electrical Upgrade</p>
                    <p className="text-sm text-muted-foreground">Permit #2018-04567 - Issued March 2018</p>
                    <p className="text-sm text-muted-foreground mt-1">Status: Completed</p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Risk Assessment</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-border rounded p-4">
                    <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
                    <p className="text-3xl font-bold text-green-600">Low</p>
                    <p className="text-sm text-muted-foreground mt-2">Based on property history and maintenance records</p>
                  </div>
                  <div className="border border-border rounded p-4">
                    <p className="text-sm text-muted-foreground mb-2">Major Concerns</p>
                    <p className="text-sm">None identified</p>
                    <p className="text-sm text-muted-foreground mt-2">All major systems recently updated</p>
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

