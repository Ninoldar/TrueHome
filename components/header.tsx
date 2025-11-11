'use client'

import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()

  const handleLogoClick = () => {
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to homepage"
          >
            <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">TrueHome</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => router.push('/features')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => router.push('/benefits')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Benefits
            </button>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
