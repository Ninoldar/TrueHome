'use client'

import { Home } from "lucide-react"
import { useRouter } from "next/navigation"

export function Footer() {
  const router = useRouter()
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">TrueHome</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"Comprehensive property history reports for informed home buying decisions."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => router.push('/features')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/pricing')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/sample-report')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Sample Report
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/benefits')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Benefits
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">{"© 2025 TrueHome. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  )
}
