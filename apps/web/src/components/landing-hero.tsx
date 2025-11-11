import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import PropertySearch from "./PropertySearch"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Know your home's <span className="text-primary">complete history</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl text-pretty">
              TrueHome reveals everything about a property's past before you buy. Make confident home buying decisions
              with comprehensive property reports covering ownership, repairs, permits, and more.
            </p>
          </div>

          <div className="mx-auto max-w-xl space-y-4">
            {/* PropertySearch component with autocomplete and search functionality */}
            <PropertySearch />
            <p className="text-sm text-muted-foreground">Try it free • 1.2M+ reports generated</p>
          </div>

          <div className="pt-8">
            <Link
              href="/report"
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              View sample report
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
    </section>
  )
}
