'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const router = useRouter()
  
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Single Report</h3>
              <div className="text-4xl font-bold mb-4">$49.99</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>1 Property Report</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Complete History</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>PDF Download</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" onClick={() => router.push('/signup')}>
                Get Started
              </Button>
            </div>
            
            <div className="bg-card border-2 border-primary rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">3 Reports</h3>
              <div className="text-4xl font-bold mb-4">$129.99</div>
              <div className="text-sm text-muted-foreground mb-4">Save $20</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>3 Property Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Complete History</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>PDF Downloads</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" onClick={() => router.push('/signup')}>
                Get Started
              </Button>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">10 Reports</h3>
              <div className="text-4xl font-bold mb-4">$399.99</div>
              <div className="text-sm text-muted-foreground mb-4">Save $100</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>10 Property Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Complete History</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>PDF Downloads</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" onClick={() => router.push('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

